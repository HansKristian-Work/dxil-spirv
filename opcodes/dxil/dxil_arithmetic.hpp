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
#include "GLSL.std.450.h"
#include "opcodes/opcodes.hpp"

namespace DXIL2SPIRV
{
bool emit_imad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_fmad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_isfinite_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_saturate_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_find_high_bit_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_dxil_unary_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_dxil_std450_unary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_dxil_std450_binary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_dxil_std450_trinary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_dot_instruction(unsigned dimensions, Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_bfe_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_bfi_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_make_double_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_split_double_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_legacy_f16_to_f32_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

template <GLSLstd450 opcode>
static inline bool emit_find_high_bit_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_find_high_bit_instruction(opcode, impl, instruction);
}

template <GLSLstd450 opcode>
static inline bool std450_trinary_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_dxil_std450_trinary_instruction(opcode, impl, instruction);
}

template <GLSLstd450 opcode>
static inline bool std450_binary_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_dxil_std450_binary_instruction(opcode, impl, instruction);
}

template <GLSLstd450 opcode>
static inline bool std450_unary_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_dxil_std450_unary_instruction(opcode, impl, instruction);
}

template <spv::Op opcode>
static inline bool unary_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_dxil_unary_instruction(opcode, impl, instruction);
}

template <unsigned Dim>
static inline bool emit_dot_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_dot_instruction(Dim, impl, instruction);
}

template <spv::Op opcode>
static inline bool emit_bfe_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_bfe_instruction(opcode, impl, instruction);
}

} // namespace DXIL2SPIRV
