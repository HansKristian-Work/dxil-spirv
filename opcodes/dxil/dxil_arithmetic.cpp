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

#include "dxil_arithmetic.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
bool emit_imad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// FIXME: Do we need to deal with intermediate mul overflow here somehow?

	Operation *mul = impl.allocate(spv::OpIMul, impl.get_type_id(instruction->getType()));
	mul->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	mul->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	impl.add(mul);

	Operation *add = impl.allocate(spv::OpIAdd, instruction);
	add->add_id(mul->id);
	add->add_id(impl.get_id_for_value(instruction->getOperand(3)));
	impl.add(add);
	return true;
}

bool emit_fmad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id result_id;

	if (instruction->hasMetadata("dx.precise") || impl.options.force_precise)
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

		impl.decorate_relaxed_precision(instruction->getType(), mul_op->id, false);

		Operation *add_op = impl.allocate(spv::OpFAdd, instruction);
		add_op->add_id(mul_op->id);
		add_op->add_id(impl.get_id_for_value(instruction->getOperand(3)));
		impl.add(add_op);
		builder.addDecoration(add_op->id, spv::DecorationNoContraction);

		result_id = add_op->id;
	}
	else
	{
		if (!impl.glsl_std450_ext)
			impl.glsl_std450_ext = builder.import("GLSL.std.450");

		Operation *op = impl.allocate(spv::OpExtInst, instruction);
		op->add_id(impl.glsl_std450_ext);
		op->add_literal(GLSLstd450Fma);
		for (unsigned i = 1; i < 4; i++)
			op->add_id(impl.get_id_for_value(instruction->getOperand(i)));
		impl.add(op);

		result_id = op->id;
	}

	impl.decorate_relaxed_precision(instruction->getType(), result_id, false);
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

spv::Id emit_native_bitscan(GLSLstd450 opcode, Converter::Impl &impl,
                            const llvm::Instruction *instruction, const llvm::Value *value)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op;

	// Vulkan currently does not allow 16/64-bit for these ... :(
	if (value->getType()->getIntegerBitWidth() == 16)
	{
		auto *extend = impl.allocate(
		    opcode == GLSLstd450FindSMsb ? spv::OpSConvert : spv::OpUConvert, builder.makeUintType(32));

		extend->add_id(impl.get_id_for_value(value));
		impl.add(extend);

		if (instruction)
			op = impl.allocate(spv::OpExtInst, instruction);
		else
			op = impl.allocate(spv::OpExtInst, builder.makeUintType(32));

		op->add_id(impl.glsl_std450_ext);
		op->add_literal(opcode);
		op->add_id(extend->id);
	}
	else if (value->getType()->getIntegerBitWidth() == 64)
	{
		spv::Id uint_type = builder.makeUintType(32);
		spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);

		auto *bitcast = impl.allocate(spv::OpBitcast, uvec2_type);
		bitcast->add_id(impl.get_id_for_value(value));
		impl.add(bitcast);

		if (opcode == GLSLstd450FindSMsb)
		{
			auto *ext = impl.allocate(spv::OpCompositeExtract, uint_type);
			ext->add_id(bitcast->id);
			ext->add_literal(1);
			impl.add(ext);

			spv::Id int_type = builder.makeIntType(32);
			auto *shifted = impl.allocate(spv::OpShiftRightArithmetic, int_type);
			shifted->add_id(ext->id);
			shifted->add_id(builder.makeIntConstant(31));
			impl.add(shifted);

			const spv::Id elems[] = { shifted->id, shifted->id };

			auto *xored = impl.allocate(spv::OpBitwiseXor, uvec2_type);
			xored->add_id(bitcast->id);
			xored->add_id(impl.build_vector(int_type, elems, 2));
			impl.add(xored);

			bitcast = xored;
			opcode = GLSLstd450FindUMsb;
		}

		auto *ilsb = impl.allocate(spv::OpExtInst, uvec2_type);
		ilsb->add_id(impl.glsl_std450_ext);
		ilsb->add_literal(opcode);
		ilsb->add_id(bitcast->id);
		impl.add(ilsb);

		spv::Id scalars[2];
		for (int i = 0; i < 2; i++)
		{
			auto *ext = impl.allocate(spv::OpCompositeExtract, uint_type);
			ext->add_id(ilsb->id);
			ext->add_literal(i);
			impl.add(ext);
			scalars[i] = ext->id;
		}

		auto *or32 = impl.allocate(spv::OpBitwiseOr, uint_type);
		or32->add_id(scalars[1]);
		or32->add_id(builder.makeUintConstant(32));
		impl.add(or32);
		scalars[1] = or32->id;

		auto merge_op = opcode == GLSLstd450FindILsb ? GLSLstd450UMin : GLSLstd450SMax;

		if (instruction)
			op = impl.allocate(spv::OpExtInst, instruction);
		else
			op = impl.allocate(spv::OpExtInst, uint_type);

		op->add_id(impl.glsl_std450_ext);
		op->add_literal(merge_op);
		op->add_id(scalars[0]);
		op->add_id(scalars[1]);
	}
	else
	{
		if (instruction)
			op = impl.allocate(spv::OpExtInst, instruction);
		else
			op = impl.allocate(spv::OpExtInst, builder.makeUintType(32));

		op->add_id(impl.glsl_std450_ext);
		op->add_literal(opcode);
		op->add_id(impl.get_id_for_value(value));
	}

	impl.add(op);
	return op->id;
}

