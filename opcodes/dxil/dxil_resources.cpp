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

#include "dxil_resources.hpp"
#include "dxil_common.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
static Converter::Impl::ClipCullMeta *input_clip_cull_distance_meta(Converter::Impl &impl, unsigned index)
{
	auto itr = impl.input_clip_cull_meta.find(index);
	if (itr != impl.input_clip_cull_meta.end())
		return &itr->second;
	else
		return nullptr;
}

static Converter::Impl::ClipCullMeta *output_clip_cull_distance_meta(Converter::Impl &impl, unsigned index)
{
	auto itr = impl.output_clip_cull_meta.find(index);
	if (itr != impl.output_clip_cull_meta.end())
		return &itr->second;
	else
		return nullptr;
}

static spv::Id get_clip_cull_distance_access_chain(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                   const Converter::Impl::ClipCullMeta &meta, spv::StorageClass storage)
{
	auto &builder = impl.builder();
	uint32_t var_id = storage == spv::StorageClassOutput ? impl.spirv_module.get_builtin_shader_output(meta.builtin) :
	                                                       impl.spirv_module.get_builtin_shader_input(meta.builtin);

	Operation *op = impl.allocate(spv::OpAccessChain, builder.makePointer(storage, builder.makeFloatType(32)));
	op->add_id(var_id);

	auto *row = instruction->getOperand(2);
	auto *row_const = llvm::dyn_cast<llvm::ConstantInt>(row);

	uint32_t constant_col;
	if (!get_constant_operand(instruction, 3, &constant_col))
		return false;

	unsigned stride = meta.row_stride;

	if (row_const)
	{
		op->add_id(builder.makeUintConstant(row_const->getUniqueInteger().getZExtValue() * stride + constant_col +
		                                    meta.offset));
	}
	else if (stride == 1 && meta.offset == 0)
	{
		// Simple case, can just index directly into ClipDistance array.
		op->add_id(impl.get_id_for_value(row));
	}
	else if (stride == 1)
	{
		Operation *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(impl.get_id_for_value(row));
		add_op->add_id(builder.makeUintConstant(meta.offset));
		impl.add(add_op);

		op->add_id(add_op->id);
	}
	else
	{
		// A more annoying case, flatten 2D to 1D.
		Operation *mul_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		mul_op->add_id(impl.get_id_for_value(row));
		mul_op->add_id(builder.makeUintConstant(stride));
		impl.add(mul_op);

		Operation *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_id(mul_op->id);
		add_op->add_id(builder.makeUintConstant(constant_col + meta.offset));
		impl.add(add_op);

		op->add_id(add_op->id);
	}

	impl.add(op);
	return op->id;
}

static bool emit_store_clip_cull_distance(Converter::Impl &impl, const llvm::CallInst *instruction,
                                          const Converter::Impl::ClipCullMeta &meta)
{
	spv::Id ptr_id = get_clip_cull_distance_access_chain(impl, instruction, meta, spv::StorageClassOutput);

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));
	Operation *store_op = impl.allocate(spv::OpStore);
	store_op->add_ids({ ptr_id, store_value });
	impl.add(store_op);
	return true;
}

static bool emit_load_clip_cull_distance(Converter::Impl &impl, const llvm::CallInst *instruction,
                                         const Converter::Impl::ClipCullMeta &meta)
{
	spv::Id ptr_id = get_clip_cull_distance_access_chain(impl, instruction, meta, spv::StorageClassInput);

	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(ptr_id);
	impl.add(op);
	return true;
}

