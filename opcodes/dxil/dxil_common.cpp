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

#include "dxil_common.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
bool get_constant_operand(const llvm::CallInst *value, unsigned index, uint32_t *operand)
{
	if (index >= value->getNumOperands())
	{
		LOGE("Operand index out of range.\n");
		return false;
	}

	auto *constant = llvm::dyn_cast<llvm::ConstantInt>(value->getOperand(index));
	if (!constant)
	{
		LOGE("Operand is not constant.\n");
		return false;
	}

	*operand = uint32_t(constant->getUniqueInteger().getZExtValue());
	return true;
}

spv::Id emit_u32x2_u32_add(Converter::Impl &impl, spv::Id u32x2_value, spv::Id u32_value)
{
	auto &builder = impl.builder();
	spv::Id uint_type = builder.makeUintType(32);

	auto *base_addr_lo = impl.allocate(spv::OpCompositeExtract, uint_type);
	base_addr_lo->add_id(u32x2_value);
	base_addr_lo->add_literal(0);
	impl.add(base_addr_lo);

	auto *base_addr_hi = impl.allocate(spv::OpCompositeExtract, uint_type);
	base_addr_hi->add_id(u32x2_value);
	base_addr_hi->add_literal(1);
	impl.add(base_addr_hi);

	auto *add_op = impl.allocate(spv::OpIAddCarry, impl.get_struct_type({ uint_type, uint_type }, "AddCarry"));
	add_op->add_ids({ base_addr_lo->id, u32_value });
	impl.add(add_op);

	auto *lo_op = impl.allocate(spv::OpCompositeExtract, uint_type);
	lo_op->add_id(add_op->id);
	lo_op->add_literal(0);
	impl.add(lo_op);

	auto *carry_op = impl.allocate(spv::OpCompositeExtract, uint_type);
	carry_op->add_id(add_op->id);
	carry_op->add_literal(1);
	impl.add(carry_op);

	auto *hi_op = impl.allocate(spv::OpIAdd, uint_type);
	hi_op->add_id(base_addr_hi->id);
	hi_op->add_id(carry_op->id);
	impl.add(hi_op);

	spv::Id addr_elems[2] = { lo_op->id, hi_op->id };
	spv::Id addr_vec = impl.build_vector(uint_type, addr_elems, 2);
	return addr_vec;
}

unsigned get_type_scalar_alignment(Converter::Impl &impl, const llvm::Type *type)
{
	unsigned scalar_alignment;
	switch (type->getTypeID())
	{
	case llvm::Type::TypeID::IntegerTyID:
		scalar_alignment = type->getIntegerBitWidth() / 8;
		break;
	case llvm::Type::TypeID::HalfTyID:
		scalar_alignment = 2;
		break;
	case llvm::Type::TypeID::FloatTyID:
		scalar_alignment = 4;
		break;
	case llvm::Type::TypeID::DoubleTyID:
		scalar_alignment = 8;
		break;
	default:
		LOGE("Invalid type for scalar alignment query.\n");
		return 1;
	}

	if (!impl.execution_mode_meta.native_16bit_operations && scalar_alignment == 2)
		scalar_alignment = 4;

	return scalar_alignment;
}

spv::Id get_buffer_alias_handle(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta,
                                spv::Id default_id, RawWidth width, RawVecSize vecsize)
{
	for (auto &alias : meta.var_alias_group)
	{
		if (alias.declaration.width == width && alias.declaration.vecsize == vecsize)
		{
			default_id = alias.var_id;
			break;
		}
	}

	return default_id;
}

bool type_is_16bit(const llvm::Type *data_type)
{
	return data_type->getTypeID() == llvm::Type::TypeID::HalfTyID ||
	       (data_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
	        data_type->getIntegerBitWidth() == 16);
}

bool type_is_64bit(const llvm::Type *data_type)
{
	return data_type->getTypeID() == llvm::Type::TypeID::DoubleTyID ||
	       (data_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
	        data_type->getIntegerBitWidth() == 64);
}

void get_physical_load_store_cast_info(Converter::Impl &impl, const llvm::Type *element_type,
                                       spv::Id &physical_type_id, spv::Op &value_cast_op)
{
	if (type_is_16bit(element_type) && !impl.execution_mode_meta.native_16bit_operations &&
	    impl.options.min_precision_prefer_native_16bit)
	{
		if (element_type->getTypeID() == llvm::Type::TypeID::HalfTyID)
		{
			physical_type_id = impl.get_type_id(DXIL::ComponentType::F32, 1, 1);
			value_cast_op = spv::OpFConvert;
		}
		else
		{
			physical_type_id = impl.get_type_id(DXIL::ComponentType::U32, 1, 1);
			value_cast_op = spv::OpUConvert;
		}
	}
	else
	{
		physical_type_id = impl.get_type_id(element_type);
		value_cast_op = spv::OpNop;
	}
}
} // namespace dxil_spv
