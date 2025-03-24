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

#include "spirv_module.hpp"
#include "descriptor_qa.hpp"
#include "spirv_module_instrumentation.hpp"
#include "SpvBuilder.h"
#include "node.hpp"
#include "scratch_pool.hpp"
#include "logging.hpp"

namespace dxil_spv
{
constexpr uint32_t GENERATOR = 1967215134;
struct SPIRVModule::Impl : BlockEmissionInterface
{
	explicit Impl(SPIRVModule &module)
	    : self(module), builder(GENERATOR, &build_logger)
	{
	}

	SPIRVModule &self;

	spv::SpvBuildLogger build_logger;
	spv::Builder builder;
	spv::Function *entry_function = nullptr;
	spv::Function *active_function = nullptr;
	spv::Instruction *entry_point = nullptr;

	void emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage);
	bool finalize_spirv(Vector<uint32_t> &spirv);

	void register_block(CFGNode *node) override;
	void emit_basic_block(CFGNode *node) override;
	void emit_entry_point_function_body(CFGStructurizer &structurizer);
	void emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer);
	static spv::Block *get_spv_block(CFGNode *node);

	void enable_shader_discard(bool supports_demote);
	void build_discard_call_early();
	void build_discard_call_early_cond(spv::Id cond);
	void build_demote_call_cond(spv::Id cond);
	void build_discard_call_exit();
	spv::Id build_descriptor_qa_check(SPIRVModule &module);
	spv::Id build_wave_match(SPIRVModule &module, spv::Id type_id);
	spv::Id build_wave_is_first_lane_masked(SPIRVModule &module);
	spv::Id build_wave_active_all_equal_masked(SPIRVModule &module, spv::Id type_id);
	spv::Id build_wave_read_first_lane_masked(SPIRVModule &module, spv::Id type_id);
	spv::Id build_wave_multi_prefix_count_bits(SPIRVModule &module);
	spv::Id build_wave_multi_prefix_op(SPIRVModule &module, spv::Op opcode, spv::Id type_id);
	spv::Id build_robust_physical_cbv_load(SPIRVModule &module, spv::Id type_id, spv::Id ptr_type_id, unsigned alignment);
	spv::Id build_robust_atomic_counter_op(SPIRVModule &module);
	spv::Id build_quad_all(SPIRVModule &module);
	spv::Id build_quad_any(SPIRVModule &module);
	spv::Id build_quad_vote(SPIRVModule &module, HelperCall call);
	spv::Id build_image_atomic_r64_compact(SPIRVModule &module, bool array, bool non_uniform);
	spv::Id build_finish_cross_group_sharing(SPIRVModule &module);
	spv::Id build_allocate_node_records(SPIRVModule &module, bool per_thread);
	spv::Id build_increment_node_count(SPIRVModule &module, bool per_thread);
	spv::Id build_allocate_node_records_waterfall(SPIRVModule &module);
	spv::Id build_node_coalesce_payload_offset(SPIRVModule &module, const spv::Id *ids, uint32_t id_count);
	spv::Id build_is_quad_uniform_control_flow(SPIRVModule &module);
	spv::Id build_validate_bda_load_store(SPIRVModule &module);
	spv::Id build_allocate_invocation_id(SPIRVModule &module);
	spv::Function *discard_function = nullptr;
	spv::Function *discard_function_cond = nullptr;
	spv::Function *demote_function_cond = nullptr;
	spv::Id discard_state_var_id = 0;
	spv::ExecutionModel execution_model = spv::ExecutionModelMax;

	spv::Id create_variable(spv::StorageClass storage, spv::Id type, const char *name);
	spv::Id create_variable_with_initializer(spv::StorageClass storage, spv::Id type,
	                                         spv::Id initializer, const char *name);
	void register_active_variable(spv::StorageClass storage, spv::Id id);

	struct
	{
		bool supports_demote = false;
	} caps;

	spv::Id get_builtin_shader_input(spv::BuiltIn builtin);
	spv::Id get_builtin_shader_output(spv::BuiltIn builtin);
	bool has_builtin_shader_input(spv::BuiltIn builtin) const;
	bool has_builtin_shader_output(spv::BuiltIn builtin) const;
	void register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const;
	void register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const;
	UnorderedMap<spv::BuiltIn, spv::Id> builtins_input;
	UnorderedMap<spv::Id, spv::BuiltIn> id_to_builtin_input;
	UnorderedMap<spv::BuiltIn, spv::Id> builtins_output;
	UnorderedMap<spv::Id, spv::BuiltIn> id_to_builtin_output;

	spv::Id get_type_for_builtin(spv::BuiltIn builtin, bool &requires_flat_decoration);
	ScratchPool<Operation> operation_pool;

	bool spirv_requires_14() const;
	bool builtin_requires_volatile(spv::BuiltIn builtin) const;
	bool execution_model_is_ray_tracing() const;
	bool mark_error = false;

	spv::Id get_helper_call_id(SPIRVModule &module, HelperCall call, spv::Id type_id);
	spv::Id get_helper_call_id(SPIRVModule &module, HelperCall call, const spv::Id *aux_ids, uint32_t aux_id_count);
	spv::Id descriptor_qa_helper_call_id = 0;
	spv::Id wave_multi_prefix_count_bits_id = 0;
	spv::Id robust_atomic_counter_call_id = 0;
	spv::Id quad_all_call_id = 0;
	spv::Id quad_any_call_id = 0;
	spv::Id wave_is_first_lane_masked_id = 0;
	Vector<std::pair<spv::Id, spv::Id>> wave_match_call_ids;
	Vector<std::pair<spv::Id, spv::Id>> wave_active_all_equal_masked_ids;
	Vector<std::pair<spv::Id, spv::Id>> wave_read_first_lane_masked_ids;
	spv::Id image_r64_atomic_call_id = 0;
	spv::Id image_r64_array_atomic_call_id = 0;
	spv::Id image_r64_atomic_non_uniform_call_id = 0;
	spv::Id image_r64_array_atomic_non_uniform_call_id = 0;
	spv::Id finish_cross_group_sharing_call_id = 0;
	spv::Id allocate_thread_node_records_call_id = 0;
	spv::Id allocate_group_node_records_call_id = 0;
	spv::Id increment_thread_node_count_call_id = 0;
	spv::Id increment_group_node_count_call_id = 0;
	spv::Id allocate_thread_node_records_waterfall_call_id = 0;
	spv::Id node_coalesce_payload_offset_call_id = 0;
	spv::Id is_quad_uniform_call_id = 0;
	spv::Id validate_bda_load_store_call_id = 0;
	spv::Id allocate_invocation_id_call_id = 0;

	struct MultiPrefixOp
	{
		spv::Op opcode;
		spv::Id type_id;
		spv::Id func_id;
	};
	Vector<MultiPrefixOp> wave_multi_prefix_call_ids;

	struct CBVOp
	{
		spv::Id type_id;
		spv::Id ptr_type_id;
		unsigned alignment;
		spv::Id func_id;
	};
	Vector<CBVOp> physical_cbv_call_ids;

	DescriptorQAInfo descriptor_qa_info;

	uint32_t override_spirv_version = 0;
	bool helper_lanes_participate_in_wave_ops = true;

	void add_instruction(spv::Block *bb, std::unique_ptr<spv::Instruction> inst);
	void add_instrumented_instruction(spv::Op op, spv::Block *bb, spv::Id id);
	InstructionInstrumentationState instruction_instrumentation;
};

spv::Id SPIRVModule::Impl::get_type_for_builtin(spv::BuiltIn builtin, bool &requires_flat)
{
	requires_flat = false;
	switch (builtin)
	{
	case spv::BuiltInSampleMask:
		requires_flat = true;
		return builder.makeArrayType(builder.makeUintType(32), builder.makeUintConstant(1), 0);

	case spv::BuiltInTessCoord:
		return builder.makeVectorType(builder.makeFloatType(32), 3);

	case spv::BuiltInLocalInvocationIndex:
	case spv::BuiltInSampleId:
	case spv::BuiltInVertexIndex:
	case spv::BuiltInInstanceIndex:
	case spv::BuiltInBaseVertex:
	case spv::BuiltInBaseInstance:
	case spv::BuiltInInvocationId:
	case spv::BuiltInPrimitiveId:
	case spv::BuiltInShadingRateKHR:
	case spv::BuiltInPrimitiveShadingRateKHR:
	case spv::BuiltInViewIndex:
		requires_flat = true;
		return builder.makeUintType(32);

	case spv::BuiltInSubgroupSize:
	case spv::BuiltInNumSubgroups:
	case spv::BuiltInSubgroupLocalInvocationId:
		builder.addCapability(spv::CapabilityGroupNonUniform);
		requires_flat = true;
		return builder.makeUintType(32);

	case spv::BuiltInGlobalInvocationId:
	case spv::BuiltInLocalInvocationId:
	case spv::BuiltInWorkgroupId:
	case spv::BuiltInLaunchIdKHR:
	case spv::BuiltInLaunchSizeKHR:
	case spv::BuiltInNumWorkgroups:
		return builder.makeVectorType(builder.makeUintType(32), 3);

	case spv::BuiltInObjectRayOriginKHR:
	case spv::BuiltInWorldRayOriginKHR:
	case spv::BuiltInObjectRayDirectionKHR:
	case spv::BuiltInWorldRayDirectionKHR:
		return builder.makeVectorType(builder.makeFloatType(32), 3);

	case spv::BuiltInRayTminKHR:
	case spv::BuiltInRayTmaxKHR:
		return builder.makeFloatType(32);

	case spv::BuiltInWorldToObjectKHR:
	case spv::BuiltInObjectToWorldKHR:
		return builder.makeMatrixType(builder.makeFloatType(32), 4, 3);

	case spv::BuiltInInstanceCustomIndexKHR:
	case spv::BuiltInInstanceId:
	case spv::BuiltInRayGeometryIndexKHR:
	case spv::BuiltInIncomingRayFlagsKHR:
	case spv::BuiltInHitKindKHR:
		requires_flat = true;
		return builder.makeUintType(32);

	case spv::BuiltInHelperInvocation:
	case spv::BuiltInFullyCoveredEXT:
		return builder.makeBoolType();

	default:
		return 0;
	}
}

void SPIRVModule::Impl::register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin)
{
	builtins_input[builtin] = id;
	id_to_builtin_input[id] = builtin;
}

void SPIRVModule::Impl::register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin)
{
	builtins_output[builtin] = id;
	id_to_builtin_output[id] = builtin;
}

bool SPIRVModule::Impl::query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const
{
	auto itr = id_to_builtin_input.find(id);
	if (itr != id_to_builtin_input.end())
	{
		*builtin = itr->second;
		return true;
	}
	else
		return false;
}

bool SPIRVModule::Impl::query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const
{
	auto itr = id_to_builtin_output.find(id);
	if (itr != id_to_builtin_output.end())
	{
		*builtin = itr->second;
		return true;
	}
	else
		return false;
}

bool SPIRVModule::Impl::builtin_requires_volatile(spv::BuiltIn builtin) const
{
	if (!execution_model_is_ray_tracing())
		return false;

	switch (builtin)
	{
	case spv::BuiltInSubgroupId:
	case spv::BuiltInSubgroupLocalInvocationId:
	case spv::BuiltInSubgroupEqMask:
	case spv::BuiltInSubgroupLtMask:
	case spv::BuiltInSubgroupLeMask:
	case spv::BuiltInSubgroupGtMask:
	case spv::BuiltInSubgroupGeMask:
		return true;

	case spv::BuiltInRayTmaxKHR:
		return execution_model == spv::ExecutionModelIntersectionKHR;

	default:
		return false;
	}
}

bool SPIRVModule::Impl::has_builtin_shader_input(spv::BuiltIn builtin) const
{
	return builtins_input.count(builtin) != 0;
}

bool SPIRVModule::Impl::has_builtin_shader_output(spv::BuiltIn builtin) const
{
	return builtins_output.count(builtin) != 0;
}

spv::Id SPIRVModule::Impl::get_builtin_shader_input(spv::BuiltIn builtin)
{
	auto itr = builtins_input.find(builtin);
	if (itr != builtins_input.end())
		return itr->second;

	bool requires_flat = false;
	spv::Id var_id = create_variable(spv::StorageClassInput, get_type_for_builtin(builtin, requires_flat), nullptr);
	builder.addDecoration(var_id, spv::DecorationBuiltIn, builtin);
	if (builtin_requires_volatile(builtin))
		builder.addDecoration(var_id, spv::DecorationVolatile);

	// VUID-StandaloneSpirv-Flat-04744
	if (requires_flat && execution_model == spv::ExecutionModelFragment)
		builder.addDecoration(var_id, spv::DecorationFlat);
	register_builtin_shader_input(var_id, builtin);
	return var_id;
}

spv::Id SPIRVModule::Impl::get_builtin_shader_output(spv::BuiltIn builtin)
{
	auto itr = builtins_output.find(builtin);
	if (itr != builtins_output.end())
		return itr->second;
	else
		return 0;
}

spv::Block *SPIRVModule::Impl::get_spv_block(CFGNode *node)
{
	assert(node->userdata);
	return static_cast<spv::Block *>(node->userdata);
}

void SPIRVModule::Impl::emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage)
{
	execution_model = model;
	builder.addCapability(spv::Capability::CapabilityShader);

	if (physical_storage)
	{
		builder.setMemoryModel(spv::AddressingModel::AddressingModelPhysicalStorageBuffer64, spv::MemoryModelGLSL450);
		builder.addCapability(spv::CapabilityPhysicalStorageBufferAddresses);
		builder.addExtension("SPV_KHR_physical_storage_buffer");
	}
	else
		builder.setMemoryModel(spv::AddressingModel::AddressingModelLogical, spv::MemoryModel::MemoryModelGLSL450);

	entry_function = builder.makeEntryPoint("main");
	entry_point = builder.addEntryPoint(model, entry_function, name);
	if (model == spv::ExecutionModel::ExecutionModelFragment)
		builder.addExecutionMode(entry_function, spv::ExecutionModeOriginUpperLeft);

	if (instruction_instrumentation.info.enabled)
	{
		builder.addExtension("SPV_KHR_float_controls");
		builder.addCapability(spv::CapabilitySignedZeroInfNanPreserve);

		if (instruction_instrumentation.info.fp16)
		{
			builder.addCapability(spv::CapabilityFloat16);
			builder.addExecutionMode(entry_function, spv::ExecutionModeSignedZeroInfNanPreserve, 16);
		}

		if (instruction_instrumentation.info.fp32)
			builder.addExecutionMode(entry_function, spv::ExecutionModeSignedZeroInfNanPreserve, 32);

		if (instruction_instrumentation.info.fp64)
			builder.addExecutionMode(entry_function, spv::ExecutionModeSignedZeroInfNanPreserve, 64);
	}
}

void SPIRVModule::Impl::enable_shader_discard(bool supports_demote)
{
	caps.supports_demote = supports_demote;
	if (!discard_state_var_id && !caps.supports_demote)
	{
		auto *current_build_point = builder.getBuildPoint();
		discard_state_var_id =
		    create_variable(spv::StorageClassPrivate, builder.makeBoolType(), "discard_state");
		builder.setBuildPoint(entry_function->getEntryBlock());
		builder.createStore(builder.makeBoolConstant(false), discard_state_var_id);
		builder.setBuildPoint(current_build_point);
	}
}

