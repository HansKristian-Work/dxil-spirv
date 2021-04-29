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

#include "spirv_module.hpp"
#include "SpvBuilder.h"
#include "node.hpp"
#include "scratch_pool.hpp"
#include "logging.hpp"

namespace dxil_spv
{
constexpr uint32_t GENERATOR = 1967215134;
struct SPIRVModule::Impl : BlockEmissionInterface
{
	Impl()
	    : builder(GENERATOR, &build_logger)
	{
	}

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
	void build_descriptor_qa_check();
	void build_descriptor_qa_fault_report();
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
	void register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const;
	void register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const;
	UnorderedMap<spv::BuiltIn, spv::Id> builtins_input;
	UnorderedMap<spv::Id, spv::BuiltIn> id_to_builtin_input;
	UnorderedMap<spv::BuiltIn, spv::Id> builtins_output;
	UnorderedMap<spv::Id, spv::BuiltIn> id_to_builtin_output;

	spv::Id get_type_for_builtin(spv::BuiltIn builtin);
	ScratchPool<Operation> operation_pool;

	bool spirv_requires_14() const;
	bool builtin_requires_volatile(spv::BuiltIn builtin) const;
	bool execution_model_is_ray_tracing() const;
	bool mark_error = false;

	spv::Id get_helper_call_id(HelperCall call);
	spv::Id descriptor_qa_helper_call_id = 0;
	spv::Id descriptor_qa_report_fault_id = 0;
	spv::Id descriptor_qa_heap_buffer_id = 0;
	spv::Id descriptor_qa_global_buffer_id = 0;

