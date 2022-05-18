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

#pragma once

#include <vector>
#include <unordered_set>
#include <unordered_map>
#include <set>
#include <string>
#include <sstream>
#include <functional>
#include <stdlib.h>
#include <stdint.h>
#include <stdio.h>
#include <stddef.h>

namespace dxil_spv
{
void *allocate_in_thread(std::size_t size);
void free_in_thread(void *ptr);

template <typename T>
class ThreadLocalAllocator
{
public:
	using value_type = T;

	ThreadLocalAllocator() noexcept = default;
	template <typename U>
	ThreadLocalAllocator(const ThreadLocalAllocator<U> &) noexcept {}

	value_type *allocate(size_t n)
	{
		return static_cast<value_type *>(allocate_in_thread(sizeof(T) * n));
	}

	void deallocate(value_type *p, std::size_t)
	{
		free_in_thread(p);
	}

	using is_always_equal = std::true_type;
};

template <typename A, typename B>
static inline bool operator==(const ThreadLocalAllocator<A> &, const ThreadLocalAllocator<B> &)
{
	return true;
}

template <typename A, typename B>
static inline bool operator!=(const ThreadLocalAllocator<A> &, const ThreadLocalAllocator<B> &)
{
	return false;
}

template <typename T>
using Vector = std::vector<T, ThreadLocalAllocator<T>>;

template <typename T, typename Hash = std::hash<T>>
using UnorderedSet = std::unordered_set<T, Hash, std::equal_to<T>, ThreadLocalAllocator<T>>;

template <typename T>
using Set = std::set<T, std::less<T>, ThreadLocalAllocator<T>>;

using String = std::basic_string<char, std::char_traits<char>, ThreadLocalAllocator<char>>;
using StringStream = std::basic_ostringstream<char, std::char_traits<char>, ThreadLocalAllocator<char>>;

template <typename Key, typename Value, typename Hash = std::hash<Key>>
using UnorderedMap = std::unordered_map<Key, Value, Hash, std::equal_to<Key>, ThreadLocalAllocator<std::pair<const Key, Value>>>;

void begin_thread_allocator_context();
void end_thread_allocator_context();
void reset_thread_allocator_context();

template <typename T>
static inline String to_string(T&& t)
{
	auto v = std::to_string(std::forward<T>(t));
	String ret(v.begin(), v.end());
	return ret;
}
}

namespace std
{
template <>
struct hash<dxil_spv::String>
{
	size_t operator()(const dxil_spv::String &str) const
	{
		uint64_t h = 0xcbf29ce484222325ull;
		for (auto c : str)
			h = (h * 0x100000001b3ull) ^ uint8_t(c);
		return size_t(h);
	}
};
}

#define DXIL_SPV_OVERRIDE_NEW_DELETE \
	void *operator new(size_t size) { return ::dxil_spv::allocate_in_thread(size); } \
	void operator delete(void *ptr) { ::dxil_spv::free_in_thread(ptr); } \
	void *operator new[](size_t size) { return ::dxil_spv::allocate_in_thread(size); } \
	void operator delete[](void *ptr) { ::dxil_spv::free_in_thread(ptr); }
