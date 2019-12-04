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

#include "dxil_sampling.hpp"
#include "opcodes/converter_impl.hpp"
#include "logging.hpp"

namespace DXIL2SPIRV
{
bool get_image_dimensions_query_size(Converter::Impl &impl, spv::Builder &builder, spv::Id image_id, uint32_t *num_coords)
{
	spv::Id image_type_id = impl.get_type_id(image_id);
	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool is_array = builder.isArrayedImageType(image_type_id);

	switch (dim)
	{
	case spv::Dim1D:
	case spv::DimBuffer:
		*num_coords = 1;
		break;

	case spv::Dim2D:
	case spv::DimCube:
		*num_coords = 2;
		break;

	case spv::Dim3D:
		*num_coords = 3;
		break;

	default:
		LOGE("Unexpected sample dimensionality.\n");
		return false;
	}

	if (is_array)
		(*num_coords)++;

	return true;
}

bool get_image_dimensions(Converter::Impl &impl, spv::Builder &builder, spv::Id image_id, uint32_t *num_coords,
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

bool emit_sample_instruction(DXIL::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                             spv::Builder &builder, const llvm::CallInst *instruction)
{
	bool comparison_sampling = opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleCmpLevelZero;

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, comparison_sampling);
	const auto &meta = impl.handle_to_resource_meta[image_id];

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

	op.type_id = impl.get_type_id(meta.component_type, 1, comparison_sampling ? 1 : 4);
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

	// Deal with signed component types.
	impl.fixup_load_sign(ops, meta.component_type, 4, instruction);

	return true;
}

bool emit_sample_grad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, false);
	const auto &meta = impl.handle_to_resource_meta[image_id];

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
	op.type_id = impl.get_type_id(meta.component_type, 1, 4);

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

	// Deal with signed component types.
	impl.fixup_load_sign(ops, meta.component_type, 4, instruction);
	return true;
}

bool emit_texture_load_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);
	const auto &meta = impl.handle_to_resource_meta[image_id];

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
	op.type_id = impl.get_type_id(meta.component_type, 1, 4);

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

	// Deal with signed component types.
	impl.fixup_load_sign(ops, meta.component_type, 4, instruction);

	return true;
}

bool emit_get_dimensions_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                     const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);

	uint32_t num_coords = 0;
	if (!get_image_dimensions_query_size(impl, builder, image_id, &num_coords))
		return false;

	bool is_uav = builder.isStorageImageType(image_type_id);
	bool has_samples = builder.isMultisampledImageType(image_type_id);
	bool has_lod = !is_uav && builder.getTypeDimensionality(image_type_id) != spv::DimBuffer && !has_samples;

	spv::Id dimensions_id = impl.allocate_id();
	{
		Operation op;
		op.op = has_lod ? spv::OpImageQuerySizeLod : spv::OpImageQuerySize;
		op.type_id = builder.makeUintType(32);
		if (num_coords > 1)
			op.type_id = builder.makeVectorType(op.type_id, num_coords);
		op.arguments = { image_id };
		if (has_lod)
			op.arguments.push_back(impl.get_id_for_value(instruction->getOperand(2)));
		op.id = dimensions_id;
		ops.push_back(std::move(op));
	}

	if (impl.handle_to_resource_meta[image_id].kind == DXIL::ResourceKind::RawBuffer)
	{
		spv::Id byte_size_id = impl.allocate_id();
		Operation op;
		op.op = spv::OpIMul;
		op.id = byte_size_id;
		op.type_id = builder.makeUintType(32);
		op.arguments = { dimensions_id, builder.makeUintConstant(4) };
		dimensions_id = byte_size_id;
		ops.push_back(std::move(op));
	}

	spv::Id aux_id = 0;
	if (has_lod)
	{
		aux_id = impl.allocate_id();
		Operation op;
		op.op = spv::OpImageQueryLevels;
		op.id = aux_id;
		op.type_id = builder.makeUintType(32);
		op.arguments = { image_id };
		ops.push_back(std::move(op));
	}
	else if (has_samples)
	{
		aux_id = impl.allocate_id();
		Operation op;
		op.op = spv::OpImageQuerySamples;
		op.id = aux_id;
		op.type_id = builder.makeUintType(32);
		op.arguments = { image_id };
		ops.push_back(std::move(op));
	}

	if (!has_lod && !has_samples)
	{
		if (num_coords == 1)
		{
			// Must create a composite for good measure as calling code expects to extract component.
			Operation op;
			op.op = spv::OpCompositeConstruct;
			op.type_id = builder.makeVectorType(builder.makeUintType(32), 2);
			op.id = impl.get_id_for_value(instruction);
			op.arguments = { dimensions_id, builder.createUndefined(builder.makeUintType(32)) };
			ops.push_back(std::move(op));
		}
		else
			impl.value_map[instruction] = dimensions_id;
	}
	else
	{
		Operation op;
		op.op = spv::OpCompositeConstruct;
		op.type_id = builder.makeVectorType(builder.makeUintType(32), 4);
		op.id = impl.get_id_for_value(instruction);
		op.arguments.push_back(dimensions_id);

		// This element cannot be statically accessed if we don't have LOD, so don't bother returning anything here.
		// Otherwise, we need to pad out.
		for (unsigned i = num_coords; i < 3; i++)
			op.arguments.push_back(builder.createUndefined(builder.makeUintType(32)));
		op.arguments.push_back(aux_id);

		ops.push_back(std::move(op));
	}

	builder.addCapability(spv::CapabilityImageQuery);
	return true;
}

