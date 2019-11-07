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
#include <string>

namespace DXIL
{
constexpr size_t ContainerHashSize = 16;

struct ContainerHeader
{
	uint32_t header_fourcc;
	uint8_t digest[ContainerHashSize];
	uint16_t major_version;
	uint16_t minor_version;
	uint32_t container_size_in_bytes;
	uint32_t part_count;
};

struct PartHeader
{
	uint32_t part_fourcc;
	uint32_t part_size;
};

struct ProgramHeader
{
	uint32_t program_version;
	uint32_t size_in_uint32;
	uint32_t dxil_magic;
	uint32_t dxil_version;
	uint32_t bitcode_offset;
	uint32_t bitcode_size;
};

struct IOElement
{
	std::string semantic_name;
	uint32_t stream_index;
	uint32_t semantic_index;
	uint32_t system_value_semantic;
	uint32_t component_type;
	uint32_t register_index;
	uint32_t mask;
	uint32_t min_precision;
};

constexpr uint32_t fourcc(uint32_t a, uint32_t b, uint32_t c, uint32_t d)
{
	return a | (b << 8) | (c << 16) | (d << 24);
}

enum class FourCC : uint32_t
{
	Container = fourcc('D', 'X', 'B', 'C'),
	ResourceDef = fourcc('R', 'D', 'E', 'F'),
	InputSignature = fourcc('I', 'S', 'G', '1'),
	OutputSignature = fourcc('O', 'S', 'G', '1'),
	PatchConstantSignature = fourcc('P', 'S', 'G', '1'),
	ShaderStatistics = fourcc('S', 'T', 'A', 'T'),
	ShaderDebugInfoDXIL = fourcc('I', 'L', 'D', 'B'),
	ShaderDebugName = fourcc('I', 'L', 'D', 'N'),
	FeatureInfo = fourcc('S', 'F', 'I', '0'),
	PrivateData = fourcc('P', 'R', 'I', 'V'),
	RootSignature = fourcc('R', 'T', 'S', '0'),
	DXIL = fourcc('D', 'X', 'I', 'L'),
	PipelineStateValidation = fourcc('P', 'S', 'V', '0'),
	RuntimeData = fourcc('R', 'D', 'A', 'T'),
	ShaderHash = fourcc('H', 'A', 'S', 'H')
};
} // namespace DXIL
