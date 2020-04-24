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
#include <string>
#include <unordered_map>

namespace LLVMBC
{
class FunctionType;
class Function;
class BasicBlock;
class MDNode;

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

	enum CastOps
	{
		Invalid = 100,
		Trunc,
		ZExt,
		SExt,
		FPToUI,
		FPToSI,
		UIToFP,
		SIToFP,
		FPTrunc,
		FPExt,
		PtrToInt,
		IntToPtr,
		BitCast,
		AddrSpaceCast
	};

	bool isTerminator() const;

	Value *getOperand(unsigned index) const;
	unsigned getNumOperands() const;

	bool resolve_proxy_values();

	MDNode *getMetadata(const std::string &str) const;
	void add_metadata(const std::string &str, MDNode *node);

	std::unordered_map<std::string, MDNode *>::const_iterator metadata_begin() const;
	std::unordered_map<std::string, MDNode *>::const_iterator metadata_end() const;

protected:
	void set_terminator();
	bool is_terminator = false;
	void set_operands(std::vector<Value *> op);
	std::vector<Value *> operands;
	std::unordered_map<std::string, MDNode *> attachments;
};

class ReturnInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Return;
	}
	explicit ReturnInst(Value *value);
	Value *getReturnValue() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Value *value;
};

class CallInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Call;
	}
	CallInst(FunctionType *function_type, Function *callee, std::vector<Value *> params);
	Function *getCalledFunction() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Type *function_type;
	Function *callee;
};

class UnaryOperator : public Instruction
{
public:
	enum class UnaryOps
	{
		Invalid,
		FNeg
	};

	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::UnaryOperator;
	}
	UnaryOperator(UnaryOps uop, Value *value);
	UnaryOps getOpcode() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	UnaryOps op;
};

class BinaryOperator : public Instruction
{
public:
	enum class BinaryOps
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

	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::BinaryOperator;
	}
	BinaryOperator(Value *LHS, Value *RHS, BinaryOps op);
	BinaryOps getOpcode() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	BinaryOps op;
};

class CastInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Cast;
	}
	CastInst(Type *type, Value *value, Instruction::CastOps op);
	Instruction::CastOps getOpcode() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Instruction::CastOps op;
};

class SelectInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Select;
	}
	SelectInst(Value *true_value, Value *false_value, Value *cond);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class ExtractValueInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ExtractValue;
	}
	ExtractValueInst(Type *type, Value *aggregate, std::vector<unsigned> indices);
	Value *getAggregateOperand() const;
	unsigned getNumIndices() const;
	const unsigned *getIndices() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	std::vector<unsigned> indices;
};

class AllocaInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Alloca;
	}
	AllocaInst(Type *pointer_type, Type *element_type, Value *size);
	Value *getArraySize() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Type *element_type;
	Value *array_size;
};

class GetElementPtrInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::GetElementPtr;
	}
	GetElementPtrInst(Type *pointer_type, std::vector<Value *> arguments, bool inbounds);
	bool isInBounds() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	bool inbounds;
};

class LoadInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Load;
	}
	LoadInst(Type *type, Value *ptr);
	Value *getPointerOperand() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class StoreInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Store;
	}
	StoreInst(Value *ptr, Value *value);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class CmpInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::CompareBase;
	}
	CmpInst(ValueKind kind, Predicate pred, Value *LHS, Value *RHS);
	Predicate getPredicate() const;

	static bool is_base_of_value_kind(ValueKind kind);

private:
	Predicate pred;
};

class FCmpInst : public CmpInst
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::FCmp;
	}
	FCmpInst(Predicate pred, Value *LHS, Value *RHS);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class ICmpInst : public CmpInst
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ICmp;
	}
	ICmpInst(Predicate pred, Value *LHS, Value *RHS);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class BranchInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Branch;
	}
	BranchInst(BasicBlock *true_block, BasicBlock *false_block, Value *cond);
	explicit BranchInst(BasicBlock *true_block);

	bool isConditional() const;
	Value *getCondition() const;

	unsigned getNumSuccessors() const;
	BasicBlock *getSuccessor(unsigned index) const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	BasicBlock *bbs[2] = {};
	unsigned num_blocks = 0;
	Value *cond = nullptr;
};

class SwitchInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Switch;
	}
	SwitchInst(Value *cond, BasicBlock *default_block, unsigned num_cases);
	void addCase(Value *case_value, BasicBlock *bb);

	struct Case
	{
		Value *value;
		BasicBlock *bb;

		BasicBlock *getCaseSuccessor() const;
		ConstantInt *getCaseValue() const;
	};

	std::vector<Case>::const_iterator case_begin() const;
	std::vector<Case>::const_iterator case_end() const;

	Value *getCondition() const;
	BasicBlock *getDefaultDest() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Value *cond;
	BasicBlock *default_block;
	std::vector<Case> cases;
};

class PHINode : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::PHI;
	}
	PHINode(Type *type, size_t num_edges);

	unsigned getNumIncomingValues() const;
	Value *getIncomingValue(unsigned index) const;
	BasicBlock *getIncomingBlock(unsigned index) const;

	void add_incoming(Value *value, BasicBlock *bb);
	bool resolve_proxy_values_incoming();

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	struct Incoming
	{
		Value *value;
		BasicBlock *bb;
	};
	std::vector<Incoming> incoming;
};

class AtomicRMWInst : public Instruction
{
public:
	enum class BinOp
	{
		Invalid,
		Xchg,
		Add,
		Sub,
		And,
		Nand,
		Or,
		Xor,
		Max,
		Min,
		UMax,
		UMin,
		FAdd, // wat
		FSub
	};
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::AtomicRMW;
	}
	AtomicRMWInst(Type *type, Value *ptr, Value *value, BinOp op);

	Value *getPointerOperand() const;
	Value *getValOperand() const;
	BinOp getOperation() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Value *ptr;
	Value *value;
	BinOp op;
};

class AtomicCmpXchgInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::AtomicCmpXchg;
	}
	AtomicCmpXchgInst(Value *ptr, Value *cmp, Value *new_value);

	Value *getPointerOperand() const;
	Value *getNewValOperand() const;
	Value *getCompareOperand() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Value *ptr;
	Value *new_value;
	Value *cmp_value;
};

class ShuffleVectorInst : public Instruction
{
public:
	ShuffleVectorInst(Type *type, Value *a, Value *b, Value *shuf);
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ShuffleVector;
	}

	int getMaskValue(unsigned index) const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	std::vector<int> shuffle_mask;
};

class ExtractElementInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ExtractElement;
	}
	ExtractElementInst(Value *vec, Value *offset);
	Value *getVectorOperand();
	Value *getIndexOperand();

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Value *vec;
	Value *index;
};

class InsertElementInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::InsertElement;
	}
	InsertElementInst(Value *vec, Value *index, Value *value);
	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};
} // namespace LLVMBC
