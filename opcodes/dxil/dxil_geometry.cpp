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

#include "dxil_geometry.hpp"
#include "logging.hpp"

namespace DXIL2SPIRV
{
bool emit_stream_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::CallInst *instruction)
{
	Operation op;
	op.op = spv::OpEmitStreamVertex;

	auto *constant = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(1));
	if (!constant)
	{
		LOGE("Argument to emitStream must be a constant.\n");
		return false;
	}
	op.arguments = { builder.makeUintConstant(constant->getUniqueInteger().getZExtValue()) };
	ops.push_back(std::move(op));

	builder.addCapability(spv::CapabilityGeometryStreams);
	return true;
}

bool emit_cut_stream_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	Operation op;
	op.op = spv::OpEndStreamPrimitive;

	auto *constant = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(1));
	if (!constant)
	{
		LOGE("Argument to emitStream must be a constant.\n");
		return false;
	}
	op.arguments = { builder.makeUintConstant(constant->getUniqueInteger().getZExtValue()) };
	ops.push_back(std::move(op));

	builder.addCapability(spv::CapabilityGeometryStreams);
	return true;
}

bool emit_then_cut_stream_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                      const llvm::CallInst *instruction)
{
	if (!emit_stream_instruction(ops, impl, builder, instruction))
		return false;
	return emit_cut_stream_instruction(ops, impl, builder, instruction);
}
}
