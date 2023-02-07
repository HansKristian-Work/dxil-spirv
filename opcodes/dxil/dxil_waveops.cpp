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

#include "dxil_waveops.hpp"
#include "dxil_common.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool emit_wave_is_first_lane_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(spv::OpGroupNonUniformElect, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));

	builder.addCapability(spv::CapabilityGroupNonUniform);
	impl.add(op);
	return true;
}

bool emit_wave_builtin_instruction(spv::BuiltIn builtin, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id var_id = impl.spirv_module.get_builtin_shader_input(builtin);
	auto *op = impl.allocate(spv::OpLoad, instruction);
	op->add_id(var_id);

	impl.add(op);
	return true;
}

bool emit_wave_boolean_instruction(spv::Op opcode, Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(opcode, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	builder.addCapability(spv::CapabilityGroupNonUniformVote);
	impl.add(op);
	return true;
}

bool emit_wave_ballot_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id bool_value;

	// Disable this path for now. It appears to cause GPU hangs in some very weird cases.
	// Near-impossible to debug, and it should be safer to not mess with lanes here anyways.
#if 0
	if (impl.execution_model == spv::ExecutionModelFragment)
	{
		auto *is_helper = impl.allocate(spv::OpIsHelperInvocationEXT, builder.makeBoolType());
		impl.add(is_helper);

		auto *is_active = impl.allocate(spv::OpLogicalNot, builder.makeBoolType());
		is_active->add_id(is_helper->id);
		impl.add(is_active);

		auto *is_active_ballot = impl.allocate(spv::OpLogicalAnd, builder.makeBoolType());
		is_active_ballot->add_ids({ impl.get_id_for_value(instruction->getOperand(1)), is_active->id });
		impl.add(is_active_ballot);

		bool_value = is_active_ballot->id;
	}
	else
#endif
	{
		bool_value = impl.get_id_for_value(instruction->getOperand(1));
	}

	auto *op = impl.allocate(spv::OpGroupNonUniformBallot, instruction,
	                         builder.makeVectorType(builder.makeUintType(32), 4));
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_id(bool_value);

	impl.add(op);
	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	return true;
}

bool emit_wave_read_lane_first_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	auto *op = impl.allocate(spv::OpGroupNonUniformBroadcastFirst, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	impl.add(op);
	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	return true;
}

static bool execution_model_can_quad_op(spv::ExecutionModel model)
{
	return model == spv::ExecutionModelFragment ||
	       model == spv::ExecutionModelGLCompute;
}

static bool value_is_wave_lane(const llvm::Value *value)
{
	auto *dxil_op = llvm::dyn_cast<llvm::CallInst>(value);
	if (!dxil_op)
		return false;
	if (strncmp(dxil_op->getCalledFunction()->getName().data(), "dx.op", 5) != 0)
		return false;

	uint32_t op;
	if (!get_constant_operand(dxil_op, 0, &op))
		return false;

	return DXIL::Op(op) == DXIL::Op::WaveGetLaneIndex;
}

static bool get_constant_int(const llvm::Value *value, uint32_t *const_value)
{
	if (const auto *c = llvm::dyn_cast<llvm::ConstantInt>(value))
	{
		*const_value = uint32_t(c->getUniqueInteger().getZExtValue());
		return true;
	}
	else
		return false;
}

static bool get_constant_xor_lane(const llvm::Value *lane, uint32_t *xor_lane)
{
	auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(lane);
	if (!binop)
		return false;

	if (binop->getOpcode() != llvm::BinaryOperator::BinaryOps::Xor)
		return false;

	auto *lhs = binop->getOperand(0);
	auto *rhs = binop->getOperand(1);
	bool lhs_is_wave_lane = value_is_wave_lane(lhs);
	bool rhs_is_wave_lane = value_is_wave_lane(rhs);

	if (lhs_is_wave_lane && llvm::isa<llvm::ConstantInt>(rhs))
		return get_constant_int(rhs, xor_lane);
	else if (rhs_is_wave_lane && llvm::isa<llvm::ConstantInt>(lhs))
		return get_constant_int(lhs, xor_lane);

	return false;
}

