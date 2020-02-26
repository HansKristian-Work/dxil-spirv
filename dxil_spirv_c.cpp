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

#include "dxil_spirv_c.h"
#include "dxil_converter.hpp"
#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include "logging.hpp"
#include "spirv_module.hpp"
#include <new>

#include "spirv-tools/libspirv.hpp"

using namespace dxil_spv;

void dxil_spv_get_version(unsigned *major, unsigned *minor, unsigned *patch)
{
	*major = DXIL_SPV_API_VERSION_MAJOR;
	*minor = DXIL_SPV_API_VERSION_MINOR;
	*patch = DXIL_SPV_API_VERSION_PATCH;
}

struct dxil_spv_parsed_blob_s
{
	LLVMBCParser bc;
	std::string disasm;
	std::vector<uint8_t> dxil_blob;
};

struct Remapper : ResourceRemappingInterface
{
	static void copy_buffer_binding(VulkanBinding &vk_binding, const dxil_spv_vulkan_binding &c_vk_binding)
	{
		vk_binding.descriptor_set = c_vk_binding.set;
		vk_binding.binding = c_vk_binding.binding;
		vk_binding.bindless.use_heap = bool(c_vk_binding.bindless.use_heap);
		vk_binding.bindless.heap_root_offset = c_vk_binding.bindless.heap_root_offset;
		vk_binding.bindless.root_constant_word = c_vk_binding.bindless.root_constant_word;
	}

	bool remap_srv(const D3DBinding &binding, VulkanBinding &vk_binding) override
	{
		if (srv_remapper)
		{
			const dxil_spv_d3d_binding c_binding = { static_cast<dxil_spv_shader_stage>(binding.stage),
				                                     static_cast<dxil_spv_resource_kind>(binding.kind),
				                                     binding.resource_index,
				                                     binding.register_space,
				                                     binding.register_index,
				                                     binding.range_size };

			dxil_spv_vulkan_binding c_vk_binding = {};
			if (srv_remapper(srv_userdata, &c_binding, &c_vk_binding) == DXIL_SPV_TRUE)
			{
				copy_buffer_binding(vk_binding, c_vk_binding);
				return true;
			}
			else
				return false;
		}
		else
		{
			vk_binding.bindless.use_heap = false;
			vk_binding.descriptor_set = binding.register_space;
			vk_binding.binding = binding.register_index;
			return true;
		}
	}

	bool remap_sampler(const D3DBinding &binding, VulkanBinding &vk_binding) override
	{
		if (sampler_remapper)
		{
			const dxil_spv_d3d_binding c_binding = { static_cast<dxil_spv_shader_stage>(binding.stage),
				                                     static_cast<dxil_spv_resource_kind>(binding.kind),
				                                     binding.resource_index,
				                                     binding.register_space,
				                                     binding.register_index,
				                                     binding.range_size };

			dxil_spv_vulkan_binding c_vk_binding = {};
			if (sampler_remapper(sampler_userdata, &c_binding, &c_vk_binding) == DXIL_SPV_TRUE)
			{
				copy_buffer_binding(vk_binding, c_vk_binding);
				return true;
			}
			else
				return false;
		}
		else
		{
			vk_binding.bindless.use_heap = false;
			vk_binding.descriptor_set = binding.register_space;
			vk_binding.binding = binding.register_index;
			return true;
		}
	}

	bool remap_uav(const D3DUAVBinding &binding, VulkanUAVBinding &vk_binding) override
	{
		if (uav_remapper)
		{
			const dxil_spv_uav_d3d_binding c_binding = {
				{ static_cast<dxil_spv_shader_stage>(binding.binding.stage),
				  static_cast<dxil_spv_resource_kind>(binding.binding.kind), binding.binding.resource_index,
				  binding.binding.register_space, binding.binding.register_index, binding.binding.range_size },
				binding.counter ? DXIL_SPV_TRUE : DXIL_SPV_FALSE
			};

			dxil_spv_uav_vulkan_binding c_vk_binding = {};
			if (uav_remapper(uav_userdata, &c_binding, &c_vk_binding) == DXIL_SPV_TRUE)
			{
				copy_buffer_binding(vk_binding.buffer_binding, c_vk_binding.buffer_binding);
				copy_buffer_binding(vk_binding.counter_binding, c_vk_binding.counter_binding);
				return true;
			}
			else
				return false;
		}
		else
		{
			vk_binding.buffer_binding.bindless.use_heap = false;
			vk_binding.counter_binding.bindless.use_heap = false;
			vk_binding.buffer_binding.descriptor_set = binding.binding.register_space;
			vk_binding.buffer_binding.binding = binding.binding.register_index;
			vk_binding.counter_binding.descriptor_set = binding.binding.register_space + 1;
			vk_binding.counter_binding.binding = binding.binding.register_index;
			return true;
		}
	}

