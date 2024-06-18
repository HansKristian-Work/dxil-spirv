/* Copyright (c) 2024 Hans-Kristian Arntzen for Valve Corporation
 * SPDX-License-Identifier: MIT
 */

#include "dxil_spirv_c.h"
#include "device.hpp"
#include "logging.hpp"
#include "filesystem.hpp"
#include "global_managers_init.hpp"

using namespace Vulkan;
using namespace Granite;

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
	info.size = 4096;
	info.domain = BufferDomain::Device;
	info.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_DST_BIT |
	             VK_BUFFER_USAGE_INDIRECT_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_SRC_BIT;

	auto node_payload_buffer = device.create_buffer(info);
	auto node_linear_offset_buffer = device.create_buffer(info);
	auto node_payload_stride_or_offsets_buffer = device.create_buffer(info);
	auto node_payload_output_buffer = device.create_buffer(info);
	auto node_payload_output_atomic_buffer = device.create_buffer(info);
	auto indirect_buffer = device.create_buffer(info);

	info.domain = BufferDomain::CachedHost;
	info.usage = VK_BUFFER_USAGE_TRANSFER_DST_BIT;
	auto rb_node_payload_buffer = device.create_buffer(info);
	auto rb_node_linear_offset_buffer = device.create_buffer(info);
	auto rb_node_payload_stride_or_offsets_buffer = device.create_buffer(info);
	auto rb_node_payload_output_buffer = device.create_buffer(info);
	auto rb_node_payload_output_atomic_buffer = device.create_buffer(info);
	auto rb_indirect_buffer = device.create_buffer(info);

	device.set_name(*node_payload_buffer, "NodePayload");
	device.set_name(*node_linear_offset_buffer, "NodeLinearOffsetBuffer");
	device.set_name(*node_payload_stride_or_offsets_buffer, "NodePayloadStrideOrOffsets");
	device.set_name(*node_payload_output_buffer, "NodePayloadOutputBuffer");
	device.set_name(*node_payload_output_atomic_buffer, "NodePayloadOutputAtomicBuffer");
	device.set_name(*indirect_buffer, "IndirectBuffer");

	const EntryData entry_data[] = {
		{ 0, 2, 4, 5 },
		{ 1, 3, 2, 3 },
	};

	PushSignature signature = {};
	signature.node_payload_bda = node_payload_buffer->get_device_address();
	signature.node_linear_offset_bda = node_linear_offset_buffer->get_device_address();
	signature.node_total_nodes_bda = 0; // Only needed for thread/coalesce.
	signature.node_payload_stride_or_offsets_bda = node_payload_stride_or_offsets_buffer->get_device_address();
	signature.node_payload_output_bda = node_payload_output_buffer->get_device_address();
	signature.node_payload_output_atomic_bda = node_payload_output_atomic_buffer->get_device_address();
	signature.node_payload_output_offset = 64;
	signature.node_payload_output_stride = 64;

	Device::init_renderdoc_capture();
	device.begin_renderdoc_capture();

	auto cmd = device.request_command_buffer();
	cmd->set_program(entry_program);

	*static_cast<uint32_t *>(cmd->update_buffer(*node_payload_stride_or_offsets_buffer, 0, 4)) = sizeof(EntryData);
	*static_cast<uint32_t *>(cmd->update_buffer(*node_linear_offset_buffer, 0, 4)) = 0;
	memcpy(cmd->update_buffer(*node_payload_buffer, 0, sizeof(entry_data)), entry_data, sizeof(entry_data));
	cmd->fill_buffer(*node_payload_output_atomic_buffer, 0);

	cmd->barrier(VK_PIPELINE_STAGE_2_COPY_BIT | VK_PIPELINE_STAGE_2_CLEAR_BIT, VK_ACCESS_TRANSFER_WRITE_BIT,
	             VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_READ_BIT);

	cmd->set_specialization_constant_mask(0x2 | 0x4);
	cmd->set_specialization_constant(1, 0);
	cmd->set_specialization_constant(2, 1);

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
				cmd->push_constants(&signature, 0, sizeof(signature));
				cmd->dispatch(2, 1, 1); // Feed from indirect as needed.
			}
		}
	}

	cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
	             VK_PIPELINE_STAGE_2_COPY_BIT, VK_ACCESS_TRANSFER_READ_BIT);

	cmd->copy_buffer(*rb_node_linear_offset_buffer, *node_linear_offset_buffer);
	cmd->copy_buffer(*rb_node_payload_buffer, *node_payload_buffer);
	cmd->copy_buffer(*rb_node_payload_output_atomic_buffer, *node_payload_output_atomic_buffer);
	cmd->copy_buffer(*rb_node_payload_output_buffer, *node_payload_output_buffer);
	cmd->copy_buffer(*rb_node_payload_stride_or_offsets_buffer, *node_payload_stride_or_offsets_buffer);
	cmd->copy_buffer(*rb_indirect_buffer, *indirect_buffer);

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

	if (!Context::init_loader(nullptr))
		return EXIT_FAILURE;

	Context ctx;
	if (!ctx.init_instance_and_device(nullptr, 0, nullptr, 0))
		return EXIT_FAILURE;

	Device dev;
	dev.set_context(ctx);
	return run_tests(dev);
}