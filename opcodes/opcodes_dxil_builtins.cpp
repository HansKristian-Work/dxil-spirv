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
#include "opcodes/dxil/dxil_ray_tracing.hpp"

namespace dxil_spv
{
struct DXILDispatcher
{
#define OP(x) builder_lut[unsigned(DXIL::Op::x)]
	DXILDispatcher() noexcept
	{
		// Work around lack of designated initializers in C++.

		// dxil_resources.hpp
		OP(LoadInput) = emit_load_input_instruction;
		// Basically exactly the same, where gsVertexAxis is replaced with vertexIndex.
		OP(AttributeAtVertex) = emit_load_input_instruction;
		OP(StoreOutput) = emit_store_output_instruction;
		OP(CreateHandle) = emit_create_handle_instruction;
		OP(CreateHandleForLib) = emit_create_handle_for_lib_instruction;
		OP(CBufferLoadLegacy) = emit_cbuffer_load_legacy_instruction;
		OP(EvalSnapped) = emit_interpolate_dispatch<GLSLstd450InterpolateAtOffset>;
		OP(EvalSampleIndex) = emit_interpolate_dispatch<GLSLstd450InterpolateAtSample>;
		OP(EvalCentroid) = emit_interpolate_dispatch<GLSLstd450InterpolateAtCentroid>;
		OP(AnnotateHandle) = emit_annotate_handle_instruction;
		OP(CreateHandleFromHeap) = emit_create_handle_from_heap_instruction;
		OP(CreateHandleFromBinding) = emit_create_handle_from_binding_instruction;

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
		OP(Texture2DMSGetSamplePosition) = emit_get_sample_position_dispatch<true>;
		OP(RenderTargetGetSamplePosition) = emit_get_sample_position_dispatch<false>;
		OP(RenderTargetGetSampleCount) = emit_get_render_target_sample_count;
		OP(CheckAccessFullyMapped) = emit_check_access_fully_mapped_instruction;

		// dxil_buffer.hpp
		OP(BufferLoad) = emit_buffer_load_instruction;
		OP(RawBufferLoad) = emit_raw_buffer_load_instruction;
		OP(BufferStore) = emit_buffer_store_instruction;
		OP(RawBufferStore) = emit_raw_buffer_store_instruction;
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

		OP(Dot4AddI8Packed) = emit_i8_dot_instruction<true>;
		OP(Dot4AddU8Packed) = emit_i8_dot_instruction<false>;
		OP(Dot2AddHalf) = emit_dot2_add_half_instruction;

		OP(Ibfe) = emit_bfe_dispatch<spv::OpBitFieldSExtract>;
		OP(Ubfe) = emit_bfe_dispatch<spv::OpBitFieldUExtract>;
		OP(Bfi) = emit_bfi_instruction;

		OP(MakeDouble) = emit_make_double_instruction;
		OP(SplitDouble) = emit_split_double_instruction;
		OP(LegacyF16ToF32) = emit_legacy_f16_to_f32_instruction;
		OP(LegacyF32ToF16) = emit_legacy_f32_to_f16_instruction;
		OP(BitcastF16toI16) = emit_bitcast_instruction;
		OP(BitcastI16toF16) = emit_bitcast_instruction;
		OP(BitcastF32toI32) = emit_bitcast_instruction;
		OP(BitcastI32toF32) = emit_bitcast_instruction;
		OP(BitcastF64toI64) = emit_bitcast_instruction;
		OP(BitcastI64toF64) = emit_bitcast_instruction;
		OP(Unpack4x8) = emit_unpack4x8_instruction;
		OP(Pack4x8) = emit_pack4x8_instruction;

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
		OP(InnerCoverage) = emit_inner_coverage_instruction;
		OP(IsHelperLane) = emit_is_helper_lane_instruction;

		// dxil_geometry.hpp
		OP(EmitStream) = emit_stream_instruction;
		OP(CutStream) = emit_cut_stream_instruction;
		OP(EmitThenCutStream) = emit_then_cut_stream_instruction;
		OP(GSInstanceID) = emit_gs_instance_instruction;
		OP(PrimitiveID) = emit_primitive_id_instruction;
		OP(ViewID) = emit_view_id_instruction;

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
		OP(WaveActiveBallot) = emit_wave_ballot_instruction;
		OP(WaveReadLaneFirst) = emit_wave_read_lane_first_instruction;
		OP(WaveReadLaneAt) = emit_wave_read_lane_at_instruction;
		OP(WaveAllBitCount) = emit_wave_bit_count_dispatch<spv::GroupOperationReduce>;
		OP(WavePrefixBitCount) = emit_wave_bit_count_dispatch<spv::GroupOperationExclusiveScan>;
		OP(WaveActiveOp) = emit_wave_active_op_instruction;
		OP(WaveActiveBit) = emit_wave_active_bit_instruction;
		OP(WavePrefixOp) = emit_wave_prefix_op_instruction;
		OP(QuadOp) = emit_wave_quad_op_instruction;
		OP(QuadReadLaneAt) = emit_wave_quad_read_lane_at_instruction;
		OP(WaveMatch) = emit_wave_match_instruction;
		OP(WaveMultiPrefixBitCount) = emit_wave_multi_prefix_count_bits_instruction;
		OP(WaveMultiPrefixOp) = emit_wave_multi_prefix_op_instruction;

		// dxil_ray_tracing.cpp
		OP(TraceRay) = emit_trace_ray_instruction;
		OP(DispatchRaysIndex) = emit_dispatch_rays_index_instruction;
		OP(DispatchRaysDimensions) = emit_dispatch_rays_dimensions_instruction;
		OP(ObjectRayOrigin) = emit_object_ray_origin_instruction;
		OP(WorldRayOrigin) = emit_world_ray_origin_instruction;
		OP(ObjectRayDirection) = emit_object_ray_direction_instruction;
		OP(WorldRayDirection) = emit_world_ray_direction_instruction;
		OP(RayTMin) = emit_ray_t_min_instruction;
		OP(RayTCurrent) = emit_ray_t_current_instruction;
		OP(WorldToObject) = emit_world_to_object_instruction;
		OP(ObjectToWorld) = emit_object_to_world_instruction;
		OP(InstanceID) = emit_ray_tracing_instance_id_instruction;
		OP(InstanceIndex) = emit_ray_tracing_instance_index_instruction;
		OP(RayQuery_GeometryIndex) = emit_ray_tracing_geometry_index_instruction;
		OP(PrimitiveIndex) = emit_ray_tracing_primitive_index_instruction;
		OP(RayFlags) = emit_ray_tracing_ray_flags_instruction;
		OP(HitKind) = emit_ray_tracing_hit_kind_instruction;
		OP(ReportHit) = emit_ray_tracing_report_hit;
		OP(AcceptHitAndEndSearch) = emit_ray_tracing_accept_hit_and_end_search;
		OP(IgnoreHit) = emit_ray_tracing_ignore_hit;
		OP(CallShader) = emit_ray_tracing_call_shader;

		// Ray query
		OP(AllocateRayQuery) = emit_allocate_ray_query;
		OP(RayQuery_TraceRayInline) = emit_ray_query_trace_ray_inline_instruction;
		OP(RayQuery_Proceed) = emit_ray_query_proceed_instruction;
		OP(RayQuery_Abort) = emit_ray_query_abort_instruction;

		// Global status
		OP(RayQuery_CandidateType) = emit_ray_query_intersection_type_instruction<spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CommittedStatus) = emit_ray_query_intersection_type_instruction<spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;