static void fixup_builtin_load(Converter::Impl &impl, spv::Id var_id, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_input(var_id, &builtin))
	{
		if (builtin == spv::BuiltInInstanceIndex || builtin == spv::BuiltInVertexIndex)
		{
			// Need to shift down to 0-base.
			spv::Id base_id = impl.spirv_module.get_builtin_shader_input(
			    builtin == spv::BuiltInInstanceIndex ? spv::BuiltInBaseInstance : spv::BuiltInBaseVertex);
			{
				Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
				op->add_id(base_id);
				base_id = op->id;
				impl.add(op);
			}

			Operation *sub_op = impl.allocate(spv::OpISub, builder.makeUintType(32));
			sub_op->add_ids({ impl.get_id_for_value(instruction), base_id });
			impl.add(sub_op);
			impl.value_map[instruction] = sub_op->id;
			builder.addCapability(spv::CapabilityDrawParameters);
		}
		else if (builtin == spv::BuiltInFrontFacing)
		{
			Operation *cast_op = impl.allocate(spv::OpSelect, builder.makeUintType(32));
			cast_op->add_ids({
			    impl.get_id_for_value(instruction),
			    builder.makeUintConstant(~0u),
			    builder.makeUintConstant(0),
			});
			impl.add(cast_op);
			impl.value_map[instruction] = cast_op->id;
		}
		else if (builtin == spv::BuiltInFragCoord)
		{
			auto *col = llvm::cast<llvm::ConstantInt>(instruction->getOperand(3));
			if (col->getUniqueInteger().getZExtValue() == 3)
			{
				// FragCoord.w is inverted in DX.
				Operation *op = impl.allocate(spv::OpFDiv, builder.makeFloatType(32));
				op->add_id(builder.makeFloatConstant(1.0f));
				op->add_id(impl.get_id_for_value(instruction));
				impl.add(op);
				impl.value_map[instruction] = op->id;
			}
		}
	}
}

static spv::Id get_builtin_load_type(Converter::Impl &impl, const Converter::Impl::ElementMeta &meta)
{
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_input(meta.id, &builtin) && builtin == spv::BuiltInFrontFacing)
		return impl.builder().makeBoolType();
	else
		return impl.get_type_id(meta.component_type, 1, 1);
}

bool emit_load_input_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	// Need special handling for clip distance.
	auto *clip_cull_meta = input_clip_cull_distance_meta(impl, input_element_index);
	if (clip_cull_meta)
		return emit_load_clip_cull_distance(impl, instruction, *clip_cull_meta);

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id input_type_id = builder.getDerefTypeId(var_id);

	bool array_index = false;
	if (impl.execution_model == spv::ExecutionModelTessellationControl ||
	    impl.execution_model == spv::ExecutionModelGeometry ||
	    impl.execution_model == spv::ExecutionModelTessellationEvaluation)
	{
		input_type_id = builder.getContainedTypeId(input_type_id);
		array_index = true;
	}

	bool row_index = false;
	if (builder.isArrayType(input_type_id))
	{
		row_index = true;
		input_type_id = builder.getContainedTypeId(input_type_id);
	}

	uint32_t num_cols = builder.getNumTypeComponents(input_type_id);

	if (num_cols > 1 || row_index || array_index)
	{
		// Need to deal with signed vs unsigned here.
		Operation *op =
		    impl.allocate(spv::OpAccessChain,
		                  builder.makePointer(spv::StorageClassInput, impl.get_type_id(meta.component_type, 1, 1)));
		ptr_id = op->id;

		op->add_id(var_id);
		// Vertex array index for GS/DS/HS.
		if (array_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(4)));
		if (row_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		if (num_cols > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

		impl.add(op);
	}
	else
		ptr_id = var_id;

	// Need to deal with signed vs unsigned here.
	spv::Id load_type = get_builtin_load_type(impl, meta);

	Operation *op = impl.allocate(spv::OpLoad, instruction, load_type);
	op->add_id(ptr_id);
	impl.add(op);

	fixup_builtin_load(impl, var_id, instruction);

	// Need to bitcast after we load.
	impl.fixup_load_sign(meta.component_type, 1, instruction);
	return true;
}

static spv::Id build_attribute_offset(spv::Id id, Converter::Impl &impl)
{
	auto &builder = impl.builder();
	{
		Operation *op = impl.allocate(spv::OpBitFieldSExtract, builder.makeUintType(32));
		op->add_ids({ id, builder.makeUintConstant(0), builder.makeUintConstant(4) });
		id = op->id;
		impl.add(op);
	}

	{
		Operation *op = impl.allocate(spv::OpConvertSToF, builder.makeFloatType(32));
		op->add_id(id);
		id = op->id;
		impl.add(op);
	}

	{
		Operation *op = impl.allocate(spv::OpFMul, builder.makeFloatType(32));
		op->add_ids({ id, builder.makeFloatConstant(1.0f / 16.0f) });
		id = op->id;
		impl.add(op);
	}

	return id;
}

