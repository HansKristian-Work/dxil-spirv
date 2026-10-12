/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
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

#include "cfg_structurizer.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"
#include "SpvBuilder.h"
#include <stdio.h>
#include <string.h>
#include <string>
#include <unordered_map>

#include "logging.hpp"
#include "spirv-tools/libspirv.hpp"
#include "spirv_cross_c.h"

using namespace dxil_spv;

struct Emitter : BlockEmissionInterface
{
	void emit_basic_block(CFGNode *node) override;
	void register_block(CFGNode *node) override
	{
		if (node->id == 0)
			node->id = module.allocate_id();
	}

	SPIRVModule module;
};

void Emitter::emit_basic_block(CFGNode *node)
{
	auto &info = node->ir.merge_info;
	LOGE("%u (%s):\n", node->id, node->name.c_str());

	// Emit opcodes here ...

	switch (info.merge_type)
	{
	case MergeType::Selection:
		LOGE("    SelectionMerge -> %s\n", info.merge_block ? info.merge_block->name.c_str() : "Unreachable");
		break;

	case MergeType::Loop:
		LOGE("    LoopMerge -> %s, Continue <- %s\n", info.merge_block ? info.merge_block->name.c_str() : "Unreachable",
		     info.continue_block ? info.continue_block->name.c_str() : "Unreachable");
		break;

	default:
		break;
	}

	switch (node->ir.terminator.type)
	{
	case Terminator::Type::Branch:
		LOGE("  Direct -> %s\n", node->ir.terminator.direct_block->name.c_str());
		break;

	case Terminator::Type::Condition:
		LOGE("  Selection -> %s : %s\n", node->ir.terminator.true_block->name.c_str(),
		     node->ir.terminator.false_block->name.c_str());
		break;

	case Terminator::Type::Return:
		LOGE("  Return\n");
		break;

	case Terminator::Type::Unreachable:
		LOGE("  Unreachable\n");
		break;

	default:
		break;
	}
}

static void print_spirv_assembly(const Vector<uint32_t> &code)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	std::string str;
	if (!tools.Disassemble(code.data(), code.size(), &str, SPV_BINARY_TO_TEXT_OPTION_INDENT))
		LOGE("Failed to disassemble SPIR-V.\n");
	else
		LOGE("\nSPIR-V:\n%s\n", str.c_str());
}

static void print_glsl(const Vector<uint32_t> &code)
{
	spvc_context context;
	if (spvc_context_create(&context) != SPVC_SUCCESS)
		return;

	spvc_parsed_ir ir;
	if (spvc_context_parse_spirv(context, code.data(), code.size(), &ir) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler compiler;
	if (spvc_context_create_compiler(context, SPVC_BACKEND_GLSL, ir, SPVC_CAPTURE_MODE_TAKE_OWNERSHIP, &compiler) !=
	    SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler_options opts;
	if (spvc_compiler_create_compiler_options(compiler, &opts) != SPVC_SUCCESS)
		goto cleanup;

	spvc_compiler_options_set_bool(opts, SPVC_COMPILER_OPTION_GLSL_ES, SPVC_FALSE);
	spvc_compiler_options_set_uint(opts, SPVC_COMPILER_OPTION_GLSL_VERSION, 460);
	spvc_compiler_options_set_bool(opts, SPVC_COMPILER_OPTION_GLSL_VULKAN_SEMANTICS, SPVC_TRUE);
	spvc_compiler_install_compiler_options(compiler, opts);

	const char *source;
	if (spvc_compiler_compile(compiler, &source) != SPVC_SUCCESS)
		goto cleanup;

	LOGI("==== GLSL ====\n");
	fputs(source, stderr);
	LOGI("====\n");

cleanup:
	spvc_context_destroy(context);
}

static bool validate_spirv(const Vector<uint32_t> &code)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("Message: %s\n", message);
	});
	if (!tools.Validate(code.data(), code.size()))
	{
		LOGE("Validation error.\n");
		return false;
	}
	else
	{
		LOGE("Validated successfully!\n");
		return true;
	}
}

static Vector<String> tokenize(char *line_buffer)
{
	Vector<String> tokens;

	char *saveptr;
	char *first = strtok_r(line_buffer, " ", &saveptr);
	if (first)
		tokens.push_back(first);
	else
		return tokens;
	while (char *token = strtok_r(nullptr, " ", &saveptr))
		tokens.push_back(token);

	for (auto &token : tokens)
		while (!token.empty() && token.back() == '\n')
			token.pop_back();

	return tokens;
}

