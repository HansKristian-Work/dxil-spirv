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
#include "SpvBuilder.h"
#include "cfg_structurizer.hpp"
#include "dxil_converter.hpp"
#include "scratch_pool.hpp"

#include "GLSL.std.450.h"

#ifdef HAVE_LLVMBC
#include "function.hpp"
#include "instruction.hpp"
#include "module.hpp"
#include "value.hpp"
#include "metadata.hpp"
#else
#include <llvm/IR/BasicBlock.h>
#include <llvm/IR/CFG.h>
#include <llvm/IR/Instructions.h>
#endif

#include <stdlib.h>
#include <string.h>

namespace dxil_spv
{
enum class LocalRootSignatureType
{
	Constants,
	Descriptor,
	Table
};

struct LocalRootSignatureConstants
{
	uint32_t register_space;
	uint32_t register_index;
	uint32_t num_words;
};

struct LocalRootSignatureDescriptor
{
	ResourceClass type;
	uint32_t register_space;
	uint32_t register_index;
};

struct LocalRootSignatureEntry
{
	LocalRootSignatureType type;
	union
	{
		LocalRootSignatureConstants constants;
		LocalRootSignatureDescriptor descriptor;
	};
	Vector<DescriptorTableEntry> table_entries;
};

struct Converter::Impl
{
	DXIL_SPV_OVERRIDE_NEW_DELETE

	Impl(LLVMBCParser &bitcode_parser_, SPIRVModule &module_)
	    : bitcode_parser(bitcode_parser_)
	    , spirv_module(module_)
	{
	}

	LLVMBCParser &bitcode_parser;
	SPIRVModule &spirv_module;

	struct BlockMeta
	{
		explicit BlockMeta(llvm::BasicBlock *bb_)
		    : bb(bb_)
		{
		}

		llvm::BasicBlock *bb;
		CFGNode *node = nullptr;

		DXIL_SPV_OVERRIDE_NEW_DELETE
	};
	Vector<std::unique_ptr<BlockMeta>> metas;
	UnorderedMap<llvm::BasicBlock *, BlockMeta *> bb_map;
	UnorderedMap<const llvm::Value *, spv::Id> value_map;
	UnorderedMap<spv::Id, spv::Id> phi_incoming_rewrite;

	ConvertedFunction convert_entry_point();
	CFGNode *convert_function(llvm::Function *func, CFGNodePool &pool);
	CFGNode *build_hull_main(llvm::Function *func, CFGNodePool &pool,
	                         Vector<ConvertedFunction::LeafFunction> &leaves);
	spv::Id get_id_for_value(const llvm::Value *value, unsigned forced_integer_width = 0);
	spv::Id get_id_for_constant(const llvm::Constant *constant, unsigned forced_width);
	spv::Id get_id_for_undef(const llvm::UndefValue *undef);

	bool emit_stage_input_variables();
	bool emit_stage_output_variables();
	bool emit_patch_variables();
	bool emit_global_variables();
	bool emit_incoming_payload();
	bool emit_hit_attribute();
	void emit_interpolation_decorations(spv::Id variable_id, DXIL::InterpolationMode mode);

	spv::ExecutionModel execution_model = spv::ExecutionModelMax;
	bool emit_execution_modes();
	bool emit_execution_modes_compute();
	bool emit_execution_modes_geometry();
	bool emit_execution_modes_hull();
	bool emit_execution_modes_domain();
	bool emit_execution_modes_pixel();
	bool emit_execution_modes_ray_tracing(spv::ExecutionModel model);

	bool analyze_instructions();
	bool analyze_instructions(const llvm::Function *function);
	struct AccessTracking
	{
		bool has_read = false;
		bool has_written = false;
		bool has_atomic = false;
		bool raw_access_16bit = false;
	};
	UnorderedMap<uint32_t, AccessTracking> srv_access_tracking;
	UnorderedMap<uint32_t, AccessTracking> uav_access_tracking;
	UnorderedMap<const llvm::Value *, uint32_t> llvm_value_to_srv_resource_index_map;
	UnorderedMap<const llvm::Value *, uint32_t> llvm_value_to_uav_resource_index_map;
	UnorderedSet<const llvm::Value *> llvm_values_using_update_counter;
	UnorderedMap<const llvm::Value *, spv::Id> llvm_value_actual_type;

