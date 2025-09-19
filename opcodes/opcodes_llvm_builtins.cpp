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

#include "opcodes_llvm_builtins.hpp"
#include "converter_impl.hpp"
#include "logging.hpp"
#include "spirv_module.hpp"
#include "dxil/dxil_common.hpp"
#include "dxil/dxil_resources.hpp"
#include "dxil/dxil_arithmetic.hpp"
#include "dxil/dxil_ags.hpp"

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

static bool instruction_is_ballot(const llvm::Value *aggregate)
{
	if (const auto *call_inst = llvm::dyn_cast<llvm::CallInst>(aggregate))
	{
		auto *called_function = call_inst->getCalledFunction();
		if (strncmp(called_function->getName().data(), "dx.op", 5) == 0)
		{
			auto *constant = llvm::dyn_cast<llvm::ConstantInt>(call_inst->getOperand(0));
			if (constant)
			{
				auto elem = constant->getUniqueInteger().getZExtValue();
				return static_cast<DXIL::Op>(elem) == DXIL::Op::WaveActiveBallot;
			}
		}
	}

	return false;
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

static spv::Id peephole_trivial_arithmetic_identity(Converter::Impl &,
                                                    const llvm::ConstantExpr *,
                                                    llvm::BinaryOperator::BinaryOps,
                                                    bool)
{
	return 0;
}

static spv::Id peephole_trivial_arithmetic_identity(Converter::Impl &impl,
                                                    const llvm::BinaryOperator *instruction,
                                                    llvm::BinaryOperator::BinaryOps inverse_operation,
                                                    bool is_commutative)
{
	// Only peephole fast math.
	if (!instruction->isFast() || impl.options.force_precise)
		return 0;

	// CP77 can trigger a scenario where we do (a / b) * b in fast math.
	// When b is 0, we hit a singularity, but native drivers optimize this away.
	auto *op0 = instruction->getOperand(0);
	auto *op1 = instruction->getOperand(1);

	// This is the case for mul/div or add/sub.
	bool counter_op_is_commutative = !is_commutative;

	// Current expression is op(op0, op1)
	// Find pattern where we have one of 4 cases:
	// - c = F(a, F^-1(c, a)) // F = fmul -> is_commutative
	// - c = F(F^-1(c, b), b) // F = fmul -> is_commutative
	// - c = F(F^-1(c, b), b) // F = fdiv -> !is_commutative
	// - c = F(F^-1(b, c), b) // F = fdiv -> !is_commutative

	const auto hoist_value = [&](llvm::BinaryOperator *binop, llvm::Value *inverse_value) -> bool {
		auto *cancel_op0 = binop->getOperand(0);
		auto *cancel_op1 = binop->getOperand(1);
		if (counter_op_is_commutative && cancel_op0 == inverse_value)
		{
			// op0 is canceled by outer expression, so we're left with op1.
			impl.rewrite_value(instruction, impl.get_id_for_value(cancel_op1));
			return true;
		}
		else if (cancel_op1 == inverse_value)
		{
			// op1 is canceled by outer expression, so we're left with op0.
			impl.rewrite_value(instruction, impl.get_id_for_value(cancel_op0));
			return true;
		}
		else
			return false;
	};

	if (auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(op0))
		if (binop->isFast() && binop->getOpcode() == inverse_operation && hoist_value(binop, op1))
			return impl.get_id_for_value(instruction);

	if (is_commutative)
		if (auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(op1))
			if (binop->isFast() && binop->getOpcode() == inverse_operation && hoist_value(binop, op0))
				return impl.get_id_for_value(instruction);

	return 0;
}

static spv::Id resolve_llvm_actual_value_type(Converter::Impl &impl,
                                              const llvm::Value *dependent_value,
                                              const llvm::Value *value, spv::Id default_value_type)
{
	auto itr = impl.llvm_value_actual_type.find(value);
	if (itr != impl.llvm_value_actual_type.end())
	{
		if (dependent_value)
		{
			// Forward the remapped type as required.
			impl.llvm_value_actual_type[dependent_value] = itr->second;
		}
		return itr->second;
	}
	else
		return default_value_type;
}

static bool instruction_is_fast_math(const llvm::BinaryOperator *op)
{
	return op->isFast();
}

static bool instruction_is_fast_math(const llvm::ConstantExpr *)
{
	// Don't want reordering in constant folding anyways.
	return false;
}

static bool instruction_is_undefined_value(const llvm::Value *value)
{
	if (llvm::isa<llvm::UndefValue>(value))
	{
		return true;
	}
	else if (const auto *cexpr = llvm::dyn_cast<llvm::ConstantExpr>(value))
	{
		return instruction_is_undefined_value(cexpr->getOperand(0)) &&
		       instruction_is_undefined_value(cexpr->getOperand(1));
	}
	else if (const auto *expr = llvm::dyn_cast<llvm::BinaryOperator>(value))
	{
		return instruction_is_undefined_value(expr->getOperand(0)) &&
		       instruction_is_undefined_value(expr->getOperand(1));
	}
	else
		return false;
}

template <typename T>
bool can_optimize_to_snegate_inner(const T *instruction)
{
	if (instruction->getOpcode() != llvm::BinaryOperator::BinaryOps::Sub)
		return false;

	// Peephole. LLVM doesn't have concept of negation apparently ...
	if (const auto *cint = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(0)))
		return cint->getUniqueInteger().getZExtValue() == 0;
	return false;
}

bool can_optimize_to_snegate(const llvm::BinaryOperator *instruction)
{
	return can_optimize_to_snegate_inner(instruction);
}

bool can_optimize_to_snegate(const llvm::ConstantExpr *instruction)
{
	return can_optimize_to_snegate_inner(instruction);
}

static bool constant_is_all_bits_set(llvm::Value *v)
{
	if (auto *vec = llvm::dyn_cast<llvm::ConstantDataVector>(v))
	{
		for (unsigned i = 0; i < vec->getNumElements(); i++)
			if (!constant_is_all_bits_set(vec->getElementAsConstant(i)))
				return false;

		return true;
	}
	else if (const auto *c = llvm::dyn_cast<llvm::ConstantInt>(v))
	{
		uint64_t mask;
		if (c->getType()->getIntegerBitWidth() == 64)
			mask = UINT64_MAX;
		else
			mask = (1ull << c->getType()->getIntegerBitWidth()) - 1ull;

		return (c->getUniqueInteger().getZExtValue() & mask) == mask;
	}
	else
		return false;
}

static llvm::Value *get_bitwise_not_from_xor(llvm::Value *a, llvm::Value *b)
{
	if (constant_is_all_bits_set(a))
		return b;
	else if (constant_is_all_bits_set(b))
		return a;
	else
		return nullptr;
}

