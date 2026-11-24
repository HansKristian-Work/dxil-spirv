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

void CFGNode::add_branch(CFGNode *to)
{
	add_unique_succ(to);
	to->add_unique_pred(this);
}

void CFGNode::clear_branches()
{
	for (auto *s : succ)
	{
		auto itr = std::find(s->pred.begin(), s->pred.end(), this);
		// We might have become stale during rewrites. In this case we might have a succ
		// with no corresponding pred. Ignore that.
		if (itr != s->pred.end())
			s->pred.erase(itr);
	}
	succ.clear();

	if (succ_back_edge)
		succ_back_edge->pred_back_edge = nullptr;
	succ_back_edge = nullptr;
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

bool CFGNode::reaches_direct_helper(CFGNode *target)
{
	return reachable_direct_helpers.count(target) != 0;
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

bool CFGNode::can_backtrace_to_with_blockers(const CFGNode *parent, const Vector<CFGNode *> &block_nodes,
                                             UnorderedSet<const CFGNode *> &node_cache) const
{
	if (node_cache.count(this))
		return false;
	node_cache.insert(this);

	if (std::find(block_nodes.begin(), block_nodes.end(), this) != block_nodes.end())
		return false;

	for (auto *p : pred)
		if (p == parent || p->can_backtrace_to_with_blockers(parent, block_nodes, node_cache))
			return true;

	return false;
}

bool CFGNode::can_backtrace_to_with_blockers(const CFGNode *parent, const Vector<CFGNode *> &block_nodes) const
{
	// If parent can branch to this, then post_order(parent) must be greater than post_order(this).
	if (parent->forward_post_visit_order < forward_post_visit_order)
		return false;

	UnorderedSet<const CFGNode *> node_cache;
	return can_backtrace_to_with_blockers(parent, block_nodes, node_cache);
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
				return b;
			else if (a->post_dominates(b))
				return a;

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

	return a;
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
	auto *node = immediate_dominator;
	while (!node->pred_back_edge)
	{
		if (node->pred.empty())
			return nullptr;

		assert(node->immediate_dominator);
		node = node->immediate_dominator;
	}

	return node;
}

void CFGNode::collapse_conditional_to_direct(CFGNode *to_next)
{
	if (ir.terminator.true_block != to_next || ir.terminator.false_block != to_next)
	{
		// Used by new structurizer.
		assert(std::find(to_next->pred.begin(), to_next->pred.end(), this) == to_next->pred.end());
		assert(ir.terminator.type == Terminator::Type::Condition);
		assert(std::find(succ.begin(), succ.end(), to_next) == succ.end());

		auto &true_pred = ir.terminator.true_block->pred;
		auto &false_pred = ir.terminator.false_block->pred;
		true_pred.erase(std::find(true_pred.begin(), true_pred.end(), this));
		false_pred.erase(std::find(false_pred.begin(), false_pred.end(), this));
		succ.erase(std::find(succ.begin(), succ.end(), ir.terminator.true_block));
		succ.erase(std::find(succ.begin(), succ.end(), ir.terminator.false_block));
		add_unique_succ(to_next);
		to_next->add_unique_pred(this);
	}

	ir.terminator.direct_block = to_next;
	ir.terminator.type = Terminator::Type::Branch;
	ir.terminator.true_block = nullptr;
	ir.terminator.false_block = nullptr;
	ir.terminator.conditional_id = 0;
	ir.merge_info.merge_type = MergeType::None;
	ir.merge_info.merge_block = nullptr;
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
} // namespace dxil_spv
