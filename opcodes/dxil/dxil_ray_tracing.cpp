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

#include "opcodes/opcodes.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"
#include "logging.hpp"

namespace dxil_spv
{
static spv::Id emit_temp_storage_copy(Converter::Impl &impl, const llvm::Value *value, spv::StorageClass storage)
{
	// Make a new temporary variable for the ray payload/callable data.
	auto *pointer_type = llvm::cast<llvm::PointerType>(value->getType());
	auto *pointee_type = pointer_type->getPointerElementType();
	spv::Id type_id = impl.get_type_id(pointee_type);
	spv::Id var_id = impl.get_temp_payload(type_id, storage);

	// Load the alloca'ed value
	auto *load_op = impl.allocate(spv::OpLoad, type_id);
	load_op->add_id(impl.get_id_for_value(value));
	impl.add(load_op);

	// Store the alloca'ed value to our data in the right storage type
	auto *store_op = impl.allocate(spv::OpStore);
	store_op->add_id(var_id);
	store_op->add_id(load_op->id);
	impl.add(store_op);

	return var_id;
}

static void emit_temp_storage_resolve(Converter::Impl &impl, const llvm::Value *real_value, spv::Id temp_storage)
{
	auto *pointer_type = llvm::cast<llvm::PointerType>(real_value->getType());
	auto *pointee_type = pointer_type->getPointerElementType();
	spv::Id type_id = impl.get_type_id(pointee_type);

	// Load the result from the temp
	auto *load_op = impl.allocate(spv::OpLoad, type_id);
	load_op->add_id(temp_storage);
	impl.add(load_op);

	// Store the result in the alloca'ed value
	auto *store_op = impl.allocate(spv::OpStore);
	store_op->add_id(impl.get_id_for_value(real_value));
	store_op->add_id(load_op->id);
	impl.add(store_op);
}

bool emit_trace_ray_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto &builder = impl.builder();
	spv::Id acceleration_structure = impl.get_id_for_value(inst->getOperand(1));
	spv::Id ray_flags = impl.get_id_for_value(inst->getOperand(2));
	spv::Id instance_inclusion_mask = impl.get_id_for_value(inst->getOperand(3));
	spv::Id ray_contribution_to_hit_group = impl.get_id_for_value(inst->getOperand(4));
	spv::Id multiplier_for_geometry = impl.get_id_for_value(inst->getOperand(5));
	spv::Id miss_shader_index = impl.get_id_for_value(inst->getOperand(6));

	spv::Id ray_origin[3];
	spv::Id ray_dir[3];

	for (unsigned i = 0; i < 3; i++)
	{
		ray_origin[i] = impl.get_id_for_value(inst->getOperand(7 + i));
		ray_dir[i] = impl.get_id_for_value(inst->getOperand(11 + i));
	}

	spv::Id tmin = impl.get_id_for_value(inst->getOperand(10));
	spv::Id tmax = impl.get_id_for_value(inst->getOperand(14));

	spv::Id ray_origin_vec = impl.build_vector(builder.makeFloatType(32), ray_origin, 3);
	spv::Id ray_dir_vec = impl.build_vector(builder.makeFloatType(32), ray_dir, 3);

	auto *ray_payload = inst->getOperand(15);

	bool needs_temp_copy = impl.get_needs_temp_storage_copy(ray_payload);
	spv::Id ray_payload_var_id = needs_temp_copy
		? emit_temp_storage_copy(impl, ray_payload, spv::StorageClassRayPayloadKHR)
		: impl.get_id_for_value(ray_payload);

	auto *op = impl.allocate(spv::OpTraceRayKHR);
	op->add_ids({
	    acceleration_structure,
	    ray_flags,
	    instance_inclusion_mask,
	    ray_contribution_to_hit_group,
	    multiplier_for_geometry,
	    miss_shader_index,
	    ray_origin_vec,
	    tmin,
	    ray_dir_vec,
	    tmax,
	    ray_payload_var_id
	});
	impl.add(op);

	// In this instance, the ray_payload_var_id is our temp.
	if (needs_temp_copy)
		emit_temp_storage_resolve(impl, ray_payload, ray_payload_var_id);

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

bool emit_object_ray_direction_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_builtin_load_instruction(impl, inst, spv::BuiltInObjectRayDirectionKHR,
	                                                 impl.builder().makeFloatType(32));
}

bool emit_world_ray_direction_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_builtin_load_instruction(impl, inst, spv::BuiltInWorldRayDirectionKHR,
	                                                 impl.builder().makeFloatType(32));
}

bool emit_ray_t_min_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	spv::Id id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInRayTminKHR);
	auto *op = impl.allocate(spv::OpLoad, inst);
	op->add_id(id);
	impl.add(op);
	return true;
}

