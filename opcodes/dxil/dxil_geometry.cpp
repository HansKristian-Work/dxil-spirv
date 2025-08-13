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

#include "dxil_geometry.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
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

	if (impl.execution_model == spv::ExecutionModelFragment)
		impl.builder().addCapability(spv::CapabilityGeometry);

	return true;
}

bool emit_view_id_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInViewIndex);
	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);
	impl.add(op);
	builder.addCapability(spv::CapabilityMultiView);
	return true;
}

} // namespace dxil_spv
