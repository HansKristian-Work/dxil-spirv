/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

#include "spirv_module.hpp"
#include "SpvBuilder.h"
#include "node.hpp"
#include "scratch_pool.hpp"
#include <unordered_map>

namespace dxil_spv
{
constexpr uint32_t GENERATOR = 1967215134;
struct SPIRVModule::Impl : BlockEmissionInterface
{
	Impl()
	    : builder(GENERATOR, &build_logger)
	{
	}

	spv::SpvBuildLogger build_logger;
	spv::Builder builder;
	spv::Function *entry_function = nullptr;
	spv::Function *active_function = nullptr;
	spv::Instruction *entry_point = nullptr;

	void emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage);
	bool finalize_spirv(std::vector<uint32_t> &spirv);

	void register_block(CFGNode *node) override;
	void emit_basic_block(CFGNode *node) override;
	void emit_entry_point_function_body(CFGStructurizer &structurizer);
	void emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer);
	static spv::Block *get_spv_block(CFGNode *node);

	void enable_shader_discard(bool supports_demote);
	void build_discard_call_early();
	void build_discard_call_exit();
	spv::Function *discard_function = nullptr;
	spv::Id discard_state_var_id = 0;

	struct
	{
		bool supports_demote = false;
	} caps;

	spv::Id get_builtin_shader_input(spv::BuiltIn builtin);
	spv::Id get_builtin_shader_output(spv::BuiltIn builtin);
	void register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const;
	void register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin);
	bool query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const;
	std::unordered_map<spv::BuiltIn, spv::Id> builtins_input;
	std::unordered_map<spv::Id, spv::BuiltIn> id_to_builtin_input;
	std::unordered_map<spv::BuiltIn, spv::Id> builtins_output;
	std::unordered_map<spv::Id, spv::BuiltIn> id_to_builtin_output;

	spv::Id get_type_for_builtin(spv::BuiltIn builtin);
	ScratchPool<Operation> operation_pool;
};

spv::Id SPIRVModule::Impl::get_type_for_builtin(spv::BuiltIn builtin)
{
	switch (builtin)
	{
	case spv::BuiltInSampleMask:
		return builder.makeArrayType(builder.makeUintType(32), builder.makeUintConstant(1), 0);

	case spv::BuiltInTessCoord:
		return builder.makeVectorType(builder.makeFloatType(32), 3);

	case spv::BuiltInLocalInvocationIndex:
	case spv::BuiltInSampleId:
	case spv::BuiltInVertexIndex:
	case spv::BuiltInInstanceIndex:
	case spv::BuiltInBaseVertex:
	case spv::BuiltInBaseInstance:
	case spv::BuiltInInvocationId:
	case spv::BuiltInPrimitiveId:
		return builder.makeUintType(32);

	case spv::BuiltInSubgroupSize:
	case spv::BuiltInSubgroupLocalInvocationId:
		builder.addCapability(spv::CapabilityGroupNonUniform);
		return builder.makeUintType(32);

	case spv::BuiltInGlobalInvocationId:
	case spv::BuiltInLocalInvocationId:
	case spv::BuiltInWorkgroupId:
	case spv::BuiltInLaunchIdKHR:
	case spv::BuiltInLaunchSizeKHR:
		return builder.makeVectorType(builder.makeUintType(32), 3);

	case spv::BuiltInObjectRayOriginKHR:
	case spv::BuiltInWorldRayOriginKHR:
	case spv::BuiltInObjectRayDirectionKHR:
	case spv::BuiltInWorldRayDirectionKHR:
		return builder.makeVectorType(builder.makeFloatType(32), 3);

	case spv::BuiltInRayTminKHR:
	case spv::BuiltInRayTmaxKHR:
		return builder.makeFloatType(32);

	case spv::BuiltInWorldToObjectKHR:
	case spv::BuiltInObjectToWorldKHR:
		return builder.makeMatrixType(builder.makeFloatType(32), 4, 3);

	case spv::BuiltInInstanceCustomIndexKHR:
	case spv::BuiltInInstanceId:
	case spv::BuiltInRayGeometryIndexKHR:
		return builder.makeUintType(32);

	default:
		return 0;
	}
}

void SPIRVModule::Impl::register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin)
{
	builtins_input[builtin] = id;
	id_to_builtin_input[id] = builtin;
}

