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
bool emit_allocate_node_output_records(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_get_node_record_ptr(Converter::Impl &impl, const llvm::CallInst *inst)
{
	auto &builder = impl.builder();
	if (value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::AnnotateNodeRecordHandle))
	{
		// Input pointer.
		auto *load_op = impl.allocate(spv::OpLoad, builder.makeUintType(64));
		load_op->add_id(impl.node_input.private_bda_var_id);
		impl.add(load_op);

		spv::Id addr = load_op->id;

		// Handle NodeArray.
		uint32_t const_op;
		if (get_constant_operand(inst, 2, &const_op))
		{
			if (const_op != 0)
			{
				auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(64));
				add_op->add_id(addr);
				add_op->add_id(builder.makeUint64Constant(uint64_t(impl.node_input.payload_stride) * const_op));
				impl.add(add_op);

				addr = add_op->id;
			}
		}
		else
		{
			auto *offset_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			offset_op->add_id(builder.makeUintConstant(impl.node_input.payload_stride));
			offset_op->add_id(impl.get_id_for_value(inst->getOperand(2)));
			impl.add(offset_op);

			auto *conv_op = impl.allocate(spv::OpUConvert, builder.makeUintType(64));
			conv_op->add_id(offset_op->id);
			impl.add(conv_op);

			auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(64));
			add_op->add_id(addr);
			add_op->add_id(conv_op->id);
			impl.add(add_op);

			addr = add_op->id;
		}

		spv::Id physical_type_id = impl.get_type_id(inst->getType(),
		                                            Converter::Impl::TYPE_LAYOUT_BLOCK_BIT |
		                                            Converter::Impl::TYPE_LAYOUT_PHYSICAL_BIT);

		auto *cast_op = impl.allocate(spv::OpConvertUToPtr, inst, physical_type_id);
		cast_op->add_id(addr);
		impl.add(cast_op);
		return true;
	}
	else if (value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::AnnotateNodeHandle))
	{
		// Output pointer.
		return false;
	}
	else
	{
		// Should not happen.
		return false;
	}
}

bool emit_increment_output_count(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_output_complete(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_get_input_record_count(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_finished_cross_group_sharing(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
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
	return false;
}

bool emit_annotate_node_handle(Converter::Impl &impl, const llvm::CallInst *inst)
{
	return false;
}

bool emit_create_node_input_record_handle(Converter::Impl &, const llvm::CallInst *)
{
	// Node input index must be 0, since there's only one node input.
	// Do nothing here. We have to annotate the handle first, and there we can look at the node instruction.
	return true;
}

bool emit_annotate_node_record_handle(Converter::Impl &impl, const llvm::CallInst *inst)
{
	// This is only used by inputs
	if (!value_is_dx_op_instrinsic(inst->getOperand(1), DXIL::Op::CreateNodeInputRecordHandle))
		return false;

	//auto *type_operand = llvm::cast<llvm::ConstantAggregate>(inst->getOperand(2));
	//uint32_t node_io_flags = llvm::cast<llvm::ConstantInt>(type_operand->getOperand(0))->getUniqueInteger().getZExtValue();
	//uint32_t record_size = llvm::cast<llvm::ConstantInt>(type_operand->getOperand(1))->getUniqueInteger().getZExtValue();
	// This is also a dummy. There is only one node record handle, and we can defer dealing with pointers until
	// GetNodeRecordPtr.

	return true;
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

	auto *linear_node_index = impl.allocate(spv::OpIAdd, u32_type);
	linear_node_index->add_id(y_node_index->id);
	linear_node_index->add_id(wg_x->id);
	impl.add(linear_node_index);

	// TODO: In thread mode, need to multiply by workgroup size and offset local invocation index as appropriate.
	// TODO: In coalesce mode, multiply by coalesce width.

	return linear_node_index->id;
}

static bool emit_payload_pointer_resolve(Converter::Impl &impl, spv::Id linear_node_index_id)
{
	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);
	spv::Id u64_type = builder.makeUintType(64);

	if (impl.node_input.launch_type == DXIL::NodeLaunchType::Broadcasting)
	{
		spv::Id payload_base = emit_load_node_input_push_parameter(impl, NodePayloadBDA, u64_type);
		spv::Id payload_stride_ptr = emit_load_node_input_push_parameter(
		    impl, NodePayloadStrideOrOffsetsBDA, impl.node_input.u32_ptr_type_id);
		spv::Id payload_stride = emit_load_node_input_push_pointer(
		    impl, payload_stride_ptr, u32_type, sizeof(uint32_t));

		auto *payload_offset = impl.allocate(spv::OpIMul, u32_type);
		payload_offset->add_id(linear_node_index_id);
		payload_offset->add_id(payload_stride);
		impl.add(payload_offset);

		auto *upconv = impl.allocate(spv::OpUConvert, u64_type);
		upconv->add_id(payload_offset->id);
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
	else if (impl.node_input.launch_type == DXIL::NodeLaunchType::Coalescing)
	{

	}
	else if (impl.node_input.launch_type == DXIL::NodeLaunchType::Thread)
	{

	}
	else
		return false;

	return true;
}

static spv::Id emit_workgraph_compute_builtins(Converter::Impl &impl)
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
				auto *mask_op = impl.allocate(spv::OpULessThan,
				                              builder.makeVectorType(builder.makeBoolType(),
				                                                     impl.node_input.dispatch_grid.count));
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

	return execution_mask_id;
}

bool emit_workgraph_dispatcher(Converter::Impl &impl, CFGNodePool &pool, CFGNode *entry, spv::Id main_entry_id)
{
	auto &builder = impl.builder();

	spv::Id linear_node_index_id = emit_linear_node_index(impl);
	if (!linear_node_index_id)
		return false;

	emit_payload_pointer_resolve(impl, linear_node_index_id);
	spv::Id execution_mask_id = emit_workgraph_compute_builtins(impl);

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

	auto *call_op = impl.allocate(spv::OpFunctionCall, builder.makeVoidType());
	call_op->add_id(main_entry_id);
	impl.add(call_op);

	return true;
}
}
