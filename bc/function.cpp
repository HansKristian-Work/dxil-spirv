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

const std::string &Function::getName() const
{
	return module.get_value_name(value_id);
}

void Function::set_basic_blocks(std::vector<BasicBlock *> basic_blocks_)
{
	basic_blocks = std::move(basic_blocks_);
}

FunctionType *Function::getFunctionType() const
{
	return function_type;
}

std::vector<BasicBlock *>::const_iterator Function::begin() const
{
	return basic_blocks.begin();
}

std::vector<BasicBlock *>::const_iterator Function::end() const
{
	return basic_blocks.end();
}

BasicBlock &Function::getEntryBlock() const
{
	return *basic_blocks.front();
}

BasicBlock::BasicBlock(LLVMContext &context_)
    : Value(Type::getLabelTy(context_), ValueKind::BasicBlock)
    , context(context_)
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

IteratorAdaptor<Instruction, std::vector<Instruction *>::const_iterator> BasicBlock::begin() const
{
	return instructions.begin();
}

IteratorAdaptor<Instruction, std::vector<Instruction *>::const_iterator> BasicBlock::end() const
{
	return instructions.end();
}

std::vector<BasicBlock *>::const_iterator BasicBlock::succ_begin() const
{
	return succs.begin();
}

std::vector<BasicBlock *>::const_iterator BasicBlock::succ_end() const
{
	return succs.end();
}
} // namespace LLVMBC
