/* Copyright (c) 2024 Hans-Kristian Arntzen for Valve Corporation
 * SPDX-License-Identifier: MIT
 */

#include "dxil_spirv_c.h"
#include "device.hpp"
#include "logging.hpp"
#include "filesystem.hpp"
#include "global_managers_init.hpp"
#include "thread_group.hpp"
#include "math.hpp"

using namespace Vulkan;
using namespace Granite;

#include "shaders/data_structures.h"

dxil_spv_bool srv_remap(void *,
                        const dxil_spv_d3d_binding *d3d_binding,
                        dxil_spv_srv_vulkan_binding *vulkan_binding)
{
	*vulkan_binding = {};
	vulkan_binding->buffer_binding.set = d3d_binding->register_space;
	vulkan_binding->buffer_binding.binding = d3d_binding->register_index;
	if (d3d_binding->kind == DXIL_SPV_RESOURCE_KIND_RAW_BUFFER || d3d_binding->kind == DXIL_SPV_RESOURCE_KIND_STRUCTURED_BUFFER)
		vulkan_binding->buffer_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_SSBO;
	return DXIL_SPV_TRUE;
}

dxil_spv_bool sampler_remap(void *,
                            const dxil_spv_d3d_binding *d3d_binding,
                            dxil_spv_vulkan_binding *vulkan_binding)
{
	*vulkan_binding = {};
	vulkan_binding->set = d3d_binding->register_space;
	vulkan_binding->binding = d3d_binding->register_index;
	return DXIL_SPV_TRUE;
}

dxil_spv_bool uav_remap(void *,
                        const dxil_spv_uav_d3d_binding *d3d_uav_binding,
                        dxil_spv_uav_vulkan_binding *vulkan_uav_binding)
{
	if (d3d_uav_binding->has_counter)
		return DXIL_SPV_FALSE;

	vulkan_uav_binding->buffer_binding = {};
	vulkan_uav_binding->buffer_binding.set = d3d_uav_binding->d3d_binding.register_space;
	vulkan_uav_binding->buffer_binding.binding = d3d_uav_binding->d3d_binding.register_index;
	if (d3d_uav_binding->d3d_binding.kind == DXIL_SPV_RESOURCE_KIND_RAW_BUFFER ||
	    d3d_uav_binding->d3d_binding.kind == DXIL_SPV_RESOURCE_KIND_STRUCTURED_BUFFER)
		vulkan_uav_binding->buffer_binding.descriptor_type = DXIL_SPV_VULKAN_DESCRIPTOR_TYPE_SSBO;
	return DXIL_SPV_TRUE;
}

dxil_spv_bool cbv_remap(void *,
                        const dxil_spv_d3d_binding *d3d_cbv_binding,
                        dxil_spv_cbv_vulkan_binding *vulkan_cbv_binding)
{
	vulkan_cbv_binding->push_constant = DXIL_SPV_FALSE;
	vulkan_cbv_binding->vulkan.uniform_binding = {};
	vulkan_cbv_binding->vulkan.uniform_binding.set = d3d_cbv_binding->register_space;
	vulkan_cbv_binding->vulkan.uniform_binding.binding = d3d_cbv_binding->register_index;
	return DXIL_SPV_TRUE;
}

