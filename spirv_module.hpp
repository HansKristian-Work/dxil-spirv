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

#include "thread_local_allocator.hpp"
#include "cfg_structurizer.hpp"
#include "ir.hpp"
#include "descriptor_qa.hpp"
#include <memory>

namespace spv
{
class Function;
class Builder;
class Instruction;

static constexpr spv::Op PseudoOpReturnCond = spv::Op(0x100000);
static constexpr spv::Op PseudoOpInstrumentExternallyVisibleStore = spv::Op(0x100001);
} // namespace spv

namespace dxil_spv
{
struct CFGNode;
class CFGNodePool;

enum class HelperCall
{
	DescriptorQACheck,
	WaveMatch,
	WaveMultiPrefixFAdd,
	WaveMultiPrefixIAdd,
	WaveMultiPrefixFMul,
	WaveMultiPrefixIMul,
	WaveMultiPrefixBitAnd,
	WaveMultiPrefixBitOr,
	WaveMultiPrefixBitXor,
	WaveMultiPrefixCountBits,
	RobustAtomicCounter,
	QuadAll,
	QuadAny,
	WaveIsFirstLaneMasked,
	WaveActiveAllEqualMasked,
	WaveReadFirstLaneMasked,
	AtomicImageR64Compact,
	AtomicImageArrayR64Compact,
	AtomicImageR64CompactNonUniform,
	AtomicImageArrayR64CompactNonUniform,
	FinishCrossGroupSharing,
	AllocateThreadNodeRecords,
	AllocateGroupNodeRecords,
	AllocateThreadNodeRecordsWaterfall,
	ThreadIncrementOutputCount,
	GroupIncrementOutputCount,
	NodeCoalescePayloadOffset,
	IsQuadUniformControlFlow
};

class SPIRVModule
{
public:
	SPIRVModule();
	~SPIRVModule();
	bool finalize_spirv(Vector<uint32_t> &spirv) const;

	uint32_t allocate_id();
	uint32_t allocate_ids(uint32_t count);

	void emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage);
	void emit_entry_point_function_body(CFGStructurizer &structurizer);
	void emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer);

	spv::Builder &get_builder();
	spv::Instruction *get_entry_point();
	spv::Function *get_entry_function();

	void enable_shader_discard(bool support_demote);
	spv::Id get_builtin_shader_input(spv::BuiltIn builtin);
	spv::Id get_builtin_shader_output(spv::BuiltIn builtin);
	bool has_builtin_shader_input(spv::BuiltIn builtin) const;
	bool has_builtin_shader_output(spv::BuiltIn builtin) const;
	void register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const;

	void register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const;

	Operation *allocate_op();
	Operation *allocate_op(spv::Op op);
	Operation *allocate_op(spv::Op op, spv::Id id, spv::Id type_id);

	spv::Id create_variable(spv::StorageClass storage, spv::Id type, const char *name = nullptr);
	spv::Id create_variable_with_initializer(spv::StorageClass storage, spv::Id type, spv::Id initializer,
	                                         const char *name = nullptr);

	spv::Id get_helper_call_id(HelperCall call, spv::Id type_id = 0);
	spv::Id get_helper_call_id(HelperCall call, const spv::Id *aux_ids, uint32_t aux_id_count);
	spv::Id get_robust_physical_cbv_load_call_id(spv::Id type_id, spv::Id ptr_type_id, unsigned alignment);
	void set_descriptor_qa_info(const DescriptorQAInfo &info);
	void set_instruction_instrumentation_info(const InstructionInstrumentationInfo &info);
	const DescriptorQAInfo &get_descriptor_qa_info() const;

	static bool opcode_is_control_dependent(spv::Op opcode);
	static bool opcode_has_side_effect_and_result(spv::Op opcode);

	void set_override_spirv_version(uint32_t version);
	void set_helper_lanes_participate_in_wave_ops(bool enable);

	void set_entry_build_point(spv::Function *func);

	DXIL_SPV_OVERRIDE_NEW_DELETE

private:
	struct Impl;
	std::unique_ptr<Impl> impl;
};
} // namespace dxil_spv
