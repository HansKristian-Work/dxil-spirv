#pragma once

#include <llvm/IR/LLVMContext.h>
#include <llvm/IR/Module.h>
#include <stddef.h>

namespace DXIL2SPIRV
{
class LLVMBCParser
{
public:
	LLVMBCParser();
	bool parse(const void *data, size_t size);
	llvm::Module &get_module();

private:
	std::unique_ptr<llvm::LLVMContext> context;
	std::unique_ptr<llvm::Module> module;
};
}