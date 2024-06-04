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
#include "spirv_module.hpp"
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

static void build_gradient(Converter::Impl &impl, const spv::Id *coord, unsigned num_coords,
                           spv::Id &grad_x, spv::Id &grad_y, spv::Id bias_id, uint32_t &ops)
{
	auto &builder = impl.builder();
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id vec_type = builder.makeVectorType(f32_type, num_coords);
	spv::Id coord_vec = impl.build_vector(builder.makeFloatType(32), coord, num_coords);
	builder.addCapability(spv::CapabilityGroupNonUniformQuad);

	auto *shuf_x = impl.allocate(spv::OpGroupNonUniformQuadSwap, vec_type);
	shuf_x->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	shuf_x->add_id(coord_vec);
	shuf_x->add_id(builder.makeUintConstant(0));

	auto *shuf_y = impl.allocate(spv::OpGroupNonUniformQuadSwap, vec_type);
	shuf_y->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	shuf_y->add_id(coord_vec);
	shuf_y->add_id(builder.makeUintConstant(1));

	// Sign does not matter here. LOD computation takes absolute values.
	auto *horiz_sub = impl.allocate(spv::OpFSub, vec_type);
	auto *vert_sub = impl.allocate(spv::OpFSub, vec_type);
	horiz_sub->add_id(coord_vec);
	horiz_sub->add_id(shuf_x->id);
	vert_sub->add_id(coord_vec);
	vert_sub->add_id(shuf_y->id);

	impl.add(shuf_x);
	impl.add(shuf_y);
	impl.add(horiz_sub);
	impl.add(vert_sub);

	grad_x = horiz_sub->id;
	grad_y = vert_sub->id;

	if (ops & spv::ImageOperandsBiasMask)
	{
		ops &= ~spv::ImageOperandsBiasMask;

		if (!impl.glsl_std450_ext)
			impl.glsl_std450_ext = builder.import("GLSL.std.450");

		auto *exp2 = impl.allocate(spv::OpExtInst, f32_type);
		exp2->add_id(impl.glsl_std450_ext);
		exp2->add_literal(GLSLstd450Exp2);
		exp2->add_id(bias_id);
		impl.add(exp2);

		auto *scale_x = impl.allocate(spv::OpVectorTimesScalar, vec_type);
		auto *scale_y = impl.allocate(spv::OpVectorTimesScalar, vec_type);
		scale_x->add_id(grad_x);
		scale_x->add_id(exp2->id);
		scale_y->add_id(grad_y);
		scale_y->add_id(exp2->id);

		impl.add(scale_x);
		impl.add(scale_y);
		grad_x = scale_x->id;
		grad_y = scale_y->id;
	}

	ops |= spv::ImageOperandsGradMask;
}

