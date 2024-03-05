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

#include "dxil_buffer.hpp"
#include "dxil_common.hpp"
#include "dxil_sampling.hpp"
#include "dxil_ags.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"
#include "spirv_module.hpp"

namespace dxil_spv
{
bool raw_access_byte_address_can_vectorize(Converter::Impl &impl, const llvm::Type *type,
                                           const llvm::Value *byte_offset,
                                           unsigned vecsize)
{
	// vec3 vectorization requires scalar block layout always.
	// For byte address buffers, robustness must be checked per component, and a vectorized vec3 load
	// can straddle the boundary. If the hardware is known not to support per-component robustness correctly,
	// avoid vectorizing this case.
	if ((!impl.options.scalar_block_layout || !impl.options.supports_per_component_robustness) && vecsize == 3)
		return false;

	if (impl.options.ssbo_alignment > 16 && vecsize == 3)
		return false;

	// The rules for raw BAB vectorization are pretty simple.
	// If the offset % element_size == 0, we can translate that load to a clean vectorized load-store.
	// vec3 is the special case due to robustness, but robustness2 will generally have 16 byte alignment here,
	// so it should be fine.
	unsigned addr_shift_log2 = raw_buffer_data_type_to_addr_shift_log2(impl, type);

	RawBufferAccessSplit split = {};
	// If we achieve a successful split, we can vectorize.
	return extract_raw_buffer_access_split(byte_offset, 1, addr_shift_log2, vecsize, split);
}

bool raw_access_structured_can_vectorize(
		Converter::Impl &impl, const llvm::Type *type,
		const llvm::Value *index, unsigned stride,
		const llvm::Value *byte_offset,
		unsigned vecsize)
{
	// vec3 vectorization requires scalar block layout always.
	if (!impl.options.scalar_block_layout && vecsize == 3)
		return false;

	unsigned addr_shift_log2 = raw_buffer_data_type_to_addr_shift_log2(impl, type);
	unsigned element_size = (1u << addr_shift_log2) * vecsize;
	unsigned alignment = element_size & -int(element_size);

	// A hypothetical offset buffer must be able to cleanly divide by element_size.
	// If stride aligns properly, we know we will never need offset buffers.
	if ((stride & (impl.options.ssbo_alignment - 1)) != 0)
	{
		// Mostly relevant for vec3 here, where the binding alignment is smaller than element size divider.
		if (element_size > alignment)
			return false;
	}

	RawBufferAccessSplit split = {};
	return extract_raw_buffer_access_split(index, stride, addr_shift_log2, vecsize, split) &&
	       extract_raw_buffer_access_split(byte_offset, 1, addr_shift_log2, vecsize, split);
}

RawVecSize raw_access_byte_address_vectorize(
	Converter::Impl &impl, const llvm::Type *type,
    const llvm::Value *byte_offset, uint32_t mask)
{
	if (mask == 0xfu && raw_access_byte_address_can_vectorize(impl, type, byte_offset, 4))
		return RawVecSize::V4;
	else if (mask == 0x7u && raw_access_byte_address_can_vectorize(impl, type, byte_offset, 3))
		return RawVecSize::V3;
	else if (mask == 0x3u && raw_access_byte_address_can_vectorize(impl, type, byte_offset, 2))
		return RawVecSize::V2;
	else
		return RawVecSize::V1;
}

RawVecSize raw_access_structured_vectorize(
	Converter::Impl &impl, const llvm::Type *type,
	const llvm::Value *index,
	unsigned stride,
    const llvm::Value *byte_offset,
	uint32_t mask)
{
	if (mask == 0xfu && raw_access_structured_can_vectorize(impl, type, index, stride, byte_offset, 4))
		return RawVecSize::V4;
	else if (mask == 0x7u && raw_access_structured_can_vectorize(impl, type, index, stride, byte_offset, 3))
		return RawVecSize::V3;
	else if (mask == 0x3u && raw_access_structured_can_vectorize(impl, type, index, stride, byte_offset, 2))
		return RawVecSize::V2;
	else
		return RawVecSize::V1;
}

static spv::Id build_accumulate_offsets(Converter::Impl &impl, const spv::Id *ids, unsigned count)
{
	spv::Id accumulated_id = 0;
	for (unsigned i = 0; i < count; i++)
	{
		if (!ids[i])
			continue;

		if (!accumulated_id)
		{
			accumulated_id = ids[i];
		}
		else
		{
			auto *add_op = impl.allocate(spv::OpIAdd, impl.builder().makeUintType(32));
			add_op->add_id(accumulated_id);
			add_op->add_id(ids[i]);
			impl.add(add_op);
			accumulated_id = add_op->id;
		}
	}

	if (!accumulated_id)
		accumulated_id = impl.builder().makeUintConstant(0);

	return accumulated_id;
}

static spv::Id build_structured_index(Converter::Impl &impl, const llvm::Value *index,
                                      unsigned stride,
                                      const llvm::Value *byte_offset,
                                      unsigned addr_shift_log2,
                                      unsigned vecsize)
{
	auto &builder = impl.builder();
	RawBufferAccessSplit stride_split = {};
	RawBufferAccessSplit byte_split = {};
	if (extract_raw_buffer_access_split(index, stride, addr_shift_log2, vecsize, stride_split) &&
	    extract_raw_buffer_access_split(byte_offset, 1, addr_shift_log2, vecsize, byte_split))
	{
		stride_split.bias += byte_split.bias;
		byte_split.bias = 0;

		spv::Id offsets_id[3] = {};

		if (stride_split.dynamic_index)
		{
			if (stride_split.scale != 1)
			{
				auto *scale_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
				scale_op->add_id(impl.get_id_for_value(stride_split.dynamic_index));
				scale_op->add_id(builder.makeUintConstant(stride_split.scale));
				impl.add(scale_op);
				offsets_id[0] = scale_op->id;
			}
			else
				offsets_id[0] = impl.get_id_for_value(stride_split.dynamic_index);
		}

		if (byte_split.dynamic_index)
		{
			if (byte_split.scale != 1)
			{
				auto *scale_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
				scale_op->add_id(builder.makeUintConstant(byte_split.scale));
				scale_op->add_id(impl.get_id_for_value(byte_split.dynamic_index));
				impl.add(scale_op);
				offsets_id[1] = scale_op->id;
			}
			else
				offsets_id[1] = impl.get_id_for_value(byte_split.dynamic_index);
		}

		if (stride_split.bias)
			offsets_id[2] = builder.makeUintConstant(stride_split.bias);

		// byte_split bias is folded.

		return build_accumulate_offsets(impl, offsets_id, 3);
	}
	else
	{
		assert(vecsize == 1);
		spv::Id offsets_id[2] = {};

		// Do it the conservative way.
		if (stride != (1u << addr_shift_log2))
		{
			auto *scale_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			scale_op->add_id(impl.get_id_for_value(index));
			scale_op->add_id(builder.makeUintConstant(stride / (1u << addr_shift_log2)));
			impl.add(scale_op);
			offsets_id[0] = scale_op->id;
		}
		else
			offsets_id[0] = impl.get_id_for_value(index);

		offsets_id[1] = build_index_divider(impl, byte_offset, addr_shift_log2, 1);

		return build_accumulate_offsets(impl, offsets_id, 2);
	}
}

unsigned raw_buffer_data_type_to_addr_shift_log2(Converter::Impl &impl, const llvm::Type *data_type)
{
	// A 16-bit raw load is only actually 16-bit if native 16-bit operations are enabled.
	if (impl.execution_mode_meta.native_16bit_operations && type_is_16bit(data_type))
		return 1;
	else if (type_is_64bit(data_type))
		return 3;
	else
		return 2;
}

static BufferAccessInfo build_buffer_access(Converter::Impl &impl, const llvm::CallInst *instruction,
                                            unsigned operand_offset,
                                            spv::Id index_offset_id,
                                            const llvm::Type *data_type,
                                            uint32_t access_mask)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];

	spv::Id index_id = 0;
	RawVecSize raw_vecsize = RawVecSize::V1;
	unsigned addr_shift_log2 = raw_buffer_data_type_to_addr_shift_log2(impl, data_type);

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		// For raw buffers, the index is in bytes.
		raw_vecsize = raw_access_byte_address_vectorize(impl, data_type, instruction->getOperand(2 + operand_offset), access_mask);
		index_id = build_index_divider(impl, instruction->getOperand(2 + operand_offset), addr_shift_log2, raw_vecsize_to_vecsize(raw_vecsize));
	}
	else if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
	{
		raw_vecsize = raw_access_structured_vectorize(
			impl, data_type,
			instruction->getOperand(2 + operand_offset),
		    meta.stride,
			instruction->getOperand(3 + operand_offset),
			access_mask);

		index_id = build_structured_index(
			impl,
			instruction->getOperand(2 + operand_offset),
			meta.stride,
			instruction->getOperand(3 + operand_offset),
			addr_shift_log2,
			raw_vecsize_to_vecsize(raw_vecsize));
	}
	else
		index_id = impl.get_id_for_value(instruction->getOperand(2 + operand_offset));

	if (index_offset_id)
	{
		unsigned vectorized_addr_shift_log2 = addr_shift_log2;

		switch (raw_vecsize)
		{
		case RawVecSize::V2:
			vectorized_addr_shift_log2 += 1;
			break;

		case RawVecSize::V4:
			vectorized_addr_shift_log2 += 2;
			break;

		default:
			// If we need offset buffers, we should never hit this case.
			assert(raw_vecsize != RawVecSize::V3);
			break;
		}

		// Need to shift the offset buffer last minute instead.
		if (meta.aliased)
		{
			spv::Id vec_type = builder.makeVectorType(builder.makeUintType(32), 2);
			Operation *shift_op = impl.allocate(spv::OpShiftRightLogical, vec_type);
			shift_op->add_id(index_offset_id);

			spv::Id shamt[2];
			shamt[0] = shamt[1] = builder.makeUintConstant(vectorized_addr_shift_log2);
			spv::Id const_vec = impl.build_constant_vector(builder.makeUintType(32), shamt, 2);

			shift_op->add_id(const_vec);
			impl.add(shift_op);

			index_offset_id = shift_op->id;
		}

		Operation *extract_offset = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
		extract_offset->add_id(index_offset_id);
		extract_offset->add_literal(0);
		impl.add(extract_offset);

		Operation *extract_len = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(32));
		extract_len->add_id(index_offset_id);
		extract_len->add_literal(1);
		impl.add(extract_len);

		Operation *add_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		add_op->add_ids({ index_id, extract_offset->id });
		impl.add(add_op);

		Operation *compare_op = impl.allocate(spv::OpULessThan, builder.makeBoolType());
		compare_op->add_ids({ index_id, extract_len->id });
		impl.add(compare_op);

		// If we have an offset ID, it also means we cannot rely on accurate robustness.
		// To handle this, we will range check and fabricate an invalid index, which is guaranteed to trip OOB.
		// This avoids us having to inject branches.
		// Choose 0x3ffffffc since it is the largest index (for 32-bit) that won't overflow 4GB offset (will break some drivers),
		// and we potentially need to write 4 elements.
		// If the allocation in question was really 4GB, then we will never trigger OOB check anyways.
		// For typed buffers, there is no address computation in the shader, so we should be able to do UINT_MAX.

		Operation *select_op = impl.allocate(spv::OpSelect, builder.makeUintType(32));

		uint32_t oob_index;
		if (meta.kind == DXIL::ResourceKind::TypedBuffer)
			oob_index = 0xffffffffu;
		else if (raw_vecsize != RawVecSize::V1)
			oob_index = 0xffffffffu >> vectorized_addr_shift_log2;
		else
			oob_index = (0xffffffffu >> addr_shift_log2) - 3u;

		select_op->add_ids({ compare_op->id, add_op->id, builder.makeUintConstant(oob_index) });
		impl.add(select_op);

		index_id = select_op->id;
	}

	return { index_id, raw_vecsize };
}

