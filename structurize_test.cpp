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

#include "structurize_cfg.hpp"
#include <stdio.h>
#include <string>
#include <unordered_map>
using namespace DXIL2SPIRV;

struct BlockMeta
{
	CFGNode *node = nullptr;
};

struct Emitter : BlockEmissionInterface
{
	void emit_basic_block(CFGNode *node) override;
	void register_block(CFGNode *node) override
	{
		if (node->id == 0)
			node->id = base_id++;
	}

	CFGNodePool *pool = nullptr;
	unsigned base_id = 1;
};

void Emitter::emit_basic_block(CFGNode *node)
{
	auto &info = node->ir.merge_info;
	fprintf(stderr, "%u (%s):\n", node->id, node->name.c_str());

	// Emit opcodes here ...

	switch (info.merge_type)
	{
	case MergeType::Selection:
		fprintf(stderr, "    SelectionMerge -> %u\n", info.merge_block ? info.merge_block->id : 0);
		break;

	case MergeType::Loop:
		fprintf(stderr, "    LoopMerge -> %u, Continue <- %u\n", info.merge_block->id, info.continue_block ? info.continue_block->id : 0);
		break;

	default:
		break;
	}

#if 0
	for (auto *succ : node->succ)
		fprintf(stderr, " -> %s\n", succ->name.c_str());
	if (node->succ_back_edge)
		fprintf(stderr, " %s <- back edge\n", node->succ_back_edge->name.c_str());
#endif
}

int main()
{
	std::unordered_map<std::string, BlockMeta> block_metas;

	CFGNodePool pool;
	const auto get = [&](const std::string &name) -> CFGNode * {
		auto itr = block_metas.find(name);
		if (itr == block_metas.end())
		{
			auto &new_entry = block_metas[name];
			auto *node = pool.get_node_from_userdata(&new_entry);
			pool.set_name(&new_entry, name);
			new_entry.node = node;
			return node;
		}
		else
			return itr->second.node;
	};

	const auto get_user = [&](const std::string &name) -> void * { return &block_metas[name]; };

	const auto add_branch = [&](const char *from, const char *to) {
		get(from);
		get(to);
		pool.add_branch(get_user(from), get_user(to));
	};

	const auto add_switch = [&](const char *from, const std::vector<const char *> &tos) {
		for (auto *to : tos)
			add_branch(from, to);
	};

	const auto add_selection = [&](const char *from, const char *to0, const char *to1) {
		add_branch(from, to0);
		add_branch(from, to1);
	};

#if 0
	add_selection("entry", "b0", "exit");
	{
		add_selection("b0", "b1", "b2");
		{
			add_branch("b1", "exit");
		}
		{
			add_branch("b2", "exit");
		}
	}
#elif 0
	add_selection("entry", "l0", "exit");
	{
		add_selection("l0", "l0.true", "m0");
		{
			add_branch("l0.true", "m0");
		}
		add_branch("m0", "l1");
		add_selection("l1", "l1.true", "m1");
		{
			add_branch("l1.true", "m1");
		}
		add_branch("m1", "exit");
	}
#elif 0
	add_selection("entry", "l0", "exit");
	{
		add_selection("l0", "b0", "merge");
		{
			add_selection("b0", "c1", "b1");
			add_selection("b1", "b2", "c1.p");
			{
				add_branch("b2", "c1");
			}
			{
				//add_branch("b3", "c1.p");
			}
			add_branch("c1.p", "c1");
		}
		add_selection("c1", "l0", "merge");
		add_branch("merge", "exit");
	}
#elif 0
	add_selection("entry", "switch", "exit");
	add_switch("switch", { "case0", "case1", "default", "merge" });
	add_selection("case0", "exit", "merge");
	add_branch("case1", "merge");
	add_branch("default", "merge");
	add_branch("merge", "exit");
#elif 0
	add_selection("entry", "b0", "b1");
	{
		add_selection("b0", "b0.true", "b0.false");
		{
			add_branch("b0.true", "exit");
		}
		{
			add_branch("b0.false", "exit");
		}
		add_selection("b1", "b1.true", "b1.false");
		{
			add_branch("b1.true", "exit");
		}
		{
			add_branch("b1.false", "exit");
		}
	}
#elif 0
	add_selection("entry", "b0", "exit");
	{
		add_selection("b0", "l0", "exit");
		{
			add_selection("l0", "l1", "c0");
			{
				add_branch("l1", "l1.cond");
				add_selection("l1.cond", "exit", "c1");
				add_selection("c1", "l1", "m1");
				add_branch("m1", "c0");
			}
			add_selection("c0", "l0", "l0.exit");
			add_branch("l0.exit", "exit");
		}
	}
#elif 0
	add_selection("entry", "b0", "entry.exit");
	{
		add_selection("b0", "b1", "entry.exit");
		{
			add_selection("b1", "exit", "entry.exit");
		}
	}
	add_branch("entry.exit", "exit");
#elif 0
	add_selection("b0", "l0", "b0.exit");
	{
		add_selection("l0", "l1", "c0");
		{
			add_branch("l1", "l1.cond");
			add_selection("l1.cond", "l1.exit", "c1");
			{
				add_branch("l1.exit", "m1");
			}
			add_selection("c1", "l1", "m1");
			add_branch("m1", "c0");
		}
		add_selection("c0", "l0", "l0.exit");
		add_branch("l0.exit", "b0.exit");
	}
#elif 1
	add_branch("entry", "b0");
	add_selection("b0", "l0", "b0.exit");
	{
		add_selection("l0", "l1", "c0");
		{
			add_branch("l1", "l1.cond");
			add_selection("l1.cond", "b0.exit", "c1");
			add_selection("c1", "l1", "m1");
			add_branch("m1", "c0");
		}
		add_selection("c0", "l0", "l0.exit");
		add_branch("l0.exit", "b0.exit");
	}
#elif 1
	add_selection("a0", "b0", "exit");
	add_selection("b0", "b0.true", "b0.false");
	{
		add_selection("b0.true", "b1.true", "b1.false");
		{
			// Break out of selection construct.
			add_branch("b1.true", "exit");
		}
		{
			add_branch("b1.false", "b1.merge");
		}
		add_branch("b1.merge", "b0.merge");
	}
	{
		add_selection("b0.false", "b2.true", "b2.false");
		{
			add_branch("b2.true", "b2.merge");
		}
		{
			add_branch("b2.false", "b2.merge");
		}
		add_branch("b2.merge", "b0.merge");
	}
	add_branch("b0.merge", "exit");
#elif 0
	add_selection("b0", "body", "b0.exit");
	add_branch("body", "b0.exit");
#else
	add_selection("b0", "l0", "b0.exit");
	{
		add_selection("l0", "b1", "b0.exit");
		{
			add_selection("b1", "a", "b");
			{
				add_branch("a", "c0");
			}
			{
				add_branch("b", "c0");
			}
		}
		add_selection("c0", "l0", "l0.exit");
		add_branch("l0.exit", "b0.exit");
	}
#endif

	auto *b0_exit = get("b0.exit");
	b0_exit->ir.phi.push_back({ 0, 0, {{ get("b0"), 0 }, { get("l1.cond"), 1 }, { get("l0.exit"), 2 }}});

	CFGStructurizer traverser(*get("entry"), pool);
	traverser.run();
	Emitter emitter;
	emitter.pool = &pool;
	traverser.traverse(emitter);
}