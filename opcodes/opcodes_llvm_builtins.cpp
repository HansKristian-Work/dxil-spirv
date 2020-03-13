/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

namespace dxil_spv
{
bool emit_binary_instruction(Converter::Impl &impl, const llvm::BinaryOperator *instruction)
{
	spv::Op opcode;
	switch (instruction->getOpcode())
	{
	case llvm::BinaryOperator::BinaryOps::FAdd:
		opcode = spv::OpFAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::FSub:
		opcode = spv::OpFSub;
		break;

	case llvm::BinaryOperator::BinaryOps::FMul:
		opcode = spv::OpFMul;
		break;

	case llvm::BinaryOperator::BinaryOps::FDiv:
		opcode = spv::OpFDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::Add:
		opcode = spv::OpIAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::Sub:
		opcode = spv::OpISub;
		break;

	case llvm::BinaryOperator::BinaryOps::Mul:
		opcode = spv::OpIMul;
		break;

	case llvm::BinaryOperator::BinaryOps::SDiv:
		opcode = spv::OpSDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::UDiv:
		opcode = spv::OpUDiv;
		break;

	case llvm::BinaryOperator::BinaryOps::Shl:
		opcode = spv::OpShiftLeftLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::LShr:
		opcode = spv::OpShiftRightLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::AShr:
		opcode = spv::OpShiftRightArithmetic;
		break;

	case llvm::BinaryOperator::BinaryOps::SRem:
		opcode = spv::OpSRem;
		break;

	case llvm::BinaryOperator::BinaryOps::FRem:
		opcode = spv::OpFRem;
		break;

	case llvm::BinaryOperator::BinaryOps::URem:
		// Is this correct? There is no URem.
		opcode = spv::OpUMod;
		break;

	case llvm::BinaryOperator::BinaryOps::Xor:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalNotEqual;
		else
			opcode = spv::OpBitwiseXor;
		break;

	case llvm::BinaryOperator::BinaryOps::And:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalAnd;
		else
			opcode = spv::OpBitwiseAnd;
		break;

	case llvm::BinaryOperator::BinaryOps::Or:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalOr;
		else
			opcode = spv::OpBitwiseOr;
		break;

	default:
		LOGE("Unknown binary operator.\n");
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);

	uint32_t id0 = impl.get_id_for_value(instruction->getOperand(0));
	uint32_t id1 = impl.get_id_for_value(instruction->getOperand(1));
	op->add_ids({ id0, id1 });

	impl.add(op);
	return true;
}

bool emit_unary_instruction(Converter::Impl &impl, const llvm::UnaryOperator *instruction)
{
	spv::Op opcode;

	switch (instruction->getOpcode())
	{
	case llvm::UnaryOperator::UnaryOps::FNeg:
		opcode = spv::OpFNegate;
		break;

	default:
		LOGE("Unknown unary operator.\n");
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(0)));

	impl.add(op);
	return true;
}

bool emit_cast_instruction(Converter::Impl &impl, const llvm::CastInst *instruction)
{
	spv::Op opcode;
	switch (instruction->getOpcode())
	{
	case llvm::CastInst::CastOps::BitCast:
		opcode = spv::OpBitcast;
		break;

	case llvm::CastInst::CastOps::SExt:
		opcode = spv::OpSConvert;
		break;

	case llvm::CastInst::CastOps::Trunc:
	case llvm::CastInst::CastOps::ZExt:
		opcode = spv::OpUConvert;
		break;

	case llvm::CastInst::CastOps::FPTrunc:
	case llvm::CastInst::CastOps::FPExt:
		opcode = spv::OpFConvert;
		break;

	case llvm::CastInst::CastOps::FPToUI:
		opcode = spv::OpConvertFToU;
		break;

	case llvm::CastInst::CastOps::FPToSI:
		opcode = spv::OpConvertFToS;
		break;

	case llvm::CastInst::CastOps::SIToFP:
		opcode = spv::OpConvertSToF;
		break;

	case llvm::CastInst::CastOps::UIToFP:
		opcode = spv::OpConvertUToF;
		break;

	default:
		LOGE("Unknown cast operation.\n");
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
	impl.add(op);
	return true;
}

bool emit_getelementptr_instruction(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction)
{
	// This is actually the same as PtrAccessChain, but we would need to use variable pointers to support that properly.
	// For now, just assert that the first index is constant 0, in which case PtrAccessChain == AccessChain.

	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(0));
	spv::StorageClass storage_class = builder.getStorageClass(ptr_id);
	spv::Id type_id = impl.get_type_id(instruction->getType()->getPointerElementType());
	type_id = builder.makePointer(storage_class, type_id);

	Operation *op = impl.allocate(instruction->isInBounds() ? spv::OpInBoundsAccessChain : spv::OpAccessChain,
	                              instruction, type_id);

	op->add_id(ptr_id);

	auto *elem_index = instruction->getOperand(1);

	// This one must be constant 0, ignore it.
	if (!llvm::isa<llvm::ConstantInt>(elem_index))
	{
		LOGE("First GetElementPtr operand is not constant 0.\n");
		return false;
	}

	if (llvm::cast<llvm::ConstantInt>(elem_index)->getUniqueInteger().getZExtValue() != 0)
	{
		LOGE("First GetElementPtr operand is not constant 0.\n");
		return false;
	}

	unsigned num_operands = instruction->getNumOperands();
	for (uint32_t i = 2; i < num_operands; i++)
		op->add_id(impl.get_id_for_value(instruction->getOperand(i)));

	impl.add(op);
	return true;
}

