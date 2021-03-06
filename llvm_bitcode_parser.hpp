/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
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

#pragma once

#ifdef HAVE_LLVMBC
#include "module.hpp"
#else
#include <llvm/IR/LLVMContext.h>
#include <llvm/IR/Module.h>
#endif

#include <memory>
#include <stddef.h>

namespace dxil_spv
{
class LLVMBCParser
{
public:
	LLVMBCParser();
	~LLVMBCParser();
	bool parse(const void *data, size_t size);
	llvm::Module &get_module();
	const llvm::Module &get_module() const;

private:
	struct Impl;
	std::unique_ptr<Impl> impl;
};
} // namespace dxil_spv