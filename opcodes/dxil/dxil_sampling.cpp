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

#include "dxil_sampling.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
bool get_image_dimensions_query_size(Converter::Impl &impl, spv::Builder &builder, spv::Id image_id,
                                     uint32_t *num_coords)
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

bool get_image_dimensions(Converter::Impl &impl, spv::Id image_id, uint32_t *num_coords, uint32_t *num_dimensions)
{
	auto &builder = impl.builder();
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

static bool get_texel_offsets(Converter::Impl &impl, const llvm::CallInst *instruction, uint32_t &image_flags,
                              unsigned base_operand, unsigned num_coords, spv::Id *offsets,
                              bool allow_non_const_offsets)
{
	auto &builder = impl.builder();

	bool is_const_offset = true;
	bool has_non_zero_offset = false;

	for (unsigned i = 0; i < num_coords; i++)
	{
		// Treat undefined offset as 0, since we can.
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(base_operand + i)))
		{
			auto *constant_arg = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(base_operand + i));
			if (constant_arg)
			{
				if (constant_arg->getUniqueInteger().getSExtValue() != 0)
					has_non_zero_offset = true;
			}
			else
			{
				if (!allow_non_const_offsets)
					return false;
				builder.addCapability(spv::CapabilityImageGatherExtended);
				is_const_offset = false;
				has_non_zero_offset = true;
				break;
			}
		}
	}

	// Don't bother emitting offset if they are all 0.
	if (!has_non_zero_offset)
		return true;

	if (is_const_offset)
		image_flags |= spv::ImageOperandsConstOffsetMask;
	else
		image_flags |= spv::ImageOperandsOffsetMask;

	for (unsigned i = 0; i < num_coords; i++)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(base_operand + i)))
		{
			auto operand = instruction->getOperand(base_operand + i);
			if (is_const_offset)
			{
				auto *constant_arg = llvm::dyn_cast<llvm::ConstantInt>(operand);
				offsets[i] = builder.makeIntConstant(int(constant_arg->getUniqueInteger().getSExtValue()));
			}
			else
			{
				// Makes sure when we build the array, it's the correct element type.
				auto *cast_op = impl.allocate(spv::OpBitcast, builder.makeIntegerType(32, true));
				impl.add(cast_op);
				cast_op->add_id(impl.get_id_for_value(operand));
				offsets[i] = cast_op->id;
			}
		}
		else
			offsets[i] = builder.makeIntConstant(0);
	}

	return true;
}

