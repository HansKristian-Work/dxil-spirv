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

static void emit_ray_query_capabilities(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	builder.addExtension("SPV_KHR_ray_query");
	builder.addCapability(spv::CapabilityRayQueryKHR);
	builder.addCapability(spv::CapabilityRayTraversalPrimitiveCullingKHR);
}

bool emit_allocate_ray_query(Converter::Impl &impl, const llvm::CallInst *inst)
{
	// TODO: It seems like we can use full variable pointers with RayQuery in DXIL.
	// To implement this, we will need some kind of global "bank" of ray query objects,
	// and allocateRayQuery could assign indices into that global array.
	// Until we actually see this happen in practice, we can just allocate RayQuery objects like this.
	// The return type of allocateRayQuery appears to be i32, so this might be how it's intended to be done ...
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.create_variable(spv::StorageClassPrivate, builder.makeRayQueryType());
	impl.rewrite_value(inst, var_id);
	impl.handle_to_storage_class[inst] = spv::StorageClassPrivate;
	emit_ray_query_capabilities(impl);
	return true;
}

static bool ray_query_operand_is_alloca(Converter::Impl &impl, const llvm::Value *operand)
{
	if (auto *alloca = llvm::dyn_cast<llvm::CallInst>(operand))
	{
		uint32_t op = 0;
		if (!get_constant_operand(alloca, 0, &op))
			return false;
		if (strncmp(alloca->getCalledFunction()->getName().data(), "dx.op", 5) != 0)
			return false;
		if (DXIL::Op(op) != DXIL::Op::AllocateRayQuery)
			return false;
		return true;
	}
	else
		return false;
}

static bool build_ray_query_object(Converter::Impl &impl, const llvm::Value *operand,
                                   spv::Id &object_id, uint32_t *ray_query_flags = nullptr)
{
	// TODO: We can index into global pool.
	auto *ray_object = llvm::cast<llvm::CallInst>(operand);
	if (ray_query_flags && !get_constant_operand(ray_object, 1, ray_query_flags))
		return false;

	// For now, we must observe that the ray object came directly from an allocateRayObject.
	if (!ray_query_operand_is_alloca(impl, operand))
	{
		LOGE("RayQuery object must come directly from allocateRayQuery for now.\n");
		return false;
	}

	object_id = impl.get_id_for_value(ray_object);
	return true;
}

bool emit_ray_query_trace_ray_inline_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto *init_op = impl.allocate(spv::OpRayQueryInitializeKHR);

	spv::Id ray_object_id = 0;
	uint32_t ray_query_flags = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id, &ray_query_flags))
		return false;

	init_op->add_id(ray_object_id);
	init_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));

	// The template type of the ray query object is embedded in the object itself, we must OR in the constant flags.
	if (auto *const_flags = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(3)))
	{
		ray_query_flags |= const_flags->getUniqueInteger().getZExtValue();
		init_op->add_id(builder.makeUintConstant(ray_query_flags));
	}
	else if (ray_query_flags == 0)
	{
		init_op->add_id(impl.get_id_for_value(instruction->getOperand(3)));
	}
	else
	{
		auto *or_op = impl.allocate(spv::OpBitwiseOr, builder.makeUintType(32));
		or_op->add_id(impl.get_id_for_value(instruction->getOperand(3)));
		or_op->add_id(builder.makeUintConstant(ray_query_flags));
		impl.add(or_op);
		init_op->add_id(or_op->id);
	}

	init_op->add_id(impl.get_id_for_value(instruction->getOperand(4)));

	spv::Id origin[3], direction[3];
	for (unsigned i = 0; i < 3; i++)
	{
		origin[i] = impl.get_id_for_value(instruction->getOperand(5 + i));
		direction[i] = impl.get_id_for_value(instruction->getOperand(9 + i));
	}
	init_op->add_id(impl.build_vector(builder.makeFloatType(32), origin, 3));
	init_op->add_id(impl.get_id_for_value(instruction->getOperand(8)));
	init_op->add_id(impl.build_vector(builder.makeFloatType(32), direction, 3));
	init_op->add_id(impl.get_id_for_value(instruction->getOperand(12)));

	impl.add(init_op);

	return true;
}

