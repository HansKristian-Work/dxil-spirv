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

#include "dxil_buffer.hpp"
#include "dxil_common.hpp"
#include "dxil_sampling.hpp"
#include "logging.hpp"
#include "opcodes/converter_impl.hpp"

namespace dxil_spv
{
static spv::Id build_index_divider_fallback(Converter::Impl &impl, const llvm::Value *offset, unsigned addr_shift_log2)
{
	auto &builder = impl.builder();
	Operation *op = impl.allocate(spv::OpShiftRightLogical, builder.makeUintType(32));
	op->add_ids({ impl.get_id_for_value(offset), builder.makeUintConstant(addr_shift_log2) });
	impl.add(op);
	return op->id;
}

static spv::Id build_index_divider(Converter::Impl &impl, const llvm::Value *offset, unsigned addr_shift_log2)
{
	auto &builder = impl.builder();
	// Attempt to do trivial constant folding to make output a little more sensible to read.
	// Try to find an expression for offset which is "constant0 * offset + constant1",
	// where constant0 and constant1 are aligned with addr_shift_log2.

	const llvm::ConstantInt *scale = nullptr;
	const llvm::Value *index = nullptr;
	const llvm::ConstantInt *bias = nullptr;
	bool scale_log2 = false;

	if (const auto *const_addr = llvm::dyn_cast<llvm::ConstantInt>(offset))
		return builder.makeUintConstant(uint32_t(const_addr->getUniqueInteger().getZExtValue()) >> addr_shift_log2);

	if (!llvm::isa<llvm::BinaryOperator>(offset))
		return build_index_divider_fallback(impl, offset, addr_shift_log2);

	index = offset;

	while (!scale && llvm::isa<llvm::BinaryOperator>(index))
	{
		auto *binop = llvm::cast<llvm::BinaryOperator>(index);
		auto *lhs = binop->getOperand(0);
		auto *rhs = binop->getOperand(1);
		if (!bias && binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Add)
		{
			if (const auto *const_lhs = llvm::dyn_cast<llvm::ConstantInt>(lhs))
			{
				bias = const_lhs;
				index = rhs;
			}
			else if (const auto *const_rhs = llvm::dyn_cast<llvm::ConstantInt>(rhs))
			{
				bias = const_rhs;
				index = lhs;
			}
			else
				break;
		}
		else if (binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Mul ||
		         binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Shl)
		{
			if (const auto *const_lhs = llvm::dyn_cast<llvm::ConstantInt>(lhs))
			{
				scale = const_lhs;
				index = rhs;
			}
			else if (const auto *const_rhs = llvm::dyn_cast<llvm::ConstantInt>(rhs))
			{
				scale = const_rhs;
				index = lhs;
			}
			else
				break;

			scale_log2 = binop->getOpcode() == llvm::BinaryOperator::BinaryOps::Shl;
		}
		else
			break;
	}

	// Couldn't split the expression, fallback.
	if (!scale && !bias)
		return build_index_divider_fallback(impl, offset, addr_shift_log2);

	unsigned scale_factor = 1;
	if (scale)
		scale_factor = scale->getUniqueInteger().getZExtValue();
	if (scale_log2)
		scale_factor = 1u << scale_factor;

	int bias_factor = 0;
	if (bias)
		bias_factor = bias->getUniqueInteger().getSExtValue();

	spv::Op bias_opcode = bias_factor > 0 ? spv::OpIAdd : spv::OpISub;
	if (bias_opcode == spv::OpISub)
		bias_factor = -bias_factor;

	// Both scale and bias must align for there to be meaning to this transform.
	if (((scale_factor | unsigned(bias_factor)) & ((1u << addr_shift_log2) - 1u)) != 0)
		return build_index_divider_fallback(impl, offset, addr_shift_log2);

	scale_factor >>= addr_shift_log2;
	bias_factor >>= int(addr_shift_log2);

	spv::Id scaled_id;
	if (scale_factor != 1)
	{
		Operation *scale_op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
		scale_op->add_id(impl.get_id_for_value(index));
		scale_op->add_id(builder.makeUintConstant(scale_factor));
		impl.add(scale_op);
		scaled_id = scale_op->id;
	}
	else
		scaled_id = impl.get_id_for_value(index);

	spv::Id bias_id;
	if (bias_factor != 0)
	{
		Operation *bias_op = impl.allocate(bias_opcode, builder.makeUintType(32));
		bias_op->add_id(scaled_id);
		bias_op->add_id(builder.makeUintConstant(bias_factor));
		impl.add(bias_op);
		bias_id = bias_op->id;
	}
	else
		bias_id = scaled_id;

	return bias_id;
}

static bool type_is_16bit(const llvm::Type *data_type)
{
	return data_type->getTypeID() == llvm::Type::TypeID::HalfTyID ||
	       (data_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
	        data_type->getIntegerBitWidth() == 16);
}

static bool type_is_64bit(const llvm::Type *data_type)
{
	return data_type->getTypeID() == llvm::Type::TypeID::DoubleTyID ||
	       (data_type->getTypeID() == llvm::Type::TypeID::IntegerTyID &&
	        data_type->getIntegerBitWidth() == 64);
}

static unsigned raw_buffer_data_type_to_addr_shift_log2(Converter::Impl &impl, const llvm::Type *data_type)
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
	unsigned addr_shift_log2 = raw_buffer_data_type_to_addr_shift_log2(impl, data_type);

