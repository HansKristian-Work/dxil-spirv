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

#include "dxil_geometry.hpp"
#include "logging.hpp"
#include "spirv_module.hpp"
#include "opcodes/converter_impl.hpp"

namespace DXIL2SPIRV
{
bool emit_stream_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op;
	auto &builder = impl.builder();

	if (impl.execution_mode_meta.gs_stream_active_mask != 1)
	{
		op = impl.allocate(spv::OpEmitStreamVertex);

		auto *constant = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(1));
		if (!constant)
		{
			LOGE("Argument to emitStream must be a constant.\n");
			return false;
		}
		op->add_id(builder.makeUintConstant(constant->getUniqueInteger().getZExtValue()));
		builder.addCapability(spv::CapabilityGeometryStreams);
	}
	else
		op = impl.allocate(spv::OpEmitVertex);

	impl.add(op);
	return true;
}

bool emit_cut_stream_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op;
	auto &builder = impl.builder();

	if (impl.execution_mode_meta.gs_stream_active_mask != 1)
	{
		op = impl.allocate(spv::OpEndStreamPrimitive);

		auto *constant = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(1));
		if (!constant)
		{
			LOGE("Argument to emitStream must be a constant.\n");
			return false;
		}
		op->add_id(builder.makeUintConstant(constant->getUniqueInteger().getZExtValue()));
		builder.addCapability(spv::CapabilityGeometryStreams);
	}
	else
		op = impl.allocate(spv::OpEndPrimitive);

	impl.add(op);
	return true;
}

bool emit_then_cut_stream_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (!emit_stream_instruction(impl, instruction))
		return false;
	return emit_cut_stream_instruction(impl, instruction);
}

bool emit_gs_instance_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId);
	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);
	return true;
}

bool emit_primitive_id_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInPrimitiveId);
	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);
	return true;
}

} // namespace DXIL2SPIRV
