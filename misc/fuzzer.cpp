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

// Set to test "magic" Mesa goto-if path
//#define TEST_UNSTRUCTURED
///

static void print_help()
{
	LOGE("Usage: structurize-fuzzer [--help] [--complexity N] [--iterations N] [--threads THR] [--dump-reference]\n");
}

enum class Term
{
	Branch,
	Condition,
	Switch
};

struct FuzzBlock
{
	enum { MaxSuccs = 8 };

	Term terminator;
	uint32_t from;
	uint32_t to[MaxSuccs];
	uint32_t phi_inputs;
};

struct FuzzState
{
	Fence fence;
	BufferHandle unstructured_result;
	BufferHandle structured_result;
	Vector<FuzzBlock> nodes;
	Vector<uint32_t> conditions;
	Vector<uint32_t> simulated;
};

static constexpr uint32_t MaxBlocksPerTriage = 1024;
static constexpr uint32_t MaxNumRandomPaths = 4096;

static Vector<uint32_t> simulate_feedback_buffer(
		const Vector<FuzzBlock> &blocks, const Vector<uint32_t> &cond_buffer)
{
	Vector<uint32_t> result;
	result.reserve(MaxBlocksPerTriage * MaxNumRandomPaths);

	for (uint32_t path_index = 0; path_index < MaxNumRandomPaths; path_index++)
	{
		uint32_t feedback[MaxBlocksPerTriage] = {};
		uint32_t feedback_index = 0;
		uint32_t last_block = 0;
		uint32_t current_block = UINT32_MAX;
		uint32_t cond_index = 0;

		const auto write_feedback = [&](uint32_t v)
		{
			if (feedback_index < MaxBlocksPerTriage)
				feedback[feedback_index] = v;
			feedback_index++;
		};

		const auto read_cond = [&]()
		{
			uint32_t v = 0;
			if (cond_index < MaxBlocksPerTriage)
				v = cond_buffer[path_index * MaxBlocksPerTriage + cond_index];
			cond_index++;
			return v;
		};

		for (;;)
		{
			auto itr = std::find_if(blocks.begin(), blocks.end(), [&](const FuzzBlock &candidate)
			{
				return candidate.from == current_block;
			});

			if (itr != blocks.end())
			{
				write_feedback((1u << 30) | (cond_index << 15) | (current_block & 0x7fff));

				for (uint32_t i = 0; i < itr->phi_inputs; i++)
					write_feedback((2u << 30) | (last_block & 0x7fff));
				last_block = current_block;

				if (itr->terminator == Term::Condition)
				{
					current_block = read_cond() ? itr->to[0] : itr->to[1];
				}
				else if (itr->terminator == Term::Switch)
				{
					auto c = read_cond();
					if (c >= FuzzBlock::MaxSuccs)
						c = 0;
					current_block = itr->to[c];
				}
				else
				{
					current_block = itr->to[0];
				}
			}
			else
			{
				// This block terminates.
				write_feedback((1u << 30) | (cond_index << 15) | (current_block & 0x7fff));
				break;
			}

			if (feedback_index >= MaxBlocksPerTriage * 4)
			{
				// This shader seems to never terminate.
				memset(feedback, 0xff, sizeof(feedback));
				break;
			}
		}

		result.insert(result.end(), feedback, feedback + MaxBlocksPerTriage);
	}

	return result;
}

