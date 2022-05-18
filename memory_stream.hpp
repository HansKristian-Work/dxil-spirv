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