void SPIRVModule::Impl::build_discard_call_early()
{
	builder.createStore(builder.makeBoolConstant(true), discard_state_var_id);
}

void SPIRVModule::Impl::build_demote_call_cond(spv::Id cond)
{
	auto *current_build_point = builder.getBuildPoint();

	if (!demote_function_cond)
	{
		spv::Block *entry = nullptr;
		demote_function_cond =
			builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(), "demote_cond",
		                              { builder.makeBoolType() }, {}, &entry);

		auto *true_block = new spv::Block(builder.getUniqueId(), *demote_function_cond);
		auto *false_block = new spv::Block(builder.getUniqueId(), *demote_function_cond);
		builder.setBuildPoint(entry);
		builder.createSelectionMerge(false_block, 0);
		builder.createConditionalBranch(demote_function_cond->getParamId(0), true_block, false_block);
		add_instruction(true_block, std::make_unique<spv::Instruction>(spv::OpDemoteToHelperInvocationEXT));
		builder.setBuildPoint(true_block);
		builder.createBranch(false_block);
		builder.setBuildPoint(false_block);
		builder.makeReturn(false);
	}

	builder.setBuildPoint(current_build_point);
	builder.createFunctionCall(demote_function_cond, { cond });
}

void SPIRVModule::Impl::build_discard_call_early_cond(spv::Id cond)
{
	auto *current_build_point = builder.getBuildPoint();

	if (!discard_function_cond)
	{
		spv::Block *entry = nullptr;
		discard_function_cond =
			builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(), "discard_cond",
			                          { builder.makeBoolType() }, {}, &entry);

		auto *true_block = new spv::Block(builder.getUniqueId(), *discard_function_cond);
		auto *false_block = new spv::Block(builder.getUniqueId(), *discard_function_cond);
		builder.setBuildPoint(entry);
		builder.createSelectionMerge(false_block, 0);
		builder.createConditionalBranch(discard_function_cond->getParamId(0), true_block, false_block);
		builder.setBuildPoint(true_block);
		builder.createStore(builder.makeBoolConstant(true), discard_state_var_id);
		builder.createBranch(false_block);
		builder.setBuildPoint(false_block);
		builder.makeReturn(false);
	}

	builder.setBuildPoint(current_build_point);
	builder.createFunctionCall(discard_function_cond, { cond });
}

void SPIRVModule::Impl::build_discard_call_exit()
{
	auto *current_build_point = builder.getBuildPoint();

	if (!discard_function)
	{
		spv::Block *entry = nullptr;
		discard_function =
		    builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(), "discard_exit", {}, {}, &entry);

		auto *true_block = new spv::Block(builder.getUniqueId(), *discard_function);
		auto *false_block = new spv::Block(builder.getUniqueId(), *discard_function);

		builder.setBuildPoint(entry);
		spv::Id loaded_state = builder.createLoad(discard_state_var_id);
		builder.createSelectionMerge(false_block, 0);
		builder.createConditionalBranch(loaded_state, true_block, false_block);
		add_instruction(true_block, std::make_unique<spv::Instruction>(spv::OpKill));
		builder.setBuildPoint(false_block);
		builder.makeReturn(false);
	}

	builder.setBuildPoint(current_build_point);
	builder.createFunctionCall(discard_function, {});
}

spv::Id SPIRVModule::Impl::build_descriptor_qa_check(SPIRVModule &module)
{
	if (!descriptor_qa_helper_call_id)
		descriptor_qa_helper_call_id = build_descriptor_qa_check_function(module);
	return descriptor_qa_helper_call_id;
}

spv::Id SPIRVModule::Impl::build_validate_bda_load_store(SPIRVModule &module)
{
	if (!validate_bda_load_store_call_id)
	{
		validate_bda_load_store_call_id = build_validate_bda_load_store_function(
			module,
			instruction_instrumentation.info.control_desc_set,
			instruction_instrumentation.info.control_binding);
	}

	return validate_bda_load_store_call_id;
}

spv::Id SPIRVModule::Impl::build_allocate_invocation_id(SPIRVModule &module)
{
	if (!allocate_invocation_id_call_id)
	{
		allocate_invocation_id_call_id = build_allocate_invocation_id_function(
		    module,
		    instruction_instrumentation.info.control_desc_set,
		    instruction_instrumentation.info.control_binding);
	}

	return allocate_invocation_id_call_id;
}

static const char *opcode_to_multi_prefix_name(spv::Op opcode)
{
	switch (opcode)
	{
	case spv::OpGroupNonUniformFAdd:
	case spv::OpGroupNonUniformIAdd:
		return "WaveMultiPrefixSum";

	case spv::OpGroupNonUniformFMul:
	case spv::OpGroupNonUniformIMul:
		return "WaveMultiPrefixProduct";

	case spv::OpGroupNonUniformBitwiseAnd:
		return "WaveMultiPrefixBitAnd";
	case spv::OpGroupNonUniformBitwiseOr:
		return "WaveMultiPrefixBitOr";
	case spv::OpGroupNonUniformBitwiseXor:
		return "WaveMultiPrefixBitXor";

	default:
		return "";
	}
}

spv::Id SPIRVModule::Impl::build_wave_multi_prefix_op(SPIRVModule &module, spv::Op opcode, spv::Id type_id)
{
	for (auto &call : wave_multi_prefix_call_ids)
		if (call.opcode == opcode && call.type_id == type_id)
			return call.func_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec4_type = builder.makeVectorType(uint_type, 4);
	spv::Id bool_type = builder.makeBoolType();
	spv::Id bvec4_type = builder.makeVectorType(bool_type, 4);

	Vector<spv::Id> types = { type_id, uvec4_type };
	if (!helper_lanes_participate_in_wave_ops)
		types.push_back(bool_type);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, type_id,
	                                       opcode_to_multi_prefix_name(opcode),
	                                       types, {}, &entry);
	spv::Id value_id = func->getParamId(0);
	spv::Id mask_id = func->getParamId(1);
	spv::Id undef_value = builder.createUndefined(type_id);

	spv::Block *outer_entry = nullptr;
	spv::Block *return_block = nullptr;
	auto *header_block = new spv::Block(builder.getUniqueId(), *func);
	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *prefix_block = new spv::Block(builder.getUniqueId(), *func);
	auto *continue_block = new spv::Block(builder.getUniqueId(), *func);

	builder.setBuildPoint(entry);

	if (!helper_lanes_participate_in_wave_ops)
	{
		return_block = new spv::Block(builder.getUniqueId(), *func);
		auto *inner_entry_block = new spv::Block(builder.getUniqueId(), *func);

		builder.createSelectionMerge(return_block, 0);
		builder.createConditionalBranch(func->getParamId(2), return_block, inner_entry_block);
		outer_entry = entry;
		entry = inner_entry_block;
		builder.setBuildPoint(entry);
	}

	{
		auto ballot_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBallot);
		ballot_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		ballot_op->addIdOperand(builder.makeBoolConstant(true));
		auto mask_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpBitwiseAnd);
		mask_op->addIdOperand(ballot_op->getResultId());
		mask_op->addIdOperand(mask_id);
		mask_id = mask_op->getResultId();
		add_instruction(entry, std::move(ballot_op));
		add_instruction(entry, std::move(mask_op));
		builder.createBranch(header_block);
	}

	builder.setBuildPoint(header_block);
	{
		builder.createLoopMerge(merge_block, body_block, 0);
		builder.createBranch(body_block);
	}

	builder.setBuildPoint(body_block);
	spv::Id compare_reduce_id;
	{
		auto broadcast_first = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBroadcastFirst);
		broadcast_first->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		broadcast_first->addIdOperand(mask_id);

		auto compare = std::make_unique<spv::Instruction>(builder.getUniqueId(), bvec4_type, spv::OpIEqual);
		compare->addIdOperand(mask_id);
		compare->addIdOperand(broadcast_first->getResultId());

		auto compare_reduce = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpAll);
		compare_reduce->addIdOperand(compare->getResultId());
		compare_reduce_id = compare_reduce->getResultId();

		add_instruction(body_block, std::move(broadcast_first));
		add_instruction(body_block, std::move(compare));
		add_instruction(body_block, std::move(compare_reduce));
		builder.createSelectionMerge(continue_block, 0);
		builder.createConditionalBranch(compare_reduce_id, prefix_block, continue_block);
	}

	spv::Id result_id;
	builder.setBuildPoint(prefix_block);
	{
		auto prefix_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), type_id, opcode);
		prefix_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		prefix_op->addImmediateOperand(spv::GroupOperationExclusiveScan);
		prefix_op->addIdOperand(value_id);
		result_id = prefix_op->getResultId();
		add_instruction(prefix_block, std::move(prefix_op));
		builder.createBranch(continue_block);
	}

	builder.setBuildPoint(continue_block);
	{
		auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), type_id, spv::OpPhi);
		phi->addIdOperand(result_id);
		phi->addIdOperand(prefix_block->getId());
		phi->addIdOperand(undef_value);
		phi->addIdOperand(body_block->getId());
		result_id = phi->getResultId();
		add_instruction(continue_block, std::move(phi));
		builder.createConditionalBranch(compare_reduce_id, merge_block, header_block);
	}

	builder.setBuildPoint(merge_block);

	if (return_block)
	{
		builder.createBranch(return_block);
		builder.setBuildPoint(return_block);

		auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), type_id, spv::OpPhi);
		phi->addIdOperand(result_id);
		phi->addIdOperand(merge_block->getId());
		phi->addIdOperand(undef_value);
		phi->addIdOperand(outer_entry->getId());
		result_id = phi->getResultId();
		add_instruction(return_block, std::move(phi));
	}

	builder.makeReturn(false, result_id);

	builder.setBuildPoint(current_build_point);
	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	wave_multi_prefix_call_ids.push_back({ opcode, type_id, func->getId() });
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_wave_multi_prefix_count_bits(SPIRVModule &module)
{
	if (wave_multi_prefix_count_bits_id)
		return wave_multi_prefix_count_bits_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec4_type = builder.makeVectorType(uint_type, 4);
	spv::Id bool_type = builder.makeBoolType();
	spv::Id bvec4_type = builder.makeVectorType(bool_type, 4);

	spv::Block *entry = nullptr;
	Vector<spv::Id> types = { bool_type, uvec4_type };
	if (!helper_lanes_participate_in_wave_ops)
		types.push_back(bool_type);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uint_type,
	                                       "WaveMultiPrefixCountBits",
	                                       types, {}, &entry);
	spv::Id value_id = func->getParamId(0);
	spv::Id mask_id = func->getParamId(1);
	auto *header_block = new spv::Block(builder.getUniqueId(), *func);
	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	spv::Block *outer_entry = nullptr;
	spv::Block *return_block = nullptr;
	spv::Id undef_id = 0;

	builder.setBuildPoint(entry);

	if (!helper_lanes_participate_in_wave_ops)
	{
		return_block = new spv::Block(builder.getUniqueId(), *func);
		auto *inner_entry_block = new spv::Block(builder.getUniqueId(), *func);
		undef_id = builder.createUndefined(uint_type);
		builder.createSelectionMerge(return_block, 0);
		builder.createConditionalBranch(func->getParamId(2), return_block, inner_entry_block);
		outer_entry = entry;
		entry = inner_entry_block;
		builder.setBuildPoint(entry);
	}

	{
		auto ballot_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBallot);
		ballot_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		ballot_op->addIdOperand(builder.makeBoolConstant(true));
		auto mask_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpBitwiseAnd);
		mask_op->addIdOperand(ballot_op->getResultId());
		mask_op->addIdOperand(mask_id);
		mask_id = mask_op->getResultId();
		add_instruction(entry, std::move(ballot_op));
		add_instruction(entry, std::move(mask_op));
		builder.createBranch(header_block);
	}

	builder.setBuildPoint(header_block);
	{
		builder.createLoopMerge(merge_block, body_block, 0);
		builder.createBranch(body_block);
	}

	spv::Id result_id;
	builder.setBuildPoint(body_block);
	{
		auto broadcast_first =
		    std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBroadcastFirst);
		broadcast_first->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		broadcast_first->addIdOperand(mask_id);

		auto compare = std::make_unique<spv::Instruction>(builder.getUniqueId(), bvec4_type, spv::OpIEqual);
		compare->addIdOperand(mask_id);
		compare->addIdOperand(broadcast_first->getResultId());

		auto compare_reduce = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpAll);
		compare_reduce->addIdOperand(compare->getResultId());
		spv::Id compare_reduce_id = compare_reduce->getResultId();

		auto prefix_input = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLogicalAnd);
		prefix_input->addIdOperand(compare_reduce_id);
		prefix_input->addIdOperand(value_id);

		auto modified_ballot =
		    std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBallot);
		modified_ballot->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		modified_ballot->addIdOperand(prefix_input->getResultId());
		auto count =
		    std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpGroupNonUniformBallotBitCount);
		count->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		count->addImmediateOperand(spv::GroupOperationExclusiveScan);
		count->addIdOperand(modified_ballot->getResultId());
		result_id = count->getResultId();

		add_instruction(body_block, std::move(broadcast_first));
		add_instruction(body_block, std::move(compare));
		add_instruction(body_block, std::move(compare_reduce));
		add_instruction(body_block, std::move(prefix_input));
		add_instruction(body_block, std::move(modified_ballot));
		add_instruction(body_block, std::move(count));
		builder.createConditionalBranch(compare_reduce_id, merge_block, header_block);
	}

	builder.setBuildPoint(merge_block);

	if (return_block)
	{
		builder.createBranch(return_block);
		builder.setBuildPoint(return_block);

		auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpPhi);
		phi->addIdOperand(result_id);
		phi->addIdOperand(merge_block->getId());
		phi->addIdOperand(undef_id);
		phi->addIdOperand(outer_entry->getId());
		result_id = phi->getResultId();
		add_instruction(return_block, std::move(phi));
	}

	builder.makeReturn(false, result_id);
	builder.setBuildPoint(current_build_point);

	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	wave_multi_prefix_count_bits_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_wave_active_all_equal_masked(SPIRVModule &module, spv::Id type_id)
{
	for (auto &calls : wave_active_all_equal_masked_ids)
		if (calls.first == type_id)
			return calls.second;

	builder.addCapability(spv::CapabilityGroupNonUniformVote);
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, bool_type,
	                                       "WaveActiveAllEqual",
	                                       { type_id, bool_type }, {}, &entry);

	auto *is_helper_block = new spv::Block(builder.getUniqueId(), *func);
	auto *is_active_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	spv::Id equal_id, undef_id;

	builder.setBuildPoint(entry);

	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(func->getParamId(1), is_helper_block, is_active_block);

	{
		builder.setBuildPoint(is_helper_block);
		// Assist in scalar promotion, if we set something concrete, we will force VGPR.
		undef_id = builder.createUndefined(bool_type);
		builder.createBranch(merge_block);
	}

	{
		builder.setBuildPoint(is_active_block);
		auto all_equal = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpGroupNonUniformAllEqual);
		all_equal->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		all_equal->addIdOperand(func->getParamId(0));
		equal_id = all_equal->getResultId();
		add_instruction(is_active_block, std::move(all_equal));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpPhi);
	phi->addIdOperand(equal_id);
	phi->addIdOperand(is_active_block->getId());
	phi->addIdOperand(undef_id);
	phi->addIdOperand(is_helper_block->getId());
	equal_id = phi->getResultId();
	add_instruction(merge_block, std::move(phi));

	builder.makeReturn(false, equal_id);
	builder.setBuildPoint(current_build_point);
	wave_active_all_equal_masked_ids.emplace_back(type_id, func->getId());
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_wave_read_first_lane_masked(SPIRVModule &module, spv::Id type_id)
{
	for (auto &calls : wave_read_first_lane_masked_ids)
		if (calls.first == type_id)
			return calls.second;

	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	builder.addCapability(spv::CapabilityGroupNonUniformShuffle);
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, type_id,
	                                       "WaveReadFirstLane",
	                                       { type_id, bool_type }, {}, &entry);

	builder.setBuildPoint(entry);

	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec4_type = builder.makeVectorType(uint_type, 4);

	// Shuffle path is more robust since it will avoid undefs.
	// Also matches codegen on AMD.
	// The branchy style where helpers receive undefs confuses NV it seems ...

	auto not_inst = std::make_unique<spv::Instruction>(
		builder.getUniqueId(), bool_type, spv::OpLogicalNot);
	not_inst->addIdOperand(func->getParamId(1));

	auto ballot = std::make_unique<spv::Instruction>(
		builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBallot);
	ballot->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	ballot->addIdOperand(not_inst->getResultId());

	auto lsb = std::make_unique<spv::Instruction>(
		builder.getUniqueId(), builder.makeUintType(32), spv::OpGroupNonUniformBallotFindLSB);
	lsb->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	lsb->addIdOperand(ballot->getResultId());

	auto shuffle = std::make_unique<spv::Instruction>(
		builder.getUniqueId(), type_id, spv::OpGroupNonUniformShuffle);
	shuffle->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	shuffle->addIdOperand(func->getParamId(0));
	shuffle->addIdOperand(lsb->getResultId());

	// Undocumented requirement, if all lanes are helpers, 0 is returned.
	auto ballot_real_lane_count = std::make_unique<spv::Instruction>(
	    builder.getUniqueId(), uint_type, spv::OpGroupNonUniformBallotBitCount);
	ballot_real_lane_count->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	ballot_real_lane_count->addImmediateOperand(spv::GroupOperationReduce);
	ballot_real_lane_count->addIdOperand(ballot->getResultId());
	auto ballot_has_real_lane = std::make_unique<spv::Instruction>(
		builder.getUniqueId(), bool_type, spv::OpINotEqual);
	ballot_has_real_lane->addIdOperand(ballot_real_lane_count->getResultId());
	ballot_has_real_lane->addIdOperand(builder.makeUintConstant(0));

	auto select_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), type_id, spv::OpSelect);
	select_op->addIdOperand(ballot_has_real_lane->getResultId());
	select_op->addIdOperand(shuffle->getResultId());
	select_op->addIdOperand(builder.makeNullConstant(type_id));
	spv::Id ret_id = select_op->getResultId();

	add_instruction(entry, std::move(not_inst));
	add_instruction(entry, std::move(ballot));
	add_instruction(entry, std::move(lsb));
	add_instruction(entry, std::move(shuffle));
	add_instruction(entry, std::move(ballot_real_lane_count));
	add_instruction(entry, std::move(ballot_has_real_lane));
	add_instruction(entry, std::move(select_op));
	builder.makeReturn(false, ret_id);

	builder.setBuildPoint(current_build_point);
	wave_read_first_lane_masked_ids.emplace_back(type_id, func->getId());
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_wave_is_first_lane_masked(SPIRVModule &module)
{
	if (wave_is_first_lane_masked_id)
		return wave_is_first_lane_masked_id;

	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();

	auto *current_build_point = builder.getBuildPoint();
	builder.addCapability(spv::CapabilityGroupNonUniform);

	auto *func = builder.makeFunctionEntry(spv::NoPrecision, bool_type,
	                                       "WaveIsFirstLane",
	                                       { bool_type }, {}, &entry);

	auto *is_helper_block = new spv::Block(builder.getUniqueId(), *func);
	auto *is_active_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	spv::Id elect_id;

	builder.setBuildPoint(entry);

	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(func->getParamId(0), is_helper_block, is_active_block);

	{
		builder.setBuildPoint(is_helper_block);
		builder.createBranch(merge_block);
	}

	{
		builder.setBuildPoint(is_active_block);
		auto elect = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpGroupNonUniformElect);
		elect->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		elect_id = elect->getResultId();
		add_instruction(is_active_block, std::move(elect));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpPhi);
	phi->addIdOperand(elect_id);
	phi->addIdOperand(is_active_block->getId());
	phi->addIdOperand(builder.makeBoolConstant(false));
	phi->addIdOperand(is_helper_block->getId());
	elect_id = phi->getResultId();
	add_instruction(merge_block, std::move(phi));

	builder.makeReturn(false, elect_id);
	builder.setBuildPoint(current_build_point);
	wave_is_first_lane_masked_id = func->getId();
	return wave_is_first_lane_masked_id;
}