void SPIRVModule::Impl::register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin)
{
	builtins_output[builtin] = id;
	id_to_builtin_output[id] = builtin;
}

bool SPIRVModule::Impl::query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const
{
	auto itr = id_to_builtin_input.find(id);
	if (itr != id_to_builtin_input.end())
	{
		*builtin = itr->second;
		return true;
	}
	else
		return false;
}

bool SPIRVModule::Impl::query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const
{
	auto itr = id_to_builtin_output.find(id);
	if (itr != id_to_builtin_output.end())
	{
		*builtin = itr->second;
		return true;
	}
	else
		return false;
}

spv::Id SPIRVModule::Impl::get_builtin_shader_input(spv::BuiltIn builtin)
{
	auto itr = builtins_input.find(builtin);
	if (itr != builtins_input.end())
		return itr->second;

	spv::Id var_id = builder.createVariable(spv::StorageClassInput, get_type_for_builtin(builtin));
	builder.addDecoration(var_id, spv::DecorationBuiltIn, builtin);
	entry_point->addIdOperand(var_id);
	register_builtin_shader_input(var_id, builtin);
	return var_id;
}

spv::Id SPIRVModule::Impl::get_builtin_shader_output(spv::BuiltIn builtin)
{
	auto itr = builtins_output.find(builtin);
	if (itr != builtins_output.end())
		return itr->second;
	else
		return 0;
}

spv::Block *SPIRVModule::Impl::get_spv_block(CFGNode *node)
{
	return static_cast<spv::Block *>(node->userdata);
}

void SPIRVModule::Impl::emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage)
{
	builder.addCapability(spv::Capability::CapabilityShader);

	if (physical_storage)
	{
		builder.setMemoryModel(spv::AddressingModel::AddressingModelPhysicalStorageBuffer64, spv::MemoryModelGLSL450);
		builder.addCapability(spv::CapabilityPhysicalStorageBufferAddresses);
		builder.addExtension("SPV_KHR_physical_storage_buffer");
	}
	else
		builder.setMemoryModel(spv::AddressingModel::AddressingModelLogical, spv::MemoryModel::MemoryModelGLSL450);

	entry_function = builder.makeEntryPoint("main");
	entry_point = builder.addEntryPoint(model, entry_function, name);
	if (model == spv::ExecutionModel::ExecutionModelFragment)
		builder.addExecutionMode(entry_function, spv::ExecutionMode::ExecutionModeOriginUpperLeft);
}

void SPIRVModule::Impl::enable_shader_discard(bool supports_demote)
{
	caps.supports_demote = supports_demote;
	if (!discard_state_var_id && !caps.supports_demote)
	{
		auto *current_build_point = builder.getBuildPoint();
		discard_state_var_id =
		    builder.createVariable(spv::StorageClassPrivate, builder.makeBoolType(), "discard_state");
		builder.setBuildPoint(entry_function->getEntryBlock());
		builder.createStore(builder.makeBoolConstant(false), discard_state_var_id);
		builder.setBuildPoint(current_build_point);
	}
}

void SPIRVModule::Impl::build_discard_call_early()
{
	builder.createStore(builder.makeBoolConstant(true), discard_state_var_id);
}

void SPIRVModule::Impl::build_discard_call_exit()
{
	auto *current_build_point = builder.getBuildPoint();

	if (!discard_function)
	{
		spv::Block *entry = nullptr;
		discard_function =
		    builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(), "discard_exit", {}, {}, &entry);

		auto *true_block = new spv::Block(builder.getUniqueId(), *discard_function);
		auto *false_block = new spv::Block(builder.getUniqueId(), *discard_function);

		builder.setBuildPoint(entry);
		spv::Id loaded_state = builder.createLoad(discard_state_var_id);
		builder.createSelectionMerge(false_block, 0);
		builder.createConditionalBranch(loaded_state, true_block, false_block);
		true_block->addInstruction(std::make_unique<spv::Instruction>(spv::OpKill));
		builder.setBuildPoint(false_block);
		builder.makeReturn(false);
	}

	builder.setBuildPoint(current_build_point);
	builder.createFunctionCall(discard_function, {});
}

SPIRVModule::SPIRVModule()
{
	impl = std::make_unique<Impl>();
}

