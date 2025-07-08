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

#include "llvm_bitcode_parser.hpp"

#ifdef HAVE_LLVMBC
#include "context.hpp"
#include "module.hpp"
#else
#include <llvm/IRReader/IRReader.h>
#include <llvm/Support/SourceMgr.h>
#endif

namespace dxil_spv
{
struct LLVMBCParser::Impl
{
	llvm::LLVMContext context;
#ifdef HAVE_LLVMBC
	llvm::Module *module = nullptr;
#else
	std::unique_ptr<llvm::Module> module;
#endif
};

LLVMBCParser::LLVMBCParser()
{
	impl.reset(new Impl);
}

LLVMBCParser::~LLVMBCParser()
{
}

bool LLVMBCParser::parse(const void *data, size_t size)
{
#ifdef HAVE_LLVMBC
	impl->module = llvm::parseIR(impl->context, data, size);
	if (!impl->module)
		return false;
#else
	auto memory = llvm::WritableMemoryBuffer::getNewUninitMemBuffer(size);
	memcpy(memory->getBufferStart(), data, size);

	llvm::SMDiagnostic error;
	impl->module = llvm::parseIR(*memory, error, impl->context);
	if (!impl->module)
	{
		error.print("DXIL", llvm::errs());
		return false;
	}
#endif

	return true;
}

bool LLVMBCParser::parseDXBC(dxbc_spv::ir::Builder &builder)
{
#ifdef HAVE_LLVMBC
	impl->module = llvm::parseDXBCIR(impl->context, builder);
	return impl->module != nullptr;
#else
	(void)builder;
	return false;
#endif
}

llvm::Module &LLVMBCParser::get_module()
{
	return *impl->module;
}

const llvm::Module &LLVMBCParser::get_module() const
{
	return *impl->module;
}
} // namespace dxil_spv
