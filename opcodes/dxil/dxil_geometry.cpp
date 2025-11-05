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
	// If view instancing, need to emit these every time.
	if (!emit_view_instancing_fixed_layer_viewport(impl, false))
		return false;

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

static bool emit_view_instance_ubo(Converter::Impl &impl)
{
	if (impl.multiview.view_index_to_view_instance_id)
		return true;

	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);

	auto &mapping = impl.options.meta_descriptor_mappings[int(MetaDescriptor::DynamicViewInstancingOffsets)];
	if (mapping.kind != MetaDescriptorKind::UBOContainingConstant)
	{
		LOGE("If using dynamic view instancing, must provide a UBO with offsets.\n");
		return false;
	}

	spv::Id type_id = builder.makeStructType({ u32_type, u32_type }, "ViewInstancingOffsetsUBO");
	builder.addDecoration(type_id, spv::DecorationBlock);
	builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
	builder.addMemberDecoration(type_id, 1, spv::DecorationOffset, 4);
	builder.addMemberName(type_id, 0, "ViewID");
	builder.addMemberName(type_id, 1, "Layer");

	impl.multiview.view_index_to_view_instance_id =
	    impl.create_variable(spv::StorageClassUniform, type_id, "ViewInstancingOffsets");

	builder.addDecoration(impl.multiview.view_index_to_view_instance_id,
	                      spv::DecorationDescriptorSet, mapping.desc_set);
	builder.addDecoration(impl.multiview.view_index_to_view_instance_id,
	                      spv::DecorationBinding, mapping.desc_binding);

	return true;
}

spv::Id build_layer_offset_id(Converter::Impl &impl)
{
	if (!impl.options.multiview.enable)
		return 0;

	auto &mapping = impl.options.meta_descriptor_mappings[int(MetaDescriptor::DynamicViewInstancingOffsets)];
	if (mapping.kind == MetaDescriptorKind::Invalid)
		return 0;

	if (!emit_view_instance_ubo(impl))
		return 0;

	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);

	auto *chain = impl.allocate(
	    spv::OpAccessChain, builder.makePointer(spv::StorageClassUniform, u32_type));
	chain->add_id(impl.multiview.view_index_to_view_instance_id);
	chain->add_id(builder.makeUintConstant(1));
	impl.add(chain);

	auto *load = impl.allocate(spv::OpLoad, u32_type);
	load->add_id(chain->id);
	impl.add(load);

	return load->id;
}

static bool emit_view_instancing_fixed_layer(Converter::Impl &impl, bool entry_point)
{
	if (!impl.options.multiview.enable || impl.multiview.custom_layer_index)
		return true;

	auto &mapping = impl.options.meta_descriptor_mappings[int(MetaDescriptor::DynamicViewInstancingOffsets)];
	if (mapping.kind == MetaDescriptorKind::Invalid)
		return true;

	spv::Id layer_offset_id = build_layer_offset_id(impl);
	if (!layer_offset_id)
		return false;

	spv::Id layer_id = impl.spirv_module.get_builtin_shader_output(spv::BuiltInLayer);

	if (!layer_id)
	{
		layer_id = impl.create_variable(spv::StorageClassOutput, impl.builder().makeUintType(32));
		impl.spirv_module.register_builtin_shader_output(layer_id, spv::BuiltInLayer);
		impl.emit_builtin_decoration(layer_id, DXIL::Semantic::RenderTargetArrayIndex, spv::StorageClassOutput);
	}

	auto *store = impl.allocate(spv::OpStore);
	store->add_id(layer_id);
	store->add_id(layer_offset_id);
	impl.add(store);

	return true;
}

