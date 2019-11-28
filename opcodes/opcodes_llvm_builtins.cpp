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

#include "opcodes_llvm_builtins.hpp"
#include "converter_impl.hpp"
#include "logging.hpp"

namespace DXIL2SPIRV
{
bool emit_binary_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::BinaryOperator *instruction)
{
	Operation op;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	uint32_t id0 = impl.get_id_for_value(instruction->getOperand(0));
	uint32_t id1 = impl.get_id_for_value(instruction->getOperand(1));
	op.arguments = { id0, id1 };

	switch (instruction->getOpcode())
	{
	case llvm::BinaryOperator::BinaryOps::FAdd:
		op.op = spv::OpFAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::FSub:
		op.op = spv::OpFSub;
		break;

	case llvm::BinaryOperator::BinaryOps::FMul:
		op.op = spv::OpFMul;
		break;

	case llvm::BinaryOperator::BinaryOps::FDiv:
		op.op = spv::OpFDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::Add:
		op.op = spv::OpIAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::Sub:
		op.op = spv::OpISub;
		break;

	case llvm::BinaryOperator::BinaryOps::Mul:
		op.op = spv::OpIMul;
		break;

	case llvm::BinaryOperator::BinaryOps::SDiv:
		op.op = spv::OpSDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::UDiv:
		op.op = spv::OpUDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::Shl:
		op.op = spv::OpShiftLeftLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::LShr:
		op.op = spv::OpShiftRightLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::AShr:
		op.op = spv::OpShiftRightArithmetic;
		break;

	case llvm::BinaryOperator::BinaryOps::SRem:
		op.op = spv::OpSRem;
		break;

	case llvm::BinaryOperator::BinaryOps::FRem:
		op.op = spv::OpFRem;
		break;

	case llvm::BinaryOperator::BinaryOps::URem:
		// Is this correct? There is no URem.
		op.op = spv::OpUMod;
		break;

	case llvm::BinaryOperator::BinaryOps::Xor:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			op.op = spv::OpLogicalNotEqual;
		else
			op.op = spv::OpBitwiseXor;
		break;

	case llvm::BinaryOperator::BinaryOps::And:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			op.op = spv::OpLogicalAnd;
		else
			op.op = spv::OpBitwiseAnd;
		break;

	case llvm::BinaryOperator::BinaryOps::Or:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			op.op = spv::OpLogicalOr;
		else
			op.op = spv::OpBitwiseOr;
		break;

	default:
		LOGE("Unknown binary operator.\n");
		return false;
	}

	ops.push_back(std::move(op));
	return true;
}

bool emit_unary_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                            const llvm::UnaryOperator *instruction)
{
	Operation op;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	op.arguments = { impl.get_id_for_value(instruction->getOperand(0)) };

	switch (instruction->getOpcode())
	{
	case llvm::UnaryOperator::UnaryOps::FNeg:
		op.op = spv::OpFNegate;
		break;

	default:
		LOGE("Unknown unary operator.\n");
		return false;
	}

	ops.push_back(std::move(op));
	return true;
}

bool emit_cast_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::CastInst *instruction)
{
	Operation op;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	op.arguments = { impl.get_id_for_value(instruction->getOperand(0)) };

	switch (instruction->getOpcode())
	{
	case llvm::CastInst::CastOps::BitCast:
		op.op = spv::OpBitcast;
		break;

	case llvm::CastInst::CastOps::SExt:
		op.op = spv::OpSConvert;
		break;

	case llvm::CastInst::CastOps::Trunc:
	case llvm::CastInst::CastOps::ZExt:
		op.op = spv::OpUConvert;
		break;

	case llvm::CastInst::CastOps::FPTrunc:
	case llvm::CastInst::CastOps::FPExt:
		op.op = spv::OpFConvert;
		break;

	case llvm::CastInst::CastOps::FPToUI:
		op.op = spv::OpConvertFToU;
		break;

	case llvm::CastInst::CastOps::FPToSI:
		op.op = spv::OpConvertFToS;
		break;

	case llvm::CastInst::CastOps::SIToFP:
		op.op = spv::OpConvertSToF;
		break;

	case llvm::CastInst::CastOps::UIToFP:
		op.op = spv::OpConvertUToF;
		break;

	default:
		LOGE("Unknown cast operation.\n");
		return false;
	}

	ops.push_back(std::move(op));
	return true;
}

bool emit_getelementptr_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::GetElementPtrInst *instruction)
{
	// This is actually the same as PtrAccessChain, but we would need to use variable pointers to support that properly.
	// For now, just assert that the first index is constant 0, in which case PtrAccessChain == AccessChain.

	Operation op;
	op.op = instruction->isInBounds() ? spv::OpInBoundsAccessChain : spv::OpAccessChain;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	unsigned num_operands = instruction->getNumOperands();
	for (uint32_t i = 0; i < num_operands; i++)
	{
		auto *operand = instruction->getOperand(i);
		if (i == 1)
		{
			// This one must be constant 0, ignore it.
			if (!llvm::isa<llvm::ConstantInt>(operand))
			{
				LOGE("First GetElementPtr operand is not constant 0.\n");
				return false;
			}

			if (llvm::cast<llvm::ConstantInt>(operand)->getUniqueInteger().getZExtValue() != 0)
			{
				LOGE("First GetElementPtr operand is not constant 0.\n");
				return false;
			}
		}
		else
			op.arguments.push_back(impl.get_id_for_value(operand));
	}

	ops.push_back(std::move(op));
	return true;
}

