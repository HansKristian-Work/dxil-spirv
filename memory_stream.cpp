/*
 * Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
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

#include "memory_stream.hpp"
#include <string.h>

namespace DXIL2SPIRV
{
MemoryStream::MemoryStream(const void *blob_, size_t size)
	: blob(static_cast<const uint8_t *>(blob_)), blob_size(size)
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

bool MemoryStream::read_string(std::string &str)
{
	str.clear();

	for (;;)
	{
		char c;
		if (!read(c))
			return false;
		else if (c == '\0')
			return true;
		else
			str += c;
	}
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
	if (offset + size > blob_size)
		return { nullptr, 0 };
	else
		return { blob + offset, size };
}

MemoryStream MemoryStream::create_substream(size_t offset) const
{
	if (offset > blob_size)
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

}