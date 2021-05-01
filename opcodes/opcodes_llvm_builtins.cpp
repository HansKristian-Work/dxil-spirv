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

#include "opcodes_llvm_builtins.hpp"
#include "converter_impl.hpp"
#include "logging.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
unsigned physical_integer_bit_width(unsigned width)
{
	switch (width)
	{
	case 1:
	case 8:
	case 16:
	case 32:
	case 64:
		return width;

	default:
		return width <= 32 ? 32 : 64;
	}
}

static spv::Id build_naturally_extended_value(Converter::Impl &impl, const llvm::Value *value,
                                              unsigned bits, bool is_signed)
{
	spv::Id id = impl.get_id_for_value(value);
	if (value->getType()->getTypeID() != llvm::Type::TypeID::IntegerTyID)
		return id;

	auto logical_bits = value->getType()->getIntegerBitWidth();
	auto physical_bits = physical_integer_bit_width(logical_bits);

	if (bits == 0)
		bits = logical_bits;
	if (bits == physical_bits)
		return id;

	auto &builder = impl.builder();
	auto *mask_op = impl.allocate(is_signed ? spv::OpBitFieldSExtract : spv::OpBitFieldUExtract,
	                              impl.get_type_id(value->getType()));
	mask_op->add_id(id);
	mask_op->add_id(builder.makeUintConstant(0));
	mask_op->add_id(builder.makeUintConstant(bits));
	impl.add(mask_op);
	return mask_op->id;
}

static spv::Id build_naturally_extended_value(Converter::Impl &impl, const llvm::Value *value, bool is_signed)
{
	spv::Id id = impl.get_id_for_value(value);
	if (value->getType()->getTypeID() != llvm::Type::TypeID::IntegerTyID)
		return id;

	auto logical_bits = value->getType()->getIntegerBitWidth();
	return build_naturally_extended_value(impl, value, logical_bits, is_signed);
}

bool emit_binary_instruction(Converter::Impl &impl, const llvm::BinaryOperator *instruction)
{
	bool signed_input = false;
	bool is_width_sensitive = false;
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
		signed_input = true;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::UDiv:
		opcode = spv::OpUDiv;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::Shl:
		opcode = spv::OpShiftLeftLogical;
		break;

	case llvm::BinaryOperator::BinaryOps::LShr:
		opcode = spv::OpShiftRightLogical;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::AShr:
		opcode = spv::OpShiftRightArithmetic;
		signed_input = true;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::SRem:
		opcode = spv::OpSRem;
		signed_input = true;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::FRem:
		opcode = spv::OpFRem;
		break;

	case llvm::BinaryOperator::BinaryOps::URem:
		// Is this correct? There is no URem.
		opcode = spv::OpUMod;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::Xor:
		if (instruction->getType()->getIntegerBitWidth() == 1)
		{
			// Logical not in LLVM IR is encoded as XOR i1 against true.
			spv::Id not_id = 0;
			if (const auto *c = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(0)))
			{
				if (c->getUniqueInteger().getZExtValue() != 0)
					not_id = impl.get_id_for_value(instruction->getOperand(1));
			}
			else if (const auto *c = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(1)))
			{
				if (c->getUniqueInteger().getZExtValue() != 0)
					not_id = impl.get_id_for_value(instruction->getOperand(0));
			}

			if (not_id)
			{
				opcode = spv::OpLogicalNot;
				auto *op = impl.allocate(opcode, instruction);
				op->add_id(not_id);
				impl.add(op);
				return true;
			}

			opcode = spv::OpLogicalNotEqual;
		}
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

	uint32_t id0, id1;
	if (is_width_sensitive)
	{
		id0 = build_naturally_extended_value(impl, instruction->getOperand(0), signed_input);
		id1 = build_naturally_extended_value(impl, instruction->getOperand(1), signed_input);
	}
	else
	{
		id0 = impl.get_id_for_value(instruction->getOperand(0));
		id1 = impl.get_id_for_value(instruction->getOperand(1));
	}
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

