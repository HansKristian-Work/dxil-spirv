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
} // namespace dxil_spv