spv::Id SPIRVModule::Impl::build_wave_match(SPIRVModule &module, spv::Id type_id)
{
	for (auto &type : wave_match_call_ids)
		if (type.first == type_id)
			return type.second;

	auto *current_build_point = builder.getBuildPoint();
	builder.addCapability(spv::CapabilityGroupNonUniform);
	builder.addCapability(spv::CapabilityGroupNonUniformBallot);

	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec4_type = builder.makeVectorType(uint_type, 4);
	spv::Id bool_type = builder.makeBoolType();
	Vector<spv::Id> types = { type_id };
	if (!helper_lanes_participate_in_wave_ops)
		types.push_back(bool_type);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uvec4_type,
	                                       "WaveMatch",
	                                       types, {}, &entry);
	spv::Id value_id = func->getParamId(0);

	auto *header_block = new spv::Block(builder.getUniqueId(), *func);
	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	spv::Block *outer_header = nullptr;
	spv::Block *return_block = nullptr;
	spv::Id undef_id = 0;

	builder.setBuildPoint(entry);
	builder.createBranch(header_block);
	builder.setBuildPoint(header_block);

	if (!helper_lanes_participate_in_wave_ops)
	{
		return_block = new spv::Block(builder.getUniqueId(), *func);
		auto *inner_header_block = new spv::Block(builder.getUniqueId(), *func);
		undef_id = builder.createUndefined(uvec4_type);
		builder.createSelectionMerge(return_block, 0);
		builder.createConditionalBranch(func->getParamId(1), return_block, inner_header_block);
		outer_header = header_block;
		header_block = inner_header_block;
		builder.setBuildPoint(header_block);
	}

	builder.createLoopMerge(merge_block, body_block, 0);
	builder.createBranch(body_block);

	auto broadcast_first = std::make_unique<spv::Instruction>(builder.getUniqueId(), type_id, spv::OpGroupNonUniformBroadcastFirst);
	broadcast_first->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	broadcast_first->addIdOperand(value_id);

	// We cannot scalarize floats safely due to NaNs. Caller will bitcast to uint first.
	assert(builder.getTypeClass(type_id) != spv::OpTypeFloat);
	spv::Op equal_op;
	if (builder.getTypeClass(type_id) == spv::OpTypeBool)
		equal_op = spv::OpLogicalEqual;
	else
		equal_op = spv::OpIEqual;

	auto compare = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), equal_op);
	compare->addIdOperand(value_id);
	compare->addIdOperand(broadcast_first->getResultId());
	spv::Id compare_id = compare->getResultId();

	auto ballot = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBallot);
	ballot->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	ballot->addIdOperand(compare->getResultId());
	spv::Id ballot_id = ballot->getResultId();

	builder.setBuildPoint(body_block);
	add_instruction(body_block, std::move(broadcast_first));
	add_instruction(body_block, std::move(compare));
	add_instruction(body_block, std::move(ballot));
	builder.createConditionalBranch(compare_id, merge_block, header_block);

	builder.setBuildPoint(merge_block);

	if (return_block)
	{
		builder.createBranch(return_block);
		builder.setBuildPoint(return_block);

		auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpPhi);
		phi->addIdOperand(ballot_id);
		phi->addIdOperand(merge_block->getId());
		phi->addIdOperand(undef_id);
		phi->addIdOperand(outer_header->getId());
		ballot_id = phi->getResultId();
		add_instruction(return_block, std::move(phi));
	}

	builder.makeReturn(false, ballot_id);
	builder.setBuildPoint(current_build_point);

	wave_match_call_ids.emplace_back(type_id, func->getId());
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_quad_vote(SPIRVModule &module, HelperCall call)
{
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, bool_type,
	                                       call == HelperCall::QuadAll ? "QuadAll" : "QuadAny",
	                                       { bool_type }, {}, &entry);

	builder.setBuildPoint(entry);
	spv::Id ids[4];
	for (unsigned i = 0; i < 4; i++)
	{
		auto broadcast = std::make_unique<spv::Instruction>(
				builder.getUniqueId(), bool_type, spv::OpGroupNonUniformQuadBroadcast);
		broadcast->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		broadcast->addIdOperand(func->getParamId(0));
		broadcast->addIdOperand(builder.makeUintConstant(i));
		ids[i] = broadcast->getResultId();
		add_instruction(entry, std::move(broadcast));
	}

	spv::Op op = call == HelperCall::QuadAll ? spv::OpLogicalAnd : spv::OpLogicalOr;

	spv::Id ret_id = ids[0];
	for (unsigned i = 1; i < 4; i++)
	{
		auto logic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, op);
		logic_op->addIdOperand(ret_id);
		logic_op->addIdOperand(ids[i]);
		ret_id = logic_op->getResultId();
		add_instruction(entry, std::move(logic_op));
	}

	builder.addCapability(spv::CapabilityGroupNonUniformQuad);
	builder.makeReturn(false, ret_id);
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_quad_all(SPIRVModule &module)
{
	if (quad_all_call_id)
		return quad_all_call_id;
	quad_all_call_id = build_quad_vote(module, HelperCall::QuadAll);
	return quad_all_call_id;
}

spv::Id SPIRVModule::Impl::build_quad_any(SPIRVModule &module)
{
	if (quad_any_call_id)
		return quad_any_call_id;
	quad_any_call_id = build_quad_vote(module, HelperCall::QuadAny);
	return quad_any_call_id;
}

