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

#include "dxil_sampling.hpp"
#include "dxil_common.hpp"
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

static spv::Id build_texel_offset_vector(Converter::Impl &impl,
                                         const spv::Id *offsets, unsigned num_coords,
                                         uint32_t image_ops, bool is_gather_instruction)
{
	auto &builder = impl.builder();

	spv::Id int_type = builder.makeIntegerType(32, true);
	spv::Id offset_vec;

	if (image_ops & spv::ImageOperandsConstOffsetMask)
		offset_vec = impl.build_constant_vector(int_type, offsets, num_coords);
	else
		offset_vec = impl.build_vector(int_type, offsets, num_coords);

	// Gather has a larger range for offsets,
	// and we shouldn't try to mask anything.
	if ((image_ops & spv::ImageOperandsOffsetMask) && !is_gather_instruction)
	{
		// SM 6.7 requires signed int wrap for the dynamic offset within range.
		spv::Id ivec_type = impl.build_vector_type(int_type, num_coords);
		auto *bfe = impl.allocate(spv::OpBitFieldSExtract, ivec_type);
		bfe->add_id(offset_vec);
		bfe->add_id(builder.makeIntConstant(0));
		bfe->add_id(builder.makeIntConstant(4));
		impl.add(bfe);
		offset_vec = bfe->id;
	}

	return offset_vec;
}

static bool get_texel_offsets(Converter::Impl &impl, const llvm::CallInst *instruction, uint32_t &image_flags,
                              unsigned base_operand, unsigned num_coords, spv::Id *offsets,
                              bool instruction_is_gather)
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
				// Currently, non-constant offsets are only allowed for gather.
				// SM 6.7 adds support for non-constant offsets in general.
				// We'll just pretend this works for now for testing purposes.
				// Later, we might have to add a different cap bit.
				if (instruction_is_gather)
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
	bool comparison_sampling = opcode == DXIL::Op::SampleCmp ||
	                           opcode == DXIL::Op::SampleCmpLevelZero ||
	                           opcode == DXIL::Op::SampleCmpLevel;

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

	if (opcode == DXIL::Op::SampleLevel || opcode == DXIL::Op::SampleCmpLevelZero || opcode == DXIL::Op::SampleCmpLevel)
		image_ops |= spv::ImageOperandsLodMask;
	else if (opcode == DXIL::Op::SampleBias)
		image_ops |= spv::ImageOperandsBiasMask;

	spv::Id offsets[3] = {};
	if (!get_texel_offsets(impl, instruction, image_ops, 7, num_coords, offsets, false))
		return false;

	spv::Id dref_id = 0;

	if (comparison_sampling)
		dref_id = impl.get_id_for_value(instruction->getOperand(10));

	spv::Id bias_level_argument = 0;
	spv::Id min_lod_argument = 0;
	const unsigned bias_level_argument_index = comparison_sampling ? 11 : 10;
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

	if (opcode == DXIL::Op::SampleBias || opcode == DXIL::Op::SampleLevel || opcode == DXIL::Op::SampleCmpLevel)
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

	case DXIL::Op::SampleCmpLevel:
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

	if (!sparse)
		impl.decorate_relaxed_precision(instruction->getType()->getStructElementType(0), op->id, true);

	op->add_id(combined_image_sampler_id);
	op->add_id(impl.build_vector(builder.makeFloatType(32), coord, num_coords_full));

	if (dref_id)
		op->add_id(dref_id);

	op->add_literal(image_ops);

	if (image_ops & (spv::ImageOperandsBiasMask | spv::ImageOperandsLodMask))
		op->add_id(bias_level_argument);

	if (image_ops & (spv::ImageOperandsConstOffsetMask | spv::ImageOperandsOffsetMask))
	{
		spv::Id offset_vec = build_texel_offset_vector(impl, offsets, num_coords, image_ops, false);
		op->add_id(offset_vec);
	}

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

	build_exploded_composite_from_vector(impl, instruction, 4);

	return true;
}

