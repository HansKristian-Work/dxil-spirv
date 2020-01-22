/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 */

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <vector>
#include <algorithm>

#include "dxil_spirv_c.h"

#include "spirv-tools/libspirv.hpp"
#include "spirv_cross_c.h"
#include "logging.hpp"
#include "cli_parser.hpp"

using namespace DXIL2SPIRV;

static std::string convert_to_asm(const void *code, size_t size)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("SPIRV-Tools message: %s\n", message);
	});

	std::string str;
	if (!tools.Disassemble(static_cast<const uint32_t *>(code), size / sizeof(uint32_t), &str, 0))
		return "";
	else
		return str;
}

static bool validate_spirv(const void *code, size_t size)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("SPIRV-Tools message: %s\n", message);
	});

	return tools.Validate(static_cast<const uint32_t *>(code), size / sizeof(uint32_t));
}

static std::string convert_to_glsl(const void *code, size_t size)
{
	std::string ret;
	spvc_context context;
	if (spvc_context_create(&context) != SPVC_SUCCESS)
		return ret;

	spvc_parsed_ir ir;
	if (spvc_context_parse_spirv(context, static_cast<const SpvId *>(code), size / sizeof(uint32_t), &ir) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler compiler;
	if (spvc_context_create_compiler(context, SPVC_BACKEND_GLSL, ir, SPVC_CAPTURE_MODE_TAKE_OWNERSHIP, &compiler) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler_options opts;
	if (spvc_compiler_create_compiler_options(compiler, &opts) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler_options_set_bool(opts, SPVC_COMPILER_OPTION_GLSL_ES, SPVC_FALSE);
	spvc_compiler_options_set_uint(opts, SPVC_COMPILER_OPTION_GLSL_VERSION, 460);
	spvc_compiler_options_set_bool(opts, SPVC_COMPILER_OPTION_GLSL_VULKAN_SEMANTICS, SPVC_TRUE);
	spvc_compiler_install_compiler_options(compiler, opts);

	const char *source;
	if (spvc_compiler_compile(compiler, &source) != SPVC_SUCCESS)
		goto cleanup;

	ret = source;

cleanup:
	spvc_context_destroy(context);
	return ret;
}

static std::vector<uint8_t> read_file(const char *path)
{
	FILE *file = fopen(path, "rb");
	if (!file)
		return {};

	fseek(file, 0, SEEK_END);
	auto len = ftell(file);
	rewind(file);
	std::vector<uint8_t> result(len);
	if (fread(result.data(), 1, len, file) != size_t(len))
	{
		fclose(file);
		return {};
	}

	fclose(file);
	return result;
}

static void print_help()
{
	LOGE("Usage: dxil-spirv <input path>\n"
	     "\t[--output <path>]\n"
	     "\t[--glsl]\n"
	     "\t[--validate]\n"
	     "\t[--glsl-embed-asm]\n"
	     "\t[--root-constant space binding word_offset word_count]\n"
	     "\t[--vertex-input semantic location]\n"
	     "\t[--stream-output semantic index offset stride buffer-index]\n");
}

struct Arguments
{
	std::string input_path;
	std::string output_path;
	bool dump_module = false;
	bool glsl = false;
	bool validate = false;
	bool glsl_embed_asm = false;
};

struct Remapper
{
	struct RootConstant
	{
		unsigned register_space;
		unsigned register_index;
		unsigned word_offset;
	};
	std::vector<RootConstant> root_constants;
	unsigned root_constant_word_count = 0;

	struct VertexInput
	{
		std::string semantic;
		unsigned index;
	};
	std::vector<VertexInput> vertex_inputs;

	struct StreamOutput
	{
		std::string semantic;
		unsigned index;

		unsigned offset;
		unsigned stride;
		unsigned buffer_index;
	};
	std::vector<StreamOutput> stream_outputs;
};

static dxil_spv_bool remap_cbv(void *userdata, const dxil_spv_d3d_binding *binding, dxil_spv_cbv_vulkan_binding *vk_binding)
{
	auto *remapper = static_cast<Remapper *>(userdata);
	*vk_binding = {};

	auto itr = std::find_if(remapper->root_constants.begin(), remapper->root_constants.end(), [&](const Remapper::RootConstant &root) {
		return root.register_space == binding->register_space && root.register_index == binding->register_index;
	});

	if (itr != remapper->root_constants.end())
	{
		vk_binding->push_constant = DXIL_SPV_TRUE;
		vk_binding->vulkan.push_constant.offset_in_words = itr->word_offset;
	}
	else
	{
		vk_binding->vulkan.uniform_binding.bindless.use_heap = DXIL_SPV_FALSE;
		vk_binding->vulkan.uniform_binding.set = binding->register_space;
		vk_binding->vulkan.uniform_binding.binding = binding->register_index;
	}
	return DXIL_SPV_TRUE;
}

static dxil_spv_bool remap_vertex_input(void *userdata, const dxil_spv_d3d_vertex_input *d3d_input,
                                        dxil_spv_vulkan_vertex_input *vk_input)
{
	auto *remapper = static_cast<Remapper *>(userdata);

	auto itr = std::find_if(remapper->vertex_inputs.begin(), remapper->vertex_inputs.end(), [&](const Remapper::VertexInput &vin) {
		return vin.semantic == d3d_input->semantic;
	});

	if (itr != remapper->vertex_inputs.end())
	{
		vk_input->location = itr->index + d3d_input->semantic_index;
	}
	else
	{
		vk_input->location = d3d_input->start_row;
	}

	return DXIL_SPV_TRUE;
}

static dxil_spv_bool remap_stream_output(void *userdata, const dxil_spv_d3d_stream_output *d3d_output,
                                         dxil_spv_vulkan_stream_output *vk_output)
{
	auto *remapper = static_cast<Remapper *>(userdata);

	auto itr = std::find_if(remapper->stream_outputs.begin(), remapper->stream_outputs.end(), [&](const Remapper::StreamOutput &vin) {
		return strcasecmp(vin.semantic.c_str(), d3d_output->semantic) == 0 && vin.index == d3d_output->semantic_index;
	});

	if (itr != remapper->stream_outputs.end())
	{
		vk_output->enable = DXIL_SPV_TRUE;
		vk_output->offset = itr->offset;
		vk_output->stride = itr->stride;
		vk_output->buffer_index = itr->buffer_index;
	}
	else
	{
		*vk_output = {};
	}

	return DXIL_SPV_TRUE;
}

int main(int argc, char **argv)
{
	Arguments args;
	Remapper remapper;

	CLICallbacks cbs;
	cbs.add("--help", [](CLIParser &parser) {
		print_help();
		parser.end();
	});
	cbs.add("--dump-module", [&](CLIParser &) { args.dump_module = true; });
	cbs.add("--glsl-embed-asm", [&](CLIParser &) { args.glsl_embed_asm = true; });
	cbs.add("--glsl", [&](CLIParser &) { args.glsl = true; });
	cbs.add("--validate", [&](CLIParser &) { args.validate = true; });
	cbs.add("--output", [&](CLIParser &parser) { args.output_path = parser.next_string(); });
	cbs.add("--root-constant", [&](CLIParser &parser) {
		Remapper::RootConstant root = {};
		root.register_space = parser.next_uint();
		root.register_index = parser.next_uint();
		root.word_offset = parser.next_uint();
		unsigned word_count = parser.next_uint();
		remapper.root_constant_word_count = std::max(remapper.root_constant_word_count, word_count + root.word_offset);
		remapper.root_constants.push_back(root);
	});
	cbs.add("--vertex-input", [&](CLIParser &parser) {
		const char *sem = parser.next_string();
		unsigned loc = parser.next_uint();
		remapper.vertex_inputs.push_back({ std::string(sem), loc });
	});
	cbs.add("--stream-output", [&](CLIParser &parser) {
		const char *sem = parser.next_string();
		unsigned index = parser.next_uint();

		unsigned offset = parser.next_uint();
		unsigned stride = parser.next_uint();
		unsigned buffer_index = parser.next_uint();
		remapper.stream_outputs.push_back({ std::string(sem), index, offset, stride, buffer_index });
	});
	cbs.error_handler = [] { print_help(); };
	cbs.default_handler = [&](const char *arg) { args.input_path = arg; };
	CLIParser cli_parser(std::move(cbs), argc - 1, argv + 1);
	if (!cli_parser.parse())
		return EXIT_FAILURE;
	else if (cli_parser.is_ended_state())
		return EXIT_SUCCESS;

	if (args.input_path.empty())
	{
		LOGE("No input file.\n");
		print_help();
		return EXIT_FAILURE;
	}

	auto binary = read_file(args.input_path.c_str());
	if (binary.empty())
	{
		LOGE("Failed to load file: %s\n", args.input_path.c_str());
		return EXIT_FAILURE;
	}

	dxil_spv_parsed_blob blob;
	if (dxil_spv_parse_dxil_blob(binary.data(), binary.size(), &blob) != DXIL_SPV_SUCCESS)
	{
		LOGE("Failed to parse blob.\n");
		return EXIT_FAILURE;
	}

	if (args.dump_module)
		dxil_spv_parsed_blob_dump_llvm_ir(blob);

	std::string llvm_asm_string;
	if (args.glsl_embed_asm)
	{
		const char *str;
		if (dxil_spv_parsed_blob_get_disassembled_ir(blob, &str) != DXIL_SPV_SUCCESS)
			return EXIT_FAILURE;
		llvm_asm_string = str;
	}

	dxil_spv_converter converter;
	if (dxil_spv_create_converter(blob, &converter) != DXIL_SPV_SUCCESS)
		return EXIT_FAILURE;

	dxil_spv_converter_set_cbv_remapper(converter, remap_cbv, &remapper);
	dxil_spv_converter_set_vertex_input_remapper(converter, remap_vertex_input, &remapper);
	dxil_spv_converter_set_stream_output_remapper(converter, remap_stream_output, &remapper);
	dxil_spv_converter_set_root_constant_word_count(converter, remapper.root_constant_word_count);

	if (dxil_spv_converter_run(converter) != DXIL_SPV_SUCCESS)
	{
		LOGE("Failed to convert DXIL to SPIR-V.\n");
		return EXIT_FAILURE;
	}

	dxil_spv_compiled_spirv compiled;
	if (dxil_spv_converter_get_compiled_spirv(converter, &compiled) != DXIL_SPV_SUCCESS)
		return EXIT_FAILURE;

	if (args.validate)
	{
		if (!validate_spirv(compiled.data, compiled.size))
		{
			LOGE("Failed to validate SPIR-V.\n");
			return EXIT_FAILURE;
		}
	}

	std::string spirv_asm_string;
	if (args.glsl_embed_asm)
		spirv_asm_string = convert_to_asm(compiled.data, compiled.size);

	if (args.glsl)
	{
		auto glsl = convert_to_glsl(compiled.data, compiled.size);
		if (glsl.empty())
		{
			LOGE("Failed to convert to GLSL.\n");
			return EXIT_FAILURE;
		}

		if (!llvm_asm_string.empty())
		{
			glsl += "\n#if 0\n";
			glsl += "// LLVM disassembly\n";
			glsl += llvm_asm_string;
			glsl += "#endif";
		}

		if (!spirv_asm_string.empty())
		{
			glsl += "\n#if 0\n";
			glsl += "// SPIR-V disassembly\n";
			glsl += spirv_asm_string;
			glsl += "#endif";
		}

		if (args.output_path.empty())
		{
			printf("%s\n", glsl.c_str());
		}
		else
		{
			FILE *file = fopen(args.output_path.c_str(), "w");
			if (!file)
			{
				LOGE("Failed to open %s for writing.\n", args.output_path.c_str());
				return EXIT_FAILURE;
			}
			fprintf(file, "%s\n", glsl.c_str());
			fclose(file);
		}
	}
	else
	{
		if (args.output_path.empty())
		{
			auto assembly = convert_to_asm(compiled.data, compiled.size);
			if (assembly.empty())
			{
				LOGE("Failed to convert to SPIR-V asm.\n");
				return EXIT_FAILURE;
			}
			printf("%s\n", assembly.c_str());
		}
		else
		{
			FILE *file = fopen(args.output_path.c_str(), "wb");
			if (fwrite(compiled.data, 1, compiled.size, file) != compiled.size)
			{
				LOGE("Failed to write SPIR-V.\n");
				return EXIT_FAILURE;
			}
			fclose(file);
		}
	}

	dxil_spv_converter_free(converter);
	dxil_spv_parsed_blob_free(blob);
	return EXIT_SUCCESS;
}