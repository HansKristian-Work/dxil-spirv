/* Copyright (c) 2025 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 */

#include "dxil_nvapi.hpp"
#include "dxil_common.hpp"
#include "dxil_ray_tracing.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
enum NVExtnOp
{
	NV_EXTN_OP_SHFL = 1,
	NV_EXTN_OP_SHFL_UP = 2,
	NV_EXTN_OP_SHFL_DOWN = 3,
	NV_EXTN_OP_SHFL_XOR = 4,
	NV_EXTN_OP_VOTE_ALL = 5,
	NV_EXTN_OP_VOTE_ANY = 6,
	NV_EXTN_OP_VOTE_BALLOT = 7,
	NV_EXTN_OP_GET_LANE_ID = 8,
	NV_EXTN_OP_FP16_ATOMIC = 12,
	NV_EXTN_OP_FP32_ATOMIC = 13,
	NV_EXTN_OP_GET_SPECIAL = 19,
	NV_EXTN_OP_UINT64_ATOMIC = 20,
	NV_EXTN_OP_MATCH_ANY = 21,
	NV_EXTN_OP_FOOTPRINT = 28,
	NV_EXTN_OP_FOOTPRINT_BIAS = 29,
	NV_EXTN_OP_GET_SHADING_RATE = 30,
	NV_EXTN_OP_FOOTPRINT_LEVEL = 31,
	NV_EXTN_OP_FOOTPRINT_GRAD = 32,
	NV_EXTN_OP_SHFL_GENERIC = 33,
	NV_EXTN_OP_VPRS_EVAL_ATTRIB_AT_SAMPLE = 51,
	NV_EXTN_OP_VPRS_EVAL_ATTRIB_SNAPPED = 52,
	NV_EXTN_OP_HIT_OBJECT_TRACE_RAY = 67,
	NV_EXTN_OP_HIT_OBJECT_MAKE_HIT = 68,
	NV_EXTN_OP_HIT_OBJECT_MAKE_HIT_WITH_RECORD_INDEX  = 69,
	NV_EXTN_OP_HIT_OBJECT_MAKE_MISS = 70,
	NV_EXTN_OP_HIT_OBJECT_REORDER_THREAD = 71,
	NV_EXTN_OP_HIT_OBJECT_INVOKE = 72,
	NV_EXTN_OP_HIT_OBJECT_IS_MISS = 73,
	NV_EXTN_OP_HIT_OBJECT_GET_INSTANCE_ID = 74,
	NV_EXTN_OP_HIT_OBJECT_GET_INSTANCE_INDEX = 75,
	NV_EXTN_OP_HIT_OBJECT_GET_PRIMITIVE_INDEX = 76,
	NV_EXTN_OP_HIT_OBJECT_GET_GEOMETRY_INDEX = 77,
	NV_EXTN_OP_HIT_OBJECT_GET_HIT_KIND = 78,
	NV_EXTN_OP_HIT_OBJECT_GET_RAY_DESC = 79,
	NV_EXTN_OP_HIT_OBJECT_GET_ATTRIBUTES = 80,
	NV_EXTN_OP_HIT_OBJECT_GET_SHADER_TABLE_INDEX = 81,
	NV_EXTN_OP_HIT_OBJECT_LOAD_LOCAL_ROOT_TABLE_CONSTANT = 82,
	NV_EXTN_OP_HIT_OBJECT_IS_HIT = 83,
	NV_EXTN_OP_HIT_OBJECT_IS_NOP = 84,
	NV_EXTN_OP_HIT_OBJECT_MAKE_NOP = 85,
	NV_EXTN_OP_RT_TRIANGLE_OBJECT_POSITIONS = 86,
	NV_EXTN_OP_RT_MICRO_TRIANGLE_OBJECT_POSITIONS = 87,
	NV_EXTN_OP_RT_MICRO_TRIANGLE_BARYCENTRICS = 88,
	NV_EXTN_OP_RT_IS_MICRO_TRIANGLE_HIT = 89,
	NV_EXTN_OP_RT_IS_BACK_FACING = 90,
	NV_EXTN_OP_RT_MICRO_VERTEX_OBJECT_POSITION = 91,
	NV_EXTN_OP_RT_MICRO_VERTEX_BARYCENTRICS = 92,
	NV_EXTN_OP_RT_GET_CLUSTER_ID = 93,
	NV_EXTN_OP_RT_GET_CANDIDATE_CLUSTER_ID = 94,
	NV_EXTN_OP_RT_GET_COMMITTED_CLUSTER_ID = 95,
	NV_EXTN_OP_HIT_OBJECT_GET_CLUSTER_ID = 96,
	NV_EXTN_OP_RT_CANDIDATE_TRIANGLE_OBJECT_POSITIONS = 97,
	NV_EXTN_OP_RT_COMMITTED_TRIANGLE_OBJECT_POSITIONS = 98,
	NV_EXTN_OP_HIT_OBJECT_GET_TRIANGLE_OBJECT_POSITIONS = 99,
	NV_EXTN_OP_RT_SPHERE_OBJECT_POSITION_AND_RADIUS = 100,
	NV_EXTN_OP_RT_CANDIDATE_SPHERE_OBJECT_POSITION_AND_RADIUS = 101,
	NV_EXTN_OP_RT_COMMITTED_SPHERE_OBJECT_POSITION_AND_RADIUS = 102,
	NV_EXTN_OP_HIT_OBJECT_GET_SPHERE_OBJECT_POSITION_AND_RADIUS = 103,
	NV_EXTN_OP_RT_LSS_OBJECT_POSITIONS_AND_RADII = 104,
	NV_EXTN_OP_RT_CANDIDATE_LSS_OBJECT_POSITIONS_AND_RADII = 105,
	NV_EXTN_OP_RT_COMMITTED_LSS_OBJECT_POSITIONS_AND_RADII = 106,
	NV_EXTN_OP_HIT_OBJECT_GET_LSS_OBJECT_POSITIONS_AND_RADII = 107,
	NV_EXTN_OP_RT_IS_SPHERE_HIT = 108,
	NV_EXTN_OP_RT_CANDIDATE_IS_NONOPAQUE_SPHERE = 109,
	NV_EXTN_OP_RT_COMMITTED_IS_SPHERE = 110,
	NV_EXTN_OP_HIT_OBJECT_IS_SPHERE_HIT = 111,
	NV_EXTN_OP_RT_IS_LSS_HIT = 112,
	NV_EXTN_OP_RT_CANDIDATE_IS_NONOPAQUE_LSS = 113,
	NV_EXTN_OP_RT_COMMITTED_IS_LSS = 114,
	NV_EXTN_OP_HIT_OBJECT_IS_LSS_HIT = 115,
	NV_EXTN_OP_RT_CANDIDATE_LSS_HIT_PARAMETER = 116,
	NV_EXTN_OP_RT_COMMITTED_LSS_HIT_PARAMETER = 117,
	NV_EXTN_OP_RT_CANDIDATE_BUILTIN_PRIMITIVE_RAY_T = 118,
	NV_EXTN_OP_RT_COMMIT_NONOPAQUE_BUILTIN_PRIMITIVE_HIT = 119
};

