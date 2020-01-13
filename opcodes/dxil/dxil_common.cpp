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

#include "dxil_common.hpp"
#include "logging.hpp"

namespace DXIL2SPIRV
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
} // namespace DXIL2SPIRV
