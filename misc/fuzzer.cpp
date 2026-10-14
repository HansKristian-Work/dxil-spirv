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
#include <sys/wait.h>
#include <sys/syscall.h>
#include <fcntl.h>
#include <random>
#include <sys/epoll.h>
#include <spawn.h>

namespace Globals
{
static int epoll_fd;
static char *argv_c_new[6];
static char *argv_c_old[6];
}

static void print_help()
{
	LOGE("Usage: structurize-fuzzer [--help] [--complexity N] [--iterations N] [--structurizer PATH] [--threads THR]\n");
}

static void close_and_reset(int &fd)
{
	if (fd >= 0)
	{
		// Safety.
		epoll_ctl(Globals::epoll_fd, EPOLL_CTL_DEL, fd, nullptr);

		close(fd);
		fd = -1;
	}
}

struct ChildProcess
{
	pid_t pid = -1;
	int pidfd = -1;
	int exit_code = 0;

	int stdin_pipefds[2] = { -1, -1 };
	int stdout_pipefds[2] = { -1, -1 };

	std::vector<uint8_t> out_data;
	std::vector<uint8_t> in_data;
	size_t in_data_offset = 0;

	~ChildProcess();
	ChildProcess() = delete;
	void operator=(const ChildProcess &) = delete;
	ChildProcess(const ChildProcess &) = delete;

	ChildProcess(char **argv, const void *stdin_data, size_t size);

	bool find_fd(int fd) const;

	bool drain();
	void process(int fd);
	bool complete() const;
	void drain_stdout();
	void pump_stdin();
};

bool ChildProcess::complete() const
{
	return pid < 0;
}

void ChildProcess::drain_stdout()
{
	uint8_t tmp[1024];
	ssize_t ret;
	while ((ret = ::read(stdout_pipefds[0], tmp, sizeof(tmp))) > 0)
		out_data.insert(out_data.end(), tmp, tmp + ret);

	if (ret == 0)
		close_and_reset(stdout_pipefds[0]);
}

void ChildProcess::pump_stdin()
{
	ssize_t ret = ::write(stdin_pipefds[1], in_data.data() + in_data_offset, in_data.size() - in_data_offset);
	if (ret > 0)
		in_data_offset += ret;

	if (ret <= 0 || in_data_offset == in_data.size())
		close_and_reset(stdin_pipefds[1]);
}

void ChildProcess::process(int fd)
{
	if (fd == pidfd)
	{
		siginfo_t siginfo = {};
		if (waitid(P_PIDFD, pidfd, &siginfo, WEXITED) < 0)
			throw std::runtime_error("waitpid failed");

		pid = -1;
		if (siginfo.si_code == CLD_EXITED)
			exit_code = siginfo.si_status;
		else
			exit_code = -1;

		drain_stdout();
		close_and_reset(pidfd);
		close_and_reset(stdout_pipefds[0]);
		close_and_reset(stdin_pipefds[1]);
	}
	else if (fd == stdout_pipefds[0])
	{
		drain_stdout();
	}
	else if (fd == stdin_pipefds[1])
	{
		pump_stdin();
	}
	else
	{
		throw std::logic_error("Trying to process unrelated fd.");
	}
}

bool ChildProcess::find_fd(int fd) const
{
	return fd == pidfd || fd == stdin_pipefds[1] || fd == stdout_pipefds[0];
}