	// Ignore access mask for now.
	(void)access_mask;

	if (meta.kind == DXIL::ResourceKind::RawBuffer)
	{
		// For raw buffers, the index is in bytes.
		index_id = build_index_divider(impl, instruction->getOperand(2 + operand_offset), addr_shift_log2);
	}
	else if (meta.kind == DXIL::ResourceKind::StructuredBuffer)
	{
		index_id = impl.get_id_for_value(instruction->getOperand(2 + operand_offset));

		unsigned constant_offset = 0;
		spv::Id offset_id = impl.get_id_for_value(instruction->getOperand(3 + operand_offset));
		bool has_constant_offset = false;
		if (llvm::isa<llvm::ConstantInt>(instruction->getOperand(3 + operand_offset)))
		{
			constant_offset = unsigned(llvm::cast<llvm::ConstantInt>(instruction->getOperand(3 + operand_offset))
			                               ->getUniqueInteger()
			                               .getZExtValue());
			has_constant_offset = true;
		}

		if (meta.stride != (1u << addr_shift_log2))
		{
			Operation *op = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			op->add_ids({ index_id, builder.makeUintConstant(meta.stride >> addr_shift_log2) });
			index_id = op->id;
			impl.add(op);
		}

		if (has_constant_offset)
		{
			if (constant_offset != 0)
			{
				Operation *op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				op->add_ids({ index_id, builder.makeUintConstant(constant_offset >> addr_shift_log2) });
				index_id = op->id;
				impl.add(op);
			}
		}
		else
		{
			// Dynamically offset into the structured element.
			Operation *op = impl.allocate(spv::OpShiftRightLogical, builder.makeUintType(32));
			op->add_ids({ offset_id, builder.makeUintConstant(addr_shift_log2) });
			offset_id = op->id;
			impl.add(op);

			op = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
			op->add_ids({ index_id, offset_id });
			index_id = op->id;
			impl.add(op);
		}
	}
	else
		index_id = impl.get_id_for_value(instruction->getOperand(2 + operand_offset));

