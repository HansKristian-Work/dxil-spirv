/*
 * Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
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

namespace DXIL2SPIRV
{
bool emit_binary_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::BinaryOperator *instruction);
bool emit_unary_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                            const llvm::UnaryOperator *instruction);
bool emit_cast_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::CastInst *instruction);
bool emit_getelementptr_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::GetElementPtrInst *instruction);
bool emit_load_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::LoadInst *instruction);
bool emit_store_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                            const llvm::StoreInst *instruction);
bool emit_compare_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CmpInst *instruction);
bool emit_extract_value_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::ExtractValueInst *instruction);
bool emit_alloca_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::AllocaInst *instruction);
bool emit_select_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::SelectInst *instruction);
} // namespace DXIL2SPIRV