template <typename InstructionType>
static spv::Id emit_binary_instruction_impl(Converter::Impl &impl, const InstructionType *instruction)
{
	bool signed_input = false;
	bool is_width_sensitive = false;
	bool is_precision_sensitive = false;
	bool can_relax_precision = false;
	spv::Op opcode;

	auto *type = instruction->getType();
	if (const auto *vec = llvm::dyn_cast<llvm::VectorType>(type))
		type = vec->getElementType();

	switch (llvm::Instruction::BinaryOps(instruction->getOpcode()))
	{
	case llvm::BinaryOperator::BinaryOps::FAdd:
		opcode = spv::OpFAdd;
		is_precision_sensitive = true;
		can_relax_precision = true;
		break;

	case llvm::BinaryOperator::BinaryOps::FSub:
		opcode = spv::OpFSub;
		is_precision_sensitive = true;
		can_relax_precision = true;
		break;

	case llvm::BinaryOperator::BinaryOps::FMul:
	{
		opcode = spv::OpFMul;
		is_precision_sensitive = true;
		can_relax_precision = true;
		if (spv::Id id = peephole_trivial_arithmetic_identity(impl, instruction, llvm::BinaryOperator::BinaryOps::FDiv, true))
			return id;
		break;
	}

	case llvm::BinaryOperator::BinaryOps::FDiv:
		opcode = spv::OpFDiv;
		is_precision_sensitive = true;
		can_relax_precision = true;
		if (spv::Id id = peephole_trivial_arithmetic_identity(impl, instruction, llvm::BinaryOperator::BinaryOps::FMul, false))
			return id;
		break;

	case llvm::BinaryOperator::BinaryOps::Add:
		opcode = spv::OpIAdd;
		break;

	case llvm::BinaryOperator::BinaryOps::Sub:
	{
		// Peephole. LLVM doesn't have concept of negation apparently ...
		if (can_optimize_to_snegate(instruction))
		{
			auto op = impl.allocate(spv::OpSNegate, instruction);
			op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
			impl.add(op);
			return op->id;
		}

		opcode = spv::OpISub;
		break;
	}

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
		is_precision_sensitive = true;
		can_relax_precision = true;
		break;

	case llvm::BinaryOperator::BinaryOps::URem:
		// Is this correct? There is no URem.
		opcode = spv::OpUMod;
		is_width_sensitive = true;
		break;

	case llvm::BinaryOperator::BinaryOps::Xor:
		// Logical not in LLVM IR is encoded as XOR i1 against true.
		if (const auto *not_value = get_bitwise_not_from_xor(instruction->getOperand(0), instruction->getOperand(1)))
		{
			spv::Id not_id = impl.get_id_for_value(not_value);
			opcode = type->getIntegerBitWidth() == 1 ? spv::OpLogicalNot : spv::OpNot;

			Operation *op;
			if (llvm::isa<llvm::ConstantExpr>(instruction))
				op = impl.allocate(opcode, impl.get_type_id(instruction->getType()));
			else
				op = impl.allocate(opcode, instruction);

			op->add_id(not_id);
			impl.add(op);
			return op->id;
		}

		opcode = type->getIntegerBitWidth() == 1 ? spv::OpLogicalNotEqual : spv::OpBitwiseXor;
		break;

	case llvm::BinaryOperator::BinaryOps::And:
		if (type->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalAnd;
		else
			opcode = spv::OpBitwiseAnd;
		break;

	case llvm::BinaryOperator::BinaryOps::Or:
		if (type->getIntegerBitWidth() == 1)
			opcode = spv::OpLogicalOr;
		else
			opcode = spv::OpBitwiseOr;
		break;

	default:
		LOGE("Unknown binary operator.\n");
		return false;
	}

	// If we can collapse the expression to undefined (yes, DXIL really emits jank like this!),
	// just emit the non-undefined part.
	// We can consider the value to be undefined in a way that it is irrelevant.

	// Here we make the assumption that undef is not frozen to a fixed but indeterminate value,
	// it can take different values when it's instantiated.
	bool a_is_undef = instruction_is_undefined_value(instruction->getOperand(0));
	bool b_is_undef = instruction_is_undefined_value(instruction->getOperand(1));
	spv::Id forward_value = 0;
	if (b_is_undef)
		forward_value = impl.get_id_for_value(instruction->getOperand(0));
	else if (a_is_undef)
		forward_value = impl.get_id_for_value(instruction->getOperand(1));

	Operation *op;
	if (llvm::isa<llvm::ConstantExpr>(instruction))
	{
		if (forward_value != 0)
			return forward_value;

		op = impl.allocate(opcode, impl.get_type_id(instruction->getType()));
	}
	else if (forward_value != 0)
	{
		impl.rewrite_value(instruction, forward_value);
		return forward_value;
	}
	else
	{
		op = impl.allocate(opcode, instruction);
	}

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
	if (is_precision_sensitive && (impl.options.force_precise || !instruction_is_fast_math(instruction)))
		impl.builder().addDecoration(op->id, spv::DecorationNoContraction);

	// Only bother relaxing FP, since Integers are murky w.r.t. signage in DXIL.
	if (can_relax_precision)
		impl.decorate_relaxed_precision(instruction->getType(), op->id, false);

	return op->id;
}

bool emit_binary_instruction(Converter::Impl &impl, const llvm::BinaryOperator *instruction)
{
	return emit_binary_instruction_impl(impl, instruction) != 0;
}

bool emit_unary_instruction(Converter::Impl &impl, const llvm::UnaryOperator *instruction)
{
	spv::Op opcode;

	switch (instruction->getOpcode())
	{
	case llvm::UnaryOperator::UnaryOps::FNeg:
		opcode = spv::OpFNegate;
		break;

#ifdef HAVE_LLVMBC
	case llvm::UnaryOperator::UnaryOps::INeg:
		opcode = spv::OpSNegate;
		break;
#endif

	default:
		LOGE("Unknown unary operator.\n");
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction);
	op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);

	impl.add(op);
	return true;
}

template <typename InstructionType>
static spv::Id emit_boolean_trunc_instruction(Converter::Impl &impl, const InstructionType *instruction)
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

template <typename InstructionType>
static spv::Id emit_boolean_convert_instruction(Converter::Impl &impl, const InstructionType *instruction, bool is_signed)
{
	auto &builder = impl.builder();
	spv::Id const_0;
	spv::Id const_1;

	switch (instruction->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
		if (impl.support_native_fp16_operations())
		{
			const_0 = builder.makeFloat16Constant(0);
			const_1 = builder.makeFloat16Constant(0x3c00u | (is_signed ? 0x8000u : 0u));
		}
		else
		{
			const_0 = builder.makeFloatConstant(0.0f);
			const_1 = builder.makeFloatConstant(is_signed ? -1.0f : 1.0f);
		}
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
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
	return op->id;
}

template <typename InstructionType>
static spv::Id emit_masked_cast_instruction(Converter::Impl &impl, const InstructionType *instruction, spv::Op opcode)
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
		impl.rewrite_value(instruction, extended_id);
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

template <typename InstructionType>
static bool value_cast_is_noop(Converter::Impl &impl, const InstructionType *instruction, bool &relaxed_precision_cast)
{
	relaxed_precision_cast = false;

	// In case we extend min16int to int without native 16-bit ints, this is just a noop.
	// I don't believe overflow is well defined for min-precision integers ...
	// They certainly are not in Vulkan.
	switch (instruction->getOpcode())
	{
	case llvm::Instruction::CastOps::FPExt:
		if (instruction->getType()->getTypeID() == llvm::Type::TypeID::FloatTyID &&
		    instruction->getOperand(0)->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID &&
		    !impl.support_native_fp16_operations())
		{
			return true;
		}
		break;

	case llvm::Instruction::CastOps::FPTrunc:
	{
		if (instruction->getOperand(0)->getType()->getTypeID() == llvm::Type::TypeID::FloatTyID &&
		    instruction->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID &&
		    !impl.support_native_fp16_operations())
		{
			relaxed_precision_cast = impl.options.arithmetic_relaxed_precision;
			return true;
		}
		break;
	}

	default:
		break;
	}

	return false;
}

static bool value_cast_is_fp16_quantization(Converter::Impl &impl, const llvm::CastInst *cast_inst, spv::Id &value_id)
{
	if (cast_inst->getOpcode() == llvm::Instruction::CastOps::FPExt &&
	    cast_inst->getType()->getTypeID() == llvm::Type::TypeID::FloatTyID)
	{
		if (const auto *trunc_inst = llvm::dyn_cast<llvm::CastInst>(cast_inst->getOperand(0)))
		{
			if (trunc_inst->getOpcode() == llvm::Instruction::CastOps::FPTrunc &&
			    trunc_inst->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID &&
			    trunc_inst->getOperand(0)->getType()->getTypeID() == llvm::Type::TypeID::FloatTyID)
			{
				value_id = impl.get_id_for_value(trunc_inst->getOperand(0));
				return true;
			}
		}
	}

	return false;
}

static bool value_cast_is_fp16_quantization(Converter::Impl &, const llvm::ConstantExpr *, spv::Id &)
{
	return false;
}

template <typename InstructionType>
static spv::Id emit_dxbc_tgsm_bitcast(Converter::Impl &impl, const InstructionType *instruction)
{
	// dxbc2dxil workarounds. Backing storage is i8 array. Rewrite this to i32.
	// This can happen with a constexpr bitcast from i8 array to unarrayed i32.
	if (instruction->getType()->getTypeID() == llvm::Type::TypeID::PointerTyID &&
	    DXIL::AddressSpace(instruction->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::GroupShared)
	{
		auto *input_value = instruction->getOperand(0);
		uint32_t constant_gep_offset = 0;
		while (llvm::isa<llvm::ConstantExpr>(input_value))
		{
			auto *cexpr = llvm::cast<llvm::ConstantExpr>(input_value);
			if (cexpr->getOpcode() == llvm::Instruction::GetElementPtr && cexpr->getNumOperands() == 3)
				constant_gep_offset = cexpr->getOperand(2)->getUniqueInteger().getZExtValue();
			input_value = llvm::cast<llvm::ConstantExpr>(input_value)->getOperand(0);
		}

		auto *elem_type = input_value->getType()->getPointerElementType();

		uint32_t input_pointer_depth = 0;
		while (elem_type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
		{
			input_pointer_depth++;
			elem_type = elem_type->getArrayElementType();
		}

		uint32_t output_pointer_depth = 0;
		auto *output_elem_type = instruction->getType()->getPointerElementType();
		while (output_elem_type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
		{
			output_pointer_depth++;
			output_elem_type = output_elem_type->getArrayElementType();
		}

		if (elem_type->getTypeID() == llvm::Type::TypeID::IntegerTyID && elem_type->getIntegerBitWidth() == 8)
		{
			if (constant_gep_offset % 4)
			{
				LOGE("Expected 4 byte aligned constant gep offset for TGSM.\n");
				return 0;
			}

			auto &builder = impl.builder();
			spv::Id input_id = impl.get_id_for_value(input_value);

			if (output_pointer_depth < input_pointer_depth)
			{
				auto *chain = impl.allocate(
				    spv::OpInBoundsAccessChain,
				    builder.makePointer(spv::StorageClassWorkgroup, builder.makeUintType(32)));

				chain->add_id(input_id);
				while (output_pointer_depth < input_pointer_depth)
				{
					output_pointer_depth++;
					chain->add_id(builder.makeUintConstant(constant_gep_offset / 4));
					constant_gep_offset = 0;
				}
				impl.add(chain);
				input_id = chain->id;
			}

			// The backing storage is always 32-bit.
			impl.rewrite_value(instruction, input_id);
			impl.llvm_value_actual_type[instruction] = builder.makeUintType(32);
			return input_id;
		}
	}

	return 0;
}

spv::Id emit_bypass_fp16_trunc(Converter::Impl &impl, const llvm::Instruction *instruction)
{
	auto &builder = impl.builder();

	// Try to find a cast chain where we can extract the native half value as-is.
	auto *value = instruction->getOperand(llvm::isa<llvm::CallInst>(instruction) ? 1 : 0);

	if (value_is_dx_op_instrinsic(value, DXIL::Op::LegacyF16ToF32))
	{
		auto *input_uint = llvm::cast<llvm::CallInst>(value)->getOperand(1);
		int component = 0;
		uint32_t cop = 0;

		if (const auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(input_uint))
		{
			if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::LShr &&
			    get_constant_operand(binop, 1, &cop) && cop == 16)
			{
				input_uint = binop->getOperand(0);
				component = 1;
			}
			else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::And &&
			         get_constant_operand(binop, 1, &cop) && (cop & 0xffffu) == 0xffffu)
			{
				input_uint = binop->getOperand(0);
			}
		}

		auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeVectorType(builder.makeUintType(16), 2));
		bitcast->add_id(impl.get_id_for_value(input_uint));
		impl.add(bitcast);

		auto *ext = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(16));
		ext->add_id(bitcast->id);
		ext->add_literal(component);
		impl.add(ext);

		if (instruction->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID)
		{
			auto *fp16_cast = impl.allocate(spv::OpBitcast, instruction);
			fp16_cast->add_id(ext->id);
			impl.add(fp16_cast);
			return fp16_cast->id;
		}
		else
		{
			auto *upcast = impl.allocate(spv::OpUConvert, instruction);
			upcast->add_id(ext->id);
			impl.add(upcast);
			return upcast->id;
		}
	}
	else if (const auto *cast = llvm::dyn_cast<llvm::CastInst>(value))
	{
		if (cast->getOpcode() == llvm::CastInst::CastOps::FPExt &&
		    cast->getOperand(0)->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID)
		{
			spv::Id id = impl.get_id_for_value(cast->getOperand(0));
			if (instruction->getType()->getTypeID() != llvm::Type::TypeID::HalfTyID)
			{
				auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(16));
				bitcast->add_id(id);
				impl.add(bitcast);

				auto *upcast = impl.allocate(spv::OpUConvert, instruction);
				upcast->add_id(bitcast->id);
				impl.add(upcast);
				return upcast->id;
			}
			else
			{
				impl.rewrite_value(instruction, id);
				return id;
			}
		}
	}

	return 0;
}