static Program *get_compute_shader_from_dxil_inner(Device &device, const char *path, const char *entry)
{
	Program *prog = nullptr;
	dxil_spv_option_root_constant_inline_uniform_block inline_ubo = {
		{ DXIL_SPV_OPTION_ROOT_CONSTANT_INLINE_UNIFORM_BLOCK },
	};
	const dxil_spv_option_ssbo_alignment align = { { DXIL_SPV_OPTION_SSBO_ALIGNMENT }, 4 };
	auto mapping = GRANITE_FILESYSTEM()->open_readonly_mapping(path);
	dxil_spv_parsed_blob blob = nullptr;
	dxil_spv_converter conv = nullptr;

	if (!mapping)
		goto err;

	if (dxil_spv_parse_dxil_blob(mapping->data(), mapping->get_size(), &blob) != DXIL_SPV_SUCCESS)
		goto err;

	if (dxil_spv_create_converter(blob, &conv) != DXIL_SPV_SUCCESS)
		goto err;

	dxil_spv_converter_set_cbv_remapper(conv, cbv_remap, nullptr);
	dxil_spv_converter_set_srv_remapper(conv, srv_remap, nullptr);
	dxil_spv_converter_set_sampler_remapper(conv, sampler_remap, nullptr);
	dxil_spv_converter_set_uav_remapper(conv, uav_remap, nullptr);
	inline_ubo.enable = DXIL_SPV_TRUE;
	dxil_spv_converter_add_option(conv, &inline_ubo.base);
	dxil_spv_converter_add_option(conv, &align.base);
	dxil_spv_converter_set_entry_point(conv, entry);

	if (dxil_spv_converter_run(conv) != DXIL_SPV_SUCCESS)
		goto err;

	dxil_spv_compiled_spirv spirv;
	if (dxil_spv_converter_get_compiled_spirv(conv, &spirv) != DXIL_SPV_SUCCESS)
		goto err;

	prog = device.request_program(static_cast<const uint32_t *>(spirv.data), spirv.size);

err:
	if (conv)
		dxil_spv_converter_free(conv);
	if (blob)
		dxil_spv_parsed_blob_free(blob);
	return prog;
}

static Program *get_compute_shader_from_dxil(Device &device, const char *path, const char *entry)
{
	dxil_spv_begin_thread_allocator_context();
	auto *program = get_compute_shader_from_dxil_inner(device, path, entry);
	dxil_spv_end_thread_allocator_context();
	return program;
}

struct PushSignature
{
	VkDeviceAddress node_payload_bda;
	VkDeviceAddress node_linear_offset_bda;
	VkDeviceAddress node_total_nodes_bda;
	VkDeviceAddress node_payload_stride_or_offsets_bda;
	VkDeviceAddress node_payload_output_bda;
	VkDeviceAddress node_payload_output_atomic_bda;
	VkDeviceAddress local_root_signature_bda;
	uint32_t node_grid_dispatch[3];
	uint32_t node_payload_output_offset;
	uint32_t node_payload_output_stride;
};

struct EntryData
{
	uint32_t node_idx;
	uint32_t size;
	uint32_t offset;
	uint32_t increment;
};

