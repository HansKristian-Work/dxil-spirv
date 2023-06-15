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
#include "SpvBuilder.h"
#include "cfg_structurizer.hpp"
#include "dxil_converter.hpp"
#include "scratch_pool.hpp"
#include "descriptor_qa.hpp"
#include "opcodes.hpp"

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

static inline DXIL::ComponentType raw_width_to_component_type(RawType type, RawWidth raw_width)
{
	switch (raw_width)
	{
	case RawWidth::B16:
		return type == RawType::Float ? DXIL::ComponentType::F16 : DXIL::ComponentType::U16;
	case RawWidth::B64:
		return type == RawType::Float ? DXIL::ComponentType::F64 : DXIL::ComponentType::U64;
	default:
		return type == RawType::Float ? DXIL::ComponentType::F32 : DXIL::ComponentType::U32;
	}
}

static inline unsigned raw_vecsize_to_vecsize(RawVecSize raw_vecsize)
{
	return unsigned(raw_vecsize) + 1;
}

static inline unsigned raw_component_type_to_bits(DXIL::ComponentType type)
{
	switch (type)
	{
	case DXIL::ComponentType::U16:
	case DXIL::ComponentType::F16:
		return 16;
	case DXIL::ComponentType::U32:
	case DXIL::ComponentType::F32:
		return 32;
	case DXIL::ComponentType::U64:
	case DXIL::ComponentType::F64:
		return 64;
	default:
		assert(0 && "Invalid component type.");
		return 0;
	}
}

static inline RawType raw_component_type_to_type(DXIL::ComponentType type)
{
	switch (type)
	{
	case DXIL::ComponentType::U16:
	case DXIL::ComponentType::U32:
	case DXIL::ComponentType::U64:
		return RawType::Integer;
	case DXIL::ComponentType::F16:
	case DXIL::ComponentType::F32:
	case DXIL::ComponentType::F64:
		return RawType::Float;
	default:
		assert(0 && "Invalid component type.");
		return RawType::Count;
	}
}

static inline unsigned raw_width_to_bits(RawWidth raw_width)
{
	return raw_component_type_to_bits(raw_width_to_component_type(RawType::Integer, raw_width));
}

struct Converter::Impl
{
	DXIL_SPV_OVERRIDE_NEW_DELETE

	Impl(LLVMBCParser &bitcode_parser_, LLVMBCParser *bitcode_reflection_parser_, SPIRVModule &module_)
	    : bitcode_parser(bitcode_parser_)
	    , bitcode_reflection_parser(bitcode_reflection_parser_)
	    , spirv_module(module_)
	{
	}

	LLVMBCParser &bitcode_parser;
	LLVMBCParser *bitcode_reflection_parser;
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
	UnorderedMap<const llvm::BasicBlock *, BlockMeta *> bb_map;
	UnorderedMap<const llvm::Value *, spv::Id> value_map;
	UnorderedMap<spv::Id, spv::Id> phi_incoming_rewrite;

	ConvertedFunction convert_entry_point();
	CFGNode *convert_function(llvm::Function *func, CFGNodePool &pool);
	CFGNode *build_hull_main(llvm::Function *func, CFGNodePool &pool,
	                         Vector<ConvertedFunction::LeafFunction> &leaves);
	CFGNode *build_rov_main(llvm::Function *func, CFGNodePool &pool,
	                        Vector<ConvertedFunction::LeafFunction> &leaves);
	spv::Id get_id_for_value(const llvm::Value *value, unsigned forced_integer_width = 0);
	spv::Id get_id_for_constant(const llvm::Constant *constant, unsigned forced_width);
	spv::Id get_id_for_undef(const llvm::UndefValue *undef);

	bool emit_stage_input_variables();
	bool emit_stage_output_variables();
	bool emit_patch_variables();
	bool emit_other_variables();
	bool emit_global_variables();
	bool emit_incoming_payload();
	bool emit_hit_attribute();
	void emit_interpolation_decorations(spv::Id variable_id, DXIL::InterpolationMode mode);
	void emit_builtin_interpolation_decorations(spv::Id variable_id, DXIL::Semantic semantic, DXIL::InterpolationMode mode);