spv::Id SPIRVModule::Impl::build_image_atomic_r64_compact(
	SPIRVModule &module, bool array, bool non_uniform)
{
	spv::Id *call_id;
	const char *name;
	if (array)
	{
		if (non_uniform)
		{
			call_id = &image_r64_array_atomic_non_uniform_call_id;
			name = "WriteFeedbackArrayNonUniform";
		}
		else
		{
			call_id = &image_r64_array_atomic_call_id;
			name = "WriteFeedbackArray";
		}
	}
	else
	{
		if (non_uniform)
		{
			call_id = &image_r64_atomic_non_uniform_call_id;
			name = "WriteFeedbackNonUniform";
		}
		else
		{
			call_id = &image_r64_atomic_call_id;
			name = "WriteFeedback";
		}
	}

	if (*call_id)
		return *call_id;

	builder.addCapability(spv::CapabilityGroupNonUniform);
	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	auto *current_build_point = builder.getBuildPoint();

	spv::Id image_type = builder.makeImageType(builder.makeUintType(64),
	                                           spv::Dim2D, false, array, false, 2, spv::ImageFormatR64ui);
	spv::Id ptr_image_type = builder.makePointer(spv::StorageClassUniformConstant, image_type);

	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id int_type = builder.makeIntType(32);
	spv::Id coord_type = builder.makeVectorType(int_type, array ? 3 : 2);
	spv::Id bvec_type = builder.makeVectorType(bool_type, array ? 3 : 2);
	spv::Id u64_type = builder.makeUintType(64);
	spv::Id ptr_atomic_type = builder.makePointer(spv::StorageClassImage, u64_type);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(), name,
	                                       { ptr_image_type, coord_type, u64_type, bool_type }, {}, &entry);

	spv::Id image_ptr = func->getParamId(0);
	spv::Id coord = func->getParamId(1);
	spv::Id value = func->getParamId(2);
	spv::Id active = func->getParamId(3);

	builder.addName(image_ptr, "img");
	builder.addName(coord, "coord");
	builder.addName(value, "value");
	builder.addName(active, "active_lane");

	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *loop_merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *loop_body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *loop_continue_block = new spv::Block(builder.getUniqueId(), *func);
	auto *write_block = new spv::Block(builder.getUniqueId(), *func);
	auto *write_merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *elect_block = new spv::Block(builder.getUniqueId(), *func);
	auto *elect_merge_block = new spv::Block(builder.getUniqueId(), *func);

	builder.setBuildPoint(entry);
	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(active, body_block, merge_block);

	spv::Id var_is_done = builder.createVariableWithInitializer(spv::StorageClassFunction, bool_type,
	                                                            builder.makeBoolConstant(false), "is_done");

	builder.setBuildPoint(body_block);
	{
		auto load = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLoad);
		auto inot = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLogicalNot);
		spv::Id inot_id = inot->getResultId();
		load->addIdOperand(var_is_done);
		inot->addIdOperand(load->getResultId());
		add_instruction(body_block, std::move(load));
		add_instruction(body_block, std::move(inot));
		builder.createLoopMerge(loop_merge_block, loop_continue_block, 0);
		builder.createConditionalBranch(inot_id, loop_body_block, loop_merge_block);

		builder.setBuildPoint(loop_body_block);
		{
			auto first = std::make_unique<spv::Instruction>(builder.getUniqueId(), coord_type, spv::OpGroupNonUniformBroadcastFirst);
			auto compare_coord = std::make_unique<spv::Instruction>(builder.getUniqueId(), bvec_type, spv::OpIEqual);
			auto all_equal = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpAll);
			auto store = std::make_unique<spv::Instruction>(spv::OpStore);

			first->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
			first->addIdOperand(coord);
			compare_coord->addIdOperand(coord);
			compare_coord->addIdOperand(first->getResultId());
			all_equal->addIdOperand(compare_coord->getResultId());
			store->addIdOperand(var_is_done);
			store->addIdOperand(all_equal->getResultId());

			spv::Id cond_id = all_equal->getResultId();
			add_instruction(loop_body_block, std::move(first));
			add_instruction(loop_body_block, std::move(compare_coord));
			add_instruction(loop_body_block, std::move(all_equal));
			add_instruction(loop_body_block, std::move(store));

			builder.createSelectionMerge(write_merge_block, 0);
			builder.createConditionalBranch(cond_id, write_block, write_merge_block);
			builder.setBuildPoint(write_block);
			{
				auto or_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), u64_type, spv::OpGroupNonUniformBitwiseOr);
				auto elect = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpGroupNonUniformElect);
				or_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
				or_op->addImmediateOperand(spv::GroupOperationReduce);
				or_op->addIdOperand(value);
				elect->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
				spv::Id elect_id = elect->getResultId();
				spv::Id or_op_id = or_op->getResultId();
				add_instruction(write_block, std::move(or_op));
				add_instruction(write_block, std::move(elect));

				builder.createSelectionMerge(elect_merge_block, 0);
				builder.createConditionalBranch(elect_id, elect_block, elect_merge_block);
				builder.setBuildPoint(elect_block);
				{
					auto texel = std::make_unique<spv::Instruction>(builder.getUniqueId(), ptr_atomic_type, spv::OpImageTexelPointer);
					if (non_uniform)
						builder.addDecoration(texel->getResultId(), spv::DecorationNonUniform);
					auto atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), u64_type, spv::OpAtomicOr);
					texel->addIdOperand(image_ptr);
					texel->addIdOperand(coord);
					texel->addIdOperand(builder.makeIntConstant(0));
					atomic_op->addIdOperand(texel->getResultId());
					atomic_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
					atomic_op->addIdOperand(builder.makeUintConstant(0));
					atomic_op->addIdOperand(or_op_id);
					add_instruction(elect_block, std::move(texel));
					add_instruction(elect_block, std::move(atomic_op));
					builder.createBranch(elect_merge_block);
				}

				builder.setBuildPoint(elect_merge_block);
				builder.createBranch(write_merge_block);
			}

			builder.setBuildPoint(write_merge_block);
			builder.createBranch(loop_continue_block);

			builder.setBuildPoint(loop_continue_block);
			builder.createBranch(body_block);
		}

		builder.setBuildPoint(loop_merge_block);
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	builder.makeReturn(false);

	builder.addCapability(spv::CapabilityInt64Atomics);

	builder.setBuildPoint(current_build_point);
	*call_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_node_coalesce_payload_offset(
    SPIRVModule &module, const spv::Id *ids, uint32_t id_count)
{
	if (id_count != 3)
		return 0;

	if (node_coalesce_payload_offset_call_id)
		return node_coalesce_payload_offset_call_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uint_type,
	                                       "NodeCoalescePayloadOffset",
	                                       { uint_type, uvec2_type },
	                                       {}, &entry);

	builder.addName(func->getParamId(0), "offset");
	builder.addName(func->getParamId(1), "offsets_bda");

	auto *is_entry_block = new spv::Block(builder.getUniqueId(), *func);
	auto *is_node_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge = new spv::Block(builder.getUniqueId(), *func);

	spv::Id is_entry_id = ids[0];
	spv::Id private_stride_var_id = ids[1];
	spv::Id u32_array_ptr_type_id = ids[2];
	spv::Id entry_result_id = 0;
	spv::Id node_result_id = 0;

	builder.setBuildPoint(entry);
	builder.createSelectionMerge(merge, 0);
	builder.createConditionalBranch(is_entry_id, is_entry_block, is_node_block);

	builder.setBuildPoint(is_entry_block);
	{
		auto load = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(), uint_type, spv::OpLoad);
		auto mul = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(), uint_type, spv::OpIMul);

		load->addIdOperand(private_stride_var_id);
		mul->addIdOperand(load->getResultId());
		mul->addIdOperand(func->getParamId(0));

		entry_result_id = mul->getResultId();
		add_instruction(is_entry_block, std::move(load));
		add_instruction(is_entry_block, std::move(mul));
		builder.createBranch(merge);
	}

	builder.setBuildPoint(is_node_block);
	{
		auto bitcast = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(), u32_array_ptr_type_id, spv::OpBitcast);
		auto chain = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(), builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
		    spv::OpInBoundsAccessChain);
		auto load = std::make_unique<spv::Instruction>(
			builder.getUniqueId(), uint_type, spv::OpLoad);

		bitcast->addIdOperand(func->getParamId(1));
		chain->addIdOperand(bitcast->getResultId());
		chain->addIdOperand(builder.makeUintConstant(0));
		chain->addIdOperand(func->getParamId(0));
		load->addIdOperand(chain->getResultId());
		load->addImmediateOperand(spv::MemoryAccessAlignedMask);
		load->addImmediateOperand(sizeof(uint32_t));
		node_result_id = load->getResultId();
		add_instruction(is_node_block, std::move(bitcast));
		add_instruction(is_node_block, std::move(chain));
		add_instruction(is_node_block, std::move(load));
		builder.createBranch(merge);
	}

	builder.setBuildPoint(merge);

	auto phi = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpPhi);
	phi->addIdOperand(entry_result_id);
	phi->addIdOperand(is_entry_block->getId());
	phi->addIdOperand(node_result_id);
	phi->addIdOperand(is_node_block->getId());
	spv::Id return_value = phi->getResultId();
	add_instruction(merge, std::move(phi));
	builder.makeReturn(false, return_value);
	node_coalesce_payload_offset_call_id = func->getId();
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_allocate_node_records_waterfall(SPIRVModule &module)
{
	if (allocate_thread_node_records_waterfall_call_id)
		return allocate_thread_node_records_waterfall_call_id;

	spv::Id inner_call_id = module.get_helper_call_id(HelperCall::AllocateThreadNodeRecords);

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uint64_type = builder.makeUintType(64);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uint_type,
	                                       "AllocateThreadNodeRecordsWaterfall",
	                                       { uint64_type, uint_type, uint_type, uint_type, uint_type },
	                                       {}, &entry);

	builder.addName(func->getParamId(0), "AtomicCountersBDA");
	builder.addName(func->getParamId(1), "NodeMetadataIndex");
	builder.addName(func->getParamId(2), "Count");
	builder.addName(func->getParamId(3), "Stride");
	builder.addName(func->getParamId(4), "AllocationOffset");

	auto *loop_header = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *body_header = new spv::Block(builder.getUniqueId(), *func);
	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *continue_block = new spv::Block(builder.getUniqueId(), *func);
	auto *body_merge = new spv::Block(builder.getUniqueId(), *func);

	builder.setBuildPoint(entry);
	builder.createBranch(loop_header);

	builder.setBuildPoint(loop_header);
	builder.createLoopMerge(merge_block, continue_block, 0);
	builder.createBranch(body_header);

	builder.setBuildPoint(body_header);
	auto broadcast = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpGroupNonUniformBroadcastFirst);
	broadcast->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	broadcast->addIdOperand(func->getParamId(1));
	spv::Id broadcast_id = broadcast->getResultId();

	auto do_work = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIEqual);
	do_work->addIdOperand(broadcast->getResultId());
	do_work->addIdOperand(func->getParamId(1));
	spv::Id do_work_cond_id = do_work->getResultId();

	add_instruction(body_header, std::move(broadcast));
	add_instruction(body_header, std::move(do_work));
	builder.createSelectionMerge(body_merge, 0);
	builder.createConditionalBranch(do_work_cond_id, body_block, body_merge);

	builder.setBuildPoint(body_block);
	spv::Id return_value;
	{
		auto call_inner = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpFunctionCall);
		call_inner->addIdOperand(inner_call_id);
		call_inner->addIdOperand(func->getParamId(0));
		call_inner->addIdOperand(broadcast_id);
		call_inner->addIdOperand(func->getParamId(2));
		call_inner->addIdOperand(func->getParamId(3));
		call_inner->addIdOperand(func->getParamId(4));

		return_value = call_inner->getResultId();
		add_instruction(body_block, std::move(call_inner));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(body_merge);
	builder.createBranch(continue_block);
	builder.setBuildPoint(continue_block);
	builder.createBranch(loop_header);

	builder.setBuildPoint(merge_block);
	builder.makeReturn(false, return_value);
	builder.setBuildPoint(current_build_point);
	allocate_thread_node_records_waterfall_call_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_increment_node_count(SPIRVModule &, bool per_thread)
{
	auto &call_id = per_thread ? increment_thread_node_count_call_id : increment_group_node_count_call_id;
	if (call_id)
		return call_id;
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uint64_type = builder.makeUintType(64);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(),
	                                       per_thread ? "IncrementThreadNodeCount" : "IncrementGroupNodeCount",
	                                       { uint64_type, uint_type, uint_type },
	                                       {}, &entry);

	builder.addName(func->getParamId(0), "AtomicCountersBDA");
	builder.addName(func->getParamId(1), "NodeMetadataIndex");
	builder.addName(func->getParamId(2), "Count");

	spv::Id total_count_id = func->getParamId(2);

	spv::Block *body_block = nullptr;
	spv::Block *merge_block = nullptr;

	if (!per_thread)
	{
		body_block = new spv::Block(builder.getUniqueId(), *func);
		merge_block = new spv::Block(builder.getUniqueId(), *func);
	}

	spv::Id uint_array_type = builder.makeRuntimeArray(uint_type);
	builder.addDecoration(uint_array_type, spv::DecorationArrayStride, 4);
	spv::Id struct_type_id = builder.makeStructType({ uint_type, uint_type, uint_array_type }, "NodeAtomicsEmpty");
	builder.addDecoration(struct_type_id, spv::DecorationBlock);
	builder.addMemberName(struct_type_id, 0, "payloadCount");
	builder.addMemberName(struct_type_id, 1, "fusedCount");
	builder.addMemberName(struct_type_id, 2, "perNodeTotal");
	builder.addMemberDecoration(struct_type_id, 0, spv::DecorationOffset, 0);
	builder.addMemberDecoration(struct_type_id, 1, spv::DecorationOffset, 4);
	builder.addMemberDecoration(struct_type_id, 2, spv::DecorationOffset, 8);

	auto cast_op = std::make_unique<spv::Instruction>(
	    builder.getUniqueId(),
	    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, struct_type_id),
	    spv::OpBitcast);
	cast_op->addIdOperand(func->getParamId(0));

	auto chain_index_op = std::make_unique<spv::Instruction>(
	    builder.getUniqueId(),
	    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
	    spv::OpInBoundsAccessChain);
	chain_index_op->addIdOperand(cast_op->getResultId());
	chain_index_op->addIdOperand(builder.makeUintConstant(2));
	chain_index_op->addIdOperand(func->getParamId(1));

	auto atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpAtomicIAdd);
	atomic_op->addIdOperand(chain_index_op->getResultId());
	atomic_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
	atomic_op->addIdOperand(builder.makeUintConstant(0)); // There is no implied sync.
	atomic_op->addIdOperand(total_count_id);

	auto *body = per_thread ? entry : body_block;
	add_instruction(body, std::move(cast_op));
	add_instruction(body, std::move(chain_index_op));
	add_instruction(body, std::move(atomic_op));

	if (!per_thread)
	{
		spv::Id local_invocation_index = get_builtin_shader_input(spv::BuiltInLocalInvocationIndex);
		auto load_local_index = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpLoad);
		load_local_index->addIdOperand(local_invocation_index);

		auto is_first_lane = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIEqual);
		is_first_lane->addIdOperand(load_local_index->getResultId());
		is_first_lane->addIdOperand(builder.makeUintConstant(0));
		spv::Id is_first_lane_id = is_first_lane->getResultId();
		add_instruction(entry, std::move(load_local_index));
		add_instruction(entry, std::move(is_first_lane));

		builder.setBuildPoint(entry);
		builder.createSelectionMerge(merge_block, 0);
		builder.createConditionalBranch(is_first_lane_id, body_block, merge_block);

		builder.setBuildPoint(body_block);
		builder.createBranch(merge_block);
		builder.setBuildPoint(merge_block);
		builder.makeReturn(false);
	}
	else
	{
		builder.setBuildPoint(entry);
		builder.makeReturn(false);
	}

	builder.setBuildPoint(current_build_point);
	call_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_allocate_node_records(SPIRVModule &, bool per_thread)
{
	auto &call_id = per_thread ? allocate_thread_node_records_call_id : allocate_group_node_records_call_id;
	if (call_id)
		return call_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uint64_type = builder.makeUintType(64);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uint_type,
	                                       per_thread ? "AllocateThreadNodeRecords" : "AllocateGroupNodeRecords",
	                                       { uint64_type, uint_type, uint_type, uint_type, uint_type },
	                                       {}, &entry);

	builder.addName(func->getParamId(0), "AtomicCountersBDA");
	builder.addName(func->getParamId(1), "NodeMetadataIndex");
	builder.addName(func->getParamId(2), "Count");
	builder.addName(func->getParamId(3), "Stride");
	builder.addName(func->getParamId(4), "AllocationOffset");

	spv::Id total_count_id;
	spv::Id phi_undefined_id = 0;

	if (per_thread)
	{
		// Do this on a per-wave basis. The node metadata index can be divergent, and we need to consider
		// that the outer function is a waterfall loop.
		builder.addCapability(spv::CapabilityGroupNonUniformBallot);
		builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);

		auto counts_total =
		    std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpGroupNonUniformIAdd);
		counts_total->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		counts_total->addImmediateOperand(spv::GroupOperationReduce);
		counts_total->addIdOperand(func->getParamId(2));

		total_count_id = counts_total->getResultId();
		add_instruction(entry, std::move(counts_total));

		phi_undefined_id = builder.createUndefined(uint_type);
	}
	else
	{
		total_count_id = func->getParamId(2);
	}

	auto *return_block = new spv::Block(builder.getUniqueId(), *func);
	auto check_empty = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIEqual);
	check_empty->addIdOperand(total_count_id);
	check_empty->addIdOperand(builder.makeUintConstant(0));
	spv::Id return_early_cond_id = check_empty->getResultId();
	add_instruction(entry, std::move(check_empty));

	auto *reconverge_block = new spv::Block(builder.getUniqueId(), *func);
	builder.setBuildPoint(entry);
	builder.createSelectionMerge(reconverge_block, 0);
	builder.createConditionalBranch(return_early_cond_id, return_block, reconverge_block);
	builder.setBuildPoint(return_block);
	builder.makeReturn(false, builder.makeUintConstant(0));

	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);

	spv::Id shared_id = 0;
	if (!per_thread)
		shared_id = create_variable(spv::StorageClassWorkgroup, uint_type, "AllocateGroupNodeRecordsShared");

	spv::Id is_first_lane_id;

	if (per_thread)
	{
		auto is_first_lane = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpGroupNonUniformElect);
		is_first_lane->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		is_first_lane_id = is_first_lane->getResultId();
		add_instruction(reconverge_block, std::move(is_first_lane));
	}
	else
	{
		spv::Id local_invocation_index = get_builtin_shader_input(spv::BuiltInLocalInvocationIndex);
		auto load_local_index = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpLoad);
		load_local_index->addIdOperand(local_invocation_index);

		auto is_first_lane = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIEqual);
		is_first_lane->addIdOperand(load_local_index->getResultId());
		is_first_lane->addIdOperand(builder.makeUintConstant(0));
		is_first_lane_id = is_first_lane->getResultId();
		add_instruction(reconverge_block, std::move(load_local_index));
		add_instruction(reconverge_block, std::move(is_first_lane));
	}

	builder.setBuildPoint(reconverge_block);
	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(is_first_lane_id, body_block, merge_block);

	spv::Id payload_offset_id;
	builder.setBuildPoint(body_block);
	{
		// Compute required payload bytes to allocate, and align.
		auto mul_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIMul);
		mul_op->addIdOperand(total_count_id);
		mul_op->addIdOperand(func->getParamId(3));

		auto add_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIAdd);
		add_op->addIdOperand(mul_op->getResultId());
		add_op->addIdOperand(builder.makeUintConstant(15));

		auto and_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpBitwiseAnd);
		and_op->addIdOperand(add_op->getResultId());
		and_op->addIdOperand(builder.makeUintConstant(~15u));

		spv::Id uint_array_type = builder.makeRuntimeArray(uint_type);
		builder.addDecoration(uint_array_type, spv::DecorationArrayStride, 4);
		spv::Id struct_type_id = builder.makeStructType({ uint_type, uint_type, uint_array_type }, "NodeAtomics");
		builder.addDecoration(struct_type_id, spv::DecorationBlock);
		builder.addMemberName(struct_type_id, 0, "payloadCount");
		builder.addMemberName(struct_type_id, 1, "fusedCount");
		builder.addMemberName(struct_type_id, 2, "perNodeTotal");
		builder.addMemberDecoration(struct_type_id, 0, spv::DecorationOffset, 0);
		builder.addMemberDecoration(struct_type_id, 1, spv::DecorationOffset, 4);
		builder.addMemberDecoration(struct_type_id, 2, spv::DecorationOffset, 8);

		auto cast_op = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(),
		    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, struct_type_id),
		    spv::OpBitcast);
		cast_op->addIdOperand(func->getParamId(0));

		auto chain_payload_total_op = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(),
		    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
		    spv::OpInBoundsAccessChain);
		chain_payload_total_op->addIdOperand(cast_op->getResultId());
		chain_payload_total_op->addIdOperand(builder.makeUintConstant(0));

		auto chain_fused_total_op = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(),
		    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
		    spv::OpInBoundsAccessChain);
		chain_fused_total_op->addIdOperand(cast_op->getResultId());
		chain_fused_total_op->addIdOperand(builder.makeUintConstant(1));

		auto payload_total_atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpAtomicIAdd);
		payload_total_atomic_op->addIdOperand(chain_payload_total_op->getResultId());
		payload_total_atomic_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
		payload_total_atomic_op->addIdOperand(builder.makeUintConstant(0)); // There is no implied sync.
		payload_total_atomic_op->addIdOperand(and_op->getResultId());

		spv::Id node_index = func->getParamId(1);

		auto chain_node_total_op = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(),
		    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
		    spv::OpInBoundsAccessChain);
		chain_node_total_op->addIdOperand(cast_op->getResultId());
		chain_node_total_op->addIdOperand(builder.makeUintConstant(2));
		chain_node_total_op->addIdOperand(node_index);

		auto atomic_total_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpAtomicIAdd);
		atomic_total_op->addIdOperand(chain_node_total_op->getResultId());
		atomic_total_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
		atomic_total_op->addIdOperand(builder.makeUintConstant(0)); // There is no implied sync.
		atomic_total_op->addIdOperand(total_count_id);

		auto shift_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpShiftLeftLogical);
		shift_op->addIdOperand(node_index);
		shift_op->addIdOperand(builder.makeUintConstant(8));

		auto count_minus_1 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpISub);
		count_minus_1->addIdOperand(total_count_id);
		count_minus_1->addIdOperand(builder.makeUintConstant(1));

		auto or_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpBitwiseOr);
		or_op->addIdOperand(shift_op->getResultId());
		or_op->addIdOperand(count_minus_1->getResultId());

		auto fused_atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpAtomicIIncrement);
		fused_atomic_op->addIdOperand(chain_fused_total_op->getResultId());
		fused_atomic_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
		fused_atomic_op->addIdOperand(builder.makeUintConstant(0)); // There is no implied sync.

		auto fused_mul2 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIMul);
		fused_mul2->addIdOperand(builder.makeUintConstant(2));
		fused_mul2->addIdOperand(fused_atomic_op->getResultId());

		auto payload_add_atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIAdd);
		payload_add_atomic_op->addIdOperand(func->getParamId(4));
		payload_add_atomic_op->addIdOperand(fused_mul2->getResultId());

		auto payload_add_atomic_op_plus_1 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIAdd);
		payload_add_atomic_op_plus_1->addIdOperand(payload_add_atomic_op->getResultId());
		payload_add_atomic_op_plus_1->addIdOperand(builder.makeUintConstant(1));

		auto chain_payload_op = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(),
		    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
		    spv::OpInBoundsAccessChain);
		chain_payload_op->addIdOperand(cast_op->getResultId());
		chain_payload_op->addIdOperand(builder.makeUintConstant(2));
		chain_payload_op->addIdOperand(payload_add_atomic_op->getResultId());

		auto store_payload_inst = std::make_unique<spv::Instruction>(spv::OpStore);
		store_payload_inst->addIdOperand(chain_payload_op->getResultId());
		store_payload_inst->addIdOperand(or_op->getResultId());
		store_payload_inst->addImmediateOperand(spv::MemoryAccessAlignedMask);
		store_payload_inst->addImmediateOperand(8);

		auto chain_payload_op_plus_1 = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(),
		    builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
		    spv::OpInBoundsAccessChain);
		chain_payload_op_plus_1->addIdOperand(cast_op->getResultId());
		chain_payload_op_plus_1->addIdOperand(builder.makeUintConstant(2));
		chain_payload_op_plus_1->addIdOperand(payload_add_atomic_op_plus_1->getResultId());

		auto store_payload_inst_plus_1 = std::make_unique<spv::Instruction>(spv::OpStore);
		store_payload_inst_plus_1->addIdOperand(chain_payload_op_plus_1->getResultId());
		store_payload_inst_plus_1->addIdOperand(payload_total_atomic_op->getResultId());
		store_payload_inst_plus_1->addImmediateOperand(spv::MemoryAccessAlignedMask);
		store_payload_inst_plus_1->addImmediateOperand(4);

		payload_offset_id = payload_total_atomic_op->getResultId();

		add_instruction(body_block, std::move(mul_op));
		add_instruction(body_block, std::move(add_op));
		add_instruction(body_block, std::move(and_op));
		add_instruction(body_block, std::move(cast_op));
		add_instruction(body_block, std::move(chain_payload_total_op));
		add_instruction(body_block, std::move(chain_fused_total_op));
		add_instruction(body_block, std::move(payload_total_atomic_op));
		add_instruction(body_block, std::move(chain_node_total_op));
		add_instruction(body_block, std::move(shift_op));
		add_instruction(body_block, std::move(count_minus_1));
		add_instruction(body_block, std::move(or_op));
		add_instruction(body_block, std::move(fused_atomic_op));
		add_instruction(body_block, std::move(fused_mul2));
		add_instruction(body_block, std::move(atomic_total_op));
		add_instruction(body_block, std::move(payload_add_atomic_op));
		add_instruction(body_block, std::move(payload_add_atomic_op_plus_1));
		add_instruction(body_block, std::move(chain_payload_op));
		add_instruction(body_block, std::move(store_payload_inst));
		add_instruction(body_block, std::move(chain_payload_op_plus_1));
		add_instruction(body_block, std::move(store_payload_inst_plus_1));

		if (!per_thread)
		{
			auto store_inst = std::make_unique<spv::Instruction>(spv::OpStore);
			store_inst->addIdOperand(shared_id);
			store_inst->addIdOperand(payload_offset_id);
			add_instruction(body_block, std::move(store_inst));
		}

		builder.createBranch(merge_block);
	}
	builder.setBuildPoint(merge_block);

	if (!per_thread)
	{
		auto barrier_op = std::make_unique<spv::Instruction>(spv::OpControlBarrier);
		barrier_op->addIdOperand(builder.makeUintConstant(spv::ScopeWorkgroup));
		barrier_op->addIdOperand(builder.makeUintConstant(spv::ScopeWorkgroup));
		barrier_op->addIdOperand(
		    builder.makeUintConstant(spv::MemorySemanticsAcquireReleaseMask | spv::MemorySemanticsWorkgroupMemoryMask));
		add_instruction(merge_block, std::move(barrier_op));
	}

	spv::Id return_value;

	if (per_thread)
	{
		auto counts_offsets =
		    std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpGroupNonUniformIAdd);
		counts_offsets->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		counts_offsets->addImmediateOperand(spv::GroupOperationExclusiveScan);
		counts_offsets->addIdOperand(func->getParamId(2));

		auto phi_node = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpPhi);
		phi_node->addIdOperand(payload_offset_id);
		phi_node->addIdOperand(body_block->getId());
		phi_node->addIdOperand(phi_undefined_id);
		phi_node->addIdOperand(reconverge_block->getId());

		auto broadcast_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpGroupNonUniformBroadcastFirst);
		broadcast_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
		broadcast_op->addIdOperand(phi_node->getResultId());

		auto mul_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIMul);
		mul_op->addIdOperand(counts_offsets->getResultId());
		mul_op->addIdOperand(func->getParamId(3));

		auto add_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIAdd);
		add_op->addIdOperand(broadcast_op->getResultId());
		add_op->addIdOperand(mul_op->getResultId());

		return_value = add_op->getResultId();

		add_instruction(merge_block, std::move(phi_node));
		add_instruction(merge_block, std::move(broadcast_op));
		add_instruction(merge_block, std::move(counts_offsets));
		add_instruction(merge_block, std::move(mul_op));
		add_instruction(merge_block, std::move(add_op));
	}
	else
	{
		auto load_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpLoad);
		load_op->addIdOperand(shared_id);
		return_value = load_op->getResultId();
		add_instruction(merge_block, std::move(load_op));
	}

	if (!per_thread)
	{
		// Avoid WAR hazard for back-to-back allocations.
		auto barrier_op = std::make_unique<spv::Instruction>(spv::OpControlBarrier);
		barrier_op->addIdOperand(builder.makeUintConstant(spv::ScopeWorkgroup));
		barrier_op->addIdOperand(builder.makeUintConstant(spv::ScopeWorkgroup));
		barrier_op->addIdOperand(
		    builder.makeUintConstant(spv::MemorySemanticsAcquireReleaseMask | spv::MemorySemanticsWorkgroupMemoryMask));
		add_instruction(merge_block, std::move(barrier_op));
	}

	builder.makeReturn(false, return_value);
	builder.setBuildPoint(current_build_point);
	call_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_finish_cross_group_sharing(SPIRVModule &module)
{
	if (finish_cross_group_sharing_call_id)
		return finish_cross_group_sharing_call_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uint64_type = builder.makeUintType(64);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, bool_type,
	                                       "FinishCrossGroupSharing",
	                                       { uint64_type }, {}, &entry);

	builder.addName(func->getParamId(0), "CounterBDA");

	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);

	spv::Id local_invocation_index = get_builtin_shader_input(spv::BuiltInLocalInvocationIndex);
	spv::Id shared_id = create_variable(spv::StorageClassWorkgroup, bool_type, "FinishCrossGroupSharingBroadcast");

	auto load_local_index = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpLoad);
	load_local_index->addIdOperand(local_invocation_index);

	auto is_first_lane = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIEqual);
	is_first_lane->addIdOperand(load_local_index->getResultId());
	is_first_lane->addIdOperand(builder.makeUintConstant(0));
	spv::Id cond_id = is_first_lane->getResultId();

	add_instruction(entry, std::move(load_local_index));
	add_instruction(entry, std::move(is_first_lane));
	builder.setBuildPoint(entry);
	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(cond_id, body_block, merge_block);

	builder.setBuildPoint(body_block);
	{
		auto cast_op = std::make_unique<spv::Instruction>(
			builder.getUniqueId(),
			builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type),
			spv::OpBitcast);
		cast_op->addIdOperand(func->getParamId(0));

		auto atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpAtomicIDecrement);
		atomic_op->addIdOperand(cast_op->getResultId());
		atomic_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
		atomic_op->addIdOperand(builder.makeUintConstant(0)); // There is no implied sync.

		auto is_last_wg = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIEqual);
		is_last_wg->addIdOperand(atomic_op->getResultId());
		is_last_wg->addIdOperand(builder.makeUintConstant(1));

		auto store_inst = std::make_unique<spv::Instruction>(spv::OpStore);
		store_inst->addIdOperand(shared_id);
		store_inst->addIdOperand(is_last_wg->getResultId());

		add_instruction(body_block, std::move(cast_op));
		add_instruction(body_block, std::move(atomic_op));
		add_instruction(body_block, std::move(is_last_wg));
		add_instruction(body_block, std::move(store_inst));
		builder.createBranch(merge_block);
	}
	builder.setBuildPoint(merge_block);

	// We don't need double barrier since FinishGroupSharing can only be called once.
	// There is no risk of WAR hazard on the same shared memory.
	auto barrier_op = std::make_unique<spv::Instruction>(spv::OpControlBarrier);
	barrier_op->addIdOperand(builder.makeUintConstant(spv::ScopeWorkgroup));
	barrier_op->addIdOperand(builder.makeUintConstant(spv::ScopeWorkgroup));
	barrier_op->addIdOperand(builder.makeUintConstant(
	    spv::MemorySemanticsAcquireReleaseMask | spv::MemorySemanticsWorkgroupMemoryMask));

	auto load_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLoad);
	load_op->addIdOperand(shared_id);

	spv::Id return_value = load_op->getResultId();
	add_instruction(merge_block, std::move(barrier_op));
	add_instruction(merge_block, std::move(load_op));

	builder.makeReturn(false, return_value);
	builder.setBuildPoint(current_build_point);
	finish_cross_group_sharing_call_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_robust_atomic_counter_op(SPIRVModule &module)
{
	if (robust_atomic_counter_call_id)
		return robust_atomic_counter_call_id;

	auto *current_build_point = builder.getBuildPoint();

	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id bda_type = builder.makeVectorType(uint_type, 2);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uint_type,
	                                       "RobustPhysicalAtomicCounter",
	                                       { bda_type, uint_type, uint_type }, {}, &entry);

	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);

	spv::Id bool_type = builder.makeBoolType();
	spv::Id bvec2_type = builder.makeVectorType(bool_type, 2);

	spv::Id null_bda = builder.makeNullConstant(bda_type);
	auto compare = std::make_unique<spv::Instruction>(builder.getUniqueId(), bvec2_type, spv::OpINotEqual);
	compare->addIdOperand(func->getParamId(0));
	compare->addIdOperand(null_bda);
	auto not_zero = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpAny);
	not_zero->addIdOperand(compare->getResultId());
	spv::Id cond_id = not_zero->getResultId();
	add_instruction(entry, std::move(compare));
	add_instruction(entry, std::move(not_zero));
	builder.setBuildPoint(entry);
	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(cond_id, body_block, merge_block);

	spv::Id loaded_id;
	{
		builder.setBuildPoint(body_block);
		spv::Id uint_ptr_type = builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type);
		auto bitcast_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_ptr_type, spv::OpBitcast);
		bitcast_op->addIdOperand(func->getParamId(0));
		auto atomic_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpAtomicIAdd);
		atomic_op->addIdOperand(bitcast_op->getResultId());
		atomic_op->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
		atomic_op->addIdOperand(builder.makeUintConstant(0));
		atomic_op->addIdOperand(func->getParamId(1));
		auto add_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpIAdd);
		add_op->addIdOperand(atomic_op->getResultId());
		add_op->addIdOperand(func->getParamId(2));
		loaded_id = add_op->getResultId();
		add_instruction(body_block, std::move(bitcast_op));
		add_instruction(body_block, std::move(atomic_op));
		add_instruction(body_block, std::move(add_op));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	auto phi_op = std::make_unique<spv::Instruction>(
	    builder.getUniqueId(), uint_type, spv::OpPhi);
	phi_op->addIdOperand(builder.makeUintConstant(0));
	phi_op->addIdOperand(entry->getId());
	phi_op->addIdOperand(loaded_id);
	phi_op->addIdOperand(body_block->getId());
	spv::Id return_value = phi_op->getResultId();
	add_instruction(merge_block, std::move(phi_op));
	builder.makeReturn(false, return_value);

	builder.setBuildPoint(current_build_point);
	robust_atomic_counter_call_id = func->getId();
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_robust_physical_cbv_load(SPIRVModule &module, spv::Id type_id, spv::Id ptr_type_id,
                                                          unsigned alignment)
{
	for (auto &func : physical_cbv_call_ids)
		if (func.ptr_type_id == ptr_type_id && func.type_id == type_id && func.alignment == alignment)
			return func.func_id;

	auto *current_build_point = builder.getBuildPoint();

	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id bda_type = builder.makeVectorType(uint_type, 2);
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, type_id,
										   "RobustPhysicalCBVLoad",
										   { bda_type, uint_type }, {}, &entry);

	spv::Id bda_value_id = func->getParamId(0);
	spv::Id index_id = func->getParamId(1);

	auto *body_block = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);

	builder.setBuildPoint(entry);
	auto compare = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpULessThan);
	compare->addIdOperand(index_id);
	compare->addIdOperand(builder.makeUintConstant(64 * 1024 / alignment));
	spv::Id compare_id = compare->getResultId();
	add_instruction(entry, std::move(compare));
	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(compare_id, body_block, merge_block);

	spv::Id loaded_id;
	{
		builder.setBuildPoint(body_block);
		auto bitcast_op = std::make_unique<spv::Instruction>(
				builder.getUniqueId(), ptr_type_id, spv::OpBitcast);
		auto chain_op = std::make_unique<spv::Instruction>(
				builder.getUniqueId(),
				builder.makePointer(spv::StorageClassPhysicalStorageBuffer, type_id),
				spv::OpInBoundsAccessChain);
		auto load_op = std::make_unique<spv::Instruction>(
				builder.getUniqueId(), type_id, spv::OpLoad);
		bitcast_op->addIdOperand(bda_value_id);
		chain_op->addIdOperand(bitcast_op->getResultId());
		chain_op->addIdOperand(builder.makeUintConstant(0));
		chain_op->addIdOperand(index_id);
		load_op->addIdOperand(chain_op->getResultId());
		load_op->addImmediateOperand(spv::MemoryAccessAlignedMask);
		load_op->addImmediateOperand(alignment);
		loaded_id = load_op->getResultId();
		add_instruction(body_block, std::move(bitcast_op));
		add_instruction(body_block, std::move(chain_op));
		add_instruction(body_block, std::move(load_op));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	auto phi_op = std::make_unique<spv::Instruction>(
			builder.getUniqueId(), type_id, spv::OpPhi);
	phi_op->addIdOperand(builder.makeNullConstant(type_id));
	phi_op->addIdOperand(entry->getId());
	phi_op->addIdOperand(loaded_id);
	phi_op->addIdOperand(body_block->getId());
	spv::Id return_value = phi_op->getResultId();
	add_instruction(merge_block, std::move(phi_op));
	builder.makeReturn(false, return_value);

	builder.setBuildPoint(current_build_point);
	physical_cbv_call_ids.push_back({ type_id, ptr_type_id, alignment, func->getId() });
	return func->getId();
}