bool emit_sample_instruction(DXIL::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	bool comparison_sampling = opcode == DXIL::Op::SampleCmp ||
	                           opcode == DXIL::Op::SampleCmpLevelZero ||
	                           opcode == DXIL::Op::SampleCmpLevel ||
	                           opcode == DXIL::Op::SampleCmpBias;

	bool force_explicit_lod = impl.execution_mode_meta.synthesize_dummy_derivatives;

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

	if (force_explicit_lod)
	{
		if (opcode == DXIL::Op::Sample || opcode == DXIL::Op::SampleBias)
			opcode = DXIL::Op::SampleLevel;
		else if (opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleCmpBias)
			opcode = DXIL::Op::SampleCmpLevelZero;
		else
			force_explicit_lod = false;
	}

	if (opcode == DXIL::Op::SampleLevel || opcode == DXIL::Op::SampleCmpLevelZero || opcode == DXIL::Op::SampleCmpLevel)
		image_ops |= spv::ImageOperandsLodMask;
	else if (opcode == DXIL::Op::SampleBias || opcode == DXIL::Op::SampleCmpBias)
		image_ops |= spv::ImageOperandsBiasMask;

	spv::Id offsets[3] = {};
	if (!get_texel_offsets(impl, instruction, image_ops, 7, num_coords, offsets, false))
		return false;

	spv::Id dref_id = 0;

	if (comparison_sampling)
		dref_id = impl.get_id_for_value(instruction->getOperand(10));

	spv::Id bias_level_argument = 0;
	spv::Id min_lod_argument = 0;
	unsigned bias_level_argument_index = comparison_sampling ? 11 : 10;
	unsigned min_lod_argument_index = 11;

	if (opcode == DXIL::Op::Sample)
		min_lod_argument_index = 10;
	else if (opcode == DXIL::Op::SampleCmpBias)
		min_lod_argument_index = 12;

	auto &access_meta = impl.llvm_composite_meta[instruction];
	bool sparse = (access_meta.access_mask & (1u << 4)) != 0;
	if (sparse)
		builder.addCapability(spv::CapabilitySparseResidency);

	if (opcode == DXIL::Op::Sample || opcode == DXIL::Op::SampleCmp || opcode == DXIL::Op::SampleBias || opcode == DXIL::Op::SampleCmpBias)
	{
		if (!llvm::isa<llvm::UndefValue>(instruction->getOperand(min_lod_argument_index)))
		{
			min_lod_argument = impl.get_id_for_value(instruction->getOperand(min_lod_argument_index));
			image_ops |= spv::ImageOperandsMinLodMask;
			builder.addCapability(spv::CapabilityMinLod);
		}
	}

	if (force_explicit_lod)
		bias_level_argument = builder.makeFloatConstant(0.0f);
	else if (opcode == DXIL::Op::SampleBias || opcode == DXIL::Op::SampleCmpBias || opcode == DXIL::Op::SampleLevel || opcode == DXIL::Op::SampleCmpLevel)
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
	case DXIL::Op::SampleCmpBias:
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
	spv::Id grad_x = 0, grad_y = 0;
	spv::Id sample_type;

	if (sparse)
		sample_type = impl.get_struct_type({ builder.makeUintType(32), texel_type }, "SparseTexel");
	else
		sample_type = texel_type;

	bool grad_rewrite = impl.execution_model != spv::ExecutionModelFragment &&
	                    !impl.options.nv_compute_shader_derivatives;

	if (grad_rewrite)
	{
		switch (spv_op)
		{
		case spv::OpImageSampleImplicitLod:
			spv_op = spv::OpImageSampleExplicitLod;
			break;

		case spv::OpImageSparseSampleImplicitLod:
			spv_op = spv::OpImageSparseSampleExplicitLod;
			break;

		case spv::OpImageSampleDrefImplicitLod:
			spv_op = spv::OpImageSampleDrefExplicitLod;
			break;

		case spv::OpImageSparseSampleDrefImplicitLod:
			spv_op = spv::OpImageSparseSampleDrefExplicitLod;
			break;

		default:
			grad_rewrite = false;
			break;
		}
	}

	if (grad_rewrite)
		build_gradient(impl, coord, num_coords, grad_x, grad_y, bias_level_argument, image_ops);

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

	if (image_ops & spv::ImageOperandsGradMask)
	{
		op->add_id(grad_x);
		op->add_id(grad_y);
	}

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

static spv::Id build_lod_from_gradient(Converter::Impl &impl, spv::Id grad_x, spv::Id grad_y)
{
	auto &builder = impl.builder();
	spv::Id f32_type = builder.makeFloatType(32);

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	auto *dot_x = impl.allocate(spv::OpDot, f32_type);
	dot_x->add_id(grad_x);
	dot_x->add_id(grad_x);
	impl.add(dot_x);

	auto *dot_y = impl.allocate(spv::OpDot, f32_type);
	dot_y->add_id(grad_y);
	dot_y->add_id(grad_y);
	impl.add(dot_y);

	auto *dot_max = impl.allocate(spv::OpExtInst, f32_type);
	dot_max->add_id(impl.glsl_std450_ext);
	dot_max->add_literal(GLSLstd450FMax);
	dot_max->add_id(dot_x->id);
	dot_max->add_id(dot_y->id);
	impl.add(dot_max);

	auto *log_op = impl.allocate(spv::OpExtInst, f32_type);
	log_op->add_id(impl.glsl_std450_ext);
	log_op->add_literal(GLSLstd450Log2);
	log_op->add_id(dot_max->id);
	impl.add(log_op);

	auto *half_mul = impl.allocate(spv::OpFMul, f32_type);
	half_mul->add_id(log_op->id);
	half_mul->add_id(builder.makeFloatConstant(0.5f));
	impl.add(half_mul);

	return half_mul->id;
}

static spv::Id emit_cube_extract_str(Converter::Impl &impl, spv::Id coord,
                                     spv::Id z_major_id, spv::Id y_major_id)
{
	auto &builder = impl.builder();
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id vec3_type = builder.makeVectorType(f32_type, 3);

	auto *y_major_shuffle = impl.allocate(spv::OpVectorShuffle, vec3_type);
	y_major_shuffle->add_id(coord);
	y_major_shuffle->add_id(coord);
	y_major_shuffle->add_literal(0);
	y_major_shuffle->add_literal(2);
	y_major_shuffle->add_literal(1);
	impl.add(y_major_shuffle);

	auto *x_major_shuffle = impl.allocate(spv::OpVectorShuffle, vec3_type);
	x_major_shuffle->add_id(coord);
	x_major_shuffle->add_id(coord);
	x_major_shuffle->add_literal(2);
	x_major_shuffle->add_literal(1);
	x_major_shuffle->add_literal(0);

	impl.add(x_major_shuffle);
	auto *z_major_splat3 = impl.allocate(spv::OpCompositeConstruct, builder.makeVectorType(builder.makeBoolType(), 3));
	for (unsigned i = 0; i < 3; i++)
		z_major_splat3->add_id(z_major_id);
	impl.add(z_major_splat3);

	auto *y_major_splat4 = impl.allocate(spv::OpCompositeConstruct, builder.makeVectorType(builder.makeBoolType(), 3));
	for (unsigned i = 0; i < 3; i++)
		y_major_splat4->add_id(y_major_id);
	impl.add(y_major_splat4);

	auto *yx_select = impl.allocate(spv::OpSelect, vec3_type);
	yx_select->add_id(y_major_splat4->id);
	yx_select->add_id(y_major_shuffle->id);
	yx_select->add_id(x_major_shuffle->id);
	impl.add(yx_select);

	auto *reordered = impl.allocate(spv::OpSelect, vec3_type);
	reordered->add_id(z_major_splat3->id);
	reordered->add_id(coord);
	reordered->add_id(yx_select->id);
	impl.add(reordered);

	return reordered->id;
}

static void emit_calculate_lod_cube_gradient_transform(Converter::Impl &impl,
                                                       spv::Id coord_vec, spv::Id dx, spv::Id dy,
                                                       spv::Id &out_dx, spv::Id &out_dy)
{
	auto &builder = impl.builder();
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id vec2_type = builder.makeVectorType(f32_type, 2);
	spv::Id vec3_type = builder.makeVectorType(f32_type, 3);
	spv::Id vec4_type = builder.makeVectorType(f32_type, 4);

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	builder.addName(coord_vec, "coord");
	builder.addName(dx, "d_coord_dx");
	builder.addName(dy, "d_coord_dy");

	// See 7.18.11 of D3D11 functional spec
	// 16.5.6 - Cube Map Derivative Transform in Vulkan spec
	auto *coord_abs = impl.allocate(spv::OpExtInst, vec3_type);
	coord_abs->add_id(impl.glsl_std450_ext);
	coord_abs->add_literal(GLSLstd450FAbs);
	coord_abs->add_id(coord_vec);
	impl.add(coord_abs);
	builder.addName(coord_abs->id, "abs_uvw");

	spv::Id max_component_id = 0;
	spv::Id abs_components[3];
	for (unsigned i = 0; i < 3; i++)
	{
		auto *extract = impl.allocate(spv::OpCompositeExtract, f32_type);
		extract->add_id(coord_abs->id);
		extract->add_literal(i);
		impl.add(extract);
		abs_components[i] = extract->id;

		if (max_component_id != 0)
		{
			auto *max_comp = impl.allocate(spv::OpExtInst, f32_type);
			max_comp->add_id(impl.glsl_std450_ext);
			max_comp->add_literal(GLSLstd450FMax);
			max_comp->add_id(extract->id);
			max_comp->add_id(max_component_id);
			impl.add(max_comp);
			max_component_id = max_comp->id;
		}
		else
			max_component_id = extract->id;
	}

	builder.addName(max_component_id, "max_component");

	// Shuffle components based on major axis.
	// Ordering of the minor axes isn't interesting since our LOD computation is rotationally invariant and sign invariant,
	// and cube faces are square.

	// Z takes precedence, then Y.
	auto *z_major = impl.allocate(spv::OpFOrdGreaterThanEqual, builder.makeBoolType());
	z_major->add_id(abs_components[2]);
	z_major->add_id(max_component_id);
	impl.add(z_major);
	builder.addName(z_major->id, "z_major");

	auto *y_major = impl.allocate(spv::OpFOrdGreaterThanEqual, builder.makeBoolType());
	y_major->add_id(abs_components[1]);
	y_major->add_id(max_component_id);
	impl.add(y_major);
	builder.addName(y_major->id, "y_major");

	auto *r_sqr = impl.allocate(spv::OpFMul, f32_type);
	r_sqr->add_id(max_component_id);
	r_sqr->add_id(max_component_id);
	impl.add(r_sqr);

	auto *r_sqr_inv_half = impl.allocate(spv::OpFDiv, f32_type);
	r_sqr_inv_half->add_id(builder.makeFloatConstant(0.5f));
	r_sqr_inv_half->add_id(r_sqr->id);
	impl.add(r_sqr_inv_half);

	// [ dsdx, dtdx, drdx ]
	spv::Id d_coord_dx = emit_cube_extract_str(impl, dx, z_major->id, y_major->id);
	// [ dsdy, dtdy, drdy ]
	spv::Id d_coord_dy = emit_cube_extract_str(impl, dy, z_major->id, y_major->id);
	// [ s, t, r ]
	spv::Id coords = emit_cube_extract_str(impl, coord_vec, z_major->id, y_major->id);

	builder.addName(d_coord_dx, "d_str_dx");
	builder.addName(d_coord_dy, "d_str_dy");
	builder.addName(coords, "str");

	// [ dsdx, dtdx, dsdy, dtdy ]
	auto *st_gradients = impl.allocate(spv::OpVectorShuffle, vec4_type);
	st_gradients->add_id(d_coord_dx);
	st_gradients->add_id(d_coord_dy);
	st_gradients->add_literal(0);
	st_gradients->add_literal(3);
	st_gradients->add_literal(1);
	st_gradients->add_literal(4);
	impl.add(st_gradients);

	// [ s, s, t, t ]
	auto *st_coords = impl.allocate(spv::OpVectorShuffle, vec4_type);
	st_coords->add_id(coords);
	st_coords->add_id(coords);
	st_coords->add_literal(0);
	st_coords->add_literal(0);
	st_coords->add_literal(1);
	st_coords->add_literal(1);
	impl.add(st_coords);

	// [ drdx, drdy, drdx, drdy ]
	auto *r_gradients = impl.allocate(spv::OpVectorShuffle, vec4_type);
	r_gradients->add_id(d_coord_dx);
	r_gradients->add_id(d_coord_dy);
	r_gradients->add_literal(2);
	r_gradients->add_literal(5);
	r_gradients->add_literal(2);
	r_gradients->add_literal(5);
	impl.add(r_gradients);

	// |r_c| * [ dsdx, dtdx, dsdy, dtdy ]
	auto *st_gradient_times_r = impl.allocate(spv::OpVectorTimesScalar, vec4_type);
	st_gradient_times_r->add_id(st_gradients->id);
	st_gradient_times_r->add_id(max_component_id);
	impl.add(st_gradient_times_r);

	// [ s, s, t, t ] * [ drdx, drdy, drdx, drdy ]
	auto *coord_times_r_gradient = impl.allocate(spv::OpFMul, vec4_type);
	coord_times_r_gradient->add_id(st_coords->id);
	coord_times_r_gradient->add_id(r_gradients->id);
	impl.add(coord_times_r_gradient);

	auto *sub = impl.allocate(spv::OpFSub, vec4_type);
	sub->add_id(st_gradient_times_r->id);
	sub->add_id(coord_times_r_gradient->id);
	impl.add(sub);

	auto *mul = impl.allocate(spv::OpVectorTimesScalar, vec4_type);
	mul->add_id(sub->id);
	mul->add_id(r_sqr_inv_half->id);
	impl.add(mul);

	builder.addName(mul->id, "cube_gradients");

	// [ ds'dx, dt'dx ]
	auto *grad_x_extract = impl.allocate(spv::OpVectorShuffle, vec2_type);
	grad_x_extract->add_id(mul->id);
	grad_x_extract->add_id(mul->id);
	grad_x_extract->add_literal(0);
	grad_x_extract->add_literal(2);
	impl.add(grad_x_extract);

	// [ ds'dy, dt'dy ]
	auto *grad_y_extract = impl.allocate(spv::OpVectorShuffle, vec2_type);
	grad_y_extract->add_id(mul->id);
	grad_y_extract->add_id(mul->id);
	grad_y_extract->add_literal(1);
	grad_y_extract->add_literal(3);
	impl.add(grad_y_extract);

	out_dx = grad_x_extract->id;
	out_dy = grad_y_extract->id;
}

static bool emit_calculate_lod_instruction_fallback(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	LOGW("Emitting non-conformant CalculateLevelOfDetail. Missing NV_compute_shader_derivatives.\n");
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityImageQuery);
	builder.addCapability(spv::CapabilityGroupNonUniformQuad);

	// Best effort workaround. Extremely unlikely that this will be a real problem in practice.
	// Only Pascal should ever hit this path.
	// Assumes sampler with no LOD bias and no mip clamp + trilinear.
	// Same concerns as sampler feedback where we need side channel data to be conformant.

	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
		return false;

	spv::Id coords[3] = {};
	for (unsigned i = 0; i < num_coords; i++)
		coords[i] = impl.get_id_for_value(instruction->getOperand(3 + i));
	spv::Id coord_vec = impl.build_vector(builder.makeFloatType(32), coords, num_coords);

	spv::Id i32_type = builder.makeIntType(32);
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id fvec_type = builder.makeVectorType(f32_type, num_coords);

	auto *swap_x = impl.allocate(spv::OpGroupNonUniformQuadSwap, fvec_type);
	swap_x->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	swap_x->add_id(coord_vec);
	swap_x->add_id(builder.makeUintConstant(0));
	impl.add(swap_x);

	auto *swap_y = impl.allocate(spv::OpGroupNonUniformQuadSwap, fvec_type);
	swap_y->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	swap_y->add_id(coord_vec);
	swap_y->add_id(builder.makeUintConstant(1));
	impl.add(swap_y);

	auto *grad_x = impl.allocate(spv::OpFSub, fvec_type);
	grad_x->add_id(swap_x->id);
	grad_x->add_id(coord_vec);
	impl.add(grad_x);

	auto *grad_y = impl.allocate(spv::OpFSub, fvec_type);
	grad_y->add_id(swap_y->id);
	grad_y->add_id(coord_vec);
	impl.add(grad_y);

	uint32_t num_size_coords;
	if (!get_image_dimensions_query_size(impl, builder, image_id, &num_size_coords))
		return false;

	spv::Id grad_x_id = grad_x->id;
	spv::Id grad_y_id = grad_y->id;
	if (builder.getTypeDimensionality(impl.get_type_id(image_id)) == spv::DimCube)
	{
		emit_calculate_lod_cube_gradient_transform(impl, coord_vec,
		                                           grad_x->id, grad_y->id,
		                                           grad_x_id, grad_y_id);

		// Projected down to 2 dimensions now.
		fvec_type = builder.makeVectorType(f32_type, 2);
		num_coords = 2;
	}

	auto *query_op = impl.allocate(spv::OpImageQuerySizeLod, builder.makeVectorType(i32_type, num_size_coords));
	query_op->add_ids({ image_id, builder.makeIntConstant(0) });
	impl.add(query_op);

	if (num_coords != num_size_coords)
	{
		auto *shuffle_op = impl.allocate(spv::OpVectorShuffle, builder.makeVectorType(i32_type, num_coords));
		shuffle_op->add_id(query_op->id);
		shuffle_op->add_id(query_op->id);
		for (unsigned i = 0; i < num_coords; i++)
			shuffle_op->add_literal(i);
		impl.add(shuffle_op);

		query_op = shuffle_op;
	}

	auto *fconv = impl.allocate(spv::OpConvertSToF, fvec_type);
	fconv->add_id(query_op->id);
	impl.add(fconv);

	auto *scale_x = impl.allocate(spv::OpFMul, fvec_type);
	scale_x->add_ids({ grad_x_id, fconv->id });
	impl.add(scale_x);

	auto *scale_y = impl.allocate(spv::OpFMul, fvec_type);
	scale_y->add_ids({ grad_y_id, fconv->id });
	impl.add(scale_y);

	spv::Id lod = build_lod_from_gradient(impl, scale_x->id, scale_y->id);

	auto *clamped_value = llvm::cast<llvm::ConstantInt>(instruction->getOperand(6));
	bool clamped = clamped_value->getUniqueInteger().getZExtValue() != 0;

	if (clamped)
	{
		auto *levels_op = impl.allocate(spv::OpImageQueryLevels, builder.makeIntType(32));
		levels_op->add_id(image_id);
		impl.add(levels_op);

		auto *f_levels = impl.allocate(spv::OpConvertSToF, f32_type);
		f_levels->add_id(levels_op->id);
		impl.add(f_levels);

		auto *max_level = impl.allocate(spv::OpFSub, f32_type);
		max_level->add_id(f_levels->id);
		max_level->add_id(builder.makeFloatConstant(-1.0f));
		impl.add(max_level);

		// In case of null descriptor, make sure we end up with 0, so do min, then max.
		auto *min_op = impl.allocate(spv::OpExtInst, f32_type);
		min_op->add_id(impl.glsl_std450_ext);
		min_op->add_literal(GLSLstd450FMin);
		min_op->add_ids({ lod, max_level->id });
		impl.add(min_op);

		auto *max_op = impl.allocate(spv::OpExtInst, f32_type);
		max_op->add_id(impl.glsl_std450_ext);
		max_op->add_literal(GLSLstd450FMax);
		max_op->add_ids({ min_op->id, builder.makeFloatConstant(0.0f) });
		impl.add(max_op);

		lod = max_op->id;
	}
	else
	{
		// The assumption is still fixed point,
		// and real hardware will not return -inf here. Clamp to [-128, 128] which has been observed in the wild.
		auto *clamp_op = impl.allocate(spv::OpExtInst, f32_type);
		clamp_op->add_id(impl.glsl_std450_ext);
		clamp_op->add_literal(GLSLstd450FClamp);
		clamp_op->add_id(lod);
		clamp_op->add_id(builder.makeFloatConstant(-128.0f));
		clamp_op->add_id(builder.makeFloatConstant(+128.0f));
		impl.add(clamp_op);

		lod = clamp_op->id;
	}

	impl.rewrite_value(instruction, lod);
	return true;
}

