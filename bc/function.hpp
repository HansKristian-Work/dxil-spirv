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

#include "iterator.hpp"
#include "value.hpp"

namespace LLVMBC
{
class LLVMContext;
class Instruction;
class Module;
class FunctionType;

class BasicBlock : public Value
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::BasicBlock;
	}
	explicit BasicBlock(LLVMContext &context);

	void add_instruction(Instruction *inst);
	Instruction *getTerminator() const;

	IteratorAdaptor<Instruction, Vector<Instruction *>::const_iterator> begin() const;
	IteratorAdaptor<Instruction, Vector<Instruction *>::const_iterator> end() const;

	void add_successor(BasicBlock *succ);

	Vector<BasicBlock *>::const_iterator succ_begin() const;
	Vector<BasicBlock *>::const_iterator succ_end() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Vector<Instruction *> instructions;
	Vector<BasicBlock *> succs;
};

inline Vector<BasicBlock *>::const_iterator succ_begin(const BasicBlock *bb)
{
	return bb->succ_begin();
}

inline Vector<BasicBlock *>::const_iterator succ_end(const BasicBlock *bb)
{
	return bb->succ_end();
}

class Function : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Function;
	}
	explicit Function(FunctionType *function_type, uint64_t value_id, Module &module);
	const String &getName() const;

	void set_basic_blocks(Vector<BasicBlock *> basic_blocks);
	IteratorAdaptor<BasicBlock, Vector<BasicBlock *>::const_iterator> begin() const;
	IteratorAdaptor<BasicBlock, Vector<BasicBlock *>::const_iterator> end() const;
	FunctionType *getFunctionType() const;

	BasicBlock &getEntryBlock() const;

	void add_argument(Argument *arg);
	IteratorAdaptor<const Argument, Vector<Argument *>::const_iterator> arg_begin() const;
	IteratorAdaptor<const Argument, Vector<Argument *>::const_iterator> arg_end() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Module &module;
	uint64_t value_id;
	FunctionType *function_type;
	Vector<BasicBlock *> basic_blocks;
	Vector<Argument *> arguments;
};
} // namespace LLVMBC
