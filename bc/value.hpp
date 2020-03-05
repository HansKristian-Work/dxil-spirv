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

#include <stdint.h>
#include <vector>

namespace LLVMBC
{
class Type;

enum class ValueKind
{
	Function,
	ConstantInt,
	ConstantFP,
	Undef,
	UnaryOperator,
	BinaryOperator,
	Call,
	FCmp,
	ICmp,
	BasicBlock,
	PHI,
	Cast,
	Select,
	ExtractValue,

	Return,
	Branch,
	Proxy
};

class Value
{
public:
	explicit Value(Type *type, ValueKind kind);
	Type *getType() const;

	ValueKind get_value_kind() const;
	void set_tween_id(uint64_t id);
	uint64_t get_tween_id() const;

protected:
	Type *type;
	ValueKind kind;
	uint64_t tween_id = 0;
};

class Constant : public Value
{
public:
	Constant(Type *type, ValueKind kind);
};

class ConstantInt : public Constant
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::ConstantInt; }
	static ConstantInt *get(Type *type, uint64_t value);
	ConstantInt(Type *type, uint64_t value);

	uint64_t get_zext() const;
	int64_t get_sext() const;

private:
	uint64_t value;
};

class ConstantFP : public Constant
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::ConstantFP; }
	static ConstantFP *get(Type *type, uint64_t bits);
	ConstantFP(Type *type, uint64_t bits);

	double get_double() const;

private:
	union
	{
		float f32;
		double f64;
		uint64_t u64;
	} u;
};

class UndefValue : public Constant
{
public:
	static constexpr ValueKind get_value_kind() { return ValueKind::Undef; }
	explicit UndefValue(Type *type);
	static UndefValue *get(Type *type);
};
}
