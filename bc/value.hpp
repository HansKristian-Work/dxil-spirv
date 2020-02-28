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

namespace LLVMBC
{
class Type;

class Value
{
public:
};

class Constant : public Value
{
public:
	explicit Constant(Type *type);

protected:
	Type *type;
};

class ConstantInt : public Constant
{
public:
	static ConstantInt *get(Type *type, uint64_t value);
	ConstantInt(Type *type, uint64_t value);

private:
	uint64_t value;
};

class ConstantFP : public Constant
{
public:
	static ConstantFP *get(Type *type, uint64_t bits);
	ConstantFP(Type *type, uint64_t bits);

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
	UndefValue(Type *type);
	static UndefValue *get(Type *type);
};
}
