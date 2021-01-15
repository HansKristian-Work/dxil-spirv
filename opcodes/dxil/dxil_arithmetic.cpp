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

#include "dxil_arithmetic.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
bool emit_imad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// FIXME: Do we need to deal with intermediate mul overflow here somehow?

	Operation *mul = impl.allocate(spv::OpIMul, impl.get_type_id(instruction->getType()));
	mul->add_ids(
	    { impl.get_id_for_value(instruction->getOperand(1)), impl.get_id_for_value(instruction->getOperand(2)) });
	impl.add(mul);

	Operation *add = impl.allocate(spv::OpIAdd, instruction);
	add->add_ids({ mul->id, impl.get_id_for_value(instruction->getOperand(3)) });
	impl.add(add);
	return true;
}

bool emit_fmad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450Fma);
	op->add_ids({
	    impl.get_id_for_value(instruction->getOperand(1)),
	    impl.get_id_for_value(instruction->getOperand(2)),
	    impl.get_id_for_value(instruction->getOperand(3)),
	});

	// Not sure about this one. Will have to figure it out when we start looking at tessellation or something ...
	if (instruction->getMetadata("dx.precise") != nullptr)
		builder.addDecoration(op->id, spv::DecorationNoContraction);

	impl.add(op);
	return true;
}

bool emit_isfinite_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	// There is an OpIsFinite instruction, but it's only supported in kernel mode, so we have to decompose here.

	Operation *nan_op = impl.allocate(spv::OpIsNan, builder.makeBoolType());
	Operation *inf_op = impl.allocate(spv::OpIsInf, builder.makeBoolType());
	nan_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	inf_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	impl.add(nan_op);
	impl.add(inf_op);

	Operation *non_finite_op = impl.allocate(spv::OpLogicalOr, builder.makeBoolType());
	non_finite_op->add_ids({ nan_op->id, inf_op->id });
	impl.add(non_finite_op);

	Operation *op = impl.allocate(spv::OpLogicalNot, instruction);
	op->add_id(non_finite_op->id);
	impl.add(op);
	return true;
}

bool emit_find_high_bit_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	// This is actually CLZ, and not FindMSB.
	Operation *msb_op = impl.allocate(spv::OpExtInst, impl.get_type_id(instruction->getType()));
	{
		msb_op->add_id(impl.glsl_std450_ext);
		msb_op->add_literal(opcode);
		msb_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(msb_op);
	}

	Operation *eq_neg1_op = impl.allocate(spv::OpIEqual, builder.makeBoolType());
	{
		eq_neg1_op->add_ids({ msb_op->id, builder.makeUintConstant(~0u) });
		impl.add(eq_neg1_op);
	}

	Operation *msb_sub_op = impl.allocate(spv::OpISub, impl.get_type_id(instruction->getType()));
	{
		msb_sub_op->add_ids({ builder.makeUintConstant(31), msb_op->id });
		impl.add(msb_sub_op);
	}

	Operation *op = impl.allocate(spv::OpSelect, instruction);
	op->add_ids({ eq_neg1_op->id, builder.makeUintConstant(~0u), msb_sub_op->id });
	impl.add(op);
	return true;
}

bool emit_dxil_std450_binary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(opcode);
	op->add_ids({
		            impl.get_id_for_value(instruction->getOperand(1)),
		            impl.get_id_for_value(instruction->getOperand(2))
	            });

	impl.add(op);
	return true;
}

bool emit_dxil_std450_trinary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(opcode);
	op->add_ids({ impl.get_id_for_value(instruction->getOperand(1)),
	              impl.get_id_for_value(instruction->getOperand(2)),
	              impl.get_id_for_value(instruction->getOperand(3)) });

	impl.add(op);
	return true;
}

bool emit_dxil_std450_unary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(opcode);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	impl.add(op);
	return true;
}

bool emit_dxil_unary_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(opcode, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);
	return true;
}