static uint32_t emit_boolean_trunc_instruction(Converter::Impl &impl, const llvm::CastInst *instruction)
{
	auto &builder = impl.builder();
	Operation *op = impl.allocate(spv::OpINotEqual, instruction);
	op->add_id(build_naturally_extended_value(impl, instruction->getOperand(0), false));

	unsigned physical_width = physical_integer_bit_width(instruction->getOperand(0)->getType()->getIntegerBitWidth());

	switch (physical_width)
	{
	case 16:
		op->add_id(builder.makeUint16Constant(0));
		break;

	case 32:
		op->add_id(builder.makeUintConstant(0));
		break;

	case 64:
		op->add_id(builder.makeUint64Constant(0));
		break;

	default:
		return 0;
	}

	impl.add(op);
	return op->id;
}

static uint32_t emit_boolean_convert_instruction(Converter::Impl &impl, const llvm::CastInst *instruction, bool is_signed)
{
	auto &builder = impl.builder();
	spv::Id const_0;
	spv::Id const_1;

	switch (instruction->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
		const_0 = builder.makeFloat16Constant(0);
		const_1 = builder.makeFloat16Constant(0x3c00u | (is_signed ? 0x8000u : 0u));
		break;

	case llvm::Type::TypeID::FloatTyID:
		const_0 = builder.makeFloatConstant(0.0f);
		const_1 = builder.makeFloatConstant(is_signed ? -1.0f : 1.0f);
		break;

	case llvm::Type::TypeID::DoubleTyID:
		const_0 = builder.makeDoubleConstant(0.0);
		const_1 = builder.makeDoubleConstant(is_signed ? -1.0 : 1.0);
		break;

	case llvm::Type::TypeID::IntegerTyID:
		switch (physical_integer_bit_width(instruction->getType()->getIntegerBitWidth()))
		{
		case 16:
			const_0 = builder.makeUint16Constant(0);
			const_1 = builder.makeUint16Constant(is_signed ? 0xffff : 1u);
			break;

		case 32:
			const_0 = builder.makeUintConstant(0);
			const_1 = builder.makeUintConstant(is_signed ? 0xffffffffu : 1u);
			break;

		case 64:
			const_0 = builder.makeUint64Constant(0ull);
			const_1 = builder.makeUint64Constant(is_signed ? ~0ull : 1ull);
			break;

		default:
			return 0;
		}
		break;

	default:
		return 0;
	}

	Operation *op = impl.allocate(spv::OpSelect, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
	op->add_ids({ const_1, const_0 });
	impl.add(op);
	return op->id;
}

static uint32_t emit_masked_cast_instruction(Converter::Impl &impl, const llvm::CastInst *instruction, spv::Op opcode)
{
	auto logical_output_bits = instruction->getType()->getIntegerBitWidth();
	auto logical_input_bits = instruction->getOperand(0)->getType()->getIntegerBitWidth();
	auto physical_output_bits = physical_integer_bit_width(logical_output_bits);
	auto physical_input_bits = physical_integer_bit_width(logical_input_bits);
	auto logical_bits = (std::min)(logical_output_bits, logical_input_bits);

	if (physical_output_bits == physical_input_bits)
	{
		// We cannot use a cast operation in SPIR-V here, just extend the value to physical size and roll with it.
		spv::Id extended_id = build_naturally_extended_value(impl, instruction->getOperand(0), logical_bits,
		                                                     opcode == spv::OpSConvert);
		impl.value_map[instruction] = extended_id;
		return extended_id;
	}
	else if (physical_input_bits != logical_input_bits)
	{
		// Before extending, we must properly sign-extend.
		auto *mask_op = impl.allocate(opcode, instruction);
		mask_op->add_id(build_naturally_extended_value(impl, instruction->getOperand(0), logical_bits,
		                                               opcode == spv::OpSConvert));
		impl.add(mask_op);
		return mask_op->id;
	}

	return 0;
}

bool emit_cast_instruction(Converter::Impl &impl, const llvm::CastInst *instruction)
{
	spv::Op opcode;
	bool signed_input = false;

	switch (instruction->getOpcode())
	{
	case llvm::CastInst::CastOps::BitCast:
		opcode = spv::OpBitcast;
		break;

	case llvm::CastInst::CastOps::SExt:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, true);
		opcode = spv::OpSConvert;
		signed_input = true;
		if (emit_masked_cast_instruction(impl, instruction, opcode))
			return true;
		break;

	case llvm::CastInst::CastOps::ZExt:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, false);
		opcode = spv::OpUConvert;
		if (emit_masked_cast_instruction(impl, instruction, opcode))
		    return true;
		break;

	case llvm::CastInst::CastOps::Trunc:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_trunc_instruction(impl, instruction);
		opcode = spv::OpUConvert;
		if (emit_masked_cast_instruction(impl, instruction, opcode))
			return true;
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
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, true);
		opcode = spv::OpConvertSToF;
		signed_input = true;
		break;

	case llvm::CastInst::CastOps::UIToFP:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, false);
		opcode = spv::OpConvertUToF;
		break;

	default:
		LOGE("Unknown cast operation.\n");
		return false;
	}

	if (instruction->getType()->getTypeID() == llvm::Type::TypeID::PointerTyID)
	{
		// I have observed this code in the wild
		// %blah = bitcast float* %foo to i32*
		// on function local memory.
		// I have no idea if this is legal DXIL.
		// Fake this by copying the object instead without any cast, and resolve the bitcast in OpLoad/OpStore instead.
		auto *pointer_type = llvm::cast<llvm::PointerType>(instruction->getOperand(0)->getType());
		auto *pointee_type = pointer_type->getPointerElementType();
		spv::Id value_type = impl.get_type_id(pointee_type);

		spv::StorageClass fallback_storage;
		if (static_cast<DXIL::AddressSpace>(pointer_type->getAddressSpace()) == DXIL::AddressSpace::GroupShared)
			fallback_storage = spv::StorageClassWorkgroup;
		else
			fallback_storage = spv::StorageClassFunction;

		spv::StorageClass storage = impl.get_effective_storage_class(instruction->getOperand(0), fallback_storage);
		spv::Id type_id = impl.builder().makePointer(storage, value_type);
		Operation *op = impl.allocate(spv::OpCopyObject, instruction, type_id);
		op->add_id(impl.get_id_for_value(instruction->getOperand(0)));

		// Remember that we will need to bitcast on load or store to the real underlying type.
		impl.llvm_value_actual_type[instruction] = value_type;
		impl.handle_to_storage_class[instruction] = storage;
		impl.add(op);
	}
	else
	{
		Operation *op = impl.allocate(opcode, instruction);
		op->add_id(build_naturally_extended_value(impl, instruction->getOperand(0), signed_input));
		impl.add(op);
	}
	return true;
}