enum NVSpecialOp
{
	NV_SPECIALOP_THREADLTMASK = 4,
	NV_SPECIALOP_FOOTPRINT_SINGLELOD_PRED = 5,
	NV_SPECIALOP_GLOBAL_TIMER_LO = 9,
	NV_SPECIALOP_GLOBAL_TIMER_HI = 10
};

void NVAPIState::reset()
{
	for (auto &input : fake_doorbell_inputs)
		input = nullptr;
	for (auto &output : fake_doorbell_outputs)
		output = 0;

	doorbell = nullptr;
	clock_output_index = 0;
	num_expected_clock_outputs = 0;
	// The marked UAV persists.
}

void NVAPIState::notify_doorbell(Converter::Impl &impl, const llvm::CallInst *instruction, bool analysis)
{
	// IncrementCounter is used for either starting an intrinsic or sometimes clocking out values from it.
	if (num_expected_clock_outputs == 0)
	{
		reset();

		// When the dummy structured buffer is being written to,
		// the structure index comes from this counter value.
		doorbell = instruction;
	}
	else
	{
		// We're clocking out arguments.
		// We either clock out arguments by IncrementCounter() or reading the magic UAV.

		if (clock_output_index < num_expected_clock_outputs)
		{
			if (!analysis)
				impl.rewrite_value(instruction, impl.nvapi.fake_doorbell_outputs[clock_output_index]);
			clock_output_index++;
		}

		if (clock_output_index >= num_expected_clock_outputs)
		{
			// We're done consuming the opcode. The next IncrementCounter starts a new opcode.
			reset();
		}
	}
}

