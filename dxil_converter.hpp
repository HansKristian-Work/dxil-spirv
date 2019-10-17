#pragma once

#include "llvm_bitcode_parser.hpp"
#include "dxil_parser.hpp"

namespace DXIL2SPIRV
{
class Converter
{
public:
	Converter(const DXILContainerParser &container_parser, LLVMBCParser bitcode_parser);

private:
	DXILContainerParser container_parser;
	LLVMBCParser bitcode_parser;
};
}