/* Copyright (c) 2019-2025 Hans-Kristian Arntzen for Valve Corporation
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

#include "opcodes/opcodes.hpp"
#include "dxil_ags.hpp"
#include "spirv_module.hpp"
#include "opcodes/converter_impl.hpp"
#include "dxil_common.hpp"
#include "dxil_sampling.hpp"
#include "dxil_buffer.hpp"

namespace dxil_spv
{
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

bool emit_magic_ags_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
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
}