static bool validate_fuzzing_result(Device &device, FuzzState &state)
{
	if (!state.fence)
		return false;

	state.fence->wait();

#ifdef TEST_UNSTRUCTURED
	auto *unstructured = static_cast<const uint32_t *>(device.map_host_buffer(*state.unstructured_result, MEMORY_ACCESS_READ_BIT));
#endif
	auto *structured = static_cast<const uint32_t *>(device.map_host_buffer(*state.structured_result, MEMORY_ACCESS_READ_BIT));

	for (size_t i = 0; i < MaxNumRandomPaths; i++)
	{
		if (state.simulated[MaxBlocksPerTriage * i] != UINT32_MAX && structured[MaxBlocksPerTriage * i] == 0)
		{
			LOGE("The buffer is not written for block %zu.\n", i);
			return false;
		}
	}

	const auto decode_feedback = [&](uint32_t v) -> std::string
	{
		if (v == 0)
			return "exit";

		if ((v >> 30) == 2)
			return "phi incoming " + std::to_string(v & 0x7fff);

		if ((v >> 30) == 1)
		{
			uint32_t cond_index = (v >> 15) & 0x7fff;
			return "exec " + std::to_string(v & 0x7fff) + ", cond idx " +
			       std::to_string(cond_index) + " {" + std::to_string(state.conditions[cond_index]) + "}";
		}

		throw std::logic_error("Unexpected feedback encoding.");
	};

	size_t words = state.structured_result->get_create_info().size / sizeof(uint32_t);
	for (size_t i = 0; i < words; i++)
	{
		if (i % MaxBlocksPerTriage == 0 && state.simulated[i] == UINT32_MAX)
		{
			// We never dispatched this. Skip ahead.
			i += MaxBlocksPerTriage - 1;
			continue;
		}

		if (state.simulated[i] != structured[i])
		{
			LOGE("Fuzzing failed at word %zu, expected %u, got %u.\n", i, state.simulated[i], structured[i]);

			uint32_t fail_block = i / MaxBlocksPerTriage;
			uint32_t start_index = fail_block * MaxBlocksPerTriage;
			uint32_t num_interesting_blocks = i - start_index + 1;

			num_interesting_blocks += 4; // Peek into the future a bit too.
			num_interesting_blocks = std::min<uint32_t>(num_interesting_blocks, state.conditions.size());

			for (uint32_t j = 0; j < num_interesting_blocks; j++)
				LOGI("Condition[%u] = %u\n", j, state.conditions[j]);

			for (uint32_t j = 0; j < num_interesting_blocks; j++)
			{
				auto ours = decode_feedback(structured[start_index + j]);
				auto sim = decode_feedback(state.simulated[start_index + j]);
#ifdef TEST_UNSTRUCTURED
				auto ref = decode_feedback(unstructured[start_index + j]);
				LOGI("Feedback[%u] = ref [%s] | ours [%s] | sim [%s]\n", j, ref.c_str(), ours.c_str(), sim.c_str());
#else
				LOGI("Feedback[%u] = ours [%s] | sim [%s]\n", j, ours.c_str(), sim.c_str());
#endif
			}

			return false;
		}
	}

	return true;
}

static std::atomic_uint fuzz_count;

