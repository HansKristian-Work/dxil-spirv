#include "dxil_parser.hpp"
#include "llvm_bitcode_parser.hpp"
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <vector>

#include <llvm/IR/Instructions.h>
#include <llvm/IR/BasicBlock.h>
#include <llvm/IR/CFG.h>

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

	llvm::NamedMDNode *meta = module->getNamedMetadata("llvm.ident");
	for (unsigned i = 0; i < meta->getNumOperands(); i++)
	{
		llvm::MDNode *op = meta->getOperand(i);
		fprintf(stderr,"Str: %s\n", llvm::cast<llvm::MDString>(op->getOperand(0))->getString().data());
	}

	{
		auto *meta = module->getNamedMetadata("dx.entryPoints");
		auto *node = meta->getOperand(0);
		fprintf(stderr,"Entry point: %s\n", llvm::cast<llvm::MDString>(node->getOperand(1))->getString().data());

		llvm::Function *func = module->getFunction(llvm::cast<llvm::MDString>(node->getOperand(1))->getString());
		assert(func);

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
}