static int run_tests(Device &device)
{
	auto *entry_program = get_compute_shader_from_dxil(device, "assets://test.dxil", "entry");
	auto *node1_program = get_compute_shader_from_dxil(device, "assets://test.dxil", "node1");
	auto *node2_program = get_compute_shader_from_dxil(device, "assets://test.dxil", "node2");

	BufferCreateInfo info = {};
	info.size = 100 * 1024 * 1024;
	info.domain = BufferDomain::Device;
	info.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_DST_BIT |
	             VK_BUFFER_USAGE_INDIRECT_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_SRC_BIT;

	auto node_payload_buffer = device.create_buffer(info);
	auto node_linear_offset_buffer = device.create_buffer(info);
	auto node_payload_stride_or_offsets_buffer = device.create_buffer(info);
	auto node_payload_output_buffer = device.create_buffer(info);
	auto node_payload_output_atomic_buffer = device.create_buffer(info);
	auto node_unrolled_payload_offsets_buffer = device.create_buffer(info);
	auto indirect_buffer = device.create_buffer(info);
	info.misc = BUFFER_MISC_ZERO_INITIALIZE_BIT;
	auto output_uav = device.create_buffer(info);
	info.misc = 0;

	info.domain = BufferDomain::CachedHost;
	info.usage = VK_BUFFER_USAGE_TRANSFER_DST_BIT;
	auto rb_node_payload_buffer = device.create_buffer(info);
	auto rb_node_linear_offset_buffer = device.create_buffer(info);
	auto rb_node_payload_stride_or_offsets_buffer = device.create_buffer(info);
	auto rb_node_payload_output_buffer = device.create_buffer(info);
	auto rb_node_payload_output_atomic_buffer = device.create_buffer(info);
	auto rb_indirect_buffer = device.create_buffer(info);
	auto rb_node_unrolled_payload_offsets_buffer = device.create_buffer(info);
	auto rb_output_uav = device.create_buffer(info);

	device.set_name(*node_payload_buffer, "NodePayload");
	device.set_name(*node_linear_offset_buffer, "NodeLinearOffsetBuffer");
	device.set_name(*node_payload_stride_or_offsets_buffer, "NodePayloadStrideOrOffsets");
	device.set_name(*node_payload_output_buffer, "NodePayloadOutputBuffer");
	device.set_name(*node_payload_output_atomic_buffer, "NodePayloadOutputAtomicBuffer");
	device.set_name(*node_unrolled_payload_offsets_buffer, "UnrolledOffsets");
	device.set_name(*indirect_buffer, "IndirectBuffer");
	device.set_name(*output_uav, "UAV");

	std::vector<EntryData> entry_data;
	for (unsigned i = 0; i < 1000; i++)
	{
		entry_data.push_back({ 0, 3, 4, 1 });
		entry_data.push_back({ 1, 3, 200, 1 });
	}

	PushSignature signature = {};
	signature.node_payload_bda = node_payload_buffer->get_device_address();
	signature.node_linear_offset_bda = node_linear_offset_buffer->get_device_address();
	signature.node_total_nodes_bda = 0; // Only needed for thread/coalesce.
	signature.node_payload_stride_or_offsets_bda = node_payload_stride_or_offsets_buffer->get_device_address();
	signature.node_payload_output_bda = node_payload_output_buffer->get_device_address();
	signature.node_payload_output_atomic_bda = node_payload_output_atomic_buffer->get_device_address();
	signature.node_payload_output_offset = 64 - 2; // 256 byte offset.
	signature.node_payload_output_stride = 1024 * 1024;

	Device::init_renderdoc_capture();
	device.begin_renderdoc_capture();

	auto cmd = device.request_command_buffer();
	cmd->set_program(entry_program);

	*static_cast<uint32_t *>(cmd->update_buffer(*node_payload_stride_or_offsets_buffer, 0, 4)) = sizeof(EntryData);
	*static_cast<uint32_t *>(cmd->update_buffer(*node_linear_offset_buffer, 0, 4)) = 0;
	*static_cast<uint32_t *>(cmd->update_buffer(*node_linear_offset_buffer, 4, 4)) = entry_data.size() & ~(32 * 1024 - 1);
	memcpy(cmd->update_buffer(*node_payload_buffer, 0, entry_data.size() * sizeof(entry_data.front())),
	       entry_data.data(), entry_data.size() * sizeof(entry_data.front()));
	cmd->fill_buffer(*node_payload_output_atomic_buffer, 0);

	cmd->barrier(VK_PIPELINE_STAGE_2_COPY_BIT | VK_PIPELINE_STAGE_2_CLEAR_BIT, VK_ACCESS_TRANSFER_WRITE_BIT,
	             VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_READ_BIT);

	cmd->set_specialization_constant_mask(0x2 | 0x4);
	cmd->set_specialization_constant(1, 0);
	cmd->set_specialization_constant(2, 1);

	cmd->begin_region("execute-entry-node");
	// [NodeDispatchGrid or NodeMaxDispatchGrid]
	for (uint32_t z = 0; z < 2; z++)
	{
		for (uint32_t y = 0; y < 2; y++)
		{
			for (uint32_t x = 0; x < 2; x++)
			{
				signature.node_grid_dispatch[0] = x;
				signature.node_grid_dispatch[1] = y;
				signature.node_grid_dispatch[2] = z;
				signature.node_linear_offset_bda = node_linear_offset_buffer->get_device_address();
				cmd->push_constants(&signature, 0, sizeof(signature));

				uint32_t num_dispatches = entry_data.size();
				constexpr uint32_t divider = 32 * 1024;

				cmd->dispatch(divider, num_dispatches / divider, 1);

				signature.node_linear_offset_bda = node_linear_offset_buffer->get_device_address() + 4;
				cmd->push_constants(&signature, 0, sizeof(signature));
				cmd->dispatch(num_dispatches % divider, 1, 1);
			}
		}
	}
	cmd->end_region();

	cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
	             VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_READ_BIT);

	uint32_t target_wg_size = device.get_device_features().vk11_props.subgroupSize;
	uint32_t target_wg_size_log2 = Util::floor_log2(target_wg_size);

	cmd->begin_region("distribute-workgroups");
	{
		uint32_t num_nodes = 2;
		cmd->set_program("assets://distribute_workgroups.comp");
		cmd->set_specialization_constant_mask(0x7);
		cmd->set_specialization_constant(0, target_wg_size);
		cmd->set_specialization_constant(1, 0); // COALESCE_DIVIDER
		cmd->set_specialization_constant(2, target_wg_size);

		cmd->set_storage_buffer(0, 0, *node_payload_output_atomic_buffer, 0, 256);
		cmd->set_storage_buffer(0, 1, *node_payload_output_atomic_buffer, 256, VK_WHOLE_SIZE);
		cmd->set_storage_buffer(0, 2, *indirect_buffer);

		cmd->enable_subgroup_size_control(true);
		cmd->set_subgroup_size_log2(true, 0, target_wg_size_log2);
		cmd->push_constants(&num_nodes, 0, sizeof(num_nodes));
		cmd->dispatch((num_nodes + target_wg_size - 1) >> target_wg_size_log2, 1, 1);
		cmd->enable_subgroup_size_control(false);
		cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
		             VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT | VK_PIPELINE_STAGE_DRAW_INDIRECT_BIT,
		             VK_ACCESS_2_SHADER_STORAGE_READ_BIT | VK_ACCESS_INDIRECT_COMMAND_READ_BIT);
		cmd->set_specialization_constant_mask(0);
	}
	cmd->end_region();

	cmd->begin_region("payload-offsets");
	{
		cmd->set_program("assets://distribute_payload_offsets.comp");
		cmd->enable_subgroup_size_control(true);
		cmd->set_specialization_constant_mask(0x7);
		cmd->set_subgroup_size_log2(true, 2, target_wg_size_log2);
		cmd->set_specialization_constant(0, target_wg_size);
		cmd->set_specialization_constant(1, 1); // RW_GROUP_TRACKING_COMPONENTS
		cmd->set_specialization_constant(2, uint32_t(true)); // RW_GROUP_TRACKING_U32

		cmd->set_storage_buffer(0, 0, *node_payload_output_atomic_buffer, 256, VK_WHOLE_SIZE);
		cmd->set_storage_buffer(0, 1, *node_unrolled_payload_offsets_buffer);
		cmd->set_storage_buffer(0, 2, *indirect_buffer);
		cmd->set_storage_buffer(0, 3, *node_payload_output_buffer);

		struct Push
		{
			uint32_t node_index;
			uint32_t packed_offset_counts_stride;
			uint32_t payload_stride;
			int32_t grid_offset_or_count;
		};
		Push push = {};
		push.packed_offset_counts_stride = 1024 * 1024;
		push.payload_stride = 16;
		push.grid_offset_or_count = 0;

		for (uint32_t node_index = 0; node_index < 2; node_index++)
		{
			push.node_index = node_index;
			cmd->push_constants(&push, 0, sizeof(push));
			cmd->dispatch_indirect(*indirect_buffer,
			                       sizeof(IndirectCommands) * node_index +
			                       offsetof(IndirectCommands, expander_execute));
		}

		cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
		             VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_READ_BIT);
		cmd->enable_subgroup_size_control(false);
	}
	cmd->end_region();

	cmd->set_storage_buffer(0, 1, *output_uav);
	cmd->set_storage_buffer(0, 2, *output_uav);

	for (uint32_t node_index = 0; node_index < 2; node_index++)
	{
		cmd->begin_region(node_index ? "execute-node-1" : "execute-node-0");
		cmd->set_program(node_index ? node2_program : node1_program);
		{
			signature.node_payload_bda = node_payload_output_buffer->get_device_address();
			signature.node_total_nodes_bda = indirect_buffer->get_device_address() +
			                                 sizeof(IndirectCommands) * node_index +
			                                 offsetof(IndirectCommands, end_elements);
			signature.node_payload_stride_or_offsets_bda = node_unrolled_payload_offsets_buffer->get_device_address();
			signature.node_payload_output_bda = node_payload_buffer->get_device_address();
			signature.node_payload_output_atomic_bda = node_payload_output_atomic_buffer->get_device_address();
			signature.node_payload_output_offset = 64 - 2; // 256 byte offset.
			signature.node_payload_output_stride = 1024 * 1024;
			signature.node_grid_dispatch[1] = 0;
			signature.node_grid_dispatch[2] = 0;

			cmd->set_specialization_constant_mask(1);
			cmd->set_specialization_constant(0, target_wg_size);

			for (uint32_t i = 0; i < 4; i++)
			{
				signature.node_grid_dispatch[0] = i;

				// Execute primary group.
				signature.node_linear_offset_bda = indirect_buffer->get_device_address() +
				                                   sizeof(IndirectCommands) * node_index +
				                                   offsetof(IndirectCommands, primary_linear_offset);

				cmd->push_constants(&signature, 0, sizeof(signature));
				cmd->dispatch_indirect(*indirect_buffer,
				                       sizeof(IndirectCommands) * node_index +
				                       offsetof(IndirectCommands, primary_execute));

				// Execute spill group.
				signature.node_linear_offset_bda = indirect_buffer->get_device_address() +
				                                   sizeof(IndirectCommands) * node_index +
				                                   offsetof(IndirectCommands, secondary_linear_offset);

				cmd->push_constants(&signature, 0, sizeof(signature));
				cmd->dispatch_indirect(*indirect_buffer,
				                       sizeof(IndirectCommands) * node_index +
				                       offsetof(IndirectCommands, secondary_execute));
			}
		}
		cmd->end_region();
	}

	cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
	             VK_PIPELINE_STAGE_2_COPY_BIT, VK_ACCESS_TRANSFER_READ_BIT);

	cmd->copy_buffer(*rb_node_linear_offset_buffer, *node_linear_offset_buffer);
	cmd->copy_buffer(*rb_node_payload_buffer, *node_payload_buffer);
	cmd->copy_buffer(*rb_node_payload_output_atomic_buffer, *node_payload_output_atomic_buffer);
	cmd->copy_buffer(*rb_node_payload_output_buffer, *node_payload_output_buffer);
	cmd->copy_buffer(*rb_node_payload_stride_or_offsets_buffer, *node_payload_stride_or_offsets_buffer);
	cmd->copy_buffer(*rb_node_unrolled_payload_offsets_buffer, *node_unrolled_payload_offsets_buffer);
	cmd->copy_buffer(*rb_indirect_buffer, *indirect_buffer);
	cmd->copy_buffer(*rb_output_uav, *output_uav);

	cmd->barrier(VK_PIPELINE_STAGE_2_COPY_BIT, VK_ACCESS_TRANSFER_WRITE_BIT,
	             VK_PIPELINE_STAGE_HOST_BIT, VK_ACCESS_HOST_READ_BIT);

	Fence fence;
	device.submit(cmd, &fence);
	fence->wait();
	device.end_renderdoc_capture();
	return EXIT_SUCCESS;
}

int main()
{
	Global::init(Global::MANAGER_FEATURE_FILESYSTEM_BIT | Global::MANAGER_FEATURE_THREAD_GROUP_BIT, 2);
	Filesystem::setup_default_filesystem(GRANITE_FILESYSTEM(), ASSET_DIRECTORY);

	Context::SystemHandles handles = {};
	handles.filesystem = GRANITE_FILESYSTEM();
	handles.thread_group = GRANITE_THREAD_GROUP();

	if (!Context::init_loader(nullptr))
		return EXIT_FAILURE;

	Context ctx;
	ctx.set_system_handles(handles);
	ctx.set_num_thread_indices(2);
	if (!ctx.init_instance_and_device(nullptr, 0, nullptr, 0))
		return EXIT_FAILURE;

	Device dev;
	dev.set_context(ctx);
	return run_tests(dev);
}