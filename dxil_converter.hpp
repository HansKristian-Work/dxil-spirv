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

#pragma once

#include "cfg_structurizer.hpp"
#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"
#include <memory>

namespace DXIL2SPIRV
{
struct ConvertedFunction
{
	CFGNode *entry;

	struct LeafFunction
	{
		CFGNode *entry;
		spv::Function *func;
	};
	std::vector<LeafFunction> leaf_functions;
	std::unique_ptr<CFGNodePool> node_pool;
};

class Converter
{
public:
	Converter(DXILContainerParser &container_parser, LLVMBCParser &bitcode_parser, SPIRVModule &module);
	~Converter();
	ConvertedFunction convert_entry_point();
	struct Impl;

private:
	std::unique_ptr<Impl> impl;
};
} // namespace DXIL2SPIRV