		// System variables
		OP(RayQuery_RayFlags) = emit_ray_query_system_value_instruction<spv::OpRayQueryGetRayFlagsKHR, 1>;
		OP(RayQuery_RayTMin) = emit_ray_query_system_value_instruction<spv::OpRayQueryGetRayTMinKHR, 1>;
		OP(RayQuery_WorldRayDirection) = emit_ray_query_system_value_instruction<spv::OpRayQueryGetWorldRayDirectionKHR, 3>;
		OP(RayQuery_WorldRayOrigin) = emit_ray_query_system_value_instruction<spv::OpRayQueryGetWorldRayOriginKHR, 3>;

		// Candidates
		OP(RayQuery_CommitNonOpaqueTriangleHit) = emit_ray_query_commit_non_opaque_triangle_instruction;
		OP(RayQuery_CommitProceduralPrimitiveHit) = emit_ray_query_commit_procedural_primitive_instruction;
		OP(RayQuery_CandidateProceduralPrimitiveNonOpaque) = emit_ray_query_candidate_procedural_primitive_non_opaque_instruction;

		// Getters (candidate)
		OP(RayQuery_CandidateTriangleRayT) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionTKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateInstanceIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionInstanceIdKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateInstanceID) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionInstanceCustomIndexKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateGeometryIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionGeometryIndexKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidatePrimitiveIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionPrimitiveIndexKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateObjectRayOrigin) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionObjectRayOriginKHR, 3,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateObjectRayDirection) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionObjectRayDirectionKHR, 3,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateTriangleBarycentrics) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionBarycentricsKHR, 2,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateTriangleFrontFace) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionFrontFaceKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateInstanceContributionToHitGroupIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionInstanceShaderBindingTableRecordOffsetKHR, 1,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateWorldToObject3x4) =
			emit_ray_query_get_matrix_value_instruction<spv::OpRayQueryGetIntersectionWorldToObjectKHR,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;
		OP(RayQuery_CandidateObjectToWorld3x4) =
			emit_ray_query_get_matrix_value_instruction<spv::OpRayQueryGetIntersectionObjectToWorldKHR,
				spv::RayQueryIntersectionRayQueryCandidateIntersectionKHR>;

		// Getters (committed)
		OP(RayQuery_CommittedRayT) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionTKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedInstanceIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionInstanceIdKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedInstanceID) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionInstanceCustomIndexKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedGeometryIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionGeometryIndexKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedPrimitiveIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionPrimitiveIndexKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedObjectRayOrigin) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionObjectRayOriginKHR, 3,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedObjectRayDirection) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionObjectRayDirectionKHR, 3,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedTriangleBarycentrics) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionBarycentricsKHR, 2,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedTriangleFrontFace) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionFrontFaceKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedInstanceContributionToHitGroupIndex) =
			emit_ray_query_get_value_instruction<spv::OpRayQueryGetIntersectionInstanceShaderBindingTableRecordOffsetKHR, 1,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedWorldToObject3x4) =
			emit_ray_query_get_matrix_value_instruction<spv::OpRayQueryGetIntersectionWorldToObjectKHR,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		OP(RayQuery_CommittedObjectToWorld3x4) =
			emit_ray_query_get_matrix_value_instruction<spv::OpRayQueryGetIntersectionObjectToWorldKHR,
				spv::RayQueryIntersectionRayQueryCommittedIntersectionKHR>;
		////////////
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