spv::Id SPIRVModule::Impl::build_is_quad_uniform_control_flow(SPIRVModule &module)
{
	if (is_quad_uniform_call_id)
		return is_quad_uniform_call_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec4_type = builder.makeVectorType(uint_type, 4);
	spv::Id bool_type = builder.makeBoolType();

	auto *func = builder.makeFunctionEntry(spv::NoPrecision, bool_type,
	                                       "IsQuadUniformControlFlow",
	                                       {}, {}, &entry);

	auto ballot_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpGroupNonUniformBallot);
	ballot_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	ballot_op->addIdOperand(builder.makeBoolConstant(true));

	spv::Id uint_2 = builder.makeUintConstant(2);
	spv::Id uint_1 = builder.makeUintConstant(1);
	uint_2 = builder.makeCompositeConstant(uvec4_type, { uint_2, uint_2, uint_2, uint_2 });
	uint_1 = builder.makeCompositeConstant(uvec4_type, { uint_1, uint_1, uint_1, uint_1 });

	auto shift_2 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpShiftRightLogical);
	shift_2->addIdOperand(ballot_op->getResultId());
	shift_2->addIdOperand(uint_2);
	auto or_2 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpBitwiseOr);
	or_2->addIdOperand(ballot_op->getResultId());
	or_2->addIdOperand(shift_2->getResultId());
	auto shift_1 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpShiftRightLogical);
	shift_1->addIdOperand(or_2->getResultId());
	shift_1->addIdOperand(uint_1);
	auto or_1 = std::make_unique<spv::Instruction>(builder.getUniqueId(), uvec4_type, spv::OpBitwiseOr);
	or_1->addIdOperand(or_2->getResultId());
	or_1->addIdOperand(shift_1->getResultId());

	auto load_invocation_id = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpLoad);
	load_invocation_id->addIdOperand(get_builtin_shader_input(spv::BuiltInSubgroupLocalInvocationId));

	auto and_invocation_id = std::make_unique<spv::Instruction>(builder.getUniqueId(), uint_type, spv::OpBitwiseAnd);
	and_invocation_id->addIdOperand(load_invocation_id->getResultId());
	and_invocation_id->addIdOperand(builder.makeUintConstant(~3u));

	auto extract_op = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpGroupNonUniformBallotBitExtract);
	extract_op->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
	extract_op->addIdOperand(or_1->getResultId());
	extract_op->addIdOperand(and_invocation_id->getResultId());
	spv::Id result_id = extract_op->getResultId();

	entry->addInstruction(std::move(ballot_op));
	entry->addInstruction(std::move(shift_2));
	entry->addInstruction(std::move(or_2));
	entry->addInstruction(std::move(shift_1));
	entry->addInstruction(std::move(or_1));
	entry->addInstruction(std::move(load_invocation_id));
	entry->addInstruction(std::move(and_invocation_id));
	entry->addInstruction(std::move(extract_op));

	builder.makeReturn(false, result_id);
	builder.setBuildPoint(current_build_point);
	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	builder.addCapability(spv::CapabilityGroupNonUniform);

	is_quad_uniform_call_id = func->getId();
	return is_quad_uniform_call_id;
}