bool emit_ray_query_proceed_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(spv::OpRayQueryProceedKHR, instruction);
	op->add_id(ray_object_id);
	impl.add(op);
	return true;
}

bool emit_ray_query_abort_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(spv::OpRayQueryTerminateKHR);
	op->add_id(ray_object_id);
	impl.add(op);
	return true;
}

bool emit_ray_query_intersection_type_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                  spv::RayQueryIntersection intersection)
{
	auto &builder = impl.builder();
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(spv::OpRayQueryGetIntersectionTypeKHR, instruction);
	op->add_id(ray_object_id);
	op->add_id(builder.makeUintConstant(intersection));
	impl.add(op);
	return true;
}

bool emit_ray_query_system_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                             spv::Op opcode, uint32_t vecsize)
{
	auto &builder = impl.builder();
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	if (vecsize == 1)
	{
		auto *op = impl.allocate(opcode, instruction);
		op->add_id(ray_object_id);
		impl.add(op);
	}
	else
	{
		auto *op = impl.allocate(opcode, builder.makeVectorType(impl.get_type_id(instruction->getType()), vecsize));
		op->add_id(ray_object_id);
		impl.add(op);
		auto *extract_op = impl.allocate(spv::OpCompositeExtract, instruction);
		extract_op->add_id(op->id);

		uint32_t index = 0;
		if (!get_constant_operand(instruction, 2, &index))
			return false;
		extract_op->add_literal(index);
		impl.add(extract_op);
	}
	return true;
}

bool emit_ray_query_get_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                          spv::Op opcode, uint32_t vecsize, spv::RayQueryIntersection intersection)
{
	auto &builder = impl.builder();
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	if (vecsize == 1)
	{
		auto *op = impl.allocate(opcode, instruction);
		op->add_id(ray_object_id);
		op->add_id(builder.makeUintConstant(intersection));
		impl.add(op);
	}
	else
	{
		auto *op = impl.allocate(opcode, builder.makeVectorType(impl.get_type_id(instruction->getType()), vecsize));
		op->add_id(ray_object_id);
		op->add_id(builder.makeUintConstant(intersection));
		impl.add(op);
		auto *extract_op = impl.allocate(spv::OpCompositeExtract, instruction);
		extract_op->add_id(op->id);

		uint32_t index = 0;
		if (!get_constant_operand(instruction, 2, &index))
			return false;
		extract_op->add_literal(index);
		impl.add(extract_op);
	}
	return true;
}

bool emit_ray_query_get_matrix_value_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                 spv::Op opcode, spv::RayQueryIntersection intersection)
{
	auto &builder = impl.builder();
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(opcode, builder.makeMatrixType(impl.get_type_id(instruction->getType()), 4, 3));
	op->add_id(ray_object_id);
	op->add_id(builder.makeUintConstant(intersection));
	impl.add(op);

	auto *extract_op = impl.allocate(spv::OpCompositeExtract, instruction);
	uint32_t row = 0, col = 0;
	if (!get_constant_operand(instruction, 2, &row))
		return false;
	if (!get_constant_operand(instruction, 3, &col))
		return false;
	extract_op->add_id(op->id);
	extract_op->add_literal(col);
	extract_op->add_literal(row);
	impl.add(extract_op);
	return true;
}

bool emit_ray_query_commit_non_opaque_triangle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(spv::OpRayQueryConfirmIntersectionKHR);
	op->add_id(ray_object_id);
	impl.add(op);
	return true;
}

bool emit_ray_query_commit_procedural_primitive_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(spv::OpRayQueryGenerateIntersectionKHR);
	op->add_id(ray_object_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	impl.add(op);
	return true;
}

bool emit_ray_query_candidate_procedural_primitive_non_opaque_instruction(Converter::Impl &impl,
                                                                          const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id ray_object_id = 0;
	if (!build_ray_query_object(impl, instruction->getOperand(1), ray_object_id))
		return false;

	auto *op = impl.allocate(spv::OpRayQueryGetIntersectionCandidateAABBOpaqueKHR, builder.makeBoolType());
	op->add_id(ray_object_id);
	impl.add(op);

	auto *not_op = impl.allocate(spv::OpLogicalNot, instruction);
	not_op->add_id(op->id);
	impl.add(not_op);
	return true;
}
}
