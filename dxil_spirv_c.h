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

#ifndef DXIL_SPV_C_API_H
#define DXIL_SPV_C_API_H

#include <stddef.h>

/* C89-compatible wrapper for dxil_spv. */

#ifdef __cplusplus
extern "C" {
#endif

#define DXIL_SPV_API_VERSION_MAJOR 2
#define DXIL_SPV_API_VERSION_MINOR 50
#define DXIL_SPV_API_VERSION_PATCH 0

#define DXIL_SPV_DESCRIPTOR_QA_INTERFACE_VERSION 1
#define DXIL_SPV_INSTRUCTION_INSTRUMENTATION_INTERFACE_VERSION 2

#if !defined(DXIL_SPV_PUBLIC_API)
#if defined(DXIL_SPV_EXPORT_SYMBOLS)
#if defined(__GNUC__)
#define DXIL_SPV_PUBLIC_API __attribute__((visibility("default")))
#elif defined(_MSC_VER)
#define DXIL_SPV_PUBLIC_API __declspec(dllexport)
#else
#define DXIL_SPV_PUBLIC_API
#endif
#else
#define DXIL_SPV_PUBLIC_API
#endif
#else
#define DXIL_SPV_PUBLIC_API
#endif

/* C89 does not have bool type. */
typedef unsigned char dxil_spv_bool;
#define DXIL_SPV_TRUE ((dxil_spv_bool)1)
#define DXIL_SPV_FALSE ((dxil_spv_bool)0)

typedef enum dxil_spv_result
{
	DXIL_SPV_SUCCESS = 0,
	DXIL_SPV_ERROR_OUT_OF_MEMORY = -1,
	DXIL_SPV_ERROR_GENERIC = -2,
	DXIL_SPV_ERROR_UNSUPPORTED_FEATURE = -3,
	DXIL_SPV_ERROR_PARSER = -4,
	DXIL_SPV_ERROR_FAILED_VALIDATION = -5,
	DXIL_SPV_ERROR_INVALID_ARGUMENT = -6,
	DXIL_SPV_ERROR_NO_DATA = -7,
	DXIL_SPV_RESULT_INT_MAX = 0x7fffffff
} dxil_spv_result;

typedef enum dxil_spv_shader_stage
{
	DXIL_SPV_STAGE_UNKNOWN = 0,
	DXIL_SPV_STAGE_VERTEX = 1,
	DXIL_SPV_STAGE_HULL = 2,
	DXIL_SPV_STAGE_DOMAIN = 3,
	DXIL_SPV_STAGE_GEOMETRY = 4,
	DXIL_SPV_STAGE_PIXEL = 5,
	DXIL_SPV_STAGE_COMPUTE = 6,
	DXIL_SPV_STAGE_INTERSECTION = 7,
	DXIL_SPV_STAGE_CLOSEST_HIT = 8,
	DXIL_SPV_STAGE_MISS = 9,
	DXIL_SPV_STAGE_ANY_HIT = 10,
	DXIL_SPV_STAGE_RAY_GENERATION = 11,
	DXIL_SPV_STAGE_CALLABLE = 12,
	DXIL_SPV_STAGE_AMPLIFICATION = 13,
	DXIL_SPV_STAGE_MESH = 14,
	DXIL_SPV_STAGE_INT_MAX = 0x7fffffff
} dxil_spv_shader_stage;

/* Remaps input attribute to desired location. */
typedef struct dxil_spv_d3d_vertex_input
{
	const char *semantic;
	unsigned semantic_index;
	unsigned start_row;
	unsigned rows;
} dxil_spv_d3d_vertex_input;

typedef struct dxil_spv_vulkan_vertex_input
{
	unsigned location;
} dxil_spv_vulkan_vertex_input;
typedef dxil_spv_bool (*dxil_spv_vertex_input_remapper_cb)(void *userdata, const dxil_spv_d3d_vertex_input *d3d_input,
                                                           dxil_spv_vulkan_vertex_input *vulkan_input);

typedef struct dxil_spv_d3d_stream_output
{
	const char *semantic;
	unsigned semantic_index;
} dxil_spv_d3d_stream_output;

typedef struct dxil_spv_vulkan_stream_output
{
	unsigned offset;
	unsigned stride;
	unsigned buffer_index;
	dxil_spv_bool enable;
} dxil_spv_vulkan_stream_output;

typedef dxil_spv_bool (*dxil_spv_stream_output_remapper_cb)(void *userdata, const dxil_spv_d3d_stream_output *d3d_output,
                                                            dxil_spv_vulkan_stream_output *vulkan_output);

typedef struct dxil_spv_d3d_shader_stage_io
{
	const char *semantic;
	unsigned semantic_index;
	unsigned start_row;
	unsigned rows;
} dxil_spv_d3d_shader_stage_io;

enum dxil_spv_vulkan_shader_stage_io_flags
{
	DXIL_SPV_SHADER_STAGE_IO_NONE = 0u,
	DXIL_SPV_SHADER_STAGE_IO_PER_PRIMITIVE = 0x1u,
};

typedef struct dxil_spv_vulkan_shader_stage_io
{
	unsigned location;
	unsigned component;
	unsigned flags;
} dxil_spv_vulkan_shader_stage_io;

typedef dxil_spv_bool (*dxil_spv_shader_stage_io_remapper_cb)(void *userdata, const dxil_spv_d3d_shader_stage_io *d3d_input,
                                                              dxil_spv_vulkan_shader_stage_io *vulkan_variable);

/* Matches DXIL enum */
typedef enum dxil_spv_resource_kind
{
	DXIL_SPV_RESOURCE_KIND_INVALID = 0,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_1D = 1,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_2D = 2,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_2DMS = 3,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_3D = 4,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_CUBE = 5,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_1D_ARRAY = 6,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_2D_ARRAY = 7,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_2D_MS_ARRAY = 8,
	DXIL_SPV_RESOURCE_KIND_TEXTURE_CUBE_ARRAY = 9,
	DXIL_SPV_RESOURCE_KIND_TYPED_BUFFER = 10,
	DXIL_SPV_RESOURCE_KIND_RAW_BUFFER = 11,
	DXIL_SPV_RESOURCE_KIND_STRUCTURED_BUFFER = 12,
	DXIL_SPV_RESOURCE_KIND_CONSTANT_BUFFER = 13,
	DXIL_SPV_RESOURCE_KIND_SAMPLER = 14,
	DXIL_SPV_RESOURCE_KIND_TBUFFER = 15,
	DXIL_SPV_RESOURCE_KIND_RT_ACCELERATION_STRUCTURE = 16,
	DXIL_SPV_RESOURCE_KIND_FEEDBACK_TEXTURE_2D = 17,
	DXIL_SPV_RESOURCE_KIND_FEEDBACK_TEXTURE_2D_ARRAY = 18,
	DXIL_SPV_RESOURCE_KIND_INT_MAX = 0x7fffffff
} dxil_spv_resource_kind;

typedef enum dxil_spv_resource_class
{
	DXIL_SPV_RESOURCE_CLASS_SRV = 0,
	DXIL_SPV_RESOURCE_CLASS_UAV = 1,
	DXIL_SPV_RESOURCE_CLASS_CBV = 2,
	DXIL_SPV_RESOURCE_CLASS_SAMPLER = 3,
	DXIL_SPV_RESOURCE_CLASS_INT_MAX = 0x7fffffff
} dxil_spv_resource_class;

typedef enum dxil_spv_vulkan_descriptor_type
{
	/* Use the descriptor type we expect, textures, typed buffers,
	 * CBV or samplers only have one target type. */
	DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_IDENTITY = 0,
	/* For untyped buffer types, we can select whether to use an SSBO implementation or texel buffer one. */
	DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_SSBO = 1,
	DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_TEXEL_BUFFER = 2,
	DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_BUFFER_DEVICE_ADDRESS = 3,
	DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_INT_MAX = 0x7fffffff
} dxil_spv_vulkan_descriptor_type;

typedef enum dxil_spv_rdat_subobject_kind
{
	DXIL_SPV_RDAT_SUBOBJECT_KIND_STATE_OBJECT_CONFIG = 0,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_GLOBAL_ROOT_SIGNATURE = 1,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_LOCAL_ROOT_SIGNATURE = 2,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_SUBOBJECT_TO_EXPORTS_ASSOCIATION = 8,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_RAYTRACING_SHADER_CONFIG = 9,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_RAYTRACING_PIPELINE_CONFIG = 10,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_HIT_GROUP = 11,
	DXIL_SPV_RDAT_SUBOBJECT_KIND_RAYTRACING_PIPELINE_CONFIG1 = 12,
	DXIL_SPV_RDAT_SUBOBJECT_TYPE_INT_MAX = 0x7fffffff
} dxil_spv_rdat_subobject_kind;

typedef enum dxil_spv_hit_group_type
{
	DXIL_SPV_HIT_GROUP_TYPE_TRIANGLE = 0,
	DXIL_SPV_HIT_GROUP_TYPE_PROCEDURAL = 1,
	DXIL_SPV_HIT_GROUP_TYPE_INT_MAX = 0x7fffffff
} dxil_spv_hit_group_type;

typedef enum dxil_spv_shader_quirk
{
	DXIL_SPV_SHADER_QUIRK_NONE = 0,
	/* This is softer and only applies to shaders that uses thread group coherence at least once.
	 * If that is the case, promotes all other uses too. Intended to be suitable for a game-global workaround. */
	DXIL_SPV_SHADER_QUIRK_FORCE_DEVICE_MEMORY_BARRIERS_THREAD_GROUP_COHERENCE = 1,
	DXIL_SPV_SHADER_QUIRK_ASSUME_BROKEN_SUB_8x8_CUBE_MIPS = 2,
	DXIL_SPV_SHADER_QUIRK_ROBUST_PHYSICAL_CBV_FORWARDING = 3,
	DXIL_SPV_SHADER_QUIRK_MESH_OUTPUTS_ROBUSTNESS = 4,
	DXIL_SPV_SHADER_QUIRK_AGGRESSIVE_NONUNIFORM = 5,
	DXIL_SPV_SHADER_QUIRK_ROBUST_PHYSICAL_CBV = 6,
	/* This is a harder workaround which forces UAV barriers even if shader does not use anything like that.
	 * Intended to be used with specific shaders since it's not feasible to detect the race condition algorithmically. */
	DXIL_SPV_SHADER_QUIRK_PROMOTE_GROUP_TO_DEVICE_MEMORY_BARRIER = 7,
	DXIL_SPV_SHADER_QUIRK_GROUP_SHARED_AUTO_BARRIER = 8,
	DXIL_SPV_SHADER_QUIRK_INT_MAX = 0x7fffffff
} dxil_spv_shader_quirk;

#ifdef DXIL_SPV_ENABLE_EXPERIMENTAL_WORKGRAPHS
typedef enum dxil_spv_node_launch_type
{
	DXIL_SPV_NODE_LAUNCH_TYPE_INVALID = 0,
	DXIL_SPV_NODE_LAUNCH_TYPE_BROADCASTING = 1,
	DXIL_SPV_NODE_LAUNCH_TYPE_COALESCING = 2,
	DXIL_SPV_NODE_LAUNCH_TYPE_THREAD = 3,
	DXIL_SPV_NODE_LAUNCH_TYPE_INT_MAX = 0x7fffffff
} dxil_spv_node_launch_type;
#endif

typedef struct dxil_spv_d3d_binding
{
	dxil_spv_shader_stage stage;
	dxil_spv_resource_kind kind;
	unsigned resource_index;
	unsigned register_space;
	unsigned register_index;
	unsigned range_size;
	/* For raw buffers, this is equal to 16, for structured buffers this is equal to the stride of the elements.
	 * This can be used by the implementation to select an appropriate descriptor type.
	 * Otherwise, 0. */
	unsigned alignment;
} dxil_spv_d3d_binding;

typedef struct dxil_spv_vulkan_binding
{
	unsigned set;
	unsigned binding;

	/* For bindless, refers to the Nth root constant.
	 * For buffer device address, refers to the Nth root descriptor. */
	unsigned root_constant_index;

	struct
	{
		unsigned heap_root_offset;
		dxil_spv_bool use_heap;
	} bindless;
	dxil_spv_vulkan_descriptor_type descriptor_type;
} dxil_spv_vulkan_binding;

/* Remaps UAVs to desired binding points. */
typedef struct dxil_spv_uav_d3d_binding
{
	dxil_spv_d3d_binding d3d_binding;
	dxil_spv_bool has_counter;
} dxil_spv_uav_d3d_binding;

typedef struct dxil_spv_srv_vulkan_binding
{
	dxil_spv_vulkan_binding buffer_binding;
	dxil_spv_vulkan_binding offset_binding;
} dxil_spv_srv_vulkan_binding;

typedef struct dxil_spv_uav_vulkan_binding
{
	dxil_spv_vulkan_binding buffer_binding;
	dxil_spv_vulkan_binding counter_binding;
	dxil_spv_vulkan_binding offset_binding;
} dxil_spv_uav_vulkan_binding;

typedef struct dxil_spv_push_constant_mapping
{
	unsigned offset_in_words;
} dxil_spv_push_constant_mapping;

typedef struct dxil_spv_cbv_vulkan_binding
{
	union
	{
		dxil_spv_vulkan_binding uniform_binding;
		dxil_spv_push_constant_mapping push_constant;
	} vulkan;
	dxil_spv_bool push_constant;
} dxil_spv_cbv_vulkan_binding;

typedef struct dxil_spv_compiled_spirv
{
	const void *data;
	size_t size;
} dxil_spv_compiled_spirv;

typedef dxil_spv_bool (*dxil_spv_srv_remapper_cb)(void *userdata,
                                                  const dxil_spv_d3d_binding *d3d_binding,
                                                  dxil_spv_srv_vulkan_binding *vulkan_binding);
typedef dxil_spv_bool (*dxil_spv_sampler_remapper_cb)(void *userdata,
                                                      const dxil_spv_d3d_binding *d3d_binding,
                                                      dxil_spv_vulkan_binding *vulkan_binding);
typedef dxil_spv_bool (*dxil_spv_uav_remapper_cb)(void *userdata,
                                                  const dxil_spv_uav_d3d_binding *d3d_uav_binding,
                                                  dxil_spv_uav_vulkan_binding *vulkan_uav_binding);
typedef dxil_spv_bool (*dxil_spv_cbv_remapper_cb)(void *userdata,
                                                  const dxil_spv_d3d_binding *d3d_uav_binding,
                                                  dxil_spv_cbv_vulkan_binding *vulkan_uav_binding);

typedef struct dxil_spv_rdat_subobject
{
	// See dxil_parser.hpp for details.
	dxil_spv_rdat_subobject_kind kind;
	const char *subobject_name;
	dxil_spv_hit_group_type hit_group_type;
	const char * const *exports;
	unsigned num_exports;
	unsigned args[2];
	const void *payload;
	size_t payload_size;
} dxil_spv_rdat_subobject;

#ifdef DXIL_SPV_ENABLE_EXPERIMENTAL_WORKGRAPHS
typedef struct dxil_spv_node_input_data
{
	const char *node_id; /* This is often same as entry point name, but does not have to be. */
	unsigned payload_stride; /* If 0, there is no input payload, i.e. EmptyNode. */
	dxil_spv_node_launch_type launch_type;
	unsigned node_array_index;
	unsigned dispatch_grid_offset;
	unsigned dispatch_grid_type_bits;
	unsigned dispatch_grid_components;
	unsigned broadcast_grid[3]; /* For broadcast nodes. */
	unsigned thread_group_size_spec_id[3];
	unsigned max_broadcast_grid_spec_id[3];
	unsigned recursion_factor; /* [NodeMaxRecursionDepth] */
	unsigned coalesce_factor;
	const char *node_share_input_id;
	unsigned node_share_input_array_index;
	unsigned local_root_arguments_table_index;
	unsigned is_indirect_bda_stride_program_entry_spec_id;
	unsigned is_entry_point_spec_id;
	unsigned dispatch_grid_is_upper_bound_spec_id;
	unsigned is_static_broadcast_node_spec_id;
	dxil_spv_bool dispatch_grid_is_upper_bound; /* [NodeMaxDispatchGrid] if true. */
	dxil_spv_bool node_track_rw_input_sharing; /* Payload is tagged with [NodeTrackRWInputSharing]. */
	dxil_spv_bool is_program_entry; /* [NodeIsProgramEntry] */
} dxil_spv_node_input_data;

typedef struct dxil_spv_node_output_data
{
	const char *node_id;
	unsigned node_array_index;
	unsigned node_array_size; /* If UINT32_MAX, it's unbounded. */
	unsigned node_index_spec_constant_id;
	unsigned max_records;
	dxil_spv_bool sparse_array;
	/* We get the rest of the information from the target entry point's input data.
	 * Output data is only for determining linkage. */
} dxil_spv_node_output_data;
#endif

typedef enum dxil_spv_log_level
{
	DXIL_SPV_LOG_LEVEL_DEBUG,
	DXIL_SPV_LOG_LEVEL_WARN,
	DXIL_SPV_LOG_LEVEL_ERROR,
	DXIL_SPV_LOG_LEVEL_INT_MAX = 0x7fffffff
} dxil_spv_log_level;

typedef void (*dxil_spv_log_cb)(void *userdata, dxil_spv_log_level, const char *);

typedef enum dxil_spv_option
{
	DXIL_SPV_OPTION_INVALID = 0,
	DXIL_SPV_OPTION_SHADER_DEMOTE_TO_HELPER = 1,
	DXIL_SPV_OPTION_DUAL_SOURCE_BLENDING = 2,
	DXIL_SPV_OPTION_OUTPUT_SWIZZLE = 3,
	DXIL_SPV_OPTION_RASTERIZER_SAMPLE_COUNT = 4,
	DXIL_SPV_OPTION_ROOT_CONSTANT_INLINE_UNIFORM_BLOCK = 5,
	DXIL_SPV_OPTION_BINDLESS_CBV_SSBO_EMULATION = 6,
	DXIL_SPV_OPTION_PHYSICAL_STORAGE_BUFFER = 7,
	DXIL_SPV_OPTION_SBT_DESCRIPTOR_SIZE_LOG2 = 8,
	DXIL_SPV_OPTION_SSBO_ALIGNMENT = 9,
	DXIL_SPV_OPTION_TYPED_UAV_READ_WITHOUT_FORMAT = 10,
	DXIL_SPV_OPTION_SHADER_SOURCE_FILE = 11,
	DXIL_SPV_OPTION_BINDLESS_TYPED_BUFFER_OFFSETS = 12,
	DXIL_SPV_OPTION_BINDLESS_OFFSET_BUFFER_LAYOUT = 13,
	DXIL_SPV_OPTION_STORAGE_INPUT_OUTPUT_16BIT = 14,
	DXIL_SPV_OPTION_DESCRIPTOR_QA = 15,
	DXIL_SPV_OPTION_MIN_PRECISION_NATIVE_16BIT = 16,
	DXIL_SPV_OPTION_SHADER_I8_DOT = 17,
	DXIL_SPV_OPTION_SHADER_RAY_TRACING_PRIMITIVE_CULLING = 18,
	DXIL_SPV_OPTION_INVARIANT_POSITION = 19,
	DXIL_SPV_OPTION_SCALAR_BLOCK_LAYOUT = 20,
	DXIL_SPV_OPTION_BARYCENTRIC_KHR = 21,
	DXIL_SPV_OPTION_ROBUST_PHYSICAL_CBV_LOAD = 22,
	DXIL_SPV_OPTION_ARITHMETIC_RELAXED_PRECISION = 23,
	DXIL_SPV_OPTION_PHYSICAL_ADDRESS_DESCRIPTOR_INDEXING = 24,
	DXIL_SPV_OPTION_FORCE_SUBGROUP_SIZE = 25,
	DXIL_SPV_OPTION_DENORM_PRESERVE_SUPPORT = 26,
	DXIL_SPV_OPTION_STRICT_HELPER_LANE_WAVE_OPS = 27,
	DXIL_SPV_OPTION_SUBGROUP_PARTITIONED_NV = 28,
	DXIL_SPV_OPTION_DEAD_CODE_ELIMINATE = 29,
	DXIL_SPV_OPTION_PRECISE_CONTROL = 30,
	DXIL_SPV_OPTION_SAMPLE_GRAD_OPTIMIZATION_CONTROL = 31,
	DXIL_SPV_OPTION_OPACITY_MICROMAP = 32,
	DXIL_SPV_OPTION_BRANCH_CONTROL = 33,
	DXIL_SPV_OPTION_SUBGROUP_PROPERTIES = 34,
	DXIL_SPV_OPTION_DESCRIPTOR_HEAP_ROBUSTNESS = 35,
	DXIL_SPV_OPTION_COMPUTE_SHADER_DERIVATIVES_NV = 36,
	DXIL_SPV_OPTION_QUAD_CONTROL_RECONVERGENCE = 37,
	DXIL_SPV_OPTION_RAW_ACCESS_CHAINS_NV = 38,
	DXIL_SPV_OPTION_DRIVER_VERSION = 39,
	DXIL_SPV_OPTION_COMPUTE_SHADER_DERIVATIVES = 40,
	DXIL_SPV_OPTION_INSTRUCTION_INSTRUMENTATION = 41,
	DXIL_SPV_OPTION_SHADER_QUIRK = 42,
	DXIL_SPV_OPTION_EXTENDED_ROBUSTNESS = 43,
	DXIL_SPV_OPTION_MAX_TESS_FACTOR = 44,
	DXIL_SPV_OPTION_INT_MAX = 0x7fffffff
} dxil_spv_option;

typedef enum dxil_spv_shader_feature
{
	DXIL_SPV_SHADER_FEATURE_NATIVE_16BIT_OPERATIONS = 0,
	DXIL_SPV_SHADER_FEATURE_INT_MAX = 0x7fffffff
} dxil_spv_shader_feature;

typedef enum dxil_spv_instruction_instrumentation_type
{
	DXIL_SPV_INSTRUCTION_INSTRUMENTATION_TYPE_FULL_NAN_INF = 0,
	DXIL_SPV_INSTRUCTION_INSTRUMENTATION_TYPE_EXTERNALLY_VISIBLE_WRITE_NAN_INF = 1,
	DXIL_SPV_INSTRUCTION_INSTRUMENTATION_TYPE_FLUSH_NAN_TO_ZERO = 2,
	DXIL_SPV_INSTRUCTION_INSTRUMENTATION_TYPE_EXPECT_ASSUME = 3,
	DXIL_SPV_INSTRUCTION_INSTRUMENTATION_TYPE_BUFFER_SYNCHRONIZATION_VALIDATION = 4,
	DXIL_SPV_INSTRUCTION_INSTRUMENTATION_INT_MAX = 0x7fffffff
} dxil_spv_instruction_instrumentation_type;

typedef struct dxil_spv_option_base
{
	dxil_spv_option type;
} dxil_spv_option_base;

typedef struct dxil_spv_option_shader_demote_to_helper
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_shader_demote_to_helper;

typedef struct dxil_spv_option_dual_source_blending
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_dual_source_blending;

typedef struct dxil_spv_option_output_swizzle
{
	dxil_spv_option_base base;
	/* Each element represents one SV_Target location in a pixel shader.
	 * Bits [0:1] represent which output component to emit in R.
	 * Bits [2:3] represent which output component to emit in G.
	 * Bits [4:5] represent which output component to emit in B.
	 * Bits [6:7] represent which output component to emit in A.
	 * There must exist a 1:1 mapping between input and output, i.e. all components must be used
	 * an an input to exactly one output component.
	 */
	const unsigned *swizzles;
	unsigned swizzle_count;
} dxil_spv_option_output_swizzle;

typedef struct dxil_spv_option_rasterizer_sample_count
{
	dxil_spv_option_base base;
	unsigned sample_count;
	dxil_spv_bool spec_constant;
} dxil_spv_option_rasterizer_sample_count;

typedef struct dxil_spv_option_root_constant_inline_uniform_block
{
	dxil_spv_option_base base;
	unsigned desc_set;
	unsigned binding;
	dxil_spv_bool enable;
} dxil_spv_option_root_constant_inline_uniform_block;

typedef struct dxil_spv_option_bindless_cbv_ssbo_emulation
{
	dxil_spv_option_base base;
	dxil_spv_bool enable;
} dxil_spv_option_bindless_cbv_ssbo_emulation;

typedef struct dxil_spv_option_physical_storage_buffer
{
	dxil_spv_option_base base;
	dxil_spv_bool enable;
} dxil_spv_option_physical_storage_buffer;

typedef struct dxil_spv_option_sbt_descriptor_size_log2
{
	dxil_spv_option_base base;
	unsigned size_log2_srv_uav_cbv;
	unsigned size_log2_sampler;
} dxil_spv_option_sbt_descriptor_size_log2;

typedef struct dxil_spv_option_ssbo_alignment
{
	dxil_spv_option_base base;
	unsigned alignment;
} dxil_spv_option_ssbo_alignment;

typedef struct dxil_spv_option_typed_uav_read_without_format
{
	dxil_spv_option_base base;
	bool supported;
} dxil_spv_option_typed_uav_read_without_format;

typedef struct dxil_spv_option_shader_source_file
{
	dxil_spv_option_base base;
	const char *name; /* String constants will be copied. */
} dxil_spv_option_shader_source_file;

typedef struct dxil_spv_option_bindless_typed_buffer_offsets
{
	dxil_spv_option_base base;
	dxil_spv_bool enable;
} dxil_spv_option_bindless_typed_buffer_offsets;

typedef struct dxil_spv_option_bindless_offset_buffer_layout
{
	dxil_spv_option_base base;
	unsigned untyped_offset;
	unsigned typed_offset;
	unsigned stride;
} dxil_spv_option_bindless_offset_buffer_layout;

typedef struct dxil_spv_option_storage_input_output_16bit
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_storage_input_output_16bit;

typedef struct dxil_spv_option_descriptor_qa
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
	unsigned version;
	unsigned global_desc_set;
	unsigned global_binding;
	unsigned heap_desc_set;
	unsigned heap_binding;
	unsigned long long shader_hash;
} dxil_spv_option_descriptor_qa;

