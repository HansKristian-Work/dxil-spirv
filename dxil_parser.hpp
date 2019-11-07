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