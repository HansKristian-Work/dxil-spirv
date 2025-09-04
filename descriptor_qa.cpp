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

#include "descriptor_qa.hpp"
#include "spirv_module.hpp"
#include "SpvBuilder.h"
#include "logging.hpp"

namespace dxil_spv
{
static spv::Id build_descriptor_qa_heap_buffer_type(spv::Builder &builder)
{
	Vector<spv::Id> member_types;
	// DescriptorHeapQAData {
	//  uint descriptor_count;
	//  uint heap_id;
	//  uvec3 cookies_descriptor_info[];
	// }
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id uvec3_type = builder.makeVectorType(u32_type, 3);
	spv::Id uvec3_arr_type = builder.makeRuntimeArray(uvec3_type);
	builder.addDecoration(uvec3_arr_type, spv::DecorationArrayStride, 12);

	member_types.push_back(u32_type);
	member_types.push_back(u32_type);
	member_types.push_back(uvec3_arr_type);

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
	//  uint failed_descriptor_type_mask;
	//  uint actual_descriptor_type_mask;
	//  uint fault_type;
	//  uint va_map_timestamp;
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
	set_info(DescriptorQAGlobalMembers::FailedDescriptorTypeMask, 28, "failed_descriptor_type_mask");
	set_info(DescriptorQAGlobalMembers::ActualDescriptorTypeMask, 32, "actual_descriptor_type_mask");
	set_info(DescriptorQAGlobalMembers::FaultType, 36, "fault_type");
	set_info(DescriptorQAGlobalMembers::VAMapTimestamp, 40, "va_map_timestamp");
	set_info(DescriptorQAGlobalMembers::LiveStatusTable, 44, "live_status_table");

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
	if (builder.hasCapability(spv::CapabilityVulkanMemoryModel))
		store->addImmediateOperand(spv::MemoryAccessNonPrivatePointerMask);

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
                                               spv::Id &descriptor_timestamp_id,
                                               spv::Id &descriptor_info_id)
{
	spv::Id u32_type = builder.makeUintType(32);

	auto *cookie = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	cookie->addIdOperand(composite_id);
	cookie->addImmediateOperand(0);

	auto *descriptor_timestamp = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	descriptor_timestamp->addIdOperand(composite_id);
	descriptor_timestamp->addImmediateOperand(1);

	auto *descriptor_type = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	descriptor_type->addIdOperand(composite_id);
	descriptor_type->addImmediateOperand(2);

	auto *shifted = builder.addInstruction(u32_type, spv::OpShiftRightLogical);
	shifted->addIdOperand(cookie->getResultId());
	shifted->addIdOperand(builder.makeUintConstant(5));

	auto *masked = builder.addInstruction(u32_type, spv::OpBitwiseAnd);
	masked->addIdOperand(cookie->getResultId());
	masked->addIdOperand(builder.makeUintConstant(31));

	cookie_id = cookie->getResultId();
	descriptor_timestamp_id = descriptor_timestamp->getResultId();
	descriptor_info_id = descriptor_type->getResultId();
	cookie_shifted_id = shifted->getResultId();
	cookie_masked_id = masked->getResultId();
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

static void build_ssbo_barrier(spv::Builder &builder)
{
	auto barrier = std::make_unique<spv::Instruction>(spv::OpMemoryBarrier);
	barrier->addIdOperand(builder.getAtomicDeviceScopeId());
	barrier->addIdOperand(builder.makeUintConstant(spv::MemorySemanticsUniformMemoryMask |
	                                               spv::MemorySemanticsAcquireReleaseMask));
	builder.getBuildPoint()->addInstruction(std::move(barrier));
}

static void build_descriptor_qa_fault_report(SPIRVModule &module, spv::Id &func_id, spv::Id &buffer_id)
{
	auto &builder = module.get_builder();
	spv::Id global_buffer_type_id = build_descriptor_global_buffer_type(builder);
	spv::Id descriptor_qa_global_buffer_id = module.create_variable(spv::StorageClassStorageBuffer,
	                                                                global_buffer_type_id, "QAGlobalData");
	buffer_id = descriptor_qa_global_buffer_id;

	builder.addDecoration(descriptor_qa_global_buffer_id, spv::DecorationDescriptorSet,
	                      module.get_descriptor_qa_info().global_desc_set);
	builder.addDecoration(descriptor_qa_global_buffer_id, spv::DecorationBinding,
	                      module.get_descriptor_qa_info().global_binding);

	auto *current_build_point = builder.getBuildPoint();

	spv::Block *entry = nullptr;

	Vector<spv::Id> param_types(7, builder.makeUintType(32));
	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(),
	                                       "descriptor_qa_report_fault", param_types, {}, &entry);

	func_id = func->getId();

	spv::Id fault_type_id = func->getParamId(0);
	spv::Id heap_offset_id = func->getParamId(1);
	spv::Id cookie_id = func->getParamId(2);
	spv::Id heap_id = func->getParamId(3);
	spv::Id descriptor_type_id = func->getParamId(4);
	spv::Id actual_descriptor_type_id = func->getParamId(5);
	spv::Id instruction_id = func->getParamId(6);
	builder.addName(fault_type_id, "fault_type");
	builder.addName(heap_offset_id, "heap_offset");
	builder.addName(cookie_id, "cookie");
	builder.addName(heap_id, "heap_index");
	builder.addName(descriptor_type_id, "descriptor_type");
	builder.addName(actual_descriptor_type_id, "actual_descriptor_type");
	builder.addName(instruction_id, "instruction");

	spv::Id u32_type = builder.makeUintType(32);
	spv::Id u32_ptr_type = builder.makePointer(spv::StorageClassStorageBuffer, u32_type);

	auto chain = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_ptr_type, spv::OpAccessChain);
	chain->addIdOperand(descriptor_qa_global_buffer_id);
	chain->addIdOperand(builder.makeUintConstant(uint32_t(DescriptorQAGlobalMembers::FaultAtomic)));

