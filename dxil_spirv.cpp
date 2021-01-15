/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
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

#include <algorithm>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <vector>

#include "dxil_spirv_c.h"

#include "cli_parser.hpp"
#include "logging.hpp"
#include "spirv-tools/libspirv.hpp"
#include "spirv_cross_c.h"

using namespace dxil_spv;

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
	if (spvc_context_parse_spirv(context, static_cast<const SpvId *>(code), size / sizeof(uint32_t), &ir) !=
	    SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler compiler;
	if (spvc_context_create_compiler(context, SPVC_BACKEND_GLSL, ir, SPVC_CAPTURE_MODE_TAKE_OWNERSHIP, &compiler) !=
	    SPVC_SUCCESS)
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
	     "\t[--root-constant-inline-ubo set binding]\n"
	     "\t[--vertex-input semantic location]\n"
	     "\t[--stream-output semantic index offset stride buffer-index]\n"
	     "\t[--enable-shader-demote]\n"
	     "\t[--enable-dual-source-blending]\n"
	     "\t[--bindless]\n"
	     "\t[--no-bda]\n"
	     "\t[--local-root-signature]\n"
	     "\t[--bindless-cbv-as-ssbo]\n"
	     "\t[--ssbo-uav]\n"
	     "\t[--ssbo-srv]\n"
	     "\t[--ssbo-alignment <align>]\n"
	     "\t[--typed-uav-read-without-format]\n"
	     "\t[--bindless-typed-buffer-offsets]\n"
	     "\t[--output-rt-swizzle index xyzw]\n"
	     "\t[--bindless-offset-buffer-layout <untyped offset> <typed offset> <stride>]\n"
	     "\t[--root-descriptor <cbv/uav/srv> <space> <register>]\n");
}

struct Arguments
{
	std::string input_path;
	std::string output_path;
	bool dump_module = false;
	bool glsl = false;
	bool validate = false;
	bool glsl_embed_asm = false;
	bool shader_demote = false;
	bool dual_source_blending = false;
	std::vector<unsigned> swizzles;

	unsigned root_constant_inline_ubo_desc_set = 0;
	unsigned root_constant_inline_ubo_binding = 0;
	bool root_constant_inline_ubo = false;
	bool bindless_cbv_as_ssbo = false;
	bool typed_uav_read_without_format = false;
	bool bindless_typed_buffer_offsets = false;

	unsigned ssbo_alignment = 1;

	dxil_spv_option_bindless_offset_buffer_layout offset_buffer_layout;
};

struct Remapper
{
	struct RootConstant
	{
		unsigned register_space;
		unsigned register_index;
		unsigned word_offset;
	};

	struct RootDescriptor
	{
		dxil_spv_resource_class resource_class;
		uint32_t space;
		uint32_t register_index;
	};

	std::vector<RootConstant> root_constants;
	unsigned root_constant_word_count = 0;

	std::vector<RootDescriptor> root_descriptors;

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
	bool bindless = false;
	bool bda = true;

	bool ssbo_uav = false;
	bool ssbo_srv = false;
};

static bool kind_is_buffer(dxil_spv_resource_kind kind)
{
	return kind == DXIL_SPV_RESOURCE_KIND_RAW_BUFFER || kind == DXIL_SPV_RESOURCE_KIND_STRUCTURED_BUFFER ||
	       kind == DXIL_SPV_RESOURCE_KIND_TYPED_BUFFER;
}

static int32_t find_root_descriptor_index(const Remapper *remapper, const dxil_spv_d3d_binding *binding,
                                          dxil_spv_resource_class resource_class)
{
	auto itr = std::find_if(remapper->root_descriptors.begin(), remapper->root_descriptors.end(),
	                        [&](const Remapper::RootDescriptor &desc)
	                        {
	                          return desc.resource_class == resource_class &&
	                                 desc.space == binding->register_space &&
	                                 desc.register_index == binding->register_index;
	                        });

	if (itr != remapper->root_descriptors.end())
		return int32_t(itr - remapper->root_descriptors.begin());
	else
		return -1;
}

