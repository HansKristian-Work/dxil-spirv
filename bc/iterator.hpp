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

#include <stddef.h>

namespace LLVMBC
{
// An iterator adaptor which lets us receive reference types instead of pointer types.
template <typename T, typename Iter>
struct IteratorAdaptor
{
	IteratorAdaptor(Iter iter_)
	    : iter(iter_)
	{
	}

	T &operator*()
	{
		return **iter;
	}

	T *operator->()
	{
		return *iter;
	}

	IteratorAdaptor operator++()
	{
		++iter;
		return *this;
	}

	bool operator==(const IteratorAdaptor &other) const
	{
		return iter == other.iter;
	}

	bool operator!=(const IteratorAdaptor &other) const
	{
		return !(*this == other);
	}

	ptrdiff_t operator-(const IteratorAdaptor &other) const
	{
		return iter - other.iter;
	}

	Iter iter;
};
} // namespace LLVMBC
