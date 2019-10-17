#include "dxil_converter.hpp"
#include <utility>

using namespace llvm;

namespace DXIL2SPIRV
{
Converter::Converter(const DXILContainerParser &container_parser_, LLVMBCParser bitcode_parser_)
	: container_parser(container_parser_), bitcode_parser(std::move(bitcode_parser_))
{
}

}