static spv::Id get_argument(Converter::Impl &impl, uint32_t offset)
{
	return impl.get_id_for_value(impl.nvapi.fake_doorbell_inputs[offset]);
}

static spv::Id get_argument_as_float(Converter::Impl &impl, uint32_t offset)
{
	auto *op = impl.nvapi.fake_doorbell_inputs[offset];
	auto *cast_inst = llvm::dyn_cast<llvm::CastInst>(op);

	if (cast_inst != nullptr && cast_inst->getOpcode() == llvm::Instruction::BitCast)
	{
		op = cast_inst->getOperand(0);

		if (op->getType()->getTypeID() == llvm::Type::TypeID::FloatTyID)
			return impl.get_id_for_value(op);
	}

	auto *bitcast_op = impl.allocate(spv::OpBitcast, impl.builder().makeFloatType(32));
	bitcast_op->add_id(impl.get_id_for_value(op));
	impl.add(bitcast_op);

	return bitcast_op->id;
}

static bool emit_nvapi_extn_op_shuffle(Converter::Impl &impl)
{
	// Dummy throwaway implementation.
	spv::Id val = get_argument(impl, NVAPI_ARGUMENT_SRC0U + 0);
	spv::Id lane = get_argument(impl, NVAPI_ARGUMENT_SRC0U + 1);

	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityGroupNonUniformShuffle);

	auto *op = impl.allocate(spv::OpGroupNonUniformShuffle, builder.makeUintType(32));
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_id(val);
	op->add_id(lane);
	impl.add(op);

	impl.nvapi.fake_doorbell_outputs[0] = op->id;
	return true;
}

static bool emit_nvapi_extn_op_fp16x2_atomic(Converter::Impl &impl)
{
	if (!impl.nvapi.marked_uav)
		return false;

	// Dummy throwaway implementation to demonstrate UAV reference plumbing.
	spv::Id addr = get_argument(impl, NVAPI_ARGUMENT_SRC0U + 0);
	spv::Id val = get_argument(impl, NVAPI_ARGUMENT_SRC1U + 0);
	spv::Id type = get_argument(impl, NVAPI_ARGUMENT_SRC2U + 0);
	(void)type;

	auto &builder = impl.builder();

	spv::Id id = impl.get_id_for_value(impl.nvapi.marked_uav);
	const auto &meta = impl.handle_to_resource_meta[id];

	if (meta.storage == spv::StorageClassStorageBuffer)
	{
		spv::Id ssbo_id = get_buffer_alias_handle(impl, meta, id, RawType::Integer, RawWidth::B32, RawVecSize::V1);

		auto *chain = impl.allocate(spv::OpAccessChain,
		                            builder.makePointer(spv::StorageClassStorageBuffer, builder.makeUintType(32)));
		chain->add_id(ssbo_id);
		chain->add_id(builder.makeUintConstant(0));
		chain->add_id(addr);
		impl.add(chain);

		auto *atomic = impl.allocate(spv::OpAtomicIAdd, builder.makeUintType(32));
		atomic->add_id(chain->id);
		atomic->add_id(builder.makeUintConstant(spv::ScopeDevice));
		atomic->add_id(builder.makeUintConstant(0));
		atomic->add_id(val);
		impl.add(atomic);

		impl.nvapi.fake_doorbell_outputs[NVAPI_ARGUMENT_DST0U + 0] = atomic->id;
	}
	else if (meta.storage == spv::StorageClassUniformConstant)
	{
		auto *ptr = impl.allocate(spv::OpImageWrite);
		ptr->add_id(id);
		ptr->add_id(addr);
		ptr->add_id(impl.build_splat_constant_vector(builder.makeFloatType(32), builder.makeFloatConstant(2.0f), 4));
		impl.add(ptr);

		builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);
		impl.nvapi.fake_doorbell_outputs[NVAPI_ARGUMENT_DST0U + 0] = builder.makeUintConstant(42);
	}

	impl.nvapi.marked_uav = nullptr;
	return true;
}

