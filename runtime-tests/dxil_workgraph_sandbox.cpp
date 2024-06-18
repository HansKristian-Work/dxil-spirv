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

static int run_tests(Device &device)
{
	auto *entry_program = get_compute_shader_from_dxil(device, "assets://test.dxil", "entry");
	auto *node1 = get_compute_shader_from_dxil(device, "assets://test.dxil", "node1");
	auto *node2 = get_compute_shader_from_dxil(device, "assets://test.dxil", "node2");
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