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
	static Type *getIntTy(LLVMContext &context, uint32_t width);
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
	static StructType *get(LLVMContext &context, Vector<Type *> member_types);

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
