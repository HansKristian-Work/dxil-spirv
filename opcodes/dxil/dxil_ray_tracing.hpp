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
bool emit_trace_ray_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_dispatch_rays_index_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_dispatch_rays_dimensions_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_object_ray_origin_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_world_ray_origin_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_object_ray_direction_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_world_ray_direction_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_t_min_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_t_current_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_world_to_object_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_object_to_world_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_instance_id_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_instance_index_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_geometry_index_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_primitive_index_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_ray_flags_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_hit_kind_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_report_hit(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_accept_hit_and_end_search(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_ignore_hit(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_tracing_call_shader(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_allocate_ray_query(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_query_trace_ray_inline_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_query_proceed_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_query_abort_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_ray_query_commit_non_opaque_triangle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_query_commit_procedural_primitive_instruction(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_ray_query_candidate_procedural_primitive_non_opaque_instruction(Converter::Impl &impl,
                                                                          const llvm::CallInst *instruction);

bool emit_ray_query_intersection_type_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                  spv::RayQueryIntersection intersection);
template <spv::RayQueryIntersection intersection>
bool emit_ray_query_intersection_type_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_ray_query_intersection_type_instruction(impl, instruction, intersection);
}

bool emit_ray_query_system_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                             spv::Op op, uint32_t vecsize);
template <spv::Op opcode, uint32_t vecsize>
inline bool emit_ray_query_system_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_ray_query_system_value_instruction(impl, instruction, opcode, vecsize);
}

bool emit_ray_query_get_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                          spv::Op opcode, uint32_t vecsize, spv::RayQueryIntersection intersection);
template <spv::Op opcode, uint32_t vecsize, spv::RayQueryIntersection intersection>
inline bool emit_ray_query_get_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_ray_query_get_value_instruction(impl, instruction, opcode, vecsize, intersection);
}

bool emit_ray_query_get_matrix_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                 spv::Op opcode, spv::RayQueryIntersection intersection);
template <spv::Op opcode, spv::RayQueryIntersection intersection>
inline bool emit_ray_query_get_matrix_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	return emit_ray_query_get_matrix_value_instruction(impl, instruction, opcode, intersection);
}
} // namespace dxil_spv