static bool elementptr_is_nonuniform(const llvm::GetElementPtrInst *inst)
{
	return inst->getMetadata("dx.nonuniform") != nullptr;
}

static bool elementptr_is_nonuniform(const llvm::ConstantExpr *)
{
	return false;
}

template <typename Inst>
static bool emit_getelementptr_resource(Converter::Impl &impl, const Inst *instruction,
                                        const Converter::Impl::ResourceMetaReference &meta)
{
	auto *elem_index = instruction->getOperand(1);

	// This one must be constant 0, ignore it.
	if (!llvm::isa<llvm::ConstantInt>(elem_index))
	{
		LOGE("First GetElementPtr operand is not constant 0.\n");
		return false;
	}

	if (instruction->getNumOperands() != 3)
	{
		LOGE("Number of operands to getelementptr for a resource handle is unexpected.\n");
		return false;
	}

	auto indexed_meta = meta;
	indexed_meta.offset = instruction->getOperand(2);
	indexed_meta.non_uniform = elementptr_is_nonuniform(instruction);
	impl.llvm_global_variable_to_resource_mapping[instruction] = indexed_meta;
	return true;
}

static uint32_t build_constant_getelementptr(Converter::Impl &impl, const llvm::ConstantExpr *cexpr)
{
	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(cexpr->getOperand(0));
	spv::Id type_id = impl.get_type_id(cexpr->getType()->getPointerElementType());

	auto storage = impl.get_effective_storage_class(cexpr->getOperand(0), builder.getStorageClass(ptr_id));
	type_id = builder.makePointer(storage, type_id);

	Operation *op = impl.allocate(spv::OpAccessChain, type_id);

	op->add_id(ptr_id);

	auto *elem_index = cexpr->getOperand(1);

	// This one must be constant 0, ignore it.
	if (!llvm::isa<llvm::ConstantInt>(elem_index))
	{
		LOGE("First GetElementPtr operand is not constant 0.\n");
		return 0;
	}

	if (llvm::cast<llvm::ConstantInt>(elem_index)->getUniqueInteger().getZExtValue() != 0)
	{
		LOGE("First GetElementPtr operand is not constant 0.\n");
		return 0;
	}

	unsigned num_operands = cexpr->getNumOperands();
	for (uint32_t i = 2; i < num_operands; i++)
		op->add_id(impl.get_id_for_value(cexpr->getOperand(i)));

	impl.add(op);
	return op->id;
}

