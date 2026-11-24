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
	void clear_branches();

	DXIL_SPV_OVERRIDE_NEW_DELETE

	const Vector<CFGNode *> &get_pred() const { return pred; }
	const Vector<CFGNode *> &get_succ() const { return succ; }

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

	// In new structurizer, marks the node as inheriting its loop scope from its lone pred.
	// This ensures that we don't end up needing super awkward ladder resolves just to get to a block
	// that intends to set a simple PHI variable.
	bool interposing = false;

	// In new structurizer, marks the node as a trivial helper that is created only to funnel control flow through.
	bool helper = false;

	Vector<CFGNode *> idom_children;

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
	UnorderedSet<CFGNode *> reachable_direct_helpers;

	CFGNode *pred_back_edge = nullptr;
	CFGNode *succ_back_edge = nullptr;

	bool reaches_direct_helper(CFGNode *target);
	void add_unique_succ(CFGNode *node);
	void add_unique_pred(CFGNode *node);
	void add_unique_fake_succ(CFGNode *node);
	void add_unique_fake_pred(CFGNode *node);
	unsigned num_forward_preds() const;
	bool has_pred_back_edges() const;
	bool dominates(const CFGNode *other) const;
	bool post_dominates(const CFGNode *other) const;
	static CFGNode *find_common_dominator(CFGNode *a, CFGNode *b);
	static CFGNode *find_common_post_dominator(CFGNode *a, CFGNode *b);
	CFGNode *get_immediate_dominator_loop_header();
	bool can_backtrace_to_with_blockers(const CFGNode *parent, const Vector<CFGNode *> &block_nodes) const;
	bool can_backtrace_to_with_blockers(const CFGNode *parent, const Vector<CFGNode *> &block_nodes,
	                                    UnorderedSet<const CFGNode *> &node_cache) const;
	void retarget_branch_pre_traversal(CFGNode *to_prev, CFGNode *to_next);
	void collapse_conditional_to_direct(CFGNode *to_next);

	void recompute_immediate_dominator();
	void recompute_immediate_post_dominator();

	Vector<CFGNode *> dominance_frontier;
	Vector<CFGNode *> post_dominance_frontier;
};
} // namespace dxil_spv