	if (index_offset_id)
	{
		// Need to shift the offset buffer last minute instead.
		if (meta.aliased)
		{
			spv::Id vec_type = builder.makeVectorType(builder.makeUintType(32), 2);
			Operation *shift_op = impl.allocate(spv::OpShiftRightLogical, vec_type);
			shift_op->add_id(index_offset_id);

			spv::Id shamt[2];
			shamt[0] = shamt[1] = builder.makeUintConstant(addr_shift_log2);
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

		const uint32_t oob_index = meta.kind == DXIL::ResourceKind::TypedBuffer ?
		                           0xffffffffu : ((0xffffffffu >> addr_shift_log2) - 3u);
		select_op->add_ids({ compare_op->id, add_op->id, builder.makeUintConstant(oob_index) });
		impl.add(select_op);

		index_id = select_op->id;
	}

	return { index_id };
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

static void get_physical_load_store_cast_info(Converter::Impl &impl, const llvm::Type *element_type,
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
	spv::Id physical_type_id;
	spv::Op value_cast_op;
	get_physical_load_store_cast_info(impl, element_type, physical_type_id, value_cast_op);

	if (vecsize > 1)
		physical_type_id = builder.makeVectorType(physical_type_id, vecsize);
	spv::Id ptr_type_id = impl.get_physical_pointer_block_type(physical_type_id, ptr_meta);

	spv::Id u64_ptr_id = build_physical_pointer_address_for_raw_load_store(impl, instruction);

	auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
	ptr_bitcast_op->add_id(u64_ptr_id);
	impl.add(ptr_bitcast_op);

	auto *chain_op = impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassPhysicalStorageBuffer, physical_type_id));
	chain_op->add_id(ptr_bitcast_op->id);
	chain_op->add_id(builder.makeUintConstant(0));
	impl.add(chain_op);