bool emit_calculate_lod_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (impl.execution_mode_meta.synthesize_dummy_derivatives)
	{
		impl.rewrite_value(instruction, builder.makeFloatConstant(0.0f));
		return true;
	}

	if (impl.execution_model != spv::ExecutionModelFragment &&
	    !impl.options.nv_compute_shader_derivatives)
	{
		return emit_calculate_lod_instruction_fallback(impl, instruction);
	}

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

static spv::Id emit_query_size(Converter::Impl &impl, spv::Id image_id,
                               bool array, spv::Id lod_id = 0)
{
	auto &builder = impl.builder();
	spv::Id i32_type = builder.makeIntType(32);

	auto *query_size_level_zero = impl.allocate(
		lod_id ? spv::OpImageQuerySizeLod : spv::OpImageQuerySize,
		builder.makeVectorType(i32_type, array ? 3 : 2));
	query_size_level_zero->add_id(image_id);
	if (lod_id)
		query_size_level_zero->add_id(lod_id);
	impl.add(query_size_level_zero);

	if (array)
	{
		auto *extract = impl.allocate(spv::OpVectorShuffle, builder.makeVectorType(i32_type, 2));
		extract->add_id(query_size_level_zero->id);
		extract->add_id(query_size_level_zero->id);
		extract->add_literal(0);
		extract->add_literal(1);
		impl.add(extract);

		query_size_level_zero = extract;
	}

	return query_size_level_zero->id;
}

