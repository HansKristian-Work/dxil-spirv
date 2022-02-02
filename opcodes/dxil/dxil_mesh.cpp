/*
 * Copyright 2022 Philip Rebohle for Valve Corporation
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

#include "dxil_mesh.hpp"
#include "dxil_common.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_set_mesh_output_counts_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(spv::OpSetMeshOutputsEXT);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	op->add_id(impl.get_id_for_value(instruction->getOperand(2)));

	impl.add(op);
	return true;
}

bool emit_store_vertex_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.output_elements_meta[output_element_index];

	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id output_type_id = builder.getContainedTypeId(builder.getDerefTypeId(var_id));

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	Operation *op = impl.allocate(
			spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
	ptr_id = op->id;

	op->add_id(var_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
	if (row_index)
		op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	if (num_cols > 1)
		op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

	impl.add(op);

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, impl.fixup_store_type_io(meta.component_type, 1, store_value) });
	impl.add(op);
	return true;
}

bool emit_store_primitive_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.patch_elements_meta[output_element_index];
	uint32_t var_id = meta.id;
	spv::Id ptr_id;

	spv::Id output_type_id = builder.getContainedTypeId(builder.getDerefTypeId(var_id));

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	Operation *op = impl.allocate(
			spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
	ptr_id = op->id;
	op->add_id(var_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
	if (row_index)
		op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	if (num_cols > 1)
		op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

	impl.add(op);

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, impl.fixup_store_type_io(meta.component_type, 1, store_value) });
	impl.add(op);
	return true;
}

} // namespace dxil_spv