void SPIRVModule::emit_entry_point(spv::ExecutionModel model, const char *name, bool physical_storage)
{
	impl->emit_entry_point(model, name, physical_storage);
}

bool SPIRVModule::Impl::finalize_spirv(std::vector<uint32_t> &spirv)
{
	builder.dump(spirv);
	if (spirv.size() >= 2)
	{
		static const unsigned int Version_1_3 = 0x00010300;
		spirv[1] = Version_1_3;
	}
	return true;
}

void SPIRVModule::Impl::register_block(CFGNode *node)
{
	if (!node->userdata || node->id == 0)
	{
		auto *bb = new spv::Block(builder.getUniqueId(), *active_function);
#if 0
		if (!node->name.empty())
			builder.addName(bb->getId(), node->name.c_str());
#endif
		active_function->addBlock(bb);
		node->id = bb->getId();
		node->userdata = bb;
	}
}

void SPIRVModule::Impl::emit_basic_block(CFGNode *node)
{
	auto *bb = get_spv_block(node);
	auto &ir = node->ir;

	builder.setBuildPoint(bb);

	// Emit phi nodes.
	for (auto &phi : ir.phi)
	{
		if (!phi.id)
			continue;

		auto phi_op = std::make_unique<spv::Instruction>(phi.id, phi.type_id, spv::OpPhi);
		for (auto &incoming : phi.incoming)
		{
			phi_op->addIdOperand(incoming.id);
			phi_op->addIdOperand(incoming.block->id);
		}
		bb->addInstruction(std::move(phi_op));
	}

	// Emit opcodes.
	for (auto *op : ir.operations)
	{
		if (op->op == spv::OpDemoteToHelperInvocationEXT && !caps.supports_demote)
		{
			build_discard_call_early();
		}
		else
		{
			if (op->op == spv::OpDemoteToHelperInvocationEXT)
			{
				builder.addExtension("SPV_EXT_demote_to_helper_invocation");
				builder.addCapability(spv::CapabilityDemoteToHelperInvocationEXT);
			}

			std::unique_ptr<spv::Instruction> inst;
			if (op->id != 0)
				inst = std::make_unique<spv::Instruction>(op->id, op->type_id, op->op);
			else
				inst = std::make_unique<spv::Instruction>(op->op);

			unsigned literal_mask = op->get_literal_mask();

			for (auto &arg : *op)
			{
				if (literal_mask & 1u)
					inst->addImmediateOperand(arg);
				else
				{
					assert(arg);
					inst->addIdOperand(arg);
				}
				literal_mask >>= 1u;
			}
			bb->addInstruction(std::move(inst));
		}
	}

	// Emit structured merge information.
	switch (ir.merge_info.merge_type)
	{
	case MergeType::Selection:
		builder.createSelectionMerge(get_spv_block(ir.merge_info.merge_block), 0);
		break;

	case MergeType::Loop:
		if (ir.merge_info.continue_block)
		{
			builder.createLoopMerge(get_spv_block(ir.merge_info.merge_block),
			                        get_spv_block(ir.merge_info.continue_block), 0);
		}
		else
		{
			auto *continue_bb = new spv::Block(builder.getUniqueId(), *active_function);
			active_function->addBlock(continue_bb);
			builder.setBuildPoint(continue_bb);
			builder.createBranch(get_spv_block(node));
			builder.setBuildPoint(bb);
			builder.createLoopMerge(get_spv_block(ir.merge_info.merge_block), continue_bb, 0);
			break;
		}
		break;

	default:
		break;
	}

	// Emit terminator.
	switch (ir.terminator.type)
	{
	case Terminator::Type::Unreachable:
	{
		auto unreachable_op = std::make_unique<spv::Instruction>(spv::OpUnreachable);
		bb->addInstruction(std::move(unreachable_op));
		break;
	}

	case Terminator::Type::Branch:
	{
		builder.createBranch(get_spv_block(ir.terminator.direct_block));
		break;
	}

	case Terminator::Type::Condition:
	{
		builder.createConditionalBranch(ir.terminator.conditional_id, get_spv_block(ir.terminator.true_block),
		                                get_spv_block(ir.terminator.false_block));
		break;
	}

	case Terminator::Type::Switch:
	{
		auto switch_op = std::make_unique<spv::Instruction>(spv::OpSwitch);
		switch_op->addIdOperand(ir.terminator.conditional_id);
		switch_op->addIdOperand(ir.terminator.default_node->id);
		get_spv_block(ir.terminator.default_node)->addPredecessor(bb);
		for (auto &switch_case : ir.terminator.cases)
		{
			switch_op->addImmediateOperand(switch_case.value);
			switch_op->addIdOperand(switch_case.node->id);
			get_spv_block(switch_case.node)->addPredecessor(bb);
		}
		bb->addInstruction(std::move(switch_op));
		break;
	}

	case Terminator::Type::Kill:
	{
		auto kill_op = std::make_unique<spv::Instruction>(spv::OpKill);
		bb->addInstruction(std::move(kill_op));
		break;
	}

	case Terminator::Type::Return:
	{
		if (discard_state_var_id)
			build_discard_call_exit();
		builder.makeReturn(false, ir.terminator.return_value);
		break;
	}

	default:
		break;
	}
}