	bool remap_cbv(const D3DBinding &binding, VulkanCBVBinding &vk_binding) override
	{
		if (cbv_remapper)
		{
			const dxil_spv_d3d_binding c_binding = { static_cast<dxil_spv_shader_stage>(binding.stage),
				                                     static_cast<dxil_spv_resource_kind>(binding.kind),
				                                     binding.resource_index,
				                                     binding.register_space,
				                                     binding.register_index,
				                                     binding.range_size };

			dxil_spv_cbv_vulkan_binding c_vk_binding = {};
			if (cbv_remapper(cbv_userdata, &c_binding, &c_vk_binding) == DXIL_SPV_TRUE)
			{
				vk_binding.push_constant = c_vk_binding.push_constant;
				if (vk_binding.push_constant)
					vk_binding.push.offset_in_words = c_vk_binding.vulkan.push_constant.offset_in_words;
				else
					copy_buffer_binding(vk_binding.buffer, c_vk_binding.vulkan.uniform_binding);
				return true;
			}
			else
				return false;
		}
		else
		{
			vk_binding.buffer.bindless.use_heap = false;
			vk_binding.buffer.descriptor_set = binding.register_space;
			vk_binding.buffer.binding = binding.register_index;
			return true;
		}
	}

	bool remap_vertex_input(const D3DVertexInput &d3d_input, VulkanVertexInput &vk_input) override
	{
		dxil_spv_d3d_vertex_input c_input = { d3d_input.semantic, d3d_input.semantic_index, d3d_input.start_row,
			                                  d3d_input.rows };
		dxil_spv_vulkan_vertex_input c_vk_input = {};

		if (input_remapper)
		{
			if (input_remapper(input_userdata, &c_input, &c_vk_input) == DXIL_SPV_TRUE)
			{
				vk_input.location = c_vk_input.location;
				return true;
			}
			else
				return false;
		}
		else
		{
			vk_input.location = d3d_input.start_row;
			return true;
		}
	}

	bool remap_stream_output(const D3DStreamOutput &d3d_output, VulkanStreamOutput &vk_output) override
	{
		dxil_spv_d3d_stream_output c_output = { d3d_output.semantic, d3d_output.semantic_index };
		dxil_spv_vulkan_stream_output c_vk_output = {};

		if (output_remapper)
		{
			if (output_remapper(output_userdata, &c_output, &c_vk_output) == DXIL_SPV_TRUE)
			{
				vk_output.enable = bool(c_vk_output.enable);
				vk_output.offset = c_vk_output.offset;
				vk_output.stride = c_vk_output.stride;
				vk_output.buffer_index = c_vk_output.buffer_index;
				return true;
			}
			else
				return false;
		}
		else
		{
			return true;
		}
	}

	unsigned get_root_constant_word_count() override
	{
		return root_constant_word_count;
	}

	dxil_spv_srv_sampler_remapper_cb srv_remapper = nullptr;
	void *srv_userdata = nullptr;

	dxil_spv_srv_sampler_remapper_cb sampler_remapper = nullptr;
	void *sampler_userdata = nullptr;

	dxil_spv_uav_remapper_cb uav_remapper = nullptr;
	void *uav_userdata = nullptr;

	dxil_spv_cbv_remapper_cb cbv_remapper = nullptr;
	void *cbv_userdata = nullptr;

	dxil_spv_vertex_input_remapper_cb input_remapper = nullptr;
	void *input_userdata = nullptr;

	dxil_spv_stream_output_remapper_cb output_remapper = nullptr;
	void *output_userdata = nullptr;

	unsigned root_constant_word_count = 0;
};

struct dxil_spv_converter_s
{
	explicit dxil_spv_converter_s(LLVMBCParser &bc_parser)
	    : converter(bc_parser, module)
	{
	}
	SPIRVModule module;
	Converter converter;
	std::vector<uint32_t> spirv;
	Remapper remapper;
};

