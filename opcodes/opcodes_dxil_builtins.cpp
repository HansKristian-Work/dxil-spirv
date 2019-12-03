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

#include "opcodes_dxil_builtins.hpp"
#include "converter_impl.hpp"
#include "logging.hpp"

namespace DXIL2SPIRV
{
static bool get_constant_operand(const llvm::CallInst *value, unsigned index, uint32_t *operand)
{
	if (index >= value->getNumOperands())
	{
		LOGE("Operand index out of range.\n");
		return false;
	}

	auto *constant = llvm::dyn_cast<llvm::ConstantInt>(value->getOperand(index));
	if (!constant)
	{
		LOGE("Operand is not constant.\n");
		return false;
	}

	*operand = uint32_t(constant->getUniqueInteger().getZExtValue());
	return true;
}

static bool emit_load_input_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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
		assert(op.arguments[0]);
		assert(op.arguments[1]);

		ops.push_back(std::move(op));
	}
	else
		ptr_id = var_id;

	bool need_bitcast_after_load =
	    impl.get_type_id(meta.component_type, 1, 1) != impl.get_type_id(instruction->getType());
	spv::Id loaded_id = need_bitcast_after_load ? impl.allocate_id() : impl.get_id_for_value(instruction);

	op = {};
	op.op = spv::OpLoad;
	op.id = loaded_id;

	// Need to deal with signed vs unsigned here.
	op.type_id = impl.get_type_id(meta.component_type, 1, 1);

	op.arguments = { ptr_id };
	assert(op.arguments[0]);

	ops.push_back(std::move(op));

	// Need to bitcast after we load.
	if (need_bitcast_after_load)
	{
		Operation bitcast_op;
		bitcast_op.op = spv::OpBitcast;
		bitcast_op.type_id = impl.get_type_id(instruction->getType());
		bitcast_op.arguments = { loaded_id };
		bitcast_op.id = impl.get_id_for_value(instruction);
		ops.push_back(std::move(bitcast_op));
	}

	return true;
}

static bool emit_store_output_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

	// Need to bitcast before we can store.
	if (impl.get_type_id(meta.component_type, 1, 1) != impl.get_type_id(instruction->getOperand(4)->getType()))
	{
		Operation bitcast_op;
		bitcast_op.op = spv::OpBitcast;
		bitcast_op.type_id = impl.get_type_id(meta.component_type, 1, 1);
		bitcast_op.arguments = { store_value };
		bitcast_op.id = impl.allocate_id();
		store_value = bitcast_op.id;
		ops.push_back(std::move(bitcast_op));
	}

	op = {};
	op.op = spv::OpStore;
	op.arguments = { ptr_id, store_value };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_create_handle_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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
		impl.handle_to_resource_meta[op.id] = { DXIL::ResourceKind::Sampler, 0u };
		impl.id_to_type[op.id] = type_id;
		ops.push_back(std::move(op));
		break;
	}

	default:
		return false;
	}

	return true;
}

static bool emit_cbuffer_load_legacy_instruction(std::vector<Operation> &ops, Converter::Impl &impl,
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

static bool get_image_dimensions(Converter::Impl &impl, spv::Builder &builder, spv::Id image_id, uint32_t *num_coords,
                                 uint32_t *num_dimensions)
{
	spv::Id image_type_id = impl.get_type_id(image_id);
	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool arrayed = builder.isArrayedImageType(image_type_id);

	switch (dim)
	{
	case spv::Dim1D:
	case spv::DimBuffer:
		*num_dimensions = 1;
		break;

	case spv::Dim2D:
		*num_dimensions = 2;
		break;

	case spv::Dim3D:
	case spv::DimCube:
		*num_dimensions = 3;
		break;

	default:
		LOGE("Unexpected sample dimensionality.\n");
		return false;
	}

	*num_coords = *num_dimensions + unsigned(arrayed);
	return true;
}

static bool emit_texture_store_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                           const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);
	spv::Id coord[3] = {};

	unsigned num_coords_full, num_coords;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	// Cubes are not supported here.
	if (num_coords_full > 3)
		return false;

	for (unsigned i = 0; i < num_coords_full; i++)
		coord[i] = impl.get_id_for_value(instruction->getOperand(i + 2));

	spv::Id write_values[4] = {};
	for (unsigned i = 0; i < 4; i++)
		write_values[i] = impl.get_id_for_value(instruction->getOperand(i + 5));

	// Ignore write mask. We cannot do anything meaningful about it.
	// The write mask must cover all components in the image, and there is no "sliced write" support for typed resources.

	Operation op;
	op.op = spv::OpImageWrite;

	op.arguments.push_back(image_id);
	op.arguments.push_back(impl.build_vector(ops, builder.makeUintType(32), coord, num_coords_full));
	op.arguments.push_back(impl.build_vector(ops, builder.getTypeId(write_values[0]), write_values, 4));
	builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);

	ops.push_back(std::move(op));
	return true;
}

