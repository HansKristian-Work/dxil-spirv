/* Copyright (c) 2025 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 */

#pragma once
#include "opcodes/opcodes.hpp"

namespace dxil_spv
{
enum
{
	NVAPI_ARGUMENT_OPCODE = 0,
	NVAPI_ARGUMENT_RID = 1,
	NVAPI_ARGUMENT_SID = 2,
	NVAPI_ARGUMENT_DST1U = 3,
	NVAPI_ARGUMENT_SRC3U = 7,
	NVAPI_ARGUMENT_SRC4U = 11,
	NVAPI_ARGUMENT_SRC5U = 15,
	NVAPI_ARGUMENT_SRC0U = 19,
	NVAPI_ARGUMENT_SRC1U = 23,
	NVAPI_ARGUMENT_SRC2U = 27,
	NVAPI_ARGUMENT_DST0U = 31,
	NVAPI_ARGUMENT_MARK_UAV_REF = 35,
	NVAPI_ARGUMENT_NUM_OUTPUTS_FOR_INC_COUNTER = 36,
	NVAPI_ARGUMENT_COUNT
};

enum
{
	NVAPI_INTERMEDIATE_HANDLE_0 = 0,
	NVAPI_INTERMEDIATE_HANDLE_1 = 1,
	NVAPI_INTERMEDIATE_ATTRIBUTES = 2,
	NVAPI_INTERMEDIATE_COUNT
};

// Don't conflict with sentinel index for SM 6.6 heap.
static constexpr uint32_t NVAPI_MAGIC_RESOURCE_SENTINEL = UINT32_MAX - 1;

struct NVAPIState
{
	spv::Id magic_ptr_id = 0;
	const llvm::Value *doorbell = nullptr;
	unsigned uav_magic_resource_type_index = NVAPI_MAGIC_RESOURCE_SENTINEL;

	const llvm::Value *fake_doorbell_inputs[NVAPI_ARGUMENT_COUNT] = {};
	const llvm::Value *fake_doorbell_intermediates[NVAPI_INTERMEDIATE_COUNT] = {};
	spv::Id fake_doorbell_outputs[NVAPI_ARGUMENT_COUNT] = {};
	const llvm::Value *marked_uav = nullptr;

	spv::Id hit_object_srb_ptr = 0;
	spv::Id hit_object_srb_member_ptr = 0;

	unsigned deferred_opcode = 0;

	void reset();
	void reset_analysis() {}
	void notify_doorbell(Converter::Impl &impl, const llvm::CallInst *instruction, bool analysis);
	bool can_commit_opcode();
	bool commit_opcode(Converter::Impl &impl, bool analysis);

	// Some opcodes expect to read outputs by iteratively calling IncrementCounter().
	unsigned clock_output_index = 0;
	unsigned num_expected_clock_outputs = 0;

	bool write_arguments_from_store(Converter::Impl &impl, const llvm::CallInst *instruction, bool analysis);
	bool mark_uav_write(const llvm::CallInst *instruction);
};

// IncrementCounter is the doorbell opcode for NVAPI.
bool analyze_nvapi_buffer_update_counter(Converter::Impl &impl, const llvm::CallInst *instruction);
bool nvapi_buffer_update_counter_filter(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_nvapi_buffer_update_counter(Converter::Impl &impl, const llvm::CallInst *instruction, spv::Id id);

bool analyze_nvapi_call_shader(Converter::Impl &impl, const llvm::CallInst *instruction);
bool analyze_nvapi_trace_ray(Converter::Impl &impl, const llvm::CallInst *instruction);

bool emit_nvapi_call_shader(Converter::Impl &impl, const llvm::CallInst *instruction);
bool emit_nvapi_trace_ray(Converter::Impl &impl, const llvm::CallInst *instruction);

struct AccessTracking;
bool analyze_nvapi_buffer_load(Converter::Impl &impl, const llvm::CallInst *instruction, AccessTracking *tracking);
void analyze_nvapi_buffer_store(Converter::Impl &impl, const llvm::CallInst *instruction, AccessTracking *tracking, DXIL::Op opcode);

bool emit_nvapi_buffer_load(Converter::Impl &impl, const llvm::CallInst *instruction, DXIL::Op opcode);
bool emit_nvapi_buffer_store(Converter::Impl &impl, const llvm::CallInst *instruction, spv::Id id);

bool emit_nvapi_resource_uav_handle(Converter::Impl &impl, const llvm::CallInst *instruction, uint32_t resource_range);
}