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

#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <unordered_map>
#include <vector>

#include "cfg_structurizer.hpp"
#include "dxil_converter.hpp"
#include "spirv_module.hpp"

static std::vector<uint8_t> read_file(const char *path)
{
	FILE *file = fopen(path, "rb");
	if (!file)
		return {};

	fseek(file, 0, SEEK_END);
	auto len = ftell(file);
	rewind(file);
	std::vector<uint8_t> result(len);
	if (fread(result.data(), 1, len, file) != size_t(len))
	{
		fclose(file);
		return {};
	}

	fclose(file);
	return result;
}

#if 0
struct Emitter : DXIL2SPIRV::BlockEmissionInterface
{
	void emit_basic_block(uint32_t id, DXIL2SPIRV::CFGNode *, void *userdata,
	                      const DXIL2SPIRV::BlockEmissionInterface::MergeInfo &info) override;
	void emit_helper_block(uint32_t id, DXIL2SPIRV::CFGNode *, uint32_t next_id,
	                       const DXIL2SPIRV::BlockEmissionInterface::MergeInfo &info) override;

	const DXIL2SPIRV::CFGNodePool *pool = nullptr;
};

void Emitter::emit_basic_block(uint32_t id, DXIL2SPIRV::CFGNode *, void *userdata,
                               const BlockEmissionInterface::MergeInfo &info)
{
	auto *block = static_cast<llvm::BasicBlock *>(userdata);
	fprintf(stderr, "%u:\n", id);

	// Emit opcodes here ...

	switch (info.merge_type)
	{
	case DXIL2SPIRV::MergeType::Selection:
		fprintf(stderr, "    SelectionMerge -> %u\n", info.merge_block);
		break;

	case DXIL2SPIRV::MergeType::Loop:
		fprintf(stderr, "    LoopMerge -> %u, Continue <- %u\n", info.merge_block, info.continue_block);
		break;

	default:
		break;
	}

	if (block)
	{
		for (auto itr = llvm::succ_begin(block); itr != llvm::succ_end(block); ++itr)
		{
			auto *succ = *itr;
			fprintf(stderr, "  -> %u\n", pool->get_block_id(succ));
		}

		if (llvm::succ_begin(block) == llvm::succ_end(block))
			fprintf(stderr, "  -> Exit\n");
	}
	else
		fprintf(stderr, " ... Synthetic block\n");
}

void Emitter::emit_helper_block(uint32_t id, DXIL2SPIRV::CFGNode *, uint32_t next_id,
                                const BlockEmissionInterface::MergeInfo &info)
{
	fprintf(stderr, "%u:\n", id);
	if (next_id)
	{
		switch (info.merge_type)
		{
		case DXIL2SPIRV::MergeType::Selection:
			fprintf(stderr, "    SelectionMerge -> %u\n", info.merge_block);
			break;

		case DXIL2SPIRV::MergeType::Loop:
			fprintf(stderr, "    LoopMerge -> %u, Continue <- %u\n", info.merge_block, info.continue_block);
			break;

		default:
			break;
		}

		fprintf(stderr, "  -> %u\n", next_id);
	}
	else
	{
		fprintf(stderr, "  Unreachable\n");
	}
}
#endif

int main(int argc, char **argv)
{
	if (argc != 2)
		return EXIT_FAILURE;

	auto binary = read_file(argv[1]);
	if (binary.empty())
	{
		fprintf(stderr, "Failed to load file: %s\n", argv[1]);
		return EXIT_FAILURE;
	}

	DXIL2SPIRV::SPIRVModule spirv_module;

	DXIL2SPIRV::DXILContainerParser parser;
	if (!parser.parse_container(binary.data(), binary.size()))
	{
		fprintf(stderr, "Failed to parse DXIL archive.\n");
		return EXIT_FAILURE;
	}

	DXIL2SPIRV::LLVMBCParser bc_parser;
	if (!bc_parser.parse(parser.get_bitcode_data(), parser.get_bitcode_size()))
		return EXIT_FAILURE;

	auto *module = &bc_parser.get_module();
	module->print(llvm::errs(), nullptr);

	DXIL2SPIRV::Converter converter(std::move(parser), std::move(bc_parser), spirv_module);

	spirv_module.emit_entry_point(spv::ExecutionModel::ExecutionModelFragment, "main");
	auto entry_point = converter.convert_entry_point();

	DXIL2SPIRV::CFGStructurizer structurizer(entry_point.entry, *entry_point.node_pool, spirv_module);
	structurizer.run();
	spirv_module.emit_function_body(structurizer);

	std::vector<uint32_t> spirv;
	if (spirv_module.finalize_spirv(spirv))
	{
		FILE *file = fopen("/tmp/test.spv", "wb");
		if (file)
		{
			fwrite(spirv.data(), sizeof(uint32_t), spirv.size(), file);
			fclose(file);
		}
	}

#if 0
	llvm::BasicBlock &block = func->getEntryBlock();

	for (auto itr = llvm::succ_begin(&block); itr != llvm::succ_end(&block); ++itr)
	{
		fprintf(stderr, "Successor!\n");
	}

	//block.print(llvm::errs());

	for (auto itr = block.begin(); itr != block.end(); ++itr)
	{
		llvm::Instruction &inst = *itr;
		if (llvm::isa<llvm::CallInst>(inst))
		{
			fprintf(stderr, "Call!\n");
			auto &call = llvm::cast<llvm::CallInst>(inst);
			fprintf(stderr, "Calling %s\n", call.getCalledFunction()->getName().data());
			auto *constant = llvm::cast<llvm::ConstantInt>(call.getOperand(0));
			uint32_t value = constant->getZExtValue();
			fprintf(stderr, "Calling opcode: %u\n", value);

			call.setMetadata(0, llvm::MDNode::get(call.getContext(), llvm::MDString::get(call.getContext(), "OHAI")));
			fflush(stderr);
			llvm::cast<llvm::MDString>(call.getMetadata(0)->getOperand(0))->print(llvm::errs());
			fflush(stderr);
			//fprintf(stderr, "Value name: %s\n", call.getName().data());
		}
		else if (llvm::isa<llvm::ReturnInst>(inst))
			fprintf(stderr, "Return!\n");
		else if (llvm::isa<llvm::SelectInst>(inst))
			fprintf(stderr, "Select instruction!\n");
		else if (llvm::isa<llvm::CmpInst>(inst))
			fprintf(stderr, "Compare instruction!\n");
		else if (llvm::isa<llvm::BinaryOperator>(inst))
		{
			fprintf(stderr, "Binary operator!\n");
			auto &binop = llvm::cast<llvm::BinaryOperator>(inst);
			switch (binop.getOpcode())
			{
			case llvm::BinaryOperator::FAdd:
				fprintf(stderr, "FADD!\n");
				break;

			case llvm::BinaryOperator::FMul:
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