static FuzzState queue_fuzz(
	std::mt19937 &rnd, Device &device,
	const Vector<uint32_t> &reference, const Vector<uint32_t> &candidate,
	Vector<FuzzBlock> &&nodes)
{
	Vector<uint32_t> conditions;
	conditions.reserve(MaxBlocksPerTriage * MaxNumRandomPaths);
	for (uint32_t i = 0; i < MaxBlocksPerTriage * MaxNumRandomPaths; i++)
	{
		// Want 0 to appear with a decent chance, but keep the possibility of larger values for switch block testing.
		uint32_t falloff_dist = rnd() % 16;
		falloff_dist *= falloff_dist;
		falloff_dist *= falloff_dist;
		falloff_dist /= 7 * 7 * 7 * 7;
		conditions.push_back(falloff_dist);
	}

	BufferCreateInfo bufinfo = {};
	bufinfo.size = conditions.size() * sizeof(conditions.front());
	bufinfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
	bufinfo.domain = BufferDomain::Device;
	auto condition_buffer = device.create_buffer(bufinfo, conditions.data());

	bufinfo.size = MaxBlocksPerTriage * MaxNumRandomPaths * sizeof(uint32_t);
	bufinfo.domain = BufferDomain::CachedHost;
	bufinfo.misc = BUFFER_MISC_ZERO_INITIALIZE_BIT;
#ifdef TEST_UNSTRUCTURED
	auto feedback_buffer_unstructured = device.create_buffer(bufinfo);
#endif
	auto feedback_buffer_structured = device.create_buffer(bufinfo);

	auto cmd = device.request_command_buffer();

#ifdef TEST_UNSTRUCTURED
	auto *reference_program = device.request_program(reference.data(), reference.size() * sizeof(reference.front()));
#endif
	auto *candidate_program = device.request_program(candidate.data(), candidate.size() * sizeof(candidate.front()));

	FuzzState result;
	result.conditions = std::move(conditions);
	result.nodes = std::move(nodes);
	result.simulated = simulate_feedback_buffer(result.nodes, result.conditions);

	// Isolate the dispatches so that RADV_DEBUG=hang can narrow things down if need be.
	for (uint32_t i = 0; i < MaxNumRandomPaths; i++)
	{
		// This dispatch will likely timeout the GPU, just skip it.
		if (result.simulated[MaxBlocksPerTriage * i] == UINT32_MAX)
			continue;

#ifdef TEST_UNSTRUCTURED
		cmd->set_program(reference_program);
		cmd->set_storage_buffer(0, 0, *condition_buffer, MaxBlocksPerTriage * i * sizeof(uint32_t), MaxBlocksPerTriage * sizeof(uint32_t));
		cmd->set_storage_buffer(0, 1, *feedback_buffer_unstructured, MaxBlocksPerTriage * i * sizeof(uint32_t), MaxBlocksPerTriage * sizeof(uint32_t));
		cmd->dispatch(1, 1, 1);
#endif

		cmd->set_program(candidate_program);
		cmd->set_storage_buffer(0, 0, *condition_buffer, MaxBlocksPerTriage * i * sizeof(uint32_t), MaxBlocksPerTriage * sizeof(uint32_t));
		cmd->set_storage_buffer(0, 1, *feedback_buffer_structured, MaxBlocksPerTriage * i * sizeof(uint32_t), MaxBlocksPerTriage * sizeof(uint32_t));
		cmd->dispatch(1, 1, 1);
	}

	cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
	             VK_PIPELINE_STAGE_HOST_BIT, VK_ACCESS_HOST_READ_BIT);

	device.submit(cmd, &result.fence);
	result.structured_result = std::move(feedback_buffer_structured);
#ifdef TEST_UNSTRUCTURED
	result.unstructured_result = std::move(feedback_buffer_unstructured);
#endif

	if (fuzz_count.fetch_add(1, std::memory_order_relaxed) % 16 == 0)
		device.next_frame_context();

	return result;
}

static void format_line(char *buffer, size_t size, const FuzzBlock &block)
{
	switch (block.terminator)
	{
	case Term::Branch:
		if (block.from == UINT32_MAX)
			snprintf(buffer, size, "b entry %u", block.to[0]);
		else
			snprintf(buffer, size, "b %u %u", block.from, block.to[0]);
		break;

	case Term::Condition:
		if (block.from == UINT32_MAX)
			snprintf(buffer, size, "c entry %u %u", block.to[0], block.to[1]);
		else
			snprintf(buffer, size, "c %u %u %u", block.from, block.to[0], block.to[1]);
		break;

	case Term::Switch:
	{
		auto written = snprintf(buffer, size, "switch %u", block.from);
		buffer += written;
		size -= written;

		for (auto &to : block.to)
		{
			written = snprintf(buffer, size, " %u", to);
			buffer += written;
			size -= written;
		}
		break;
	}

	default:
		throw std::logic_error("Unknown terminator");
	}
}

static void dump_file(const char *path, const Vector<FuzzBlock> &nodes)
{
	FILE *f = fopen(path, "w");
	if (f)
	{
		char line[128];
		for (auto &node : nodes)
		{
			for (uint32_t i = 0; i < node.phi_inputs; i++)
				fprintf(f, "phi %u\n", node.from);
			format_line(line, sizeof(line), node);
			fprintf(f, "%s\n", line);
		}
		fclose(f);
	}
	else
	{
		LOGE("Failed to write file to: %s\n", path);
	}
}

static std::once_flag once;

static void dump_file_once(const char *path, const Vector<FuzzBlock> &lines)
{
	std::call_once(once, [&]()
	{
		dump_file(path, lines);
		std::terminate();
	});
}

static FuzzBlock make_branch(uint32_t from, uint32_t to, uint32_t phi_inputs = 0)
{
	FuzzBlock block = {};
	block.terminator = Term::Branch;
	block.from = from;
	block.to[0] = to;
	block.phi_inputs = phi_inputs;
	return block;
}

