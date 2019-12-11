/*
 * Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
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

#include "dxil_waveops.hpp"
#include "opcodes/converter_impl.hpp"

namespace DXIL2SPIRV
{
bool emit_wave_is_first_lane_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(spv::OpGroupNonUniformElect, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));

	builder.addCapability(spv::CapabilityGroupNonUniform);
	impl.add(op);
	return true;
}

bool emit_wave_builtin_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(builtin);
	auto *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);

	impl.add(op);
	return true;
}

bool emit_wave_boolean_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(opcode, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	builder.addCapability(spv::CapabilityGroupNonUniformVote);
	impl.add(op);
	return true;
}
}
