/* Copyright (c) 2017-2019 Hans-Kristian Arntzen
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

// Reused from Granite.

#pragma once

#include <stdint.h>
#include <stdio.h>

#if defined(_MSC_VER)
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#define LOGE_INNER(...)                                            \
	do                                                             \
	{                                                              \
		fprintf(stderr, "[ERROR]: " __VA_ARGS__);                  \
		fflush(stderr);                                            \
		char buffer[4096];                                         \
		snprintf(buffer, sizeof(buffer), "[ERROR]: " __VA_ARGS__); \
		OutputDebugStringA(buffer);                                \
	} while (false)

#define LOGW_INNER(...)                                           \
	do                                                            \
	{                                                             \
		fprintf(stderr, "[WARN]: " __VA_ARGS__);                  \
		fflush(stderr);                                           \
		char buffer[4096];                                        \
		snprintf(buffer, sizeof(buffer), "[WARN]: " __VA_ARGS__); \
		OutputDebugStringA(buffer);                               \
	} while (false)

#define LOGI_INNER(...)                                           \
	do                                                            \
	{                                                             \
		fprintf(stderr, "[INFO]: " __VA_ARGS__);                  \
		fflush(stderr);                                           \
		char buffer[4096];                                        \
		snprintf(buffer, sizeof(buffer), "[INFO]: " __VA_ARGS__); \
		OutputDebugStringA(buffer);                               \
	} while (false)
#elif defined(ANDROID)
#include <android/log.h>
#define LOGE_INNER(...) __android_log_print(ANDROID_LOG_ERROR, "dxil-spirv", __VA_ARGS__)
#define LOGW_INNER(...) __android_log_print(ANDROID_LOG_WARN, "dxil-spirv", __VA_ARGS__)
#define LOGI_INNER(...) __android_log_print(ANDROID_LOG_INFO, "dxil-spirv", __VA_ARGS__)
#else
#define LOGE_INNER(...)                           \
	do                                            \
	{                                             \
		fprintf(stderr, "[ERROR]: " __VA_ARGS__); \
		fflush(stderr);                           \
	} while (false)

#define LOGW_INNER(...)                          \
	do                                           \
	{                                            \
		fprintf(stderr, "[WARN]: " __VA_ARGS__); \
		fflush(stderr);                          \
	} while (false)

#define LOGI_INNER(...)                          \
	do                                           \
	{                                            \
		fprintf(stderr, "[INFO]: " __VA_ARGS__); \
		fflush(stderr);                          \
	} while (false)
#endif

namespace dxil_spv
{
enum class LogLevel : uint32_t
{
	Debug = 0,
	Warn = 1,
	Error = 2
};
using LoggingCallback = void (*)(void *, LogLevel, const char *);

void set_thread_log_callback(LoggingCallback callback, void *userdata);
LoggingCallback get_thread_log_callback();
void *get_thread_log_callback_userdata();
}

#define LOGI(...) do {                                                                           \
	if (auto *cb = ::dxil_spv::get_thread_log_callback())                                        \
	{                                                                                            \
		char buffer[4096];                                                                       \
		snprintf(buffer, sizeof(buffer), __VA_ARGS__);                                           \
		cb(::dxil_spv::get_thread_log_callback_userdata(), ::dxil_spv::LogLevel::Debug, buffer); \
	}                                                                                            \
	else                                                                                         \
	{                                                                                            \
        LOGI_INNER(__VA_ARGS__);                                                                 \
	}                                                                                            \
} while(0)

#define LOGW(...) do {                                                                           \
	if (auto *cb = ::dxil_spv::get_thread_log_callback())                                        \
	{                                                                                            \
		char buffer[4096];                                                                       \
		snprintf(buffer, sizeof(buffer), __VA_ARGS__);                                           \
		cb(::dxil_spv::get_thread_log_callback_userdata(), ::dxil_spv::LogLevel::Warn, buffer);  \
	}                                                                                            \
	else                                                                                         \
	{                                                                                            \
        LOGW_INNER(__VA_ARGS__);                                                                 \
	}                                                                                            \
} while(0)

#define LOGE(...) do {                                                                           \
	if (auto *cb = ::dxil_spv::get_thread_log_callback())                                        \
	{                                                                                            \
		char buffer[4096];                                                                       \
		snprintf(buffer, sizeof(buffer), __VA_ARGS__);                                           \
		cb(::dxil_spv::get_thread_log_callback_userdata(), ::dxil_spv::LogLevel::Error, buffer); \
	}                                                                                            \
	else                                                                                         \
	{                                                                                            \
        LOGE_INNER(__VA_ARGS__);                                                                 \
	}                                                                                            \
} while(0)


