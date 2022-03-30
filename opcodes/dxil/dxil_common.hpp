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
#include "SpvBuilder.h"
#include "opcodes/opcodes.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
bool get_constant_operand(const llvm::CallInst *value, unsigned index, uint32_t *operand);
spv::Id emit_u32x2_u32_add(Converter::Impl &impl, spv::Id u32x2_value, spv::Id u32_value);
unsigned get_type_scalar_alignment(Converter::Impl &impl, const llvm::Type *type);

spv::Id get_buffer_alias_handle(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta,
                                spv::Id default_id, RawWidth width, RawVecSize vecsize);

bool type_is_16bit(const llvm::Type *data_type);
bool type_is_64bit(const llvm::Type *data_type);

void get_physical_load_store_cast_info(Converter::Impl &impl, const llvm::Type *element_type,
                                       spv::Id &physical_type_id, spv::Op &value_cast_op);
}
