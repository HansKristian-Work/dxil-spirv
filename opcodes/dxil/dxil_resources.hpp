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

#include "GLSL.std.450.h"
#include "opcodes/opcodes.hpp"

namespace dxil_spv
{
bool emit_load_input_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_interpolate_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_store_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_create_handle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_create_handle_for_lib_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_create_handle_from_heap_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_create_handle_from_binding_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_annotate_handle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_cbuffer_load_legacy_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

template <GLSLstd450 opcode>
static inline bool emit_interpolate_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_interpolate_instruction(opcode, impl, instruction);
}

struct AnnotateHandleMeta
{
	DXIL::Op resource_op;
	DXIL::ResourceType resource_type;
	llvm::Value *offset;
	uint32_t binding_index;
	bool non_uniform;
};
bool get_annotate_handle_meta(Converter::Impl &impl, const llvm::CallInst *instruction, AnnotateHandleMeta &meta);
} // namespace dxil_spv