static FuzzBlock make_condition(uint32_t from, uint32_t true_block, uint32_t false_block, uint32_t phi_inputs = 0)
{
	FuzzBlock block = {};
	block.terminator = Term::Condition;
	block.from = from;
	block.to[0] = true_block;
	block.to[1] = false_block;
	block.phi_inputs = phi_inputs;
	return block;
}

static FuzzBlock make_switch(uint32_t from, const uint32_t (&blocks)[FuzzBlock::MaxSuccs], uint32_t phi_inputs = 0)
{
	FuzzBlock block = {};
	block.terminator = Term::Switch;
	block.from = from;
	memcpy(block.to, blocks, sizeof(block.to));
	block.phi_inputs = phi_inputs;
	return block;
}

static Vector<FuzzBlock> generate_random_cfg(std::mt19937 &rnd, uint32_t complexity)
{
	complexity = std::max<uint32_t>(complexity, 4);
	Vector<FuzzBlock> cfg;
	Vector<bool> is_used(complexity);

	// Test a single loop. For reducibility analysis, no forward branches from before header may land in the region.
	// If a block is inside the range, it may branch back to header.
	// To guarantee forward progress, any backwards branch can only happen when condition == 1.
	// That way, if the shader executes forever, robustness kicks in and it will read condition == 0,
	// forcing a termination.
	struct LoopRegion
	{
		uint32_t start_index;
		uint32_t last_index;
	};
	Vector<LoopRegion> loop_regions;

	// Either the loop header or back-edge will force an exit, otherwise we risk a true infinite loop.
	bool conditional_loop_exit = rnd() % 2 == 0;

	{
		// Subdivide until there is nothing more to subdivide.
		std::uniform_int_distribution<uint32_t> dist(0, complexity - 2);
		bool keep_going;

		do
		{
			// Guarantee that there is at least one block that can serve as a loop exit.
			uint32_t a = dist(rnd);
			uint32_t b = dist(rnd);
			uint32_t start_index = std::min<uint32_t>(a, b);
			uint32_t last_index = std::max<uint32_t>(a, b);
			loop_regions.push_back({ start_index, last_index });

			// Nesting more than 4 times is not expected to find any new issues.
			keep_going = last_index - start_index > 2 && loop_regions.size() < 4;
			if (keep_going)
				dist = std::uniform_int_distribution<uint32_t>(start_index + 1, last_index - 1);
		} while (keep_going);
	}

	const auto get_next_loop_region = [&](uint32_t self_index) -> const LoopRegion *
	{
		if (self_index == UINT32_MAX)
			return &loop_regions.front();

		for (auto &region : loop_regions)
			if (self_index < region.start_index)
				return &region;

		return nullptr;
	};

	const auto get_critical_loop_region = [&](uint32_t self_index) -> const LoopRegion *
	{
		for (auto &region : loop_regions)
			if (self_index == region.start_index || self_index == region.last_index)
				return &region;

		return nullptr;
	};

	std::uniform_int_distribution<uint32_t> in_loop_dist;
	std::uniform_int_distribution<uint32_t> exit_dist;

	const auto update_next_loop_distributions = [&](const LoopRegion &region)
	{
		in_loop_dist = std::uniform_int_distribution<uint32_t>(region.start_index, region.last_index);
		exit_dist = std::uniform_int_distribution<uint32_t>(region.last_index + 1, complexity - 1);
	};

	update_next_loop_distributions(loop_regions.front());

	const auto ensure_reducibility = [&](uint32_t self_index, uint32_t &target)
	{
		auto *next_region = get_next_loop_region(self_index);
		// Make sure we keep reducibility. Never branch into a loop region, except at the header.
		if (next_region && target > next_region->start_index && target <= next_region->last_index)
		{
			std::uniform_int_distribution<uint32_t> pre_loop_dist(self_index + 1, next_region->start_index);
			std::uniform_int_distribution<uint32_t> post_loop_dist(next_region->last_index + 1, complexity - 1);
			target = rnd() % 2 == 0 ? post_loop_dist(rnd) : pre_loop_dist(rnd);
		}
	};

	const auto pick_random_loop_header_before = [&](uint32_t index)
	{
		uint32_t num_regions = 0;
		for (auto &region : loop_regions)
			if (region.start_index < index && index <= region.last_index)
				num_regions++;

		assert(num_regions > 0);
		std::uniform_int_distribution<uint32_t> dist(0, num_regions - 1);
		return loop_regions[dist(rnd)].start_index;
	};

	if (rnd() % 2)
	{
		std::uniform_int_distribution<uint32_t> dist(1, complexity - 1);
		uint32_t target_b = dist(rnd);
		ensure_reducibility(UINT32_MAX, target_b);
		cfg.push_back(make_condition(UINT32_MAX, 0, target_b));

		is_used[0] = true;
		is_used[target_b] = true;
	}
	else
	{
		is_used[0] = true;
		cfg.push_back(make_branch(UINT32_MAX, 0));
	}

	for (uint32_t i = 0; i < complexity - 1; i++)
	{
		std::uniform_int_distribution<uint32_t> forward_dist(i + 1, complexity - 1);

		uint32_t num_phi_inputs = 0;

		for (uint32_t j = 2; j <= 8; j *= 2)
		{
			if (rnd() % j == 0)
				num_phi_inputs++;
			else
				break;
		}

		// At least one of header or continue block must exit the loop in finite time.
		// Both is also valid (exposed some PHI bugs).
		auto *critical_region = get_critical_loop_region(i);
		if (critical_region)
			update_next_loop_distributions(*critical_region);

		if (critical_region)
		{
			if (i == critical_region->start_index && !conditional_loop_exit)
			{
				uint32_t in_loop_index = critical_region->start_index + 1;
				uint32_t exit_index = critical_region->last_index + 1;

				if (is_used[in_loop_index])
					in_loop_index = in_loop_dist(rnd);
				if (is_used[exit_index])
					exit_index = exit_dist(rnd);

				cfg.push_back(make_condition(i, in_loop_index, exit_index, num_phi_inputs));
				is_used[in_loop_index] = true;
				is_used[exit_index] = true;

				continue;
			}
			else if (i == critical_region->last_index && (conditional_loop_exit || rnd() % 2))
			{
				uint32_t exit_index = critical_region->last_index + 1;
				if (is_used[exit_index])
					exit_index = exit_dist(rnd);

				cfg.push_back(make_condition(i, critical_region->start_index, exit_index, num_phi_inputs));
				is_used[critical_region->start_index] = true;
				is_used[exit_index] = true;

				continue;
			}
		}
		else
		{
			// Randomly do early-return.
			if (is_used[i + 1] && rnd() % 16 == 0)
				continue;
		}

		auto &loop_region = loop_regions.front();

		if (rnd() % 64 == 0)
		{
			// Randomly throw in some switch statements.
			uint32_t to[FuzzBlock::MaxSuccs];
			for (uint32_t j = 0; j < FuzzBlock::MaxSuccs; j++)
			{
				uint32_t target = j || is_used[i + 1] ? forward_dist(rnd) : i + 1;
				ensure_reducibility(i, target);
				to[j] = target;
				is_used[target] = true;
			}
			cfg.push_back(make_switch(i, to, num_phi_inputs));
		}
		else if (rnd() % 2)
		{
			// If we're inside a loop, randomly branch back to header. We randomly pick how strong the continue is.
			uint32_t target_a;
			if (i > loop_region.start_index && i < loop_region.last_index && rnd() % 16 == 0)
				target_a = pick_random_loop_header_before(i);
			else
				target_a = forward_dist(rnd);

			// One of the targets must have forward progress.
			uint32_t target_b = is_used[i + 1] ? forward_dist(rnd) : i + 1;

			ensure_reducibility(i, target_a);
			ensure_reducibility(i, target_b);

			cfg.push_back(make_condition(i, target_a, target_b, num_phi_inputs));

			is_used[target_a] = true;
			is_used[target_b] = true;
		}
		else
		{
			if (i > loop_region.start_index && i < loop_region.last_index && is_used[i + 1] && rnd() % 16 == 0)
			{
				// It's safe to do an unconditional continue since the next block is reachable by other means.
				cfg.push_back(make_branch(i, pick_random_loop_header_before(i), num_phi_inputs));
			}
			else
			{
				uint32_t target = is_used[i + 1] ? forward_dist(rnd) : i + 1;
				ensure_reducibility(i, target);
				cfg.push_back(make_branch(i, target, num_phi_inputs));
				is_used[target] = true;
			}
		}
	}

	assert(std::find(is_used.begin(), is_used.end(), false) == is_used.end());

	return cfg;
}