typedef struct dxil_spv_option_min_precision_native_16bit
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_min_precision_native_16bit;

typedef struct dxil_spv_option_shader_i8_dot
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_shader_i8_dot;

typedef struct dxil_spv_option_shader_ray_tracing_primitive_culling
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_shader_ray_tracing_primitive_culling;

typedef struct dxil_spv_option_invariant_position
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_invariant_position;

typedef struct dxil_spv_option_scalar_block_layout
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
	dxil_spv_bool supports_per_component_robustness;
} dxil_spv_option_scalar_block_layout;

typedef struct dxil_spv_option_barycentric_khr
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_barycentric_khr;

/* Obsolete. Use the shader quirk version of this instead. */
typedef struct dxil_spv_option_robust_physical_cbv_load
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_robust_physical_cbv_load;

typedef struct dxil_spv_option_arithmetic_relaxed_precision
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_arithmetic_relaxed_precision;

typedef struct dxil_spv_option_physical_address_descriptor_indexing
{
	dxil_spv_option_base base;
	unsigned element_stride;
	unsigned element_offset;
} dxil_spv_option_physical_address_descriptor_indexing;

typedef struct dxil_spv_option_force_subgroup_size
{
	dxil_spv_option_base base;
	unsigned forced_value;
	dxil_spv_bool wave_size_enable;
} dxil_spv_option_force_subgroup_size;

