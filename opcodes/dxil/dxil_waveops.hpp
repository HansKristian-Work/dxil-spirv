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
bool emit_wave_is_first_lane_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_builtin_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_boolean_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_ballot_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_read_lane_first_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_read_lane_at_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_wave_bit_count_instruction(spv::GroupOperation operation, Converter::Impl &impl,
                                     const llvm::CallInst *instruction);

bool emit_wave_active_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_active_bit_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_prefix_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_multi_prefix_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_multi_prefix_count_bits_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_quad_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_quad_vote_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_quad_read_lane_at_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_match_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

template <spv::GroupOperation operation>
static inline bool emit_wave_bit_count_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_wave_bit_count_instruction(operation, impl, instruction);
}

template <spv::Op opcode>
static inline bool emit_wave_boolean_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_wave_boolean_instruction(opcode, impl, instruction);
}

template <spv::BuiltIn builtin>
static inline bool emit_wave_builtin_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_wave_builtin_instruction(builtin, impl, instruction);
}

bool value_is_statically_wave_uniform(Converter::Impl &impl, const llvm::Value *value);
bool value_is_likely_non_uniform(Converter::Impl &impl, const llvm::Value *value);
bool value_depends_on_varying_input(Converter::Impl &impl, const llvm::Value *value);
} // namespace dxil_spv