bool emit_interpolate_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

	if (num_rows > 1)
	{
		// Need to deal with signed vs unsigned here.
		Operation *op =
		    impl.allocate(spv::OpAccessChain,
		                  builder.makePointer(spv::StorageClassInput, impl.get_type_id(meta.component_type, 1, 1)));

		op->add_ids({ var_id, impl.get_id_for_value(instruction->getOperand(3), 32) });
		impl.add(op);
		ptr_id = op->id;
	}
	else
		ptr_id = var_id;

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	spv::Id aux_id = 0;

	if (opcode == GLSLstd450InterpolateAtOffset)
	{
		spv::Id offsets[2] = {};
		bool is_non_const = false;
		for (unsigned i = 0; i < 2; i++)
		{
			auto *operand = instruction->getOperand(4 + i);
			auto *constant_operand = llvm::dyn_cast<llvm::ConstantInt>(operand);

			// Need to do it the tedious way, extracting bits and converting to float ...
			if (!constant_operand)
			{
				offsets[i] = impl.get_id_for_value(instruction->getOperand(4 + i));
				offsets[i] = build_attribute_offset(offsets[i], impl);
				is_non_const = true;
			}
			else
			{
				float off = float(constant_operand->getUniqueInteger().getSExtValue()) / 16.0f;
				offsets[i] = builder.makeFloatConstant(off);
			}
		}

		if (is_non_const)
			aux_id = impl.build_vector(builder.makeFloatType(32), offsets, 2);
		else
			aux_id = impl.build_constant_vector(builder.makeFloatType(32), offsets, 2);
	}
	else if (opcode == GLSLstd450InterpolateAtSample)
		aux_id = impl.get_id_for_value(instruction->getOperand(4));

	// Need to deal with signed vs unsigned here.
	Operation *op = impl.allocate(spv::OpExtInst, instruction, impl.get_type_id(meta.component_type, 1, 1));
	op->add_ids({
	    impl.glsl_std450_ext,
	    static_cast<spv::Id>(opcode),
	    ptr_id,
	});

	if (aux_id)
		op->add_id(aux_id);

	impl.add(op);

	// Need to bitcast after we load.
	impl.fixup_load_sign(meta.component_type, 1, instruction);
	builder.addCapability(spv::CapabilityInterpolationFunction);
	return true;
}

static spv::Id build_load_invocation_id(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInInvocationId);

	Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	op->add_id(var_id);

	impl.add(op);
	return op->id;
}

bool emit_store_output_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
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

	spv::Id output_type_id = builder.getDerefTypeId(var_id);
	bool is_control_point_output = impl.execution_model == spv::ExecutionModelTessellationControl;
	if (is_control_point_output)
		output_type_id = builder.getContainedTypeId(output_type_id);

	bool row_index = false;
	if (builder.isArrayType(output_type_id))
	{
		row_index = true;
		output_type_id = builder.getContainedTypeId(output_type_id);
	}
	uint32_t num_cols = builder.getNumTypeComponents(output_type_id);

	if (num_cols > 1 || row_index || is_control_point_output)
	{
		Operation *op = impl.allocate(
		    spv::OpAccessChain, builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
		ptr_id = op->id;

		op->add_id(var_id);
		if (is_control_point_output)
			op->add_id(build_load_invocation_id(impl));

		if (row_index)
			op->add_id(impl.get_id_for_value(instruction->getOperand(2)));

		if (num_cols > 1)
		{
			unsigned col;
			if (!get_constant_operand(instruction, 3, &col))
			{
				LOGE("Column index to StoreOutput must be a constant.\n");
				return false;
			}

			// If we need to swizzle fragment shader outputs, do it here.
			if (impl.execution_model == spv::ExecutionModelFragment &&
			    meta.rt_index < impl.options.output_swizzles.size())
			{
				// Assume a 1:1 reversible mapping, so we don't need to splat the write or something like that.
				unsigned swiz = impl.options.output_swizzles[meta.rt_index];
				for (unsigned output_component = 0; output_component < 4; output_component++)
				{
					if (((swiz >> (2u * output_component)) & 3u) == col)
					{
						col = output_component;
						break;
					}
				}
			}

			op->add_id(builder.makeUintConstant(col));
		}

		impl.add(op);
	}
	else
		ptr_id = var_id;

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	Operation *op = impl.allocate(spv::OpStore);
	op->add_ids({ ptr_id, impl.fixup_store_sign(meta.component_type, 1, store_value) });
	impl.add(op);
	return true;
}

