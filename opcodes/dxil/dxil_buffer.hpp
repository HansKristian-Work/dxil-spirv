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

#pragma once
#include "opcodes/opcodes.hpp"

namespace dxil_spv
{
struct BufferAccessInfo
{
	spv::Id index_id;
	unsigned num_components;
};

BufferAccessInfo build_buffer_access(Converter::Impl &impl, const llvm::CallInst *instruction,
                                     unsigned operand_offset = 0);

bool emit_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_raw_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_raw_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_atomic_binop_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_atomic_cmpxchg_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_buffer_update_counter_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
} // namespace dxil_spv