static bool binary_op_is_multiple_of_derivative(const llvm::Value *grad_value, const llvm::Value *coord_value,
                                                DXIL::Op candidate_coarse_op, DXIL::Op candidate_fine_op,
                                                const llvm::Value *&multiple)
{
	const auto *bin_op = llvm::dyn_cast<llvm::BinaryOperator>(grad_value);
	if (!bin_op)
		return false;

	if (bin_op->getOpcode() != llvm::BinaryOperator::BinaryOps::FMul)
		return false;

	// Play fast and loose if we can :3
	if (!bin_op->isFast())
		return false;

	auto *a = bin_op->getOperand(0);
	auto *b = bin_op->getOperand(1);

	if ((value_is_dx_op_instrinsic(a, candidate_coarse_op) ||
	     value_is_dx_op_instrinsic(a, candidate_fine_op)))
	{
		if (llvm::cast<llvm::CallInst>(a)->getOperand(1) == coord_value)
		{
			multiple = b;
			return true;
		}
	}
	else if ((value_is_dx_op_instrinsic(b, candidate_coarse_op) ||
	          value_is_dx_op_instrinsic(b, candidate_fine_op)))
	{
		if (llvm::cast<llvm::CallInst>(b)->getOperand(1) == coord_value)
		{
			multiple = a;
			return true;
		}
	}

	return false;
}