uint32_t build_constant_expression(Converter::Impl &impl, const llvm::ConstantExpr *cexpr)
{
	impl.current_constant_expr = cexpr;

	switch (cexpr->getOpcode())
	{
	case llvm::Instruction::GetElementPtr:
		return build_constant_getelementptr(impl, cexpr);

	default:
	{
		LOGE("Unknown constant-expr.\n");
		break;
	}
	}

	return false;
}

bool emit_getelementptr_instruction(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction)
{
	// This is actually the same as PtrAccessChain, but we would need to use variable pointers to support that properly.
	// For now, just assert that the first index is constant 0, in which case PtrAccessChain == AccessChain.

	auto global_itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getOperand(0));
	if (global_itr != impl.llvm_global_variable_to_resource_mapping.end())
		return true;

	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(0));
	spv::Id type_id = impl.get_type_id(instruction->getType()->getPointerElementType());

	auto storage = impl.get_effective_storage_class(instruction->getOperand(0), builder.getStorageClass(ptr_id));
	type_id = builder.makePointer(storage, type_id);

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

	impl.handle_to_storage_class[instruction] = storage;
	impl.add(op);
	return true;
}

bool emit_load_instruction(Converter::Impl &impl, const llvm::LoadInst *instruction)
{
	auto itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getPointerOperand());
	auto type_itr = impl.llvm_value_actual_type.find(instruction->getPointerOperand());

	// If we are trying to load a resource in RT, this does not translate in SPIR-V, defer this to createHandleForLib.
	if (itr != impl.llvm_global_variable_to_resource_mapping.end())
	{
		return true;
	}
	else if (type_itr != impl.llvm_value_actual_type.end())
	{
		Operation *load_op = impl.allocate(spv::OpLoad, type_itr->second);
		load_op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));
		impl.add(load_op);

		Operation *cast_op = impl.allocate(spv::OpBitcast, instruction);
		cast_op->add_id(load_op->id);
		impl.add(cast_op);
	}
	else
	{
		Operation *op = impl.allocate(spv::OpLoad, instruction);

		op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));

		impl.add(op);
	}
	return true;
}

