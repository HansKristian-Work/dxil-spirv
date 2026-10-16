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

#include "fuzz_emitter.hpp"
#include <stdio.h>
#include <string.h>
#include <string>

#include "logging.hpp"
#include "spirv-tools/libspirv.hpp"
#include "spirv_cross_c.h"
#include "cli_parser.hpp"
#include "thread_local_allocator.hpp"

#include <vulkan/vulkan.h>

using namespace dxil_spv;

static void print_spirv_assembly(const Vector<uint32_t> &code)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	std::string str;
	if (!tools.Disassemble(code.data(), code.size(), &str, SPV_BINARY_TO_TEXT_OPTION_INDENT))
		LOGE("Failed to disassemble SPIR-V.\n");
	else
		LOGE("\nSPIR-V:\n%s\n", str.c_str());
}

static void print_glsl(const Vector<uint32_t> &code)
{
	spvc_context context;
	if (spvc_context_create(&context) != SPVC_SUCCESS)
		return;

	spvc_parsed_ir ir;
	if (spvc_context_parse_spirv(context, code.data(), code.size(), &ir) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler compiler;
	if (spvc_context_create_compiler(context, SPVC_BACKEND_GLSL, ir, SPVC_CAPTURE_MODE_TAKE_OWNERSHIP, &compiler) !=
	    SPVC_SUCCESS)
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

	LOGI("==== GLSL ====\n");
	fputs(source, stderr);
	LOGI("====\n");

cleanup:
	spvc_context_destroy(context);
}


static void print_help()
{
	LOGE("Usage: structurize-test [input] [--output out.spv] [--skip-validation] [--help] [--compile] [--unstructured]\n");
}

static void compile_compute_shader(const Vector<uint32_t> &spirv)
{
	VkInstanceCreateInfo instance_info = { VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO };
	VkApplicationInfo app_info = { VK_STRUCTURE_TYPE_APPLICATION_INFO };
	app_info.apiVersion = VK_API_VERSION_1_4;
	app_info.pApplicationName = "structurize-test";
	app_info.pEngineName = "dxil-spirv";
	instance_info.pApplicationInfo = &app_info;

	VkInstance instance;
	VkDevice device;
	VkResult vr;

	vr = vkCreateInstance(&instance_info, nullptr, &instance);
	if (vr != VK_SUCCESS)
	{
		LOGE("Failed to create VkInstance");
		return;
	}

	VkDeviceCreateInfo device_info = { VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO };
	VkDeviceQueueCreateInfo queue_info = { VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO };
	queue_info.queueCount = 1;
	device_info.pQueueCreateInfos = &queue_info;

	uint32_t count = 1;
	VkPhysicalDevice gpu;
	if (vkEnumeratePhysicalDevices(instance, &count, &gpu) < 0)
	{
		LOGE("Failed to enumerate GPUs.\n");
		return;
	}

	VkPhysicalDeviceVulkan14Features vk14 = { VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_VULKAN_1_4_FEATURES };
	VkPhysicalDeviceFeatures2 features = { VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_FEATURES_2 };
	features.pNext = &vk14;
	vkGetPhysicalDeviceFeatures2(gpu, &features);
	device_info.pNext = &features;

	vr = vkCreateDevice(gpu, &device_info, nullptr, &device);
	if (vr != VK_SUCCESS)
	{
		LOGE("Failed to create VkDevice");
		return;
	}

	VkDescriptorSetLayoutCreateInfo layout_info = { VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO };
	layout_info.bindingCount = 2;
	VkDescriptorSetLayoutBinding bindings[2] = {};
	bindings[0].descriptorType = VK_DESCRIPTOR_TYPE_STORAGE_BUFFER;
	bindings[0].descriptorCount = 1;
	bindings[0].stageFlags = VK_SHADER_STAGE_COMPUTE_BIT;
	bindings[1] = bindings[0];
	bindings[1].binding = 1;
	layout_info.pBindings = bindings;

	VkDescriptorSetLayout set_layout;
	VkPipelineLayout pipeline_layout;
	if (vkCreateDescriptorSetLayout(device, &layout_info, nullptr, &set_layout) != VK_SUCCESS)
	{
		LOGE("Failed to create VkDescriptorSetLayout");
		return;
	}

	VkPipelineLayoutCreateInfo pipe_layout_info = { VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO };
	pipe_layout_info.setLayoutCount = 1;
	pipe_layout_info.pSetLayouts = &set_layout;
	if (vkCreatePipelineLayout(device, &pipe_layout_info, nullptr, &pipeline_layout) != VK_SUCCESS)
	{
		LOGE("Failed to create VkPipelineLayout");
		return;
	}

	VkComputePipelineCreateInfo pipe_info = { VK_STRUCTURE_TYPE_COMPUTE_PIPELINE_CREATE_INFO };
	pipe_info.layout = pipeline_layout;
	pipe_info.stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
	pipe_info.stage.stage = VK_SHADER_STAGE_COMPUTE_BIT;
	pipe_info.stage.pName = "main";

	VkShaderModuleCreateInfo module_info = { VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO };
	module_info.codeSize = spirv.size() * sizeof(spirv.front());
	module_info.pCode = spirv.data();
	pipe_info.stage.pNext = &module_info;

	VkPipeline pipe;
	if (vkCreateComputePipelines(device, VK_NULL_HANDLE, 1, &pipe_info, nullptr, &pipe) != VK_SUCCESS)
	{
		LOGE("Failed to create pipeline.\n");
		return;
	}

	vkDestroyPipeline(device, pipe, nullptr);
	vkDestroyDescriptorSetLayout(device, set_layout, nullptr);
	vkDestroyPipelineLayout(device, pipeline_layout, nullptr);
	vkDestroyDevice(device, nullptr);
	vkDestroyInstance(instance, nullptr);
}

int main(int argc, char **argv)
{
	begin_thread_allocator_context();

	Emitter::Style style = Emitter::Style::Legacy;
	String input_path;
	String output_path;
	bool skip_validation = false;
	bool compile = false;
	CLICallbacks cbs;
	cbs.default_handler = [&](const char *path) { input_path = path; };
	cbs.add("--help", [&](CLIParser &parser) { parser.end(); });
	cbs.add("--output", [&](CLIParser &parser) { output_path = parser.next_string(); });
	cbs.add("--skip-validation", [&](CLIParser &) { skip_validation = true; });
	cbs.add("--compile", [&](CLIParser &) { compile = true; });
	cbs.add("--unstructured", [&](CLIParser &) { style = Emitter::Style::Unstructured; skip_validation = true; });
	cbs.add("--new", [&](CLIParser &) { style = Emitter::Style::Modern; });

	CLIParser parser(std::move(cbs), argc - 1, argv + 1);
	if (!parser.parse())
	{
		print_help();
		return EXIT_FAILURE;
	}
	else if (parser.is_ended_state())
	{
		print_help();
		return EXIT_SUCCESS;
	}

	if (input_path.empty())
	{
		LOGE("Need at least input path.\n");
		return EXIT_FAILURE;
	}

	Emitter emitter;

	FILE *file = fopen(argv[1], "r");
	if (!file)
	{
		fprintf(stderr, "Failed to open input file: %s.\n", argv[1]);
		return EXIT_FAILURE;
	}

	char line_buffer[1024];
	while (fgets(line_buffer, sizeof(line_buffer), file))
		emitter.parse_line(line_buffer);

	Vector<uint32_t> code;
	bool success = emitter.finalize(style, code, !skip_validation);

	if (compile && success)
		compile_compute_shader(code);

	if (output_path.empty())
	{
		print_spirv_assembly(code);
		print_glsl(code);
	}
	else
	{
		FILE *f = fopen(output_path.c_str(), "wb");
		if (!f)
		{
			LOGE("Failed to open file %s for writing.\n", output_path.c_str());
			return EXIT_FAILURE;
		}

		if (fwrite(code.data(), sizeof(uint32_t), code.size(), f) != code.size())
		{
			LOGE("Failed to write file %s.\n", output_path.c_str());
			return EXIT_FAILURE;
		}

		fclose(f);
	}

	return success ? EXIT_SUCCESS : EXIT_FAILURE;
}
