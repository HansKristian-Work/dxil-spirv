#pragma once

#include <stddef.h>
#include <stdint.h>
#include <vector>

namespace DXIL2SPIRV
{
class MemoryStream;

class DXILContainerParser
{
public:
	bool parse_container(const void *data, size_t size);

	const void *get_bitcode_data() const;
	size_t get_bitcode_size() const;

private:
	std::vector<uint8_t> dxil_blob;
	bool parse_dxil(MemoryStream &stream);
};
}