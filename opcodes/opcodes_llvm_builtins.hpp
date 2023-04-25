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

#include "opcodes.hpp"

namespace dxil_spv
{
bool emit_binary_instruction(Converter::Impl &impl, const llvm::BinaryOperator *instruction);
bool emit_unary_instruction(Converter::Impl &impl, const llvm::UnaryOperator *instruction);
bool emit_cast_instruction(Converter::Impl &impl, const llvm::CastInst *instruction);
bool emit_getelementptr_instruction(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction);
bool emit_load_instruction(Converter::Impl &impl, const llvm::LoadInst *instruction);
bool emit_store_instruction(Converter::Impl &impl, const llvm::StoreInst *instruction);
bool emit_compare_instruction(Converter::Impl &impl, const llvm::CmpInst *instruction);
bool emit_extract_value_instruction(Converter::Impl &impl, const llvm::ExtractValueInst *instruction);
bool emit_alloca_instruction(Converter::Impl &impl, const llvm::AllocaInst *instruction);
bool emit_select_instruction(Converter::Impl &impl, const llvm::SelectInst *instruction);
bool emit_atomicrmw_instruction(Converter::Impl &impl, const llvm::AtomicRMWInst *instruction);
bool emit_cmpxchg_instruction(Converter::Impl &impl, const llvm::AtomicCmpXchgInst *instruction);
bool emit_shufflevector_instruction(Converter::Impl &impl, const llvm::ShuffleVectorInst *instruction);
bool emit_extractelement_instruction(Converter::Impl &impl, const llvm::ExtractElementInst *instruction);
bool emit_insertelement_instruction(Converter::Impl &impl, const llvm::InsertElementInst *instruction);

bool analyze_load_instruction(Converter::Impl &impl, const llvm::LoadInst *instruction);
bool analyze_store_instruction(Converter::Impl &impl, const llvm::StoreInst *instruction);
bool analyze_phi_instruction(Converter::Impl &impl, const llvm::PHINode *instruction);
bool analyze_getelementptr_instruction(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction);
bool analyze_extractvalue_instruction(Converter::Impl &impl, const llvm::ExtractValueInst *instruction);

bool emit_llvm_instruction(Converter::Impl &impl, const llvm::Instruction &instruction);

unsigned physical_integer_bit_width(unsigned width);

spv::Id build_constant_expression(Converter::Impl &impl, const llvm::ConstantExpr *cexpr);
} // namespace dxil_spv
