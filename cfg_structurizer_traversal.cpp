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
#include "node.hpp"
#include "node_pool.hpp"
#include <algorithm>
#include <assert.h>

namespace dxil_spv
{
void CFGStructurizer::compute_dominance_frontier()
{
	for (auto *node : forward_post_visit_order)
		node->dominance_frontier.clear();
	for (auto *node : forward_post_visit_order)
		recompute_dominance_frontier(node);
}

void CFGStructurizer::compute_post_dominance_frontier()
{
	for (auto *node : backward_post_visit_order)
		node->post_dominance_frontier.clear();
	for (auto *node : backward_post_visit_order)
		recompute_post_dominance_frontier(node);
}

void CFGStructurizer::build_immediate_dominators()
{
	for (auto i = forward_post_visit_order.size(); i; i--)
	{
		auto *block = forward_post_visit_order[i - 1];
		block->recompute_immediate_dominator();

		if (block->immediate_dominator && block->immediate_dominator != block)
			block->immediate_dominator->idom_children.push_back(block);
	}
}

void CFGStructurizer::build_immediate_post_dominators()
{
	for (auto i = backward_post_visit_order.size(); i; i--)
	{
		auto *block = backward_post_visit_order[i - 1];
		block->recompute_immediate_post_dominator();
	}
}

void CFGStructurizer::reset_traversal()
{
	reachable_nodes.clear();
	forward_post_visit_order.clear();
	backward_post_visit_order.clear();

	pool.for_each_node([](CFGNode &node) {
		node.visited = false;
		node.backward_visited = false;
		node.traversing = false;
		node.immediate_dominator = nullptr;
		node.immediate_post_dominator = nullptr;
		node.idom_children.clear();
		node.fake_pred.clear();
		node.fake_succ.clear();
		node.reachable_direct_helpers.clear();
		node.forward_dominance_pre_order = 0;
		node.forward_dominance_post_order = 0;

		if (node.succ_back_edge)
			node.succ.push_back(node.succ_back_edge);
		if (node.pred_back_edge)
			node.pred.push_back(node.pred_back_edge);
		node.succ_back_edge = nullptr;
		node.pred_back_edge = nullptr;
	});
}

void CFGStructurizer::backwards_visit()
{
	Vector<CFGNode *> leaf_nodes;

	// Traverse from leaf nodes, back through their preds instead.
	// Clear out some state set by forward visit earlier.
	for (auto *node : forward_post_visit_order)
	{
		node->backward_visited = false;
		node->traversing = false;

		// For loops which can only exit from their header block,
		// certain loops will be unreachable when doing a backwards traversal.
		// Add fake branches so that backwards traversal still picks them up.
		if (node->succ.empty() && !node->succ_back_edge)
			leaf_nodes.push_back(node);
		else if (node->succ.empty() && node->succ_back_edge && node->succ_back_edge->ir.merge_info.merge_block)
			node->add_fake_branch(node->succ_back_edge->ir.merge_info.merge_block);
	}

	// Ensure stable shader caches compared to the recursive code.
	const auto visit_nodes = [this](const Vector<CFGNode *> &nodes)
	{
		for (auto itr = nodes.rbegin(); itr != nodes.rend(); ++itr)
			visit_stack.push_back(*itr);

		recursive_visit(nullptr,
		                [this](CFGNode *node) { backwards_visit_push(node); },
		                [this](CFGNode *node) { backwards_visit_resolve(node); },
		                [](CFGNode *node) { return node->backward_visited; });
	};

	visit_nodes(leaf_nodes);

	exit_block->backward_post_visit_order = backward_post_visit_order.size();
	exit_block->immediate_post_dominator = exit_block;
	exit_block->backward_visited = true;
	for (auto *leaf : leaf_nodes)
		leaf->immediate_post_dominator = exit_block;
}

void CFGStructurizer::backwards_visit_push(CFGNode *node)
{
	node->backward_visited = true;
	node->traversing = true;
	for (auto *pred : node->pred)
		push_visit_stack_backwards(pred);
	for (auto *pred : node->fake_pred)
		push_visit_stack_backwards(pred);
}

void CFGStructurizer::backwards_visit_resolve(CFGNode *entry)
{
	entry->backward_post_visit_order = backward_post_visit_order.size();
	backward_post_visit_order.push_back(entry);
}

void CFGStructurizer::visit_for_back_edge_analysis_push(CFGNode *entry)
{
	forward_visit_push(entry);
	// Just keep track of visit ordering somehow. Reuse visit order here.
	entry->backward_post_visit_order = backward_post_visit_order.size();
	backward_post_visit_order.push_back(entry);
}

void CFGStructurizer::visit_for_back_edge_analysis_resolve(CFGNode *entry)
{
	for (auto *succ : entry->succ)
	{
		// Reuse the existing vector to keep track of back edges.
		if (succ->traversing)
		{
			succ->fake_pred.push_back(entry);
			// We might have two different back-edges.
			entry->fake_succ.push_back(succ);
		}
	}

	// After we get here, we must have observed all back edges.
	// If there is more than one back edge, merge them.
	if (entry->fake_pred.size() >= 2)
	{
		auto *new_back_edge = pool.create_helper_node();
		new_back_edge->name = entry->name + ".back-edge-merge";
		for (auto *n : entry->fake_pred)
			n->retarget_branch_pre_traversal(entry, new_back_edge);
		new_back_edge->succ.push_back(entry);
		new_back_edge->ir.terminator.type = Terminator::Type::Branch;
		new_back_edge->ir.terminator.direct_block = entry;
		new_back_edge->add_branch(entry);
	}

	if (entry->fake_succ.size() >= 2)
	{
		// A node cannot have more than one back-edge in our implementation. Add interposing blocks to disambiguate.
		// Only the innermost node should remain.
		std::sort(entry->fake_succ.begin(), entry->fake_succ.end(), [](const CFGNode *a, const CFGNode *b)
		{
			return a->backward_post_visit_order < b->backward_post_visit_order;
		});

		entry->fake_succ.pop_back();
		Vector<CFGNode *> rewrites;
		std::swap(rewrites, entry->fake_succ);

		for (auto *succ : rewrites)
		{
			auto *new_back_edge = pool.create_helper_node();
			entry->retarget_branch_pre_traversal(succ, new_back_edge);

			auto itr = std::find(succ->fake_pred.begin(), succ->fake_pred.end(), entry);
			assert(itr != succ->fake_pred.end());
			*itr = new_back_edge;

			new_back_edge->name = entry->name + ".long-edge";
			new_back_edge->add_branch(succ);
			new_back_edge->ir.terminator.type = Terminator::Type::Branch;
			new_back_edge->ir.terminator.direct_block = succ;
		}
	}
}

void CFGStructurizer::push_visit_stack(CFGNode *node)
{
	if (!node->visited)
	{
		visit_stack.push_back(node);
		reachable_nodes.insert(node);
	}
}

void CFGStructurizer::push_visit_stack_backwards(CFGNode *node)
{
	if (!node->backward_visited)
		visit_stack.push_back(node);
}

void CFGStructurizer::forward_visit_resolve(CFGNode *entry)
{
	for (auto *succ : entry->succ)
	{
		if (succ->traversing)
		{
			// For now, only support one back edge.
			assert(experimental_unstructured_flow || !entry->succ_back_edge || entry->succ_back_edge == succ);
			entry->succ_back_edge = succ;

			// For now, only support one back edge.
			// DXIL seems to obey this.
			// For unstructured flow, we don't really do any passes, so just yolo it.
			assert(experimental_unstructured_flow || !succ->pred_back_edge || succ->pred_back_edge == entry);
			succ->pred_back_edge = entry;
		}
	}

	// Any back edges need to be handled specifically, only keep forward edges in succ/pred lists.
	// This avoids any infinite loop scenarios and needing to special case a lot of checks.
	if (entry->succ_back_edge)
	{
		auto itr = std::find(entry->succ.begin(), entry->succ.end(), entry->succ_back_edge);
		if (itr != entry->succ.end())
			entry->succ.erase(itr);
	}

	if (entry->pred_back_edge)
	{
		auto itr = std::find(entry->pred.begin(), entry->pred.end(), entry->pred_back_edge);
		if (itr != entry->pred.end())
			entry->pred.erase(itr);
	}

	entry->forward_post_visit_order = forward_post_visit_order.size();
	forward_post_visit_order.push_back(entry);
}

void CFGStructurizer::forward_visit_push(CFGNode *node)
{
	node->visited = true;
	node->traversing = true;
	for (auto *succ : node->succ)
		push_visit_stack(succ);
}

template <typename PushOp, typename ResolveOp, typename VisitedOp>
void CFGStructurizer::recursive_visit(CFGNode *node,
                                      const PushOp &push_op, const ResolveOp &resolve_op,
                                      const VisitedOp &is_visited_op)
{
	if (node)
		push_visit_stack(node);

	bool keep_iterating;

	while (!visit_stack.empty())
	{
		// Fan-out.
		do
		{
			CFGNode *to_visit = visit_stack.back();
			size_t last_visited_size = visit_stack.size();

			push_op(to_visit);

			keep_iterating = last_visited_size != visit_stack.size();
			// Reverse to avoid nuking shader caches. The first recursion entry will be picked first.
			if (keep_iterating)
				std::reverse(visit_stack.begin() + last_visited_size, visit_stack.end());
		} while (keep_iterating);

		// Resolve the stack.
		while (!visit_stack.empty() && is_visited_op(visit_stack.back()))
		{
			auto *node = visit_stack.back();
			if (node->traversing)
			{
				resolve_op(node);
				node->traversing = false;
			}
			visit_stack.pop_back();
		}
	}
}

void CFGStructurizer::forward_visit()
{
	recursive_visit(entry_block,
	                [this](CFGNode *node) { forward_visit_push(node); },
	                [this](CFGNode *node) { forward_visit_resolve(node); },
	                [this](CFGNode *node) { return node->visited; });
}

void CFGStructurizer::visit_for_back_edge_analysis()
{
	recursive_visit(entry_block,
	                [this](CFGNode *node) { visit_for_back_edge_analysis_push(node); },
	                [this](CFGNode *node) { visit_for_back_edge_analysis_resolve(node); },
	                [this](CFGNode *node) { return node->visited; });
}

bool CFGStructurizer::query_reachability(const CFGNode &from, const CFGNode &to) const
{
	if (&from == &to)
		return true;

	const uint32_t *src_reachability = &reachability_bitset[from.forward_post_visit_order * reachability_stride];
	return (src_reachability[to.forward_post_visit_order / 32] & (1u << (to.forward_post_visit_order & 31u))) != 0;
}

void CFGStructurizer::visit_reachability(const CFGNode &node)
{
	uint32_t *dst_reachability = &reachability_bitset[node.forward_post_visit_order * reachability_stride];

	for (auto *succ : node.succ)
	{
		// Inherit reachability from all successors.
		const uint32_t *src_reachability = &reachability_bitset[succ->forward_post_visit_order * reachability_stride];
		for (unsigned i = 0; i < reachability_stride; i++)
			dst_reachability[i] |= src_reachability[i];
	}

	// We can reach ourselves.
	dst_reachability[node.forward_post_visit_order / 32] |= 1u << (node.forward_post_visit_order & 31u);
}

void CFGStructurizer::build_reachability()
{
	reachability_stride = (forward_post_visit_order.size() + 31) / 32;
	reachability_bitset.clear();
	reachability_bitset.resize(reachability_stride * forward_post_visit_order.size());
	for (auto *node : forward_post_visit_order)
		visit_reachability(*node);
}

void CFGStructurizer::recompute_cfg()
{
	reset_traversal();
	forward_visit();
	// Need to prune dead preds before computing dominance.
	prune_dead_preds();
	build_immediate_dominators();
	build_forward_dominance_order();

	compute_dominance_frontier();
	if (!limited_control_flow_analysis)
		compute_full_control_flow_analysis();
}

void CFGStructurizer::compute_full_control_flow_analysis()
{
	build_reachability();
	backwards_visit();
	build_immediate_post_dominators();
	compute_post_dominance_frontier();
}

const CFGNode *CFGStructurizer::get_innermost_loop_header_for(const CFGNode *header, const CFGNode *other) const
{
	auto *node = other;

	while (header != other)
	{
		// Entry block case.
		if (other->pred.empty())
			break;

		// Found a loop header. This better be the one.
		// Detect false positive if back-edge can reach the node, this means we just skip over
		// the loop. We want to detect loops in a structured sense.
		// Breaking constructs should still detect the loop header as we'd expect.
		if (other->pred_back_edge && (other->pred_back_edge == node || !query_reachability(*other->pred_back_edge, *node)))
			break;

		assert(other->immediate_dominator);
		other = other->immediate_dominator;
	}

	return other;
}

const CFGNode *CFGStructurizer::get_innermost_loop_header_for(const CFGNode *other) const
{
	return get_innermost_loop_header_for(entry_block, other);
}

CFGNode *CFGStructurizer::find_common_post_dominator(const Vector<CFGNode *> &candidates)
{
	if (candidates.empty())
		return nullptr;
	else if (candidates.size() == 1)
		return candidates.front();

	CFGNode *common_post = CFGNode::find_common_post_dominator(candidates[0], candidates[1]);
	for (size_t i = 2; i < candidates.size(); i++)
		common_post = CFGNode::find_common_post_dominator(common_post, candidates[i]);
	return common_post != common_post->immediate_post_dominator ? common_post : nullptr;
}

void CFGStructurizer::recompute_post_dominance_frontier(CFGNode *node)
{
	for (auto *pred : node->pred)
	{
		if (pred->immediate_post_dominator != node &&
		    std::find(node->post_dominance_frontier.begin(),
		              node->post_dominance_frontier.end(),
		              pred) == node->post_dominance_frontier.end())
		{
			node->post_dominance_frontier.push_back(pred);
		}

		if (auto *ipdom = node->immediate_post_dominator)
		{
			for (auto *frontier_node : node->post_dominance_frontier)
			{
				if (!ipdom->post_dominates(frontier_node) &&
				    std::find(ipdom->post_dominance_frontier.begin(),
				              ipdom->post_dominance_frontier.end(),
				              frontier_node) == ipdom->post_dominance_frontier.end())
				{
					ipdom->post_dominance_frontier.push_back(frontier_node);
				}
			}
		}
	}
}

void CFGStructurizer::recompute_dominance_frontier(CFGNode *node)
{
	for (auto *succ : node->succ)
	{
		if (succ->immediate_dominator != node)
			push_back_unique(node->dominance_frontier, succ);

		if (auto *idom = node->immediate_dominator)
			for (auto *frontier_node : node->dominance_frontier)
				if (!idom->dominates(frontier_node))
					push_back_unique(idom->dominance_frontier, frontier_node);
	}
}

void CFGStructurizer::traverse(BlockEmissionInterface &iface)
{
	// Make sure all blocks are known to the backend before we emit code.
	// Prefer that IDs grow the further down the function we go.
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *block = forward_post_visit_order[index - 1];
		block->id = 0;
		iface.register_block(block);
	}