typedef struct dxil_spv_option_denorm_preserve_support
{
	dxil_spv_option_base base;
	dxil_spv_bool supports_float16_denorm_preserve;
	dxil_spv_bool supports_float64_denorm_preserve;
} dxil_spv_option_denorm_preserve_support;

typedef struct dxil_spv_option_strict_helper_lane_wave_ops
{
	dxil_spv_option_base base;
	dxil_spv_bool enable;
} dxil_spv_option_strict_helper_lane_wave_ops;

typedef struct dxil_spv_option_subgroup_partitioned_nv
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_subgroup_partitioned_nv;

typedef struct dxil_spv_option_dead_code_eliminate
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_dead_code_eliminate;

typedef struct dxil_spv_option_precise_control
{
	dxil_spv_option_base base;
	dxil_spv_bool force_precise;
	dxil_spv_bool propagate_precise;
} dxil_spv_option_precise_control;

typedef struct dxil_spv_option_sample_grad_optimization_control
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
	dxil_spv_bool assume_uniform_scale;
} dxil_spv_option_sample_grad_optimization_control;

typedef struct dxil_spv_option_opacity_micromap
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_opacity_micromap;

typedef struct dxil_spv_option_branch_control
{
	dxil_spv_option_base base;
	dxil_spv_bool use_shader_metadata;
	dxil_spv_bool force_unroll;
	dxil_spv_bool force_loop;
	dxil_spv_bool force_flatten;
	dxil_spv_bool force_branch;
} dxil_spv_option_branch_control;

