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
#include "SpvBuilder.h"
#include "opcodes/opcodes.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
bool get_constant_operand(const llvm::Instruction *value, unsigned index, uint32_t *operand);
spv::Id emit_u32x2_u32_add(Converter::Impl &impl, spv::Id u32x2_value, spv::Id u32_value);
unsigned get_type_scalar_alignment(Converter::Impl &impl, const llvm::Type *type);

spv::Id get_buffer_alias_handle(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta,
                                spv::Id default_id, RawType type, RawWidth width, RawVecSize vecsize);

bool type_is_16bit(const llvm::Type *data_type);
bool type_is_64bit(const llvm::Type *data_type);

void get_physical_load_store_cast_info(Converter::Impl &impl, const llvm::Type *element_type,
                                       spv::Id &physical_type_id, spv::Op &value_cast_op);

struct RawBufferAccessSplit
{
	uint64_t scale;
	int64_t bias;
	const llvm::Value *dynamic_index;
};

bool extract_raw_buffer_access_split(const llvm::Value *index, unsigned stride,
									 uint32_t addr_shift_log2, unsigned vecsize,
									 RawBufferAccessSplit &split);

spv::Id build_index_divider(Converter::Impl &impl, const llvm::Value *offset,
                            unsigned addr_shift_log2, unsigned vecsize);

// Clip-cull distance munging.
spv::Id get_clip_cull_distance_access_chain(
	Converter::Impl &impl, const llvm::CallInst *instruction,
	const Converter::Impl::ClipCullMeta &meta, spv::StorageClass storage);
Converter::Impl::ClipCullMeta *output_clip_cull_distance_meta(
	Converter::Impl &impl, unsigned index);
bool emit_store_clip_cull_distance(
	Converter::Impl &impl, const llvm::CallInst *instruction,
	const Converter::Impl::ClipCullMeta &meta);

void build_exploded_composite_from_vector(Converter::Impl &impl, const llvm::Instruction *inst, unsigned active_lanes);

bool value_is_dx_op_instrinsic(const llvm::Value *value, DXIL::Op op);
}
