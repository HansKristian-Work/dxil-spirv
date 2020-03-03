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

#include <vector>
#include <string>
#include "value.hpp"

namespace LLVMBC
{
class LLVMContext;
class Instruction;
class Module;
class FunctionType;

class BasicBlock
{
public:
	explicit BasicBlock(LLVMContext &context);

	void add_instruction(Instruction *inst);

	std::vector<Instruction *>::const_iterator begin() const;
	std::vector<Instruction *>::const_iterator end() const;

private:
	LLVMContext &context;
	std::vector<Instruction *> instructions;
};

class Function : public Value
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::Function; }
	explicit Function(FunctionType *function_type, uint64_t value_id, Module &module);
	const std::string &getName() const;

	void set_basic_blocks(std::vector<BasicBlock *> basic_blocks);
	std::vector<BasicBlock *>::const_iterator begin() const;
	std::vector<BasicBlock *>::const_iterator end() const;
	FunctionType *getFunctionType() const;

private:
	Module &module;
	uint64_t value_id;
	FunctionType *function_type;
	std::vector<BasicBlock *> basic_blocks;
};
}
