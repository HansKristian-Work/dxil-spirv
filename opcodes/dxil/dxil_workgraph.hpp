/* Copyright (c) 2024 Hans-Kristian Arntzen for Valve Corporation
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
bool emit_allocate_node_output_records(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_get_node_record_ptr(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_increment_output_count(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_output_complete(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_get_input_record_count(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_finished_cross_group_sharing(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_barrier_by_memory_type(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_barrier_by_memory_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_barrier_by_node_record_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_index_node_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_annotate_node_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_create_node_input_record_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_annotate_node_record_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_node_output_is_valid(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_get_remaining_recursion_levels(Converter::Impl &impl, const llvm::CallInst *inst);

enum NodeInputParameter
{
	PayloadBDA = 0,
	LinearOffsetBDA = 1,
	TotalNodesBDA = 2,
	PayloadStrideBDA = 3,
	NodeGridDispatchX = 4,
	NodeGridDispatchY = 5,
	NodeGridDispatchZ = 6,
};

bool emit_workgraph_dispatcher(Converter::Impl &impl, spv::Id main_entry_id);
}
