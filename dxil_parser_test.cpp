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
#include "dxil_converter.hpp"
#include "spirv_module.hpp"

#include <llvm/Support/raw_os_ostream.h>

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

int main(int argc, char **argv)
{
	if (argc != 2)
		return EXIT_FAILURE;

	auto binary = read_file(argv[1]);
	if (binary.empty())
	{
		fprintf(stderr, "Failed to load file: %s\n", argv[1]);
		return EXIT_FAILURE;
	}

	DXIL2SPIRV::SPIRVModule spirv_module;

	DXIL2SPIRV::DXILContainerParser parser;
	if (!parser.parse_container(binary.data(), binary.size()))
	{
		fprintf(stderr, "Failed to parse DXIL archive.\n");
		return EXIT_FAILURE;
	}

	DXIL2SPIRV::LLVMBCParser bc_parser;
	if (!bc_parser.parse(parser.get_bitcode_data(), parser.get_bitcode_size()))
		return EXIT_FAILURE;

	auto *module = &bc_parser.get_module();
	module->print(llvm::errs(), nullptr);

	DXIL2SPIRV::Converter converter(std::move(parser), std::move(bc_parser), spirv_module);

	auto entry_point = converter.convert_entry_point();

	DXIL2SPIRV::CFGStructurizer structurizer(entry_point.entry, *entry_point.node_pool, spirv_module);
	structurizer.run();
	spirv_module.emit_function_body(structurizer);

	std::vector<uint32_t> spirv;
	if (spirv_module.finalize_spirv(spirv))
	{
		FILE *file = fopen("/tmp/test.spv", "wb");
		if (file)
		{
			fwrite(spirv.data(), sizeof(uint32_t), spirv.size(), file);
			fclose(file);
		}
	}
}