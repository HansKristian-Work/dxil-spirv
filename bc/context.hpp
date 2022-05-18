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

#include "data_structures.hpp"
#include <exception>
#include <stdint.h>
#include <stddef.h>

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
	T *construct(U &&... u)
	{
		T *mem = static_cast<T *>(allocate(sizeof(T), alignof(T)));
		if (!mem)
			std::terminate();
		T *t = new (mem) T(std::forward<U>(u)...);

		if (!std::is_trivially_destructible<T>::value)
			append_typed_destructor(t);
		return t;
	}

	template <typename T, typename... U>
	T *construct_n(size_t n, const U &... u)
	{
		T *mem = static_cast<T *>(allocate(sizeof(T) * n, alignof(T)));
		if (!mem)
			std::terminate();

		for (size_t i = 0; i < n; i++)
		{
			T *tmp = new (&mem[i]) T(u...);
			if (!std::is_trivially_destructible<T>::value)
				append_typed_destructor(tmp);
		}
		return mem;
	}

	Vector<Type *> &get_type_cache()
	{
		return type_cache;
	}

private:
	void *allocate(size_t size, size_t align);

	struct Deleter
	{
		virtual ~Deleter() = default;
		virtual void run() = 0;
	};

	template <typename T>
	struct TypedDeleter : Deleter
	{
		explicit TypedDeleter(T *ptr_)
		    : ptr(ptr_)
		{
		}
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

	Vector<void *> raw_allocations;
	Vector<Deleter *> typed_allocations;
	Vector<Type *> type_cache;

	template <typename T, typename... U>
	T *construct_trivial(U &&... u)
	{
		T *mem = static_cast<T *>(allocate(sizeof(T), alignof(T)));
		if (!mem)
			std::terminate();
		T *t = new (mem) T(std::forward<U>(u)...);
		return t;
	}

	template <typename T>
	void append_typed_destructor(T *ptr)
	{
		typed_allocations.push_back(construct_trivial<TypedDeleter<T>>(ptr));
	}
};

} // namespace LLVMBC
