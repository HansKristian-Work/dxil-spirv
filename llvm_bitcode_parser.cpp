/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 */

#include "llvm_bitcode_parser.hpp"

#ifdef HAVE_LLVMBC
#include "module.hpp"
#include "context.hpp"
#else
#include <llvm/IRReader/IRReader.h>
#include <llvm/Support/SourceMgr.h>
#endif

namespace dxil_spv
{
LLVMBCParser::LLVMBCParser()
{
	context.reset(new llvm::LLVMContext);
}

LLVMBCParser::~LLVMBCParser()
{
}

bool LLVMBCParser::parse(const void *data, size_t size)
{
#ifdef HAVE_LLVMBC
	module.reset(llvm::parseIR(*context, data, size));
	if (!module)
		return false;
#else
	auto memory = llvm::WritableMemoryBuffer::getNewUninitMemBuffer(size);
	memcpy(memory->getBufferStart(), data, size);

	llvm::SMDiagnostic error;
	module = llvm::parseIR(*memory, error, *context);
	if (!module)
	{
		error.print("DXIL", llvm::errs());
		return false;
	}
#endif

	return true;
}

llvm::Module &LLVMBCParser::get_module()
{
	return *module;
}

const llvm::Module &LLVMBCParser::get_module() const
{
	return *module;
}
} // namespace dxil_spv