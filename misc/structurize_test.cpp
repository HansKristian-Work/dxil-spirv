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

static void validate_spirv(const Vector<uint32_t> &code)
{
	spvtools::SpirvTools tools(SPV_ENV_VULKAN_1_1);
	tools.SetMessageConsumer([](spv_message_level_t, const char *, const spv_position_t &, const char *message) {
		LOGE("Message: %s\n", message);
	});
	if (!tools.Validate(code.data(), code.size()))
		LOGE("Validation error.\n");
	else
		LOGE("Validated successfully!\n");
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

	const auto get = [&](const String &name) -> CFGNode * {
		auto itr = block_metas.find(name);
		if (itr == block_metas.end())
		{
			auto &new_entry = block_metas[name];
			auto *node = pool.create_node();
			node->ir.terminator.type = Terminator::Type::Return;
			node->name = name;
			new_entry = node;
			return node;
		}
		else
			return itr->second;
	};

	const auto add_branch = [&](const char *from, const char *to) {
		auto *f = get(from);
		auto *t = get(to);
		f->add_branch(t);
		f->ir.terminator.type = Terminator::Type::Branch;
		f->ir.terminator.direct_block = t;
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
		f->ir.terminator.conditional_id = emitter.module.get_builder().makeBoolConstant(true, true);
		emitter.module.get_builder().addName(f->ir.terminator.conditional_id, (std::string(from) + "_sel").c_str());
	};

	const auto add_phi = [&](const char *phi, const Vector<const char *> &from_nodes) {
		auto *p = get(phi);
		p->ir.phi.emplace_back();
		auto &phi_node = p->ir.phi.back();
		phi_node.type_id = emitter.module.get_builder().makeUintType(32);
		phi_node.id = emitter.module.allocate_id();
		emitter.module.get_builder().addName(phi_node.id, phi);

		for (auto &from : from_nodes)
		{
			IncomingValue value = {};
			value.block = get(from);
			value.id = emitter.module.get_builder().makeUintConstant(uint32_t(std::hash<std::string>()(from)), true);
			emitter.module.get_builder().addName(value.id, (std::string("incoming_value_") + from).c_str());
			phi_node.incoming.push_back(value);
		}
	};

	const auto add_sideeffect = [&](const char *block) {
		auto *b = get(block);
		auto &builder = emitter.module.get_builder();
		spv::Id var_id = builder.createVariable(spv::StorageClassFunction, builder.makeUintType(32));

		auto *op = emitter.module.allocate_op(spv::OpStore);
		op->add_id(var_id);
		op->add_id(builder.makeUintConstant(0));
		b->ir.operations.push_back(op);
	};

	emitter.module.emit_entry_point(spv::ExecutionModelVertex, "main", false);

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
		else if (tokens.front() == "sideeffect")
		{
			if (tokens.size() != 2)
			{
				LOGE("sideeffects token needs 2 elements.\n");
				continue;;
			}
			add_sideeffect(tokens[1].c_str());
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
	validate_spirv(code);
}