bool emit_saturate_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	spv::Id constant_0, constant_1;

	switch (instruction->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
		constant_0 = builder.makeFloat16Constant(0);
		constant_1 = builder.makeFloat16Constant(0x3c00);
		break;

	case llvm::Type::TypeID::FloatTyID:
		constant_0 = builder.makeFloatConstant(0.0f);
		constant_1 = builder.makeFloatConstant(1.0f);
		break;

	case llvm::Type::TypeID::DoubleTyID:
		constant_0 = builder.makeDoubleConstant(0.0);
		constant_1 = builder.makeDoubleConstant(1.0);
		break;

	default:
		return false;
	}

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450NClamp);
	op->add_ids({ impl.get_id_for_value(instruction->getOperand(1)),
	              constant_0, constant_1 });

	impl.add(op);
	return true;
}

bool emit_dot_instruction(unsigned dimensions, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(spv::OpDot, instruction);

	spv::Id vec0_args[4] = {};
	spv::Id vec1_args[4] = {};
	for (unsigned i = 0; i < dimensions; i++)
		vec0_args[i] = impl.get_id_for_value(instruction->getOperand(1 + i));
	for (unsigned i = 0; i < dimensions; i++)
		vec1_args[i] = impl.get_id_for_value(instruction->getOperand(1 + i + dimensions));

	spv::Id vec0 = impl.build_vector(op->type_id, vec0_args, dimensions);
	spv::Id vec1 = impl.build_vector(op->type_id, vec1_args, dimensions);

	op->add_ids({ vec0, vec1 });
	impl.add(op);
	return true;
}

static spv::Id mask_input(Converter::Impl &impl, const llvm::Value *value)
{
	Operation *op = impl.allocate(spv::OpBitwiseAnd, impl.get_type_id(value->getType()));
	op->add_ids({
	    impl.get_id_for_value(value),
	    impl.builder().makeUintConstant(31),
	});

	impl.add(op);
	return op->id;
}

bool emit_bfe_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// SPIR-V spec doesn't say anything about masking inputs, but Ibfe/Ubfe do, so ...
	spv::Id masked_width_id = mask_input(impl, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(impl, instruction->getOperand(2));

	Operation *op = impl.allocate(opcode, instruction);
	op->add_ids({ impl.get_id_for_value(instruction->getOperand(3)), masked_offset_id, masked_width_id });
	impl.add(op);
	return true;
}

bool emit_bfi_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id masked_width_id = mask_input(impl, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(impl, instruction->getOperand(2));
	spv::Id src_id = impl.get_id_for_value(instruction->getOperand(3));
	spv::Id dst_id = impl.get_id_for_value(instruction->getOperand(4));

	Operation *op = impl.allocate(spv::OpBitFieldInsert, instruction);
	op->add_ids({ dst_id, src_id, masked_offset_id, masked_width_id });
	impl.add(op);

	return true;
}

bool emit_make_double_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450PackDouble2x32);

	spv::Id inputs[2];
	for (unsigned i = 0; i < 2; i++)
		inputs[i] = impl.get_id_for_value(instruction->getOperand(1 + i));
	op->add_id(impl.build_vector(builder.makeUintType(32), inputs, 2));

	impl.add(op);
	return true;
}

bool emit_split_double_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction, builder.makeVectorType(builder.makeUintType(32), 2));
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450UnpackDouble2x32);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);
	return true;
}

bool emit_legacy_f16_to_f32_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *unpack_op = impl.allocate(spv::OpExtInst, builder.makeVectorType(builder.makeFloatType(32), 2));
	unpack_op->add_id(impl.glsl_std450_ext);
	unpack_op->add_literal(GLSLstd450UnpackHalf2x16);
	unpack_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(unpack_op);

	Operation *op = impl.allocate(spv::OpCompositeExtract, instruction);
	op->add_id(unpack_op->id);
	op->add_literal(0);
	impl.add(op);
	return true;
}

bool emit_legacy_f32_to_f16_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450PackHalf2x16);

	spv::Id inputs[2] = { impl.get_id_for_value(instruction->getOperand(1)), builder.makeFloatConstant(0.0f) };
	op->add_id(impl.build_vector(builder.makeFloatType(32), inputs, 2));
	impl.add(op);
	return true;
}

bool emit_bitcast_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto *op = impl.allocate(spv::OpBitcast, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);
	return true;
}

} // namespace dxil_spv
