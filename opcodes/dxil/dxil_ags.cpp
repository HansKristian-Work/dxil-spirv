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
	atomic_op->add_id(builder.getAtomicDeviceScopeId());
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

static spv::Id make_fp8_type(Converter::Impl &impl, bool load_store)
{
	if (impl.options.wmma_fp8 || GlobalConfiguration::get().wmma_fp8_hack)
		return impl.builder().makeFloatType(8, impl.options.wmma_fp8 ? spv::FPEncodingFloat8E4M3EXT : -1);
	else if (load_store)
		return impl.builder().makeUintType(8);
	else
		return impl.builder().makeFloatType(16);
}

static inline uint32_t get_type_data_format(uint32_t imm)
{
	return (imm >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_DataFormatFlagShift) &
	       AmdExtD3DShaderIntrinsicsWaveMatrixModifier_DataFormatFlagMask;
}

static inline uint32_t get_matrix_type(uint32_t imm)
{
	return (imm >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTypeFlagShift) &
	       AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTypeFlagMask;
}

static inline uint32_t get_matrix_shape(uint32_t imm)
{
	return (imm >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_ShapeShift) &
	       AmdExtD3DShaderIntrinsicsWaveMatrixModifier_ShapeMask;
}

static bool validate_convert_compatibility(uint32_t imm_a, uint32_t imm_b)
{
	// AGS opcodes allow conversion between types + transpositions.
	// Horrifying :(
	uint32_t shape_a = get_matrix_shape(imm_a);
	uint32_t shape_b = get_matrix_shape(imm_b);
	return shape_a == shape_b;
}

static spv::CooperativeMatrixUse convert_matrix_use(uint32_t use)
{
	switch (use)
	{
	case AmdExtD3DShaderIntrinsicsWaveMatrixType_A:
		return spv::CooperativeMatrixUseMatrixAKHR;
	case AmdExtD3DShaderIntrinsicsWaveMatrixType_B:
		return spv::CooperativeMatrixUseMatrixBKHR;
	case AmdExtD3DShaderIntrinsicsWaveMatrixType_Accumulator:
		return spv::CooperativeMatrixUseMatrixAccumulatorKHR;
	default:
		return spv::CooperativeMatrixUseMax;
	}
}

static spv::Id build_coopmat_type(Converter::Impl &impl, uint32_t immediate, bool load_store)
{
	auto &builder = impl.builder();

	uint32_t fmt = get_type_data_format(immediate);
	uint32_t type = get_matrix_type(immediate);
	uint32_t shape = get_matrix_shape(immediate);

	if (shape != AmdExtD3DShaderIntrinsicsWaveMatrixShape_16X16)
		return 0;

	spv::Id use;
	spv::Id scalar_type;
	auto spv_use = convert_matrix_use(type);

	switch (fmt)
	{
	case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		if (spv_use != spv::CooperativeMatrixUseMatrixAccumulatorKHR)
			return 0;
		scalar_type = builder.makeFloatType(32);
		break;

	case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
		scalar_type = builder.makeFloatType(16);
		break;

	case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
		scalar_type = make_fp8_type(impl, load_store);
		break;

	default:
		return 0;
	}

	use = builder.makeUintConstant(spv_use);
	spv::Id rows_cols = builder.makeUintConstant(16);
	return builder.makeCooperativeMatrixType(scalar_type, rows_cols, rows_cols, use);
}

static inline uint32_t get_matrix_io_channel(uint32_t imm)
{
	return (imm >> AmdExtD3DShaderIntrinsicsWaveMatrixInOut_ChannelShift) &
	       AmdExtD3DShaderIntrinsicsWaveMatrixInOut_ChannelMask;
}

static inline uint32_t get_matrix_io_register(uint32_t imm)
{
	return (imm >> AmdExtD3DShaderIntrinsicsWaveMatrixInOut_SecondRegFlagShift) &
	       AmdExtD3DShaderIntrinsicsWaveMatrixInOut_SecondRegFlagMask;
}

static inline uint32_t get_matrix_io_type(uint32_t imm)
{
	return (imm >> AmdExtD3DShaderIntrinsicsWaveMatrixInOut_MatRegTypeFlagShift) &
	       AmdExtD3DShaderIntrinsicsWaveMatrixInOut_MatRegTypeFlagMask;
}

static bool validate_wmma_io_registers(Converter::Impl &impl, uint32_t base_argument,
                                       AmdExtD3DShaderIntrinsicsWaveMatrixRegType reg_type,
                                       uint32_t phase, bool input_validation)
{
	if (reg_type == AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg && !input_validation)
	{
		// 8 outputs
		for (uint32_t i = 0; i < 8; i++)
		{
			uint32_t inst_index = base_argument + i;
			uint32_t imm = impl.ags.instructions[inst_index].immediate;
			uint32_t channel = get_matrix_io_channel(imm);
			uint32_t reg = get_matrix_io_register(imm);
			uint32_t type = get_matrix_io_type(imm);

			if (impl.ags.instructions[inst_index].phase != phase)
				return false;

			// Check for unexpected cases.
			if ((imm >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTileShift) != 0)
				return false;
			if (type != reg_type)
				return false;
			if (channel != i % 4 || reg != i / 4)
				return false;
		}
	}
	else
	{
		spv::Id coopmat_id = impl.get_id_for_value(impl.ags.backdoor_instructions[base_argument]->getOperand(5));

		// If the matrix is PHI or loaded from alloca, we only check component mapping.
		bool all_phi_or_load = true;
		for (uint32_t i = 0; i < 4 && all_phi_or_load; i++)
		{
			uint32_t inst_index = base_argument + i;
			const auto *value0 = impl.ags.backdoor_instructions[inst_index]->getOperand(5);
			const auto *value1 = impl.ags.backdoor_instructions[inst_index]->getOperand(6);
			all_phi_or_load =
				(llvm::isa<llvm::PHINode>(value0) || llvm::isa<llvm::LoadInst>(value0)) &&
				(llvm::isa<llvm::PHINode>(value1) || llvm::isa<llvm::LoadInst>(value1));
		}

		// 4x2 inputs.
		for (uint32_t i = 0; i < 4; i++)
		{
			uint32_t inst_index = base_argument + i;
			const auto *value0 = impl.ags.backdoor_instructions[inst_index]->getOperand(5);
			const auto *value1 = impl.ags.backdoor_instructions[inst_index]->getOperand(6);
			auto itr0 = impl.ags.coopmat_component_mapping.find(value0);
			auto itr1 = impl.ags.coopmat_component_mapping.find(value1);

			if (impl.ags.instructions[inst_index].phase != phase)
				return false;

			// Don't accept any weird shuffle.
			if (itr0 == impl.ags.coopmat_component_mapping.end() || itr0->second.component != 2 * i + 0 ||
			    (!all_phi_or_load && impl.get_id_for_value(value0) != coopmat_id))
			{
				return false;
			}

			if (itr1 == impl.ags.coopmat_component_mapping.end() || itr1->second.component != 2 * i + 1 ||
			    (!all_phi_or_load && impl.get_id_for_value(value1) != coopmat_id))
			{
				return false;
			}

			uint32_t imm = impl.ags.instructions[inst_index].immediate;

			uint32_t channel = get_matrix_io_channel(imm);
			uint32_t reg = get_matrix_io_register(imm);
			uint32_t type = get_matrix_io_type(imm);

			// Check for unexpected cases.
			if ((imm >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTileShift) != 0)
				return false;
			if (type != reg_type)
				return false;
			if (channel != i % 2 || reg != i / 2)
				return false;
		}
	}

	return true;
}

static bool emit_wmma_return_values(Converter::Impl &impl, spv::Id type_id, spv::Id id, uint32_t phase)
{
	if (!validate_wmma_io_registers(impl, impl.ags.num_instructions - 8,
	                                AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg,
	                                phase, false))
	{
		return false;
	}

	// Validate output register assignment.
	for (uint32_t i = 0; i < 8; i++)
	{
		uint32_t inst_index = impl.ags.num_instructions - 8 + i;
		auto *inst = impl.ags.backdoor_instructions[inst_index];
		if (id)
			impl.rewrite_value(inst, id);
		impl.ags.coopmat_component_mapping[inst] = { type_id, i };
	}

	return true;
}