bool emit_load_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::LoadInst *instruction)
{
	Operation op;
	op.op = spv::OpLoad;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.get_id_for_value(instruction->getPointerOperand()) };

	ops.push_back(std::move(op));
	return true;
}

bool emit_store_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                            const llvm::StoreInst *instruction)
{
	Operation op;
	op.op = spv::OpStore;
	op.arguments = { impl.get_id_for_value(instruction->getOperand(1)),
		             impl.get_id_for_value(instruction->getOperand(0)) };

	ops.push_back(std::move(op));
	return true;
}

bool emit_compare_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CmpInst *instruction)
{
	Operation op;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	uint32_t id0 = impl.get_id_for_value(instruction->getOperand(0));
	uint32_t id1 = impl.get_id_for_value(instruction->getOperand(1));
	op.arguments = { id0, id1 };

	switch (instruction->getPredicate())
	{
	case llvm::CmpInst::Predicate::FCMP_OEQ:
		op.op = spv::OpFOrdEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UEQ:
		op.op = spv::OpFUnordEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_OGT:
		op.op = spv::OpFOrdGreaterThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_UGT:
		op.op = spv::OpFUnordGreaterThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_OGE:
		op.op = spv::OpFOrdGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UGE:
		op.op = spv::OpFUnordGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_OLT:
		op.op = spv::OpFOrdLessThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_ULT:
		op.op = spv::OpFUnordLessThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_OLE:
		op.op = spv::OpFOrdLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_ULE:
		op.op = spv::OpFUnordLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_ONE:
		op.op = spv::OpFOrdNotEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UNE:
		op.op = spv::OpFUnordNotEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_FALSE:
		// Why on earth is this a thing ...
		op.op = spv::OpCopyLogical;
		op.arguments = { builder.makeBoolConstant(false) };
		break;

	case llvm::CmpInst::Predicate::FCMP_TRUE:
		// Why on earth is this a thing ...
		op.op = spv::OpCopyLogical;
		op.arguments = { builder.makeBoolConstant(true) };
		break;

	case llvm::CmpInst::Predicate::ICMP_EQ:
		op.op = spv::OpIEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_NE:
		op.op = spv::OpINotEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLT:
		op.op = spv::OpSLessThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLE:
		op.op = spv::OpSLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGT:
		op.op = spv::OpSGreaterThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGE:
		op.op = spv::OpSGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_ULT:
		op.op = spv::OpULessThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_ULE:
		op.op = spv::OpULessThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_UGT:
		op.op = spv::OpUGreaterThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_UGE:
		op.op = spv::OpUGreaterThanEqual;
		break;

	default:
		LOGE("Unknown CmpInst predicate.\n");
		break;
	}

	ops.push_back(std::move(op));
	return true;
}

bool emit_extract_value_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::ExtractValueInst *instruction)
{
	Operation op;
	op.op = spv::OpCompositeExtract;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	op.arguments.push_back(impl.get_id_for_value(instruction->getAggregateOperand()));
	for (unsigned i = 0; i < instruction->getNumIndices(); i++)
		op.arguments.push_back(instruction->getIndices()[i]);

	ops.push_back(std::move(op));
	return true;
}

bool emit_alloca_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::AllocaInst *instruction)
{
	spv::Id pointee_type_id = impl.get_type_id(instruction->getType()->getPointerElementType());

	// DXC seems to allocate arrays on stack as 1 element of array type rather than N elements of basic non-array type.
	// Should be possible to support both schemes if desirable, but this will do.
	if (!llvm::isa<llvm::ConstantInt>(instruction->getArraySize()))
	{
		LOGE("Array size for alloca must be constant int.\n");
		return false;
	}

	if (llvm::cast<llvm::ConstantInt>(instruction->getArraySize())->getUniqueInteger().getZExtValue() != 1)
	{
		LOGE("Alloca array size must be constant 1.\n");
		return false;
	}

	spv::Id var_id = builder.createVariable(spv::StorageClassFunction, pointee_type_id, instruction->getName().data());
	impl.value_map[instruction] = var_id;
	return true;
}

bool emit_select_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                             const llvm::SelectInst *instruction)
{
	Operation op;
	op.op = spv::OpSelect;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	op.arguments = {
		impl.get_id_for_value(instruction->getOperand(0)),
		impl.get_id_for_value(instruction->getOperand(1)),
		impl.get_id_for_value(instruction->getOperand(2)),
	};

	ops.push_back(std::move(op));
	return true;
}
} // namespace DXIL2SPIRV