	auto increment = std::make_unique<spv::Instruction>(builder.getUniqueId(), u32_type, spv::OpAtomicIAdd);
	increment->addIdOperand(chain->getResultId());
	increment->addIdOperand(builder.getAtomicDeviceScopeId());
	increment->addIdOperand(builder.makeUintConstant(0));
	increment->addIdOperand(builder.makeUintConstant(1));

	auto check = std::make_unique<spv::Instruction>(builder.getUniqueId(), builder.makeBoolType(), spv::OpIEqual);
	check->addIdOperand(increment->getResultId());
	check->addIdOperand(builder.makeUintConstant(0));
	spv::Id check_id = check->getResultId();

	auto *true_block = new spv::Block(builder.getUniqueId(), *func);
	auto *false_block = new spv::Block(builder.getUniqueId(), *func);

	builder.setBuildPoint(entry);
	entry->addInstruction(std::move(chain));
	entry->addInstruction(std::move(increment));
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
		                 uint32_t(DescriptorQAGlobalMembers::FailedHeap), heap_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedDescriptorTypeMask), descriptor_type_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::ActualDescriptorTypeMask), actual_descriptor_type_id);
		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedInstruction), instruction_id);

		spv::Id uvec2_type = builder.makeVectorType(u32_type, 2);

		Vector<spv::Id> comps;
		comps.push_back(builder.makeUintConstant(uint32_t(module.get_descriptor_qa_info().shader_hash)));
		comps.push_back(builder.makeUintConstant(uint32_t(module.get_descriptor_qa_info().shader_hash >> 32u)));
		spv::Id hash_id = builder.makeCompositeConstant(uvec2_type, comps);
		build_ssbo_store(builder, uvec2_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FailedShaderHash), hash_id);

		// Device memory barrier here so that if host observed fault_type != 0,
		// we're certain that the other values are correct as well.
		build_ssbo_barrier(builder);

		build_ssbo_store(builder, u32_type, descriptor_qa_global_buffer_id,
		                 uint32_t(DescriptorQAGlobalMembers::FaultType), fault_type_id);

		builder.createBranch(false_block);
	}
	builder.setBuildPoint(false_block);
	builder.makeReturn(false);
	builder.setBuildPoint(current_build_point);
}

