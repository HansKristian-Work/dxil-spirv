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

BinaryOperator::BinaryOperator(Value *LHS_, Value *RHS_, BinaryOperation op_)
	: Instruction(LHS_->getType(), ValueKind::BinaryOperator), LHS(LHS_), RHS(RHS_), op(op_)
{
}

BinaryOperation BinaryOperator::getOpcode() const
{
	return op;
}

Value *BinaryOperator::getOperand(unsigned N) const
{
	if (N == 0)
		return LHS;
	else if (N == 1)
		return RHS;
	else
		return nullptr;
}

UnaryOperator::UnaryOperator(UnaryOperation uop, Value *value_)
	: Instruction(value->getType(), ValueKind::UnaryOperator), value(value_)
{
}

ReturnInst::ReturnInst(Value *value_)
	: Instruction(value_ ? value_->getType() : nullptr, ValueKind::Return), value(value_)
{
}

CallInst::CallInst(FunctionType *function_type_, Function *callee_, std::vector<Value *> params_)
	: Instruction(function_type_->getReturnType(), ValueKind::Call),
	  function_type(function_type_), callee(callee_), params(std::move(params_))
{
}

unsigned CallInst::getNumOperands() const
{
	return unsigned(params.size());
}

Value *CallInst::getOperand(unsigned N) const
{
	assert(N < params.size());
	return params[N];
}

Function *CallInst::getCalledFunction() const
{
	return callee;
}

Value *ReturnInst::getReturnValue() const
{
	return value;
}
}