static void run_fuzz(Device &device, uint32_t seed, uint32_t complexity, bool dump_reference)
{
	std::mt19937 rnd(seed);

	auto nodes = generate_random_cfg(rnd, complexity);

	if (dump_reference)
	{
		char path[256];
		snprintf(path, sizeof(path), "/tmp/reference.%u.st", seed);
		dump_file(path, nodes);
	}

	const auto emit_lines = [&](Emitter &emitter)
	{
		char line_buffer[64];
		for (auto &node : nodes)
		{
			for (uint32_t i = 0; i < node.phi_inputs; i++)
			{
				snprintf(line_buffer, sizeof(line_buffer), "phi %u", node.from);
				emitter.parse_line(line_buffer);
			}

			format_line(line_buffer, sizeof(line_buffer), node);
			emitter.parse_line(line_buffer);
		}
	};

	Vector<uint32_t> unstructured, structured;

#ifdef TEST_UNSTRUCTURED
	Emitter emitter_unstructured;
	emit_lines(emitter_unstructured);
	// The unstructured code doesn't do much.
	if (!emitter_unstructured.finalize(Emitter::Style::Unstructured, unstructured, false))
	{
		LOGE("Failed to convert unstructured code!\n");
		dump_file_once("/tmp/failure.st", nodes);
	}
#endif

	Emitter emitter_structured;
	emit_lines(emitter_structured);
	if (!emitter_structured.finalize(Emitter::Style::Modern, structured, true))
	{
		LOGE("Failed to convert structured code!\n");
		dump_file_once("/tmp/failure.st", nodes);
	}

	FuzzState state = queue_fuzz(rnd, device, unstructured, structured, std::move(nodes));

	auto task = device.get_system_handles().thread_group->create_task(
		[&device, seed, state = std::make_unique<FuzzState>(std::move(state))]() mutable
		{
			if (!validate_fuzzing_result(device, *state))
			{
				LOGE("Failed to validate fuzzing result for seed %u.\n", seed);
				dump_file_once("/tmp/failure.st", state->nodes);
			}
		});
	task->set_task_class(TaskClass::Background);
}