bool emit_sample_instruction(DXIL::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	bool comparison_sampling = opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleCmpLevelZero;

	// Elide dead loads.
	if (!comparison_sampling && !impl.composite_is_accessed(instruction))
		return true;

	auto &builder = impl.builder();

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(image_id, sampler_id, comparison_sampling);
	const auto &meta = impl.handle_to_resource_meta[image_id];

	unsigned num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
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
	if (!get_texel_offsets(impl, instruction, image_ops, 7, num_coords, offsets, false))
		return false;

	spv::Id dref_id = 0;

	if (opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleCmpLevelZero)
		dref_id = impl.get_id_for_value(instruction->getOperand(10));

	spv::Id bias_level_argument = 0;
	spv::Id min_lod_argument = 0;
	const unsigned bias_level_argument_index = 10;
	const unsigned min_lod_argument_index = opcode == DXIL::Op::Sample ? 10 : 11;

	auto &access_meta = impl.llvm_composite_meta[instruction];
	bool sparse = (access_meta.access_mask & (1u << 4)) != 0;
	if (sparse)
		builder.addCapability(spv::CapabilitySparseResidency);

	if (opcode == DXIL::Op::Sample || opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleBias)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(min_lod_argument_index)))
		{
			min_lod_argument = impl.get_id_for_value(instruction->getOperand(min_lod_argument_index));
			image_ops |= spv::ImageOperandsMinLodMask;
			builder.addCapability(spv::CapabilityMinLod);
		}
	}

	if (opcode == DXIL::Op::SampleBias || opcode == DXIL::Op::SampleLevel)
		bias_level_argument = impl.get_id_for_value(instruction->getOperand(bias_level_argument_index));
	else
		bias_level_argument = builder.makeFloatConstant(0.0f);

	spv::Op spv_op;

	switch (opcode)
	{
	case DXIL::Op::SampleLevel:
		spv_op = sparse ? spv::OpImageSparseSampleExplicitLod : spv::OpImageSampleExplicitLod;
		break;

	case DXIL::Op::Sample:
	case DXIL::Op::SampleBias:
		spv_op = sparse ? spv::OpImageSparseSampleImplicitLod : spv::OpImageSampleImplicitLod;
		break;

	case DXIL::Op::SampleCmp:
		spv_op = sparse ? spv::OpImageSparseSampleDrefImplicitLod : spv::OpImageSampleDrefImplicitLod;
		break;

	case DXIL::Op::SampleCmpLevelZero:
		spv_op = sparse ? spv::OpImageSparseSampleDrefExplicitLod : spv::OpImageSampleDrefExplicitLod;
		break;

	default:
		return false;
	}

	auto effective_component_type = Converter::Impl::get_effective_typed_resource_type(meta.component_type);
	spv::Id texel_type = impl.get_type_id(effective_component_type, 1, comparison_sampling ? 1 : 4);
	spv::Id sample_type;

	if (sparse)
		sample_type = impl.get_struct_type({ builder.makeUintType(32), texel_type }, "SparseTexel");
	else
		sample_type = texel_type;

	// Comparison sampling only returns a scalar, so we'll need to splat out result.
	Operation *op = impl.allocate(spv_op, instruction, sample_type);

	op->add_id(combined_image_sampler_id);
	op->add_id(impl.build_vector(builder.makeFloatType(32), coord, num_coords_full));

	if (dref_id)
		op->add_id(dref_id);

	op->add_literal(image_ops);

	if (image_ops & (spv::ImageOperandsBiasMask | spv::ImageOperandsLodMask))
		op->add_id(bias_level_argument);

	if (image_ops & spv::ImageOperandsConstOffsetMask)
		op->add_id(impl.build_constant_vector(builder.makeIntegerType(32, true), offsets, num_coords));

	if (image_ops & spv::ImageOperandsMinLodMask)
		op->add_id(min_lod_argument);

	impl.add(op);

	auto *target_type = instruction->getType()->getStructElementType(0);

	if (sparse)
	{
		// Repack return arguments from { i32, Tx4 } into { T, T, T, T, i32 } which DXIL expects.
		impl.repack_sparse_feedback(meta.component_type, comparison_sampling ? 1 : 4, instruction, target_type);
	}
	else if (comparison_sampling)
	{
		spv::Id loaded_id = op->id;
		auto tmp = meta.component_type;
		impl.fixup_load_type_typed(tmp, 1, loaded_id, target_type);
		Operation *splat_op =
			impl.allocate(spv::OpCompositeConstruct, builder.makeVectorType(impl.get_type_id(target_type), 4));
		splat_op->add_ids({ loaded_id, loaded_id, loaded_id, loaded_id });
		impl.add(splat_op);
		impl.rewrite_value(instruction, splat_op->id);
	}
	else
	{
		impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
	}

	return true;
}