static spv::Id emit_bypass_fp16_trunc(Converter::Impl &, const llvm::ConstantExpr *)
{
	// If it's constexpr, no point in optimizing ourselves. Really won't happen.
	return 0;
}

template <typename InstructionType>
static spv::Id emit_cast_instruction_impl(Converter::Impl &impl, const InstructionType *instruction)
{
	bool can_relax_precision = false;
	bool signed_input = false;
	spv::Id value_id = 0;
	spv::Op opcode;

	if (value_cast_is_fp16_quantization(impl, instruction, value_id) &&
	    impl.execution_mode_meta.native_16bit_operations)
	{
		// D3D12 compilers will enforce a truncate here through a FP32 -> FP16 -> FP32 chain,
		// where Vulkan compilers ... don't :(
		// If we find this pattern, assume that compilers will try to be clever about it (NoContract does not work on NV),
		// and force use of QuantizeToFP16 instead.
		// Rounding mode of this operation is not well-defined,
		// but that is also the case for D3D12. AMD drivers will prefer RTZ here for example.
		auto *quant_op = impl.allocate(spv::OpQuantizeToF16, instruction);
		quant_op->add_id(value_id);
		impl.add(quant_op);
		return quant_op->id;
	}

	if (value_cast_is_noop(impl, instruction, can_relax_precision))
	{
		spv::Id id;
		if (can_relax_precision)
		{
			// We cannot change the type, but we can mark the copied object
			// as relaxed to attempt to signal the intent.
			auto *trunc_op = impl.allocate(spv::OpCopyObject, instruction);
			trunc_op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
			impl.add(trunc_op);
			id = trunc_op->id;
			impl.builder().addDecoration(id, spv::DecorationRelaxedPrecision);
		}
		else
		{
			id = impl.get_id_for_value(instruction->getOperand(0));
			impl.rewrite_value(instruction, id);
		}

		return id;
	}

	if (instruction->getOpcode() == llvm::Instruction::CastOps::FPTrunc &&
	    instruction->getType()->getTypeID() == llvm::Type::TypeID::HalfTyID &&
	    impl.support_native_fp16_operations())
	{
		// Avoid roundtrip. Can happen for shaders which cast between min16 types, legacy packing, etc, etc.
		if (spv::Id id = emit_bypass_fp16_trunc(impl, instruction))
			return id;
	}

	switch (instruction->getOpcode())
	{
	case llvm::Instruction::CastOps::BitCast:
		opcode = spv::OpBitcast;
		break;

	case llvm::Instruction::CastOps::SExt:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, true);
		opcode = spv::OpSConvert;
		signed_input = true;
		if (spv::Id id = emit_masked_cast_instruction(impl, instruction, opcode))
			return id;
		break;

	case llvm::Instruction::CastOps::ZExt:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, false);
		opcode = spv::OpUConvert;
		if (spv::Id id = emit_masked_cast_instruction(impl, instruction, opcode))
		    return id;
		break;

	case llvm::Instruction::CastOps::Trunc:
		if (instruction->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_trunc_instruction(impl, instruction);
		opcode = spv::OpUConvert;
		if (spv::Id id = emit_masked_cast_instruction(impl, instruction, opcode))
			return id;
		break;

	case llvm::Instruction::CastOps::FPTrunc:
	case llvm::Instruction::CastOps::FPExt:
		opcode = spv::OpFConvert;
		// Relaxing precision on integers in DXIL is very sketchy, so don't bother.
		can_relax_precision = true;
		break;

	case llvm::Instruction::CastOps::FPToUI:
		opcode = spv::OpConvertFToU;
		break;

	case llvm::Instruction::CastOps::FPToSI:
		opcode = spv::OpConvertFToS;
		break;

	case llvm::Instruction::CastOps::SIToFP:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, true);
		opcode = spv::OpConvertSToF;
		signed_input = true;
		break;

	case llvm::Instruction::CastOps::UIToFP:
		if (instruction->getOperand(0)->getType()->getIntegerBitWidth() == 1)
			return emit_boolean_convert_instruction(impl, instruction, false);
		opcode = spv::OpConvertUToF;
		break;

	default:
		LOGE("Unknown cast operation.\n");
		return 0;
	}

	if (spv::Id id = emit_dxbc_tgsm_bitcast(impl, instruction))
		return id;

	if (instruction->getType()->getTypeID() == llvm::Type::TypeID::PointerTyID)
	{
		// I have observed this code in the wild
		// %blah = bitcast float* %foo to i32*
		// on function local memory.
		// I have no idea if this is legal DXIL.
		// Fake this by copying the object instead without any cast, and resolve the bitcast in OpLoad/OpStore instead.
		auto *pointer_type = llvm::cast<llvm::PointerType>(instruction->getOperand(0)->getType());
		auto *pointee_type = pointer_type->getPointerElementType();

		auto *output_type = llvm::cast<llvm::PointerType>(instruction->getType());
		auto *output_value_type = output_type->getPointerElementType();
		unsigned input_pointer_array_depth = 0;
		unsigned output_pointer_array_depth = 0;

		// The pointee type can be an array if we're bitcasting a pointer to array.
		// The intention is that we will eventually access chain into the bitcast pointer.
		// In DXIL we can only store scalars, so chase down the underlying type.
		while (pointee_type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
		{
			pointee_type = pointee_type->getArrayElementType();
			input_pointer_array_depth++;
		}

		while (output_value_type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
		{
			output_value_type = output_value_type->getArrayElementType();
			output_pointer_array_depth++;
		}

		if (pointee_type->getTypeID() == llvm::Type::TypeID::PointerTyID ||
		    output_value_type->getTypeID() == llvm::Type::TypeID::PointerTyID)
		{
			// Pretty sure DXIL does not support this ...
			LOGE("Cannot handle pointer-to-pointer.\n");
			return 0;
		}

		spv::Id value_type = impl.get_type_id(pointee_type);
		// In case we get back-to-back pointer bitcasts for no good reason :v
		value_type = resolve_llvm_actual_value_type(impl, instruction,
		                                            instruction->getOperand(0), value_type);

		spv::StorageClass fallback_storage;
		if (static_cast<DXIL::AddressSpace>(pointer_type->getAddressSpace()) == DXIL::AddressSpace::GroupShared)
			fallback_storage = spv::StorageClassWorkgroup;
		else
			fallback_storage = spv::StorageClassFunction;

		spv::StorageClass storage = impl.get_effective_storage_class(instruction->getOperand(0), fallback_storage);

		spv::Id id = impl.get_id_for_value(instruction->getOperand(0));

		if (output_pointer_array_depth != input_pointer_array_depth)
		{
			if (output_pointer_array_depth > input_pointer_array_depth)
			{
				// Non-sensical.
				LOGE("Bitcasting pointer while adding more array dimensions.\n");
				return 0;
			}
			else if (output_pointer_array_depth != 0)
			{
				// Bitcasting an array to anything other than scalar is non-sense.
				// We might be able to make it work by access chaining partially, but don't bother unless we observe
				// this. DXIL generally does not support array-of-array anyways ...
				LOGE("Bitcasting pointer to unexpected number of array dimensions.\n");
				return 0;
			}

			// It is apparently possible to bitcast pointer-to-array into pointer-to-value.
			// Since we don't implement pointer bitcast,
			// we pretend to do so by accessing chaining into the first element.
			spv::Id type_id = impl.builder().makePointer(storage, value_type);
			Operation *op = impl.allocate(spv::OpInBoundsAccessChain, type_id);
			op->add_id(id);
			for (unsigned i = 0; i < input_pointer_array_depth; i++)
				op->add_id(impl.builder().makeUintConstant(0));
			impl.add(op);
			id = op->id;
		}
		else if (!llvm::isa<llvm::ConstantExpr>(instruction))
		{
			// Shouldn't try to copy constant expressions.
			// They are built on-demand either way, and we risk infinite recursion that way.
			spv::Id type_id = impl.builder().makePointer(storage, value_type);
			Operation *op = impl.allocate(spv::OpCopyObject, instruction, type_id);
			op->add_id(id);
			impl.add(op);
			id = op->id;
		}

		// Remember that we will need to bitcast on load or store to the real underlying type.
		impl.llvm_value_actual_type[instruction] = value_type;
		impl.handle_to_storage_class[instruction] = storage;
		return id;
	}
	else
	{
		Operation *op;
		if (llvm::isa<llvm::ConstantExpr>(instruction))
			op = impl.allocate(opcode, impl.get_type_id(instruction->getType()));
		else
			op = impl.allocate(opcode, instruction);

		op->add_id(build_naturally_extended_value(impl, instruction->getOperand(0), signed_input));
		impl.add(op);
		if (can_relax_precision)
			impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
		return op->id;
	}
}

static bool cast_instruction_is_ignored(Converter::Impl &, const llvm::CastInst *instruction)
{
	// llvm.lifetime.begin takes i8*, but this pointer type is not allowed otherwise.
	// We have to explicitly ignore this.
	// Ignore any bitcast to i8*,
	// it happens for lib_6_6 and is completely meaningless for us.
	if (instruction->getType()->getTypeID() == llvm::Type::TypeID::PointerTyID)
	{
		auto *result_type = instruction->getType()->getPointerElementType();
		if (result_type->getTypeID() == llvm::Type::TypeID::IntegerTyID && result_type->getIntegerBitWidth() == 8)
			return true;
	}

	return false;
}

bool emit_cast_instruction(Converter::Impl &impl, const llvm::CastInst *instruction)
{
	if (cast_instruction_is_ignored(impl, instruction))
		return true;

	return emit_cast_instruction_impl(impl, instruction) != 0;
}

static bool elementptr_is_nonuniform(const llvm::GetElementPtrInst *inst)
{
	return inst->hasMetadata("dx.nonuniform");
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

static spv::Id build_constant_getelementptr(Converter::Impl &impl, const llvm::ConstantExpr *cexpr)
{
	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(cexpr->getOperand(0));

	auto *element_type = cexpr->getType()->getPointerElementType();
	spv::Id type_id = impl.get_type_id(element_type);

	// If we're trying to getelementptr into a bitcasted pointer to array, we have to rewrite the pointer type.
	type_id = resolve_llvm_actual_value_type(impl, cexpr, cexpr->getOperand(0), type_id);

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

static spv::Id build_constant_cast(Converter::Impl &impl, const llvm::ConstantExpr *cexpr)
{
	return emit_cast_instruction_impl(impl, cexpr);
}

spv::Id build_constant_expression(Converter::Impl &impl, const llvm::ConstantExpr *cexpr)
{
	switch (cexpr->getOpcode())
	{
	case llvm::Instruction::GetElementPtr:
		return build_constant_getelementptr(impl, cexpr);

	case llvm::Instruction::Trunc:
	case llvm::Instruction::ZExt:
	case llvm::Instruction::SExt:
	case llvm::Instruction::FPToUI:
	case llvm::Instruction::FPToSI:
	case llvm::Instruction::UIToFP:
	case llvm::Instruction::SIToFP:
	case llvm::Instruction::FPTrunc:
	case llvm::Instruction::FPExt:
	case llvm::Instruction::PtrToInt:
	case llvm::Instruction::IntToPtr:
	case llvm::Instruction::BitCast:
	case llvm::Instruction::AddrSpaceCast:
		return build_constant_cast(impl, cexpr);

	case llvm::Instruction::Add:
	case llvm::Instruction::FAdd:
	case llvm::Instruction::Sub:
	case llvm::Instruction::FSub:
	case llvm::Instruction::Mul:
	case llvm::Instruction::FMul:
	case llvm::Instruction::UDiv:
	case llvm::Instruction::SDiv:
	case llvm::Instruction::FDiv:
	case llvm::Instruction::URem:
	case llvm::Instruction::SRem:
	case llvm::Instruction::FRem:
	case llvm::Instruction::Shl:
	case llvm::Instruction::LShr:
	case llvm::Instruction::AShr:
	case llvm::Instruction::And:
	case llvm::Instruction::Or:
	case llvm::Instruction::Xor:
		return emit_binary_instruction_impl(impl, cexpr);

	default:
	{
		LOGE("Unknown constant-expr.\n");
		break;
	}
	}

	return 0;
}

struct AllocaTrackedIndex
{
	const llvm::AllocaInst *alloca_inst;
	const llvm::Value *index;
	UnorderedMap<const llvm::AllocaInst *, AllocaCBVForwardingTracking>::iterator itr;
	const llvm::Value *cbv_handle;
};

static AllocaTrackedIndex gep_pointer_to_alloca_tracked_inst(Converter::Impl &impl, const llvm::Value *ptr)
{
	if (const auto *gep_inst = llvm::dyn_cast<llvm::GetElementPtrInst>(ptr))
	{
		if (const auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(gep_inst->getOperand(0)))
		{
			auto itr = impl.alloca_tracking.find(alloca_inst);
			if (itr != impl.alloca_tracking.end())
				return { alloca_inst, gep_inst->getOperand(2), itr, itr->second.cbv_handle };
		}
	}

	return {};
}

static void get_dxbc_tgsm_gep_workaround(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction,
                                         uint32_t &elementptr_shift, spv::Id &type_id)
{
	// Workaround dxbc2dxil where we access chain into i8 array which is non-sense.
	// The backing variable is i32 array instead. Rewrite appropriately.
	if (DXIL::AddressSpace(instruction->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::GroupShared)
	{
		auto *elem_type = instruction->getOperand(0)->getType()->getPointerElementType();
		if (elem_type->getTypeID() == llvm::Type::TypeID::ArrayTyID)
			elem_type = elem_type->getArrayElementType();
		if (elem_type->getTypeID() == llvm::Type::TypeID::IntegerTyID && elem_type->getIntegerBitWidth() == 8)
		{
			elementptr_shift = 2;
			type_id = impl.builder().makeUintType(32);
		}
	}
}

bool emit_getelementptr_instruction(Converter::Impl &impl, const llvm::GetElementPtrInst *instruction)
{
	if (emit_ags_getelementptr(impl, instruction))
		return true;

	// This is actually the same as PtrAccessChain, but we would need to use variable pointers to support that properly.
	// For now, just assert that the first index is constant 0, in which case PtrAccessChain == AccessChain.

	// Detour the GEP instruction via a cbuffer + AccessChain.
	// This is the store that is ignored.
	auto tracker = gep_pointer_to_alloca_tracked_inst(impl, instruction);

	if (tracker.cbv_handle)
	{
		if (impl.masked_alloca_forward_gep.count(instruction))
			return true;

		return emit_gep_as_cbuffer_scalar_offset(
			impl, instruction,
			tracker.cbv_handle, tracker.itr->second.scalar_index_offset, tracker.itr->second.stride);
	}

	auto global_itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getOperand(0));
	if (global_itr != impl.llvm_global_variable_to_resource_mapping.end())
		return true;

	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(0));
	uint32_t elementptr_shift = 0;
	spv::Id type_id = 0;

	get_dxbc_tgsm_gep_workaround(impl, instruction, elementptr_shift, type_id);

	if (type_id == 0)
		type_id = impl.get_type_id(instruction->getType()->getPointerElementType());

	// If we're trying to getelementptr into a bitcasted pointer to array, we have to rewrite the pointer type.
	resolve_llvm_actual_value_type(impl, instruction, instruction->getOperand(0), type_id);

	ags_getelementptr_filter(impl, instruction, type_id);

	spv::StorageClass storage;
	if (DXIL::AddressSpace(instruction->getOperand(0)->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::PhysicalNodeIO)
		storage = spv::StorageClassPhysicalStorageBuffer;
	else
		storage = impl.get_effective_storage_class(instruction->getOperand(0), builder.getStorageClass(ptr_id));

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
	{
		// Be a bit careful with the typing since we might have some weird bitcast pointer types flying around.
		if (i == 2 && !llvm::isa<llvm::Constant>(instruction->getOperand(2)))
		{
			if (auto *aggregate_type = llvm::dyn_cast<llvm::PointerType>(instruction->getOperand(0)->getType()))
			{
				if (auto *array_type = llvm::dyn_cast<llvm::ArrayType>(aggregate_type->getPointerElementType()))
				{
					auto address_space = DXIL::AddressSpace(aggregate_type->getPointerAddressSpace());
					if (address_space == DXIL::AddressSpace::GroupShared || address_space == DXIL::AddressSpace::Thread)
					{
						auto *global_var = llvm::dyn_cast<llvm::GlobalVariable>(instruction->getOperand(0));
						if (global_var && global_var->hasInitializer() && global_var->isConstant() &&
						    impl.options.extended_robustness.constant_lut &&
						    !elementptr_shift && address_space == DXIL::AddressSpace::Thread)
						{
							// Robustness for constant LUTs.
							if (!impl.glsl_std450_ext)
								impl.glsl_std450_ext = builder.import("GLSL.std.450");

							auto *clamp_op = impl.allocate(spv::OpExtInst, builder.makeUintType(32));
							clamp_op->add_id(impl.glsl_std450_ext);
							clamp_op->add_id(GLSLstd450UMin);
							clamp_op->add_id(impl.get_id_for_value(instruction->getOperand(2)));
							clamp_op->add_id(builder.makeUintConstant(array_type->getArrayNumElements()));
							impl.add(clamp_op);
							op->add_id(clamp_op->id);
							continue;
						}
						else if (address_space == DXIL::AddressSpace::Thread && impl.options.extended_robustness.alloca)
						{
							unsigned num_elements = array_type->getArrayNumElements();
							auto *is_in_bounds = impl.allocate(spv::OpULessThan, builder.makeBoolType());
							is_in_bounds->add_id(impl.get_id_for_value(instruction->getOperand(2)));
							is_in_bounds->add_id(builder.makeUintConstant(num_elements));
							impl.add(is_in_bounds);

							impl.handle_to_robustness[instruction] = is_in_bounds->id;
						}
						else if (address_space == DXIL::AddressSpace::GroupShared && impl.options.extended_robustness.group_shared)
						{
							// Need to handle atomics as well, and it'll be a mess to add support for that.
							LOGW("Robust group shared GEP not yet implemented.\n");
						}
						else if (impl.options.instruction_instrumentation.enabled &&
						         impl.options.instruction_instrumentation.type == InstructionInstrumentationType::ExpectAssume)
						{
							// Fallback expect-assume case.
							unsigned num_elements = array_type->getArrayNumElements();
							auto *is_in_bounds = impl.allocate(spv::OpULessThan, builder.makeBoolType());
							is_in_bounds->add_id(impl.get_id_for_value(instruction->getOperand(2)));
							is_in_bounds->add_id(builder.makeUintConstant(num_elements));
							impl.add(is_in_bounds);

							auto *assert_that = impl.allocate(spv::OpAssumeTrueKHR);
							assert_that->add_id(is_in_bounds->id);
							impl.add(assert_that);
						}
					}
				}
			}
		}

		if (i == 2 && elementptr_shift != 0)
		{
			spv::Id index = build_index_divider(impl, instruction->getOperand(2), elementptr_shift, 1);
			op->add_id(index);
		}
		else
		{
			spv::Id id = impl.get_id_for_value(instruction->getOperand(i));

			if (i == 2)
			{
				id = rewrite_alloca_gep_index(impl, instruction, id);
				if (id == UINT32_MAX)
					return true;
				if (!id)
					return false;
			}

			op->add_id(id);
		}
	}

	impl.handle_to_storage_class[instruction] = storage;
	impl.add(op);
	return true;
}

static bool needs_group_shared_auto_barrier(Converter::Impl &impl, const llvm::Value *ptr_value)
{
	return impl.shader_analysis.needs_auto_group_shared_barriers &&
	       DXIL::AddressSpace(ptr_value->getType()->getPointerAddressSpace()) ==
	       DXIL::AddressSpace::GroupShared;
}

static bool vkmm_requires_auto_visibility(Converter::Impl &impl, const llvm::Value *ptr)
{
	auto &ptrs = impl.llvm_vkmm_coherent_ptrs;
	if (ptrs.empty())
		return false;

	for (;;)
	{
		if (std::find(ptrs.begin(), ptrs.end(), ptr) != ptrs.end())
			return true;

		if (const auto *gep = llvm::dyn_cast<llvm::GetElementPtrInst>(ptr))
			ptr = gep->getOperand(0);
		else if (const auto *cast = llvm::dyn_cast<llvm::CastInst>(ptr))
			ptr = cast->getOperand(0);
		else
			break;
	}

	return false;
}

bool emit_load_instruction(Converter::Impl &impl, const llvm::LoadInst *instruction)
{
	auto itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getPointerOperand());

	// If we are trying to load a resource in RT, this does not translate in SPIR-V, defer this to createHandleForLib.
	if (itr != impl.llvm_global_variable_to_resource_mapping.end())
		return true;

	// We need to get the ID here as the constexpr chain could set our type.
	spv::Id value_id = impl.get_id_for_value(instruction->getPointerOperand());

	spv::Id remapped_type_id = resolve_llvm_actual_value_type(impl, nullptr,
	                                                          instruction->getPointerOperand(), 0);

	auto addr_space = DXIL::AddressSpace(instruction->getPointerOperand()->getType()->getPointerAddressSpace());
	bool non_private = addr_space != DXIL::AddressSpace::Thread &&
	                   impl.execution_mode_meta.memory_model == spv::MemoryModelVulkan;

	if (remapped_type_id != 0)
	{
		Operation *load_op = impl.allocate(spv::OpLoad, remapped_type_id);
		load_op->add_id(value_id);
		add_vkmm_access_qualifiers(impl, load_op, { non_private });
		impl.add(load_op);

		if (needs_group_shared_auto_barrier(impl, instruction->getPointerOperand()))
			load_op->flags |= Operation::AutoGroupSharedBarrier;

		Operation *cast_op = impl.allocate(spv::OpBitcast, instruction);
		cast_op->add_id(load_op->id);
		impl.add(cast_op);
	}
	else
	{
		auto robust_itr = impl.handle_to_robustness.find(instruction->getPointerOperand());
		Operation *op = impl.allocate(robust_itr != impl.handle_to_robustness.end() ? spv::PseudoOpMaskedLoad : spv::OpLoad, instruction);
		op->add_id(value_id);

		if (needs_group_shared_auto_barrier(impl, instruction->getPointerOperand()))
			op->flags |= Operation::AutoGroupSharedBarrier;

		// If this is remapped to BDA, need to add Aligned mask.
		auto tracked = gep_pointer_to_alloca_tracked_inst(impl, instruction->getPointerOperand());
		if (tracked.alloca_inst && tracked.itr->second.cbv_handle)
		{
			spv::Id ptr_id = impl.get_id_for_value(tracked.itr->second.cbv_handle);
			auto &meta = impl.handle_to_resource_meta[ptr_id];
			if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
			{
				op->add_literal(spv::MemoryAccessAlignedMask);
				op->add_literal(4);
			}
		}

		bool auto_visibility = false;

		// For NodeIO, we always have to tag with aligned mask.
		if (addr_space == DXIL::AddressSpace::PhysicalNodeIO)
		{
			// TODO: Properly track aligned size based on the GEP, but for now, just assume scalar.
			op->add_literal(spv::MemoryAccessAlignedMask);
			auto size_alignment = impl.get_physical_size_for_type(
			    impl.builder().getContainedTypeId(impl.get_type_id(instruction->getPointerOperand()->getType(), true)));
			op->add_literal(size_alignment.alignment);

			auto_visibility = vkmm_requires_auto_visibility(impl, instruction->getPointerOperand());
		}

		add_vkmm_access_qualifiers(impl, op, { non_private, auto_visibility });

		if (op->op == spv::PseudoOpMaskedLoad)
		{
			// OpSampledImage must be consumed in same block.
			// We'll split blocks here, so just recreate the combined sampler image if needed.
			impl.combined_image_sampler_cache.clear();
			op->add_id(robust_itr->second);
		}

		if (ags_llvm_load_filter(impl, op, instruction))
			return true;

		impl.add(op);
	}

	return true;
}

bool emit_store_instruction(Converter::Impl &impl, const llvm::StoreInst *instruction)
{
	// Ignore stores to remapped alloca().
	auto tracking = gep_pointer_to_alloca_tracked_inst(impl, instruction->getOperand(1));
	if (tracking.cbv_handle)
		return true;

	// Ignore stores of WMMA if it's not the first component
	if (wmma_store_is_masked(impl, instruction))
		return true;

	auto robust_itr = impl.handle_to_robustness.find(instruction->getOperand(1));
	Operation *op = impl.allocate(robust_itr != impl.handle_to_robustness.end() ? spv::PseudoOpMaskedStore : spv::OpStore);

	if (needs_group_shared_auto_barrier(impl, instruction->getOperand(1)))
		op->flags |= Operation::AutoGroupSharedBarrier;

	// We need to get the ID here as the constexpr chain could set our type.
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	spv::Id remapped_type_id = resolve_llvm_actual_value_type(impl, nullptr, instruction->getOperand(1), 0);

	if (remapped_type_id != 0)
	{
		Operation *cast_op = impl.allocate(spv::OpBitcast, remapped_type_id);
		cast_op->add_id(impl.get_id_for_value(instruction->getOperand(0)));
		impl.add(cast_op);
		op->add_id(cast_op->id);
	}
	else
		op->add_id(impl.get_id_for_value(instruction->getOperand(0)));

	auto addr_space = DXIL::AddressSpace(instruction->getOperand(1)->getType()->getPointerAddressSpace());
	bool non_private = addr_space != DXIL::AddressSpace::Thread &&
	                   impl.execution_mode_meta.memory_model == spv::MemoryModelVulkan;
	bool auto_visibility = false;

	// For NodeIO, we always have to tag with aligned mask.
	if (addr_space == DXIL::AddressSpace::PhysicalNodeIO)
	{
		// TODO: Properly track aligned size based on the GEP, but for now, just assume scalar.
		op->add_literal(spv::MemoryAccessAlignedMask);
		auto size_alignment = impl.get_physical_size_for_type(
			impl.builder().getContainedTypeId(impl.get_type_id(instruction->getOperand(1)->getType(), true)));
		op->add_literal(size_alignment.alignment);

		auto_visibility = vkmm_requires_auto_visibility(impl, instruction->getOperand(1));
	}

	add_vkmm_access_qualifiers(impl, op, { non_private, auto_visibility });

	if (op->op == spv::PseudoOpMaskedStore)
	{
		// OpSampledImage must be consumed in same block.
		// We'll split blocks here, so just recreate the combined sampler image if needed.
		impl.combined_image_sampler_cache.clear();
		op->add_id(robust_itr->second);
	}

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
		impl.rewrite_value(instruction, impl.builder().makeBoolConstant(false));
		return true;
	}

	case llvm::CmpInst::Predicate::FCMP_TRUE:
	{
		// Why on earth is this a thing ...
		impl.rewrite_value(instruction, impl.builder().makeBoolConstant(true));
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
	if (emit_ags_extract_value(impl, instruction))
		return true;

	auto itr = impl.llvm_composite_meta.find(instruction->getAggregateOperand());

	if (itr != impl.llvm_composite_meta.end() &&
	    itr->second.components == 1 &&
	    !itr->second.forced_composite)
	{
		// Forward the ID. The composite was originally emitted as a scalar.
		spv::Id rewrite_id = impl.get_id_for_value(instruction->getAggregateOperand());
		impl.rewrite_value(instruction, rewrite_id);
	}
	else
	{
		Operation *op = impl.allocate(spv::OpCompositeExtract, instruction);

		op->add_id(impl.get_id_for_value(instruction->getAggregateOperand()));
		for (unsigned i = 0; i < instruction->getNumIndices(); i++)
			op->add_literal(instruction->getIndices()[i]);

		impl.add(op);
		impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
	}

	return true;
}

bool emit_alloca_instruction(Converter::Impl &impl, const llvm::AllocaInst *instruction)
{
	// Remapped. Ignore.
	auto itr = impl.alloca_tracking.find(instruction);
	if (itr != impl.alloca_tracking.end() && itr->second.cbv_handle)
		return true;

	auto *element_type = instruction->getType()->getPointerElementType();
	if (llvm::isa<llvm::PointerType>(element_type))
	{
		LOGE("Cannot alloca elements of pointer type.\n");
		return false;
	}

	spv::Id pointee_type_id = impl.get_type_id(element_type);

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

	if (!ags_alloca_filter(impl, instruction, pointee_type_id))
		return false;

	auto storage = impl.get_effective_storage_class(instruction, spv::StorageClassFunction);
	spv::Id var_id = impl.create_variable(storage, pointee_type_id);
	impl.rewrite_value(instruction, var_id);
	impl.handle_to_storage_class[instruction] = storage;
	impl.decorate_relaxed_precision(element_type, var_id, false);
	return true;
}

static bool emit_peephole_findmsb(Converter::Impl &impl, const llvm::Instruction *instruction)
{
	// DXIL is CLZ, while original HLSL is Vulkan-style findMSB. Peephole the double-conversion pattern.
	auto *cond = instruction->getOperand(0);
	auto *true_value = instruction->getOperand(1);
	auto *false_value = instruction->getOperand(2);
	const llvm::CallInst *clz_instruction = nullptr;

	// Optimize clz(x) == -1 ? -1 : (bits - 1 - clz(x)) -> findmsb(x)

	if (auto *cmp = llvm::dyn_cast<llvm::CmpInst>(cond))
	{
		if (cmp->getPredicate() != llvm::CmpInst::Predicate::ICMP_EQ)
			return false;

		if (!value_is_dx_op_instrinsic(cmp->getOperand(0), DXIL::Op::FirstbitHi) &&
		    !value_is_dx_op_instrinsic(cmp->getOperand(0), DXIL::Op::FirstbitSHi))
			return false;

		uint32_t const_val = 0;
		if (!get_constant_operand(cmp, 1, &const_val) || const_val != UINT32_MAX)
			return false;

		clz_instruction = llvm::cast<llvm::CallInst>(cmp->getOperand(0));
	}
	else
		return false;

	if (auto *true_const_value = llvm::dyn_cast<llvm::ConstantInt>(true_value))
	{
		if (true_const_value->getUniqueInteger().getSExtValue() != -1)
			return false;
	}
	else
		return false;

	if (auto *sub_inst = llvm::dyn_cast<llvm::BinaryOperator>(false_value))
	{
		if (sub_inst->getOpcode() != llvm::Instruction::BinaryOps::Sub)
			return false;

		if (sub_inst->getOperand(1) != clz_instruction)
			return false;

		uint32_t const_val = 0;
		if (!get_constant_operand(sub_inst, 0, &const_val) ||
		    const_val != clz_instruction->getOperand(1)->getType()->getIntegerBitWidth() - 1)
		{
			return false;
		}
	}
	else
		return false;

	GLSLstd450 opcode;
	if (value_is_dx_op_instrinsic(clz_instruction, DXIL::Op::FirstbitHi))
		opcode = GLSLstd450FindUMsb;
	else
		opcode = GLSLstd450FindSMsb;

	emit_native_bitscan(opcode, impl, instruction, clz_instruction->getOperand(1));
	return true;
}

bool emit_select_instruction(Converter::Impl &impl, const llvm::SelectInst *instruction)
{
	if (emit_peephole_findmsb(impl, instruction))
		return true;

	Operation *op = impl.allocate(spv::OpSelect, instruction);

	for (unsigned i = 0; i < 3; i++)
		op->add_id(impl.get_id_for_value(instruction->getOperand(i)));

	impl.add(op);
	impl.decorate_relaxed_precision(instruction->getType(), op->id, false);
	return true;
}

bool emit_cmpxchg_instruction(Converter::Impl &impl, const llvm::AtomicCmpXchgInst *instruction)
{
	auto &builder = impl.builder();

	unsigned bits = get_composite_element_type(instruction->getType())->getIntegerBitWidth();
	if (bits == 64)
		builder.addCapability(spv::CapabilityInt64Atomics);

	Operation *atomic_op = impl.allocate(spv::OpAtomicCompareExchange, builder.makeUintType(bits));
	if (needs_group_shared_auto_barrier(impl, instruction->getPointerOperand()))
		atomic_op->flags |= Operation::AutoGroupSharedBarrier;

	atomic_op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));

	atomic_op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
	atomic_op->add_id(builder.makeUintConstant(0));
	atomic_op->add_id(builder.makeUintConstant(0));
	atomic_op->add_id(impl.get_id_for_value(instruction->getNewValOperand()));
	atomic_op->add_id(impl.get_id_for_value(instruction->getCompareOperand()));

	impl.add(atomic_op);

	Operation *cmp_op = impl.allocate(spv::OpIEqual, builder.makeBoolType());
	cmp_op->add_ids({ atomic_op->id, impl.get_id_for_value(instruction->getCompareOperand()) });
	impl.add(cmp_op);

	if (!impl.cmpxchg_type)
		impl.cmpxchg_type =
		    impl.get_struct_type({ builder.makeUintType(bits), builder.makeBoolType() }, 0, "CmpXchgResult");

	Operation *op = impl.allocate(spv::OpCompositeConstruct, instruction, impl.cmpxchg_type);
	op->add_ids({ atomic_op->id, cmp_op->id });
	impl.add(op);

	return true;
}

