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
#include <string.h>
#include <exception>

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
	enum : unsigned
	{
		InlineArguments = 6
	};

	~Operation()
	{
		if (arguments != inline_arguments)
			free_in_thread(arguments);
	}

	// Don't bother with move operations.
	// Due to the inline nature of this struct,
	// we need a copy in almost all cases anyway.

	Operation() = default;
	Operation(const Operation &other)
	{
		copy_from(other);
	}

	Operation &operator=(const Operation &other)
	{
		if (this != &other)
			copy_from(other);
		return *this;
	}

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
		assert(arg != 0);
		add_argument(arg, false);
	}

	void add_ids(const std::initializer_list<spv::Id> &args)
	{
		reserve_arguments(argument_count + unsigned(args.size()));
		for (auto &arg : args)
		{
			assert(arg != 0);
			add_id(arg);
		}
	}

	void add_literal(uint32_t lit)
	{
		add_argument(lit, true);
	}

	void reserve_arguments(unsigned count)
	{
		if (count <= argument_capacity)
			return;

		size_t literal_word_count = get_literal_word_count(count);
		size_t allocation_words = size_t(count) + literal_word_count;
		auto *new_values = static_cast<uint32_t *>(
			allocate_in_thread(sizeof(uint32_t) * allocation_words));
		if (!new_values)
			std::terminate();

		auto *old_literal_mask = get_literal_mask();
		auto *new_literal_mask = new_values + count;
		memcpy(new_values, arguments, sizeof(uint32_t) * argument_count);
		memset(new_literal_mask, 0, sizeof(uint32_t) * literal_word_count);
		memcpy(new_literal_mask, old_literal_mask,
		       sizeof(uint32_t) * get_literal_word_count(argument_count));

		if (arguments != inline_arguments)
			free_in_thread(arguments);

		arguments = new_values;
		argument_capacity = count;
	}

	unsigned num_arguments() const
	{
		return argument_count;
	}

	uint32_t argument(unsigned index) const
	{
		assert(index < argument_count);
		return arguments[index];
	}

	void set_argument(unsigned index, uint32_t value)
	{
		assert(index < argument_count);
		assert(argument_is_literal(index) || value != 0);
		arguments[index] = value;
	}

	bool argument_is_literal(unsigned index) const
	{
		assert(index < argument_count);
		return (get_literal_mask()[index / 32] &
		        (1u << (index % 32))) != 0;
	}

	const uint32_t *begin() const
	{
		return arguments;
	}

	const uint32_t *end() const
	{
		return arguments + argument_count;
	}

	spv::Op op = spv::OpNop;
	spv::Id id = 0;
	spv::Id type_id = 0;

	enum : uint8_t
	{
		SinkableBit = 1 << 0,
		DependencySinkableBit = 1 << 1,
		AutoGroupSharedBarrier = 1 << 2,
		// Inserted after analysis passes are done.
		SubgroupSyncPre = 1 << 3,
		SubgroupSyncPost = 1 << 4
	};
	uint8_t flags = 0;

private:
	const uint32_t *get_literal_mask() const
	{
		return arguments == inline_arguments ?
		       &inline_literal_mask : arguments + argument_capacity;
	}

	uint32_t *get_literal_mask()
	{
		return arguments == inline_arguments ?
		       &inline_literal_mask : arguments + argument_capacity;
	}

	static unsigned get_literal_word_count(unsigned count)
	{
		return (count + 31) / 32;
	}

	void add_argument(uint32_t value, bool literal)
	{
		if (argument_count == argument_capacity)
			reserve_arguments(argument_capacity * 2);

		unsigned index = argument_count++;
		arguments[index] = value;
		uint32_t &literal_word = get_literal_mask()[index / 32];
		uint32_t literal_bit = 1u << (index % 32);
		if (literal)
			literal_word |= literal_bit;
		else
			literal_word &= ~literal_bit;
	}

	void copy_from(const Operation &other)
	{
		op = other.op;
		id = other.id;
		type_id = other.type_id;
		flags = other.flags;

		reserve_arguments(other.argument_count);
		argument_count = other.argument_count;
		memcpy(arguments, other.arguments, sizeof(uint32_t) * argument_count);
		memcpy(get_literal_mask(), other.get_literal_mask(),
		       sizeof(uint32_t) * get_literal_word_count(argument_count));
	}

	uint32_t inline_arguments[InlineArguments];
	uint32_t *arguments = inline_arguments;
	uint32_t inline_literal_mask = 0;
	unsigned argument_count = 0;
	unsigned argument_capacity = InlineArguments;
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
