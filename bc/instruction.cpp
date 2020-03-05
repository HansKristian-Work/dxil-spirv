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

#include "instruction.hpp"
#include "cast.hpp"
#include <assert.h>

namespace LLVMBC
{
Instruction::Instruction(Type *type, ValueKind kind)
	: Value(type, kind)
{
}

void Instruction::set_operands(std::vector<Value *> op)
{
	operands = std::move(op);
}

unsigned Instruction::getNumOperands() const
{
	return operands.size();
}

Value *Instruction::getOperand(unsigned index) const
{
	if (index >= operands.size())
	{
		LOGE("Operand index is out of range.\n");
		return nullptr;
	}

	return operands[index];
}

bool Instruction::isTerminator() const
{
	return is_terminator;
}

void Instruction::set_terminator()
{
	is_terminator = true;
}

void Instruction::resolve_proxy_values()
{
	for (auto &op : operands)
		while (op && op->get_value_kind() == ValueKind::Proxy)
			op = cast<ValueProxy>(op)->get_proxy_value();

	if (get_value_kind() == ValueKind::PHI)
	{
		auto *phi = cast<PHINode>(this);
		phi->resolve_proxy_values_incoming();
	}
}

BinaryOperator::BinaryOperator(Value *LHS, Value *RHS, BinaryOperation op_)
	: Instruction(LHS->getType(), ValueKind::BinaryOperator), op(op_)
{
	set_operands({ LHS, RHS });
}

BinaryOperation BinaryOperator::getOpcode() const
{
	return op;
}

UnaryOperator::UnaryOperator(UnaryOperation uop, Value *value)
	: Instruction(value->getType(), ValueKind::UnaryOperator)
{
	set_operands({ value });
}

UnaryOperation UnaryOperator::getOpcode() const
{
	return op;
}

ReturnInst::ReturnInst(Value *value_)
	: Instruction(value_ ? value_->getType() : nullptr, ValueKind::Return), value(value_)
{
	set_terminator();
}

CallInst::CallInst(FunctionType *function_type_, Function *callee_, std::vector<Value *> params)
	: Instruction(function_type_->getReturnType(), ValueKind::Call),
	  function_type(function_type_), callee(callee_)
{
	set_operands(std::move(params));
}

Function *CallInst::getCalledFunction() const
{
	return callee;
}

Value *ReturnInst::getReturnValue() const
{
	return value;
}

CmpInst::CmpInst(ValueKind kind, Predicate pred_, Value *LHS, Value *RHS)
	: Instruction(Type::getInt1Ty(LHS->getType()->getContext()), kind), pred(pred_)
{
	set_operands({ LHS, RHS });
}

CastInst::CastInst(Type *type, Value *value, Instruction::CastOps op_)
	: Instruction(type, ValueKind::Cast), op(op_)
{
	set_operands({ value });
}

SelectInst::SelectInst(Value *true_value, Value *false_value, Value *cond)
	: Instruction(true_value->getType(), ValueKind::Select)
{
	set_operands({ cond, true_value, false_value });
}

Instruction::CastOps CastInst::getOpcode() const
{
	return op;
}

Instruction::Predicate CmpInst::getPredicate() const
{
	return pred;
}

FCmpInst::FCmpInst(Predicate pred_, Value *LHS, Value *RHS)
	: CmpInst(ValueKind::FCmp, pred_, LHS, RHS)
{
	set_operands({ LHS, RHS });
}

ICmpInst::ICmpInst(Predicate pred_, Value *LHS, Value *RHS)
	: CmpInst(ValueKind::ICmp, pred_, LHS, RHS)
{
	set_operands({ LHS, RHS });
}

BranchInst::BranchInst(BasicBlock *true_block_, BasicBlock *false_block_, Value *cond_)
	: Instruction(nullptr, ValueKind::Branch), true_block(true_block_), false_block(false_block_), cond(cond_)
{
	set_terminator();
}

BranchInst::BranchInst(BasicBlock *true_block_)
	: Instruction(nullptr, ValueKind::Branch), true_block(true_block_)
{
	set_terminator();
}

bool BranchInst::isConditional() const
{
	return cond != nullptr;
}

Value *BranchInst::getCondition() const
{
	return cond;
}

BasicBlock *BranchInst::getTrueBlock() const
{
	return true_block;
}

BasicBlock *BranchInst::getFalseBlock() const
{
	return false_block;
}

PHINode::PHINode(Type *type, size_t num_edges)
	: Instruction(type, ValueKind::PHI)
{
	incoming.reserve(num_edges);
}

void PHINode::add_incoming(Value *value, BasicBlock *bb)
{
	incoming.push_back({ value, bb });
}

unsigned PHINode::getNumIncomingValues() const
{
	return unsigned(incoming.size());
}

BasicBlock *PHINode::getIncomingBlock(unsigned index) const
{
	if (index >= incoming.size())
		return nullptr;
	return incoming[index].bb;
}

Value *PHINode::getIncomingValue(unsigned index) const
{
	if (index >= incoming.size())
		return nullptr;
	return incoming[index].value;
}

void PHINode::resolve_proxy_values_incoming()
{
	for (auto &node : incoming)
		while (node.value && node.value->get_value_kind() == ValueKind::Proxy)
			node.value = cast<ValueProxy>(node.value)->get_proxy_value();
}
}