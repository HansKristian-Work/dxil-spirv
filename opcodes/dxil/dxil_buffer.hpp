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
#include "opcodes/opcodes.hpp"

namespace dxil_spv
{
struct BufferAccessInfo
{
	spv::Id index_id;
	RawVecSize raw_vec_size;
};

bool emit_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_raw_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_raw_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_atomic_binop_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_atomic_cmpxchg_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_buffer_update_counter_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

unsigned raw_buffer_data_type_to_addr_shift_log2(Converter::Impl &impl, const llvm::Type *data_type);

bool raw_access_byte_address_can_vectorize(Converter::Impl &impl, const llvm::Type *type,
                                           const llvm::Value *byte_offset, unsigned vecsize);

bool raw_access_structured_can_vectorize(Converter::Impl &impl, const llvm::Type *type,
                                         const llvm::Value *index,
                                         unsigned stride,
                                         const llvm::Value *byte_offset,
                                         unsigned vecsize);

RawVecSize raw_access_byte_address_vectorize(Converter::Impl &impl, const llvm::Type *type,
                                             const llvm::Value *byte_offset, uint32_t mask);

RawVecSize raw_access_structured_vectorize(Converter::Impl &impl, const llvm::Type *type,
                                           const llvm::Value *index,
                                           unsigned stride,
                                           const llvm::Value *byte_offset,
                                           uint32_t mask);
} // namespace dxil_spv
