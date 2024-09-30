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
bool emit_create_node_output_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_annotate_node_record_handle(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_node_output_is_valid(Converter::Impl &impl, const llvm::CallInst *inst);
bool emit_get_remaining_recursion_levels(Converter::Impl &impl, const llvm::CallInst *inst);

uint32_t get_node_io_from_annotate_handle(const llvm::CallInst *inst);

enum NodeInputParameter
{
	NodePayloadBDA = 0,
	NodeLinearOffsetBDA = 1,
	NodeEndNodesBDA = 2,
	NodePayloadStrideOrOffsetsBDA = 3,
	NodePayloadOutputBDA = 4,
	NodePayloadOutputAtomicBDA = 5,
	NodeLocalRootSignatureBDA = 6,
	NodeGridDispatchX = 7,
	NodeGridDispatchY = 8,
	NodeGridDispatchZ = 9,
	NodePayloadOutputOffset = 10,
	NodePayloadOutputStride = 11,
	NodeRemainingRecursionLevels = 12
};

enum NodeSpecConstant
{
	NodeSpecIdGroupSizeX = 0,
	NodeSpecIdGroupSizeY = 1,
	NodeSpecIdGroupSizeZ = 2,
	NodeSpecIdIsEntryPoint = 3,
	NodeSpecIdIndirectPayloadStride = 4,
	NodeSpecIdDispatchGridIsUpperBound = 5,
	NodeSpecIdOutputBase = 100,
};

spv::Id emit_load_node_input_push_parameter(
	Converter::Impl &impl, NodeInputParameter param, spv::Id type);

bool emit_workgraph_dispatcher(Converter::Impl &impl, CFGNodePool &pool, CFGNode *entry, spv::Id main_entry_id);
}
