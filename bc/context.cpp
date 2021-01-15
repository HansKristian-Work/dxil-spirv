/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
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