static spv::Id emit_coopmat_transfer(Converter::Impl &impl, spv::Id v, uint32_t input_imm, uint32_t output_imm)
{
	spv::Id input_type = build_coopmat_type(impl, input_imm, false);
	spv::Id output_type = build_coopmat_type(impl, output_imm, false);

	spv::Id aux_types[3] = { input_type, output_type };
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::CoopMatTransfer, aux_types, 2);

	// RADV workaround. Should pass as value, but NIR aborts.
	spv::Id param = impl.create_variable(spv::StorageClassFunction, input_type);
	auto *store = impl.allocate(spv::OpStore);
	store->add_id(param);
	store->add_id(v);
	impl.add(store);

	auto *call = impl.allocate(spv::OpFunctionCall, output_type);
	call->add_id(call_id);
	call->add_id(param);
	impl.add(call);

	return call->id;
}

static spv::Id emit_coopmat_broken_saturation_fixup(Converter::Impl &impl, spv::Id v, spv::Id type_id)
{
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::CoopMatSaturationFixup, type_id);

	// RADV workaround. Should pass as value, but NIR aborts.
	spv::Id param = impl.create_variable(spv::StorageClassFunction, type_id);
	auto *store = impl.allocate(spv::OpStore);
	store->add_id(param);
	store->add_id(v);
	impl.add(store);

	auto *call = impl.allocate(spv::OpFunctionCall, type_id);
	call->add_id(call_id);
	call->add_id(param);
	impl.add(call);

	return call->id;
}

static spv::Id emit_coopmat_saturate_fp8(Converter::Impl &impl, spv::Id v, spv::Id type_id)
{
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::CoopMatSaturateFP8, type_id);

	// RADV workaround. Should pass as value, but NIR aborts.
	spv::Id param = impl.create_variable(spv::StorageClassFunction, type_id);
	auto *store = impl.allocate(spv::OpStore);
	store->add_id(param);
	store->add_id(v);
	impl.add(store);

	auto *call = impl.allocate(spv::OpFunctionCall, type_id);
	call->add_id(call_id);
	call->add_id(param);
	impl.add(call);

	return call->id;
}

static spv::Id emit_coopmat_transpose_with_convert(
    Converter::Impl &impl, spv::Id v, uint32_t input_imm, uint32_t output_imm, bool saturating)
{
	auto &builder = impl.builder();

	if (impl.options.nv_cooperative_matrix2_conversions &&
	    get_matrix_type(input_imm) == AmdExtD3DShaderIntrinsicsWaveMatrixType_Accumulator &&
	    get_matrix_type(output_imm) != AmdExtD3DShaderIntrinsicsWaveMatrixType_Accumulator)
	{
		// We can only go from accumulator to non-accumulator in this path.
		// NV extension allows us to convert between matrix types without extra fuzz.
		spv::Op opcode;

		if (get_type_data_format(input_imm) != get_type_data_format(output_imm))
		{
			switch (get_type_data_format(output_imm))
			{
			case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
				if (!impl.options.wmma_fp8)
					return 0;
				break;

			case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
			case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
				break;

			default:
				// FSR4 only needs FP, don't care about all possible combinations yet.
				return 0;
			}

			switch (get_type_data_format(input_imm))
			{
			case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
				if (!impl.options.wmma_fp8)
					return 0;
				break;

			case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
			case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
				break;

			default:
				// FSR4 only needs FP, don't care about all possible combinations yet.
				return 0;
			}

			opcode = spv::OpFConvert;
		}
		else
		{
			opcode = spv::OpCooperativeMatrixConvertNV;
		}

		builder.addExtension("SPV_NV_cooperative_matrix2");
		builder.addCapability(spv::CapabilityCooperativeMatrixConversionsNV);

		auto *conv = impl.allocate(opcode, build_coopmat_type(impl, output_imm, false));
		conv->add_id(v);
		impl.add(conv);

		if (impl.options.wmma_fp8 && saturating &&
		    opcode == spv::OpFConvert &&
		    get_type_data_format(output_imm) == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
		{
			impl.builder().addDecoration(
			    conv->id, spv::DecorationSaturatedToLargestFloat8NormalConversionEXT);
		}

		return conv->id;
	}

	return 0;
}

static spv::Id emit_coopmat_transpose(Converter::Impl &impl, spv::Id v, uint32_t input_imm, uint32_t output_imm)
{
	auto &builder = impl.builder();

	if (impl.options.wmma_fp8 || GlobalConfiguration::get().wmma_fp8_hack)
	{
		if (get_matrix_type(input_imm) != AmdExtD3DShaderIntrinsicsWaveMatrixType_A &&
		    get_matrix_type(output_imm) != AmdExtD3DShaderIntrinsicsWaveMatrixType_A &&
		    get_type_data_format(input_imm) == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
		{
			// It appears that in the cases we care about, layout of B and C are the same.
			// Just do element-wise copy here to avoid the bad roundtrip.
			// This assumption only seems to hold for FP8, but that's the only case we care about.
			return emit_coopmat_transfer(impl, v, input_imm, output_imm);
		}
	}

	if (!impl.ags.coopmat_transpose_scratch)
	{
		spv::Id lds_type_id = builder.makeUintType(32);
		uint32_t num_elements = 16 * 16;

		// Assume that the workgroup is aligned.
		uint32_t max_num_workgroups = impl.execution_mode_meta.workgroup_threads[0] *
		                              impl.execution_mode_meta.workgroup_threads[1] *
		                              impl.execution_mode_meta.workgroup_threads[2];

		if (impl.execution_mode_meta.wave_size_min)
			max_num_workgroups /= impl.execution_mode_meta.wave_size_min;
		else if (impl.options.subgroup_size.implementation_minimum)
			max_num_workgroups /= impl.options.subgroup_size.implementation_minimum;
		else
		{
			LOGE("Need LDS transpose, but there is no estimate for how large the LDS buffer needs to be.\n");
			return 0;
		}

		if (!max_num_workgroups)
		{
			LOGE("Invalid workgroup size.\n");
			return 0;
		}

		num_elements *= max_num_workgroups;

		lds_type_id = builder.makeArrayType(lds_type_id, builder.makeUintConstant(num_elements), 0);
		impl.ags.coopmat_transpose_scratch =
		    impl.create_variable(spv::StorageClassWorkgroup, lds_type_id, "LDSTransposeScratch");
	}

	if (get_type_data_format(input_imm) != get_type_data_format(output_imm))
		return 0;
	if (get_type_data_format(input_imm) == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32)
		return 0;

	spv::Id subgroup_id_var = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSubgroupId);
	auto *subgroup_id = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	subgroup_id->add_id(subgroup_id_var);
	impl.add(subgroup_id);

	auto *index = impl.allocate(spv::OpIMul, builder.makeUintType(32));
	index->add_id(subgroup_id->id);
	index->add_id(builder.makeUintConstant(16 * 16));
	impl.add(index);

	auto *chain = impl.allocate(spv::OpInBoundsAccessChain,
	                            builder.makePointer(spv::StorageClassWorkgroup, builder.makeUintType(32)));
	chain->add_id(impl.ags.coopmat_transpose_scratch);
	chain->add_id(index->id);
	impl.add(chain);

	auto *barrier = impl.allocate(spv::OpControlBarrier);
	barrier->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	barrier->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	barrier->add_id(builder.getWorkgroupBarrierSemanticsId());
	impl.add(barrier);

	auto *store = impl.allocate(spv::OpCooperativeMatrixStoreKHR);
	store->add_id(chain->id);
	store->add_id(v);
	store->add_id(builder.makeUintConstant(spv::CooperativeMatrixLayoutColumnMajorKHR));
	store->add_id(builder.makeUintConstant(16));
	if (impl.execution_mode_meta.memory_model == spv::MemoryModelVulkan)
		store->add_literal(spv::MemoryAccessNonPrivatePointerMask);

	impl.add(store);

	barrier = impl.allocate(spv::OpControlBarrier);
	barrier->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	barrier->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	barrier->add_id(builder.getWorkgroupBarrierSemanticsId());
	impl.add(barrier);

	spv::Id output_type = build_coopmat_type(impl, output_imm, false);
	if (!output_type)
		return 0;

	auto *load = impl.allocate(spv::OpCooperativeMatrixLoadKHR, output_type);
	load->add_id(chain->id);
	load->add_id(builder.makeUintConstant(spv::CooperativeMatrixLayoutColumnMajorKHR));
	load->add_id(builder.makeUintConstant(16));
	if (impl.execution_mode_meta.memory_model == spv::MemoryModelVulkan)
		load->add_literal(spv::MemoryAccessNonPrivatePointerMask);
	impl.add(load);

	return load->id;
}

static spv::Id emit_fp8_to_fp16_coopmat(Converter::Impl &impl, spv::Id v, spv::CooperativeMatrixUse use)
{
	auto &builder = impl.builder();
	spv::Id rows_cols = builder.makeUintConstant(16);
	spv::Id u8_type = builder.makeCooperativeMatrixType(
		builder.makeUintType(8), rows_cols, rows_cols, builder.makeUintConstant(use));
	spv::Id f16_type = builder.makeCooperativeMatrixType(
		builder.makeFloatType(16), rows_cols, rows_cols, builder.makeUintConstant(use));

	spv::Id aux_types[2] = { u8_type, f16_type };
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::CoopMatFP8toFP16, aux_types, 2);

	// RADV workaround. Should pass as value, but NIR aborts.
	spv::Id param = impl.create_variable(spv::StorageClassFunction, u8_type);
	auto *store = impl.allocate(spv::OpStore);
	store->add_id(param);
	store->add_id(v);
	impl.add(store);

	auto *call = impl.allocate(spv::OpFunctionCall, f16_type);
	call->add_id(call_id);
	call->add_id(param);
	impl.add(call);

	return call->id;
}

