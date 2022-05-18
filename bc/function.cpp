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

#include "function.hpp"
#include "context.hpp"
#include "instruction.hpp"
#include "module.hpp"
#include "type.hpp"
#include <algorithm>
#include <assert.h>

namespace LLVMBC
{
Function::Function(FunctionType *function_type_, uint64_t value_id_, Module &module_)
    : Constant(function_type_, ValueKind::Function)
    , module(module_)
    , value_id(value_id_)
    , function_type(function_type_)
{
}

const String &Function::getName() const
{
	return module.get_value_name(value_id);
}

void Function::set_basic_blocks(Vector<BasicBlock *> basic_blocks_)
{
	basic_blocks = std::move(basic_blocks_);
}

FunctionType *Function::getFunctionType() const
{
	return function_type;
}

IteratorAdaptor<BasicBlock, Vector<BasicBlock *>::const_iterator> Function::begin() const
{
	return basic_blocks.begin();
}

IteratorAdaptor<BasicBlock, Vector<BasicBlock *>::const_iterator> Function::end() const
{
	return basic_blocks.end();
}

BasicBlock &Function::getEntryBlock() const
{
	return *basic_blocks.front();
}

void Function::add_argument(Argument *arg)
{
	arguments.push_back(arg);
}

String Attribute::getValueAsString() const
{
	// LLVM implementation does this.
	if (value)
		return *value;
	else
		return {};
}

Attribute::Attribute(const String *value_)
	: value(value_)
{
}

Attribute Function::getFnAttribute(const char *attribute) const
{
	for (auto &attr : attributes)
		if (attr.first == attribute)
			return Attribute(&attr.second);
	return Attribute(nullptr);
}

void Function::set_attributes(Vector<std::pair<String, String>> attributes_)
{
	attributes = std::move(attributes_);
}

IteratorAdaptor<const Argument, Vector<Argument *>::const_iterator> Function::arg_begin() const
{
	return arguments.begin();
}

IteratorAdaptor<const Argument, Vector<Argument *>::const_iterator> Function::arg_end() const
{
	return arguments.end();
}

BasicBlock::BasicBlock(LLVMContext &context_)
    : Value(Type::getLabelTy(context_), ValueKind::BasicBlock)
{
}

void BasicBlock::add_instruction(Instruction *inst)
{
	instructions.push_back(inst);
}

Instruction *BasicBlock::getTerminator() const
{
	if (!instructions.empty() && instructions.back()->isTerminator())
		return instructions.back();
	else
		return nullptr;
}

void BasicBlock::add_successor(BasicBlock *succ)
{
	if (std::find(succs.begin(), succs.end(), succ) == succs.end())
		succs.push_back(succ);
}

IteratorAdaptor<Instruction, Vector<Instruction *>::const_iterator> BasicBlock::begin() const
{
	return instructions.begin();
}

IteratorAdaptor<Instruction, Vector<Instruction *>::const_iterator> BasicBlock::end() const
{
	return instructions.end();
}

Vector<BasicBlock *>::const_iterator BasicBlock::succ_begin() const
{
	return succs.begin();
}

Vector<BasicBlock *>::const_iterator BasicBlock::succ_end() const
{
	return succs.end();
}
} // namespace LLVMBC