bool emit_sample_grad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Elide dead loads.
	if (!impl.composite_is_accessed(instruction))
		return true;

	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(image_id, sampler_id, false);
	const auto &meta = impl.handle_to_resource_meta[image_id];

	unsigned num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
		return false;

	uint32_t image_ops = spv::ImageOperandsGradMask;

	spv::Id coord[4] = {};
	for (unsigned i = 0; i < num_coords_full; i++)
		coord[i] = impl.get_id_for_value(instruction->getOperand(i + 3));

	spv::Id offsets[3] = {};
	if (!get_texel_offsets(impl, instruction, image_ops, 7, num_coords, offsets, false))
		return false;

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

	auto &access_meta = impl.llvm_composite_meta[instruction];
	bool sparse = (access_meta.access_mask & (1u << 4)) != 0;
	if (sparse)
		builder.addCapability(spv::CapabilitySparseResidency);

	auto effective_component_type = Converter::Impl::get_effective_typed_resource_type(meta.component_type);
	spv::Id texel_type = impl.get_type_id(effective_component_type, 1, 4);
	spv::Id sample_type;

	if (sparse)
		sample_type = impl.get_struct_type({ builder.makeUintType(32), texel_type }, "SparseTexel");
	else
		sample_type = texel_type;

	Operation *op =
		impl.allocate(sparse ? spv::OpImageSparseSampleExplicitLod : spv::OpImageSampleExplicitLod,
		              instruction, sample_type);

	op->add_ids({
	    combined_image_sampler_id,
	    impl.build_vector(builder.makeFloatType(32), coord, num_coords_full),
	    image_ops,
	});

	if (image_ops & spv::ImageOperandsGradMask)
	{
		op->add_id(impl.build_vector(builder.makeFloatType(32), grad_x, num_coords));
		op->add_id(impl.build_vector(builder.makeFloatType(32), grad_y, num_coords));
	}

	if (image_ops & spv::ImageOperandsConstOffsetMask)
		op->add_id(impl.build_constant_vector(builder.makeIntegerType(32, true), offsets, num_coords));

	if (image_ops & spv::ImageOperandsMinLodMask)
		op->add_id(aux_argument);

	impl.add(op);

	auto *target_type = instruction->getType()->getStructElementType(0);

	if (sparse)
		impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
	else
		impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
	return true;
}

bool emit_texture_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Elide dead loads.
	if (!impl.composite_is_accessed(instruction))
		return true;

	auto &builder = impl.builder();
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

	unsigned num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
		return false;

	// Cubes are not supported here.
	if (num_coords_full > 3)
		return false;

	for (unsigned i = 0; i < num_coords_full; i++)
		coord[i] = impl.get_id_for_value(instruction->getOperand(i + 3));

	spv::Id offsets[3] = {};
	if (!get_texel_offsets(impl, instruction, image_ops, 6, num_coords, offsets, false))
		return false;

	auto &access_meta = impl.llvm_composite_meta[instruction];
	bool sparse = (access_meta.access_mask & (1u << 4)) != 0;
	if (sparse)
		builder.addCapability(spv::CapabilitySparseResidency);

	auto effective_component_type = Converter::Impl::get_effective_typed_resource_type(meta.component_type);
	spv::Id texel_type = impl.get_type_id(effective_component_type, 1, 4);
	spv::Id sample_type;

	if (sparse)
		sample_type = impl.get_struct_type({ builder.makeUintType(32), texel_type }, "SparseTexel");
	else
		sample_type = texel_type;

	spv::Op opcode;
	if (is_uav)
		opcode = sparse ? spv::OpImageSparseRead : spv::OpImageRead;
	else
		opcode = sparse ? spv::OpImageSparseFetch : spv::OpImageFetch;

	Operation *op = impl.allocate(opcode, instruction, sample_type);

	op->add_ids({ image_id, impl.build_vector(builder.makeUintType(32), coord, num_coords_full) });
	op->add_literal(image_ops);

	if (!is_uav)
	{
		if (image_ops & spv::ImageOperandsLodMask)
			op->add_id(mip_or_sample);

		if (image_ops & spv::ImageOperandsConstOffsetMask)
			op->add_id(impl.build_constant_vector(builder.makeIntegerType(32, true), offsets, num_coords));

		if (image_ops & spv::ImageOperandsSampleMask)
			op->add_id(mip_or_sample);
	}

	impl.add(op);

	auto *target_type = instruction->getType()->getStructElementType(0);

	if (sparse)
		impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
	else
		impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
	return true;
}

