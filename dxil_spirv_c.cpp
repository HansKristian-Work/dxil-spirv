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

#include "dxil_spirv_c.h"
#include "dxil_parser.hpp"
#include "dxil_converter.hpp"
#include "llvm_bitcode_parser.hpp"
#include "logging.hpp"
#include <new>

#include "spirv-tools/libspirv.hpp"

using namespace DXIL2SPIRV;

void dxil_spv_get_version(unsigned *major, unsigned *minor, unsigned *patch)
{
	*major = DXIL_SPV_API_VERSION_MAJOR;
	*minor = DXIL_SPV_API_VERSION_MINOR;
	*patch = DXIL_SPV_API_VERSION_PATCH;
}

struct dxil_spv_parsed_blob_s
{
	DXILContainerParser parser;
	LLVMBCParser bc_parser;
};

struct dxil_spv_converter_s
{
	explicit dxil_spv_converter_s(LLVMBCParser &bc_parser)
		: converter(bc_parser, module)
	{
	}
	SPIRVModule module;
	Converter converter;
	std::vector<uint32_t> spirv;
};

dxil_spv_result dxil_spv_parse_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob)
{
	auto *parsed = new (std::nothrow) dxil_spv_parsed_blob_s;
	if (!parsed)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	if (!parsed->parser.parse_container(data, size))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	if (!parsed->bc_parser.parse(parsed->parser.get_bitcode_data(), parsed->parser.get_bitcode_size()))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	*blob = parsed;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parse_dxil(const void *data, size_t size, dxil_spv_parsed_blob *blob)
{
	auto *parsed = new (std::nothrow) dxil_spv_parsed_blob_s;
	if (!parsed)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	if (!parsed->bc_parser.parse(parsed->parser.get_bitcode_data(), parsed->parser.get_bitcode_size()))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	*blob = parsed;
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_parsed_blob_dump_llvm_ir(dxil_spv_parsed_blob blob)
{
	auto &module = blob->bc_parser.get_module();
	module.print(llvm::errs(), nullptr);
}

void dxil_spv_parsed_blob_free(dxil_spv_parsed_blob blob)
{
	delete blob;
}

dxil_spv_result dxil_spv_create_converter(dxil_spv_parsed_blob blob, dxil_spv_converter *converter)
{
	auto *conv = new (std::nothrow) dxil_spv_converter_s(blob->bc_parser);
	if (!conv)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	*converter = conv;
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_converter_free(dxil_spv_converter converter)
{
	delete converter;
}

dxil_spv_result dxil_spv_converter_run(dxil_spv_converter converter)
{
	auto entry_point = converter->converter.convert_entry_point();
	if (entry_point.entry == nullptr)
	{
		LOGE("Failed to convert function.\n");
		return DXIL_SPV_ERROR_GENERIC;
	}

	{
		DXIL2SPIRV::CFGStructurizer structurizer(entry_point.entry, *entry_point.node_pool, converter->module);
		structurizer.run();
		converter->module.emit_entry_point_function_body(structurizer);
	}

	for (auto &leaf : entry_point.leaf_functions)
	{
		if (!leaf.entry)
		{
			LOGE("Leaf function is nullptr!\n");
			return DXIL_SPV_ERROR_GENERIC;
		}
		DXIL2SPIRV::CFGStructurizer structurizer(leaf.entry, *entry_point.node_pool, converter->module);
		structurizer.run();
		converter->module.emit_leaf_function_body(leaf.func, structurizer);
	}

	if (!converter->module.finalize_spirv(converter->spirv))
	{
		LOGE("Failed to finalize SPIR-V.\n");
		return DXIL_SPV_ERROR_GENERIC;
	}

	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_validate_spirv(dxil_spv_converter converter)
{
	if (converter->spirv.empty())
		return DXIL_SPV_ERROR_UNSUPPORTED_FEATURE;

	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("SPIRV-Tools message: %s\n", message);
	});
	return tools.Validate(converter->spirv) ? DXIL_SPV_SUCCESS : DXIL_SPV_ERROR_FAILED_VALIDATION;
}

dxil_spv_result dxil_spv_converter_get_compiled_spirv(dxil_spv_converter converter,
                                                      dxil_spv_compiled_spirv *compiled)
{
	if (converter->spirv.empty())
		return DXIL_SPV_ERROR_GENERIC;

	compiled->data = converter->spirv.data();
	compiled->size = converter->spirv.size() * sizeof(uint32_t);
	return DXIL_SPV_SUCCESS;
}


