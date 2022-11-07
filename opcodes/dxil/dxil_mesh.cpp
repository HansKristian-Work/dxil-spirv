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

bool emit_emit_indices_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	unsigned index_dim = impl.execution_mode_meta.primitive_index_dimension;
	spv::Id index_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1, index_dim);
	spv::Id index_scalar_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1, 1);

	spv::Id components[3];
	for (unsigned i = 0; i < index_dim; i++)
		components[i] = impl.get_id_for_value(instruction->getOperand(2 + i));
	spv::Id index_id = impl.build_vector(index_scalar_type_id, components, index_dim);

	Operation *op = impl.allocate(spv::OpAccessChain,
	                              builder.makePointer(spv::StorageClassOutput, index_type_id));
	spv::Id ptr_id = op->id;

	op->add_id(impl.primitive_index_array_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, index_id });
	impl.add(op);
	return true;
}

bool emit_store_vertex_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	// Need special handling for clip distance.
	auto *clip_cull_meta = output_clip_cull_distance_meta(impl, output_element_index);
	if (clip_cull_meta)
		return emit_store_clip_cull_distance(impl, instruction, *clip_cull_meta);

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

	spv::Id store_value = impl.fixup_store_type_io(meta.component_type, 1,
	                                               impl.get_id_for_value(instruction->getOperand(4)));

	Operation *op;
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_output(var_id, &builtin) && builtin == spv::BuiltInCullPrimitiveEXT)
	{
		// Special case where the output variable is bool, but the value we get is uint32
		op = impl.allocate(spv::OpINotEqual, builder.makeBoolType());
		op->add_id(store_value);
		op->add_id(builder.makeUintConstant(0));
		impl.add(op);
		store_value = op->id;
	}

	op = impl.allocate(spv::OpAccessChain,
	                   builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
	ptr_id = op->id;
	op->add_id(var_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
	if (row_index)
		op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	if (num_cols > 1)
		op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

	impl.add(op);

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, store_value });
	impl.add(op);
	return true;
}

bool emit_dispatch_mesh_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(spv::OpEmitMeshTasksEXT);

	for (unsigned i = 1; i <= 4; i++)
		op->add_id(impl.get_id_for_value(instruction->getOperand(i)));

	impl.add(op);
	return true;
}

bool emit_get_mesh_payload_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// GetMeshPayload can only be called once per shader
	spv::Id type_id = impl.get_type_id(instruction->getType()->getPointerElementType());
	spv::Id var_id = impl.create_variable(spv::StorageClassTaskPayloadWorkgroupEXT, type_id);

	impl.rewrite_value(instruction, var_id);
	return true;
}

} // namespace dxil_spv
