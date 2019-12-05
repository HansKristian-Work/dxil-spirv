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

#include <opcodes/converter_impl.hpp>
#include "dxil_pixel_ops.hpp"

namespace DXIL2SPIRV
{
bool emit_discard_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CallInst *instruction)
{
	Operation op;
	op.op = spv::OpDemoteToHelperInvocationEXT;
	ops.push_back(std::move(op));
	impl.spirv_module.enable_shader_discard();
	return true;
}

bool emit_derivative_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	Operation op;
	op.op = opcode;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };

	ops.push_back(std::move(op));
	builder.addCapability(spv::CapabilityDerivativeControl);
	return true;
}

bool emit_sample_index_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSampleId);
	builder.addCapability(spv::CapabilitySampleRateShading);
	Operation op;
	op.op = spv::OpLoad;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { var_id };
	ops.push_back(std::move(op));
	return true;
}

bool emit_coverage_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                               const llvm::CallInst *instruction)
{
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSampleMask);
	spv::Id ptr_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpAccessChain;
		op.id = ptr_id;
		op.type_id = builder.makePointer(spv::StorageClassInput, builder.makeUintType(32));
		op.arguments = { var_id, builder.makeUintConstant(0) };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpLoad;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { ptr_id };
	ops.push_back(std::move(op));
	return true;
}
}
