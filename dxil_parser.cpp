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

Vector<RDATSubobject> &DXILContainerParser::get_rdat_subobjects()
{
	return rdat_subobjects;
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

		const char *semantic_name;
		if (!stream.map_string_iterate(semantic_name))
			return false;
		elements[i].semantic_name = semantic_name;
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

	MemoryStream string_buffer;
	MemoryStream index_buffer;
	MemoryStream raw_bytes;

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
		case DXIL::RuntimeDataPartType::StringBuffer:
		{
			string_buffer = substream.create_substream(substream.get_offset(), subpart_length);
			break;
		}

		case DXIL::RuntimeDataPartType::IndexArrays:
		{
			index_buffer = substream.create_substream(substream.get_offset(), subpart_length);
			break;
		}

		case DXIL::RuntimeDataPartType::RawBytes:
		{
			raw_bytes = substream.create_substream(substream.get_offset(), subpart_length);
			break;
		}

		case DXIL::RuntimeDataPartType::SubobjectTable:
		{
			uint32_t record_count;
			uint32_t record_stride;
			if (!substream.read(record_count))
				return false;
			if (!substream.read(record_stride))
				return false;

			for (unsigned record = 0; record < record_count; record++)
			{
				auto record_stream =
						substream.create_substream(substream.get_offset() + record * record_stride, record_stride);

				DXIL::SubobjectKind kind;
				if (!record_stream.read(kind))
					return false;

				switch (kind)
				{
				case DXIL::SubobjectKind::StateObjectConfig:
				{
					uint32_t name_offset;
					if (!record_stream.read(name_offset))
						return false;

					const char *str = nullptr;
					if (!string_buffer.map_string_absolute(str, name_offset))
						return false;

					uint32_t flag;
					if (!record_stream.read(flag))
						return false;

					RDATSubobject elem = {};
					elem.kind = kind;
					elem.subobject_name = str;
					elem.args[0] = flag;
					rdat_subobjects.push_back(std::move(elem));
					break;
				}

				case DXIL::SubobjectKind::RaytracingShaderConfig:
				{
					uint32_t name_offset;
					if (!record_stream.read(name_offset))
						return false;

					const char *str;
					if (!string_buffer.map_string_absolute(str, name_offset))
						return false;

					uint32_t max_payload_size, max_attribute_size;
					if (!record_stream.read(max_payload_size))
						return false;
					if (!record_stream.read(max_attribute_size))
						return false;

					RDATSubobject elem = {};
					elem.kind = kind;
					elem.subobject_name = str;
					elem.args[0] = max_payload_size;
					elem.args[1] = max_attribute_size;
					rdat_subobjects.push_back(std::move(elem));
					break;
				}

				case DXIL::SubobjectKind::RaytracingPipelineConfig:
				case DXIL::SubobjectKind::RaytracingPipelineConfig1:
				{
					uint32_t name_offset;
					if (!record_stream.read(name_offset))
						return false;

					const char *str;
					if (!string_buffer.map_string_absolute(str, name_offset))
						return false;

					uint32_t max_recursion_depth;
					uint32_t flags = 0;

					if (!record_stream.read(max_recursion_depth))
						return false;

					if (kind == DXIL::SubobjectKind::RaytracingPipelineConfig1)
						if (!record_stream.read(flags))
							return false;

					RDATSubobject elem = {};
					elem.kind = kind;
					elem.subobject_name = str;
					elem.args[0] = max_recursion_depth;
					elem.args[1] = flags;
					rdat_subobjects.push_back(std::move(elem));
					break;
				}

				case DXIL::SubobjectKind::HitGroup:
				{
					uint32_t name_offset;
					if (!record_stream.read(name_offset))
						return false;

					const char *hg_name;
					if (!string_buffer.map_string_absolute(hg_name, name_offset))
						return false;

					DXIL::HitGroupType hit_group_type;
					if (!record_stream.read(hit_group_type))
						return false;

					uint32_t ahit_name_offset, chit_name_offset, intersection_name_offset;
					if (!record_stream.read(ahit_name_offset))
						return false;
					if (!record_stream.read(chit_name_offset))
						return false;
					if (!record_stream.read(intersection_name_offset))
						return false;

					const char *ahit, *chit, *intersection;
					if (!string_buffer.map_string_absolute(ahit, ahit_name_offset))
						return false;
					if (!string_buffer.map_string_absolute(chit, chit_name_offset))
						return false;
					if (!string_buffer.map_string_absolute(intersection, intersection_name_offset))
						return false;

					RDATSubobject elem = {};
					elem.kind = kind;
					elem.subobject_name = hg_name;
					elem.hit_group_type = hit_group_type;
					elem.exports = { ahit, chit, intersection };
					rdat_subobjects.push_back(std::move(elem));
					break;
				}

				case DXIL::SubobjectKind::SubobjectToExportsAssociation:
				{
					RDATSubobject elem = {};
					elem.kind = kind;
					uint32_t name_offset;

					if (!record_stream.read(name_offset))
						return false;

					const char *name;
					if (!string_buffer.map_string_absolute(name, name_offset))
						return false;

					elem.subobject_name = name;

					if (!record_stream.read(name_offset))
						return false;
					const char *object_name;
					if (!string_buffer.map_string_absolute(object_name, name_offset))
						return false;

					elem.exports.push_back(object_name);

					uint32_t index_offset;
					if (!record_stream.read(index_offset))
						return false;

					auto index_substream = index_buffer.create_substream(sizeof(uint32_t) * index_offset);
					uint32_t count;
					if (!index_substream.read(count))
						return false;

					for (uint32_t export_index = 0; export_index < count; export_index++)
					{
						if (!index_substream.read(name_offset))
							return false;
						if (!string_buffer.map_string_absolute(object_name, name_offset))
							return false;
						elem.exports.push_back(object_name);
					}

					rdat_subobjects.push_back(std::move(elem));
					break;
				}

				case DXIL::SubobjectKind::GlobalRootSignature:
				case DXIL::SubobjectKind::LocalRootSignature:
				{
					uint32_t name_offset;

					if (!record_stream.read(name_offset))
						return false;

					const char *name;
					if (!string_buffer.map_string_absolute(name, name_offset))
						return false;

					uint32_t byte_offset;
					uint32_t byte_size;
					if (!record_stream.read(byte_offset))
						return false;
					if (!record_stream.read(byte_size))
						return false;

					auto name_substream = raw_bytes.create_substream(byte_offset, byte_size);
					auto *data = name_substream.map_read<uint8_t>(byte_size);

					RDATSubobject elem = {};
					elem.kind = kind;
					elem.subobject_name = name;
					elem.payload = data;
					elem.payload_size = byte_size;
					rdat_subobjects.push_back(std::move(elem));
					break;
				}

				default:
					break;
				}
			}
			break;
		}

		default:
			break;
		}
	}

	return true;
}

bool DXILContainerParser::parse_container(const void *data, size_t size, bool reflection)
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

		auto fourcc = static_cast<DXIL::FourCC>(part_header.part_fourcc);
		switch (fourcc)
		{
		case DXIL::FourCC::DXIL:
		case DXIL::FourCC::ShaderStatistics:
		{
			DXIL::FourCC expected = reflection ? DXIL::FourCC::ShaderStatistics : DXIL::FourCC::DXIL;
			if (expected != fourcc)
				break;

			// The STAT block includes a DXIL blob that is literally the same DXIL IR
			// minus code + string names in the metadata chunks ... <__________________________________<
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
