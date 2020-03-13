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
#include <exception>
#include <stdint.h>

namespace LLVMBC
{
class Type;

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

	std::vector<Type *> &get_type_cache()
	{
		return type_cache;
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

	uintptr_t current_block = 0;
	uintptr_t current_block_end = 0;

	void *allocate_from_chain(uintptr_t size, uintptr_t align);
	void allocate_new_chain(size_t size, size_t align);

	std::vector<void *> raw_allocations;
	std::vector<Deleter *> typed_allocations;
	std::vector<Type *> type_cache;

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

}