bool emit_load_instruction(Converter::Impl &impl, const llvm::LoadInst *instruction)
{
	Operation *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));

	impl.add(op);
	return true;
}

bool emit_store_instruction(Converter::Impl &impl, const llvm::StoreInst *instruction)
{
	Operation *op = impl.allocate(spv::OpStore);
	op->add_ids(
	    { impl.get_id_for_value(instruction->getOperand(1)), impl.get_id_for_value(instruction->getOperand(0)) });

	impl.add(op);
	return true;
}

bool emit_compare_instruction(Converter::Impl &impl, const llvm::CmpInst *instruction)
{
	spv::Op opcode;
	switch (instruction->getPredicate())
	{
	case llvm::CmpInst::Predicate::FCMP_OEQ:
		opcode = spv::OpFOrdEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UEQ:
		opcode = spv::OpFUnordEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_OGT:
		opcode = spv::OpFOrdGreaterThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_UGT:
		opcode = spv::OpFUnordGreaterThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_OGE:
		opcode = spv::OpFOrdGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UGE:
		opcode = spv::OpFUnordGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_OLT:
		opcode = spv::OpFOrdLessThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_ULT:
		opcode = spv::OpFUnordLessThan;
		break;

	case llvm::CmpInst::Predicate::FCMP_OLE:
		opcode = spv::OpFOrdLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_ULE:
		opcode = spv::OpFUnordLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_ONE:
		opcode = spv::OpFOrdNotEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_UNE:
		opcode = spv::OpFUnordNotEqual;
		break;

	case llvm::CmpInst::Predicate::FCMP_FALSE:
	{
		// Why on earth is this a thing ...
		impl.value_map[instruction] = impl.builder().makeBoolConstant(false);
		return true;
	}

	case llvm::CmpInst::Predicate::FCMP_TRUE:
	{
		// Why on earth is this a thing ...
		impl.value_map[instruction] = impl.builder().makeBoolConstant(true);
		return true;
	}

	case llvm::CmpInst::Predicate::ICMP_EQ:
		opcode = spv::OpIEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_NE:
		opcode = spv::OpINotEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLT:
		opcode = spv::OpSLessThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLE:
		opcode = spv::OpSLessThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGT:
		opcode = spv::OpSGreaterThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGE:
		opcode = spv::OpSGreaterThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_ULT:
		opcode = spv::OpULessThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_ULE:
		opcode = spv::OpULessThanEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_UGT:
		opcode = spv::OpUGreaterThan;
		break;

	case llvm::CmpInst::Predicate::ICMP_UGE:
		opcode = spv::OpUGreaterThanEqual;
		break;

	default:
		LOGE("Unknown CmpInst predicate.\n");
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);
	uint32_t id0 = impl.get_id_for_value(instruction->getOperand(0));
	uint32_t id1 = impl.get_id_for_value(instruction->getOperand(1));
	op->add_ids({ id0, id1 });

	impl.add(op);
	return true;
}

bool emit_extract_value_instruction(Converter::Impl &impl, const llvm::ExtractValueInst *instruction)
{
	Operation *op = impl.allocate(spv::OpCompositeExtract, instruction);

	op->add_id(impl.get_id_for_value(instruction->getAggregateOperand()));
	for (unsigned i = 0; i < instruction->getNumIndices(); i++)
		op->add_literal(instruction->getIndices()[i]);

	impl.add(op);
	return true;
}