static void update_access_tracking_from_type(Converter::Impl::AccessTracking &tracking,
                                             const llvm::Type *type)
{
	if (type->getTypeID() == llvm::Type::TypeID::HalfTyID)
		tracking.access_16bit = true;
	else if (type->getTypeID() == llvm::Type::TypeID::DoubleTyID)
		tracking.access_64bit = true;
	else if (type->getTypeID() == llvm::Type::TypeID::IntegerTyID)
	{
		if (type->getIntegerBitWidth() == 16)
			tracking.access_16bit = true;
		else if (type->getIntegerBitWidth() == 64)
			tracking.access_64bit = true;
	}
}

static void analyze_descriptor_handle_sink(Converter::Impl &impl,
                                           const llvm::CallInst *instruction,
                                           const llvm::BasicBlock *bb)
{
	// Even if we only use a resource in a branch in HLSL code, DXC might still unconditionally load
	// the resource handle, which means descriptor QA checks might not be entirely accurate.
	// To ensure we handle control flow correctly, sink instruction to BBs which actually use the
	// resource handle.
	unsigned count = instruction->getNumOperands();
	for (unsigned i = 1; i < count; i++)
	{
		if (auto *call_op = llvm::dyn_cast<llvm::CallInst>(instruction->getOperand(i)))
		{
			auto itr = impl.resource_handle_to_block.find(call_op);
			if (itr != impl.resource_handle_to_block.end())
			{
				auto *orig_bb = itr->second;
				if (!impl.resource_handle_is_conservative.count(call_op) && orig_bb != bb)
				{
					impl.resource_handles_needing_sink.insert(call_op);
					auto &sinks = impl.bb_to_sinks[bb];
					if (std::find(sinks.begin(), sinks.end(), call_op) == sinks.end())
						sinks.push_back(call_op);
				}
				else
				{
					// If we use the handle in the same block we created it,
					// don't try to sink anything. One QA check is enough.
					impl.resource_handle_is_conservative.insert(call_op);
				}
			}
		}
	}
}