// A software implementation of sampler feedback is by nature quite brittle.
// Implement a best-effort solution.

static spv::Id emit_accessed_lod(DXIL::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction,
                                 spv::Id image_id, spv::Id sampler_id, spv::Id coord_id, spv::Id max_level_id,
                                 spv::Id *gradient_mod_id, bool array)
{
	auto &builder = impl.builder();
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id fvec_type = builder.makeVectorType(f32_type, 2);
	spv::Id access_lod_id;

	*gradient_mod_id = 0;

	if (opcode == DXIL::Op::WriteSamplerFeedback || opcode == DXIL::Op::WriteSamplerFeedbackBias)
	{
		spv::Id combined_image_sampler_id = impl.build_sampled_image(image_id, sampler_id, false);

		// This is more or less correct.
		// We can also detect if tri-linear should be used by checking fractional clamped LOD.
		spv::Id modified_coord_id;

		if (opcode == DXIL::Op::WriteSamplerFeedbackBias)
		{
			// Fake a larger or smaller gradient to get effective LOD bias.
			// In D3D11 functional spec, out of range LOD bias is undefined, so don't bother clamping.
			auto *exp = impl.allocate(spv::OpExtInst, f32_type);
			exp->add_id(impl.glsl_std450_ext);
			exp->add_literal(GLSLstd450Exp2);
			exp->add_id(impl.get_id_for_value(instruction->getOperand(8)));
			impl.add(exp);

			*gradient_mod_id = exp->id;

			// Bias can technically be unique per pixel in a quad, so we have to compute LOD 4 times,
			// but make the assumption that LOD bias is constant over a quad to stay sane.
			// The common use for LOD bias for streaming is TAA related either way.
			// Workaround is to QuadBroadcast(exp, i), then compute LOD 4 times, then select the appropriate LOD.
			auto *quad_first = impl.allocate(spv::OpGroupNonUniformQuadBroadcast, f32_type);
			quad_first->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
			quad_first->add_id(exp->id);
			quad_first->add_id(builder.makeUintConstant(0));
			impl.add(quad_first);
			builder.addCapability(spv::CapabilityGroupNonUniformQuad);

			auto *mul = impl.allocate(spv::OpVectorTimesScalar, fvec_type);
			mul->add_id(coord_id);
			mul->add_id(quad_first->id);
			impl.add(mul);
			modified_coord_id = mul->id;
		}
		else
		{
			modified_coord_id = coord_id;
		}

		auto *query_op = impl.allocate(spv::OpImageQueryLod, builder.makeVectorType(f32_type, 2));
		query_op->add_ids({ combined_image_sampler_id, modified_coord_id });
		impl.add(query_op);

		auto *extract_op = impl.allocate(spv::OpCompositeExtract, f32_type);
		extract_op->add_id(query_op->id);
		extract_op->add_literal(0);
		impl.add(extract_op);
		access_lod_id = extract_op->id;
	}
	else if (opcode == DXIL::Op::WriteSamplerFeedbackLevel)
	{
		access_lod_id = impl.get_id_for_value(instruction->getOperand(8));
	}
	else if (opcode == DXIL::Op::WriteSamplerFeedbackGrad)
	{
		auto *fp_size = impl.allocate(spv::OpConvertSToF, fvec_type);
		fp_size->add_id(emit_query_size(impl, image_id, array, builder.makeIntConstant(0)));
		impl.add(fp_size);

		spv::Id ddx[2];
		spv::Id ddy[2];
		for (unsigned i = 0; i < 2; i++)
		{
			ddx[i] = impl.get_id_for_value(instruction->getOperand(8 + i));
			ddy[i] = impl.get_id_for_value(instruction->getOperand(11 + i));
		}

		// Spec is very lenient on how LOD can be computed, but choose the D3D11 spec wording.
		// Based it on maximum gradient length, which is rotationally invariant and matches
		// observed behavior on AMD and Intel. NV + aniso is ... weird and non-compliant.

		spv::Id ddx_id = impl.build_vector(f32_type, ddx, 2);
		spv::Id ddy_id = impl.build_vector(f32_type, ddy, 2);

		auto *grad_x = impl.allocate(spv::OpFMul, fvec_type);
		grad_x->add_id(fp_size->id);
		grad_x->add_id(ddx_id);
		impl.add(grad_x);

		auto *grad_y = impl.allocate(spv::OpFMul, fvec_type);
		grad_y->add_id(fp_size->id);
		grad_y->add_id(ddy_id);
		impl.add(grad_y);

		access_lod_id = build_lod_from_gradient(impl, grad_x->id, grad_y->id);
	}
	else
		return 0;

	if (opcode == DXIL::Op::WriteSamplerFeedbackLevel || opcode == DXIL::Op::WriteSamplerFeedbackGrad)
	{
		auto *max_level_fp = impl.allocate(spv::OpConvertSToF, f32_type);
		max_level_fp->add_id(max_level_id);
		impl.add(max_level_fp);

		// We don't know sampler clamping here, so we'll have to assume min/maxLOD covers more than image view.
		// We also don't know about tri-linear vs bi-linear at all, so we have to assume tri-linear
		// if explicit LOD is fractional.
		// NClamp in case the gradient causes NaN for whatever reason.
		auto *clamped_lod = impl.allocate(spv::OpExtInst, f32_type);
		clamped_lod->add_id(impl.glsl_std450_ext);
		clamped_lod->add_literal(GLSLstd450NClamp);
		clamped_lod->add_id(access_lod_id);
		clamped_lod->add_id(builder.makeFloatConstant(0.0f));
		clamped_lod->add_id(max_level_fp->id);
		impl.add(clamped_lod);

		access_lod_id = clamped_lod->id;
	}

	if (opcode != DXIL::Op::WriteSamplerFeedbackLevel)
	{
		// Undocumented feature in spec. There's an extra MinMipClamp operand here.
		// We cannot implement that completely accurately since we need QueryLod + MinMip, which
		// does not exist, but just YOLO it.
		// Normally, that clamp value will be integer, which should be fine.
		// This comes after [0, levels - 1] clamp, since if we clamp LOD to out of bounds of view,
		// we end up accessing OOB.
		auto *clamp_value = instruction->getOperand(instruction->getNumOperands() - 1);
		if (!llvm::isa<llvm::UndefValue>(clamp_value))
		{
			auto *clamp_lod = impl.allocate(spv::OpExtInst, f32_type);
			clamp_lod->add_id(impl.glsl_std450_ext);
			clamp_lod->add_literal(GLSLstd450FMax);
			clamp_lod->add_id(access_lod_id);
			clamp_lod->add_id(impl.get_id_for_value(clamp_value));
			impl.add(clamp_lod);

			// LOD 15 bits are reserved.
			auto *max_lod_clamp = impl.allocate(spv::OpExtInst, f32_type);
			max_lod_clamp->add_id(impl.glsl_std450_ext);
			max_lod_clamp->add_literal(GLSLstd450FMin);
			max_lod_clamp->add_id(clamp_lod->id);
			max_lod_clamp->add_id(builder.makeFloatConstant(14.0f));
			impl.add(max_lod_clamp);

			access_lod_id = max_lod_clamp->id;
		}
	}

	return access_lod_id;
}

