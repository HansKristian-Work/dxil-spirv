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

#include "dxil_resources.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "logging.hpp"

namespace DXIL2SPIRV
{
static void fixup_builtin_load(Converter::Impl &impl, spv::Id var_id, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::BuiltIn builtin;
	if (impl.spirv_module.query_builtin_shader_input(var_id, &builtin) && builtin == spv::BuiltInInstanceIndex)
	{
		// Need to shift InstanceIndex down to 0-base.
		spv::Id base_instance_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInBaseInstance);
		{
			Operation *op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
			op->add_id(base_instance_id);
			base_instance_id = op->id;
			impl.add(op);
		}

		Operation *sub_op = impl.allocate(spv::OpISub, builder.makeUintType(32));
		sub_op->add_ids({ impl.get_id_for_value(instruction), base_instance_id });
		impl.add(sub_op);
		impl.value_map[instruction] = sub_op->id;
		builder.addCapability(spv::CapabilityDrawParameters);
	}
}

bool emit_load_input_instruction(Converter::Impl &impl,
                                 const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id input_type_id = builder.getDerefTypeId(var_id);
	if (builder.isArrayType(input_type_id))
		input_type_id = builder.getContainedTypeId(input_type_id);
	uint32_t num_rows = builder.getNumTypeComponents(input_type_id);

	bool array_index = !llvm::isa<llvm::UndefValue>(instruction->getOperand(4));

	if (num_rows > 1 || array_index)
	{
		// Need to deal with signed vs unsigned here.
		Operation *op = impl.allocate(spv::OpAccessChain,
		                              builder.makePointer(spv::StorageClassInput, impl.get_type_id(meta.component_type, 1, 1)));
		ptr_id = op->id;

		op->add_id(var_id);
		if (array_index)
		{
			// Vertex array index for GS/DS/HS.
			op->add_id(impl.get_id_for_value(instruction->getOperand(4)));
		}

		if (num_rows > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

		impl.add(op);
	}
	else
		ptr_id = var_id;

	// Need to deal with signed vs unsigned here.
	Operation *op = impl.allocate(spv::OpLoad,
	                              instruction, impl.get_type_id(meta.component_type, 1, 1));
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

bool emit_interpolate_instruction(GLSLstd450 opcode, Converter::Impl &impl,
                                  const llvm::CallInst *instruction)
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
		Operation *op = impl.allocate(spv::OpAccessChain,
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
	Operation *op = impl.allocate(spv::OpExtInst, instruction,
	                              impl.get_type_id(meta.component_type, 1, 1));
	op->add_ids({
		impl.glsl_std450_ext,
		opcode,
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

bool emit_store_output_instruction(Converter::Impl &impl,
                                   const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.output_elements_meta[output_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;

	spv::Id output_type_id = builder.getDerefTypeId(var_id);
	if (builder.isArrayType(output_type_id))
		output_type_id = builder.getContainedTypeId(output_type_id);
	uint32_t num_rows = builder.getNumTypeComponents(output_type_id);

	bool is_control_point_output = impl.execution_model == spv::ExecutionModelTessellationControl;

	if (num_rows > 1 || is_control_point_output)
	{
		Operation *op = impl.allocate(spv::OpAccessChain,
		                              builder.makePointer(spv::StorageClassOutput, builder.getScalarTypeId(output_type_id)));
		ptr_id = op->id;

		op->add_id(var_id);
		if (is_control_point_output)
			op->add_id(build_load_invocation_id(impl));
		if (num_rows > 1)
			op->add_id(impl.get_id_for_value(instruction->getOperand(3), 32));

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

bool emit_create_handle_instruction(Converter::Impl &impl,
                                    const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	uint32_t resource_type_operand, resource_range;

	if (!get_constant_operand(instruction, 1, &resource_type_operand))
		return false;
	if (!get_constant_operand(instruction, 2, &resource_range))
		return false;

	auto resource_type = static_cast<DXIL::ResourceType>(resource_type_operand);

	// 3 = index into range
	// 4 = non-uniform resource index
	switch (resource_type)
	{
	case DXIL::ResourceType::SRV:
	{
		spv::Id image_id = impl.srv_index_to_id[resource_range];
		spv::Id type_id = builder.getDerefTypeId(image_id);
		Operation *op = impl.allocate(spv::OpLoad, instruction, type_id);
		op->add_id(image_id);
		impl.id_to_type[op->id] = type_id;
		impl.handle_to_resource_meta[op->id] = impl.handle_to_resource_meta[image_id];
		impl.add(op);
		break;
	}

	case DXIL::ResourceType::UAV:
	{
		spv::Id image_id = impl.uav_index_to_id[resource_range];
		spv::Id type_id = builder.getDerefTypeId(image_id);
		const auto &meta = impl.handle_to_resource_meta[image_id];
		Operation *op = impl.allocate(spv::OpLoad, instruction, type_id);
		op->add_id(image_id);
		impl.id_to_type[op->id] = type_id;
		impl.handle_to_resource_meta[op->id] = meta;
		impl.add(op);
		break;
	}

	case DXIL::ResourceType::CBV:
		impl.handle_to_ptr_id[instruction] = impl.cbv_index_to_id[resource_range];
		break;

	case DXIL::ResourceType::Sampler:
	{
		spv::Id sampler_id = impl.sampler_index_to_id[resource_range];
		spv::Id type_id = builder.getDerefTypeId(sampler_id);
		Operation *op = impl.allocate(spv::OpLoad, instruction, type_id);
		op->add_id(sampler_id);
		impl.handle_to_resource_meta[op->id] = { DXIL::ResourceKind::Sampler, DXIL::ComponentType::Invalid, 0u };
		impl.id_to_type[op->id] = type_id;
		impl.add(op);
		break;
	}

	default:
		return false;
	}

	return true;
}

bool emit_cbuffer_load_legacy_instruction(Converter::Impl &impl,
                                          const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// This function returns a struct, but ignore that, and just return a vec4 for now.
	// extractvalue is used to pull out components and that works for vectors as well.
	spv::Id ptr_id = impl.handle_to_ptr_id[instruction->getOperand(1)];
	if (!ptr_id)
		return false;

	spv::Id vec4_index = impl.get_id_for_value(instruction->getOperand(2));

	Operation *access_chain_op = impl.allocate(spv::OpAccessChain,
	                                           builder.makePointer(spv::StorageClassUniform,
	                                                               builder.makeVectorType(builder.makeFloatType(32), 4)));
	access_chain_op->add_ids({ ptr_id, builder.makeUintConstant(0), vec4_index });
	impl.add(access_chain_op);

	bool need_bitcast = false;
	auto *result_type = instruction->getType();
	if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
		return false;
	if (result_type->getStructNumElements() != 4)
		return false;
	if (result_type->getStructElementType(0)->getTypeID() != llvm::Type::TypeID::FloatTyID)
		need_bitcast = true;

	spv::Id bitcast_input_id = 0;
	Operation *load_op = impl.allocate(spv::OpLoad, instruction,
	                                   builder.makeVectorType(builder.makeFloatType(32), 4));
	load_op->add_id(access_chain_op->id);
	impl.add(load_op);

	if (need_bitcast)
	{
		Operation *op = impl.allocate(spv::OpBitcast,
		                              builder.makeVectorType(builder.makeUintType(32), 4));

		assert(result_type->getStructElementType(0)->getTypeID() == llvm::Type::TypeID::IntegerTyID);
		op->add_id(bitcast_input_id);
		impl.add(op);
		impl.value_map[instruction] = op->id;
	}

	return true;
}

}