bool emit_ray_t_current_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	spv::Id id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInRayTmaxKHR);
	auto *op = impl.allocate(spv::OpLoad, inst);
	op->add_id(id);
	impl.add(op);
	return true;
}

static bool emit_ray_tracing_matrix_load(Converter::Impl &impl, const llvm::CallInst *inst, spv::BuiltIn builtin)
{
	auto &builder = impl.builder();
	spv::Id matrix_id = impl.spirv_module.get_builtin_shader_input(builtin);
	auto *chain_op = impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassInput, builder.makeFloatType(32)));
	chain_op->add_id(matrix_id);

	// Transpose here.
	chain_op->add_id(impl.get_id_for_value(inst->getOperand(2), 32));
	chain_op->add_id(impl.get_id_for_value(inst->getOperand(1)));

	impl.add(chain_op);

	auto *load_op = impl.allocate(spv::OpLoad, inst);
	load_op->add_id(chain_op->id);
	impl.add(load_op);
	return true;
}

bool emit_ray_tracing_report_hit(Converter::Impl &impl, const llvm::CallInst *inst)
{
	// We only have one global HitAttributeKHR per shader, so we'll need to copy from argument into that.
	auto *load_op = impl.allocate(spv::OpLoad, impl.get_type_id(impl.llvm_hit_attribute_output_type->getPointerElementType()));
	load_op->add_id(impl.get_id_for_value(inst->getOperand(3)));
	impl.add(load_op);

	auto *store_op = impl.allocate(spv::OpStore);
	store_op->add_id(impl.llvm_hit_attribute_output_value);
	store_op->add_id(load_op->id);
	impl.add(store_op);

	auto *op = impl.allocate(spv::OpReportIntersectionKHR, inst);
	op->add_id(impl.get_id_for_value(inst->getOperand(1)));
	op->add_id(impl.get_id_for_value(inst->getOperand(2)));
	impl.add(op);
	return true;
}

bool emit_ray_tracing_accept_hit_and_end_search(Converter::Impl &impl, const llvm::CallInst *)
{
	auto *op = impl.allocate(spv::OpTerminateRayKHR);
	impl.add(op);
	return true;
}

bool emit_ray_tracing_ignore_hit(Converter::Impl &impl, const llvm::CallInst *)
{
	auto *op = impl.allocate(spv::OpIgnoreIntersectionKHR);
	impl.add(op);
	return true;
}

bool emit_ray_tracing_call_shader(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto *callable_data = inst->getOperand(2);

	bool needs_temp_copy = impl.get_needs_temp_storage_copy(callable_data);
	spv::Id callable_data_var_id = impl.get_needs_temp_storage_copy(callable_data)
		? emit_temp_storage_copy(impl, callable_data, spv::StorageClassCallableDataKHR)
		: impl.get_id_for_value(callable_data);

	auto *op = impl.allocate(spv::OpExecuteCallableKHR);
	op->add_id(impl.get_id_for_value(inst->getOperand(1)));
	op->add_id(callable_data_var_id);
	impl.add(op);

	// In this instance, the callable_data_var_id is our temp.
	if (needs_temp_copy)
		emit_temp_storage_resolve(impl, callable_data, callable_data_var_id);

	return true;
}

bool emit_world_to_object_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_matrix_load(impl, inst, spv::BuiltInWorldToObjectKHR);
}

bool emit_object_to_world_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_matrix_load(impl, inst, spv::BuiltInObjectToWorldKHR);
}

static bool emit_ray_tracing_load_uint(Converter::Impl &impl, const llvm::CallInst *inst, spv::BuiltIn builtin)
{
	spv::Id index_id = impl.spirv_module.get_builtin_shader_input(builtin);
	auto *op = impl.allocate(spv::OpLoad, inst);
	op->add_id(index_id);
	impl.add(op);
	return true;
}

bool emit_ray_tracing_instance_id_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_load_uint(impl, inst, spv::BuiltInInstanceCustomIndexKHR);
}

bool emit_ray_tracing_instance_index_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_load_uint(impl, inst, spv::BuiltInInstanceId);
}

bool emit_ray_tracing_geometry_index_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_load_uint(impl, inst, spv::BuiltInRayGeometryIndexKHR);
}

bool emit_ray_tracing_primitive_index_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_load_uint(impl, inst, spv::BuiltInPrimitiveId);
}

bool emit_ray_tracing_ray_flags_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_load_uint(impl, inst, spv::BuiltInIncomingRayFlagsKHR);
}

bool emit_ray_tracing_hit_kind_instruction(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return emit_ray_tracing_load_uint(impl, inst, spv::BuiltInHitKindKHR);
}
}