bool emit_get_dimensions_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (!impl.composite_is_accessed(instruction))
		return true;

	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);
	auto &meta = impl.handle_to_resource_meta[image_id];

	Operation *dimensions_op = nullptr;
	auto &access_meta = impl.llvm_composite_meta[instruction];
	uint32_t num_coords = 0;
	bool has_samples = false;
	bool has_lod = false;

	if (meta.storage == spv::StorageClassStorageBuffer)
	{
		if (meta.index_offset_id)
		{
			dimensions_op = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
			dimensions_op->add_id(meta.index_offset_id);
			dimensions_op->add_literal(1);
		}
		else
		{
			dimensions_op = impl.allocate(spv::OpArrayLength, builder.makeUintType(32));
			dimensions_op->add_id(meta.var_id_16bit ? meta.var_id_16bit : image_id);
			dimensions_op->add_literal(0);
		}
		impl.add(dimensions_op);
		num_coords = 1;
	}
	else if (meta.index_offset_id)
	{
		dimensions_op = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
		dimensions_op->add_id(meta.index_offset_id);
		dimensions_op->add_literal(1);
		impl.add(dimensions_op);
		num_coords = 1;
	}
	else
	{
		if (!get_image_dimensions_query_size(impl, builder, image_id, &num_coords))
			return false;

		bool is_uav = builder.isStorageImageType(image_type_id);
		has_samples = builder.isMultisampledImageType(image_type_id);
		has_lod = !is_uav && builder.getTypeDimensionality(image_type_id) != spv::DimBuffer && !has_samples;

		spv::Id dim_type_id = builder.makeUintType(32);
		if (num_coords > 1)
			dim_type_id = builder.makeVectorType(dim_type_id, num_coords);

		if ((access_meta.access_mask & 7) != 0)
		{
			dimensions_op = impl.allocate(has_lod ? spv::OpImageQuerySizeLod : spv::OpImageQuerySize, dim_type_id);
			dimensions_op->add_id(image_id);
			if (has_lod)
				dimensions_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
			impl.add(dimensions_op);
		}
		else
			num_coords = 0;
	}

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		Operation *byte_size_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		byte_size_op->add_ids({ dimensions_op->id, builder.makeUintConstant(4) });
		impl.add(byte_size_op);
		dimensions_op = byte_size_op;
	}
	else if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
	{
		Operation *elem_count_op = impl.allocate(spv::OpUDiv, builder.makeUintType(32));

		if (meta.index_offset_id != 0)
		{
			// If the offset buffer is pre-shifted, shift the divider as well.
			if (meta.var_id_16bit == 0)
				elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride / 4) });
			else
				elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride) });
		}
		else
		{
			// If we have a 16-bit buffer, we should use that as the basis for size computation.
			if (meta.var_id_16bit != 0)
				elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride / 2) });
			else
				elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride / 4) });
		}

		impl.add(elem_count_op);
		dimensions_op = elem_count_op;
	}

	Operation *aux_op = nullptr;
	if ((access_meta.access_mask & (1u << 3)) != 0)
	{
		if (has_lod)
		{
			aux_op = impl.allocate(spv::OpImageQueryLevels, builder.makeUintType(32));
			aux_op->add_id(image_id);
			impl.add(aux_op);
		}
		else if (has_samples)
		{
			aux_op = impl.allocate(spv::OpImageQuerySamples, builder.makeUintType(32));
			aux_op->add_id(image_id);
			impl.add(aux_op);
		}
	}

	assert(aux_op || dimensions_op);

	if (!aux_op && dimensions_op)
	{
		if (num_coords == 1)
			access_meta.forced_composite = false;
		impl.rewrite_value(instruction, dimensions_op->id);
	}
	else if (dimensions_op)
	{
		Operation *op =
		    impl.allocate(spv::OpCompositeConstruct, instruction, builder.makeVectorType(builder.makeUintType(32), 4));
		op->add_id(dimensions_op->id);

		// This element cannot be statically accessed if we don't have LOD, so don't bother returning anything here.
		// Otherwise, we need to pad out.
		for (unsigned i = num_coords; i < 3; i++)
			op->add_id(builder.createUndefined(builder.makeUintType(32)));
		op->add_id(aux_op->id);

		impl.add(op);
	}
	else
	{
		// Redirect any extract from this scalar to be preserved as-is.
		// Pretend this is a scalar even if Levels/Samples query is supposed to live in W.
		access_meta.forced_composite = false;
		access_meta.access_mask = 1;
		access_meta.components = 1;
		impl.rewrite_value(instruction, aux_op->id);
	}

	builder.addCapability(spv::CapabilityImageQuery);
	return true;
}

