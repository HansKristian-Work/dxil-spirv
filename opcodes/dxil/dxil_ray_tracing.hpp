/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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
} // namespace dxil_spv