static dxil_spv_bool remap_srv(void *userdata, const dxil_spv_d3d_binding *binding, dxil_spv_srv_vulkan_binding *vk_binding)
{
	auto *remapper = static_cast<Remapper *>(userdata);
	*vk_binding = {};

	int32_t desc_index = find_root_descriptor_index(remapper, binding, DXIL_SPV_RESOURCE_CLASS_SRV);
	if (desc_index >= 0)
	{
		vk_binding->buffer_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_BUFFER_DEVICE_ADDRESS;
		vk_binding->buffer_binding.root_constant_index = uint32_t(desc_index);
	}
	else
	{
		if (remapper->bindless)
		{
			vk_binding->buffer_binding.bindless.use_heap = DXIL_SPV_TRUE;
			vk_binding->buffer_binding.bindless.heap_root_offset = binding->register_index;
			vk_binding->buffer_binding.root_constant_index = kind_is_buffer(binding->kind) ? 1 : 0;
			vk_binding->buffer_binding.set = kind_is_buffer(binding->kind) ? 1 : 0;
			vk_binding->buffer_binding.binding = 0;
		}
		else
		{
			vk_binding->buffer_binding.bindless.use_heap = DXIL_SPV_FALSE;
			vk_binding->buffer_binding.set = binding->register_space;
			vk_binding->buffer_binding.binding = binding->register_index;
		}

		if (remapper->ssbo_srv)
		{
			if (binding->kind == DXIL_SPV_RESOURCE_KIND_STRUCTURED_BUFFER ||
			    binding->kind == DXIL_SPV_RESOURCE_KIND_RAW_BUFFER)
			{
				vk_binding->buffer_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_SSBO;
				vk_binding->offset_binding.set = 15;
				vk_binding->offset_binding.binding = 0;
			}
		}
	}

	return DXIL_SPV_TRUE;
}

static dxil_spv_bool remap_sampler(void *userdata, const dxil_spv_d3d_binding *binding,
                                   dxil_spv_vulkan_binding *vk_binding)
{
	auto *remapper = static_cast<Remapper *>(userdata);
	*vk_binding = {};

	if (remapper->bindless)
	{
		vk_binding->bindless.use_heap = DXIL_SPV_TRUE;
		vk_binding->bindless.heap_root_offset = binding->register_index;
		vk_binding->root_constant_index = 2;
		vk_binding->set = 2;
		vk_binding->binding = 0;
	}
	else
	{
		vk_binding->bindless.use_heap = DXIL_SPV_FALSE;
		vk_binding->set = binding->register_space;
		vk_binding->binding = binding->register_index;
	}
	return DXIL_SPV_TRUE;
}

