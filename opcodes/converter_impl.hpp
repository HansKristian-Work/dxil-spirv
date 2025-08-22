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
#include "dxil/dxil_ags.hpp"
#include "dxil/dxil_nvapi.hpp"

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

struct ReferenceVkMemoryModel
{
	bool non_private = false;
	bool auto_visibility = false;
};

static inline DXIL::ComponentType raw_width_to_component_type(RawType type, RawWidth raw_width)
{
	switch (raw_width)
	{
	case RawWidth::B8:
		return DXIL::ComponentType::InternalU8;
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
	case DXIL::ComponentType::InternalU8:
		return 8;
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
	case DXIL::ComponentType::InternalU8:
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

// Track patterns where shader copies CBV arrays into a local array.
// DXC does not seem to optimize this in all cases that games run into.
struct AllocaCBVForwardingTracking
{
	const llvm::Value *cbv_handle = nullptr;
	uint32_t scalar_index_offset = 0;
	uint32_t stride = 0;
	uint32_t highest_store_index = 0;
	uint32_t min_highest_store_index = 0;
	bool has_load = false;
};

class GlobalConfiguration
{
public:
	// Only used for temporary hackery and testing.
	static const GlobalConfiguration &get();
	bool wmma_rdna3_workaround = false;
	bool wmma_conv_hack = false;

private:
	GlobalConfiguration();
};

struct AccessTracking
{
	bool has_read = false;
	bool has_written = false;
	bool has_atomic = false;
	bool has_atomic_64bit = false;
	bool has_counter = false;
	bool raw_access_buffer_declarations[unsigned(RawType::Count)][unsigned(RawWidth::Count)][unsigned(RawVecSize::Count)] = {};
};

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
	CFGNode *convert_function(const Vector<llvm::BasicBlock *> &bbs, bool primary_code);
	ConvertedFunction::Function build_hull_main(const Vector<llvm::BasicBlock *> &bbs,
	                                            const Vector<llvm::BasicBlock *> &patch_bbs,
	                                            CFGNodePool &pool,
	                                            Vector<ConvertedFunction::Function> &leaves);
	ConvertedFunction::Function build_rov_main(const Vector<llvm::BasicBlock *> &bbs,
	                                           CFGNodePool &pool,
	                                           Vector<ConvertedFunction::Function> &leaves);
	ConvertedFunction::Function build_node_main(const Vector<llvm::BasicBlock *> &bbs,
	                                            CFGNodePool &pool,
	                                            Vector<ConvertedFunction::Function> &leaves);
	void gather_function_dependencies(llvm::Function *caller, Vector<llvm::Function *> &funcs);
	bool build_callee_functions(CFGNodePool &pool, const Vector<llvm::Function *> &callees,
	                            Vector<ConvertedFunction::Function> &leaves);
	spv::Id get_id_for_value(const llvm::Value *value, unsigned forced_integer_width = 0);
	spv::Id get_id_for_constant(const llvm::Constant *constant, unsigned forced_width);
	spv::Id get_padded_constant_array(spv::Id padded_type_id, const llvm::Constant *constant);
	spv::Id get_id_for_undef(const llvm::UndefValue *undef);
	spv::Id get_id_for_undef_constant(const llvm::UndefValue *undef);
	void emit_patch_output_lowering(CFGNode *node);

	Vector<llvm::BasicBlock *> build_function_bb_visit_order_legacy(llvm::Function *func, CFGNodePool &pool);
	Vector<llvm::BasicBlock *> build_function_bb_visit_order_analysis(llvm::Function *func);
	void build_function_bb_visit_order_inner_analysis(Vector<llvm::BasicBlock *> &bbs,
	                                                  UnorderedSet<llvm::BasicBlock *> &visited,
	                                                  llvm::BasicBlock *bb);
	void build_function_bb_visit_register(llvm::BasicBlock *bb, CFGNodePool &pool, String tag);

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
	bool execution_model_lib_target = false;
	bool emit_execution_modes();
	bool emit_execution_modes_late();
	void emit_execution_modes_post_code_generation();
	bool analyze_execution_modes_meta();
	bool emit_execution_modes_compute();
	bool emit_execution_modes_node();

	static NodeDispatchGrid node_parse_dispatch_grid(llvm::MDNode *node_meta);
	static uint32_t node_parse_payload_stride(llvm::MDNode *node_meta, bool &is_rw_sharing);
	bool emit_execution_modes_node_input();
	bool emit_execution_modes_node_output(llvm::MDNode *input);
	bool emit_execution_modes_geometry();
	bool emit_execution_modes_hull();
	bool emit_execution_modes_domain();
	bool emit_execution_modes_pixel();
	bool emit_execution_modes_pixel_late();
	bool emit_execution_modes_ray_tracing(spv::ExecutionModel model);
	bool emit_execution_modes_amplification();
	bool emit_execution_modes_mesh();
	bool emit_execution_modes_fp_denorm_rounding();
	bool emit_execution_modes_thread_wave_properties(const llvm::MDNode *num_threads);

	bool analyze_instructions(llvm::Function *func);
	void analyze_instructions_post_execution_modes();
	void mark_used_values(const llvm::Instruction *instruction);
	void mark_used_value(const llvm::Value *value);

	struct RawDeclaration
	{
		RawType type;
		RawWidth width;
		RawVecSize vecsize;
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

	AGSState ags;
	NVAPIState nvapi;

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
		spv::Id patch_lowering_array_var_id = 0;
		unsigned workgroup_threads[3] = {};
		bool native_16bit_operations = false;
		bool synthesize_2d_quad_dispatch = false;
		bool synthesize_dummy_derivatives = false;
		unsigned wave_size_min = 0;
		unsigned wave_size_max = 0;
		unsigned wave_size_preferred = 0;
		unsigned heuristic_min_wave_size = 0;
		unsigned heuristic_max_wave_size = 0;
		bool declares_globallycoherent_uav = false;
		bool declares_rov = false;
		bool per_sample_shading = false;
		bool waveops_include_helper_lanes = false;
		bool needs_quad_derivatives = false;
		String entry_point_name;

		// Eventually, we should use Vulkan memory model across the board,
		// but don't want to invalidate all Foz caches.
		spv::MemoryModel memory_model = spv::MemoryModelGLSL450;
	} execution_mode_meta;

	static ShaderStage get_remapping_stage(spv::ExecutionModel model);

	llvm::MDNode *entry_point_meta = nullptr;
	bool emit_resources_global_mapping();
	bool emit_resources_global_mapping(DXIL::ResourceType type, const llvm::MDNode *node);
	bool emit_resources();
	bool emit_global_heaps();
	bool emit_descriptor_heap_introspection_ssbo();
	bool emit_srvs(const llvm::MDNode *srvs, const llvm::MDNode *refl);
	bool emit_uavs(const llvm::MDNode *uavs, const llvm::MDNode *refl);
	bool emit_cbvs(const llvm::MDNode *cbvs, const llvm::MDNode *refl);
	bool emit_samplers(const llvm::MDNode *samplers, const llvm::MDNode *refl);
	bool emit_shader_record_buffer();
	spv::Id emit_shader_record_buffer_block_type(bool physical_storage);
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
		ReferenceVkMemoryModel vkmm;
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
	Vector<const llvm::Value *> llvm_vkmm_coherent_ptrs;

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
	unsigned patch_location_offset = ~0u;
	unsigned descriptor_qa_counter = 0;
	spv::Id primitive_index_array_id = 0;

	struct
	{
		spv::Id descriptor_heap_introspection_var_id;
		spv::Id invocation_id_var_id;
	} instrumentation = {};
	void emit_write_instrumentation_invocation_id(CFGNode *node);

	struct PhysicalPointerMeta
	{
		bool nonwritable;
		bool nonreadable;
		bool coherent;
		bool rov;
		uint8_t stride;
		uint32_t size;
	};

	struct ResourceMetaInstrumentation
	{
		spv::Id bda_id;
		spv::Id elem_size_id;
		spv::Id resource_size_id;
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
		ReferenceVkMemoryModel vkmm;

		spv::StorageClass storage;

		spv::Id counter_var_id;
		PhysicalPointerMeta physical_pointer_meta;
		spv::Id index_offset_id;
		ResourceMetaInstrumentation instrumentation;
	};
	UnorderedMap<spv::Id, ResourceMeta> handle_to_resource_meta;
	UnorderedMap<spv::Id, spv::Id> id_to_type;
	UnorderedMap<const llvm::Value *, unsigned> handle_to_root_member_offset;
	UnorderedMap<const llvm::Value *, spv::StorageClass> handle_to_storage_class;
	UnorderedMap<const llvm::Value *, spv::Id> handle_to_robustness;
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

	enum TypeLayoutFlagBits
	{
		TYPE_LAYOUT_PHYSICAL_BIT = 0x1,
		TYPE_LAYOUT_READ_ONLY_BIT = 0x2,
		TYPE_LAYOUT_COHERENT_BIT = 0x4,
		TYPE_LAYOUT_BLOCK_BIT = 0x8,
	};
	using TypeLayoutFlags = uint32_t;

	spv::Id get_type_id(const llvm::Type *type, TypeLayoutFlags flags = 0);
	spv::Id get_type_id(spv::Id id) const;

	struct ElementMeta
	{
		spv::Id id;
		DXIL::ComponentType component_type;
		unsigned semantic_offset;
	};

	struct ElementPatchMeta : ElementMeta
	{
		spv::Id start_row;
		spv::Id start_col;
		bool lowering;
	};

	struct ClipCullMeta
	{
		unsigned offset;
		unsigned row_stride;
		spv::BuiltIn builtin;
	};
	UnorderedMap<uint32_t, ElementMeta> input_elements_meta;
	UnorderedMap<uint32_t, ElementMeta> output_elements_meta;
	UnorderedMap<uint32_t, ElementPatchMeta> patch_elements_meta;
	UnorderedMap<uint32_t, ClipCullMeta> input_clip_cull_meta;
	UnorderedMap<uint32_t, ClipCullMeta> output_clip_cull_meta;
	void emit_builtin_decoration(spv::Id id, DXIL::Semantic semantic, spv::StorageClass storage);

	struct NodeInputMeta
	{
		String node_id;
		uint32_t node_array_index;
		spv::Id private_bda_var_id; // Private variable which holds a BDA to the node, set by the main() dispatcher.
		spv::Id private_stride_var_id; // Private variable which holds stride for entry point nodes, set by the main() dispatcher.
		spv::Id private_coalesce_offset_id; // Private variable which holds the linear input index.
		spv::Id private_coalesce_count_id; // Private variable which holds the input count.
		spv::Id node_dispatch_push_id; // PushConstant ABI for dispatching.
		spv::Id shader_record_block_type_id;
		// Stride for the payload. This is recorded in metadata, but we may have to allocate SV_DispatchGrid.
		uint32_t payload_stride;
		uint32_t coalesce_stride; // Coalesce width.
		spv::Id u32_ptr_type_id;
		spv::Id u64_ptr_type_id;
		spv::Id u32_array_ptr_type_id;
		spv::Id is_indirect_payload_stride_id;
		spv::Id is_entry_point_id;
		spv::Id broadcast_has_max_grid_id;
		spv::Id thread_group_size_id;
		spv::Id is_static_broadcast_node_id;
		spv::Id max_broadcast_grid_id[3];
		spv::Id max_broadcast_grid_minus_1_id[3];
		spv::Id real_workgroup_id;
		spv::Id real_global_invocation_id;
		DXIL::NodeLaunchType launch_type;
		NodeDispatchGrid dispatch_grid;
	};

	struct NodeOutputMeta
	{
		spv::Id spec_constant_node_index;
		// Stride for the payload. This is recorded in metadata, but we may have to allocate SV_DispatchGrid.
		uint32_t payload_stride;
		bool is_recursive;
	};

	NodeInputMeta node_input = {};
	Vector<NodeOutputMeta> node_outputs;

	bool emit_instruction(CFGNode *block, const llvm::Instruction &instruction);
	bool emit_phi_instruction(CFGNode *block, const llvm::PHINode &instruction);

	spv::Id build_sampled_image(spv::Id image_id, spv::Id sampler_id, bool comparison);
	spv::Id build_vector(spv::Id element_type, const spv::Id *elements, unsigned count);
	spv::Id build_vector_type(spv::Id element_type, unsigned count);
	spv::Id build_constant_vector(spv::Id element_type, const spv::Id *elements, unsigned count);
	spv::Id build_splat_constant_vector(spv::Id element_type, spv::Id value, unsigned count);
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
	bool support_native_fp16_operations() const;

	Vector<Operation *> *current_block = nullptr;
	void add(Operation *op, bool is_rov = false);
	Operation *allocate(spv::Op op);
	Operation *allocate(spv::Op op, const llvm::Value *value);
	Operation *allocate(spv::Op op, spv::Id type_id);
	Operation *allocate(spv::Op op, const llvm::Value *value, spv::Id type_id);
	Operation *allocate(spv::Op op, spv::Id id, spv::Id type_id);
	void register_externally_visible_write(const llvm::Value *value);
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
		TypeLayoutFlags flags;
	};

	struct ArrayTypeEntry
	{
		spv::Id id;
		uint32_t element_type_id;
		uint32_t array_size_id;
	};
	Vector<StructTypeEntry> cached_struct_types;
	Vector<ArrayTypeEntry> cached_physical_array_types;
	spv::Id get_struct_type(const Vector<spv::Id> &type_ids, TypeLayoutFlags flags, const char *name);
	void decorate_physical_offsets(spv::Id struct_type_id, const Vector<spv::Id> &type_ids);

	struct SizeAlignment
	{
		uint32_t size;
		uint32_t alignment;
	};
	SizeAlignment get_physical_size_for_type(spv::Id type_id);

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
		InstructionInstrumentationInfo instruction_instrumentation;
		bool descriptor_qa_enabled = false;
		bool descriptor_qa_sink_handles = true;
		bool min_precision_prefer_native_16bit = false;
		bool shader_i8_dot_enabled = false;
		bool ray_tracing_primitive_culling_enabled = false;
		bool invariant_position = false;
		bool scalar_block_layout = false;
		bool supports_per_component_robustness = false;
		bool khr_barycentrics_enabled = false;
		bool arithmetic_relaxed_precision = false;
		bool force_wave_size_enable = false;
		bool supports_float16_denorm_preserve = false;
		bool supports_float64_denorm_preserve = false;
		bool strict_helper_lane_waveops = true;
		bool nv_subgroup_partition_enabled = false;
		// Assumed by default in earlier code, so avoid surprises if dxil-spirv
		// is updated on its own.
		bool compute_shader_derivatives = true;
		bool compute_shader_derivatives_khr = false;
		bool eliminate_dead_code = false;
		bool propagate_precise = false;
		bool force_precise = false;
		bool descriptor_heap_robustness = false;
		bool supports_quad_control = false;
		bool supports_maximal_reconvergence = false;
		bool force_maximal_reconvergence = false;
		bool nv_raw_access_chains = false;
		bool wmma_fp8 = false;
		bool nv_cooperative_matrix2_conversions = false;
		struct
		{
			bool enabled = false;
			bool assume_uniform_scale = false;
		} grad_opt;
		bool opacity_micromap_enabled = false;
		unsigned physical_address_descriptor_stride = 1;
		unsigned physical_address_descriptor_offset = 0;
		unsigned force_subgroup_size = 0;

		struct
		{
			bool use_shader_metadata = false;
			bool force_unroll = false;
			bool force_loop = false;
			bool force_flatten = false;
			bool force_branch = false;
		} branch_control;

		struct
		{
			unsigned implementation_minimum = 4;
			unsigned implementation_maximum = 128;
		} subgroup_size;

		uint32_t driver_id = 0;
		uint32_t driver_version = 0;

		struct
		{
			bool force_device_memory_barriers_thread_group_coherence = false;
			bool assume_broken_sub_8x8_cube_mips = false;
			bool robust_physical_cbv_forwarding = false;
			bool robust_physical_cbv = false;
			bool mesh_outputs_bounds_check = false;
			bool aggressive_nonuniform = false;
			bool promote_group_to_device_memory_barrier = false;
			bool group_shared_auto_barrier = false;
		} quirks;

		struct
		{
			bool group_shared = false;
			bool constant_lut = false;
			bool alloca = false;
		} extended_robustness;

		unsigned max_tess_factor = 0;

		struct
		{
			bool enabled = false;
			unsigned register_index = 0;
			unsigned register_space = 0;
		} nvapi;

		bool extended_debug_info = true;
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
		struct
		{
			uint32_t stride;
		} debug;
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
		// Only relevant for fragment shaders, and some other misc uses.
		bool has_side_effects = false;
		bool discards = false;
		bool can_require_primitive_culling = false;
		bool require_compute_shader_derivatives = false;
		bool precise_f16_to_f32_observed = false;
		bool require_uav_thread_group_coherence = false;
		bool require_node_output_group_coherence = false;
		bool require_node_input_group_coherence = false;
		bool require_subgroups = false;
		bool require_subgroup_shuffles = false;
		bool subgroup_ballot_reads_upper = false;
		bool subgroup_ballot_reads_first = false;
		bool can_require_opacity_micromap = false;
		bool need_maximal_reconvergence_helper_call = false;
		bool has_group_shared_barrier = false;
		bool has_group_shared_access = false;
		bool needs_auto_group_shared_barriers = false;
		bool require_wmma = false;
		// Should just do this always, but don't want to nuke FOZ caches needlessly.
		bool global_undefs = false;
	} shader_analysis;

	struct
	{
		bool skip_non_uniform_promotion = false;
	} backend;

	// For descriptor QA, we need to rewrite how resource handles are emitted.
	UnorderedMap<const llvm::CallInst *, const llvm::BasicBlock *> resource_handle_to_block;
	UnorderedSet<const llvm::CallInst *> resource_handles_needing_sink;
	UnorderedSet<const llvm::CallInst *> resource_handle_is_conservative;
	UnorderedMap<const llvm::BasicBlock *, Vector<const llvm::Instruction *>> bb_to_sinks;
	UnorderedSet<const llvm::CallInst *> wave_op_forced_helper_lanes;

	UnorderedSet<const llvm::Value *> llvm_used_ssa_values;
	UnorderedMap<const llvm::AllocaInst *, AllocaCBVForwardingTracking> alloca_tracking;
	UnorderedSet<const llvm::GetElementPtrInst *> masked_alloca_forward_gep;

	bool type_can_relax_precision(const llvm::Type *type, bool known_integer_sign) const;
	void decorate_relaxed_precision(const llvm::Type *type, spv::Id id, bool known_integer_sign);

	void suggest_minimum_wave_size(unsigned wave_size);
	void suggest_maximum_wave_size(unsigned wave_size);

	static NodeInputData get_node_input(llvm::MDNode *meta);
	static NodeOutputData get_node_output(llvm::MDNode *meta);
};
} // namespace dxil_spv
