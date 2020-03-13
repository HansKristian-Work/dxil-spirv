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

#include "cli_parser.hpp"
#include "dxil_spirv_c.h"
#include "logging.hpp"
#include <stdint.h>
#include <stdio.h>
#include <vector>

using namespace dxil_spv;

static void print_help()
{
	LOGE("dxil-extract <DXIL blob> [--output file.bc]\n");
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

static bool write_file(const char *path, const void *data, size_t size)
{
	bool ret = true;

	FILE *file = fopen(path, "wb");
	if (!file)
		return false;

	if (fwrite(data, 1, size, file) != size)
	{
		LOGE("Failed to write LLVM BC.\n");
		ret = false;
	}
	fclose(file);
	return ret;
}

int main(int argc, char **argv)
{
	std::string input, output;

	CLICallbacks cbs;
	cbs.add("--help", [](CLIParser &parser) {
		print_help();
		parser.end();
	});
	cbs.add("--output", [&](CLIParser &parser) { output = parser.next_string(); });
	cbs.default_handler = [&](const char *arg) { input = arg; };
	CLIParser parser(std::move(cbs), argc - 1, argv + 1);

	if (!parser.parse())
		return EXIT_FAILURE;
	else if (parser.is_ended_state())
		return EXIT_SUCCESS;

	if (input.empty())
	{
		LOGE("Need input file.\n");
		return EXIT_FAILURE;
	}

	auto input_file = read_file(input.c_str());
	if (input_file.empty())
	{
		LOGE("Failed to read file %s.\n", input.c_str());
		return EXIT_FAILURE;
	}

	dxil_spv_parsed_blob blob;
	if (dxil_spv_parse_dxil_blob(input_file.data(), input_file.size(), &blob) != DXIL_SPV_SUCCESS)
	{
		LOGE("Failed to parse blob.\n");
		return EXIT_FAILURE;
	}

	const void *ir_data;
	size_t ir_size;
	if (dxil_spv_parsed_blob_get_raw_ir(blob, &ir_data, &ir_size) != DXIL_SPV_SUCCESS)
	{
		LOGE("Failed to extract raw IR.\n");
		return EXIT_FAILURE;
	}

	if (output.empty())
	{
		dxil_spv_parsed_blob_dump_llvm_ir(blob);
		dxil_spv_parsed_blob_free(blob);
		return EXIT_SUCCESS;
	}

	if (!write_file(output.c_str(), ir_data, ir_size))
	{
		LOGE("Failed to write IR to %s.\n", output.c_str());
		return EXIT_FAILURE;
	}
	dxil_spv_parsed_blob_free(blob);
}
