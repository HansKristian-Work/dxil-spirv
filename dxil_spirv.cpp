/*
 * Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
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
	LOGE("Usage: dxil-spirv <input path> [--output <path>] [--glsl] [--validate] [--glsl-embed-asm]\n");
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

int main(int argc, char **argv)
{
	Arguments args;

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

	DXIL2SPIRV::Converter converter(std::move(parser), std::move(bc_parser), spirv_module);
	auto entry_point = converter.convert_entry_point();

	DXIL2SPIRV::CFGStructurizer structurizer(entry_point.entry, *entry_point.node_pool, spirv_module);
	structurizer.run();
	spirv_module.emit_function_body(structurizer);

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