	DescriptorQAInfo descriptor_qa_info;
};

spv::Id SPIRVModule::Impl::get_type_for_builtin(spv::BuiltIn builtin)
{
	switch (builtin)
	{
	case spv::BuiltInSampleMask:
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
		return builder.makeUintType(32);

	case spv::BuiltInSubgroupSize:
	case spv::BuiltInSubgroupLocalInvocationId:
		builder.addCapability(spv::CapabilityGroupNonUniform);
		return builder.makeUintType(32);

	case spv::BuiltInGlobalInvocationId:
	case spv::BuiltInLocalInvocationId:
	case spv::BuiltInWorkgroupId:
	case spv::BuiltInLaunchIdKHR:
	case spv::BuiltInLaunchSizeKHR:
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

spv::Id SPIRVModule::Impl::get_builtin_shader_input(spv::BuiltIn builtin)
{
	auto itr = builtins_input.find(builtin);
	if (itr != builtins_input.end())
		return itr->second;

	spv::Id var_id = create_variable(spv::StorageClassInput, get_type_for_builtin(builtin), nullptr);
	builder.addDecoration(var_id, spv::DecorationBuiltIn, builtin);
	if (builtin_requires_volatile(builtin))
		builder.addDecoration(var_id, spv::DecorationVolatile);
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
		builder.addExecutionMode(entry_function, spv::ExecutionMode::ExecutionModeOriginUpperLeft);
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
		true_block->addInstruction(std::make_unique<spv::Instruction>(spv::OpDemoteToHelperInvocationEXT));
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
		true_block->addInstruction(std::make_unique<spv::Instruction>(spv::OpKill));
		builder.setBuildPoint(false_block);
		builder.makeReturn(false);
	}

	builder.setBuildPoint(current_build_point);
	builder.createFunctionCall(discard_function, {});
}

enum class DescriptorQAHeapMembers
{
	DescriptorCount = 0,
	HeapIndex,
	CookiesDescriptorInfo
};

static spv::Id build_descriptor_qa_heap_buffer_type(spv::Builder &builder)
{
	Vector<spv::Id> member_types;
	// DescriptorHeapQAData {
	//  uint descriptor_count;
	//  uint heap_id;
	//  uvec2 cookies_descriptor_info[];
	// }
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id uvec2_type = builder.makeVectorType(u32_type, 2);
	spv::Id uvec2_arr_type = builder.makeRuntimeArray(uvec2_type);
	builder.addDecoration(uvec2_arr_type, spv::DecorationArrayStride, 8);

	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(uvec2_arr_type);

	spv::Id id = builder.makeStructType(member_types, "DescriptorHeapQAData");

	const auto set_info = [&](DescriptorQAHeapMembers member, int offset, const char *name) {
		builder.addMemberDecoration(id, int(member), spv::DecorationOffset, offset);
		builder.addMemberName(id, int(member), name);
	};

	set_info(DescriptorQAHeapMembers::DescriptorCount, 0, "descriptor_count");
	set_info(DescriptorQAHeapMembers::HeapIndex, 4, "heap_index");
	set_info(DescriptorQAHeapMembers::CookiesDescriptorInfo, 8, "cookies_descriptor_info");

	builder.addDecoration(id, spv::DecorationBlock);
	return id;
}

enum class DescriptorQAGlobalMembers
{
	FailedShaderHash = 0,
	FailedOffset,
	FailedHeap,
	FailedCookie,
	FaultAtomic,
	FailedInstruction,
	FailedDescriptorType,
	FaultType,
	LiveStatusTable
};

enum class DescriptorQAFaultType
{
	IndexOutOfRange = 0,
	InvalidType,
	ResourceDestroyed
};

static spv::Id build_descriptor_global_buffer_type(spv::Builder &builder)
{
	Vector<spv::Id> member_types;
	// DescriptorHeapQAGlobalData {
	//  uvec2 failed_shader_hash;
	//  uint failed_offset;
	//  uint failed_heap;
	//  uint failed_cookie;
	//  uint fault_atomic;
	//  uint failed_instruction;
	//  uint failed_type;
	//  uint fault_type;
	//  uint live_status_table[];
	// }
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id uvec2_type = builder.makeVectorType(u32_type, 2);
	spv::Id u32_arr_type = builder.makeRuntimeArray(u32_type);
	builder.addDecoration(u32_arr_type, spv::DecorationArrayStride, 4);

	member_types.push_back(uvec2_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(u32_arr_type);

	spv::Id id = builder.makeStructType(member_types, "DescriptorHeapGlobalQAData");

	const auto set_info = [&](DescriptorQAGlobalMembers member, int offset, const char *name) {
		builder.addMemberDecoration(id, int(member), spv::DecorationOffset, offset);
		builder.addMemberName(id, int(member), name);
	};

	set_info(DescriptorQAGlobalMembers::FailedShaderHash, 0, "failed_shader_hash");
	set_info(DescriptorQAGlobalMembers::FailedOffset, 8, "failed_offset");
	set_info(DescriptorQAGlobalMembers::FailedHeap, 12, "failed_heap");
	set_info(DescriptorQAGlobalMembers::FailedCookie, 16, "failed_cookie");
	set_info(DescriptorQAGlobalMembers::FaultAtomic, 20, "fault_atomic");
	set_info(DescriptorQAGlobalMembers::FailedInstruction, 24, "failed_instruction");
	set_info(DescriptorQAGlobalMembers::FailedDescriptorType, 28, "failed_descriptor_type");
	set_info(DescriptorQAGlobalMembers::FaultType, 32, "fault_type");
	set_info(DescriptorQAGlobalMembers::LiveStatusTable, 36, "live_status_table");

	builder.addDecoration(id, spv::DecorationBlock);

	return id;
}

static spv::Id build_ssbo_load(spv::Builder &builder, spv::Id value_type, spv::Id ssbo_id, uint32_t member)
{
	spv::Id ptr_id = builder.makePointer(spv::StorageClassStorageBuffer, value_type);
	auto chain = std::make_unique<spv::Instruction>(builder.getUniqueId(), ptr_id, spv::OpAccessChain);
	chain->addIdOperand(ssbo_id);
	chain->addIdOperand(builder.makeUintConstant(member));

	auto load = std::make_unique<spv::Instruction>(builder.getUniqueId(), value_type, spv::OpLoad);
	load->addIdOperand(chain->getResultId());
	spv::Id result_id = load->getResultId();

	builder.getBuildPoint()->addInstruction(std::move(chain));
	builder.getBuildPoint()->addInstruction(std::move(load));
	return result_id;
}

static void build_ssbo_store(spv::Builder &builder, spv::Id value_type, spv::Id ssbo_id, uint32_t member, spv::Id value_id)
{
	spv::Id ptr_id = builder.makePointer(spv::StorageClassStorageBuffer, value_type);
	auto chain = std::make_unique<spv::Instruction>(builder.getUniqueId(), ptr_id, spv::OpAccessChain);
	chain->addIdOperand(ssbo_id);
	chain->addIdOperand(builder.makeUintConstant(member));

	auto store = std::make_unique<spv::Instruction>(spv::OpStore);
	store->addIdOperand(chain->getResultId());
	store->addIdOperand(value_id);

	builder.getBuildPoint()->addInstruction(std::move(chain));
	builder.getBuildPoint()->addInstruction(std::move(store));
}

static spv::Id build_ssbo_load_array(spv::Builder &builder, spv::Id value_type, spv::Id ssbo_id, uint32_t member,
                                     spv::Id offset)
{
	spv::Id ptr_id = builder.makePointer(spv::StorageClassStorageBuffer, value_type);
	auto chain = std::make_unique<spv::Instruction>(builder.getUniqueId(), ptr_id, spv::OpAccessChain);
	chain->addIdOperand(ssbo_id);
	chain->addIdOperand(builder.makeUintConstant(member));
	chain->addIdOperand(offset);

	auto load = std::make_unique<spv::Instruction>(builder.getUniqueId(), value_type, spv::OpLoad);
	load->addIdOperand(chain->getResultId());
	spv::Id result_id = load->getResultId();

	builder.getBuildPoint()->addInstruction(std::move(chain));
	builder.getBuildPoint()->addInstruction(std::move(load));
	return result_id;
}

static void build_cookie_descriptor_info_split(spv::Builder &builder, spv::Id composite_id,
                                               spv::Id &cookie_id,
                                               spv::Id &cookie_shifted_id,
                                               spv::Id &cookie_masked_id,
                                               spv::Id &descriptor_info_id)
{
	spv::Id u32_type = builder.makeUintType(32);

	auto cookie = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpCompositeExtract);
	cookie->addIdOperand(composite_id);
	cookie->addImmediateOperand(0);

	auto info = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpCompositeExtract);
	info->addIdOperand(composite_id);
	info->addImmediateOperand(1);

	auto shifted = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpShiftRightLogical);
	shifted->addIdOperand(cookie->getResultId());
	shifted->addIdOperand(builder.makeUintConstant(5));

