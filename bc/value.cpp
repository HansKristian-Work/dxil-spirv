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
	case ValueKind::ConstantAggregate:
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

ConstantAggregate::ConstantAggregate(Type *type, Vector<Value *> elements_)
	: Constant(type, ValueKind::ConstantAggregate)
	, elements(std::move(elements_))
{
}

unsigned ConstantAggregate::getNumOperands() const
{
	return elements.size();
}

Constant *ConstantAggregate::getOperand(unsigned index) const
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

GlobalVariable::GlobalVariable(Type *type, LinkageTypes linkage_, bool is_const_)
	: Constant(type, ValueKind::Global)
	, linkage(linkage_)
	, is_const(is_const_)
{
}

GlobalVariable::LinkageTypes GlobalVariable::getLinkage() const
{
	return linkage;
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
