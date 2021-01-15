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

#include "type.hpp"
#include "cast.hpp"
#include "context.hpp"
#include <assert.h>

namespace LLVMBC
{
PointerType::PointerType(Type *type, uint32_t addr_space)
    : Type(type->getContext(), TypeID::PointerTyID)
    , contained_type(type)
{
	address_space = addr_space;
}

PointerType *PointerType::get(Type *pointee, unsigned addr_space)
{
	auto &context = pointee->getContext();
	auto &cache = context.get_type_cache();
	for (auto *type : cache)
	{
		if (type->getTypeID() == TypeID::PointerTyID)
		{
			auto *pointer_type = cast<PointerType>(type);
			if (pointer_type->getAddressSpace() == addr_space && pointer_type->getElementType() == pointee)
				return pointer_type;
		}
	}

	auto *type = context.construct<PointerType>(pointee, addr_space);
	cache.push_back(type);
	return type;
}

unsigned Type::getAddressSpace() const
{
	return address_space;
}

Type *PointerType::getElementType() const
{
	return contained_type;
}

ArrayType::ArrayType(Type *type, uint64_t elements_)
    : Type(type->getContext(), TypeID::ArrayTyID)
    , contained_type(type)
    , elements(elements_)
{
}

ArrayType *ArrayType::get(Type *element, uint64_t size)
{
	auto &context = element->getContext();
	auto &cache = context.get_type_cache();
	for (auto *type : cache)
	{
		if (type->getTypeID() == TypeID::ArrayTyID)
		{
			auto *array_type = cast<ArrayType>(type);
			if (array_type->getArrayNumElements() == size && array_type->getArrayElementType() == element)
				return array_type;
		}
	}

	auto *type = context.construct<ArrayType>(element, size);
	cache.push_back(type);
	return type;
}

VectorType::VectorType(LLVMBC::LLVMContext &context, unsigned vector_size_, LLVMBC::Type *type)
    : Type(context, TypeID::VectorTyID)
    , element_type(type)
    , vector_size(vector_size_)
{
}

unsigned VectorType::getVectorSize() const
{
	return vector_size;
}

Type *VectorType::getElementType() const
{
	return element_type;
}

VectorType *VectorType::get(unsigned vector_size, Type *element)
{
	auto &context = element->getContext();
	auto &cache = context.get_type_cache();
	for (auto *type : cache)
	{
		if (type->getTypeID() == TypeID::VectorTyID)
		{
			auto *vector_type = cast<VectorType>(type);
			if (vector_type->getVectorSize() == vector_size && vector_type->getElementType() == element)
				return vector_type;
		}
	}

	auto *type = context.construct<VectorType>(context, vector_size, element);
	cache.push_back(type);
	return type;
}

uint64_t Type::getArrayNumElements() const
{
	assert(type_id == TypeID::ArrayTyID);
	return cast<ArrayType>(this)->elements;
}

unsigned Type::getVectorNumElements() const
{
	assert(type_id == TypeID::VectorTyID);
	return cast<VectorType>(this)->getVectorSize();
}

Type *Type::getArrayElementType() const
{
	assert(type_id == TypeID::ArrayTyID);
	return cast<ArrayType>(this)->contained_type;
}

Type *Type::getStructElementType(unsigned index) const
{
	assert(type_id == TypeID::StructTyID);
	return cast<StructType>(this)->getElementType(index);
}

unsigned Type::getStructNumElements() const
{
	assert(type_id == TypeID::StructTyID);
	return cast<StructType>(this)->getNumElements();
}

unsigned Type::getIntegerBitWidth() const
{
	assert(type_id == TypeID::IntegerTyID);
	return cast<IntegerType>(this)->getBitWidth();
}

Type *Type::getPointerElementType() const
{
	assert(type_id == TypeID::PointerTyID);
	return cast<PointerType>(this)->getElementType();
}

StructType::StructType(LLVMContext &context, Vector<Type *> member_types_)
    : Type(context, TypeID::StructTyID)
    , member_types(std::move(member_types_))
{
}

unsigned StructType::getNumElements() const
{
	return member_types.size();
}

Type *StructType::getElementType(unsigned N) const
{
	assert(N < member_types.size());
	return member_types[N];
}

StructType *StructType::get(Vector<Type *> member_types)
{
	assert(!member_types.empty());
	auto &context = member_types.front()->getContext();
	auto &cache = context.get_type_cache();
	for (auto *type : cache)
	{
		if (type->getTypeID() == TypeID::StructTyID)
		{
			auto *struct_type = cast<StructType>(type);
			if (struct_type->getNumElements() == member_types.size())
			{
				bool equal = true;
				unsigned count = member_types.size();
				for (unsigned i = 0; i < count; i++)
				{
					if (member_types[i] != struct_type->getElementType(i))
					{
						equal = false;
						break;
					}
				}

				if (equal)
					return struct_type;
			}
		}
	}

	auto *type = context.construct<StructType>(context, std::move(member_types));
	cache.push_back(type);
	return type;
}

FunctionType::FunctionType(LLVMContext &context, Type *return_type_, Vector<Type *> argument_types_)
    : Type(context, TypeID::FunctionTyID)
    , return_type(return_type_)
    , argument_types(std::move(argument_types_))
{
}

unsigned FunctionType::getNumParams() const
{
	return unsigned(argument_types.size());
}

Type *FunctionType::getParamType(unsigned index) const
{
	assert(index < argument_types.size());
	return argument_types[index];
}

Type *FunctionType::getReturnType() const
{
	return return_type;
}

IntegerType::IntegerType(LLVMContext &context, uint32_t width_)
    : Type(context, TypeID::IntegerTyID)
    , width(width_)
{
}

uint32_t IntegerType::getBitWidth() const
{
	return width;
}

Type::Type(LLVMContext &context_, TypeID type_id_)
    : context(context_)
    , type_id(type_id_)
{
}

Type::TypeID Type::getTypeID() const
{
	return type_id;
}

Type *Type::getIntTy(LLVMContext &context, uint32_t width)
{
	auto &cache = context.get_type_cache();
	for (auto *type : cache)
		if (type->getTypeID() == TypeID::IntegerTyID && cast<IntegerType>(type)->getBitWidth() == width)
			return type;

	auto *type = context.construct<IntegerType>(context, width);
	cache.push_back(type);
	return type;
}

Type *Type::getTy(LLVMContext &context, TypeID id)
{
	auto &cache = context.get_type_cache();
	for (auto *type : cache)
		if (type->getTypeID() == id)
			return type;

	auto *type = context.construct<Type>(context, id);
	cache.push_back(type);
	return type;
}

Type *Type::getVoidTy(LLVMContext &context)
{
	return getTy(context, TypeID::VoidTyID);
}

Type *Type::getHalfTy(LLVMContext &context)
{
	return getTy(context, TypeID::HalfTyID);
}

Type *Type::getFloatTy(LLVMContext &context)
{
	return getTy(context, TypeID::FloatTyID);
}

Type *Type::getDoubleTy(LLVMContext &context)
{
	return getTy(context, TypeID::DoubleTyID);
}

Type *Type::getLabelTy(LLVMContext &context)
{
	return getTy(context, TypeID::LabelTyID);
}

Type *Type::getMetadataTy(LLVMContext &context)
{
	return getTy(context, TypeID::MetadataTyID);
}

Type *Type::getInt1Ty(LLVMContext &context)
{
	return getIntTy(context, 1);
}

Type *Type::getInt8Ty(LLVMContext &context)
{
	return getIntTy(context, 8);
}

Type *Type::getInt16Ty(LLVMContext &context)
{
	return getIntTy(context, 16);
}

Type *Type::getInt32Ty(LLVMContext &context)
{
	return getIntTy(context, 32);
}

Type *Type::getInt64Ty(LLVMContext &context)
{
	return getIntTy(context, 64);
}

bool Type::isIntegerTy() const
{
	return type_id == TypeID::IntegerTyID;
}

bool Type::isFloatingPointTy() const
{
	return type_id == TypeID::HalfTyID || type_id == TypeID::FloatTyID || type_id == TypeID::DoubleTyID;
}

LLVMContext &Type::getContext()
{
	return context;
}
} // namespace LLVMBC
