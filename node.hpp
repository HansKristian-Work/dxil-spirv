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

#pragma once

#include "ir.hpp"
#include <stdint.h>
#include <string>
#include <unordered_set>
#include <vector>

namespace DXIL2SPIRV
{
struct CFGNode
{
public:
	std::string name;
	uint32_t id = 0;
	void *userdata = nullptr;
	IRBlock ir;

	void add_branch(CFGNode *to);

private:
	CFGNode() = default;
	friend class CFGNodePool;
	friend class CFGStructurizer;
	friend struct LoopBacktracer;
	friend struct LoopMergeTracer;

	uint32_t visit_order = 0;
	bool visited = false;
	bool traversing = false;
	bool freeze_structured_analysis = false;
	bool is_ladder = false;

	MergeType merge = MergeType::None;
	CFGNode *loop_merge_block = nullptr;
	CFGNode *loop_ladder_block = nullptr;
	CFGNode *selection_merge_block = nullptr;
	std::vector<CFGNode *> headers;

	CFGNode *immediate_dominator = nullptr;
	std::vector<CFGNode *> succ;
	std::vector<CFGNode *> pred;
	CFGNode *pred_back_edge = nullptr;
	CFGNode *succ_back_edge = nullptr;

	void add_unique_succ(CFGNode *node);
	void add_unique_pred(CFGNode *node);
	void add_unique_header(CFGNode *node);
	unsigned num_forward_preds() const;
	bool has_pred_back_edges() const;
	bool dominates(const CFGNode *other) const;
	bool can_loop_merge_to(const CFGNode *other) const;
	bool is_innermost_loop_header_for(const CFGNode *other) const;
	bool branchless_path_to(const CFGNode *to) const;
	bool post_dominates(const CFGNode *other) const;
	bool dominates_all_reachable_exits() const;
	static CFGNode *find_common_dominator(CFGNode *a, CFGNode *b);
	CFGNode *get_immediate_dominator_loop_header();
	bool exists_path_in_cfg_without_intermediate_node(const CFGNode *end_block, const CFGNode *stop_block) const;

	void retarget_branch(CFGNode *to_prev, CFGNode *to_next);
	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to);

	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to, const Op &op);

	template <typename Op>
	void walk_cfg_from(const Op &op) const;

	void retarget_succ_from(CFGNode *node);
	void retarget_pred_from(CFGNode *node);
	void recompute_immediate_dominator();

	template <typename Op>
	void traverse_dominated_blocks(const Op &op);
	CFGNode *get_outer_selection_dominator();
	CFGNode *get_outer_header_dominator();

	std::vector<CFGNode *> dominance_frontier;

private:
	bool dominates_all_reachable_exits(const CFGNode &header) const;
	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to, const Op &op);
	template <typename Op>
	void traverse_dominated_blocks(const CFGNode &header, const Op &op);
};

template <typename Op>
void CFGNode::walk_cfg_from(const Op &op) const
{
	if (!op(this))
		return;

	for (auto *s : succ)
		s->walk_cfg_from(op);
}

template <typename Op>
void CFGNode::traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to, const Op &op)
{
	traverse_dominated_blocks_and_rewrite_branch(*this, from, to, op);
}
template <typename Op>
void CFGNode::traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to,
                                                           const Op &op)
{
	if (from == to)
		return;

	for (auto *node : succ)
	{
		if (!op(node))
			continue;

		if (node == from)
		{
			// Don't introduce a cycle.
			// We only retarget branches when we have "escape-like" edges.
			if (!to->dominates(this))
				retarget_branch(from, to);
		}
		else if (header.dominates(node) && node != to) // Do not traverse beyond the new branch target.
			node->traverse_dominated_blocks_and_rewrite_branch(header, from, to, op);
	}
}

template <typename Op>
void CFGNode::traverse_dominated_blocks(const CFGNode &header, const Op &op)
{
	for (auto *node : succ)
	{
		if (header.dominates(node))
		{
			if (op(node))
				node->traverse_dominated_blocks(header, op);
		}
	}
}

template <typename Op>
void CFGNode::traverse_dominated_blocks(const Op &op)
{
	traverse_dominated_blocks(*this, op);
}

} // namespace DXIL2SPIRV
