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

#pragma once

#include "thread_local_allocator.hpp"
#include "spirv.hpp"
#include <assert.h>
#include <initializer_list>
#include <stdint.h>

// A simple IR representation which allows the CFGStructurizer to do some simple rewrites of blocks,
// PHI nodes in particular.

namespace dxil_spv
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
	spv::LoopControlMask loop_control_mask = spv::LoopControlMaskNone;
	spv::SelectionControlMask selection_control_mask = spv::SelectionControlMaskNone;
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
	bool relaxed = false;
	Vector<IncomingValue> incoming;
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
		MaxArguments = 11
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
		assert(arg != 0);
		arguments[num_arguments++] = arg;
	}

	void add_ids(const std::initializer_list<spv::Id> &args)
	{
		for (auto &arg : args)
		{
			assert(arg != 0);
			add_id(arg);
		}
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
		CFGNode *node = nullptr;
		uint64_t global_order = 0;
		uint32_t value = 0;
		bool is_default = false;
	};
	Vector<Case> cases;
	uint32_t return_value = 0;

	bool force_unroll = false;
	bool force_loop = false;
	bool force_flatten = false;
	bool force_branch = false;
};

struct IRBlock
{
	Vector<PHI> phi;
	Vector<Operation *> operations;
	MergeInfo merge_info;
	Terminator terminator;
};

} // namespace dxil_spv
