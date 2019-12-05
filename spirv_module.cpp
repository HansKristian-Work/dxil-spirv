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

#include "spirv_module.hpp"
#include "SpvBuilder.h"
#include "node.hpp"
#include <unordered_map>

namespace DXIL2SPIRV
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
	spv::Instruction *entry_point = nullptr;

	void emit_entry_point(spv::ExecutionModel model, const char *name);
	void emit_workgroup_size(uint32_t x, uint32_t y, uint32_t z);
	bool finalize_spirv(std::vector<uint32_t> &spirv);

	void register_block(CFGNode *node) override;
	void emit_basic_block(CFGNode *node) override;
	void emit_function_body(CFGStructurizer &structurizer);
	static spv::Block *get_spv_block(CFGNode *node);

	void enable_shader_discard();
	void build_discard_call_early();
	void build_discard_call_exit();
	spv::Function *discard_function = nullptr;
	spv::Id discard_state_var_id = 0;

	spv::Id get_builtin_shader_input(spv::BuiltIn builtin);
	void register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin);
	std::unordered_map<spv::BuiltIn, spv::Id> builtins;

	spv::Id get_type_for_builtin(spv::BuiltIn builtin);
};

spv::Id SPIRVModule::Impl::get_type_for_builtin(spv::BuiltIn builtin)
{
	switch (builtin)
	{
	case spv::BuiltInSampleMask:
		return builder.makeArrayType(builder.makeUintType(32), builder.makeUintConstant(1), 0);

	case spv::BuiltInLocalInvocationIndex:
	case spv::BuiltInSampleId:
		return builder.makeUintType(32);

	case spv::BuiltInGlobalInvocationId:
	case spv::BuiltInLocalInvocationId:
	case spv::BuiltInWorkgroupId:
		return builder.makeVectorType(builder.makeUintType(32), 3);

	default:
		return 0;
	}
}

void SPIRVModule::Impl::register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin)
{
	builtins[builtin] = id;
}

spv::Id SPIRVModule::Impl::get_builtin_shader_input(spv::BuiltIn builtin)
{
	auto itr = builtins.find(builtin);
	if (itr != builtins.end())
		return itr->second;

	spv::Id var_id = builder.createVariable(spv::StorageClassInput, get_type_for_builtin(builtin));
	builder.addDecoration(var_id, spv::DecorationBuiltIn, builtin);
	entry_point->addIdOperand(var_id);
	builtins[builtin] = var_id;
	return var_id;
}

spv::Block *SPIRVModule::Impl::get_spv_block(CFGNode *node)
{
	return static_cast<spv::Block *>(node->userdata);
}

void SPIRVModule::Impl::emit_entry_point(spv::ExecutionModel model, const char *name)
{
	builder.addCapability(spv::Capability::CapabilityShader);
	builder.setMemoryModel(spv::AddressingModel::AddressingModelLogical, spv::MemoryModel::MemoryModelGLSL450);

	entry_function = builder.makeEntryPoint("main");
	entry_point = builder.addEntryPoint(model, entry_function, name);
	if (model == spv::ExecutionModel::ExecutionModelFragment)
		builder.addExecutionMode(entry_function, spv::ExecutionMode::ExecutionModeOriginUpperLeft);
}

void SPIRVModule::Impl::enable_shader_discard()
{
	if (!discard_state_var_id)
	{
		auto *current_build_point = builder.getBuildPoint();
		discard_state_var_id = builder.createVariable(spv::StorageClassPrivate, builder.makeBoolType(), "discard_state");
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
		discard_function = builder.makeFunctionEntry(spv::NoPrecision, builder.makeVoidType(),
		                                             "discard_exit", {}, {}, &entry);

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

void SPIRVModule::emit_entry_point(spv::ExecutionModel model, const char *name)
{
	impl->emit_entry_point(model, name);
}

void SPIRVModule::emit_workgroup_size(uint32_t x, uint32_t y, uint32_t z)
{
	impl->emit_workgroup_size(x, y, z);
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
		auto *bb = new spv::Block(builder.getUniqueId(), *entry_function);
		entry_function->addBlock(bb);
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
		auto phi_op = std::make_unique<spv::Instruction>(phi.id, phi.type_id, spv::OpPhi);
		for (auto &incoming : phi.incoming)
		{
			phi_op->addIdOperand(incoming.id);
			phi_op->addIdOperand(incoming.block->id);
		}
		bb->addInstruction(std::move(phi_op));
	}

	// Emit opcodes.
	for (auto &op : ir.operations)
	{
		if (op.op == spv::OpDemoteToHelperInvocationEXT)
		{
			build_discard_call_early();
		}
		else
		{
			if (!op.arguments.empty())
			{
				auto inst = std::make_unique<spv::Instruction>(op.id, op.type_id, op.op);
				for (auto &arg : op.arguments)
					inst->addIdOperand(arg);
				bb->addInstruction(std::move(inst));
			}
			else
			{
				auto inst = std::make_unique<spv::Instruction>(op.op);
				bb->addInstruction(std::move(inst));
			}
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
			auto *continue_bb = new spv::Block(builder.getUniqueId(), *entry_function);
			entry_function->addBlock(continue_bb);
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

void SPIRVModule::Impl::emit_function_body(CFGStructurizer &structurizer)
{
	structurizer.traverse(*this);

	builder.setBuildPoint(entry_function->getEntryBlock());
	builder.createBranch(get_spv_block(structurizer.get_entry_block()));
	builder.leaveFunction();
}

void SPIRVModule::Impl::emit_workgroup_size(uint32_t x, uint32_t y, uint32_t z)
{
	builder.addExecutionMode(entry_function, spv::ExecutionModeLocalSize, x, y, z);
}

void SPIRVModule::emit_function_body(CFGStructurizer &structurizer)
{
	impl->emit_function_body(structurizer);
}

spv::Builder &SPIRVModule::get_builder()
{
	return impl->builder;
}

spv::Instruction *SPIRVModule::get_entry_point()
{
	return impl->entry_point;
}

uint32_t SPIRVModule::allocate_id()
{
	return impl->builder.getUniqueId();
}

uint32_t SPIRVModule::allocate_ids(uint32_t count)
{
	return impl->builder.getUniqueIds(count);
}

void SPIRVModule::enable_shader_discard()
{
	impl->enable_shader_discard();
}

spv::Id SPIRVModule::get_builtin_shader_input(spv::BuiltIn builtin)
{
	return impl->get_builtin_shader_input(builtin);
}

void SPIRVModule::register_builtin_shader_input(spv::Id id, spv::BuiltIn builtin)
{
	impl->register_builtin_shader_input(id, builtin);
}

SPIRVModule::~SPIRVModule()
{
}
} // namespace DXIL2SPIRV