bool emit_texture_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	spv::Id coord[3] = {};

	unsigned num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
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

	Operation *op = impl.allocate(spv::OpImageWrite);

	op->add_id(image_id);
	op->add_id(impl.build_vector(builder.makeUintType(32), coord, num_coords_full));

	spv::Id store_id = impl.build_vector(impl.get_type_id(instruction->getOperand(5)->getType()), write_values, 4);
	store_id = impl.fixup_store_type_typed(meta.component_type, 4, store_id);
	op->add_id(store_id);
	builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);

	impl.add(op);
	return true;
}

bool emit_texture_gather_instruction(bool compare, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Elide dead loads.
	if (!impl.composite_is_accessed(instruction))
		return true;

	auto &builder = impl.builder();

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(image_id, sampler_id, false);
	const auto &meta = impl.handle_to_resource_meta[image_id];

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
		return false;

	spv::Id coords[4] = {};
	spv::Id offsets[2] = {};
	uint32_t image_flags = 0;

	for (unsigned i = 0; i < num_coords_full; i++)
		coords[i] = impl.get_id_for_value(instruction->getOperand(3 + i));
	spv::Id coord_id = impl.build_vector(builder.makeFloatType(32), coords, num_coords_full);

	if (num_coords == 2 && !get_texel_offsets(impl, instruction, image_flags, 7, num_coords, offsets, true))
		return false;

	spv::Id aux_id;
	if (compare)
	{
		// TextureGatherCmp has a component here. Perhaps it is to select depth vs stencil?
		aux_id = impl.get_id_for_value(instruction->getOperand(10));
	}
	else
		aux_id = impl.get_id_for_value(instruction->getOperand(9));

	auto &access_meta = impl.llvm_composite_meta[instruction];
	bool sparse = (access_meta.access_mask & (1u << 4)) != 0;
	if (sparse)
		builder.addCapability(spv::CapabilitySparseResidency);

	auto effective_component_type = Converter::Impl::get_effective_typed_resource_type(meta.component_type);
	spv::Id texel_type = impl.get_type_id(effective_component_type, 1, 4);
	spv::Id sample_type;

	if (sparse)
		sample_type = impl.get_struct_type({ builder.makeUintType(32), texel_type }, "SparseTexel");
	else
		sample_type = texel_type;

	spv::Op opcode;
	if (compare)
		opcode = sparse ? spv::OpImageSparseDrefGather : spv::OpImageDrefGather;
	else
		opcode = sparse ? spv::OpImageSparseGather : spv::OpImageGather;

	Operation *op = impl.allocate(opcode, instruction, sample_type);

	op->add_ids({ combined_image_sampler_id, coord_id, aux_id });

	if (image_flags)
	{
		op->add_literal(image_flags);
		if (image_flags & spv::ImageOperandsOffsetMask)
			op->add_id(impl.build_vector(builder.makeIntegerType(32, true), offsets, num_coords));
		else if (image_flags & spv::ImageOperandsConstOffsetMask)
			op->add_id(impl.build_constant_vector(builder.makeIntegerType(32, true), offsets, num_coords));
	}

	impl.add(op);

	auto *target_type = instruction->getType()->getStructElementType(0);

	if (sparse)
		impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
	else
		impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
	return true;
}