static spv::Id build_physical_pointer_address_for_raw_load_store(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[ptr_id];

	spv::Id index_id = impl.get_id_for_value(instruction->getOperand(2));
	spv::Id element_offset = 0;
	if (meta.stride != 0)
		element_offset = impl.get_id_for_value(instruction->getOperand(3));

	spv::Id byte_offset_id = 0;
	if (meta.stride)
	{
		auto *stride_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		stride_op->add_id(index_id);
		stride_op->add_id(builder.makeUintConstant(meta.stride));
		impl.add(stride_op);

		auto *offset_op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
		offset_op->add_id(stride_op->id);
		offset_op->add_id(element_offset);
		impl.add(offset_op);

		byte_offset_id = offset_op->id;
	}
	else
	{
		byte_offset_id = index_id;
	}

	return emit_u32x2_u32_add(impl, ptr_id, byte_offset_id);
}

static spv::Id build_vectorized_physical_load_store_access(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                           unsigned vecsize, const llvm::Type *element_type)
{
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[ptr_id];
	unsigned mask = (1u << vecsize) - 1u;

	// If we can express this as a plain access chain, do so for clarity and ideally better perf.
	// If we cannot do it trivially, fallback to raw pointer arithmetic.
	bool can_vectorize = false;

	if (meta.stride)
	{
		if (raw_access_structured_can_vectorize(impl, element_type,
		                                        instruction->getOperand(2), meta.stride,
		                                        instruction->getOperand(3), vecsize))
		{
			can_vectorize = true;
		}
	}
	else if (raw_access_byte_address_can_vectorize(impl, element_type,
	                                               instruction->getOperand(2), vecsize))
	{
		can_vectorize = true;
	}

	if (can_vectorize)
	{
		auto access = build_buffer_access(impl, instruction, 0, 0, element_type, mask);
		return access.index_id;
	}
	else
		return 0;
}

static bool emit_physical_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                  const Converter::Impl::PhysicalPointerMeta &ptr_meta,
                                                  uint32_t mask = 0, uint32_t alignment = 0)
{
	auto &builder = impl.builder();

	if (mask == 0 && !get_constant_operand(instruction, 4, &mask))
		return false;
	if (alignment == 0 && !get_constant_operand(instruction, 5, &alignment))
		return false;

	unsigned vecsize = 0;
	if (mask == 1)
		vecsize = 1;
	else if (mask == 3)
		vecsize = 2;
	else if (mask == 7)
		vecsize = 3;
	else if (mask == 15)
		vecsize = 4;
	else
	{
		LOGE("Unexpected mask for RawBufferLoad = %u.\n", mask);
		return false;
	}

	auto *element_type = instruction->getType()->getStructElementType(0);
	// If we can express this as a plain access chain, do so for clarity and ideally better perf.
	// If we cannot do it trivially, fallback to raw pointer arithmetic.
	spv::Id array_id = build_vectorized_physical_load_store_access(impl, instruction, vecsize, element_type);

	spv::Id physical_type_id;
	spv::Op value_cast_op;
	get_physical_load_store_cast_info(impl, element_type, physical_type_id, value_cast_op);

	if (vecsize > 1)
		physical_type_id = builder.makeVectorType(physical_type_id, vecsize);

	auto tmp_ptr_meta = ptr_meta;
	tmp_ptr_meta.stride = array_id ? vecsize * get_type_scalar_alignment(impl, element_type) : 0;
	spv::Id ptr_type_id = impl.get_physical_pointer_block_type(physical_type_id, tmp_ptr_meta);

	spv::Id u64_ptr_id;
	if (array_id)
		u64_ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	else
		u64_ptr_id = build_physical_pointer_address_for_raw_load_store(impl, instruction);

	auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
	ptr_bitcast_op->add_id(u64_ptr_id);
	impl.add(ptr_bitcast_op);

	auto *chain_op = impl.allocate(spv::OpInBoundsAccessChain,
								   builder.makePointer(spv::StorageClassPhysicalStorageBuffer, physical_type_id));
	chain_op->add_id(ptr_bitcast_op->id);
	chain_op->add_id(builder.makeUintConstant(0));
	if (array_id)
		chain_op->add_id(array_id);
	impl.add(chain_op);

	auto *load_op = impl.allocate(spv::OpLoad, physical_type_id);
	load_op->add_id(chain_op->id);
	load_op->add_literal(spv::MemoryAccessAlignedMask);
	load_op->add_literal(alignment);

	impl.add(load_op, ptr_meta.rov);

	spv::Id loaded_id = load_op->id;

	if (value_cast_op != spv::OpNop)
	{
		spv::Id type_id = impl.get_type_id(element_type);
		if (vecsize > 1)
			type_id = builder.makeVectorType(type_id, vecsize);
		auto *cast_op = impl.allocate(value_cast_op, type_id);
		cast_op->add_id(loaded_id);
		impl.add(cast_op);
		loaded_id = cast_op->id;
	}

	impl.rewrite_value(instruction, loaded_id);

	if (vecsize == 1)
		impl.llvm_composite_meta[instruction].forced_composite = false;

	build_exploded_composite_from_vector(impl, instruction, vecsize);

	return true;
}