ChildProcess::ChildProcess(char **argv, const void *stdin_data, size_t size)
{
	if (pipe(stdin_pipefds) < 0)
		throw std::runtime_error("pipe failed");
	if (pipe(stdout_pipefds) < 0)
		throw std::runtime_error("pipe failed");

#if 1
	posix_spawn_file_actions_t actions;
	posix_spawnattr_t attr;
	posix_spawn_file_actions_init(&actions);
	posix_spawnattr_init(&attr);

	sigset_t sigset;
	sigemptyset(&sigset);
	sigaddset(&sigset, SIGPIPE);

	posix_spawnattr_setsigdefault(&attr, &sigset);
	posix_spawn_file_actions_addclose(&actions, stdin_pipefds[1]);
	posix_spawn_file_actions_addclose(&actions, stdout_pipefds[0]);
	if (stdin_pipefds[0] != STDIN_FILENO)
		posix_spawn_file_actions_adddup2(&actions, stdin_pipefds[0], STDIN_FILENO);
	if (stdout_pipefds[1] != STDOUT_FILENO)
		posix_spawn_file_actions_adddup2(&actions, stdout_pipefds[1], STDOUT_FILENO);

	if (posix_spawn(&pid, argv[0], &actions, &attr, argv, environ) != 0)
		throw std::runtime_error("posix_spawn failed");

	pidfd = int(syscall(SYS_pidfd_open, pid, 0));
	if (pidfd < 0)
		throw std::runtime_error("pidfd_open failed");

	close_and_reset(stdin_pipefds[0]);
	close_and_reset(stdout_pipefds[1]);

	if (fcntl(stdin_pipefds[1], F_SETFL, O_NONBLOCK) < 0)
		throw std::runtime_error("fcntl failed");
	if (fcntl(stdout_pipefds[0], F_SETFL, O_NONBLOCK) < 0)
		throw std::runtime_error("fcntl failed");

	in_data.insert(in_data.end(), static_cast<const uint8_t *>(stdin_data), static_cast<const uint8_t *>(stdin_data) + size);
#else
	pid = fork();
	if (pid > 0)
	{
		pidfd = int(syscall(SYS_pidfd_open, pid, 0));
		if (pidfd < 0)
			throw std::runtime_error("pidfd_open failed");

		if (fcntl(pidfd, F_SETFD, FD_CLOEXEC) < 0)
			throw std::runtime_error("fcntl failed");

		close_and_reset(stdin_pipefds[0]);
		close_and_reset(stdout_pipefds[1]);

		if (fcntl(stdin_pipefds[1], F_SETFL, O_NONBLOCK) < 0)
			throw std::runtime_error("fcntl failed");
		if (fcntl(stdout_pipefds[0], F_SETFL, O_NONBLOCK) < 0)
			throw std::runtime_error("fcntl failed");

		in_data.insert(in_data.end(), static_cast<const uint8_t *>(stdin_data), static_cast<const uint8_t *>(stdin_data) + size);
	}
	else if (pid == 0)
	{
		signal(SIGPIPE, SIG_DFL);
		close_and_reset(stdin_pipefds[1]);
		close_and_reset(stdout_pipefds[0]);

		if (stdin_pipefds[0] != STDIN_FILENO)
			dup2(stdin_pipefds[0], STDIN_FILENO);
		if (stdout_pipefds[1] != STDOUT_FILENO)
			dup2(stdout_pipefds[1], STDOUT_FILENO);

		if (execvp(argv[0], argv) < 0)
			exit(42);
	}
	else
	{
		throw std::runtime_error("fork failed");
	}
#endif
}

bool ChildProcess::drain()
{
	if (pid >= 0)
	{
		int status;

		if (waitpid(pid, &status, 0) < 0)
		{
			LOGE("waitpid failed.");
			return false;
		}

		if (!WIFEXITED(status) || WEXITSTATUS(status) != 0)
			return false;
	}
	pid = -1;

	close_and_reset(pidfd);

	for (auto &fd : stdin_pipefds)
		close_and_reset(fd);
	for (auto &fd : stdout_pipefds)
		close_and_reset(fd);

	return true;
}

ChildProcess::~ChildProcess()
{
	if (!drain())
		std::terminate();
}

struct FuzzState
{
	int sync_fd = -1;
	Vulkan::BufferHandle unstructured_result;
	Vulkan::BufferHandle structured_result;
};

struct FuzzGroup
{
	ChildProcess unstructured;
	ChildProcess structured;
	FuzzState result;

	FuzzGroup(int epoll_fd, char **argv_unstructured, char **argv_structured, const void *stdin_data, size_t size);

	bool find_fd(int fd) const;
	bool process(Vulkan::Device &device, int fd);
	bool complete() const;
	void drain();
};

static void add_fd_to_epoll(int epoll_fd, int fd, int events = EPOLLIN)
{
	epoll_event e = {};
	e.events = events;
	e.data.fd = fd;
	if (epoll_ctl(epoll_fd, EPOLL_CTL_ADD, fd, &e) < 0)
		throw std::runtime_error("epoll_ctl failed");
}

bool FuzzGroup::find_fd(int fd) const
{
	return fd == result.sync_fd || unstructured.find_fd(fd) || structured.find_fd(fd);
}

static constexpr uint32_t MaxBlocks = 1024;
static constexpr uint32_t MaxFeedback = 4096;