bool emit_texture_store_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
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
	op.arguments[2] = impl.fixup_store_sign(ops, meta.component_type, 4, op.arguments[2]);
	builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);

	ops.push_back(std::move(op));
	return true;
}

bool emit_texture_gather_instruction(bool compare, std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                     const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, false);
	const auto &meta = impl.handle_to_resource_meta[image_id];

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, builder, image_id, &num_coords_full, &num_coords))
		return false;

	spv::Id coords[3] = {};
	spv::Id offsets[2] = {};
	uint32_t image_flags = 0;

	for (unsigned i = 0; i < num_coords_full; i++)
		coords[i] = impl.get_id_for_value(instruction->getOperand(3 + i));
	spv::Id coord_id = impl.build_vector(ops, builder.makeFloatType(32), coords, num_coords_full);

	if (num_coords == 2)
	{
		for (unsigned i = 0; i < num_coords; i++)
		{
			auto *constant_int = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(7 + i));

			// DXC compiler seems to emit 0 offsets in weird cases where source did not do so.
			// just try to guard against this a bit to make output more as expected.
			if (constant_int && constant_int->getUniqueInteger().getSExtValue() != 0)
			{
				offsets[i] = builder.makeIntConstant(constant_int->getUniqueInteger().getSExtValue());
				image_flags |= spv::ImageOperandsConstOffsetMask;
			}
			else
				offsets[i] = builder.makeIntConstant(0);
		}
	}

	spv::Id aux_id;
	if (compare)
	{
		// TextureGatherCmp has a component here. Perhaps it is to select depth vs stencil?
		aux_id = impl.get_id_for_value(instruction->getOperand(10));
	}
	else
		aux_id = impl.get_id_for_value(instruction->getOperand(9));

	Operation op;
	op.op = compare ? spv::OpImageDrefGather : spv::OpImageGather;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(meta.component_type, 1, 4);
	op.arguments = { combined_image_sampler_id, coord_id, aux_id };

	if (image_flags)
	{
		op.arguments.push_back(image_flags);
		op.arguments.push_back(impl.build_constant_vector(ops, builder.makeIntType(32), offsets, num_coords));
	}

	ops.push_back(std::move(op));
	impl.fixup_load_sign(ops, meta.component_type, 4, instruction);
	return true;
}

}
