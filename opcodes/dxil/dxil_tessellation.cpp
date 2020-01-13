/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

#include "dxil_tessellation.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"

namespace DXIL2SPIRV
{
bool emit_store_patch_constant_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.patch_elements_meta[output_element_index];
	uint32_t var_id = meta.id;
	spv::Id ptr_id;

	spv::Id output_type_id = builder.getDerefTypeId(var_id);

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	if (row_index || num_cols > 1)
	{
		Operation *op = impl.allocate(
		    spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
		ptr_id = op->id;
		op->add_id(var_id);
		if (row_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		if (num_cols > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

		impl.add(op);
	}
	else
		ptr_id = var_id;

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	Operation *op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, impl.fixup_store_sign(meta.component_type, 1, store_value) });
	impl.add(op);
	return true;
}

bool emit_load_output_control_point_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	const auto &meta = impl.output_elements_meta[input_element_index];
	uint32_t var_id = meta.id;

	spv::Id input_type_id = builder.getDerefTypeId(var_id);
	input_type_id = builder.getContainedTypeId(input_type_id);

	bool row_index = false;
	if (builder.isArrayType(input_type_id))
	{
		row_index = true;
		input_type_id = builder.getContainedTypeId(input_type_id);
	}

	uint32_t num_cols = builder.getNumTypeComponents(input_type_id);

	// Need to deal with signed vs unsigned here.
	Operation *op = impl.allocate(
	    spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, impl.get_type_id(meta.component_type, 1, 1)));
	spv::Id ptr_id = op->id;

	op->add_id(var_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(4)));
	if (row_index)
		op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	if (num_cols > 1)
		op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

	impl.add(op);

	// Need to deal with signed vs unsigned here.
	op = impl.allocate(spv::OpLoad, instruction, impl.get_type_id(meta.component_type, 1, 1));
	op->add_id(ptr_id);
	impl.add(op);

	// Need to bitcast after we load.
	impl.fixup_load_sign(meta.component_type, 1, instruction);
	return true;
}

bool emit_domain_location_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id tess_coord_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInTessCoord);

	auto *op =
	    impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassInput, builder.makeFloatType(32)));
	op->add_id(tess_coord_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1), 32));
	impl.add(op);
	tess_coord_id = op->id;

	op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(tess_coord_id);
	impl.add(op);

	return true;
}

bool emit_output_control_point_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId);

	auto *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);

	return true;
}

bool emit_load_patch_constant_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.patch_elements_meta[output_element_index];
	uint32_t var_id = meta.id;
	spv::Id ptr_id;

	spv::Id output_type_id = builder.getDerefTypeId(var_id);

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	spv::StorageClass storage = impl.execution_model == spv::ExecutionModelTessellationEvaluation ?
	                                spv::StorageClassInput :
	                                spv::StorageClassOutput;

	if (row_index || num_cols > 1)
	{
		Operation *op =
		    impl.allocate(spv::OpAccessChain, builder.makePointer(storage, builder.getScalarTypeId(output_type_id)));
		ptr_id = op->id;
		op->add_id(var_id);
		if (row_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		if (num_cols > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

		impl.add(op);
	}
	else
		ptr_id = var_id;

	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(ptr_id);
	impl.add(op);

	impl.fixup_load_sign(meta.component_type, 1, instruction);
	return true;
}
} // namespace DXIL2SPIRV