bool emit_find_low_bit_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	emit_native_bitscan(GLSLstd450FindILsb, impl, instruction, instruction->getOperand(1));
	return true;
}

bool emit_find_high_bit_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// This is actually CLZ, and not FindMSB.
	auto *value = instruction->getOperand(1);
	spv::Id msb_id = emit_native_bitscan(opcode, impl, nullptr, value);

	Operation *eq_neg1_op = impl.allocate(spv::OpIEqual, builder.makeBoolType());
	{
		eq_neg1_op->add_ids({ msb_id, builder.makeUintConstant(~0u) });
		impl.add(eq_neg1_op);
	}

	Operation *msb_sub_op = impl.allocate(spv::OpISub, impl.get_type_id(instruction->getType()));
	{
		msb_sub_op->add_ids({
		    builder.makeUintConstant(value->getType()->getIntegerBitWidth() - 1),
		    msb_id
		});
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
	for (unsigned i = 1; i < 3; i++)
		op->add_id(impl.get_id_for_value(instruction->getOperand(i)));

	impl.add(op);
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
	return true;
}

bool emit_dxil_wide_mul_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id u32_type = builder.makeUintType(32);

	// Demote to plain multiply.
	auto composite_itr = impl.llvm_composite_meta.find(instruction);
	if (composite_itr != impl.llvm_composite_meta.end() && composite_itr->second.access_mask == 0x2)
	{
		Operation *mul_op = impl.allocate(spv::OpIMul, instruction, u32_type);
		mul_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		mul_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		impl.add(mul_op);
		composite_itr->second.components = 1;
		composite_itr->second.forced_composite = false;
		return true;
	}

	Operation *mul_op = impl.allocate(opcode, impl.get_type_id(instruction->getType()));
	mul_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	mul_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	impl.add(mul_op);

	spv::Id extracted_values[2];
	for (uint32_t i = 0; i < 2; i++)
	{
		auto *ext_op = impl.allocate(spv::OpCompositeExtract, u32_type);
		ext_op->add_id(mul_op->id);
		ext_op->add_literal(i);
		impl.add(ext_op);
		extracted_values[1 - i] = ext_op->id;
	}

	spv::Id result = impl.build_vector(u32_type, extracted_values, 2);
	impl.rewrite_value(instruction, result);

	return true;
}

