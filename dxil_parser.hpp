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
	bool parse_container(const void *data, size_t size, bool reflection);
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

bool is_mangled_entry_point(const char *user);
String demangle_entry_point(const String &entry);
} // namespace dxil_spv