static spv::Id emit_fp16_to_fp8_coopmat(Converter::Impl &impl, spv::Id v, spv::CooperativeMatrixUse use)
{
	auto &builder = impl.builder();
	spv::Id rows_cols = builder.makeUintConstant(16);
	spv::Id u8_type = builder.makeCooperativeMatrixType(
	    builder.makeUintType(8), rows_cols, rows_cols, builder.makeUintConstant(use));
	spv::Id f16_type = builder.makeCooperativeMatrixType(
	    builder.makeFloatType(16), rows_cols, rows_cols, builder.makeUintConstant(use));

	spv::Id aux_types[2] = { u8_type, f16_type };
	spv::Id call_id = impl.spirv_module.get_helper_call_id(HelperCall::CoopMatFP16toFP8, aux_types, 2);

	// RADV workaround. Should pass as value, but NIR aborts.
	spv::Id param = impl.create_variable(spv::StorageClassFunction, f16_type);
	auto *store = impl.allocate(spv::OpStore);
	store->add_id(param);
	store->add_id(v);
	impl.add(store);

	auto *call = impl.allocate(spv::OpFunctionCall, u8_type);
	call->add_id(call_id);
	call->add_id(param);
	impl.add(call);

	return call->id;
}

static bool emit_wmma_length(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	uint32_t type_imm = impl.ags.instructions[0].immediate;
	uint32_t fmt = get_type_data_format(type_imm);

	spv::Id type_id = build_coopmat_type(impl, type_imm, false);
	if (type_id == 0)
		return false;

	spv::Id id = 0;

	auto *len = impl.allocate(spv::OpCooperativeMatrixLengthKHR, builder.makeUintType(32));
	len->add_id(type_id);
	impl.add(len);
	id = len->id;

	if (fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
	{
		// FP8 is tightly packed.
		auto *div = impl.allocate(spv::OpUDiv, builder.makeUintType(32));
		div->add_id(id);
		div->add_id(builder.makeUintConstant(4));
		impl.add(div);
		id = div->id;
	}

	impl.rewrite_value(impl.ags.backdoor_instructions[0], id);
	return true;
}

static bool emit_wmma_element_insert(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	if (!validate_wmma_io_registers(impl, 0, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg, 0, true))
		return false;

	uint32_t type_imm = impl.ags.instructions[4].immediate;
	uint32_t fmt = get_type_data_format(type_imm);
	spv::Id coop_type = build_coopmat_type(impl, type_imm, false);
	if (!coop_type)
		return false;

	const llvm::Value *elem = impl.ags.backdoor_instructions[4]->getOperand(5);
	spv::Id data_id = impl.get_id_for_value(impl.ags.backdoor_instructions[4]->getOperand(6));
	spv::Id id = 0;

	// FSR4 doesn't need this, just don't bother if we emulate FP8 as FP16.
	if (!impl.options.wmma_fp8 && !GlobalConfiguration::get().wmma_fp8_hack &&
	    fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
	{
		return false;
	}

	if (const auto *const_e = llvm::dyn_cast<llvm::ConstantInt>(elem))
	{
		switch (fmt)
		{
		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
		{
			// 8-bit elements are packed in AGS for some reason ...
			id = impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5));

			auto *cast = impl.allocate(spv::OpBitcast, builder.makeVectorType(builder.makeUintType(8), 4));
			cast->add_id(data_id);
			impl.add(cast);

			for (int i = 0; i < 4; i++)
			{
				auto *ext = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(8));
				ext->add_id(cast->id);
				ext->add_literal(i);
				impl.add(ext);

				auto *bitcast = impl.allocate(spv::OpBitcast, make_fp8_type(impl, false));
				bitcast->add_id(ext->id);
				impl.add(bitcast);
				ext = bitcast;

				auto *insert = impl.allocate(spv::OpCompositeInsert, coop_type);
				insert->add_id(ext->id);
				insert->add_id(id);
				insert->add_literal(4 * const_e->getUniqueInteger().getZExtValue() + i);
				impl.add(insert);
				id = insert->id;
			}

			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
		{
			auto *downcast = impl.allocate(spv::OpUConvert, builder.makeUintType(16));
			downcast->add_id(data_id);
			impl.add(downcast);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeFloatType(16));
			bitcast->add_id(downcast->id);
			impl.add(bitcast);

			auto *insert = impl.allocate(spv::OpCompositeInsert, coop_type);
			insert->add_id(bitcast->id);
			insert->add_id(impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5)));
			insert->add_literal(const_e->getUniqueInteger().getZExtValue());
			impl.add(insert);

			id = insert->id;
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		{
			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeFloatType(16));
			bitcast->add_id(data_id);
			impl.add(bitcast);

			auto *insert = impl.allocate(spv::OpCompositeInsert, coop_type);
			insert->add_id(bitcast->id);
			insert->add_id(impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5)));
			insert->add_literal(const_e->getUniqueInteger().getZExtValue());
			impl.add(insert);

			id = insert->id;
			break;
		}

		default:
			LOGE("Unexpected type for element extract.\n");
			return false;
		}
	}
	else
	{
		spv::Id local_var = impl.create_variable(spv::StorageClassFunction, coop_type);
		auto *store = impl.allocate(spv::OpStore);
		store->add_id(local_var);
		store->add_id(impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5)));
		impl.add(store);

		switch (fmt)
		{
		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
		{
			// 8-bit elements are packed in AGS for some reason ...
			auto *cast = impl.allocate(spv::OpBitcast, builder.makeVectorType(builder.makeUintType(8), 4));
			cast->add_id(data_id);
			impl.add(cast);

			auto *index4 = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			index4->add_id(impl.get_id_for_value(elem));
			index4->add_id(builder.makeUintConstant(4));
			impl.add(index4);

			for (int i = 0; i < 4; i++)
			{
				auto *ext = impl.allocate(spv::OpCompositeExtract, builder.makeUintType(8));
				ext->add_id(cast->id);
				ext->add_literal(i);
				impl.add(ext);

				auto *bitcast = impl.allocate(spv::OpBitcast, make_fp8_type(impl, false));
				bitcast->add_id(ext->id);
				impl.add(bitcast);
				ext = bitcast;

				auto *index = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				index->add_id(index4->id);
				index->add_id(builder.makeUintConstant(i));
				impl.add(index);

				auto *chain = impl.allocate(spv::OpInBoundsAccessChain,
				                            builder.makePointer(spv::StorageClassFunction, make_fp8_type(impl, false)));
				chain->add_id(local_var);
				chain->add_id(index->id);
				impl.add(chain);

				auto *store_elem = impl.allocate(spv::OpStore);
				store_elem->add_id(chain->id);
				store_elem->add_id(ext->id);
				impl.add(store_elem);
			}

			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
		{
			auto *downcast = impl.allocate(spv::OpUConvert, builder.makeUintType(16));
			downcast->add_id(data_id);
			impl.add(downcast);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeFloatType(16));
			bitcast->add_id(downcast->id);
			impl.add(bitcast);

			auto *chain = impl.allocate(spv::OpInBoundsAccessChain,
			                            builder.makePointer(spv::StorageClassFunction, builder.makeFloatType(16)));
			chain->add_id(local_var);
			chain->add_id(impl.get_id_for_value(elem));
			impl.add(chain);

			auto *store_elem = impl.allocate(spv::OpStore);
			store_elem->add_id(chain->id);
			store_elem->add_id(bitcast->id);
			impl.add(store_elem);
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		{
			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeFloatType(32));
			bitcast->add_id(data_id);
			impl.add(bitcast);

			auto *chain = impl.allocate(spv::OpInBoundsAccessChain,
			                            builder.makePointer(spv::StorageClassFunction, builder.makeFloatType(32)));
			chain->add_id(local_var);
			chain->add_id(impl.get_id_for_value(elem));
			impl.add(chain);

			auto *store_elem = impl.allocate(spv::OpStore);
			store_elem->add_id(chain->id);
			store_elem->add_id(bitcast->id);
			impl.add(store_elem);
			break;
		}

		default:
			LOGE("Unexpected type for element extract.\n");
			return false;
		}

		auto *load = impl.allocate(spv::OpLoad, coop_type);
		load->add_id(local_var);
		impl.add(load);
		id = load->id;
	}

	return emit_wmma_return_values(impl, coop_type, id, 2);
}

