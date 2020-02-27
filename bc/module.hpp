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
class LLVMContext
{
public:
	LLVMContext();
	~LLVMContext();
	void operator=(const LLVMContext &) = delete;
	LLVMContext(const LLVMContext &) = delete;

	template <typename T, typename... U>
	T *construct(U&&... u)
	{
		T *mem = static_cast<T *>(allocate(sizeof(T), alignof(T)));
		if (!mem)
			std::terminate();
		T *t = new(mem) T(std::forward<U>(u)...);

		if (!std::is_trivially_destructible<T>::value)
			append_typed_destructor(t);
		return t;
	}

	template <typename T, typename... U>
	T *construct_n(size_t n, const U&... u)
	{
		T *mem = static_cast<T *>(allocate(sizeof(T) * n, alignof(T)));
		if (!mem)
			std::terminate();

		for (size_t i = 0; i < n; i++)
		{
			T *tmp = new(&mem[i]) T(u...);
			if (!std::is_trivially_destructible<T>::value)
				append_typed_destructor(tmp);
		}
		return mem;
	}

private:
	void *allocate(size_t size, size_t align);

	struct Deleter
	{
		virtual void run() = 0;
	};

	template <typename T>
	struct TypedDeleter : Deleter
	{
		explicit TypedDeleter(T *ptr_) : ptr(ptr_) {}
		void run() override
		{
			ptr->~T();
		}
		T *ptr;
	};

	std::vector<void *> raw_allocations;
	std::vector<Deleter *> typed_allocations;

	template <typename T, typename... U>
	T *construct_trivial(U&&... u)
	{
		T *mem = static_cast<T *>(allocate(sizeof(T), alignof(T)));
		if (!mem)
			std::terminate();
		T *t = new(mem) T(std::forward<U>(u)...);
		return t;
	}

	template <typename T>
	void append_typed_destructor(T *ptr)
	{
		typed_allocations.push_back(construct_trivial<TypedDeleter<T>>(ptr));
	}
};

class Function;
class Type;

class Module
{
public:
	explicit Module(LLVMContext &context);
	LLVMContext &getContext();

	void add_function_name(uint64_t id, const std::string &name);
	void add_type(Type *type);
	Type *get_type(uint32_t index);

private:
	LLVMContext &context;
	std::vector<Function *> functions;
	std::vector<Type *> types;

	std::unordered_map<uint64_t, std::string> value_symtab;
};

enum class TypeID
{
	Unknown,
	Void,
	Half,
	Float,
	Double,
	Int,
	Pointer,
	Array,
	Struct,
	Function
};

class Type
{
public:
	Type(Module &module, TypeID type_id);
	void set_contained_type(Type *type);
	void set_address_space(uint32_t addr_space);

protected:
	Module &module;
	TypeID type_id;
};

class PointerType : public Type
{
public:
	PointerType(Module &module, Type *type, uint32_t addr_space);

private:
	Type *contained_type = nullptr;
	uint32_t address_space = 0;
};

class ArrayType : public Type
{
public:
	ArrayType(Module &module, Type *type, uint32_t elements);

private:
	Type *contained_type = nullptr;
	uint32_t elements = 0;
};

class IntegerType : public Type
{
public:
	IntegerType(Module &module, uint32_t width);

private:
	uint32_t width = 0;
};

class StructType : public Type
{
public:
	StructType(Module &module);
	void add_member_type(Type *type);

private:
	std::vector<Type *> member_types;
};

class FunctionType : public Type
{
public:
	FunctionType(Module &module);
	void set_return_type(Type *return_type);
	void add_argument_type(Type *argument_type);

private:
	Type *return_type = nullptr;
	std::vector<Type *> argument_types;
};

class Function
{
public:
	explicit Function(Module &module);

private:
	Module &module;
};

class Value
{
public:
};

Module *parseIR(LLVMContext &context, const void *data, size_t size);
}