static spv::Id build_bindless_heap_offset(Converter::Impl &impl, const Converter::Impl::ResourceReference &reference,
                                          llvm::Value *dynamic_offset)
{
	auto &builder = impl.builder();
	if (reference.push_constant_member >= impl.root_constant_num_words || impl.root_constant_id == 0)
	{
		LOGE("Descriptor table offset is out of push constant range.\n");
		return 0;
	}

	auto *descriptor_table = impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassPushConstant, builder.makeUintType(32)));
	descriptor_table->add_id(impl.root_constant_id);
	descriptor_table->add_id(builder.makeUintConstant(reference.push_constant_member));
	impl.add(descriptor_table);

	auto *loaded_word = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	loaded_word->add_id(descriptor_table->id);
	impl.add(loaded_word);

	if (reference.base_offset != 0)
	{
		auto *heap_offset = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		heap_offset->add_id(loaded_word->id);
		heap_offset->add_id(builder.makeUintConstant(reference.base_offset));
		impl.add(heap_offset);
		loaded_word = heap_offset;
	}

	if (dynamic_offset)
	{
		auto *offset = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		offset->add_id(loaded_word->id);
		offset->add_id(impl.get_id_for_value(dynamic_offset));
		impl.add(offset);
		loaded_word = offset;
	}

	return loaded_word->id;
}

static spv::Id build_load_resource_handle(Converter::Impl &impl, spv::Id base_image_id,
                                          const Converter::Impl::ResourceReference &reference,
                                          const llvm::CallInst *instruction, bool &is_non_uniform)
{
	auto &builder = impl.builder();

	spv::Id image_id = base_image_id;
	spv::Id type_id = builder.getDerefTypeId(image_id);

	is_non_uniform = false;

	if (reference.base_resource_is_array || reference.bindless)
	{
		uint32_t non_uniform = 0;
		if (reference.base_resource_is_array)
		{
			if (!get_constant_operand(instruction, 4, &non_uniform))
				return 0;
			is_non_uniform = non_uniform != 0;
		}

		type_id = builder.getContainedTypeId(type_id);
		Operation *op = impl.allocate(spv::OpAccessChain,
		                              builder.makePointer(spv::StorageClassUniformConstant, type_id));
		op->add_id(image_id);

		if (reference.bindless)
		{
			spv::Id offset_id = build_bindless_heap_offset(impl, reference,
			                                               reference.base_resource_is_array ? instruction->getOperand(3) : nullptr);

			if (offset_id == 0)
				return 0;
			op->add_id(offset_id);
		}
		else
			op->add_id(impl.get_id_for_value(instruction->getOperand(3)));

		// Some compilers require the index to be marked as NonUniformEXT, even if it not required by Vulkan spec.
		if (is_non_uniform)
			builder.addDecoration(impl.get_id_for_value(instruction->getOperand(3)), spv::DecorationNonUniformEXT);

		impl.add(op);
		image_id = op->id;
	}

	Operation *op = impl.allocate(spv::OpLoad, instruction, type_id);
	op->add_id(image_id);
	impl.id_to_type[op->id] = type_id;
	impl.add(op);

	if (is_non_uniform)
		builder.addDecoration(op->id, spv::DecorationNonUniformEXT);

	return op->id;
}

