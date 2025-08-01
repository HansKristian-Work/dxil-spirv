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

#include "dxil_tessellation.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_store_patch_constant_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.patch_elements_meta[output_element_index];
	uint32_t var_id = meta.id;

	if (meta.lowering)
		var_id = impl.execution_mode_meta.patch_lowering_array_var_id;

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
			spv::OpAccessChain, builder.makePointer(
				meta.lowering ? spv::StorageClassPrivate : spv::StorageClassOutput,
				builder.getScalarTypeId(output_type_id)));

		ptr_id = op->id;
		op->add_id(var_id);

		if (row_index)
		{
			spv::Id row_id = impl.get_id_for_value(instruction->getOperand(2));
			if (meta.lowering && meta.start_row != 0)
			{
				auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				add_op->add_id(row_id);
				add_op->add_id(builder.makeUintConstant(meta.start_row));
				impl.add(add_op);

				row_id = add_op->id;
			}
			else if (!meta.lowering && meta.semantic_offset)
			{
				auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				add_op->add_id(row_id);
				add_op->add_id(builder.makeUintConstant(meta.semantic_offset));
				impl.add(add_op);

				row_id = add_op->id;
			}

			op->add_id(row_id);
		}

		if (num_cols > 1)
		{
			spv::Id col_id = impl.get_id_for_value(instruction->getOperand(3), 32);
			if (meta.lowering && meta.start_col != 0)
			{
				auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				add_op->add_id(col_id);
				add_op->add_id(builder.makeUintConstant(meta.start_col));
				impl.add(add_op);

				col_id = add_op->id;
			}
			op->add_id(col_id);
		}

		impl.add(op);
	}
	else
		ptr_id = var_id;

	auto *storage_type = instruction->getOperand(4)->getType();

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));
	impl.register_externally_visible_write(instruction->getOperand(4));

	// Tess factors are for some reason classified as inputs
	spv::BuiltIn builtin = { };

	if (impl.options.max_tess_factor &&
	    impl.spirv_module.query_builtin_shader_input(meta.id, &builtin) &&
	    (builtin == spv::BuiltInTessLevelInner || builtin == spv::BuiltInTessLevelOuter) &&
	    storage_type->isFloatingPointTy() && !type_is_64bit(storage_type))
	{
		spv::Id max_tess_factor_id = builder.makeFloatConstant(impl.options.max_tess_factor);

		// Don't bother bit-twiddling this into an fp16 constant manually
		if (type_is_16bit(storage_type))
		{
			max_tess_factor_id = impl.build_value_cast(max_tess_factor_id, DXIL::ComponentType::F32,
			                                           DXIL::ComponentType::F16, 1);
		}

		if (!impl.glsl_std450_ext)
			impl.glsl_std450_ext = builder.import("GLSL.std.450");

		auto *min_op = impl.allocate(spv::OpExtInst, impl.get_type_id(storage_type));
		min_op->add_id(impl.glsl_std450_ext);
		min_op->add_literal(GLSLstd450::GLSLstd450NMin);
		min_op->add_id(store_value);
		min_op->add_id(max_tess_factor_id);
		impl.add(min_op);

		store_value = min_op->id;
	}

	Operation *op = impl.allocate(spv::OpStore);
	op->add_id(ptr_id);

	if (meta.lowering)
	{
		if (type_is_64bit(storage_type))
		{
			LOGE("Lowering for dxbc 64-bit patch output not supported.\n");
			return false;
		}

		if (!storage_type->isIntegerTy())
		{
			auto *cast_op = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
			cast_op->add_id(store_value);
			impl.add(cast_op);
			store_value = cast_op->id;
		}
	}
	else
	{
		store_value = impl.fixup_store_type_io(meta.component_type, 1, store_value);
	}

	op->add_id(store_value);
	impl.add(op);
	return true;
}

bool emit_load_output_generic_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	// Normally this is only used for control point reads in tess, but here we make it generic to
	// allow reading outputs at any time.
	// Technically mesh shader path could go here, but custom IR doesn't support that.
	bool is_hull = impl.execution_model == spv::ExecutionModelTessellationControl;
	bool array_index = !llvm::isa<llvm::UndefValue>(instruction->getOperand(4)) && is_hull;

	if (is_hull && !array_index)
	{
		LOGE("Hull outputs must be read with array index.\n");
		return false;
	}

	const auto &meta = impl.output_elements_meta[input_element_index];
	uint32_t var_id = meta.id;

	spv::Id input_type_id = builder.getDerefTypeId(var_id);

	if (array_index)
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
	if (array_index)
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
	impl.fixup_load_type_io(meta.component_type, 1, instruction);
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

	spv::Id load_type_id;

	if (row_index || num_cols > 1)
	{
		load_type_id = builder.getScalarTypeId(output_type_id);
		Operation *op =
		    impl.allocate(spv::OpAccessChain, builder.makePointer(storage, load_type_id));
		ptr_id = op->id;
		op->add_id(var_id);

		if (row_index)
		{
			spv::Id row_id = impl.get_id_for_value(instruction->getOperand(2));

			if (meta.semantic_offset != 0)
			{
				auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				add_op->add_id(row_id);
				add_op->add_id(builder.makeUintConstant(meta.semantic_offset));
				impl.add(add_op);

				row_id = add_op->id;
			}

			op->add_id(row_id);
		}

		if (num_cols > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

		impl.add(op);
	}
	else
	{
		ptr_id = var_id;
		load_type_id = output_type_id;
	}

	Operation *op = impl.allocate(spv::OpLoad, instruction, load_type_id);
	op->add_id(ptr_id);
	impl.add(op);

	impl.fixup_load_type_io(meta.component_type, 1, instruction);
	return true;
}
} // namespace dxil_spv
