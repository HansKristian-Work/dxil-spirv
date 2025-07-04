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
#include <array>

#include "../dxil.hpp"
#include <assert.h>

namespace LLVMBC
{
struct DXILIntrinsicTable
{
	struct FunctionOverload
	{
		Function *func;
		// Either overloaded on return type, or the primary argument for e.g. stores.
		Type *overload_type;
	};

	struct FunctionEntry
	{
		// At most should be overload for i32/u32/f32 x 16/32/64
		std::array<FunctionOverload, 9> overloads;
		unsigned num_overloads;
	};

	FunctionEntry intrinsic_functions[int(DXIL::Op::Count)] = {};

	Function *get(Module &module, DXIL::Op op,
	              Type *return_type,
	              const Vector<Type *> &argument_types,
	              Type *overload_type, uint64_t &tween);
};

Function *DXILIntrinsicTable::get(
	Module &module, DXIL::Op op,
	Type *return_type, const Vector<Type *> &argument_types,
	Type *overload_type, uint64_t &tween)
{
	auto &entry = intrinsic_functions[int(op)];

	for (unsigned i = 0; i < entry.num_overloads; i++)
		if (entry.overloads[i].overload_type == overload_type)
			return entry.overloads[i].func;

	auto &context = module.getContext();

	assert(entry.num_overloads < entry.overloads.size());
	auto *func_type = context.construct<FunctionType>(context, return_type, argument_types);
	auto *func = context.construct<Function>(func_type, ++tween, module);
	// TODO: Can have a look-up for expected intrinsics name.
	module.add_value_name(tween, "dx.op.intrinsic");
	entry.overloads[entry.num_overloads++] = { func, overload_type };
	return func;
}

class ParseContext
{
public:
	ParseContext(LLVMContext &context_, Module &module_)
	    : context(context_), module(module_) {}

	void emit_metadata();
	void emit_entry_point();

private:
	LLVMContext &context;
	Module &module;
	uint64_t metadata_tween_id = 0;
	uint64_t tween_id = 0;

	ConstantInt *get_constant_uint(uint32_t value);

	// Metadata wrangling
	ConstantAsMetadata *create_constant_uint_meta(uint32_t value);
	MDString *create_string_meta(const String &str);
	ConstantAsMetadata *create_constant_meta(Constant *c);

	template <typename... Ops>
	MDNode *create_md_node(Ops&&... ops)
	{
		Vector<MDOperand *> vops { std::forward<Ops>(ops)... };
		return create_md_node(std::move(vops));
	}

	void create_named_md_node(const String &name, MDNode *node);
	MDNode *create_md_node(Vector<MDOperand *> ops);

	MDNode *create_stage_io_meta();
	MDOperand *create_null_meta();

	struct MetadataMapping
	{
		Vector<MDOperand *> nodes;
		// TODO: Some mapping from SsaRef to index so we can translate load descriptor.
	};
	MetadataMapping srvs, uavs, cbvs, samplers, inputs, outputs, patches;

	uint32_t build_texture_srv(uint32_t space, uint32_t index, uint32_t size,
	                           DXIL::ResourceKind kind,
	                           DXIL::ComponentType type);

	uint32_t build_texture_uav(uint32_t space, uint32_t index, uint32_t size,
	                           DXIL::ResourceKind kind,
	                           DXIL::ComponentType type, bool coherent, bool counter, bool rov);

	uint32_t build_buffer_uav(uint32_t space, uint32_t index, uint32_t size,
	                          DXIL::ResourceKind kind, uint32_t stride,
	                          bool coherent, bool counter, bool rov);

	uint32_t build_buffer_srv(uint32_t space, uint32_t index, uint32_t size,
	                          DXIL::ResourceKind kind, uint32_t stride);

	uint32_t build_cbv(uint32_t space, uint32_t index, uint32_t size, uint32_t cbv_size);

	uint32_t build_sampler(uint32_t space, uint32_t index, uint32_t size);

	uint32_t build_stage_io(MetadataMapping &mapping, const String &name,
	                        DXIL::ComponentType type,
	                        DXIL::Semantic semantic,
	                        uint32_t semantic_index,
	                        DXIL::InterpolationMode interpolation,
	                        uint32_t rows, uint32_t cols,
	                        uint32_t start_row, uint32_t start_col);

	// DXIL intrinsic build.
	DXILIntrinsicTable dxil_intrinsics;

	Instruction *build_load_input(
		uint32_t index, Type *type,
		Value *row, uint32_t col, Value *axis = nullptr);
	Instruction *build_store_output(uint32_t index, Value *row, uint32_t col, Value *value);

