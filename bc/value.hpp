/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
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

#include "data_structures.hpp"
#include <stdint.h>

namespace LLVMBC
{
class Type;

enum class ValueKind
{
	Argument,
	Function,
	ConstantBase,
	ConstantInt,
	ConstantFP,
	ConstantAggregateZero,
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
	InsertElement
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
	explicit GlobalVariable(Type *type, bool is_const);
	void set_initializer(Constant *value);
	Constant *getInitializer() const;
	bool hasInitializer() const;
	bool isConstant() const;

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	Constant *initializer = nullptr;
	bool is_const;
};
} // namespace LLVMBC
