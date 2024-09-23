/*
 * Copyright 2022 Philip Rebohle for Valve Corporation
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

#include "dxil_mesh.hpp"
#include "dxil_common.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_set_mesh_output_counts_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(spv::OpSetMeshOutputsEXT);

	spv::Id num_vertex_id, num_prim_id;

	// If we have a degenerate case where either of these is 0, we have to declare 0 as max output.
	if (impl.execution_mode_meta.stage_output_num_vertex == 0)
		num_vertex_id = impl.builder().makeUintConstant(0);
	else
		num_vertex_id = impl.get_id_for_value(instruction->getOperand(1));
	op->add_id(num_vertex_id);

	if (impl.execution_mode_meta.stage_output_num_primitive == 0)
		num_prim_id = impl.builder().makeUintConstant(0);
	else
		num_prim_id = impl.get_id_for_value(instruction->getOperand(2));
	op->add_id(num_prim_id);

	impl.add(op);

	// Workaround shader compiler bugs by emitting a conditional return.
	if (!impl.shader_analysis.has_side_effects)
	{
		auto &builder = impl.builder();

		builder.addCapability(spv::CapabilityGroupNonUniformBallot);
		spv::Id num_ids = impl.spirv_module.get_builtin_shader_input(spv::BuiltInNumSubgroups);
		auto *load_op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
		load_op->add_id(num_ids);
		impl.add(load_op);

		auto *one_subgroup = impl.allocate(spv::OpIEqual, builder.makeBoolType());
		one_subgroup->add_id(load_op->id);
		one_subgroup->add_id(builder.makeUintConstant(1));
		impl.add(one_subgroup);

		auto *broadcast_vert = impl.allocate(spv::OpGroupNonUniformBroadcastFirst, builder.makeUintType(32));
		broadcast_vert->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		broadcast_vert->add_id(num_vertex_id);
		impl.add(broadcast_vert);

		auto *broadcast_prim = impl.allocate(spv::OpGroupNonUniformBroadcastFirst, builder.makeUintType(32));
		broadcast_prim->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		broadcast_prim->add_id(num_prim_id);
		impl.add(broadcast_prim);

		auto *vert_zero = impl.allocate(spv::OpIEqual, builder.makeBoolType());
		vert_zero->add_id(broadcast_vert->id);
		vert_zero->add_id(builder.makeUintConstant(0));
		impl.add(vert_zero);

		auto *prim_zero = impl.allocate(spv::OpIEqual, builder.makeBoolType());
		prim_zero->add_id(broadcast_prim->id);
		prim_zero->add_id(builder.makeUintConstant(0));
		impl.add(prim_zero);

		auto *degenerate_meshlet = impl.allocate(spv::OpLogicalOr, builder.makeBoolType());
		degenerate_meshlet->add_id(vert_zero->id);
		degenerate_meshlet->add_id(prim_zero->id);
		impl.add(degenerate_meshlet);

		auto *early_return = impl.allocate(spv::OpLogicalAnd, builder.makeBoolType());
		early_return->add_id(one_subgroup->id);
		early_return->add_id(degenerate_meshlet->id);
		impl.add(early_return);

		// This may also be useful in some cases if application does misc shader work after SetMeshOutputsEXT.
		// Use a pseudo-op (arbitrarily chosen as OpLifetimeStop as the name is convenient) for conditional return
		// since we have no easy way of introducing additional control flow
		// in the LLVM -> SPIR-V emitter.
		// This gets resolved during final SPIR-V lowering.
		auto *cond_ret = impl.allocate(spv::PseudoOpReturnCond);
		cond_ret->add_id(early_return->id);
		impl.add(cond_ret);
	}

	return true;
}

bool emit_emit_indices_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// If we for some reason have max primitives 0 in the execution mode,
	// just ignore any access to index buffer.
	if (!impl.primitive_index_array_id || impl.execution_mode_meta.stage_output_num_primitive == 0)
		return true;

	unsigned index_dim = impl.execution_mode_meta.primitive_index_dimension;
	spv::Id index_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1, index_dim);
	spv::Id index_scalar_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1, 1);

	spv::Id components[3];
	for (unsigned i = 0; i < index_dim; i++)
		components[i] = impl.get_id_for_value(instruction->getOperand(2 + i));
	spv::Id index_id = impl.build_vector(index_scalar_type_id, components, index_dim);

	Operation *op = impl.allocate(spv::OpAccessChain,
	                              builder.makePointer(spv::StorageClassOutput, index_type_id));
	spv::Id ptr_id = op->id;

	op->add_id(impl.primitive_index_array_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, index_id });
	impl.add(op);
	return true;
}

bool emit_store_vertex_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// If we for some reason have max vertices 0 in the execution mode,
	// just ignore any access to vertex output.
	if (impl.execution_mode_meta.stage_output_num_vertex == 0)
		return true;

	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	// Need special handling for clip distance.
	auto *clip_cull_meta = output_clip_cull_distance_meta(impl, output_element_index);
	if (clip_cull_meta)
		return emit_store_clip_cull_distance(impl, instruction, *clip_cull_meta);

	const auto &meta = impl.output_elements_meta[output_element_index];

	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id output_type_id = builder.getContainedTypeId(builder.getDerefTypeId(var_id));

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	Operation *op = impl.allocate(
			spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
	ptr_id = op->id;

	op->add_id(var_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
	if (row_index)
		op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	if (num_cols > 1)
		op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

	impl.add(op);

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, impl.fixup_store_type_io(meta.component_type, 1, store_value) });
	impl.add(op);
	return true;
}

bool emit_store_primitive_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// If we for some reason have max primitives 0 in the execution mode,
	// just ignore any access to primitive output.
	if (impl.execution_mode_meta.stage_output_num_primitive == 0)
		return true;

	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.patch_elements_meta[output_element_index];
	uint32_t var_id = meta.id;
	spv::Id ptr_id;

	spv::Id output_type_id = builder.getContainedTypeId(builder.getDerefTypeId(var_id));

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	spv::Id store_value = impl.fixup_store_type_io(meta.component_type, 1,
	                                               impl.get_id_for_value(instruction->getOperand(4)));

	Operation *op;
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_output(var_id, &builtin) && builtin == spv::BuiltInCullPrimitiveEXT)
	{
		// Special case where the output variable is bool, but the value we get is uint32
		op = impl.allocate(spv::OpINotEqual, builder.makeBoolType());
		op->add_id(store_value);
		op->add_id(builder.makeUintConstant(0));
		impl.add(op);
		store_value = op->id;
	}

	op = impl.allocate(spv::OpAccessChain,
	                   builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
	ptr_id = op->id;
	op->add_id(var_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
	if (row_index)
		op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	if (num_cols > 1)
		op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

	impl.add(op);

	op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, store_value });
	impl.add(op);
	return true;
}

bool emit_dispatch_mesh_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(spv::OpEmitMeshTasksEXT);

	for (unsigned i = 1; i <= 4; i++)
		op->add_id(impl.get_id_for_value(instruction->getOperand(i)));

	impl.add(op);
	return true;
}

bool emit_get_mesh_payload_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// GetMeshPayload can only be called once per shader
	spv::Id type_id = impl.get_type_id(instruction->getType()->getPointerElementType());
	spv::Id var_id = impl.create_variable(spv::StorageClassTaskPayloadWorkgroupEXT, type_id);

	impl.rewrite_value(instruction, var_id);
	return true;
}

} // namespace dxil_spv
