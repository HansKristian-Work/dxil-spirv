#pragma once

#include <stddef.h>
#include <stdint.h>

namespace DXIL2SPIRV
{
class MemoryStream
{
public:
	MemoryStream(const void *blob, size_t size);

	void reset();

	template <typename T>
	bool read(T &buffer)
	{
		return read(&buffer, sizeof(T));
	}

	bool read(void *buffer, size_t size);
	bool seek(size_t offset);

	size_t get_offset() const;
	size_t get_size() const;
	MemoryStream create_substream(size_t offset, size_t size) const;
	MemoryStream create_substream(size_t offset) const;

private:
	const uint8_t *blob;
	size_t blob_size;
	size_t blob_offset = 0;
};
}