typedef struct dxil_spv_option_subgroup_properties
{
	dxil_spv_option_base base;
	unsigned minimum_size;
	unsigned maximum_size;
} dxil_spv_option_subgroup_properties;

typedef struct dxil_spv_option_descriptor_heap_robustness
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
} dxil_spv_option_descriptor_heap_robustness;

typedef struct dxil_spv_option_compute_shader_derivatives_nv
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_compute_shader_derivatives_nv;

typedef struct dxil_spv_option_quad_control_reconvergence
{
	dxil_spv_option_base base;
	dxil_spv_bool supports_quad_control;
	dxil_spv_bool supports_maximal_reconvergence;
	dxil_spv_bool force_maximal_reconvergence;
} dxil_spv_option_quad_control_reconvergence;

typedef struct dxil_spv_option_raw_access_chains_nv
{
	dxil_spv_option_base base;
	dxil_spv_bool supported;
} dxil_spv_option_raw_access_chains_nv;

typedef struct dxil_spv_option_driver_version
{
	dxil_spv_option_base base;
	unsigned driver_id;
	unsigned driver_version;
} dxil_spv_option_driver_version;

typedef struct dxil_spv_option_compute_shader_derivatives
{
	dxil_spv_option_base base;
	dxil_spv_bool supports_nv;
	dxil_spv_bool supports_khr;
} dxil_spv_option_compute_shader_derivatives;

