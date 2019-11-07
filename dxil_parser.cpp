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

#include "dxil_parser.hpp"
#include "dxil.hpp"
#include "memory_stream.hpp"
#include <stdio.h>
#include <vector>

namespace DXIL2SPIRV
{
const void *DXILContainerParser::get_bitcode_data() const
{
	return dxil_blob.data();
}

size_t DXILContainerParser::get_bitcode_size() const
{
	return dxil_blob.size();
}

bool DXILContainerParser::parse_dxil(MemoryStream &stream)
{
	DXIL::ProgramHeader program_header;
	if (!stream.read(program_header))
		return false;

	if (static_cast<DXIL::FourCC>(program_header.dxil_magic) != DXIL::FourCC::DXIL)
		return false;

	if (program_header.bitcode_offset < 16)
		return false;

	auto substream = stream.create_substream(stream.get_offset() + program_header.bitcode_offset - 16);

	dxil_blob.resize(substream.get_size());
	if (!substream.read(dxil_blob.data(), substream.get_size()))
		return false;

	return true;
}

bool DXILContainerParser::parse_iosg1(MemoryStream &stream, std::vector<DXIL::IOElement> &elements)
{
	uint32_t element_count;
	if (!stream.read(element_count))
		return false;

	if (!stream.skip(sizeof(uint32_t)))
		return false;

	elements.resize(element_count);
	for (uint32_t i = 0; i < element_count; i++)
	{
		if (!stream.read(elements[i].stream_index))
			return false;

		uint32_t string_offset;
		if (!stream.read(string_offset))
			return false;

		if (!stream.read(elements[i].semantic_index))
			return false;
		if (!stream.read(elements[i].system_value_semantic))
			return false;
		if (!stream.read(elements[i].component_type))
			return false;
		if (!stream.read(elements[i].register_index))
			return false;
		if (!stream.read(elements[i].mask))
			return false;
		if (!stream.read(elements[i].min_precision))
			return false;

		size_t offset = stream.get_offset();
		if (!stream.seek(string_offset))
			return false;
		if (!stream.read_string(elements[i].semantic_name))
			return false;
		if (!stream.seek(offset))
			return false;
	}

	return true;
}

bool DXILContainerParser::parse_container(const void *data, size_t size)
{
	MemoryStream stream(data, size);

	DXIL::ContainerHeader container_header;
	if (!stream.read(container_header))
		return false;

	if (static_cast<DXIL::FourCC>(container_header.header_fourcc) != DXIL::FourCC::Container)
		return false;
	if (container_header.container_size_in_bytes > size)
		return false;

	std::vector<uint32_t> parts(container_header.part_count);
	for (uint32_t i = 0; i < container_header.part_count; i++)
	{
		if (!stream.read(parts[i]))
			return false;
	}

	for (auto &part_offset : parts)
	{
		if (!stream.seek(part_offset))
			return false;

		DXIL::PartHeader part_header;
		if (!stream.read(part_header))
			return false;

		switch (static_cast<DXIL::FourCC>(part_header.part_fourcc))
		{
		case DXIL::FourCC::DXIL:
		{
			auto substream = stream.create_substream(stream.get_offset(), part_header.part_size);
			if (!parse_dxil(substream))
				return false;
			break;
		}

		case DXIL::FourCC::FeatureInfo:
			printf("FeatureInfo\n");
			break;

		case DXIL::FourCC::InputSignature:
		{
			auto substream = stream.create_substream(stream.get_offset(), part_header.part_size);
			if (!parse_iosg1(substream, input_elements))
				return false;
			break;
		}

		case DXIL::FourCC::OutputSignature:
		{
			auto substream = stream.create_substream(stream.get_offset(), part_header.part_size);
			if (!parse_iosg1(substream, output_elements))
				return false;
			break;
		}

		case DXIL::FourCC::PatchConstantSignature:
			printf("Patch constant signature\n");
			break;

		case DXIL::FourCC::PrivateData:
			printf("Private data\n");
			break;

		case DXIL::FourCC::RootSignature:
			printf("Root signature\n");
			break;

		case DXIL::FourCC::PipelineStateValidation:
			printf("Pipeline state validation\n");
			break;

		case DXIL::FourCC::ResourceDef:
			printf("ResourceDef\n");
			break;

		case DXIL::FourCC::ShaderStatistics:
			printf("ShaderStatistics\n");
			break;

		case DXIL::FourCC::ShaderHash:
			printf("ShaderHash\n");
			break;

		default:
			printf("Some fourcc ...\n");
			break;
		}
	}

	return true;
}
} // namespace DXIL2SPIRV