bool emit_dxbc_udiv_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id id0 = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id id1 = impl.get_id_for_value(instruction->getOperand(2));

	auto *div_op = impl.allocate(spv::OpUDiv, builder.makeUintType(32));
	div_op->add_id(id0);
	div_op->add_id(id1);
	impl.add(div_op);

	auto *mod_op = impl.allocate(spv::OpUMod, builder.makeUintType(32));
	mod_op->add_id(id0);
	mod_op->add_id(id1);
	impl.add(mod_op);

	auto *is_zero_divider = impl.allocate(spv::OpIEqual, builder.makeBoolType());
	is_zero_divider->add_id(id1);
	is_zero_divider->add_id(builder.makeUintConstant(0));
	impl.add(is_zero_divider);

	auto *quot_select = impl.allocate(spv::OpSelect, builder.makeUintType(32));
	quot_select->add_id(is_zero_divider->id);
	quot_select->add_id(builder.makeUintConstant(UINT32_MAX));
	quot_select->add_id(div_op->id);
	impl.add(quot_select);

	auto *rem_select = impl.allocate(spv::OpSelect, builder.makeUintType(32));
	rem_select->add_id(is_zero_divider->id);
	rem_select->add_id(builder.makeUintConstant(UINT32_MAX));
	rem_select->add_id(mod_op->id);
	impl.add(rem_select);

	spv::Id elems[2] = { quot_select->id, rem_select->id };
	impl.rewrite_value(instruction, impl.build_vector(builder.makeUintType(32), elems, 2));
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

	for (unsigned i = 1; i < 4; i++)
		op->add_id(impl.get_id_for_value(instruction->getOperand(i)));

	impl.add(op);
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
	return true;
}

bool emit_dxil_std450_unary_instruction(GLSLstd450 opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// Games rely on this peephole, since DXC doesn't do it for us.
	if (opcode == GLSLstd450Exp2 || opcode == GLSLstd450Log2)
	{
		bool precise = instruction->hasMetadata("dx.precise") || impl.options.force_precise;
		if (!precise)
		{
			if ((opcode == GLSLstd450Exp2 && value_is_dx_op_instrinsic(instruction->getOperand(1), DXIL::Op::Log)) ||
			    (value_is_dx_op_instrinsic(instruction->getOperand(1), DXIL::Op::Exp)))
			{
				auto *base_value = llvm::cast<llvm::CallInst>(instruction->getOperand(1))->getOperand(1);
				impl.rewrite_value(instruction, impl.get_id_for_value(base_value));
				return true;
			}
		}
	}

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(opcode);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	impl.add(op);
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
	return true;
}

bool emit_dxil_unary_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	Operation *op = impl.allocate(opcode, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
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
		if (impl.support_native_fp16_operations())
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
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
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
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);

	bool precise = instruction->hasMetadata("dx.precise") || impl.options.force_precise;
	if (precise)
		impl.builder().addDecoration(op->id, spv::DecorationNoContraction);

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
	op->add_id(impl.get_id_for_value(value));
	op->add_id(impl.builder().makeUintConstant(31));
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

	// By construction, these are relaxed precision, but spams lots of unrelated shader changes,
	// and doesn't make too much sense to add ...
	//builder.addDecoration(unpack_op->id, spv::DecorationRelaxedPrecision);

	Operation *op = impl.allocate(spv::OpCompositeExtract, instruction);
	op->add_id(unpack_op->id);
	op->add_literal(0);
	impl.add(op);

	// By construction, these are relaxed precision, but spams lots of unrelated shader changes,
	// and doesn't make too much sense to add ...
	//builder.addDecoration(op->id, spv::DecorationRelaxedPrecision);

	return true;
}

bool emit_legacy_f32_to_f16_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	// According to D3D11 functional spec (and implementations), this is required to be RTZ.
	// We have no obvious way of getting this behavior on a per-instruction basis,
	// and it is too expensive/complicated to implement this behavior exactly.
	// In practice, we have observed cases where this matters in HZD, but we don't really need RTZ, we just
	// need invariance to be preserved for an FP16 write and the following unpack of that expression.
	// QuantizeToFP16 ensures a baseline which works for the time being on the affected implementations.
	// - Polaris / Vega: RTZ rounding can be optimized to RTE rounding with just plain packHalf, which breaks invariance.
	// - NV: packHalf / unpackHalf pairs are optimized away, leaving full FP32 precision.
	// Ideally we'd have a PackHalf variant which takes rounding mode / denorm mode to be correct, but alas ...
	// Only do this hack when heuristics deduce it to be necessary.
	spv::Id input_id = impl.get_id_for_value(instruction->getOperand(1));

	if (impl.shader_analysis.precise_f16_to_f32_observed)
	{
		auto *quant_op = impl.allocate(spv::OpQuantizeToF16, builder.makeFloatType(32));
		quant_op->add_id(input_id);
		impl.add(quant_op);
		input_id = quant_op->id;
	}

	Operation *op = impl.allocate(spv::OpExtInst, instruction);
	op->add_id(impl.glsl_std450_ext);
	op->add_literal(GLSLstd450PackHalf2x16);

	spv::Id inputs[2] = { input_id, builder.makeFloatConstant(0.0f) };
	op->add_id(impl.build_vector(builder.makeFloatType(32), inputs, 2));
	impl.add(op);
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
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

	bool precise = instruction->hasMetadata("dx.precise") || impl.options.force_precise;

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
	if (impl.support_native_fp16_operations())
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

	// This opcode requires native FP16, so RelaxedPrecision is useless.

	return true;
}

