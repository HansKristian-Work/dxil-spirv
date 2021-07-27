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

#include "dxil_parser.hpp"
#include "dxil.hpp"
#include "memory_stream.hpp"
#include "logging.hpp"
#include <stdio.h>
#include <vector>

namespace dxil_spv
{
Vector<uint8_t> &DXILContainerParser::get_blob()
{
	return dxil_blob;
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

bool DXILContainerParser::parse_iosg1(MemoryStream &stream, Vector<DXIL::IOElement> &elements)
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

bool DXILContainerParser::parse_rdat(MemoryStream &stream)
{
	uint32_t version, part_count;
	if (!stream.read(version))
		return false;
	if (!stream.read(part_count))
		return false;

	constexpr uint32_t RDAT_Version = 0x10;
	if (version != RDAT_Version)
		return false;

	Vector<uint32_t> offsets(part_count);
	for (uint32_t i = 0; i < part_count; i++)
		if (!stream.read(offsets[i]))
			return false;

	for (uint32_t i = 0; i < part_count; i++)
	{
		if (offsets[i] + 2 * sizeof(uint32_t) > stream.get_size())
			return false;

		uint32_t part_size = i + 1 < part_count ?
		                     (offsets[i + 1] - offsets[i]) :
		                     uint32_t(stream.get_size() - offsets[i]);
		auto substream = stream.create_substream(offsets[i], part_size);

		DXIL::RuntimeDataPartType type;
		if (!substream.read(type))
			return false;
		uint32_t subpart_length;
		if (!substream.read(subpart_length))
			return false;
		if (subpart_length + 2 * sizeof(uint32_t) > substream.get_size())
			return false;

		switch (type)
		{
		case DXIL::RuntimeDataPartType::SubobjectTable:
		{
			// TODO: Report any findings of SubobjectTable with failure so we
			// know where to look.
			LOGE("TODO: RDAT SubobjectTable is not handled! RTPSO creation will likely fail.\n");
			return false;
#if 0
			uint32_t record_count;
			uint32_t record_stride;
			if (!substream.read(record_count))
				return false;
			if (!substream.read(record_stride))
				return false;
			break;
#endif
		}

		default:
			break;
		}
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

	Vector<uint32_t> parts(container_header.part_count);
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
			break;

		case DXIL::FourCC::PrivateData:
			break;

		case DXIL::FourCC::RootSignature:
			break;

		case DXIL::FourCC::PipelineStateValidation:
			break;

		case DXIL::FourCC::ResourceDef:
			break;

		case DXIL::FourCC::ShaderStatistics:
			break;

		case DXIL::FourCC::ShaderHash:
			break;

		case DXIL::FourCC::RuntimeData:
		{
			auto substream = stream.create_substream(stream.get_offset(), part_header.part_size);
			if (!parse_rdat(substream))
				return false;
			break;
		}

		default:
			break;
		}
	}

	return true;
}
} // namespace dxil_spv