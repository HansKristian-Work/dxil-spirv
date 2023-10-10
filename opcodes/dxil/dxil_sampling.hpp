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
bool get_image_dimensions(Converter::Impl &impl, spv::Id image_id, uint32_t *num_coords, uint32_t *num_dimensions);

bool emit_sample_instruction(DXIL::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_sample_grad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_texture_gather_instruction(bool compare, bool raw, Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_texture_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_texture_store_instruction_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction, bool multi_sampled);
bool emit_get_dimensions_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_calculate_lod_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_get_sample_position(Converter::Impl &impl, const llvm::CallInst *instruction, bool image);
bool emit_get_render_target_sample_count(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_check_access_fully_mapped_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_write_sampler_feedback_instruction(DXIL::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction);

template <DXIL::Op opcode>
bool emit_write_sampler_feedback_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_write_sampler_feedback_instruction(opcode, impl, instruction);
}

template <DXIL::Op opcode>
static inline bool emit_sample_instruction_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_sample_instruction(opcode, impl, instruction);
}

template <bool multi_sampled>
static inline bool emit_texture_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_texture_store_instruction_dispatch(impl, instruction, multi_sampled);
}

template <bool compare, bool raw>
static inline bool emit_texture_gather_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_texture_gather_instruction(compare, raw, impl, instruction);
}

template <bool image>
static inline bool emit_get_sample_position_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_get_sample_position(impl, instruction, image);
}
} // namespace dxil_spv