bool emit_unpack4x8_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityInt8);

	auto *bitcast_op = impl.allocate(spv::OpBitcast, builder.makeVectorType(builder.makeUintType(8), 4));
	bitcast_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
	impl.add(bitcast_op);

	uint32_t signed_expand;
	if (!get_constant_operand(instruction, 1, &signed_expand))
		return false;

	auto *element_type = instruction->getType()->getStructElementType(0);
	spv::Id result_type = builder.makeVectorType(impl.get_type_id(element_type), 4);

	auto *expand_op = impl.allocate(signed_expand ? spv::OpSConvert : spv::OpUConvert,
	                                instruction, result_type);
	expand_op->add_id(bitcast_op->id);
	impl.add(expand_op);

	return true;
}

bool emit_pack4x8_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityInt8);

	auto *element_type = instruction->getOperand(2)->getType();
	spv::Id uint_type = impl.get_type_id(element_type);

	uint32_t clamp_op_literal;
	if (!get_constant_operand(instruction, 1, &clamp_op_literal))
		return false;

	spv::Id elements[4];
	for (unsigned i = 0; i < 4; i++)
		elements[i] = impl.get_id_for_value(instruction->getOperand(2 + i));

	spv::Id vec_id = impl.build_vector(uint_type, elements, 4);
	if (clamp_op_literal != 0)
	{
		// Signed saturate with u8 range or s8 range.
		if (!impl.glsl_std450_ext)
			impl.glsl_std450_ext = builder.import("GLSL.std.450");

		spv::Id lo_id, hi_id;
		if (element_type->getIntegerBitWidth() == 16)
		{
			lo_id = builder.makeInt16Constant(clamp_op_literal == 1 ? 0 : -128);
			hi_id = builder.makeInt16Constant(clamp_op_literal == 1 ? 255 : 127);
		}
		else
		{
			lo_id = builder.makeIntConstant(clamp_op_literal == 1 ? 0 : -128);
			hi_id = builder.makeIntConstant(clamp_op_literal == 1 ? 255 : 127);
		}

		Vector<spv::Id> lo_ids = { lo_id, lo_id, lo_id, lo_id };
		Vector<spv::Id> hi_ids = { hi_id, hi_id, hi_id, hi_id };

		spv::Id int_type = builder.makeIntType(element_type->getIntegerBitWidth());
		spv::Id int4_type = builder.makeVectorType(int_type, 4);
		lo_id = builder.makeCompositeConstant(int4_type, lo_ids);
		hi_id = builder.makeCompositeConstant(int4_type, hi_ids);

		auto *clamp_op = impl.allocate(spv::OpExtInst, int4_type);
		clamp_op->add_id(impl.glsl_std450_ext);
		clamp_op->add_literal(GLSLstd450SClamp);
		clamp_op->add_id(vec_id);
		clamp_op->add_id(lo_id);
		clamp_op->add_id(hi_id);
		impl.add(clamp_op);
		vec_id = clamp_op->id;
	}

	auto *narrow_op = impl.allocate(spv::OpUConvert, builder.makeVectorType(builder.makeUintType(8), 4));
	narrow_op->add_id(vec_id);
	impl.add(narrow_op);

	auto *bitcast_op = impl.allocate(spv::OpBitcast, instruction);
	bitcast_op->add_id(narrow_op->id);
	impl.add(bitcast_op);

	return true;
}