struct BufferAccessInfo
{
	spv::Id index_id;
	unsigned num_components;
};

static BufferAccessInfo build_buffer_access(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                            const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];

	spv::Id index_id = impl.get_id_for_value(instruction->getOperand(2));
	unsigned num_components = 4;

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		// For raw buffers, the index is in bytes. Since we only consider bytes, shift by 4.
		Operation op;
		op.op = spv::OpShiftRightLogical;
		op.id = impl.allocate_id();
		op.type_id = builder.makeUintType(32);
		op.arguments = { index_id, builder.makeUintConstant(2) };
		index_id = op.id;
		ops.push_back(std::move(op));
	}
	else if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
	{
		unsigned constant_offset = 0;
		spv::Id offset_id = impl.get_id_for_value(instruction->getOperand(3));
		bool has_constant_offset = false;
		if (llvm::isa<llvm::ConstantInt>(instruction->getOperand(3)))
		{
			constant_offset = unsigned(llvm::cast<llvm::ConstantInt>(
					instruction->getOperand(3))->getUniqueInteger().getZExtValue());
			has_constant_offset = true;
		}

		num_components = std::min(4u, (meta.stride - constant_offset) / 4);

		Operation op;

		if (meta.stride != 4)
		{
			op.op = spv::OpIMul;
			op.id = impl.allocate_id();
			op.type_id = builder.makeUintType(32);
			op.arguments = { index_id, builder.makeUintConstant(meta.stride / 4) };
			index_id = op.id;
			ops.push_back(std::move(op));
		}

		if (has_constant_offset)
		{
			if (constant_offset != 0)
			{
				op = {};
				op.op = spv::OpIAdd;
				op.id = impl.allocate_id();
				op.type_id = builder.makeUintType(32);
				op.arguments = { index_id, builder.makeUintConstant(constant_offset / 4) };
				index_id = op.id;
				ops.push_back(std::move(op));
			}
		}
		else
		{
			// Dynamically offset into the structured element.
			op = {};
			op.op = spv::OpShiftRightLogical;
			op.id = impl.allocate_id();
			op.type_id = builder.makeUintType(32);
			op.arguments = { offset_id, builder.makeUintConstant(2) };
			offset_id = op.id;
			ops.push_back(std::move(op));

			op = {};
			op.op = spv::OpIAdd;
			op.id = impl.allocate_id();
			op.type_id = builder.makeUintType(32);
			op.arguments = { index_id, offset_id };
			index_id = op.id;
			ops.push_back(std::move(op));
		}
	}

	return { index_id, num_components };
}

static bool emit_buffer_store_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                          const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	auto access = build_buffer_access(ops, impl, builder, instruction);

	spv::Id store_values[4] = {};
	unsigned mask = llvm::cast<llvm::ConstantInt>(instruction->getOperand(8))->getUniqueInteger().getZExtValue();
	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;

	for (unsigned i = 0; i < 4; i++)
	{
		store_values[i] = impl.get_id_for_value(instruction->getOperand(4 + i));
		if (!is_typed && (mask & (1u << i)))
		{
			if (instruction->getOperand(4 + i)->getType()->getTypeID() != llvm::Type::TypeID::IntegerTyID)
			{
				Operation op;
				op.op = spv::OpBitcast;
				op.type_id = builder.makeUintType(32);
				op.id = impl.allocate_id();
				op.arguments = { store_values[i] };
				store_values[i] = op.id;
				ops.push_back(std::move(op));
			}
		}
	}

	if (is_typed)
	{
		spv::Id element_type_id = impl.get_type_id(instruction->getOperand(4)->getType());

		Operation op;
		op.op = spv::OpImageWrite;
		op.arguments = {
			image_id, access.index_id,
			impl.build_vector(ops, element_type_id, store_values, 4)
		};
		ops.push_back(std::move(op));
	}
	else
	{
		spv::Id splat_type_id = builder.makeVectorType(builder.makeUintType(32), 4);
		for (unsigned i = 0; i < 4; i++)
		{
			if (mask & (1u << i))
			{
				spv::Id splat_id = impl.allocate_id();

				Operation op;
				op.op = spv::OpCompositeConstruct;
				op.type_id = splat_type_id;
				op.id = splat_id;
				op.arguments = { store_values[i], store_values[i], store_values[i], store_values[i] };
				ops.push_back(std::move(op));

				op = {};
				op.op = spv::OpImageWrite;
				op.arguments = {
					image_id, impl.build_offset(ops, access.index_id, i),
					splat_id,
				};
				ops.push_back(std::move(op));
			}
		}
	}

	if (is_typed)
		builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);

	return true;
}

