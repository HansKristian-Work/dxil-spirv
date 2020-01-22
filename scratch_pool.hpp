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
		new_block.base = static_cast<T *>(malloc(sizeof(T) * next_allocate_size));
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
			::free(ptr);
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
	std::vector<std::unique_ptr<T, MallocDeleter>> blocks;
};
} // namespace dxil_spv
