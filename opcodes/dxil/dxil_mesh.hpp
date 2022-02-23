/*
 * Copyright 2022 Philip Rebohle for Valve Corporation
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
bool emit_set_mesh_output_counts_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_emit_indices_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_store_vertex_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_store_primitive_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_dispatch_mesh_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
} // namespace dxil_spv
