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
