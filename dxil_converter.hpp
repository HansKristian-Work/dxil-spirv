/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

#include "cfg_structurizer.hpp"
#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include "node_pool.hpp"
//#include "spirv_module.hpp"
#include <memory>

namespace spv
{
class Function;
}

namespace DXIL2SPIRV
{
struct ConvertedFunction
{
	CFGNode *entry;

	struct LeafFunction
	{
		CFGNode *entry;
		spv::Function *func;
	};
	std::vector<LeafFunction> leaf_functions;
	std::unique_ptr<CFGNodePool> node_pool;
};

struct D3DBinding
{
	// The index in which the resource was declared in the module.
	// Range is [0, N), where N is number of resources.
	unsigned resource_index;

	// : register(N, spaceM)
	unsigned register_space;
	unsigned register_index;

	// -1 -> unsized, 1 means non-arrayed resource.
	unsigned range_size;
};

struct VulkanBinding
{
	unsigned descriptor_set;
	unsigned binding;

	struct
	{
		unsigned root_constant_word;
		unsigned heap_root_offset;

		// If true, the resource is accessed directly from a descriptor heap in way which emulates D3D12 closely.
		// layout(set = descriptor_set, binding = binding) uniform Type HEAP[];
		// HEAP[shader_index + heap_offset + registers.u32s[push_constant_member]].
		bool use_heap;
	} bindless;
};

struct D3DUAVBinding
{
	D3DBinding binding;
	bool counter;
};

struct VulkanUAVBinding
{
	VulkanBinding buffer_binding;
	VulkanBinding counter_binding;
};

struct VulkanPushConstantBinding
{
	unsigned offset_in_words;
};

struct VulkanCBVBinding
{
	union
	{
		VulkanBinding buffer;
		VulkanPushConstantBinding push;
	};

	// Select if the CBV should fetch constants from push constants, or regular UBO.
	bool push_constant;
};

struct D3DVertexInput
{
	const char *semantic;
	unsigned index;
	unsigned rows;
};

struct VulkanVertexInput
{
	unsigned location;
};

class ResourceRemappingInterface
{
public:
	virtual ~ResourceRemappingInterface() = default;
	virtual bool remap_srv(const D3DBinding &d3d_binding, VulkanBinding &vulkan_binding) = 0;
	virtual bool remap_sampler(const D3DBinding &d3d_binding, VulkanBinding &vulkan_binding) = 0;
	virtual bool remap_uav(const D3DUAVBinding &d3d_binding, VulkanUAVBinding &vulkan_binding) = 0;
	virtual bool remap_cbv(const D3DBinding &d3d_binding, VulkanCBVBinding &vulkan_binding) = 0;
	virtual bool remap_vertex_input(const D3DVertexInput &d3d_input, VulkanVertexInput &vulkan_location) = 0;
	virtual unsigned get_root_constant_word_count() = 0;
};

class Converter
{
public:
	Converter(LLVMBCParser &bitcode_parser, SPIRVModule &module);
	~Converter();
	ConvertedFunction convert_entry_point();
	void set_resource_remapping_interface(ResourceRemappingInterface *iface);

	struct Impl;

private:
	std::unique_ptr<Impl> impl;
};
} // namespace DXIL2SPIRV