bool emit_alloca_instruction(Converter::Impl &impl, const llvm::AllocaInst *instruction)
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

	auto address_space = static_cast<DXIL::AddressSpace>(instruction->getType()->getAddressSpace());
	if (address_space != DXIL::AddressSpace::Thread)
		return false;

	spv::Id var_id =
	    impl.builder().createVariable(spv::StorageClassFunction, pointee_type_id);
	impl.value_map[instruction] = var_id;
	return true;
}

bool emit_select_instruction(Converter::Impl &impl, const llvm::SelectInst *instruction)
{
	Operation *op = impl.allocate(spv::OpSelect, instruction);

	op->add_ids({
	    impl.get_id_for_value(instruction->getOperand(0)),
	    impl.get_id_for_value(instruction->getOperand(1)),
	    impl.get_id_for_value(instruction->getOperand(2)),
	});

	impl.add(op);
	return true;
}

bool emit_cmpxchg_instruction(Converter::Impl &impl, const llvm::AtomicCmpXchgInst *instruction)
{
	auto &builder = impl.builder();

	Operation *atomic_op = impl.allocate(spv::OpAtomicCompareExchange, builder.makeUintType(32));
	atomic_op->add_ids({ impl.get_id_for_value(instruction->getPointerOperand()),
	                     builder.makeUintConstant(spv::ScopeWorkgroup),
	                     builder.makeUintConstant(0), // Relaxed
	                     builder.makeUintConstant(0), // Relaxed
	                     impl.get_id_for_value(instruction->getNewValOperand()),
	                     impl.get_id_for_value(instruction->getCompareOperand()) });

	impl.add(atomic_op);

	Operation *cmp_op = impl.allocate(spv::OpIEqual, builder.makeBoolType());
	cmp_op->add_ids({ atomic_op->id, impl.get_id_for_value(instruction->getCompareOperand()) });
	impl.add(cmp_op);

	if (!impl.cmpxchg_type)
		impl.cmpxchg_type =
		    builder.makeStructType({ builder.makeUintType(32), builder.makeBoolType() }, "CmpXchgResult");

	Operation *op = impl.allocate(spv::OpCompositeConstruct, instruction, impl.cmpxchg_type);
	op->add_ids({ atomic_op->id, cmp_op->id });
	impl.add(op);
	return true;
}

bool emit_atomicrmw_instruction(Converter::Impl &impl, const llvm::AtomicRMWInst *instruction)
{
	auto &builder = impl.builder();
	spv::Op opcode;
	switch (instruction->getOperation())
	{
	case llvm::AtomicRMWInst::BinOp::Add:
		opcode = spv::OpAtomicIAdd;
		break;

	case llvm::AtomicRMWInst::BinOp::Sub:
		opcode = spv::OpAtomicISub;
		break;

	case llvm::AtomicRMWInst::BinOp::And:
		opcode = spv::OpAtomicAnd;
		break;

	case llvm::AtomicRMWInst::BinOp::Or:
		opcode = spv::OpAtomicOr;
		break;

	case llvm::AtomicRMWInst::BinOp::Xor:
		opcode = spv::OpAtomicXor;
		break;

	case llvm::AtomicRMWInst::BinOp::UMax:
		opcode = spv::OpAtomicUMax;
		break;

	case llvm::AtomicRMWInst::BinOp::UMin:
		opcode = spv::OpAtomicUMin;
		break;

	case llvm::AtomicRMWInst::BinOp::Max:
		opcode = spv::OpAtomicSMax;
		break;

	case llvm::AtomicRMWInst::BinOp::Min:
		opcode = spv::OpAtomicSMin;
		break;

	case llvm::AtomicRMWInst::BinOp::Xchg:
		opcode = spv::OpAtomicExchange;
		break;

	default:
		LOGE("Unrecognized atomicrmw opcode: %u.\n", unsigned(instruction->getOperation()));
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);
	op->add_ids({
	    impl.get_id_for_value(instruction->getPointerOperand()),
	    builder.makeUintConstant(spv::ScopeWorkgroup),
	    builder.makeUintConstant(0),
	    impl.get_id_for_value(instruction->getValOperand()),
	});

	impl.add(op);
	return true;
}
} // namespace dxil_spv