static bool get_constant_quad_lane(const llvm::Value *lane, uint32_t *quad_lane)
{
	// Cases to consider:
	// - (gl_SubgroupInvocationID & ~3u) | C, where C is [0, 1, 2, 3].
	// - (gl_SubgroupInvocationID & ~3u) + C, where C is [0, 1, 2, 3].
	// - (gl_SubgroupInvocationID & ~3u) -> C = 0
	// - (gl_SubgroupInvocationID | 3u) -> C = 3
	auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(lane);
	if (!binop)
		return false;

	auto *lhs = binop->getOperand(0);
	auto *rhs = binop->getOperand(1);
	bool lhs_is_wave_lane = value_is_wave_lane(lhs);
	bool rhs_is_wave_lane = value_is_wave_lane(rhs);
	uint32_t secondary_quad_lane = 0;

	if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Or)
	{
		if ((get_constant_int(lhs, quad_lane) && rhs_is_wave_lane) ||
		    (lhs_is_wave_lane && get_constant_int(rhs, quad_lane)))
		{
			// Case 3
			return *quad_lane == 3;
		}
		else if ((get_constant_int(lhs, quad_lane) && get_constant_quad_lane(rhs, &secondary_quad_lane)) ||
		         (get_constant_quad_lane(lhs, &secondary_quad_lane) && get_constant_int(rhs, quad_lane)))
		{
			// Case 0
			return *quad_lane < 4 && secondary_quad_lane == 0;
		}
	}
	else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::And)
	{
		if ((get_constant_int(lhs, quad_lane) && rhs_is_wave_lane) ||
		    (lhs_is_wave_lane && get_constant_int(rhs, quad_lane)))
		{
			// Case 2
			if (*quad_lane == ~3u)
			{
				*quad_lane = 0;
				return true;
			}
		}
	}
	else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Add)
	{
		if ((get_constant_int(lhs, quad_lane) && get_constant_quad_lane(rhs, &secondary_quad_lane)) ||
		    (get_constant_quad_lane(lhs, &secondary_quad_lane) && get_constant_int(rhs, quad_lane)))
		{
			// Case 0
			return *quad_lane < 4 && secondary_quad_lane == 0;
		}
	}

	return false;
}

bool emit_wave_read_lane_at_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	auto *lane = instruction->getOperand(2);

	Operation *op;
	if (llvm::isa<llvm::ConstantInt>(lane))
	{
		op = impl.allocate(spv::OpGroupNonUniformBroadcast, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		op->add_id(impl.get_id_for_value(lane));
		builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	}
	else
	{
		// Some games seem to use WaveReadLaneAt where it should have used QuadReadLaneAt.
		// This generates a flurry of ds_permute instructions, where it could have used implicit quad shuffle instead.
		// Rather than emitting a ton of shuffles, try to optimize the statements back to a quad broadcast.

		uint32_t const_lane = 0;
		if (execution_model_can_quad_op(impl.execution_model) && get_constant_quad_lane(lane, &const_lane))
		{
			op = impl.allocate(spv::OpGroupNonUniformQuadBroadcast, instruction);
			op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
			op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
			op->add_id(builder.makeUintConstant(const_lane));
			builder.addCapability(spv::CapabilityGroupNonUniformQuad);
		}
		else if (get_constant_xor_lane(lane, &const_lane))
		{
			if (execution_model_can_quad_op(impl.execution_model) && const_lane < 4 && const_lane > 0)
			{
				// Here we assume that derivative groups are 1D.
				// This is always the case since we rewrite LocalInvocationID.
				op = impl.allocate(spv::OpGroupNonUniformQuadSwap, instruction);
				op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
				op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
				op->add_id(builder.makeUintConstant(const_lane - 1u));
				builder.addCapability(spv::CapabilityGroupNonUniformQuad);
			}
			else
			{
				op = impl.allocate(spv::OpGroupNonUniformShuffleXor, instruction);
				op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
				op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
				op->add_id(builder.makeUintConstant(const_lane));
				builder.addCapability(spv::CapabilityGroupNonUniformShuffle);
			}
		}
		else
		{
			op = impl.allocate(spv::OpGroupNonUniformShuffle, instruction);
			op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
			op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
			op->add_id(impl.get_id_for_value(lane));
			builder.addCapability(spv::CapabilityGroupNonUniformShuffle);
		}
	}

	impl.add(op);
	return true;
}