bool emit_create_handle_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t resource_type_operand, resource_range;

	if (!get_constant_operand(instruction, 1, &resource_type_operand))
		return false;
	if (!get_constant_operand(instruction, 2, &resource_range))
		return false;

	auto resource_type = static_cast<DXIL::ResourceType>(resource_type_operand);

	switch (resource_type)
	{
	case DXIL::ResourceType::SRV:
	{
		auto &reference = impl.srv_index_to_reference[resource_range];
		spv::Id base_image_id = reference.var_id;
		spv::Id image_id = base_image_id;

		bool is_non_uniform = false;
		spv::Id loaded_id = build_load_resource_handle(impl, base_image_id, reference, instruction, is_non_uniform);

		if (!loaded_id)
		{
			LOGE("Failed to load SRV resource handle.\n");
			return false;
		}

		auto &meta = impl.handle_to_resource_meta[loaded_id];
		meta = impl.handle_to_resource_meta[base_image_id];
		meta.non_uniform = is_non_uniform;

		// The base array variable does not know what the stride is, promote that state here.
		if (reference.bindless)
			meta.stride = reference.stride;

		if (is_non_uniform)
		{
			spv::Id type_id = builder.getDerefTypeId(image_id);
			type_id = builder.getContainedTypeId(type_id);

			if (builder.getTypeDimensionality(type_id) == spv::DimBuffer)
			{
				builder.addCapability(spv::CapabilityUniformTexelBufferArrayNonUniformIndexing);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
			else
			{
				builder.addCapability(spv::CapabilitySampledImageArrayNonUniformIndexingEXT);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
		}
		break;
	}

	case DXIL::ResourceType::UAV:
	{
		auto &reference = impl.uav_index_to_reference[resource_range];
		spv::Id base_image_id = reference.var_id;
		spv::Id image_id = base_image_id;

		bool is_non_uniform = false;
		spv::Id loaded_id = build_load_resource_handle(impl, base_image_id, reference, instruction, is_non_uniform);

		if (!loaded_id)
		{
			LOGE("Failed to load UAV resource handle.\n");
			return false;
		}

		auto &meta = impl.handle_to_resource_meta[loaded_id];
		meta = impl.handle_to_resource_meta[base_image_id];
		meta.non_uniform = is_non_uniform;

		// The base array variable does not know what the stride is, promote that state here.
		if (reference.bindless)
			meta.stride = reference.stride;

		if (is_non_uniform)
		{
			spv::Id type_id = builder.getDerefTypeId(image_id);
			type_id = builder.getContainedTypeId(type_id);

			if (builder.getTypeDimensionality(type_id) == spv::DimBuffer)
			{
				builder.addCapability(spv::CapabilityStorageTexelBufferArrayNonUniformIndexing);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
			else
			{
				builder.addCapability(spv::CapabilityStorageImageArrayNonUniformIndexingEXT);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
		}
		break;
	}

	case DXIL::ResourceType::CBV:
	{
		auto &reference = impl.cbv_index_to_reference[resource_range];
		spv::Id base_cbv_id = reference.var_id;
		spv::Id type_id = builder.getDerefTypeId(base_cbv_id);

		if (reference.base_resource_is_array || reference.bindless)
		{
			uint32_t non_uniform = 0;
			if (reference.base_resource_is_array)
			{
				if (!get_constant_operand(instruction, 4, &non_uniform))
					return false;
			}

			type_id = builder.getContainedTypeId(type_id);
			Operation *op =
			    impl.allocate(spv::OpAccessChain, instruction, builder.makePointer(spv::StorageClassUniform, type_id));
			op->add_id(base_cbv_id);

			if (reference.bindless)
			{
				spv::Id offset_id =
						build_bindless_heap_offset(impl, reference, reference.base_resource_is_array ? instruction->getOperand(3) : nullptr);
				if (!offset_id)
				{
					LOGE("Failed to load CBV bindless offset.\n");
					return false;
				}
				op->add_id(offset_id);
			}
			else
			{
				op->add_id(impl.get_id_for_value(instruction->getOperand(3)));
			}

			impl.add(op);
			impl.handle_to_ptr_id[instruction] = op->id;

			auto &meta = impl.handle_to_resource_meta[op->id];
			meta = {};
			meta.non_uniform = non_uniform != 0;

			if (meta.non_uniform)
			{
				builder.addCapability(spv::CapabilityUniformBufferArrayNonUniformIndexingEXT);
				builder.addDecoration(op->id, spv::DecorationNonUniformEXT);
				builder.addExtension("SPV_EXT_descriptor_indexing");
			}
		}
		else
		{
			impl.handle_to_ptr_id[instruction] = base_cbv_id;
			if (base_cbv_id == impl.root_constant_id)
			{
				unsigned member_offset = impl.cbv_push_constant_member[resource_range];
				impl.handle_to_root_member_offset[instruction] = member_offset;
			}
		}
		break;
	}

	case DXIL::ResourceType::Sampler:
	{
		auto &reference = impl.sampler_index_to_reference[resource_range];
		spv::Id base_sampler_id = reference.var_id;

		bool is_non_uniform = false;
		spv::Id loaded_id = build_load_resource_handle(impl, base_sampler_id, reference, instruction, is_non_uniform);

		if (!loaded_id)
		{
			LOGE("Failed to load Sampler resource handle.\n");
			return false;
		}

		auto &meta = impl.handle_to_resource_meta[loaded_id];
		meta = impl.handle_to_resource_meta[base_sampler_id];
		meta.non_uniform = is_non_uniform;

		if (is_non_uniform)
		{
			builder.addCapability(spv::CapabilitySampledImageArrayNonUniformIndexingEXT);
			builder.addExtension("SPV_EXT_descriptor_indexing");
		}
		break;
	}

	default:
		return false;
	}

	return true;
}

static bool emit_cbuffer_load_legacy_instruction_root_constant(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	auto *constant_int = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(2));
	if (!constant_int)
		return false;

	unsigned member_index = 4 * unsigned(constant_int->getUniqueInteger().getZExtValue());
	member_index += impl.handle_to_root_member_offset[instruction->getOperand(1)];

	if (member_index >= impl.root_constant_num_words)
		return false;

	unsigned num_words = std::min(4u, impl.root_constant_num_words - member_index);

	auto *result_type = instruction->getType();

	// Root constants are emitted as uints as they are typically used as indices.
	bool need_bitcast = result_type->getStructElementType(0)->getTypeID() != llvm::Type::TypeID::IntegerTyID;

	spv::Id elements[4];
	for (unsigned i = 0; i < 4; i++)
	{
		if (i < num_words)
		{
			auto *op = impl.allocate(spv::OpAccessChain,
			                         builder.makePointer(spv::StorageClassPushConstant, builder.makeUintType(32)));

			op->add_id(impl.root_constant_id);
			op->add_id(builder.makeUintConstant(member_index + i));
			impl.add(op);

			auto *load_op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
			load_op->add_id(op->id);
			impl.add(load_op);
			elements[i] = load_op->id;
		}
		else
			elements[i] = builder.makeUintConstant(0);
	}

	spv::Id id = impl.build_vector(builder.makeUintType(32), elements, 4);
	if (need_bitcast)
	{
		spv::Id type_id = builder.makeVectorType(impl.get_type_id(result_type->getStructElementType(0)), 4);
		auto *op = impl.allocate(spv::OpBitcast, instruction, type_id);
		op->add_id(id);
		impl.add(op);
	}
	else
	{
		impl.value_map[instruction] = id;
	}

	return true;
}

bool emit_cbuffer_load_legacy_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// This function returns a struct, but ignore that, and just return a vec4 for now.
	// extractvalue is used to pull out components and that works for vectors as well.
	spv::Id ptr_id = impl.handle_to_ptr_id[instruction->getOperand(1)];
	if (!ptr_id)
		return false;

	if (ptr_id == impl.root_constant_id)
	{
		return emit_cbuffer_load_legacy_instruction_root_constant(impl, instruction);
	}
	else
	{
		auto itr = impl.handle_to_resource_meta.find(ptr_id);
		bool non_uniform = itr != impl.handle_to_resource_meta.end() && itr->second.non_uniform;

		spv::Id vec4_index = impl.get_id_for_value(instruction->getOperand(2));

		Operation *access_chain_op = impl.allocate(
		    spv::OpAccessChain,
		    builder.makePointer(spv::StorageClassUniform, builder.makeVectorType(builder.makeFloatType(32), 4)));
		access_chain_op->add_ids({ ptr_id, builder.makeUintConstant(0), vec4_index });
		impl.add(access_chain_op);

		if (non_uniform)
			builder.addDecoration(access_chain_op->id, spv::DecorationNonUniformEXT);

		bool need_bitcast = false;
		auto *result_type = instruction->getType();
		if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
			return false;
		if (result_type->getStructNumElements() != 4)
			return false;
		if (result_type->getStructElementType(0)->getTypeID() != llvm::Type::TypeID::FloatTyID)
			need_bitcast = true;

		Operation *load_op =
		    impl.allocate(spv::OpLoad, instruction, builder.makeVectorType(builder.makeFloatType(32), 4));
		load_op->add_id(access_chain_op->id);
		impl.add(load_op);

		if (need_bitcast)
		{
			Operation *op = impl.allocate(spv::OpBitcast, builder.makeVectorType(builder.makeUintType(32), 4));

			assert(result_type->getStructElementType(0)->getTypeID() == llvm::Type::TypeID::IntegerTyID);
			op->add_id(load_op->id);
			impl.add(op);
			impl.value_map[instruction] = op->id;
		}
		return true;
	}
}
} // namespace dxil_spv
