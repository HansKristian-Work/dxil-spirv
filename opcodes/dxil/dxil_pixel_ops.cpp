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

#include "dxil_pixel_ops.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_discard_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto *cond = instruction->getOperand(1);
	bool has_condition = false;
	if (const auto *constant_int = llvm::dyn_cast<llvm::ConstantInt>(cond))
	{
		if (!constant_int->getUniqueInteger().getZExtValue())
			return true;
	}
	else
		has_condition = true;

	Operation *op = impl.allocate(spv::OpDemoteToHelperInvocationEXT);
	if (has_condition)
		op->add_id(impl.get_id_for_value(cond));
	impl.add(op);
	impl.spirv_module.enable_shader_discard(impl.options.shader_demote);
	return true;
}

static bool emit_derivative_instruction_quad_coarse(
    spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityGroupNonUniformQuad);

	spv::Id type_id = impl.get_type_id(instruction->getType());

	auto *base = impl.allocate(spv::OpGroupNonUniformQuadBroadcast, type_id);
	base->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	base->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	base->add_id(builder.makeUintConstant(0));

	auto *flip = impl.allocate(spv::OpGroupNonUniformQuadBroadcast, type_id);
	flip->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	flip->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	flip->add_id(builder.makeUintConstant(opcode == spv::OpDPdyCoarse ? 2 : 1));

	auto *sub = impl.allocate(spv::OpFSub, instruction);
	sub->add_id(flip->id);
	sub->add_id(base->id);

	impl.add(base);
	impl.add(flip);
	impl.add(sub);

	return true;
}

static bool emit_derivative_instruction_quad_fine(
	spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	builder.addCapability(spv::CapabilityGroupNonUniform);
	builder.addCapability(spv::CapabilityGroupNonUniformQuad);

	spv::Id type_id = impl.get_type_id(instruction->getType());

	auto *flip = impl.allocate(spv::OpGroupNonUniformQuadSwap, type_id);
	flip->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	flip->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	flip->add_id(builder.makeUintConstant(opcode == spv::OpDPdyFine ? 1 : 0));
	impl.add(flip);

	auto *sub = impl.allocate(spv::OpFSub, type_id);
	sub->add_id(flip->id);
	sub->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(sub);

	auto *flip_result = impl.allocate(spv::OpGroupNonUniformQuadSwap, type_id);
	flip_result->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	flip_result->add_id(sub->id);
	flip_result->add_id(builder.makeUintConstant(opcode == spv::OpDPdyFine ? 1 : 0));
	impl.add(flip_result);

	spv::Id local_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSubgroupLocalInvocationId);
	auto *load_local = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	load_local->add_id(local_id);
	impl.add(load_local);

	auto *mask_op = impl.allocate(spv::OpBitwiseAnd, builder.makeUintType(32));
	mask_op->add_id(load_local->id);
	mask_op->add_id(builder.makeUintConstant(opcode == spv::OpDPdyFine ? 2 : 1));
	impl.add(mask_op);

	auto *should_flip = impl.allocate(spv::OpINotEqual, builder.makeBoolType());
	should_flip->add_id(mask_op->id);
	should_flip->add_id(builder.makeUintConstant(0));
	impl.add(should_flip);

	auto *sel = impl.allocate(spv::OpSelect, instruction);
	sel->add_id(should_flip->id);
	sel->add_id(flip_result->id);
	sel->add_id(sub->id);
	impl.add(sel);

	return true;
}

static bool emit_derivative_instruction_quad(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	switch (opcode)
	{
	case spv::OpDPdxCoarse:
	case spv::OpDPdyCoarse:
		return emit_derivative_instruction_quad_coarse(opcode, impl, instruction);

	case spv::OpDPdxFine:
	case spv::OpDPdyFine:
		return emit_derivative_instruction_quad_fine(opcode, impl, instruction);

	default:
		return false;
	}

}

bool emit_derivative_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (impl.execution_model != spv::ExecutionModelFragment &&
	    !impl.options.nv_compute_shader_derivatives)
	{
		return emit_derivative_instruction_quad(opcode, impl, instruction);
	}

	auto &builder = impl.builder();
	bool relax_precision = false;
	spv::Id input_id;

	// SPIR-V only supports 32-bit derivatives.
	bool fp32 = instruction->getType()->getTypeID() == llvm::Type::TypeID::FloatTyID;

	if (instruction->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID &&
	    !impl.support_16bit_operations())
	{
		fp32 = true;
		relax_precision = true;
	}

	Operation *op;
	if (fp32)
	{
		op = impl.allocate(opcode, instruction);
		// Somewhat redundant, but avoid changing reference output
		// for all shaders that use derivatives with constants.
		input_id = impl.get_id_for_value(instruction->getOperand(1));
	}
	else
	{
		spv::Id fp32_type = builder.makeFloatType(32);
		auto *cast_op = impl.allocate(spv::OpFConvert, fp32_type);
		cast_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(cast_op);
		input_id = cast_op->id;

		op = impl.allocate(opcode, fp32_type);
	}

	op->add_id(input_id);
	impl.add(op);

	if (relax_precision)
		impl.decorate_relaxed_precision(instruction->getType(), op->id, false);

	if (!fp32)
	{
		auto *cast_op = impl.allocate(spv::OpFConvert, instruction);
		cast_op->add_id(op->id);
		impl.add(cast_op);
	}

	impl.builder().addCapability(spv::CapabilityDerivativeControl);
	return true;
}

bool emit_sample_index_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSampleId);
	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);
	impl.builder().addCapability(spv::CapabilitySampleRateShading);
	return true;
}

bool emit_coverage_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSampleMask);

	Operation *ptr_op =
	    impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassInput, builder.makeUintType(32)));
	ptr_op->add_id(var_id);
	ptr_op->add_id(builder.makeUintConstant(0));
	impl.add(ptr_op);

	Operation *load_op = impl.allocate(spv::OpLoad, instruction);
	load_op->add_id(ptr_op->id);
	impl.add(load_op);
	return true;
}

bool emit_inner_coverage_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInFullyCoveredEXT);

	builder.addCapability(spv::CapabilityFragmentFullyCoveredEXT);
	builder.addExtension("SPV_EXT_fragment_fully_covered");

	Operation *load_op = impl.allocate(spv::OpLoad, builder.makeBoolType());
	load_op->add_id(var_id);
	impl.add(load_op);

	auto *select_op = impl.allocate(spv::OpSelect, instruction);
	select_op->add_id(load_op->id);
	select_op->add_id(builder.makeUintConstant(1));
	select_op->add_id(builder.makeUintConstant(0));
	impl.add(select_op);
	return true;
}

bool emit_is_helper_lane_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto *op = impl.allocate(spv::OpIsHelperInvocationEXT, instruction);
	impl.add(op);
	return true;
}
} // namespace dxil_spv