bool emit_msad_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	// Don't modify this implementation since compilers pattern match this.

	spv::Id uint32_scalar_type = builder.makeUintType(32);
	spv::Id uint32_vector_type = builder.makeVectorType(uint32_scalar_type, 4);
	spv::Id bool_type = builder.makeVectorType(builder.makeBoolType(), 4);

	Vector<spv::Id> ref_byte_ids = { 0, 0, 0, 0 };
	Vector<spv::Id> src_byte_ids = { 0, 0, 0, 0 };

	for (uint32_t i = 0; i < 4; i++)
	{
		auto *ref_bfe_op = impl.allocate(spv::OpBitFieldUExtract, uint32_scalar_type);
		ref_bfe_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		ref_bfe_op->add_id(builder.makeUintConstant(8 * i));
		ref_bfe_op->add_id(builder.makeUintConstant(8));
		impl.add(ref_bfe_op);

		auto *src_bfe_op = impl.allocate(spv::OpBitFieldUExtract, uint32_scalar_type);
		src_bfe_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
		src_bfe_op->add_id(builder.makeUintConstant(8 * i));
		src_bfe_op->add_id(builder.makeUintConstant(8));
		impl.add(src_bfe_op);

		ref_byte_ids[i] = ref_bfe_op->id;
		src_byte_ids[i] = src_bfe_op->id;
	}

	auto *ref_composite_op = impl.allocate(spv::OpCompositeConstruct, uint32_vector_type);
	for (uint32_t i = 0; i < 4; i++)
		ref_composite_op->add_id(ref_byte_ids[i]);
	impl.add(ref_composite_op);

	auto *src_composite_op = impl.allocate(spv::OpCompositeConstruct, uint32_vector_type);
	for (uint32_t i = 0; i < 4; i++)
		src_composite_op->add_id(src_byte_ids[i]);
	impl.add(src_composite_op);

	spv::Id zero_vector = builder.makeNullConstant(uint32_vector_type);

	auto *compare_ref_zero_op = impl.allocate(spv::OpIEqual, bool_type);
	compare_ref_zero_op->add_id(ref_composite_op->id);
	compare_ref_zero_op->add_id(zero_vector);
	impl.add(compare_ref_zero_op);

	auto *ref_src_diff_op = impl.allocate(spv::OpISub, uint32_vector_type);
	ref_src_diff_op->add_id(ref_composite_op->id);
	ref_src_diff_op->add_id(src_composite_op->id);
	impl.add(ref_src_diff_op);

	auto *abs_diff_op = impl.allocate(spv::OpExtInst, uint32_vector_type);
	abs_diff_op->add_id(impl.glsl_std450_ext);
	abs_diff_op->add_literal(GLSLstd450SAbs);
	abs_diff_op->add_id(ref_src_diff_op->id);
	impl.add(abs_diff_op);

	auto *masked_diff_op = impl.allocate(spv::OpSelect, uint32_vector_type);
	masked_diff_op->add_id(compare_ref_zero_op->id);
	masked_diff_op->add_id(zero_vector);
	masked_diff_op->add_id(abs_diff_op->id);
	impl.add(masked_diff_op);

	spv::Id sum_id = 0;

	for (uint32_t i = 0; i < 4; i++)
	{
		auto *extract_op = impl.allocate(spv::OpCompositeExtract, uint32_scalar_type);
		extract_op->add_id(masked_diff_op->id);
		extract_op->add_literal(i);
		impl.add(extract_op);

		if (sum_id)
		{
			auto *add_op = impl.allocate(spv::OpIAdd, uint32_scalar_type);
			add_op->add_id(sum_id);
			add_op->add_id(extract_op->id);
			impl.add(add_op);

			sum_id = add_op->id;
		}
		else
			sum_id = extract_op->id;
	}

	/* DXIL docs say that the addition should saturate on overflow,
	 * but but drivers don't seem to do that. */
	auto *add_op = impl.allocate(spv::OpIAdd, instruction);
	add_op->add_id(impl.get_id_for_value(instruction->getOperand(3)));
	add_op->add_id(sum_id);
	impl.add(add_op);

	return true;
}