bool emit_store_instruction(Converter::Impl &impl, const llvm::StoreInst *instruction)
{
	Operation *op = impl.allocate(spv::OpStore);

	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	auto itr = impl.llvm_value_actual_type.find(instruction->getOperand(1));
	if (itr != impl.llvm_value_actual_type.end())
	{
		Operation *cast_op = impl.allocate(spv::OpBitcast, itr->second);
		cast_op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
		impl.add(cast_op);
		op->add_id(cast_op->id);
	}
	else
		op->add_id(impl.get_id_for_value(instruction->getOperand(0)));

	impl.add(op);
	return true;
}

bool emit_compare_instruction(Converter::Impl &impl, const llvm::CmpInst *instruction)
{
	bool signed_input = false;
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
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalEqual;
		else
			opcode = spv::OpIEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_NE:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalNotEqual;
		else
			opcode = spv::OpINotEqual;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLT:
		opcode = spv::OpSLessThan;
		signed_input = true;
		break;

	case llvm::CmpInst::Predicate::ICMP_SLE:
		opcode = spv::OpSLessThanEqual;
		signed_input = true;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGT:
		opcode = spv::OpSGreaterThan;
		signed_input = true;
		break;

	case llvm::CmpInst::Predicate::ICMP_SGE:
		opcode = spv::OpSGreaterThanEqual;
		signed_input = true;
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

	case llvm::CmpInst::Predicate::FCMP_UNO:
	{
		Operation *first_op = impl.allocate(spv::OpIsNan, impl.builder().makeBoolType());
		first_op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
		impl.add(first_op);

		Operation *second_op = impl.allocate(spv::OpIsNan, impl.builder().makeBoolType());
		second_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(second_op);

		Operation *op = impl.allocate(spv::OpLogicalOr, instruction);
		op->add_ids({ first_op->id, second_op->id });
		impl.add(op);
		return true;
	}

	case llvm::CmpInst::Predicate::FCMP_ORD:
	{
		Operation *first_op = impl.allocate(spv::OpIsNan, impl.builder().makeBoolType());
		first_op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
		impl.add(first_op);

		Operation *second_op = impl.allocate(spv::OpIsNan, impl.builder().makeBoolType());
		second_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		impl.add(second_op);

		Operation *unordered_op = impl.allocate(spv::OpLogicalOr, impl.builder().makeBoolType());
		unordered_op->add_ids({ first_op->id, second_op->id });
		impl.add(unordered_op);

		Operation *op = impl.allocate(spv::OpLogicalNot, instruction);
		op->add_id(unordered_op->id);
		impl.add(op);
		return true;
	}

	default:
		LOGE("Unknown CmpInst predicate.\n");
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);

	uint32_t id0 = build_naturally_extended_value(impl, instruction->getOperand(0), signed_input);
	uint32_t id1 = build_naturally_extended_value(impl, instruction->getOperand(1), signed_input);
	op->add_ids({ id0, id1 });

	impl.add(op);
	return true;
}

