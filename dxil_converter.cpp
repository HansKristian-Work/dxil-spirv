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

using namespace llvm;

namespace DXIL2SPIRV
{
struct Converter::Impl
{
	Impl(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_)
		: container_parser(std::move(container_parser_)),
		  bitcode_parser(std::move(bitcode_parser_)),
		  builder(0, &build_logger)
	{
		setup_module();
	}

	DXILContainerParser container_parser;
	LLVMBCParser bitcode_parser;
	spv::SpvBuildLogger build_logger;
	spv::Builder builder;

	void setup_module();
	bool finalize_spirv(std::vector<uint32_t> &spirv);
};

Converter::Converter(DXILContainerParser container_parser_, LLVMBCParser bitcode_parser_)
{
	impl.reset(new Impl(std::move(container_parser_), std::move(bitcode_parser_)));
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

void Converter::Impl::setup_module()
{
	builder.addCapability(spv::Capability::CapabilityShader);
	builder.setMemoryModel(spv::AddressingModel::AddressingModelLogical,
	                       spv::MemoryModel::MemoryModelGLSL450);

	auto *function = builder.makeEntryPoint("main");
	builder.addEntryPoint(spv::ExecutionModel::ExecutionModelFragment, function, "main");
	builder.addExecutionMode(function, spv::ExecutionMode::ExecutionModeOriginUpperLeft);
	builder.makeReturn(false);
	builder.leaveFunction();
}

bool Converter::finalize_spirv(std::vector<uint32_t> &spirv)
{
	return impl->finalize_spirv(spirv);
}

} // namespace DXIL2SPIRV