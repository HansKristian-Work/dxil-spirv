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
} // namespace dxil_spv
