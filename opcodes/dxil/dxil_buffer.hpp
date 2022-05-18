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