typedef struct dxil_spv_option_instruction_instrumentation
{
	dxil_spv_option_base base;
	dxil_spv_bool enabled;
	unsigned version;
	unsigned control_desc_set;
	unsigned control_binding;
	unsigned payload_desc_set;
	unsigned payload_binding;
	unsigned long long shader_hash;
	dxil_spv_instruction_instrumentation_type type;
} dxil_spv_option_instruction_instrumentation;

typedef struct dxil_spv_option_shader_quirk
{
	dxil_spv_option_base base;
	dxil_spv_shader_quirk quirk;
} dxil_spv_option_shader_quirk;

typedef struct dxil_spv_option_extended_robustness
{
	dxil_spv_option_base base;
	dxil_spv_bool robust_group_shared;
	dxil_spv_bool robust_alloca;
	dxil_spv_bool robust_constant_lut;
} dxil_spv_option_extended_robustness;

typedef struct dxil_spv_option_max_tess_factor
{
	dxil_spv_option_base base;
	unsigned max_tess_factor;
} dxil_spv_option_max_tess_factor;

/* Gets the ABI version used to build this library. Used to detect API/ABI mismatches. */
DXIL_SPV_PUBLIC_API void dxil_spv_get_version(unsigned *major, unsigned *minor, unsigned *patch);

