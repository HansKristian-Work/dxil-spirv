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
	auto *op =
	    impl.allocate(spv::OpGroupNonUniformBallot, instruction, builder.makeVectorType(builder.makeUintType(32), 4));
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));

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
		op = impl.allocate(spv::OpGroupNonUniformShuffle, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
		op->add_id(impl.get_id_for_value(lane));
		builder.addCapability(spv::CapabilityGroupNonUniformShuffle);
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

	spv::Op opcode;

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

bool emit_wave_multi_prefix_op_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Op opcode;

	uint32_t op_kind;
	if (!get_constant_operand(instruction, 2, &op_kind))
		return false;

	switch (static_cast<DXIL::WaveMultiPrefixOpKind>(op_kind))
	{
	case DXIL::WaveMultiPrefixOpKind::Sum:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFAdd, spv::OpGroupNonUniformIAdd);
		break;

	case DXIL::WaveMultiPrefixOpKind::Product:
		opcode = select_opcode(instruction, spv::OpGroupNonUniformFMul, spv::OpGroupNonUniformIMul);
		break;

	case DXIL::WaveMultiPrefixOpKind::And:
		opcode = spv::OpGroupNonUniformBitwiseAnd;
		break;

	case DXIL::WaveMultiPrefixOpKind::Or:
		opcode = spv::OpGroupNonUniformBitwiseOr;
		break;

	case DXIL::WaveMultiPrefixOpKind::Xor:
		opcode = spv::OpGroupNonUniformBitwiseXor;
		break;
	}

	auto *op = impl.allocate(opcode, instruction);
	op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	op->add_literal(spv::GroupOperationExclusiveScan);
	op->add_id(impl.get_id_for_value(instruction->getOperand(1)));
	impl.add(op);

	builder.addCapability(spv::CapabilityGroupNonUniformArithmetic);
	return true;
}

bool emit_wave_active_bit_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();

	spv::Op opcode;

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
	if (impl.execution_model == spv::ExecutionModelFragment)
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
	if (impl.execution_model == spv::ExecutionModelFragment && llvm::isa<llvm::ConstantInt>(lane))
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
} // namespace dxil_spv