bool emit_atomicrmw_instruction(Converter::Impl &impl, const llvm::AtomicRMWInst *instruction)
{
	if (emit_ags_atomicrmw(impl, instruction))
		return true;

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

	unsigned bits = instruction->getType()->getIntegerBitWidth();
	if (bits == 64)
		builder.addCapability(spv::CapabilityInt64Atomics);

	Operation *op = impl.allocate(opcode, instruction);
	if (needs_group_shared_auto_barrier(impl, instruction->getPointerOperand()))
		op->flags |= Operation::AutoGroupSharedBarrier;

	op->add_id(impl.get_id_for_value(instruction->getPointerOperand()));

	op->add_id(builder.makeUintConstant(spv::ScopeWorkgroup));
	op->add_id(builder.makeUintConstant(0));
	op->add_id(impl.get_id_for_value(instruction->getValOperand()));

	impl.add(op);
	return true;
}

bool emit_shufflevector_instruction(Converter::Impl &impl, const llvm::ShuffleVectorInst *inst)
{
	Operation *op = impl.allocate(spv::OpVectorShuffle, inst);

	for (unsigned i = 0; i < 2; i++)
		op->add_id(impl.get_id_for_value(inst->getOperand(i)));

	unsigned num_outputs = inst->getType()->getVectorNumElements();
	for (unsigned i = 0; i < num_outputs; i++)
		op->add_literal(inst->getMaskValue(i));

	impl.add(op);
	return true;
}