static void run_fuzzing_rounds(Device &device, uint32_t iterations, uint32_t threads, uint32_t seed,
                               uint32_t complexity, uint32_t completed, bool dump_reference)
{
	auto *tg = device.get_system_handles().thread_group;
	std::queue<TaskGroupHandle> tasks;
	uint32_t iteration = 0;

	for (;;)
	{
		while (tasks.size() < threads && iteration < iterations)
		{
			auto task = tg->create_task([&device, seed = seed + iteration, complexity, dump_reference]()
			{
				run_fuzz(device, seed, complexity, dump_reference);
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
	bool dump_reference = false;

	cbs.add("--help", [&](Util::CLIParser &parser) { parser.end(); });
	cbs.add("--complexity", [&](Util::CLIParser &parser) { complexity = parser.next_uint(); });
	cbs.add("--iterations", [&](Util::CLIParser &parser) { iterations = parser.next_uint(); });
	cbs.add("--threads", [&](Util::CLIParser &parser) { threads = parser.next_uint(); });
	cbs.add("--seed", [&](Util::CLIParser &parser) { seed = parser.next_uint(); });
	cbs.add("--dump-reference", [&](Util::CLIParser &) { dump_reference = true; });

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

	ThreadGroup group;
	group.start(threads, threads, {});

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
		device.init_frame_contexts(8);

		uint32_t to_run = std::min<uint32_t>(iterations - iteration, 4096);
		run_fuzzing_rounds(device, to_run, threads, seed + iteration, complexity, iteration, dump_reference);
		iteration += to_run;
	}
}