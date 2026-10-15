/* Copyright (c) 2026 Hans-Kristian Arntzen for Valve Corporation
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

#include "fuzz_emitter.hpp"
#include "logging.hpp"
#include "spirv-tools/libspirv.hpp"

namespace dxil_spv
{
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
		return true;
	}
}


bool Emitter::finalize(Style style, Vector<uint32_t> &code, bool validate)
{
	CFGStructurizer traverser(get("entry"), pool, module);

	if (style == Style::Modern)
	{
		traverser.run_experimental();
	}
	else if (style == Style::Unstructured)
	{
		module.get_builder().addExtension("SPV_FROG_unstructured_control_flow");
		traverser.run_experimental_unstructured();
	}
	else
	{
		traverser.run();
	}

	pool.for_each_node([](CFGNode &node) {
		node.userdata = nullptr;
		node.id = 0;
	});

	module.emit_entry_point_function_body(traverser);
	module.finalize_spirv(code);

	bool success = true;
	if (validate)
		success = validate_spirv(code);

	return success;
}

static Vector<String> tokenize(char *line_buffer)
{
	Vector<String> tokens;

	char *saveptr;
	char *first = strtok_r(line_buffer, " ", &saveptr);
	if (first)
		tokens.emplace_back(first);
	else
		return tokens;
	while (char *token = strtok_r(nullptr, " ", &saveptr))
		tokens.emplace_back(token);

	for (auto &token : tokens)
		while (!token.empty() && token.back() == '\n')
			token.pop_back();

	return tokens;
}

void Emitter::parse_line(char *line_buffer)
{
	auto tokens = tokenize(line_buffer);
	if (tokens.empty())
		return;

	if (line_buffer[0] == ';' || line_buffer[0] == '#' || line_buffer[0] == '\n')
		return;

	if (tokens.front() == "b")
	{
		if (tokens.size() != 3)
		{
			LOGE("b token needs 3 elements.\n");
			return;
		}

		add_branch(tokens[1].c_str(), tokens[2].c_str());
	}
	else if (tokens.front() == "c")
	{
		if (tokens.size() != 4)
		{
			LOGE("c token needs 4 elements.\n");
			return;
		}

		add_selection(tokens[1].c_str(), tokens[2].c_str(), tokens[3].c_str());
	}
	else if (tokens.front() == "switch")
	{
		if (tokens.size() < 3)
		{
			LOGE("switch token needs at least.\n");
			return;
		}

		add_switch(tokens[1].c_str(), tokens.data() + 2, tokens.size() - 2);
	}
	else if (tokens.front() == "phi")
	{
		if (tokens.size() < 3)
		{
			LOGE("phi token needs at least 3 elements.\n");
			return;
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

void Emitter::add_phi(const char *phi, const Vector<const char *> &from_nodes)
{
	auto *p = get(phi);
	p->ir.phi.emplace_back();
	auto &phi_node = p->ir.phi.back();
	phi_node.type_id = module.get_builder().makeUintType(32);
	phi_node.id = module.allocate_id();
	module.get_builder().addName(phi_node.id, phi);

	uint32_t count = 1000000;
	for (auto &from : from_nodes)
	{
		IncomingValue value = {};
		value.block = get(from);
		value.id = module.get_builder().makeUintConstant(++count);
		phi_node.incoming.push_back(value);
	}

	write_feedback(p, phi_node.id);
}

void Emitter::add_switch(const char *from, const String *nodes, size_t num_nodes)
{
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
}

void Emitter::add_branch(const char *from, const char *to)
{
	auto *f = get(from);
	auto *t = get(to);
	f->add_branch(t);
	f->ir.terminator.type = Terminator::Type::Branch;
	f->ir.terminator.direct_block = t;
}

void Emitter::add_selection(const char *from, const char *to0, const char *to1)
{
	auto &builder = module.get_builder();

	auto *f = get(from);
	auto *t0 = get(to0);
	auto *t1 = get(to1);
	f->add_branch(t0);
	f->add_branch(t1);
	f->ir.terminator.type = Terminator::Type::Condition;
	f->ir.terminator.true_block = t0;
	f->ir.terminator.false_block = t1;

	auto *path = module.allocate_op(spv::OpINotEqual, module.allocate_id(), builder.makeBoolType());
	path->add_id(build_condition(f));
	path->add_id(builder.makeUintConstant(0));
	f->ir.operations.push_back(path);

	f->ir.terminator.conditional_id = path->id;
}

spv::Id Emitter::build_condition(CFGNode *node)
{
	auto &builder = module.get_builder();
	spv::Id u32_type = builder.makeUintType(32);

	auto *load_op = module.allocate_op(spv::OpLoad, module.allocate_id(), u32_type);
	load_op->add_id(condition_counter_id);
	node->ir.operations.push_back(load_op);

	auto *increment = module.allocate_op(spv::OpIAdd, module.allocate_id(), u32_type);
	increment->add_id(load_op->id);
	increment->add_id(builder.makeUintConstant(1));
	node->ir.operations.push_back(increment);

	auto *chain = module.allocate_op(spv::OpAccessChain, module.allocate_id(),
		builder.makePointer(spv::StorageClassStorageBuffer, u32_type));
	chain->add_id(condition_var_id);
	chain->add_id(builder.makeUintConstant(0));
	chain->add_id(load_op->id);
	node->ir.operations.push_back(chain);

	auto *store_op = module.allocate_op(spv::OpStore);
	store_op->add_id(condition_counter_id);
	store_op->add_id(increment->id);
	node->ir.operations.push_back(store_op);

	auto *load_ssbo = module.allocate_op(spv::OpLoad, module.allocate_id(), u32_type);
	load_ssbo->add_id(chain->id);
	node->ir.operations.push_back(load_ssbo);

	return load_ssbo->id;
}

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

Emitter::Emitter()
{
	init();
}

void Emitter::init()
{
	auto &builder = module.get_builder();
	spv::Id u32_type = builder.makeUintType(32);

	// Generate a dummy compute shader where we can trace the execution paths.
	module.emit_entry_point(spv::ExecutionModelGLCompute, "main", false, spv::MemoryModelGLSL450);
	builder.addExecutionMode(module.get_entry_function(), spv::ExecutionModeLocalSize, 1, 1, 1);

	spv::Id u32_array_type = builder.makeRuntimeArray(u32_type);
	builder.addDecoration(u32_array_type, spv::DecorationArrayStride, 4);

	spv::Id block_type_id = builder.makeStructType({ u32_array_type }, "SSBO");
	builder.addDecoration(block_type_id, spv::DecorationBlock);
	builder.addMemberDecoration(block_type_id, 0, spv::DecorationOffset, 0);
	builder.addMemberName(block_type_id, 0, "data");

	condition_var_id = builder.createVariable(spv::StorageClassStorageBuffer, block_type_id, "Conditions");
	builder.addDecoration(condition_var_id, spv::DecorationDescriptorSet, 0);
	builder.addDecoration(condition_var_id, spv::DecorationBinding, 0);
	builder.addDecoration(condition_var_id, spv::DecorationNonWritable);

	feedback_var_id = builder.createVariable(spv::StorageClassStorageBuffer, block_type_id, "Feedback");
	builder.addDecoration(feedback_var_id, spv::DecorationDescriptorSet, 0);
	builder.addDecoration(feedback_var_id, spv::DecorationBinding, 1);
	builder.addDecoration(feedback_var_id, spv::DecorationNonReadable);

	condition_counter_id = builder.createVariableWithInitializer(
		spv::StorageClassFunction,
		builder.makeUintType(32),
		builder.makeUintConstant(0), "ConditionCounter");

	current_block_counter_id = builder.createVariableWithInitializer(
		spv::StorageClassFunction,
		builder.makeUintType(32),
		builder.makeUintConstant(0), "CurrentBlockCounter");
}

void Emitter::write_feedback(CFGNode *node, spv::Id value)
{
	auto &builder = module.get_builder();
	spv::Id u32_type = builder.makeUintType(32);

	// Record that we executed this node.
	auto *load_op = module.allocate_op(spv::OpLoad, module.allocate_id(), u32_type);
	load_op->add_id(current_block_counter_id);
	node->ir.operations.push_back(load_op);

	auto *increment = module.allocate_op(spv::OpIAdd, module.allocate_id(), u32_type);
	increment->add_id(load_op->id);
	increment->add_id(builder.makeUintConstant(1));
	node->ir.operations.push_back(increment);

	auto *chain = module.allocate_op(spv::OpAccessChain, module.allocate_id(),
		builder.makePointer(spv::StorageClassStorageBuffer, u32_type));
	chain->add_id(feedback_var_id);
	chain->add_id(builder.makeUintConstant(0));
	chain->add_id(load_op->id);
	node->ir.operations.push_back(chain);

	auto *store_ssbo = module.allocate_op(spv::OpStore);
	store_ssbo->add_id(chain->id);
	store_ssbo->add_id(value);
	node->ir.operations.push_back(store_ssbo);

	auto *store_op = module.allocate_op(spv::OpStore);
	store_op->add_id(current_block_counter_id);
	store_op->add_id(increment->id);
	node->ir.operations.push_back(store_op);
}

CFGNode *Emitter::get(const String &name)
{
	auto &builder = module.get_builder();

	auto itr = block_metas.find(name);
	if (itr == block_metas.end())
	{
		auto &new_entry = block_metas[name];
		auto *node = pool.create_node();
		node->ir.terminator.type = Terminator::Type::Return;
		node->name = name;

		// Record that we executed this node.
		spv::Id block_value_id = builder.makeUintConstant(++block_id);
		write_feedback(node, block_value_id);

		new_entry = node;
		return node;
	}

	return itr->second;
}
}