bool emit_calculate_lod_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id combined_image_sampler_id = impl.build_sampled_image(image_id, sampler_id, false);

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
		return false;

	spv::Id coords[3] = {};
	for (unsigned i = 0; i < num_coords; i++)
		coords[i] = impl.get_id_for_value(instruction->getOperand(3 + i));

	auto *clamped_value = llvm::cast<llvm::ConstantInt>(instruction->getOperand(6));
	bool clamped = clamped_value->getUniqueInteger().getZExtValue() != 0;

	Operation *query_op = impl.allocate(spv::OpImageQueryLod, builder.makeVectorType(builder.makeFloatType(32), 2));
	query_op->add_ids({ combined_image_sampler_id, impl.build_vector(builder.makeFloatType(32), coords, num_coords) });
	impl.add(query_op);

	Operation *op = impl.allocate(spv::OpCompositeExtract, instruction);
	op->add_id(query_op->id);
	op->add_literal(clamped ? 0u : 1u);
	impl.add(op);

	builder.addCapability(spv::CapabilityImageQuery);
	return true;
}

static void build_sample_position_lut(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	// Standard sample locations from the Vulkan spec.
	static const float standard_sample_positions[][2] = {
		// 1 sample
		{ 0.0 / 16.0, 0.0 / 16.0 },
		// 2 samples
		{ 4.0 / 16.0, 4.0 / 16.0 },
		{ -4.0 / 16.0, -4.0 / 16.0 },
		// 4 samples
		{ -2.0 / 16.0, -6.0 / 16.0 },
		{ 6.0 / 16.0, -2.0 / 16.0 },
		{ -6.0 / 16.0, 2.0 / 16.0 },
		{ 2.0 / 16.0, 6.0 / 16.0 },
		// 8 samples
		{ 1.0 / 16.0, -3.0 / 16.0 },
		{ -1.0 / 16.0, 3.0 / 16.0 },
		{ 5.0 / 16.0, 1.0 / 16.0 },
		{ -3.0 / 16.0, -5.0 / 16.0 },
		{ -5.0 / 16.0, 5.0 / 16.0 },
		{ -7.0 / 16.0, -1.0 / 16.0 },
		{ 3.0 / 16.0, 7.0 / 16.0 },
		{ 7.0 / 16.0, -7.0 / 16.0 },
		// 16 samples
		{ 1.0 / 16.0, 1.0 / 16.0 },
		{ -1.0 / 16.0, -3.0 / 16.0 },
		{ -3.0 / 16.0, 2.0 / 16.0 },
		{ 4.0 / 16.0, -1.0 / 16.0 },
		{ -5.0 / 16.0, -2.0 / 16.0 },
		{ 2.0 / 16.0, 5.0 / 16.0 },
		{ 5.0 / 16.0, 3.0 / 16.0 },
		{ 3.0 / 16.0, -5.0 / 16.0 },
		{ -2.0 / 16.0, 6.0 / 16.0 },
		{ 0.0 / 16.0, -7.0 / 16.0 },
		{ -4.0 / 16.0, -6.0 / 16.0 },
		{ -6.0 / 16.0, 4.0 / 16.0 },
		{ -8.0 / 16.0, 0.0 / 16.0 },
		{ 7.0 / 16.0, -4.0 / 16.0 },
		{ 6.0 / 16.0, 7.0 / 16.0 },
		{ -7.0 / 16.0, -8.0 / 16.0 },
	};

	if (!impl.texture_sample_pos_lut_id)
	{
		spv::Id vec2_type = builder.makeVectorType(builder.makeFloatType(32), 2);

		constexpr size_t num_pos = sizeof(standard_sample_positions) / sizeof(standard_sample_positions[0]);
		Vector<spv::Id> constituents(num_pos);
		for (size_t i = 0; i < num_pos; i++)
		{
			spv::Id elems[2];
			for (unsigned j = 0; j < 2; j++)
				elems[j] = builder.makeFloatConstant(standard_sample_positions[i][j]);
			constituents[i] = impl.build_constant_vector(builder.makeFloatType(32), elems, 2);
		}

		spv::Id array_type = builder.makeArrayType(vec2_type, builder.makeUintConstant(num_pos), 0);
		spv::Id lut_id = builder.makeCompositeConstant(array_type, constituents);
		impl.texture_sample_pos_lut_id = impl.create_variable_with_initializer(spv::StorageClassPrivate, array_type,
		                                                                       lut_id, "Texture2DMSSamplePositionLUT");
	}
}

