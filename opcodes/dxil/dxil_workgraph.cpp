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
}