static bool emit_buffer_load_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                         const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);
	bool is_uav = builder.isStorageImageType(image_type_id);
	const auto &meta = impl.handle_to_resource_meta[image_id];
	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;

	auto access = build_buffer_access(ops, impl, builder, instruction);

	auto *result_type = instruction->getType();
	if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
	{
		LOGE("Expected return type is a struct.\n");
		return false;
	}

	// For tiled resources, there is a status result in the 5th member, but as long as noone attempts to extract it,
	// we should be fine ...
	assert(result_type->getStructNumElements() == 5);

	if (!is_typed)
	{
		// Unroll 4 loads. Ideally, we'd probably use physical_storage_buffer here, but unfortunately we have no indication
		// how many components we need to load here, and the number of components we load is not necessarily constant,
		// so we cannot reliably encode this information in the SRV.
		// The best we can do is to infer it from stride if we can.

		// For raw buffers, we have no stride information, so assume we need to load 4 components.
		// Hopefully compiler can eliminate loads which are never used ...
		unsigned conservative_num_elements = access.num_components;

		spv::Id component_ids[4] = {};

		spv::Id extracted_id_type = builder.makeUintType(32);
		spv::Id loaded_id_type = builder.makeVectorType(extracted_id_type, 4);

		for (unsigned i = 0; i < conservative_num_elements; i++)
		{
			spv::Id loaded_id = impl.allocate_id();
			spv::Id extracted_id = impl.allocate_id();

			Operation op;
			op.op = is_uav ? spv::OpImageRead : spv::OpImageFetch;
			op.id = loaded_id;
			op.type_id = loaded_id_type;
			op.arguments = { image_id, impl.build_offset(ops, access.index_id, i) };
			ops.push_back(std::move(op));

			op = {};
			op.op = spv::OpCompositeExtract;
			op.id = extracted_id;
			op.type_id = extracted_id_type;
			op.arguments = { loaded_id, 0 };
			ops.push_back(std::move(op));

			component_ids[i] = extracted_id;
		}

		bool need_bitcast = result_type->getStructElementType(0)->getTypeID() != llvm::Type::TypeID::IntegerTyID;
		spv::Id construct_id = need_bitcast ? impl.allocate_id() : impl.get_id_for_value(instruction);

		Operation op;
		op.op = spv::OpCompositeConstruct;
		op.id = construct_id;
		op.type_id = builder.makeVectorType(extracted_id_type, conservative_num_elements);
		op.arguments.insert(op.arguments.end(), component_ids, component_ids + conservative_num_elements);
		ops.push_back(std::move(op));

		if (need_bitcast)
		{
			op = {};
			op.op = spv::OpBitcast;
			op.id = impl.get_id_for_value(instruction);
			op.type_id = impl.get_type_id(result_type->getStructElementType(0));
			op.type_id = builder.makeVectorType(op.type_id, conservative_num_elements);
			op.arguments = { construct_id };
			ops.push_back(std::move(op));
		}
	}
	else
	{
		Operation op;
		op.op = is_uav ? spv::OpImageRead : spv::OpImageFetch;
		op.id = impl.get_id_for_value(instruction);

		op.type_id = impl.get_type_id(result_type->getStructElementType(0));
		op.type_id = builder.makeVectorType(op.type_id, 4);
		op.arguments = { image_id, access.index_id };
		ops.push_back(std::move(op));
	}

	if (is_uav && is_typed)
		builder.addCapability(spv::CapabilityStorageImageReadWithoutFormat);

	return true;
}

