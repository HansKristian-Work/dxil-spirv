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
bool emit_load_input_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;
	Operation op;

	uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

	if (num_rows > 1)
	{
		ptr_id = impl.allocate_id();

		op.op = spv::OpInBoundsAccessChain;
		op.id = ptr_id;

		// Need to deal with signed vs unsigned here.
		op.type_id = impl.get_type_id(meta.component_type, 1, 1);
		op.type_id = builder.makePointer(spv::StorageClassInput, op.type_id);
		op.arguments = { var_id, impl.get_id_for_value(instruction->getOperand(3), 32) };

		ops.push_back(std::move(op));
	}
	else
		ptr_id = var_id;

	op = {};
	op.op = spv::OpLoad;
	op.id = impl.get_id_for_value(instruction);
	// Need to deal with signed vs unsigned here.
	op.type_id = impl.get_type_id(meta.component_type, 1, 1);
	op.arguments = { ptr_id };

	ops.push_back(std::move(op));

	// Need to bitcast after we load.
	impl.fixup_load_sign(ops, meta.component_type, 1, instruction);
	return true;
}

static spv::Id build_attribute_offset(spv::Id id, std::vector<Operation> &ops, Converter::Impl &impl,
                                      spv::Builder &builder)
{
	Operation op;
	op.id = impl.allocate_id();
	op.op = spv::OpBitFieldSExtract;
	op.type_id = builder.makeUintType(32);
	op.arguments = { id, builder.makeUintConstant(0), builder.makeUintConstant(4) };
	id = op.id;
	ops.push_back(std::move(op));

	op = {};
	op.id = impl.allocate_id();
	op.op = spv::OpConvertSToF;
	op.type_id = builder.makeFloatType(32);
	op.arguments = { id };
	id = op.id;
	ops.push_back(std::move(op));

	op = {};
	op.id = impl.allocate_id();
	op.op = spv::OpFMul;
	op.type_id = builder.makeFloatType(32);
	op.arguments = { id, builder.makeFloatConstant(1.0f / 16.0f) };
	id = op.id;
	ops.push_back(std::move(op));

	return id;
}

bool emit_interpolate_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	uint32_t input_element_index;
	if (!get_constant_operand(instruction, 1, &input_element_index))
		return false;

	const auto &meta = impl.input_elements_meta[input_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;
	Operation op;

	uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

	if (num_rows > 1)
	{
		ptr_id = impl.allocate_id();

		op.op = spv::OpInBoundsAccessChain;
		op.id = ptr_id;

		// Need to deal with signed vs unsigned here.
		op.type_id = impl.get_type_id(meta.component_type, 1, 1);
		op.type_id = builder.makePointer(spv::StorageClassInput, op.type_id);
		op.arguments = { var_id, impl.get_id_for_value(instruction->getOperand(3), 32) };

		ops.push_back(std::move(op));
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
				offsets[i] = build_attribute_offset(offsets[i], ops, impl, builder);
				is_non_const = true;
			}
			else
			{
				float off = float(constant_operand->getUniqueInteger().getSExtValue()) / 16.0f;
				offsets[i] = builder.makeFloatConstant(off);
			}
		}

		if (is_non_const)
			aux_id = impl.build_vector(ops, builder.makeFloatType(32), offsets, 2);
		else
			aux_id = impl.build_constant_vector(ops, builder.makeFloatType(32), offsets, 2);
	}
	else if (opcode == GLSLstd450InterpolateAtSample)
		aux_id = impl.get_id_for_value(instruction->getOperand(4));

	op = {};
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	// Need to deal with signed vs unsigned here.
	op.type_id = impl.get_type_id(meta.component_type, 1, 1);
	op.arguments = {
		impl.glsl_std450_ext,
		opcode,
		ptr_id,
	};

	if (aux_id)
		op.arguments.push_back(aux_id);

	ops.push_back(std::move(op));

	// Need to bitcast after we load.
	impl.fixup_load_sign(ops, meta.component_type, 1, instruction);
	builder.addCapability(spv::CapabilityInterpolationFunction);
	return true;
}

