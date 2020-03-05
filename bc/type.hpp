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

#include <vector>
#include <stdint.h>

namespace LLVMBC
{
class LLVMContext;

enum class TypeID
{
	Unknown,
	Void,
	Half,
	Float,
	Double,
	Int,
	Pointer,
	Array,
	Struct,
	Function,
	Label,
	Vector,
	Metadata
};

class Type
{
public:
	Type(LLVMContext &context, TypeID type_id);
	LLVMContext &getContext();
	TypeID getTypeID() const;

	static Type *getVoidTy(LLVMContext &context);
	static Type *getHalfTy(LLVMContext &context);
	static Type *getFloatTy(LLVMContext &context);
	static Type *getDoubleTy(LLVMContext &context);
	static Type *getInt1Ty(LLVMContext &context);
	static Type *getInt8Ty(LLVMContext &context);
	static Type *getInt16Ty(LLVMContext &context);
	static Type *getInt32Ty(LLVMContext &context);
	static Type *getInt64Ty(LLVMContext &context);
	static Type *getLabelTy(LLVMContext &context);
	static Type *getMetadataTy(LLVMContext &context);

	bool isIntegerTy() const;
	bool isFloatingPointTy() const;

	uint64_t getArrayNumElements() const;
	Type *getArrayElementType() const;

protected:
	LLVMContext &context;
	TypeID type_id;
	static Type *getIntTy(LLVMContext &context, uint32_t width);
	static Type *getTy(LLVMContext &context, TypeID id);
};

class PointerType : public Type
{
public:
	static constexpr TypeID get_type_id() { return TypeID::Pointer; }
	PointerType(Type *type, unsigned addr_space);
	static PointerType *get(Type *pointee, unsigned addr_space);

	Type *getElementType() const;
	unsigned getAddressSpace() const;

private:
	Type *contained_type = nullptr;
	unsigned address_space = 0;
};

class ArrayType : public Type
{
public:
	static constexpr TypeID get_type_id() { return TypeID::Array; }
	ArrayType(Type *type, uint64_t elements);
	static ArrayType *get(Type *element, uint64_t size);

private:
	friend class Type;
	Type *contained_type = nullptr;
	uint64_t elements = 0;
};

class IntegerType : public Type
{
public:
	static constexpr TypeID get_type_id() { return TypeID::Int; }
	IntegerType(LLVMContext &context, uint32_t width);
	uint32_t getBitWidth() const;

private:
	uint32_t width = 0;
};

class StructType : public Type
{
public:
	static constexpr TypeID get_type_id() { return TypeID::Struct; }
	StructType(LLVMContext &context, std::vector<Type *> member_types);
	static StructType *get(std::vector<Type *> member_types);

	unsigned getNumElements() const;
	Type *getElementType(unsigned N) const;

private:
	std::vector<Type *> member_types;
};

class VectorType : public Type
{
public:
	static constexpr TypeID get_type_id() { return TypeID::Vector; }
	VectorType(LLVMContext &context, unsigned vector_size, Type *type);
	static VectorType *get(unsigned vector_size, Type *type);

	unsigned getVectorSize() const;
	Type *getElementType() const;

private:
	Type *element_type;
	unsigned vector_size;
};

class FunctionType : public Type
{
public:
	static constexpr TypeID get_type_id() { return TypeID::Function; }
	FunctionType(LLVMContext &context, Type *return_type, std::vector<Type *> argument_types);
	unsigned getNumParams() const;
	Type *getParamType(unsigned index) const;
	Type *getReturnType() const;

private:
	Type *return_type = nullptr;
	std::vector<Type *> argument_types;
};
}
