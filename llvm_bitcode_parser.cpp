#include "llvm_bitcode_parser.hpp"
#include <llvm/IRReader/IRReader.h>
#include <llvm/Support/SourceMgr.h>

namespace DXIL2SPIRV
{
LLVMBCParser::LLVMBCParser()
{
	context.reset(new llvm::LLVMContext);
}

bool LLVMBCParser::parse(const void *data, size_t size)
{
	auto memory = llvm::WritableMemoryBuffer::getNewUninitMemBuffer(size);
	memcpy(memory->getBufferStart(), data, size);

	llvm::SMDiagnostic error;
	module = llvm::parseIR(*memory, error, *context);
	if (!module)
	{
		error.print("DXIL", llvm::errs());
		return false;
	}

	return true;
}

llvm::Module &LLVMBCParser::get_module()
{
	return *module;
}
}