static bool emit_texture_load_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                          const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);

	bool is_uav = builder.isStorageImageType(image_type_id);
	uint32_t image_ops = 0;

	spv::Id mip_or_sample = 0;
	if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(2)))
	{
		mip_or_sample = impl.get_id_for_value(instruction->getOperand(2));
		if (builder.isMultisampledImageType(image_type_id))
			image_ops |= spv::ImageOperandsSampleMask;
		else
			image_ops |= spv::ImageOperandsLodMask;
	}

	spv::Id coord[3] = {};
	spv::Id offsets[3] = {};

	unsigned num_coords_full, num_coords;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	// Cubes are not supported here.
	if (num_coords_full > 3)
		return false;

	for (unsigned i = 0; i < num_coords_full; i++)
		coord[i] = impl.get_id_for_value(instruction->getOperand(i + 3));

	for (unsigned i = 0; i < num_coords; i++)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(i + 6)))
		{
			auto *constant_arg = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(i + 6));
			if (!constant_arg)
			{
				LOGE("Sampling offset must be a constant int.\n");
				return false;
			}
			image_ops |= spv::ImageOperandsConstOffsetMask;
			offsets[i] = builder.makeIntConstant(int(constant_arg->getUniqueInteger().getSExtValue()));
		}
		else
			offsets[i] = builder.makeIntConstant(0);
	}

	Operation op;
	op.op = is_uav ? spv::OpImageRead : spv::OpImageFetch;
	auto *result_type = instruction->getType();
	if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
	{
		LOGE("Expected return type is a struct.\n");
		return false;
	}

	// For tiled resources, there is a status result in the 5th member, but as long as noone attempts to extract it,
	// we should be fine ...
	assert(result_type->getStructNumElements() == 5);
	op.type_id = impl.get_type_id(result_type->getStructElementType(0));
	op.type_id = builder.makeVectorType(op.type_id, 4);

	op.id = impl.get_id_for_value(instruction);
	op.arguments.push_back(image_id);
	op.arguments.push_back(impl.build_vector(ops, builder.makeUintType(32), coord, num_coords_full));
	op.arguments.push_back(image_ops);

	if (!is_uav)
	{
		if (image_ops & spv::ImageOperandsLodMask)
			op.arguments.push_back(mip_or_sample);

		if (image_ops & spv::ImageOperandsConstOffsetMask)
		{
			op.arguments.push_back(
			    impl.build_constant_vector(ops, builder.makeIntegerType(32, true), offsets, num_coords));
		}

		if (image_ops & spv::ImageOperandsSampleMask)
			op.arguments.push_back(mip_or_sample);
	}
	else
		builder.addCapability(spv::CapabilityStorageImageReadWithoutFormat);

	ops.push_back(std::move(op));
	return true;
}

static bool emit_sample_grad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                         const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, false);

	unsigned num_coords_full, num_coords;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	uint32_t image_ops = spv::ImageOperandsGradMask;

	spv::Id coord[4] = {};
	for (unsigned i = 0; i < num_coords_full; i++)
		coord[i] = impl.get_id_for_value(instruction->getOperand(i + 3));

	spv::Id offsets[3] = {};
	for (unsigned i = 0; i < num_coords; i++)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(i + 7)))
		{
			auto *constant_arg = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(i + 7));
			if (!constant_arg)
			{
				LOGE("Sampling offset must be a constant int.\n");
				return false;
			}
			image_ops |= spv::ImageOperandsConstOffsetMask;
			offsets[i] = builder.makeIntConstant(int(constant_arg->getUniqueInteger().getSExtValue()));
		}
		else
			offsets[i] = builder.makeIntConstant(0);
	}

	spv::Id grad_x[3] = {};
	spv::Id grad_y[3] = {};
	for (unsigned i = 0; i < num_coords; i++)
		grad_x[i] = impl.get_id_for_value(instruction->getOperand(i + 10));
	for (unsigned i = 0; i < num_coords; i++)
		grad_y[i] = impl.get_id_for_value(instruction->getOperand(i + 13));

	spv::Id aux_argument = 0;
	if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(16)))
	{
		aux_argument = impl.get_id_for_value(instruction->getOperand(16));
		image_ops |= spv::ImageOperandsMinLodMask;
		builder.addCapability(spv::CapabilityMinLod);
	}

	Operation op;
	op.op = spv::OpImageSampleExplicitLod;
	op.id = impl.get_id_for_value(instruction);
	auto *result_type = instruction->getType();
	if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
	{
		LOGE("Expected return type is a struct.\n");
		return false;
	}

	// For tiled resources, there is a status result in the 5th member, but as long as noone attempts to extract it,
	// we should be fine ...
	assert(result_type->getStructNumElements() == 5);
	op.type_id = impl.get_type_id(result_type->getStructElementType(0));
	op.type_id = builder.makeVectorType(op.type_id, 4);

	op.arguments.push_back(combined_image_sampler_id);
	op.arguments.push_back(impl.build_vector(ops, builder.makeFloatType(32), coord, num_coords_full));
	op.arguments.push_back(image_ops);

	if (image_ops & spv::ImageOperandsGradMask)
	{
		op.arguments.push_back(impl.build_vector(ops, builder.makeFloatType(32), grad_x, num_coords));
		op.arguments.push_back(impl.build_vector(ops, builder.makeFloatType(32), grad_y, num_coords));
	}
	if (image_ops & spv::ImageOperandsConstOffsetMask)
		op.arguments.push_back(impl.build_constant_vector(ops, builder.makeIntegerType(32, true), offsets, num_coords));
	if (image_ops & spv::ImageOperandsMinLodMask)
		op.arguments.push_back(aux_argument);

	ops.push_back(std::move(op));
	return true;
}