	spv::ExecutionModel execution_model = spv::ExecutionModelMax;
	bool emit_execution_modes();
	bool emit_execution_modes_late();
	void emit_execution_modes_post_code_generation();
	bool analyze_execution_modes_meta();
	bool emit_execution_modes_compute();
	bool emit_execution_modes_geometry();
	bool emit_execution_modes_hull();
	bool emit_execution_modes_domain();
	bool emit_execution_modes_pixel();
	bool emit_execution_modes_pixel_late();
	bool emit_execution_modes_ray_tracing(spv::ExecutionModel model);
	bool emit_execution_modes_amplification();
	bool emit_execution_modes_mesh();
	bool emit_execution_modes_fp_denorm();
	bool emit_execution_modes_thread_wave_properties(const llvm::MDNode *num_threads);

	bool analyze_instructions();
	bool analyze_instructions(const llvm::Function *function);

	struct RawDeclaration
	{
		RawType type;
		RawWidth width;
		RawVecSize vecsize;
	};

	struct AccessTracking
	{
		bool has_read = false;
		bool has_written = false;
		bool has_atomic = false;
		bool has_atomic_64bit = false;
		bool raw_access_buffer_declarations[unsigned(RawType::Count)][unsigned(RawWidth::Count)][unsigned(RawVecSize::Count)] = {};
	};
	UnorderedMap<uint32_t, AccessTracking> cbv_access_tracking;
	UnorderedMap<uint32_t, AccessTracking> srv_access_tracking;
	UnorderedMap<uint32_t, AccessTracking> uav_access_tracking;
	UnorderedMap<const llvm::Value *, uint32_t> llvm_value_to_cbv_resource_index_map;
	UnorderedMap<const llvm::Value *, uint32_t> llvm_value_to_srv_resource_index_map;
	UnorderedMap<const llvm::Value *, uint32_t> llvm_value_to_uav_resource_index_map;
	UnorderedSet<const llvm::Value *> llvm_values_using_update_counter;
	UnorderedMap<const llvm::Value *, spv::Id> llvm_value_actual_type;
	UnorderedSet<uint32_t> llvm_attribute_at_vertex_indices;

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
		// Forces a composite to be treated as a struct instead of vector or scalar.
		bool forced_struct = false;
	};
	UnorderedMap<const llvm::Value *, CompositeMeta> llvm_composite_meta;

	bool composite_is_accessed(const llvm::Value *composite) const;

	struct ResourceMetaReference
	{
		DXIL::ResourceType type;
		unsigned meta_index;
		llvm::Value *offset;
		const llvm::GlobalVariable *variable;
		bool non_uniform;
	};
	UnorderedMap<const llvm::Value *, ResourceMetaReference> llvm_global_variable_to_resource_mapping;
	UnorderedSet<const llvm::GlobalVariable *> llvm_active_global_resource_variables;

	struct ResourceVariableMeta
	{
		bool is_lib_variable;
		bool is_active;
	};
	ResourceVariableMeta get_resource_variable_meta(const llvm::MDNode *resource) const;

	struct ExecutionModeMeta
	{
		unsigned stage_input_num_vertex = 0;
		unsigned stage_output_num_vertex = 0;
		unsigned stage_output_num_primitive = 0;
		unsigned primitive_index_dimension = 0;
		unsigned gs_stream_active_mask = 0;
		llvm::Function *patch_constant_function = nullptr;
		unsigned workgroup_threads[3] = {};
		bool native_16bit_operations = false;
		bool synthesize_2d_quad_dispatch = false;
		unsigned required_wave_size = 0;
		unsigned heuristic_max_wave_size = 0;
		bool declares_globallycoherent_uav = false;
		bool declares_rov = false;
		bool per_sample_shading = false;
		String entry_point_name;
	} execution_mode_meta;

	static ShaderStage get_remapping_stage(spv::ExecutionModel model);

	llvm::MDNode *entry_point_meta = nullptr;
	bool emit_resources_global_mapping();
	bool emit_resources_global_mapping(DXIL::ResourceType type, const llvm::MDNode *node);
	bool emit_resources();
	bool emit_global_heaps();
	bool emit_srvs(const llvm::MDNode *srvs, const llvm::MDNode *refl);
	bool emit_uavs(const llvm::MDNode *uavs, const llvm::MDNode *refl);
	bool emit_cbvs(const llvm::MDNode *cbvs, const llvm::MDNode *refl);
	bool emit_samplers(const llvm::MDNode *samplers, const llvm::MDNode *refl);
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

	struct RawDeclarationVariable
	{
		RawDeclaration declaration;
		spv::Id var_id;
	};

	struct ResourceReference
	{
		spv::Id var_id = 0;
		Vector<RawDeclarationVariable> var_alias_group;
		bool aliased = false;

		uint32_t push_constant_member = 0;
		uint32_t base_offset = 0;
		unsigned stride = 0;
		bool bindless = false;
		bool base_resource_is_array = false;
		bool root_descriptor = false;
		bool coherent = false;
		bool rov = false;
		DXIL::ResourceKind resource_kind = DXIL::ResourceKind::Invalid;
		int local_root_signature_entry = -1;
	};

	// Collects all unique calls to annotateHandle (SM 6.6),
	// we use this to build the various bindless variables as necessary.
	struct AnnotateHandleReference
	{
		unsigned ordinal; // Important for reproducible codegen later.
		DXIL::ResourceKind resource_kind;
		DXIL::ResourceType resource_type;
		DXIL::ComponentType component_type;
		AccessTracking tracking;
		unsigned stride;
		bool coherent;
		bool rov;
		bool counter;
		ResourceReference reference;
		ResourceReference counter_reference;
		spv::Id offset_buffer_id;
	};
	UnorderedMap<const llvm::Value *, AnnotateHandleReference> llvm_annotate_handle_uses;
	UnorderedSet<const llvm::Value *> llvm_annotate_handle_lib_uses;

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
	unsigned descriptor_qa_counter = 0;
	spv::Id primitive_index_array_id = 0;

	struct PhysicalPointerMeta
	{
		bool nonwritable;
		bool nonreadable;
		bool coherent;
		bool rov;
		uint8_t stride;
		uint32_t size;
	};

	struct ResourceMeta
	{
		DXIL::ResourceKind kind;
		DXIL::ComponentType component_type;
		RawVecSize raw_component_vecsize;
		unsigned stride;

		spv::Id var_id;
		Vector<RawDeclarationVariable> var_alias_group;
		bool aliased;
		bool non_uniform;
		bool counter_is_physical_pointer;
		bool rov;

		spv::StorageClass storage;

		spv::Id counter_var_id;
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
	spv::Id build_vector(spv::Id element_type, const spv::Id *elements, unsigned count);
	spv::Id build_vector_type(spv::Id element_type, unsigned count);
	spv::Id build_constant_vector(spv::Id element_type, const spv::Id *elements, unsigned count);
	spv::Id build_offset(spv::Id value, unsigned offset);
	void fixup_load_type_io(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value);
	void fixup_load_type_atomic(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value);
	void fixup_load_type_typed(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value,
	                           const llvm::Type *target_type);
	void fixup_load_type_typed(DXIL::ComponentType &component_type, unsigned components, spv::Id &value_id,
	                           const llvm::Type *target_type);
	void repack_sparse_feedback(DXIL::ComponentType component_type, unsigned components, const llvm::Value *value,
	                            const llvm::Type *target_type, spv::Id override_value = 0);
	spv::Id fixup_store_type_io(DXIL::ComponentType component_type, unsigned components, spv::Id value);
	spv::Id fixup_store_type_atomic(DXIL::ComponentType component_type, unsigned components, spv::Id value);
	spv::Id fixup_store_type_typed(DXIL::ComponentType component_type, unsigned components, spv::Id value);
	spv::Id build_value_cast(spv::Id value_id, DXIL::ComponentType input_type, DXIL::ComponentType output_type,
	                         unsigned components);
	bool support_16bit_operations() const;

	Vector<Operation *> *current_block = nullptr;
	void add(Operation *op, bool is_rov = false);
	Operation *allocate(spv::Op op);
	Operation *allocate(spv::Op op, const llvm::Value *value);
	Operation *allocate(spv::Op op, spv::Id type_id);
	Operation *allocate(spv::Op op, const llvm::Value *value, spv::Id type_id);
	Operation *allocate(spv::Op op, spv::Id id, spv::Id type_id);
	void rewrite_value(const llvm::Value *value, spv::Id id);
	spv::Builder &builder();
	spv::Id create_variable(spv::StorageClass storage, spv::Id type_id, const char *name = nullptr);
	spv::Id create_variable_with_initializer(spv::StorageClass storage, spv::Id type_id,
	                                         spv::Id initializer, const char *name = nullptr);

	spv::Id glsl_std450_ext = 0;
	spv::Id cmpxchg_type = 0;
	spv::Id texture_sample_pos_lut_id = 0;
	spv::Id rasterizer_sample_count_id = 0;
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

		DescriptorQAInfo descriptor_qa;
		bool descriptor_qa_enabled = false;
		bool descriptor_qa_sink_handles = true;
		bool min_precision_prefer_native_16bit = false;
		bool shader_i8_dot_enabled = false;
		bool ray_tracing_primitive_culling_enabled = false;
		bool invariant_position = false;
		bool scalar_block_layout = false;
		bool supports_per_component_robustness = false;
		bool khr_barycentrics_enabled = false;
		bool robust_physical_cbv = false;
		bool arithmetic_relaxed_precision = false;
		bool force_wave_size_enable = false;
		bool supports_float16_denorm_preserve = false;
		bool supports_float64_denorm_preserve = false;
		unsigned physical_address_descriptor_stride = 1;
		unsigned physical_address_descriptor_offset = 0;
		unsigned force_subgroup_size = 0;
	} options;

	struct BindlessInfo
	{
		DXIL::ResourceType type;
		DXIL::ComponentType component;
		RawVecSize raw_vecsize;
		DXIL::ResourceKind kind;
		spv::ImageFormat format;
		VulkanDescriptorType descriptor_type;
		bool uav_read;
		bool uav_written;
		bool uav_coherent;
		bool counters;
		bool offsets;
		bool aliased;
		bool relaxed_precision;
		uint32_t desc_set;
		uint32_t binding;
	};

	spv::Id create_bindless_heap_variable(const BindlessInfo &info);
	Vector<RawDeclarationVariable> create_bindless_heap_variable_alias_group(
			const BindlessInfo &base_info, const Vector<RawDeclaration> &raw_decls);
	Vector<RawDeclarationVariable> create_raw_ssbo_variable_alias_group(
			const Vector<RawDeclaration> &raw_decls,
			uint32_t range_size, const String &name);
	Vector<RawDeclarationVariable> create_ubo_variable_alias_group(
			const Vector<RawDeclaration> &raw_decls,
			uint32_t range_size, const String &name, unsigned cbv_size);
	spv::Id create_raw_ssbo_variable(const RawDeclaration &raw_decl, uint32_t range_size, const String &name);
	spv::Id create_ubo_variable(const RawDeclaration &raw_decl, uint32_t range_size, const String &name, unsigned cbv_size);

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
	static DXIL::ComponentType get_effective_typed_resource_type(DXIL::ComponentType type);
	spv::Id get_effective_input_output_type_id(DXIL::ComponentType type);
	bool get_uav_image_format(DXIL::ResourceKind resource_kind,
	                          DXIL::ComponentType actual_component_type,
	                          const AccessTracking &access_meta,
	                          spv::ImageFormat &format);

	uint32_t find_binding_meta_index(uint32_t binding_range_lo, uint32_t binding_range_hi,
	                                 uint32_t binding_space, DXIL::ResourceType resource_type);

	struct RawBufferMeta
	{
		DXIL::ResourceKind kind;
		unsigned stride;
	};
	RawBufferMeta get_raw_buffer_meta(DXIL::ResourceType resource_type, unsigned meta_index);

	static void get_shader_model(const llvm::Module &module, String *model, uint32_t *major, uint32_t *minor);

	struct AliasedAccess
	{
		Vector<RawDeclaration> raw_declarations;
		bool requires_alias_decoration = false;
		bool override_primary_component_types = false;
		DXIL::ComponentType primary_component_type = DXIL::ComponentType::Invalid;
		RawVecSize primary_raw_vecsize = RawVecSize::V1;
	};
	bool analyze_aliased_access(const AccessTracking &tracking,
	                            VulkanDescriptorType descriptor_type,
	                            AliasedAccess &aliased_access) const;

	struct
	{
		// Only relevant for fragment shaders.
		bool has_side_effects = false;
		bool discards = false;
		bool can_require_primitive_culling = false;
		bool require_compute_shader_derivatives = false;
		bool precise_f16_to_f32_observed = false;
		bool require_uav_thread_group_coherence = false;
		bool require_subgroups = false;
		bool subgroup_ballot_reads_upper = false;
		bool subgroup_ballot_reads_first = false;
	} shader_analysis;

	// For descriptor QA, we need to rewrite how resource handles are emitted.
	UnorderedMap<const llvm::CallInst *, const llvm::BasicBlock *> resource_handle_to_block;
	UnorderedSet<const llvm::CallInst *> resource_handles_needing_sink;
	UnorderedSet<const llvm::CallInst *> resource_handle_is_conservative;
	UnorderedMap<const llvm::BasicBlock *, Vector<const llvm::Instruction *>> bb_to_sinks;

	bool type_can_relax_precision(const llvm::Type *type, bool known_integer_sign) const;
	void decorate_relaxed_precision(const llvm::Type *type, spv::Id id, bool known_integer_sign);

	void suggest_maximum_wave_size(unsigned wave_size);
};
} // namespace dxil_spv