bool emit_wave_bit_count_instruction(spv::GroupOperation operation, Converter::Impl &impl,
                                     const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	auto *ballot_op = impl.allocate(spv::OpGroupNonUniformBallot, builder.makeVectorType(builder.makeUintType(32), 4));
	ballot_op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	ballot_op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(ballot_op);

	auto *op = impl.allocate(spv::OpGroupNonUniformBallotBitCount, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_literal(operation);
	op->add_id(ballot_op->id);

	builder.addCapability(spv::CapabilityGroupNonUniformBallot);
	impl.add(op);
	return true;
}

static spv::Op select_opcode(const llvm::CallInst *instruction, spv::Op fp, spv::Op s, spv::Op u)
{
	uint32_t sign_kind;
	if (!get_constant_operand(instruction, 3, &sign_kind))
		return spv::OpNop;

	if (instruction->getType()->getTypeID() != llvm::Type::TypeID::IntegerTyID)
		return fp;
	else if (static_cast<DXIL::SignedOpKind>(sign_kind) == DXIL::SignedOpKind::Signed)
		return s;
	else
		return u;
}

static spv::Op select_opcode(const llvm::CallInst *instruction, spv::Op fp, spv::Op i)
{
	if (instruction->getType()->getTypeID() != llvm::Type::TypeID::IntegerTyID)
		return fp;
	else
		return i;
}

bool emit_wave_active_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Op opcode = spv::OpNop;

	uint32_t op_kind;
	if (!get_constant_operand(instruction, 2, &op_kind))
		return false;

	switch (static_cast<DXIL::WaveOpKind>(op_kind))
	{
	case DXIL::WaveOpKind::Sum:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFAdd, spv::OpGroupNonUniformIAdd,
		                       spv::OpGroupNonUniformIAdd);
		break;

	case DXIL::WaveOpKind::Product:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFMul, spv::OpGroupNonUniformIMul,
		                       spv::OpGroupNonUniformIMul);
		break;

	case DXIL::WaveOpKind::Min:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFMin, spv::OpGroupNonUniformSMin,
		                       spv::OpGroupNonUniformUMin);
		break;

	case DXIL::WaveOpKind::Max:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFMax, spv::OpGroupNonUniformSMax,
		                       spv::OpGroupNonUniformUMax);
		break;
	}

	auto *op = impl.allocate(opcode, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_literal(spv::GroupOperationReduce);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);

	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	return true;
}

bool emit_wave_prefix_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Op opcode;

	uint32_t op_kind;
	if (!get_constant_operand(instruction, 2, &op_kind))
		return false;

	switch (static_cast<DXIL::WaveOpKind>(op_kind))
	{
	case DXIL::WaveOpKind::Sum:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFAdd, spv::OpGroupNonUniformIAdd);
		break;

	case DXIL::WaveOpKind::Product:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFMul, spv::OpGroupNonUniformIMul);
		break;

	default:
		return false;
	}

	auto *op = impl.allocate(opcode, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_literal(spv::GroupOperationExclusiveScan);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);

	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	return true;
}

bool emit_wave_multi_prefix_count_bits_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::WaveMultiPrefixCountBits);

	auto *op = impl.allocate(spv::OpFunctionCall, instruction);
	op->add_id(call_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

	spv::Id ballot[4];
	for (unsigned i = 0; i < 4; i++)
		ballot[i] = impl.get_id_for_value(instruction->getOperand(2 + i));
	op->add_id(impl.build_vector(builder.makeUintType(32), ballot, 4));
	impl.add(op);

	return true;
}

bool emit_wave_multi_prefix_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	uint32_t op_kind;
	if (!get_constant_operand(instruction, 6, &op_kind))
		return false;

	HelperCall helper_call;
	bool fp = !instruction->getOperand(1)->getType()->isIntegerTy();

	switch (static_cast<DXIL::WaveMultiPrefixOpKind>(op_kind))
	{
	case DXIL::WaveMultiPrefixOpKind::Sum:
		helper_call = fp ? HelperCall::WaveMultiPrefixFAdd : HelperCall::WaveMultiPrefixIAdd;
		break;

	case DXIL::WaveMultiPrefixOpKind::Product:
		helper_call = fp ? HelperCall::WaveMultiPrefixFMul : HelperCall::WaveMultiPrefixIMul;
		break;

	case DXIL::WaveMultiPrefixOpKind::And:
		helper_call = HelperCall::WaveMultiPrefixBitAnd;
		break;

	case DXIL::WaveMultiPrefixOpKind::Or:
		helper_call = HelperCall::WaveMultiPrefixBitOr;
		break;

	case DXIL::WaveMultiPrefixOpKind::Xor:
		helper_call = HelperCall::WaveMultiPrefixBitXor;
		break;

	default:
		return false;
	}

	spv::Id type_id = impl.get_type_id(instruction->getOperand(1)->getType());
	spv::Id call_id = impl.spirv_module.get_helper_call_id(helper_call, type_id);

	auto *op = impl.allocate(spv::OpFunctionCall, instruction);
	op->add_id(call_id);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	spv::Id ballot[4];
	for (unsigned i = 0; i < 4; i++)
		ballot[i] = impl.get_id_for_value(instruction->getOperand(2 + i));
	op->add_id(impl.build_vector(builder.makeUintType(32), ballot, 4));
	impl.add(op);

	return true;
}