static bool emit_sample_instruction(DXIL::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                    spv::Builder &builder, const llvm::CallInst *instruction)
{
	bool comparison_sampling = opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleCmpLevelZero;

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, comparison_sampling);

	unsigned num_coords_full, num_coords;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	spv::Id coord[4] = {};
	for (unsigned i = 0; i < num_coords_full; i++)
		coord[i] = impl.get_id_for_value(instruction->getOperand(i + 3));

	uint32_t image_ops = 0;

	if (opcode == DXIL::Op::SampleLevel || opcode == DXIL::Op::SampleCmpLevelZero)
		image_ops |= spv::ImageOperandsLodMask;
	else if (opcode == DXIL::Op::SampleBias)
		image_ops |= spv::ImageOperandsBiasMask;

	spv::Id offsets[3] = {};
	for (unsigned i = 0; i < num_coords; i++)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(i + 7)))
		{
			auto *constant_arg = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(i + 7));
			if (!constant_arg)
			{
				LOGE("Sampling offset must be a constant int.\n");
				return false;
			}
			image_ops |= spv::ImageOperandsConstOffsetMask;
			offsets[i] = builder.makeIntConstant(int(constant_arg->getUniqueInteger().getSExtValue()));
		}
		else
			offsets[i] = builder.makeIntConstant(0);
	}

	spv::Id dref_id = 0;

	if (opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleCmpLevelZero)
		dref_id = impl.get_id_for_value(instruction->getOperand(10));

	spv::Id aux_argument = 0;
	unsigned aux_argument_index = opcode == DXIL::Op::SampleCmp ? 11 : 10;

	if (opcode == DXIL::Op::Sample || opcode == DXIL::Op::SampleCmp)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(aux_argument_index)))
		{
			aux_argument = impl.get_id_for_value(instruction->getOperand(aux_argument_index));
			image_ops |= spv::ImageOperandsMinLodMask;
			builder.addCapability(spv::CapabilityMinLod);
		}
	}
	else if (opcode != DXIL::Op::SampleCmpLevelZero)
		aux_argument = impl.get_id_for_value(instruction->getOperand(aux_argument_index));
	else
		aux_argument = builder.makeFloatConstant(0.0f);

	Operation op;

	switch (opcode)
	{
	case DXIL::Op::SampleLevel:
		op.op = spv::OpImageSampleExplicitLod;
		break;

	case DXIL::Op::Sample:
	case DXIL::Op::SampleBias:
		op.op = spv::OpImageSampleImplicitLod;
		break;

	case DXIL::Op::SampleCmp:
		op.op = spv::OpImageSampleDrefImplicitLod;
		break;

	case DXIL::Op::SampleCmpLevelZero:
		op.op = spv::OpImageSampleDrefExplicitLod;
		break;

	default:
		return false;
	}

	spv::Id sampled_value_id = 0;

	// Comparison sampling only returns a scalar, so we'll need to splat out result.
	if (comparison_sampling)
	{
		sampled_value_id = impl.allocate_id();
		op.id = sampled_value_id;
	}
	else
		op.id = impl.get_id_for_value(instruction);

	auto *result_type = instruction->getType();
	if (result_type->getTypeID() != llvm::Type::TypeID::StructTyID)
	{
		LOGE("Expected return type is a struct.\n");
		return false;
	}

	// For tiled resources, there is a status result in the 5th member, but as long as noone attempts to extract it,
	// we should be fine ...
	assert(result_type->getStructNumElements() == 5);

	op.type_id = impl.get_type_id(result_type->getStructElementType(0));
	if (!comparison_sampling)
		op.type_id = builder.makeVectorType(op.type_id, 4);

	op.arguments.push_back(combined_image_sampler_id);
	op.arguments.push_back(impl.build_vector(ops, builder.makeFloatType(32), coord, num_coords_full));

	if (dref_id)
		op.arguments.push_back(dref_id);

	op.arguments.push_back(image_ops);

	if (image_ops & (spv::ImageOperandsBiasMask | spv::ImageOperandsLodMask))
		op.arguments.push_back(aux_argument);

	if (image_ops & spv::ImageOperandsConstOffsetMask)
		op.arguments.push_back(impl.build_constant_vector(ops, builder.makeIntegerType(32, true), offsets, num_coords));

	if (image_ops & spv::ImageOperandsMinLodMask)
		op.arguments.push_back(aux_argument);

	ops.push_back(std::move(op));

	if (comparison_sampling)
	{
		op = {};
		op.op = spv::OpCompositeConstruct;
		op.id = impl.get_id_for_value(instruction);
		op.type_id = builder.makeVectorType(builder.makeFloatType(32), 4);
		op.arguments = { sampled_value_id, sampled_value_id, sampled_value_id, sampled_value_id };
		ops.push_back(std::move(op));
	}

	return true;
}