/* Parsing API */
/* Parses and frees a DXBC blob. */
typedef struct dxil_spv_parsed_blob_s *dxil_spv_parsed_blob;

/* Parses a DXBC archive as is passed into CreatePipeline, which contains a DXIL blob. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parse_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob);
/* A variant that attempts to read the STAT block instead. The STAT block contains DXIL that is only used for reflection. (?!?!) */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parse_reflection_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob);

/* Parses raw DXIL (LLVM BC). */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parse_dxil(const void *data, size_t size, dxil_spv_parsed_blob *blob);

/* Dumps the LLVM IR representation to console. For debugging. */
DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_dump_llvm_ir(dxil_spv_parsed_blob blob);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_disassembled_ir(dxil_spv_parsed_blob blob, const char **str);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_raw_ir(dxil_spv_parsed_blob blob, const void **data, size_t *size);

DXIL_SPV_PUBLIC_API dxil_spv_shader_stage dxil_spv_parsed_blob_get_shader_stage(dxil_spv_parsed_blob blob);
DXIL_SPV_PUBLIC_API dxil_spv_shader_stage dxil_spv_parsed_blob_get_shader_stage_for_entry(dxil_spv_parsed_blob blob, const char *entry);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_entry_index_by_name(dxil_spv_parsed_blob blob,
                                                                                 const char *entry,
                                                                                 unsigned *index);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_num_entry_points(dxil_spv_parsed_blob blob, unsigned *count);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_entry_point_name(dxil_spv_parsed_blob blob,
                                                                              unsigned index,
                                                                              const char **mangled_entry);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_entry_point_demangled_name(dxil_spv_parsed_blob blob,
                                                                                        unsigned index,
                                                                                        const char **demangled_entry);