bool emit_extract_value_instruction(Converter::Impl &impl, const llvm::ExtractValueInst *instruction)
{
	auto itr = impl.llvm_composite_meta.find(instruction->getAggregateOperand());
	assert(itr != impl.llvm_composite_meta.end());

	if (itr->second.components == 1 && !itr->second.forced_composite)
	{
		// Forward the ID. The composite was originally emitted as a scalar.
		// It is possible that this value was used a PHI input early, which would have used the stale ID value.
		// Remember to rewrite PHI incoming values in this case.
		auto value_itr = impl.value_map.find(instruction);
		spv::Id rewrite_id = impl.get_id_for_value(instruction->getAggregateOperand());
		if (value_itr != impl.value_map.end() && value_itr->second != rewrite_id)
			impl.phi_incoming_rewrite[value_itr->second] = rewrite_id;

		impl.value_map[instruction] = rewrite_id;
	}
	else
	{
		Operation *op = impl.allocate(spv::OpCompositeExtract, instruction);

		op->add_id(impl.get_id_for_value(instruction->getAggregateOperand()));
		for (unsigned i = 0; i < instruction->getNumIndices(); i++)
			op->add_literal(instruction->getIndices()[i]);

		impl.add(op);
	}

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

	auto storage = impl.get_effective_storage_class(instruction, spv::StorageClassFunction);
	spv::Id var_id = impl.create_variable(storage, pointee_type_id);
	impl.value_map[instruction] = var_id;
	impl.handle_to_storage_class[instruction] = storage;
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

	atomic_op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));

	atomic_op->add_ids({ builder.makeUintConstant(spv::ScopeWorkgroup),
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
		    impl.get_struct_type({ builder.makeUintType(32), builder.makeBoolType() }, "CmpXchgResult");

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

	op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));

	op->add_ids({
	    builder.makeUintConstant(spv::ScopeWorkgroup),
	    builder.makeUintConstant(0),
	    impl.get_id_for_value(instruction->getValOperand()),
	});

	impl.add(op);
	return true;
}

bool emit_shufflevector_instruction(Converter::Impl &impl, const llvm::ShuffleVectorInst *inst)
{
	Operation *op = impl.allocate(spv::OpVectorShuffle, inst);
	op->add_ids({ impl.get_id_for_value(inst->getOperand(0)), impl.get_id_for_value(inst->getOperand(1)) });

	unsigned num_outputs = inst->getType()->getVectorNumElements();
	for (unsigned i = 0; i < num_outputs; i++)
		op->add_literal(inst->getMaskValue(i));

	impl.add(op);
	return true;
}

bool emit_extractelement_instruction(Converter::Impl &impl, const llvm::ExtractElementInst *inst)
{
	if (auto *constant_int = llvm::dyn_cast<llvm::ConstantInt>(inst->getIndexOperand()))
	{
		Operation *op = impl.allocate(spv::OpCompositeExtract, inst);
		op->add_id(impl.get_id_for_value(inst->getVectorOperand()));
		op->add_literal(uint32_t(constant_int->getUniqueInteger().getZExtValue()));
		impl.add(op);
	}
	else
	{
		Operation *op = impl.allocate(spv::OpVectorExtractDynamic, inst);
		op->add_id(impl.get_id_for_value(inst->getVectorOperand()));
		op->add_id(impl.get_id_for_value(inst->getIndexOperand()));
		impl.add(op);
	}
	return true;
}

bool emit_insertelement_instruction(Converter::Impl &impl, const llvm::InsertElementInst *inst)
{
	auto *vec = inst->getOperand(0);
	auto *value = inst->getOperand(1);
	auto *index = inst->getOperand(2);

	if (!llvm::isa<llvm::ConstantInt>(index))
	{
		LOGE("Index to insertelement must be a constant.\n");
		return false;
	}
	Operation *op = impl.allocate(spv::OpCompositeInsert, inst);
	op->add_id(impl.get_id_for_value(value));
	op->add_id(impl.get_id_for_value(vec));
	op->add_literal(uint32_t(llvm::cast<llvm::ConstantInt>(index)->getUniqueInteger().getZExtValue()));
	impl.add(op);
	return true;
}

bool analyze_getelementptr_instruction(Converter::Impl &impl, const llvm::GetElementPtrInst *inst)
{
	auto itr = impl.llvm_global_variable_to_resource_mapping.find(inst->getOperand(0));
	if (itr != impl.llvm_global_variable_to_resource_mapping.end() &&
	    !emit_getelementptr_resource(impl, inst, itr->second))
	{
		return false;
	}

	return true;
}