	// DXIL has no storage class concept for hit/callable/payload types.
	const llvm::Type *llvm_hit_attribute_output_type = nullptr;
	spv::Id llvm_hit_attribute_output_value = 0;

	struct CompositeMeta
	{
		// Keeps track of which elements of a struct composite type are statically accessed.
		// This is required to eliminate dead loads when we're unrolling and also needed to keep
		// track of if opcodes should use sparse residency or not.
		unsigned access_mask = 0;
		// Effectively findMSB(access_mask) + 1
		unsigned components = 0;
		// If true, the composite was loaded as a vector, i.e. typed buffer or texture read.
		bool forced_composite = true;
	};
	UnorderedMap<const llvm::Value *, CompositeMeta> llvm_composite_meta;

	bool composite_is_accessed(const llvm::Value *composite) const;

	struct ResourceMetaReference
	{
		DXIL::ResourceType type;
		unsigned meta_index;
		llvm::Value *offset;
		bool non_uniform;
	};
	UnorderedMap<const llvm::Value *, ResourceMetaReference> llvm_global_variable_to_resource_mapping;

	struct ExecutionModeMeta
	{
		unsigned stage_input_num_vertex = 0;
		unsigned stage_output_num_vertex = 0;
		unsigned gs_stream_active_mask = 0;
		llvm::Function *patch_constant_function = nullptr;
		unsigned workgroup_threads[3] = {};
	} execution_mode_meta;

	static ShaderStage get_remapping_stage(spv::ExecutionModel model);

	llvm::MDNode *entry_point_meta = nullptr;
	bool emit_resources_global_mapping();
	bool emit_resources_global_mapping(DXIL::ResourceType type, const llvm::MDNode *node);
	bool emit_resources();
	bool emit_srvs(const llvm::MDNode *srvs);
	bool emit_uavs(const llvm::MDNode *uavs);
	bool emit_cbvs(const llvm::MDNode *cbvs);
	bool emit_samplers(const llvm::MDNode *samplers);
	bool emit_shader_record_buffer();
	void register_resource_meta_reference(const llvm::MDOperand &operand, DXIL::ResourceType type, unsigned index);
	void emit_root_constants(unsigned num_descriptors, unsigned num_constant_words);
	static void scan_resources(ResourceRemappingInterface *iface, const LLVMBCParser &parser);
	static bool scan_srvs(ResourceRemappingInterface *iface, const llvm::MDNode *srvs, ShaderStage stage);
	static bool scan_uavs(ResourceRemappingInterface *iface, const llvm::MDNode *uavs, ShaderStage stage);
	static bool scan_cbvs(ResourceRemappingInterface *iface, const llvm::MDNode *cbvs, ShaderStage stage);
	static bool scan_samplers(ResourceRemappingInterface *iface, const llvm::MDNode *samplers, ShaderStage stage);
	bool get_ssbo_offset_buffer_id(spv::Id &buffer_id, const VulkanBinding &buffer_binding, const VulkanBinding &offset_binding,
	                               DXIL::ResourceKind kind, unsigned alignment);

	Vector<LocalRootSignatureEntry> local_root_signature;
	int get_local_root_signature_entry(ResourceClass resource_class, uint32_t space, uint32_t binding,
	                                   DescriptorTableEntry &local_table_entry) const;

	struct ResourceReference
	{
		spv::Id var_id = 0;
		spv::Id var_id_16bit = 0;
		uint32_t push_constant_member = 0;
		uint32_t base_offset = 0;
		unsigned stride = 0;
		bool bindless = false;
		bool base_resource_is_array = false;
		bool root_descriptor = false;
		bool coherent = false;
		DXIL::ResourceKind resource_kind = DXIL::ResourceKind::Invalid;
		int local_root_signature_entry = -1;
	};