#ifdef DXIL_SPV_ENABLE_EXPERIMENTAL_WORKGRAPHS
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_entry_point_node_input(
	dxil_spv_parsed_blob blob, unsigned index, dxil_spv_node_input_data *data);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_entry_point_num_node_outputs(
	dxil_spv_parsed_blob blob, unsigned index, unsigned *num_outputs);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_entry_point_node_output(
	dxil_spv_parsed_blob blob, unsigned index, unsigned output_index, dxil_spv_node_output_data *data);
#endif

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_scan_resources(
		dxil_spv_parsed_blob blob,
		dxil_spv_srv_remapper_cb srv_remapper,
		dxil_spv_sampler_remapper_cb sampler_remapper,
		dxil_spv_cbv_remapper_cb cbv_remapper,
		dxil_spv_uav_remapper_cb uav_remapper,
		void *userdata);

/* For DXR, API subobjects can be embedded inside the blob. */
DXIL_SPV_PUBLIC_API unsigned dxil_spv_parsed_blob_get_num_rdat_subobjects(
		dxil_spv_parsed_blob blob);
DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_get_rdat_subobject(
		dxil_spv_parsed_blob blob, unsigned index, dxil_spv_rdat_subobject *subobject);

DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_free(dxil_spv_parsed_blob blob);
/* Parsing API */

/* Sets per thread global state. */
DXIL_SPV_PUBLIC_API void dxil_spv_set_thread_log_callback(dxil_spv_log_cb callback, void *userdata);

/* Converter API */

typedef struct dxil_spv_converter_s *dxil_spv_converter;
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_create_converter(dxil_spv_parsed_blob blob, dxil_spv_converter *converter);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_create_converter_with_reflection(dxil_spv_parsed_blob blob,
                                                                              dxil_spv_parsed_blob reflection_blob,
                                                                              dxil_spv_converter *converter);
