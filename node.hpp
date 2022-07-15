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

#pragma once

#include "thread_local_allocator.hpp"
#include "ir.hpp"

#include <algorithm>
#include <stdint.h>

namespace dxil_spv
{
class CFGNodePool;

struct CFGNode
{
public:
	String name;
	uint32_t id = 0;
	void *userdata = nullptr;
	IRBlock ir;

	void add_branch(CFGNode *to);
	void add_fake_branch(CFGNode *to);

	DXIL_SPV_OVERRIDE_NEW_DELETE

private:
	friend class CFGNodePool;
	friend class CFGStructurizer;
	friend struct LoopBacktracer;
	friend struct LoopMergeTracer;
	explicit CFGNode(CFGNodePool &pool);

	CFGNodePool &pool;
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
	Vector<CFGNode *> headers;

	CFGNode *immediate_dominator = nullptr;
	CFGNode *immediate_post_dominator = nullptr;
	Vector<CFGNode *> succ;
	Vector<CFGNode *> pred;

	// Fake successors and predecessors which only serve to make the flipped CFG reducible.
	// This makes post-domination analysis not strictly correct in all cases, but it is
	// fine for the purposes we need post-domination analysis for.
	// If a continue block is not reachable in the flipped CFG, we will
	// add fake successors from the continue block.
	Vector<CFGNode *> fake_succ;
	Vector<CFGNode *> fake_pred;

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
	bool reaches_domination_frontier_before_merge(const CFGNode *merge) const;
	bool can_loop_merge_to(const CFGNode *other) const;
	bool post_dominates(const CFGNode *other) const;
	bool post_dominates_perfect_structured_construct() const;
	bool dominates_all_reachable_exits() const;
	static CFGNode *find_common_dominator(CFGNode *a, CFGNode *b);
	static CFGNode *find_common_post_dominator(CFGNode *a, CFGNode *b);
	CFGNode *get_immediate_dominator_loop_header();
	bool can_backtrace_to(const CFGNode *parent) const;
	bool can_backtrace_to(const CFGNode *parent, UnorderedSet<const CFGNode *> &node_cache) const;
	bool post_dominates_any_work() const;
	bool post_dominates_any_work(const CFGNode *parent, UnorderedSet<const CFGNode *> &node_cache) const;

	void retarget_branch(CFGNode *to_prev, CFGNode *to_next);
	void retarget_branch_with_intermediate_node(CFGNode *to_prev, CFGNode *to_next);

	void fixup_merge_info_after_branch_rewrite(CFGNode *from, CFGNode *to);

	template <typename Op>
	void walk_cfg_from(const Op &op) const;

	void recompute_immediate_dominator();
	void recompute_immediate_post_dominator();

	template <typename Op>
	void traverse_dominated_blocks(const Op &op) const;
	CFGNode *get_outer_selection_dominator();
	CFGNode *get_outer_header_dominator();

	Vector<CFGNode *> dominance_frontier;
	Vector<CFGNode *> post_dominance_frontier;

private:
	bool dominates_all_reachable_exits(UnorderedSet<const CFGNode *>& completed, const CFGNode &header) const;

	template <typename Op>
	void traverse_dominated_blocks(const CFGNode &header, const Op &op) const;

	void retarget_fake_succ(CFGNode *from, CFGNode *to);
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
void CFGNode::traverse_dominated_blocks(const CFGNode &header, const Op &op) const
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
void CFGNode::traverse_dominated_blocks(const Op &op) const
{
	traverse_dominated_blocks(*this, op);
}

} // namespace dxil_spv
