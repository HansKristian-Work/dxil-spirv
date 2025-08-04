/* Copyright (c) 2025 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 */

#include "ir/ir.h"
#include "ir/ir_builder.h"
#include "dxil_converter.hpp"
#include "module.hpp"
#include "api/test_api.h"
#include "context.hpp"
#include "thread_local_allocator.hpp"
#include "cfg_structurizer.hpp"
#include "logging.hpp"
#include "spirv_cross_c.h"
#include "spirv-tools/libspirv.hpp"

using namespace dxil_spv;
using namespace dxbc_spv;

struct Remapper : ResourceRemappingInterface
{
	bool remap_srv(const D3DBinding &d3d_binding, VulkanSRVBinding &vulkan_binding) override
	{
		vulkan_binding = {};
		vulkan_binding.buffer_binding.descriptor_set = d3d_binding.register_space;
		vulkan_binding.buffer_binding.binding = d3d_binding.register_index;
		if (d3d_binding.kind == DXIL::ResourceKind::StructuredBuffer || d3d_binding.kind == DXIL::ResourceKind::RawBuffer)
			vulkan_binding.buffer_binding.descriptor_type = VulkanDescriptorType::SSBO;
		return true;
	}

	bool remap_sampler(const D3DBinding &d3d_binding, VulkanBinding &vulkan_binding) override
	{
		vulkan_binding = {};
		vulkan_binding.descriptor_set = d3d_binding.register_space;
		vulkan_binding.binding = d3d_binding.register_index;
		return true;
	}

	bool remap_uav(const D3DUAVBinding &d3d_binding, VulkanUAVBinding &vulkan_binding) override
	{
		vulkan_binding = {};
		vulkan_binding.buffer_binding.descriptor_set = d3d_binding.binding.register_space;
		vulkan_binding.buffer_binding.binding = d3d_binding.binding.register_index;

		if (d3d_binding.binding.kind == DXIL::ResourceKind::StructuredBuffer ||
		    d3d_binding.binding.kind == DXIL::ResourceKind::RawBuffer)
			vulkan_binding.buffer_binding.descriptor_type = VulkanDescriptorType::SSBO;

		if (d3d_binding.counter)
		{
			vulkan_binding.counter_binding.descriptor_set = d3d_binding.binding.register_space;
			vulkan_binding.counter_binding.binding = d3d_binding.binding.register_index;
			vulkan_binding.counter_binding.descriptor_type = VulkanDescriptorType::TexelBuffer;
		}

		return true;
	}

	bool remap_cbv(const D3DBinding &d3d_binding, VulkanCBVBinding &vulkan_binding) override
	{
		vulkan_binding = {};
		vulkan_binding.buffer.descriptor_set = d3d_binding.register_space;
		vulkan_binding.buffer.binding = d3d_binding.register_index;
		return true;
	}

	bool remap_vertex_input(const D3DStageIO &d3d_input, VulkanStageIO &vulkan_location) override
	{
		vulkan_location = {};
		vulkan_location.location = d3d_input.start_row;
		return true;
	}

	bool remap_stream_output(const D3DStreamOutput &, VulkanStreamOutput &vk_output) override
	{
		vk_output = {};
		return true;
	}

	bool remap_stage_input(const D3DStageIO &d3d_input, VulkanStageIO &vk_input) override
	{
		return true;
	}

	bool remap_stage_output(const D3DStageIO &d3d_output, VulkanStageIO &vk_output) override
	{
		return true;
	}

	unsigned get_root_constant_word_count() override
	{
		return 0;
	}

	unsigned get_root_descriptor_count() override
	{
		return 0;
	}

	bool has_nontrivial_stage_input_remapping() override
	{
		return false;
	}
};

static std::string convert_to_asm(const void *code, size_t size)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_3);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		                         LOGE("SPIRV-Tools message: %s\n", message);
	                         });

	std::string str;
	if (!tools.Disassemble(static_cast<const uint32_t *>(code), size / sizeof(uint32_t), &str,
	                       SPV_BINARY_TO_TEXT_OPTION_FRIENDLY_NAMES |
	                       SPV_BINARY_TO_TEXT_OPTION_INDENT |
	                       SPV_BINARY_TO_TEXT_OPTION_NESTED_INDENT))
		return "";
	else
		return str;
}

static bool validate_spirv(const void *code, size_t size)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_3);
	bool expected_failure = false;
	bool unexpected_failure = false;

	tools.SetMessageConsumer([&](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		                         if (strstr(message, "08721") || strstr(message, "08722"))
		                         {
			                         LOGW("SPIRV-Tools message expected failure: %s\n", message);
			                         expected_failure = true;
		                         }
		                         else
		                         {
			                         LOGE("SPIRV-Tools message: %s\n", message);
			                         unexpected_failure = true;
		                         }
	                         });

	spvtools::ValidatorOptions opts;
	opts.SetScalarBlockLayout(true);
	return tools.Validate(static_cast<const uint32_t *>(code), size / sizeof(uint32_t), opts) ||
	       (expected_failure && !unexpected_failure);
}

