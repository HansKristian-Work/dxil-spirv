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

#include "value.hpp"
#include "cast.hpp"
#include "context.hpp"
#include "instruction.hpp"
#include "logging.hpp"
#include "type.hpp"
#include <string.h>

namespace LLVMBC
{
Value::Value(Type *type_, ValueKind kind_)
    : type(type_)
    , kind(kind_)
{
}

void Value::set_tween_id(uint64_t id)
{
	tween_id = id;
}

uint64_t Value::get_tween_id() const
{
	return tween_id;
}

Type *Value::getType() const
{
	return type;
}

ValueKind Value::get_value_kind() const
{
	return kind;
}

Argument::Argument(Type *type, unsigned argument_number_)
	: Value(type, ValueKind::Argument), argument_number(argument_number_)
{
}

unsigned Argument::getArgNo() const
{
	return argument_number;
}

bool Constant::is_base_of_value_kind(ValueKind kind)
{
	switch (kind)
	{
	case ValueKind::ConstantFP:
	case ValueKind::ConstantInt:
	case ValueKind::ConstantDataArray:
	case ValueKind::ConstantDataVector:
	case ValueKind::ConstantAggregateZero:
	case ValueKind::ConstantBase:
	case ValueKind::Undef:
	case ValueKind::Function:
	case ValueKind::Global:
	case ValueKind::ConstantExpr:
		return true;

	default:
		return false;
	}
}

Constant::Constant(Type *type, ValueKind kind)
    : Value(type, kind)
{
}

ConstantInt *ConstantInt::get(Type *type, uint64_t value)
{
	auto &context = type->getContext();
	return context.construct<ConstantInt>(type, value);
}

const APInt &Constant::getUniqueInteger() const
{
	return apint;
}

void Constant::set_integer(const APInt &apint_)
{
	apint = apint_;
}

void Constant::set_float(const APFloat &apfloat_)
{
	apfloat = apfloat_;
}

APInt::APInt(Type *type_, uint64_t value_)
    : type(type_)
    , value(value_)
{
}

APFloat::APFloat(Type *type_, uint64_t value_)
    : type(type_)
    , value(value_)
{
}

int64_t APInt::getSExtValue() const
{
	auto width = cast<IntegerType>(type)->getBitWidth();
	if (width == 64)
		return int64_t(value);
	auto mask = (1ull << width) - 1;
	bool sign_bit = ((value >> (width - 1)) & 1) != 0;
	uint64_t extended = sign_bit ? ~mask : 0ull;
	return int64_t((value & mask) | extended);
}

uint64_t APInt::getZExtValue() const
{
	auto width = cast<IntegerType>(type)->getBitWidth();
	if (width == 64)
		return value;
	auto mask = (1ull << width) - 1u;
	return value & mask;
}

uint64_t APInt::get_raw_value() const
{
	return value;
}

ConstantFP *ConstantFP::get(Type *type, uint64_t value)
{
	auto &context = type->getContext();
	return context.construct<ConstantFP>(type, value);
}

ConstantInt::ConstantInt(Type *type, uint64_t value)
    : Constant(type, ValueKind::ConstantInt)
{
	set_integer(APInt(type, value));
}

ConstantFP::ConstantFP(Type *type, uint64_t value)
    : Constant(type, ValueKind::ConstantFP)
{
	set_float(APFloat(type, value));
}

const APFloat &Constant::getValueAPF() const
{
	return apfloat;
}

static inline float half_to_float(uint16_t u16_value)
{
	// Based on the GLM implementation.
	int s = (u16_value >> 15) & 0x1;
	int e = (u16_value >> 10) & 0x1f;
	int m = (u16_value >> 0) & 0x3ff;

	union {
		float f32;
		uint32_t u32;
	} u;

	if (e == 0)
	{
		if (m == 0)
		{
			u.u32 = uint32_t(s) << 31;
			return u.f32;
		}
		else
		{
			while ((m & 0x400) == 0)
			{
				m <<= 1;
				e--;
			}

			e++;
			m &= ~0x400;
		}
	}
	else if (e == 31)
	{
		if (m == 0)
		{
			u.u32 = (uint32_t(s) << 31) | 0x7f800000u;
			return u.f32;
		}
		else
		{
			u.u32 = (uint32_t(s) << 31) | 0x7f800000u | (m << 13);
			return u.f32;
		}
	}

	e += 127 - 15;
	m <<= 13;
	u.u32 = (uint32_t(s) << 31) | (e << 23) | m;
	return u.f32;
}

float APFloat::convertToFloat() const
{
	switch (type->getTypeID())
	{
	case Type::TypeID::FloatTyID:
	{
		float f;
		auto u = uint32_t(value);
		static_assert(sizeof(f) == sizeof(u), "Float is not 32-bit.");
		memcpy(&f, &u, sizeof(float));
		return f;
	}
	case Type::TypeID::DoubleTyID:
	{
		double f;
		static_assert(sizeof(f) == sizeof(value), "Double is not 64-bit.");
		memcpy(&f, &value, sizeof(double));
		return float(f);
	}

	case Type::TypeID::HalfTyID:
		return half_to_float(uint16_t(value));

	default:
		LOGE("Unknown FP type in APFloat::convertToFloat().\n");
		return 0.0f;
	}
}

APInt APFloat::bitcastToAPInt() const
{
	Type *int_type = nullptr;
	switch (type->getTypeID())
	{
	case Type::TypeID::HalfTyID:
		int_type = Type::getInt16Ty(type->getContext());
		break;

	case Type::TypeID::FloatTyID:
		int_type = Type::getInt32Ty(type->getContext());
		break;

	case Type::TypeID::DoubleTyID:
		int_type = Type::getInt64Ty(type->getContext());
		break;

	default:
		break;
	}

	return { int_type, value };
}

double APFloat::convertToDouble() const
{
	switch (type->getTypeID())
	{
	case Type::TypeID::FloatTyID:
	{
		float f;
		auto u = uint32_t(value);
		static_assert(sizeof(f) == sizeof(u), "Float is not 32-bit.");
		memcpy(&f, &u, sizeof(float));
		return double(f);
	}
	case Type::TypeID::DoubleTyID:
	{
		double f;
		static_assert(sizeof(f) == sizeof(value), "Double is not 64-bit.");
		memcpy(&f, &value, sizeof(double));
		return f;
	}

	case Type::TypeID::HalfTyID:
		return double(half_to_float(uint16_t(value)));

	default:
		LOGE("Unknown FP type in APFloat::convertToDouble().\n");
		return 0.0f;
	}
}

UndefValue::UndefValue(Type *type)
    : Constant(type, ValueKind::Undef)
{
}

UndefValue *UndefValue::get(Type *type)
{
	auto &context = type->getContext();
	return context.construct<UndefValue>(type);
}

ConstantAggregateZero::ConstantAggregateZero(Type *type)
    : Constant(type, ValueKind::ConstantAggregateZero)
{
}

ConstantDataArray::ConstantDataArray(Type *type, Vector<Value *> elements_)
    : Constant(type, ValueKind::ConstantDataArray)
    , elements(std::move(elements_))
{
}

unsigned ConstantDataArray::getNumElements() const
{
	return elements.size();
}

Constant *ConstantDataArray::getElementAsConstant(unsigned index) const
{
	return cast<Constant>(elements[index]);
}

ConstantDataVector::ConstantDataVector(Type *type, Vector<Value *> elements_)
	: Constant(type, ValueKind::ConstantDataVector)
	, elements(std::move(elements_))
{
}

unsigned ConstantDataVector::getNumElements() const
{
	return elements.size();
}

Constant *ConstantDataVector::getElementAsConstant(unsigned index) const
{
	return cast<Constant>(elements[index]);
}

ConstantExpr::ConstantExpr(unsigned opcode_, Type *type, Vector<Value *> elements_)
	: Constant(type, ValueKind::ConstantExpr)
	, opcode(opcode_)
	, elements(std::move(elements_))
{
}

unsigned ConstantExpr::getOpcode() const
{
	return opcode;
}

Constant *ConstantExpr::getOperand(unsigned int N) const
{
	return cast<Constant>(elements[N]);
}

unsigned ConstantExpr::getNumOperands() const
{
	return unsigned(elements.size());
}

GlobalVariable::GlobalVariable(Type *type, bool is_const_)
    : Constant(type, ValueKind::Global)
    , is_const(is_const_)
{
}

bool GlobalVariable::hasInitializer() const
{
	return initializer != nullptr;
}

Constant *GlobalVariable::getInitializer() const
{
	return initializer;
}

void GlobalVariable::set_initializer(Constant *value)
{
	initializer = value;
}

bool GlobalVariable::isConstant() const
{
	return is_const;
}
} // namespace LLVMBC