static dxil_spv_bool remap_uav(void *userdata, const dxil_spv_uav_d3d_binding *binding,
                               dxil_spv_uav_vulkan_binding *vk_binding)
{
	auto *remapper = static_cast<Remapper *>(userdata);
	*vk_binding = {};

	int32_t desc_index = find_root_descriptor_index(remapper, &binding->d3d_binding, DXIL_SPV_RESOURCE_CLASS_UAV);
	if (desc_index >= 0)
	{
		vk_binding->buffer_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_BUFFER_DEVICE_ADDRESS;
		vk_binding->buffer_binding.root_constant_index = uint32_t(desc_index);
	}
	else
	{
		if (remapper->bindless)
		{
			vk_binding->buffer_binding.bindless.use_heap = DXIL_SPV_TRUE;
			vk_binding->buffer_binding.bindless.heap_root_offset = binding->d3d_binding.register_index;
			vk_binding->buffer_binding.root_constant_index = kind_is_buffer(binding->d3d_binding.kind) ? 4 : 3;
			vk_binding->buffer_binding.set = kind_is_buffer(binding->d3d_binding.kind) ? 4 : 3;
			vk_binding->buffer_binding.binding = 0;
		}
		else
		{
			vk_binding->buffer_binding.bindless.use_heap = DXIL_SPV_FALSE;
			vk_binding->buffer_binding.set = binding->d3d_binding.register_space;
			vk_binding->buffer_binding.binding = binding->d3d_binding.register_index;
		}

		if (remapper->ssbo_uav)
		{
			if (binding->d3d_binding.kind == DXIL_SPV_RESOURCE_KIND_STRUCTURED_BUFFER ||
			    binding->d3d_binding.kind == DXIL_SPV_RESOURCE_KIND_RAW_BUFFER)
			{
				vk_binding->buffer_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_SSBO;
				vk_binding->offset_binding.set = 15;
				vk_binding->offset_binding.binding = 0;
			}
		}

		if (binding->has_counter)
		{
			if (remapper->bindless)
			{
				vk_binding->counter_binding.bindless.use_heap = DXIL_SPV_TRUE;
				vk_binding->counter_binding.root_constant_index = 4;
				vk_binding->counter_binding.bindless.heap_root_offset = binding->d3d_binding.register_index;
				vk_binding->counter_binding.set = 7;
				vk_binding->counter_binding.binding = 0;
			}
			else
			{
				vk_binding->counter_binding.bindless.use_heap = DXIL_SPV_FALSE;
				vk_binding->counter_binding.set = 7;
				vk_binding->counter_binding.binding = binding->d3d_binding.resource_index;
			}
		}
	}

	return DXIL_SPV_TRUE;
}

static dxil_spv_bool remap_cbv(void *userdata, const dxil_spv_d3d_binding *binding,
                               dxil_spv_cbv_vulkan_binding *vk_binding)
{
	auto *remapper = static_cast<Remapper *>(userdata);
	*vk_binding = {};

	int32_t desc_index = find_root_descriptor_index(remapper, binding, DXIL_SPV_RESOURCE_CLASS_CBV);
	if (desc_index >= 0)
	{
		vk_binding->push_constant = DXIL_SPV_FALSE;
		vk_binding->vulkan.uniform_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_BUFFER_DEVICE_ADDRESS;
		vk_binding->vulkan.uniform_binding.root_constant_index = uint32_t(desc_index);
	}
	else
	{
		auto itr = std::find_if(
		    remapper->root_constants.begin(), remapper->root_constants.end(), [&](const Remapper::RootConstant &root) {
			    return root.register_space == binding->register_space && root.register_index == binding->register_index;
		    });

		if (itr != remapper->root_constants.end())
		{
			vk_binding->push_constant = DXIL_SPV_TRUE;
			vk_binding->vulkan.push_constant.offset_in_words = itr->word_offset;
		}
		else
		{
			if (remapper->bindless)
			{
				vk_binding->vulkan.uniform_binding.bindless.use_heap = DXIL_SPV_TRUE;
				vk_binding->vulkan.uniform_binding.bindless.heap_root_offset = binding->register_index;
				vk_binding->vulkan.uniform_binding.root_constant_index = 5;
				vk_binding->vulkan.uniform_binding.set = 5;
				vk_binding->vulkan.uniform_binding.binding = 0;
			}
			else
			{

				vk_binding->vulkan.uniform_binding.bindless.use_heap = DXIL_SPV_FALSE;
				vk_binding->vulkan.uniform_binding.set = binding->register_space;
				vk_binding->vulkan.uniform_binding.binding = binding->register_index;
			}
		}
	}

	return DXIL_SPV_TRUE;
}

