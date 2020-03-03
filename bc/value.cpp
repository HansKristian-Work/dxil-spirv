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

#include "value.hpp"
#include "type.hpp"
#include "context.hpp"
#include "logging.hpp"
#include "cast.hpp"

namespace LLVMBC
{
Value::Value(Type *type_, ValueKind kind_)
	: type(type_), kind(kind_)
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

Constant::Constant(Type *type, ValueKind kind)
	: Value(type, kind)
{
}

ConstantInt *ConstantInt::get(Type *type, uint64_t value)
{
	auto &context = type->getContext();
	return context.construct<ConstantInt>(type, value);
}

int64_t ConstantInt::get_sext() const
{
	switch (cast<IntegerType>(getType())->getBitWidth())
	{
	case 1: return (value & 1) != 0 ? -1 : 0;
	case 8: return int8_t(value);
	case 16: return int16_t(value);
	case 32: return int32_t(value);
	case 64: return int64_t(value);
	default:
		LOGE("Unrecognized bitwidth.\n");
		return 0;
	}
}

uint64_t ConstantInt::get_zext() const
{
	switch (cast<IntegerType>(getType())->getBitWidth())
	{
	case 1: return value & 1;
	case 8: return uint8_t(value);
	case 16: return uint16_t(value);
	case 32: return uint32_t(value);
	case 64: return uint64_t(value);
	default:
		LOGE("Unrecognized bitwidth.\n");
		return 0;
	}
}

ConstantFP *ConstantFP::get(Type *type, uint64_t value)
{
	auto &context = type->getContext();
	return context.construct<ConstantFP>(type, value);
}

ConstantInt::ConstantInt(Type *type, uint64_t value_)
	: Constant(type, ValueKind::ConstantInt), value(value_)
{
}

ConstantFP::ConstantFP(Type *type, uint64_t value)
	: Constant(type, ValueKind::ConstantFP)
{
	u.u64 = value;
}

double ConstantFP::get_double() const
{
	switch (getType()->getTypeID())
	{
	case TypeID::Float:
		return u.f32;
	case TypeID::Double:
		return u.f64;
	default:
		LOGE("Unknown FP type.\n");
		return 0.0;
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
}