	auto masked = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpBitwiseAnd);
	masked->addIdOperand(cookie->getResultId());
	masked->addIdOperand(builder.makeUintConstant(31));

	cookie_id = cookie->getResultId();
	descriptor_info_id = info->getResultId();
	cookie_shifted_id = shifted->getResultId();
	cookie_masked_id = masked->getResultId();
	builder.getBuildPoint()->addInstruction(std::move(cookie));
	builder.getBuildPoint()->addInstruction(std::move(shifted));
	builder.getBuildPoint()->addInstruction(std::move(masked));
	builder.getBuildPoint()->addInstruction(std::move(info));
}

static spv::Id build_live_check(spv::Builder &builder, spv::Id status_id, spv::Id bit_id)
{
	spv::Id u32_type = builder.makeUintType(32);

	auto shift_up = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpShiftLeftLogical);
	shift_up->addIdOperand(builder.makeUintConstant(1));
	shift_up->addIdOperand(bit_id);

	auto mask = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpBitwiseAnd);
	mask->addIdOperand(status_id);
	mask->addIdOperand(shift_up->getResultId());

	auto cond = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpINotEqual);
	cond->addIdOperand(mask->getResultId());
	cond->addIdOperand(builder.makeUintConstant(0));
	spv::Id res = cond->getResultId();

	builder.getBuildPoint()->addInstruction(std::move(shift_up));
	builder.getBuildPoint()->addInstruction(std::move(mask));
	builder.getBuildPoint()->addInstruction(std::move(cond));
	return res;
}