template <DXIL::Op opcode>
static bool emit_sample_instruction_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                             const llvm::CallInst *instruction)
{
	return emit_sample_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_saturate_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                      const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, GLSLstd450NClamp, impl.get_id_for_value(instruction->getOperand(1)),
		             builder.makeFloatConstant(0.0f), builder.makeFloatConstant(1.0f) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_imad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	// FIXME: Do we need to deal with intermediate mul overflow here somehow?

	spv::Id mul_result_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpIMul;
		op.id = mul_result_id;
		op.type_id = impl.get_type_id(instruction->getType());
		op.arguments = {
			impl.get_id_for_value(instruction->getOperand(1)),
			impl.get_id_for_value(instruction->getOperand(2))
		};
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpIAdd;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = {
		mul_result_id,
		impl.get_id_for_value(instruction->getOperand(3))
	};
	ops.push_back(std::move(op));
	return true;
}

static bool emit_fmad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = {
		impl.glsl_std450_ext,
		GLSLstd450Fma,
		impl.get_id_for_value(instruction->getOperand(1)),
		impl.get_id_for_value(instruction->getOperand(2)),
		impl.get_id_for_value(instruction->getOperand(3)),
	};

	// Not sure about this one. Will have to figure it out when we start looking at tessellation or something ...
	if (instruction->getMetadata("dx.precise") != nullptr)
		builder.addDecoration(op.id, spv::DecorationNoContraction);

	ops.push_back(std::move(op));
	return true;
}

static bool emit_isfinite_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                      const llvm::CallInst *instruction)
{
	// There is an OpIsFinite instruction, but it's only supported in kernel mode, so we have to decompose here.

	spv::Id nan_id = impl.allocate_id();
	spv::Id inf_id = impl.allocate_id();

	{
		Operation op;
		op.op = spv::OpIsNan;
		op.id = nan_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };
		ops.push_back(std::move(op));
	}

	{
		Operation op;
		op.op = spv::OpIsInf;
		op.id = inf_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };
		ops.push_back(std::move(op));
	}

	spv::Id not_finite_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpLogicalOr;
		op.id = not_finite_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { nan_id, inf_id };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpLogicalNot;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { not_finite_id };
	ops.push_back(std::move(op));
	return true;
}

static bool emit_find_high_bit_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                           spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	// This is actually CLZ, and not FindMSB.
	spv::Id msb_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpExtInst;
		op.id = msb_id;
		op.type_id = impl.get_type_id(instruction->getType());
		op.arguments = {
			impl.glsl_std450_ext,
			opcode,
			impl.get_id_for_value(instruction->getOperand(1))
		};
		ops.push_back(std::move(op));
	}

	spv::Id eq_neg1_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpIEqual;
		op.id = eq_neg1_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { msb_id, builder.makeUintConstant(~0u) };
		ops.push_back(std::move(op));
	}

	spv::Id msb_sub_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpISub;
		op.id = msb_sub_id;
		op.type_id = impl.get_type_id(instruction->getType());
		op.arguments = { builder.makeUintConstant(31), msb_id };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpSelect;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { eq_neg1_id, builder.makeUintConstant(~0u), msb_sub_id };
	ops.push_back(std::move(op));
	return true;
}

template <GLSLstd450 opcode>
static bool emit_find_high_bit_dispatch(std::vector<Operation> &ops, Converter::Impl &impl,
                                        spv::Builder &builder, const llvm::CallInst *instruction)
{
	return emit_find_high_bit_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_dxil_unary_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                        spv::Builder &builder, const llvm::CallInst *instruction)
{
	Operation op;
	op.op = opcode;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_dxil_std450_unary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                               spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, opcode, impl.get_id_for_value(instruction->getOperand(1)) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_dxil_std450_binary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                                spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, opcode, impl.get_id_for_value(instruction->getOperand(1)),
		             impl.get_id_for_value(instruction->getOperand(2)) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_dxil_std450_trinary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                                spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, opcode, impl.get_id_for_value(instruction->getOperand(1)),
	                 impl.get_id_for_value(instruction->getOperand(2)),
	                 impl.get_id_for_value(instruction->getOperand(3)) };

	ops.push_back(std::move(op));
	return true;
}

