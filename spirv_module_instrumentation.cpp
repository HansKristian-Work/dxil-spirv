/* Copyright (c) 2025 Hans-Kristian Arntzen for Valve Corporation
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

#include "spirv_module.hpp"
#include "SpvBuilder.h"
#include "GLSL.std.450.h"

namespace dxil_spv
{
static spv::Id build_instrumentation_ssbo(SPIRVModule &module, spv::Id data_type, uint32_t stride, const char *member_name,
                                          const char *block_name, const char *variable_name,
                                          uint32_t desc_set, uint32_t binding)
{
	auto &builder = module.get_builder();

	spv::Id data_array_type = builder.makeRuntimeArray(data_type);
	builder.addDecoration(data_array_type, spv::DecorationArrayStride, stride);
	spv::Id block_type = builder.makeStructType({ data_array_type }, block_name);
	builder.addMemberName(block_type, 0, member_name);
	builder.addMemberDecoration(block_type, 0, spv::DecorationOffset, 0);
	builder.addDecoration(block_type, spv::DecorationBlock);

	spv::Id var_id = module.create_variable(spv::StorageClassStorageBuffer, block_type, variable_name);
	builder.addDecoration(var_id, spv::DecorationDescriptorSet, desc_set);
	builder.addDecoration(var_id, spv::DecorationBinding, binding);
	return var_id;
}

static spv::Id build_u64_add_u32(spv::Builder &builder, spv::Id a, spv::Id b)
{
	spv::Id u32_type = builder.makeUintType(32);
	auto *extract_lo = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	extract_lo->addIdOperand(a);
	extract_lo->addImmediateOperand(0);
	auto *extract_hi = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	extract_hi->addIdOperand(a);
	extract_hi->addImmediateOperand(1);

	spv::Id struct_type = builder.makeStructType({ u32_type, u32_type }, "IAddCarryResult");
	auto *add_carry = builder.addInstruction(struct_type, spv::OpIAddCarry);
	add_carry->addIdOperand(extract_lo->getResultId());
	add_carry->addIdOperand(b);

	auto *extract_carry_lo = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	extract_carry_lo->addIdOperand(add_carry->getResultId());
	extract_carry_lo->addImmediateOperand(0);

	auto *extract_carry = builder.addInstruction(u32_type, spv::OpCompositeExtract);
	extract_carry->addIdOperand(add_carry->getResultId());
	extract_carry->addImmediateOperand(1);

	auto *add_hi = builder.addInstruction(u32_type, spv::OpIAdd);
	add_hi->addIdOperand(extract_hi->getResultId());
	add_hi->addIdOperand(extract_carry->getResultId());

	spv::Id uvec2_type = builder.makeVectorType(u32_type, 2);
	auto *combine = builder.addInstruction(uvec2_type, spv::OpCompositeConstruct);
	combine->addIdOperand(extract_carry_lo->getResultId());
	combine->addIdOperand(add_hi->getResultId());

	return combine->getResultId();
}

static spv::Id build_byte_mask(spv::Builder &builder, spv::Id addr_lo_id, spv::Id byte_count)
{
	spv::Id u32_type = builder.makeUintType(32);
	auto *extract = builder.addInstruction(u32_type, spv::OpBitFieldUExtract);
	auto *and_op = builder.addInstruction(u32_type, spv::OpBitwiseAnd);
	auto *shift_op = builder.addInstruction(u32_type, spv::OpShiftLeftLogical);
	auto *and2_op = builder.addInstruction(u32_type, spv::OpBitwiseAnd);

	extract->addIdOperand(builder.makeUintConstant(~0u));
	extract->addIdOperand(builder.makeUintConstant(0u));
	extract->addIdOperand(byte_count);
	and_op->addIdOperand(addr_lo_id);
	and_op->addIdOperand(builder.makeUintConstant(15));
	shift_op->addIdOperand(extract->getResultId());
	shift_op->addIdOperand(and_op->getResultId());
	and2_op->addIdOperand(shift_op->getResultId());
	and2_op->addIdOperand(builder.makeUintConstant(0xffff));

	return and2_op->getResultId();
}

static spv::Id build_word_mask(spv::Builder &builder, spv::Id addr_lo_id, spv::Id byte_count)
{
	spv::Id u32_type = builder.makeUintType(32);

	auto *mask_op = builder.addInstruction(u32_type, spv::OpBitwiseAnd);
	auto *add_op = builder.addInstruction(u32_type, spv::OpIAdd);
	auto *add3_op = builder.addInstruction(u32_type, spv::OpIAdd);
	auto *slr2 = builder.addInstruction(u32_type, spv::OpShiftRightLogical);
	auto *extract_shift = builder.addInstruction(u32_type, spv::OpBitFieldUExtract);
	auto *extract = builder.addInstruction(u32_type, spv::OpBitFieldUExtract);
	auto *shifted = builder.addInstruction(u32_type, spv::OpShiftLeftLogical);
	auto *final_mask = builder.addInstruction(u32_type, spv::OpBitwiseAnd);

	mask_op->addIdOperand(addr_lo_id);
	mask_op->addIdOperand(builder.makeUintConstant(3));
	add_op->addIdOperand(mask_op->getResultId());
	add_op->addIdOperand(byte_count);
	add3_op->addIdOperand(add_op->getResultId());
	add3_op->addIdOperand(builder.makeUintConstant(3));
	slr2->addIdOperand(add3_op->getResultId());
	slr2->addIdOperand(builder.makeUintConstant(2));

	extract_shift->addIdOperand(addr_lo_id);
	extract_shift->addIdOperand(builder.makeUintConstant(2));
	extract_shift->addIdOperand(builder.makeUintConstant(2));

	extract->addIdOperand(builder.makeUintConstant(~0u));
	extract->addIdOperand(builder.makeUintConstant(0));
	extract->addIdOperand(slr2->getResultId());

	shifted->addIdOperand(extract->getResultId());
	shifted->addIdOperand(extract_shift->getResultId());

	final_mask->addIdOperand(shifted->getResultId());
	final_mask->addIdOperand(builder.makeUintConstant(0xf));

	return final_mask->getResultId();
}

static spv::Id build_hash_call(SPIRVModule &module)
{
	auto &builder = module.get_builder();

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);

	auto *func =
	    builder.makeFunctionEntry(spv::NoPrecision, uint_type, "AddrHash", { uvec2_type, uint_type }, {}, &entry);

	builder.addName(func->getParamId(0), "addr");
	builder.addName(func->getParamId(1), "prime");

	auto *extract0 = builder.addInstruction(uint_type, spv::OpCompositeExtract);
	auto *extract1 = builder.addInstruction(uint_type, spv::OpCompositeExtract);
	auto *shift_lo = builder.addInstruction(uint_type, spv::OpShiftRightLogical);
	auto *mask_hi = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
	auto *construct = builder.addInstruction(uvec2_type, spv::OpCompositeConstruct);
	auto *splat = builder.addInstruction(uvec2_type, spv::OpCompositeConstruct);

	extract0->addIdOperand(func->getParamId(0));
	extract0->addImmediateOperand(0);
	extract1->addIdOperand(func->getParamId(0));
	extract1->addImmediateOperand(1);

	shift_lo->addIdOperand(extract0->getResultId());
	shift_lo->addIdOperand(builder.makeUintConstant(4));
	mask_hi->addIdOperand(extract1->getResultId());
	mask_hi->addIdOperand(builder.makeUintConstant(0xffff));

	construct->addIdOperand(shift_lo->getResultId());
	construct->addIdOperand(mask_hi->getResultId());

	splat->addIdOperand(func->getParamId(1));
	splat->addIdOperand(func->getParamId(1));

	spv::Id ret_id = construct->getResultId();
	spv::Id splat_id = splat->getResultId();

	spv::Id const8 = builder.makeUintConstant(8);
	spv::Id const8_splat = builder.makeCompositeConstant(uvec2_type, { const8, const8 });

	for (int i = 0; i < 6; i++)
	{
		auto *shuffle = builder.addInstruction(uvec2_type, spv::OpVectorShuffle);
		shuffle->addIdOperand(ret_id);
		shuffle->addIdOperand(ret_id);
		shuffle->addImmediateOperand(1);
		shuffle->addImmediateOperand(0);

		auto *shifted = builder.addInstruction(uvec2_type, spv::OpShiftRightLogical);
		shifted->addIdOperand(ret_id);
		shifted->addIdOperand(const8_splat);

		auto *xor_op = builder.addInstruction(uvec2_type, spv::OpBitwiseXor);
		xor_op->addIdOperand(shifted->getResultId());
		xor_op->addIdOperand(shuffle->getResultId());

		auto *mult = builder.addInstruction(uvec2_type, spv::OpIMul);
		mult->addIdOperand(xor_op->getResultId());
		mult->addIdOperand(splat_id);

		ret_id = mult->getResultId();
	}

	auto *extract = builder.addInstruction(uint_type, spv::OpCompositeExtract);
	extract->addIdOperand(ret_id);
	extract->addImmediateOperand(0);
	ret_id = extract->getResultId();

	builder.makeReturn(false, ret_id);
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

static spv::Id build_hash_mask(spv::Builder &builder, spv::Id var_id)
{
	auto *len = builder.addInstruction(builder.makeUintType(32), spv::OpArrayLength);
	auto *find_msb = builder.addInstruction(builder.makeUintType(32), spv::OpExtInst);
	auto *extract = builder.addInstruction(builder.makeUintType(32), spv::OpBitFieldUExtract);

	spv::Id glsl = builder.import("GLSL.std.450");

	len->addIdOperand(var_id);
	len->addImmediateOperand(0);

	find_msb->addIdOperand(glsl);
	find_msb->addImmediateOperand(GLSLstd450FindUMsb);
	find_msb->addIdOperand(len->getResultId());

	extract->addIdOperand(builder.makeUintConstant(~0u));
	extract->addIdOperand(builder.makeUintConstant(0));
	extract->addIdOperand(find_msb->getResultId());

	return extract->getResultId();
}

static spv::Id build_hash_offset(spv::Builder &builder, spv::Id var_id)
{
	auto *len = builder.addInstruction(builder.makeUintType(32), spv::OpArrayLength);
	auto *find_msb = builder.addInstruction(builder.makeUintType(32), spv::OpExtInst);
	auto *extract = builder.addInstruction(builder.makeUintType(32), spv::OpBitFieldUExtract);
    auto *extract_minus_1 = builder.addInstruction(builder.makeUintType(32), spv::OpISub);

	spv::Id glsl = builder.import("GLSL.std.450");

	len->addIdOperand(var_id);
	len->addImmediateOperand(0);

	find_msb->addIdOperand(glsl);
	find_msb->addImmediateOperand(GLSLstd450FindUMsb);
	find_msb->addIdOperand(len->getResultId());

	extract->addIdOperand(len->getResultId());
	extract->addIdOperand(builder.makeUintConstant(0));
	extract->addIdOperand(find_msb->getResultId());

    extract_minus_1->addIdOperand(extract->getResultId());
    extract_minus_1->addIdOperand(builder.makeUintConstant(1));

    return extract_minus_1->getResultId();
}

static spv::Id build_get_invalidation_mask(spv::Builder &builder, spv::Id id, spv::Id byte_mask_id, spv::Id word_mask_id)
{
	static const uint64_t invalidation_masks[] = {
		0x0fffff0000, // Load -> store and atomics no longer valid
		0xffffffffff, // Store -> nothing is valid
		0xf0ffffffff, // AtomicRMW -> only atomics are valid
		0x0fffff0000, // IndirectRead -> same as load
	};

    spv::Id u32_type = builder.makeUintType(32);
	spv::Id u64_type = builder.makeUintType(64);
	spv::Id u64vec4_type = builder.makeVectorType(u64_type, 4);
	Vector<spv::Id> invalidation_mask_elems;
	invalidation_mask_elems.reserve(4);
	for (auto &mask : invalidation_masks)
		invalidation_mask_elems.push_back(builder.makeUint64Constant(mask));
	spv::Id invalidation_table = builder.makeCompositeConstant(u64vec4_type, invalidation_mask_elems);

	auto *extract = builder.addInstruction(u64_type, spv::OpVectorExtractDynamic);
	extract->addIdOperand(invalidation_table);
	extract->addIdOperand(id);

    auto *byte_mask_shift = builder.addInstruction(u32_type, spv::OpShiftLeftLogical);
    auto *word_mask_shift = builder.addInstruction(u32_type, spv::OpShiftLeftLogical);
    byte_mask_shift->addIdOperand(byte_mask_id);
    byte_mask_shift->addIdOperand(builder.makeUintConstant(16));
    word_mask_shift->addIdOperand(word_mask_id);
    word_mask_shift->addIdOperand(builder.makeUintConstant(4));

    auto *byte_mask_or = builder.addInstruction(u32_type, spv::OpBitwiseOr);
    auto *word_mask_or = builder.addInstruction(u32_type, spv::OpBitwiseOr);
    byte_mask_or->addIdOperand(byte_mask_id);
    byte_mask_or->addIdOperand(byte_mask_shift->getResultId());
    word_mask_or->addIdOperand(word_mask_id);
    word_mask_or->addIdOperand(word_mask_shift->getResultId());

    auto *composite = builder.addInstruction(builder.makeVectorType(u32_type, 2), spv::OpCompositeConstruct);
    composite->addIdOperand(byte_mask_or->getResultId());
    composite->addIdOperand(word_mask_or->getResultId());

    auto *bitcast = builder.addInstruction(u64_type, spv::OpBitcast);
    bitcast->addIdOperand(composite->getResultId());

    auto *mask = builder.addInstruction(u64_type, spv::OpBitwiseAnd);
    mask->addIdOperand(extract->getResultId());
    mask->addIdOperand(bitcast->getResultId());

	builder.addName(mask->getResultId(), "invalidation_mask");

	return mask->getResultId();
}

static spv::Id build_takes_exclusive_ownership(spv::Builder &builder, spv::Id atomic_result, spv::Id byte_mask)
{
	auto *shift = builder.addInstruction(builder.makeUintType(32), spv::OpShiftRightLogical);
	shift->addIdOperand(atomic_result);
	shift->addIdOperand(builder.makeUintConstant(16));

	auto *and_op = builder.addInstruction(builder.makeUintType(32), spv::OpBitwiseAnd);
	and_op->addIdOperand(shift->getResultId());
	and_op->addIdOperand(byte_mask);

	auto *cmp = builder.addInstruction(builder.makeBoolType(), spv::OpIEqual);
	cmp->addIdOperand(and_op->getResultId());
	cmp->addIdOperand(builder.makeUintConstant(0));

	return cmp->getResultId();
}

spv::Id build_allocate_invocation_id_function(SPIRVModule &module, uint32_t desc_set, uint32_t binding)
{
	auto &builder = module.get_builder();
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);

	spv::Id bloom_var_id = build_instrumentation_ssbo(
		module, uint_type, 4, "atomics", "BloomBufferInvocationSSBO", "BloomBufferInvocation", desc_set, binding);

	auto *func = builder.makeFunctionEntry(spv::NoPrecision, uint_type, "AllocateInvocationID",
	                                       {}, {}, &entry);

	auto *len = builder.addInstruction(uint_type, spv::OpArrayLength);
	len->addIdOperand(bloom_var_id);
	len->addImmediateOperand(0);

	auto *len_minus_1 = builder.addInstruction(uint_type, spv::OpISub);
	len_minus_1->addIdOperand(len->getResultId());
	len_minus_1->addIdOperand(builder.makeUintConstant(1));

	auto *chain = builder.addInstruction(builder.makePointer(spv::StorageClassStorageBuffer, uint_type), spv::OpAccessChain);
	chain->addIdOperand(bloom_var_id);
	chain->addIdOperand(builder.makeUintConstant(0));
	chain->addIdOperand(len_minus_1->getResultId());

	auto *atomic_add = builder.addInstruction(uint_type, spv::OpAtomicIAdd);
	atomic_add->addIdOperand(chain->getResultId());
	atomic_add->addIdOperand(builder.getAtomicDeviceScopeId());
	atomic_add->addIdOperand(builder.makeUintConstant(0));
	atomic_add->addIdOperand(builder.makeUintConstant(1103633207u));

	builder.makeReturn(false, atomic_add->getResultId());
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

spv::Id build_validate_bda_load_store_function(SPIRVModule &module, uint32_t desc_set, uint32_t binding)
{
	auto &builder = module.get_builder();

	spv::Id hash_call_id = build_hash_call(module);

	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id uint_type = builder.makeUintType(32);
	spv::Id u64_type = builder.makeUintType(64);
	spv::Id uvec2_type = builder.makeVectorType(uint_type, 2);
	spv::Id bool_type = builder.makeBoolType();

	spv::Id bloom_var_id_64 = build_instrumentation_ssbo(
		module, u64_type, 8, "atomics", "BloomBufferSSBO", "BloomBuffer", desc_set, binding);
	spv::Id bloom_var_id_32 = build_instrumentation_ssbo(
		module, uvec2_type, 8, "atomics", "BloomBuffer32SSBO", "BloomBuffer32", desc_set, binding);

	auto *func = builder.makeFunctionEntry(spv::NoPrecision, bool_type, "ValidateBDALoadStore",
	                                       { uvec2_type, uint_type, uint_type, uint_type, uint_type, bool_type }, {}, &entry);

	builder.addName(func->getParamId(0), "BDA");
	builder.addName(func->getParamId(1), "offset");
	builder.addName(func->getParamId(2), "len");
	builder.addName(func->getParamId(3), "type");
	builder.addName(func->getParamId(4), "invocation_id");
	builder.addName(func->getParamId(5), "in_bounds");
	builder.setBuildPoint(entry);

	auto *early_return_block = new spv::Block(builder.getUniqueId(), *func);
	auto *body = new spv::Block(builder.getUniqueId(), *func);

	builder.createSelectionMerge(body, 0);
	builder.createConditionalBranch(func->getParamId(5), body, early_return_block);
	builder.setBuildPoint(early_return_block);
	builder.makeReturn(false, builder.makeBoolConstant(true));
	builder.setBuildPoint(body);

	spv::Id addr_id = build_u64_add_u32(builder, func->getParamId(0), func->getParamId(1));
	builder.addName(addr_id, "addr");
	spv::Id addr_lo_id;

	auto *extract_lo = builder.addInstruction(uint_type, spv::OpCompositeExtract);
	extract_lo->addIdOperand(addr_id);
	extract_lo->addImmediateOperand(0);
	addr_lo_id = extract_lo->getResultId();
	builder.addName(addr_lo_id, "addr_lo");

	spv::Id byte_mask_id = build_byte_mask(builder, addr_lo_id, func->getParamId(2));
	spv::Id word_mask_id = build_word_mask(builder, addr_lo_id, func->getParamId(2));
	builder.addName(byte_mask_id, "byte_mask");
	builder.addName(word_mask_id, "word_mask");

	spv::Id hash_mask = build_hash_mask(builder, bloom_var_id_64);
	spv::Id hash_offset = build_hash_offset(builder, bloom_var_id_64);
	builder.addName(hash_mask, "hash_mask");
	builder.addName(hash_offset, "hash_offset");

    constexpr int NumHashes = 16;
    constexpr int NumLockHashes = 8;
    static_assert(NumLockHashes <= NumHashes, "Lock hashes must be less or equal.");
	spv::Id hashes[NumHashes];

	for (int i = 0; i < NumHashes; i++)
	{
        // Just pick random primes.
		static const uint32_t noise_primes[NumHashes] = {
			1103515245u,
			1103518333u,
			1103539331u,
			1103633207u,
			10006121u,
			4004951u,
			5005159u,
			6004811u,
            383u,
            821u,
            661u,
            1091u,
            1117u,
            3947u,
            4253u,
            7691u,
		};

		auto *call = builder.addInstruction(uint_type, spv::OpFunctionCall);
		call->addIdOperand(hash_call_id);
		call->addIdOperand(addr_id);
		call->addIdOperand(builder.makeUintConstant(noise_primes[i]));

		auto *mask = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
		mask->addIdOperand(call->getResultId());
		mask->addIdOperand(hash_mask);

		auto *add_offset = builder.addInstruction(uint_type, spv::OpIAdd);
		add_offset->addIdOperand(mask->getResultId());
		add_offset->addIdOperand(hash_offset);

		hashes[i] = add_offset->getResultId();
		builder.addName(hashes[i], "bloom_index");
	}

	spv::Id invalidation_mask = build_get_invalidation_mask(builder, func->getParamId(3), byte_mask_id, word_mask_id);

	spv::Id atomic_result = 0;
	for (auto hash : hashes)
	{
		auto *chain = builder.addInstruction(builder.makePointer(spv::StorageClassStorageBuffer, u64_type),
		                                     spv::OpInBoundsAccessChain);
		chain->addIdOperand(bloom_var_id_64);
		chain->addIdOperand(builder.makeUintConstant(0));
		chain->addIdOperand(hash);

		auto *atom = builder.addInstruction(u64_type, spv::OpAtomicOr);
		atom->addIdOperand(chain->getResultId());
		atom->addIdOperand(builder.getAtomicDeviceScopeId());
		atom->addIdOperand(builder.makeUintConstant(0)); // Relaxed
		atom->addIdOperand(invalidation_mask);

		builder.addName(atom->getResultId(), "prev_hazard_partial");

		if (atomic_result == 0)
		{
			atomic_result = atom->getResultId();
		}
		else
		{
			auto *and_op = builder.addInstruction(u64_type, spv::OpBitwiseAnd);
			and_op->addIdOperand(atomic_result);
			and_op->addIdOperand(atom->getResultId());
			atomic_result = and_op->getResultId();
		}

		builder.addCapability(spv::CapabilityInt64Atomics);
	}

	auto *atomic_result_uvec2 = builder.addInstruction(uvec2_type, spv::OpBitcast);
	atomic_result_uvec2->addIdOperand(atomic_result);
	builder.addName(atomic_result_uvec2->getResultId(), "prev_hazard");

	auto *atomic_result_lo = builder.addInstruction(uint_type, spv::OpCompositeExtract);
	atomic_result_lo->addIdOperand(atomic_result_uvec2->getResultId());
	atomic_result_lo->addImmediateOperand(0);
	builder.addName(atomic_result_lo->getResultId(), "prev_hazard_lo");

	auto *atomic_result_hi = builder.addInstruction(uint_type, spv::OpCompositeExtract);
	atomic_result_hi->addIdOperand(atomic_result_uvec2->getResultId());
	atomic_result_hi->addImmediateOperand(1);
	builder.addName(atomic_result_hi->getResultId(), "prev_hazard_hi");

	// Compute if we took ownership of this byte region. If that's the case then we have zero write hazard overlap.
	// Every memory access marks STORE as a hazard.
	spv::Id has_exclusive = build_takes_exclusive_ownership(builder, atomic_result_lo->getResultId(), byte_mask_id);
	builder.addName(has_exclusive, "has_exclusive_access");

	spv::Id has_complete_self_lock = 0;

	for (int i = 0; i < NumLockHashes; i++)
	{
		int base_bit;

		if (i < 4)
			base_bit = std::min<int>(9 * i, 23);
		else
			base_bit = std::min<int>(8 * (i & 3) + 1, 22);

		spv::Id lock_mask_id = 0;

		for (int j = 0; j < 3; j++)
		{
			// Generate the invocation lock mask. We will set 12 bits in total across 96 available bits.
			auto *extract = builder.addInstruction(uint_type, spv::OpBitFieldUExtract);
			extract->addIdOperand(func->getParamId(4));
			extract->addIdOperand(builder.makeIntConstant(base_bit + 3 * j));
			extract->addIdOperand(builder.makeIntConstant(3));

			auto *shift = builder.addInstruction(uint_type, spv::OpShiftLeftLogical);
			shift->addIdOperand(builder.makeUintConstant(1u << (8 + 8 * j)));
			shift->addIdOperand(extract->getResultId());

			if (lock_mask_id == 0)
			{
				lock_mask_id = shift->getResultId();
			}
			else
			{
				auto *or_op = builder.addInstruction(uint_type, spv::OpBitwiseOr);
				or_op->addIdOperand(lock_mask_id);
				or_op->addIdOperand(shift->getResultId());
				lock_mask_id = or_op->getResultId();
			}
		}

		builder.addName(lock_mask_id, "lock_mask");

		auto *sel = builder.addInstruction(uint_type, spv::OpSelect);
		sel->addIdOperand(has_exclusive);
		sel->addIdOperand(lock_mask_id);
		sel->addIdOperand(builder.makeUintConstant(0));

		auto *chain = builder.addInstruction(builder.makePointer(spv::StorageClassStorageBuffer, uint_type),
		                                     spv::OpInBoundsAccessChain);
		chain->addIdOperand(bloom_var_id_32);
		chain->addIdOperand(builder.makeUintConstant(0));
		chain->addIdOperand(hashes[i]);
		chain->addIdOperand(builder.makeUintConstant(1));

		auto *atom = builder.addInstruction(uint_type, spv::OpAtomicOr);
		atom->addIdOperand(chain->getResultId());
		atom->addIdOperand(builder.getAtomicDeviceScopeId());
		atom->addIdOperand(builder.makeUintConstant(0));
		atom->addIdOperand(sel->getResultId());
		builder.addName(atom->getResultId(), "prev_lock");

		spv::Id lock_feedback = atom->getResultId();

		auto *and_op = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
		and_op->addIdOperand(lock_feedback);
		and_op->addIdOperand(lock_mask_id);

		auto *eq_op = builder.addInstruction(bool_type, spv::OpIEqual);
		eq_op->addIdOperand(and_op->getResultId());
		eq_op->addIdOperand(lock_mask_id);

		if (has_complete_self_lock == 0)
		{
			has_complete_self_lock = eq_op->getResultId();
		}
		else
		{
			auto *logical_and = builder.addInstruction(bool_type, spv::OpLogicalAnd);
			logical_and->addIdOperand(has_complete_self_lock);
			logical_and->addIdOperand(eq_op->getResultId());
			has_complete_self_lock = logical_and->getResultId();
		}
	}

	builder.addName(has_complete_self_lock, "has_complete_self_lock");

	Vector<spv::Block *> segments;
	// The AST-based builder is a bit awkward to use in this context ...
	builder.makeSwitch(func->getParamId(3), 0, 4, { 0, 1, 2 }, { 0, 1, 2 }, 3, segments);
	builder.endSwitch(segments);
	auto *merge = builder.getBuildPoint();
	spv::Id hazards[4];

	builder.setBuildPoint(segments[int(BDAOperation::Load)]);
	{
		auto *mask = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
		auto *neq = builder.addInstruction(bool_type, spv::OpINotEqual);
		mask->addIdOperand(atomic_result_lo->getResultId());
		mask->addIdOperand(byte_mask_id);
		neq->addIdOperand(mask->getResultId());
		neq->addIdOperand(builder.makeUintConstant(0));
		hazards[int(BDAOperation::Load)] = neq->getResultId();
		builder.createBranch(merge);
	}

	builder.setBuildPoint(segments[int(BDAOperation::Store)]);
	{
		auto *shift = builder.addInstruction(uint_type, spv::OpShiftLeftLogical);
		shift->addIdOperand(byte_mask_id);
		shift->addIdOperand(builder.makeUintConstant(16));
		auto *mask = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
		auto *neq = builder.addInstruction(bool_type, spv::OpINotEqual);
		mask->addIdOperand(atomic_result_lo->getResultId());
		mask->addIdOperand(shift->getResultId());
		neq->addIdOperand(mask->getResultId());
		neq->addIdOperand(builder.makeUintConstant(0));
		hazards[int(BDAOperation::Store)] = neq->getResultId();
		builder.createBranch(merge);
	}

	builder.setBuildPoint(segments[int(BDAOperation::AtomicRMW)]);
	{
		auto *mask = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
		auto *neq = builder.addInstruction(bool_type, spv::OpINotEqual);
		mask->addIdOperand(atomic_result_hi->getResultId());
		mask->addIdOperand(word_mask_id);
		neq->addIdOperand(mask->getResultId());
		neq->addIdOperand(builder.makeUintConstant(0));
		hazards[int(BDAOperation::AtomicRMW)] = neq->getResultId();
		builder.createBranch(merge);
	}

	builder.setBuildPoint(segments[int(BDAOperation::IndirectRead)]);
	{
		auto *shift = builder.addInstruction(uint_type, spv::OpShiftLeftLogical);
		shift->addIdOperand(word_mask_id);
		shift->addIdOperand(builder.makeUintConstant(4));
		auto *mask = builder.addInstruction(uint_type, spv::OpBitwiseAnd);
		auto *neq = builder.addInstruction(bool_type, spv::OpINotEqual);
		mask->addIdOperand(atomic_result_hi->getResultId());
		mask->addIdOperand(shift->getResultId());
		neq->addIdOperand(mask->getResultId());
		neq->addIdOperand(builder.makeUintConstant(0));
		hazards[int(BDAOperation::IndirectRead)] = neq->getResultId();
		builder.createBranch(merge);
	}

	builder.setBuildPoint(merge);

	auto *hazard_phi = builder.addInstruction(bool_type, spv::OpPhi);
	for (int i = 0; i < 4; i++)
	{
		hazard_phi->addIdOperand(hazards[i]);
		hazard_phi->addIdOperand(segments[i]->getId());
	}
	builder.addName(hazard_phi->getResultId(), "hazard");

	auto *inv_hazard = builder.addInstruction(bool_type, spv::OpLogicalNot);
	inv_hazard->addIdOperand(hazard_phi->getResultId());

	// Compute self-hazard.
	auto *ret = builder.addInstruction(bool_type, spv::OpLogicalOr);
	ret->addIdOperand(inv_hazard->getResultId());
	ret->addIdOperand(has_complete_self_lock);

	builder.makeReturn(false, ret->getResultId());
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

void emit_instrumentation_hash(SPIRVModule &module, const InstructionInstrumentationState &instrumentation,
                               spv::Function *func, spv::Id value_id, spv::Id instruction_id)
{
	auto &builder = module.get_builder();
	auto *write_payload_path = new spv::Block(builder.getUniqueId(), *func);
	auto *merge_payload_path = new spv::Block(builder.getUniqueId(), *func);

	spv::Id u32_type = builder.makeUintType(32);
	spv::Id bool_type = builder.makeBoolType();
	auto *prime_mul = builder.addInstruction(u32_type, spv::OpIMul);
	auto *hash = builder.addInstruction(u32_type, spv::OpBitwiseXor);

	prime_mul->addIdOperand(instruction_id);
	prime_mul->addIdOperand(builder.makeUintConstant(97)); // Arbitrary prime number

	hash->addIdOperand(prime_mul->getResultId());
	auto shader_hash = instrumentation.info.shader_hash;
	hash->addIdOperand(builder.makeUintConstant(uint32_t(shader_hash) ^ uint32_t(shader_hash >> 32)));

	if (!value_id)
	{
		// For AssumeTrue instrumentation, we're more interested in the dispatch ID.
		// We've reserved space for it in the second last u32 of the control buffer.
		auto *len = builder.addInstruction(u32_type, spv::OpArrayLength);
		len->addIdOperand(instrumentation.global_nan_inf_control_var_id);
		len->addImmediateOperand(0);

		auto *len_minus_2 = builder.addInstruction(u32_type, spv::OpISub);
		len_minus_2->addIdOperand(len->getResultId());
		len_minus_2->addIdOperand(builder.makeUintConstant(2));

		auto *cookie_chain = builder.addInstruction(
		    builder.makePointer(spv::StorageClassStorageBuffer, u32_type), spv::OpAccessChain);
		cookie_chain->addIdOperand(instrumentation.global_nan_inf_control_var_id);
		cookie_chain->addIdOperand(builder.makeUintConstant(0));
		cookie_chain->addIdOperand(len_minus_2->getResultId());

		auto *load = builder.addInstruction(u32_type, spv::OpLoad);
		load->addIdOperand(cookie_chain->getResultId());
		value_id = load->getResultId();

		auto *mul = builder.addInstruction(u32_type, spv::OpIMul);
		mul->addIdOperand(value_id);
		mul->addIdOperand(builder.makeUintConstant(51329u));

		// Allow each dispatch to report their own faults.
		auto *ext_hash = builder.addInstruction(u32_type, spv::OpBitwiseXor);
		ext_hash->addIdOperand(hash->getResultId());
		ext_hash->addIdOperand(mul->getResultId());

		hash = ext_hash;
	}

	auto *payload_size = builder.addInstruction(u32_type, spv::OpArrayLength);
	auto *sub_1 = builder.addInstruction(u32_type, spv::OpISub);
	auto *mask = builder.addInstruction(u32_type, spv::OpBitwiseAnd);
	auto *control_word = builder.addInstruction(u32_type, spv::OpShiftRightLogical);
	auto *control_bit = builder.addInstruction(u32_type, spv::OpBitwiseAnd);
	auto *control_mask = builder.addInstruction(u32_type, spv::OpShiftLeftLogical);
	auto *access_chain = builder.addInstruction(
	    builder.makePointer(spv::StorageClassStorageBuffer, u32_type),
	    spv::OpAccessChain);
	auto *atomic_or = builder.addInstruction(u32_type, spv::OpAtomicOr);
	auto *atomic_result_mask = builder.addInstruction(u32_type, spv::OpBitwiseAnd);
	auto *atomic_need_write = builder.addInstruction(bool_type, spv::OpIEqual);
	auto *store_op = builder.addInstruction(spv::OpStore);

	payload_size->addIdOperand(instrumentation.global_nan_inf_data_var_id);
	payload_size->addImmediateOperand(0);
	sub_1->addIdOperand(payload_size->getResultId());
	sub_1->addIdOperand(builder.makeUintConstant(1));
	mask->addIdOperand(hash->getResultId());
	mask->addIdOperand(sub_1->getResultId());
	spv::Id mask_id = mask->getResultId();

	control_word->addIdOperand(mask->getResultId());
	control_word->addIdOperand(builder.makeUintConstant(4));
	control_bit->addIdOperand(mask->getResultId());
	control_bit->addIdOperand(builder.makeUintConstant(15));
	control_mask->addIdOperand(builder.makeUintConstant(1));
	control_mask->addIdOperand(control_bit->getResultId());

	access_chain->addIdOperand(instrumentation.global_nan_inf_control_var_id);
	access_chain->addIdOperand(builder.makeUintConstant(0));
	access_chain->addIdOperand(control_word->getResultId());

	atomic_or->addIdOperand(access_chain->getResultId());
	atomic_or->addIdOperand(builder.getAtomicDeviceScopeId());
	atomic_or->addIdOperand(builder.makeUintConstant(0));
	atomic_or->addIdOperand(control_mask->getResultId());

	atomic_result_mask->addIdOperand(atomic_or->getResultId());
	atomic_result_mask->addIdOperand(control_mask->getResultId());
	atomic_need_write->addIdOperand(atomic_result_mask->getResultId());
	atomic_need_write->addIdOperand(builder.makeUintConstant(0));

	store_op->addIdOperand(instrumentation.should_report_instrumentation_id);
	store_op->addIdOperand(builder.makeBoolConstant(false));

	spv::Id cond_id = atomic_need_write->getResultId();
	spv::Id control_mask_id = control_mask->getResultId();
	spv::Id control_chain_id = access_chain->getResultId();

	builder.createSelectionMerge(merge_payload_path, 0);
	builder.createConditionalBranch(cond_id, write_payload_path, merge_payload_path);
	builder.setBuildPoint(write_payload_path);
	{
		spv::Id uvec4_type = builder.makeVectorType(u32_type, 4);

		auto *composite = builder.addInstruction(uvec4_type, spv::OpCompositeConstruct);
		auto *shift_16 = builder.addInstruction(u32_type, spv::OpShiftLeftLogical);
		access_chain = builder.addInstruction(
			builder.makePointer(spv::StorageClassStorageBuffer, uvec4_type),
			spv::OpAccessChain);
		store_op = builder.addInstruction(spv::OpStore);
		auto *barrier_op = builder.addInstruction(spv::OpMemoryBarrier);
		atomic_or = builder.addInstruction(u32_type, spv::OpAtomicOr);
		// Important this comes after the atomic or.
		auto *barrier_op2 = builder.addInstruction(spv::OpMemoryBarrier);

		composite->addIdOperand(builder.makeUintConstant(uint32_t(shader_hash >> 0)));
		composite->addIdOperand(builder.makeUintConstant(uint32_t(shader_hash >> 32)));
		composite->addIdOperand(func->getParamId(1));
		composite->addIdOperand(value_id);

		shift_16->addIdOperand(control_mask_id);
		shift_16->addIdOperand(builder.makeUintConstant(16));

		access_chain->addIdOperand(instrumentation.global_nan_inf_data_var_id);
		access_chain->addIdOperand(builder.makeUintConstant(0));
		access_chain->addIdOperand(mask_id);

		store_op->addIdOperand(access_chain->getResultId());
		store_op->addIdOperand(composite->getResultId());
		if (builder.hasCapability(spv::CapabilityVulkanMemoryModel))
			store_op->addImmediateOperand(spv::MemoryAccessNonPrivatePointerMask);

		barrier_op->addIdOperand(builder.getAtomicDeviceScopeId());
		barrier_op->addIdOperand(builder.makeUintConstant(spv::MemorySemanticsUniformMemoryMask |
		                                                  spv::MemorySemanticsAcquireReleaseMask));
		barrier_op2->addIdOperand(builder.getAtomicDeviceScopeId());
		barrier_op2->addIdOperand(builder.makeUintConstant(spv::MemorySemanticsUniformMemoryMask |
		                                                   spv::MemorySemanticsAcquireReleaseMask));

		atomic_or->addIdOperand(control_chain_id);
		atomic_or->addIdOperand(builder.getAtomicDeviceScopeId());
		atomic_or->addIdOperand(builder.makeUintConstant(0));
		atomic_or->addIdOperand(shift_16->getResultId());

		builder.createBranch(merge_payload_path);
	}
	builder.setBuildPoint(merge_payload_path);
}

spv::Id build_assume_true_call_function(SPIRVModule &module, const InstructionInstrumentationState &instrumentation)
{
	auto &builder = module.get_builder();

	// Use normal bb->addInstruction here since we don't want to instrument the code that is doing instrumentation :')
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id u32_type = builder.makeUintType(32);

	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(),
	                                       "AssumeTrue",
	                                       { bool_type, u32_type }, {}, &entry);

	builder.addName(func->getParamId(0), "value");
	builder.addName(func->getParamId(1), "inst");

	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *fail_block = new spv::Block(builder.getUniqueId(), *func);

	auto should_report = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLogicalNot);
	should_report->addIdOperand(func->getParamId(0));

	auto loaded = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLoad);
	loaded->addIdOperand(instrumentation.should_report_instrumentation_id);

	auto will_report = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLogicalAnd);
	will_report->addIdOperand(should_report->getResultId());
	will_report->addIdOperand(loaded->getResultId());

	spv::Id cond_id = will_report->getResultId();

	entry->addInstruction(std::move(should_report));
	entry->addInstruction(std::move(loaded));
	entry->addInstruction(std::move(will_report));

	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(cond_id, fail_block, merge_block);

	builder.setBuildPoint(fail_block);
	{
		// Dummy value is stored.
		emit_instrumentation_hash(module, instrumentation, func, 0, func->getParamId(1));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	builder.makeReturn(false);
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

spv::Id build_nan_inf_instrument_call_function(
    SPIRVModule &module, const InstructionInstrumentationState &instrumentation, spv::Id type_id)
{
	auto &builder = module.get_builder();

	// Use normal bb->addInstruction here since we don't want to instrument the code that is doing instrumentation :')
	auto *current_build_point = builder.getBuildPoint();
	spv::Block *entry = nullptr;
	spv::Id bool_type = builder.makeBoolType();
	spv::Id u32_type = builder.makeUintType(32);

	auto *func = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(),
	                                       "NanInfInstrumentation",
	                                       { type_id, u32_type }, {}, &entry);

	auto *merge_block = new spv::Block(builder.getUniqueId(), *func);
	auto *first_nan_inf_path = new spv::Block(builder.getUniqueId(), *func);

	builder.addName(func->getParamId(0), "value");
	builder.addName(func->getParamId(1), "inst");

	builder.setBuildPoint(entry);

	// TODO: Find a way to make this more programmable?
	auto is_nan = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIsNan);
	auto is_inf = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpIsInf);
	auto is_not_normal = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLogicalOr);
	auto should_report = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLoad);
	auto will_report = std::make_unique<spv::Instruction>(builder.getUniqueId(), bool_type, spv::OpLogicalAnd);

	is_nan->addIdOperand(func->getParamId(0));
	is_inf->addIdOperand(func->getParamId(0));
	is_not_normal->addIdOperand(is_nan->getResultId());
	is_not_normal->addIdOperand(is_inf->getResultId());
	should_report->addIdOperand(instrumentation.should_report_instrumentation_id);
	will_report->addIdOperand(should_report->getResultId());
	will_report->addIdOperand(is_not_normal->getResultId());
	spv::Id cond_id = will_report->getResultId();

	entry->addInstruction(std::move(is_nan));
	entry->addInstruction(std::move(is_inf));
	entry->addInstruction(std::move(is_not_normal));
	entry->addInstruction(std::move(should_report));
	entry->addInstruction(std::move(will_report));

	builder.createSelectionMerge(merge_block, 0);
	builder.createConditionalBranch(cond_id, first_nan_inf_path, merge_block);

	builder.setBuildPoint(first_nan_inf_path);
	{
		spv::Id value_id = func->getParamId(0);
		if (builder.getScalarTypeWidth(type_id) != 32)
		{
			auto conv = std::make_unique<spv::Instruction>(
			    builder.getUniqueId(), builder.makeFloatType(32), spv::OpFConvert);
			conv->addIdOperand(value_id);
			value_id = conv->getResultId();
			first_nan_inf_path->addInstruction(std::move(conv));
		}

		auto bitcast = std::make_unique<spv::Instruction>(
		    builder.getUniqueId(), u32_type, spv::OpBitcast);
		bitcast->addIdOperand(value_id);
		value_id = bitcast->getResultId();
		first_nan_inf_path->addInstruction(std::move(bitcast));

		emit_instrumentation_hash(module, instrumentation, func, value_id, func->getParamId(1));
		builder.createBranch(merge_block);
	}

	builder.setBuildPoint(merge_block);
	builder.makeReturn(false);
	builder.setBuildPoint(current_build_point);
	return func->getId();
}

}