static spv::Id sample_grad_is_lod_bias(Converter::Impl &impl, const llvm::CallInst *instruction, unsigned num_coords)
{
	if (!impl.current_block)
		return 0;

	if (!impl.options.grad_opt.enabled)
		return 0;

	const llvm::Value *mult_grad_x[3] = {};
	const llvm::Value *mult_grad_y[3] = {};

	for (unsigned i = 0; i < num_coords; i++)
	{
		auto *coord = instruction->getOperand(i + 3);

		// Don't bother trying to fiddle with constant expressions.
		// All derivatives are expected to constant-fold.
		if (llvm::isa<llvm::Constant>(coord))
			return 0;

		auto *grad_x = instruction->getOperand(i + 10);
		auto *grad_y = instruction->getOperand(i + 13);

		// Gradients must have been computed in this block,
		// otherwise we might introduce bugs with helper lanes being deactivated,
		// since this that scenario is the primary use case for grad in the first place ...
		spv::Id grad_x_id = impl.get_id_for_value(grad_x);
		spv::Id grad_y_id = impl.get_id_for_value(grad_y);
		if (!grad_x_id || !grad_y_id)
			return 0;

		for (auto &op : *impl.current_block)
		{
			if (op->id == grad_x_id)
				grad_x_id = 0;
			if (op->id == grad_y_id)
				grad_y_id = 0;
		}

		if (grad_x_id || grad_y_id)
			return 0;

		if (!binary_op_is_multiple_of_derivative(grad_x, coord, DXIL::Op::DerivCoarseX, DXIL::Op::DerivFineX, mult_grad_x[i]) ||
		    !binary_op_is_multiple_of_derivative(grad_y, coord, DXIL::Op::DerivCoarseY, DXIL::Op::DerivFineY, mult_grad_y[i]))
			return 0;
	}

	for (unsigned i = 0; i < num_coords; i++)
	{
		if (!mult_grad_x[i] || !mult_grad_y[i])
			return 0;

		if (i > 0)
		{
			if (mult_grad_x[i] != mult_grad_x[0])
				return 0;
			if (mult_grad_y[i] != mult_grad_y[0])
				return 0;
		}
	}

	// We can only apply uniform scale with textureBias, unless we have app-opt.
	if (mult_grad_x[0] != mult_grad_y[0] && !impl.options.grad_opt.assume_uniform_scale)
		return 0;

	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	spv::Id min_value_id;

	spv::Id fp32_type = builder.makeFloatType(32);

	Operation *abs_x_op = impl.allocate(spv::OpExtInst, fp32_type);
	abs_x_op->add_id(impl.glsl_std450_ext);
	abs_x_op->add_literal(GLSLstd450FAbs);
	abs_x_op->add_id(impl.get_id_for_value(mult_grad_x[0]));
	impl.add(abs_x_op);

	if (mult_grad_x[0] != mult_grad_y[0])
	{
		Operation *abs_y_op = impl.allocate(spv::OpExtInst, fp32_type);
		abs_y_op->add_id(impl.glsl_std450_ext);
		abs_y_op->add_literal(GLSLstd450FAbs);
		abs_y_op->add_id(impl.get_id_for_value(mult_grad_y[0]));
		impl.add(abs_y_op);

		Operation *min_op = impl.allocate(spv::OpExtInst, fp32_type);
		min_op->add_id(impl.glsl_std450_ext);
		min_op->add_literal(GLSLstd450FMin);
		min_op->add_id(abs_x_op->id);
		min_op->add_id(abs_y_op->id);

		impl.add(min_op);
		min_value_id = min_op->id;
	}
	else
	{
		min_value_id = abs_x_op->id;
	}

	Operation *op = impl.allocate(spv::OpExtInst, fp32_type);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450Log2);
	op->add_id(min_value_id);
	impl.add(op);

	return op->id;
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

	spv::Id bias_id = sample_grad_is_lod_bias(impl, instruction, num_coords);

	spv::Id grad_x[3] = {};
	spv::Id grad_y[3] = {};

	if (bias_id)
	{
		image_ops = spv::ImageOperandsBiasMask;
	}
	else
	{
		for (unsigned i = 0; i < num_coords; i++)
			grad_x[i] = impl.get_id_for_value(instruction->getOperand(i + 10));
		for (unsigned i = 0; i < num_coords; i++)
			grad_y[i] = impl.get_id_for_value(instruction->getOperand(i + 13));
	}

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

	spv::Op opcode;
	if (bias_id)
		opcode = sparse ? spv::OpImageSparseSampleImplicitLod : spv::OpImageSampleImplicitLod;
	else
		opcode = sparse ? spv::OpImageSparseSampleExplicitLod : spv::OpImageSampleExplicitLod;

	Operation *op = impl.allocate(opcode, instruction, sample_type);

	if (!sparse)
		impl.decorate_relaxed_precision(instruction->getType()->getStructElementType(0), op->id, true);

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
	else if (image_ops & spv::ImageOperandsBiasMask)
		op->add_id(bias_id);

	if (image_ops & (spv::ImageOperandsConstOffsetMask | spv::ImageOperandsOffsetMask))
		op->add_id(build_texel_offset_vector(impl, offsets, num_coords, image_ops, false));

	if (image_ops & spv::ImageOperandsMinLodMask)
		op->add_id(aux_argument);

	impl.add(op);

	auto *target_type = instruction->getType()->getStructElementType(0);

	if (sparse)
		impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
	else
	{
		impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
		build_exploded_composite_from_vector(impl, instruction, 4);
	}
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

	spv::Id offsets[4] = {};
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
	if (!sparse)
		impl.decorate_relaxed_precision(instruction->getType()->getStructElementType(0), op->id, true);

	spv::Id coord_id = impl.build_vector(builder.makeUintType(32), coord, num_coords_full);
	if (!is_uav && (image_ops & spv::ImageOperandsOffsetMask))
	{
		// Don't need fancy features for fetch, just do arith.
		for (unsigned i = num_coords; i < num_coords_full; i++)
			offsets[i] = builder.makeIntConstant(0);
		auto *add_op = impl.allocate(spv::OpIAdd, impl.build_vector_type(builder.makeIntType(32), num_coords_full));
		add_op->add_id(coord_id);
		add_op->add_id(build_texel_offset_vector(impl, offsets, num_coords_full, image_ops, false));
		impl.add(add_op);
		coord_id = add_op->id;
		image_ops &= ~spv::ImageOperandsOffsetMask;
	}

	op->add_ids({ image_id, coord_id });
	op->add_literal(image_ops);

	if (!is_uav)
	{
		if (image_ops & spv::ImageOperandsLodMask)
			op->add_id(mip_or_sample);

		if (image_ops & spv::ImageOperandsConstOffsetMask)
			op->add_id(build_texel_offset_vector(impl, offsets, num_coords, image_ops, false));
	}

	if (image_ops & spv::ImageOperandsSampleMask)
	{
		op->add_id(mip_or_sample);
		if (is_uav)
			impl.builder().addCapability(spv::CapabilityStorageImageMultisample);
	}

	impl.add(op, meta.rov);

	auto *target_type = instruction->getType()->getStructElementType(0);

	if (sparse)
		impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
	else
	{
		impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
		build_exploded_composite_from_vector(impl, instruction, 4);
	}
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

	uint32_t ssbo_element_size = 4;

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
			dimensions_op->add_id(image_id);
			dimensions_op->add_literal(0);
		}

		ssbo_element_size = raw_vecsize_to_vecsize(meta.raw_component_vecsize) *
		                    raw_component_type_to_bits(meta.component_type) / 8;

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
		byte_size_op->add_ids({ dimensions_op->id, builder.makeUintConstant(ssbo_element_size) });
		impl.add(byte_size_op);
		dimensions_op = byte_size_op;
	}
	else if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
	{
		Operation *elem_count_op = impl.allocate(spv::OpUDiv, builder.makeUintType(32));

		if (meta.index_offset_id != 0)
		{
			// If the offset buffer is pre-shifted, shift the divider as well.
			if (!meta.aliased)
				elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride / ssbo_element_size) });
			else
				elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride) });
		}
		else
			elem_count_op->add_ids({ dimensions_op->id, builder.makeUintConstant(meta.stride / ssbo_element_size) });

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