static spv::Id emit_mip_region_size_log2(Converter::Impl &impl, const llvm::CallInst *instruction,
                                         spv::Id feedback_image_id, bool arrayed)
{
	auto &builder = impl.builder();
	spv::Id i32_type = builder.makeIntType(32);
	spv::Id ivec_type = builder.makeVectorType(i32_type, 2);

	spv::Id feedback_size_id;

	if (arrayed)
	{
		auto *query_feedback_size = impl.allocate(spv::OpImageQuerySize, builder.makeVectorType(i32_type, 3));
		query_feedback_size->add_id(feedback_image_id);
		impl.add(query_feedback_size);

		auto *extract = impl.allocate(spv::OpVectorShuffle, ivec_type);
		extract->add_id(query_feedback_size->id);
		extract->add_id(query_feedback_size->id);
		extract->add_literal(0);
		extract->add_literal(1);
		impl.add(extract);

		feedback_size_id = extract->id;
	}
	else
	{
		auto *query_feedback_size = impl.allocate(spv::OpImageQuerySize, ivec_type);
		query_feedback_size->add_id(feedback_image_id);
		impl.add(query_feedback_size);

		feedback_size_id = query_feedback_size->id;
	}

	auto *masked_size = impl.allocate(spv::OpBitwiseAnd, ivec_type);
	masked_size->add_id(feedback_size_id);
	masked_size->add_id(impl.build_splat_constant_vector(i32_type, builder.makeIntConstant(15), 2));
	impl.add(masked_size);

	return masked_size->id;
}

struct ScalingFactors
{
	spv::Id normalized_scale_id;
	spv::Id float_size_id;
	spv::Id unnormalized_exponent_id;
};

static ScalingFactors emit_scaling_factor_to_mip_region_space(
	Converter::Impl &impl, const llvm::CallInst *instruction,
	spv::Id image_id, spv::Id lod_id, spv::Id mip_region_size_log2, bool arrayed)
{
	auto &builder = impl.builder();
	spv::Id i32_type = builder.makeIntType(32);
	spv::Id ivec_type = builder.makeVectorType(i32_type, 2);
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id fvec_type = builder.makeVectorType(f32_type, 2);

	// Query size of top-level mip we're writing to.
	auto *fp_size = impl.allocate(spv::OpConvertSToF, fvec_type);
	fp_size->add_id(emit_query_size(impl, image_id, arrayed, lod_id));
	impl.add(fp_size);

	// The lower 4 bits of feedback image store log2(MipRegionWidth).
	// X dimension for width and Y for height.
	// Clever hackery that avoids having to pass down an extra side buffer ... :V
	auto *to_mip_region_space = impl.allocate(spv::OpSNegate, ivec_type);
	to_mip_region_space->add_id(mip_region_size_log2);
	impl.add(to_mip_region_space);

	// Scale the UV coordinates into sub-pixel coordinates in mip-region space.
	auto *ld_exp = impl.allocate(spv::OpExtInst, fvec_type);
	ld_exp->add_id(impl.glsl_std450_ext);
	ld_exp->add_literal(GLSLstd450Ldexp);
	ld_exp->add_id(fp_size->id);
	ld_exp->add_id(to_mip_region_space->id);
	impl.add(ld_exp);

	ScalingFactors factors = {};
	factors.normalized_scale_id = ld_exp->id;
	factors.float_size_id = fp_size->id;
	factors.unnormalized_exponent_id = to_mip_region_space->id;
	return factors;
}

static spv::Id emit_max_level(Converter::Impl &impl, spv::Id image_id)
{
	auto &builder = impl.builder();
	spv::Id i32_type = builder.makeIntType(32);

	auto *query_levels = impl.allocate(spv::OpImageQueryLevels, i32_type);
	query_levels->add_id(image_id);
	impl.add(query_levels);

	auto *max_level = impl.allocate(spv::OpISub, i32_type);
	max_level->add_id(query_levels->id);
	max_level->add_id(builder.makeIntConstant(1));
	impl.add(max_level);

	return max_level->id;
}