static RawWidth get_buffer_access_bits_per_component(
	Converter::Impl &impl, spv::StorageClass storage, const llvm::Type *element_type)
{
	if (impl.execution_mode_meta.native_16bit_operations && storage == spv::StorageClassStorageBuffer &&
	    type_is_16bit(element_type))
	{
		return RawWidth::B16;
	}
	else if (type_is_64bit(element_type))
		return RawWidth::B64;
	else
		return RawWidth::B32;
}

struct RawAccessChain
{
    spv::Id ptr_id;
    spv::Id component_type_id;
    spv::Id vector_type_id;
    unsigned alignment;
};

static bool buffer_access_is_raw_access_chain(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta)
{
    return impl.options.nv_raw_access_chains &&
            (meta.storage == spv::StorageClassStorageBuffer || meta.storage == spv::StorageClassPhysicalStorageBuffer);
}

static RawAccessChain emit_raw_access_chain(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta,
                                            const llvm::CallInst *inst, const llvm::Type *element_type, unsigned vecsize)
{
	auto &builder = impl.builder();
	spv::Id raw_component_type_id;
	RawAccessChain raw = {};

	// If we're storing to min16 types and we use native 16-bit in arithmetic,
	// we have to expand to 32-bit before storing :(
	// This will probably fall over with int vs uint, since we don't know how to sign-extend.
	if (!impl.execution_mode_meta.native_16bit_operations &&
	    impl.options.min_precision_prefer_native_16bit &&
	    type_is_16bit(element_type))
	{
		if (element_type->getTypeID() == llvm::Type::TypeID::HalfTyID)
			raw_component_type_id = builder.makeFloatType(32);
		else
			raw_component_type_id = builder.makeUintType(32);
	}
	else
		raw_component_type_id = impl.get_type_id(element_type);

	spv::Id vec_type = vecsize > 1 ? builder.makeVectorType(raw_component_type_id, vecsize) : raw_component_type_id;
	spv::Id ptr_vec_type = builder.makePointer(spv::StorageClassStorageBuffer, vec_type);

	builder.addCapability(spv::CapabilityRawAccessChainsNV);
	builder.addExtension("SPV_NV_raw_access_chains");

	auto *op = impl.allocate(spv::OpRawAccessChainNV, ptr_vec_type);
	op->add_id(impl.get_id_for_value(inst->getOperand(1)));

	unsigned scalar_size = builder.getScalarTypeWidth(raw_component_type_id) / 8;

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		unsigned addr_shift_log2 = raw_buffer_data_type_to_addr_shift_log2(impl, element_type);

		if (raw_access_byte_address_can_vectorize(impl, element_type, inst->getOperand(2), 4))
			raw.alignment = 4;
		else if (raw_access_byte_address_can_vectorize(impl, element_type, inst->getOperand(2), 2))
			raw.alignment = 2;
		else
			raw.alignment = 1;

		if (raw.alignment != 1 && raw.alignment * scalar_size <= 16 && vecsize <= raw.alignment)
		{
			// If we can prove vectorization, we can treat this as a structured buffer instead.
			// That way we needlessly avoid per-component robustness.
			// BAB descriptor range is aligned to 16 bytes, so we cannot use PerElementMask if the load
			// can straddle a 16 byte boundary.
			// If we care enough, we can split this load into two, and use per-element on both, but that's overkill.

			spv::Id element_id = build_index_divider(impl, inst->getOperand(2), addr_shift_log2, raw.alignment);
			op->add_id(builder.makeUintConstant(raw.alignment * scalar_size));
			op->add_id(element_id);
			op->add_id(builder.makeUintConstant(0));
			op->add_literal(spv::RawAccessChainOperandsRobustnessPerElementNVMask);
		}
		else
		{
			op->add_id(builder.makeUintConstant(0));
			op->add_id(builder.makeUintConstant(0));
			op->add_id(impl.get_id_for_value(inst->getOperand(2)));
			op->add_literal(spv::RawAccessChainOperandsRobustnessPerComponentNVMask);
		}
	}
	else
	{
		op->add_id(builder.makeUintConstant(meta.stride));
		op->add_id(impl.get_id_for_value(inst->getOperand(2)));
		op->add_id(impl.get_id_for_value(inst->getOperand(3)));
		op->add_literal(spv::RawAccessChainOperandsRobustnessPerElementNVMask);

		// Need extra check for stride alignment since we can normally "vectorize" vec3 structured buffers
		// if SSBO alignment is 4. However, we also need to make sure the alignment is correct before accepting.
		if ((meta.stride & (scalar_size * 4 - 1)) == 0 &&
		    raw_access_structured_can_vectorize(
			    impl, element_type,
			    inst->getOperand(2), meta.stride, inst->getOperand(3), 4))
		{
			raw.alignment = 4;
		}
		else if ((meta.stride & (scalar_size * 2 - 1)) == 0 &&
		         raw_access_structured_can_vectorize(
			         impl, element_type,
			         inst->getOperand(2), meta.stride,
			         inst->getOperand(3), 2))
		{
			raw.alignment = 2;
		}
		else
			raw.alignment = 1;
	}

	raw.alignment *= scalar_size;
	raw.component_type_id = raw_component_type_id;
	raw.vector_type_id = vec_type;
	raw.ptr_id = op->id;

	impl.add(op);

	if (meta.non_uniform)
		builder.addDecoration(op->id, spv::DecorationNonUniform);

	if (meta.physical_pointer_meta.nonwritable)
		builder.addDecoration(op->id, spv::DecorationNonWritable);
	if (meta.physical_pointer_meta.coherent)
		builder.addDecoration(op->id, spv::DecorationCoherent);

	return raw;
}

static bool emit_buffer_load_raw_chain_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                   const Converter::Impl::ResourceMeta &meta,
                                                   Converter::Impl::CompositeMeta &access_meta)
{
	auto *result_type = instruction->getType();
	auto *target_type = result_type->getStructElementType(0);

	unsigned num_elements = 1;
	for (unsigned i = 0; i < 4; i++)
		if ((access_meta.access_mask & (1u << i)) != 0)
			num_elements = i + 1;
	auto raw = emit_raw_access_chain(impl, meta, instruction, target_type, num_elements);

	auto *load_op = impl.allocate(spv::OpLoad, instruction, raw.vector_type_id);
	load_op->add_id(raw.ptr_id);
	load_op->add_literal(spv::MemoryAccessAlignedMask);
	load_op->add_literal(raw.alignment);
	impl.add(load_op);

	if (type_is_16bit(target_type) &&
	    !impl.execution_mode_meta.native_16bit_operations &&
	    impl.options.min_precision_prefer_native_16bit)
	{
		Operation *narrow_op;

		if (target_type->getTypeID() == llvm::Type::TypeID::HalfTyID)
		{
			narrow_op = impl.allocate(
				spv::OpFConvert,
				impl.get_type_id(DXIL::ComponentType::F16, 1, num_elements));
		}
		else
		{
			narrow_op = impl.allocate(
				spv::OpUConvert,
				impl.get_type_id(DXIL::ComponentType::U16, 1, num_elements));
		}

		narrow_op->add_id(load_op->id);
		impl.add(narrow_op);
		impl.rewrite_value(instruction, narrow_op->id);
	}

	build_exploded_composite_from_vector(impl, instruction, num_elements);
	access_meta.forced_composite = false;
	return true;
}

