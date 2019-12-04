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

#include "dxil_compute.hpp"
#include "dxil_common.hpp"

namespace DXIL2SPIRV
{
bool emit_barrier_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CallInst *instruction)
{
	uint32_t operation;
	if (!get_constant_operand(instruction, 1, &operation))
		return false;

	// Match DXC SPIR-V output here.
	Operation op;

	switch (static_cast<DXIL::BarrierMode>(operation))
	{
	case DXIL::BarrierMode::GroupMemoryBarrierWithGroupSync:
		op.op = spv::OpControlBarrier;
		op.arguments = {
				builder.makeUintConstant(spv::ScopeWorkgroup),
				builder.makeUintConstant(spv::ScopeWorkgroup),
				builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	case DXIL::BarrierMode::AllMemoryBarrierWithGroupSync:
		op.op = spv::OpControlBarrier;
		op.arguments = {
				builder.makeUintConstant(spv::ScopeWorkgroup),
				builder.makeUintConstant(spv::ScopeDevice),
				builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask |
				                         spv::MemorySemanticsImageMemoryMask |
				                         spv::MemorySemanticsUniformMemoryMask |
				                         spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	case DXIL::BarrierMode::GroupMemoryBarrier:
		op.op = spv::OpMemoryBarrier;
		op.arguments = {
				builder.makeUintConstant(spv::ScopeWorkgroup),
				builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	case DXIL::BarrierMode::AllMemoryBarrier:
		op.op = spv::OpMemoryBarrier;
		op.arguments = {
				builder.makeUintConstant(spv::ScopeDevice),
				builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask |
				                         spv::MemorySemanticsImageMemoryMask |
				                         spv::MemorySemanticsUniformMemoryMask |
				                         spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	default:
		return false;
	}

	ops.push_back(std::move(op));
	return true;
}

}

