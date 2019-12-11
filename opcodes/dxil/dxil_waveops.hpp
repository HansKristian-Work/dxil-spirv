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
#include "opcodes/opcodes.hpp"

namespace DXIL2SPIRV
{
bool emit_wave_is_first_lane_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_builtin_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_boolean_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_ballot_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_read_lane_first_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_read_lane_at_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_wave_all_bit_count_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

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
}