static bool emit_wmma_element_extract(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	if (!validate_wmma_io_registers(impl, 0, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg, 0, true))
		return false;

	uint32_t type_imm = impl.ags.instructions[4].immediate;
	uint32_t fmt = get_type_data_format(type_imm);

	spv::Id coop_vec_id = impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5));
	const llvm::Value *elem = impl.ags.backdoor_instructions[4]->getOperand(5);
	spv::Id id = 0;

	// FSR4 doesn't need this, just don't bother if we emulate FP8 as FP16.
	if (!impl.options.wmma_fp8 && !GlobalConfiguration::get().wmma_fp8_hack &&
	    fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
	{
		return false;
	}

	if (const auto *const_e = llvm::dyn_cast<llvm::ConstantInt>(elem))
	{
		switch (fmt)
		{
		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
		{
			// 8-bit elements are packed in AGS for some reason ...
			spv::Id elements[4];

			for (int i = 0; i < 4; i++)
			{
				auto *extract = impl.allocate(spv::OpCompositeExtract, make_fp8_type(impl, false));
				extract->add_id(coop_vec_id);
				extract->add_literal(4 * const_e->getUniqueInteger().getZExtValue() + i);
				impl.add(extract);
				elements[i] = extract->id;
			}

			spv::Id vec = impl.build_vector(make_fp8_type(impl, false), elements, 4);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
			bitcast->add_id(vec);
			impl.add(bitcast);

			id = bitcast->id;
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
		{
			auto *extract = impl.allocate(spv::OpCompositeExtract, builder.makeFloatType(16));
			extract->add_id(coop_vec_id);
			extract->add_literal(const_e->getUniqueInteger().getZExtValue());
			impl.add(extract);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(16));
			bitcast->add_id(extract->id);
			impl.add(bitcast);

			auto *upcast = impl.allocate(spv::OpUConvert, builder.makeUintType(32));
			upcast->add_id(bitcast->id);
			impl.add(upcast);

			id = upcast->id;
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		{
			auto *extract = impl.allocate(spv::OpCompositeExtract, builder.makeFloatType(32));
			extract->add_id(coop_vec_id);
			extract->add_literal(const_e->getUniqueInteger().getZExtValue());
			impl.add(extract);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
			bitcast->add_id(extract->id);
			impl.add(bitcast);

			id = bitcast->id;
			break;
		}

		default:
			LOGE("Unexpected type for element extract.\n");
			return false;
		}
	}
	else
	{
		spv::Id type_id = build_coopmat_type(impl, type_imm, false);
		if (!type_id)
			return false;

		spv::Id local_var = impl.create_variable(spv::StorageClassFunction, type_id);

		auto *store = impl.allocate(spv::OpStore);
		store->add_id(local_var);
		store->add_id(coop_vec_id);
		impl.add(store);

		switch (fmt)
		{
		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
		{
			// 8-bit elements are packed in AGS for some reason ...
			spv::Id elements[4];

			auto *index4 = impl.allocate(spv::OpIMul, builder.makeUintType(32));
			index4->add_id(impl.get_id_for_value(elem));
			index4->add_id(builder.makeUintConstant(4));
			impl.add(index4);

			for (int i = 0; i < 4; i++)
			{
				auto *index = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
				index->add_id(index4->id);
				index->add_id(builder.makeUintConstant(i));
				impl.add(index);

				auto *chain = impl.allocate(
					spv::OpInBoundsAccessChain,
					builder.makePointer(spv::StorageClassFunction, make_fp8_type(impl, false)));
				chain->add_id(local_var);
				chain->add_id(index->id);
				impl.add(chain);

				auto *load = impl.allocate(spv::OpLoad, make_fp8_type(impl, false));
				load->add_id(chain->id);
				impl.add(load);

				elements[i] = load->id;
			}

			spv::Id vec = impl.build_vector(make_fp8_type(impl, false), elements, 4);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
			bitcast->add_id(vec);
			impl.add(bitcast);

			id = bitcast->id;
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
		{
			auto *chain = impl.allocate(
				spv::OpInBoundsAccessChain,
				builder.makePointer(spv::StorageClassFunction, builder.makeFloatType(16)));
			chain->add_id(local_var);
			chain->add_id(impl.get_id_for_value(elem));
			impl.add(chain);

			auto *load = impl.allocate(spv::OpLoad, builder.makeFloatType(16));
			load->add_id(chain->id);
			impl.add(load);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(16));
			bitcast->add_id(load->id);
			impl.add(bitcast);

			auto *upcast = impl.allocate(spv::OpUConvert, builder.makeUintType(32));
			upcast->add_id(bitcast->id);
			impl.add(upcast);

			id = upcast->id;
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		{
			auto *chain = impl.allocate(
				spv::OpInBoundsAccessChain,
				builder.makePointer(spv::StorageClassFunction, builder.makeFloatType(32)));
			chain->add_id(local_var);
			chain->add_id(impl.get_id_for_value(elem));
			impl.add(chain);

			auto *load = impl.allocate(spv::OpLoad, builder.makeFloatType(32));
			load->add_id(chain->id);
			impl.add(load);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeUintType(32));
			bitcast->add_id(load->id);
			impl.add(bitcast);

			id = bitcast->id;
			break;
		}

		default:
			LOGE("Unexpected type for element extract.\n");
			return false;
		}
	}

	impl.rewrite_value(impl.ags.backdoor_instructions[4], id);
	return true;
}

static bool emit_wmma_fill(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	const auto *v = impl.ags.backdoor_instructions[0]->getOperand(5);

	uint32_t type_imm = impl.ags.instructions[0].immediate;
	uint32_t fmt = get_type_data_format(type_imm);
	spv::Id type = build_coopmat_type(impl, type_imm, false);
	spv::Id id;

	if (const auto *const_v = llvm::dyn_cast<llvm::ConstantInt>(v))
	{
		switch (fmt)
		{
		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
			if (impl.options.wmma_fp8 || GlobalConfiguration::get().wmma_fp8_hack)
			{
				id = builder.makeFloat8Constant(const_v->getUniqueInteger().getZExtValue(),
				                                impl.options.wmma_fp8 ? spv::FPEncodingFloat8E4M3EXT : -1);
			}
			else if (const_v->getUniqueInteger().getZExtValue() == 0)
			{
				// Trivial
				id = builder.makeFloat16Constant(0);
			}
			else
			{
				// Not needed by FSR4.
				return false;
			}
			break;

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
			id = builder.makeFloat16Constant(const_v->getUniqueInteger().getZExtValue());
			break;

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		{
			union { float f32; uint32_t u32; } u;
			u.u32 = const_v->getUniqueInteger().getZExtValue();
			id = builder.makeFloatConstant(u.f32);
			break;
		}

		default:
			LOGE("Unsupported WMMA Fill format.\n");
			return false;
		}

		id = builder.makeCompositeConstant(type, { id });
	}
	else
	{
		id = impl.get_id_for_value(v);

		switch (fmt)
		{
		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8:
		{
			auto *narrow = impl.allocate(spv::OpUConvert, builder.makeUintType(8));
			narrow->add_id(id);
			impl.add(narrow);
			id = narrow->id;

			if (impl.options.wmma_fp8 || GlobalConfiguration::get().wmma_fp8_hack)
			{
				auto *bitcast = impl.allocate(spv::OpBitcast, make_fp8_type(impl, false));
				bitcast->add_id(id);
				impl.add(bitcast);
				id = bitcast->id;
			}
			else
			{
				// Not needed by FSR4.
				return false;
			}

			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16:
		{
			auto *narrow = impl.allocate(spv::OpUConvert, builder.makeUintType(16));
			narrow->add_id(id);
			impl.add(narrow);

			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeFloatType(16));
			bitcast->add_id(narrow->id);
			impl.add(bitcast);

			id = bitcast->id;
			break;
		}

		case AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32:
		{
			auto *bitcast = impl.allocate(spv::OpBitcast, builder.makeFloatType(32));
			bitcast->add_id(id);
			impl.add(bitcast);

			id = bitcast->id;
			break;
		}

		default:
			LOGE("Unsupported WMMA Fill format.\n");
			return false;
		}

		// Cooperative matrices are implicitly splatted.
		auto *splat = impl.allocate(spv::OpCompositeConstruct, type);
		splat->add_id(id);
		impl.add(splat);

		id = splat->id;
	}

	if (!emit_wmma_return_values(impl, type, id, 1))
	{
		LOGE("Failed to emit WMMA return values.\n");
		return false;
	}

	return true;
}

static spv::Id get_matmul_result_type(Converter::Impl &impl, uint32_t opcode)
{
	auto &builder = impl.builder();
	spv::Id rows_cols = builder.makeUintConstant(16);
	spv::Id use = builder.makeUintConstant(spv::CooperativeMatrixUseMatrixAccumulatorKHR);
	spv::Id scalar_type;

	switch (opcode)
	{
	case AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_FP8_FP8:
	case AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F32_16X16X16_F16:
		scalar_type = builder.makeFloatType(32);
		break;

	case AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_WMMA_F16_16X16X16_F16:
		scalar_type = builder.makeFloatType(16);
		break;

	default:
		return 0;
	}

	return builder.makeCooperativeMatrixType(scalar_type, rows_cols, rows_cols, use);
}

static bool emit_wmma_muladd(Converter::Impl &impl)
{
	if (!validate_wmma_io_registers(impl, 0, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_A_TempReg, 0, true))
		return false;
	if (!validate_wmma_io_registers(impl, 4, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_B_TempReg, 0, true))
		return false;
	if (!validate_wmma_io_registers(impl, 8, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_Accumulator_TempReg, 0, true))
		return false;

	if (impl.ags.instructions[12].phase != 1)
		return false;

	auto opcode = (impl.ags.instructions[12].immediate >> AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_OpsShift) &
	              AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_OpsMask;

	spv::Id type = get_matmul_result_type(impl, opcode);
	if (!type)
		return false;

	auto *muladd = impl.allocate(spv::OpCooperativeMatrixMulAddKHR, type);

	spv::Id a = impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5));
	spv::Id b = impl.get_id_for_value(impl.ags.backdoor_instructions[4]->getOperand(5));
	spv::Id c = impl.get_id_for_value(impl.ags.backdoor_instructions[8]->getOperand(5));

	muladd->add_id(a);
	muladd->add_id(b);
	muladd->add_id(c);
	impl.add(muladd);

	if (!emit_wmma_return_values(impl, type, muladd->id, 2))
	{
		LOGE("Failed to emit WMMA return values.\n");
		return false;
	}

	return true;
}