static bool emit_nvapi_extn_op_get_special(Converter::Impl &impl)
{
	auto *c = llvm::dyn_cast<llvm::ConstantInt>(impl.nvapi.fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0]);
	if (c != nullptr)
	{
		auto subopcode = uint32_t(c->getUniqueInteger().getZExtValue());
		auto &builder = impl.builder();

		switch (subopcode)
		{
		case NV_SPECIALOP_GLOBAL_TIMER_LO:
		case NV_SPECIALOP_GLOBAL_TIMER_HI:
		{
			builder.addExtension("SPV_KHR_shader_clock");
			builder.addCapability(spv::CapabilityShaderClockKHR);

			auto *read_op = impl.allocate(spv::OpReadClockKHR, builder.makeVectorType(builder.makeUintType(32), 2));
			read_op->add_id(builder.makeUintConstant(1));
			impl.add(read_op);

			auto *extract_op = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
			extract_op->add_id(read_op->id);
			extract_op->add_literal(subopcode - NV_SPECIALOP_GLOBAL_TIMER_LO);
			impl.add(extract_op);

			impl.nvapi.fake_doorbell_outputs[0] = extract_op->id;
			return true;
		}
		}
	}

	return false;
}

static bool emit_nvapi_extn_op_hit_object_make_miss(Converter::Impl &impl)
{
	spv::Id index = get_argument(impl, NVAPI_ARGUMENT_SRC0U + 0);
	spv::Id tmin = get_argument_as_float(impl, NVAPI_ARGUMENT_SRC0U + 1);
	spv::Id tmax = get_argument_as_float(impl, NVAPI_ARGUMENT_SRC0U + 2);

	spv::Id ray_origin[3];
	spv::Id ray_dir[3];

	for (unsigned i = 0; i < 3; i++)
	{
		ray_origin[i] = get_argument_as_float(impl, NVAPI_ARGUMENT_SRC1U + i);
		ray_dir[i] = get_argument_as_float(impl, NVAPI_ARGUMENT_SRC2U + i);
	}

	auto &builder = impl.builder();

	builder.addExtension("SPV_NV_shader_invocation_reorder");
	builder.addCapability(spv::CapabilityShaderInvocationReorderNV);

	spv::Id float32 = builder.makeFloatType(32);
	spv::Id ray_origin_vec = impl.build_vector(float32, ray_origin, 3);
	spv::Id ray_dir_vec = impl.build_vector(float32, ray_dir, 3);

	spv::Id variable = impl.create_variable(spv::StorageClassFunction, builder.makeHitObjectNVType());

	auto op = impl.allocate(spv::OpHitObjectRecordMissNV);
	op->add_id(variable);
	op->add_id(index);
	op->add_id(ray_origin_vec);
	op->add_id(tmin);
	op->add_id(ray_dir_vec);
	op->add_id(tmax);
	impl.add(op);

	impl.nvapi.fake_doorbell_outputs[0] = variable;
	return true;
}