static spv::Id build_binary_op(spv::Builder &builder, spv::Id type, spv::Op opcode, spv::Id a, spv::Id b)
{
	auto op = std::make_unique<spv::Instruction>(builder.getUniqueId(), type, opcode);
	op->addIdOperand(a);
	op->addIdOperand(b);
	spv::Id ret = op->getResultId();
	builder.getBuildPoint()->addInstruction(std::move(op));
	return ret;
}

void SPIRVModule::Impl::build_descriptor_qa_fault_report()
{
	if (descriptor_qa_report_fault_id)
		return;

	spv::Id global_buffer_type_id = build_descriptor_global_buffer_type(builder);
	descriptor_qa_global_buffer_id = create_variable(spv::StorageClassStorageBuffer,
	                                                 global_buffer_type_id, "QAGlobalData");
	builder.addDecoration(descriptor_qa_global_buffer_id, spv::DecorationDescriptorSet, 9);
	builder.addDecoration(descriptor_qa_global_buffer_id, spv::DecorationBinding, 11);

	auto *current_build_point = builder.getBuildPoint();

	spv::Block *entry = nullptr;

	Vector<spv::Id> param_types(6, builder.makeUintType(32));
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(),
	                                       "descriptor_qa_report_fault", param_types, {}, &entry);

	spv::Id fault_type_id = func->getParamId(0);
	spv::Id heap_offset_id = func->getParamId(1);
	spv::Id cookie_id = func->getParamId(2);
	spv::Id heap_id = func->getParamId(3);
	spv::Id descriptor_type_id = func->getParamId(4);
	spv::Id instruction_id = func->getParamId(5);
	builder.addName(fault_type_id, "fault_type");
	builder.addName(heap_offset_id, "heap_offset");
	builder.addName(cookie_id, "cookie");
	builder.addName(heap_id, "heap_index");
	builder.addName(descriptor_type_id, "descriptor_type");
	builder.addName(instruction_id, "instruction");

	spv::Id u32_type = builder.makeUintType(32);
	spv::Id u32_ptr_type = builder.makePointer(spv::StorageClassStorageBuffer, u32_type);

	auto chain = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_ptr_type, spv::OpAccessChain);
	chain->addIdOperand(descriptor_qa_global_buffer_id);
	chain->addIdOperand(builder.makeUintConstant(3));

	auto exchange = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpAtomicExchange);
	exchange->addIdOperand(chain->getResultId());
	exchange->addIdOperand(builder.makeUintConstant(spv::ScopeDevice));
	exchange->addIdOperand(builder.makeUintConstant(0));
	exchange->addIdOperand(builder.makeUintConstant(1));

	auto check = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpIEqual);
	check->addIdOperand(exchange->getResultId());
	check->addIdOperand(builder.makeUintConstant(0));
	spv::Id check_id = check->getResultId();

	auto *true_block = new spv::Block(builder.getUniqueId(), *func);
	auto *false_block = new spv::Block(builder.getUniqueId(), *func);

	builder.setBuildPoint(entry);
	entry->addInstruction(std::move(chain));
	entry->addInstruction(std::move(exchange));
	entry->addInstruction(std::move(check));
	builder.createSelectionMerge(false_block, 0);
	builder.createConditionalBranch(check_id, true_block, false_block);
	builder.setBuildPoint(true_block);
	{
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedCookie), cookie_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedOffset), heap_offset_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FaultType), fault_type_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedHeap), heap_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedDescriptorType), descriptor_type_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedInstruction), instruction_id);

		spv::Id uvec2_type = builder.makeVectorType(u32_type, 2);

		Vector<spv::Id> comps;
		comps.push_back(builder.makeUintConstant(uint32_t(descriptor_qa_info.shader_hash)));
		comps.push_back(builder.makeUintConstant(uint32_t(descriptor_qa_info.shader_hash >> 32u)));
		spv::Id hash_id = builder.makeCompositeConstant(uvec2_type, comps);
		build_ssbo_store(builder, uvec2_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedShaderHash), hash_id);

		builder.createBranch(false_block);
	}
	builder.setBuildPoint(false_block);
	builder.makeReturn(false);

	builder.setBuildPoint(current_build_point);
	descriptor_qa_report_fault_id = func->getId();
}

