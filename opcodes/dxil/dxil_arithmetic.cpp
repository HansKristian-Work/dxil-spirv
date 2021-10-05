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

	if (instruction->getMetadata("dx.precise") != nullptr)
	{
		// DXIL docs says to split the expression explicitly.
		// HLSL docs says it just has to be invariant.
		// These conflict since we could have used NoContract FMA instead,
		// but at least Big Navi splits fmac into mul + add when doing nocontract fma(), so ...
		spv::Id type_id = impl.get_type_id(instruction->getType());
		Operation *mul_op = impl.allocate(spv::OpFMul, type_id);
		mul_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		mul_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		impl.add(mul_op);
		builder.addDecoration(mul_op->id, spv::DecorationNoContraction);

		Operation *add_op = impl.allocate(spv::OpFAdd, instruction);
		add_op->add_id(mul_op->id);
		add_op->add_id(impl.get_id_for_value(instruction->getOperand(3)));
		impl.add(add_op);
		builder.addDecoration(add_op->id, spv::DecorationNoContraction);
	}
	else
	{
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
		impl.add(op);
	}

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
		if (impl.support_16bit_operations())
		{
			constant_0 = builder.makeFloat16Constant(0);
			constant_1 = builder.makeFloat16Constant(0x3c00);
		}
		else
		{
			constant_0 = builder.makeFloatConstant(0.0f);
			constant_1 = builder.makeFloatConstant(1.0f);
		}
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

static spv::Id clamp_bitfield_width(Converter::Impl &impl, spv::Id offset, spv::Id width)
{
	auto &builder = impl.builder();
	// D3D has well-defined behavior when width + offset overflows in bitfield instructions.
	// To get similar behavior, we just need to clamp width.
	auto *max_width_op = impl.allocate(spv::OpISub, builder.makeUintType(32));
	max_width_op->add_id(builder.makeUintConstant(32));
	max_width_op->add_id(offset);
	impl.add(max_width_op);

	auto *clamp_op = impl.allocate(spv::OpExtInst, builder.makeUintType(32));
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");
	clamp_op->add_id(impl.glsl_std450_ext);
	clamp_op->add_literal(GLSLstd450UMin);
	clamp_op->add_id(width);
	clamp_op->add_id(max_width_op->id);
	impl.add(clamp_op);
	return clamp_op->id;
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
	masked_width_id = clamp_bitfield_width(impl, masked_offset_id, masked_width_id);

	Operation *op = impl.allocate(opcode, instruction);
	op->add_ids({ impl.get_id_for_value(instruction->getOperand(3)), masked_offset_id, masked_width_id });
	impl.add(op);
	return true;
}

bool emit_bfi_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id masked_width_id = mask_input(impl, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(impl, instruction->getOperand(2));
	masked_width_id = clamp_bitfield_width(impl, masked_offset_id, masked_width_id);

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

static spv::Id build_bfe(Converter::Impl &impl, spv::Id value_id, unsigned offset, unsigned bits, bool sign_extend)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(sign_extend ? spv::OpBitFieldSExtract : spv::OpBitFieldUExtract, builder.makeUintType(32));
	op->add_id(value_id);
	op->add_id(builder.makeUintConstant(offset));
	op->add_id(builder.makeUintConstant(bits));
	impl.add(op);
	return op->id;
}

bool emit_i8_dot_instruction(Converter::Impl &impl, const llvm::CallInst *instruction, bool sign_extend)
{
	auto &builder = impl.builder();
	spv::Id acc = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id a = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id b = impl.get_id_for_value(instruction->getOperand(3));

	if (impl.options.shader_i8_dot_enabled)
	{
		builder.addExtension("SPV_KHR_integer_dot_product");
		builder.addCapability(spv::CapabilityDotProductKHR);
		builder.addCapability(spv::CapabilityDotProductInput4x8BitPackedKHR);

		// Not supposed to saturate.
		auto *dot_op = impl.allocate(sign_extend ? spv::OpSDotKHR : spv::OpUDotKHR, builder.makeUintType(32));
		dot_op->add_id(a);
		dot_op->add_id(b);
		dot_op->add_literal(spv::PackedVectorFormatPackedVectorFormat4x8BitKHR);
		impl.add(dot_op);

		auto *acc_op = impl.allocate(spv::OpIAdd, instruction);
		acc_op->add_id(acc);
		acc_op->add_id(dot_op->id);
		impl.add(acc_op);
	}
	else
	{
		for (unsigned i = 0; i < 4; i++)
		{
			spv::Id a_component = build_bfe(impl, a, 8 * i, 8, sign_extend);
			spv::Id b_component = build_bfe(impl, b, 8 * i, 8, sign_extend);
			auto *mul_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			mul_op->add_id(a_component);
			mul_op->add_id(b_component);
			impl.add(mul_op);

			auto *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
			add_op->add_id(acc);
			add_op->add_id(mul_op->id);
			acc = add_op->id;
			impl.add(add_op);
		}

		impl.rewrite_value(instruction, acc);
	}

	return true;
}

bool emit_dot2_add_half_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id as[2], bs[2];
	as[0] = impl.get_id_for_value(instruction->getOperand(2));
	as[1] = impl.get_id_for_value(instruction->getOperand(3));
	bs[0] = impl.get_id_for_value(instruction->getOperand(4));
	bs[1] = impl.get_id_for_value(instruction->getOperand(5));

	bool precise = instruction->getMetadata("dx.precise") != nullptr;

	// V_DOT2C_F32_F16 is emitted on native drivers, and based on some reversing, the behavior is
	// acc = (float(a.x * b.x) + float(a.y * b.y)) + acc
	// - MUL in FP16
	// - FEXT to FP32
	// - FADD dot results
	// - FADD to acc
	spv::Id half_type_id = builder.makeFloatType(16);
	spv::Id float_type_id = builder.makeFloatType(32);
	spv::Id a = impl.build_vector(half_type_id, as, 2);
	spv::Id b = impl.build_vector(half_type_id, bs, 2);

	auto *dot_op = impl.allocate(spv::OpFMul, builder.makeVectorType(half_type_id, 2));
	dot_op->add_id(a);
	dot_op->add_id(b);
	impl.add(dot_op);
	if (precise)
		builder.addDecoration(dot_op->id, spv::DecorationNoContraction);

	spv::Id expanded_input = dot_op->id;
	if (impl.support_16bit_operations())
	{
		auto *extend_op = impl.allocate(spv::OpFConvert, builder.makeVectorType(float_type_id, 2));
		extend_op->add_id(expanded_input);
		impl.add(extend_op);
		expanded_input = extend_op->id;
	}

	spv::Id components[2];
	for (unsigned i = 0; i < 2; i++)
	{
		auto *extract_op = impl.allocate(spv::OpCompositeExtract, float_type_id);
		extract_op->add_id(expanded_input);
		extract_op->add_literal(i);
		impl.add(extract_op);
		components[i] = extract_op->id;
	}

	auto *dot_sum = impl.allocate(spv::OpFAdd, float_type_id);
	dot_sum->add_id(components[0]);
	dot_sum->add_id(components[1]);
	impl.add(dot_sum);
	if (precise)
		builder.addDecoration(dot_sum->id, spv::DecorationNoContraction);

	auto *acc_op = impl.allocate(spv::OpFAdd, instruction);
	acc_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	acc_op->add_id(dot_sum->id);
	impl.add(acc_op);
	if (precise)
		builder.addDecoration(acc_op->id, spv::DecorationNoContraction);

	return true;
}

} // namespace dxil_spv