spv::Id SPIRVModule::Impl::get_helper_call_id(SPIRVModule &module, HelperCall call,
                                              const spv::Id *aux_ids, uint32_t aux_ids_count)
{
	switch (call)
	{
	case HelperCall::NodeCoalescePayloadOffset:
		return build_node_coalesce_payload_offset(module, aux_ids, aux_ids_count);
	default:
		break;
	}
	return 0;
}

spv::Id SPIRVModule::Impl::get_helper_call_id(SPIRVModule &module, HelperCall call, spv::Id type_id)
{
	switch (call)
	{
	case HelperCall::DescriptorQACheck:
		return build_descriptor_qa_check(module);

	case HelperCall::WaveMatch:
		return build_wave_match(module, type_id);

	case HelperCall::WaveMultiPrefixCountBits:
		return build_wave_multi_prefix_count_bits(module);

	case HelperCall::WaveMultiPrefixFAdd:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformFAdd, type_id);
	case HelperCall::WaveMultiPrefixIAdd:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformIAdd, type_id);
	case HelperCall::WaveMultiPrefixFMul:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformFMul, type_id);
	case HelperCall::WaveMultiPrefixIMul:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformIMul, type_id);
	case HelperCall::WaveMultiPrefixBitOr:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformBitwiseOr, type_id);
	case HelperCall::WaveMultiPrefixBitAnd:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformBitwiseAnd, type_id);
	case HelperCall::WaveMultiPrefixBitXor:
		return build_wave_multi_prefix_op(module, spv::OpGroupNonUniformBitwiseXor, type_id);
	case HelperCall::WaveIsFirstLaneMasked:
		return build_wave_is_first_lane_masked(module);
	case HelperCall::WaveActiveAllEqualMasked:
		return build_wave_active_all_equal_masked(module, type_id);
	case HelperCall::WaveReadFirstLaneMasked:
		return build_wave_read_first_lane_masked(module, type_id);
	case HelperCall::RobustAtomicCounter:
		return build_robust_atomic_counter_op(module);
	case HelperCall::QuadAll:
		return build_quad_all(module);
	case HelperCall::QuadAny:
		return build_quad_any(module);
	case HelperCall::AtomicImageArrayR64Compact:
	case HelperCall::AtomicImageR64Compact:
	case HelperCall::AtomicImageArrayR64CompactNonUniform:
	case HelperCall::AtomicImageR64CompactNonUniform:
		return build_image_atomic_r64_compact(
			module,
			call == HelperCall::AtomicImageArrayR64Compact || call == HelperCall::AtomicImageArrayR64CompactNonUniform,
			call == HelperCall::AtomicImageR64CompactNonUniform || call == HelperCall::AtomicImageArrayR64CompactNonUniform);
	case HelperCall::FinishCrossGroupSharing:
		return build_finish_cross_group_sharing(module);
	case HelperCall::AllocateGroupNodeRecords:
		return build_allocate_node_records(module, false);
	case HelperCall::AllocateThreadNodeRecords:
		return build_allocate_node_records(module, true);
	case HelperCall::AllocateThreadNodeRecordsWaterfall:
		return build_allocate_node_records_waterfall(module);
	case HelperCall::GroupIncrementOutputCount:
		return build_increment_node_count(module, false);
	case HelperCall::ThreadIncrementOutputCount:
		return build_increment_node_count(module, true);
	case HelperCall::IsQuadUniformControlFlow:
		return build_is_quad_uniform_control_flow(module);
	case HelperCall::ValidateBDALoadStore:
		return build_validate_bda_load_store(module);
	case HelperCall::AllocateInvocationID:
		return build_allocate_invocation_id(module);

	default:
		break;
	}

	return 0;
}

SPIRVModule::SPIRVModule()
{
	impl = std::make_unique<Impl>(*this);
}

void SPIRVModule::emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage)
{
	impl->emit_entry_point(model, name, physical_storage);
}

bool SPIRVModule::Impl::execution_model_is_ray_tracing() const
{
	switch (execution_model)
	{
	case spv::ExecutionModelRayGenerationKHR:
	case spv::ExecutionModelAnyHitKHR:
	case spv::ExecutionModelIntersectionKHR:
	case spv::ExecutionModelMissKHR:
	case spv::ExecutionModelClosestHitKHR:
	case spv::ExecutionModelCallableKHR:
		return true;

	default:
		return false;
	}
}

bool SPIRVModule::Impl::spirv_requires_14() const
{
	static const uint32_t Version_1_4 = 0x00010400;
	if (override_spirv_version)
	{
		return override_spirv_version >= Version_1_4;
	}
	else
	{
		return execution_model_is_ray_tracing() || execution_model == spv::ExecutionModelMeshEXT ||
		       execution_model == spv::ExecutionModelTaskEXT;
	}
}

bool SPIRVModule::Impl::finalize_spirv(Vector<uint32_t> &spirv)
{
	spirv.clear();

	mark_error = false;
	builder.dump(spirv);
	if (spirv.size() >= 2)
	{
		if (override_spirv_version)
		{
			spirv[1] = override_spirv_version;
		}
		else
		{
			static const uint32_t Version_1_3 = 0x00010300;
			static const uint32_t Version_1_4 = 0x00010400;
			spirv[1] = spirv_requires_14() ? Version_1_4 : Version_1_3;
		}
	}
	return !mark_error;
}

void SPIRVModule::Impl::register_block(CFGNode *node)
{
	if (!node->userdata || node->id == 0)
	{
		auto *bb = new spv::Block(builder.getUniqueId(), *active_function);
#if 0
		if (!node->name.empty())
			builder.addName(bb->getId(), node->name.c_str());
#endif
		active_function->addBlock(bb);
		node->id = bb->getId();
		node->userdata = bb;
	}
}

void SPIRVModule::Impl::add_instrumented_instruction(spv::Op op, spv::Block *bb, spv::Id id)
{
	if (id == 0 || !instruction_instrumentation.info.enabled)
		return;

	spv::Id *call_id = nullptr;
	spv::Id type_id = 0;

	if (op == spv::OpAssumeTrueKHR)
	{
		call_id = &instruction_instrumentation.assume_true_call_id;
	}
	else
	{
		type_id = builder.getTypeId(id);
		if (builder.getTypeClass(type_id) != spv::OpTypeFloat)
			return;

		switch (builder.getScalarTypeWidth(type_id))
		{
		case 16:
			call_id = &instruction_instrumentation.nan_inf_instrument_fp16_call_id;
			break;

		case 32:
			call_id = &instruction_instrumentation.nan_inf_instrument_fp32_call_id;
			break;

		case 64:
			call_id = &instruction_instrumentation.nan_inf_instrument_fp64_call_id;
			break;

		default:
			break;
		}
	}

	if (!instruction_instrumentation.should_report_instrumentation_id)
	{
		instruction_instrumentation.should_report_instrumentation_id = create_variable_with_initializer(
			spv::StorageClassPrivate, builder.makeBoolType(),
			builder.makeBoolConstant(true), "ShouldReportInstrumentation");

		spv::Id u32_type = builder.makeUintType(32);
		spv::Id uvec4_type = builder.makeVectorType(u32_type, 4);
		spv::Id u32_array_type = builder.makeRuntimeArray(u32_type);
		builder.addDecoration(u32_array_type, spv::DecorationArrayStride, 4);
		spv::Id control_data = builder.makeStructType({ u32_array_type }, "InstrumentationControlDataSSBO");
		builder.addMemberDecoration(control_data, 0, spv::DecorationOffset, 0);
		builder.addMemberName(control_data, 0, "atomics");
		builder.addDecoration(control_data, spv::DecorationBlock);
		instruction_instrumentation.global_nan_inf_control_var_id =
			create_variable(spv::StorageClassStorageBuffer, control_data, "InstrumentationControlData");

		builder.addDecoration(instruction_instrumentation.global_nan_inf_control_var_id,
		                      spv::DecorationDescriptorSet, instruction_instrumentation.info.control_desc_set);

		builder.addDecoration(instruction_instrumentation.global_nan_inf_control_var_id,
		                      spv::DecorationBinding,
		                      instruction_instrumentation.info.control_binding);

		spv::Id payload_data_array = builder.makeRuntimeArray(uvec4_type);
		builder.addDecoration(payload_data_array, spv::DecorationArrayStride, 16);

		spv::Id payload_block = builder.makeStructType({ payload_data_array }, "InstrumentationDataSSBO");
		builder.addMemberName(payload_block, 0, "data");
		builder.addMemberDecoration(payload_block, 0, spv::DecorationOffset, 0);
		builder.addDecoration(payload_block, spv::DecorationBlock);
		instruction_instrumentation.global_nan_inf_data_var_id =
			create_variable(spv::StorageClassStorageBuffer, payload_block, "InstrumentationData");

		builder.addDecoration(instruction_instrumentation.global_nan_inf_data_var_id,
		                      spv::DecorationDescriptorSet, instruction_instrumentation.info.payload_desc_set);

		builder.addDecoration(instruction_instrumentation.global_nan_inf_data_var_id,
		                      spv::DecorationBinding,
		                      instruction_instrumentation.info.payload_binding);
	}

	if (call_id && !*call_id)
	{
		if (op == spv::OpAssumeTrueKHR)
			*call_id = build_assume_true_call_function(self, instruction_instrumentation);
		else
			*call_id = build_nan_inf_instrument_call_function(self, instruction_instrumentation, type_id);
	}

	auto call = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeVoidType(), spv::OpFunctionCall);
	call->addIdOperand(*call_id);
	call->addIdOperand(id);
	call->addIdOperand(builder.makeUintConstant(++instruction_instrumentation.instruction_count));
	bb->addInstruction(std::move(call));
}

