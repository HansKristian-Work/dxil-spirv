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

#define DXIL_SPV_ENABLE_EXPERIMENTAL_WORKGRAPHS
#include "thread_local_allocator.hpp"
#include "dxil_spirv_c.h"
#include "dxil_converter.hpp"
#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include "logging.hpp"
#include "spirv_module.hpp"
#include <string.h>
#include <new>

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
#ifdef HAVE_LLVMBC
	String disasm;
#else
	std::string disasm;
#endif
	Vector<uint8_t> dxil_blob;
	Vector<RDATSubobject> rdat_subobjects;

	struct EntryPoint
	{
		String mangled;
		String demangled;
		NodeInputData node_input;
		Vector<NodeOutputData> node_outputs;
	};
	Vector<EntryPoint> entry_points;
};

struct Remapper : ResourceRemappingInterface
{
	static void copy_buffer_binding(VulkanBinding &vk_binding, const dxil_spv_vulkan_binding &c_vk_binding)
	{
		vk_binding.descriptor_set = c_vk_binding.set;
		vk_binding.binding = c_vk_binding.binding;
		vk_binding.root_constant_index = c_vk_binding.root_constant_index;
		vk_binding.bindless.use_heap = bool(c_vk_binding.bindless.use_heap);
		vk_binding.bindless.heap_root_offset = c_vk_binding.bindless.heap_root_offset;
		vk_binding.descriptor_type = static_cast<VulkanDescriptorType>(c_vk_binding.descriptor_type);
	}

