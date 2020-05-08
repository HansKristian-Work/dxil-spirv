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

#include "opcodes/opcodes.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_trace_ray_instruction(Converter::Impl &, const llvm::CallInst *)
{
	// TODO. Dummy here to test RayGen resource declaration for now.
	return true;
}

bool emit_ray_tracing_builtin_load_instruction(Converter::Impl &impl, const llvm::CallInst *inst,
                                               spv::BuiltIn builtin, spv::Id scalar_type)
{
	auto &builder = impl.builder();
	spv::Id input = impl.spirv_module.get_builtin_shader_input(builtin);

	auto *access_chain = impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassInput, scalar_type));
	access_chain->add_id(input);
	access_chain->add_id(impl.get_id_for_value(inst->getOperand(1), 32));
	impl.add(access_chain);

	auto *load = impl.allocate(spv::OpLoad, inst);
	load->add_id(access_chain->id);
	impl.add(load);
	return true;
}

bool emit_dispatch_rays_index_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_builtin_load_instruction(impl, inst, spv::BuiltInLaunchIdKHR,
	                                                 impl.builder().makeUintType(32));
}

bool emit_dispatch_rays_dimensions_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_builtin_load_instruction(impl, inst, spv::BuiltInLaunchSizeKHR,
	                                                 impl.builder().makeUintType(32));
}

bool emit_object_ray_origin_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_builtin_load_instruction(impl, inst, spv::BuiltInObjectRayOriginKHR,
	                                                 impl.builder().makeFloatType(32));
}

bool emit_world_ray_origin_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_builtin_load_instruction(impl, inst, spv::BuiltInWorldRayOriginKHR,
	                                                 impl.builder().makeFloatType(32));
}
}