static bool emit_nvapi_extn_op_hit_object_make_nop(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	builder.addExtension("SPV_NV_shader_invocation_reorder");
	builder.addCapability(spv::CapabilityShaderInvocationReorderNV);

	spv::Id variable = impl.create_variable(spv::StorageClassFunction, builder.makeHitObjectNVType());

	auto op = impl.allocate(spv::OpHitObjectRecordEmptyNV);
	op->add_id(variable);
	impl.add(op);

	impl.nvapi.fake_doorbell_outputs[0] = variable;
	return true;
}

static bool emit_nvapi_extn_op_rt_get_cluster_id(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	builder.addExtension("SPV_NV_cluster_acceleration_structure");
	builder.addCapability(spv::CapabilityRayTracingClusterAccelerationStructureNV);

	spv::Id id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInClusterIDNV);
	auto *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	op->add_id(id);
	impl.add(op);

	impl.nvapi.fake_doorbell_outputs[0] = op->id;
	return true;
}

static bool emit_nvapi_extn_op_rt_get_intersection_cluster_id(Converter::Impl &impl, spv::RayQueryIntersection intersection)
{
	auto *ray_flags = llvm::dyn_cast<llvm::CallInst>(impl.nvapi.fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0]);
	if (ray_flags != nullptr)
	{
		auto &builder = impl.builder();
		spv::Id ray_object_id = 0;
		if (!build_ray_query_object(impl, ray_flags->getOperand(1), ray_object_id))
			return false;

		builder.addExtension("SPV_NV_cluster_acceleration_structure");
		builder.addCapability(spv::CapabilityRayTracingClusterAccelerationStructureNV);

		auto *op = impl.allocate(spv::OpRayQueryGetClusterIdNV, builder.makeUintType(32));
		op->add_id(ray_object_id);
		op->add_id(builder.makeUintConstant(intersection));
		impl.add(op);

		impl.nvapi.fake_doorbell_outputs[0] = op->id;
		return true;
	}

	return false;
}

bool NVAPIState::can_commit_opcode()
{
	if (!fake_doorbell_inputs[NVAPI_ARGUMENT_OPCODE])
		return false;

	auto *c = llvm::dyn_cast<llvm::ConstantInt>(fake_doorbell_inputs[NVAPI_ARGUMENT_OPCODE]);
	if (c != nullptr)
	{
		auto opcode = uint32_t(c->getUniqueInteger().getZExtValue());
		switch (opcode)
		{
		case NV_EXTN_OP_SHFL:
			return fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 1] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 2] != nullptr;

		case NV_EXTN_OP_FP16_ATOMIC:
			return marked_uav &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC1U + 0] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC2U + 0] != nullptr;

		case NV_EXTN_OP_GET_SPECIAL:
			return fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0] != nullptr;

		case NV_EXTN_OP_HIT_OBJECT_MAKE_MISS:
			return fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 1] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 2] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC1U + 0] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC1U + 1] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC1U + 2] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC2U + 0] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC2U + 1] != nullptr &&
			       fake_doorbell_inputs[NVAPI_ARGUMENT_SRC2U + 2] != nullptr;

		case NV_EXTN_OP_HIT_OBJECT_MAKE_NOP:
		case NV_EXTN_OP_RT_GET_CLUSTER_ID:
			return true;

		case NV_EXTN_OP_RT_GET_CANDIDATE_CLUSTER_ID:
		case NV_EXTN_OP_RT_GET_COMMITTED_CLUSTER_ID:
			return fake_doorbell_inputs[NVAPI_ARGUMENT_SRC0U + 0] != nullptr;

		default:
			return false;
		}
	}
	else
		return false;
}