struct LodSelection
{
	spv::Id fine_lod_id;
	spv::Id coarse_lod_id;
	spv::Id trilinear_enable_id;
};

static LodSelection emit_trilinear_lods(Converter::Impl &impl, spv::Id access_lod_id, spv::Id max_level_id)
{
	LodSelection lods = {};
	auto &builder = impl.builder();
	spv::Id i32_type = builder.makeIntType(32);
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id bool_type = builder.makeBoolType();

	auto *fine_lod = impl.allocate(spv::OpConvertFToS, i32_type);
	fine_lod->add_id(access_lod_id);
	impl.add(fine_lod);

	lods.fine_lod_id = fine_lod->id;

	// Trilinear only kicks in one the fractional value hits 1 / 256.
	// It does not trigger on 1 / 512 from real-world testing for example.
	// Use mid-point between the two. Avoids subtle rounding issues in FP add.
	auto *coarse_bias_lod = impl.allocate(spv::OpFAdd, f32_type);
	coarse_bias_lod->add_id(access_lod_id);
	coarse_bias_lod->add_id(builder.makeFloatConstant(1.0f - 0.75f / 256.0f));
	impl.add(coarse_bias_lod);

	auto *coarse_lod = impl.allocate(spv::OpConvertFToS, i32_type);
	coarse_lod->add_id(coarse_bias_lod->id);
	impl.add(coarse_lod);

	auto *clamped_lod = impl.allocate(spv::OpExtInst, i32_type);
	clamped_lod->add_id(impl.glsl_std450_ext);
	clamped_lod->add_literal(GLSLstd450SMin);
	clamped_lod->add_id(coarse_lod->id);
	clamped_lod->add_id(max_level_id);
	impl.add(clamped_lod);
	lods.coarse_lod_id = coarse_lod->id;

	auto *trilinear = impl.allocate(spv::OpINotEqual, bool_type);
	trilinear->add_id(fine_lod->id);
	trilinear->add_id(coarse_lod->id);
	impl.add(trilinear);
	lods.trilinear_enable_id = trilinear->id;

	return lods;
}

static spv::Id emit_gradient_extent_normalized(Converter::Impl &impl, spv::Id coord_id, spv::Id grad_scale_id)
{
	auto &builder = impl.builder();
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id fvec_type = builder.makeVectorType(f32_type, 2);

	auto *ddx = impl.allocate(spv::OpDPdx, fvec_type);
	ddx->add_id(coord_id);
	impl.add(ddx);

	auto *ddy = impl.allocate(spv::OpDPdy, fvec_type);
	ddy->add_id(coord_id);
	impl.add(ddy);

	auto *ddx_abs = impl.allocate(spv::OpExtInst, fvec_type);
	ddx_abs->add_id(impl.glsl_std450_ext);
	ddx_abs->add_literal(GLSLstd450FAbs);
	ddx_abs->add_id(ddx->id);
	impl.add(ddx_abs);

	auto *ddy_abs = impl.allocate(spv::OpExtInst, fvec_type);
	ddy_abs->add_id(impl.glsl_std450_ext);
	ddy_abs->add_literal(GLSLstd450FAbs);
	ddy_abs->add_id(ddy->id);
	impl.add(ddy_abs);

	auto *ddx_abs_0 = impl.allocate(spv::OpCompositeExtract, f32_type);
	ddx_abs_0->add_id(ddx_abs->id);
	ddx_abs_0->add_literal(0);
	impl.add(ddx_abs_0);

	auto *ddy_abs_0 = impl.allocate(spv::OpCompositeExtract, f32_type);
	ddy_abs_0->add_id(ddy_abs->id);
	ddy_abs_0->add_literal(0);
	impl.add(ddy_abs_0);

	auto *ddx_abs_1 = impl.allocate(spv::OpCompositeExtract, f32_type);
	ddx_abs_1->add_id(ddx_abs->id);
	ddx_abs_1->add_literal(1);
	impl.add(ddx_abs_1);

	auto *ddy_abs_1 = impl.allocate(spv::OpCompositeExtract, f32_type);
	ddy_abs_1->add_id(ddy_abs->id);
	ddy_abs_1->add_literal(1);
	impl.add(ddy_abs_1);

	auto *extent_x = impl.allocate(spv::OpExtInst, f32_type);
	extent_x->add_id(impl.glsl_std450_ext);
	extent_x->add_literal(GLSLstd450FMax);
	extent_x->add_id(ddx_abs_0->id);
	extent_x->add_id(ddy_abs_0->id);
	impl.add(extent_x);

	auto *extent_y = impl.allocate(spv::OpExtInst, f32_type);
	extent_y->add_id(impl.glsl_std450_ext);
	extent_y->add_literal(GLSLstd450FMax);
	extent_y->add_id(ddx_abs_1->id);
	extent_y->add_id(ddy_abs_1->id);
	impl.add(extent_y);

	spv::Id extent_ids[2] = {extent_x->id, extent_y->id};
	spv::Id extent = impl.build_vector(f32_type, extent_ids, 2);

	// Extremely weird behavior observed on both NV and Intel.
	// It seems that if you have LOD bias, the effective gradient is scaled accordingly.
	// This means the aniso footprint is scaled too, which is extremely weird and definitely
	// not accurate to spec how I understand it ...
	// TODO: Does sampler LOD bias affect this too?
	if (grad_scale_id)
	{
		auto *grad_mul = impl.allocate(spv::OpVectorTimesScalar, fvec_type);
		grad_mul->add_id(extent);
		grad_mul->add_id(grad_scale_id);
		impl.add(grad_mul);
		extent = grad_mul->id;
	}

	return extent;
}