template <GLSLstd450 opcode>
static bool std450_trinary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::CallInst *instruction)
{
	return emit_dxil_std450_trinary_instruction(opcode, ops, impl, builder, instruction);
}

template <GLSLstd450 opcode>
static bool std450_binary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	return emit_dxil_std450_binary_instruction(opcode, ops, impl, builder, instruction);
}

template <GLSLstd450 opcode>
static bool std450_unary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	return emit_dxil_std450_unary_instruction(opcode, ops, impl, builder, instruction);
}

template <spv::Op opcode>
static bool unary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::CallInst *instruction)
{
	return emit_dxil_unary_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_dot_instruction(unsigned dimensions,
                                 std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	Operation op;
	op.op = spv::OpDot;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	spv::Id vec0_args[4] = {};
	spv::Id vec1_args[4] = {};
	for (unsigned i = 0; i < dimensions; i++)
		vec0_args[i] = impl.get_id_for_value(instruction->getOperand(1 + i));
	for (unsigned i = 0; i < dimensions; i++)
		vec1_args[i] = impl.get_id_for_value(instruction->getOperand(1 + i + dimensions));

	spv::Id vec0 = impl.build_vector(ops, op.type_id, vec0_args, dimensions);
	spv::Id vec1 = impl.build_vector(ops, op.type_id, vec1_args, dimensions);

	op.arguments = { vec0, vec1 };
	ops.push_back(std::move(op));
	return true;
}

template <unsigned Dim>
static bool emit_dot_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CallInst *instruction)
{
	return emit_dot_instruction(Dim, ops, impl, builder, instruction);
}

static spv::Id mask_input(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                          const llvm::Value *value)
{
	spv::Id id = impl.allocate_id();

	Operation op;
	op.op = spv::OpBitwiseAnd;
	op.id = id;
	op.type_id = impl.get_type_id(value->getType());
	op.arguments = {
		impl.get_id_for_value(value),
		builder.makeUintConstant(31),
	};

	ops.push_back(std::move(op));
	return id;
}

static bool emit_bfe_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	// SPIR-V spec doesn't say anything about masking inputs, but Ibfe/Ubfe do, so ...
	spv::Id masked_width_id = mask_input(ops, impl, builder, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(ops, impl, builder, instruction->getOperand(2));

	Operation op;
	op.op = opcode;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.get_id_for_value(instruction->getOperand(3)), masked_offset_id, masked_width_id };
	ops.push_back(std::move(op));
	return true;
}