bool emit_extractelement_instruction(Converter::Impl &impl, const llvm::ExtractElementInst *inst)
{
	spv::Id id;
	if (auto *constant_int = llvm::dyn_cast<llvm::ConstantInt>(inst->getIndexOperand()))
	{
		Operation *op = impl.allocate(spv::OpCompositeExtract, inst);
		op->add_id(impl.get_id_for_value(inst->getVectorOperand()));
		op->add_literal(uint32_t(constant_int->getUniqueInteger().getZExtValue()));
		impl.add(op);
		id = op->id;
	}
	else
	{
		Operation *op = impl.allocate(spv::OpVectorExtractDynamic, inst);
		op->add_id(impl.get_id_for_value(inst->getVectorOperand()));
		op->add_id(impl.get_id_for_value(inst->getIndexOperand()));
		impl.add(op);
		id = op->id;
	}
	impl.decorate_relaxed_precision(inst->getType(), id, false);
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

	// If this GEP is associated with a tracked alloca, we might want to mask the GEP
	// if this GEP is actually never consumed.
	// Avoids lots of dead code being emitted which looks goofy in disassemblies.
	auto tracking = gep_pointer_to_alloca_tracked_inst(impl, inst);
	if (tracking.alloca_inst)
		impl.masked_alloca_forward_gep.insert(inst);

	return true;
}