dxil_spv_result dxil_spv_parse_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob)
{
	auto *parsed = new (std::nothrow) dxil_spv_parsed_blob_s;
	if (!parsed)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	DXILContainerParser parser;
	if (!parser.parse_container(data, size))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	parsed->dxil_blob = std::move(parser.get_blob());

	if (!parsed->bc.parse(parsed->dxil_blob.data(), parsed->dxil_blob.size()))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	*blob = parsed;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parse_dxil(const void *data, size_t size, dxil_spv_parsed_blob *blob)
{
	auto *parsed = new (std::nothrow) dxil_spv_parsed_blob_s;
	if (!parsed)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	if (!parsed->bc.parse(data, size))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	*blob = parsed;
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_parsed_blob_dump_llvm_ir(dxil_spv_parsed_blob blob)
{
	auto &module = blob->bc.get_module();
	module.print(llvm::errs(), nullptr);
}

dxil_spv_result dxil_spv_parsed_blob_get_disassembled_ir(dxil_spv_parsed_blob blob,
                                                         const char **str)
{
	blob->disasm.clear();

	auto *module = &blob->bc.get_module();
	llvm::raw_string_ostream ostr(blob->disasm);
	module->print(ostr, nullptr);
	*str = blob->disasm.c_str();
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_get_raw_ir(dxil_spv_parsed_blob blob, const void **data, size_t *size)
{
	if (blob->dxil_blob.empty())
		return DXIL_SPV_ERROR_GENERIC;

	*data = blob->dxil_blob.data();
	*size = blob->dxil_blob.size();
	return DXIL_SPV_SUCCESS;
}

dxil_spv_shader_stage dxil_spv_parsed_blob_get_shader_stage(dxil_spv_parsed_blob blob)
{
	return static_cast<dxil_spv_shader_stage>(Converter::get_shader_stage(blob->bc));
}

dxil_spv_result dxil_spv_parsed_blob_scan_resources(dxil_spv_parsed_blob blob,
                                                    dxil_spv_srv_sampler_remapper_cb srv_remapper,
                                                    dxil_spv_srv_sampler_remapper_cb sampler_remapper,
                                                    dxil_spv_cbv_remapper_cb cbv_remapper,
                                                    dxil_spv_uav_remapper_cb uav_remapper, void *userdata)
{
	Remapper remapper;
	remapper.srv_remapper = srv_remapper;
	remapper.srv_userdata = userdata;
	remapper.sampler_remapper = sampler_remapper;
	remapper.sampler_userdata = userdata;
	remapper.cbv_remapper = cbv_remapper;
	remapper.cbv_userdata = userdata;
	remapper.uav_remapper = uav_remapper;
	remapper.uav_userdata = userdata;

	Converter::scan_resources(&remapper, blob->bc);
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_parsed_blob_free(dxil_spv_parsed_blob blob)
{
	delete blob;
}

dxil_spv_result dxil_spv_create_converter(dxil_spv_parsed_blob blob, dxil_spv_converter *converter)
{
	auto *conv = new (std::nothrow) dxil_spv_converter_s(blob->bc);
	if (!conv)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	conv->converter.set_resource_remapping_interface(&conv->remapper);
	*converter = conv;
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_converter_free(dxil_spv_converter converter)
{
	delete converter;
}

dxil_spv_result dxil_spv_converter_run(dxil_spv_converter converter)
{
	auto entry_point = converter->converter.convert_entry_point();
	if (entry_point.entry == nullptr)
	{
		LOGE("Failed to convert function.\n");
		return DXIL_SPV_ERROR_GENERIC;
	}

	{
		dxil_spv::CFGStructurizer structurizer(entry_point.entry, *entry_point.node_pool, converter->module);
		structurizer.run();
		converter->module.emit_entry_point_function_body(structurizer);
	}

	for (auto &leaf : entry_point.leaf_functions)
	{
		if (!leaf.entry)
		{
			LOGE("Leaf function is nullptr!\n");
			return DXIL_SPV_ERROR_GENERIC;
		}
		dxil_spv::CFGStructurizer structurizer(leaf.entry, *entry_point.node_pool, converter->module);
		structurizer.run();
		converter->module.emit_leaf_function_body(leaf.func, structurizer);
	}

	if (!converter->module.finalize_spirv(converter->spirv))
	{
		LOGE("Failed to finalize SPIR-V.\n");
		return DXIL_SPV_ERROR_GENERIC;
	}

	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_get_compiled_spirv(dxil_spv_converter converter, dxil_spv_compiled_spirv *compiled)
{
	if (converter->spirv.empty())
		return DXIL_SPV_ERROR_GENERIC;

	compiled->data = converter->spirv.data();
	compiled->size = converter->spirv.size() * sizeof(uint32_t);
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_converter_set_srv_remapper(dxil_spv_converter converter, dxil_spv_srv_sampler_remapper_cb remapper,
                                         void *userdata)
{
	converter->remapper.srv_remapper = remapper;
	converter->remapper.srv_userdata = userdata;
}

void dxil_spv_converter_set_sampler_remapper(dxil_spv_converter converter, dxil_spv_srv_sampler_remapper_cb remapper,
                                             void *userdata)
{
	converter->remapper.sampler_remapper = remapper;
	converter->remapper.sampler_userdata = userdata;
}

void dxil_spv_converter_set_root_constant_word_count(dxil_spv_converter converter, unsigned num_words)
{
	converter->remapper.root_constant_word_count = num_words;
}

void dxil_spv_converter_set_uav_remapper(dxil_spv_converter converter, dxil_spv_uav_remapper_cb remapper,
                                         void *userdata)
{
	converter->remapper.uav_remapper = remapper;
	converter->remapper.uav_userdata = userdata;
}

void dxil_spv_converter_set_cbv_remapper(dxil_spv_converter converter, dxil_spv_cbv_remapper_cb remapper,
                                         void *userdata)
{
	converter->remapper.cbv_remapper = remapper;
	converter->remapper.cbv_userdata = userdata;
}

void dxil_spv_converter_set_vertex_input_remapper(dxil_spv_converter converter,
                                                  dxil_spv_vertex_input_remapper_cb remapper, void *userdata)
{
	converter->remapper.input_remapper = remapper;
	converter->remapper.input_userdata = userdata;
}

void dxil_spv_converter_set_stream_output_remapper(dxil_spv_converter converter,
                                                   dxil_spv_stream_output_remapper_cb remapper, void *userdata)
{
	converter->remapper.output_remapper = remapper;
	converter->remapper.output_userdata = userdata;
}

/* Useful to check if the implementation recognizes a particular capability for ABI compatibility. */
dxil_spv_bool dxil_spv_converter_supports_option(dxil_spv_option cap)
{
	return Converter::recognizes_option(static_cast<Option>(cap)) ? DXIL_SPV_TRUE : DXIL_SPV_FALSE;
}

dxil_spv_result dxil_spv_converter_add_option(dxil_spv_converter converter, const dxil_spv_option_base *option)
{
	if (!dxil_spv_converter_supports_option(option->type))
		return DXIL_SPV_ERROR_UNSUPPORTED_FEATURE;

	switch (option->type)
	{
	case DXIL_SPV_OPTION_SHADER_DEMOTE_TO_HELPER:
	{
		OptionShaderDemoteToHelper helper;
		helper.supported = bool(reinterpret_cast<const dxil_spv_option_shader_demote_to_helper *>(option)->supported);
		converter->converter.add_option(helper);
		break;
	}

	case DXIL_SPV_OPTION_DUAL_SOURCE_BLENDING:
	{
		OptionDualSourceBlending helper;
		helper.enabled = bool(reinterpret_cast<const dxil_spv_option_dual_source_blending *>(option)->enabled);
		converter->converter.add_option(helper);
		break;
	}

	case DXIL_SPV_OPTION_OUTPUT_SWIZZLE:
	{
		OptionOutputSwizzle helper;
		const auto *input = reinterpret_cast<const dxil_spv_option_output_swizzle *>(option);
		helper.swizzles = input->swizzles;
		helper.swizzle_count = input->swizzle_count;
		converter->converter.add_option(helper);
		break;
	}

	case DXIL_SPV_OPTION_RASTERIZER_SAMPLE_COUNT:
	{
		OptionRasterizerSampleCount helper;
		const auto *count = reinterpret_cast<const dxil_spv_option_rasterizer_sample_count *>(option);
		helper.count = count->sample_count;
		helper.spec_constant = bool(count->spec_constant);
		converter->converter.add_option(helper);
		break;
	}

	default:
		return DXIL_SPV_ERROR_UNSUPPORTED_FEATURE;
	}

	return DXIL_SPV_SUCCESS;
}