bool NVAPIState::commit_opcode(Converter::Impl &impl, bool analysis)
{
	if (!fake_doorbell_inputs[NVAPI_ARGUMENT_OPCODE])
		return false;

	auto *c = llvm::dyn_cast<llvm::ConstantInt>(fake_doorbell_inputs[NVAPI_ARGUMENT_OPCODE]);
	if (c != nullptr)
	{
		auto opcode = uint32_t(c->getUniqueInteger().getZExtValue());
		switch (opcode)
		{
		case NV_EXTN_OP_SHFL:
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_shuffle(impl))
				return false;
			break;

		case NV_EXTN_OP_FP16_ATOMIC:
			impl.nvapi.num_expected_clock_outputs = 0;
			if (!analysis && !emit_nvapi_extn_op_fp16x2_atomic(impl))
				return false;
			break;

		case NV_EXTN_OP_GET_SPECIAL:
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_get_special(impl))
				return false;
			break;

		case NV_EXTN_OP_HIT_OBJECT_MAKE_MISS:
			impl.spirv_module.set_override_spirv_version(0x10400);
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_hit_object_make_miss(impl))
				return false;
			break;

		case NV_EXTN_OP_HIT_OBJECT_MAKE_NOP:
			impl.spirv_module.set_override_spirv_version(0x10400);
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_hit_object_make_nop(impl))
				return false;
			break;

		case NV_EXTN_OP_RT_GET_CLUSTER_ID:
			impl.spirv_module.set_override_spirv_version(0x10400);
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_rt_get_cluster_id(impl))
				return false;
			break;

		case NV_EXTN_OP_RT_GET_CANDIDATE_CLUSTER_ID:
			impl.spirv_module.set_override_spirv_version(0x10400);
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_rt_get_intersection_cluster_id(impl, spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR))
				return false;
			break;

		case NV_EXTN_OP_RT_GET_COMMITTED_CLUSTER_ID:
			impl.spirv_module.set_override_spirv_version(0x10400);
			impl.nvapi.num_expected_clock_outputs = 1;
			if (!analysis && !emit_nvapi_extn_op_rt_get_intersection_cluster_id(impl, spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR))
				return false;
			break;

		default:
			return false;
		}

		return true;
	}
	else
		return false;
}

bool emit_nvapi_buffer_update_counter(Converter::Impl &impl, const llvm::CallInst *instruction, spv::Id id)
{
	if (id == impl.nvapi.magic_ptr_id)
	{
		impl.nvapi.notify_doorbell(impl, instruction, false);
		return true;
	}

	return false;
}

bool analyze_nvapi_buffer_update_counter(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (impl.options.nvapi.enabled)
	{
		auto itr = impl.llvm_value_to_uav_resource_index_map.find(instruction->getOperand(1));
		if (itr != impl.llvm_value_to_uav_resource_index_map.end())
		{
			if (itr->second == impl.nvapi.uav_magic_resource_type_index)
			{
				impl.nvapi.notify_doorbell(impl, instruction, true);
				return true;
			}
		}
	}

	return false;
}

bool nvapi_buffer_update_counter_filter(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (impl.options.nvapi.enabled)
	{
		auto itr = impl.llvm_value_to_uav_resource_index_map.find(instruction->getOperand(1));
		if (itr != impl.llvm_value_to_uav_resource_index_map.end())
			if (itr->second == impl.nvapi.uav_magic_resource_type_index)
				return true;
	}

	return false;
}

bool emit_nvapi_resource_uav_handle(Converter::Impl &impl, const llvm::CallInst *instruction, uint32_t resource_range)
{
	if (resource_range == impl.nvapi.uav_magic_resource_type_index)
	{
		// Resources tied to constant uints are considered "magic".
		if (impl.nvapi.magic_ptr_id == 0)
		{
			spv::Id dummy_value = impl.spirv_module.allocate_id();
			impl.nvapi.magic_ptr_id = dummy_value;
		}

		impl.rewrite_value(instruction, impl.nvapi.magic_ptr_id);
		return true;
	}

	return false;
}

bool analyze_nvapi_buffer_load(Converter::Impl &impl, const llvm::CallInst *instruction, AccessTracking *)
{
	if (impl.options.nvapi.enabled &&
	    impl.nvapi.uav_magic_resource_type_index != NVAPI_MAGIC_RESOURCE_SENTINEL &&
	    instruction->getOperand(2) == impl.nvapi.doorbell)
	{
		return true;
	}

	return false;
}

