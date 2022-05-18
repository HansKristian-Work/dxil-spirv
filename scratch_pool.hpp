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

#ifndef DXIL_SPV_SCRATCH_POOL_H_
#define DXIL_SPV_SCRATCH_POOL_H_

#include "thread_local_allocator.hpp"

namespace dxil_spv
{
template <typename T>
class ScratchPool
{
public:
	ScratchPool()
	{
		static_assert(std::is_trivially_destructible<T>::value, "T must be trivially destructible.");
	}

	template <typename... P>
	T *allocate(P &&... p)
	{
		T *t = allocate_raw();
		return new (t) T(std::forward<P>(p)...);
	}

	T *allocate_raw()
	{
		if (current.offset < current.size)
			return &current.base[current.offset++];

		Block new_block = {};
		new_block.size = next_allocate_size;
		new_block.base = static_cast<T *>(allocate_in_thread(sizeof(T) * next_allocate_size));
		if (!new_block.base)
		{
			// If we fail to allocate this little memory, we are hosed anyways.
			std::terminate();
		}

		blocks.emplace_back(new_block.base);
		next_allocate_size *= 2;

		current = new_block;
		current.offset = 1;
		return current.base;
	}

private:
	struct MallocDeleter
	{
		void operator()(void *ptr) noexcept
		{
			free_in_thread(ptr);
		}
	};

	struct Block
	{
		T *base;
		size_t offset;
		size_t size;
	};
	Block current = {};
	size_t next_allocate_size = 64;
	Vector<std::unique_ptr<T, MallocDeleter>> blocks;
};
} // namespace dxil_spv

#endif
