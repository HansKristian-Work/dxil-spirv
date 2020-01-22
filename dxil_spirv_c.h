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

#ifndef DXIL_SPV_C_API_H
#define DXIL_SPV_C_API_H

#include <stddef.h>

/* C89-compatible wrapper for DXIL2SPIRV. */

#ifdef __cplusplus
extern "C" {
#endif

#define DXIL_SPV_API_VERSION_MAJOR 0
#define DXIL_SPV_API_VERSION_MINOR 0
#define DXIL_SPV_API_VERSION_PATCH 0

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

typedef struct dxil_spv_d3d_binding
{
	dxil_spv_shader_stage stage;
	dxil_spv_resource_kind kind;
	unsigned resource_index;
	unsigned register_space;
	unsigned register_index;
	unsigned range_size;
} dxil_spv_d3d_binding;

typedef struct dxil_spv_vulkan_binding
{
	unsigned set;
	unsigned binding;
	struct
	{
		unsigned root_constant_word;
		unsigned heap_root_offset;
		dxil_spv_bool use_heap;
	} bindless;
} dxil_spv_vulkan_binding;

/* Remaps UAVs to desired binding points. */
typedef struct dxil_spv_uav_d3d_binding
{
	dxil_spv_d3d_binding d3d_binding;
	dxil_spv_bool has_counter;
} dxil_spv_uav_d3d_binding;

typedef struct dxil_spv_uav_vulkan_binding
{
	dxil_spv_vulkan_binding buffer_binding;
	dxil_spv_vulkan_binding counter_binding;
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

/* Remaps SRVs and Samplers to desired binding points. */
typedef dxil_spv_bool (*dxil_spv_srv_sampler_remapper_cb)(void *userdata,
                                                          const dxil_spv_d3d_binding *d3d_binding,
                                                          dxil_spv_vulkan_binding *vulkan_binding);
typedef dxil_spv_bool (*dxil_spv_uav_remapper_cb)(void *userdata,
                                                  const dxil_spv_uav_d3d_binding *d3d_uav_binding,
                                                  dxil_spv_uav_vulkan_binding *vulkan_uav_binding);

typedef dxil_spv_bool (*dxil_spv_cbv_remapper_cb)(void *userdata,
                                                  const dxil_spv_d3d_binding *d3d_uav_binding,
                                                  dxil_spv_cbv_vulkan_binding *vulkan_uav_binding);

/* Gets the ABI version used to build this library. Used to detect API/ABI mismatches. */
DXIL_SPV_PUBLIC_API void dxil_spv_get_version(unsigned *major, unsigned *minor, unsigned *patch);

/* Parsing API */
/* Parses and frees a DXBC blob. */
typedef struct dxil_spv_parsed_blob_s *dxil_spv_parsed_blob;

/* Parses a DXBC archive as is passed into CreatePipeline, which contains a DXIL blob. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parse_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob);
/* Parses raw DXIL (LLVM BC). */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parse_dxil(const void *data, size_t size, dxil_spv_parsed_blob *blob);

/* Dumps the LLVM IR representation to console. For debugging. */
DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_dump_llvm_ir(dxil_spv_parsed_blob blob);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_get_disassembled_ir(dxil_spv_parsed_blob blob, const char **str);

DXIL_SPV_PUBLIC_API dxil_spv_shader_stage dxil_spv_parsed_blob_get_shader_stage(dxil_spv_parsed_blob blob);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parsed_blob_scan_resources(
		dxil_spv_parsed_blob blob,
		dxil_spv_srv_sampler_remapper_cb srv_remapper,
		dxil_spv_srv_sampler_remapper_cb sampler_remapper,
		dxil_spv_cbv_remapper_cb cbv_remapper,
		dxil_spv_uav_remapper_cb uav_remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_free(dxil_spv_parsed_blob blob);
/* Parsing API */

/* Converter API */
typedef struct dxil_spv_converter_s *dxil_spv_converter;
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_create_converter(dxil_spv_parsed_blob blob, dxil_spv_converter *converter);
DXIL_SPV_PUBLIC_API void dxil_spv_converter_free(dxil_spv_converter converter);

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
		dxil_spv_srv_sampler_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_sampler_remapper(
		dxil_spv_converter converter,
		dxil_spv_srv_sampler_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_root_constant_word_count(dxil_spv_converter converter,
                                                                         unsigned num_words);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_uav_remapper(
		dxil_spv_converter converter,
		dxil_spv_uav_remapper_cb remapper,
		void *userdata);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_set_cbv_remapper(
		dxil_spv_converter converter,
		dxil_spv_cbv_remapper_cb remapper,
		void *userdata);

/* After setting up converter, runs the converted to SPIR-V. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_run(dxil_spv_converter converter);

/* Obtain final SPIR-V. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compiled_spirv(dxil_spv_converter converter,
                                                                          dxil_spv_compiled_spirv *compiled);

/* Converter API */

#ifdef __cplusplus
}
#endif
#endif