static std::string convert_to_glsl(const void *code, size_t size)
{
	std::string ret;
	spvc_context context;
	if (spvc_context_create(&context) != SPVC_SUCCESS)
		return ret;

	spvc_parsed_ir ir;
	if (spvc_context_parse_spirv(context, static_cast<const SpvId *>(code), size / sizeof(uint32_t), &ir) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler compiler;
	if (spvc_context_create_compiler(context, SPVC_BACKEND_GLSL, ir, SPVC_CAPTURE_MODE_TAKE_OWNERSHIP, &compiler) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler_options opts;
	if (spvc_compiler_create_compiler_options(compiler, &opts) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler_options_set_bool(opts, SPVC_COMPILER_OPTION_GLSL_ES, SPVC_FALSE);
	spvc_compiler_options_set_uint(opts, SPVC_COMPILER_OPTION_GLSL_VERSION, 460);
	spvc_compiler_options_set_bool(opts, SPVC_COMPILER_OPTION_GLSL_VULKAN_SEMANTICS, SPVC_TRUE);
	spvc_compiler_install_compiler_options(compiler, opts);

	const char *source;
	if (spvc_compiler_compile(compiler, &source) != SPVC_SUCCESS)
		goto cleanup;

	ret = source;

cleanup:
	spvc_context_destroy(context);
	return ret;
}

static Vector<uint32_t> run_test(const char *name, ir::Builder &builder)
{
	LOGI("Testing %s ...\n", name);

	LLVMBCParser parser;
	if (!parser.parseDXBC(builder))
	{
		LOGE("Failed to parse.\n");
		return {};
	}

	SPIRVModule module;
	Converter converter(parser, nullptr, module);
	Remapper remapper;

	OptionSSBOAlignment align;
	align.alignment = 1;
	converter.add_option(align);

	OptionShaderDemoteToHelper demote;
	demote.supported = true;
	converter.add_option(demote);

	converter.set_resource_remapping_interface(&remapper);
	auto entry = converter.convert_entry_point();

	if (!entry.entry.entry)
	{
		LOGE("Failed to convert function.\n");
		return {};
	}

	{
		CFGStructurizer structurizer(entry.entry.entry, *entry.node_pool, module);
		if (entry.entry.is_structured)
			structurizer.run_trivial();
		else
			structurizer.run();
		module.emit_entry_point_function_body(structurizer);
	}

	for (auto &leaf : entry.leaf_functions)
	{
		if (!leaf.entry)
		{
			LOGE("Leaf function is nullptr!\n");
			return {};
		}
		CFGStructurizer structurizer(leaf.entry, *entry.node_pool, module);
		module.set_entry_build_point(leaf.func);

		if (leaf.is_structured)
			structurizer.run_trivial();
		else
			structurizer.run();

		module.emit_leaf_function_body(leaf.func, structurizer);
	}

	Vector<uint32_t> spirv;
	if (!module.finalize_spirv(spirv))
	{
		LOGE("Failed to finalize SPIR-V.\n");
		return {};
	}

#if 1
	if (!validate_spirv(spirv.data(), spirv.size() * sizeof(uint32_t)))
	{
		LOGE("Failed to validate SPIR-V.\n");
		return {};
	}
#endif

	return spirv;
}

int main(int argc, char **argv)
{
	auto tests = test_api::enumerateTests(nullptr);

	for (auto &test : tests)
	{
#if 0
		if (test.name != "test_misc_function_with_return")
			continue;
#endif

		begin_thread_allocator_context();
		{
			auto spirv = run_test(test.name.c_str(), test.builder);

			if (spirv.empty())
			{
				LOGE("Failure to convert test to SPIR-V!\n");
				return EXIT_FAILURE;
			}

			auto disasm = convert_to_asm(spirv.data(), spirv.size() * sizeof(uint32_t));
			auto glsl = convert_to_glsl(spirv.data(), spirv.size() * sizeof(uint32_t));

			FILE *file_asm = nullptr;
			FILE *file_glsl = nullptr;

			if (argc == 2)
			{
				std::string path = argv[1];
				path += '/';
				path += test.name;

				auto path_asm = path + ".asm";
				auto path_glsl = path + ".glsl";

				file_asm = fopen(path_asm.c_str(), "w");
				file_glsl = fopen(path_glsl.c_str(), "w");
				if (!file_asm || !file_glsl)
				{
					LOGE("Failed to open file \"%s\" and \"%s\"\n",
					     path_asm.c_str(), path_glsl.c_str());
					return EXIT_FAILURE;
				}
			}

			if (file_asm && file_glsl)
			{
				fprintf(file_asm, "SPIR-V:\n%s\n", disasm.c_str());
				fprintf(file_glsl, "GLSL:\n%s\n", glsl.c_str());
				fclose(file_asm);
				fclose(file_glsl);
			}
			else
			{
				LOGI("SPIR-V:\n%s\n", disasm.c_str());
				LOGI("GLSL:\n%s\n", glsl.c_str());
			}
		}
		end_thread_allocator_context();
	}
}