bool SPIRVModule::finalize_spirv(std::vector<uint32_t> &spirv)
{
	return impl->finalize_spirv(spirv);
}

void SPIRVModule::Impl::emit_entry_point_function_body(CFGStructurizer &structurizer)
{
	active_function = entry_function;
	{
		structurizer.traverse(*this);
		builder.setBuildPoint(active_function->getEntryBlock());
		builder.createBranch(get_spv_block(structurizer.get_entry_block()));
		builder.leaveFunction();
	}
	active_function = nullptr;
}

void SPIRVModule::Impl::emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer)
{
	active_function = func;
	{
		structurizer.traverse(*this);
		builder.setBuildPoint(active_function->getEntryBlock());
		builder.createBranch(get_spv_block(structurizer.get_entry_block()));
		builder.leaveFunction();
	}
	active_function = nullptr;
}

void SPIRVModule::emit_entry_point_function_body(CFGStructurizer &structurizer)
{
	impl->emit_entry_point_function_body(structurizer);
}

void SPIRVModule::emit_leaf_function_body(spv::Function *func, CFGStructurizer &structurizer)
{
	impl->emit_leaf_function_body(func, structurizer);
}

spv::Builder &SPIRVModule::get_builder()
{
	return impl->builder;
}

spv::Instruction *SPIRVModule::get_entry_point()
{
	return impl->entry_point;
}

spv::Function *SPIRVModule::get_entry_function()
{
	return impl->entry_function;
}

uint32_t SPIRVModule::allocate_id()
{
	return impl->builder.getUniqueId();
}

uint32_t SPIRVModule::allocate_ids(uint32_t count)
{
	return impl->builder.getUniqueIds(count);
}

void SPIRVModule::enable_shader_discard(bool supports_demote)
{
	impl->enable_shader_discard(supports_demote);
}

spv::Id SPIRVModule::get_builtin_shader_input(spv::BuiltIn builtin)
{
	return impl->get_builtin_shader_input(builtin);
}

spv::Id SPIRVModule::get_builtin_shader_output(spv::BuiltIn builtin)
{
	return impl->get_builtin_shader_output(builtin);
}

void SPIRVModule::register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin)
{
	impl->register_builtin_shader_input(id, builtin);
}

void SPIRVModule::register_builtin_shader_output(spv::Id id, spv::BuiltIn builtin)
{
	impl->register_builtin_shader_output(id, builtin);
}

bool SPIRVModule::query_builtin_shader_input(spv::Id id, spv::BuiltIn *builtin) const
{
	return impl->query_builtin_shader_input(id, builtin);
}

bool SPIRVModule::query_builtin_shader_output(spv::Id id, spv::BuiltIn *builtin) const
{
	return impl->query_builtin_shader_output(id, builtin);
}

Operation *SPIRVModule::allocate_op()
{
	return impl->operation_pool.allocate();
}

Operation *SPIRVModule::allocate_op(spv::Op op)
{
	return impl->operation_pool.allocate(op);
}

Operation *SPIRVModule::allocate_op(spv::Op op, spv::Id id, spv::Id type_id)
{
	return impl->operation_pool.allocate(op, id, type_id);
}

SPIRVModule::~SPIRVModule()
{
}
} // namespace dxil_spv
