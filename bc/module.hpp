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

#include <stddef.h>
#include <type_traits>
#include <utility>
#include <exception>
#include <vector>
#include <unordered_map>

// A reasonably small LLVM C++ API lookalike.

#define llvm LLVMBC
#define HAVE_LLVMBC

namespace LLVMBC
{
class Function;
class LLVMContext;
class Type;
class Instruction;
class Function;
class BasicBlock;
class GlobalVariable;

class Module
{
public:
	explicit Module(LLVMContext &context);
	LLVMContext &getContext();

	void add_value_name(uint64_t id, const std::string &name);
	void add_function_implementation(Function *func);
	void add_global_variable(GlobalVariable *variable);
	const std::string &get_value_name(uint64_t id) const;

	std::vector<Function *>::const_iterator begin() const;
	std::vector<Function *>::const_iterator end() const;

	std::vector<GlobalVariable *>::const_iterator global_begin() const;
	std::vector<GlobalVariable *>::const_iterator global_end() const;

private:
	LLVMContext &context;
	std::vector<Function *> functions;
	std::vector<GlobalVariable *> globals;
	std::unordered_map<uint64_t, std::string> value_symtab;
};

Module *parseIR(LLVMContext &context, const void *data, size_t size);
std::string disassemble(Module &module);
}
