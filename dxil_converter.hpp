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
#include <memory>

namespace spv
{
class Function;
}

namespace dxil_spv
{
struct ConvertedFunction
{
	CFGNode *entry;

	struct LeafFunction
	{
		CFGNode *entry;
		spv::Function *func;
	};
	Vector<LeafFunction> leaf_functions;
	std::unique_ptr<CFGNodePool> node_pool;
};

enum class ShaderStage : unsigned
{
	Unknown = 0,
	Vertex = 1,
	Hull = 2,
	Domain = 3,
	Geometry = 4,
	Pixel = 5,
	Compute = 6
};

struct D3DBinding
{
	ShaderStage stage;
	DXIL::ResourceKind kind;

	// The index in which the resource was declared in the module.
	// Range is [0, N), where N is number of resources.
	unsigned resource_index;

	// : register(N, spaceM)
	unsigned register_space;
	unsigned register_index;

	// -1 -> unsized, 1 means non-arrayed resource.
	unsigned range_size;

	// For raw buffers, this is equal to 16, for structured buffers this is equal to the stride of the elements.
	// Otherwise, 0.
	unsigned alignment;
};

enum class VulkanDescriptorType : unsigned
{
	Identity = 0,
	SSBO = 1,
	TexelBuffer = 2
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

	VulkanDescriptorType descriptor_type;
};

struct D3DUAVBinding
{
	D3DBinding binding;
	bool counter;
};

struct VulkanSRVBinding
{
	VulkanBinding buffer_binding;
	VulkanBinding offset_binding;
};

struct VulkanUAVBinding
{
	VulkanBinding buffer_binding;
	VulkanBinding counter_binding;
	VulkanBinding offset_binding;
};

struct VulkanPushConstantBinding
{
	unsigned offset_in_words;
};

struct VulkanCBVBinding
{
	union {
		VulkanBinding buffer;
		VulkanPushConstantBinding push;
	};