bool analyze_dxil_instruction(Converter::Impl &impl, const llvm::CallInst *instruction, const llvm::BasicBlock *bb)
{
	// The opcode is encoded as a constant integer.
	uint32_t opcode;
	if (!get_constant_operand(instruction, 0, &opcode))
		return false;

	if (impl.options.descriptor_qa_enabled && impl.options.descriptor_qa_sink_handles)
		analyze_descriptor_handle_sink(impl, instruction, bb);

	switch (static_cast<DXIL::Op>(opcode))
	{
	case DXIL::Op::CreateHandle:
	{
		uint32_t resource_type_operand, resource_range;
		if (!get_constant_operand(instruction, 1, &resource_type_operand))
			return false;
		if (!get_constant_operand(instruction, 2, &resource_range))
			return false;

		if (static_cast<DXIL::ResourceType>(resource_type_operand) == DXIL::ResourceType::UAV)
			impl.llvm_value_to_uav_resource_index_map[instruction] = resource_range;
		else if (static_cast<DXIL::ResourceType>(resource_type_operand) == DXIL::ResourceType::SRV)
			impl.llvm_value_to_srv_resource_index_map[instruction] = resource_range;

		if (impl.options.descriptor_qa_enabled && impl.options.descriptor_qa_sink_handles)
			impl.resource_handle_to_block[instruction] = bb;
		break;
	}

	case DXIL::Op::CreateHandleForLib:
	{
		auto itr = impl.llvm_global_variable_to_resource_mapping.find(instruction->getOperand(1));
		if (itr == impl.llvm_global_variable_to_resource_mapping.end())
			return false;

		if (itr->second.type == DXIL::ResourceType::UAV)
			impl.llvm_value_to_uav_resource_index_map[instruction] = itr->second.meta_index;
		else if (itr->second.type == DXIL::ResourceType::SRV)
			impl.llvm_value_to_srv_resource_index_map[instruction] = itr->second.meta_index;

		impl.llvm_active_global_resource_variables.insert(itr->second.variable);

		if (impl.options.descriptor_qa_enabled && impl.options.descriptor_qa_sink_handles)
			impl.resource_handle_to_block[instruction] = bb;
		break;
	}

	case DXIL::Op::AnnotateHandle:
	{
		AnnotateHandleMeta meta = {};
		if (!get_annotate_handle_meta(impl, instruction, meta))
			return false;

		if (meta.resource_op == DXIL::Op::CreateHandleFromHeap)
		{
			// Annotating handle forms the real resource.
			// CreateHandleFromHeap merely holds the index / nonuniform.
			// For analysis purposes, this is irrelevant.
			auto ordinal = unsigned(impl.llvm_annotate_handle_uses.size());
			auto &use = impl.llvm_annotate_handle_uses[instruction];
			use = {};
			use.ordinal = ordinal;

			auto *constant = llvm::dyn_cast<llvm::ConstantAggregate>(instruction->getOperand(2));
			if (!constant || constant->getType()->getTypeID() != llvm::Type::TypeID::StructTyID ||
			    constant->getNumOperands() != 2)
			{
				LOGE("AnnotateHandle takes a ConstantAggregate.\n");
				return false;
			}

			uint32_t type = constant->getOperand(0)->getUniqueInteger().getZExtValue();
			uint32_t params = constant->getOperand(1)->getUniqueInteger().getZExtValue();

			// The encoding here is very ... peculiar.
			constexpr uint32_t AnnotateUAVMask = 1u << 12;
			constexpr uint32_t AnnotateGloballyCoherentMask = 1u << 14;
			use.resource_kind = DXIL::ResourceKind(type & 0xff);
			switch (use.resource_kind)
			{
			case DXIL::ResourceKind::CBuffer:
				use.resource_type = DXIL::ResourceType::CBV;
				break;

			case DXIL::ResourceKind::Sampler:
				use.resource_type = DXIL::ResourceType::Sampler;
				break;

			default:
				use.resource_type = (type & AnnotateUAVMask) != 0 ? DXIL::ResourceType::UAV : DXIL::ResourceType::SRV;
				use.coherent = (type & AnnotateGloballyCoherentMask) != 0;
				break;
			}

			if (use.resource_kind == DXIL::ResourceKind::StructuredBuffer)
				use.stride = params;
			else if (use.resource_kind != DXIL::ResourceKind::RawBuffer)
				use.component_type = DXIL::ComponentType(params & 0xff);
		}
		else if (meta.resource_op == DXIL::Op::CreateHandleFromBinding ||
		         meta.resource_op == DXIL::Op::CreateHandleForLib)
		{
			if (meta.resource_type == DXIL::ResourceType::UAV)
				impl.llvm_value_to_uav_resource_index_map[instruction] = meta.binding_index;
			else if (meta.resource_type == DXIL::ResourceType::SRV)
				impl.llvm_value_to_srv_resource_index_map[instruction] = meta.binding_index;
		}

		if (impl.options.descriptor_qa_enabled && impl.options.descriptor_qa_sink_handles)
			impl.resource_handle_to_block[instruction] = bb;
		break;
	}

	case DXIL::Op::BufferLoad:
	case DXIL::Op::TextureLoad:
	case DXIL::Op::RawBufferLoad:
	{
		const auto update_node = [&](Converter::Impl::AccessTracking &node) {
			node.has_read = true;
			update_access_tracking_from_type(node, instruction->getType()->getStructElementType(0));
		};

		// In DXIL, whether or not an opcode is sparse depends on if the 4th argument is statically used by SSA ...
		auto itr = impl.llvm_value_to_uav_resource_index_map.find(instruction->getOperand(1));
		if (itr != impl.llvm_value_to_uav_resource_index_map.end())
		{
			auto &node = impl.uav_access_tracking[itr->second];
			update_node(node);
		}

		itr = impl.llvm_value_to_srv_resource_index_map.find(instruction->getOperand(1));
		if (itr != impl.llvm_value_to_srv_resource_index_map.end())
		{
			auto &node = impl.srv_access_tracking[itr->second];
			update_node(node);
		}

		auto annotate_itr = impl.llvm_annotate_handle_uses.find(instruction->getOperand(1));
		if (annotate_itr != impl.llvm_annotate_handle_uses.end())
		{
			auto &node = annotate_itr->second.tracking;
			update_node(node);
		}

		break;
	}

	case DXIL::Op::AtomicCompareExchange:
	case DXIL::Op::AtomicBinOp:
	{
		const auto update_node = [&](Converter::Impl::AccessTracking &node) {
			node.has_read = true;
			node.has_written = true;
			node.has_atomic = true;
			impl.shader_analysis.has_side_effects = true;
		};

		auto itr = impl.llvm_value_to_uav_resource_index_map.find(instruction->getOperand(1));
		if (itr != impl.llvm_value_to_uav_resource_index_map.end())
		{
			auto &node = impl.uav_access_tracking[itr->second];
			update_node(node);
		}

		auto annotate_itr = impl.llvm_annotate_handle_uses.find(instruction->getOperand(1));
		if (annotate_itr != impl.llvm_annotate_handle_uses.end())
		{
			auto &node = annotate_itr->second.tracking;
			update_node(node);
		}

		break;
	}

	case DXIL::Op::BufferStore:
	case DXIL::Op::TextureStore:
	case DXIL::Op::RawBufferStore:
	{
		const auto update_node = [&](Converter::Impl::AccessTracking &node) {
			node.has_written = true;
			update_access_tracking_from_type(node, instruction->getOperand(4)->getType());
			impl.shader_analysis.has_side_effects = true;
		};

		auto itr = impl.llvm_value_to_uav_resource_index_map.find(instruction->getOperand(1));
		if (itr != impl.llvm_value_to_uav_resource_index_map.end())
		{
			auto &node = impl.uav_access_tracking[itr->second];
			update_node(node);
		}

		auto annotate_itr = impl.llvm_annotate_handle_uses.find(instruction->getOperand(1));
		if (annotate_itr != impl.llvm_annotate_handle_uses.end())
		{
			auto &node = annotate_itr->second.tracking;
			update_node(node);
		}

		break;
	}

	case DXIL::Op::BufferUpdateCounter:
	{
		impl.llvm_values_using_update_counter.insert(instruction->getOperand(1));
		impl.shader_analysis.has_side_effects = true;
		break;
	}

	case DXIL::Op::TraceRay:
	{
		// Mark alloca'd variables which should be considered as payloads rather than StorageClassFunction.
		if (const auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(instruction->getOperand(15)))
		{
			auto storage = impl.get_effective_storage_class(alloca_inst, spv::StorageClassFunction);
			if (storage != spv::StorageClassFunction && storage != spv::StorageClassRayPayloadKHR)
			{
				impl.handle_to_storage_class[alloca_inst] = spv::StorageClassFunction;
				if (!impl.get_needs_temp_storage_copy(alloca_inst))
					impl.needs_temp_storage_copy.insert(alloca_inst);
			}
			else if (!impl.get_needs_temp_storage_copy(alloca_inst))
			{
				impl.handle_to_storage_class[alloca_inst] = spv::StorageClassRayPayloadKHR;
			}
		}

		if (const auto *flags_inst = llvm::dyn_cast<llvm::ConstantInt>(instruction->getOperand(2)))
		{
			if ((flags_inst->getUniqueInteger().getZExtValue() & (spv::RayFlagsSkipTrianglesKHRMask |
			                                                      spv::RayFlagsSkipAABBsKHRMask)) != 0)
			{
				impl.shader_analysis.can_require_primitive_culling = true;
			}
		}
		else
		{
			// Non constant flags, so we must be conservative.
			impl.shader_analysis.can_require_primitive_culling = true;
		}

		break;
	}

	case DXIL::Op::CallShader:
	{
		// Mark alloca'd variables which should be considered as payloads rather than StorageClassFunction.
		if (const auto *alloca_inst = llvm::dyn_cast<llvm::AllocaInst>(instruction->getOperand(2)))
		{
			auto storage = impl.get_effective_storage_class(alloca_inst, spv::StorageClassFunction);
			if (storage != spv::StorageClassFunction && storage != spv::StorageClassCallableDataKHR)
			{
				impl.handle_to_storage_class[alloca_inst] = spv::StorageClassFunction;
				if (!impl.get_needs_temp_storage_copy(alloca_inst))
					impl.needs_temp_storage_copy.insert(alloca_inst);
			}
			else if (!impl.get_needs_temp_storage_copy(alloca_inst))
			{
				impl.handle_to_storage_class[alloca_inst] = spv::StorageClassCallableDataKHR;
			}
		}
		break;
	}

	case DXIL::Op::ReportHit:
	{
		auto *payload = instruction->getOperand(3);
		auto *type = payload->getType();
		if (impl.llvm_hit_attribute_output_type && impl.llvm_hit_attribute_output_type != type)
		{
			LOGE("Hit attribute types must match.\n");
			return false;
		}
		impl.llvm_hit_attribute_output_type = type;
		break;
	}

	case DXIL::Op::Discard:
		impl.shader_analysis.discards = true;
		break;

	case DXIL::Op::AttributeAtVertex:
	{
		// If this is used, promote a vertex input to PerVertex.
		uint32_t input_sig_index = 0;
		if (!get_constant_operand(instruction, 1, &input_sig_index))
			return false;
		impl.llvm_attribute_at_vertex_indices.insert(input_sig_index);
		break;
	}

	case DXIL::Op::DerivCoarseX:
	case DXIL::Op::DerivCoarseY:
	case DXIL::Op::DerivFineX:
	case DXIL::Op::DerivFineY:
	case DXIL::Op::CalculateLOD:
	case DXIL::Op::SampleBias:
	case DXIL::Op::Sample:
	case DXIL::Op::SampleCmp:
		if (impl.execution_model == spv::ExecutionModelGLCompute)
		{
			// We're trying to do shader derivatives outside fragment, uh oh.
			// Also, we need to map 4 lanes to invocation IDs.
			// Either, we will set up a 1D mapping with ComputeDerivativeGroupLinearNV and run the code as-is,
			// or we run with LinearNV, but rewrite the thread IDs to fake 2D grouping.
			// We could rely on QuadNV here, but it's not widely supported.
			impl.shader_analysis.require_compute_shader_derivatives = true;
		}
		break;

	case DXIL::Op::QuadOp:
	case DXIL::Op::QuadReadLaneAt:
		if (impl.execution_model == spv::ExecutionModelGLCompute)
		{
			uint32_t sm_major = 0, sm_minor = 0;
			Converter::Impl::get_shader_model(impl.bitcode_parser.get_module(), nullptr, &sm_major, &sm_minor);
			if (sm_major * 1000 + sm_minor >= 6006)
			{
				// In SM 6.6, the semantics of quad ops in compute changes.
				// They follow compute shader derivative rules,
				// where they might be 1D or 2D based on workgroup size.
				impl.shader_analysis.require_compute_shader_derivatives = true;
			}
		}
		break;

	default:
		break;
	}

	return true;
}
} // namespace dxil_spv
