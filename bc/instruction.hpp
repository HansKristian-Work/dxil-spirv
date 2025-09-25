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

#pragma once

#include "value.hpp"

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
		InvalidCastOp = 100,
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

	enum GEPOps
	{
		GetElementPtr = 200
	};

	enum BinaryOps
	{
		InvalidBinaryOp = 300,
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

	bool isTerminator() const;

	Value *getOperand(unsigned index) const;
	unsigned getNumOperands() const;

	bool resolve_proxy_values();

	MDNode *getMetadata(const String &str) const;
	bool hasMetadata(const String &str) const;
	void setMetadata(const String &str, MDNode *node);

	UnorderedMap<String, MDNode *>::const_iterator metadata_begin() const;
	UnorderedMap<String, MDNode *>::const_iterator metadata_end() const;

	static bool is_base_of_value_kind(ValueKind kind);
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::InstructionBase;
	}

protected:
	void set_terminator();
	bool is_terminator = false;
	void set_operands(Vector<Value *> op);
	Vector<Value *> operands;
	UnorderedMap<String, MDNode *> attachments;
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

class UnreachableInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Unreachable;
	}

	UnreachableInst();
	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class CallInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Call;
	}
	CallInst(FunctionType *function_type, Function *callee, Vector<Value *> params);
	Function *getCalledFunction() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Function *callee;
};

class UnaryOperator : public Instruction
{
public:
	enum class UnaryOps
	{
		Invalid,
		FNeg,
		INeg, // custom extension
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
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::BinaryOperator;
	}
	BinaryOperator(Value *LHS, Value *RHS, BinaryOps op);
	BinaryOps getOpcode() const;

	void setFast(bool enabled);
	bool isFast() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	BinaryOps op;
	bool fast_math = false;
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
	ExtractValueInst(Type *type, Value *aggregate, Vector<unsigned> indices);
	Value *getAggregateOperand() const;
	unsigned getNumIndices() const;
	const unsigned *getIndices() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Vector<unsigned> indices;
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
	Value *array_size;
};

class GetElementPtrInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::GetElementPtr;
	}
	GetElementPtrInst(Type *pointer_type, Vector<Value *> arguments, bool inbounds);
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

	Vector<Case>::const_iterator case_begin() const;
	Vector<Case>::const_iterator case_end() const;

	Value *getCondition() const;
	BasicBlock *getDefaultDest() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Value *cond;
	BasicBlock *default_block;
	Vector<Case> cases;
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
	Vector<Incoming> incoming;
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
	AtomicCmpXchgInst(Value *ptr, Value *cmp, Value *new_value, Type *type_override = nullptr);

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
	Vector<int> shuffle_mask;
};

class ExtractElementInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ExtractElement;
	}
	ExtractElementInst(Value *vec, Value *offset);
	Value *getVectorOperand() const;
	Value *getIndexOperand() const;

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
	InsertElementInst(Value *vec, Value *value, Value *index);
	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

// Extension of LLVM to better map to SPIR-V / DXBC-IR
class CompositeConstructInst : public Instruction
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::CompositeConstruct;
	}
	CompositeConstructInst(Type *type, Vector<Value *> constituents);
	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};
} // namespace LLVMBC
