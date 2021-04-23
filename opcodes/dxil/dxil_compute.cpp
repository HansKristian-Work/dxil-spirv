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

#include "dxil_compute.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_barrier_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t operation;
	if (!get_constant_operand(instruction, 1, &operation))
		return false;

	// Match DXC SPIR-V output here.
	Operation *op = nullptr;

	switch (static_cast<DXIL::BarrierMode>(operation))
	{
	case DXIL::BarrierMode::DeviceMemoryBarrierWithGroupSync:
		op = impl.allocate(spv::OpControlBarrier);
		op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
		op->add_id(builder.makeUintConstant(spv::ScopeDevice));
		op->add_id(
			builder.makeUintConstant(spv::MemorySemanticsImageMemoryMask | spv::MemorySemanticsUniformMemoryMask |
		                             spv::MemorySemanticsAcquireReleaseMask));
		break;

	case DXIL::BarrierMode::GroupMemoryBarrierWithGroupSync:
		op = impl.allocate(spv::OpControlBarrier);
		op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
		op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
		op->add_id(
		    builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsAcquireReleaseMask));
		break;

	case DXIL::BarrierMode::AllMemoryBarrierWithGroupSync:
		op = impl.allocate(spv::OpControlBarrier);
		op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
		op->add_id(builder.makeUintConstant(spv::ScopeDevice));
		op->add_id(
		    builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsImageMemoryMask |
		                             spv::MemorySemanticsUniformMemoryMask | spv::MemorySemanticsAcquireReleaseMask));
		break;

	case DXIL::BarrierMode::DeviceMemoryBarrier:
		op = impl.allocate(spv::OpMemoryBarrier);
		op->add_id(builder.makeUintConstant(spv::ScopeDevice));
		op->add_id(
			builder.makeUintConstant(spv::MemorySemanticsImageMemoryMask | spv::MemorySemanticsUniformMemoryMask |
		                             spv::MemorySemanticsAcquireReleaseMask));
		break;

	case DXIL::BarrierMode::GroupMemoryBarrier:
		op = impl.allocate(spv::OpMemoryBarrier);
		op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
		op->add_id(
		    builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsAcquireReleaseMask));
		break;

	case DXIL::BarrierMode::AllMemoryBarrier:
		op = impl.allocate(spv::OpMemoryBarrier);
		op->add_id(builder.makeUintConstant(spv::ScopeDevice));
		op->add_id(
		    builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsImageMemoryMask |
		                             spv::MemorySemanticsUniformMemoryMask | spv::MemorySemanticsAcquireReleaseMask));
		break;

	default:
		return false;
	}

	impl.add(op);
	return true;
}

bool emit_thread_id_load_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Awkward NVIDIA workaround. If loading LocalInvocationId, check if we can return constant 0.
	// This is key to avoid some particular shader compiler bugs.
	if (builtin == spv::BuiltInLocalInvocationId)
	{
		if (const auto *index = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(1)))
		{
			unsigned dim = index->getUniqueInteger().getZExtValue();
			if (dim < 3 && impl.execution_mode_meta.workgroup_threads[dim] == 1)
			{
				spv::Id const_zero = impl.builder().makeUintConstant(0);
				impl.value_map[instruction] = const_zero;
				return true;
			}
		}
	}

	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(builtin);

	if (builtin != spv::BuiltInLocalInvocationIndex)
	{
		Operation *op =
		    impl.allocate(spv::OpAccessChain,
		                  impl.builder().makePointer(spv::StorageClassInput, impl.get_type_id(instruction->getType())));

		op->add_id(var_id);
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(op);
		var_id = op->id;
	}

	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);
	return true;
}
} // namespace dxil_spv
