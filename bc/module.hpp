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

#include "data_structures.hpp"
#include "iterator.hpp"
#include <exception>
#include <stddef.h>
#include <type_traits>
#include <utility>

// A reasonably small LLVM C++ API lookalike.

#define llvm LLVMBC

namespace LLVMBC
{
class Function;
class LLVMContext;
class Type;
class Instruction;
class Function;
class BasicBlock;
class GlobalVariable;
class NamedMDNode;
class MDNode;

class Module
{
public:
	explicit Module(LLVMContext &context);
	LLVMContext &getContext();

	NamedMDNode *getNamedMetadata(const String &name) const;

	Function *getFunction(const String &name) const;

	void add_value_name(uint64_t id, const String &name);
	void add_function_implementation(Function *func);
	void add_global_variable(GlobalVariable *variable);
	void add_named_metadata(const String &name, NamedMDNode *node);
	void add_unnamed_metadata(MDNode *node);
	const String &get_value_name(uint64_t id) const;

	Vector<Function *>::const_iterator begin() const;
	Vector<Function *>::const_iterator end() const;

	IteratorAdaptor<GlobalVariable, Vector<GlobalVariable *>::const_iterator> global_begin() const;
	IteratorAdaptor<GlobalVariable, Vector<GlobalVariable *>::const_iterator> global_end() const;

	UnorderedMap<String, NamedMDNode *>::const_iterator named_metadata_begin() const;
	UnorderedMap<String, NamedMDNode *>::const_iterator named_metadata_end() const;

	Vector<MDNode *>::const_iterator unnamed_metadata_begin() const;
	Vector<MDNode *>::const_iterator unnamed_metadata_end() const;

private:
	LLVMContext &context;
	Vector<Function *> functions;
	Vector<GlobalVariable *> globals;
	UnorderedMap<uint64_t, String> value_symtab;
	UnorderedMap<String, NamedMDNode *> named_metadata;
	Vector<MDNode *> unnamed_metadata;
};

Module *parseIR(LLVMContext &context, const void *data, size_t size);
bool disassemble(Module &module, String &str);
} // namespace LLVMBC
