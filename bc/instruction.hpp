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
class BasicBlock;

class Instruction : public Value
{
public:
	Instruction(Type *type, ValueKind kind);

	enum Predicate
	{
		FCMP_FALSE = 0,
		FCMP_OEQ = 1,
		FCMP_OGT = 2,
		FCMP_OGE = 3,
		FCMP_OLT = 4,
		FCMP_OLE = 5,
		FCMP_ONE = 6,
		FCMP_ORD = 7,
		FCMP_UNO = 8,
		FCMP_UEQ = 9,
		FCMP_UGT = 10,
		FCMP_UGE = 11,
		FCMP_ULT = 12,
		FCMP_ULE = 13,
		FCMP_UNE = 14,
		FCMP_TRUE = 15,

		ICMP_EQ = 32,
		ICMP_NE = 33,
		ICMP_UGT = 34,
		ICMP_UGE = 35,
		ICMP_ULT = 36,
		ICMP_ULE = 37,
		ICMP_SGT = 38,
		ICMP_SGE = 39,
		ICMP_SLT = 40,
		ICMP_SLE = 41
	};

	bool isTerminator() const;

	Value *getOperand(unsigned index) const;
	unsigned getNumOperands() const;

protected:
	void set_terminator();
	bool is_terminator = false;
	void set_operands(std::vector<Value *> op);
	std::vector<Value *> operands;
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

private:
	Type *function_type;
	Function *callee;
};

class UnaryOperator : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::UnaryOperator; }
	UnaryOperator(UnaryOperation uop, Value *value);

private:
	UnaryOperation op;
};

class BinaryOperator : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::BinaryOperator; }
	BinaryOperator(Value *LHS, Value *RHS, BinaryOperation op);
	BinaryOperation getOpcode() const;

private:
	BinaryOperation op;
};

class CmpInst : public Instruction
{
public:
	CmpInst(ValueKind kind, Predicate pred, Value *LHS, Value *RHS);
	Predicate getPredicate() const;

private:
	Predicate pred;
};

class FCmpInst : public CmpInst
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::FCmp; }
	FCmpInst(Predicate pred, Value *LHS, Value *RHS);
};

class ICmpInst : public CmpInst
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::ICmp; }
	ICmpInst(Predicate pred, Value *LHS, Value *RHS);
};

class BranchInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::Branch; }
	BranchInst(BasicBlock *true_block, BasicBlock *false_block, Value *cond);
	explicit BranchInst(BasicBlock *true_block);

	bool isConditional() const;
	Value *getCondition() const;
	BasicBlock *getTrueBlock() const;
	BasicBlock *getFalseBlock() const;

private:
	BasicBlock *true_block;
	BasicBlock *false_block = nullptr;
	Value *cond = nullptr;
};

class PHINode : public Instruction
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::PHI; }
	PHINode(Type *type, size_t num_edges);

	unsigned getNumIncomingValues() const;
	Value *getIncomingValue(unsigned index) const;
	BasicBlock *getIncomingBlock(unsigned index) const;

	void add_incoming(Value *value, BasicBlock *bb);

private:
	struct Incoming
	{
		Value *value;
		BasicBlock *bb;
	};
	std::vector<Incoming> incoming;
};
}