bool emit_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	// Elide dead loads.
	if (!impl.composite_is_accessed(instruction))
		return true;

	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	spv::Id image_type_id = impl.get_type_id(image_id);
	const auto &meta = impl.handle_to_resource_meta[image_id];

	auto &access_meta = impl.llvm_composite_meta[instruction];
	bool sparse = (access_meta.access_mask & (1u << 4)) != 0;

	// Leave no gaps in the access mask to aid vectorization.
	// For reads, we can safely read components we not strictly need to read.
	uint32_t smeared_access_mask;

	if (meta.storage != spv::StorageClassUniformConstant)
	{
		smeared_access_mask = access_meta.access_mask & 0xfu;
		smeared_access_mask |= smeared_access_mask >> 1u;
		smeared_access_mask |= smeared_access_mask >> 2u;
	}
	else
		smeared_access_mask = 1;

	if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
	{
		if (sparse)
		{
			LOGE("Cannot use BDA and sparse feedback. >:(\n");
			return false;
		}

		// We don't know more about alignment in SM 5.1 BufferStore.
		// We know the type must be 32-bit however ...
		// Might be possible to do some fancy analysis to deduce a better alignment.

		return emit_physical_buffer_load_instruction(impl, instruction, meta.physical_pointer_meta,
		                                             smeared_access_mask, 4);
	}

	bool raw_access_chain = buffer_access_is_raw_access_chain(impl, meta) && !sparse;
	if (raw_access_chain)
		return emit_buffer_load_raw_chain_instruction(impl, instruction, meta, access_meta);

	auto *result_type = instruction->getType();
	auto *target_type = result_type->getStructElementType(0);

	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;
	auto access = build_buffer_access(impl, instruction, 0, meta.index_offset_id,
	                                  result_type->getStructElementType(0),
	                                  smeared_access_mask);

	auto width = get_buffer_access_bits_per_component(impl, meta.storage, target_type);
	RawType raw_type = target_type->getTypeID() == llvm::Type::TypeID::DoubleTyID ?
	                   RawType::Float : RawType::Integer;

	image_id = get_buffer_alias_handle(impl, meta, image_id, raw_type, width, access.raw_vec_size);
	bool vectorized_load = access.raw_vec_size != RawVecSize::V1;

	// Sparse information is stored in the 5th component.
	if (sparse)
		builder.addCapability(spv::CapabilitySparseResidency);

	if (!is_typed)
	{
		// Unroll up to 4 loads. Ideally, we'd probably use physical_storage_buffer here, but unfortunately we have no indication
		// how many components we need to load here, and the number of components we load is not necessarily constant,
		// so we cannot reliably encode this information in the SRV.
		// The best we can do is to infer it from stride if we can.
		//unsigned conservative_num_elements = std::min(access.num_components, std::min(4u, access_meta.components));
		unsigned conservative_num_elements = 0;
		unsigned vecsize = raw_vecsize_to_vecsize(access.raw_vec_size);

		if (vectorized_load)
			conservative_num_elements = vecsize;
		else
		{
			for (unsigned i = 0; i < 4; i++)
				if ((access_meta.access_mask & (1u << i)) != 0)
					conservative_num_elements = i + 1;
		}

		spv::Id component_ids[4] = {};

		spv::Id extracted_id_type = raw_type == RawType::Integer ?
		                            builder.makeUintType(raw_width_to_bits(width)) :
		                            builder.makeFloatType(raw_width_to_bits(width));

		if (vectorized_load)
			extracted_id_type = builder.makeVectorType(extracted_id_type, vecsize);

		spv::Id constructed_id = 0;
		bool ssbo = meta.storage == spv::StorageClassStorageBuffer;

		auto *element_type = result_type->getStructElementType(0);
		bool need_cast = (element_type->getTypeID() != llvm::Type::TypeID::IntegerTyID) ||
		                 (type_is_16bit(element_type) && !impl.execution_mode_meta.native_16bit_operations &&
		                  impl.options.min_precision_prefer_native_16bit);

		// FP64 is handled directly.
		if (target_type->getTypeID() == llvm::Type::TypeID::DoubleTyID)
			need_cast = false;

		if (ssbo && sparse)
		{
			LOGE("Cannot use SSBOs and sparse feedback. >:(\n");
			return false;
		}

		if (ssbo)
		{
			spv::Id ptr_type = builder.makePointer(spv::StorageClassStorageBuffer, extracted_id_type);
			for (unsigned i = 0; i < (vectorized_load ? 1 : conservative_num_elements); i++)
			{
				if (vectorized_load || (access_meta.access_mask & (1u << i)) != 0)
				{
					auto *chain_op = impl.allocate(spv::OpAccessChain, ptr_type);
					chain_op->add_id(image_id);
					chain_op->add_id(builder.makeUintConstant(0));
					chain_op->add_id(impl.build_offset(access.index_id, i));
					impl.add(chain_op);

					if (meta.non_uniform)
						builder.addDecoration(chain_op->id, spv::DecorationNonUniform);

					auto *load_op = impl.allocate(spv::OpLoad, extracted_id_type);
					load_op->add_id(chain_op->id);
					impl.add(load_op, meta.rov);
					component_ids[i] = load_op->id;
				}
				else
					component_ids[i] = builder.createUndefined(extracted_id_type);
			}

			if (vectorized_load)
				constructed_id = component_ids[0];
			else
				constructed_id = impl.build_vector(extracted_id_type, component_ids, conservative_num_elements);
		}
		else
		{
			bool is_uav = builder.isStorageImageType(image_type_id);

			spv::Id loaded_id_type = builder.makeVectorType(extracted_id_type, 4);
			spv::Id sparse_code_id = 0;
			spv::Id sparse_loaded_id_type = 0;
			if (sparse)
				sparse_loaded_id_type = impl.get_struct_type({ extracted_id_type, loaded_id_type }, "SparseTexel");

			bool first_load = true;
			for (unsigned i = 0; i < conservative_num_elements; i++)
			{
				if (access_meta.access_mask & (1u << i))
				{
					// There is no sane way to combine sparse feedback code, since it's completely opaque to application.
					// We could hypothetically return a vector of status code and deal with it magically, but let's not go there ...
					spv::Op opcode;
					if (is_uav)
						opcode = (sparse && first_load) ? spv::OpImageSparseRead : spv::OpImageRead;
					else
						opcode = (sparse && first_load) ? spv::OpImageSparseFetch : spv::OpImageFetch;

					Operation *loaded_op =
					    impl.allocate(opcode, (sparse && first_load) ? sparse_loaded_id_type : loaded_id_type);
					loaded_op->add_ids({ image_id, impl.build_offset(access.index_id, i) });
					impl.add(loaded_op, meta.rov);

					if (sparse && first_load)
					{
						auto *code_extract_op = impl.allocate(spv::OpCompositeExtract, extracted_id_type);
						code_extract_op->add_id(loaded_op->id);
						code_extract_op->add_literal(0);
						impl.add(code_extract_op);
						sparse_code_id = code_extract_op->id;

						Operation *extracted_op = impl.allocate(spv::OpCompositeExtract, extracted_id_type);
						extracted_op->add_id(loaded_op->id);
						extracted_op->add_literal(1);
						extracted_op->add_literal(0);
						impl.add(extracted_op);
						component_ids[i] = extracted_op->id;
					}
					else
					{
						Operation *extracted_op = impl.allocate(spv::OpCompositeExtract, extracted_id_type);
						extracted_op->add_id(loaded_op->id);
						extracted_op->add_literal(0);
						impl.add(extracted_op);
						component_ids[i] = extracted_op->id;
					}
					first_load = false;
				}
				else
					component_ids[i] = builder.createUndefined(builder.makeUintType(32));
			}

			if (sparse)
			{
				Operation *op = impl.allocate(spv::OpCompositeConstruct, instruction);

				if (need_cast)
				{
					for (unsigned i = 0; i < conservative_num_elements; i++)
					{
						auto *bitcast_op =
						    impl.allocate(spv::OpBitcast, impl.get_type_id(element_type));
						bitcast_op->add_id(component_ids[i]);
						impl.add(bitcast_op);
						component_ids[i] = bitcast_op->id;
					}
				}

				for (unsigned i = 0; i < conservative_num_elements; i++)
					op->add_id(component_ids[i]);
				for (unsigned i = conservative_num_elements; i < 4; i++)
					op->add_id(builder.createUndefined(impl.get_type_id(element_type)));
				op->add_id(sparse_code_id);
				impl.add(op);
			}
			else
			{
				constructed_id = impl.build_vector(extracted_id_type, component_ids, conservative_num_elements);
			}
		}

		if (!sparse)
		{
			if (need_cast)
			{
				spv::Id casted_id;

				if (type_is_16bit(element_type) &&
				    !impl.execution_mode_meta.native_16bit_operations &&
				    impl.options.min_precision_prefer_native_16bit)
				{
					if (element_type->getTypeID() == llvm::Type::TypeID::HalfTyID)
					{
						Operation *bitcast_op = impl.allocate(
							spv::OpBitcast,
							impl.get_type_id(DXIL::ComponentType::F32, 1, conservative_num_elements));
						bitcast_op->add_id(constructed_id);
						impl.add(bitcast_op);
						casted_id = bitcast_op->id;

						Operation *narrow_op = impl.allocate(
							spv::OpFConvert,
							impl.get_type_id(DXIL::ComponentType::F16, 1, conservative_num_elements));
						narrow_op->add_id(casted_id);
						impl.add(narrow_op);
						casted_id = narrow_op->id;
					}
					else
					{
						Operation *narrow_op = impl.allocate(
							spv::OpUConvert,
							impl.get_type_id(DXIL::ComponentType::U16, 1, conservative_num_elements));
						narrow_op->add_id(constructed_id);
						impl.add(narrow_op);
						casted_id = narrow_op->id;
					}
				}
				else
				{
					Operation *op = impl.allocate(
						spv::OpBitcast, impl.build_vector_type(impl.get_type_id(element_type), conservative_num_elements));
					op->add_id(constructed_id);
					impl.add(op);
					casted_id = op->id;
				}

				impl.rewrite_value(instruction, casted_id);
			}
			else
				impl.rewrite_value(instruction, constructed_id);

			build_exploded_composite_from_vector(impl, instruction, conservative_num_elements);
		}

		access_meta.forced_composite = false;
	}
	else
	{
		bool is_uav = builder.isStorageImageType(image_type_id);

		auto effective_component_type = Converter::Impl::get_effective_typed_resource_type(meta.component_type);
		spv::Id texel_type = impl.get_type_id(effective_component_type, 1, 4);
		spv::Id sample_type;

		if (sparse)
			sample_type = impl.get_struct_type({ builder.makeUintType(32), texel_type }, "SparseTexel");
		else
			sample_type = texel_type;

		spv::Op opcode;
		if (is_uav)
			opcode = sparse ? spv::OpImageSparseRead : spv::OpImageRead;
		else
			opcode = sparse ? spv::OpImageSparseFetch : spv::OpImageFetch;

		Operation *op = impl.allocate(opcode, instruction, sample_type);

		if (!sparse)
			impl.decorate_relaxed_precision(instruction->getType()->getStructElementType(0), op->id, true);

		op->add_ids({ image_id, access.index_id });
		impl.add(op, meta.rov);

		if (sparse)
			impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
		else
		{
			impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
			build_exploded_composite_from_vector(impl, instruction, 4);
		}
	}

	return true;
}