static bool validate_fuzzing_result(Vulkan::Device &device, FuzzState &state)
{
	auto *unstructured = static_cast<const uint32_t *>(device.map_host_buffer(*state.unstructured_result, Vulkan::MEMORY_ACCESS_READ_BIT));
	auto *structured = static_cast<const uint32_t *>(device.map_host_buffer(*state.structured_result, Vulkan::MEMORY_ACCESS_READ_BIT));

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

bool FuzzGroup::process(Vulkan::Device &device, int fd)
{
	if (result.sync_fd == fd)
	{
		if (!validate_fuzzing_result(device, result))
		{
			LOGE("Fuzzing failed!\n");
			return false;
		}

		close_and_reset(result.sync_fd);
		return true;
	}

	if (unstructured.find_fd(fd))
	{
		unstructured.process(fd);
		return true;
	}

	if (structured.find_fd(fd))
	{
		structured.process(fd);
		return true;
	}

	throw std::logic_error("Should not reach here.");
}

bool FuzzGroup::complete() const
{
	if (result.structured_result)
		return result.sync_fd < 0;

	return unstructured.complete() && structured.complete();
}

void FuzzGroup::drain()
{
	unstructured.drain();
	structured.drain();

	close_and_reset(result.sync_fd);
	result.structured_result.reset();
	result.unstructured_result.reset();
}

FuzzGroup::FuzzGroup(int epoll_fd, char **argv_unstructured, char **argv_structured, const void *stdin_data, size_t size)
	: unstructured(argv_unstructured, stdin_data, size), structured(argv_structured, stdin_data, size)
{
	add_fd_to_epoll(epoll_fd, unstructured.pidfd);
	add_fd_to_epoll(epoll_fd, unstructured.stdin_pipefds[1], EPOLLOUT);
	add_fd_to_epoll(epoll_fd, unstructured.stdout_pipefds[0]);

	add_fd_to_epoll(epoll_fd, structured.pidfd);
	add_fd_to_epoll(epoll_fd, structured.stdin_pipefds[1], EPOLLOUT);
	add_fd_to_epoll(epoll_fd, structured.stdout_pipefds[0]);
}

static FuzzState queue_fuzz(
	std::mt19937 &rnd, Vulkan::Device &device,
	const std::vector<uint8_t> &reference, const std::vector<uint8_t> &candidate)
{
	std::vector<uint32_t> conditions;
	conditions.reserve(MaxBlocks * MaxFeedback);
	for (uint32_t i = 0; i < MaxBlocks * MaxFeedback; i++)
		conditions.push_back(rnd() % 2);

	Vulkan::BufferCreateInfo bufinfo = {};
	bufinfo.size = conditions.size() * sizeof(conditions.front());
	bufinfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
	bufinfo.domain = Vulkan::BufferDomain::Device;
	auto condition_buffer = device.create_buffer(bufinfo, conditions.data());

	bufinfo.size = MaxBlocks * MaxFeedback * sizeof(uint32_t);
	bufinfo.domain = Vulkan::BufferDomain::CachedHost;
	bufinfo.misc = Vulkan::BUFFER_MISC_ZERO_INITIALIZE_BIT;
	auto feedback_buffer_unstructured = device.create_buffer(bufinfo);
	auto feedback_buffer_structured = device.create_buffer(bufinfo);

	auto cmd = device.request_command_buffer();

	auto *reference_program = device.request_program(reinterpret_cast<const uint32_t *>(reference.data()), reference.size());
	auto *candidate_program = device.request_program(reinterpret_cast<const uint32_t *>(candidate.data()), candidate.size());

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

	auto sig = device.request_semaphore_external(VK_SEMAPHORE_TYPE_BINARY, VK_EXTERNAL_SEMAPHORE_HANDLE_TYPE_SYNC_FD_BIT);
	device.submit(cmd);
	device.submit_empty(Vulkan::CommandBuffer::Type::Generic, nullptr, sig.get());
	auto handle = sig->export_to_handle();

	FuzzState result;
	result.sync_fd = handle.handle;
	result.structured_result = std::move(feedback_buffer_structured);
	result.unstructured_result = std::move(feedback_buffer_unstructured);
	device.next_frame_context();
	return result;
}

static void dump_file(const char *path, const void *data, size_t size)
{
	FILE *f = fopen(path, "wb");
	if (f)
	{
		if (fwrite(data, 1, size, f) != size)
			LOGE("Failed to write file completely to: %s\n", path);
		fclose(f);
	}
	else
	{
		LOGE("Failed to write file to: %s\n", path);
	}
}

static void run_fuzzing_rounds(int epoll_fd, std::mt19937 &rnd, Vulkan::Device &device, uint32_t iterations, uint32_t threads)
{
	std::vector<std::unique_ptr<FuzzGroup>> fuzz_groups;
	fuzz_groups.reserve(threads);
	uint32_t iteration = 0;
	uint32_t completed = 0;

	for (;;)
	{
		while (fuzz_groups.size() < threads && iteration < iterations)
		{
			std::string dummy = "c entry A B\n";
			dummy += "b A C\n";
			dummy += "b B C\n";
			fuzz_groups.emplace_back(new FuzzGroup(
				epoll_fd, Globals::argv_c_old, Globals::argv_c_new,
				dummy.data(), dummy.size()));
			iteration++;
		}

		if (fuzz_groups.empty())
			break;

		// Avoid some issues with FD recycling within the event handler. We may start receiving false events.
		epoll_event events[1];
		int ret = epoll_wait(epoll_fd, events, 1, -1);
		if (ret == -1 && errno == EINTR)
			continue;

		if (ret == 0)
			break;

		for (int i = 0; i < ret; i++)
		{
			auto &e = events[i];
			int fd = e.data.fd;

			//if ((e.events & (EPOLLIN | EPOLLOUT)) == 0)
			//	continue;

			auto itr = std::find_if(fuzz_groups.begin(), fuzz_groups.end(),
				[&](const std::unique_ptr<FuzzGroup> &fuzz_group) { return fuzz_group->find_fd(fd); });

			if (itr == fuzz_groups.end())
				continue;

			auto &group = *itr;

			if (!group->process(device, fd))
			{
				LOGE("Found a failure to execute.\n");
				dump_file("/tmp/failure.st", group->unstructured.in_data.data(), group->unstructured.in_data.size());
				exit(EXIT_FAILURE);
			}

			if (group->complete())
			{
				if (group->result.structured_result)
				{
					// We're totally done now.
					fuzz_groups.erase(itr);
					LOGI("Completed fuzzing round %u\n", completed);
					completed++;
				}
				else
				{
					group->drain();

					if (group->unstructured.exit_code != 0 || group->structured.exit_code != 0)
					{
						if (group->unstructured.exit_code != 0)
							LOGE("Unstructured path failed with code %d.\n", group->unstructured.exit_code);
						if (group->structured.exit_code != 0)
							LOGE("Structured path failed with code %d.\n", group->structured.exit_code);

						dump_file("/tmp/failure.st", group->unstructured.in_data.data(), group->unstructured.in_data.size());
						exit(EXIT_FAILURE);
					}
					group->result = queue_fuzz(rnd, device, group->unstructured.out_data, group->structured.out_data);
					add_fd_to_epoll(epoll_fd, group->result.sync_fd);
				}
			}
		}
	}
}

int main(int argc, char **argv)
{
	Util::CLICallbacks cbs;
	uint32_t complexity = 8;
	uint32_t iterations = 128;
	unsigned threads = std::thread::hardware_concurrency();
	uint32_t seed = 42;
	std::string structurizer_path;

	cbs.add("--help", [&](Util::CLIParser &parser) { parser.end(); });
	cbs.add("--complexity", [&](Util::CLIParser &parser) { complexity = parser.next_uint(); });
	cbs.add("--iterations", [&](Util::CLIParser &parser) { iterations = parser.next_uint(); });
	cbs.add("--threads", [&](Util::CLIParser &parser) { threads = parser.next_uint(); });
	cbs.add("--structurizer", [&](Util::CLIParser &parser) { structurizer_path = parser.next_string(); });
	cbs.add("--seed", [&](Util::CLIParser &parser) { seed = parser.next_uint(); });

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

	if (structurizer_path.empty())
	{
		LOGE("Need structurizer path.\n");
		return EXIT_FAILURE;
	}

	Globals::epoll_fd = epoll_create1(EPOLL_CLOEXEC);
	if (Globals::epoll_fd < 0)
		throw std::runtime_error("epoll_create1 failed");

	std::vector<std::string> argv_exec_new;
	argv_exec_new.emplace_back(structurizer_path);
	argv_exec_new.emplace_back("/dev/stdin");
	argv_exec_new.emplace_back("--output");
	argv_exec_new.emplace_back("/dev/stdout");
	argv_exec_new.emplace_back("--new");

	auto argv_exec_old = argv_exec_new;
	argv_exec_old.back() = "--unstructured";

	for (int i = 0; i < 5; i++)
		Globals::argv_c_new[i] = const_cast<char *>(argv_exec_new[i].c_str());
	for (int i = 0; i < 5; i++)
		Globals::argv_c_old[i] = const_cast<char *>(argv_exec_old[i].c_str());

	if (!Vulkan::Context::init_loader(nullptr))
		return EXIT_FAILURE;
	Vulkan::Context context;

	// Use robustness.
	if (!context.init_instance_and_device(nullptr, 0, nullptr, 0,
	                                      Vulkan::CONTEXT_CREATION_ENABLE_ROBUSTNESS_2_BIT))
		return EXIT_FAILURE;

	// Avoid SIGPIPE killing us when writing to a dead process.
	signal(SIGPIPE, SIG_IGN);

	std::mt19937 rnd(seed);

	// Due to the nature of Granite's hash'n'cache, it has no way to delete obsolete pipelines.
	// Just recreate the logical device periodically. Context owns the actual device, so it should be fine.
	// For similar reasons, we should disable caching in Mesa when running this.
	for (uint32_t iteration = 0; iteration < iterations; )
	{
		Vulkan::Device device;
		device.set_context(context);

		uint32_t to_run = std::min<uint32_t>(iterations - iteration, 64 * 1024);
		run_fuzzing_rounds(Globals::epoll_fd, rnd, device, to_run, (threads + 1) / 2);
		iteration += to_run;
	}
}