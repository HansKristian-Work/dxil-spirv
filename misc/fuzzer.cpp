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

static void print_help()
{
	LOGE("Usage: structurize-fuzzer [--help] [--complexity N] [--iterations N] [--structurizer PATH] [--threads THR]\n");
}

static void close_and_reset(int &fd)
{
	if (fd >= 0)
	{
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
		int status;
		if (waitpid(pid, &status, 0) < 0)
			throw std::runtime_error("waitpid failed");
		pid = -1;

		if (!WIFEXITED(status))
			exit_code = -1;
		else
			exit_code = WEXITSTATUS(status);

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

struct FuzzGroup
{
	ChildProcess unstructured;
	ChildProcess structured;
	FuzzGroup(int epoll_fd, char **argv_unstructured, char **argv_structured, const void *stdin_data, size_t size);

	void process(int fd);
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

void FuzzGroup::process(int fd)
{
	if (unstructured.find_fd(fd))
		return unstructured.process(fd);
	if (structured.find_fd(fd))
		return structured.process(fd);
	throw std::logic_error("Should not reach here.");
}

bool FuzzGroup::complete() const
{
	return unstructured.complete() && structured.complete();
}

void FuzzGroup::drain()
{
	unstructured.drain();
	structured.drain();
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

static void queue_fuzz(std::mt19937 &rnd, Vulkan::Device &device, const std::vector<uint8_t> &reference, const std::vector<uint8_t> &candidate)
{
	std::vector<uint32_t> conditions;
	for (uint32_t i = 0; i < 1024; i++)
		conditions.push_back(rnd() % 2);

	Vulkan::BufferCreateInfo bufinfo = {};
	bufinfo.size = conditions.size() * sizeof(conditions.front());
	bufinfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
	bufinfo.domain = Vulkan::BufferDomain::Device;
	auto condition_buffer = device.create_buffer(bufinfo, conditions.data());

	bufinfo.size = 1024 * 1024;
	bufinfo.domain = Vulkan::BufferDomain::CachedHost;
	bufinfo.misc = Vulkan::BUFFER_MISC_ZERO_INITIALIZE_BIT;
	auto feedback_buffer_unstructured = device.create_buffer(bufinfo);
	auto feedback_buffer_structured = device.create_buffer(bufinfo);

	auto cmd = device.request_command_buffer();

	auto *reference_program = device.request_program(reinterpret_cast<const uint32_t *>(reference.data()), reference.size());
	auto *candidate_program = device.request_program(reinterpret_cast<const uint32_t *>(candidate.data()), candidate.size());

	cmd->set_program(reference_program);
	cmd->set_storage_buffer(0, 0, *condition_buffer);
	cmd->set_storage_buffer(0, 1, *feedback_buffer_unstructured);
	cmd->dispatch(1, 1, 1);

	cmd->set_program(candidate_program);
	cmd->set_storage_buffer(0, 0, *condition_buffer);
	cmd->set_storage_buffer(0, 1, *feedback_buffer_structured);
	cmd->dispatch(1, 1, 1);

	cmd->barrier(VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT, VK_ACCESS_2_SHADER_STORAGE_WRITE_BIT,
	             VK_PIPELINE_STAGE_HOST_BIT, VK_ACCESS_HOST_READ_BIT);

	Vulkan::Fence fence;
	device.submit(cmd, &fence);
	fence->wait();

	auto *unstructured = static_cast<const uint32_t *>(device.map_host_buffer(*feedback_buffer_unstructured, Vulkan::MEMORY_ACCESS_READ_BIT));
	auto *structured = static_cast<const uint32_t *>(device.map_host_buffer(*feedback_buffer_structured, Vulkan::MEMORY_ACCESS_READ_BIT));

	if (unstructured[0] == 0)
		LOGE("Unexpected!\n");

	if (memcmp(unstructured, structured, bufinfo.size) != 0)
		LOGE("Mismatch!\n");

	device.next_frame_context();
}

int main(int argc, char **argv)
{
	Util::CLICallbacks cbs;
	uint32_t complexity = 8;
	uint32_t iterations = 128;
	unsigned threads = std::thread::hardware_concurrency();
	std::string structurizer_path;

	cbs.add("--help", [&](Util::CLIParser &parser) { parser.end(); });
	cbs.add("--complexity", [&](Util::CLIParser &parser) { complexity = parser.next_uint(); });
	cbs.add("--iterations", [&](Util::CLIParser &parser) { iterations = parser.next_uint(); });
	cbs.add("--threads", [&](Util::CLIParser &parser) { threads = parser.next_uint(); });
	cbs.add("--structurizer", [&](Util::CLIParser &parser) { structurizer_path = parser.next_string(); });

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

	int epoll_fd = epoll_create1(EPOLL_CLOEXEC);
	if (epoll_fd < 0)
		throw std::runtime_error("epoll_create1 failed");

	std::vector<std::string> argv_exec_new;
	argv_exec_new.emplace_back(structurizer_path);
	argv_exec_new.emplace_back("/dev/stdin");
	argv_exec_new.emplace_back("--output");
	argv_exec_new.emplace_back("/dev/stdout");
	argv_exec_new.emplace_back("--new");

	auto argv_exec_old = argv_exec_new;
	argv_exec_old.back() = "--unstructured";

	char *argv_c_new[6] = {};
	char *argv_c_old[6] = {};

	for (int i = 0; i < 5; i++)
		argv_c_new[i] = const_cast<char *>(argv_exec_new[i].c_str());
	for (int i = 0; i < 5; i++)
		argv_c_old[i] = const_cast<char *>(argv_exec_old[i].c_str());

	std::vector<std::unique_ptr<FuzzGroup>> fuzz_groups;

	if (!Vulkan::Context::init_loader(nullptr))
		return EXIT_FAILURE;
	Vulkan::Context context;
	if (!context.init_instance_and_device(nullptr, 0, nullptr, 0,
	                                      Vulkan::CONTEXT_CREATION_ENABLE_ROBUSTNESS_2_BIT))
		return EXIT_FAILURE;
	Vulkan::Device device;
	device.set_context(context);

	std::string dummy = "c entry A B\n";
	dummy += "b A C\n";
	dummy += "b B C\n";

	signal(SIGPIPE, SIG_IGN);

	fuzz_groups.emplace_back(new FuzzGroup(epoll_fd, argv_c_old, argv_c_new, dummy.data(), dummy.size()));

	std::mt19937 rnd(42);

	while (!fuzz_groups.empty())
	{
		epoll_event events[64];
		int ret = epoll_wait(epoll_fd, events, 64, -1);
		if (ret == -1 && errno == EINTR)
			continue;

		if (ret == 0)
			break;

		for (int i = 0; i < ret; i++)
		{
			auto &e = events[i];
			int fd = e.data.fd;

			auto itr = std::find_if(fuzz_groups.begin(), fuzz_groups.end(), [&](const std::unique_ptr<FuzzGroup> &fuzz_group)
			{
				return fuzz_group->unstructured.find_fd(fd) || fuzz_group->structured.find_fd(fd);
			});

			if (itr == fuzz_groups.end())
				continue;

			auto &group = *itr;

			group->process(fd);

			if (group->complete())
			{
				group->drain();
				queue_fuzz(rnd, device, group->unstructured.out_data, group->structured.out_data);
				fuzz_groups.erase(itr);
			}
		}
	}
}