static bool emit_physical_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                   const Converter::Impl::PhysicalPointerMeta &ptr_meta,
                                                   uint32_t alignment = 0)
{
	auto &builder = impl.builder();

	uint32_t mask = 0;
	if (!get_constant_operand(instruction, 8, &mask))
		return false;

	if (alignment == 0 && !get_constant_operand(instruction, 9, &alignment))
		return false;

	unsigned vecsize = 0;
	if (mask == 1)
		vecsize = 1;
	else if (mask == 3)
		vecsize = 2;
	else if (mask == 7)
		vecsize = 3;
	else if (mask == 15)
		vecsize = 4;
	else
	{
		LOGE("Unexpected mask for RawBufferStore = %u.\n", mask);
		return false;
	}

	auto *element_type = instruction->getOperand(4)->getType();

	// If we can express this as a plain access chain, do so for clarity and ideally better perf.
	// If we cannot do it trivially, fallback to raw pointer arithmetic.
	spv::Id array_id = build_vectorized_physical_load_store_access(impl, instruction, vecsize, element_type);

	spv::Id physical_type_id;
	spv::Op value_cast_op;
	get_physical_load_store_cast_info(impl, element_type, physical_type_id, value_cast_op);

	spv::Id vec_type_id = physical_type_id;
	if (vecsize > 1)
		vec_type_id = builder.makeVectorType(physical_type_id, vecsize);

	auto tmp_ptr_meta = ptr_meta;
	tmp_ptr_meta.stride = array_id ? vecsize * get_type_scalar_alignment(impl, element_type) : 0;
	spv::Id ptr_type_id = impl.get_physical_pointer_block_type(vec_type_id, tmp_ptr_meta);

	spv::Id u64_ptr_id;
	if (array_id)
		u64_ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	else
		u64_ptr_id = build_physical_pointer_address_for_raw_load_store(impl, instruction);

	auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
	ptr_bitcast_op->add_id(u64_ptr_id);
	impl.add(ptr_bitcast_op);

	auto *chain_op = impl.allocate(spv::OpInBoundsAccessChain,
								   builder.makePointer(spv::StorageClassPhysicalStorageBuffer, vec_type_id));
	chain_op->add_id(ptr_bitcast_op->id);
	chain_op->add_id(builder.makeUintConstant(0));
	if (array_id)
		chain_op->add_id(array_id);
	impl.add(chain_op);

	spv::Id elems[4] = {};
	for (unsigned i = 0; i < 4; i++)
		elems[i] = impl.get_id_for_value(instruction->getOperand(4 + i));

	auto *store_op = impl.allocate(spv::OpStore);
	store_op->add_id(chain_op->id);

	spv::Id vec_id = impl.build_vector(physical_type_id, elems, vecsize);
	if (value_cast_op != spv::OpNop)
	{
		auto *op = impl.allocate(value_cast_op, vec_type_id);
		op->add_id(vec_id);
		impl.add(op);
		vec_id = op->id;
	}

	store_op->add_id(vec_id);
	store_op->add_literal(spv::MemoryAccessAlignedMask);
	store_op->add_literal(alignment);

	impl.add(store_op, ptr_meta.rov);

	return true;
}

bool emit_raw_buffer_load_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	if (!impl.composite_is_accessed(instruction))
		return true;

	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[ptr_id];

	if (meta.storage != spv::StorageClassPhysicalStorageBuffer)
	{
		auto *ret_component = instruction->getType()->getStructElementType(0);
		if (ret_component->getTypeID() != llvm::Type::TypeID::FloatTyID &&
		    !(ret_component->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
		      ret_component->getIntegerBitWidth() == 32) &&
		    meta.storage != spv::StorageClassStorageBuffer)
		{
			LOGE("16 or 64-bit RawBufferLoad on descriptors is only supported for SSBOs.\n");
			return false;
		}

		// Ignore the mask. We'll read too much, but robustness should take care of any OOB.
		return emit_buffer_load_instruction(impl, instruction);
	}
	else
		return emit_physical_buffer_load_instruction(impl, instruction, meta.physical_pointer_meta);
}

static unsigned emit_buffer_store_values_bitcast(Converter::Impl &impl, const llvm::CallInst *instruction,
                                                 spv::Id *store_values, unsigned write_mask,
                                                 RawWidth raw_width,
                                                 bool is_typed, bool ignore_bitcast)
{
	auto *element_type = instruction->getOperand(4)->getType();
	auto &builder = impl.builder();
	unsigned raw_vecsize = 0;

	for (unsigned i = 0; i < 4; i++)
	{
		if ((write_mask & (1u << i)) != 0)
		{
			store_values[i] = impl.get_id_for_value(instruction->getOperand(4 + i));
			if (!is_typed)
			{
				// If we're storing to min16 types and we use native 16-bit in arithmetic,
				// we have to expand to 32-bit before storing :(
				// This will probably fall over with int vs uint, since we don't know how to sign-extend.
				if (!impl.execution_mode_meta.native_16bit_operations &&
				    impl.options.min_precision_prefer_native_16bit &&
				    type_is_16bit(element_type))
				{
					if (element_type->getTypeID() == llvm::Type::TypeID::HalfTyID)
					{
						Operation *op = impl.allocate(spv::OpFConvert, builder.makeFloatType(32));
						op->add_id(store_values[i]);
						store_values[i] = op->id;
						impl.add(op);

						if (!ignore_bitcast)
						{
							Operation *bitcast_op = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
							bitcast_op->add_id(store_values[i]);
							impl.add(bitcast_op);
							store_values[i] = bitcast_op->id;
						}
					}
					else
					{
						// SConvert or UConvert, who knows. :)
						Operation *op = impl.allocate(spv::OpUConvert, builder.makeUintType(32));
						op->add_id(store_values[i]);
						store_values[i] = op->id;
						impl.add(op);
					}
				}
				else if (!ignore_bitcast &&
				         element_type->getTypeID() != llvm::Type::TypeID::DoubleTyID &&
				         element_type->getTypeID() != llvm::Type::TypeID::IntegerTyID)
				{
					Operation *op = impl.allocate(spv::OpBitcast, builder.makeUintType(raw_width_to_bits(raw_width)));
					op->add_id(store_values[i]);
					store_values[i] = op->id;
					impl.add(op);
				}
			}

			raw_vecsize = i + 1;
		}
	}

	return raw_vecsize;
}