bool emit_texture_store_instruction_dispatch(Converter::Impl &impl, const llvm::CallInst *instruction, bool multi_sampled)
{
	auto &builder = impl.builder();

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));

	// Deferred 64-bit atomic. Resolve in a later AGS atomic.
	if (impl.ags.phases == 2 && impl.ags.backdoor_instructions[0] == instruction->getOperand(2) && !multi_sampled)
	{
		impl.ags.active_uav_ptr = image_id;
		impl.ags.active_uav_op = DXIL::Op::TextureStore;
		return true;
	}

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

	if (multi_sampled)
	{
		spv::Id sample_id = impl.get_id_for_value(instruction->getOperand(10));
		op->add_literal(spv::ImageOperandsSampleMask);
		op->add_id(sample_id);
		builder.addCapability(spv::CapabilityStorageImageMultisample);
	}

	impl.add(op, meta.rov);
	return true;
}

bool emit_texture_gather_instruction(bool compare, bool raw, Converter::Impl &impl, const llvm::CallInst *instruction)
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

	if (!raw)
	{
		if (compare)
		{
			// TextureGatherCmp has a component here. Perhaps it is to select depth vs stencil?
			aux_id = impl.get_id_for_value(instruction->getOperand(10));
		}
		else
			aux_id = impl.get_id_for_value(instruction->getOperand(9));
	}
	else
		aux_id = builder.makeUintConstant(0);

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

	bool raw_gather64 = raw && instruction->getType()->getStructElementType(0)->getIntegerBitWidth() == 64;

	spv::Op opcode;
	if (compare)
		opcode = sparse ? spv::OpImageSparseDrefGather : spv::OpImageDrefGather;
	else
		opcode = sparse ? spv::OpImageSparseGather : spv::OpImageGather;

	Operation *op = impl.allocate(opcode, instruction, sample_type);
	if (!sparse)
		impl.decorate_relaxed_precision(instruction->getType()->getStructElementType(0), op->id, true);

	op->add_ids({ combined_image_sampler_id, coord_id, aux_id });

	spv::Id texel_offset_id = 0;
	if (image_flags)
	{
		op->add_literal(image_flags);
		texel_offset_id = build_texel_offset_vector(impl, offsets, num_coords, image_flags, true);
		op->add_id(texel_offset_id);
	}

	impl.add(op);

	if (raw_gather64)
	{
		Operation *op_green = impl.allocate(spv::OpImageGather, texel_type);
		op_green->add_ids({ combined_image_sampler_id, coord_id, builder.makeUintConstant(1) });

		if (image_flags)
		{
			op_green->add_literal(image_flags);
			op_green->add_id(texel_offset_id);
		}

		impl.add(op_green);

		spv::Id components64[4];
		spv::Id gather_result;

		if (sparse)
		{
			auto *extract_value = impl.allocate(spv::OpCompositeExtract, texel_type);
			gather_result = extract_value->id;
			extract_value->add_id(op->id);
			extract_value->add_literal(1);
			impl.add(extract_value);
		}
		else
			gather_result = op->id;

		for (unsigned i = 0; i < 4; i++)
		{
			auto *extr0 = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
			auto *extr1 = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));

			extr0->add_id(gather_result);
			extr0->add_literal(i);
			extr1->add_id(op_green->id);
			extr1->add_literal(i);

			impl.add(extr0);
			impl.add(extr1);

			spv::Id components[2] = { extr0->id, extr1->id };
			spv::Id value = impl.build_vector(builder.makeUintType(32), components, 2);
			auto *bitcast_64 = impl.allocate(spv::OpBitcast, builder.makeUintType(64));
			bitcast_64->add_id(value);
			components64[i] = bitcast_64->id;

			impl.add(bitcast_64);
		}

		spv::Id u64_vector = impl.build_vector(builder.makeUintType(64), components64, 4);

		if (sparse)
		{
			auto *target_type = instruction->getType()->getStructElementType(0);
			impl.repack_sparse_feedback(DXIL::ComponentType::U64, 4, instruction, target_type, u64_vector);
		}
		else
		{
			impl.rewrite_value(instruction, u64_vector);
		}
	}
	else
	{
		auto *target_type = instruction->getType()->getStructElementType(0);

		if (sparse)
			impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
		else
		{
			impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
			build_exploded_composite_from_vector(impl, instruction, 4);
		}
	}

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