bool emit_bit_reverse_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto int_width = instruction->getType()->getIntegerBitWidth();

	if (int_width == 32)
	{
		auto *op = impl.allocate(spv::OpBitReverse, instruction);
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(op);
		return true;
	}
	else if (int_width == 16)
	{
		spv::Id uint_type = builder.makeUintType(32);
		spv::Id u16_type = builder.makeUintType(16);
		spv::Id u16vec2_type = builder.makeVectorType(u16_type, 2);

		auto *conv_op = impl.allocate(spv::OpUConvert, uint_type);
		conv_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(conv_op);

		auto *reverse_op = impl.allocate(spv::OpBitReverse, uint_type);
		reverse_op->add_id(conv_op->id);
		impl.add(reverse_op);

		auto *cast_op = impl.allocate(spv::OpBitcast, u16vec2_type);
		cast_op->add_id(reverse_op->id);
		impl.add(cast_op);

		auto *ext1 = impl.allocate(spv::OpCompositeExtract, instruction);
		ext1->add_id(cast_op->id);
		ext1->add_literal(1);
		impl.add(ext1);
		return true;
	}
	else if (int_width == 64)
	{
		spv::Id uint_type = builder.makeUintType(32);
		spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);

		auto *conv_op = impl.allocate(spv::OpBitcast, uvec2_type);
		conv_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(conv_op);

		auto *reverse_op = impl.allocate(spv::OpBitReverse, uvec2_type);
		reverse_op->add_id(conv_op->id);
		impl.add(reverse_op);

		auto *shuf_op = impl.allocate(spv::OpVectorShuffle, uvec2_type);
		shuf_op->add_id(reverse_op->id);
		shuf_op->add_id(reverse_op->id);
		shuf_op->add_literal(1);
		shuf_op->add_literal(0);
		impl.add(shuf_op);

		auto *cast_op = impl.allocate(spv::OpBitcast, instruction);
		cast_op->add_id(shuf_op->id);
		impl.add(cast_op);

		return true;
	}

	return false;
}

bool emit_bit_count_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Vulkan only allows 32-bit types here for whatever reason ...
	auto &builder = impl.builder();
	auto int_width = instruction->getOperand(1)->getType()->getIntegerBitWidth();

	if (int_width == 32)
	{
		auto *op = impl.allocate(spv::OpBitCount, instruction);
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(op);
		return true;
	}
	else if (int_width == 16)
	{
		auto *conv_op = impl.allocate(spv::OpUConvert, builder.makeUintType(32));
		conv_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(conv_op);

		auto *op = impl.allocate(spv::OpBitCount, instruction);
		op->add_id(conv_op->id);
		impl.add(op);
		return true;
	}
	else if (int_width == 64)
	{
		spv::Id uint_type = builder.makeUintType(32);
		spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);

		auto *conv_op = impl.allocate(spv::OpBitcast, uvec2_type);
		conv_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(conv_op);

		auto *count_op = impl.allocate(spv::OpBitCount, uvec2_type);
		count_op->add_id(conv_op->id);
		impl.add(count_op);

		auto *ext0 = impl.allocate(spv::OpCompositeExtract, uint_type);
		ext0->add_id(count_op->id);
		ext0->add_literal(0);
		impl.add(ext0);

		auto *ext1 = impl.allocate(spv::OpCompositeExtract, uint_type);
		ext1->add_id(count_op->id);
		ext1->add_literal(1);
		impl.add(ext1);

		auto *add_op = impl.allocate(spv::OpIAdd, instruction);
		add_op->add_id(ext0->id);
		add_op->add_id(ext1->id);
		impl.add(add_op);
		return true;
	}

	return false;
}

bool emit_legacy_double_conv_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id input_value = impl.get_id_for_value(instruction->getOperand(1));

	// We probably need round-to-zero semantics here, but w/e.
	if (opcode != spv::OpFConvert)
	{
		auto &builder = impl.builder();
		// Clamp to target range.
		if (!impl.glsl_std450_ext)
			impl.glsl_std450_ext = builder.import("GLSL.std.450");

		auto *clamp_op = impl.allocate(spv::OpExtInst, builder.makeFloatType(64));
		clamp_op->add_id(impl.glsl_std450_ext);
		clamp_op->add_literal(GLSLstd450NClamp);
		clamp_op->add_id(input_value);
		clamp_op->add_id(builder.makeDoubleConstant(opcode == spv::OpConvertFToU ? 0.0 : double(INT32_MIN)));
		clamp_op->add_id(builder.makeDoubleConstant(opcode == spv::OpConvertFToU ? double(UINT32_MAX) : double(INT32_MAX)));

		impl.add(clamp_op);
		input_value = clamp_op->id;
	}

	auto *op = impl.allocate(opcode, instruction);
	op->add_id(input_value);
	impl.add(op);
	return true;
}
} // namespace dxil_spv