void SPIRVModule::Impl::add_instruction(spv::Block *bb, std::unique_ptr<spv::Instruction> inst)
{
	spv::Op op = inst->getOpCode();
	spv::Id id = inst->getResultId();
	spv::Id type_id = inst->getTypeId();

	if (id != 0 && instruction_instrumentation.info.enabled &&
	    instruction_instrumentation.info.type == InstructionInstrumentationType::FlushNaNToZero &&
	    builder.getTypeClass(type_id) == spv::OpTypeFloat && op != spv::OpPhi)
	{
		// A bit special since we're rewriting the IDs.
		spv::Id new_id = builder.getUniqueId();
		spv::Id nan_id = builder.getUniqueId();
		inst->setResultId(new_id);

		spv::Id null_const = builder.makeNullConstant(type_id);
		auto is_nan = std::make_unique<spv::Instruction>(nan_id, builder.makeBoolType(), spv::OpIsNan);
		is_nan->addIdOperand(new_id);
		auto replaced = std::make_unique<spv::Instruction>(id, type_id, spv::OpSelect);
		replaced->addIdOperand(nan_id);
		replaced->addIdOperand(null_const);
		replaced->addIdOperand(new_id);

		bb->addInstruction(std::move(inst));
		bb->addInstruction(std::move(is_nan));
		bb->addInstruction(std::move(replaced));
	}
	else
	{
		bb->addInstruction(std::move(inst));

		// For Full instrumentation add everything, otherwise, we need specialized instrumentation.
		if (instruction_instrumentation.info.enabled &&
		    instruction_instrumentation.info.type == InstructionInstrumentationType::FullNanInf &&
		    op != spv::OpPhi)
		{
			add_instrumented_instruction(op, bb, id);
		}
	}
}

void SPIRVModule::Impl::emit_basic_block(CFGNode *node)
{
	auto *bb = get_spv_block(node);
	auto &ir = node->ir;

	builder.setBuildPoint(bb);

	spv::Block *fake_loop_block = nullptr;

	// Break-like loops might not have a continue block.
	// Infinite loops won't have merge blocks.
	if (node->ir.merge_info.merge_type == MergeType::Loop &&
	    (int(node->ir.merge_info.merge_block != nullptr) +
	     int(node->ir.merge_info.continue_block != nullptr) == 1))
	{
		fake_loop_block = new spv::Block(builder.getUniqueId(), *active_function);
	}

	// Emit phi nodes.
	for (auto &phi : ir.phi)
	{
		if (!phi.id)
			continue;

		auto phi_op = std::make_unique<spv::Instruction>(phi.id, phi.type_id, spv::OpPhi);
		for (auto &incoming : phi.incoming)
		{
			phi_op->addIdOperand(incoming.id);
			phi_op->addIdOperand(incoming.block->id);
		}

		if (fake_loop_block && !node->ir.merge_info.continue_block)
		{
			builder.setBuildPoint(fake_loop_block);
			phi_op->addIdOperand(builder.createUndefined(phi.type_id));
			builder.setBuildPoint(bb);
			phi_op->addIdOperand(fake_loop_block->getId());
		}

		if (phi.relaxed)
			builder.addDecoration(phi.id, spv::DecorationRelaxedPrecision);

		add_instruction(bb, std::move(phi_op));
	}

	bool implicit_terminator = false;
	spv::Id rewrite_phi_incoming_from = node->id;
	spv::Id rewrite_phi_incoming_to = 0;

	const auto emit_loop_header = [&](spv::Block *replacement_continue_bb) {
		auto *continue_bb = ir.merge_info.continue_block ? get_spv_block(ir.merge_info.continue_block) : nullptr;
		if (replacement_continue_bb)
			continue_bb = replacement_continue_bb;

		if (ir.merge_info.merge_block && ir.merge_info.continue_block)
		{
			builder.createLoopMerge(get_spv_block(ir.merge_info.merge_block),
			                        continue_bb,
			                        ir.merge_info.loop_control_mask);
		}
		else if (ir.merge_info.merge_block)
		{
			continue_bb = fake_loop_block;
			active_function->addBlock(continue_bb);
			builder.setBuildPoint(continue_bb);
			builder.createBranch(get_spv_block(node));
			builder.setBuildPoint(bb);
			builder.createLoopMerge(get_spv_block(ir.merge_info.merge_block), continue_bb, 0);
		}
		else if (ir.merge_info.continue_block)
		{
			auto *merge_bb = fake_loop_block;
			active_function->addBlock(merge_bb);
			builder.setBuildPoint(merge_bb);
			builder.createUnreachable();
			builder.setBuildPoint(bb);
			builder.createLoopMerge(merge_bb, continue_bb, 0);
		}
	};

	// Emit opcodes.
	for (auto *op : ir.operations)
	{
		if (implicit_terminator)
			break;

		if (op->flags & Operation::SubgroupSyncPre)
		{
			auto *pre = builder.addInstruction(spv::OpControlBarrier);
			pre->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
			pre->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
			pre->addIdOperand(builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask |
			                                           spv::MemorySemanticsAcquireReleaseMask));
		}

		if (op->op == spv::OpIsHelperInvocationEXT && !caps.supports_demote)
		{
			spv::Id helper_var_id = get_builtin_shader_input(spv::BuiltInHelperInvocation);

			if (discard_state_var_id)
			{
				auto is_helper = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpLoad);
				is_helper->addIdOperand(helper_var_id);
				spv::Id is_helper_id = is_helper->getResultId();
				add_instruction(bb, std::move(is_helper));

				auto loaded_var = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpLoad);
				loaded_var->addIdOperand(discard_state_var_id);
				spv::Id is_discard_id = loaded_var->getResultId();
				add_instruction(bb, std::move(loaded_var));

				auto or_inst = std::make_unique<spv::Instruction>(op->id, op->type_id, spv::OpLogicalOr);
				or_inst->addIdOperand(is_helper_id);
				or_inst->addIdOperand(is_discard_id);
				add_instruction(bb, std::move(or_inst));
			}
			else
			{
				auto is_helper = std::make_unique<spv::Instruction>(op->id, op->type_id, spv::OpLoad);
				is_helper->addIdOperand(helper_var_id);
				add_instruction(bb, std::move(is_helper));
			}
		}
		else if (op->op == spv::OpDemoteToHelperInvocationEXT && !caps.supports_demote)
		{
			if (op->num_arguments)
				build_discard_call_early_cond(op->arguments[0]);
			else
				build_discard_call_early();
		}
		else if (op->op == spv::OpDemoteToHelperInvocationEXT && op->num_arguments)
		{
			builder.addExtension("SPV_EXT_demote_to_helper_invocation");
			builder.addCapability(spv::CapabilityDemoteToHelperInvocationEXT);
			build_demote_call_cond(op->arguments[0]);
		}
		else if (op->op == spv::PseudoOpInstrumentExternallyVisibleStore || op->op == spv::OpAssumeTrueKHR)
		{
			add_instrumented_instruction(op->op, bb, op->arguments[0]);
		}
		else if (op->op == spv::PseudoOpReturnCond ||
		         op->op == spv::PseudoOpMaskedLoad ||
		         op->op == spv::PseudoOpMaskedStore)
		{
			// Have to ensure we emit loop header before we replace block.
			if (ir.merge_info.merge_type == MergeType::Loop && rewrite_phi_incoming_to == 0)
			{
				auto *direct_bb = new spv::Block(builder.getUniqueId(), *active_function);

				// Handle post-domination rule.
				if (ir.merge_info.continue_block && get_spv_block(ir.merge_info.continue_block) == bb)
					emit_loop_header(direct_bb);
				else
					emit_loop_header(nullptr);

				active_function->addBlock(direct_bb);
				builder.createBranch(direct_bb);
				bb = direct_bb;
				builder.setBuildPoint(bb);
			}

			// Pseudo-op. Conditional return.
			auto *inner_bb = new spv::Block(builder.getUniqueId(), *active_function);
			auto *merge_bb = new spv::Block(builder.getUniqueId(), *active_function);
			active_function->addBlock(inner_bb);
			active_function->addBlock(merge_bb);
			builder.createSelectionMerge(merge_bb, 0);
			builder.createConditionalBranch(op->arguments[op->num_arguments - 1], inner_bb, merge_bb);
			builder.setBuildPoint(inner_bb);

			spv::Id inner_id = 0;

			if (op->op == spv::PseudoOpReturnCond)
			{
				builder.makeReturn(false);
			}
			else
			{
				std::unique_ptr<spv::Instruction> inst;
				if (op->op == spv::PseudoOpMaskedStore)
				{
					inst = std::make_unique<spv::Instruction>(spv::OpStore);
				}
				else
				{
					inner_id = builder.getUniqueId();
					inst = std::make_unique<spv::Instruction>(inner_id, op->type_id, spv::OpLoad);
				}

				unsigned literal_mask = op->get_literal_mask();
				for (unsigned i = 0; i < op->num_arguments - 1; i++)
				{
					spv::Id arg = op->arguments[i];
					if (literal_mask & 1u)
						inst->addImmediateOperand(arg);
					else
					{
						assert(arg);
						inst->addIdOperand(arg);
					}
					literal_mask >>= 1u;
				}
				add_instruction(inner_bb, std::move(inst));
				builder.createBranch(merge_bb);
			}

			builder.setBuildPoint(merge_bb);

			if (op->op == spv::PseudoOpMaskedLoad)
			{
				auto phi = std::make_unique<spv::Instruction>(op->id, op->type_id, spv::OpPhi);
				phi->addIdOperand(inner_id);
				phi->addIdOperand(inner_bb->getId());
				phi->addIdOperand(builder.makeNullConstant(op->type_id));
				phi->addIdOperand(bb->getId());
				add_instruction(merge_bb, std::move(phi));
			}

			// If this is called in a continue block, the loop header might have a PHI incoming,
			// and we'll have to rewrite that.
			// For purposes of handling PHI later, the incoming block is this ID, i.e. the selection construct merge.
			node->id = merge_bb->getId();
			rewrite_phi_incoming_to = node->id;
			bb = merge_bb;
		}
		else if (op->op != spv::OpNop)
		{
			if (op->op == spv::OpDemoteToHelperInvocationEXT || op->op == spv::OpIsHelperInvocationEXT)
			{
				builder.addExtension("SPV_EXT_demote_to_helper_invocation");
				builder.addCapability(spv::CapabilityDemoteToHelperInvocationEXT);
			}
			else if (op->op == spv::OpTerminateRayKHR || op->op == spv::OpIgnoreIntersectionKHR ||
			         op->op == spv::OpEmitMeshTasksEXT)
			{
				// In DXIL, these must be by unreachable.
				// There is no [[noreturn]] qualifier used for these intrinsics apparently.
				// EmitMeshTasksEXT is similar, but ret void comes after.
				implicit_terminator = true;
			}

			std::unique_ptr<spv::Instruction> inst;
			if (op->id != 0)
				inst = std::make_unique<spv::Instruction>(op->id, op->type_id, op->op);
			else
				inst = std::make_unique<spv::Instruction>(op->op);

			unsigned literal_mask = op->get_literal_mask();

			for (auto &arg : *op)
			{
				if (literal_mask & 1u)
					inst->addImmediateOperand(arg);
				else
				{
					assert(arg);
					inst->addIdOperand(arg);
				}
				literal_mask >>= 1u;
			}
			add_instruction(bb, std::move(inst));
		}

		if (op->flags & Operation::SubgroupSyncPost)
		{
			auto *post = builder.addInstruction(spv::OpControlBarrier);
			post->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
			post->addIdOperand(builder.makeUintConstant(spv::ScopeSubgroup));
			post->addIdOperand(builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask |
			                                            spv::MemorySemanticsAcquireReleaseMask));
		}
	}

	if (implicit_terminator)
	{
		if (ir.merge_info.merge_type != MergeType::None)
		{
			LOGE("Basic block has implicit terminator, but attempts to merge execution?\n");
			mark_error = true;
		}
		else if (ir.terminator.type != Terminator::Type::Unreachable && ir.terminator.type != Terminator::Type::Return)
		{
			LOGE("Implicitly terminated blocks must terminate with Unreachable or Return.\n");
			mark_error = true;
		}

		return;
	}

	// Emit structured merge information.
	switch (ir.merge_info.merge_type)
	{
	case MergeType::Selection:
		if (ir.merge_info.merge_block)
		{
			builder.createSelectionMerge(get_spv_block(ir.merge_info.merge_block), ir.merge_info.selection_control_mask);
		}
		else
		{
			auto *unreachable_bb = new spv::Block(builder.getUniqueId(), *active_function);
			active_function->addBlock(unreachable_bb);
			builder.setBuildPoint(unreachable_bb);
			builder.createUnreachable();
			builder.setBuildPoint(bb);
			builder.createSelectionMerge(unreachable_bb, 0);
		}
		break;

	case MergeType::Loop:
		if (rewrite_phi_incoming_to == 0)
			emit_loop_header(nullptr);
		break;

	default:
		break;
	}

	// Emit terminator.
	switch (ir.terminator.type)
	{
	case Terminator::Type::Unreachable:
	{
		builder.createUnreachable();
		break;
	}

	case Terminator::Type::Branch:
	{
		auto *direct_target = get_spv_block(ir.terminator.direct_block);
		builder.createBranch(direct_target);
		if (rewrite_phi_incoming_to)
			direct_target->rewritePhiIncoming(rewrite_phi_incoming_from, rewrite_phi_incoming_to);
		break;
	}

	case Terminator::Type::Condition:
	{
		auto *true_block = get_spv_block(ir.terminator.true_block);
		auto *false_block = get_spv_block(ir.terminator.false_block);

		// This used to pass validator, but latest SPIRV-Tools as of 2023-02 started caring about it.
		// Patch this up late by rewriting loop header + conditional branch as
		// loop header -> direct -> selection merge to unreachable -> conditional branch.
		// It's easier to patch it up here than rewriting the CFG itself.
		// We only need to rewrite PHI incoming blocks.
		// A conditional terminator is fine if one of the branches target merge or continue block,
		// since a selection merge is no longer required.
		if (node->ir.merge_info.merge_type == MergeType::Loop &&
		    node->ir.terminator.type == Terminator::Type::Condition &&
		    node->ir.terminator.true_block != node->ir.merge_info.merge_block &&
		    node->ir.terminator.true_block != node->ir.merge_info.continue_block &&
		    node->ir.terminator.false_block != node->ir.merge_info.merge_block &&
		    node->ir.terminator.false_block != node->ir.merge_info.continue_block)
		{
			if (rewrite_phi_incoming_to == 0)
			{
				auto *fake_selection_bb = new spv::Block(builder.getUniqueId(), *active_function);
				auto *unreachable_bb = new spv::Block(builder.getUniqueId(), *active_function);
				active_function->addBlock(fake_selection_bb);
				active_function->addBlock(unreachable_bb);
				builder.createBranch(fake_selection_bb);
				builder.setBuildPoint(fake_selection_bb);
				builder.createSelectionMerge(unreachable_bb, 0);
				builder.createConditionalBranch(ir.terminator.conditional_id, true_block, false_block);
				builder.setBuildPoint(unreachable_bb);
				builder.createUnreachable();

				// For purposes of handling PHI later, the incoming block is this ID, i.e. the selection construct.
				// Any branches that target the loop header have already been resolved since we emit SPIR-V blocks
				// in traversal order.
				// We don't need to consider single loop block constructs since those will never hit this
				// code path. In that case, true or false block would have targeted continue block and
				// avoided this workaround in the first place.
				node->id = fake_selection_bb->getId();
			}
			else
			{
				// If we added blocks through masked ops, we have become a selection
				// construction instead of a loop, and we have to add a merge target to make this valid.
				// If we are directly branching to continue or merge target, we can omit a merge,
				// since that case does not need a merge.
				auto *unreachable_bb = new spv::Block(builder.getUniqueId(), *active_function);
				active_function->addBlock(unreachable_bb);
				builder.setBuildPoint(unreachable_bb);
				builder.createUnreachable();
				builder.setBuildPoint(bb);
				builder.createSelectionMerge(unreachable_bb, 0);
				builder.createConditionalBranch(ir.terminator.conditional_id,
				                                true_block, false_block);
			}
		}
		else
		{
			builder.createConditionalBranch(ir.terminator.conditional_id,
			                                true_block, false_block);
		}

		if (rewrite_phi_incoming_to)
		{
			true_block->rewritePhiIncoming(rewrite_phi_incoming_from, rewrite_phi_incoming_to);
			false_block->rewritePhiIncoming(rewrite_phi_incoming_from, rewrite_phi_incoming_to);
		}
		break;
	}

	case Terminator::Type::Switch:
	{
		auto switch_op = std::make_unique<spv::Instruction>(spv::OpSwitch);
		switch_op->addIdOperand(ir.terminator.conditional_id);

		auto default_itr = std::find_if(ir.terminator.cases.begin(), ir.terminator.cases.end(),
		                                [](const Terminator::Case &c) { return c.is_default; });
		assert(default_itr != ir.terminator.cases.end());
		switch_op->addIdOperand(default_itr->node->id);

		auto *default_block = get_spv_block(default_itr->node);
		default_block->addPredecessor(bb);
		if (rewrite_phi_incoming_to)
			default_block->rewritePhiIncoming(rewrite_phi_incoming_from, rewrite_phi_incoming_to);
		for (auto &switch_case : ir.terminator.cases)
		{
			if (switch_case.is_default)
				continue;
			switch_op->addImmediateOperand(switch_case.value);
			switch_op->addIdOperand(switch_case.node->id);

			auto *case_block = get_spv_block(switch_case.node);
			case_block->addPredecessor(bb);
			if (rewrite_phi_incoming_to)
				case_block->rewritePhiIncoming(rewrite_phi_incoming_from, rewrite_phi_incoming_to);
		}
		add_instruction(bb, std::move(switch_op));
		break;
	}

	case Terminator::Type::Kill:
	{
		auto kill_op = std::make_unique<spv::Instruction>(spv::OpKill);
		add_instruction(bb, std::move(kill_op));
		break;
	}

	case Terminator::Type::Return:
	{
		if (discard_state_var_id)
			build_discard_call_exit();
		builder.makeReturn(false, ir.terminator.return_value);
		break;
	}

	default:
		break;
	}
}

