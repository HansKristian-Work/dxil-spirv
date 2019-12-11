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
#include "opcodes/dxil/dxil_arithmetic.hpp"
#include "opcodes/dxil/dxil_buffer.hpp"
#include "opcodes/dxil/dxil_common.hpp"
#include "opcodes/dxil/dxil_compute.hpp"
#include "opcodes/dxil/dxil_geometry.hpp"
#include "opcodes/dxil/dxil_pixel_ops.hpp"
#include "opcodes/dxil/dxil_resources.hpp"
#include "opcodes/dxil/dxil_sampling.hpp"
#include "opcodes/dxil/dxil_tessellation.hpp"
#include "opcodes/dxil/dxil_waveops.hpp"

namespace DXIL2SPIRV
{
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
		OP(EvalSnapped) = emit_interpolate_dispatch<GLSLstd450InterpolateAtOffset>;
		OP(EvalSampleIndex) = emit_interpolate_dispatch<GLSLstd450InterpolateAtSample>;
		OP(EvalCentroid) = emit_interpolate_dispatch<GLSLstd450InterpolateAtCentroid>;

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
		OP(CalculateLOD) = emit_calculate_lod_instruction;

		// dxil_buffer.hpp
		OP(BufferLoad) = emit_buffer_load_instruction;
		OP(BufferStore) = emit_buffer_store_instruction;
		OP(BufferUpdateCounter) = emit_buffer_update_counter_instruction;
		OP(AtomicBinOp) = emit_atomic_binop_instruction;
		OP(AtomicCompareExchange) = emit_atomic_cmpxchg_instruction;

		// dxil_arithmetic.hpp
		OP(Saturate) = emit_saturate_instruction;

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

		OP(MakeDouble) = emit_make_double_instruction;
		OP(SplitDouble) = emit_split_double_instruction;
		OP(LegacyF16ToF32) = emit_legacy_f16_to_f32_instruction;
		OP(LegacyF32ToF16) = emit_legacy_f32_to_f16_instruction;

		// dxil_compute.hpp
		OP(Barrier) = emit_barrier_instruction;
		OP(ThreadId) = emit_thread_id_load_dispatch<spv::BuiltInGlobalInvocationId>;
		OP(GroupId) = emit_thread_id_load_dispatch<spv::BuiltInWorkgroupId>;
		OP(ThreadIdInGroup) = emit_thread_id_load_dispatch<spv::BuiltInLocalInvocationId>;
		OP(FlattenedThreadIdInGroup) = emit_thread_id_load_dispatch<spv::BuiltInLocalInvocationIndex>;

		// dxil_pixel_ops.hpp
		OP(Discard) = emit_discard_instruction;
		OP(DerivCoarseX) = emit_derivative_dispatch<spv::OpDPdxCoarse>;
		OP(DerivCoarseY) = emit_derivative_dispatch<spv::OpDPdyCoarse>;
		OP(DerivFineX) = emit_derivative_dispatch<spv::OpDPdxFine>;
		OP(DerivFineY) = emit_derivative_dispatch<spv::OpDPdyFine>;
		OP(SampleIndex) = emit_sample_index_instruction;
		OP(Coverage) = emit_coverage_instruction;

		// dxil_geometry.hpp
		OP(EmitStream) = emit_stream_instruction;
		OP(CutStream) = emit_cut_stream_instruction;
		OP(EmitThenCutStream) = emit_then_cut_stream_instruction;
		OP(GSInstanceID) = emit_gs_instance_instruction;
		OP(PrimitiveID) = emit_primitive_id_instruction;

		// dxil_tessellation.hpp
		OP(StorePatchConstant) = emit_store_patch_constant_instruction;
		OP(LoadOutputControlPoint) = emit_load_output_control_point_instruction;
		OP(DomainLocation) = emit_domain_location_instruction;
		OP(LoadPatchConstant) = emit_load_patch_constant_instruction;
		OP(OutputControlPointID) = emit_output_control_point_instruction;

		// dxil_waveops.hpp
		OP(WaveIsFirstLane) = emit_wave_is_first_lane_instruction;
		OP(WaveGetLaneCount) = emit_wave_builtin_dispatch<spv::BuiltInSubgroupSize>;
		OP(WaveGetLaneIndex) = emit_wave_builtin_dispatch<spv::BuiltInSubgroupLocalInvocationId>;
		OP(WaveAllTrue) = emit_wave_boolean_dispatch<spv::OpGroupNonUniformAll>;
		OP(WaveAnyTrue) = emit_wave_boolean_dispatch<spv::OpGroupNonUniformAny>;
		OP(WaveActiveAllEqual) = emit_wave_boolean_dispatch<spv::OpGroupNonUniformAllEqual>;
	}

#undef OP

	DXILOperationBuilder builder_lut[unsigned(DXIL::Op::Count)] = {};
};

// Sets up LUT once.
static DXILDispatcher global_dispatcher;

bool emit_dxil_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
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

	return global_dispatcher.builder_lut[opcode](impl, instruction);
}
} // namespace DXIL2SPIRV