bool emit_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));

	// Deferred 64-bit atomic. Resolve in a later AGS atomic.
	if (impl.ags.phases == 2 && impl.ags.backdoor_instructions[0] == instruction->getOperand(2))
	{
		impl.ags.active_uav_ptr = image_id;
		impl.ags.active_uav_op = DXIL::Op::BufferStore;
		return true;
	}

	const auto &meta = impl.handle_to_resource_meta[image_id];

	if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
	{
		// We don't more about alignment in SM 5.1 BufferStore.
		// We know the type must be 32-bit however ...
		// Might be possible to do some fancy analysis to deduce a better alignment.
		return emit_physical_buffer_store_instruction(impl, instruction, meta.physical_pointer_meta, 4);
	}

	auto *element_type = instruction->getOperand(4)->getType();

	// SSBO operations with min16* types are actually 32-bit.
	// We only get native 16-bit load-store with native_16bit_operations.
	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;
	unsigned mask = llvm::cast<llvm::ConstantInt>(instruction->getOperand(8))->getUniqueInteger().getZExtValue();
	auto width = get_buffer_access_bits_per_component(impl, meta.storage, element_type);

	bool raw_access_chain = buffer_access_is_raw_access_chain(impl, meta);
	spv::Id store_values[4] = {};

	if (raw_access_chain)
	{
		auto raw_vecsize = emit_buffer_store_values_bitcast(impl, instruction, store_values, mask, width, false, true);
		auto raw = emit_raw_access_chain(impl, meta, instruction, element_type, raw_vecsize);
		spv::Id vector_value_id = impl.build_vector(raw.component_type_id, store_values, raw_vecsize);

		auto *store_op = impl.allocate(spv::OpStore);
		store_op->add_id(raw.ptr_id);
		store_op->add_id(vector_value_id);
		store_op->add_literal(spv::MemoryAccessAlignedMask);
		store_op->add_literal(raw.alignment);
		impl.add(store_op);
		return true;
	}

	auto access = build_buffer_access(impl, instruction, 0, meta.index_offset_id,
	                                  instruction->getOperand(4)->getType(),
	                                  meta.storage != spv::StorageClassUniformConstant ? mask : 1u);

	RawType raw_type = element_type->getTypeID() == llvm::Type::TypeID::DoubleTyID ?
	                   RawType::Float : RawType::Integer;

	image_id = get_buffer_alias_handle(impl, meta, image_id, raw_type, width, access.raw_vec_size);
	bool vectorized_store = access.raw_vec_size != RawVecSize::V1;

	// We could hoist the call to emit_buffer_store_values_bitcast,
	// but causes too much churn on shader deltas.
	emit_buffer_store_values_bitcast(impl, instruction, store_values, mask, width, is_typed, false);

	if (is_typed)
	{
		spv::Id element_type_id = impl.get_type_id(instruction->getOperand(4)->getType());

		// Deal with signed resource store.
		Operation *op = impl.allocate(spv::OpImageWrite);
		op->add_ids(
		    { image_id, access.index_id,
		      impl.fixup_store_type_typed(meta.component_type, 4, impl.build_vector(element_type_id, store_values, 4)) });

		impl.add(op, meta.rov);
	}
	else if (meta.storage == spv::StorageClassStorageBuffer)
	{
		if (vectorized_store)
		{
			spv::Id elem_type_id = raw_type == RawType::Integer ?
			                       builder.makeUintType(raw_width_to_bits(width)) :
			                       builder.makeFloatType(raw_width_to_bits(width));

			unsigned vecsize = raw_vecsize_to_vecsize(access.raw_vec_size);
			spv::Id vec_type_id = builder.makeVectorType(elem_type_id, vecsize);
			spv::Id vector_value_id = impl.build_vector(elem_type_id, store_values, vecsize);
			Operation *chain_op = impl.allocate(
				spv::OpAccessChain, builder.makePointer(spv::StorageClassStorageBuffer, vec_type_id));

			chain_op->add_id(image_id);
			chain_op->add_id(builder.makeUintConstant(0));
			chain_op->add_id(access.index_id);
			impl.add(chain_op);

			if (meta.non_uniform)
				builder.addDecoration(chain_op->id, spv::DecorationNonUniform);

			Operation *store_op = impl.allocate(spv::OpStore);
			store_op->add_id(chain_op->id);
			store_op->add_id(vector_value_id);
			impl.add(store_op, meta.rov);
		}
		else
		{
			for (unsigned i = 0; i < 4; i++)
			{
				if (mask & (1u << i))
				{
					spv::Id elem_type_id = raw_type == RawType::Integer ?
					                       builder.makeUintType(raw_width_to_bits(width)) :
					                       builder.makeFloatType(raw_width_to_bits(width));

					Operation *chain_op = impl.allocate(
					    spv::OpAccessChain, builder.makePointer(spv::StorageClassStorageBuffer, elem_type_id));
					chain_op->add_id(image_id);
					chain_op->add_id(builder.makeUintConstant(0));
					chain_op->add_id(impl.build_offset(access.index_id, i));
					impl.add(chain_op);

					if (meta.non_uniform)
						builder.addDecoration(chain_op->id, spv::DecorationNonUniform);

					Operation *store_op = impl.allocate(spv::OpStore);
					store_op->add_id(chain_op->id);
					store_op->add_id(store_values[i]);
					impl.add(store_op, meta.rov);
				}
			}
		}
	}
	else
	{
		spv::Id splat_type_id = builder.makeVectorType(builder.makeUintType(32), 4);
		for (unsigned i = 0; i < 4; i++)
		{
			if (mask & (1u << i))
			{
				Operation *splat_op = impl.allocate(spv::OpCompositeConstruct, splat_type_id);
				splat_op->add_ids({ store_values[i], store_values[i], store_values[i], store_values[i] });
				impl.add(splat_op);

				Operation *op = impl.allocate(spv::OpImageWrite);
				op->add_ids({
				    image_id,
				    impl.build_offset(access.index_id, i),
				    splat_op->id,
				});
				impl.add(op, meta.rov);
			}
		}
	}

	if (is_typed)
		builder.addCapability(spv::CapabilityStorageImageWriteWithoutFormat);

	return true;
}

bool emit_raw_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	spv::Id ptr_id = impl.get_id_for_value(instruction->getOperand(1));

	// Deferred 64-bit atomic. Resolve in a later AGS atomic.
	if (impl.ags.phases == 2 && impl.ags.backdoor_instructions[0] == instruction->getOperand(2))
	{
		impl.ags.active_uav_ptr = ptr_id;
		impl.ags.active_uav_op = DXIL::Op::BufferStore;
		return true;
	}

	const auto &meta = impl.handle_to_resource_meta[ptr_id];

	if (meta.storage != spv::StorageClassPhysicalStorageBuffer)
	{
		auto *store_type = instruction->getOperand(4)->getType();
		if (store_type->getTypeID() != llvm::Type::TypeID::FloatTyID &&
		    !(store_type->getTypeID() == llvm::Type::TypeID::IntegerTyID && store_type->getIntegerBitWidth() == 32) &&
		    meta.storage != spv::StorageClassStorageBuffer)
		{
			LOGE("16 or 64-bit RawBufferStore on descriptors is only supported for SSBOs.\n");
			return false;
		}

		return emit_buffer_store_instruction(impl, instruction);
	}
	else
		return emit_physical_buffer_store_instruction(impl, instruction, meta.physical_pointer_meta);
}