void analyze_nvapi_buffer_store(Converter::Impl &impl, const llvm::CallInst *instruction,
                                AccessTracking *, DXIL::Op)
{
	// We don't have the magic_ptr_id yet, but if we write with the doorbell value, we're very sure.
	if (impl.options.nvapi.enabled &&
	    impl.nvapi.uav_magic_resource_type_index != NVAPI_MAGIC_RESOURCE_SENTINEL &&
	    instruction->getOperand(2) == impl.nvapi.doorbell)
	{
		if (!impl.nvapi.mark_uav_write(instruction))
			impl.nvapi.write_arguments_from_store(impl, instruction, true);
	}
}

bool emit_nvapi_buffer_load(Converter::Impl &impl, const llvm::CallInst *instruction, DXIL::Op)
{
	// This can clock out arguments.
	if (impl.get_id_for_value(instruction->getOperand(1)) == impl.nvapi.magic_ptr_id &&
	    instruction->getOperand(2) == impl.nvapi.doorbell)
	{
		uint32_t offset;
		if (!get_constant_operand(instruction, 3, &offset))
			return false;

		if (offset & 3)
		{
			LOGE("NVAPI offset is not aligned by 4 bytes.\n");
			return false;
		}

		offset /= 4;

		if (offset >= NVAPI_ARGUMENT_COUNT)
		{
			LOGE("NVAPI offset is too large.\n");
			return false;
		}

		if (impl.nvapi.fake_doorbell_outputs[offset] == 0)
		{
			LOGE("Output argument is empty.\n");
			return false;
		}

		impl.rewrite_value(instruction, impl.nvapi.fake_doorbell_outputs[offset]);
		// TODO
		impl.llvm_composite_meta[instruction].components = 1;
		impl.llvm_composite_meta[instruction].forced_composite = false;
		return true;
	}

	return false;
}

bool NVAPIState::mark_uav_write(const llvm::CallInst *instruction)
{
	auto *mark = fake_doorbell_inputs[NVAPI_ARGUMENT_MARK_UAV_REF];
	if (mark != nullptr)
	{
		const auto *c = llvm::dyn_cast<llvm::ConstantInt>(mark);
		if (c != nullptr)
		{
			if (c->getUniqueInteger().getZExtValue() == 1)
			{
				// This completes an operation.
				marked_uav = instruction->getOperand(1);
				reset();
				return true;
			}
		}
	}

	return false;
}

bool NVAPIState::write_arguments_from_store(Converter::Impl &impl, const llvm::CallInst *instruction, bool analysis)
{
	uint32_t offset;
	if (!get_constant_operand(instruction, 3, &offset))
		return false;

	uint32_t mask;
	if (!get_constant_operand(instruction, 8, &mask))
		return false;

	if (offset & 3)
	{
		LOGE("NVAPI offset is not aligned by 4 bytes.\n");
		return false;
	}

	offset /= 4;

	if (offset >= NVAPI_ARGUMENT_COUNT)
	{
		LOGE("NVAPI offset is too large.\n");
		return false;
	}

	for (unsigned i = 0; i < 4; i++)
	{
		if (mask & (1u << i))
			fake_doorbell_inputs[offset + i] = instruction->getOperand(4 + i);
	}

	if (can_commit_opcode())
		commit_opcode(impl, analysis);

	return true;
}

bool emit_nvapi_buffer_store(Converter::Impl &impl, const llvm::CallInst *instruction, spv::Id id)
{
	if (instruction->getOperand(2) == impl.nvapi.doorbell)
	{
		if (id == impl.nvapi.magic_ptr_id)
			return impl.nvapi.write_arguments_from_store(impl, instruction, false);
		else
			return impl.nvapi.mark_uav_write(instruction);
	}

	return false;
}
}