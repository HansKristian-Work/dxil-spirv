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

#ifdef HAVE_LLVMBC
#include "module.hpp"
#else
#include <llvm/IR/LLVMContext.h>
#include <llvm/IR/Module.h>
#endif

#include <memory>
#include <stddef.h>

namespace dxbc_spv
{
namespace ir
{
class Builder;
}
}

namespace dxil_spv
{
class LLVMBCParser
{
public:
	LLVMBCParser();
	~LLVMBCParser();
	bool parse(const void *data, size_t size);
	bool parseDXBCBinary(const void *data, size_t size);
	bool parseDXBC(dxbc_spv::ir::Builder &builder);
	llvm::Module &get_module();
	const llvm::Module &get_module() const;

private:
	struct Impl;
	std::unique_ptr<Impl> impl;
};
} // namespace dxil_spv
