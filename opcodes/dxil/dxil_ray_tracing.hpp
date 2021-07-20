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