	Vector<ResourceReference> srv_index_to_reference;
	Vector<spv::Id> srv_index_to_offset;
	Vector<ResourceReference> sampler_index_to_reference;
	Vector<ResourceReference> cbv_index_to_reference;
	Vector<ResourceReference> uav_index_to_reference;
	Vector<ResourceReference> uav_index_to_counter;
	Vector<spv::Id> uav_index_to_offset;
	spv::Id root_constant_id = 0;
	unsigned root_descriptor_count = 0;
	unsigned root_constant_num_words = 0;
	unsigned patch_location_offset = 0;

	struct PhysicalPointerMeta
	{
		bool nonwritable;
		bool nonreadable;
		bool coherent;
	};

	struct ResourceMeta
	{
		DXIL::ResourceKind kind;
		DXIL::ComponentType component_type;
		unsigned stride;
		spv::Id var_id;
		spv::Id var_id_16bit;
		spv::StorageClass storage;
		bool non_uniform;

		spv::Id counter_var_id;
		bool counter_is_physical_pointer;
		PhysicalPointerMeta physical_pointer_meta;
		spv::Id index_offset_id;
	};
	UnorderedMap<spv::Id, ResourceMeta> handle_to_resource_meta;
	UnorderedMap<spv::Id, spv::Id> id_to_type;
	UnorderedMap<const llvm::Value *, unsigned> handle_to_root_member_offset;
	UnorderedMap<const llvm::Value *, spv::StorageClass> handle_to_storage_class;
	UnorderedSet<const llvm::Value *> needs_temp_storage_copy;

	struct TempPayloadEntry
	{
		spv::Id type;
		spv::StorageClass storage;
		spv::Id id;
	};
	Vector<TempPayloadEntry> temp_payloads;

	spv::StorageClass get_effective_storage_class(const llvm::Value *value, spv::StorageClass fallback) const;
	bool get_needs_temp_storage_copy(const llvm::Value *value) const;
	spv::Id get_temp_payload(spv::Id type, spv::StorageClass storage);

	spv::Id get_type_id(DXIL::ComponentType element_type, unsigned rows, unsigned cols, bool force_array = false);
	spv::Id get_type_id(const llvm::Type *type);
	spv::Id get_type_id(spv::Id id) const;

	struct ElementMeta
	{
		spv::Id id;
		DXIL::ComponentType component_type;
		unsigned rt_index;
	};

	struct ClipCullMeta
	{
		unsigned offset;
		unsigned row_stride;
		spv::BuiltIn builtin;
	};
	UnorderedMap<uint32_t, ElementMeta> input_elements_meta;
	UnorderedMap<uint32_t, ElementMeta> output_elements_meta;
	UnorderedMap<uint32_t, ElementMeta> patch_elements_meta;
	UnorderedMap<uint32_t, ClipCullMeta> input_clip_cull_meta;
	UnorderedMap<uint32_t, ClipCullMeta> output_clip_cull_meta;
	void emit_builtin_decoration(spv::Id id, DXIL::Semantic semantic, spv::StorageClass storage);

	bool emit_instruction(CFGNode *block, const llvm::Instruction &instruction);
	bool emit_phi_instruction(CFGNode *block, const llvm::PHINode &instruction);

	spv::Id build_sampled_image(spv::Id image_id, spv::Id sampler_id, bool comparison);
	spv::Id build_vector(spv::Id element_type, spv::Id *elements, unsigned count);
	spv::Id build_vector_type(spv::Id element_type, unsigned count);
	spv::Id build_constant_vector(spv::Id element_type, spv::Id *elements, unsigned count);
	spv::Id build_offset(spv::Id value, unsigned offset);
	void fixup_load_type_io(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value);
	void fixup_load_type_buffer(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value);
	void repack_sparse_feedback(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value);
	spv::Id fixup_store_type_io(DXIL::ComponentType component_type, unsigned components, spv::Id value);
	spv::Id fixup_store_type_buffer(DXIL::ComponentType component_type, unsigned components, spv::Id value);