	bool remap_srv(const D3DBinding &binding, VulkanSRVBinding &vk_binding) override
	{
		if (srv_remapper)
		{
			const dxil_spv_d3d_binding c_binding = { static_cast<dxil_spv_shader_stage>(binding.stage),
				                                     static_cast<dxil_spv_resource_kind>(binding.kind),
				                                     binding.resource_index,
				                                     binding.register_space,
				                                     binding.register_index,
				                                     binding.range_size,
				                                     binding.alignment };

			dxil_spv_srv_vulkan_binding c_vk_binding = {};
			if (srv_remapper(srv_userdata, &c_binding, &c_vk_binding) == DXIL_SPV_TRUE)
			{
				copy_buffer_binding(vk_binding.buffer_binding, c_vk_binding.buffer_binding);
				copy_buffer_binding(vk_binding.offset_binding, c_vk_binding.offset_binding);
				return true;
			}
			else
				return false;
		}
		else
		{
			vk_binding.buffer_binding.bindless.use_heap = false;
			vk_binding.buffer_binding.descriptor_set = binding.register_space;
			vk_binding.buffer_binding.binding = binding.register_index;
			vk_binding.buffer_binding.descriptor_type = VulkanDescriptorType::Identity;
			vk_binding.offset_binding = {};
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
				                                     binding.range_size,
				                                     binding.alignment };

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
			vk_binding.descriptor_type = VulkanDescriptorType::Identity;
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
				  binding.binding.register_space, binding.binding.register_index, binding.binding.range_size,
				  binding.binding.alignment },
				binding.counter ? DXIL_SPV_TRUE : DXIL_SPV_FALSE
			};

			dxil_spv_uav_vulkan_binding c_vk_binding = {};
			if (uav_remapper(uav_userdata, &c_binding, &c_vk_binding) == DXIL_SPV_TRUE)
			{
				copy_buffer_binding(vk_binding.buffer_binding, c_vk_binding.buffer_binding);
				copy_buffer_binding(vk_binding.counter_binding, c_vk_binding.counter_binding);
				copy_buffer_binding(vk_binding.offset_binding, c_vk_binding.offset_binding);
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
			vk_binding.buffer_binding.descriptor_type = VulkanDescriptorType::Identity;
			vk_binding.counter_binding.descriptor_type = VulkanDescriptorType::Identity;
			vk_binding.offset_binding = {};
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
				                                     binding.range_size,
				                                     binding.alignment };

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
			vk_binding.buffer.descriptor_type = VulkanDescriptorType::Identity;
			return true;
		}
	}

	bool remap_vertex_input(const D3DStageIO &d3d_input, VulkanStageIO &vk_input) override
	{
		dxil_spv_d3d_vertex_input c_input = { d3d_input.semantic, d3d_input.semantic_index, d3d_input.start_row,
			                                  d3d_input.rows };
		dxil_spv_vulkan_vertex_input c_vk_input = {};

		if (input_remapper)
		{
			if (input_remapper(input_userdata, &c_input, &c_vk_input) == DXIL_SPV_TRUE)
			{
				vk_input.location = c_vk_input.location;
				vk_input.component = 0;
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

	bool remap_stage_input(const D3DStageIO &d3d_input, VulkanStageIO &vk_input) override
	{
		dxil_spv_d3d_shader_stage_io c_input = { d3d_input.semantic, d3d_input.semantic_index };
		dxil_spv_vulkan_shader_stage_io c_vk_input = { vk_input.location, vk_input.component, vk_input.flags };

		if (stage_input_remapper)
		{
			if (stage_input_remapper(stage_input_userdata, &c_input, &c_vk_input) == DXIL_SPV_TRUE)
			{
				vk_input.location = c_vk_input.location;
				vk_input.component = c_vk_input.component;
				vk_input.flags = c_vk_input.flags;
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

	bool has_nontrivial_stage_input_remapping() override
	{
		return stage_input_remapper != nullptr;
	}

	bool remap_stage_output(const D3DStageIO &d3d_output, VulkanStageIO &vk_output) override
	{
		dxil_spv_d3d_shader_stage_io c_output = { d3d_output.semantic, d3d_output.semantic_index };
		dxil_spv_vulkan_shader_stage_io c_vk_output = { vk_output.location, vk_output.component, vk_output.flags };

		if (stage_output_remapper)
		{
			if (stage_output_remapper(stage_output_userdata, &c_output, &c_vk_output) == DXIL_SPV_TRUE)
			{
				vk_output.location = c_vk_output.location;
				vk_output.component = c_vk_output.component;
				vk_output.flags = c_vk_output.flags;
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

	unsigned get_root_descriptor_count() override
	{
		return root_descriptor_count;
	}

	dxil_spv_srv_remapper_cb srv_remapper = nullptr;
	void *srv_userdata = nullptr;

	dxil_spv_sampler_remapper_cb sampler_remapper = nullptr;
	void *sampler_userdata = nullptr;

	dxil_spv_uav_remapper_cb uav_remapper = nullptr;
	void *uav_userdata = nullptr;

	dxil_spv_cbv_remapper_cb cbv_remapper = nullptr;
	void *cbv_userdata = nullptr;

	dxil_spv_vertex_input_remapper_cb input_remapper = nullptr;
	void *input_userdata = nullptr;

	dxil_spv_stream_output_remapper_cb output_remapper = nullptr;
	void *output_userdata = nullptr;

	dxil_spv_shader_stage_io_remapper_cb stage_input_remapper = nullptr;
	void *stage_input_userdata = nullptr;

	dxil_spv_shader_stage_io_remapper_cb stage_output_remapper = nullptr;
	void *stage_output_userdata = nullptr;

	unsigned root_constant_word_count = 0;
	unsigned root_descriptor_count = 0;
};

enum class LocalRootParameterType
{
	Constants,
	Descriptor,
	Table
};

struct LocalConstants
{
	unsigned register_space;
	unsigned register_index;
	unsigned num_words;
};

struct LocalDescriptor
{
	ResourceClass resource_class;
	unsigned register_space;
	unsigned register_index;
};

struct LocalRootParameter
{
	LocalRootParameterType type;
	LocalConstants local_constants;
	LocalDescriptor local_descriptor;
	Vector<DescriptorTableEntry> table_entries;
};

struct dxil_spv_converter_s
{
	dxil_spv_converter_s(LLVMBCParser &bc_parser_, LLVMBCParser *bc_reflection_parser_)
		: bc_parser(bc_parser_), bc_reflection_parser(bc_reflection_parser_)
	{
	}

	LLVMBCParser &bc_parser;
	LLVMBCParser *bc_reflection_parser;
	Vector<uint32_t> spirv;
	String entry_point;
	String compiled_entry_point;
	String analysis_warnings;
	Remapper remapper;

	Vector<LocalRootParameter> local_root_parameters;

	Vector<std::unique_ptr<OptionBase>> options;

	Vector<DescriptorTableEntry> local_entries;
	bool active_table = false;
	bool uses_subgroup_size = false;
	uint32_t workgroup_size[3] = {};
	uint32_t patch_vertex_count = 0;
	uint32_t wave_size_min = 0;
	uint32_t wave_size_max = 0;
	uint32_t wave_size_preferred = 0;
	uint32_t heuristic_wave_size = 0;
	bool shader_feature_used[unsigned(ShaderFeature::Count)] = {};
};

dxil_spv_result dxil_spv_parse_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob)
{
	auto *parsed = new (std::nothrow) dxil_spv_parsed_blob_s;
	if (!parsed)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	DXILContainerParser parser;
	if (!parser.parse_container(data, size, false))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	parsed->dxil_blob = std::move(parser.get_blob());
	parsed->rdat_subobjects = std::move(parser.get_rdat_subobjects());

	if (!parsed->bc.parse(parsed->dxil_blob.data(), parsed->dxil_blob.size()))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	auto names = Converter::get_entry_points(parsed->bc);
	for (auto &name : names)
	{
		parsed->entry_points.push_back({
			name, demangle_entry_point(name),
			Converter::get_node_input(parsed->bc, name.c_str()),
			Converter::get_node_outputs(parsed->bc, name.c_str())
		});
	}

	*blob = parsed;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parse_reflection_dxil_blob(const void *data, size_t size, dxil_spv_parsed_blob *blob)
{
	auto *parsed = new (std::nothrow) dxil_spv_parsed_blob_s;
	if (!parsed)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	DXILContainerParser parser;
	if (!parser.parse_container(data, size, true))
	{
		delete parsed;
		return DXIL_SPV_ERROR_PARSER;
	}

	if (parser.get_blob().empty())
	{
		delete parsed;
		return DXIL_SPV_ERROR_NO_DATA;
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

	auto names = Converter::get_entry_points(parsed->bc);
	for (auto &name : names)
	{
		parsed->entry_points.push_back({
			name, demangle_entry_point(name),
			Converter::get_node_input(parsed->bc, name.c_str()),
			Converter::get_node_outputs(parsed->bc, name.c_str())
		});
	}

	*blob = parsed;
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_parsed_blob_dump_llvm_ir(dxil_spv_parsed_blob blob)
{
	auto &module = blob->bc.get_module();
#ifdef HAVE_LLVMBC
	String str;
	if (llvm::disassemble(module, str))
		fprintf(stderr, "%s\n", str.c_str());
	else
		fprintf(stderr, "Failed to disassemble LLVM IR!\n");
#else
	module.print(llvm::errs(), nullptr);
#endif
}

dxil_spv_result dxil_spv_parsed_blob_get_disassembled_ir(dxil_spv_parsed_blob blob, const char **str)
{
	blob->disasm.clear();

	auto *module = &blob->bc.get_module();
#ifdef HAVE_LLVMBC
	if (!llvm::disassemble(*module, blob->disasm))
		return DXIL_SPV_ERROR_GENERIC;
#else
	llvm::raw_string_ostream ostr(blob->disasm);
	module->print(ostr, nullptr);
#endif
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

dxil_spv_shader_stage dxil_spv_parsed_blob_get_shader_stage_for_entry(dxil_spv_parsed_blob blob, const char *entry)
{
	return static_cast<dxil_spv_shader_stage>(Converter::get_shader_stage(blob->bc, entry));
}

dxil_spv_result dxil_spv_parsed_blob_get_entry_index_by_name(dxil_spv_parsed_blob blob,
                                                             const char *entry,
                                                             unsigned *index)
{
    for (size_t i = 0, n = blob->entry_points.size(); i < n; i++)
    {
        if (blob->entry_points[i].demangled == entry || blob->entry_points[i].mangled == entry)
        {
            *index = unsigned(i);
            return DXIL_SPV_SUCCESS;
        }
    }

    return DXIL_SPV_ERROR_GENERIC;
}

dxil_spv_result dxil_spv_parsed_blob_get_num_entry_points(dxil_spv_parsed_blob blob, unsigned *count)
{
	*count = unsigned(blob->entry_points.size());
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_get_entry_point_name(dxil_spv_parsed_blob blob,
                                                          unsigned index,
                                                          const char **mangled_entry)
{
	if (index >= blob->entry_points.size())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;
	*mangled_entry = blob->entry_points[index].mangled.c_str();
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_get_entry_point_demangled_name(dxil_spv_parsed_blob blob,
                                                                    unsigned index,
                                                                    const char **demangled_entry)
{
	if (index >= blob->entry_points.size())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;
	*demangled_entry = blob->entry_points[index].demangled.c_str();
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_get_entry_point_node_input(
    dxil_spv_parsed_blob blob, unsigned index, dxil_spv_node_input_data *data)
{
	if (index >= blob->entry_points.size())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;

	auto &input = blob->entry_points[index].node_input;
	data->node_id = input.node_id.c_str();
	data->payload_stride = input.payload_stride;
	data->launch_type = dxil_spv_node_launch_type(input.launch_type);
	data->node_array_index = input.node_array_index;
	data->dispatch_grid_offset = input.grid_buffer.offset;
	data->dispatch_grid_type_bits = input.grid_buffer.component_type == DXIL::ComponentType::U32 ? 32 : 16;
	data->dispatch_grid_components = input.grid_buffer.count;
	for (int i = 0; i < 3; i++)
	{
		data->broadcast_grid[i] = input.broadcast_grid[i];
		data->thread_group_size_spec_id[i] = input.thread_group_size_spec_id[i];
		data->max_broadcast_grid_spec_id[i] = input.max_broadcast_grid_spec_id[i];
	}
	data->recursion_factor = input.recursion_factor;
	data->coalesce_factor = input.coalesce_factor;
	data->node_share_input_id = input.node_share_input_id.c_str();
	data->node_share_input_array_index = input.node_share_input_array_index;
	data->local_root_arguments_table_index = input.local_root_arguments_table_index;
	data->is_indirect_bda_stride_program_entry_spec_id = input.is_indirect_bda_stride_program_entry_spec_id;
	data->is_entry_point_spec_id = input.is_entry_point_spec_id;
	data->dispatch_grid_is_upper_bound = input.dispatch_grid_is_upper_bound ? DXIL_SPV_TRUE : DXIL_SPV_FALSE;
	data->dispatch_grid_is_upper_bound_spec_id = input.dispatch_grid_is_upper_bound_spec_id;
	data->is_static_broadcast_node_spec_id = input.is_static_broadcast_node_spec_id;
	data->node_track_rw_input_sharing = input.node_track_rw_input_sharing ? DXIL_SPV_TRUE : DXIL_SPV_FALSE;
	data->is_program_entry = input.is_program_entry ? DXIL_SPV_TRUE : DXIL_SPV_FALSE;

	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_get_entry_point_num_node_outputs(
    dxil_spv_parsed_blob blob, unsigned index, unsigned *num_outputs)
{
	if (index >= blob->entry_points.size())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;

	*num_outputs = unsigned(blob->entry_points[index].node_outputs.size());
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_get_entry_point_node_output(
    dxil_spv_parsed_blob blob, unsigned index, unsigned output_index, dxil_spv_node_output_data *data)
{
	if (index >= blob->entry_points.size())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;

	auto &entry = blob->entry_points[index];
	if (output_index >= entry.node_outputs.size())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;

	auto &output = entry.node_outputs[output_index];

	data->node_id = output.node_id.c_str();
	data->node_array_index = output.node_array_index;
	data->node_array_size = output.node_array_size;
	data->sparse_array = output.sparse_array;
	data->max_records = output.max_records;
	data->node_index_spec_constant_id = output.node_index_spec_constant_id;

	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_parsed_blob_scan_resources(dxil_spv_parsed_blob blob,
                                                    dxil_spv_srv_remapper_cb srv_remapper,
                                                    dxil_spv_sampler_remapper_cb sampler_remapper,
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

dxil_spv_result dxil_spv_create_converter_with_reflection(dxil_spv_parsed_blob blob,
                                                          dxil_spv_parsed_blob reflection_blob,
                                                          dxil_spv_converter *converter)
{
	auto *conv = new (std::nothrow) dxil_spv_converter_s(blob->bc, reflection_blob ? &reflection_blob->bc : nullptr);
	if (!conv)
		return DXIL_SPV_ERROR_OUT_OF_MEMORY;

	*converter = conv;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_create_converter(dxil_spv_parsed_blob blob, dxil_spv_converter *converter)
{
	return dxil_spv_create_converter_with_reflection(blob, nullptr, converter);
}

void dxil_spv_converter_free(dxil_spv_converter converter)
{
	delete converter;
}

void dxil_spv_converter_set_entry_point(dxil_spv_converter converter, const char *entry_point)
{
	if (entry_point)
		converter->entry_point = entry_point;
	else
		converter->entry_point.clear();
}

dxil_spv_result dxil_spv_converter_run(dxil_spv_converter converter)
{
	SPIRVModule module;
	Converter dxil_converter(converter->bc_parser, converter->bc_reflection_parser, module);

	if (!converter->entry_point.empty())
		dxil_converter.set_entry_point(converter->entry_point.c_str());
	dxil_converter.set_resource_remapping_interface(&converter->remapper);
	for (auto &opt : converter->options)
		dxil_converter.add_option(*opt);

	for (auto &local_param : converter->local_root_parameters)
	{
		switch (local_param.type)
		{
		case LocalRootParameterType::Constants:
			dxil_converter.add_local_root_constants(local_param.local_constants.register_space,
			                                        local_param.local_constants.register_index,
			                                        local_param.local_constants.num_words);
			break;

		case LocalRootParameterType::Descriptor:
			dxil_converter.add_local_root_descriptor(local_param.local_descriptor.resource_class,
			                                         local_param.local_descriptor.register_space,
			                                         local_param.local_descriptor.register_index);
			break;

		case LocalRootParameterType::Table:
			dxil_converter.add_local_root_descriptor_table(local_param.table_entries);
			break;
		}
	}

	auto entry_point = dxil_converter.convert_entry_point();

	if (entry_point.entry.entry == nullptr)
	{
		LOGE("Failed to convert function.\n");
		return DXIL_SPV_ERROR_GENERIC;
	}

	{
		dxil_spv::CFGStructurizer structurizer(entry_point.entry.entry, *entry_point.node_pool, module);
		uint32_t driver_id, driver_version;
		if (dxil_converter.get_driver_version(driver_id, driver_version))
			structurizer.set_driver_version(driver_id, driver_version);
		module.set_entry_build_point(entry_point.entry.func);
		structurizer.run();
		module.emit_entry_point_function_body(structurizer);
	}

	for (auto &leaf : entry_point.leaf_functions)
	{
		if (!leaf.entry)
		{
			LOGE("Leaf function is nullptr!\n");
			return DXIL_SPV_ERROR_GENERIC;
		}
		dxil_spv::CFGStructurizer structurizer(leaf.entry, *entry_point.node_pool, module);
		module.set_entry_build_point(leaf.func);
		structurizer.run();
		module.emit_leaf_function_body(leaf.func, structurizer);
	}

	if (!module.finalize_spirv(converter->spirv))
	{
		LOGE("Failed to finalize SPIR-V.\n");
		return DXIL_SPV_ERROR_GENERIC;
	}

	converter->compiled_entry_point = dxil_converter.get_compiled_entry_point();
	converter->uses_subgroup_size = module.has_builtin_shader_input(spv::BuiltInSubgroupSize);
	dxil_converter.get_workgroup_dimensions(converter->workgroup_size[0],
	                                        converter->workgroup_size[1],
	                                        converter->workgroup_size[2]);
	dxil_converter.get_compute_wave_size_range(converter->wave_size_min, converter->wave_size_max, converter->wave_size_preferred);
	converter->heuristic_wave_size = dxil_converter.get_compute_heuristic_max_wave_size();
	converter->patch_vertex_count = dxil_converter.get_patch_vertex_count();
	for (int i = 0; i < int(ShaderFeature::Count); i++)
		converter->shader_feature_used[i] = dxil_converter.shader_requires_feature(ShaderFeature(i));
	converter->analysis_warnings = dxil_converter.get_analysis_warnings();

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

dxil_spv_result dxil_spv_converter_get_compiled_entry_point(dxil_spv_converter converter,
                                                            const char **entry_point)
{
	if (converter->spirv.empty())
		return DXIL_SPV_ERROR_GENERIC;

	*entry_point = converter->compiled_entry_point.c_str();
	return DXIL_SPV_SUCCESS;
}

void dxil_spv_converter_set_srv_remapper(dxil_spv_converter converter, dxil_spv_srv_remapper_cb remapper,
                                         void *userdata)
{
	converter->remapper.srv_remapper = remapper;
	converter->remapper.srv_userdata = userdata;
}

void dxil_spv_converter_set_sampler_remapper(dxil_spv_converter converter, dxil_spv_sampler_remapper_cb remapper,
                                             void *userdata)
{
	converter->remapper.sampler_remapper = remapper;
	converter->remapper.sampler_userdata = userdata;
}

void dxil_spv_converter_set_root_constant_word_count(dxil_spv_converter converter, unsigned num_words)
{
	converter->remapper.root_constant_word_count = num_words;
}

void dxil_spv_converter_set_root_descriptor_count(dxil_spv_converter converter, unsigned count)
{
	converter->remapper.root_descriptor_count = count;
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

void dxil_spv_converter_set_stage_input_remapper(dxil_spv_converter converter,
                                                 dxil_spv_shader_stage_io_remapper_cb remapper, void *userdata)
{
	converter->remapper.stage_input_remapper = remapper;
	converter->remapper.stage_input_userdata = userdata;
}

void dxil_spv_converter_set_stage_output_remapper(dxil_spv_converter converter,
                                                  dxil_spv_shader_stage_io_remapper_cb remapper, void *userdata)
{
	converter->remapper.stage_output_remapper = remapper;
	converter->remapper.stage_output_userdata = userdata;
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

template <typename T>
static std::unique_ptr<T> duplicate(const T &value)
{
	return std::unique_ptr<T>(new T(value));
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

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_DUAL_SOURCE_BLENDING:
	{
		OptionDualSourceBlending helper;
		helper.enabled = bool(reinterpret_cast<const dxil_spv_option_dual_source_blending *>(option)->enabled);
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_OUTPUT_SWIZZLE:
	{
		OptionOutputSwizzle helper;
		const auto *input = reinterpret_cast<const dxil_spv_option_output_swizzle *>(option);
		helper.swizzles = input->swizzles;
		helper.swizzle_count = input->swizzle_count;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_RASTERIZER_SAMPLE_COUNT:
	{
		OptionRasterizerSampleCount helper;
		const auto *count = reinterpret_cast<const dxil_spv_option_rasterizer_sample_count *>(option);
		helper.count = count->sample_count;
		helper.spec_constant = bool(count->spec_constant);
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_ROOT_CONSTANT_INLINE_UNIFORM_BLOCK:
	{
		OptionRootConstantInlineUniformBlock helper;
		const auto *ubo = reinterpret_cast<const dxil_spv_option_root_constant_inline_uniform_block *>(option);
		helper.desc_set = ubo->desc_set;
		helper.binding = ubo->binding;
		helper.enable = ubo->enable == DXIL_SPV_TRUE;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_BINDLESS_CBV_SSBO_EMULATION:
	{
		OptionBindlessCBVSSBOEmulation helper;
		helper.enable =
		    reinterpret_cast<const dxil_spv_option_bindless_cbv_ssbo_emulation *>(option)->enable == DXIL_SPV_TRUE;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_PHYSICAL_STORAGE_BUFFER:
	{
		OptionPhysicalStorageBuffer helper;
		helper.enable =
		    reinterpret_cast<const dxil_spv_option_physical_storage_buffer *>(option)->enable == DXIL_SPV_TRUE;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SBT_DESCRIPTOR_SIZE_LOG2:
	{
		OptionSBTDescriptorSizeLog2 helper;
		helper.size_log2_srv_uav_cbv = reinterpret_cast<const dxil_spv_option_sbt_descriptor_size_log2 *>(option)->size_log2_srv_uav_cbv;
		helper.size_log2_sampler = reinterpret_cast<const dxil_spv_option_sbt_descriptor_size_log2 *>(option)->size_log2_sampler;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SSBO_ALIGNMENT:
	{
		OptionSSBOAlignment helper;
		helper.alignment = reinterpret_cast<const dxil_spv_option_ssbo_alignment *>(option)->alignment;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_TYPED_UAV_READ_WITHOUT_FORMAT:
	{
		OptionTypedUAVReadWithoutFormat helper;
		helper.supported = reinterpret_cast<const dxil_spv_option_typed_uav_read_without_format *>(option)->supported == DXIL_SPV_TRUE;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SHADER_SOURCE_FILE:
	{
		OptionShaderSourceFile helper;
		const char *name = reinterpret_cast<const dxil_spv_option_shader_source_file *>(option)->name;
		if (name)
			helper.name = name;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_BINDLESS_TYPED_BUFFER_OFFSETS:
	{
		OptionBindlessTypedBufferOffsets helper;
		helper.enable = reinterpret_cast<const dxil_spv_option_bindless_typed_buffer_offsets *>(option)->enable;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_BINDLESS_OFFSET_BUFFER_LAYOUT:
	{
		OptionBindlessOffsetBufferLayout helper;
		auto *opt = reinterpret_cast<const dxil_spv_option_bindless_offset_buffer_layout *>(option);
		helper.untyped_offset = opt->untyped_offset;
		helper.typed_offset = opt->typed_offset;
		helper.stride = opt->stride;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_STORAGE_INPUT_OUTPUT_16BIT:
	{
		OptionStorageInputOutput16 helper;
		helper.supported =
		    reinterpret_cast<const dxil_spv_option_storage_input_output_16bit *>(option)->supported == DXIL_SPV_TRUE;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_DESCRIPTOR_QA:
	{
		OptionDescriptorQA helper;
		auto *qa = reinterpret_cast<const dxil_spv_option_descriptor_qa *>(option);
		helper.enabled = qa->enabled == DXIL_SPV_TRUE;
		helper.shader_hash = qa->shader_hash;
		helper.global_desc_set = qa->global_desc_set;
		helper.global_binding = qa->global_binding;
		helper.heap_desc_set = qa->heap_desc_set;
		helper.heap_binding = qa->heap_binding;
		helper.version = qa->version;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_MIN_PRECISION_NATIVE_16BIT:
	{
		OptionMinPrecisionNative16Bit helper;
		auto *minprec = reinterpret_cast<const dxil_spv_option_min_precision_native_16bit *>(option);
		helper.enabled = minprec->enabled == DXIL_SPV_TRUE;
		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SHADER_I8_DOT:
	{
		OptionShaderI8Dot helper;
		helper.supported = bool(reinterpret_cast<const dxil_spv_option_shader_i8_dot *>(option)->supported);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SHADER_RAY_TRACING_PRIMITIVE_CULLING:
	{
		OptionShaderRayTracingPrimitiveCulling helper;
		helper.supported = bool(reinterpret_cast<const dxil_spv_option_shader_ray_tracing_primitive_culling *>(option)->supported);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_INVARIANT_POSITION:
	{
		OptionInvariantPosition helper;
		helper.enabled = bool(reinterpret_cast<const dxil_spv_option_invariant_position *>(option)->enabled);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SCALAR_BLOCK_LAYOUT:
	{
		OptionScalarBlockLayout helper;
		auto *opt = reinterpret_cast<const dxil_spv_option_scalar_block_layout *>(option);
		helper.supported = bool(opt->supported);
		helper.supports_per_component_robustness = bool(opt->supports_per_component_robustness);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_BARYCENTRIC_KHR:
	{
		OptionBarycentricKHR helper;
		auto *opt = reinterpret_cast<const dxil_spv_option_barycentric_khr *>(option);
		helper.supported = bool(opt->supported);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_ROBUST_PHYSICAL_CBV_LOAD:
	{
		OptionRobustPhysicalCBVLoad helper;
		auto *robust = reinterpret_cast<const dxil_spv_option_robust_physical_cbv_load *>(option);
		helper.enabled = bool(robust->enabled);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_ARITHMETIC_RELAXED_PRECISION:
	{
		OptionArithmeticRelaxedPrecision helper;
		auto *robust = reinterpret_cast<const dxil_spv_option_arithmetic_relaxed_precision *>(option);
		helper.enabled = bool(robust->enabled);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_PHYSICAL_ADDRESS_DESCRIPTOR_INDEXING:
	{
		OptionPhysicalAddressDescriptorIndexing helper;
		auto *indexing = reinterpret_cast<const dxil_spv_option_physical_address_descriptor_indexing *>(option);
		helper.element_stride = indexing->element_stride;
		helper.element_offset = indexing->element_offset;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_FORCE_SUBGROUP_SIZE:
	{
		OptionForceSubgroupSize helper;
		auto *subgroup = reinterpret_cast<const dxil_spv_option_force_subgroup_size *>(option);
		helper.forced_value = subgroup->forced_value;
		helper.wave_size_enable = subgroup->wave_size_enable;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_DENORM_PRESERVE_SUPPORT:
	{
		OptionDenormPreserveSupport helper;
		auto *denorm = reinterpret_cast<const dxil_spv_option_denorm_preserve_support *>(option);
		helper.support_float16_denorm_preserve = bool(denorm->supports_float16_denorm_preserve);
		helper.support_float64_denorm_preserve = bool(denorm->supports_float64_denorm_preserve);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_STRICT_HELPER_LANE_WAVE_OPS:
	{
		OptionStrictHelperLaneWaveOps helper;
		auto *strict = reinterpret_cast<const dxil_spv_option_strict_helper_lane_wave_ops *>(option);
		helper.enable = strict->enable;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SUBGROUP_PARTITIONED_NV:
	{
		OptionSubgroupPartitionedNV helper;
		auto *partitioned = reinterpret_cast<const dxil_spv_option_subgroup_partitioned_nv *>(option);
		helper.supported = partitioned->supported;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_DEAD_CODE_ELIMINATE:
	{
		OptionDeadCodeEliminate helper;
		auto *eliminate = reinterpret_cast<const dxil_spv_option_dead_code_eliminate *>(option);
		helper.enabled = eliminate->enabled;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_PRECISE_CONTROL:
	{
		OptionPreciseControl helper;
		auto *precise = reinterpret_cast<const dxil_spv_option_precise_control *>(option);
		helper.force_precise = precise->force_precise;
		helper.propagate_precise = precise->propagate_precise;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SAMPLE_GRAD_OPTIMIZATION_CONTROL:
	{
		OptionSampleGradOptimizationControl helper;
		auto *precise = reinterpret_cast<const dxil_spv_option_sample_grad_optimization_control *>(option);
		helper.enabled = precise->enabled;
		helper.assume_uniform_scale = precise->assume_uniform_scale;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_OPACITY_MICROMAP:
	{
		OptionOpacityMicromap helper;
		auto *omm = reinterpret_cast<const dxil_spv_option_opacity_micromap *>(option);
		helper.enabled = omm->enabled;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_BRANCH_CONTROL:
	{
		OptionBranchControl helper;
		auto *branch = reinterpret_cast<const dxil_spv_option_branch_control *>(option);
		helper.use_shader_metadata = branch->use_shader_metadata;
		helper.force_branch = branch->force_branch;
		helper.force_loop = branch->force_loop;
		helper.force_unroll = branch->force_unroll;
		helper.force_flatten = branch->force_flatten;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SUBGROUP_PROPERTIES:
	{
		OptionSubgroupProperties helper;
		auto *sub = reinterpret_cast<const dxil_spv_option_subgroup_properties *>(option);
		helper.minimum_size = sub->minimum_size;
		helper.maximum_size = sub->maximum_size;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_DESCRIPTOR_HEAP_ROBUSTNESS:
	{
		OptionDescriptorHeapRobustness helper;
		auto *rob = reinterpret_cast<const dxil_spv_option_descriptor_heap_robustness *>(option);
		helper.enabled = rob->enabled;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_COMPUTE_SHADER_DERIVATIVES_NV:
	{
		OptionComputeShaderDerivativesNV helper;
		auto *deriv = reinterpret_cast<const dxil_spv_option_compute_shader_derivatives_nv *>(option);
		helper.supported = deriv->supported;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_QUAD_CONTROL_RECONVERGENCE:
	{
		OptionQuadControlReconvergence helper;
		auto *quad = reinterpret_cast<const dxil_spv_option_quad_control_reconvergence *>(option);
		helper.supports_quad_control = quad->supports_quad_control;
		helper.supports_maximal_reconvergence = quad->supports_maximal_reconvergence;
		helper.force_maximal_reconvergence = quad->force_maximal_reconvergence;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_RAW_ACCESS_CHAINS_NV:
	{
		OptionRawAccessChainsNV helper;
		auto *chain = reinterpret_cast<const dxil_spv_option_raw_access_chains_nv *>(option);
		helper.supported = chain->supported;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_DRIVER_VERSION:
	{
		OptionDriverVersion helper;
		auto *ver = reinterpret_cast<const dxil_spv_option_driver_version *>(option);
		helper.driver_id = ver->driver_id;
		helper.driver_version = ver->driver_version;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_COMPUTE_SHADER_DERIVATIVES:
	{
		OptionComputeShaderDerivatives helper;
		auto *deriv = reinterpret_cast<const dxil_spv_option_compute_shader_derivatives *>(option);
		helper.supports_nv = deriv->supports_nv;
		helper.supports_khr = deriv->supports_khr;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_INSTRUCTION_INSTRUMENTATION:
	{
		OptionInstructionInstrumentation helper;
		auto *inst = reinterpret_cast<const dxil_spv_option_instruction_instrumentation *>(option);
		helper.enabled = inst->enabled;
		helper.version = inst->version;
		helper.control_desc_set = inst->control_desc_set;
		helper.control_binding = inst->control_binding;
		helper.payload_desc_set = inst->payload_desc_set;
		helper.payload_binding = inst->payload_binding;
		helper.shader_hash = inst->shader_hash;
		helper.type = InstructionInstrumentationType(inst->type);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_SHADER_QUIRK:
	{
		OptionShaderQuirk helper;
		auto *quirk = reinterpret_cast<const dxil_spv_option_shader_quirk *>(option);
		helper.quirk = static_cast<ShaderQuirk>(quirk->quirk);

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_EXTENDED_ROBUSTNESS:
	{
		OptionExtendedRobustness helper;
		auto *robust = reinterpret_cast<const dxil_spv_option_extended_robustness *>(option);
		helper.robust_group_shared = robust->robust_group_shared;
		helper.robust_alloca = robust->robust_alloca;
		helper.robust_constant_lut = robust->robust_constant_lut;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_MAX_TESS_FACTOR:
	{
		OptionMaxTessFactor helper;
		auto *tess_factor = reinterpret_cast<const dxil_spv_option_max_tess_factor *>(option);
		helper.max_tess_factor = tess_factor->max_tess_factor;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	case DXIL_SPV_OPTION_VULKAN_MEMORY_MODEL:
	{
		OptionVulkanMemoryModel helper;
		auto *vkmm = reinterpret_cast<const dxil_spv_option_vulkan_memory_model *>(option);
		helper.enabled = vkmm->enabled;

		converter->options.emplace_back(duplicate(helper));
		break;
	}

	default:
		return DXIL_SPV_ERROR_UNSUPPORTED_FEATURE;
	}

	return DXIL_SPV_SUCCESS;
}

void dxil_spv_converter_add_local_root_constants(dxil_spv_converter converter,
                                                 unsigned register_space,
                                                 unsigned register_index,
                                                 unsigned num_words)
{
	LocalRootParameter param = {};
	param.type = LocalRootParameterType::Constants;
	param.local_constants = { register_space, register_index, num_words };
	converter->local_root_parameters.push_back(std::move(param));
}

void dxil_spv_converter_add_local_root_descriptor(dxil_spv_converter converter,
                                                  dxil_spv_resource_class resource_class,
                                                  unsigned register_space,
                                                  unsigned register_index)
{
	LocalRootParameter param = {};
	param.type = LocalRootParameterType::Descriptor;
	param.local_descriptor = { ResourceClass(resource_class), register_space, register_index };
	converter->local_root_parameters.push_back(std::move(param));
}

void dxil_spv_converter_add_local_root_descriptor_table(dxil_spv_converter converter,
                                                        dxil_spv_resource_class resource_class,
                                                        unsigned register_space,
                                                        unsigned register_index,
                                                        unsigned num_descriptors_in_range,
                                                        unsigned offset_in_heap)
{
	DescriptorTableEntry entry = {};
	entry.type = ResourceClass(resource_class);
	entry.register_space = register_space;
	entry.register_index = register_index;
	entry.num_descriptors_in_range = num_descriptors_in_range;
	entry.offset_in_heap = offset_in_heap;

	if (converter->active_table)
		converter->local_entries.push_back(entry);
	else
	{
		LocalRootParameter param = {};
		param.type = LocalRootParameterType::Table;
		param.table_entries = { entry };
		converter->local_root_parameters.push_back(std::move(param));
	}
}

dxil_spv_result dxil_spv_converter_begin_local_root_descriptor_table(
	dxil_spv_converter converter)
{
	if (converter->active_table)
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;

	converter->local_entries = {};
	converter->active_table = true;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_end_local_root_descriptor_table(
	dxil_spv_converter converter)
{
	if (!converter->active_table || converter->local_entries.empty())
		return DXIL_SPV_ERROR_INVALID_ARGUMENT;

	LocalRootParameter param = {};
	param.type = LocalRootParameterType::Table;
	std::swap(param.table_entries, converter->local_entries);
	converter->local_root_parameters.push_back(std::move(param));

	converter->active_table = false;
	return DXIL_SPV_SUCCESS;
}

unsigned dxil_spv_parsed_blob_get_num_rdat_subobjects(dxil_spv_parsed_blob blob)
{
	return unsigned(blob->rdat_subobjects.size());
}

void dxil_spv_parsed_blob_get_rdat_subobject(
		dxil_spv_parsed_blob blob, unsigned index, dxil_spv_rdat_subobject *subobject)
{
	auto &sub = blob->rdat_subobjects[index];
	subobject->kind = static_cast<dxil_spv_rdat_subobject_kind>(sub.kind);
	subobject->subobject_name = sub.subobject_name;
	subobject->exports = sub.exports.data();
	subobject->num_exports = unsigned(sub.exports.size());
	subobject->payload = sub.payload;
	subobject->payload_size = sub.payload_size;
	subobject->hit_group_type = static_cast<dxil_spv_hit_group_type>(sub.hit_group_type);
	static_assert(sizeof(subobject->args) == sizeof(sub.args), "Mismatch is args size.");
	memcpy(subobject->args, sub.args, sizeof(sub.args));
}

dxil_spv_bool dxil_spv_converter_uses_subgroup_size(dxil_spv_converter converter)
{
	return converter->uses_subgroup_size ? DXIL_SPV_TRUE : DXIL_SPV_FALSE;
}

dxil_spv_result dxil_spv_converter_get_compute_workgroup_dimensions(
	dxil_spv_converter converter,
	unsigned *x, unsigned *y, unsigned *z)
{
	*x = converter->workgroup_size[0];
	*y = converter->workgroup_size[1];
	*z = converter->workgroup_size[2];
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_get_compute_required_wave_size(
	dxil_spv_converter converter, unsigned *wave_size)
{
	/* This API cannot express ranged subgroup sizes */
	if (converter->wave_size_max && converter->wave_size_min != converter->wave_size_max)
		return DXIL_SPV_ERROR_GENERIC;

	*wave_size = converter->wave_size_min;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_get_compute_wave_size_range(
	dxil_spv_converter converter, unsigned *wave_size_min, unsigned *wave_size_max, unsigned *wave_size_preferred)
{
	*wave_size_min = converter->wave_size_min;
	*wave_size_max = converter->wave_size_max;
	*wave_size_preferred = converter->wave_size_preferred;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_get_compute_heuristic_max_wave_size(
    dxil_spv_converter converter, unsigned *wave_size)
{
	*wave_size = converter->heuristic_wave_size;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_result dxil_spv_converter_get_patch_vertex_count(
		dxil_spv_converter converter, unsigned *patch_vertices)
{
	*patch_vertices = converter->patch_vertex_count;
	return DXIL_SPV_SUCCESS;
}

dxil_spv_bool dxil_spv_converter_uses_shader_feature(
		dxil_spv_converter converter, dxil_spv_shader_feature feature)
{
	if (feature < int(ShaderFeature::Count))
		return converter->shader_feature_used[feature] ? DXIL_SPV_TRUE : DXIL_SPV_FALSE;
	else
		return DXIL_SPV_FALSE;
}

const char *dxil_spv_converter_get_analysis_warnings(dxil_spv_converter converter)
{
	if (converter->analysis_warnings.empty())
		return nullptr;
	return converter->analysis_warnings.c_str();
}

void dxil_spv_begin_thread_allocator_context(void)
{
	begin_thread_allocator_context();
}

void dxil_spv_end_thread_allocator_context(void)
{
	end_thread_allocator_context();
}

void dxil_spv_reset_thread_allocator_context(void)
{
	reset_thread_allocator_context();
}

static thread_local dxil_spv_log_cb c_callback_wrapper;
static void c_callback_wrapper_trampoline(void *userdata, dxil_spv::LogLevel level, const char *msg)
{
	if (c_callback_wrapper)
		c_callback_wrapper(userdata, dxil_spv_log_level(level), msg);
}

void dxil_spv_set_thread_log_callback(dxil_spv_log_cb callback, void *userdata)
{
	c_callback_wrapper = callback;
	dxil_spv::set_thread_log_callback(c_callback_wrapper_trampoline, userdata);
}
