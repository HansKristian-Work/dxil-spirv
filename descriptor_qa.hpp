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

#include <stdint.h>
#include "spirv.hpp"

namespace dxil_spv
{
static constexpr uint32_t Version = 1;

struct DescriptorQAInfo
{
	uint32_t version = 0;
	uint32_t global_desc_set = 0;
	uint32_t global_binding = 0;
	uint32_t heap_desc_set = 0;
	uint32_t heap_binding = 0;
	uint64_t shader_hash = 0;
};

enum DescriptorQATypeFlagBits
{
	DESCRIPTOR_QA_TYPE_NONE_BIT = 0,
	DESCRIPTOR_QA_TYPE_SAMPLED_IMAGE_BIT = 1 << 0,
	DESCRIPTOR_QA_TYPE_STORAGE_IMAGE_BIT = 1 << 1,
	DESCRIPTOR_QA_TYPE_UNIFORM_BUFFER_BIT = 1 << 2,
	DESCRIPTOR_QA_TYPE_STORAGE_BUFFER_BIT = 1 << 3,
	DESCRIPTOR_QA_TYPE_UNIFORM_TEXEL_BUFFER_BIT = 1 << 4,
	DESCRIPTOR_QA_TYPE_STORAGE_TEXEL_BUFFER_BIT = 1 << 5,
	DESCRIPTOR_QA_TYPE_RT_ACCELERATION_STRUCTURE_BIT = 1 << 6,
	DESCRIPTOR_QA_TYPE_SAMPLER_BIT = 1 << 7,
	DESCRIPTOR_QA_TYPE_RAW_VA_BIT = 1 << 8
};
using DescriptorQATypeFlags = uint32_t;

enum class DescriptorQAGlobalMembers
{
	FailedShaderHash = 0,
	FailedOffset,
	FailedHeap,
	FailedCookie,
	FaultAtomic,
	FailedInstruction,
	FailedDescriptorTypeMask,
	ActualDescriptorTypeMask,
	FaultType,
	LiveStatusTable
};

enum DescriptorQAFaultTypeBits
{
	DESCRIPTOR_QA_FAULT_INDEX_OUT_OF_RANGE_BIT = 1 << 0,
	DESCRIPTOR_QA_FAULT_INVALID_TYPE_BIT = 1 << 1,
	DESCRIPTOR_QA_FAULT_RESOURCE_DESTROYED_BIT = 1 << 2
};

enum class DescriptorQAHeapMembers
{
	DescriptorCount = 0,
	HeapIndex,
	CookiesDescriptorInfo
};

class SPIRVModule;
spv::Id build_descriptor_qa_check_function(SPIRVModule &module);
}
