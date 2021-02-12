/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
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

#include "node.hpp"
#include "logging.hpp"

#include <algorithm>
#include <assert.h>

namespace dxil_spv
{
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
	add_unique_fake_succ(to);
	to->add_unique_fake_pred(this);
}

void CFGNode::add_unique_succ(CFGNode *node)
{
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

bool CFGNode::dominates(const CFGNode *other) const
{
	// Follow immediate dominator graph. Either we end up at this, or entry block.
	while (this != other)
	{
		// Entry block case.
		if (other->pred.empty())
			break;

		assert(other->immediate_dominator);
		assert(other != other->immediate_dominator);
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
	UnorderedSet<const CFGNode *> node_cache;
	return can_backtrace_to(parent, node_cache);
}

const CFGNode *CFGNode::get_innermost_loop_header_for(const CFGNode *other) const
{
	while (this != other)
	{
		// Entry block case.
		if (other->pred.empty())
			break;

		// Found a loop header. This better be the one.
		if (other->pred_back_edge)
			break;

		assert(other->immediate_dominator);
		other = other->immediate_dominator;
	}

	return other;
}

bool CFGNode::is_innermost_loop_header_for(const CFGNode *other) const
{
	return this == get_innermost_loop_header_for(other);
}

bool CFGNode::branchless_path_to(const CFGNode *to) const
{
	const auto *node = this;
	while (node != to)
	{
		if (node->succ.size() != 1 || node->succ_back_edge)
			return false;
		node = node->succ.front();
	}

	return true;
}

bool CFGNode::post_dominates(const CFGNode *start_node) const
{
	while (start_node != this)
	{
		// Reached exit node.
		if (start_node == start_node->immediate_post_dominator)
			break;

		assert(start_node->immediate_post_dominator);
		start_node = start_node->immediate_post_dominator;
	}

	return this == start_node;
}

bool CFGNode::dominates_all_reachable_exits(const CFGNode &header) const
{
	if (succ_back_edge)
		return false;

	for (auto *node : succ)
		if (!header.dominates(node) || !node->dominates_all_reachable_exits(header))
			return false;

	return true;
}

bool CFGNode::dominates_all_reachable_exits() const
{
	return dominates_all_reachable_exits(*this);
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

		if (a->backward_post_visit_order < b->backward_post_visit_order)
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

		if (a->forward_post_visit_order < b->forward_post_visit_order)
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

void CFGNode::retarget_branch(CFGNode *to_prev, CFGNode *to_next)
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

	if (ir.terminator.direct_block == to_prev)
		ir.terminator.direct_block = to_next;
	if (ir.terminator.true_block == to_prev)
		ir.terminator.true_block = to_next;
	if (ir.terminator.false_block == to_prev)
		ir.terminator.false_block = to_next;
	if (ir.terminator.default_node == to_prev)
		ir.terminator.default_node = to_next;
	for (auto &c : ir.terminator.cases)
		if (c.node == to_prev)
			c.node = to_next;
}

void CFGNode::traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to)
{
	traverse_dominated_blocks_and_rewrite_branch(*this, from, to, [](const CFGNode *node) -> bool { return true; });
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

} // namespace dxil_spv