static spv::Id emit_wmma_complex_convert(Converter::Impl &impl, spv::Id coopmat,
                                         uint32_t type_imm, uint32_t output_immediate,
                                         bool saturating)
{
	uint32_t input_fmt = get_type_data_format(type_imm);
	uint32_t output_fmt = get_type_data_format(output_immediate);

	if (impl.options.wmma_fp8 &&
	    output_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8 &&
	    (input_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16 ||
	     input_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F32) &&
	    saturating)
	{
		// Works around broken RDNA4 HW behavior.
		// Even when saturating, +/- inf becomes NaN.
		// To allow RADV to emit optimal code we have to explicitly "emulate" this HW bug.
		// Only do this fixup if we have native FP8, otherwise the compiler will not understand it
		// and likely emit worse code.
		coopmat = emit_coopmat_broken_saturation_fixup(impl, coopmat, build_coopmat_type(impl, type_imm, false));
	}

	// If this is supported, we can do everything in one go.
	spv::Id res_id = emit_coopmat_transpose_with_convert(impl, coopmat, type_imm, output_immediate, saturating);
	if (res_id != 0)
		return res_id;

	uint32_t input_use = get_matrix_type(type_imm);
	uint32_t output_use = get_matrix_type(output_immediate);
	auto in_use = convert_matrix_use(input_use);
	auto out_use = convert_matrix_use(output_use);

	spv::Id output_type = build_coopmat_type(impl, output_immediate, false);

	constexpr uint32_t FormatMask =
		AmdExtD3DShaderIntrinsicsWaveMatrixModifier_DataFormatFlagMask <<
		AmdExtD3DShaderIntrinsicsWaveMatrixModifier_DataFormatFlagShift;

	constexpr uint32_t TypeMask =
		AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTypeFlagMask <<
		AmdExtD3DShaderIntrinsicsWaveMatrixModifier_MatrixTypeFlagShift;

	// Transpose in input format, convert later.
	uint32_t output_type_input_use_imm = output_immediate;
	output_type_input_use_imm &= ~TypeMask;
	output_type_input_use_imm |= impl.ags.instructions[4].immediate & TypeMask;
	spv::Id output_type_input_use = build_coopmat_type(impl, output_type_input_use_imm, false);

	uint32_t output_type_input_fmt_imm = output_immediate;
	output_type_input_fmt_imm &= ~FormatMask;
	output_type_input_fmt_imm |= impl.ags.instructions[4].immediate & FormatMask;
	spv::Id output_type_input_fmt = build_coopmat_type(impl, output_type_input_fmt_imm, false);

	if (!output_type || (!output_type_input_use && !output_type_input_fmt))
		return 0;

	// Transpose early if the target format does not support the input use.
	if (in_use != out_use && !output_type_input_use)
	{
		coopmat = emit_coopmat_transpose(impl, coopmat, type_imm, output_type_input_fmt_imm);
		if (!coopmat)
			return 0;
		in_use = out_use;
		output_type_input_use = output_type;
	}

	auto effective_input_fmt = input_fmt;
	auto effective_output_fmt = output_fmt;
	if (!impl.options.wmma_fp8 && !GlobalConfiguration::get().wmma_fp8_hack)
	{
		if (effective_input_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
			effective_input_fmt = AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16;
		if (effective_output_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
			effective_output_fmt = AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_F16;
	}

	if (effective_input_fmt != effective_output_fmt)
	{
		auto *conv = impl.allocate(spv::OpFConvert, output_type_input_use);
		conv->add_id(coopmat);
		impl.add(conv);
		coopmat = conv->id;

		if (impl.options.wmma_fp8 && saturating &&
		    output_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
		{
			impl.builder().addDecoration(
				coopmat, spv::DecorationSaturatedToLargestFloat8NormalConversionEXT);
		}
	}

	if (output_fmt == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8 &&
	    !impl.options.wmma_fp8 && !GlobalConfiguration::get().wmma_fp8_hack)
	{
		coopmat = emit_coopmat_saturate_fp8(impl, coopmat, output_type_input_use);
	}

	if (in_use != out_use)
	{
		coopmat = emit_coopmat_transpose(impl, coopmat, output_type_input_use_imm, output_immediate);
		if (!coopmat)
			return 0;
	}

	return coopmat;
}

static bool emit_wmma_convert(Converter::Impl &impl)
{
	if (!validate_wmma_io_registers(impl, 0, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg, 0, true))
		return false;

	if (impl.ags.instructions[4].phase != 1)
		return false;

	uint32_t output_immediate = 0;
	if (!get_constant_operand(impl.ags.backdoor_instructions[4], 5, &output_immediate))
		return false;

	uint32_t saturating = 0;
	if (!get_constant_operand(impl.ags.backdoor_instructions[4], 6, &saturating))
		return false;

	if (!validate_convert_compatibility(impl.ags.instructions[4].immediate, output_immediate))
		return false;

	spv::Id output_type = build_coopmat_type(impl, output_immediate, false);

	spv::Id res_id;

	if (impl.ags.instructions[4].immediate == output_immediate)
	{
		res_id = impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5));
	}
	else
	{
		spv::Id coopmat = impl.get_id_for_value(impl.ags.backdoor_instructions[0]->getOperand(5));
		res_id = emit_wmma_complex_convert(impl, coopmat, impl.ags.instructions[4].immediate,
		                                   output_immediate, saturating != 0);
		if (!res_id)
			return false;
	}

	if (!emit_wmma_return_values(impl, output_type, res_id, 2))
	{
		LOGE("Failed to emit WMMA return values.\n");
		return false;
	}

	return true;
}

struct WMMAAccessChain
{
	spv::Id chain_id;
	spv::Id stride_id;
	uint32_t alignment;
};

static WMMAAccessChain build_wmma_access_chain(
	Converter::Impl &impl, const llvm::Value *offset, const llvm::Value *stride)
{
	WMMAAccessChain ret = {};
	auto &builder = impl.builder();

	if (impl.ags.active_uav_op == DXIL::Op::AtomicBinOp)
	{
		// LDS access chains are in terms of u32 elements for whatever reason ...
		// This is convenient for us however, since SPIR-V is defined the same way.
		// TODO: Unsure what happens if the LDS pointer is u16, but FSR4 doesn't use that, so whatever.
		auto *chain = impl.allocate(spv::OpAccessChain,
		                            builder.makePointer(spv::StorageClassWorkgroup, builder.makeUintType(32)));
		chain->add_id(impl.ags.active_uav_ptr);
		chain->add_id(impl.get_id_for_value(offset));

		impl.add(chain);
		ret.chain_id = chain->id;
		ret.stride_id = impl.get_id_for_value(stride);
		return ret;
	}

	// Build the actual load.
	const auto &meta = impl.handle_to_resource_meta[impl.ags.active_uav_ptr];

	if (meta.storage == spv::StorageClassStorageBuffer || impl.ags.active_uav_op == DXIL::Op::AtomicBinOp)
	{
		spv::Id buffer_id = get_buffer_alias_handle(
			impl, meta, impl.ags.active_uav_ptr, RawType::Integer, RawWidth::B8, RawVecSize::V1);

		if (!buffer_id)
		{
			LOGE("Failed to get buffer alias.\n");
			return ret;
		}

		// Cooperative matrix is in terms of elements of the value type, not bytes.
		// We could use 8-bit storage, but that means adding a lot of extra cruft ...
		auto *chain = impl.allocate(spv::OpAccessChain,
		                            builder.makePointer(spv::StorageClassStorageBuffer, builder.makeUintType(8)));
		chain->add_id(buffer_id);
		chain->add_id(builder.makeUintConstant(0));
		chain->add_id(impl.get_id_for_value(offset));

		impl.add(chain);
		ret.chain_id = chain->id;
		ret.stride_id = impl.get_id_for_value(stride);
	}
	else if (meta.storage == spv::StorageClassPhysicalStorageBuffer)
	{
		if (!impl.ags.u8_array_bda_type)
		{
			impl.ags.u8_array_bda_type = builder.makeRuntimeArray(builder.makeUintType(8));
			builder.addDecoration(impl.ags.u8_array_bda_type, spv::DecorationArrayStride, 1);
		}

		auto *cast = impl.allocate(spv::OpBitcast,
		                           builder.makePointer(spv::StorageClassPhysicalStorageBuffer, impl.ags.u8_array_bda_type));

		cast->add_id(impl.ags.active_uav_ptr);
		impl.add(cast);

		auto *chain = impl.allocate(spv::OpAccessChain,
		                            builder.makePointer(spv::StorageClassPhysicalStorageBuffer, builder.makeUintType(8)));
		chain->add_id(cast->id);
		chain->add_id(impl.get_id_for_value(offset));
		impl.add(chain);

		ret.chain_id = chain->id;
		ret.stride_id = impl.get_id_for_value(stride);
		ret.alignment = 16; // Unsure what requirements are here. Just do the simple thing.
	}
	else
	{
		LOGE("Expected BDA or SSBO for WMMA load-store.\n");
	}

	return ret;
}

static bool emit_wmma_store(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	// Sanity check that we're reading from the hooked read opcode.
	if (impl.ags.backdoor_instructions[5]->getOperand(5) != impl.ags.active_read_backdoor)
		return false;

	if (impl.ags.instructions[0].phase != 0)
		return false;
	if (impl.ags.instructions[5].phase != 2)
		return false;

	if (!validate_wmma_io_registers(impl, 1, AmdExtD3DShaderIntrinsicsWaveMatrixRegType_RetVal_Reg, 1, true))
		return false;

	uint32_t type_immediate = impl.ags.instructions[5].immediate;
	bool column_major = ((type_immediate >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_LayoutFlagShift) &
	                     AmdExtD3DShaderIntrinsicsWaveMatrixModifier_LayoutFlagMask) != 0;

	auto chain = build_wmma_access_chain(impl, impl.ags.backdoor_instructions[0]->getOperand(5),
	                                     impl.ags.backdoor_instructions[0]->getOperand(6));

	if (chain.chain_id == 0)
		return false;

	spv::Id store_id = impl.get_id_for_value(impl.ags.backdoor_instructions[1]->getOperand(5));

	if (!GlobalConfiguration::get().wmma_fp8_hack && !impl.options.wmma_fp8 &&
	    get_type_data_format(type_immediate) == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
	{
		auto spv_use = convert_matrix_use(get_matrix_type(type_immediate));
		// Until we have proper FP8 support, we'll need to downconvert on store.
		store_id = emit_fp16_to_fp8_coopmat(impl, store_id, spv_use);
	}

	auto *store = impl.allocate(spv::OpCooperativeMatrixStoreKHR);
	store->add_id(chain.chain_id);
	store->add_id(store_id);
	store->add_id(builder.makeUintConstant(
		column_major ? spv::CooperativeMatrixLayoutColumnMajorKHR : spv::CooperativeMatrixLayoutRowMajorKHR));
	store->add_id(chain.stride_id);

	bool non_private = impl.execution_mode_meta.memory_model == spv::MemoryModelVulkan;

	if (chain.alignment)
	{
		store->add_literal(spv::MemoryAccessAlignedMask);
		store->add_literal(chain.alignment);
	}

	add_vkmm_access_qualifiers(impl, store, { non_private });

	impl.add(store);

	return true;
}

static void emit_subgroup_barrier(Converter::Impl &impl)
{
	auto &builder = impl.builder();
	auto *barrier = impl.allocate(spv::OpControlBarrier);
	barrier->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	barrier->add_id(builder.makeUintConstant(spv::ScopeSubgroup));
	barrier->add_id(builder.getWorkgroupBarrierSemanticsId());
	impl.add(barrier);
}

static bool emit_wmma_load(Converter::Impl &impl)
{
	auto &builder = impl.builder();

	// Sanity check that we're reading from the hooked read opcode.
	if (impl.ags.backdoor_instructions[1]->getOperand(5) != impl.ags.active_read_backdoor)
		return false;

	if (impl.ags.instructions[0].phase != 0)
		return false;
	if (impl.ags.instructions[1].phase != 1)
		return false;

	uint32_t type_immediate = impl.ags.instructions[1].immediate;
	spv::Id type_id = build_coopmat_type(impl, type_immediate, true);

	if (!type_id)
	{
		LOGE("Failed to create coopmat type.\n");
		return false;
	}

	auto chain = build_wmma_access_chain(impl, impl.ags.backdoor_instructions[0]->getOperand(5),
	                                     impl.ags.backdoor_instructions[0]->getOperand(6));

	if (chain.chain_id == 0)
		return false;

	bool column_major = ((type_immediate >> AmdExtD3DShaderIntrinsicsWaveMatrixModifier_LayoutFlagShift) &
	                     AmdExtD3DShaderIntrinsicsWaveMatrixModifier_LayoutFlagMask) != 0;

	// Workaround AGS omitting barriers.
	if (impl.ags.active_uav_op == DXIL::Op::AtomicBinOp)
		emit_subgroup_barrier(impl);

	auto *load = impl.allocate(spv::OpCooperativeMatrixLoadKHR, type_id);
	load->add_id(chain.chain_id);
	load->add_id(builder.makeUintConstant(
		column_major ? spv::CooperativeMatrixLayoutColumnMajorKHR : spv::CooperativeMatrixLayoutRowMajorKHR));
	load->add_id(chain.stride_id);

	bool non_private = impl.execution_mode_meta.memory_model == spv::MemoryModelVulkan;

	if (chain.alignment)
	{
		load->add_literal(spv::MemoryAccessAlignedMask);
		load->add_literal(chain.alignment);
	}

	add_vkmm_access_qualifiers(impl, load, { non_private });

	impl.add(load);

	// Workaround AGS omitting barriers.
	if (impl.ags.active_uav_op == DXIL::Op::AtomicBinOp)
		emit_subgroup_barrier(impl);

	spv::Id id = load->id;

	if (!GlobalConfiguration::get().wmma_fp8_hack && !impl.options.wmma_fp8 &&
	    get_type_data_format(type_immediate) == AmdExtD3DShaderIntrinsicsWaveMatrixDataFormat_FP8)
	{
		auto spv_use = convert_matrix_use(get_matrix_type(type_immediate));
		// Until we have proper FP8 support, we'll need to upconvert.
		id = emit_fp8_to_fp16_coopmat(impl, id, spv_use);
	}

	if (!emit_wmma_return_values(impl, type_id, id, 2))
	{
		LOGE("Failed to emit WMMA return values.\n");
		return false;
	}

	return true;
}

bool wmma_store_is_masked(Converter::Impl &impl, const llvm::StoreInst *inst)
{
	auto itr = impl.ags.coopmat_component_mapping.find(inst->getOperand(0));
	if (itr == impl.ags.coopmat_component_mapping.end() || itr->second.component == 0)
		return false;

	itr = impl.ags.coopmat_component_mapping.find(inst->getOperand(1));
	if (itr == impl.ags.coopmat_component_mapping.end() || itr->second.component == 0)
		return false;

	return true;
}

static spv::Id rewrite_gep_rdna3(Converter::Impl &impl, const llvm::AllocaInst *alloca, spv::Id id)
{
	if (impl.ags.column_oriented_allocas.count(alloca) == 0)
		return id;

	auto &builder = impl.builder();
	auto *shift = impl.allocate(spv::OpShiftLeftLogical, builder.makeUintType(32));
	shift->add_id(id);
	shift->add_id(builder.makeUintConstant(1));
	impl.add(shift);

	auto *mask = impl.allocate(spv::OpBitwiseAnd, builder.makeUintType(32));
	mask->add_id(shift->id);
	mask->add_id(builder.makeUintConstant(7));
	impl.add(mask);

	spv::Id local_id_var = impl.spirv_module.get_builtin_shader_input(spv::BuiltInSubgroupLocalInvocationId);
	auto *load = impl.allocate(spv::OpLoad, builder.makeUintType(32));
	load->add_id(local_id_var);
	impl.add(load);

	auto *shift_down = impl.allocate(spv::OpShiftRightLogical, builder.makeUintType(32));
	shift_down->add_id(load->id);
	shift_down->add_id(builder.makeUintConstant(4));
	impl.add(shift_down);

	auto *add = impl.allocate(spv::OpIAdd, builder.makeUintType(32));
	add->add_id(mask->id);
	add->add_id(shift_down->id);
	impl.add(add);

	return add->id;
}

spv::Id rewrite_alloca_gep_index(Converter::Impl &impl, const llvm::GetElementPtrInst *gep, spv::Id id)
{
	auto *alloca = llvm::dyn_cast<llvm::AllocaInst>(gep->getOperand(0));
	if (!alloca)
		return id;

	if (!llvm::isa<llvm::Constant>(gep->getOperand(2)))
	{
		spv::Id rdna3_gep_id = rewrite_gep_rdna3(impl, alloca, id);
		if (rdna3_gep_id != id)
			return rdna3_gep_id;
	}

	auto itr = impl.ags.alloca_tracking.find(alloca);
	if (itr == impl.ags.alloca_tracking.end())
		return id;

	if (itr->second.override_element_type && itr->second.override_element_stride)
	{
		auto split = split_index_scale_bias(gep->getOperand(2));
		if (!split.stride)
			return 0;
		if (split.stride != UINT32_MAX && split.stride != itr->second.override_element_stride)
			return 0;

		uint32_t const_index = 0;

		if (split.stride == UINT32_MAX && itr->second.override_element_stride && !split.index)
		{
			const_index = split.elem / itr->second.override_element_stride;
			split.elem -= const_index * itr->second.override_element_stride;
		}

		impl.ags.coopmat_component_mapping[gep] =
		    { itr->second.override_element_type, split.elem };

		// If we're writing anything other than the first element, skip the actual write.
		if (split.elem != 0)
			return UINT32_MAX;

		if (split.index)
			id = impl.get_id_for_value(split.index);
		else
			id = impl.builder().makeUintConstant(const_index);
	}

	return id;
}

bool analyze_ags_wmma_store(Converter::Impl &impl, const llvm::StoreInst *store)
{
	auto itr = impl.ags.coopmat_component_mapping.find(store->getOperand(0));
	if (itr == impl.ags.coopmat_component_mapping.end())
		return true;

	const auto *gep = llvm::dyn_cast<llvm::GetElementPtrInst>(store->getOperand(1));
	if (!gep)
	{
		LOGE("Trying to store a WMMA matrix without GEP.\n");
		return false;
	}

	auto *alloca = llvm::dyn_cast<llvm::AllocaInst>(gep->getOperand(0));
	if (!alloca || gep->getNumOperands() < 3)
	{
		LOGE("Trying to store WMMA to something not Alloca.\n");
		return false;
	}

	const auto *index = gep->getOperand(2);
	auto split = split_index_scale_bias(index);
	if (!split.stride)
		return false;

	auto &tracking = impl.ags.alloca_tracking[alloca];
	if (tracking.override_element_stride &&
	    tracking.override_element_stride != split.stride &&
	    split.stride != UINT32_MAX)
	{
		LOGE("Mismatch WMMA stride.\n");
		return false;
	}

	if (tracking.override_element_type && tracking.override_element_type != itr->second.type_id)
	{
		LOGE("Mismatch WMMA type.\n");
		return false;
	}

	if (split.stride == UINT32_MAX)
	{
		// Somewhat hacky, but this is the AGS assumption.
		tracking.override_element_stride = 8;

#if 0
		// This breaks in some cases.
		if (split.elem > itr->second.component)
		{
			if (tracking.override_element_stride == 0)
			{
				// We can deduce stride from this.
				tracking.override_element_stride = split.elem - itr->second.component;
			}
			else
			{
				// This isn't perfect if there are gaps in the writes, but we can assume that's not the case.
				tracking.override_element_stride =
					std::min<uint32_t>(split.elem - itr->second.component,
									   tracking.override_element_stride);
			}
		}
#endif
	}

	if (split.stride == UINT32_MAX && tracking.override_element_stride)
	{
		split.stride = tracking.override_element_stride;
		split.elem %= split.stride;
	}

	// If we have constant indices we don't know how the mapping works yet.
	if (split.elem != itr->second.component)
	{
		LOGE("Unexpected component mapping in WMMA store.\n");
		return false;
	}

	if (split.stride != UINT32_MAX)
		tracking.override_element_stride = split.stride;
	tracking.override_element_type = itr->second.type_id;
	return true;
}

static void analyze_dubious_implementation_defined_column_behavior(
	Converter::Impl &impl, const llvm::Value *value)
{
	// Try to figure out if the inserted element depends on manually adding elements from alloca().
	// This has different results on RDNA4 and RDNA3 and we can detect
	// this very specific case and rewrite the GEP to hack around it.

	if (!GlobalConfiguration::get().wmma_rdna3_workaround)
		return;

	if (const auto *binop = llvm::dyn_cast<llvm::BinaryOperator>(value))
	{
		analyze_dubious_implementation_defined_column_behavior(impl, binop->getOperand(0));
		analyze_dubious_implementation_defined_column_behavior(impl, binop->getOperand(1));
	}
	else if (const auto *cast = llvm::dyn_cast<llvm::CastInst>(value))
	{
		analyze_dubious_implementation_defined_column_behavior(impl, cast->getOperand(0));
	}
	else if (const auto *load = llvm::dyn_cast<llvm::LoadInst>(value))
	{
		auto *ptr = load->getPointerOperand();
		if (const auto *gep = llvm::dyn_cast<llvm::GetElementPtrInst>(ptr))
		{
			if (const auto *alloca = llvm::dyn_cast<llvm::AllocaInst>(gep->getOperand(0)))
			{
				auto *type = alloca->getType()->getPointerElementType();
				if (type->getTypeID() == llvm::Type::TypeID::ArrayTyID && type->getArrayNumElements() == 8)
				{
					impl.ags.column_oriented_allocas.insert(alloca);
				}
			}
		}
	}
}

bool analyze_magic_ags_instruction(Converter::Impl &impl)
{
	if (impl.ags.num_instructions == 0)
		return true;

	bool has_wmma_return_values = false;
	spv::Id type_id = 0;
	uint32_t phase = 0;

	switch (impl.ags.instructions[0].opcode)
	{
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavLoad:
	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsLoad:
		has_wmma_return_values = impl.ags.num_instructions == 10;
		if (has_wmma_return_values)
		{
			type_id = build_coopmat_type(impl, impl.ags.instructions[1].immediate, false);
			phase = 2;
		}
		break;

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixCopy:
		if (impl.ags.current_phase == 1)
		{
			if (impl.ags.num_instructions > 5)
			{
				// Apparently some shaders encode dummy inputs? Shift away useless stuff either way.
				memmove(impl.ags.instructions, impl.ags.instructions + (impl.ags.num_instructions - 5),
				        5 * sizeof(impl.ags.instructions[0]));
				memmove(impl.ags.backdoor_instructions, impl.ags.backdoor_instructions + (impl.ags.num_instructions - 5),
				        5 * sizeof(impl.ags.backdoor_instructions[0]));
				impl.ags.num_instructions = 5;
			}
		}
		has_wmma_return_values = impl.ags.num_instructions == 13;
		if (has_wmma_return_values)
		{
			uint32_t output_immediate = 0;
			if (!get_constant_operand(impl.ags.backdoor_instructions[4], 5, &output_immediate))
				return false;
			type_id = build_coopmat_type(impl, output_immediate, false);
			phase = 2;
		}
		break;

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixMulAcc:
		has_wmma_return_values = impl.ags.num_instructions == 21;
		if (has_wmma_return_values)
		{
			auto opcode = (impl.ags.instructions[12].immediate >> AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_OpsShift) &
			              AmdExtD3DShaderIntrinsicsWaveMatrixOpcode_OpsMask;
			type_id = get_matmul_result_type(impl, opcode);
			phase = 2;
		}
		break;

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixFill:
		has_wmma_return_values = impl.ags.num_instructions == 9;
		if (has_wmma_return_values)
		{
			type_id = build_coopmat_type(impl, impl.ags.instructions[0].immediate, false);
			phase = 1;
		}
		break;

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementFill:
		 has_wmma_return_values = impl.ags.num_instructions == 13;
		 if (has_wmma_return_values)
		 {
			 type_id = build_coopmat_type(impl, impl.ags.instructions[4].immediate, false);
			 // FSR4 workaround for RDNA3.
			 analyze_dubious_implementation_defined_column_behavior(
			     impl, impl.ags.backdoor_instructions[4]->getOperand(6));
			 phase = 2;
		 }
		 break;

	default:
		break;
	}

	if (has_wmma_return_values)
		return emit_wmma_return_values(impl, type_id, 0, phase);
	else
		return true;
}

bool emit_magic_ags_instruction(Converter::Impl &impl, const llvm::CallInst *instruction)
{
	auto &builder = impl.builder();
	impl.push_ags_instruction(instruction);

	// We might be able to retire an instruction now.
	// Only support exactly what we need to support. Anything else will fail compilation.
	if (impl.ags.num_instructions == 0)
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
		impl.ags.num_instructions = 0;
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
		impl.ags.num_instructions = 0;
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_AtomicU64:
	{
		spv::Op atomic_op = spv::OpNop;
		if (impl.ags.num_instructions == 3)
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

			bool ret = false;

			// Magic 64-bit image atomics.
			if ((impl.ags.active_uav_op == DXIL::Op::TextureStore ||
			     impl.ags.active_uav_op == DXIL::Op::BufferStore) && impl.ags.active_uav_ptr)
			{
				ret = emit_magic_ags_atomic_u64(impl, impl.ags.active_uav_ptr, atomic_op, instruction);
			}
			else
			{
				LOGE("Attempting to use AGS U64 atomic on unknown resource type.\n");
			}

			impl.ags.num_instructions = 0;
			return ret;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavLoad:
	{
		if (impl.ags.num_instructions == 10)
		{
			if (!emit_wmma_load(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixUavStore:
	{
		if (impl.ags.num_instructions == 6)
		{
			if (!emit_wmma_store(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixCopy:
	{
		if (impl.ags.current_phase == 1)
		{
			if (impl.ags.num_instructions > 5)
			{
				// Apparently some shaders encode dummy inputs? Shift away useless stuff either way.
				memmove(impl.ags.instructions, impl.ags.instructions + (impl.ags.num_instructions - 5),
				        5 * sizeof(impl.ags.instructions[0]));
				memmove(impl.ags.backdoor_instructions, impl.ags.backdoor_instructions + (impl.ags.num_instructions - 5),
				        5 * sizeof(impl.ags.backdoor_instructions[0]));
				impl.ags.num_instructions = 5;
			}
		}

		if (impl.ags.num_instructions == 13)
		{
			if (!emit_wmma_convert(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsLoad:
	{
		if (impl.ags.num_instructions == 10)
		{
			if (!emit_wmma_load(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLdsStore:
	{
		if (impl.ags.num_instructions == 6)
		{
			if (!emit_wmma_store(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixMulAcc:
	{
		if (impl.ags.num_instructions == 21)
		{
			if (!emit_wmma_muladd(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixFill:
	{
		if (impl.ags.num_instructions == 9)
		{
			if (!emit_wmma_fill(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementFill:
	{
		if (impl.ags.num_instructions == 13)
		{
			if (!emit_wmma_element_insert(impl))
				return false;
			impl.ags.num_instructions = 0;
		}
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixLength:
	{
		if (!emit_wmma_length(impl))
			return false;
		impl.ags.num_instructions = 0;
		break;
	}

	case AmdExtD3DShaderIntrinsicsOpcode_WaveMatrixElementExtract:
	{
		if (impl.ags.num_instructions == 5)
		{
			if (!emit_wmma_element_extract(impl))
				return false;
			impl.ags.num_instructions = 0;
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
