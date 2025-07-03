/* Copyright (c) 2025 Hans-Kristian Arntzen for Valve Corporation
*
* SPDX-License-Identifier: MIT
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

#include "module.hpp"
#include "context.hpp"
#include "metadata.hpp"
#include "cast.hpp"
#include "function.hpp"
#include "instruction.hpp"

#include "../dxil.hpp"

namespace LLVMBC
{
class ParseContext
{
public:
	ParseContext(LLVMContext &context_, Module &module_)
	    : context(context_), module(module_) {}

	ConstantInt *get_constant_uint(uint32_t value);
	ConstantAsMetadata *create_constant_uint_meta(uint32_t value);
	MDString *create_string_meta(const String &str);
	ConstantAsMetadata *create_constant_meta(Constant *c);

	void emit_metadata();

	template <typename... Ops>
	MDNode *create_md_node(Ops&&... ops)
	{
		Vector<MDOperand *> vops { std::forward<Ops>(ops)... };
		return create_md_node(std::move(vops));
	}

	void create_named_md_node(const String &name, MDNode *node);
	MDNode *create_md_node(Vector<MDOperand *> ops);

	void emit_entry_point();

	MDNode *create_stage_io_meta();

private:
	LLVMContext &context;
	Module &module;
	uint64_t metadata_tween_id = 0;
	uint64_t tween_id = 0;
};

MDNode *ParseContext::create_md_node(Vector<MDOperand *> ops)
{
	auto *node = context.construct<MDNode>(&module, std::move(ops));
	node->set_tween_id(++metadata_tween_id);
	module.add_unnamed_metadata(node);
	return node;
}

void ParseContext::create_named_md_node(const String &name, MDNode *node)
{
	Vector<MDNode *> vops { node };
	auto *n = context.construct<NamedMDNode>(&module, name, std::move(vops));
	module.add_named_metadata(name, n);
}

MDNode *ParseContext::create_stage_io_meta()
{
	Vector<MDOperand *> inputs;
	Vector<MDOperand *> outputs;

	Vector<MDOperand *> ops {
		create_constant_uint_meta(0), // index
		create_string_meta("INPUT"),
		create_constant_uint_meta(uint32_t(DXIL::ComponentType::F32)),
		create_constant_uint_meta(uint32_t(DXIL::Semantic::User)),
		create_md_node(create_constant_uint_meta(0)), // semantic index
		create_constant_uint_meta(uint32_t(DXIL::InterpolationMode::Undefined)),
		create_constant_uint_meta(1), // rows
		create_constant_uint_meta(1), // cols
		create_constant_uint_meta(0), // start row
		create_constant_uint_meta(0), // start col
		nullptr,
	};

	Vector<MDOperand *> out_ops {
		create_constant_uint_meta(0), // index
		create_string_meta("SV_Position"),
		create_constant_uint_meta(uint32_t(DXIL::ComponentType::F32)),
		create_constant_uint_meta(uint32_t(DXIL::Semantic::Position)),
		create_md_node(create_constant_uint_meta(0)), // semantic index
		create_constant_uint_meta(uint32_t(DXIL::InterpolationMode::Undefined)),
		create_constant_uint_meta(1), // rows
		create_constant_uint_meta(4), // cols
		create_constant_uint_meta(0), // start row
		create_constant_uint_meta(0), // start col
		nullptr,
	};

	inputs.push_back(create_md_node(std::move(ops)));
	outputs.push_back(create_md_node(std::move(out_ops)));

	auto *input_meta = create_md_node(std::move(inputs));
	auto *output_meta = create_md_node(std::move(outputs));
	return create_md_node(input_meta, output_meta, nullptr /* patch meta */);
}

void ParseContext::emit_entry_point()
{
	auto *func_type = context.construct<FunctionType>(context, Type::getVoidTy(context), Vector<Type *>{});
	auto *func = context.construct<Function>(func_type, ++tween_id, module);

	auto *bb = context.construct<BasicBlock>(context);
	bb->add_instruction(context.construct<ReturnInst>(nullptr));
	Vector<BasicBlock *> bbs { bb };

	module.add_value_name(tween_id, "main");
	func->set_basic_blocks(std::move(bbs));
	module.add_function_implementation(func);
	create_named_md_node("dx.entryPoints",
	                     create_md_node(
		                     create_constant_meta(func),
	                         create_string_meta("main"),
	                         create_stage_io_meta(),
	                         nullptr, nullptr));
}

void ParseContext::emit_metadata()
{
	auto *name = create_string_meta("dxbc-spirv");
	create_named_md_node("llvm.ident", create_md_node(name));

	auto *cs = create_string_meta("vs");
	auto *major = create_constant_uint_meta(6);
	auto *minor = create_constant_uint_meta(0);
	create_named_md_node("dx.shaderModel", create_md_node(cs, major, minor));
}

ConstantInt *ParseContext::get_constant_uint(uint32_t value)
{
	return ConstantInt::get(Type::getInt32Ty(context), value);
}

ConstantAsMetadata *ParseContext::create_constant_uint_meta(uint32_t value)
{
	return create_constant_meta(get_constant_uint(value));
}

ConstantAsMetadata *ParseContext::create_constant_meta(Constant *c)
{
	return context.construct<ConstantAsMetadata>(&module, c);
}

MDString *ParseContext::create_string_meta(const String &str)
{
	return context.construct<MDString>(&module, str);
}

// Parses the highly simplified and SSA-ified IR coming from dxbc-spirv.
Module *parseDXBCIR(LLVMContext &context, const void *, size_t)
{
	auto *module = context.construct<Module>(context);
	ParseContext ctx(context, *module);
	ctx.emit_entry_point();
	ctx.emit_metadata();
	return module;
}
}