	// Select if the CBV should fetch constants from push constants, or regular UBO.
	bool push_constant;
};

struct D3DVertexInput
{
	const char *semantic;
	unsigned semantic_index;
	unsigned start_row;
	unsigned rows;
};

struct VulkanVertexInput
{
	unsigned location;
};

struct D3DStreamOutput
{
	const char *semantic;
	unsigned semantic_index;
};

struct VulkanStreamOutput
{
	unsigned offset;
	unsigned stride;
	unsigned buffer_index;
	bool enable;
};

class ResourceRemappingInterface
{
public:
	virtual ~ResourceRemappingInterface() = default;
	virtual bool remap_srv(const D3DBinding &d3d_binding, VulkanSRVBinding &vulkan_binding) = 0;
	virtual bool remap_sampler(const D3DBinding &d3d_binding, VulkanBinding &vulkan_binding) = 0;
	virtual bool remap_uav(const D3DUAVBinding &d3d_binding, VulkanUAVBinding &vulkan_binding) = 0;
	virtual bool remap_cbv(const D3DBinding &d3d_binding, VulkanCBVBinding &vulkan_binding) = 0;
	virtual bool remap_vertex_input(const D3DVertexInput &d3d_input, VulkanVertexInput &vulkan_location) = 0;
	virtual bool remap_stream_output(const D3DStreamOutput &d3d_output, VulkanStreamOutput &vulkan_output) = 0;
	virtual unsigned get_root_constant_word_count() = 0;
};

enum class Option : uint32_t
{
	Invalid = 0,
	ShaderDemoteToHelper = 1,
	DualSourceBlending = 2,
	OutputSwizzle = 3,
	RasterizerSampleCount = 4,
	RootConstantInlineUniformBlock = 5,
	BindlessCBVSSBOEmulation = 6,
	PhysicalStorageBuffer = 7,
	SBTDescriptorSizeLog2 = 8,
	SSBOAlignment = 9
};

enum class ResourceClass : uint32_t
{
	SRV = 0,
	UAV = 1,
	CBV = 2,
	Sampler = 3
};

struct OptionBase
{
	explicit OptionBase(Option cap)
	    : type(cap)
	{
	}
	Option type;
};

struct OptionShaderDemoteToHelper : OptionBase
{
	OptionShaderDemoteToHelper()
	    : OptionBase(Option::ShaderDemoteToHelper)
	{
	}
	bool supported = false;
};

struct OptionDualSourceBlending : OptionBase
{
	OptionDualSourceBlending()
	    : OptionBase(Option::DualSourceBlending)
	{
	}
	bool enabled = false;
};

struct OptionOutputSwizzle : OptionBase
{
	OptionOutputSwizzle()
	    : OptionBase(Option::OutputSwizzle)
	{
	}
	const unsigned *swizzles = nullptr;
	unsigned swizzle_count = 0;
};

struct OptionRasterizerSampleCount : OptionBase
{
	OptionRasterizerSampleCount()
	    : OptionBase(Option::RasterizerSampleCount)
	{
	}
	unsigned count = 0;
	bool spec_constant = false;
};

struct OptionRootConstantInlineUniformBlock : OptionBase
{
	OptionRootConstantInlineUniformBlock()
	    : OptionBase(Option::RootConstantInlineUniformBlock)
	{
	}
	unsigned desc_set = 0;
	unsigned binding = 0;
	bool enable = false;
};

struct OptionBindlessCBVSSBOEmulation : OptionBase
{
	OptionBindlessCBVSSBOEmulation()
	    : OptionBase(Option::BindlessCBVSSBOEmulation)
	{
	}
	bool enable = false;
};

struct OptionPhysicalStorageBuffer : OptionBase
{
	OptionPhysicalStorageBuffer()
	    : OptionBase(Option::PhysicalStorageBuffer)
	{
	}
	bool enable = false;
};

struct OptionSBTDescriptorSizeLog2 : OptionBase
{
	OptionSBTDescriptorSizeLog2()
		: OptionBase(Option::SBTDescriptorSizeLog2)
	{
	}
	unsigned size_log2_srv_uav_cbv = 0;
	unsigned size_log2_sampler = 0;
};

struct OptionSSBOAlignment : OptionBase
{
	OptionSSBOAlignment()
		: OptionBase(Option::SSBOAlignment)
	{
	}
	unsigned alignment = 1;
};

class Converter
{
public:
	Converter(LLVMBCParser &bitcode_parser, SPIRVModule &module);
	~Converter();
	ConvertedFunction convert_entry_point();
	void set_resource_remapping_interface(ResourceRemappingInterface *iface);

	static ShaderStage get_shader_stage(const LLVMBCParser &bitcode_parser);
	static void scan_resources(ResourceRemappingInterface *iface, const LLVMBCParser &bitcode_parser);

	void add_option(const OptionBase &cap);
	static bool recognizes_option(Option cap);

	// These are declared separately since we need to declare a concrete physical buffer layout
	// for local root signature elements which depends on the entire local root signature.
	// It would get somewhat awkward to shoehorn this into the resource "pull" API for normal resources.

	void add_local_root_constants(uint32_t register_space, uint32_t register_index, uint32_t num_words);
	void add_local_root_descriptor(ResourceClass type, uint32_t register_space, uint32_t register_index);

	// Local root descriptor tables are special. They must be constructed in such a way that
	// the MSB 32 bits can be ignored and the LSB 32 bits are encoded as Index << SBTDescriptorSizeLog2.
	// Thus, we translate GPU VA to index by a simple shift on the lower 32-bit value.
	void add_local_root_descriptor_table(ResourceClass type, uint32_t register_space, uint32_t register_index,
	                                     uint32_t num_descriptors_in_range, uint32_t offset_in_heap);

	struct Impl;

private:
	std::unique_ptr<Impl> impl;
};
} // namespace dxil_spv