spv::Id build_descriptor_qa_check_function(SPIRVModule &module)
{
	auto &builder = module.get_builder();
	spv::Id fault_func_id, global_buffer_id;
	build_descriptor_qa_fault_report(module, fault_func_id, global_buffer_id);

	spv::Id heap_buffer_type_id = build_descriptor_qa_heap_buffer_type(builder);
	spv::Id descriptor_qa_heap_buffer_id = module.create_variable(spv::StorageClassStorageBuffer,
	                                                              heap_buffer_type_id, "QAHeapData");
	builder.addDecoration(descriptor_qa_heap_buffer_id, spv::DecorationDescriptorSet,
	                      module.get_descriptor_qa_info().heap_desc_set);
	builder.addDecoration(descriptor_qa_heap_buffer_id, spv::DecorationBinding,
	                      module.get_descriptor_qa_info().heap_binding);
	builder.addDecoration(descriptor_qa_heap_buffer_id, spv::DecorationNonWritable);

	auto heap_buffer_id = descriptor_qa_heap_buffer_id;

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
	builder.addName(descriptor_type_id, "descriptor_type_mask");
	builder.addName(instruction_id, "instruction");

	spv::Id descriptor_count_id = build_ssbo_load(builder, builder.makeUintType(32), heap_buffer_id,
	                                              uint32_t(DescriptorQAHeapMembers::DescriptorCount));

	spv::Id fallback_offset_id = descriptor_count_id;

	spv::Id heap_id = build_ssbo_load(builder, builder.makeUintType(32), heap_buffer_id,
	                                  uint32_t(DescriptorQAHeapMembers::HeapIndex));
	spv::Id timestamp_id = build_ssbo_load(builder, builder.makeUintType(32), global_buffer_id,
	                                       uint32_t(DescriptorQAGlobalMembers::VAMapTimestamp));
	spv::Id cookie_descriptor_info = build_ssbo_load_array(builder, builder.makeVectorType(builder.makeUintType(32), 3),
	                                                       heap_buffer_id,
	                                                       uint32_t(DescriptorQAHeapMembers::CookiesDescriptorInfo),
	                                                       offset_id);
	spv::Id cookie_id;
	spv::Id cookie_shifted_id;
	spv::Id cookie_mask_id;
	spv::Id descriptor_timestamp_id;
	spv::Id descriptor_info_id;
	build_cookie_descriptor_info_split(builder, cookie_descriptor_info, cookie_id,
	                                   cookie_shifted_id, cookie_mask_id,
	                                   descriptor_timestamp_id, descriptor_info_id);

	spv::Id live_status_id = build_ssbo_load_array(builder, builder.makeUintType(32),
	                                               global_buffer_id,
	                                               uint32_t(DescriptorQAGlobalMembers::LiveStatusTable),
	                                               cookie_shifted_id);
	spv::Id live_status_cond_id = build_live_check(builder, live_status_id, cookie_mask_id);

	spv::Id type_cond_id = build_binary_op(builder, builder.makeUintType(32), spv::OpBitwiseAnd, descriptor_info_id, descriptor_type_id);
	type_cond_id = build_binary_op(builder, builder.makeBoolType(), spv::OpIEqual,
	                               type_cond_id, descriptor_type_id);

	spv::Id out_of_range_id = build_binary_op(builder, builder.makeBoolType(), spv::OpUGreaterThanEqual,
	                                          offset_id, descriptor_count_id);

	// First check: descriptor index is in range of heap.
	auto *range_check = builder.addInstruction(builder.makeUintType(32), spv::OpSelect);
	range_check->addIdOperand(out_of_range_id);
	range_check->addIdOperand(builder.makeUintConstant(DESCRIPTOR_QA_FAULT_INDEX_OUT_OF_RANGE_BIT));
	range_check->addIdOperand(builder.makeUintConstant(0u));

	// Second: Check if type matches.
	auto *type_check = builder.addInstruction(builder.makeUintType(32), spv::OpSelect);
	type_check->addIdOperand(type_cond_id);
	type_check->addIdOperand(builder.makeUintConstant(0u));
	type_check->addIdOperand(builder.makeUintConstant(DESCRIPTOR_QA_FAULT_INVALID_TYPE_BIT));

	// Third: Check if cookie is alive.
	auto *alive_check = builder.addInstruction(builder.makeUintType(32), spv::OpSelect);
	alive_check->addIdOperand(live_status_cond_id);
	alive_check->addIdOperand(builder.makeUintConstant(0u));
	alive_check->addIdOperand(builder.makeUintConstant(DESCRIPTOR_QA_FAULT_RESOURCE_DESTROYED_BIT));

	// Fourth: Check if the view was created before GPU submission happened.
	auto *time_check_cond = builder.addInstruction(builder.makeBoolType(), spv::OpUGreaterThanEqual);
	time_check_cond->addIdOperand(timestamp_id);
	time_check_cond->addIdOperand(descriptor_timestamp_id);

	auto *time_check = builder.addInstruction(builder.makeUintType(32), spv::OpSelect);
	time_check->addIdOperand(time_check_cond->getResultId());
	time_check->addIdOperand(builder.makeUintConstant(0u));
	time_check->addIdOperand(builder.makeUintConstant(DESCRIPTOR_QA_FAULT_VA_TIMESTAMP_INVALID_BIT));

	auto *merge_check0 = builder.addInstruction(builder.makeUintType(32), spv::OpBitwiseOr);
	auto *merge_check1 = builder.addInstruction(builder.makeUintType(32), spv::OpBitwiseOr);
	auto *merge_check2 = builder.addInstruction(builder.makeUintType(32), spv::OpBitwiseOr);
	merge_check0->addIdOperand(range_check->getResultId());
	merge_check0->addIdOperand(type_check->getResultId());
	merge_check1->addIdOperand(merge_check0->getResultId());
	merge_check1->addIdOperand(alive_check->getResultId());
	merge_check2->addIdOperand(merge_check1->getResultId());
	merge_check2->addIdOperand(time_check->getResultId());

	auto *fault_cond = builder.addInstruction(builder.makeBoolType(), spv::OpINotEqual);
	fault_cond->addIdOperand(merge_check2->getResultId());
	fault_cond->addIdOperand(builder.makeUintConstant(0u));

	spv::Id fault_type_id = merge_check2->getResultId();
	spv::Id fault_cond_id = fault_cond->getResultId();

	auto *fault_block = new spv::Block(builder.getUniqueId(), *func);
	auto *correct_block = new spv::Block(builder.getUniqueId(), *func);
	builder.createSelectionMerge(correct_block, 0);
	builder.createConditionalBranch(fault_cond_id, fault_block, correct_block);
	{
		builder.setBuildPoint(fault_block);
		auto *call = builder.addInstruction(builder.makeVoidType(), spv::OpFunctionCall);
		call->addIdOperand(fault_func_id);
		call->addIdOperand(fault_type_id);
		call->addIdOperand(offset_id);
		call->addIdOperand(cookie_id);
		call->addIdOperand(heap_id);
		call->addIdOperand(descriptor_type_id);
		call->addIdOperand(descriptor_info_id);
		call->addIdOperand(instruction_id);
		builder.makeReturn(false, fallback_offset_id);
	}
	builder.setBuildPoint(correct_block);
	builder.makeReturn(false, offset_id);

	builder.setBuildPoint(current_build_point);
	return func->getId();
}
}