template <spv::Op opcode>
static bool emit_bfe_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CallInst *instruction)
{
	return emit_bfe_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_bfi_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	spv::Id masked_width_id = mask_input(ops, impl, builder, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(ops, impl, builder, instruction->getOperand(2));
	spv::Id src_id = impl.get_id_for_value(instruction->getOperand(3));
	spv::Id dst_id = impl.get_id_for_value(instruction->getOperand(4));

	Operation op;
	op.op = spv::OpBitFieldInsert;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { dst_id, src_id, masked_offset_id, masked_width_id };
	ops.push_back(std::move(op));

	return true;
}

struct DXILDispatcher
{
#define OP(x) builder_lut[unsigned(DXIL::Op::x)]
	DXILDispatcher() noexcept
	{
		// Work around lack of designated initializers in C++.

		OP(LoadInput) = emit_load_input_instruction;
		OP(StoreOutput) = emit_store_output_instruction;
		OP(CreateHandle) = emit_create_handle_instruction;
		OP(CBufferLoadLegacy) = emit_cbuffer_load_legacy_instruction;

		OP(Saturate) = emit_saturate_instruction;

		OP(Sample) = emit_sample_instruction_dispatch<DXIL::Op::Sample>;
		OP(SampleBias) = emit_sample_instruction_dispatch<DXIL::Op::SampleBias>;
		OP(SampleLevel) = emit_sample_instruction_dispatch<DXIL::Op::SampleLevel>;
		OP(SampleCmp) = emit_sample_instruction_dispatch<DXIL::Op::SampleCmp>;
		OP(SampleCmpLevelZero) = emit_sample_instruction_dispatch<DXIL::Op::SampleCmpLevelZero>;
		OP(SampleGrad) = emit_sample_grad_instruction;
		OP(TextureLoad) = emit_texture_load_instruction;
		OP(TextureStore) = emit_texture_store_instruction;
		OP(BufferLoad) = emit_buffer_load_instruction;
		OP(BufferStore) = emit_buffer_store_instruction;

		OP(FMin) = std450_binary_dispatch<GLSLstd450NMin>;
		OP(FMax) = std450_binary_dispatch<GLSLstd450NMax>;
		OP(IMin) = std450_binary_dispatch<GLSLstd450SMin>;
		OP(IMax) = std450_binary_dispatch<GLSLstd450SMax>;
		OP(UMin) = std450_binary_dispatch<GLSLstd450UMin>;
		OP(UMax) = std450_binary_dispatch<GLSLstd450UMax>;
		OP(IsNan) = unary_dispatch<spv::OpIsNan>;
		OP(IsInf) = unary_dispatch<spv::OpIsInf>;
		OP(IsFinite) = emit_isfinite_instruction;

		OP(Cos) = std450_unary_dispatch<GLSLstd450Cos>;
		OP(Sin) = std450_unary_dispatch<GLSLstd450Sin>;
		OP(Tan) = std450_unary_dispatch<GLSLstd450Tan>;
		OP(Acos) = std450_unary_dispatch<GLSLstd450Acos>;
		OP(Asin) = std450_unary_dispatch<GLSLstd450Asin>;
		OP(Atan) = std450_unary_dispatch<GLSLstd450Atan>;
		OP(Hcos) = std450_unary_dispatch<GLSLstd450Cosh>;
		OP(Hsin) = std450_unary_dispatch<GLSLstd450Sinh>;
		OP(Htan) = std450_unary_dispatch<GLSLstd450Tanh>;
		OP(Exp) = std450_unary_dispatch<GLSLstd450Exp2>;
		OP(Log) = std450_unary_dispatch<GLSLstd450Log2>;

		OP(Rsqrt) = std450_unary_dispatch<GLSLstd450InverseSqrt>;
		OP(Sqrt) = std450_unary_dispatch<GLSLstd450Sqrt>;
		OP(FAbs) = std450_unary_dispatch<GLSLstd450FAbs>;
		OP(Frc) = std450_unary_dispatch<GLSLstd450Fract>;

		OP(Round_ne) = std450_unary_dispatch<GLSLstd450RoundEven>;
		OP(Round_ni) = std450_unary_dispatch<GLSLstd450Floor>;
		OP(Round_pi) = std450_unary_dispatch<GLSLstd450Ceil>;
		OP(Round_z) = std450_unary_dispatch<GLSLstd450Trunc>;

		OP(Bfrev) = unary_dispatch<spv::OpBitReverse>;
		OP(Countbits) = unary_dispatch<spv::OpBitCount>;
		OP(FirstbitLo) = std450_unary_dispatch<GLSLstd450FindILsb>;
		OP(FirstbitSHi) = emit_find_high_bit_dispatch<GLSLstd450FindSMsb>;
		OP(FirstbitHi) = emit_find_high_bit_dispatch<GLSLstd450FindUMsb>;

		OP(Dot2) = emit_dot_dispatch<2>;
		OP(Dot3) = emit_dot_dispatch<3>;
		OP(Dot4) = emit_dot_dispatch<4>;

		OP(Fma) = std450_trinary_dispatch<GLSLstd450Fma>;
		OP(FMad) = emit_fmad_instruction;
		OP(IMad) = emit_imad_instruction;
		OP(UMad) = emit_imad_instruction;

		// FIXME: Untested. Not sure how to trick dxc to generate these.
		OP(Ibfe) = emit_bfe_dispatch<spv::OpBitFieldSExtract>;
		OP(Ubfe) = emit_bfe_dispatch<spv::OpBitFieldUExtract>;
		OP(Bfi) = emit_bfi_instruction;
	}

#undef OP

	DXILOperationBuilder builder_lut[unsigned(DXIL::Op::Count)] = {};
};

// Sets up LUT once.
static DXILDispatcher global_dispatcher;

bool emit_dxil_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::CallInst *instruction)
{
	// The opcode is encoded as a constant integer.
	uint32_t opcode;
	if (!get_constant_operand(instruction, 0, &opcode))
		return false;

	if (opcode >= unsigned(DXIL::Op::Count))
	{
		LOGE("DXIL opcode %u is out of range.\n", opcode);
		return false;
	}

	if (global_dispatcher.builder_lut[opcode] == nullptr)
	{
		LOGE("Unimplemented DXIL opcode %u\n", opcode);
		return false;
	}

	return global_dispatcher.builder_lut[opcode](ops, impl, builder, instruction);
}
} // namespace DXIL2SPIRV
