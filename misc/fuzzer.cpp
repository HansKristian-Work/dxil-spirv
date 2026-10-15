/* Copyright (c) 2026 Hans-Kristian Arntzen for Valve Corporation
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

#include <thread>
#include "cli_parser.hpp"
#include "context.hpp"
#include "device.hpp"
#include "logging.hpp"
#include <unistd.h>
#include <memory>
#include <random>
#include "fuzz_emitter.hpp"
#include "thread_group.hpp"

using namespace Vulkan;
using namespace Granite;
using namespace dxil_spv;

static void print_help()
{
	LOGE("Usage: structurize-fuzzer [--help] [--complexity N] [--iterations N] [--threads THR]\n");
}

struct FuzzState
{
	Fence fence;
	BufferHandle unstructured_result;
	BufferHandle structured_result;
};

static constexpr uint32_t MaxBlocks = 256;
static constexpr uint32_t MaxFeedback = 1024;

static bool validate_fuzzing_result(Device &device, FuzzState &state)
{
	if (!state.fence)
		return false;

	state.fence->wait();

	auto *unstructured = static_cast<const uint32_t *>(device.map_host_buffer(*state.unstructured_result, MEMORY_ACCESS_READ_BIT));
	auto *structured = static_cast<const uint32_t *>(device.map_host_buffer(*state.structured_result, MEMORY_ACCESS_READ_BIT));

	for (size_t i = 0; i < MaxFeedback; i++)
	{
		if (unstructured[MaxBlocks * i] == 0)
		{
			LOGE("The buffer is not written for block %zu.\n", i);
			return false;
		}
	}

	size_t words = state.unstructured_result->get_create_info().size / sizeof(uint32_t);
	for (size_t i = 0; i < words; i++)
	{
		if (unstructured[i] != structured[i])
		{
			LOGE("Fuzzing failed at word %zu, expected %u, got %u.\n", i, unstructured[i], structured[i]);
			return false;
		}
	}

	return true;
}

static FuzzState queue_fuzz(
	std::mt19937 &rnd, Device &device,
	const Vector<uint32_t> &reference, const Vector<uint32_t> &candidate)
{
	std::vector<uint32_t> conditions;
	conditions.reserve(MaxBlocks * MaxFeedback);
	for (uint32_t i = 0; i < MaxBlocks * MaxFeedback; i++)
		conditions.push_back(rnd() % 2);

	BufferCreateInfo bufinfo = {};
	bufinfo.size = conditions.size() * sizeof(conditions.front());
	bufinfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
	bufinfo.domain = BufferDomain::Device;
	auto condition_buffer = device.create_buffer(bufinfo, conditions.data());

	bufinfo.size = MaxBlocks * MaxFeedback * sizeof(uint32_t);
	bufinfo.domain = BufferDomain::CachedHost;
	bufinfo.misc = BUFFER_MISC_ZERO_INITIALIZE_BIT;
	auto feedback_buffer_unstructured = device.create_buffer(bufinfo);
	auto feedback_buffer_structured = device.create_buffer(bufinfo);

	auto cmd = device.request_command_buffer();

	auto *reference_program = device.request_program(reference.data(), reference.size() * sizeof(reference.front()));
	auto *candidate_program = device.request_program(candidate.data(), candidate.size() * sizeof(candidate.front()));

	for (uint32_t i = 0; i < MaxFeedback; i++)
	{
		cmd->set_program(reference_program);
		cmd->set_storage_buffer(0, 0, *condition_buffer, MaxBlocks * i * sizeof(uint32_t), MaxBlocks * sizeof(uint32_t));
		cmd->set_storage_buffer(0, 1, *feedback_buffer_unstructured, MaxBlocks * i * sizeof(uint32_t), MaxBlocks * sizeof(uint32_t));
		cmd->dispatch(1, 1, 1);

		cmd->set_program(candidate_program);
		cmd->set_storage_buffer(0, 0, *condition_buffer, MaxBlocks * i * sizeof(uint32_t), MaxBlocks * sizeof(uint32_t));
		cmd->set_storage_buffer(0, 1, *feedback_buffer_structured, MaxBlocks * i * sizeof(uint32_t), MaxBlocks * sizeof(uint32_t));
		cmd->dispatch(1, 1, 1);
	}

	cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
	             VK_PIPELINE_STAGE_HOST_BIT, VK_ACCESS_HOST_READ_BIT);

	FuzzState result;
	device.submit(cmd, &result.fence);
	result.structured_result = std::move(feedback_buffer_structured);
	result.unstructured_result = std::move(feedback_buffer_unstructured);
	device.next_frame_context();
	return result;
}

static void dump_file(const char *path, const std::vector<std::string> &lines)
{
	FILE *f = fopen(path, "w");
	if (f)
	{
		for (auto &line : lines)
			fprintf(f, "%s\n", line.c_str());
		fclose(f);
	}
	else
	{
		LOGE("Failed to write file to: %s\n", path);
	}
}

static std::once_flag once;

static void dump_file_once(const char *path, const std::vector<std::string> &lines)
{
	std::call_once(once, [&]()
	{
		dump_file(path, lines);
		std::terminate();
	});
}

static std::vector<std::string> generate_random_forward_cfg(std::mt19937 &rnd, uint32_t complexity)
{
	std::vector<std::string> cfg;
	cfg.emplace_back("b entry n0");

	for (uint32_t i = 0; i < complexity - 1; i++)
	{
		std::uniform_int_distribution<uint32_t> dist(i + 1, complexity - 1);

		if (rnd() % 2)
		{
			uint32_t target_a = dist(rnd);
			uint32_t target_b = dist(rnd);
			char line[64];
			snprintf(line, sizeof(line), "c n%u n%u n%u", i, target_a, target_b);
			cfg.emplace_back(line);
		}
		else
		{
			uint32_t target = dist(rnd);
			char line[64];
			snprintf(line, sizeof(line), "b n%u n%u", i, target);
			cfg.emplace_back(line);
		}
	}

	return cfg;
}

static void run_fuzz(Device &device, uint32_t seed, uint32_t complexity)
{
	std::mt19937 rnd(seed);

	auto lines = generate_random_forward_cfg(rnd, complexity);

	char path[256];
	snprintf(path, sizeof(path), "/tmp/reference.%u.st", seed);
	dump_file(path, lines);

	const auto emit_lines = [&](Emitter &emitter)
	{
		char line_buffer[64];
		for (auto &line : lines)
		{
			strlcpy(line_buffer, line.c_str(), sizeof(line_buffer));
			emitter.parse_line(line_buffer);
		}
	};

	Vector<uint32_t> unstructured, structured;
	Emitter emitter_unstructured;
	emit_lines(emitter_unstructured);
	// The unstructured code doesn't do much.
	if (!emitter_unstructured.finalize(Emitter::Style::Unstructured, unstructured, false))
	{
		LOGE("Failed to convert unstructured code!\n");
		dump_file_once("/tmp/failure.st", lines);
	}

	Emitter emitter_structured;
	emit_lines(emitter_structured);
	if (!emitter_structured.finalize(Emitter::Style::Modern, structured, true))
	{
		LOGE("Failed to convert structured code!\n");
		dump_file_once("/tmp/failure.st", lines);
	}

	FuzzState state = queue_fuzz(rnd, device, unstructured, structured);
	if (!validate_fuzzing_result(device, state))
	{
		LOGE("Failed to validate fuzzing result.\n");
		dump_file_once("/tmp/failure.st", lines);
	}
}

static void run_fuzzing_rounds(Device &device, uint32_t iterations, uint32_t threads, uint32_t seed, uint32_t complexity)
{
	auto *tg = device.get_system_handles().thread_group;
	std::queue<TaskGroupHandle> tasks;
	uint32_t iteration = 0;
	uint32_t completed = 0;

	for (;;)
	{
		while (tasks.size() < threads && iteration < iterations)
		{
			auto task = tg->create_task([&device, seed = seed + iteration, complexity]()
			{
				run_fuzz(device, seed, complexity);
			});
			task->flush();
			tasks.push(std::move(task));
			iteration++;
		}

		if (tasks.empty())
			break;

		tasks.front()->wait();
		tasks.pop();

		completed++;
		LOGI("Completed %u rounds\n", completed);
	}

	tg->wait_idle();
}

int main(int argc, char **argv)
{
	Util::CLICallbacks cbs;
	uint32_t complexity = 8;
	uint32_t iterations = 128;
	unsigned threads = std::thread::hardware_concurrency();
	uint32_t seed = 42;

	cbs.add("--help", [&](Util::CLIParser &parser) { parser.end(); });
	cbs.add("--complexity", [&](Util::CLIParser &parser) { complexity = parser.next_uint(); });
	cbs.add("--iterations", [&](Util::CLIParser &parser) { iterations = parser.next_uint(); });
	cbs.add("--threads", [&](Util::CLIParser &parser) { threads = parser.next_uint(); });
	cbs.add("--seed", [&](Util::CLIParser &parser) { seed = parser.next_uint(); });

	ThreadGroup group;
	group.start(threads, 0, {});

	Util::CLIParser parser(std::move(cbs), argc - 1, argv + 1);
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

	if (!Context::init_loader(nullptr))
		return EXIT_FAILURE;

	Context::SystemHandles handles = {};
	handles.thread_group = &group;
	Context context;
	context.set_num_thread_indices(group.get_num_threads() + 1);
	context.set_system_handles(handles);

	// Use robustness in case the shaders run amok.
	if (!context.init_instance_and_device(nullptr, 0, nullptr, 0,
	                                      CONTEXT_CREATION_ENABLE_ROBUSTNESS_2_BIT))
		return EXIT_FAILURE;

	// Due to the nature of Granite's hash'n'cache, it has no way to delete obsolete pipelines.
	// Just recreate the logical device periodically. Context owns the actual device, so it should be fine.
	// For similar reasons, we should disable caching in Mesa when running this.
	for (uint32_t iteration = 0; iteration < iterations; )
	{
		Device device;
		device.set_context(context);

		uint32_t to_run = std::min<uint32_t>(iterations - iteration, 64 * 1024);
		run_fuzzing_rounds(device, to_run, threads, seed + iteration, complexity);
		iteration += to_run;
	}
}