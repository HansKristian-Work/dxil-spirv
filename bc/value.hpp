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

#include "data_structures.hpp"
#include <stdint.h>

namespace LLVMBC
{
class Type;

enum class ValueKind
{
	Argument,
	Function,
	InstructionBase,
	ConstantBase,
	ConstantInt,
	ConstantFP,
	ConstantAggregateZero,
	ConstantPointerNull,
	ConstantAggregate,
	ConstantDataArray,
	ConstantDataVector,
	ConstantExpr,
	Undef,
	UnaryOperator,
	BinaryOperator,
	Call,
	CompareBase,
	FCmp,
	ICmp,
	BasicBlock,
	PHI,
	Cast,
	Select,
	ExtractValue,
	Alloca,
	GetElementPtr,
	Load,
	Store,
	AtomicRMW,
	AtomicCmpXchg,
	Return,
	Unreachable,
	Branch,
	Switch,
	Proxy,
	Global,
	ShuffleVector,
	ExtractElement,
	InsertElement,
	CompositeConstruct
};

#define LLVMBC_DEFAULT_VALUE_KIND_IMPL                \
	static bool is_base_of_value_kind(ValueKind kind) \
	{                                                 \
		return get_value_kind() == kind;              \
	}

class Value
{
public:
	Value(Type *type, ValueKind kind);
	Type *getType() const;

	ValueKind get_value_kind() const;
	void set_tween_id(uint64_t id);
	uint64_t get_tween_id() const;

protected:
	Type *type;
	ValueKind kind;
	uint64_t tween_id = 0;
};

class Argument : public Value
{
public:
	Argument(Type *type, unsigned argument_number);
	unsigned getArgNo() const;

	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Argument;
	}

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	unsigned argument_number;
};

class APInt
{
public:
	APInt() = default;
	APInt(Type *type, uint64_t value);
	uint64_t getZExtValue() const;
	int64_t getSExtValue() const;

	// LLVMBC specific hack to make minprecision with signed ints work.
	// We need a sign-extended value which fortunately the DXIL emits,
	// but LLVM itself will mask off the bits for you.
	uint64_t get_raw_value() const;

private:
	Type *type = nullptr;
	uint64_t value = 0;
};

class APFloat
{
public:
	APFloat() = default;
	APFloat(Type *type, uint64_t value);

	float convertToFloat() const;
	double convertToDouble() const;

	APInt bitcastToAPInt() const;

private:
	Type *type = nullptr;
	uint64_t value = 0;
};

class Constant : public Value
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantBase;
	}
	Constant(Type *type, ValueKind kind);

	void set_integer(const APInt &apint);
	void set_float(const APFloat &apfloat);
	const APFloat &getValueAPF() const;
	const APInt &getUniqueInteger() const;

	static bool is_base_of_value_kind(ValueKind kind);

private:
	APInt apint;
	APFloat apfloat;
};

class ConstantInt : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantInt;
	}
	static ConstantInt *get(Type *type, uint64_t value);
	ConstantInt(Type *type, uint64_t value);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class ConstantFP : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantFP;
	}
	static ConstantFP *get(Type *type, uint64_t bits);
	ConstantFP(Type *type, uint64_t bits);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class ConstantAggregateZero : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantAggregateZero;
	}
	explicit ConstantAggregateZero(Type *type);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class ConstantPointerNull : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantPointerNull;
	}

	explicit ConstantPointerNull(Type *type);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class ConstantDataArray : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantDataArray;
	}
	ConstantDataArray(Type *type, Vector<Value *> elements);

	unsigned getNumElements() const;
	Constant *getElementAsConstant(unsigned index) const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Vector<Value *> elements;
};

class ConstantDataVector : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantDataVector;
	}
	ConstantDataVector(Type *type, Vector<Value *> elements);

	unsigned getNumElements() const;
	Constant *getElementAsConstant(unsigned index) const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Vector<Value *> elements;
};

class ConstantAggregate : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantAggregate;
	}
	ConstantAggregate(Type *type, Vector<Value *> elements);

	unsigned getNumOperands() const;
	Constant *getOperand(unsigned index) const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Vector<Value *> elements;
};

class ConstantExpr : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::ConstantExpr;
	}
	ConstantExpr(unsigned opcode, Type *type, Vector<Value *> elements);

	unsigned getOpcode() const;
	unsigned getNumOperands() const;
	Constant *getOperand(unsigned N) const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	unsigned opcode;
	Vector<Value *> elements;
};

class UndefValue : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Undef;
	}
	explicit UndefValue(Type *type);
	static UndefValue *get(Type *type);

	LLVMBC_DEFAULT_VALUE_KIND_IMPL
};

class GlobalVariable : public Constant
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Global;
	}

	enum LinkageTypes
	{
		ExternalLinkage,
		InternalLinkage,
		AppendingLinkage
	};

	explicit GlobalVariable(Type *type, LinkageTypes linkage, bool is_const);
	void set_initializer(Constant *value);
	Constant *getInitializer() const;
	bool hasInitializer() const;
	bool isConstant() const;
	LinkageTypes getLinkage() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Constant *initializer = nullptr;
	LinkageTypes linkage;
	bool is_const;
};
} // namespace LLVMBC