bool emit_write_sampler_feedback_instruction(DXIL::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityImageQuery);
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	spv::Id feedback_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id sampler_id = impl.get_id_for_value(instruction->getOperand(3));
	const auto &meta = impl.handle_to_resource_meta[feedback_id];

	uint32_t num_coords_full = 0, num_coords = 0;
	if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
		return false;

	// Should not happen.
	if (num_coords != 2)
		return false;

	spv::Id bool_type = builder.makeBoolType();
	spv::Id i32_type = builder.makeIntType(32);
	spv::Id f32_type = builder.makeFloatType(32);
	spv::Id bvec_type = builder.makeVectorType(bool_type, 2);
	spv::Id ivec_type = builder.makeVectorType(i32_type, 2);
	spv::Id fvec_type = builder.makeVectorType(f32_type, 2);

	spv::Id int_layer_id = 0;
	if (num_coords_full == 3)
	{
		// Vulkan allows for two implementation of this rounding, either RTE or floor(v + 0.5).
		// Pick the suggested one. This matches real-world implementations.
		auto *rounded_layer = impl.allocate(spv::OpExtInst, f32_type);
		rounded_layer->add_id(impl.glsl_std450_ext);
		rounded_layer->add_literal(GLSLstd450RoundEven);
		rounded_layer->add_id(impl.get_id_for_value(instruction->getOperand(6)));
		impl.add(rounded_layer);

		auto *int_layer = impl.allocate(spv::OpConvertFToS, i32_type);
		int_layer->add_id(rounded_layer->id);
		impl.add(int_layer);

		int_layer_id = int_layer->id;
	}

	spv::Id coord_ids[2];
	for (uint32_t i = 0; i < 2; i++)
		coord_ids[i] = impl.get_id_for_value(instruction->getOperand(4 + i));
	spv::Id coord_id = impl.build_vector(f32_type, coord_ids, 2);
	spv::Id mip_region_size_log2 = emit_mip_region_size_log2(impl, instruction, feedback_id, num_coords_full == 3);
	spv::Id max_level_id = emit_max_level(impl, image_id);

	// This part will change quite dramatically based on op-code.
	// Computing the actual LOD to access is quite painful.
	// We cannot do it properly for most interesting cases without having side band information
	// about sampler state. In real-world scenarios, applications will likely adhere to whatever mip level
	// we decide to access either way, so it shouldn't lead to serious problems.
	spv::Id grad_scale_id;
	spv::Id access_lod_id = emit_accessed_lod(opcode, impl, instruction, image_id, sampler_id, coord_id,
	                                          max_level_id, &grad_scale_id, num_coords_full == 3);

	auto lods = emit_trilinear_lods(impl, access_lod_id, max_level_id);

	spv::Id normalized_grad_extent = 0;
	if (opcode == DXIL::Op::WriteSamplerFeedback || opcode == DXIL::Op::WriteSamplerFeedbackBias)
		normalized_grad_extent = emit_gradient_extent_normalized(impl, coord_id, grad_scale_id);

	// Assume that if we get coordinates above 1.0 we intend to WRAP.
	// Only WRAP and CLAMP is supported with sampler feedback (but WRAP is kinda broken on NV hardware).
	// After wrap, assume CLAMP semantics for purposes of filtering.
	auto *fract_uv_op = impl.allocate(spv::OpExtInst, fvec_type);
	fract_uv_op->add_id(impl.glsl_std450_ext);
	fract_uv_op->add_literal(GLSLstd450Fract);
	fract_uv_op->add_id(coord_id);
	impl.add(fract_uv_op);

	for (unsigned lod_iteration = 0; lod_iteration < 2; lod_iteration++)
	{
		spv::Id lod_id = lod_iteration ? lods.coarse_lod_id : lods.fine_lod_id;

		auto scaling = emit_scaling_factor_to_mip_region_space(
			impl, instruction, image_id, lod_id,
			mip_region_size_log2, num_coords_full == 3);

		auto *mul_mip_region_coord = impl.allocate(spv::OpFMul, fvec_type);
		mul_mip_region_coord->add_id(fract_uv_op->id);
		mul_mip_region_coord->add_id(scaling.normalized_scale_id);
		impl.add(mul_mip_region_coord);

		// We have to assume the worst w.r.t. filtering / aniso.
		// Simplify this with a ton with crude, but effective approximations.
		// Compute derivatives in mip region space.
		// Based on these derivatives, we get a bounding box.
		// The size of this bounding box is then clamped to a minimum and maximum size.
		// At minimum, we have 1x aniso / bilinear. Extent is +/- 0.5 texels.
		// At maximum, we have 16x aniso. Extent is +/- 8 texels.
		// Need to look at derivatives so that we can compute conservative aniso extent.

		// For implicit LOD, we compute the gradient and try to recover aniso information.
		spv::Id clamped_extent_id;

		if (opcode == DXIL::Op::WriteSamplerFeedback || opcode == DXIL::Op::WriteSamplerFeedbackBias)
		{
			auto *scale_size = impl.allocate(spv::OpFMul, fvec_type);
			scale_size->add_id(normalized_grad_extent);
			scale_size->add_id(scaling.float_size_id);
			impl.add(scale_size);

			// For integer LODs, we will end up computing an approximate integer due to FP derivatives.
			// It would be very bad if we got a positive error and rounded up a full POT.
			// LODs tend to be snapped to fixed point, so use a sufficient threshold to avoid these errors.
			// This value is chosen somewhat arbitrarily, but one subtexel worth of bias seems reasonable.
			auto *rounding_bias = impl.allocate(spv::OpFSub, fvec_type);
			rounding_bias->add_id(scale_size->id);
			rounding_bias->add_id(
				impl.build_splat_constant_vector(f32_type, builder.makeFloatConstant(1.0f / 256.0f), 2));
			impl.add(rounding_bias);

			// With aniso factors, implementations are allowed to round up the aniso factor
			// to nearest supported value.
			// From exhaustive testing, NV and Intel have somewhat different behavior, but in general,
			// all POT factors behave accurately with this implementation.
			// Oddly enough, the extent is enlongated as well when rounding up, which is also not spec compliant ...
			// What we want to do is round up to next POT and round up extent similarly,
			// and the cutest way to do this is with frexp. The exponent represents next POT in magnitude.
			// We can then clamp that frexp to [unormalized_exponent_id, unnormalized_exponent_id + 4].
			// We're robust against NaN since the exponent is undefined, but we'll clamp that below in integer space.
			auto *frexp = impl.allocate(spv::OpExtInst, builder.makeStructResultType(fvec_type, ivec_type));
			frexp->add_id(impl.glsl_std450_ext);
			frexp->add_literal(GLSLstd450FrexpStruct);
			frexp->add_id(rounding_bias->id);
			impl.add(frexp);

			auto *extract = impl.allocate(spv::OpCompositeExtract, ivec_type);
			extract->add_id(frexp->id);
			extract->add_literal(1);
			impl.add(extract);

			auto *sclamp = impl.allocate(spv::OpExtInst, ivec_type);
			sclamp->add_id(impl.glsl_std450_ext);
			sclamp->add_literal(GLSLstd450SClamp);
			sclamp->add_id(extract->id);
			sclamp->add_id(impl.build_splat_constant_vector(i32_type, builder.makeIntConstant(0), num_coords));
			sclamp->add_id(impl.build_splat_constant_vector(i32_type, builder.makeIntConstant(4), num_coords));
			impl.add(sclamp);

			auto *shift_exp = impl.allocate(spv::OpIAdd, ivec_type);
			shift_exp->add_id(sclamp->id);
			shift_exp->add_id(scaling.unnormalized_exponent_id);
			impl.add(shift_exp);

			// For aniso, the conservative filter extent is half the major length.
			// Halve the bounding box extents as a rough approximation.
			// For bilinear, the footprint can be found in [-0.5, 0.5] texels.
			// Fuse the multiply and exp2() here in ldexp.
			auto *fextent = impl.allocate(spv::OpExtInst, fvec_type);
			fextent->add_id(impl.glsl_std450_ext);
			fextent->add_literal(GLSLstd450Ldexp);
			fextent->add_id(impl.build_splat_constant_vector(f32_type, builder.makeFloatConstant(0.5f), num_coords));
			fextent->add_id(shift_exp->id);
			impl.add(fextent);

			// We only support signalling access for nearest neighbor.
			// For 16x aniso with 4x4 region, this can go wrong, but we don't really care.
			// Worst case, we can clamp to 16x16 region internally and upsample the region map on resolve.
			// Maximum +/- 0.5 regions is allowed here, this ensures that we access maximum 2x2 blocks.
			auto *clamped_extent = impl.allocate(spv::OpExtInst, fvec_type);
			clamped_extent->add_id(impl.glsl_std450_ext);
			clamped_extent->add_literal(GLSLstd450FMin);
			clamped_extent->add_id(fextent->id);
			clamped_extent->add_id(
				impl.build_splat_constant_vector(f32_type, builder.makeFloatConstant(0.5f), num_coords));
			impl.add(clamped_extent);

			clamped_extent_id = clamped_extent->id;
		}
		else
		{
			// Level is incompatible with aniso, so always assume simple bilinear. Use fixed +/- 0.5 pixel footprint.
			// For explicit gradient, we also assume no aniso,
			// since computing aniso-factors can cause far too fine mips to be requested if this was not intended by app.
			// We have no good way to detect this, and trying to compute aniso factors
			// accurately to hardware is a losing game since every implementation applies heavy approximations.
			auto *min_extent = impl.allocate(spv::OpExtInst, fvec_type);
			min_extent->add_id(impl.glsl_std450_ext);
			min_extent->add_literal(GLSLstd450Ldexp);
			min_extent->add_id(impl.build_splat_constant_vector(f32_type, builder.makeFloatConstant(0.5f), num_coords));
			min_extent->add_id(scaling.unnormalized_exponent_id);
			impl.add(min_extent);

			clamped_extent_id = min_extent->id;
		}

		auto *lo_foot_print = impl.allocate(spv::OpFSub, fvec_type);
		lo_foot_print->add_id(mul_mip_region_coord->id);
		lo_foot_print->add_id(clamped_extent_id);
		impl.add(lo_foot_print);

		auto *lo_clamped = impl.allocate(spv::OpExtInst, fvec_type);
		lo_clamped->add_id(impl.glsl_std450_ext);
		lo_clamped->add_literal(GLSLstd450FMax);
		lo_clamped->add_id(lo_foot_print->id);
		lo_clamped->add_id(impl.build_splat_constant_vector(f32_type, builder.makeFloatConstant(0.0f), num_coords));
		impl.add(lo_clamped);

		auto *hi_foot_print = impl.allocate(spv::OpFAdd, fvec_type);
		hi_foot_print->add_id(mul_mip_region_coord->id);
		hi_foot_print->add_id(clamped_extent_id);
		impl.add(hi_foot_print);

		auto *lo_int = impl.allocate(spv::OpConvertFToS, ivec_type);
		lo_int->add_id(lo_clamped->id);
		impl.add(lo_int);

		auto *hi_int = impl.allocate(spv::OpConvertFToS, ivec_type);
		hi_int->add_id(hi_foot_print->id);
		impl.add(hi_int);

		auto *not_equal = impl.allocate(spv::OpINotEqual, bvec_type);
		not_equal->add_id(lo_int->id);
		not_equal->add_id(hi_int->id);
		impl.add(not_equal);

		auto *visit_horiz = impl.allocate(spv::OpCompositeExtract, bool_type);
		visit_horiz->add_id(not_equal->id);
		visit_horiz->add_literal(0);
		impl.add(visit_horiz);

		auto *visit_vert = impl.allocate(spv::OpCompositeExtract, bool_type);
		visit_vert->add_id(not_equal->id);
		visit_vert->add_literal(1);
		impl.add(visit_vert);

		auto *visit_diag = impl.allocate(spv::OpLogicalAnd, bool_type);
		visit_diag->add_id(visit_horiz->id);
		visit_diag->add_id(visit_vert->id);
		impl.add(visit_diag);

		const spv::Id bit_ids[3] = {visit_horiz->id, visit_vert->id, visit_diag->id};
		spv::Id merged_bit = builder.makeIntConstant(1);

		for (unsigned i = 0; i < 3; i++)
		{
			auto *select_op = impl.allocate(spv::OpSelect, i32_type);
			select_op->add_id(bit_ids[i]);
			select_op->add_id(builder.makeIntConstant(2 << i));
			select_op->add_id(builder.makeIntConstant(0));
			impl.add(select_op);

			auto *or_op = impl.allocate(spv::OpBitwiseOr, i32_type);
			or_op->add_id(merged_bit);
			or_op->add_id(select_op->id);
			impl.add(or_op);

			merged_bit = or_op->id;
		}

		spv::Id u64_type = builder.makeUintType(64);
		auto *u64_conv = impl.allocate(spv::OpSConvert, u64_type);
		u64_conv->add_id(merged_bit);
		impl.add(u64_conv);

		auto *shamt = impl.allocate(spv::OpIMul, i32_type);
		shamt->add_id(lod_id);
		shamt->add_id(builder.makeIntConstant(4));
		impl.add(shamt);

		auto *shamt64 = impl.allocate(spv::OpSConvert, u64_type);
		shamt64->add_id(shamt->id);
		impl.add(shamt64);

		auto *shift_op = impl.allocate(spv::OpShiftLeftLogical, u64_type);
		shift_op->add_id(u64_conv->id);
		shift_op->add_id(shamt64->id);
		impl.add(shift_op);

		spv::Id comp_id;
		if (int_layer_id)
		{
			auto *comp = impl.allocate(spv::OpCompositeConstruct, builder.makeVectorType(i32_type, num_coords_full));
			comp->add_id(lo_int->id);
			comp->add_id(int_layer_id);
			impl.add(comp);
			comp_id = comp->id;
		}
		else
		{
			comp_id = lo_int->id;
		}

		spv::Id participate_id;
		if (impl.execution_model == spv::ExecutionModelFragment)
		{
			auto *is_helper = impl.allocate(spv::OpIsHelperInvocationEXT, bool_type);
			impl.add(is_helper);

			auto *not_op = impl.allocate(spv::OpLogicalNot, bool_type);
			not_op->add_id(is_helper->id);
			impl.add(not_op);

			participate_id = not_op->id;

			if (lod_iteration != 0)
			{
				auto *trilinear_and = impl.allocate(spv::OpLogicalAnd, bool_type);
				trilinear_and->add_id(participate_id);
				trilinear_and->add_id(lods.trilinear_enable_id);
				impl.add(trilinear_and);
				participate_id = trilinear_and->id;
			}
		}
		else
		{
			if (lod_iteration == 0)
				participate_id = builder.makeBoolConstant(true);
			else
				participate_id = lods.trilinear_enable_id;
		}

		HelperCall helper_call;
		if (num_coords_full == 3 && meta.non_uniform)
			helper_call = HelperCall::AtomicImageArrayR64CompactNonUniform;
		else if (num_coords_full == 3)
			helper_call = HelperCall::AtomicImageArrayR64Compact;
		else if (meta.non_uniform)
			helper_call = HelperCall::AtomicImageR64CompactNonUniform;
		else
			helper_call = HelperCall::AtomicImageR64Compact;

		spv::Id call_id = impl.spirv_module.get_helper_call_id(helper_call);
		auto *call = impl.allocate(spv::OpFunctionCall, builder.makeVoidType());
		call->add_id(call_id);
		call->add_id(meta.var_id);
		call->add_id(comp_id);
		call->add_id(shift_op->id);
		call->add_id(participate_id);
		impl.add(call);
	}

	return true;
}
} // namespace dxil_spv
