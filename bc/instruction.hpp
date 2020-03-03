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

#pragma once

#include "value.hpp"

namespace LLVMBC
{
class FunctionType;
class Function;

class Instruction : public Value
{
public:
	Instruction(Type *type, ValueKind kind);
};

enum class UnaryOperation
{
	Invalid,
	FNeg
};

enum class BinaryOperation
{
	Invalid,
	Add,
	FAdd,
	Sub,
	FSub,
	Mul,
	FMul,
	UDiv,
	SDiv,
	FDiv,
	URem,
	SRem,
	FRem,
	Shl,
	LShr,
	AShr,
	And,
	Or,
	Xor
};

class ReturnInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::Return; }
	explicit ReturnInst(Value *value);
	Value *getReturnValue() const;

private:
	Value *value;
};

class CallInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::Call; }
	CallInst(FunctionType *function_type, Function *callee, std::vector<Value *> params);
	Function *getCalledFunction() const;

	unsigned getNumOperands() const;
	Value *getOperand(unsigned N) const;

private:
	Type *function_type;
	Function *callee;
	std::vector<Value *> params;
};

class UnaryOperator : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::UnaryOperator; }
	UnaryOperator(UnaryOperation uop, Value *value);

private:
	Value *value;
	UnaryOperation op;
};

class BinaryOperator : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::BinaryOperator; }
	BinaryOperator(Value *LHS, Value *RHS, BinaryOperation op);
	BinaryOperation getOpcode() const;

	Value *getOperand(unsigned N) const;

private:
	Value *LHS, *RHS;
	BinaryOperation op;
};
}
