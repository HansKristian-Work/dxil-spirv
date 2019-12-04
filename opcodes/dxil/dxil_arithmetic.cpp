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

#include "dxil_arithmetic.hpp"
#include "opcodes/converter_impl.hpp"

namespace DXIL2SPIRV
{
bool emit_imad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

bool emit_fmad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

bool emit_isfinite_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

bool emit_find_high_bit_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
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

bool emit_dxil_std450_binary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
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

bool emit_dxil_std450_trinary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
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

bool emit_dxil_std450_unary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
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

bool emit_dxil_unary_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl,
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

bool emit_saturate_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

bool emit_dot_instruction(unsigned dimensions,
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

bool emit_bfe_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

bool emit_bfi_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
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

}
