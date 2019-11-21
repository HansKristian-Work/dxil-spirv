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

#include "dxil_converter.hpp"
#include <utility>
#include "SpvBuilder.h"
#include "cfg_structurizer.hpp"
#include "node_pool.hpp"
#include "node.hpp"

#include <llvm/IR/BasicBlock.h>
#include <llvm/IR/CFG.h>
#include <llvm/IR/Instructions.h>

using namespace llvm;

namespace DXIL2SPIRV
{
constexpr uint32_t GENERATOR = 1967215134;

struct Converter::Impl
{
	Impl(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_, SPIRVModule &module_)
		: container_parser(std::move(container_parser_)),
		  bitcode_parser(std::move(bitcode_parser_)),
		  spirv_module(module_)
	{
	}

	DXILContainerParser container_parser;
	LLVMBCParser bitcode_parser;
	SPIRVModule &spirv_module;

	struct BlockMeta
	{
		explicit BlockMeta(BasicBlock *bb_)
			: bb(bb_)
		{
		}

		BasicBlock *bb;
		CFGNode *node = nullptr;
	};
	std::vector<std::unique_ptr<BlockMeta>> metas;
	std::unordered_map<BasicBlock *, BlockMeta *> bb_map;
	std::unordered_map<const Value *, uint32_t> value_map;

