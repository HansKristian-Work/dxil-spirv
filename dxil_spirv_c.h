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
#include "spirv.h"

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

typedef enum dxil_spv_result
{
	DXIL_SPV_SUCCESS = 0,
	DXIL_SPV_OUT_OF_MEMORY = -1,
	DXIL_SPV_GENERIC_ERROR = -2,
	DXIL_SPV_UNSUPPORTED_FEATURE = -3,
	DXIL_SPV_RESULT_INT_MAX = 0x7fffffff
} dxil_spv_result;

/* C89 does not have bool type. */
typedef unsigned char dxil_spv_bool;
#define DXIL_SPV_TRUE ((dxil_spv_bool)1)
#define DXIL_SPV_FALSE ((dxil_spv_bool)0)

/* Gets the ABI version used to build this library. Used to detect API/ABI mismatches. */
DXIL_SPV_PUBLIC_API void dxil_spv_get_version(unsigned *major, unsigned *minor, unsigned *patch);

/* Parsing API */
/* Parses and frees a DXBC blob. */
typedef struct dxil_spv_parsed_blob_s *dxil_spv_parsed_blob;

/* Parses a DXBC archive as is passed into CreatePipeline. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_parse_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob);
/* Dumps the LLVM IR representation to console. For debugging. */
DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_dump_llvm_ir(dxil_spv_parsed_blob blob);
DXIL_SPV_PUBLIC_API void dxil_spv_parsed_blob_free(dxil_spv_parsed_blob blob);
/* Parsing API */

/* Converter API */
typedef struct dxil_spv_converter_s *dxil_spv_converter;
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_create_converter(dxil_spv_parsed_blob blob, dxil_spv_converter *converter);

/* Remaps input attribute to desired location. */
typedef void (*dxil_spv_vertex_input_remapper_cb)(void *userdata, const char *semantic, unsigned index, unsigned *location);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_set_vertex_input_remapper(
		dxil_spv_converter converter,
		dxil_spv_vertex_input_remapper_cb remapper,
		void *userdata);

typedef struct dxil_spv_d3d_binding
{
	unsigned register_space;
	unsigned register_index;
} dxil_spv_d3d_binding;

typedef struct dxil_spv_vulkan_binding
{
	unsigned set;
	unsigned binding;
} dxil_spv_vulkan_binding;

/* Remaps SRVs and Samplers to desired binding points. */
typedef void (*dxil_spv_srv_sampler_remapper_cb)(void *userdata,
                                                 const dxil_spv_d3d_binding *d3d_binding,
                                                 dxil_spv_vulkan_binding *vulkan_binding);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_set_srv_sampler_remapper(
		dxil_spv_converter converter,
		dxil_spv_srv_sampler_remapper_cb remapper,
		void *userdata);

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
typedef void (*dxil_spv_uav_remapper_cb)(void *userdata,
                                         const dxil_spv_uav_d3d_binding *d3d_uav_binding,
                                         dxil_spv_uav_vulkan_binding *vulkan_uav_binding);
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_set_uav_remapper(
		dxil_spv_converter converter,
		dxil_spv_uav_remapper_cb remapper,
		void *userdata);

typedef struct dxil_spv_push_constant_mapping
{
	unsigned offset_in_32bit_words;
	unsigned size_in_32bit_words;
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

typedef void (*dxil_spv_cbv_remapper_cb)(void *userdata,
                                         const dxil_spv_d3d_binding *d3d_uav_binding,
                                         dxil_spv_cbv_vulkan_binding *vulkan_uav_binding);

DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_set_cbv_remapper(
		dxil_spv_converter converter,
		dxil_spv_uav_remapper_cb remapper,
		void *userdata);

/* After setting up options, runs the converted to SPIR-V. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_run(dxil_spv_converter converter);

/* Validate final SPIR-V. Returns UNSUPPORTED_FEATURE if SPIRV-Tools was not enabled in build. */
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_validate_spirv(dxil_spv_converter converter);

/* Obtain final SPIR-V. */
typedef struct dxil_spv_compiled_spirv
{
	const void *data;
	size_t size;
} dxil_spv_compiled_spirv;
DXIL_SPV_PUBLIC_API dxil_spv_result dxil_spv_converter_get_compiled_spirv(dxil_spv_converter converter,
                                                                          dxil_spv_compiled_spirv *compiled);

DXIL_SPV_PUBLIC_API void dxil_spv_converter_free(dxil_spv_converter converter);
/* Converter API */

}
#endif
