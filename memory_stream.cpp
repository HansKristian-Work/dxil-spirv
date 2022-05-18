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

#include "memory_stream.hpp"
#include <string.h>

namespace dxil_spv
{
MemoryStream::MemoryStream(const void *blob_, size_t size)
    : blob(static_cast<const uint8_t *>(blob_))
    , blob_size(size)
{
}

void MemoryStream::reset()
{
	blob_offset = 0;
}

bool MemoryStream::read(void *buffer, size_t size)
{
	if (blob_offset + size > blob_size)
		return false;

	memcpy(buffer, blob + blob_offset, size);
	blob_offset += size;
	return true;
}

const void *MemoryStream::map_read(size_t size)
{
	if (blob_offset + size > blob_size)
		return nullptr;

	const void *mapped = blob + blob_offset;
	blob_offset += size;
	return mapped;
}

bool MemoryStream::map_string_iterate(const char *&str)
{
	// Strings are C strings and can be mapped 1:1.
	// Just need to verify they terminate properly.
	str = reinterpret_cast<const char *>(blob + blob_offset);
	char c;

	do
	{
		if (!read(c))
			return false;
		else if (c == '\0')
			break;
	} while (c != '\0');

	return true;
}

bool MemoryStream::map_string_absolute(const char *&str, size_t offset) const
{
	auto substream = create_substream(offset);
	return substream.map_string_iterate(str);
}

bool MemoryStream::seek(size_t new_offset)
{
	if (new_offset > blob_size)
		return false;

	blob_offset = new_offset;
	return true;
}

bool MemoryStream::skip(size_t count)
{
	return seek(blob_offset + count);
}

MemoryStream MemoryStream::create_substream(size_t offset, size_t size) const
{
	if (offset >= blob_size || offset + size > blob_size)
		return { nullptr, 0 };
	else
		return { blob + offset, size };
}

MemoryStream MemoryStream::create_substream(size_t offset) const
{
	if (offset >= blob_size)
		return { nullptr, 0 };
	else
		return { blob + offset, blob_size - offset };
}

size_t MemoryStream::get_offset() const
{
	return blob_offset;
}

size_t MemoryStream::get_size() const
{
	return blob_size;
}

} // namespace dxil_spv
