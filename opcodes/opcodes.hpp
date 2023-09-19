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

#include "thread_local_allocator.hpp"
#include "dxil_converter.hpp"
#include "ir.hpp"

#ifdef HAVE_LLVMBC
#include "cast.hpp"
#include "instruction.hpp"
#include "module.hpp"
#include "value.hpp"
#else
#include <llvm/IR/Instructions.h>
#endif

#include <vector>

namespace dxil_spv
{
enum class RawType { Integer, Float, Count };
enum class RawWidth { B16 = 0, B32, B64, Count };
enum class RawVecSize { V1 = 0, V2, V3, V4, Count };

enum class MagicResource : uint8_t
{
	None,
	AGS
};

struct AgsInstruction
{
	enum { MaxPhases = 4 };
	uint32_t opcode;
	uint32_t phase;
	uint32_t immediate;
};
}