	ConvertedFunction convert_entry_point();
	uint32_t get_id_for_value(const Value *value);
};

Converter::Converter(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_, SPIRVModule &module_)
{
	impl = std::make_unique<Impl>(std::move(container_parser_), std::move(bitcode_parser_), module_);
}

Converter::~Converter()
{
}

ConvertedFunction Converter::convert_entry_point()
{
	return impl->convert_entry_point();
}

uint32_t Converter::Impl::get_id_for_value(const Value *value)
{
	auto itr = value_map.find(value);
	if (itr != value_map.end())
		return itr->second;

	value_map[value] = spirv_module.allocate_id();
	return value_map[value];
}

ConvertedFunction Converter::Impl::convert_entry_point()
{
	ConvertedFunction result;
	result.node_pool = std::make_unique<CFGNodePool>();
	auto &pool = *result.node_pool;

	auto *module = &bitcode_parser.get_module();

	NamedMDNode *meta = module->getNamedMetadata("llvm.ident");
	for (unsigned i = 0; i < meta->getNumOperands(); i++)
	{
		MDNode *op = meta->getOperand(i);
		fprintf(stderr, "Str: %s\n", cast<llvm::MDString>(op->getOperand(0))->getString().data());
	}

	auto *ep_meta = module->getNamedMetadata("dx.entryPoints");
	auto *node = ep_meta->getOperand(0);
	fprintf(stderr, "Entry point: %s\n", cast<llvm::MDString>(node->getOperand(1))->getString().data());

	Function *func = module->getFunction(cast<llvm::MDString>(node->getOperand(1))->getString());
	assert(func);

	auto *entry = &func->getEntryBlock();
	auto entry_meta = std::make_unique<BlockMeta>(entry);
	bb_map[entry] = entry_meta.get();
	result.entry = pool.create_node();
	bb_map[entry]->node = result.entry;
	result.entry->name = entry->getName().data();
	metas.push_back(std::move(entry_meta));

	std::vector<BasicBlock *> to_process;
	std::vector<BasicBlock *> processing;
	to_process.push_back(entry);

	// Traverse the CFG and register all blocks in the pool.
	while (!to_process.empty())
	{
		std::swap(to_process, processing);
		for (auto *block : processing)
		{
			for (auto itr = succ_begin(block); itr != succ_end(block); ++itr)
			{
				auto *succ = *itr;
				if (!bb_map.count(succ))
				{
					to_process.push_back(succ);
					auto succ_meta = std::make_unique<BlockMeta>(succ);
					bb_map[succ] = succ_meta.get();
					auto *succ_node = pool.create_node();
					bb_map[succ]->node = succ_node;
					succ_node->name = succ->getName().data();
					metas.push_back(std::move(succ_meta));
				}

				bb_map[block]->node->add_branch(bb_map[succ]->node);
			}
		}
		processing.clear();
	}

	for (auto &key_value : bb_map)
	{
		BasicBlock *bb = key_value.first;
		CFGNode *node = key_value.second->node;

		// Scan opcodes.
		for (auto &instruction : *bb)
		{
			if (auto *phi_inst = dyn_cast<PHINode>(&instruction))
			{
				PHI phi;
				phi.id = get_id_for_value(phi_inst);
				phi.type_id = spirv_module.get_builder().makeIntegerType(32, false);

				unsigned count = phi_inst->getNumIncomingValues();
				for (unsigned i = 0; i < count; i++)
				{
					IncomingValue incoming = {};
					incoming.block = bb_map[phi_inst->getIncomingBlock(i)]->node;
					auto *value = phi_inst->getIncomingValue(i);
					if (isa<PHINode>(value))
						incoming.id = get_id_for_value(value);
					else
					{
						// Just invent something ...
						incoming.id = spirv_module.get_builder().makeUintConstant(phi.id);
					}
					phi.incoming.push_back(incoming);
				}

				node->ir.phi.push_back(std::move(phi));
			}
		}

		auto *instruction = bb->getTerminator();
		if (auto *inst = dyn_cast<BranchInst>(instruction))
		{
			if (inst->isConditional())
			{
				node->ir.terminator.type = Terminator::Type::Condition;
				node->ir.terminator.conditional_id = spirv_module.get_builder().makeBoolConstant(true);
				assert(inst->getNumSuccessors() == 2);
				node->ir.terminator.true_block = bb_map[inst->getSuccessor(0)]->node;
				node->ir.terminator.false_block = bb_map[inst->getSuccessor(1)]->node;
			}
			else
			{
				node->ir.terminator.type = Terminator::Type::Branch;
				assert(inst->getNumSuccessors() == 1);
				node->ir.terminator.direct_block = bb_map[inst->getSuccessor(0)]->node;
			}
		}
		else if (auto *inst = dyn_cast<ReturnInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Return;
			if (inst->getReturnValue())
				node->ir.terminator.return_value = spirv_module.get_builder().makeBoolConstant(true);
		}
		else if (auto *inst = dyn_cast<UnreachableInst>(instruction))
		{
			node->ir.terminator.type = Terminator::Type::Unreachable;
		}
		else
			fprintf(stderr, "Unsupported terminator ...\n");
	}

#if 0
		BasicBlock &block = func->getEntryBlock();

		for (auto itr = succ_begin(&block); itr != succ_end(&block); ++itr)
		{
			fprintf(stderr, "Successor!\n");
		}

		//block.print(errs());

		for (auto itr = block.begin(); itr != block.end(); ++itr)
		{
			Instruction &inst = *itr;
			if (isa<llvm::CallInst>(inst))
			{
				fprintf(stderr, "Call!\n");
				auto &call = cast<llvm::CallInst>(inst);
				fprintf(stderr, "Calling %s\n", call.getCalledFunction()->getName().data());
				auto *constant = cast<llvm::ConstantInt>(call.getOperand(0));
				uint32_t value = constant->getZExtValue();
				fprintf(stderr, "Calling opcode: %u\n", value);

				call.setMetadata(0, MDNode::get(call.getContext(), MDString::get(call.getContext(), "OHAI")));
				fflush(stderr);
				cast<llvm::MDString>(call.getMetadata(0)->getOperand(0))->print(errs());
				fflush(stderr);
				//fprintf(stderr, "Value name: %s\n", call.getName().data());
			}
			else if (isa<llvm::ReturnInst>(inst))
				fprintf(stderr, "Return!\n");
			else if (isa<llvm::SelectInst>(inst))
				fprintf(stderr, "Select instruction!\n");
			else if (isa<llvm::CmpInst>(inst))
				fprintf(stderr, "Compare instruction!\n");
			else if (isa<llvm::BinaryOperator>(inst))
			{
				fprintf(stderr, "Binary operator!\n");
				auto &binop = cast<llvm::BinaryOperator>(inst);
				switch (binop.getOpcode())
				{
				case BinaryOperator::FAdd:
					fprintf(stderr, "FADD!\n");
					break;

				case BinaryOperator::FMul:
					fprintf(stderr, "FMul!\n");
					break;

				default:
					break;
				}
			}
			else
				fprintf(stderr, "? ...\n");
		}
	}
#endif

	return result;
}
} // namespace DXIL2SPIRV