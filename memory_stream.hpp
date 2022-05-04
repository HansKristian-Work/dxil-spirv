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

#pragma once

#include "thread_local_allocator.hpp"
#include <stddef.h>
#include <stdint.h>

namespace dxil_spv
{
class MemoryStream
{
public:
	MemoryStream(const void *blob, size_t size);
	MemoryStream() = default;

	void reset();

	template <typename T>
	bool read(T &buffer)
	{
		return read(&buffer, sizeof(T));
	}

	const void *map_read(size_t byte_size);

	template <typename T>
	const T *map_read(size_t byte_size)
	{
		return static_cast<const T *>(map_read(byte_size));
	}

	bool read(void *buffer, size_t size);
	bool map_string_iterate(const char *&str);
	bool map_string_absolute(const char *&str, size_t offset) const;
	bool seek(size_t offset);
	bool skip(size_t count);

	size_t get_offset() const;
	size_t get_size() const;
	MemoryStream create_substream(size_t offset, size_t size) const;
	MemoryStream create_substream(size_t offset) const;

private:
	const uint8_t *blob = nullptr;
	size_t blob_size = 0;
	size_t blob_offset = 0;
};
} // namespace dxil_spv