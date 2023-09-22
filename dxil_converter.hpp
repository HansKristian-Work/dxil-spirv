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
	Compute = 6,
	Intersection = 7,
	ClosestHit = 8,
	Miss = 9,
	AnyHit = 10,
	RayGeneration = 11,
	Callable = 12,
	Amplification = 13,
	Mesh = 14,
};

struct D3DBinding
{
	ShaderStage stage;
	DXIL::ResourceKind kind;

	// The index in which the resource was declared in the module.
	// Range is [0, N), where N is number of resources.
	unsigned resource_index;

	// : register(N, spaceM)
	// If register(UINT32_MAX, UINT32_MAX) with range_size = UINT32_MAX is used, this is treated
	// as a binding of the global descriptor heap.
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
	TexelBuffer = 2,
	BufferDeviceAddress = 3,
	UBO = 4
};

struct VulkanBinding
{
	unsigned descriptor_set;
	unsigned binding;

	// For bindless, refers to the Nth root constant.
	// For buffer device address, refers to the Nth root descriptor.
	unsigned root_constant_index;

	struct
	{
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

struct D3DStageIO
{
	const char *semantic;
	unsigned semantic_index;
	unsigned start_row;
	unsigned rows;
};

enum VulkanStageIoFlagBits
{
	STAGE_IO_NONE = 0u,
	STAGE_IO_PER_PRIMITIVE = 0x1u,
};

using VulkanStageIoFlags = unsigned;

struct VulkanStageIO
{
	unsigned location;
	unsigned component;
	VulkanStageIoFlags flags;
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
	virtual bool remap_vertex_input(const D3DStageIO &d3d_input, VulkanStageIO &vulkan_location) = 0;
	virtual bool remap_stream_output(const D3DStreamOutput &d3d_output, VulkanStreamOutput &vulkan_output) = 0;
	virtual bool remap_stage_input(const D3DStageIO &d3d_input, VulkanStageIO &vk_input) = 0;
	virtual bool remap_stage_output(const D3DStageIO &d3d_output, VulkanStageIO &vk_output) = 0;
	virtual unsigned get_root_constant_word_count() = 0;
	virtual unsigned get_root_descriptor_count() = 0;
	virtual bool has_nontrivial_stage_input_remapping() = 0;
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
	SSBOAlignment = 9,
	TypedUAVReadWithoutFormat = 10,
	ShaderSourceFile = 11,
	BindlessTypedBufferOffsets = 12,
	BindlessOffsetBufferLayout = 13,
	StorageInputOutput16 = 14,
	DescriptorQA = 15,
	MinPrecisionNative16Bit = 16,
	ShaderI8Dot = 17,
	ShaderRayTracingPrimitiveCulling = 18,
	InvariantPosition = 19,
	ScalarBlockLayout = 20,
	BarycentricKHR = 21,
	RobustPhysicalCBVLoad = 22,
	ArithmeticRelaxedPrecision = 23,
	PhysicalAddressDescriptorIndexing = 24,
	ForceSubgroupSize = 25,
	DenormPreserveSupport = 26,
	StrictHelperLaneWaveOps = 27,
	SubgroupPartitionedNV = 28,
	DeadCodeEliminate = 29,
	PreciseControl = 30,
	SampleGradOptimizationControl = 31,
	Count
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
	DXIL_SPV_OVERRIDE_NEW_DELETE
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

struct OptionTypedUAVReadWithoutFormat : OptionBase
{
	OptionTypedUAVReadWithoutFormat()
		: OptionBase(Option::TypedUAVReadWithoutFormat)
	{
	}
	bool supported = false;
};

struct OptionShaderSourceFile : OptionBase
{
	OptionShaderSourceFile()
		: OptionBase(Option::ShaderSourceFile)
	{
	}
	String name;
};

struct OptionBindlessTypedBufferOffsets : OptionBase
{
	OptionBindlessTypedBufferOffsets()
		: OptionBase(Option::BindlessTypedBufferOffsets)
	{
	}
	bool enable = false;
};

struct OptionBindlessOffsetBufferLayout : OptionBase
{
	OptionBindlessOffsetBufferLayout()
		: OptionBase(Option::BindlessOffsetBufferLayout)
	{
	}

	unsigned untyped_offset = 0;
	unsigned typed_offset = 0;
	unsigned stride = 1;
};

struct OptionStorageInputOutput16 : OptionBase
{
	OptionStorageInputOutput16()
		: OptionBase(Option::StorageInputOutput16)
	{
	}

	bool supported = true;
};

struct OptionDescriptorQA : OptionBase
{
	OptionDescriptorQA()
		: OptionBase(Option::DescriptorQA)
	{
	}

	enum { DefaultVersion = 1 };

	bool enabled = false;
	uint32_t version = DefaultVersion;
	uint32_t global_desc_set = 0;
	uint32_t global_binding = 0;
	uint32_t heap_desc_set = 0;
	uint32_t heap_binding = 0;
	uint64_t shader_hash = 0;
};

struct OptionMinPrecisionNative16Bit : OptionBase
{
	OptionMinPrecisionNative16Bit()
		: OptionBase(Option::MinPrecisionNative16Bit)
	{
	}

	bool enabled = false;
};

struct OptionShaderI8Dot : OptionBase
{
	OptionShaderI8Dot()
		: OptionBase(Option::ShaderI8Dot)
	{
	}

	bool supported = false;
};

struct OptionShaderRayTracingPrimitiveCulling : OptionBase
{
	OptionShaderRayTracingPrimitiveCulling()
		: OptionBase(Option::ShaderRayTracingPrimitiveCulling)
	{
	}