	auto *load_op = impl.allocate(spv::OpLoad, physical_type_id);
	load_op->add_id(chain_op->id);
	load_op->add_literal(spv::MemoryAccessAlignedMask);
	load_op->add_literal(alignment);
	impl.add(load_op);

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

static spv::Id get_buffer_alias_handle(Converter::Impl &impl, const Converter::Impl::ResourceMeta &meta,
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
	uint32_t smeared_access_mask = access_meta.access_mask & 0xfu;
	smeared_access_mask |= smeared_access_mask >> 1u;
	smeared_access_mask |= smeared_access_mask >> 2u;

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

	auto *result_type = instruction->getType();
	auto *target_type = result_type->getStructElementType(0);

	// SSBO operations with min16* types are actually 32-bit.
	// We only get native 16-bit load-store with native_16bit_operations.
	auto width = get_buffer_access_bits_per_component(impl, meta.storage, target_type);
	image_id = get_buffer_alias_handle(impl, meta, image_id, width, RawVecSize::V1);

	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;

	auto access = build_buffer_access(impl, instruction, 0, meta.index_offset_id,
	                                  result_type->getStructElementType(0),
	                                  smeared_access_mask);

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
		for (unsigned i = 0; i < 4; i++)
			if ((access_meta.access_mask & (1u << i)) != 0)
				conservative_num_elements = i + 1;

		spv::Id component_ids[4] = {};
		spv::Id extracted_id_type = builder.makeUintType(raw_width_to_bits(width));
		spv::Id constructed_id = 0;
		bool ssbo = meta.storage == spv::StorageClassStorageBuffer;

		auto *element_type = result_type->getStructElementType(0);
		bool need_cast = (element_type->getTypeID() != llvm::Type::TypeID::IntegerTyID) ||
		                 (type_is_16bit(element_type) && !impl.execution_mode_meta.native_16bit_operations &&
		                  impl.options.min_precision_prefer_native_16bit);

		if (ssbo && sparse)
		{
			LOGE("Cannot use SSBOs and sparse feedback. >:(\n");
			return false;
		}

		if (ssbo)
		{
			// TODO: Use proper aligned loads and stores. Wouldn't that be nice? :v
			// Hopefully compiler can figure it out ...

			spv::Id ptr_type = builder.makePointer(spv::StorageClassStorageBuffer, extracted_id_type);
			for (unsigned i = 0; i < conservative_num_elements; i++)
			{
				if (access_meta.access_mask & (1u << i))
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
					impl.add(load_op);
					component_ids[i] = load_op->id;
				}
				else
					component_ids[i] = builder.createUndefined(extracted_id_type);
			}

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
					impl.add(loaded_op);

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

		op->add_ids({ image_id, access.index_id });
		impl.add(op);

		if (sparse)
			impl.repack_sparse_feedback(meta.component_type, 4, instruction, target_type);
		else
			impl.fixup_load_type_typed(meta.component_type, 4, instruction, target_type);
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
	spv::Id physical_type_id;
	spv::Op value_cast_op;
	get_physical_load_store_cast_info(impl, element_type, physical_type_id, value_cast_op);

	spv::Id vec_type_id = physical_type_id;
	if (vecsize > 1)
		vec_type_id = builder.makeVectorType(physical_type_id, vecsize);
	spv::Id ptr_type_id = impl.get_physical_pointer_block_type(vec_type_id, ptr_meta);

	spv::Id u64_ptr_id = build_physical_pointer_address_for_raw_load_store(impl, instruction);

	auto *ptr_bitcast_op = impl.allocate(spv::OpBitcast, ptr_type_id);
	ptr_bitcast_op->add_id(u64_ptr_id);
	impl.add(ptr_bitcast_op);

	auto *chain_op = impl.allocate(spv::OpAccessChain, builder.makePointer(spv::StorageClassPhysicalStorageBuffer, vec_type_id));
	chain_op->add_id(ptr_bitcast_op->id);
	chain_op->add_id(builder.makeUintConstant(0));
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
	impl.add(store_op);

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

bool emit_buffer_store_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
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
	auto width = get_buffer_access_bits_per_component(impl, meta.storage, element_type);
	image_id = get_buffer_alias_handle(impl, meta, image_id, width, RawVecSize::V1);

	unsigned mask = llvm::cast<llvm::ConstantInt>(instruction->getOperand(8))->getUniqueInteger().getZExtValue();

	auto access = build_buffer_access(impl, instruction, 0, meta.index_offset_id,
	                                  instruction->getOperand(4)->getType(), mask);

	spv::Id store_values[4] = {};
	bool is_typed = meta.kind == DXIL::ResourceKind::TypedBuffer;

	for (unsigned i = 0; i < 4; i++)
	{
		if ((mask & (1u << i)) != 0)
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

						Operation *bitcast_op = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
						bitcast_op->add_id(store_values[i]);
						impl.add(bitcast_op);
						store_values[i] = bitcast_op->id;
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
				else if (element_type->getTypeID() != llvm::Type::TypeID::IntegerTyID)
				{
					Operation *op = impl.allocate(spv::OpBitcast, builder.makeUintType(raw_width_to_bits(width)));
					op->add_id(store_values[i]);
					store_values[i] = op->id;
					impl.add(op);
				}
			}
		}
	}

	if (is_typed)
	{
		spv::Id element_type_id = impl.get_type_id(instruction->getOperand(4)->getType());

		// Deal with signed resource store.
		Operation *op = impl.allocate(spv::OpImageWrite);
		op->add_ids(
		    { image_id, access.index_id,
		      impl.fixup_store_type_typed(meta.component_type, 4, impl.build_vector(element_type_id, store_values, 4)) });

		impl.add(op);
	}
	else if (meta.storage == spv::StorageClassStorageBuffer)
	{
		for (unsigned i = 0; i < 4; i++)
		{
			if (mask & (1u << i))
			{
				Operation *chain_op = impl.allocate(spv::OpAccessChain,
				                                    builder.makePointer(spv::StorageClassStorageBuffer,
				                                                        builder.makeUintType(raw_width_to_bits(width))));
				chain_op->add_id(image_id);
				chain_op->add_id(builder.makeUintConstant(0));
				chain_op->add_id(impl.build_offset(access.index_id, i));
				impl.add(chain_op);

				if (meta.non_uniform)
					builder.addDecoration(chain_op->id, spv::DecorationNonUniform);

				Operation *store_op = impl.allocate(spv::OpStore);
				store_op->add_id(chain_op->id);
				store_op->add_id(store_values[i]);
				impl.add(store_op);
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
				impl.add(op);
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

bool emit_atomic_binop_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	auto binop = static_cast<DXIL::AtomicBinOp>(
	    llvm::cast<llvm::ConstantInt>(instruction->getOperand(2))->getUniqueInteger().getZExtValue());

	spv::Id coords[3] = {};
	uint32_t num_coords_full = 0, num_coords = 0;

	auto width = get_buffer_access_bits_per_component(impl, meta.storage, instruction->getType());
	if (width == RawWidth::B64)
		builder.addCapability(spv::CapabilityInt64Atomics);
	spv::Id var_id = get_buffer_alias_handle(impl, meta, meta.var_id, width, RawVecSize::V1);

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

	Operation *counter_ptr_op = nullptr;
	DXIL::ComponentType component_type = raw_width_to_component_type(width);
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

	if (meta.non_uniform)
		builder.addDecoration(counter_ptr_op->id, spv::DecorationNonUniformEXT);

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
	op->add_ids({
	    counter_ptr_op->id,
	    builder.makeUintConstant(spv::ScopeDevice),
	    builder.makeUintConstant(0), // Relaxed
	    impl.fixup_store_type_atomic(component_type, 1, impl.get_id_for_value(instruction->getOperand(6))),
	});

	impl.add(op);
	impl.fixup_load_type_atomic(component_type, 1, instruction);
	return true;
}

bool emit_atomic_cmpxchg_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	spv::Id coords[3] = {};
	uint32_t num_coords_full = 0, num_coords = 0;

	auto width = get_buffer_access_bits_per_component(impl, meta.storage, instruction->getType());
	spv::Id var_id = get_buffer_alias_handle(impl, meta, meta.var_id, width, RawVecSize::V1);
	if (width == RawWidth::B64)
		builder.addCapability(spv::CapabilityInt64Atomics);

	if (meta.kind == DXIL::ResourceKind::StructuredBuffer || meta.kind == DXIL::ResourceKind::RawBuffer ||
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

	Operation *counter_ptr_op = nullptr;
	DXIL::ComponentType component_type = raw_width_to_component_type(width);
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

	if (meta.non_uniform)
		builder.addDecoration(counter_ptr_op->id, spv::DecorationNonUniformEXT);

	Operation *op =
	    impl.allocate(spv::OpAtomicCompareExchange, instruction, impl.get_type_id(component_type, 1, 1));

	spv::Id comparison_id = impl.get_id_for_value(instruction->getOperand(5));
	spv::Id new_value_id = impl.get_id_for_value(instruction->getOperand(6));
	comparison_id = impl.fixup_store_type_atomic(component_type, 1, comparison_id);
	new_value_id = impl.fixup_store_type_atomic(component_type, 1, new_value_id);

	op->add_ids({
	    counter_ptr_op->id,
	    builder.makeUintConstant(spv::ScopeDevice),
	    builder.makeUintConstant(0), // Relaxed
	    builder.makeUintConstant(0), // Relaxed
	    new_value_id,
	    comparison_id,
	});

	impl.add(op);
	impl.fixup_load_type_atomic(component_type, 1, instruction);
	return true;
}

bool emit_buffer_update_counter_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	spv::Id image_id = impl.get_id_for_value(instruction->getOperand(1));
	const auto &meta = impl.handle_to_resource_meta[image_id];
	int direction = llvm::cast<llvm::ConstantInt>(instruction->getOperand(2))->getUniqueInteger().getSExtValue();

	Operation *counter_ptr_op;

	if (meta.counter_is_physical_pointer)
	{
		counter_ptr_op = impl.allocate(
		    spv::OpAccessChain, builder.makePointer(spv::StorageClassPhysicalStorageBuffer, builder.makeUintType(32)));
		counter_ptr_op->add_id(meta.counter_var_id);
		counter_ptr_op->add_id(builder.makeUintConstant(0));
	}
	else
	{
		counter_ptr_op = impl.allocate(spv::OpImageTexelPointer,
		                               builder.makePointer(spv::StorageClassImage, builder.makeUintType(32)));
		counter_ptr_op->add_ids({ meta.counter_var_id, builder.makeUintConstant(0), builder.makeUintConstant(0) });

		if (meta.non_uniform)
			builder.addDecoration(counter_ptr_op->id, spv::DecorationNonUniformEXT);
	}

	impl.add(counter_ptr_op);

	Operation *op = impl.allocate(spv::OpAtomicIAdd, instruction);
	op->add_ids({ counter_ptr_op->id, builder.makeUintConstant(spv::ScopeDevice),
	              builder.makeUintConstant(0), // Relaxed.
	              builder.makeUintConstant(direction) });

	impl.add(op);

	if (direction < 0)
	{
		spv::Id result_id = op->id;
		op = impl.allocate(spv::OpISub, builder.makeUintType(32));
		op->add_ids({ result_id, builder.makeUintConstant(1) });
		impl.add(op);
		impl.rewrite_value(instruction, op->id);
	}

	return true;
}

} // namespace dxil_spv
