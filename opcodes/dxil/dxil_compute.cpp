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

static bool emit_thread_2d_quad_fixup_instruction(spv::BuiltIn builtin, Converter::Impl &impl,
                                                  const llvm::CallInst *instruction, uint32_t component)
{
	// We have to compute everything from scratch. Sigh ... <_>
	auto &builder = impl.builder();
	spv::Id local_thread_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInLocalInvocationId);

	{
		auto *load_op = impl.allocate(spv::OpLoad, builder.makeVectorType(builder.makeUintType(32), 3));
		load_op->add_id(local_thread_id);
		impl.add(load_op);
		local_thread_id = load_op->id;
	}

	spv::Id comp_ids[3] = {};
	const bool require[3] = {
		true,
		component >= 1 || builtin == spv::BuiltInLocalInvocationIndex,
		builtin == spv::BuiltInLocalInvocationIndex
	};

	for (unsigned i = 0; i < 3; i++)
	{
		if (require[i])
		{
			auto *extract_op = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
			extract_op->add_id(local_thread_id);
			extract_op->add_literal(i);
			impl.add(extract_op);
			comp_ids[i] = extract_op->id;
		}
	}

	if (require[1])
	{
		// Y * 2 + ((X >> 1) & 1).
		auto *x_part = impl.allocate(spv::OpBitFieldUExtract, builder.makeUintType(32));
		x_part->add_id(comp_ids[0]);
		x_part->add_id(builder.makeUintConstant(1));
		x_part->add_id(builder.makeUintConstant(1));
		impl.add(x_part);

		auto *y_part = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		y_part->add_id(comp_ids[1]);
		y_part->add_id(builder.makeUintConstant(2));
		impl.add(y_part);

		auto *add_part = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_part->add_id(x_part->id);
		add_part->add_id(y_part->id);
		impl.add(add_part);
		comp_ids[1] = add_part->id;
	}

	{
		// Reconstruct X. In a group of 4 threads, we should see [0, 1, 0, 1], but for different Ys.
		auto *and_op = impl.allocate(spv::OpBitwiseAnd, builder.makeUintType(32));
		and_op->add_id(comp_ids[0]);
		and_op->add_id(builder.makeUintConstant(1));
		impl.add(and_op);

		auto *shift_down = impl.allocate(spv::OpShiftRightLogical, builder.makeUintType(32));
		shift_down->add_id(comp_ids[0]);
		shift_down->add_id(builder.makeUintConstant(2));
		impl.add(shift_down);

		auto *shift_up = impl.allocate(spv::OpShiftLeftLogical, builder.makeUintType(32));
		shift_up->add_id(shift_down->id);
		shift_up->add_id(builder.makeUintConstant(1));
		impl.add(shift_up);

		auto *or_op = impl.allocate(spv::OpBitwiseOr, builder.makeUintType(32));
		or_op->add_id(and_op->id);
		or_op->add_id(shift_up->id);
		impl.add(or_op);

		comp_ids[0] = or_op->id;
	}

	// Reconstruct the flattened index.
	if (builtin == spv::BuiltInLocalInvocationIndex)
	{
		auto *y_base_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		y_base_op->add_id(comp_ids[1]);
		y_base_op->add_id(builder.makeUintConstant(impl.execution_mode_meta.workgroup_threads[0] / 2));
		impl.add(y_base_op);

		auto *z_base_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		z_base_op->add_id(comp_ids[2]);
		z_base_op->add_id(builder.makeUintConstant(
			impl.execution_mode_meta.workgroup_threads[0] * impl.execution_mode_meta.workgroup_threads[1]));
		impl.add(z_base_op);

		auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(y_base_op->id);
		add_op->add_id(z_base_op->id);
		impl.add(add_op);

		auto *final_add_op = impl.allocate(spv::OpIAdd, instruction);
		final_add_op->add_id(add_op->id);
		final_add_op->add_id(comp_ids[0]);
		impl.add(final_add_op);
	}
	else if (builtin == spv::BuiltInLocalInvocationId)
	{
		impl.rewrite_value(instruction, comp_ids[component]);
	}
	else
	{
		spv::Id wg_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInWorkgroupId);
		auto *ptr_wg = impl.allocate(spv::OpAccessChain,
		                             builder.makePointer(spv::StorageClassInput, builder.makeUintType(32)));
		ptr_wg->add_id(wg_id);
		ptr_wg->add_id(builder.makeUintConstant(component));
		impl.add(ptr_wg);

		auto *load_wg = impl.allocate(spv::OpLoad, builder.makeUintType(32));
		load_wg->add_id(ptr_wg->id);
		impl.add(load_wg);

		auto *base_thread = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		base_thread->add_id(load_wg->id);

		if (component == 0)
			base_thread->add_id(builder.makeUintConstant(impl.execution_mode_meta.workgroup_threads[component] / 2));
		else // if (component == 1)
			base_thread->add_id(builder.makeUintConstant(impl.execution_mode_meta.workgroup_threads[component] * 2));

		impl.add(base_thread);

		auto *final_add = impl.allocate(spv::OpIAdd, instruction);
		final_add->add_id(base_thread->id);
		final_add->add_id(comp_ids[component]);
		impl.add(final_add);
	}

	return true;
}

bool emit_thread_id_load_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// This appears to always be constant, not unlike all other input loading instructions.
	// Any attempt to dynamically index forces alloca.
	uint32_t component = 0;
	if (builtin != spv::BuiltInLocalInvocationIndex && !get_constant_operand(instruction, 1, &component))
		return false;

	// Querying Z component for ThreadId or ThreadIdInGroup doesn't change with 2D quad fixup, just use normal path.
	// Need to consider ThreadId.xy, ThreadIdInGroup.xy and FlattenedThreadIdInGroup.
	if (builtin != spv::BuiltInWorkgroupId && impl.execution_mode_meta.synthesize_2d_quad_dispatch && component <= 1)
		return emit_thread_2d_quad_fixup_instruction(builtin, impl, instruction, component);

	// Awkward NVIDIA workaround. If loading LocalInvocationId, check if we can return constant 0.
	// This is key to avoid some particular shader compiler bugs.
	if (builtin == spv::BuiltInLocalInvocationId)
	{
		if (component <= 2 && impl.execution_mode_meta.workgroup_threads[component] == 1)
		{
			spv::Id const_zero = impl.builder().makeUintConstant(0);
			impl.rewrite_value(instruction, const_zero);
			return true;
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
