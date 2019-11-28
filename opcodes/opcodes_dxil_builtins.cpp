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
		op.id = impl.allocate_id();
		op.type_id = type_id;
		op.arguments = { image_id };
		impl.id_to_type[op.id] = type_id;
		impl.handle_to_ptr_id[instruction] = op.id;
		ops.push_back(std::move(op));
		break;
	}

	case DXIL::ResourceType::UAV:
		impl.handle_to_ptr_id[instruction] = impl.uav_index_to_id[resource_range];
		break;

	case DXIL::ResourceType::CBV:
		impl.handle_to_ptr_id[instruction] = impl.cbv_index_to_id[resource_range];
		break;

	case DXIL::ResourceType::Sampler:
	{
		spv::Id sampler_id = impl.sampler_index_to_id[resource_range];
		spv::Id type_id = builder.getDerefTypeId(sampler_id);
		Operation op;
		op.op = spv::OpLoad;
		op.id = impl.allocate_id();
		op.type_id = type_id;
		op.arguments = { sampler_id };
		impl.handle_to_ptr_id[instruction] = op.id;
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

static bool emit_sample_grad_instruction(std::vector<Operation> &ops, Converter::Impl &impl,
                                         spv::Builder &builder, const llvm::CallInst *instruction)
{
	spv::Id image_id = impl.handle_to_ptr_id[instruction->getOperand(1)];
	spv::Id sampler_id = impl.handle_to_ptr_id[instruction->getOperand(2)];
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, false);

	spv::Id image_type_id = impl.get_type_id(image_id);
	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool arrayed = builder.isArrayedImageType(image_type_id);

	unsigned num_coords;
	switch (dim)
	{
	case spv::Dim1D:
	case spv::DimBuffer:
		num_coords = 1;
		break;

	case spv::Dim2D:
		num_coords = 2;
		break;

	case spv::Dim3D:
	case spv::DimCube:
		num_coords = 3;
		break;

	default:
		LOGE("Unexpected sample dimensionality.\n");
		return false;
	}

	unsigned num_coords_full = arrayed ? num_coords + 1 : num_coords;
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

	spv::Id image_id = impl.handle_to_ptr_id[instruction->getOperand(1)];
	spv::Id sampler_id = impl.handle_to_ptr_id[instruction->getOperand(2)];
	spv::Id combined_image_sampler_id = impl.build_sampled_image(ops, image_id, sampler_id, comparison_sampling);

	spv::Id image_type_id = impl.get_type_id(image_id);

	spv::Dim dim = builder.getTypeDimensionality(image_type_id);
	bool arrayed = builder.isArrayedImageType(image_type_id);

	unsigned num_coords;
	switch (dim)
	{
	case spv::Dim1D:
	case spv::DimBuffer:
		num_coords = 1;
		break;

	case spv::Dim2D:
		num_coords = 2;
		break;

	case spv::Dim3D:
	case spv::DimCube:
		num_coords = 3;
		break;

	default:
		LOGE("Unexpected sample dimensionality.\n");
		return false;
	}

	unsigned num_coords_full = arrayed ? num_coords + 1 : num_coords;

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

template <GLSLstd450 opcode>
static bool std450_binary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl,
                                   spv::Builder &builder, const llvm::CallInst *instruction)
{
	return emit_dxil_std450_binary_instruction(opcode, ops, impl, builder, instruction);
}

template <GLSLstd450 opcode>
static bool std450_unary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl,
                                  spv::Builder &builder, const llvm::CallInst *instruction)
{
	return emit_dxil_std450_unary_instruction(opcode, ops, impl, builder, instruction);
}

template <spv::Op opcode>
static bool unary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl,
                                  spv::Builder &builder, const llvm::CallInst *instruction)
{
	return emit_dxil_unary_instruction(opcode, ops, impl, builder, instruction);
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

		OP(FMin) = std450_binary_dispatch<GLSLstd450NMin>;
		OP(FMax) = std450_binary_dispatch<GLSLstd450NMax>;
		OP(IMin) = std450_binary_dispatch<GLSLstd450SMin>;
		OP(IMax) = std450_binary_dispatch<GLSLstd450SMax>;
		OP(UMin) = std450_binary_dispatch<GLSLstd450UMin>;
		OP(UMax) = std450_binary_dispatch<GLSLstd450UMax>;
		OP(IsNan) = unary_dispatch<spv::OpIsNan>;
		OP(IsInf) = unary_dispatch<spv::OpIsInf>;

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
