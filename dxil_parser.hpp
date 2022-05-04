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

#pragma once

#include "thread_local_allocator.hpp"
#include "dxil.hpp"
#include <stddef.h>
#include <stdint.h>

namespace dxil_spv
{
class MemoryStream;

struct RDATSubobject
{
	// All strings point directly to the DXBC blob and the pointers are not owned.
	DXIL::SubobjectKind kind;

	// All subobjects have a variable name as declared in the shader.
	const char *subobject_name;

	// All exports.
	// For hit groups, 3 strings: AnyHit, ClosestHit, Intersection. Strings may be empty if not used.
	// For SubobjectToExportsAssociation: N strings. exports[0] is associated with the following exports.
	DXIL::HitGroupType hit_group_type;
	Vector<const char *> exports;

	// For StateObjectConfig, RaytracingShaderConfig, RaytracingPipelineConfig(1).
	// Each element is in struct order.
	uint32_t args[2];

	// For Global/Local Root Signatures.
	const uint8_t *payload;
	size_t payload_size;
};

class DXILContainerParser
{
public:
	bool parse_container(const void *data, size_t size);
	Vector<uint8_t> &get_blob();
	Vector<RDATSubobject> &get_rdat_subobjects();

private:
	Vector<uint8_t> dxil_blob;
	Vector<DXIL::IOElement> input_elements;
	Vector<DXIL::IOElement> output_elements;
	Vector<RDATSubobject> rdat_subobjects;

	bool parse_dxil(MemoryStream &stream);
	bool parse_iosg1(MemoryStream &stream, Vector<DXIL::IOElement> &elements);
	bool parse_rdat(MemoryStream &stream);
};
} // namespace dxil_spv