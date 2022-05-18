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

#include "context.hpp"
#include <stdlib.h>

namespace LLVMBC
{
LLVMContext::LLVMContext()
{
}

LLVMContext::~LLVMContext()
{
	for (size_t i = typed_allocations.size(); i; i--)
		typed_allocations[i - 1]->run();
	for (size_t i = raw_allocations.size(); i; i--)
		dxil_spv::free_in_thread(raw_allocations[i - 1]);
}

void *LLVMContext::allocate_from_chain(uintptr_t size, uintptr_t align)
{
	current_block = (current_block + align - 1) & ~(align - 1);
	if (current_block + size <= current_block_end)
	{
		void *ret = reinterpret_cast<void *>(current_block);
		current_block += size;
		return ret;
	}
	else
	{
		current_block = 0;
		current_block_end = 0;
		return nullptr;
	}
}

void LLVMContext::allocate_new_chain(size_t size, size_t align)
{
	size_t min_size = size + align;
	if (min_size < 64 * 1024)
		min_size = 64 * 1024;

	void *ptr = dxil_spv::allocate_in_thread(min_size);
	if (ptr)
	{
		raw_allocations.push_back(ptr);
		current_block = reinterpret_cast<uintptr_t>(ptr);
		current_block_end = current_block + min_size;
	}
	else
	{
		current_block = 0;
		current_block_end = 0;
	}
}

void *LLVMContext::allocate(size_t size, size_t align)
{
	void *ptr = allocate_from_chain(size, align);
	if (!ptr)
	{
		allocate_new_chain(size, align);
		ptr = allocate_from_chain(size, align);
	}
	return ptr;
}
} // namespace LLVMBC