static spv::Id build_rasterizer_sample_count(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	if (!impl.rasterizer_sample_count_id)
	{
		if (impl.options.rasterizer_sample_count_spec_constant)
		{
			impl.rasterizer_sample_count_id = builder.makeUintConstant(1, true);
			builder.addDecoration(impl.rasterizer_sample_count_id, spv::DecorationSpecId,
			                      impl.options.rasterizer_sample_count);
		}
		else
			impl.rasterizer_sample_count_id = builder.makeUintConstant(impl.options.rasterizer_sample_count, false);
	}
	return impl.rasterizer_sample_count_id;
}

bool emit_get_render_target_sample_count(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	impl.rewrite_value(instruction, build_rasterizer_sample_count(impl));
	return true;
}

bool emit_check_access_fully_mapped_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilitySparseResidency);
	auto *op = impl.allocate(spv::OpImageSparseTexelsResident, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);
	return true;
}

bool emit_get_sample_position(Converter::Impl &impl, const llvm::CallInst *instruction, bool image)
{
	auto &builder = impl.builder();

	spv::Id sample_count_id;
	if (image)
	{
		spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));

		auto *query_samples_op = impl.allocate(spv::OpImageQuerySamples, builder.makeUintType(32));
		query_samples_op->add_id(image_id);
		impl.add(query_samples_op);
		sample_count_id = query_samples_op->id;
	}
	else
	{
		sample_count_id = build_rasterizer_sample_count(impl);
	}

	spv::Id sample_index_id = impl.get_id_for_value(instruction->getOperand(image ? 2 : 1));

	// Build the LUT if we have to.
	build_sample_position_lut(impl);

	// Sample count is only POT, so table starts at N - 1.
	auto *lut_base_offset_op = impl.allocate(spv::OpISub, builder.makeUintType(32));
	lut_base_offset_op->add_ids({ sample_count_id, builder.makeUintConstant(1) });
	impl.add(lut_base_offset_op);

	// Build LUT offset.
	auto *lut_offset_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
	lut_offset_op->add_ids({ lut_base_offset_op->id, sample_index_id });
	impl.add(lut_offset_op);

	// Range check sample index against actual texture.
	auto *cmp0_op = impl.allocate(spv::OpULessThan, builder.makeBoolType());
	cmp0_op->add_ids({ sample_index_id, sample_count_id });
	impl.add(cmp0_op);

	// Range check sample index against max supported 16.
	auto *cmp1_op = impl.allocate(spv::OpULessThanEqual, builder.makeBoolType());
	cmp1_op->add_ids({ sample_count_id, builder.makeUintConstant(16) });
	impl.add(cmp1_op);

	auto *cmp_op = impl.allocate(spv::OpLogicalAnd, builder.makeBoolType());
	cmp_op->add_ids({ cmp0_op->id, cmp1_op->id });
	impl.add(cmp_op);

	auto *final_lut_index_op = impl.allocate(spv::OpSelect, builder.makeUintType(32));
	final_lut_index_op->add_ids({ cmp_op->id, lut_offset_op->id, builder.makeUintConstant(0) });
	impl.add(final_lut_index_op);

	spv::Id vec2_type = builder.makeVectorType(builder.makeFloatType(32), 2);

	auto *chain_op = impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassPrivate, vec2_type));
	chain_op->add_ids({ impl.texture_sample_pos_lut_id, final_lut_index_op->id });
	impl.add(chain_op);

	auto *load_op = impl.allocate(spv::OpLoad, instruction, vec2_type);
	load_op->add_id(chain_op->id);
	impl.add(load_op);

	builder.addCapability(spv::CapabilityImageQuery);
	return true;
}
} // namespace dxil_spv