bool analyze_load_instruction(Converter::Impl &impl, const llvm::LoadInst *inst)
{
	if (auto *const_expr = llvm::dyn_cast<llvm::ConstantExpr>(inst->getPointerOperand()))
	{
		if (const_expr->getOpcode() == llvm::Instruction::GetElementPtr)
		{
			auto *ptr = const_expr->getOperand(0);
			auto itr = impl.llvm_global_variable_to_resource_mapping.find(ptr);
			if (itr != impl.llvm_global_variable_to_resource_mapping.end() &&
			    !emit_getelementptr_resource(impl, const_expr, itr->second))
			{
				return false;
			}
		}
	}

	auto itr = impl.llvm_global_variable_to_resource_mapping.find(inst->getPointerOperand());
	if (itr != impl.llvm_global_variable_to_resource_mapping.end())
		impl.llvm_global_variable_to_resource_mapping[inst] = itr->second;

	return true;
}

bool analyze_extractvalue_instruction(Converter::Impl &impl, const llvm::ExtractValueInst *inst)
{
	if (inst->getNumIndices() == 1 &&
	    inst->getAggregateOperand()->getType()->getTypeID() == llvm::Type::TypeID::StructTyID)
	{
		auto &meta = impl.llvm_composite_meta[inst->getAggregateOperand()];
		unsigned index = inst->getIndices()[0];
		meta.access_mask |= 1u << index;
		if (index >= meta.components)
			meta.components = index + 1;
	}
	return true;
}

bool emit_llvm_instruction(Converter::Impl &impl, const llvm::Instruction &instruction)
{
	if (auto *binary_inst = llvm::dyn_cast<llvm::BinaryOperator>(&instruction))
		return emit_binary_instruction(impl, binary_inst);
	else if (auto *unary_inst = llvm::dyn_cast<llvm::UnaryOperator>(&instruction))
		return emit_unary_instruction(impl, unary_inst);
	else if (auto *cast_inst = llvm::dyn_cast<llvm::CastInst>(&instruction))
		return emit_cast_instruction(impl, cast_inst);
	else if (auto *getelementptr_inst = llvm::dyn_cast<llvm::GetElementPtrInst>(&instruction))
		return emit_getelementptr_instruction(impl, getelementptr_inst);
	else if (auto *load_inst = llvm::dyn_cast<llvm::LoadInst>(&instruction))
		return emit_load_instruction(impl, load_inst);
	else if (auto *store_inst = llvm::dyn_cast<llvm::StoreInst>(&instruction))
		return emit_store_instruction(impl, store_inst);
	else if (auto *compare_inst = llvm::dyn_cast<llvm::CmpInst>(&instruction))
		return emit_compare_instruction(impl, compare_inst);
	else if (auto *extract_inst = llvm::dyn_cast<llvm::ExtractValueInst>(&instruction))
		return emit_extract_value_instruction(impl, extract_inst);
	else if (auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(&instruction))
		return emit_alloca_instruction(impl, alloca_inst);
	else if (auto *select_inst = llvm::dyn_cast<llvm::SelectInst>(&instruction))
		return emit_select_instruction(impl, select_inst);
	else if (auto *atomic_inst = llvm::dyn_cast<llvm::AtomicRMWInst>(&instruction))
		return emit_atomicrmw_instruction(impl, atomic_inst);
	else if (auto *cmpxchg_inst = llvm::dyn_cast<llvm::AtomicCmpXchgInst>(&instruction))
		return emit_cmpxchg_instruction(impl, cmpxchg_inst);
	else if (auto *shufflevec_inst = llvm::dyn_cast<llvm::ShuffleVectorInst>(&instruction))
		return emit_shufflevector_instruction(impl, shufflevec_inst);
	else if (auto *extractelement_inst = llvm::dyn_cast<llvm::ExtractElementInst>(&instruction))
		return emit_extractelement_instruction(impl, extractelement_inst);
	else if (auto *insertelement_inst = llvm::dyn_cast<llvm::InsertElementInst>(&instruction))
		return emit_insertelement_instruction(impl, insertelement_inst);
	else
		return false;
}
} // namespace dxil_spv
