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

namespace dxbc_spv
{
namespace ir
{
class Builder;
}
}

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
Module *parseDXBCIR(LLVMContext &context, dxbc_spv::ir::Builder &builder);
Module *parseDXBCBinary(LLVMContext &context, const void *data, size_t size);
bool disassemble(Module &module, String &str);
} // namespace LLVMBC