	// Need to emit blocks such that dominating blocks come before dominated blocks.
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *block = forward_post_visit_order[index - 1];

		auto &merge = block->ir.merge_info;

		// We don't use the top-level merge stuff in the new structurizer.
		switch (merge.merge_type)
		{
		case MergeType::Selection:
			// Not reachable in the end, force merge to unreachable.
			if (merge.merge_block && !merge.merge_block->userdata)
				merge.merge_block = nullptr;

			if (merge.merge_block)
				iface.register_block(merge.merge_block);
			iface.emit_basic_block(block);
			break;

		case MergeType::Loop:
			if (merge.merge_block && !merge.merge_block->userdata)
				merge.merge_block = nullptr;
			if (merge.continue_block && !merge.continue_block->userdata)
				merge.continue_block = nullptr;

			if (merge.merge_block)
				iface.register_block(merge.merge_block);
			if (merge.continue_block)
				iface.register_block(merge.continue_block);
			iface.emit_basic_block(block);
			break;

		default:
			iface.emit_basic_block(block);
			break;
		}
	}
}

void CFGStructurizer::forward_dominance_order_visit_push(CFGNode *node)
{
	node->forward_dominance_pre_order = ++dominance_order_counter;
	node->traversing = true;

	// We'll only visit each child once.
	for (auto *child : node->idom_children)
		visit_stack.push_back(child);
}

void CFGStructurizer::forward_dominance_order_visit_resolve(CFGNode *node)
{
	node->forward_dominance_post_order = ++dominance_order_counter;
}

void CFGStructurizer::build_forward_dominance_order()
{
	dominance_order_counter = 0;
	visit_stack.push_back(entry_block);
	recursive_visit(nullptr,
	                [this](CFGNode *node) { forward_dominance_order_visit_push(node); },
	                [this](CFGNode *node) { forward_dominance_order_visit_resolve(node); },
	                [](CFGNode *node) { return node->forward_dominance_pre_order != 0; });
}
}
