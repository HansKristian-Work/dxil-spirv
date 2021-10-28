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

bool emit_derivative_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(opcode, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	impl.add(op);
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
