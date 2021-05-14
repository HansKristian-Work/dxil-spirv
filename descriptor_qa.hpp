/*
 * Copyright 2021 Hans-Kristian Arntzen for Valve Corporation
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