static spv::Id emit_atomic_access_chain(Converter::Impl &impl,
                                        const Converter::Impl::ResourceMeta &meta,
                                        RawWidth width, spv::Id image_id, spv::Id coord,
                                        DXIL::ComponentType &component_type)
{
	auto &builder = impl.builder();
	Operation *counter_ptr_op = nullptr;
	component_type = raw_width_to_component_type(RawType::Integer, width);
	spv::Id var_id = get_buffer_alias_handle(impl, meta, meta.var_id, RawType::Integer, width, RawVecSize::V1);
	if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
	{
		spv::Id uint_type = builder.makeUintType(raw_width_to_bits(width));
		auto physical_pointer_meta = meta.physical_pointer_meta;
		physical_pointer_meta.stride = raw_width_to_bits(width) / 8;
		spv::Id ptr_type_id =
		    impl.get_physical_pointer_block_type(uint_type, physical_pointer_meta);

		auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
		ptr_bitcast_op->add_id(image_id);
		impl.add(ptr_bitcast_op);

		counter_ptr_op = impl.allocate(spv::OpAccessChain,
		                               builder.makePointer(spv::StorageClassPhysicalStorageBuffer, uint_type));
		counter_ptr_op->add_ids({ ptr_bitcast_op->id, builder.makeUintConstant(0), coord });
	}
	else if (meta.storage == spv::StorageClassStorageBuffer)
	{
		counter_ptr_op =
		    impl.allocate(spv::OpAccessChain,
		                  builder.makePointer(spv::StorageClassStorageBuffer,
		                                      builder.makeUintType(raw_width_to_bits(width))));
		counter_ptr_op->add_ids({ var_id, builder.makeUintConstant(0), coord });
	}
	else
	{
		counter_ptr_op =
		    impl.allocate(spv::OpImageTexelPointer,
		                  builder.makePointer(spv::StorageClassImage, impl.get_type_id(meta.component_type, 1, 1)));
		counter_ptr_op->add_ids({ var_id, coord, builder.makeUintConstant(0) });
		component_type = meta.component_type;
	}
	impl.add(counter_ptr_op);

	return counter_ptr_op->id;
}

bool emit_atomic_binop_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	auto binop = static_cast<DXIL::AtomicBinOp>(
	    llvm::cast<llvm::ConstantInt>(instruction->getOperand(2))->getUniqueInteger().getZExtValue());

	spv::Id coords[3] = {};
	uint32_t num_coords_full = 0, num_coords = 0;

	if (meta.kind == DXIL::ResourceKind::StructuredBuffer || meta.kind == DXIL::ResourceKind::RawBuffer ||
	    meta.kind == DXIL::ResourceKind::TypedBuffer)
	{
		auto access = build_buffer_access(impl, instruction, 1, meta.index_offset_id, instruction->getType(), 1);
		coords[0] = access.index_id;
		num_coords = 1;
		num_coords_full = 1;
	}
	else
	{
		if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
			return false;

		if (num_coords_full > 3)
			return false;

		for (uint32_t i = 0; i < num_coords_full; i++)
			coords[i] = impl.get_id_for_value(instruction->getOperand(3 + i));
	}
	spv::Id coord = impl.build_vector(builder.makeUintType(32), coords, num_coords_full);

	auto width = get_buffer_access_bits_per_component(impl, meta.storage, instruction->getType());
	if (width == RawWidth::B64)
		builder.addCapability(spv::CapabilityInt64Atomics);

	DXIL::ComponentType component_type;
	spv::Id counter_ptr_id = emit_atomic_access_chain(impl, meta, width, image_id, coord, component_type);

	if (meta.non_uniform)
		builder.addDecoration(counter_ptr_id, spv::DecorationNonUniformEXT);

	spv::Op opcode;

	switch (binop)
	{
	case DXIL::AtomicBinOp::Exchange:
		opcode = spv::OpAtomicExchange;
		break;

	case DXIL::AtomicBinOp::IAdd:
		opcode = spv::OpAtomicIAdd;
		break;

	case DXIL::AtomicBinOp::And:
		opcode = spv::OpAtomicAnd;
		break;

	case DXIL::AtomicBinOp::Or:
		opcode = spv::OpAtomicOr;
		break;

	case DXIL::AtomicBinOp::Xor:
		opcode = spv::OpAtomicXor;
		break;

	case DXIL::AtomicBinOp::IMin:
		opcode = spv::OpAtomicSMin;
		break;

	case DXIL::AtomicBinOp::IMax:
		opcode = spv::OpAtomicSMax;
		break;

	case DXIL::AtomicBinOp::UMin:
		opcode = spv::OpAtomicUMin;
		break;

	case DXIL::AtomicBinOp::UMax:
		opcode = spv::OpAtomicUMax;
		break;

	default:
		return false;
	}

	Operation *op = impl.allocate(opcode, instruction, impl.get_type_id(component_type, 1, 1));

	op->add_id(counter_ptr_id);
	op->add_id(builder.makeUintConstant(spv::ScopeDevice));
	op->add_id(builder.makeUintConstant(0));
	op->add_id(impl.fixup_store_type_atomic(component_type, 1, impl.get_id_for_value(instruction->getOperand(6))));

	impl.add(op, meta.rov);

	impl.fixup_load_type_atomic(component_type, 1, instruction);
	return true;
}

static bool emit_magic_ags_atomic_u64(Converter::Impl &impl, spv::Id image_id,
                                      spv::Op atomic_opcode, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	builder.addCapability(spv::CapabilityInt64Atomics);

	const auto &meta = impl.handle_to_resource_meta[image_id];

	spv::Id coords[3] = {};
	uint32_t num_coords_full = 0, num_coords = 0;

	if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
		LOGE("RWStructuredBuffer not supported for AGS u64 atomics.\n");
	else if (meta.kind == DXIL::ResourceKind::TypedBuffer)
		LOGE("RWBuffer not supported for AGS u64 atomics.\n");

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		// AGS header only supports BAB.
		coords[0] = build_index_divider(impl, impl.ags.backdoor_instructions[0]->getOperand(5), 3, 1);
		num_coords = 1;
		num_coords_full = 1;
	}
	else
	{
		if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
			return false;

		if (num_coords_full > 3)
			return false;

		// The actual coordinates are stored in the backdoor instructions.
		for (uint32_t i = 0; i < num_coords_full; i++)
		{
			auto *coord_value = impl.ags.backdoor_instructions[i / 2]->getOperand(5 + (i & 1));
			coords[i] = impl.get_id_for_value(coord_value);
		}
	}

	spv::Id coord = impl.build_vector(builder.makeUintType(32), coords, num_coords_full);

	DXIL::ComponentType component_type;
	spv::Id counter_ptr_id = emit_atomic_access_chain(impl, meta, RawWidth::B64, image_id, coord, component_type);

	spv::Id u32s[2];
	u32s[0] = impl.get_id_for_value(impl.ags.backdoor_instructions[1]->getOperand(6));
	u32s[1] = impl.get_id_for_value(impl.ags.backdoor_instructions[2]->getOperand(5));
	spv::Id u32_vec = impl.build_vector(builder.makeUintType(32), u32s, 2);

	auto *bitcast_op = impl.allocate(spv::OpBitcast, impl.get_type_id(DXIL::ComponentType::U64, 1, 1));
	bitcast_op->add_id(u32_vec);
	impl.add(bitcast_op);

	auto *atomic_op = impl.allocate(atomic_opcode, impl.get_type_id(DXIL::ComponentType::U64, 1, 1));

	atomic_op->add_id(counter_ptr_id);
	atomic_op->add_id(builder.makeUintConstant(spv::ScopeDevice));
	atomic_op->add_id(builder.makeUintConstant(0));
	atomic_op->add_id(bitcast_op->id);
	impl.add(atomic_op);

	bitcast_op = impl.allocate(spv::OpBitcast, impl.get_type_id(DXIL::ComponentType::U32, 1, 2));
	bitcast_op->add_id(atomic_op->id);
	impl.add(bitcast_op);

	for (unsigned i = 0; i < 2; i++)
	{
		auto *extract_op = impl.allocate(spv::OpCompositeExtract, impl.get_type_id(DXIL::ComponentType::U32, 1, 1));
		extract_op->add_id(bitcast_op->id);
		extract_op->add_literal(i);
		impl.add(extract_op);
		u32s[i] = extract_op->id;
	}

	// The backdoor instructions end up with the final result.
	impl.rewrite_value(impl.ags.backdoor_instructions[0], u32s[0]);
	impl.rewrite_value(impl.ags.backdoor_instructions[2], u32s[1]);
	impl.rewrite_value(instruction, u32s[1]);
	return true;
}