void SPIRVModule::Impl::build_descriptor_qa_check()
{
	if (descriptor_qa_helper_call_id)
		return;
	build_descriptor_qa_fault_report();

	spv::Id heap_buffer_type_id = build_descriptor_qa_heap_buffer_type(builder);
	descriptor_qa_heap_buffer_id = create_variable(spv::StorageClassStorageBuffer,
	                                               heap_buffer_type_id, "QAHeapData");
	builder.addDecoration(descriptor_qa_heap_buffer_id, spv::DecorationDescriptorSet, 9);
	builder.addDecoration(descriptor_qa_heap_buffer_id, spv::DecorationBinding, 10);
	builder.addDecoration(descriptor_qa_heap_buffer_id, spv::DecorationNonWritable);

	auto heap_buffer_id = descriptor_qa_heap_buffer_id;
	auto global_buffer_id = descriptor_qa_global_buffer_id;

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;

	Vector<spv::Id> param_types(3, builder.makeUintType(32));
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeUintType(32),
	                                       "descriptor_qa_check",
	                                       param_types, {}, &entry);
	builder.setBuildPoint(entry);

	spv::Id offset_id = func->getParamId(0);
	spv::Id descriptor_type_id = func->getParamId(1);
	spv::Id instruction_id = func->getParamId(2);

	builder.addName(offset_id, "heap_offset");
	builder.addName(descriptor_type_id, "descriptor_type_id");
	builder.addName(instruction_id, "instruction");

	spv::Id descriptor_count_id = build_ssbo_load(builder, builder.makeUintType(32), heap_buffer_id,
	                                              uint32_t(DescriptorQAHeapMembers::DescriptorCount));

	spv::Id fallback_offset_id = build_binary_op(builder, builder.makeUintType(32), spv::OpIAdd,
	                                             descriptor_count_id,
	                                             descriptor_type_id);

	spv::Id heap_id = build_ssbo_load(builder, builder.makeUintType(32), heap_buffer_id,
	                                  uint32_t(DescriptorQAHeapMembers::HeapIndex));
	spv::Id cookie_descriptor_info = build_ssbo_load_array(builder, builder.makeVectorType(builder.makeUintType(32), 2),
	                                                       heap_buffer_id,
	                                                       uint32_t(DescriptorQAHeapMembers::CookiesDescriptorInfo),
	                                                       offset_id);
	spv::Id cookie_id;
	spv::Id cookie_shifted_id;
	spv::Id cookie_mask_id;
	spv::Id descriptor_info_id;
	build_cookie_descriptor_info_split(builder, cookie_descriptor_info, cookie_id,
	                                   cookie_shifted_id, cookie_mask_id, descriptor_info_id);

	spv::Id live_status_id = build_ssbo_load_array(builder, builder.makeUintType(32),
	                                               global_buffer_id,
	                                               uint32_t(DescriptorQAGlobalMembers::LiveStatusTable),
	                                               cookie_shifted_id);
	spv::Id live_status_cond_id = build_live_check(builder, live_status_id, cookie_mask_id);
	spv::Id type_cond_id = build_live_check(builder, descriptor_info_id, descriptor_type_id);

	spv::Id out_of_range_id = build_binary_op(builder, builder.makeBoolType(), spv::OpUGreaterThanEqual,
	                                          offset_id, descriptor_count_id);

	const auto emit_fault = [&](DescriptorQAFaultType type) {
		auto call = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeVoidType(), spv::OpFunctionCall);
		call->addIdOperand(descriptor_qa_report_fault_id);
		call->addIdOperand(builder.makeUintConstant(uint32_t(type)));
		call->addIdOperand(offset_id);
		call->addIdOperand(cookie_id);
		call->addIdOperand(heap_id);
		call->addIdOperand(descriptor_type_id);
		call->addIdOperand(instruction_id);
		builder.getBuildPoint()->addInstruction(std::move(call));
		builder.makeReturn(false, fallback_offset_id);
	};

	// First check: descriptor index is in range of heap.
	auto *out_of_range_block = new spv::Block(builder.getUniqueId(), *func);
	auto *in_range_block = new spv::Block(builder.getUniqueId(), *func);
	builder.createSelectionMerge(in_range_block, 0);
	builder.createConditionalBranch(out_of_range_id, out_of_range_block, in_range_block);
	{
		builder.setBuildPoint(out_of_range_block);
		emit_fault(DescriptorQAFaultType::IndexOutOfRange);
	}
	builder.setBuildPoint(in_range_block);

	// Second: Check if type matches.
	auto *wrong_type_block = new spv::Block(builder.getUniqueId(), *func);
	auto *correct_type_block = new spv::Block(builder.getUniqueId(), *func);
	builder.createSelectionMerge(correct_type_block, 0);
	builder.createConditionalBranch(type_cond_id, correct_type_block, wrong_type_block);
	{
		builder.setBuildPoint(wrong_type_block);
		emit_fault(DescriptorQAFaultType::InvalidType);
	}
	builder.setBuildPoint(correct_type_block);

	// Third: Check if cookie is alive.
	auto *dead_block = new spv::Block(builder.getUniqueId(), *func);
	auto *alive_block = new spv::Block(builder.getUniqueId(), *func);
	builder.createSelectionMerge(alive_block, 0);
	builder.createConditionalBranch(live_status_cond_id, alive_block, dead_block);
	{
		builder.setBuildPoint(dead_block);
		emit_fault(DescriptorQAFaultType::ResourceDestroyed);
	}
	builder.setBuildPoint(alive_block);

	builder.makeReturn(false, offset_id);

	builder.setBuildPoint(current_build_point);
	descriptor_qa_helper_call_id = func->getId();
}