bool emit_store_output_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	uint32_t output_element_index;
	if (!get_constant_operand(instruction, 1, &output_element_index))
		return false;

	const auto &meta = impl.output_elements_meta[output_element_index];
	uint32_t var_id = meta.id;
	uint32_t ptr_id;
	Operation op;

	uint32_t num_rows = builder.getNumTypeComponents(builder.getDerefTypeId(var_id));

	if (num_rows > 1)
	{
		ptr_id = impl.allocate_id();

		op.op = spv::OpInBoundsAccessChain;
		op.id = ptr_id;
		op.type_id = builder.getScalarTypeId(builder.getDerefTypeId(var_id));
		op.type_id = builder.makePointer(spv::StorageClassOutput, op.type_id);
		op.arguments = { var_id, impl.get_id_for_value(instruction->getOperand(3), 32) };

		ops.push_back(std::move(op));
	}
	else
		ptr_id = var_id;

	spv::Id store_value = impl.get_id_for_value(instruction->getOperand(4));

	op = {};
	op.op = spv::OpStore;
	op.arguments = { ptr_id, impl.fixup_store_sign(ops, meta.component_type, 1, store_value) };

	ops.push_back(std::move(op));
	return true;
}

bool emit_create_handle_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::CallInst *instruction)
{
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
		Operation op;
		op.op = spv::OpLoad;
		op.id = impl.get_id_for_value(instruction);
		op.type_id = type_id;
		op.arguments = { image_id };
		impl.id_to_type[op.id] = type_id;
		impl.handle_to_resource_meta[op.id] = impl.handle_to_resource_meta[image_id];
		ops.push_back(std::move(op));
		break;
	}

	case DXIL::ResourceType::UAV:
	{
		spv::Id image_id = impl.uav_index_to_id[resource_range];
		spv::Id type_id = builder.getDerefTypeId(image_id);
		const auto &meta = impl.handle_to_resource_meta[image_id];
		Operation op;
		op.op = spv::OpLoad;
		op.id = impl.get_id_for_value(instruction);
		op.type_id = type_id;
		op.arguments = { image_id };
		impl.id_to_type[op.id] = type_id;
		impl.handle_to_resource_meta[op.id] = meta;

		ops.push_back(std::move(op));
		break;
	}

	case DXIL::ResourceType::CBV:
		impl.handle_to_ptr_id[instruction] = impl.cbv_index_to_id[resource_range];
		break;

	case DXIL::ResourceType::Sampler:
	{
		spv::Id sampler_id = impl.sampler_index_to_id[resource_range];
		spv::Id type_id = builder.getDerefTypeId(sampler_id);
		Operation op;
		op.op = spv::OpLoad;
		op.id = impl.get_id_for_value(instruction);
		op.type_id = type_id;
		op.arguments = { sampler_id };
		impl.handle_to_resource_meta[op.id] = { DXIL::ResourceKind::Sampler, DXIL::ComponentType::Invalid, 0u };
		impl.id_to_type[op.id] = type_id;
		ops.push_back(std::move(op));
		break;
	}

	default:
		return false;
	}

	return true;
}

bool emit_cbuffer_load_legacy_instruction(std::vector<Operation> &ops, Converter::Impl &impl,
                                          spv::Builder &builder, const llvm::CallInst *instruction)
{
	// This function returns a struct, but ignore that, and just return a vec4 for now.
	// extractvalue is used to pull out components and that works for vectors as well.
	spv::Id ptr_id = impl.handle_to_ptr_id[instruction->getOperand(1)];
	if (!ptr_id)
		return false;

	spv::Id vec4_index = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id access_chain_id = impl.allocate_id();

	Operation op;
	op.op = spv::OpInBoundsAccessChain;
	op.id = access_chain_id;
	op.type_id = builder.makeVectorType(builder.makeFloatType(32), 4);
	op.type_id = builder.makePointer(spv::StorageClassUniform, op.type_id);
	op.arguments = { ptr_id, builder.makeUintConstant(0), vec4_index };

	ops.push_back(std::move(op));

	bool need_bitcast = false;
	auto *result_type = instruction->getType();
	if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
		return false;
	if (result_type->getStructNumElements() != 4)
		return false;
	if (result_type->getStructElementType(0)->getTypeID() != llvm::Type::TypeID::FloatTyID)
		need_bitcast = true;

	spv::Id bitcast_input_id = 0;
	op = {};
	op.op = spv::OpLoad;
	op.id = need_bitcast ? impl.allocate_id() : impl.get_id_for_value(instruction);
	op.type_id = builder.makeVectorType(builder.makeFloatType(32), 4);
	op.arguments = { access_chain_id };

	bitcast_input_id = op.id;
	ops.push_back(std::move(op));

	if (need_bitcast)
	{
		op = {};
		op.op = spv::OpBitcast;
		op.id = impl.get_id_for_value(instruction);

		assert(result_type->getStructElementType(0)->getTypeID() == llvm::Type::TypeID::IntegerTyID);
		op.type_id = builder.makeVectorType(builder.makeUintType(32), 4);
		op.arguments = { bitcast_input_id };
		ops.push_back(std::move(op));
	}

	return true;
}

}
