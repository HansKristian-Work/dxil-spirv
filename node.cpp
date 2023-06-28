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

#include "node.hpp"
#include "node_pool.hpp"
#include "logging.hpp"

#include <algorithm>
#include <assert.h>

namespace dxil_spv
{
CFGNode::CFGNode(CFGNodePool &pool_)
	: pool(pool_)
{
}

void CFGNode::add_unique_pred(CFGNode *node)
{
	auto itr = std::find(pred.begin(), pred.end(), node);
	if (itr == pred.end())
		pred.push_back(node);
}

void CFGNode::add_unique_fake_pred(CFGNode *node)
{
	auto itr = std::find(fake_pred.begin(), fake_pred.end(), node);
	if (itr == fake_pred.end())
		fake_pred.push_back(node);
}

void CFGNode::add_unique_header(CFGNode *node)
{
	auto itr = std::find(headers.begin(), headers.end(), node);
	if (itr == headers.end())
		headers.push_back(node);
}

void CFGNode::add_branch(CFGNode *to)
{
	add_unique_succ(to);
	to->add_unique_pred(this);
}

void CFGNode::add_fake_branch(CFGNode *to)
{
	if (std::find(succ.begin(), succ.end(), to) != succ.end())
		return;

	add_unique_fake_succ(to);
	to->add_unique_fake_pred(this);
}

void CFGNode::add_unique_succ(CFGNode *node)
{
	assert(std::find(fake_succ.begin(), fake_succ.end(), node) == fake_succ.end());
	auto itr = std::find(succ.begin(), succ.end(), node);
	if (itr == succ.end())
		succ.push_back(node);
}

void CFGNode::add_unique_fake_succ(CFGNode *node)
{
	auto itr = std::find(fake_succ.begin(), fake_succ.end(), node);
	if (itr == fake_succ.end())
		fake_succ.push_back(node);
}

unsigned CFGNode::num_forward_preds() const
{
	return unsigned(pred.size());
}

bool CFGNode::has_pred_back_edges() const
{
	return pred_back_edge != nullptr;
}

bool CFGNode::reaches_domination_frontier_before_merge(const CFGNode *merge) const
{
	for (auto *frontier : dominance_frontier)
		if (merge != frontier && merge->post_dominates(frontier))
			return true;
	return false;
}

bool CFGNode::dominates(const CFGNode *other) const
{
	// Follow immediate dominator graph. Either we end up at this, or entry block.
	while (this != other)
	{
		if (!other->immediate_dominator || other == other->immediate_dominator)
			break;
		other = other->immediate_dominator;
	}

	return this == other;
}

bool CFGNode::can_loop_merge_to(const CFGNode *other) const
{
	if (!dominates(other))
		return false;

	auto *c = pred_back_edge;

	if (c && !c->succ.empty())
	{
		// If the continue block branches to something which is not the loop header,
		// it must be the merge block we're after, i.e., it must be a clean break (or we are kind of screwed).
		// Detect a "fake" merge branch here.
		// E.g., we have a fake merge branch if an escaping edge is branching to one block beyond the real merge block.
		// This can happen after split_merge_scopes() transform where inner loop
		// tries to break out of multiple loops and multiple selection scopes at the same time.
		// We can still dominate this escape target, but it's still an escape which must be resolved some other way with ladders.
		if (std::find(c->succ.begin(), c->succ.end(), other) == c->succ.end())
			return false;
	}

	return true;
}

bool CFGNode::can_backtrace_to(const CFGNode *parent, UnorderedSet<const CFGNode *> &node_cache) const
{
	if (node_cache.count(this))
		return false;
	node_cache.insert(this);

	for (auto *p : pred)
		if (p == parent || p->can_backtrace_to(parent, node_cache))
			return true;

	return false;
}

bool CFGNode::can_backtrace_to(const CFGNode *parent) const
{
	// If parent can branch to this, then post_order(parent) must be greater than post_order(this).
	if (parent->forward_post_visit_order < forward_post_visit_order)
		return false;

	UnorderedSet<const CFGNode *> node_cache;
	return can_backtrace_to(parent, node_cache);
}

bool CFGNode::post_dominates_any_work(const CFGNode *parent, UnorderedSet<const CFGNode *> &node_cache) const
{
	// If we reached this node before and didn't terminate, it must have returned false.
	if (node_cache.count(parent))
		return false;
	node_cache.insert(parent);

	// This is not a dummy block, we have an answer.
	if (!parent->ir.operations.empty() || !parent->ir.phi.empty())
		return post_dominates(parent);

	for (auto *p : parent->pred)
		if (post_dominates_any_work(p, node_cache))
			return true;

	return false;
}

bool CFGNode::post_dominates_any_work() const
{
	auto *start_node = this;
	// Trivial back-trace as far as we can go.
	while (start_node->pred.size() == 1 &&
	       start_node->ir.operations.empty() && start_node->ir.phi.empty() &&
	       start_node->post_dominates(start_node->pred.front()))
	{
		start_node = start_node->pred.front();
	}

	if (!start_node->ir.operations.empty() || !start_node->ir.phi.empty())
		return true;

	UnorderedSet<const CFGNode *> node_cache;
	for (auto *p : start_node->pred)
		if (start_node->post_dominates_any_work(p, node_cache))
			return true;
	return false;
}

bool CFGNode::post_dominates(const CFGNode *start_node) const
{
	while (start_node != this)
	{
		// Reached exit node.
		if (!start_node->immediate_post_dominator || start_node == start_node->immediate_post_dominator)
			break;
		start_node = start_node->immediate_post_dominator;
	}

	return this == start_node;
}

bool CFGNode::post_dominates_perfect_structured_construct() const
{
	if (!post_dominates(immediate_dominator))
		return false;

	for (auto *p : pred)
		if (!post_dominates(p))
			return false;
	return true;
}

bool CFGNode::dominates_all_reachable_exits(UnorderedSet<const CFGNode *> &completed, const CFGNode &header) const
{
	if (!completed.count(this))
	{
		if (succ_back_edge)
			return false;

		for (auto *node : succ)
			if (!header.dominates(node) || !node->dominates_all_reachable_exits(completed, header))
				return false;

		completed.insert(this);
	}

	return true;
}

bool CFGNode::dominates_all_reachable_exits() const
{
	UnorderedSet<const CFGNode *> completed;
	return dominates_all_reachable_exits(completed, *this);
}

CFGNode *CFGNode::find_common_post_dominator(CFGNode *a, CFGNode *b)
{
	assert(a);
	assert(b);

	while (a != b)
	{
		if (!a->immediate_post_dominator)
		{
			for (auto *p : a->succ)
				p->recompute_immediate_post_dominator();
			a->recompute_immediate_post_dominator();
		}

		if (!b->immediate_post_dominator)
		{
			for (auto *p : b->succ)
				p->recompute_immediate_post_dominator();
			b->recompute_immediate_post_dominator();
		}

		if (a->backward_post_visit_order == b->backward_post_visit_order)
		{
			// Should not normally happen, but when we insert ladder blocks,
			// we might have assigned temporary visit orders which can alias with
			// other nodes in some cases. Fixing this up requires a full traversal of the entire CFG,
			// so as a fallback we can do direct reachability and domination analysis.
			if (b->post_dominates(a))
				return const_cast<CFGNode *>(b);
			else if (a->post_dominates(b))
				return const_cast<CFGNode *>(a);

			// If there is no clear domination relationship, then we need to iterate both a and b.
			// This is fine as we now know that neither a nor b can be the common node.
			assert(a->immediate_post_dominator);
			assert(b->immediate_post_dominator);
			a = a->immediate_post_dominator;
			b = b->immediate_post_dominator;
		}
		else if (a->backward_post_visit_order < b->backward_post_visit_order)
		{
			assert(a->immediate_post_dominator);
			a = a->immediate_post_dominator;
		}
		else
		{
			assert(b->immediate_post_dominator);
			b = b->immediate_post_dominator;
		}
	}
	return const_cast<CFGNode *>(a);
}

CFGNode *CFGNode::find_common_dominator(CFGNode *a, CFGNode *b)
{
	assert(a);
	assert(b);

	while (a != b)
	{
		if (!a->immediate_dominator)
		{
			for (auto *p : a->pred)
				p->recompute_immediate_dominator();
			a->recompute_immediate_dominator();
		}

		if (!b->immediate_dominator)
		{
			for (auto *p : b->pred)
				p->recompute_immediate_dominator();
			b->recompute_immediate_dominator();
		}

		if (a->forward_post_visit_order == b->forward_post_visit_order)
		{
			// Should not normally happen, but when we insert ladder blocks,
			// we might have assigned temporary visit orders which can alias with
			// other nodes in some cases. Fixing this up requires a full traversal of the entire CFG,
			// so as a fallback we can do direct reachability and domination analysis.
			if (b->dominates(a))
				return const_cast<CFGNode *>(b);
			else if (a->dominates(b))
				return const_cast<CFGNode *>(a);

			// If there is no clear domination relationship, then we need to iterate both a and b.
			// This is fine as we now know that neither a nor b can be the common node.
			assert(a->immediate_dominator);
			assert(b->immediate_dominator);
			if (a == a->immediate_dominator)
				return b;
			else if (b == b->immediate_dominator)
				return a;
			a = a->immediate_dominator;
			b = b->immediate_dominator;
		}
		else if (a->forward_post_visit_order < b->forward_post_visit_order)
		{
			// Awkward case which can happen when nodes are unreachable in the CFG.
			// Can occur with the dummy blocks we create.
			if (a == a->immediate_dominator)
				return b;
			a = a->immediate_dominator;
		}
		else
		{
			// Awkward case which can happen when nodes are unreachable in the CFG.
			// Can occur with the dummy blocks we create.
			if (b == b->immediate_dominator)
				return a;

			b = b->immediate_dominator;
		}
	}
	return const_cast<CFGNode *>(a);
}

CFGNode *CFGNode::get_immediate_dominator_loop_header()
{
	assert(immediate_dominator);
	auto *node = this;
	while (!node->pred_back_edge)
	{
		if (node->pred.empty())
			return nullptr;

		assert(node->immediate_dominator);
		node = node->immediate_dominator;
	}

	return node;
}

void CFGNode::retarget_branch_with_intermediate_node(CFGNode *to_prev, CFGNode *to_next)
{
	// If there is no duplication, just go ahead.
	if (std::find(succ.begin(), succ.end(), to_next) == succ.end())
		return retarget_branch(to_prev, to_next);

	auto *intermediate = pool.create_node();
	intermediate->name = name + ".intermediate." + to_next->name;
	intermediate->ir.terminator.type = Terminator::Type::Branch;
	intermediate->ir.terminator.direct_block = to_next;
	intermediate->add_branch(to_next);
	intermediate->immediate_post_dominator = to_next;
	intermediate->immediate_dominator = this;
	intermediate->forward_post_visit_order = forward_post_visit_order;
	intermediate->backward_post_visit_order = backward_post_visit_order;
	retarget_branch(to_prev, intermediate);
	to_next->recompute_immediate_dominator();
}

void CFGNode::retarget_branch_pre_traversal(CFGNode *to_prev, CFGNode *to_next)
{
	//LOGI("Retargeting branch for %s: %s -> %s\n", name.c_str(), to_prev->name.c_str(), to_next->name.c_str());

	assert(std::find(succ.begin(), succ.end(), to_prev) != succ.end());
	assert(std::find(to_prev->pred.begin(), to_prev->pred.end(), this) != to_prev->pred.end());
	assert(std::find(succ.begin(), succ.end(), to_next) == succ.end());
	assert(std::find(to_next->pred.begin(), to_next->pred.end(), this) == to_next->pred.end());

	to_prev->pred.erase(std::find(to_prev->pred.begin(), to_prev->pred.end(), this));

	// Modify succ in place so we don't invalidate iterator in traverse_dominated_blocks_and_rewrite_branch.
	*std::find(succ.begin(), succ.end(), to_prev) = to_next;

	auto replace_itr = std::find(to_next->pred.begin(), to_next->pred.end(), to_prev);
	// If to_prev now becomes unreachable, just replace pred in-place to avoid a stale pred.
	// The stale pred will be cleaned up later when recomputing CFG.
	if (to_prev->pred.empty() && !to_prev->pred_back_edge && replace_itr != to_next->pred.end())
		*replace_itr = this;
	else
		to_next->add_unique_pred(this);

	if (ir.terminator.direct_block == to_prev)
		ir.terminator.direct_block = to_next;
	if (ir.terminator.true_block == to_prev)
		ir.terminator.true_block = to_next;
	if (ir.terminator.false_block == to_prev)
		ir.terminator.false_block = to_next;
	for (auto &c : ir.terminator.cases)
		if (c.node == to_prev)
			c.node = to_next;
}

void CFGNode::retarget_branch(CFGNode *to_prev, CFGNode *to_next)
{
	retarget_branch_pre_traversal(to_prev, to_next);

	// Branch targets have changed, so recompute immediate dominators.
	if (to_prev->forward_post_visit_order > to_next->forward_post_visit_order)
	{
		to_prev->recompute_immediate_dominator();
		to_next->recompute_immediate_dominator();
	}
	else
	{
		to_next->recompute_immediate_dominator();
		to_prev->recompute_immediate_dominator();
	}

	// ... and post dominator for ourself.
	// I am not sure if it's technically possible that we have to recompute the entire post domination graph now?
	recompute_immediate_post_dominator();
}

void CFGNode::retarget_fake_succ(CFGNode *to_prev, CFGNode *to_next)
{
	assert(std::find(fake_succ.begin(), fake_succ.end(), to_prev) != fake_succ.end());
	assert(std::find(to_prev->fake_pred.begin(), to_prev->fake_pred.end(), this) != to_prev->fake_pred.end());
	assert(std::find(fake_succ.begin(), fake_succ.end(), to_next) == fake_succ.end());
	assert(std::find(to_next->fake_pred.begin(), to_next->fake_pred.end(), this) == to_next->fake_pred.end());

	// Modify fake_succ in place so we don't invalidate iterator in traverse_dominated_blocks_and_rewrite_branch.
	*std::find(fake_succ.begin(), fake_succ.end(), to_prev) = to_next;
	to_next->add_unique_fake_pred(this);

	recompute_immediate_post_dominator();
}

void CFGNode::fixup_merge_info_after_branch_rewrite(CFGNode *from, CFGNode *to)
{
	// If we end up re-seating merge sites, make sure we add it to headers in the target block, since we might have
	// to keep splitting merge scopes in innermost scopes.
	if (std::find(from->headers.begin(), from->headers.end(), this) != from->headers.end())
	{
		if (std::find(to->headers.begin(), to->headers.end(), this) == to->headers.end())
			to->headers.push_back(this);
		if (selection_merge_block == from)
			selection_merge_block = to;
		if (loop_merge_block == from)
			loop_merge_block = to;
		if (loop_ladder_block == from)
			loop_ladder_block = to;
	}
}

void CFGNode::recompute_immediate_dominator()
{
	if (pred.empty())
	{
		// For entry block only.
		immediate_dominator = this;
	}
	else
	{
		immediate_dominator = nullptr;

		for (auto *edge : pred)
		{
			if (immediate_dominator)
				immediate_dominator = CFGNode::find_common_dominator(immediate_dominator, edge);
			else
				immediate_dominator = edge;
		}
	}
}

void CFGNode::recompute_immediate_post_dominator()
{
	if (!succ.empty() || !fake_succ.empty())
	{
		// For non-leaf blocks only. The immediate post dominator is already set up to be the exit node in leaf nodes.
		immediate_post_dominator = nullptr;
		for (auto *edge : succ)
		{
			if (immediate_post_dominator)
				immediate_post_dominator = CFGNode::find_common_post_dominator(immediate_post_dominator, edge);
			else
				immediate_post_dominator = edge;
		}

		for (auto *edge : fake_succ)
		{
			if (immediate_post_dominator)
				immediate_post_dominator = CFGNode::find_common_post_dominator(immediate_post_dominator, edge);
			else
				immediate_post_dominator = edge;
		}
	}
}

CFGNode *CFGNode::get_outer_selection_dominator()
{
	assert(immediate_dominator);
	auto *node = immediate_dominator;

	// We need to find an immediate dominator which we do not post-dominate.
	// That first idom is considered the outer selection header.
	while (node->ir.terminator.type != Terminator::Type::Switch && post_dominates(node))
	{
		if (node->pred.empty())
			break;

		// Skip from merge block to header.
		while (std::find(node->headers.begin(), node->headers.end(), node->immediate_dominator) != node->headers.end())
			node = node->immediate_dominator;

		if (post_dominates(node))
		{
			assert(node->immediate_dominator);
			node = node->immediate_dominator;
		}
	}

	return node;
}

CFGNode *CFGNode::get_outer_header_dominator()
{
	assert(immediate_dominator);
	auto *node = immediate_dominator;
	while (node->succ.size() == 1 && node->ir.terminator.type != Terminator::Type::Switch && !node->pred_back_edge)
	{
		if (node->pred.empty())
			break;

		assert(node->immediate_dominator);
		node = node->immediate_dominator;
	}

	return node;
}

bool CFGNode::block_is_jump_thread_ladder() const
{
	if (!ir.operations.empty() || ir.terminator.type != Terminator::Type::Condition || ir.phi.size() != 1)
		return false;

	auto &phi = ir.phi.front();

	// Detect a jump thread block. If the branch target directly depends on the incoming blocks,
	// we have this scenario.
	return ir.terminator.conditional_id == phi.id;
}

bool CFGNode::reaches_backward_visited_node(UnorderedSet<const dxil_spv::CFGNode *> &completed) const
{
	if (completed.count(this))
		return false;
	completed.insert(this);

	if (backward_visited)
		return true;

	for (auto *node : succ)
		if (node->reaches_backward_visited_node(completed))
			return true;

	for (auto *node : fake_succ)
		if (node->reaches_backward_visited_node(completed))
			return true;

	return false;
}

bool CFGNode::reaches_backward_visited_node() const
{
	UnorderedSet<const CFGNode *> visit;
	return reaches_backward_visited_node(visit);
}
} // namespace dxil_spv