spv::Id SPIRVModule::Impl::get_helper_call_id(HelperCall call)
{
	switch (call)
	{
	case HelperCall::DescriptorQACheck:
		build_descriptor_qa_check();
		return descriptor_qa_helper_call_id;
	}

	return 0;
}

SPIRVModule::SPIRVModule()
{
	impl = std::make_unique<Impl>();
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
	return execution_model_is_ray_tracing();
}

bool SPIRVModule::Impl::finalize_spirv(Vector<uint32_t> &spirv)
{
	spirv.clear();

	mark_error = false;
	builder.dump(spirv);
	if (spirv.size() >= 2)
	{
		static const uint32_t Version_1_3 = 0x00010300;
		static const uint32_t Version_1_4 = 0x00010400;
		spirv[1] = spirv_requires_14() ? Version_1_4 : Version_1_3;
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

void SPIRVModule::Impl::emit_basic_block(CFGNode *node)
{
	auto *bb = get_spv_block(node);
	auto &ir = node->ir;

	builder.setBuildPoint(bb);

	spv::Block *fake_incoming_block = nullptr;
	if (node->ir.merge_info.merge_type == MergeType::Loop &&
	    node->ir.merge_info.merge_block &&
	    !node->ir.merge_info.continue_block)
	{
		fake_incoming_block = new spv::Block(builder.getUniqueId(), *active_function);
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

		if (fake_incoming_block)
		{
			builder.setBuildPoint(fake_incoming_block);
			phi_op->addIdOperand(builder.createUndefined(phi.type_id));
			builder.setBuildPoint(bb);
			phi_op->addIdOperand(fake_incoming_block->getId());
		}

		bb->addInstruction(std::move(phi_op));
	}

	bool implicit_terminator = false;

	// Emit opcodes.
	for (auto *op : ir.operations)
	{
		if (implicit_terminator)
			break;

		if (op->op == spv::OpIsHelperInvocationEXT && !caps.supports_demote)
		{
			spv::Id helper_var_id = get_builtin_shader_input(spv::BuiltInHelperInvocation);

			if (discard_state_var_id)
			{
				auto is_helper = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpLoad);
				is_helper->addIdOperand(helper_var_id);
				spv::Id is_helper_id = is_helper->getResultId();
				bb->addInstruction(std::move(is_helper));

				auto loaded_var = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpLoad);
				loaded_var->addIdOperand(discard_state_var_id);
				spv::Id is_discard_id = loaded_var->getResultId();
				bb->addInstruction(std::move(loaded_var));

				auto or_inst = std::make_unique<spv::Instruction>(op->id, op->type_id, spv::OpLogicalOr);
				or_inst->addIdOperand(is_helper_id);
				or_inst->addIdOperand(is_discard_id);
				bb->addInstruction(std::move(or_inst));
			}
			else
			{
				auto is_helper = std::make_unique<spv::Instruction>(op->id, op->type_id, spv::OpLoad);
				is_helper->addIdOperand(helper_var_id);
				bb->addInstruction(std::move(is_helper));
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
		else
		{
			if (op->op == spv::OpDemoteToHelperInvocationEXT || op->op == spv::OpIsHelperInvocationEXT)
			{
				builder.addExtension("SPV_EXT_demote_to_helper_invocation");
				builder.addCapability(spv::CapabilityDemoteToHelperInvocationEXT);
			}
			else if (op->op == spv::OpTerminateRayKHR || op->op == spv::OpIgnoreIntersectionKHR)
			{
				// In DXIL, these must be by unreachable.
				// There is no [[noreturn]] qualifier used for these intrinsics apparently.
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
			bb->addInstruction(std::move(inst));
		}
	}

	if (implicit_terminator)
	{
		if (ir.merge_info.merge_type != MergeType::None)
		{
			LOGE("Basic block has implicit terminator, but attempts to merge execution?\n");
			mark_error = true;
			return;
		}
		else if (ir.terminator.type != Terminator::Type::Unreachable)
		{
			LOGE("Implicitly terminated blocks must terminate with Unreachable.\n");
			mark_error = true;
			return;
		}

		return;
	}

	// Emit structured merge information.
	switch (ir.merge_info.merge_type)
	{
	case MergeType::Selection:
		if (ir.merge_info.merge_block)
		{
			builder.createSelectionMerge(get_spv_block(ir.merge_info.merge_block), 0);
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
		if (ir.merge_info.merge_block && ir.merge_info.continue_block)
		{
			builder.createLoopMerge(get_spv_block(ir.merge_info.merge_block),
			                        get_spv_block(ir.merge_info.continue_block), 0);
		}
		else if (ir.merge_info.merge_block)
		{
			auto *continue_bb = fake_incoming_block;
			active_function->addBlock(continue_bb);
			builder.setBuildPoint(continue_bb);
			builder.createBranch(get_spv_block(node));
			builder.setBuildPoint(bb);
			builder.createLoopMerge(get_spv_block(ir.merge_info.merge_block), continue_bb, 0);
			break;
		}
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
		builder.createBranch(get_spv_block(ir.terminator.direct_block));
		break;
	}

	case Terminator::Type::Condition:
	{
		builder.createConditionalBranch(ir.terminator.conditional_id, get_spv_block(ir.terminator.true_block),
		                                get_spv_block(ir.terminator.false_block));
		break;
	}

	case Terminator::Type::Switch:
	{
		auto switch_op = std::make_unique<spv::Instruction>(spv::OpSwitch);
		switch_op->addIdOperand(ir.terminator.conditional_id);
		switch_op->addIdOperand(ir.terminator.default_node->id);
		get_spv_block(ir.terminator.default_node)->addPredecessor(bb);
		for (auto &switch_case : ir.terminator.cases)
		{
			switch_op->addImmediateOperand(switch_case.value);
			switch_op->addIdOperand(switch_case.node->id);
			get_spv_block(switch_case.node)->addPredecessor(bb);
		}
		bb->addInstruction(std::move(switch_op));
		break;
	}

	case Terminator::Type::Kill:
	{
		auto kill_op = std::make_unique<spv::Instruction>(spv::OpKill);
		bb->addInstruction(std::move(kill_op));
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

spv::Id SPIRVModule::get_helper_call_id(HelperCall call)
{
	return impl->get_helper_call_id(call);
}

void SPIRVModule::set_descriptor_qa_info(const DescriptorQAInfo &info)
{
	impl->descriptor_qa_info = info;
}

SPIRVModule::~SPIRVModule()
{
}
} // namespace dxil_spv
