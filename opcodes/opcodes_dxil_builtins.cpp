/*
 * Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
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

#include "opcodes_dxil_builtins.hpp"
#include "converter_impl.hpp"
#include "logging.hpp"
#include "opcodes/dxil/dxil_common.hpp"
#include "opcodes/dxil/dxil_resources.hpp"
#include "opcodes/dxil/dxil_sampling.hpp"
#include "opcodes/dxil/dxil_buffer.hpp"

namespace DXIL2SPIRV
{
static bool emit_saturate_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                      const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, GLSLstd450NClamp, impl.get_id_for_value(instruction->getOperand(1)),
		             builder.makeFloatConstant(0.0f), builder.makeFloatConstant(1.0f) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_imad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	// FIXME: Do we need to deal with intermediate mul overflow here somehow?

	spv::Id mul_result_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpIMul;
		op.id = mul_result_id;
		op.type_id = impl.get_type_id(instruction->getType());
		op.arguments = {
			impl.get_id_for_value(instruction->getOperand(1)),
			impl.get_id_for_value(instruction->getOperand(2))
		};
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpIAdd;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = {
		mul_result_id,
		impl.get_id_for_value(instruction->getOperand(3))
	};
	ops.push_back(std::move(op));
	return true;
}

static bool emit_fmad_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = {
		impl.glsl_std450_ext,
		GLSLstd450Fma,
		impl.get_id_for_value(instruction->getOperand(1)),
		impl.get_id_for_value(instruction->getOperand(2)),
		impl.get_id_for_value(instruction->getOperand(3)),
	};

	// Not sure about this one. Will have to figure it out when we start looking at tessellation or something ...
	if (instruction->getMetadata("dx.precise") != nullptr)
		builder.addDecoration(op.id, spv::DecorationNoContraction);

	ops.push_back(std::move(op));
	return true;
}

static bool emit_isfinite_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                      const llvm::CallInst *instruction)
{
	// There is an OpIsFinite instruction, but it's only supported in kernel mode, so we have to decompose here.

	spv::Id nan_id = impl.allocate_id();
	spv::Id inf_id = impl.allocate_id();

	{
		Operation op;
		op.op = spv::OpIsNan;
		op.id = nan_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };
		ops.push_back(std::move(op));
	}

	{
		Operation op;
		op.op = spv::OpIsInf;
		op.id = inf_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };
		ops.push_back(std::move(op));
	}

	spv::Id not_finite_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpLogicalOr;
		op.id = not_finite_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { nan_id, inf_id };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpLogicalNot;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { not_finite_id };
	ops.push_back(std::move(op));
	return true;
}

static bool emit_find_high_bit_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                           spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	// This is actually CLZ, and not FindMSB.
	spv::Id msb_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpExtInst;
		op.id = msb_id;
		op.type_id = impl.get_type_id(instruction->getType());
		op.arguments = {
			impl.glsl_std450_ext,
			opcode,
			impl.get_id_for_value(instruction->getOperand(1))
		};
		ops.push_back(std::move(op));
	}

	spv::Id eq_neg1_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpIEqual;
		op.id = eq_neg1_id;
		op.type_id = builder.makeBoolType();
		op.arguments = { msb_id, builder.makeUintConstant(~0u) };
		ops.push_back(std::move(op));
	}

	spv::Id msb_sub_id = impl.allocate_id();
	{
		Operation op;
		op.op = spv::OpISub;
		op.id = msb_sub_id;
		op.type_id = impl.get_type_id(instruction->getType());
		op.arguments = { builder.makeUintConstant(31), msb_id };
		ops.push_back(std::move(op));
	}

	Operation op;
	op.op = spv::OpSelect;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { eq_neg1_id, builder.makeUintConstant(~0u), msb_sub_id };
	ops.push_back(std::move(op));
	return true;
}

template <GLSLstd450 opcode>
static bool emit_find_high_bit_dispatch(std::vector<Operation> &ops, Converter::Impl &impl,
                                        spv::Builder &builder, const llvm::CallInst *instruction)
{
	return emit_find_high_bit_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_dxil_unary_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                        spv::Builder &builder, const llvm::CallInst *instruction)
{
	Operation op;
	op.op = opcode;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.get_id_for_value(instruction->getOperand(1)) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_dxil_std450_unary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                               spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, opcode, impl.get_id_for_value(instruction->getOperand(1)) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_dxil_std450_binary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                                spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, opcode, impl.get_id_for_value(instruction->getOperand(1)),
		             impl.get_id_for_value(instruction->getOperand(2)) };

	ops.push_back(std::move(op));
	return true;
}

static bool emit_dxil_std450_trinary_instruction(GLSLstd450 opcode, std::vector<Operation> &ops, Converter::Impl &impl,
                                                spv::Builder &builder, const llvm::CallInst *instruction)
{
	if (!impl.glsl_std450_ext)
		impl.glsl_std450_ext = builder.import("GLSL.std.450");

	Operation op;
	op.op = spv::OpExtInst;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.glsl_std450_ext, opcode, impl.get_id_for_value(instruction->getOperand(1)),
	                 impl.get_id_for_value(instruction->getOperand(2)),
	                 impl.get_id_for_value(instruction->getOperand(3)) };

	ops.push_back(std::move(op));
	return true;
}

template <GLSLstd450 opcode>
static bool std450_trinary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                    const llvm::CallInst *instruction)
{
	return emit_dxil_std450_trinary_instruction(opcode, ops, impl, builder, instruction);
}

template <GLSLstd450 opcode>
static bool std450_binary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                   const llvm::CallInst *instruction)
{
	return emit_dxil_std450_binary_instruction(opcode, ops, impl, builder, instruction);
}

template <GLSLstd450 opcode>
static bool std450_unary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                  const llvm::CallInst *instruction)
{
	return emit_dxil_std450_unary_instruction(opcode, ops, impl, builder, instruction);
}

template <spv::Op opcode>
static bool unary_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::CallInst *instruction)
{
	return emit_dxil_unary_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_dot_instruction(unsigned dimensions,
                                 std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	Operation op;
	op.op = spv::OpDot;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());

	spv::Id vec0_args[4] = {};
	spv::Id vec1_args[4] = {};
	for (unsigned i = 0; i < dimensions; i++)
		vec0_args[i] = impl.get_id_for_value(instruction->getOperand(1 + i));
	for (unsigned i = 0; i < dimensions; i++)
		vec1_args[i] = impl.get_id_for_value(instruction->getOperand(1 + i + dimensions));

	spv::Id vec0 = impl.build_vector(ops, op.type_id, vec0_args, dimensions);
	spv::Id vec1 = impl.build_vector(ops, op.type_id, vec1_args, dimensions);

	op.arguments = { vec0, vec1 };
	ops.push_back(std::move(op));
	return true;
}

template <unsigned Dim>
static bool emit_dot_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CallInst *instruction)
{
	return emit_dot_instruction(Dim, ops, impl, builder, instruction);
}

static spv::Id mask_input(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                          const llvm::Value *value)
{
	spv::Id id = impl.allocate_id();

	Operation op;
	op.op = spv::OpBitwiseAnd;
	op.id = id;
	op.type_id = impl.get_type_id(value->getType());
	op.arguments = {
		impl.get_id_for_value(value),
		builder.makeUintConstant(31),
	};

	ops.push_back(std::move(op));
	return id;
}

static bool emit_bfe_instruction(spv::Op opcode, std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	// SPIR-V spec doesn't say anything about masking inputs, but Ibfe/Ubfe do, so ...
	spv::Id masked_width_id = mask_input(ops, impl, builder, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(ops, impl, builder, instruction->getOperand(2));

	Operation op;
	op.op = opcode;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { impl.get_id_for_value(instruction->getOperand(3)), masked_offset_id, masked_width_id };
	ops.push_back(std::move(op));
	return true;
}

template <spv::Op opcode>
static bool emit_bfe_dispatch(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                              const llvm::CallInst *instruction)
{
	return emit_bfe_instruction(opcode, ops, impl, builder, instruction);
}

static bool emit_bfi_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                 const llvm::CallInst *instruction)
{
	spv::Id masked_width_id = mask_input(ops, impl, builder, instruction->getOperand(1));
	spv::Id masked_offset_id = mask_input(ops, impl, builder, instruction->getOperand(2));
	spv::Id src_id = impl.get_id_for_value(instruction->getOperand(3));
	spv::Id dst_id = impl.get_id_for_value(instruction->getOperand(4));

	Operation op;
	op.op = spv::OpBitFieldInsert;
	op.id = impl.get_id_for_value(instruction);
	op.type_id = impl.get_type_id(instruction->getType());
	op.arguments = { dst_id, src_id, masked_offset_id, masked_width_id };
	ops.push_back(std::move(op));

	return true;
}

static bool emit_barrier_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                                     const llvm::CallInst *instruction)
{
	uint32_t operation;
	if (!get_constant_operand(instruction, 1, &operation))
		return false;

	// Match DXC SPIR-V output here.
	Operation op;

	switch (static_cast<DXIL::BarrierMode>(operation))
	{
	case DXIL::BarrierMode::GroupMemoryBarrierWithGroupSync:
		op.op = spv::OpControlBarrier;
		op.arguments = {
			builder.makeUintConstant(spv::ScopeWorkgroup),
			builder.makeUintConstant(spv::ScopeWorkgroup),
			builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	case DXIL::BarrierMode::AllMemoryBarrierWithGroupSync:
		op.op = spv::OpControlBarrier;
		op.arguments = {
			builder.makeUintConstant(spv::ScopeWorkgroup),
			builder.makeUintConstant(spv::ScopeDevice),
			builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask |
			                         spv::MemorySemanticsImageMemoryMask |
			                         spv::MemorySemanticsUniformMemoryMask |
			                         spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	case DXIL::BarrierMode::GroupMemoryBarrier:
		op.op = spv::OpMemoryBarrier;
		op.arguments = {
			builder.makeUintConstant(spv::ScopeWorkgroup),
			builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask | spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	case DXIL::BarrierMode::AllMemoryBarrier:
		op.op = spv::OpMemoryBarrier;
		op.arguments = {
			builder.makeUintConstant(spv::ScopeDevice),
			builder.makeUintConstant(spv::MemorySemanticsWorkgroupMemoryMask |
									 spv::MemorySemanticsImageMemoryMask |
									 spv::MemorySemanticsUniformMemoryMask |
									 spv::MemorySemanticsAcquireReleaseMask),
		};
		break;

	default:
		return false;
	}

	ops.push_back(std::move(op));
	return true;
}

struct DXILDispatcher
{
#define OP(x) builder_lut[unsigned(DXIL::Op::x)]
	DXILDispatcher() noexcept
	{
		// Work around lack of designated initializers in C++.

		// dxil_resources.hpp
		OP(LoadInput) = emit_load_input_instruction;
		OP(StoreOutput) = emit_store_output_instruction;
		OP(CreateHandle) = emit_create_handle_instruction;
		OP(CBufferLoadLegacy) = emit_cbuffer_load_legacy_instruction;

		OP(Saturate) = emit_saturate_instruction;

		// dxil_sampling.hpp
		OP(Sample) = emit_sample_instruction_dispatch<DXIL::Op::Sample>;
		OP(SampleBias) = emit_sample_instruction_dispatch<DXIL::Op::SampleBias>;
		OP(SampleLevel) = emit_sample_instruction_dispatch<DXIL::Op::SampleLevel>;
		OP(SampleCmp) = emit_sample_instruction_dispatch<DXIL::Op::SampleCmp>;
		OP(SampleCmpLevelZero) = emit_sample_instruction_dispatch<DXIL::Op::SampleCmpLevelZero>;
		OP(SampleGrad) = emit_sample_grad_instruction;
		OP(TextureLoad) = emit_texture_load_instruction;
		OP(TextureStore) = emit_texture_store_instruction;
		OP(GetDimensions) = emit_get_dimensions_instruction;
		OP(TextureGather) = emit_texture_gather_dispatch<false>;
		OP(TextureGatherCmp) = emit_texture_gather_dispatch<true>;

		// dxil_buffer.hpp
		OP(BufferLoad) = emit_buffer_load_instruction;
		OP(BufferStore) = emit_buffer_store_instruction;
		OP(BufferUpdateCounter) = emit_buffer_update_counter_instruction;
		OP(AtomicBinOp) = emit_atomic_binop_instruction;
		OP(AtomicCompareExchange) = emit_atomic_cmpxchg_instruction;

		OP(FMin) = std450_binary_dispatch<GLSLstd450NMin>;
		OP(FMax) = std450_binary_dispatch<GLSLstd450NMax>;
		OP(IMin) = std450_binary_dispatch<GLSLstd450SMin>;
		OP(IMax) = std450_binary_dispatch<GLSLstd450SMax>;
		OP(UMin) = std450_binary_dispatch<GLSLstd450UMin>;
		OP(UMax) = std450_binary_dispatch<GLSLstd450UMax>;
		OP(IsNan) = unary_dispatch<spv::OpIsNan>;
		OP(IsInf) = unary_dispatch<spv::OpIsInf>;
		OP(IsFinite) = emit_isfinite_instruction;

		OP(Cos) = std450_unary_dispatch<GLSLstd450Cos>;
		OP(Sin) = std450_unary_dispatch<GLSLstd450Sin>;
		OP(Tan) = std450_unary_dispatch<GLSLstd450Tan>;
		OP(Acos) = std450_unary_dispatch<GLSLstd450Acos>;
		OP(Asin) = std450_unary_dispatch<GLSLstd450Asin>;
		OP(Atan) = std450_unary_dispatch<GLSLstd450Atan>;
		OP(Hcos) = std450_unary_dispatch<GLSLstd450Cosh>;
		OP(Hsin) = std450_unary_dispatch<GLSLstd450Sinh>;
		OP(Htan) = std450_unary_dispatch<GLSLstd450Tanh>;
		OP(Exp) = std450_unary_dispatch<GLSLstd450Exp2>;
		OP(Log) = std450_unary_dispatch<GLSLstd450Log2>;

		OP(Rsqrt) = std450_unary_dispatch<GLSLstd450InverseSqrt>;
		OP(Sqrt) = std450_unary_dispatch<GLSLstd450Sqrt>;
		OP(FAbs) = std450_unary_dispatch<GLSLstd450FAbs>;
		OP(Frc) = std450_unary_dispatch<GLSLstd450Fract>;

		OP(Round_ne) = std450_unary_dispatch<GLSLstd450RoundEven>;
		OP(Round_ni) = std450_unary_dispatch<GLSLstd450Floor>;
		OP(Round_pi) = std450_unary_dispatch<GLSLstd450Ceil>;
		OP(Round_z) = std450_unary_dispatch<GLSLstd450Trunc>;

		OP(Bfrev) = unary_dispatch<spv::OpBitReverse>;
		OP(Countbits) = unary_dispatch<spv::OpBitCount>;
		OP(FirstbitLo) = std450_unary_dispatch<GLSLstd450FindILsb>;
		OP(FirstbitSHi) = emit_find_high_bit_dispatch<GLSLstd450FindSMsb>;
		OP(FirstbitHi) = emit_find_high_bit_dispatch<GLSLstd450FindUMsb>;

		OP(Dot2) = emit_dot_dispatch<2>;
		OP(Dot3) = emit_dot_dispatch<3>;
		OP(Dot4) = emit_dot_dispatch<4>;

		OP(Fma) = std450_trinary_dispatch<GLSLstd450Fma>;
		OP(FMad) = emit_fmad_instruction;
		OP(IMad) = emit_imad_instruction;
		OP(UMad) = emit_imad_instruction;

		// FIXME: Untested. Not sure how to trick dxc to generate these.
		OP(Ibfe) = emit_bfe_dispatch<spv::OpBitFieldSExtract>;
		OP(Ubfe) = emit_bfe_dispatch<spv::OpBitFieldUExtract>;
		OP(Bfi) = emit_bfi_instruction;

		OP(Barrier) = emit_barrier_instruction;
	}

#undef OP

	DXILOperationBuilder builder_lut[unsigned(DXIL::Op::Count)] = {};
};

// Sets up LUT once.
static DXILDispatcher global_dispatcher;

bool emit_dxil_instruction(std::vector<Operation> &ops, Converter::Impl &impl, spv::Builder &builder,
                           const llvm::CallInst *instruction)
{
	// The opcode is encoded as a constant integer.
	uint32_t opcode;
	if (!get_constant_operand(instruction, 0, &opcode))
		return false;

	if (opcode >= unsigned(DXIL::Op::Count))
	{
		LOGE("DXIL opcode %u is out of range.\n", opcode);
		return false;
	}

	if (global_dispatcher.builder_lut[opcode] == nullptr)
	{
		LOGE("Unimplemented DXIL opcode %u\n", opcode);
		return false;
	}

	return global_dispatcher.builder_lut[opcode](ops, impl, builder, instruction);
}
} // namespace DXIL2SPIRV