bool analyze_load_instruction(Converter::Impl &impl, const llvm::LoadInst *inst)
{
	auto tracked = gep_pointer_to_alloca_tracked_inst(impl, inst->getPointerOperand());
	if (tracked.cbv_handle)
	{
		tracked.itr->second.has_load = true;
		// We'll need this GEP after all.
		impl.masked_alloca_forward_gep.erase(llvm::cast<llvm::GetElementPtrInst>(inst->getPointerOperand()));
	}

	if (DXIL::AddressSpace(inst->getPointerOperand()->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::GroupShared)
		impl.shader_analysis.has_group_shared_access = true;

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

static bool analyze_alloca_store(Converter::Impl &impl,
                                 const llvm::AllocaInst *alloca_inst,
                                 AllocaCBVForwardingTracking &tracking,
                                 const llvm::Value *index,
                                 const llvm::Value *store_value)
{
	// If we observe store after load, invalidate.
	// Instructions are processed in domination order, so this kind of linear tracking is fine.
	// If a store instruction is reachable after a load, it will be processed after the load.
	if (tracking.has_load)
		return false;

	// Need to store with constant GEP index.
	const auto *const_index = llvm::dyn_cast<llvm::ConstantInt>(index);
	if (!const_index)
		return false;

	uint32_t store_index = const_index->getUniqueInteger().getZExtValue();

	// This needs to be extractvalue from a cbuffer load, that is directly stored into alloca().
	// Ignore non-legacy cbuffer for now. Can be expanded as needed. Non-legacy cbuffer is very rare.
	const auto *extract_value = llvm::dyn_cast<llvm::ExtractValueInst>(store_value);
	if (!extract_value)
		return false;

	const auto *aggregate = extract_value->getAggregateOperand();
	if (!value_is_dx_op_instrinsic(aggregate, DXIL::Op::CBufferLoadLegacy))
		return false;

	const auto *cbuf_load = llvm::cast<llvm::CallInst>(aggregate);
	const auto *cbuffer_handle = cbuf_load->getOperand(1);
	if (tracking.cbv_handle && cbuffer_handle != tracking.cbv_handle)
		return false;

	const auto *cbv_index = llvm::dyn_cast<llvm::ConstantInt>(cbuf_load->getOperand(2));
	if (!cbv_index)
		return false;

	uint32_t scalar_index_offset =
		cbv_index->getUniqueInteger().getZExtValue() * 4 + extract_value->getIndices()[0];

	// Don't want negative word offsets, that does not make much sense.
	if (scalar_index_offset < store_index)
		return false;

	if (tracking.cbv_handle)
	{
		// Redundant store just needs to be validated.
		if (store_index == 0)
			return tracking.scalar_index_offset == scalar_index_offset;

		// Negative stride. Non-sense.
		if (scalar_index_offset < tracking.scalar_index_offset)
			return false;

		scalar_index_offset -= tracking.scalar_index_offset;
		uint32_t stride = scalar_index_offset / store_index;

		// Awkward and doesn't happen in practice. We use this as sentinel.
		if (stride == 0)
			return false;

		// This comes up when alloca-ing vectors. We end up with multiple scalar arrays.
		// When accessing the CBV we have to multiply the stride back up again.
		if ((tracking.stride && stride != tracking.stride) || (scalar_index_offset % stride != 0))
			return false;

		tracking.stride = stride;
	}
	else
	{
		// The first store should be to offset 0. This latches base values.
		if (store_index != 0)
			return false;

		// Must observe a write to last element, for robustness reasons.
		// We only need to care about this for BDA, but always checking is fine with shaders in the wild.
		tracking.min_highest_store_index = alloca_inst->getType()->getPointerElementType()->getArrayNumElements() - 1;
		tracking.cbv_handle = cbuffer_handle;
		tracking.scalar_index_offset = scalar_index_offset;
	}

	tracking.highest_store_index = std::max<uint32_t>(tracking.highest_store_index, store_index);
	return true;
}

bool analyze_store_instruction(Converter::Impl &impl, const llvm::StoreInst *inst)
{
	auto tracked = gep_pointer_to_alloca_tracked_inst(impl, inst->getOperand(1));
	if (tracked.index && !analyze_alloca_store(
		impl, tracked.alloca_inst,
		tracked.itr->second, tracked.index, inst->getOperand(0)))
	{
		impl.alloca_tracking.erase(tracked.itr);
	}

	if (DXIL::AddressSpace(inst->getOperand(1)->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::GroupShared)
		impl.shader_analysis.has_group_shared_access = true;

	if (!analyze_ags_wmma_store(impl, inst))
		return false;

	// Assume we're consuming the entire uvec4.
	if (instruction_is_ballot(inst->getOperand(0)))
	{
		impl.shader_analysis.subgroup_ballot_reads_first = true;
		impl.shader_analysis.subgroup_ballot_reads_upper = true;
	}

	return true;
}

bool analyze_atomicrmw_instruction(Converter::Impl &impl, const llvm::AtomicRMWInst *inst)
{
	if (DXIL::AddressSpace(inst->getPointerOperand()->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::GroupShared)
		impl.shader_analysis.has_group_shared_access = true;
	return true;
}

bool analyze_cmpxchg_instruction(Converter::Impl &impl, const llvm::AtomicCmpXchgInst *inst)
{
	if (DXIL::AddressSpace(inst->getPointerOperand()->getType()->getPointerAddressSpace()) == DXIL::AddressSpace::GroupShared)
		impl.shader_analysis.has_group_shared_access = true;
	return true;
}

bool analyze_alloca_instruction(Converter::Impl &impl, const llvm::AllocaInst *inst)
{
	// Only attempt to track simple 32-bit scalar cases.
	// We don't want to deal with DXR vector types, or weird 16-bit promotion shenanigans.
	if (DXIL::AddressSpace(inst->getType()->getAddressSpace()) != DXIL::AddressSpace::Thread)
		return true;

	if (const auto *array_type = llvm::dyn_cast<llvm::ArrayType>(inst->getType()->getPointerElementType()))
	{
		auto *elem_type = array_type->getArrayElementType();
		bool simple_scalar;

		switch (elem_type->getTypeID())
		{
		case llvm::Type::TypeID::FloatTyID:
			simple_scalar = true;
			break;

		case llvm::Type::TypeID::IntegerTyID:
			simple_scalar = elem_type->getIntegerBitWidth() == 32;
			break;

		default:
			simple_scalar = false;
			break;
		}

		if (simple_scalar)
			impl.alloca_tracking[inst] = {};
	}

	return true;
}

static void analyze_extractvalue_instruction(
    Converter::Impl &impl, const llvm::Value *aggregate, unsigned index)
{
	auto &meta = impl.llvm_composite_meta[aggregate];
	bool forward_progress = false;
	const auto *phi = llvm::dyn_cast<llvm::PHINode>(aggregate);

	bool is_fake_struct =
	    std::find(impl.llvm_dxil_op_fake_struct_types.begin(),
	              impl.llvm_dxil_op_fake_struct_types.end(), aggregate->getType()) !=
	    impl.llvm_dxil_op_fake_struct_types.end();

	bool splat_composite_access = phi && index < 4 && is_fake_struct;

	if (splat_composite_access)
	{
		if ((meta.access_mask & 0xf) != 0xf)
		{
			meta.access_mask |= 0xf;
			meta.components = std::max<uint32_t>(4, meta.components);
			forward_progress = true;
		}
	}
	else if ((meta.access_mask & (1u << index)) == 0)
	{
		meta.access_mask |= 1u << index;
		meta.components = std::max<uint32_t>(index + 1, meta.components);
		forward_progress = true;
	}

	if (instruction_is_ballot(aggregate))
	{
		if (index == 0)
			impl.shader_analysis.subgroup_ballot_reads_first = true;
		else
			impl.shader_analysis.subgroup_ballot_reads_upper = true;
	}
	else if (forward_progress && phi)
	{
		// Incoming values to a PHI aggregate must also be flagged as having access.
		// Try to avoid potential cycles if there are PHIs in a loop.
		for (uint32_t i = 0; i < phi->getNumIncomingValues(); i++)
		{
			if (splat_composite_access)
			{
				// Enforce that we get the full 4 components from a normal resource load.
				for (uint32_t c = 0; c < 4; c++)
					analyze_extractvalue_instruction(impl, phi->getIncomingValue(i), c);
			}
			else
			{
				analyze_extractvalue_instruction(impl, phi->getIncomingValue(i), index);
			}
		}
	}
}

bool analyze_extractvalue_instruction(Converter::Impl &impl, const llvm::ExtractValueInst *inst)
{
	if (inst->getNumIndices() == 1 && type_is_composite_return_value(inst->getAggregateOperand()->getType()))
		analyze_extractvalue_instruction(impl, inst->getAggregateOperand(), inst->getIndices()[0]);
	return true;
}

bool analyze_compare_instruction(Converter::Impl &impl, const llvm::CmpInst *inst)
{
	// With patterns like WaveReadFirstLane(x) == x, we have to be extremely careful.
	// A boolean like this will generally be used in control flow later, and if this is in a loop,
	// we risk infinite loops. This is technically undefined in DX without WaveOpsIncludeHelperLanes,
	// but games rely on it working ... somehow :')

	if (inst->getPredicate() != llvm::CmpInst::Predicate::ICMP_EQ &&
	    inst->getPredicate() != llvm::CmpInst::Predicate::ICMP_NE)
	{
		return true;
	}

	auto *op0 = inst->getOperand(0);
	auto *op1 = inst->getOperand(1);

	bool op0_is_read_first = value_is_dx_op_instrinsic(op0, DXIL::Op::WaveReadLaneFirst);
	bool op1_is_read_first = value_is_dx_op_instrinsic(op1, DXIL::Op::WaveReadLaneFirst);
	if (op1_is_read_first)
	{
		std::swap(op0, op1);
		std::swap(op0_is_read_first, op1_is_read_first);
	}

	if (op0_is_read_first && !op1_is_read_first)
	{
		auto *call = llvm::cast<llvm::CallInst>(op0);
		if (call->getOperand(1) == op1)
			impl.wave_op_forced_helper_lanes.insert(call);
	}

	return true;
}

bool can_optimize_conditional_branch_to_static(
    Converter::Impl &impl, const llvm::Value *value, bool &static_cond)
{
	// Can be expanded as needed.
	// For now, search for common exhaustive loop unrolling patterns that DXC farts out.
	// Expect pattern of:
	// lower_bounded_expression > constant.
	// In the shader we've seen, we have: constant / WaveGetLaneCount(), which
	// we must narrow the bound of to avoid generating invalid code.
	const auto *comp_inst = llvm::dyn_cast<llvm::CmpInst>(value);
	if (!comp_inst)
		return false;

	if (comp_inst->getPredicate() != llvm::CmpInst::Predicate::ICMP_UGT)
		return false;

	const auto *rhs = llvm::dyn_cast<llvm::ConstantInt>(comp_inst->getOperand(1));
	if (!rhs)
		return false;

	uint64_t rhs_value = rhs->getUniqueInteger().getZExtValue();

	const auto *lhs = llvm::dyn_cast<llvm::BinaryOperator>(comp_inst->getOperand(0));
	if (!lhs)
		return false;

	if (lhs->getOpcode() != llvm::BinaryOperator::BinaryOps::UDiv)
		return false;

	const auto *num = llvm::dyn_cast<llvm::ConstantInt>(lhs->getOperand(0));
	if (!num)
		return false;
	if (!value_is_dx_op_instrinsic(lhs->getOperand(1), DXIL::Op::WaveGetLaneCount))
		return false;

	uint64_t upper_bound =
	    num->getUniqueInteger().getZExtValue() / impl.options.subgroup_size.implementation_minimum;
	uint64_t lower_bound =
		num->getUniqueInteger().getZExtValue() / impl.options.subgroup_size.implementation_maximum;

	if (lower_bound > rhs_value)
	{
		static_cond = true;
		return true;
	}
	else if (rhs_value >= upper_bound)
	{
		static_cond = false;
		return true;
	}
	else
	{
		static_cond = false;
		return false;
	}
}

#ifdef HAVE_LLVMBC
// Extensions to normal LLVM API used by custom IR.
static bool emit_composite_construct_instruction(Converter::Impl &impl, const llvm::CompositeConstructInst *inst)
{
	auto *constr = impl.allocate(spv::OpCompositeConstruct, inst);
	for (unsigned i = 0; i < inst->getNumOperands(); i++)
		constr->add_id(impl.get_id_for_value(inst->getOperand(i)));
	impl.add(constr);
	return true;
}
#endif

bool emit_call_instruction(Converter::Impl &impl, const llvm::CallInst &inst)
{
	auto *call = impl.allocate(spv::OpFunctionCall, &inst);
	call->add_id(impl.get_id_for_value(inst.getCalledFunction()));
	for (uint32_t i = 0; i < inst.getNumOperands(); i++)
		call->add_id(impl.get_id_for_value(inst.getOperand(i)));
	impl.add(call);
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
#ifdef HAVE_LLVMBC
	else if (auto *composite_construct_inst = llvm::dyn_cast<llvm::CompositeConstructInst>(&instruction))
		return emit_composite_construct_instruction(impl, composite_construct_inst);
#endif
	else
		return false;
}
} // namespace dxil_spv