static dxil_spv_bool remap_vertex_input(void *userdata, const dxil_spv_d3d_vertex_input *d3d_input,
                                        dxil_spv_vulkan_vertex_input *vk_input)
{
	auto *remapper = static_cast<Remapper *>(userdata);

	auto itr = std::find_if(remapper->vertex_inputs.begin(), remapper->vertex_inputs.end(),
	                        [&](const Remapper::VertexInput &vin) { return vin.semantic == d3d_input->semantic; });

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

#ifdef _MSC_VER
#define strcasecmp _stricmp
#endif

static dxil_spv_bool remap_stream_output(void *userdata, const dxil_spv_d3d_stream_output *d3d_output,
                                         dxil_spv_vulkan_stream_output *vk_output)
{
	auto *remapper = static_cast<Remapper *>(userdata);

	auto itr = std::find_if(remapper->stream_outputs.begin(), remapper->stream_outputs.end(),
	                        [&](const Remapper::StreamOutput &vin) {
		                        return strcasecmp(vin.semantic.c_str(), d3d_output->semantic) == 0 &&
		                               vin.index == d3d_output->semantic_index;
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
	bool local_root_signature = false;
	dxil_spv_begin_thread_allocator_context();

	args.offset_buffer_layout.base.type = DXIL_SPV_OPTION_BINDLESS_OFFSET_BUFFER_LAYOUT;
	args.offset_buffer_layout.untyped_offset = 0;
	args.offset_buffer_layout.typed_offset = 0;
	args.offset_buffer_layout.stride = 1;

	// Begin with identity swizzles.
	args.swizzles.resize(8, 0 | (1 << 2) | (2 << 4) | (3 << 6));

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
	cbs.add("--enable-shader-demote", [&](CLIParser &) { args.shader_demote = true; });
	cbs.add("--enable-dual-source-blending", [&](CLIParser &) { args.dual_source_blending = true; });
	cbs.add("--bindless", [&](CLIParser &) {
		remapper.bindless = true;
		remapper.root_constant_word_count = std::max(remapper.root_constant_word_count, 8u);
	});
	cbs.add("--no-bda", [&](CLIParser &) {
		remapper.bda = false;
	});
	cbs.add("--local-root-signature", [&](CLIParser &) {
		local_root_signature = true;
	});
	cbs.add("--root-descriptor", [&](CLIParser &parser) {
		const char *tag = parser.next_string();
		uint32_t space = parser.next_uint();
		uint32_t register_index = parser.next_uint();
		dxil_spv_resource_class resource_class;
		if (!strcmp(tag, "cbv"))
			resource_class = DXIL_SPV_RESOURCE_CLASS_CBV;
		else if (!strcmp(tag, "uav"))
			resource_class = DXIL_SPV_RESOURCE_CLASS_UAV;
		else if (!strcmp(tag, "srv"))
			resource_class = DXIL_SPV_RESOURCE_CLASS_SRV;
		else
		{
			LOGE("Invalid resource class %s, ignoring.\n", tag);
			return;
		}

		remapper.root_descriptors.push_back({ resource_class, space, register_index });
	});
	cbs.add("--output-rt-swizzle", [&](CLIParser &parser) {
		unsigned index = parser.next_uint();
		if (index >= args.swizzles.size())
		{
			LOGE("RT index out of range.\n");
			print_help();
			parser.end();
			return;
		}

		const char *arg = parser.next_string();
		if (strlen(arg) != 4)
		{
			LOGE("RT swizzle must be 4 characters (x, y, z, w).\n");
			print_help();
			parser.end();
			return;
		}

		auto &swiz = args.swizzles[index];
		swiz = 0;

		for (unsigned c = 0; c < 4; c++)
		{
			switch (arg[c])
			{
			case 'x':
			case 'X':
			case 'r':
			case 'R':
				swiz |= 0 << (2 * c);
				break;

			case 'y':
			case 'Y':
			case 'g':
			case 'G':
				swiz |= 1 << (2 * c);
				break;

			case 'z':
			case 'Z':
			case 'b':
			case 'B':
				swiz |= 2 << (2 * c);
				break;

			case 'w':
			case 'W':
			case 'a':
			case 'A':
				swiz |= 3 << (2 * c);
				break;

			default:
				LOGE("Invalid swizzle character %c.\n", arg[c]);
				print_help();
				parser.end();
				return;
			}
		}
	});
	cbs.add("--root-constant-inline-ubo", [&](CLIParser &parser) {
		args.root_constant_inline_ubo_desc_set = parser.next_uint();
		args.root_constant_inline_ubo_binding = parser.next_uint();
		args.root_constant_inline_ubo = true;
	});
	cbs.add("--bindless-cbv-as-ssbo", [&](CLIParser &) { args.bindless_cbv_as_ssbo = true; });
	cbs.add("--ssbo-uav", [&](CLIParser &) { remapper.ssbo_uav = true; });
	cbs.add("--ssbo-srv", [&](CLIParser &) { remapper.ssbo_srv = true; });
	cbs.add("--ssbo-alignment", [&](CLIParser &parser) { args.ssbo_alignment = parser.next_uint(); });
	cbs.add("--typed-uav-read-without-format", [&](CLIParser &) { args.typed_uav_read_without_format = true; });
	cbs.add("--bindless-typed-buffer-offsets", [&](CLIParser &) { args.bindless_typed_buffer_offsets = true; });
	cbs.add("--bindless-offset-buffer-layout", [&](CLIParser &parser) {
		args.offset_buffer_layout.untyped_offset = parser.next_uint();
		args.offset_buffer_layout.typed_offset = parser.next_uint();
		args.offset_buffer_layout.stride = parser.next_uint();
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

	dxil_spv_converter converter;
	if (dxil_spv_create_converter(blob, &converter) != DXIL_SPV_SUCCESS)
		return EXIT_FAILURE;

	dxil_spv_converter_set_srv_remapper(converter, remap_srv, &remapper);
	dxil_spv_converter_set_sampler_remapper(converter, remap_sampler, &remapper);
	dxil_spv_converter_set_uav_remapper(converter, remap_uav, &remapper);
	dxil_spv_converter_set_cbv_remapper(converter, remap_cbv, &remapper);

	dxil_spv_converter_set_vertex_input_remapper(converter, remap_vertex_input, &remapper);
	dxil_spv_converter_set_stream_output_remapper(converter, remap_stream_output, &remapper);
	dxil_spv_converter_set_root_constant_word_count(converter, remapper.root_constant_word_count);
	dxil_spv_converter_set_root_descriptor_count(converter, remapper.root_descriptors.size());

	if (local_root_signature)
	{
		dxil_spv_converter_add_local_root_constants(converter, 15, 0, 5);
		dxil_spv_converter_add_local_root_constants(converter, 15, 1, 6);
		dxil_spv_converter_add_local_root_descriptor(converter, DXIL_SPV_RESOURCE_CLASS_SRV, 15, 1);
		dxil_spv_converter_add_local_root_descriptor(converter, DXIL_SPV_RESOURCE_CLASS_UAV, 15, 1);
		dxil_spv_converter_add_local_root_descriptor(converter, DXIL_SPV_RESOURCE_CLASS_SRV, 15, 2);
		dxil_spv_converter_add_local_root_descriptor(converter, DXIL_SPV_RESOURCE_CLASS_UAV, 15, 2);
		dxil_spv_converter_add_local_root_descriptor(converter, DXIL_SPV_RESOURCE_CLASS_CBV, 15, 2);
		dxil_spv_converter_add_local_root_descriptor_table(converter, DXIL_SPV_RESOURCE_CLASS_SRV, 15, 3, ~0u, 10);
		dxil_spv_converter_add_local_root_descriptor_table(converter, DXIL_SPV_RESOURCE_CLASS_UAV, 15, 3, ~0u, 11);
		dxil_spv_converter_add_local_root_descriptor_table(converter, DXIL_SPV_RESOURCE_CLASS_CBV, 15, 3, ~0u, 12);
		dxil_spv_converter_add_local_root_descriptor_table(converter, DXIL_SPV_RESOURCE_CLASS_SAMPLER, 15, 3, ~0u, 13);

		dxil_spv_option_sbt_descriptor_size_log2 desc_size =
			{ { DXIL_SPV_OPTION_SBT_DESCRIPTOR_SIZE_LOG2 }, 6, 5 };
		dxil_spv_converter_add_option(converter, &desc_size.base);
	}

	if (args.shader_demote)
	{
		const dxil_spv_option_shader_demote_to_helper helper = { { DXIL_SPV_OPTION_SHADER_DEMOTE_TO_HELPER },
			                                                     DXIL_SPV_TRUE };
		dxil_spv_converter_add_option(converter, &helper.base);
	}

	if (args.dual_source_blending)
	{
		const dxil_spv_option_dual_source_blending helper = { { DXIL_SPV_OPTION_DUAL_SOURCE_BLENDING }, DXIL_SPV_TRUE };
		dxil_spv_converter_add_option(converter, &helper.base);
	}

	const dxil_spv_option_output_swizzle swizzle = { { DXIL_SPV_OPTION_OUTPUT_SWIZZLE },
		                                             args.swizzles.data(),
		                                             unsigned(args.swizzles.size()) };
	dxil_spv_converter_add_option(converter, &swizzle.base);

	if (args.root_constant_inline_ubo)
	{
		const dxil_spv_option_root_constant_inline_uniform_block inline_block = {
			{ DXIL_SPV_OPTION_ROOT_CONSTANT_INLINE_UNIFORM_BLOCK },
			args.root_constant_inline_ubo_desc_set,
			args.root_constant_inline_ubo_binding,
			DXIL_SPV_TRUE
		};
		dxil_spv_converter_add_option(converter, &inline_block.base);
	}

	if (args.bindless_cbv_as_ssbo)
	{
		const dxil_spv_option_bindless_cbv_ssbo_emulation cbv = { { DXIL_SPV_OPTION_BINDLESS_CBV_SSBO_EMULATION },
			                                                      DXIL_SPV_TRUE };
		dxil_spv_converter_add_option(converter, &cbv.base);
	}

	if (remapper.bindless || !remapper.root_descriptors.empty())
	{
		const dxil_spv_option_physical_storage_buffer phys = { { DXIL_SPV_OPTION_PHYSICAL_STORAGE_BUFFER },
			                                                   remapper.bda ? DXIL_SPV_TRUE : DXIL_SPV_FALSE };
		dxil_spv_converter_add_option(converter, &phys.base);
	}

	{
		dxil_spv_option_ssbo_alignment align = { { DXIL_SPV_OPTION_SSBO_ALIGNMENT }, args.ssbo_alignment };
		dxil_spv_converter_add_option(converter, &align.base);
	}

	{
		dxil_spv_option_typed_uav_read_without_format support = { { DXIL_SPV_OPTION_TYPED_UAV_READ_WITHOUT_FORMAT },
		                                                          args.typed_uav_read_without_format };
		dxil_spv_converter_add_option(converter, &support.base);
	}

	{
		dxil_spv_option_bindless_typed_buffer_offsets offsets = { { DXIL_SPV_OPTION_BINDLESS_TYPED_BUFFER_OFFSETS },
			                                                      args.bindless_typed_buffer_offsets ? DXIL_SPV_TRUE : DXIL_SPV_FALSE };
		dxil_spv_converter_add_option(converter, &offsets.base);
	}

	dxil_spv_converter_add_option(converter, &args.offset_buffer_layout.base);

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
			if (file)
			{
				if (fwrite(compiled.data, 1, compiled.size, file) != compiled.size)
				{
					LOGE("Failed to write SPIR-V.\n");
					return EXIT_FAILURE;
				}
				fclose(file);
			}
			else
				LOGE("Failed to open %s.\n", args.output_path.c_str());
		}
	}

	dxil_spv_converter_free(converter);
	dxil_spv_parsed_blob_free(blob);
	dxil_spv_end_thread_allocator_context();
	return EXIT_SUCCESS;
}