bool SPIRVModule::finalize_spirv(Vector<uint32_t> &spirv) const
{
	return impl->finalize_spirv(spirv);
}

void SPIRVModule::Impl::emit_entry_point_function_body(CFGStructurizer &structurizer)
{
	active_function = entry_function;
	{
		structurizer.traverse(*this);
		builder.setBuildPoint(active_function->getEntryBlock());
		builder.createBranch(get_spv_block(structurizer.get_entry_block()));
		builder.leaveFunction();
	}
	active_function = nullptr;
}

void SPIRVModule::Impl::emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer)
{
	active_function = func;
	{
		structurizer.traverse(*this);
		builder.setBuildPoint(active_function->getEntryBlock());
		builder.createBranch(get_spv_block(structurizer.get_entry_block()));
		builder.leaveFunction();
	}
	active_function = nullptr;
}

void SPIRVModule::Impl::register_active_variable(spv::StorageClass storage, spv::Id id)
{
	bool register_entry_point;
	// In SPIR-V 1.4, any global variable is part of the interface.
	if (spirv_requires_14())
		register_entry_point = storage != spv::StorageClassFunction;
	else
		register_entry_point = storage == spv::StorageClassOutput || storage == spv::StorageClassInput;

	if (register_entry_point)
		entry_point->addIdOperand(id);
}

spv::Id SPIRVModule::Impl::create_variable(spv::StorageClass storage, spv::Id type, const char *name)
{
	spv::Id id = builder.createVariable(storage, type, name);
	register_active_variable(storage, id);
	return id;
}

spv::Id SPIRVModule::Impl::create_variable_with_initializer(spv::StorageClass storage, spv::Id type,
                                                            spv::Id initializer, const char *name)
{
	spv::Id id = builder.createVariableWithInitializer(storage, type, initializer, name);
	register_active_variable(storage, id);
	return id;
}

void SPIRVModule::emit_entry_point_function_body(CFGStructurizer &structurizer)
{
	impl->emit_entry_point_function_body(structurizer);
}

void SPIRVModule::emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer)
{
	impl->emit_leaf_function_body(func, structurizer);
}

spv::Builder &SPIRVModule::get_builder()
{
	return impl->builder;
}

spv::Instruction *SPIRVModule::get_entry_point()
{
	return impl->entry_point;
}

spv::Function *SPIRVModule::get_entry_function()
{
	return impl->entry_function;
}

uint32_t SPIRVModule::allocate_id()
{
	return impl->builder.getUniqueId();
}

uint32_t SPIRVModule::allocate_ids(uint32_t count)
{
	return impl->builder.getUniqueIds(count);
}

void SPIRVModule::enable_shader_discard(bool supports_demote)
{
	impl->enable_shader_discard(supports_demote);
}

spv::Id SPIRVModule::get_builtin_shader_input(spv::BuiltIn builtin)
{
	return impl->get_builtin_shader_input(builtin);
}

spv::Id SPIRVModule::get_builtin_shader_output(spv::BuiltIn builtin)
{
	return impl->get_builtin_shader_output(builtin);
}

bool SPIRVModule::has_builtin_shader_input(spv::BuiltIn builtin) const
{
	return impl->has_builtin_shader_input(builtin);
}

bool SPIRVModule::has_builtin_shader_output(spv::BuiltIn builtin) const
{
	return impl->has_builtin_shader_output(builtin);
}

void SPIRVModule::register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin)
{
	impl->register_builtin_shader_input(id, builtin);
}

void SPIRVModule::register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin)
{
	impl->register_builtin_shader_output(id, builtin);
}

bool SPIRVModule::query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const
{
	return impl->query_builtin_shader_input(id, builtin);
}

bool SPIRVModule::query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const
{
	return impl->query_builtin_shader_output(id, builtin);
}

Operation *SPIRVModule::allocate_op()
{
	return impl->operation_pool.allocate();
}

Operation *SPIRVModule::allocate_op(spv::Op op)
{
	return impl->operation_pool.allocate(op);
}

Operation *SPIRVModule::allocate_op(spv::Op op, spv::Id id, spv::Id type_id)
{
	return impl->operation_pool.allocate(op, id, type_id);
}

spv::Id SPIRVModule::create_variable(spv::StorageClass storage, spv::Id type, const char *name)
{
	return impl->create_variable(storage, type, name);
}

spv::Id SPIRVModule::create_variable_with_initializer(spv::StorageClass storage, spv::Id type,
                                                      spv::Id initializer, const char *name)
{
	return impl->create_variable_with_initializer(storage, type, initializer, name);
}

spv::Id SPIRVModule::get_helper_call_id(HelperCall call, spv::Id type_id)
{
	return impl->get_helper_call_id(*this, call, type_id);
}

spv::Id SPIRVModule::get_helper_call_id(HelperCall call, const spv::Id *aux_ids, uint32_t aux_id_count)
{
	return impl->get_helper_call_id(*this, call, aux_ids, aux_id_count);
}

spv::Id SPIRVModule::get_robust_physical_cbv_load_call_id(spv::Id type_id, spv::Id ptr_type_id, unsigned alignment)
{
	return impl->build_robust_physical_cbv_load(*this, type_id, ptr_type_id, alignment);
}

void SPIRVModule::set_descriptor_qa_info(const DescriptorQAInfo &info)
{
	impl->descriptor_qa_info = info;
}

void SPIRVModule::set_instruction_instrumentation_info(const InstructionInstrumentationInfo &info)
{
	impl->instruction_instrumentation.info = info;
}

const DescriptorQAInfo &SPIRVModule::get_descriptor_qa_info() const
{
	return impl->descriptor_qa_info;
}

void SPIRVModule::set_override_spirv_version(uint32_t version)
{
	impl->override_spirv_version = version;
}

void SPIRVModule::set_helper_lanes_participate_in_wave_ops(bool enable)
{
	impl->helper_lanes_participate_in_wave_ops = enable;
}

void SPIRVModule::set_entry_build_point(spv::Function *func)
{
	get_builder().setBuildPoint(func->getEntryBlock());
}

bool SPIRVModule::opcode_has_side_effect_and_result(spv::Op opcode)
{
	switch (opcode)
	{
	case spv::OpAtomicIAdd:
	case spv::OpAtomicIDecrement:
	case spv::OpAtomicIIncrement:
	case spv::OpAtomicISub:
	case spv::OpAtomicAnd:
	case spv::OpAtomicOr:
	case spv::OpAtomicXor:
	case spv::OpAtomicUMax:
	case spv::OpAtomicUMin:
	case spv::OpAtomicSMax:
	case spv::OpAtomicSMin:
	case spv::OpAtomicFAddEXT:
	case spv::OpAtomicFMaxEXT:
	case spv::OpAtomicFMinEXT:
	case spv::OpAtomicCompareExchange:
	case spv::OpAtomicCompareExchangeWeak:
	case spv::OpAtomicExchange:
	case spv::OpAtomicStore:
	case spv::OpFunctionCall: // This depends, but we have to assume it might.
		return true;

	default:
		return false;
	}
}

bool SPIRVModule::opcode_is_control_dependent(spv::Op opcode)
{
	// An opcode is considered control dependent if it is affected by other invocations in the subgroup.
	switch (opcode)
	{
		// Anything derivatives
	case spv::OpDPdx:
	case spv::OpDPdxCoarse:
	case spv::OpDPdxFine:
	case spv::OpDPdy:
	case spv::OpDPdyCoarse:
	case spv::OpDPdyFine:
	case spv::OpFwidth:
	case spv::OpFwidthCoarse:
	case spv::OpFwidthFine:

		// Anything implicit LOD
	case spv::OpImageSampleImplicitLod:
	case spv::OpImageSampleDrefImplicitLod:
	case spv::OpImageSampleProjImplicitLod:
	case spv::OpImageSampleProjDrefImplicitLod:
	case spv::OpImageSparseSampleImplicitLod:
	case spv::OpImageSparseSampleDrefImplicitLod:
	case spv::OpImageSparseSampleProjImplicitLod:
	case spv::OpImageSparseSampleProjDrefImplicitLod:
	case spv::OpImageQueryLod:
	case spv::OpImageDrefGather:
	case spv::OpImageGather:
	case spv::OpImageSparseDrefGather:
	case spv::OpImageSparseGather:

		// Anything subgroups
	case spv::OpGroupNonUniformElect:
	case spv::OpGroupNonUniformAll:
	case spv::OpGroupNonUniformAny:
	case spv::OpGroupNonUniformAllEqual:
	case spv::OpGroupNonUniformBroadcast:
	case spv::OpGroupNonUniformBroadcastFirst:
	case spv::OpGroupNonUniformBallot:
	case spv::OpGroupNonUniformInverseBallot:
	case spv::OpGroupNonUniformBallotBitExtract:
	case spv::OpGroupNonUniformBallotBitCount:
	case spv::OpGroupNonUniformBallotFindLSB:
	case spv::OpGroupNonUniformBallotFindMSB:
	case spv::OpGroupNonUniformShuffle:
	case spv::OpGroupNonUniformShuffleXor:
	case spv::OpGroupNonUniformShuffleUp:
	case spv::OpGroupNonUniformShuffleDown:
	case spv::OpGroupNonUniformIAdd:
	case spv::OpGroupNonUniformFAdd:
	case spv::OpGroupNonUniformIMul:
	case spv::OpGroupNonUniformFMul:
	case spv::OpGroupNonUniformSMin:
	case spv::OpGroupNonUniformUMin:
	case spv::OpGroupNonUniformFMin:
	case spv::OpGroupNonUniformSMax:
	case spv::OpGroupNonUniformUMax:
	case spv::OpGroupNonUniformFMax:
	case spv::OpGroupNonUniformBitwiseAnd:
	case spv::OpGroupNonUniformBitwiseOr:
	case spv::OpGroupNonUniformBitwiseXor:
	case spv::OpGroupNonUniformLogicalAnd:
	case spv::OpGroupNonUniformLogicalOr:
	case spv::OpGroupNonUniformLogicalXor:
	case spv::OpGroupNonUniformQuadBroadcast:
	case spv::OpGroupNonUniformQuadSwap:

		// Control barriers
	case spv::OpControlBarrier:
	case spv::OpMemoryBarrier:

		// Internal helpers function calls may or may not include control dependent ops.
	case spv::OpFunctionCall:

		return true;

	default:
		return false;
	}
}

SPIRVModule::~SPIRVModule()
{
}
} // namespace dxil_spv