int main(int argc, char **argv)
{
	if (argc != 2)
	{
		fprintf(stderr, "Usage: structurize-test <input test>\n");
		return EXIT_FAILURE;
	}

	std::unordered_map<String, CFGNode *> block_metas;
	Emitter emitter;
	CFGNodePool pool;

	// Generate a dummy compute shader where we can trace the execution paths.
	emitter.module.emit_entry_point(spv::ExecutionModelGLCompute, "main", false, spv::MemoryModelGLSL450);
	auto &builder = emitter.module.get_builder();

	builder.addExecutionMode(emitter.module.get_entry_function(), spv::ExecutionModeLocalSize, 1, 1, 1);

	spv::Id u32_type = builder.makeUintType(32);
	spv::Id u32_array_type = builder.makeRuntimeArray(u32_type);
	builder.addDecoration(u32_array_type, spv::DecorationArrayStride, 4);

	spv::Id block_type_id = builder.makeStructType({ u32_array_type }, "SSBO");
	builder.addDecoration(block_type_id, spv::DecorationBlock);
	builder.addMemberDecoration(block_type_id, 0, spv::DecorationOffset, 0);
	builder.addMemberName(block_type_id, 0, "data");

	spv::Id condition_var_id = builder.createVariable(spv::StorageClassStorageBuffer, block_type_id, "Conditions");
	builder.addDecoration(condition_var_id, spv::DecorationDescriptorSet, 0);
	builder.addDecoration(condition_var_id, spv::DecorationBinding, 0);

	spv::Id feedback_var_id = builder.createVariable(spv::StorageClassStorageBuffer, block_type_id, "Feedback");
	builder.addDecoration(feedback_var_id, spv::DecorationDescriptorSet, 0);
	builder.addDecoration(feedback_var_id, spv::DecorationBinding, 1);

	spv::Id condition_counter_id = builder.createVariableWithInitializer(
		spv::StorageClassFunction,
		builder.makeUintType(32),
		builder.makeUintConstant(0), "ConditionCounter");

	spv::Id current_block_counter_id = builder.createVariableWithInitializer(
		spv::StorageClassFunction,
		builder.makeUintType(32),
		builder.makeUintConstant(0), "CurrentBlockCounter");

	uint32_t block_id = 0;

	const auto record_feedback = [&](CFGNode *node, spv::Id value) {
		// Record that we executed this node.
		auto *load_op = emitter.module.allocate_op(spv::OpLoad, emitter.module.allocate_id(), u32_type);
		load_op->add_id(current_block_counter_id);
		node->ir.operations.push_back(load_op);

		auto *increment = emitter.module.allocate_op(spv::OpIAdd, emitter.module.allocate_id(), u32_type);
		increment->add_id(load_op->id);
		increment->add_id(builder.makeUintConstant(1));
		node->ir.operations.push_back(increment);

		auto *chain = emitter.module.allocate_op(spv::OpAccessChain, emitter.module.allocate_id(),
			builder.makePointer(spv::StorageClassStorageBuffer, u32_type));
		chain->add_id(feedback_var_id);
		chain->add_id(builder.makeUintConstant(0));
		chain->add_id(load_op->id);
		node->ir.operations.push_back(chain);

		auto *store_ssbo = emitter.module.allocate_op(spv::OpStore);
		store_ssbo->add_id(chain->id);
		store_ssbo->add_id(value);
		node->ir.operations.push_back(store_ssbo);

		auto *store_op = emitter.module.allocate_op(spv::OpStore);
		store_op->add_id(current_block_counter_id);
		store_op->add_id(increment->id);
		node->ir.operations.push_back(store_op);
	};

	const auto get = [&](const String &name) -> CFGNode * {
		auto itr = block_metas.find(name);
		if (itr == block_metas.end())
		{
			auto &new_entry = block_metas[name];
			auto *node = pool.create_node();
			node->ir.terminator.type = Terminator::Type::Return;
			node->name = name;

			// Record that we executed this node.
			spv::Id block_value_id = builder.makeUintConstant(++block_id);
			record_feedback(node, block_value_id);

			new_entry = node;
			return node;
		}

		return itr->second;
	};

	const auto add_branch = [&](const char *from, const char *to) {
		auto *f = get(from);
		auto *t = get(to);
		f->add_branch(t);
		f->ir.terminator.type = Terminator::Type::Branch;
		f->ir.terminator.direct_block = t;
	};

	const auto build_condition = [&](CFGNode *node) {
		auto *load_op = emitter.module.allocate_op(spv::OpLoad, emitter.module.allocate_id(), u32_type);
		load_op->add_id(condition_counter_id);
		node->ir.operations.push_back(load_op);

		auto *increment = emitter.module.allocate_op(spv::OpIAdd, emitter.module.allocate_id(), u32_type);
		increment->add_id(load_op->id);
		increment->add_id(builder.makeUintConstant(1));
		node->ir.operations.push_back(increment);

		auto *chain = emitter.module.allocate_op(spv::OpAccessChain, emitter.module.allocate_id(),
			builder.makePointer(spv::StorageClassStorageBuffer, u32_type));
		chain->add_id(condition_var_id);
		chain->add_id(builder.makeUintConstant(0));
		chain->add_id(load_op->id);
		node->ir.operations.push_back(chain);

		auto *store_op = emitter.module.allocate_op(spv::OpStore);
		store_op->add_id(condition_counter_id);
		store_op->add_id(increment->id);
		node->ir.operations.push_back(store_op);

		auto *load_ssbo = emitter.module.allocate_op(spv::OpLoad, emitter.module.allocate_id(), u32_type);
		load_ssbo->add_id(chain->id);
		node->ir.operations.push_back(load_ssbo);

		return load_ssbo->id;
	};

	const auto add_selection = [&](const char *from, const char *to0, const char *to1) {
		auto *f = get(from);
		auto *t0 = get(to0);
		auto *t1 = get(to1);
		f->add_branch(t0);
		f->add_branch(t1);
		f->ir.terminator.type = Terminator::Type::Condition;
		f->ir.terminator.true_block = t0;
		f->ir.terminator.false_block = t1;

		auto *path = emitter.module.allocate_op(spv::OpINotEqual, emitter.module.allocate_id(), builder.makeBoolType());
		path->add_id(build_condition(f));
		path->add_id(builder.makeUintConstant(0));
		f->ir.operations.push_back(path);

		f->ir.terminator.conditional_id = path->id;
	};

	const auto add_switch = [&](const char *from, const String *nodes, size_t num_nodes) {
		auto *f = get(from);
		f->ir.terminator.type = Terminator::Type::Switch;
		f->ir.terminator.conditional_id = build_condition(f);

		for (size_t i = 0; i < num_nodes; i++)
		{
			auto *t = get(nodes[i]);
			f->add_branch(t);
			Terminator::Case case_label = {};
			case_label.node = t;
			case_label.global_order = i;
			case_label.is_default = i == 0;
			case_label.value = i;
			f->ir.terminator.cases.push_back(case_label);
		}
	};

	const auto add_phi = [&](const char *phi, const Vector<const char *> &from_nodes) {
		auto *p = get(phi);
		p->ir.phi.emplace_back();
		auto &phi_node = p->ir.phi.back();
		phi_node.type_id = emitter.module.get_builder().makeUintType(32);
		phi_node.id = emitter.module.allocate_id();
		emitter.module.get_builder().addName(phi_node.id, phi);

		uint32_t count = 1000000;
		for (auto &from : from_nodes)
		{
			IncomingValue value = {};
			value.block = get(from);
			value.id = emitter.module.get_builder().makeUintConstant(++count);
			phi_node.incoming.push_back(value);
		}

		record_feedback(p, phi_node.id);
	};

	FILE *file = fopen(argv[1], "r");
	if (!file)
	{
		fprintf(stderr, "Failed to open input file: %s.\n", argv[1]);
		return EXIT_FAILURE;
	}

	char line_buffer[1024];
	while (fgets(line_buffer, sizeof(line_buffer), file))
	{
		auto tokens = tokenize(line_buffer);
		if (tokens.empty())
			continue;

		if (tokens.front() == "b")
		{
			if (tokens.size() != 3)
			{
				LOGE("b token needs 3 elements.\n");
				continue;
			}

			add_branch(tokens[1].c_str(), tokens[2].c_str());
		}
		else if (tokens.front() == "c")
		{
			if (tokens.size() != 4)
			{
				LOGE("c token needs 4 elements.\n");
				continue;
			}

			add_selection(tokens[1].c_str(), tokens[2].c_str(), tokens[3].c_str());
		}
		else if (tokens.front() == "switch")
		{
			if (tokens.size() < 3)
			{
				LOGE("switch token needs at least.\n");
				continue;
			}

			add_switch(tokens[1].c_str(), tokens.data() + 2, tokens.size() - 2);
		}
		else if (tokens.front() == "phi")
		{
			if (tokens.size() < 3)
			{
				LOGE("phi token needs at least 3 elements.\n");
				continue;
			}

			Vector<const char *> src_blocks;
			for (auto itr = tokens.begin() + 2; itr != tokens.end(); ++itr)
				src_blocks.push_back(itr->c_str());
			add_phi(tokens[1].c_str(), src_blocks);
		}
		else
		{
			LOGE("Unknown token %s.\n", tokens.front().c_str());
		}
	}

	CFGStructurizer traverser(get("entry"), pool, emitter.module);
	traverser.run();
	traverser.traverse(emitter);

	pool.for_each_node([](CFGNode &node) {
		node.userdata = nullptr;
		node.id = 0;
	});

	emitter.module.emit_entry_point_function_body(traverser);
	Vector<uint32_t> code;
	emitter.module.finalize_spirv(code);

	print_glsl(code);
	print_spirv_assembly(code);
	return validate_spirv(code) ? EXIT_SUCCESS : EXIT_FAILURE;
}