spv::Id build_viewport_offset_id(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	if (impl.options.multiview.view_instance_to_viewport_spec_id == UINT32_MAX)
	{
		LOGE("Need to set view instance to viewport spec id.\n");
		return 0;
	}

	spv::Id view_instance_id = build_view_instance_id(impl);

	if (!impl.multiview.view_instance_to_viewport_id)
	{
		impl.multiview.view_instance_to_viewport_id = builder.makeUintConstant(0, true);
		builder.addName(impl.multiview.view_instance_to_viewport_id, "ViewIDToViewport");
		builder.addDecoration(impl.multiview.view_instance_to_viewport_id,
		                      spv::DecorationSpecId, impl.options.multiview.view_instance_to_viewport_spec_id);
	}

	spv::Id u32_type = builder.makeUintType(32);
	auto *mul = impl.allocate(spv::OpIMul, u32_type);
	mul->add_id(view_instance_id);
	mul->add_id(builder.makeUintConstant(8));
	impl.add(mul);

	auto *mask = impl.allocate(spv::OpBitFieldUExtract, u32_type);
	mask->add_id(impl.multiview.view_instance_to_viewport_id);
	mask->add_id(mul->id);
	mask->add_id(builder.makeUintConstant(8));
	impl.add(mask);

	return mask->id;
}

static bool emit_view_instancing_fixed_viewport(Converter::Impl &impl, bool entry_point)
{
	if (!impl.options.multiview.enable || impl.multiview.custom_viewport_index)
		return true;

	// There is a viewport offset in the view instancing mask.
	if (!impl.options.multiview.implicit_viewport_offset)
		return true;

	if (impl.execution_model == spv::ExecutionModelVertex ||
	    impl.execution_model == spv::ExecutionModelTessellationEvaluation ||
	    (impl.execution_model == spv::ExecutionModelGeometry && !entry_point))
	{
		auto &builder = impl.builder();

		spv::Id u32_type = builder.makeUintType(32);
		spv::Id viewport_id = build_viewport_offset_id(impl);
		spv::Id vp_id = impl.spirv_module.get_builtin_shader_output(spv::BuiltInViewportIndex);

		if (!vp_id)
		{
			vp_id = impl.create_variable(spv::StorageClassOutput, u32_type);
			impl.spirv_module.register_builtin_shader_output(vp_id, spv::BuiltInViewportIndex);
			impl.emit_builtin_decoration(vp_id, DXIL::Semantic::ViewPortArrayIndex, spv::StorageClassOutput);
		}

		auto *store = impl.allocate(spv::OpStore);
		store->add_id(vp_id);
		store->add_id(viewport_id);
		impl.add(store);
	}

	return true;
}

bool emit_view_instancing_fixed_layer_viewport(Converter::Impl &impl, bool entry_point)
{
	if (!emit_view_instancing_fixed_layer(impl, entry_point))
		return false;
	if (!emit_view_instancing_fixed_viewport(impl, entry_point))
		return false;

	return true;
}

