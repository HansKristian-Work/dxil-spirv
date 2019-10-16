#include "dxil_parser.hpp"
#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <vector>

#include <llvm/IR/Module.h>
#include <llvm/IRReader/IRReader.h>
#include <llvm/IR/LLVMContext.h>
#include <llvm/Support/SourceMgr.h>

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

	auto memory = llvm::WritableMemoryBuffer::getNewUninitMemBuffer(parser.get_bitcode_size());
	memcpy(memory->getBufferStart(), parser.get_bitcode_data(), parser.get_bitcode_size());

	llvm::SMDiagnostic error;
	llvm::LLVMContext context;
	auto module = llvm::parseIR(*memory, error, context);
	if (!module)
		return EXIT_FAILURE;
	module->print(llvm::errs(), nullptr);
}