	// BasicBlock emission.
	BasicBlock *current_bb = nullptr;
	void push_instruction(Instruction *instruction);
};

void ParseContext::push_instruction(Instruction *instruction)
{
	assert(current_bb);
	instruction->set_tween_id(++tween_id);
	current_bb->add_instruction(instruction);
}

Instruction *ParseContext::build_load_input(
    uint32_t index, Type *type, Value *row, uint32_t col, Value *axis)
{
	auto *int_type = Type::getInt32Ty(context);
	auto *func = dxil_intrinsics.get(
		module, DXIL::Op::LoadInput, type,
		Vector<Type *> { int_type, int_type, int_type, int_type, int_type },
		type, tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *>{
	        get_constant_uint(uint32_t(DXIL::Op::LoadInput)),
	        get_constant_uint(index),
	        row,
	        get_constant_uint(col),
	        axis ? axis : UndefValue::get(Type::getInt32Ty(context)),
	    });

	return inst;
}

Instruction *ParseContext::build_store_output(uint32_t index, Value *row, uint32_t col, Value *value)
{
	auto *int_type = Type::getInt32Ty(context);
	auto *func = dxil_intrinsics.get(
	    module, DXIL::Op::StoreOutput, Type::getVoidTy(context),
	    Vector<Type *> { int_type, int_type, int_type, int_type, value->getType() },
	    value->getType(), tween_id);

	auto *inst = context.construct<CallInst>(
	    func->getFunctionType(), func,
	    Vector<Value *>{
	        get_constant_uint(uint32_t(DXIL::Op::StoreOutput)),
	        get_constant_uint(index),
	        row,
	        get_constant_uint(col),
	        value
	    });

	return inst;
}

MDOperand *ParseContext::create_null_meta()
{
	return context.construct<MDOperand>(&module, MetadataKind::None);
}

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
	build_stage_io(inputs, "INPUT", DXIL::ComponentType::F32,
	               DXIL::Semantic::User, 0, DXIL::InterpolationMode::Undefined,
	               1, 1, 0, 0);

	build_stage_io(outputs, "SV_Position", DXIL::ComponentType::F32,
	               DXIL::Semantic::Position, 0, DXIL::InterpolationMode::Undefined,
	               1, 4, 0, 0);

	return create_md_node(
		inputs.nodes.empty() ? create_null_meta() : create_md_node(inputs.nodes),
		outputs.nodes.empty() ? create_null_meta() : create_md_node(outputs.nodes),
		patches.nodes.empty() ? create_null_meta() : create_md_node(patches.nodes));
}

void ParseContext::emit_entry_point()
{
	auto *func_type = context.construct<FunctionType>(context, Type::getVoidTy(context), Vector<Type *>{});
	auto *func = context.construct<Function>(func_type, ++tween_id, module);
	module.add_value_name(tween_id, "main");

	// We're not barbarians.
	func->set_structured_control_flow();

	auto *bb = context.construct<BasicBlock>(context);
	auto *true_bb = context.construct<BasicBlock>(context);
	auto *false_bb = context.construct<BasicBlock>(context);
	auto *merge_bb = context.construct<BasicBlock>(context);
	auto *loop_merge_bb = context.construct<BasicBlock>(context);
	current_bb = bb;

	auto *load = build_load_input(0, Type::getFloatTy(context), get_constant_uint(0), 0);
	push_instruction(load);

	bb->add_successor(true_bb);
	bb->add_successor(false_bb);
	true_bb->add_successor(merge_bb);
	false_bb->add_successor(merge_bb);

	bb->set_selection_merge(merge_bb);
	auto *cond_branch = context.construct<BranchInst>(
	    true_bb, false_bb, ConstantInt::get(Type::getInt1Ty(context), 1));
	push_instruction(cond_branch);

	current_bb = true_bb;
	{
		for (int i = 0; i < 2; i++)
			push_instruction(build_store_output(0, get_constant_uint(0), i, load));
		push_instruction(context.construct<BranchInst>(merge_bb));
	}

	current_bb = false_bb;
	{
		for (int i = 2; i < 4; i++)
			push_instruction(build_store_output(0, get_constant_uint(0), i, load));
		push_instruction(context.construct<BranchInst>(merge_bb));
	}

	current_bb = merge_bb;
	merge_bb->add_successor(loop_merge_bb);
	merge_bb->set_loop_merge(loop_merge_bb, merge_bb);
	cond_branch = context.construct<BranchInst>(
		merge_bb, loop_merge_bb, ConstantInt::get(Type::getInt1Ty(context), 1));
	push_instruction(cond_branch);

	bb->set_tween_id(++tween_id);
	true_bb->set_tween_id(++tween_id);
	false_bb->set_tween_id(++tween_id);
	merge_bb->set_tween_id(++tween_id);
	loop_merge_bb->set_tween_id(++tween_id);

	current_bb = loop_merge_bb;
	push_instruction(context.construct<ReturnInst>(nullptr));

	func->set_basic_blocks({ bb, true_bb, false_bb, merge_bb, loop_merge_bb });
	module.add_function_implementation(func);
	create_named_md_node("dx.entryPoints",
	                     create_md_node(
		                     create_constant_meta(func),
	                         create_string_meta("main"),
	                         create_stage_io_meta(),
	                         create_null_meta(), create_null_meta()));
}

uint32_t ParseContext::build_texture_srv(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, DXIL::ComponentType type)
{
	uint32_t ret = srvs.nodes.size();
	auto *srv = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_null_meta(), // SRV sample count? We don't care about that.
	    create_md_node(
	        create_constant_uint_meta(0),
	        create_constant_uint_meta(uint32_t(type))));

	srvs.nodes.push_back(srv);
	return ret;
}

