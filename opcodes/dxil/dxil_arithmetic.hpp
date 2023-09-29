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
#include "GLSL.std.450.h"
#include "opcodes/opcodes.hpp"

namespace dxil_spv
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
bool emit_legacy_f32_to_f16_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_bitcast_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

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

bool emit_i8_dot_instruction(Converter::Impl &Impl, const llvm::CallInst *instruction, bool sign_extend);
template <bool sign_extend>
static inline bool emit_i8_dot_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_i8_dot_instruction(impl, instruction, sign_extend);
}

bool emit_dot2_add_half_instruction(Converter::Impl &Impl, const llvm::CallInst *instruction);
bool emit_unpack4x8_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_pack4x8_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_msad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
} // namespace dxil_spv
