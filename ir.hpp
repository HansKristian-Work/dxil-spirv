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

#pragma once

#include "SpvBuilder.h"
#include <stdint.h>
#include <vector>

// A simple IR representation which allows the CFGStructurizer to do some simple rewrites of blocks,
// PHI nodes in particular.

namespace DXIL2SPIRV
{
enum class MergeType
{
	None,
	Loop,
	Selection
};

struct CFGNode;
struct MergeInfo
{
	MergeType merge_type = MergeType::None;
	CFGNode *merge_block = nullptr;
	CFGNode *continue_block = nullptr;
};

struct IncomingValue
{
	CFGNode *block = nullptr;
	uint32_t id = 0;
};

struct PHI
{
	uint32_t id = 0;
	uint32_t type_id = 0;
	std::vector<IncomingValue> incoming;
};

struct Operation
{
	spv::Op op = spv::OpNop;

	enum
	{
		MaxArguments = 4
	};
	uint32_t id = 0;
	uint32_t type_id = 0;
	std::vector<uint32_t> arguments;
};

struct Terminator
{
	enum class Type
	{
		Unreachable,
		Branch,
		Condition,
		Switch,
		Return,
		Kill
	};

	uint32_t conditional_id = 0;
	Type type = Type::Unreachable;
	CFGNode *direct_block = nullptr;
	CFGNode *true_block = nullptr;
	CFGNode *false_block = nullptr;

	struct Case
	{
		CFGNode *node;
		uint32_t value;
	};
	std::vector<Case> cases;
	CFGNode *default_node = nullptr;
	uint32_t return_value = 0;
};

struct IRBlock
{
	std::vector<PHI> phi;
	std::vector<Operation> operations;
	MergeInfo merge_info;
	Terminator terminator;
};

} // namespace DXIL2SPIRV
