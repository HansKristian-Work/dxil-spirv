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
		::free(raw_allocations[i - 1]);
}

void *LLVMContext::allocate(size_t size, size_t /*align*/)
{
	// TODO: Chain allocation.
	void *ptr = ::malloc(size);
	raw_allocations.push_back(ptr);
	return ptr;
}
}