	bool supported = false;
};

struct OptionInvariantPosition : OptionBase
{
	OptionInvariantPosition()
		: OptionBase(Option::InvariantPosition)
	{
	}

	bool enabled = false;
};

struct OptionScalarBlockLayout : OptionBase
{
	OptionScalarBlockLayout()
		: OptionBase(Option::ScalarBlockLayout)
	{
	}

	bool supported = false;
	bool supports_per_component_robustness = false;
};

struct OptionBarycentricKHR : OptionBase
{
	OptionBarycentricKHR()
		: OptionBase(Option::BarycentricKHR)
	{
	}

	bool supported = false;
};

struct OptionRobustPhysicalCBVLoad : OptionBase
{
	OptionRobustPhysicalCBVLoad()
		: OptionBase(Option::RobustPhysicalCBVLoad)
	{
	}

	bool enabled = false;
};

struct OptionArithmeticRelaxedPrecision : OptionBase
{
	OptionArithmeticRelaxedPrecision()
		: OptionBase(Option::ArithmeticRelaxedPrecision)
	{
	}

	bool enabled = false;
};

struct OptionPhysicalAddressDescriptorIndexing : OptionBase
{
	OptionPhysicalAddressDescriptorIndexing()
	    : OptionBase(Option::PhysicalAddressDescriptorIndexing)
	{
	}

	// In units of uint64_t addresses.
	// Used for scenarios where a descriptor buffer is bound directly as an SSBO
	// and raw VAs might not longer be tightly packed in memory.
	unsigned element_stride = 1;
	unsigned element_offset = 0;
};

struct OptionForceSubgroupSize : OptionBase
{
	OptionForceSubgroupSize()
	    : OptionBase(Option::ForceSubgroupSize)
	{
	}

	// If not 0, forces WaveGetLaneCount() to return a fixed value.
	// Can be used to force a shader to avoid buggy code paths.
	unsigned forced_value = 0;
	// If true and forced_value is not 0,
	// pretends that the shader exposes SM 6.6 WaveSize equal to forced_value.
	// Intended use case:
	// - false: Workaround and avoid bad subgroup code paths by setting forced_value to something meaningless.
	// - true: Performance tweaks. Force e.g. wave32 vs wave64 on RDNA.
	bool wave_size_enable = false;
};

struct OptionDenormPreserveSupport : OptionBase
{
	OptionDenormPreserveSupport()
		: OptionBase(Option::DenormPreserveSupport)
	{
	}

	// Should always be set to true if supported.
	// If not supported, rely on implementation to default to the right thing.
	bool support_float16_denorm_preserve = false;
	bool support_float64_denorm_preserve = false;
};

struct OptionStrictHelperLaneWaveOps : OptionBase
{
	OptionStrictHelperLaneWaveOps()
	    : OptionBase(Option::StrictHelperLaneWaveOps)
	{
	}

	// If true, and WaveOpsIncludeHelperLanes is not set,
	// helper lanes explicitly do not participate in wave ops.
	bool enable = true;
};

struct OptionSubgroupPartitionedNV : OptionBase
{
	OptionSubgroupPartitionedNV()
		: OptionBase(Option::SubgroupPartitionedNV)
	{
	}

	bool supported = false;
};

struct OptionDeadCodeEliminate : OptionBase
{
	OptionDeadCodeEliminate()
		: OptionBase(Option::DeadCodeEliminate)
	{
	}

	bool enabled = false;
};

struct OptionPreciseControl : OptionBase
{
	OptionPreciseControl()
		: OptionBase(Option::PreciseControl)
	{
	}

	bool force_precise = false;
	bool propagate_precise = false;
};

struct OptionSampleGradOptimizationControl : OptionBase
{
	OptionSampleGradOptimizationControl()
	    : OptionBase(Option::SampleGradOptimizationControl)
	{
	}

	bool enabled = false;
	bool assume_uniform_scale = false;
};

struct DescriptorTableEntry
{
	ResourceClass type;
	uint32_t register_space;
	uint32_t register_index;
	uint32_t num_descriptors_in_range;
	uint32_t offset_in_heap;
};

enum class ShaderFeature
{
	Native16BitOperations = 0,
	Count
};

class Converter
{
public:
	Converter(LLVMBCParser &bitcode_parser, LLVMBCParser *bitcode_reflection_parser, SPIRVModule &module);
	~Converter();
	ConvertedFunction convert_entry_point();
	void set_resource_remapping_interface(ResourceRemappingInterface *iface);

	static ShaderStage get_shader_stage(const LLVMBCParser &bitcode_parser, const char *entry = nullptr);
	static void scan_resources(ResourceRemappingInterface *iface, const LLVMBCParser &bitcode_parser);

	static Vector<String> get_entry_points(const LLVMBCParser &parser);
	static bool entry_point_matches(const String &mangled, const char *user);
	void set_entry_point(const char *entry);
	const String &get_compiled_entry_point() const;

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
	void add_local_root_descriptor_table(Vector<DescriptorTableEntry> entries);
	void add_local_root_descriptor_table(const DescriptorTableEntry *entries, size_t count);

	// After compilation, query CS workgroup size.
	void get_workgroup_dimensions(uint32_t &x, uint32_t &y, uint32_t &z) const;
	// After compilation, query expected patch size.
	uint32_t get_patch_vertex_count() const;
	// If non-zero, a CS must be compiled for a specific wave size.
	uint32_t get_compute_required_wave_size() const;
	// If non-zero, similar to required, but can be ignored. Used as a workaround hint or performance hint.
	uint32_t get_compute_heuristic_max_wave_size() const;

	bool shader_requires_feature(ShaderFeature feature) const;

	struct Impl;

private:
	std::unique_ptr<Impl> impl;
};
} // namespace dxil_spv
