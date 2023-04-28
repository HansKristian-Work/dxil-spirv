/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
	LOGE("dxil-extract <DXIL blob> [--output file.bc] [--reflection] [--verbose]\n");
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
	bool reflection = false;
	bool verbose = false;

	CLICallbacks cbs;
	cbs.add("--help", [](CLIParser &parser) {
		print_help();
		parser.end();
	});
	cbs.add("--output", [&](CLIParser &parser) { output = parser.next_string(); });
	cbs.add("--reflection", [&](CLIParser &) { reflection = true; });
	cbs.add("--verbose", [&](CLIParser &) { verbose = true; });
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
	if (reflection)
	{
		dxil_spv_result result;
		if ((result = dxil_spv_parse_reflection_dxil_blob(input_file.data(), input_file.size(), &blob)) != DXIL_SPV_SUCCESS)
		{
			// Fallback in case there is no STAT block.
			if (result == DXIL_SPV_ERROR_NO_DATA)
			{
				LOGW("There is no STAT block, falling back to normal DXIL block.\n");
				result = dxil_spv_parse_dxil_blob(input_file.data(), input_file.size(), &blob);
			}

			if (result != DXIL_SPV_SUCCESS)
			{
				LOGE("Failed to parse blob.\n");
				return EXIT_FAILURE;
			}
		}
	}
	else
	{
		if (dxil_spv_parse_dxil_blob(input_file.data(), input_file.size(), &blob) != DXIL_SPV_SUCCESS)
		{
			LOGE("Failed to parse blob.\n");
			return EXIT_FAILURE;
		}
	}

	if (verbose)
	{
		printf("=== %s ===\n", input.c_str());
		unsigned entry_point_count = 0;
		dxil_spv_parsed_blob_get_num_entry_points(blob, &entry_point_count);
		for (unsigned i = 0; i < entry_point_count; i++)
		{
			const char *demangled = nullptr;
			dxil_spv_parsed_blob_get_entry_point_demangled_name(blob, i, &demangled);
			printf("  %s\n", demangled);
		}
		printf("==================\n");
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
