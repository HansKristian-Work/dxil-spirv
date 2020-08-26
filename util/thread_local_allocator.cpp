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

#include "thread_local_allocator.hpp"
#include <assert.h>
#include <stdint.h>
#include <memory>

namespace dxil_spv
{
static constexpr size_t BLOCK_SIZE = 64 * 1024;

class ChainAllocator
{
public:
	void reset();
	void *allocate(size_t size);

private:
	struct MallocDeleter
	{
		void operator()(void *ptr)
		{
			free(ptr);
		}
	};

	struct Block
	{
		explicit Block(size_t size);
		void *allocate(size_t size);

		std::unique_ptr<uint8_t, MallocDeleter> block;
		size_t offset = 0;
		size_t block_size = 0;
	};
	std::vector<Block> blocks;
	std::vector<Block> huge_blocks;
	unsigned block_index = 0;

	bool ensure_block();
	void *allocate_huge(size_t size);
};

ChainAllocator::Block::Block(size_t size)
	: block(static_cast<uint8_t *>(malloc(size))), block_size(size)
{
}

void *ChainAllocator::Block::allocate(size_t size)
{
	offset = (offset + 15) & ~size_t(15);
	if (offset + size <= block_size)
	{
		void *ret = block.get() + offset;
		offset += size;
		return ret;
	}
	else
		return nullptr;
}

static thread_local ChainAllocator *allocator;

void ChainAllocator::reset()
{
	for (auto &block : blocks)
		block.offset = 0;
	block_index = 0;
	huge_blocks.clear();
}

bool ChainAllocator::ensure_block()
{
	blocks.emplace_back(BLOCK_SIZE);
	return bool(blocks.back().block);
}

void *ChainAllocator::allocate_huge(size_t size)
{
	huge_blocks.emplace_back(size);
	return huge_blocks.back().block.get();
}

void *ChainAllocator::allocate(size_t size)
{
	if (size > BLOCK_SIZE)
		return allocate_huge(size);

	if (block_index >= blocks.size() && !ensure_block())
		return nullptr;

	void *ptr = blocks[block_index].allocate(size);
	if (ptr)
		return ptr;

	block_index++;
	if (block_index >= blocks.size() && !ensure_block())
		return nullptr;

	return blocks[block_index].allocate(size);
}

void *allocate_in_thread(size_t size)
{
	if (!allocator)
		return malloc(size);

	return allocator->allocate(size);
}

void free_in_thread(void *ptr)
{
	if (!allocator)
	{
		free(ptr);
		return;
	}

	// Don't bother freeing ...
}

void begin_thread_allocator_context()
{
	assert(!allocator);
	allocator = new ChainAllocator;
}

void end_thread_allocator_context()
{
	assert(allocator);
	delete allocator;
	allocator = nullptr;
}

void reset_thread_allocator_context()
{
	assert(allocator);
	allocator->reset();
}
}
