#include "dxil_parser.hpp"
#include "dxil.hpp"
#include "memory_stream.hpp"
#include <vector>
#include <stdio.h>

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
			printf("Input signature\n");
			break;

		case DXIL::FourCC::OutputSignature:
			printf("Output signature\n");
			break;

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
}