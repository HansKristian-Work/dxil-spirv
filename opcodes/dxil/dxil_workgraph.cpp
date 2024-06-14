/* Copyright (c) 2024 Hans-Kristian Arntzen for Valve Corporation
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

#include "dxil_workgraph.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"
#include "node.hpp"

namespace dxil_spv
{
static uint32_t get_node_stride_from_annotate_handle(const llvm::CallInst *inst)
{
	auto *type_operand = llvm::cast<llvm::ConstantAggregate>(inst->getOperand(2));
	uint32_t node_io_flags = llvm::cast<llvm::ConstantInt>(type_operand->getOperand(0))->getUniqueInteger().getZExtValue();
	uint32_t stride = llvm::cast<llvm::ConstantInt>(type_operand->getOperand(1))->getUniqueInteger().getZExtValue();

	if ((node_io_flags & DXIL::NodeIOTrackRWInputSharingBit) != 0)
	{
		stride = (stride + 3u) & ~3u;
		stride += 4;
	}

	return stride;
}

bool emit_allocate_node_output_records(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto &builder = impl.builder();
	uint32_t is_per_thread = 0;
	if (!get_constant_operand(inst, 3, &is_per_thread))
		return false;

	if (!value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::AnnotateNodeHandle))
		return false;

	uint32_t stride = get_node_stride_from_annotate_handle(llvm::cast<llvm::CallInst>(inst->getOperand(1)));
	spv::Id node_index = impl.get_id_for_value(inst->getOperand(1));
	spv::Id alloc_count = impl.get_id_for_value(inst->getOperand(2));

	spv::Id call_id = impl.spirv_module.get_helper_call_id(
	    is_per_thread ? HelperCall::AllocateThreadNodeRecords : HelperCall::AllocateGroupNodeRecords);

	auto *call_op = impl.allocate(spv::OpFunctionCall, inst, builder.makeUintType(32));
	call_op->add_id(call_id);
	call_op->add_id(builder.makeUint64Constant(0)); // Pointer to { u32, u32[] }. Atomic.
	call_op->add_id(node_index);
	call_op->add_id(alloc_count);
	call_op->add_id(builder.makeUintConstant(stride));
	impl.add(call_op);

	return true;
}

static spv::Id emit_load_node_input_push_parameter(
	Converter::Impl &impl, NodeInputParameter param, spv::Id type)
{
	auto *access_offset_point = impl.allocate(spv::OpAccessChain, impl.builder().makePointer(
		spv::StorageClassPushConstant, type));
	access_offset_point->add_id(impl.node_input.node_dispatch_push_id);
	access_offset_point->add_id(impl.builder().makeUintConstant(param));
	impl.add(access_offset_point);

	auto *load_offset_point = impl.allocate(spv::OpLoad, type);
	load_offset_point->add_id(access_offset_point->id);
	impl.add(load_offset_point);

	return load_offset_point->id;
}

static spv::Id emit_load_node_input_push_pointer(
	Converter::Impl &impl, spv::Id ptr_id, spv::Id type_id, uint32_t alignment)
{
	auto *access_chain = impl.allocate(spv::OpAccessChain, impl.builder().makePointer(
		spv::StorageClassPhysicalStorageBuffer, type_id));
	access_chain->add_id(ptr_id);
	access_chain->add_id(impl.builder().makeUintConstant(0));
	impl.add(access_chain);

	auto *load_op = impl.allocate(spv::OpLoad, type_id);
	load_op->add_id(access_chain->id);
	load_op->add_literal(spv::MemoryAccessAlignedMask);
	load_op->add_literal(alignment);
	impl.add(load_op);

	return load_op->id;
}

static spv::Id emit_build_output_payload_offset(
    Converter::Impl &impl, const llvm::Value *base_offset, const llvm::Value *index, uint32_t stride)
{
	auto &builder = impl.builder();
	auto *mul_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
	mul_op->add_id(impl.get_id_for_value(index));
	mul_op->add_id(builder.makeUintConstant(stride));
	impl.add(mul_op);

	auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
	add_op->add_id(impl.get_id_for_value(base_offset));
	add_op->add_id(mul_op->id);
	impl.add(add_op);

	return add_op->id;
}

static spv::Id emit_build_input_payload_offset(Converter::Impl &impl, const llvm::Value *value)
{
	// There is no extra offset in broadcast / thread. We've already resolved it.
	if (impl.node_input.launch_type != DXIL::NodeLaunchType::Coalescing)
		return 0;

	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);

	// Compute the effective offset.
	auto *load_op = impl.allocate(spv::OpLoad, u32_type);
	load_op->add_id(impl.node_input.private_coalesce_offset_id);
	impl.add(load_op);

	auto *add_op = impl.allocate(spv::OpIAdd, u32_type);
	add_op->add_id(load_op->id);
	add_op->add_id(impl.get_id_for_value(value));
	impl.add(add_op);

	spv::Id payload_offset_id;

	if (impl.node_input.is_entry_point)
	{
		auto *offset_op = impl.allocate(spv::OpIMul, u32_type);
		offset_op->add_id(builder.makeUintConstant(impl.node_input.payload_stride));
		offset_op->add_id(add_op->id);
		impl.add(offset_op);
		payload_offset_id = offset_op->id;
	}
	else
	{
		spv::Id ptr_offset_id =
		    emit_load_node_input_push_parameter(impl, NodePayloadStrideOrOffsetsBDA, impl.node_input.u32_array_ptr_type_id);
		auto *chain_op = impl.allocate(
		    spv::OpInBoundsAccessChain, builder.makePointer(spv::StorageClassPhysicalStorageBuffer, u32_type));
		chain_op->add_id(ptr_offset_id);
		chain_op->add_id(builder.makeUintConstant(0));
		chain_op->add_id(add_op->id);
		impl.add(chain_op);

		load_op = impl.allocate(spv::OpLoad, u32_type);
		load_op->add_id(chain_op->id);
		load_op->add_literal(spv::MemoryAccessAlignedMask);
		load_op->add_literal(sizeof(uint32_t));
		impl.add(load_op);

		payload_offset_id = load_op->id;
	}

	auto *conv_op = impl.allocate(spv::OpUConvert, builder.makeUintType(64));
	conv_op->add_id(payload_offset_id);
	impl.add(conv_op);
	return conv_op->id;
}

bool emit_get_node_record_ptr(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto &builder = impl.builder();
	if (!value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::AnnotateNodeRecordHandle))
		return false;

	auto *annotation = llvm::cast<llvm::CallInst>(inst->getOperand(1));
	auto *type_operand = llvm::cast<llvm::ConstantAggregate>(annotation->getOperand(2));

	uint32_t node_io_flags =
	    llvm::cast<llvm::ConstantInt>(type_operand->getOperand(0))->getUniqueInteger().getZExtValue();

	Converter::Impl::TypeLayoutFlags flags = Converter::Impl::TYPE_LAYOUT_PHYSICAL_BIT;

	if ((node_io_flags & DXIL::NodeIOReadWriteBit) == 0)
		flags |= Converter::Impl::TYPE_LAYOUT_READ_ONLY_BIT;
	// We might have to promote this to coherent if device-scope barrier is used just like normal UAVs.
	if ((node_io_flags & DXIL::NodeIOGloballyCoherentBit) != 0)
		flags |= Converter::Impl::TYPE_LAYOUT_COHERENT_BIT;

	spv::Id physical_block_type_id =
	    impl.get_type_id(inst->getType(), Converter::Impl::TYPE_LAYOUT_BLOCK_BIT | flags);
	spv::Id physical_type_id = impl.get_type_id(inst->getType(), Converter::Impl::TYPE_LAYOUT_PHYSICAL_BIT);

	spv::Id addr;

	if (value_is_dx_op_instrinsic(annotation->getOperand(1), DXIL::Op::AllocateNodeOutputRecords))
	{
		spv::Id base_addr = emit_load_node_input_push_parameter(impl, NodePayloadBDA, builder.makeUintType(64));
		spv::Id offset_id = emit_build_output_payload_offset(impl, annotation->getOperand(1), inst->getOperand(2),
		                                                     get_node_stride_from_annotate_handle(annotation));

		auto *cast_op = impl.allocate(spv::OpUConvert, builder.makeUintType(64));
		cast_op->add_id(offset_id);
		impl.add(cast_op);

		auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(64));
		add_op->add_id(base_addr);
		add_op->add_id(cast_op->id);
		impl.add(add_op);

		addr = add_op->id;
	}
	else
	{
		if (impl.node_input.launch_type != DXIL::NodeLaunchType::Coalescing)
		{
			auto *load_op = impl.allocate(spv::OpLoad, builder.makeUintType(64));
			load_op->add_id(impl.node_input.private_bda_var_id);
			impl.add(load_op);
			addr = load_op->id;
		}
		else
		{
			addr = emit_load_node_input_push_parameter(impl, NodePayloadBDA, builder.makeUintType(64));
		}

		spv::Id addr_offset_id = emit_build_input_payload_offset(impl, inst->getOperand(2));

		if (addr_offset_id != 0)
		{
			auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(64));
			add_op->add_id(addr);
			add_op->add_id(addr_offset_id);
			impl.add(add_op);
			addr = add_op->id;
		}
	}

	auto *cast_op = impl.allocate(spv::OpConvertUToPtr, physical_block_type_id);
	cast_op->add_id(addr);
	impl.add(cast_op);

	// Start the chain at the first member.
	// This way we get coherency / read-only to propagate properly.
	auto *chain_op = impl.allocate(spv::OpAccessChain, inst, physical_type_id);
	chain_op->add_id(cast_op->id);
	chain_op->add_id(builder.makeUintConstant(0));
	impl.add(chain_op);

	return true;
}

bool emit_increment_output_count(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_output_complete(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return true;
}

bool emit_get_input_record_count(Converter::Impl &impl, const llvm::CallInst *inst)
{
	spv::Id u32_type = impl.builder().makeUintType(32);
	auto *load_op = impl.allocate(spv::OpLoad, inst, u32_type);
	load_op->add_id(impl.node_input.private_coalesce_count_id);
	impl.add(load_op);
	return true;
}

bool emit_finished_cross_group_sharing(Converter::Impl &impl, const llvm::CallInst *inst)
{
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::FinishCrossGroupSharing);

	auto *load_op = impl.allocate(spv::OpLoad, impl.builder().makeUintType(64));
	load_op->add_id(impl.node_input.private_bda_var_id);
	impl.add(load_op);

	auto *add_op = impl.allocate(spv::OpIAdd, impl.builder().makeUintType(64));
	add_op->add_id(load_op->id);
	// Use the last 4 bytes of the node as the u32 cookie.
	// We don't have the node pointer type here, so this is the most convenient approach.
	add_op->add_id(impl.builder().makeUint64Constant(impl.node_input.payload_stride - 4));
	impl.add(add_op);

	auto *call_op = impl.allocate(spv::OpFunctionCall, inst, impl.builder().makeBoolType());
	call_op->add_id(call_id);
	call_op->add_id(add_op->id);
	impl.add(call_op);

	return true;
}

bool emit_barrier_by_memory_type(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_barrier_by_memory_handle(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_barrier_by_node_record_handle(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_index_node_handle(Converter::Impl &impl, const llvm::CallInst *inst)
{
	// This is fairly easy, just add. This becomes the index into atomic array.
	auto &builder = impl.builder();
	auto *add_op = impl.allocate(spv::OpIAdd, inst, builder.makeUintType(32));
	add_op->add_id(impl.get_id_for_value(inst->getOperand(1)));
	add_op->add_id(impl.get_id_for_value(inst->getOperand(2)));
	impl.add(add_op);
	return true;
}

bool emit_annotate_node_handle(Converter::Impl &impl, const llvm::CallInst *inst)
{
	// Not sure why there are two separate opcodes for annotating a handle, but DXIL's gonna DXIL ...
	if (value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::IndexNodeHandle))
	{
		// Trivially forward the annotation.
		impl.rewrite_value(inst, impl.get_id_for_value(inst->getOperand(1)));
		return true;
	}

	if (!value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::CreateNodeOutputHandle))
		return false;

	auto *node_output = llvm::cast<llvm::CallInst>(inst->getOperand(1));
	uint32_t node_meta_index = 0;
	if (!get_constant_operand(node_output, 1, &node_meta_index))
		return false;

	if (node_meta_index >= impl.node_outputs.size())
		return false;

	auto &node_meta = impl.node_outputs[node_meta_index];
	impl.rewrite_value(inst, node_meta.spec_constant_node_index);
	return true;
}

bool emit_create_node_input_record_handle(Converter::Impl &, const llvm::CallInst *)
{
	// Node input index must be 0, since there's only one node input.
	// Do nothing here. We have to annotate the handle first, and there we can look at the node instruction.
	return true;
}

bool emit_create_node_output_handle(Converter::Impl &, const llvm::CallInst *)
{
	// Do nothing here. We have to annotate the handle first, and there we can look at the node instruction.
	return true;
}

bool emit_annotate_node_record_handle(Converter::Impl &, const llvm::CallInst *inst)
{
	return value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::CreateNodeInputRecordHandle) ||
	       value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::AllocateNodeOutputRecords);
}

bool emit_node_output_is_valid(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto &builder = impl.builder();
	impl.rewrite_value(inst, builder.makeBoolConstant(false));
	return true;
}

bool emit_get_remaining_recursion_levels(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto &builder = impl.builder();
	impl.rewrite_value(inst, builder.makeUintConstant(0));
	return true;
}

static spv::Id emit_linear_node_index(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id uvec3_type = builder.makeVectorType(u32_type, 3);

	spv::Id linear_ptr = emit_load_node_input_push_parameter(
	    impl, NodeLinearOffsetBDA, impl.node_input.u32_ptr_type_id);
	spv::Id linear_offset = emit_load_node_input_push_pointer(
	    impl, linear_ptr, u32_type, sizeof(uint32_t));

	// Build our own true workgroup ID. This is hidden from application.
	spv::Id workgroup_id = impl.create_variable(spv::StorageClassInput, uvec3_type);
	builder.addDecoration(workgroup_id, spv::DecorationBuiltIn, spv::BuiltInWorkgroupId);

	auto *load_wg_id = impl.allocate(spv::OpLoad, uvec3_type);
	load_wg_id->add_id(workgroup_id);
	impl.add(load_wg_id);

	auto *wg_x = impl.allocate(spv::OpCompositeExtract, u32_type);
	wg_x->add_id(load_wg_id->id);
	wg_x->add_literal(0);
	impl.add(wg_x);

	auto *wg_y = impl.allocate(spv::OpCompositeExtract, u32_type);
	wg_y->add_id(load_wg_id->id);
	wg_y->add_literal(1);
	impl.add(wg_y);

	auto *offset_op = impl.allocate(spv::OpIAdd, u32_type);
	offset_op->add_id(wg_y->id);
	offset_op->add_id(linear_offset);
	impl.add(offset_op);
	wg_y = offset_op;

	auto *y_node_index = impl.allocate(spv::OpIMul, u32_type);
	y_node_index->add_id(wg_y->id);
	y_node_index->add_id(builder.makeUintConstant(32 * 1024));
	impl.add(y_node_index);

	auto *linear_wg_index = impl.allocate(spv::OpIAdd, u32_type);
	linear_wg_index->add_id(y_node_index->id);
	linear_wg_index->add_id(wg_x->id);
	impl.add(linear_wg_index);

	if (impl.node_input.launch_type == DXIL::NodeLaunchType::Thread)
	{
		spv::Id workgroup_size = builder.makeUintConstant(1, true);
		builder.addDecoration(workgroup_size, spv::DecorationSpecId, 0); // TODO: Make this configurable.
		builder.addName(workgroup_size, "ThreadGroupSize");

		auto *mul_wg_index = impl.allocate(spv::OpIMul, u32_type);
		mul_wg_index->add_id(linear_wg_index->id);
		mul_wg_index->add_id(workgroup_size);
		impl.add(mul_wg_index);

		spv::Id local_invocation_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInLocalInvocationIndex);
		auto *load_local = impl.allocate(spv::OpLoad, u32_type);
		load_local->add_id(local_invocation_id);
		impl.add(load_local);

		auto *add_op = impl.allocate(spv::OpIAdd, u32_type);
		add_op->add_id(mul_wg_index->id);
		add_op->add_id(load_local->id);
		impl.add(add_op);
		return add_op->id;
	}
	else if (impl.node_input.launch_type == DXIL::NodeLaunchType::Coalescing)
	{
		auto *mul_wg_index = impl.allocate(spv::OpIMul, u32_type);
		mul_wg_index->add_id(linear_wg_index->id);
		mul_wg_index->add_id(builder.makeUintConstant(impl.node_input.coalesce_stride));
		impl.add(mul_wg_index);
		return mul_wg_index->id;
	}
	else
	{
		return linear_wg_index->id;
	}
}

static bool emit_payload_pointer_resolve(Converter::Impl &impl, spv::Id linear_node_index_id)
{
	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id u64_type = builder.makeUintType(64);

	if (impl.node_input.launch_type != DXIL::NodeLaunchType::Coalescing)
	{
		spv::Id payload_base = emit_load_node_input_push_parameter(impl, NodePayloadBDA, u64_type);
		spv::Id payload_stride_ptr = emit_load_node_input_push_parameter(
			impl, NodePayloadStrideOrOffsetsBDA, impl.node_input.is_entry_point ?
			                                     impl.node_input.u32_ptr_type_id :
			                                     impl.node_input.u32_array_ptr_type_id);

		spv::Id payload_offset_id;

		// Entry points are linear. Read stride (this can be sourced from GPU buffer, so has to be a pointer).
		if (impl.node_input.is_entry_point)
		{
			spv::Id payload_stride =
			    emit_load_node_input_push_pointer(impl, payload_stride_ptr, u32_type, sizeof(uint32_t));

			auto *payload_offset = impl.allocate(spv::OpIMul, u32_type);
			payload_offset->add_id(linear_node_index_id);
			payload_offset->add_id(payload_stride);
			impl.add(payload_offset);

			payload_offset_id = payload_offset->id;
		}
		else
		{
			// Load offset to payload indirectly.
			auto *offset_chain = impl.allocate(
				spv::OpInBoundsAccessChain,
				builder.makePointer(spv::StorageClassPhysicalStorageBuffer, u32_type));

			offset_chain->add_id(payload_stride_ptr);
			offset_chain->add_id(builder.makeUintConstant(0));
			offset_chain->add_id(linear_node_index_id);
			impl.add(offset_chain);

			auto *load_op = impl.allocate(spv::OpLoad, u32_type);
			load_op->add_id(offset_chain->id);
			load_op->add_literal(spv::MemoryAccessAlignedMask);
			load_op->add_literal(sizeof(uint32_t));
			impl.add(load_op);

			payload_offset_id = load_op->id;
		}

		auto *upconv = impl.allocate(spv::OpUConvert, u64_type);
		upconv->add_id(payload_offset_id);
		impl.add(upconv);

		auto *offset_payload = impl.allocate(spv::OpIAdd, u64_type);
		offset_payload->add_id(payload_base);
		offset_payload->add_id(upconv->id);
		impl.add(offset_payload);

		auto *store_op = impl.allocate(spv::OpStore);
		store_op->add_id(impl.node_input.private_bda_var_id);
		store_op->add_id(offset_payload->id);
		impl.add(store_op);
	}
	else
	{
		// For Coalesce, we can load an array of payloads, have to defer the resolve.
		// Fortunately, we don't have to read the payload in dispatcher, so we're okay.
		spv::Id total_ptr = emit_load_node_input_push_parameter(impl, NodeTotalNodesBDA, impl.node_input.u32_ptr_type_id);
		spv::Id total_id = emit_load_node_input_push_pointer(impl, total_ptr, u32_type, sizeof(uint32_t));

		auto *store_op = impl.allocate(spv::OpStore);
		store_op->add_id(impl.node_input.private_coalesce_offset_id);
		store_op->add_id(linear_node_index_id);
		impl.add(store_op);

		auto *count_id = impl.allocate(spv::OpISub, u32_type);
		count_id->add_id(total_id);
		count_id->add_id(linear_node_index_id);
		impl.add(count_id);

		if (!impl.glsl_std450_ext)
			impl.glsl_std450_ext = builder.import("GLSL.std.450");
		auto *min_id = impl.allocate(spv::OpExtInst, u32_type);
		min_id->add_id(impl.glsl_std450_ext);
		min_id->add_literal(GLSLstd450UMin);
		min_id->add_id(count_id->id);
		min_id->add_id(builder.makeUintConstant(impl.node_input.coalesce_stride));
		impl.add(min_id);

		store_op = impl.allocate(spv::OpStore);
		store_op->add_id(impl.node_input.private_coalesce_count_id);
		store_op->add_id(min_id->id);
		impl.add(store_op);
	}

	return true;
}

static spv::Id emit_workgraph_compute_builtins(Converter::Impl &impl, spv::Id linear_index_id)
{
	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id u64_type = builder.makeUintType(64);
	spv::Id execution_mask_id = 0;

	if (impl.node_input.launch_type == DXIL::NodeLaunchType::Broadcasting)
	{
		spv::Id workgroup_elems[3];
		workgroup_elems[0] = emit_load_node_input_push_parameter(impl, NodeGridDispatchX, u32_type);
		workgroup_elems[1] = emit_load_node_input_push_parameter(impl, NodeGridDispatchY, u32_type);
		workgroup_elems[2] = emit_load_node_input_push_parameter(impl, NodeGridDispatchZ, u32_type);
		spv::Id workgroup_id = impl.build_vector(u32_type, workgroup_elems, 3);

		auto *store_op = impl.allocate(spv::OpStore);
		store_op->add_id(impl.spirv_module.get_builtin_shader_input(spv::BuiltInWorkgroupId));
		store_op->add_id(workgroup_id);
		impl.add(store_op);

		spv::Id uvec3_type = builder.makeVectorType(u32_type, 3);
		auto *load_local_id = impl.allocate(spv::OpLoad, uvec3_type);
		load_local_id->add_id(impl.spirv_module.get_builtin_shader_input(spv::BuiltInLocalInvocationId));
		impl.add(load_local_id);

		spv::Id workgroup_size_elems[3];
		for (unsigned i = 0; i < 3; i++)
			workgroup_size_elems[i] = builder.makeUintConstant(impl.execution_mode_meta.workgroup_threads[i]);
		spv::Id workgroup_size = impl.build_vector(u32_type, workgroup_size_elems, 3);

		auto *mul_op = impl.allocate(spv::OpIMul, uvec3_type);
		mul_op->add_id(workgroup_size);
		mul_op->add_id(workgroup_id);
		impl.add(mul_op);

		auto *add_op = impl.allocate(spv::OpIAdd, uvec3_type);
		add_op->add_id(mul_op->id);
		add_op->add_id(load_local_id->id);
		impl.add(add_op);

		store_op = impl.allocate(spv::OpStore);
		store_op->add_id(impl.spirv_module.get_builtin_shader_input(spv::BuiltInGlobalInvocationId));
		store_op->add_id(add_op->id);
		impl.add(store_op);

		// The grid size is embedded in the payload itself.
		if (impl.node_input.broadcast_has_max_grid)
		{
			auto *load_bda = impl.allocate(spv::OpLoad, u64_type);
			load_bda->add_id(impl.node_input.private_bda_var_id);
			impl.add(load_bda);

			auto *offset_ptr = impl.allocate(spv::OpIAdd, u64_type);
			offset_ptr->add_id(load_bda->id);
			offset_ptr->add_id(builder.makeUint64Constant(impl.node_input.dispatch_grid.offset));
			impl.add(offset_ptr);

			spv::Id u32_grid_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1,
			                                            impl.node_input.dispatch_grid.count);
			spv::Id grid_type_id = impl.get_type_id(impl.node_input.dispatch_grid.component_type,
			                                        1, impl.node_input.dispatch_grid.count);

			auto *grid_cast = impl.allocate(
			    spv::OpBitcast, builder.makePointer(spv::StorageClassPhysicalStorageBuffer, grid_type_id));
			grid_cast->add_id(offset_ptr->id);
			impl.add(grid_cast);

			auto *load_grid = impl.allocate(spv::OpLoad, grid_type_id);
			load_grid->add_id(grid_cast->id);
			load_grid->add_literal(spv::MemoryAccessAlignedMask);
			load_grid->add_literal(impl.node_input.dispatch_grid.component_type == DXIL::ComponentType::U32 ?
			                       sizeof(uint32_t) : sizeof(uint16_t));
			impl.add(load_grid);

			if (impl.node_input.dispatch_grid.component_type == DXIL::ComponentType::U16)
			{
				auto *conv_op = impl.allocate(spv::OpUConvert, u32_grid_type_id);
				conv_op->add_id(load_grid->id);
				impl.add(conv_op);
				load_grid = conv_op;
			}

			if (impl.node_input.dispatch_grid.count == 1)
			{
				spv::Id dispatch_x = emit_load_node_input_push_parameter(impl, NodeGridDispatchX, u32_type);
				auto *mask_op = impl.allocate(spv::OpULessThan, builder.makeBoolType());
				mask_op->add_id(dispatch_x);
				mask_op->add_id(load_grid->id);
				impl.add(mask_op);
				execution_mask_id = mask_op->id;
			}
			else
			{
				workgroup_id = impl.build_vector(u32_type, workgroup_elems, impl.node_input.dispatch_grid.count);
				auto *mask_op = impl.allocate(spv::OpULessThan, builder.makeVectorType(
					builder.makeBoolType(), impl.node_input.dispatch_grid.count));
				mask_op->add_id(workgroup_id);
				mask_op->add_id(load_grid->id);
				impl.add(mask_op);

				auto *all_op = impl.allocate(spv::OpAll, builder.makeBoolType());
				all_op->add_id(mask_op->id);
				impl.add(all_op);

				execution_mask_id = all_op->id;
			}
		}
	}
	else if (impl.node_input.launch_type == DXIL::NodeLaunchType::Thread)
	{
		// Execution mask is just based on linear index < total threads.
		// Nice and easy.
		spv::Id total_ptr = emit_load_node_input_push_parameter(impl, NodeTotalNodesBDA, impl.node_input.u32_ptr_type_id);
		spv::Id total_id = emit_load_node_input_push_pointer(impl, total_ptr, u32_type, sizeof(uint32_t));
		auto *compare_op = impl.allocate(spv::OpULessThan, builder.makeBoolType());
		compare_op->add_id(linear_index_id);
		compare_op->add_id(total_id);
		impl.add(compare_op);
		execution_mask_id = compare_op->id;
	}

	return execution_mask_id;
}

bool emit_workgraph_dispatcher(Converter::Impl &impl, CFGNodePool &pool, CFGNode *entry, spv::Id main_entry_id)
{
	auto &builder = impl.builder();

	spv::Id linear_node_index_id = emit_linear_node_index(impl);
	if (!linear_node_index_id)
		return false;

	spv::Id execution_mask_id = emit_workgraph_compute_builtins(impl, linear_node_index_id);

	if (execution_mask_id)
	{
		auto *masked_block = pool.create_node();
		auto *return_block = pool.create_node();
		entry->ir.terminator.type = Terminator::Type::Condition;
		entry->ir.terminator.conditional_id = execution_mask_id;
		entry->ir.terminator.true_block = masked_block;
		entry->ir.terminator.false_block = return_block;
		entry->add_branch(masked_block);
		entry->add_branch(return_block);
		masked_block->add_branch(return_block);
		masked_block->ir.terminator.type = Terminator::Type::Branch;
		masked_block->ir.terminator.direct_block = return_block;
		return_block->ir.terminator.type = Terminator::Type::Return;
		impl.current_block = &masked_block->ir.operations;
	}

	emit_payload_pointer_resolve(impl, linear_node_index_id);
	auto *call_op = impl.allocate(spv::OpFunctionCall, builder.makeVoidType());
	call_op->add_id(main_entry_id);
	impl.add(call_op);

	return true;
}
}
