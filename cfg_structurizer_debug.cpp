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

#include "cfg_structurizer.hpp"
#include "SpvBuilder.h"
#include "logging.hpp"
#include "node.hpp"
#include <algorithm>
#include <assert.h>

namespace dxil_spv
{
#ifdef DXIL_SPIRV_DEBUG_DUMPING
void CFGStructurizer::log_cfg_graphviz(const char *path) const
{
	FILE *file = fopen(path, "w");
	if (!file)
	{
		LOGE("Failed to open graphviz dump path: %s\n", path);
		return;
	}

	UnorderedMap<const CFGNode *, uint32_t> node_to_id;
	uint32_t accum_id = 0;

	const auto get_node_id = [&](const CFGNode *node) -> uint32_t {
		auto itr = node_to_id.find(node);
		if (itr == node_to_id.end())
		{
			const char *shape = nullptr;
			if (node->ir.merge_info.merge_type == MergeType::Loop)
				shape = "circle";
			else if (node->ir.merge_info.merge_type == MergeType::Selection)
				shape = "triangle";
			else
				shape = "box";

			node_to_id[node] = ++accum_id;
			fprintf(file, "%u [label=\"%s\", shape=\"%s\"];\n", accum_id, node->name.c_str(), shape);
			return accum_id;
		}
		else
			return itr->second;
	};

	fprintf(file, "digraph {\n");
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];
		switch (node->ir.terminator.type)
		{
		case Terminator::Type::Branch:
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.direct_block));
			break;

		case Terminator::Type::Condition:
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.true_block));
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.false_block));
			break;

		case Terminator::Type::Switch:
			for (auto &c : node->ir.terminator.cases)
				fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(c.node));
			break;

		default:
			break;
		}

		if (node->ir.merge_info.merge_type == MergeType::Loop)
		{
			if (node->ir.merge_info.continue_block)
				fprintf(file, "%u -> %u [style=\"dotted\"];\n", get_node_id(node), get_node_id(node->ir.merge_info.continue_block));
			else if (node->pred_back_edge)
				fprintf(file, "%u -> %u [style=\"dotted\"];\n", get_node_id(node), get_node_id(node->pred_back_edge));

			if (node->ir.merge_info.merge_block)
				fprintf(file, "%u -> %u [style=\"dashed\"];\n", get_node_id(node), get_node_id(node->ir.merge_info.merge_block));
		}
		else if (node->ir.merge_info.merge_type == MergeType::Selection)
		{
			if (node->ir.merge_info.merge_block)
				fprintf(file, "%u -> %u [style=\"dashed\"];\n", get_node_id(node), get_node_id(node->ir.merge_info.merge_block));
		}
	}

	fprintf(file, "}\n");
	fclose(file);
}

void CFGStructurizer::log_cfg(const char *tag) const
{
	LOGI("\n======== %s =========\n", tag);
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];

		LOGI("%s:\n", node->name.c_str());
		switch (node->ir.terminator.type)
		{
		case Terminator::Type::Branch:
			LOGI("  Branch -> %s\n", node->ir.terminator.direct_block->name.c_str());
			break;

		case Terminator::Type::Condition:
			LOGI("  Cond -> %s | %s\n", node->ir.terminator.true_block->name.c_str(),
				 node->ir.terminator.false_block->name.c_str());
			break;

		case Terminator::Type::Return:
			LOGI("  Return\n");
			break;

		case Terminator::Type::Unreachable:
			LOGI("  Unreachable\n");
			break;

		case Terminator::Type::Switch:
			LOGI("  Switch\n");
			for (auto &c : node->ir.terminator.cases)
			{
				if (c.is_default)
					LOGI("    Default -> %s\n", c.node->name.c_str());
				else
					LOGI("    Case %u -> %s\n", c.value, c.node->name.c_str());
			}
			break;

		case Terminator::Type::Kill:
			LOGI("  Kill\n");
			break;
		}

		switch (node->ir.merge_info.merge_type)
		{
		case MergeType::Selection:
			LOGI("  SelectionMerge -> %s\n",
				 node->ir.merge_info.merge_block ? node->ir.merge_info.merge_block->name.c_str() : "N/A");
			break;

		case MergeType::Loop:
			LOGI("  LoopMerge -> %s\n", node->ir.merge_info.merge_block ? node->ir.merge_info.merge_block->name.c_str() : "N/A");
			LOGI("    Continue -> %s\n", node->pred_back_edge ? node->pred_back_edge->name.c_str() : "N/A");
			break;

		default:
			break;
		}

		LOGI("\n");
	}
	LOGI("\n=====================\n");
}

void CFGStructurizer::log_cfg_structurize_test(const char *path) const
{
	FILE *f = fopen(path, "w");
	if (!f)
		return;

	UnorderedMap<const CFGNode *, String> names;
	Vector<const CFGNode *> stack;

	auto name = [&](const CFGNode *n) -> const char * {
		auto itr = names.find(n);
		if (itr == names.end())
		{
			String s = n == entry_block ? "entry" : ("n" + std::to_string(names.size())).c_str();
			itr = names.insert({ n, s }).first;
			stack.push_back(n);
		}
		return itr->second.c_str();
	};

	name(entry_block);

	while (!stack.empty())
	{
		auto *n = stack.back();
		stack.pop_back();
		auto &t = n->ir.terminator;
		if (t.type == Terminator::Type::Branch)
			fprintf(f, "b %s %s\n", name(n), name(t.direct_block));
		else if (t.type == Terminator::Type::Condition)
			fprintf(f, "c %s %s %s\n", name(n), name(t.true_block), name(t.false_block));
		else if (t.type == Terminator::Type::Switch)
		{
			// structurize-test takes the default target first.
			fprintf(f, "switch %s", name(n));
			for (auto &c : t.cases)
				if (c.is_default)
					fprintf(f, " %s", name(c.node));
			for (auto &c : t.cases)
				if (!c.is_default)
					fprintf(f, " %s", name(c.node));
			fprintf(f, "\n");
		}
	}
	fclose(f);
}
#endif
}
