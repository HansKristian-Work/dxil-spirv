#pragma once

#include <stddef.h>
#include <stdint.h>
#include <vector>
#include "dxil.hpp"

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
	std::vector<DXIL::IOElement> input_elements;
	std::vector<DXIL::IOElement> output_elements;

	bool parse_dxil(MemoryStream &stream);
	bool parse_iosg1(MemoryStream &stream, std::vector<DXIL::IOElement> &elements);
};
}