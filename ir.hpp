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

#include "SpvBuilder.h"
#include <assert.h>
#include <initializer_list>
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

struct IDArgument
{
	explicit IDArgument(spv::Id id_)
	    : id(id_)
	{
	}

	spv::Id id;
};

struct LiteralArgument
{
	explicit LiteralArgument(uint32_t lit_)
	    : lit(lit_)
	{
	}

	uint32_t lit;
};

struct Operation
{
	enum
	{
		MaxArguments = 8
	};

	Operation() = default;

	explicit Operation(spv::Op op_)
	    : op(op_)
	{
	}

	Operation(spv::Op op_, spv::Id id_, spv::Id type_id_)
	    : op(op_)
	    , id(id_)
	    , type_id(type_id_)
	{
	}

	void add_id(spv::Id arg)
	{
		assert(num_arguments < MaxArguments);
		arguments[num_arguments++] = arg;
	}

	void add_ids(const std::initializer_list<spv::Id> &args)
	{
		for (auto &arg : args)
			add_id(arg);
	}

	void add_literal(uint32_t lit)
	{
		assert(num_arguments < MaxArguments);
		literal_mask |= 1u << num_arguments;
		arguments[num_arguments++] = lit;
	}

	const spv::Id *begin() const
	{
		return arguments;
	}

	const spv::Id *end() const
	{
		return arguments + num_arguments;
	}

	uint8_t get_literal_mask() const
	{
		return literal_mask;
	}

	spv::Op op = spv::OpNop;
	spv::Id id = 0;
	spv::Id type_id = 0;

	spv::Id arguments[MaxArguments];
	unsigned num_arguments = 0;
	uint8_t literal_mask = 0;
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
	std::vector<Operation *> operations;
	MergeInfo merge_info;
	Terminator terminator;
};

} // namespace DXIL2SPIRV