bool emit_view_masking(Converter::Impl &impl)
{
	if (!impl.options.multiview.enable)
		return true;

	auto &mapping = impl.options.meta_descriptor_mappings[int(MetaDescriptor::DynamicViewInstancingMask)];
	if (mapping.kind == MetaDescriptorKind::Invalid)
		return true;

	if (mapping.kind != MetaDescriptorKind::UBOContainingConstant)
	{
		LOGE("DynamicViewMasking must be UBO containing constant.\n");
		return false;
	}

	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);

	spv::Id type_id = builder.makeStructType({ u32_type }, "ViewInstanceMaskUBO");
	builder.addDecoration(type_id, spv::DecorationBlock);
	builder.addMemberDecoration(type_id, 0, spv::DecorationOffset, 0);
	builder.addMemberName(type_id, 0, "Mask");

	spv::Id view_mask_id = impl.create_variable(spv::StorageClassUniform, type_id, "ViewInstanceMask");
	builder.addDecoration(view_mask_id, spv::DecorationDescriptorSet, mapping.desc_set);
	builder.addDecoration(view_mask_id, spv::DecorationBinding, mapping.desc_binding);

	spv::Id view_id = build_view_instance_id(impl);

	auto *chain = impl.allocate(
	    spv::OpAccessChain, builder.makePointer(spv::StorageClassUniform, u32_type));
	chain->add_id(view_mask_id);
	chain->add_id(builder.makeUintConstant(0));
	impl.add(chain);

	auto *load = impl.allocate(spv::OpLoad, u32_type);
	load->add_id(chain->id);
	impl.add(load);

	auto *mask = impl.allocate(spv::OpBitFieldUExtract, u32_type);
	mask->add_id(load->id);
	mask->add_id(view_id);
	mask->add_id(builder.makeUintConstant(1));
	impl.add(mask);

	auto *eq = impl.allocate(spv::OpIEqual, builder.makeBoolType());
	eq->add_id(mask->id);
	eq->add_id(builder.makeUintConstant(0));
	impl.add(eq);

	// In geometry shaders and mesh shaders, we can simply just return early, nothing will be emitted.
	// Make sure to write a dummy invalid position on other targets.
	// TODO: Could optimize for hull shaders by forcing invalid tess factors early,
	// but might screw up phase constant phase if there are side effects, so ...
	if (impl.execution_model == spv::ExecutionModelVertex ||
	    impl.execution_model == spv::ExecutionModelTessellationEvaluation)
	{
		spv::Id pos_id = impl.spirv_module.get_builtin_shader_output(spv::BuiltInPosition);
		auto *write_degen = impl.allocate(spv::OpStore);
		write_degen->add_id(pos_id);
		write_degen->add_id(impl.build_splat_constant_vector(
		    builder.makeFloatType(32), builder.makeFloatConstant(-1.0f), 4));
		impl.add(write_degen);
	}

	auto *retcond = impl.allocate(spv::PseudoOpReturnCond);
	retcond->add_id(eq->id);
	impl.add(retcond);

	return true;
}

spv::Id build_view_instance_id(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	if (impl.options.multiview.view_index_to_view_instance_spec_id != UINT32_MAX)
	{
		if (!impl.multiview.view_index_to_view_instance_id)
		{
			impl.multiview.view_index_to_view_instance_id = builder.makeUintConstant(0, true);
			builder.addDecoration(impl.multiview.view_index_to_view_instance_id,
			                      spv::DecorationSpecId, impl.options.multiview.view_index_to_view_instance_spec_id);
			builder.addName(impl.multiview.view_index_to_view_instance_id, "ViewIndexToViewInstanceMap");
		}

		// We're using proper multiview.
		spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInViewIndex);
		Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
		op->add_id(var_id);
		impl.add(op);
		builder.addCapability(spv::CapabilityMultiView);

		auto *mul = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		mul->add_id(op->id);
		mul->add_id(builder.makeUintConstant(2));
		impl.add(mul);

		auto *extract = impl.allocate(spv::OpBitFieldUExtract, builder.makeUintType(32));
		extract->add_id(impl.multiview.view_index_to_view_instance_id);
		extract->add_id(mul->id);
		extract->add_id(builder.makeUintConstant(2));
		impl.add(extract);

		return extract->id;
	}
	else
	{
		spv::Id u32_type = builder.makeUintType(32);

		if (!emit_view_instance_ubo(impl))
			return 0;

		auto *chain = impl.allocate(
			spv::OpAccessChain, builder.makePointer(spv::StorageClassUniform, u32_type));
		chain->add_id(impl.multiview.view_index_to_view_instance_id);
		chain->add_id(builder.makeUintConstant(0));
		impl.add(chain);

		auto *load = impl.allocate(spv::OpLoad, u32_type);
		load->add_id(chain->id);
		impl.add(load);

		return load->id;
	}
}

bool emit_view_id_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	if (!impl.options.multiview.enable)
		impl.rewrite_value(instruction, builder.makeUintConstant(0));
	else
		impl.rewrite_value(instruction, build_view_instance_id(impl));

	return true;
}

} // namespace dxil_spv