static bool emit_magic_ags_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	impl.push_ags_instruction(instruction);

	// We might be able to retire an instruction now.
	// Only support exactly what we need to support. Anything else will fail compilation.
	if (impl.ags.phases == 0)
		return true;

	switch (impl.ags.instructions[0].opcode)
	{
	case AmdExtD3DShaderIntrinsicsOpcode_Readfirstlane:
	{
		// Don't bother with all the weird special cases.
		auto *op = impl.allocate(spv::OpGroupNonUniformBroadcastFirst, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(5)));

		impl.add(op);
		builder.addCapability(spv::CapabilityGroupNonUniformBallot);
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_Readlane:
	{
		auto *op = impl.allocate(spv::OpGroupNonUniformBroadcast, instruction);
		op->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
		op->add_id(impl.get_id_for_value(instruction->getOperand(5)));
		op->add_id(builder.makeUintConstant(impl.ags.instructions[0].immediate));

		impl.add(op);
		builder.addCapability(spv::CapabilityGroupNonUniformBallot);
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_AtomicU64:
	{
		spv::Op atomic_op = spv::OpNop;
		if (impl.ags.phases == 3)
		{
			switch (impl.ags.instructions[0].immediate)
			{
			case AmdExtD3DShaderIntrinsicsAtomicOp_MaxU64:
				atomic_op = spv::OpAtomicUMax;
				break;
			case AmdExtD3DShaderIntrinsicsAtomicOp_MinU64:
				atomic_op = spv::OpAtomicUMin;
				break;
			case AmdExtD3DShaderIntrinsicsAtomicOp_AddU64:
				atomic_op = spv::OpAtomicIAdd;
				break;
			case AmdExtD3DShaderIntrinsicsAtomicOp_XorU64:
				atomic_op = spv::OpAtomicXor;
				break;
			case AmdExtD3DShaderIntrinsicsAtomicOp_OrU64:
				atomic_op = spv::OpAtomicOr;
				break;
			case AmdExtD3DShaderIntrinsicsAtomicOp_AndU64:
				atomic_op = spv::OpAtomicAnd;
				break;
			case AmdExtD3DShaderIntrinsicsAtomicOp_XchgU64:
				atomic_op = spv::OpAtomicExchange;
				break;
			default:
				// CmpXchg isn't hard to support, just need to modify the impl a bit, but only care if we have to.
				LOGE("Unsupported AGS AtomicU64 variant: immediate %u.\n", impl.ags.instructions[0].immediate);
				return false;
			}

			// Magic 64-bit image atomics.
			if ((impl.ags.active_uav_op == DXIL::Op::TextureStore ||
			     impl.ags.active_uav_op == DXIL::Op::BufferStore) && impl.ags.active_uav_ptr)
			{
				return emit_magic_ags_atomic_u64(impl, impl.ags.active_uav_ptr, atomic_op, instruction);
			}
			else
			{
				LOGE("Attempting to use AGS U64 atomic on unknown resource type.\n");
				return false;
			}
		}
		break;
	}

	default:
		LOGE("Unsupported AGS magic instruction 0x%x (immediate %u).\n",
		     impl.ags.instructions[0].opcode,
		     impl.ags.instructions[0].immediate);
		return false;
	}

	return true;
}

bool emit_atomic_cmpxchg_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));

	if (image_id == impl.ags.magic_ptr_id)
		return emit_magic_ags_instruction(impl, instruction);

	const auto &meta = impl.handle_to_resource_meta[image_id];

	spv::Id coords[3] = {};
	uint32_t num_coords_full = 0, num_coords = 0;

	if (meta.kind == DXIL::ResourceKind::StructuredBuffer ||
	    meta.kind == DXIL::ResourceKind::RawBuffer ||
	    meta.kind == DXIL::ResourceKind::TypedBuffer)
	{
		auto access = build_buffer_access(impl, instruction, 0, meta.index_offset_id, instruction->getType(), 1);
		coords[0] = access.index_id;
		num_coords = 1;
		num_coords_full = 1;
	}
	else
	{
		if (!get_image_dimensions(impl, image_id, &num_coords_full, &num_coords))
			return false;

		if (num_coords_full > 3)
			return false;

		for (uint32_t i = 0; i < num_coords_full; i++)
			coords[i] = impl.get_id_for_value(instruction->getOperand(2 + i));
	}

	spv::Id coord = impl.build_vector(builder.makeUintType(32), coords, num_coords_full);

	auto width = get_buffer_access_bits_per_component(impl, meta.storage, instruction->getType());
	if (width == RawWidth::B64)
		builder.addCapability(spv::CapabilityInt64Atomics);

	DXIL::ComponentType component_type;
	spv::Id counter_ptr_id = emit_atomic_access_chain(impl, meta, width, image_id, coord, component_type);

	if (meta.non_uniform)
		builder.addDecoration(counter_ptr_id, spv::DecorationNonUniformEXT);

	Operation *op =
	    impl.allocate(spv::OpAtomicCompareExchange, instruction, impl.get_type_id(component_type, 1, 1));

	spv::Id comparison_id = impl.get_id_for_value(instruction->getOperand(5));
	spv::Id new_value_id = impl.get_id_for_value(instruction->getOperand(6));
	comparison_id = impl.fixup_store_type_atomic(component_type, 1, comparison_id);
	new_value_id = impl.fixup_store_type_atomic(component_type, 1, new_value_id);

	op->add_id(counter_ptr_id);
	op->add_id(builder.makeUintConstant(spv::ScopeDevice));
	op->add_id(builder.makeUintConstant(0));
	op->add_id(builder.makeUintConstant(0));
	op->add_id(new_value_id);
	op->add_id(comparison_id);
	impl.add(op, meta.rov);
	impl.fixup_load_type_atomic(component_type, 1, instruction);
	return true;
}

bool emit_buffer_update_counter_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	int direction = llvm::cast<llvm::ConstantInt>(instruction->getOperand(2))->getUniqueInteger().getSExtValue();

	if (meta.counter_is_physical_pointer)
	{
		spv::Id func_id = impl.spirv_module.get_helper_call_id(HelperCall::RobustAtomicCounter);
		auto *op = impl.allocate(spv::OpFunctionCall, instruction);
		op->add_id(func_id);
		op->add_id(meta.counter_var_id);
		op->add_id(builder.makeUintConstant(direction));
		op->add_id(builder.makeUintConstant(direction < 0 ? -1u : 0u));
		impl.add(op, meta.rov);
	}
	else
	{
		auto *counter_ptr_op = impl.allocate(spv::OpImageTexelPointer,
		                                     builder.makePointer(spv::StorageClassImage, builder.makeUintType(32)));

		counter_ptr_op->add_id(meta.counter_var_id);
		counter_ptr_op->add_id(builder.makeUintConstant(0));
		counter_ptr_op->add_id(builder.makeUintConstant(0));

		if (meta.non_uniform)
			builder.addDecoration(counter_ptr_op->id, spv::DecorationNonUniformEXT);
		impl.add(counter_ptr_op);

		auto *op = impl.allocate(spv::OpAtomicIAdd, instruction);

		op->add_id(counter_ptr_op->id);
		op->add_id(builder.makeUintConstant(spv::ScopeDevice));
		op->add_id(builder.makeUintConstant(0));
		op->add_id(builder.makeUintConstant(direction));
		impl.add(op, meta.rov);

		spv::Id result_id = op->id;

		if (direction < 0)
		{
			op = impl.allocate(spv::OpISub, builder.makeUintType(32));
			op->add_ids({ result_id, builder.makeUintConstant(1) });
			impl.add(op);
			impl.rewrite_value(instruction, op->id);
		}
	}

	return true;
}

} // namespace dxil_spv
