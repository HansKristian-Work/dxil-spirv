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
#include "structurize_cfg.hpp"

#include <llvm/IR/BasicBlock.h>
#include <llvm/IR/CFG.h>
#include <llvm/IR/Instructions.h>

using namespace llvm;

namespace DXIL2SPIRV
{
constexpr uint32_t GENERATOR = 1967215134;

struct Converter::Impl : BlockEmissionInterface
{
	Impl(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_)
		: container_parser(std::move(container_parser_)),
		  bitcode_parser(std::move(bitcode_parser_)),
		  builder(GENERATOR, &build_logger)
	{
		setup_module();
	}

	DXILContainerParser container_parser;
	LLVMBCParser bitcode_parser;
	spv::SpvBuildLogger build_logger;
	spv::Builder builder;
	CFGNodePool pool;
	std::unique_ptr<CFGStructurizer> structurizer;
	spv::Function *function = nullptr;

	struct BlockMeta
	{
		explicit BlockMeta(BasicBlock *bb_)
			: bb(bb_)
		{
		}

		BasicBlock *bb;
		spv::Block *spv_block = nullptr;
		CFGNode *node = nullptr;
	};
	std::vector<std::unique_ptr<BlockMeta>> metas;
	std::unordered_map<BasicBlock *, BlockMeta *> bb_map;

	void setup_module();
	void structurize_module(BlockMeta *block);
	bool finalize_spirv(std::vector<uint32_t> &spirv);

	void emit_basic_block(CFGNode *node, const MergeInfo &info) override;
	void register_block(CFGNode *node) override;

	void emit_debug_basic_block(CFGNode *node, const MergeInfo &info);
	//void emit_helper_block(CFGNode *node, CFGNode *next_block, const MergeInfo &info) override;

	static spv::Block *get_spv_block(CFGNode *node);
};

Converter::Converter(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_)
{
	impl = std::make_unique<Impl>(std::move(container_parser_), std::move(bitcode_parser_));
}

Converter::~Converter()
{
}

bool Converter::Impl::finalize_spirv(std::vector<uint32_t> &spirv)
{
	builder.dump(spirv);
	if (spirv.size() >= 2)
	{
		static const unsigned int Version_1_3 = 0x00010300;
		spirv[1] = Version_1_3;
	}
	return true;
}

void Converter::Impl::register_block(CFGNode *node)
{
	auto *meta = static_cast<BlockMeta *>(node->userdata);

	// For internal blocks, we don't have userdata, so make it here.
	if (!meta)
	{
		auto dummy_meta = std::make_unique<BlockMeta>(nullptr);
		node->userdata = meta = dummy_meta.get();
		metas.push_back(std::move(dummy_meta));
	}

	if (!meta->spv_block)
	{
		meta->spv_block = new spv::Block(builder.getUniqueId(), *function);
		function->addBlock(meta->spv_block);
	}

	meta->node = node;
}

spv::Block *Converter::Impl::get_spv_block(CFGNode *node)
{
	auto *meta = static_cast<BlockMeta *>(node->userdata);
	return meta->spv_block;
}

void Converter::Impl::emit_debug_basic_block(CFGNode *node, const MergeInfo &info)
{
	auto *meta = static_cast<BlockMeta *>(node->userdata);
	fprintf(stderr, "%u (%s):\n", node->id, node->name.c_str());

	switch (info.merge_type)
	{
	case MergeType::Selection:
		fprintf(stderr, "    SelectionMerge -> %u (%s)\n",
		        info.merge_block->id,
		        info.merge_block->name.c_str());
		break;

	case MergeType::Loop:
		fprintf(stderr, "    LoopMerge -> %u (%s), Continue <- %u (%s)\n",
		        info.merge_block->id,
		        info.merge_block->name.c_str(),
		        info.continue_block->id,
		        info.continue_block->name.c_str());
		break;

	default:
		break;
	}

	for (auto *succ : node->succ)
		fprintf(stderr, "  -> %u (%s)\n", succ->id, succ->name.c_str());
	if (node->succ_back_edge)
		fprintf(stderr, " %s <- back edge\n", node->succ_back_edge->name.c_str());
}

void Converter::Impl::emit_basic_block(CFGNode *node, const MergeInfo &info)
{
	auto *block = get_spv_block(node);
	builder.setBuildPoint(block);

	// Emit block code here.

	// Emit merge information if any.
	switch (info.merge_type)
	{
	case MergeType::Selection:
	{
		builder.createSelectionMerge(get_spv_block(info.merge_block), 0);
		break;
	}

	case MergeType::Loop:
	{
		builder.createLoopMerge(get_spv_block(info.merge_block), get_spv_block(info.continue_block), 0);
		break;
	}

	default:
		break;
	}

	// Emit some dummy branch code.
	if (node->succ.empty())
	{
		builder.makeReturn(false);
	}
	else if (node->succ.size() == 1 && node->succ_back_edge)
	{
		spv::Id true_id = builder.makeBoolConstant(true);
		auto *true_block = get_spv_block(node->succ[0]);
		auto *false_block = get_spv_block(node->succ_back_edge);
		builder.createConditionalBranch(true_id, true_block, false_block);
	}
	else if (node->succ.size() == 1)
	{
		builder.createBranch(get_spv_block(node->succ[0]));
	}
	else if (node->succ.size() == 2)
	{
		spv::Id true_id = builder.makeBoolConstant(true);

		auto *true_block = get_spv_block(node->succ[0]);
		auto *false_block = get_spv_block(node->succ[1]);
		builder.createConditionalBranch(true_id, true_block, false_block);
	}

	emit_debug_basic_block(node, info);
}

void Converter::Impl::structurize_module(BlockMeta *entry)
{
	structurizer = std::make_unique<CFGStructurizer>(*pool.get_node_from_userdata(entry), pool);

	builder.addCapability(spv::Capability::CapabilityShader);
	builder.setMemoryModel(spv::AddressingModel::AddressingModelLogical,
	                       spv::MemoryModel::MemoryModelGLSL450);

	function = builder.makeEntryPoint("main");
	builder.addEntryPoint(spv::ExecutionModel::ExecutionModelFragment, function, "main");
	builder.addExecutionMode(function, spv::ExecutionMode::ExecutionModeOriginUpperLeft);

	structurizer->traverse(*this);

	builder.setBuildPoint(function->getEntryBlock());
	builder.createBranch(get_spv_block(pool.get_node_from_userdata(entry)));
	builder.leaveFunction();
}

void Converter::Impl::setup_module()
{
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
	pool.set_name(entry_meta.get(), entry->getName().data());
	metas.push_back(std::move(entry_meta));

	std::vector<BasicBlock *> to_process;
	std::vector<BasicBlock *> processing;
	to_process.push_back(entry);

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
					pool.set_name(succ_meta.get(), succ->getName().data());
					metas.push_back(std::move(succ_meta));
				}

				pool.add_branch(bb_map[block], bb_map[succ]);
			}
		}
		processing.clear();
	}

	structurize_module(bb_map[entry]);

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
}

bool Converter::finalize_spirv(std::vector<uint32_t> &spirv)
{
	return impl->finalize_spirv(spirv);
}

} // namespace DXIL2SPIRV