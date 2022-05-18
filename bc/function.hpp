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

class Attribute
{
public:
	explicit Attribute(const String *value);
	String getValueAsString() const;

private:
	const String *value;
};

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

	// Bare bones implementation, we only need it for fp32-denorm-mode attribute.
	Attribute getFnAttribute(const char *attribute) const;
	void set_attributes(Vector<std::pair<String, String>> attributes);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Module &module;
	uint64_t value_id;
	FunctionType *function_type;
	Vector<BasicBlock *> basic_blocks;
	Vector<Argument *> arguments;
	Vector<std::pair<String, String>> attributes;
};
} // namespace LLVMBC