DXIL_SPV_PUBLIC_API void dxil_spv_converter_free(dxil_spv_converter converter);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_entry_point(dxil_spv_converter converter, const char *entry_point);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_stage_input_remapper(
		dxil_spv_converter converter,
		dxil_spv_shader_stage_io_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_stage_output_remapper(
		dxil_spv_converter converter,
		dxil_spv_shader_stage_io_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_vertex_input_remapper(
		dxil_spv_converter converter,
		dxil_spv_vertex_input_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_stream_output_remapper(
		dxil_spv_converter converter,
		dxil_spv_stream_output_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_srv_remapper(
		dxil_spv_converter converter,
		dxil_spv_srv_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_sampler_remapper(
		dxil_spv_converter converter,
		dxil_spv_sampler_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_root_constant_word_count(dxil_spv_converter converter,
                                                                         unsigned num_words);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_root_descriptor_count(dxil_spv_converter converter,
                                                                      unsigned count);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_uav_remapper(
		dxil_spv_converter converter,
		dxil_spv_uav_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_cbv_remapper(
		dxil_spv_converter converter,
		dxil_spv_cbv_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_add_local_root_constants(
	dxil_spv_converter converter,
	unsigned register_space,
	unsigned register_index,
	unsigned num_words);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_add_local_root_descriptor(
	dxil_spv_converter converter,
	dxil_spv_resource_class resource_class,
	unsigned register_space,
	unsigned register_index);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_add_local_root_descriptor_table(
	dxil_spv_converter converter,
	dxil_spv_resource_class resource_class,
	unsigned register_space,
	unsigned register_index,
	unsigned num_descriptors_in_range,
	unsigned offset_in_heap);

/* For multiple table entries per local root parameter, call begin, at least one add_local, and then end
 * will commit that local root parameter. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_begin_local_root_descriptor_table(
	dxil_spv_converter converter);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_end_local_root_descriptor_table(
	dxil_spv_converter converter);

/* After setting up converter, runs the converted to SPIR-V. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_run(dxil_spv_converter converter);

/* Obtain final SPIR-V. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compiled_spirv(dxil_spv_converter converter,
                                                                          dxil_spv_compiled_spirv *compiled);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compiled_entry_point(dxil_spv_converter converter,
                                                                                const char **entry_point);

/* Useful to check if the implementation recognizes a particular option for ABI compatibility. */
DXIL_SPV_PUBLIC_API dxil_spv_bool dxil_spv_converter_supports_option(dxil_spv_option option);
/* Adds a generic option to the implementation which allows it to generate more advanced code or change codegen if desired.
 * Baseline assumed feature set is Vulkan 1.1 / SPIR-V 1.3. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_add_option(dxil_spv_converter converter,
                                                                  const dxil_spv_option_base *option);

/* After compilation. Queries if SubgroupSize builtin was emitted, which requires ALLOW_VARYING_SUBGROUP_SIZE
 * in Vulkan. */
DXIL_SPV_PUBLIC_API dxil_spv_bool dxil_spv_converter_uses_subgroup_size(dxil_spv_converter converter);

/* After compilation. Queries CS workgroup dimensions used.
 * Can be relevant for some subgroup_size_control workarounds. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compute_workgroup_dimensions(
	dxil_spv_converter converter,
	unsigned *x, unsigned *y, unsigned *z);

/* After compilation. Queries CS required wave size.
 * If *wave_size is non-zero, maps to requiredSubgroupSize, otherwise, VARYING_SUBGROUP_SIZE. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compute_required_wave_size(
	dxil_spv_converter converter, unsigned *wave_size);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compute_wave_size_range(
	dxil_spv_converter converter, unsigned *wave_size, unsigned *wave_size_max, unsigned *wave_size_preferred);

/* After compilation. Queries suggested maximum wave size. The behavior here depends on heuristics
 * and can be ignored, but is often used for workarounds and identifying dubious shader code.
 * If *wave_size is non-zero, could map to requiredSubgroupSize. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compute_heuristic_max_wave_size(
	dxil_spv_converter converter, unsigned *wave_size);

/* After compilation, queries num vertices for HS. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_patch_vertex_count(
	dxil_spv_converter converter, unsigned *patch_vertices);

/* After compilation, queries if shader feature is used.
 * Designed to map closely to D3D12 feature checks. */
DXIL_SPV_PUBLIC_API dxil_spv_bool dxil_spv_converter_uses_shader_feature(
	dxil_spv_converter converter, dxil_spv_shader_feature feature);

/* Intended to be added to the GLSL output in repro suite.
 * Attempts to analyze the DXIL for potential out of spec behavior that needs another pair of eyes.
 * Lifetime of string is only as long as converter is alive.
 * Returns NULL when there are no warnings. */
DXIL_SPV_PUBLIC_API const char *dxil_spv_converter_get_analysis_warnings(dxil_spv_converter converter);

/* Use an optimized allocation scheme.
 * Call begin before allocating any dxil_spv objects,
 * and end after all dxil_spv created by this thread is destroyed.
 * Reset is an optimized variant of end() -> begin(). Useful if compiling multiple shaders one after another. */
DXIL_SPV_PUBLIC_API void dxil_spv_begin_thread_allocator_context(void);
DXIL_SPV_PUBLIC_API void dxil_spv_end_thread_allocator_context(void);
DXIL_SPV_PUBLIC_API void dxil_spv_reset_thread_allocator_context(void);

/* Converter API */

#ifdef __cplusplus
}
#endif
#endif
