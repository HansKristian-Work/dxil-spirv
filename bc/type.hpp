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
class LLVMContext;

class Type
{
public:
	enum class TypeID
	{
		Unknown,
		VoidTyID,
		HalfTyID,
		FloatTyID,
		DoubleTyID,
		IntegerTyID,
		PointerTyID,
		ArrayTyID,
		StructTyID,
		FunctionTyID,
		LabelTyID,
		VectorTyID,
		MetadataTyID
	};

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
	Type *getPointerElementType() const;
	Type *getStructElementType(unsigned index) const;
	unsigned getStructNumElements() const;
	unsigned getIntegerBitWidth() const;
	unsigned getAddressSpace() const;
	unsigned getVectorNumElements() const;

protected:
	LLVMContext &context;
	TypeID type_id;
	static Type *getIntTy(LLVMContext &context, uint32_t width);
	static Type *getTy(LLVMContext &context, TypeID id);
	unsigned address_space = 0;
};

class PointerType : public Type
{
public:
	static constexpr TypeID get_type_id()
	{
		return TypeID::PointerTyID;
	}
	PointerType(Type *type, unsigned addr_space);
	static PointerType *get(Type *pointee, unsigned addr_space);

	Type *getElementType() const;

private:
	Type *contained_type = nullptr;
};

class ArrayType : public Type
{
public:
	static constexpr TypeID get_type_id()
	{
		return TypeID::ArrayTyID;
	}
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
	static constexpr TypeID get_type_id()
	{
		return TypeID::IntegerTyID;
	}
	IntegerType(LLVMContext &context, uint32_t width);
	uint32_t getBitWidth() const;

private:
	uint32_t width = 0;
};

class StructType : public Type
{
public:
	static constexpr TypeID get_type_id()
	{
		return TypeID::StructTyID;
	}
	StructType(LLVMContext &context, Vector<Type *> member_types);
	static StructType *get(Vector<Type *> member_types);

	unsigned getNumElements() const;
	Type *getElementType(unsigned N) const;

private:
	Vector<Type *> member_types;
};

class VectorType : public Type
{
public:
	static constexpr TypeID get_type_id()
	{
		return TypeID::VectorTyID;
	}
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
	static constexpr TypeID get_type_id()
	{
		return TypeID::FunctionTyID;
	}
	FunctionType(LLVMContext &context, Type *return_type, Vector<Type *> argument_types);
	unsigned getNumParams() const;
	Type *getParamType(unsigned index) const;
	Type *getReturnType() const;

private:
	Type *return_type = nullptr;
	Vector<Type *> argument_types;
};
} // namespace LLVMBC
