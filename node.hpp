/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

namespace dxil_spv
{
struct CFGNode
{
public:
	std::string name;
	uint32_t id = 0;
	void *userdata = nullptr;
	IRBlock ir;

	void add_branch(CFGNode *to);
	void add_fake_branch(CFGNode *to);

private:
	CFGNode() = default;
	friend class CFGNodePool;
	friend class CFGStructurizer;
	friend struct LoopBacktracer;
	friend struct LoopMergeTracer;

	uint32_t forward_post_visit_order = 0;
	uint32_t backward_post_visit_order = 0;
	bool visited = false;
	bool backward_visited = false;
	bool traversing = false;
	bool freeze_structured_analysis = false;

	MergeType merge = MergeType::None;
	CFGNode *loop_merge_block = nullptr;
	CFGNode *loop_ladder_block = nullptr;
	CFGNode *selection_merge_block = nullptr;
	std::vector<CFGNode *> headers;

	CFGNode *immediate_dominator = nullptr;
	CFGNode *immediate_post_dominator = nullptr;
	std::vector<CFGNode *> succ;
	std::vector<CFGNode *> pred;

	// Fake successors and predecessors which only serve to make the flipped CFG reducible.
	// This makes post-domination analysis not strictly correct in all cases, but it is
	// fine for the purposes we need post-domination analysis for.
	// If a continue block is not reachable in the flipped CFG, we will
	// add fake successors from the continue block.
	std::vector<CFGNode *> fake_succ;
	std::vector<CFGNode *> fake_pred;

	CFGNode *pred_back_edge = nullptr;
	CFGNode *succ_back_edge = nullptr;

	void add_unique_succ(CFGNode *node);
	void add_unique_pred(CFGNode *node);
	void add_unique_fake_succ(CFGNode *node);
	void add_unique_fake_pred(CFGNode *node);
	void add_unique_header(CFGNode *node);
	unsigned num_forward_preds() const;
	bool has_pred_back_edges() const;
	bool dominates(const CFGNode *other) const;
	bool can_loop_merge_to(const CFGNode *other) const;
	bool is_innermost_loop_header_for(const CFGNode *other) const;
	const CFGNode *get_innermost_loop_header_for(const CFGNode *other) const;
	bool branchless_path_to(const CFGNode *to) const;
	bool post_dominates(const CFGNode *other) const;
	bool dominates_all_reachable_exits() const;
	static CFGNode *find_common_dominator(CFGNode *a, CFGNode *b);
	static CFGNode *find_common_post_dominator(CFGNode *a, CFGNode *b);
	CFGNode *get_immediate_dominator_loop_header();
	bool can_backtrace_to(const CFGNode *parent) const;

	void retarget_branch(CFGNode *to_prev, CFGNode *to_next);
	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to);

	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to, const Op &op);

	template <typename Op>
	void walk_cfg_from(const Op &op) const;

	void recompute_immediate_dominator();
	void recompute_immediate_post_dominator();

	template <typename Op>
	void traverse_dominated_blocks(const Op &op);
	CFGNode *get_outer_selection_dominator();
	CFGNode *get_outer_header_dominator();

	std::vector<CFGNode *> dominance_frontier;
	std::vector<CFGNode *> post_dominance_frontier;

private:
	bool dominates_all_reachable_exits(const CFGNode &header) const;
	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to, const Op &op);
	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to, const Op &op,
	                                                  std::unordered_set<const CFGNode *> &visitation_cache);
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
void CFGNode::traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to, const Op &op,
                                                           std::unordered_set<const CFGNode *> &visitation_cache)
{
	visitation_cache.insert(this);

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
		{
			if (!visitation_cache.count(node))
				node->traverse_dominated_blocks_and_rewrite_branch(header, from, to, op, visitation_cache);
		}
	}
}

template <typename Op>
void CFGNode::traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to,
                                                           const Op &op)
{
	std::unordered_set<const CFGNode *> visitation_cache;
	traverse_dominated_blocks_and_rewrite_branch(header, from, to, op, visitation_cache);
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

} // namespace dxil_spv
