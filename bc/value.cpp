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

namespace LLVMBC
{
Constant::Constant(Type *type_)
	: type(type_)
{
}

ConstantInt *ConstantInt::get(Type *type, uint64_t value)
{
	auto &context = type->getContext();
	return context.construct<ConstantInt>(type, value);
}

ConstantFP *ConstantFP::get(Type *type, uint64_t value)
{
	auto &context = type->getContext();
	return context.construct<ConstantFP>(type, value);
}

ConstantInt::ConstantInt(Type *type_, uint64_t value_)
	: Constant(type_), value(value_)
{
}

ConstantFP::ConstantFP(Type *type_, uint64_t value)
	: Constant(type_)
{
	u.u64 = value;
}

UndefValue::UndefValue(Type *type)
	: Constant(type)
{
}

UndefValue *UndefValue::get(Type *type)
{
	auto &context = type->getContext();
	return context.construct<UndefValue>(type);
}
}