bool emit_wave_active_bit_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Op opcode = spv::OpNop;

	uint32_t op_kind;
	if (!get_constant_operand(instruction, 2, &op_kind))
		return false;

	switch (static_cast<DXIL::WaveBitOpKind>(op_kind))
	{
	case DXIL::WaveBitOpKind::And:
		opcode = spv::OpGroupNonUniformBitwiseAnd;
		break;

	case DXIL::WaveBitOpKind::Or:
		opcode = spv::OpGroupNonUniformBitwiseOr;
		break;

	case DXIL::WaveBitOpKind::Xor:
		opcode = spv::OpGroupNonUniformBitwiseXor;
		break;
	}

	auto *op = impl.allocate(opcode, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_literal(spv::GroupOperationReduce);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);

	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	return true;
}

bool emit_wave_quad_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	// Matches with SPIR-V.
	uint32_t swap_kind;
	if (!get_constant_operand(instruction, 2, &swap_kind))
		return false;

	Operation *op;
	if (execution_model_can_quad_op(impl.execution_model))
	{
		op = impl.allocate(spv::OpGroupNonUniformQuadSwap, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		op->add_id(builder.makeUintConstant(swap_kind));
		builder.addCapability(spv::CapabilityGroupNonUniformQuad);
	}
	else
	{
		// Use ShuffleXor for non-fragment stages.
		op = impl.allocate(spv::OpGroupNonUniformShuffleXor, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

		// 1: Horizontal, 2: Vertical, 3: Diagonal.
		op->add_id(builder.makeUintConstant(swap_kind + 1));
		builder.addCapability(spv::CapabilityGroupNonUniformShuffle);
	}

	impl.add(op);
	return true;
}

bool emit_wave_quad_read_lane_at_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	auto *lane = instruction->getOperand(2);

	Operation *op;
	if (execution_model_can_quad_op(impl.execution_model) && llvm::isa<llvm::ConstantInt>(lane))
	{
		op = impl.allocate(spv::OpGroupNonUniformQuadBroadcast, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		op->add_id(impl.get_id_for_value(lane));
		builder.addCapability(spv::CapabilityGroupNonUniformQuad);
	}
	else
	{
		// Have to emulate this with Shuffle.
		spv::Id local_id = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSubgroupLocalInvocationId);
		{
			Operation *load_op = impl.allocate(spv::OpLoad, builder.makeUintType(32));
			load_op->add_id(local_id);
			impl.add(load_op);
			local_id = load_op->id;
		}

		{
			Operation *mask_op = impl.allocate(spv::OpBitwiseAnd, builder.makeUintType(32));
			mask_op->add_id(local_id);
			mask_op->add_id(builder.makeUintConstant(~3u));
			impl.add(mask_op);
			local_id = mask_op->id;
		}

		{
			Operation *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
			add_op->add_id(local_id);
			add_op->add_id(impl.get_id_for_value(lane));
			impl.add(add_op);
			local_id = add_op->id;
		}

		// Use Shuffle for non-fragment stages.
		op = impl.allocate(spv::OpGroupNonUniformShuffle, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		op->add_id(local_id);

		builder.addCapability(spv::CapabilityGroupNonUniformShuffle);
	}

	impl.add(op);
	return true;
}

bool emit_wave_match_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id type_id = impl.get_type_id(instruction->getOperand(1)->getType());
	spv::Id value_id = impl.get_id_for_value(instruction->getOperand(1));

	// It's not safe to use FOrdEqual since a loop with NaN will never compare equal to BroadcastFirst().
	// Make sure we compare equal with uint.
	spv::Op cast_op = spv::OpNop;
	switch (instruction->getOperand(1)->getType()->getTypeID())
	{
	case llvm::Type::TypeID::HalfTyID:
		type_id = builder.makeUintType(impl.support_16bit_operations() ? 16 : 32);
		cast_op = spv::OpBitcast;
		break;

	case llvm::Type::TypeID::FloatTyID:
		type_id = builder.makeUintType(32);
		cast_op = spv::OpBitcast;
		break;

	case llvm::Type::TypeID::DoubleTyID:
		type_id = builder.makeUintType(64);
		cast_op = spv::OpBitcast;
		break;

	default:
		break;
	}

	if (cast_op != spv::OpNop)
	{
		auto *bitcast_op = impl.allocate(cast_op, type_id);
		bitcast_op->add_id(value_id);
		value_id = bitcast_op->id;
		impl.add(bitcast_op);
	}

	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::WaveMatch, type_id);
	auto *call_op = impl.allocate(spv::OpFunctionCall, instruction, builder.makeVectorType(builder.makeUintType(32), 4));
	call_op->add_id(call_id);
	call_op->add_id(value_id);
	impl.add(call_op);

	return true;
}
} // namespace dxil_spv