	Vector<Operation *> *current_block = nullptr;
	void add(Operation *op);
	Operation *allocate(spv::Op op);
	Operation *allocate(spv::Op op, const llvm::Value *value);
	Operation *allocate(spv::Op op, spv::Id type_id);
	Operation *allocate(spv::Op op, const llvm::Value *value, spv::Id type_id);
	Operation *allocate(spv::Op op, spv::Id id, spv::Id type_id);
	spv::Builder &builder();
	spv::Id create_variable(spv::StorageClass storage, spv::Id type_id, const char *name = nullptr);
	spv::Id create_variable_with_initializer(spv::StorageClass storage, spv::Id type_id,
	                                         spv::Id initializer, const char *name = nullptr);

	spv::Id glsl_std450_ext = 0;
	spv::Id cmpxchg_type = 0;
	spv::Id texture_sample_pos_lut_id = 0;
	spv::Id rasterizer_sample_count_id = 0;
	spv::Id physical_counter_type = 0;
	spv::Id shader_record_buffer_id = 0;
	Vector<spv::Id> shader_record_buffer_types;

	ResourceRemappingInterface *resource_mapping_iface = nullptr;

	struct StructTypeEntry
	{
		spv::Id id;
		String name;
		Vector<spv::Id> subtypes;
	};
	Vector<StructTypeEntry> cached_struct_types;
	spv::Id get_struct_type(const Vector<spv::Id> &type_ids, const char *name = nullptr);

	void set_option(const OptionBase &cap);
	struct
	{
		bool shader_demote = false;
		bool dual_source_blending = false;
		unsigned rasterizer_sample_count = 0;
		bool rasterizer_sample_count_spec_constant = true;
		Vector<unsigned> output_swizzles;
		String shader_source_file;
		String entry_point;

		unsigned inline_ubo_descriptor_set = 0;
		unsigned inline_ubo_descriptor_binding = 0;
		bool inline_ubo_enable = false;
		bool bindless_cbv_ssbo_emulation = false;
		bool physical_storage_buffer = false;

		unsigned sbt_descriptor_size_srv_uav_cbv_log2 = 0;
		unsigned sbt_descriptor_size_sampler_log2 = 0;
		unsigned ssbo_alignment = 16;
		bool typed_uav_read_without_format = false;
		bool bindless_typed_buffer_offsets = false;
		bool storage_16bit_input_output = false;

		struct
		{
			unsigned untyped_offset = 0;
			unsigned typed_offset = 0;
			unsigned stride = 1;
		} offset_buffer_layout;
	} options;

	struct BindlessInfo
	{
		DXIL::ResourceType type;
		DXIL::ComponentType component;
		DXIL::ResourceKind kind;
		spv::ImageFormat format;
		VulkanDescriptorType descriptor_type;
		bool uav_read;
		bool uav_written;
		bool uav_coherent;
		bool counters;
		bool offsets;
		bool aliased;
		uint32_t desc_set;
		uint32_t binding;
	};

	spv::Id create_bindless_heap_variable(const BindlessInfo &info);

	struct BindlessResource
	{
		BindlessInfo info;
		uint32_t var_id;
	};
	Vector<BindlessResource> bindless_resources;

	struct CombinedImageSampler
	{
		spv::Id image_id;
		spv::Id sampler_id;
		spv::Id combined_id;
		bool non_uniform;
	};
	Vector<CombinedImageSampler> combined_image_sampler_cache;

	struct PhysicalPointerEntry
	{
		spv::Id ptr_type_id;
		spv::Id base_type_id;
		PhysicalPointerMeta meta;
	};
	Vector<PhysicalPointerEntry> physical_pointer_entries;
	spv::Id get_physical_pointer_block_type(spv::Id base_type_id, const PhysicalPointerMeta &meta);

	DXIL::ComponentType get_effective_input_output_type(DXIL::ComponentType type);
	spv::Id get_effective_input_output_type_id(DXIL::ComponentType type);
};
} // namespace dxil_spv