uint32_t ParseContext::build_texture_uav(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, DXIL::ComponentType type,
    bool coherent, bool counter, bool rov)
{
	uint32_t ret = uavs.nodes.size();

	auto *uav = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_constant_uint_meta(coherent),
	    create_constant_uint_meta(counter),
	    create_constant_uint_meta(rov),
	    create_md_node(
	        create_constant_uint_meta(0),
	        create_constant_uint_meta(uint32_t(type))));

	uavs.nodes.push_back(uav);
	return ret;
}

uint32_t ParseContext::build_buffer_uav(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, uint32_t stride,
    bool coherent, bool counter, bool rov)
{
	uint32_t ret = uavs.nodes.size();

	auto *uav = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_constant_uint_meta(coherent),
	    create_constant_uint_meta(counter),
	    create_constant_uint_meta(rov),
	    create_md_node(
	        create_constant_uint_meta(1),
	        create_constant_uint_meta(stride)));

	uavs.nodes.push_back(uav);
	return ret;
}

uint32_t ParseContext::build_buffer_srv(
    uint32_t space, uint32_t index, uint32_t size,
    DXIL::ResourceKind kind, uint32_t stride)
{
	uint32_t ret = srvs.nodes.size();
	auto *srv = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(uint32_t(kind)),
	    create_null_meta(), // SRV sample count? We don't care about that.
	    create_md_node(
	        create_constant_uint_meta(1),
	        create_constant_uint_meta(stride)));

	srvs.nodes.push_back(srv);
	return ret;
}

uint32_t ParseContext::build_sampler(uint32_t space, uint32_t index, uint32_t size)
{
	uint32_t ret = samplers.nodes.size();
	auto *sampler = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size));

	samplers.nodes.push_back(sampler);
	return ret;
}

uint32_t ParseContext::build_cbv(
    uint32_t space, uint32_t index, uint32_t size, uint32_t cbv_size)
{
	uint32_t ret = cbvs.nodes.size();
	auto *sampler = create_md_node(
	    create_constant_uint_meta(ret),
	    create_null_meta(),
	    create_string_meta(""),
	    create_constant_uint_meta(space),
	    create_constant_uint_meta(index),
	    create_constant_uint_meta(size),
	    create_constant_uint_meta(cbv_size));

	cbvs.nodes.push_back(sampler);
	return ret;
}

uint32_t ParseContext::build_stage_io(
    MetadataMapping &mapping,
	const String &name, DXIL::ComponentType type, DXIL::Semantic semantic, uint32_t semantic_index,
    DXIL::InterpolationMode interpolation,
    uint32_t rows, uint32_t cols,
    uint32_t start_row, uint32_t start_col)
{
	uint32_t ret = mapping.nodes.size();
	auto *input = create_md_node(
		create_constant_uint_meta(ret),
		create_string_meta(name),
		create_constant_uint_meta(uint32_t(type)),
		create_constant_uint_meta(uint32_t(semantic)),
		semantic_index ? create_md_node(create_constant_uint_meta(semantic_index)) : create_null_meta(),
		create_constant_uint_meta(uint32_t(interpolation)),
		create_constant_uint_meta(rows),
		create_constant_uint_meta(cols),
		create_constant_uint_meta(start_row),
		create_constant_uint_meta(start_col),
		create_null_meta());

	mapping.nodes.push_back(input);
	return ret;
}

void ParseContext::emit_metadata()
{
	auto *name = create_string_meta("dxbc-spirv");
	create_named_md_node("llvm.ident", create_md_node(name));

	auto *cs = create_string_meta("vs");
	auto *major = create_constant_uint_meta(6);
	auto *minor = create_constant_uint_meta(0);
	create_named_md_node("dx.shaderModel", create_md_node(cs, major, minor));

	build_texture_srv(3, 4, 5, DXIL::ResourceKind::Texture2D, DXIL::ComponentType::F32);
	build_buffer_srv(3, 4, 5, DXIL::ResourceKind::RawBuffer, 0);
	build_buffer_srv(3, 4, 5, DXIL::ResourceKind::StructuredBuffer, 4);
	build_sampler(6, 7, 8);
	build_cbv(6, 8, 1, 32);
	build_texture_uav(10, 11, 1, DXIL::ResourceKind::Texture3D, DXIL::ComponentType::U32,
	                  true, false, false);
	build_buffer_uav(10, 11, 1, DXIL::ResourceKind::StructuredBuffer, 16,
	                 true, false, false);

	create_named_md_node("dx.resources", create_md_node(
		srvs.nodes.empty() ? create_null_meta() : create_md_node(srvs.nodes),
		uavs.nodes.empty() ? create_null_meta() : create_md_node(uavs.nodes),
		cbvs.nodes.empty() ? create_null_meta() : create_md_node(cbvs.nodes),
		samplers.nodes.empty() ? create_null_meta() : create_md_node(samplers.nodes)));
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