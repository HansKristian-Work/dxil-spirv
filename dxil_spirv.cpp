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

#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <unordered_map>
#include <vector>

#include "cfg_structurizer.hpp"
#include "cli_parser.hpp"
#include "dxil_converter.hpp"
#include "logging.hpp"
#include "spirv_module.hpp"

#include "spirv-tools/libspirv.hpp"
#include "spirv_glsl.hpp"

#include <llvm/Support/raw_os_ostream.h>

using namespace DXIL2SPIRV;

static bool validate_spirv(const std::vector<uint32_t> &code)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("SPIRV-Tools message: %s\n", message);
	});
	return tools.Validate(code);
}

static std::string convert_to_asm(const std::vector<uint32_t> &code)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("SPIRV-Tools message: %s\n", message);
	});

	std::string str;
	if (!tools.Disassemble(code, &str, 0))
		return "";
	else
		return str;
}

static std::string convert_to_glsl(std::vector<uint32_t> code)
{
	try
	{
		spirv_cross::CompilerGLSL compiler(std::move(code));
		auto opts = compiler.get_common_options();
		opts.es = false;
		opts.version = 460;
		opts.vulkan_semantics = true;
		compiler.set_common_options(opts);
		auto str = compiler.compile();
		return str;
	}
	catch (const std::exception &e)
	{
		LOGE("Failed to decompile to GLSL: %s.\n", e.what());
		return "";
	}
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
	     "\t[--root-constant space binding word_offset word_count]\n");
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

struct Remapper : ResourceRemappingInterface
{
	bool remap_srv(const D3DBinding &binding, VulkanBinding &vk_binding) override
	{
		vk_binding.bindless.heap = false;
		vk_binding.descriptor_set = binding.register_space;
		vk_binding.binding = binding.register_index;
		return true;
	}

	bool remap_sampler(const D3DBinding &binding, VulkanBinding &vk_binding) override
	{
		vk_binding.bindless.heap = false;
		vk_binding.descriptor_set = binding.register_space;
		vk_binding.binding = binding.register_index;
		return true;
	}

	bool remap_uav(const D3DUAVBinding &binding, VulkanUAVBinding &vk_binding) override
	{
		vk_binding.buffer_binding.bindless.heap = false;
		vk_binding.counter_binding.bindless.heap = false;
		vk_binding.buffer_binding.descriptor_set = binding.binding.register_space;
		vk_binding.buffer_binding.binding = binding.binding.register_index;
		vk_binding.counter_binding.descriptor_set = binding.binding.register_space + 1;
		vk_binding.counter_binding.binding = binding.binding.register_index;
		return true;
	}

	bool remap_cbv(const D3DBinding &binding, VulkanCBVBinding &vk_binding) override
	{
		auto itr = std::find_if(root_constants.begin(), root_constants.end(), [&](const RootConstant &root) {
			return root.register_space == binding.register_space && root.register_index == binding.register_index;
		});

		if (itr != root_constants.end())
		{
			vk_binding.push_constant = true;
			vk_binding.push.offset_in_words = itr->word_offset;
		}
		else
		{
			vk_binding.buffer.bindless.heap = false;
			vk_binding.buffer.descriptor_set = binding.register_space;
			vk_binding.buffer.binding = binding.register_index;
		}
		return true;
	}

	unsigned get_root_constant_word_count() override
	{
		return root_constant_word_count;
	}

	struct RootConstant
	{
		unsigned register_space;
		unsigned register_index;
		unsigned word_offset;
	};
	std::vector<RootConstant> root_constants;
	unsigned root_constant_word_count = 0;
};

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

	DXIL2SPIRV::SPIRVModule spirv_module;

	DXIL2SPIRV::DXILContainerParser parser;
	if (!parser.parse_container(binary.data(), binary.size()))
	{
		LOGE("Failed to parse DXIL archive.\n");
		return EXIT_FAILURE;
	}

	DXIL2SPIRV::LLVMBCParser bc_parser;
	if (!bc_parser.parse(parser.get_bitcode_data(), parser.get_bitcode_size()))
		return EXIT_FAILURE;

	if (args.dump_module)
	{
		auto *module = &bc_parser.get_module();
		module->print(llvm::errs(), nullptr);
	}

	std::string llvm_asm_string;
	if (args.glsl_embed_asm)
	{
		auto *module = &bc_parser.get_module();
		llvm::raw_string_ostream str(llvm_asm_string);
		module->print(str, nullptr);
	}

	DXIL2SPIRV::Converter converter(bc_parser, spirv_module);
	converter.set_resource_remapping_interface(&remapper);
	auto entry_point = converter.convert_entry_point();
	if (entry_point.entry == nullptr)
	{
		LOGE("Failed to convert function.\n");
		return EXIT_FAILURE;
	}

	{
		DXIL2SPIRV::CFGStructurizer structurizer(entry_point.entry, *entry_point.node_pool, spirv_module);
		structurizer.run();
		spirv_module.emit_entry_point_function_body(structurizer);
	}

	for (auto &leaf : entry_point.leaf_functions)
	{
		if (!leaf.entry)
		{
			LOGE("Leaf function is nullptr!\n");
			return EXIT_FAILURE;
		}
		DXIL2SPIRV::CFGStructurizer structurizer(leaf.entry, *entry_point.node_pool, spirv_module);
		structurizer.run();
		spirv_module.emit_leaf_function_body(leaf.func, structurizer);
	}

	std::vector<uint32_t> spirv;
	if (!spirv_module.finalize_spirv(spirv))
	{
		LOGE("Failed to finalize SPIR-V.\n");
		return EXIT_FAILURE;
	}

	if (args.validate)
	{
		if (!validate_spirv(spirv))
		{
			LOGE("Failed to validate SPIR-V.\n");
			return EXIT_FAILURE;
		}
	}

	std::string spirv_asm_string;
	if (args.glsl_embed_asm)
		spirv_asm_string = convert_to_asm(spirv);

	if (args.glsl)
	{
		auto glsl = convert_to_glsl(std::move(spirv));
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
			auto assembly = convert_to_asm(spirv);
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
			if (fwrite(spirv.data(), sizeof(uint32_t), spirv.size(), file) != spirv.size())
			{
				LOGE("Failed to write SPIR-V.\n");
				return EXIT_FAILURE;
			}
			fclose(file);
		}
	}
}