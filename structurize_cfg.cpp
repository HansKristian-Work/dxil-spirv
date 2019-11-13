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
#include <algorithm>
#include <assert.h>
#include <unordered_set>

namespace DXIL2SPIRV
{
CFGStructurizer::CFGStructurizer(CFGNode &entry, CFGNodePool &pool_)
    : entry_block(&entry)
    , pool(pool_)
{
	recompute_cfg();

	split_merge_scopes();

	fprintf(stderr, "=== Structurize pass ===\n");
	structurize(0);

	recompute_cfg();

	fprintf(stderr, "=== Structurize pass ===\n");
	structurize(1);

	validate_structured();
}

void CFGStructurizer::build_immediate_dominators(CFGNode &entry)
{
	for (auto i = post_visit_order.size(); i; i--)
	{
		auto *block = post_visit_order[i - 1];
		block->recompute_immediate_dominator();
	}
}

void CFGNode::add_unique_pred(CFGNode *node)
{
	auto itr = std::find(pred.begin(), pred.end(), node);
	if (itr == pred.end())
		pred.push_back(node);
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

void CFGNode::add_unique_succ(CFGNode *node)
{
	auto itr = std::find(succ.begin(), succ.end(), node);
	if (itr == succ.end())
		succ.push_back(node);
}

void CFGNode::ensure_ids(BlockEmissionInterface &iface)
{
	if (id != 0)
		return;

	uint32_t count = 1;
	if (headers.size() > 1)
		count = headers.size();

	id = iface.allocate_ids(count);
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

bool CFGNode::is_innermost_loop_header_for(const CFGNode *other) const
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

	return this == other;
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
	// Crude algorithm, try to traverse from start_node, and if we can find an exit without entering this,
	// we do not post-dominate.
	// Creating a post-dominator tree might be viable?

	// Terminated at this.
	if (start_node == this)
		return true;

	// Found exit.
	if (start_node->succ.empty())
		return false;

	// If post-visit order is lower, post-dominance is impossible.
	// As we traverse, post visit order will monotonically decrease.
	if (start_node->visit_order < visit_order)
		return false;

	for (auto *node : start_node->succ)
		if (!post_dominates(node))
			return false;

	return true;
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

void CFGStructurizer::reset_traversal()
{
	post_visit_order.clear();
	pool.for_each_node([](CFGNode &node) {
		node.visited = false;
		node.traversing = false;
		node.immediate_dominator = nullptr;

		if (!node.freeze_structured_analysis)
		{
			node.headers.clear();
			node.merge = MergeType::None;
			node.loop_merge_block = nullptr;
			node.loop_ladder_block = nullptr;
			node.selection_merge_block = nullptr;
		}

		if (node.succ_back_edge)
			node.succ.push_back(node.succ_back_edge);
		if (node.pred_back_edge)
			node.pred.push_back(node.pred_back_edge);
		node.succ_back_edge = nullptr;
		node.pred_back_edge = nullptr;
	});
}

void CFGStructurizer::visit(CFGNode &entry)
{
	entry.visited = true;
	entry.traversing = true;

	for (auto *succ : entry.succ)
	{
		if (succ->traversing)
		{
			// For now, only support one back edge.
			// DXIL seems to obey this.
			assert(!entry.succ_back_edge || entry.succ_back_edge == succ);
			entry.succ_back_edge = succ;

			// For now, only support one back edge.
			// DXIL seems to obey this.
			assert(!succ->pred_back_edge || succ->pred_back_edge == &entry);
			succ->pred_back_edge = &entry;
		}
		else if (!succ->visited)
			visit(*succ);
	}

	// Any back edges need to be handled specifically, only keep forward edges in succ/pred lists.
	// This avoids any infinite loop scenarios and needing to special case a lot of checks.
	if (entry.succ_back_edge)
	{
		auto itr = std::find(entry.succ.begin(), entry.succ.end(), entry.succ_back_edge);
		if (itr != entry.succ.end())
			entry.succ.erase(itr);
	}

	if (entry.pred_back_edge)
	{
		auto itr = std::find(entry.pred.begin(), entry.pred.end(), entry.pred_back_edge);
		if (itr != entry.pred.end())
			entry.pred.erase(itr);
	}

	entry.traversing = false;
	entry.visit_order = post_visit_order.size();
	post_visit_order.push_back(&entry);
}

CFGNode *CFGNode::find_common_dominator(const CFGNode *a, const CFGNode *b)
{
	assert(a);
	assert(b);

	while (a != b)
	{
		assert(a->immediate_dominator);
		assert(b->immediate_dominator);

		if (a->visit_order < b->visit_order)
			a = a->immediate_dominator;
		else
			b = b->immediate_dominator;
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
	fprintf(stderr, "Retargeting branch for %s: %s -> %s\n", name.c_str(), to_prev->name.c_str(), to_next->name.c_str());
	assert(std::find(succ.begin(), succ.end(), to_prev) != succ.end());
	assert(std::find(to_prev->pred.begin(), to_prev->pred.end(), this) != to_prev->pred.end());
	assert(std::find(succ.begin(), succ.end(), to_next) == succ.end());
	assert(std::find(to_next->pred.begin(), to_next->pred.end(), this) == to_next->pred.end());

	to_prev->pred.erase(std::find(to_prev->pred.begin(), to_prev->pred.end(), this));

	// Modify succ in place so we don't invalidate iterator in traverse_dominated_blocks_and_rewrite_branch.
	*std::find(succ.begin(), succ.end(), to_prev) = to_next;
	add_branch(to_next);

	// Branch targets have changed, so recompute immediate dominators.
	if (to_prev->visit_order > to_next->visit_order)
	{
		to_prev->recompute_immediate_dominator();
		to_next->recompute_immediate_dominator();
	}
	else
	{
		to_next->recompute_immediate_dominator();
		to_prev->recompute_immediate_dominator();
	}
}

template <typename Op>
void CFGNode::traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to, const Op &op)
{
	traverse_dominated_blocks_and_rewrite_branch(*this, from, to, op);
}

void CFGNode::traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to)
{
	traverse_dominated_blocks_and_rewrite_branch(*this, from, to, [](const CFGNode *) { return true; });
}

template <typename Op>
void CFGNode::traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from,
                                                           CFGNode *to, const Op &op)
{
	if (from == to)
		return;

	for (auto *node : succ)
	{
		if (node == from)
		{
			// Don't introduce a cycle.
			// We only retarget branches when we have "escape-like" edges.
			if (!to->dominates(this) && op(this))
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

void CFGNode::retarget_succ_from(CFGNode *old_pred)
{
	for (auto *s : succ)
	{
		if (s->immediate_dominator == old_pred)
			s->immediate_dominator = this;

		for (auto &p : s->pred)
			if (p == old_pred)
				p = this;
	}

	// Do not swap back edges.
}

void CFGNode::retarget_pred_from(CFGNode *old_succ)
{
	for (auto *p : pred)
	{
		for (auto &s : p->succ)
			if (s == old_succ)
				s = this;
	}

	// Swap back edge, new pred edge assumes loop header position if relevant.
	if (old_succ->pred_back_edge)
	{
		std::swap(pred_back_edge, old_succ->pred_back_edge);
		assert(pred_back_edge->succ_back_edge == old_succ);
		pred_back_edge->succ_back_edge = this;
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

CFGNode *CFGNode::get_outer_selection_dominator()
{
	assert(immediate_dominator);
	auto *node = immediate_dominator;

	while (node->succ.size() == 1)
	{
		if (node->pred.empty())
			break;

		assert(node->immediate_dominator);
		node = node->immediate_dominator;
	}

	return node;
}

struct LoopBacktracer
{
	void trace_to_parent(CFGNode *header, CFGNode *block);
	std::unordered_set<CFGNode *> traced_blocks;
};

struct LoopMergeTracer
{
	explicit LoopMergeTracer(const LoopBacktracer &backtracer_)
	    : backtracer(backtracer_)
	{
	}

	void trace_from_parent(CFGNode *header);
	const LoopBacktracer &backtracer;
	std::unordered_set<CFGNode *> loop_exits;
	std::unordered_set<CFGNode *> traced_blocks;
};

void LoopBacktracer::trace_to_parent(CFGNode *header, CFGNode *block)
{
	if (block == header)
	{
		traced_blocks.insert(block);
		return;
	}

	if (traced_blocks.count(block) == 0)
	{
		traced_blocks.insert(block);
		for (auto *p : block->pred)
			trace_to_parent(header, p);
	}
}

void LoopMergeTracer::trace_from_parent(CFGNode *header)
{
	if (backtracer.traced_blocks.count(header) == 0)
	{
		loop_exits.insert(header);
		return;
	}

	for (auto *succ : header->succ)
	{
		if (traced_blocks.count(succ) == 0)
		{
			trace_from_parent(succ);
			traced_blocks.insert(succ);
		}
	}
}

static void merge_to_succ(CFGNode *node, unsigned index)
{
	node->succ[index]->headers.push_back(node);
	node->selection_merge_block = node->succ[index];
	node->merge = MergeType::Selection;
	fprintf(stderr, "Fixup selection merge %s -> %s\n", node->name.c_str(), node->selection_merge_block->name.c_str());
}

void CFGStructurizer::isolate_structured(std::unordered_set<CFGNode *> &nodes,
                                         const CFGNode *header,
                                         const CFGNode *merge)
{
	for (auto *pred : merge->pred)
	{
		if (pred != header && nodes.count(pred) == 0)
		{
			nodes.insert(pred);
			isolate_structured(nodes, header, pred);
		}
	}
}

std::vector<CFGNode *> CFGStructurizer::isolate_structured_sorted(const CFGNode *header,
                                                                  const CFGNode *merge)
{
	std::unordered_set<CFGNode *> nodes;
	isolate_structured(nodes, header, merge);

	std::vector<CFGNode *> sorted;
	sorted.reserve(nodes.size());

	for (auto *node : nodes)
		sorted.push_back(node);

	std::sort(sorted.begin(), sorted.end(), [](const CFGNode *a, const CFGNode *b) {
		return a->visit_order > b->visit_order;
	});
	return sorted;
}

bool CFGStructurizer::control_flow_is_breaking(const CFGNode *header, const CFGNode *node,
                                               const CFGNode *merge)
{
	if (node == merge)
		return false;

	// Any loop exits from continue block is not considered a break.
	if (node->succ_back_edge)
		return false;

	// If header dominates a block, which branches out to some merge block, where header does not dominate merge,
	// we have a "breaking" construct.
	for (auto *succ : node->succ)
	{
		if (succ == merge)
			return true;
		else if (header->dominates(succ))
		{
			if (control_flow_is_breaking(header, succ, merge))
				return true;
		}
	}

	return false;
}

void CFGStructurizer::fixup_broken_selection_merges(unsigned pass)
{
	// Here we deal with selection branches where one path breaks and one path merges.
	// This is common case for ladder blocks where we need to merge to the "true" merge block.
	// The selection header has two succs, but the merge block might only have one pred block,
	// which means it was not considered a merge candidate earlier in find_selection_merges().
	for (auto *node : post_visit_order)
	{
		if (node->succ.size() != 2)
			continue;
		if (node->merge != MergeType::None)
			continue;

		// A continue block will never need to merge execution, but it shouldn't have succ.size() == 2,
		// but rather succ.size() == 1 and a back edge.
		if (node->succ_back_edge)
			continue;

		bool dominates_a = node->dominates(node->succ[0]);
		bool dominates_b = node->dominates(node->succ[1]);

		bool merge_a_has_header = !node->succ[0]->headers.empty();
		bool merge_b_has_header = !node->succ[1]->headers.empty();

		if (dominates_a && !dominates_b && !merge_a_has_header)
		{
			// A is obvious candidate.
			merge_to_succ(node, 0);
		}
		else if (dominates_b && !dominates_a && !merge_b_has_header)
		{
			// B is obvious candidate.
			merge_to_succ(node, 1);
		}
		else if (dominates_a && dominates_b && !merge_a_has_header && merge_b_has_header)
		{
			// Not as obvious of a candidate, but this can happen if one path hits continue block,
			// and other path hits a ladder merge block.
			// For do/while style loop, the loop body may dominate the merge block.
			merge_to_succ(node, 0);
		}
		else if (dominates_a && dominates_b && !merge_b_has_header && merge_a_has_header)
		{
			// Not as obvious of a candidate, but this can happen if one path hits continue block,
			// and other path hits a ladder merge block.
			// For do/while style loop, the loop body may dominate the merge block.
			merge_to_succ(node, 1);
		}
		else if (dominates_a && dominates_b && !merge_a_has_header && !merge_b_has_header)
		{
			// We could merge to both, no obvious merge point.
			// Figure out where execution reconvenes.
			// If we have a "break"-like construct inside a selection construct, we will not end up dominating the merge block.
			// This will be fixed up with ladder constructs later in first pass.

			// In second pass, we will have redirected any branches which escape through a ladder block.
			// If we find that one path of the selection construct must go through that ladder block, we know we have a break construct.
			CFGNode *merge = CFGStructurizer::find_common_post_dominator(node->succ);
			if (merge)
			{
				bool dominates_merge = node->dominates(merge);
				if (dominates_merge && !merge->headers.empty())
				{
					// Here we have a likely case where one block is doing a clean "break" out of a loop, and
					// the other path continues as normal, and then conditionally breaks in a continue block or something similar.
					bool a_path_is_break = control_flow_is_breaking(node, node->succ[0], merge);
					bool b_path_is_break = control_flow_is_breaking(node, node->succ[1], merge);
					if (a_path_is_break && b_path_is_break)
					{
						// Both paths break, so we never merge. Merge against Unreachable node if necessary ...
						node->merge = MergeType::Selection;
						node->selection_merge_block = nullptr;
						fprintf(stderr, "Merging %s -> Unreachable\n", node->name.c_str());
					}
					else if (b_path_is_break)
						merge_to_succ(node, 0);
					else
						merge_to_succ(node, 1);
				}
				else if (merge->headers.empty() || (pass == 0))
				{
					// Happens first iteration. We'll have to split blocks, so register a merge target where we want it.
					// Otherwise, this is the easy case if we observe it in pass 1.
					// This shouldn't really happen though, as we'd normally resolve this earlier in find_selection_merges.
					assert(merge);
					node->selection_merge_block = merge;
					node->merge = MergeType::Selection;
					merge->headers.push_back(node);
					fprintf(stderr, "Merging %s -> %s\n", node->name.c_str(),
					        node->selection_merge_block->name.c_str());
				}
				else
				{
					// We don't dominate the merge block in pass 1. We cannot split blocks now.
					// Check to see which paths can actually reach the merge target without going through a ladder block.
					// If we don't go through ladder it means an outer scope will actually reach the merge node.
					// If we reach a ladder it means a block we dominate will make the escape.
					bool a_path_is_break = control_flow_is_breaking(node, node->succ[0], merge);
					bool b_path_is_break = control_flow_is_breaking(node, node->succ[1], merge);
					if (a_path_is_break && b_path_is_break)
					{
						// Both paths break, so we never merge. Merge against Unreachable node if necessary ...
						node->merge = MergeType::Selection;
						node->selection_merge_block = nullptr;
						fprintf(stderr, "Merging %s -> Unreachable\n", node->name.c_str());
					}
					else if (b_path_is_break)
						merge_to_succ(node, 0);
					else
						merge_to_succ(node, 1);
				}
			}
			else
			{
				// We likely had one side of the branch take an "exit", in which case there is no common post-dominator.
				bool a_dominates_exit = node->succ[0]->dominates_all_reachable_exits();
				bool b_dominates_exit = node->succ[1]->dominates_all_reachable_exits();
				if (!a_dominates_exit && b_dominates_exit)
					merge_to_succ(node, 0);
				else if (!b_dominates_exit && a_dominates_exit)
					merge_to_succ(node, 1);
				else
				{
					// Both paths lead to exit. Do we even need to merge here?
					// In worst case we can always merge to an unreachable node in the CFG.
					node->merge = MergeType::Selection;
					auto *dummy_merge = pool.create_internal_node();
					node->selection_merge_block = dummy_merge;
					dummy_merge->name = node->name + ".unreachable";
				}
			}
		}
		else if (pass == 0)
		{
			// No possible merge target. Just need to pick whatever node is the merge block here.
			// Only do this in first pass, so that we can get a proper ladder breaking mechanism in place if we are escaping.
			CFGNode *merge = CFGStructurizer::find_common_post_dominator(node->succ);
			if (merge)
			{
				node->selection_merge_block = merge;
				node->merge = MergeType::Selection;
				merge->headers.push_back(node);
				fprintf(stderr, "Merging %s -> %s\n", node->name.c_str(),
				        node->selection_merge_block->name.c_str());
			}
			else
				fprintf(stderr, "Cannot find a merge target for block %s ...\n", node->name.c_str());
		}
	}
}

void CFGStructurizer::rewrite_selection_breaks(CFGNode *header, CFGNode *ladder_to)
{
	// Don't rewrite loops.
	if (header->pred_back_edge)
		return;

	std::unordered_set<CFGNode *> nodes;
	std::unordered_set<CFGNode *> construct;

	header->traverse_dominated_blocks([&](CFGNode *node) -> bool {
		if (nodes.count(node) == 0)
		{
			nodes.insert(node);
			if (node->succ.size() >= 2)
			{
				auto *outer_header = node->get_outer_selection_dominator();
				if (outer_header == header)
					construct.insert(node);
			}
			return true;
		}
		else
			return false;
	});

	for (auto *inner_block : construct)
	{
		fprintf(stderr, "Walking dominated blocks of %s, rewrite branches %s -> %s.ladder.\n",
		        inner_block->name.c_str(),
		        ladder_to->name.c_str(),
		        ladder_to->name.c_str());

		auto *ladder = pool.create_internal_node();
		ladder->name = ladder_to->name + "." + inner_block->name + ".ladder";
		ladder->add_branch(ladder_to);

		inner_block->traverse_dominated_blocks_and_rewrite_branch(ladder_to, ladder);
		rewrite_selection_breaks(inner_block, ladder);
	}
}

void CFGStructurizer::split_merge_scopes()
{
	for (auto *node : post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;

		// The idom is the natural header block.
		auto *idom = node->immediate_dominator;
		assert(idom->succ.size() >= 2);

		// Now we want to deal with cases where we are using this selection merge block as "goto" target for inner selection constructs.
		// Using a loop header might be possible,
		// but we will need to split up blocks to make sure that we don't end up with headers where the only branches
		// are either merges or breaks.

		// This case is relevant when we have something like:
		// A -> B -> C -> D -> M
		// A -> M
		// B -> M
		// C -> M
		// D -> M
		// We'll need intermediate blocks which merge each layer of the selection "onion".
		rewrite_selection_breaks(idom, node);
	}

	recompute_cfg();
}

void CFGStructurizer::recompute_cfg()
{
	reset_traversal();
	visit(*entry_block);
	build_immediate_dominators(*entry_block);
}

void CFGStructurizer::find_selection_merges(unsigned pass)
{
	for (auto *node : post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;

		// If there are 2 or more pred edges, try to merge execution.

		// The idom is the natural header block.
		auto *idom = node->immediate_dominator;
		assert(idom->succ.size() >= 2);

		for (auto *header : node->headers)
		{
			// If we have a loop header already associated with this block, treat that as our idom.
			if (header->visit_order > idom->visit_order)
				idom = header;
		}

		if (idom->merge == MergeType::None || idom->merge == MergeType::Selection)
		{
			// If the idom is already a selection construct, this must mean
			// we have some form of breaking construct inside this inner construct.
			// This fooled find_selection_merges() to think we had a selection merge target at the break target.
			// Fix this up here, where we rewrite the outer construct as a fixed loop instead.
			if (idom->merge == MergeType::Selection)
			{
				if (pass == 0)
				{
					idom->merge = MergeType::Loop;
					assert(idom->selection_merge_block);
					idom->loop_merge_block = idom->selection_merge_block;
					idom->selection_merge_block = nullptr;
					idom->freeze_structured_analysis = true;
					idom = create_helper_succ_block(idom);
				}
				else
					fprintf(stderr, "Mismatch headers in pass 1 ... ?\n");
			}

			idom->merge = MergeType::Selection;
			node->add_unique_header(idom);
			assert(node);
			idom->selection_merge_block = node;
			fprintf(stderr, "Selection merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(idom),
			        idom->name.c_str(), static_cast<const void *>(node), node->name.c_str());
		}
		else if (idom->merge == MergeType::Loop)
		{
			if (idom->loop_merge_block != node)
			{
				auto *selection_idom = create_helper_succ_block(idom);
				// If we split the loop header into the loop header -> selection merge header,
				// then we can merge into a continue block for example.
				selection_idom->merge = MergeType::Selection;
				idom->selection_merge_block = node;
				node->add_unique_header(idom);
				fprintf(stderr, "Selection merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(selection_idom),
				        selection_idom->name.c_str(), static_cast<const void *>(node), node->name.c_str());
			}
		}
		else
		{
			// We are hosed. There is no obvious way to merge execution here.
			// This might be okay.
			fprintf(stderr, "Cannot merge execution for node %p (%s).\n", static_cast<const void *>(node),
			        node->name.c_str());
		}
	}
}

CFGStructurizer::LoopExitType CFGStructurizer::get_loop_exit_type(const CFGNode &header, const CFGNode &node) const
{
	bool is_innermost_loop_header = header.is_innermost_loop_header_for(&node);
	if (header.dominates(&node) && node.dominates_all_reachable_exits())
	{
		if (is_innermost_loop_header)
			return LoopExitType::Exit;
		else
			return LoopExitType::InnerLoopExit;
	}

	// If there exists an inner loop which dominates this exit, we treat it as an inner loop exit.

	if (header.dominates(&node))
	{
		if (is_innermost_loop_header)
			return LoopExitType::Merge;
		else
			return LoopExitType::InnerLoopMerge;
	}
	else
		return LoopExitType::Escape;
}

CFGNode *CFGStructurizer::create_helper_pred_block(CFGNode *node)
{
	auto *pred_node = pool.create_internal_node();
	pred_node->name = node->name + ".pred";

	// Fixup visit order later.
	pred_node->visit_order = node->visit_order;

	std::swap(pred_node->pred, node->pred);

	pred_node->immediate_dominator = node->immediate_dominator;
	node->immediate_dominator = pred_node;

	pred_node->retarget_pred_from(node);

	pred_node->add_branch(node);

	if (node == entry_block)
		entry_block = pred_node;

	return pred_node;
}

CFGNode *CFGStructurizer::create_helper_succ_block(CFGNode *node)
{
	auto *succ_node = pool.create_internal_node();
	succ_node->name = node->name + ".succ";

	// Fixup visit order later.
	succ_node->visit_order = node->visit_order;

	std::swap(succ_node->succ, node->succ);
	// Do not swap back edges, only forward edges.

	succ_node->retarget_succ_from(node);
	succ_node->immediate_dominator = node;

	node->add_branch(succ_node);
	return succ_node;
}

#if 0
CFGNode *CFGStructurizer::find_common_dominated_merge_block(CFGNode *header)
{
	auto candidates = header->succ;
	std::vector<CFGNode *> next_nodes;

	const auto add_unique_next_node = [&](CFGNode *node) {
		if (header->dominates(node))
		{
			if (std::find(next_nodes.begin(), next_nodes.end(), node) == next_nodes.end())
				next_nodes.push_back(node);
		}
	};

	while (candidates.size() > 1)
	{
		// Sort candidates by post visit order.
		std::sort(candidates.begin(), candidates.end(), [](const CFGNode *a, const CFGNode *b) {
			return a->visit_order > b->visit_order;
		});

		// Now we look at the lowest post-visit order.
		// Before we traverse further, we need to make sure that all other blocks will actually reconvene with us somewhere.

		for (auto *succ : candidates.front()->succ)
			add_unique_next_node(succ);
		for (auto itr = candidates.begin() + 1; itr != candidates.end(); ++itr)
			add_unique_next_node(*itr);

		candidates.clear();
		std::swap(candidates, next_nodes);
	}

	return candidates.empty() ? nullptr : candidates.front();
}
#endif

CFGNode *CFGStructurizer::find_common_post_dominator(std::vector<CFGNode *> candidates)
{
	if (candidates.empty())
		return nullptr;

	std::vector<CFGNode *> next_nodes;
	const auto add_unique_next_node = [&](CFGNode *node) {
		if (std::find(next_nodes.begin(), next_nodes.end(), node) == next_nodes.end())
			next_nodes.push_back(node);
	};

	while (candidates.size() != 1)
	{
		// Sort candidates by post visit order.
		std::sort(candidates.begin(), candidates.end(),
		          [](const CFGNode *a, const CFGNode *b) { return a->visit_order > b->visit_order; });

		// We reached exit without merging execution, there is no common post dominator.
		if (candidates.front()->succ.empty())
			return nullptr;

		for (auto *succ : candidates.front()->succ)
			add_unique_next_node(succ);
		for (auto itr = candidates.begin() + 1; itr != candidates.end(); ++itr)
			add_unique_next_node(*itr);

		candidates.clear();
		std::swap(candidates, next_nodes);
	}

	return candidates.front();
}

void CFGStructurizer::find_loops()
{
	for (auto index = post_visit_order.size(); index; index--)
	{
		// Visit in reverse order so we resolve outer loops first,
		// this lets us detect ladder-breaking loops.
		auto *node = post_visit_order[index - 1];

		if (node->freeze_structured_analysis)
		{
			// If we have a pre-created dummy loop for ladding breaking,
			// just propagate the header information and be done with it.
			if (node->merge == MergeType::Loop)
			{
				node->loop_merge_block->headers.push_back(node);
				continue;
			}
		}

		if (!node->has_pred_back_edges())
			continue;

		// There are back-edges here, this must be a loop header.
		node->merge = MergeType::Loop;

		// Now, we need to figure out which blocks belong in the loop construct.
		// The way to figure out a natural loop is any block which is dominated by loop header
		// and control flow passes to one of the back edges.

		// Unfortunately, it can be ambiguous which block is the merge block for a loop.
		// Ideally, there is a unique block which is the loop exit block, but if there are multiple breaks
		// there are multiple blocks which are not part of the loop construct.

		LoopBacktracer tracer;
		auto *pred = node->pred_back_edge;

		// Back-trace from here.
		// The CFG is reducible, so node must dominate pred.
		// Since node dominates pred, there is no pred chain we can follow without
		// eventually hitting node, and we'll stop traversal there.

		// All nodes which are touched during this traversal must be part of the loop construct.
		tracer.trace_to_parent(node, pred);

		LoopMergeTracer merge_tracer(tracer);
		merge_tracer.trace_from_parent(node);

		std::vector<CFGNode *> direct_exits;
		std::vector<CFGNode *> dominated_exit;
		std::vector<CFGNode *> inner_dominated_exit;
		std::vector<CFGNode *> non_dominated_exit;

		for (auto *loop_exit : merge_tracer.loop_exits)
		{
			auto exit_type = get_loop_exit_type(*node, *loop_exit);
			switch (exit_type)
			{
			case LoopExitType::Exit:
				direct_exits.push_back(loop_exit);
				break;

			case LoopExitType::InnerLoopExit:
				// It's not an exit for us, but the inner loop.
				break;

			case LoopExitType::Merge:
				dominated_exit.push_back(loop_exit);
				break;

			case LoopExitType::InnerLoopMerge:
				inner_dominated_exit.push_back(loop_exit);
				break;

			case LoopExitType::Escape:
				non_dominated_exit.push_back(loop_exit);
				break;
			}
		}

		// If we only have one direct exit, consider it our merge block.
		// Pick either Merge or Escape.
		if (direct_exits.size() == 1 && dominated_exit.empty() && non_dominated_exit.empty())
		{
			if (node->dominates(direct_exits.front()))
				std::swap(dominated_exit, direct_exits);
			else
				std::swap(non_dominated_exit, direct_exits);
		}

		if (dominated_exit.size() >= 2)
		{
			// Try to see if we can reduce the number of merge blocks to just 1.
			// This is relevant if we have various "clean" break blocks.
			auto *post_dominator = find_common_post_dominator(dominated_exit);
			if (std::find(dominated_exit.begin(), dominated_exit.end(), post_dominator) != dominated_exit.end())
			{
				dominated_exit.clear();
				dominated_exit.push_back(post_dominator);
			}
		}

		if (dominated_exit.empty() && non_dominated_exit.empty())
		{
			// There can be zero loop exits, i.e. infinite loop. This means we have no merge block.
			// We will invent a merge block to satisfy SPIR-V validator, and declare it as unreachable.
			node->loop_merge_block = nullptr;
			fprintf(stderr, "Loop without merge: %p (%s)\n", static_cast<const void *>(node), node->name.c_str());
		}
		else if (dominated_exit.size() == 1 && non_dominated_exit.empty() && inner_dominated_exit.empty())
		{
			// Clean merge.
			// This is a unique merge block. There can be no other merge candidate.
			node->loop_merge_block = dominated_exit.front();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			fprintf(stderr, "Loop with simple merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node),
			        node->name.c_str(), static_cast<const void *>(node->loop_merge_block),
			        node->loop_merge_block->name.c_str());
		}
		else if (dominated_exit.empty() && inner_dominated_exit.empty() && non_dominated_exit.size() == 1)
		{
			// Single-escape merge.
			// It is unique, but we need workarounds later.
			node->loop_merge_block = non_dominated_exit.front();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			fprintf(stderr, "Loop with ladder merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node),
			        node->name.c_str(), static_cast<const void *>(node->loop_merge_block),
			        node->loop_merge_block->name.c_str());
		}
		else
		{
			// We have multiple blocks which are merge candidates. We need to figure out where execution reconvenes.
			std::vector<CFGNode *> merges;
			merges.reserve(inner_dominated_exit.size() + dominated_exit.size() + non_dominated_exit.size());
			merges.insert(merges.end(), inner_dominated_exit.begin(), inner_dominated_exit.end());
			merges.insert(merges.end(), dominated_exit.begin(), dominated_exit.end());
			merges.insert(merges.end(), non_dominated_exit.begin(), non_dominated_exit.end());
			CFGNode *merge = CFGStructurizer::find_common_post_dominator(std::move(merges));

			CFGNode *dominated_merge = nullptr;
			if (dominated_exit.size() > 1)
			{
				// Now, we might have Merge blocks which end up escaping out of the loop construct.
				// We might have to remove candidates which end up being break blocks after all.
				std::vector<CFGNode *> non_breaking_exits;
				non_breaking_exits.reserve(dominated_exit.size());
				for (auto *exit : dominated_exit)
					if (!control_flow_is_breaking(node, exit, merge))
						non_breaking_exits.push_back(exit);

				dominated_merge = CFGStructurizer::find_common_post_dominator(std::move(non_breaking_exits));
			}
			else
			{
				dominated_merge = CFGStructurizer::find_common_post_dominator(std::move(dominated_exit));
			}

			if (!dominated_merge)
			{
				fprintf(stderr, "There is no candidate for ladder merging.\n");
			}

			if (dominated_merge && !node->dominates(dominated_merge))
			{
				fprintf(stderr, "We don't dominate the merge target ...\n");
				dominated_merge = nullptr;
			}

			if (!merge)
			{
				fprintf(stderr, "Failed to find a common merge point ...\n");
			}
			else
			{
				node->loop_merge_block = merge;
				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);

				if (node->dominates(merge))
				{
					// Clean merge.
					// This is a unique merge block. There can be no other merge candidate.
					fprintf(stderr, "Loop with simple multi-exit merge: %p (%s) -> %p (%s)\n",
					        static_cast<const void *>(node), node->name.c_str(),
					        static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());
				}
				else
				{
					// Single-escape merge.
					// It is unique, but we need workarounds later.
					fprintf(stderr, "Loop with ladder multi-exit merge: %p (%s) -> %p (%s)\n",
					        static_cast<const void *>(node), node->name.c_str(),
					        static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());

					if (dominated_merge)
					{
						fprintf(stderr, "    Ladder block: %p (%s)\n", static_cast<const void *>(dominated_merge),
						        dominated_merge->name.c_str());
					}

					// We will use this block as a ladder.
					node->loop_ladder_block = dominated_merge;
				}
			}
		}
	}
}

void CFGStructurizer::split_merge_blocks()
{
	for (auto *node : post_visit_order)
	{
		if (node->headers.size() <= 1)
			continue;

		// If this block was the merge target for more than one construct,
		// we will need to split the block. In SPIR-V, a merge block can only be the merge target for one construct.
		// However, we can set up a chain of merges where inner scope breaks to outer scope with a dummy basic block.
		// The outer scope comes before the inner scope merge.
		std::sort(node->headers.begin(), node->headers.end(),
		          [](const CFGNode *a, const CFGNode *b) { return a->visit_order > b->visit_order; });

		// Verify that scopes are actually nested.
		// This means header[N] must dominate header[M] where N > M.
		for (size_t i = 1; i < node->headers.size(); i++)
		{
			if (!node->headers[i - 1]->dominates(node->headers[i]))
				fprintf(stderr, "Scopes are not nested.\n");
		}

		CFGNode *full_break_target = nullptr;

		// Start from innermost scope, and rewrite all escape branches to a merge block which is dominated by the loop header in question.
		// The merge block for the loop must have a ladder block before the old merge block.
		// This ladder block will break to outer scope, or keep executing the old merge block.
		for (size_t i = node->headers.size() - 1; i; i--)
		{
			// Find innermost loop header scope we can break to when resolving ladders.
			CFGNode *target_header = nullptr;
			for (size_t j = i; j; j--)
			{
				if (node->headers[j - 1]->merge == MergeType::Loop)
				{
					target_header = node->headers[j - 1];
					break;
				}
			}

			if (node->headers[i]->merge == MergeType::Loop)
			{
				auto *loop_ladder = node->headers[i]->loop_ladder_block;
				if (loop_ladder)
				{
					if (target_header)
					{
						// If we have a ladder block, there exists a merge candidate which the loop header dominates.
						// We create a ladder block before the merge block, which becomes the true merge block.
						// In this ladder block, we can detect with Phi nodes whether the break was "clean",
						// or if we had an escape edge.
						// If we have an escape edge, we can break to outer level, and continue the ladder that way.
						// Otherwise we branch to the existing merge block and continue as normal.
						// We'll also need to rewrite a lot of Phi nodes this way as well.
						auto *ladder = create_helper_pred_block(loop_ladder);

						// Merge to ladder instead.
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, ladder);

						// Ladder breaks out to outer scope.
						if (target_header->loop_ladder_block)
							ladder->add_branch(target_header->loop_ladder_block);
						else if (target_header->loop_merge_block)
							ladder->add_branch(target_header->loop_merge_block);
						else
							fprintf(stderr, "No loop merge block?\n");
					}
					else if (loop_ladder->succ.size() == 1 && loop_ladder->succ.front() == node)
					{
						// We have a case where we're trivially breaking out of a selection construct.
						// We cannot directly break out of a selection construct, so our ladder must be a bit more sophisticated.
						// ladder-pre -> merge -> ladder-post -> selection merge
						//      \-------------------/
						auto *ladder_pre = create_helper_pred_block(loop_ladder);
						auto *ladder_post = create_helper_succ_block(loop_ladder);
						ladder_pre->add_branch(ladder_post);
					}
					else if (full_break_target)
					{
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, full_break_target);
					}
					else
					{
						// Selection merge to this dummy instead.
						auto *new_selection_merge = create_helper_pred_block(node);

						// Inherit the headers.
						new_selection_merge->headers = node->headers;

						// This is now our fallback loop break target.
						full_break_target = node;

						auto *loop = create_helper_pred_block(node->headers[0]);

						// Reassign header node.
						assert(node->headers[0]->merge == MergeType::Selection);
						node->headers[0]->selection_merge_block = new_selection_merge;
						node->headers[0] = loop;

						loop->merge = MergeType::Loop;
						loop->loop_merge_block = node;
						loop->freeze_structured_analysis = true;

						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(new_selection_merge, node);
						node = new_selection_merge;
					}
				}
				else
					fprintf(stderr, "No loop ladder candidate.\n");
			}
			else if (node->headers[i]->merge == MergeType::Selection)
			{
				if (target_header)
				{
					// Breaks out to outer available scope.
					if (target_header->loop_ladder_block)
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, target_header->loop_ladder_block);
					else if (target_header->loop_merge_block)
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, target_header->loop_merge_block);
					else
						fprintf(stderr, "No loop merge block?\n");
				}
				else if (full_break_target)
				{
					node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, full_break_target);
				}
				else
				{
					// Selection merge to this dummy instead.
					auto *new_selection_merge = create_helper_pred_block(node);

					// Inherit the headers.
					new_selection_merge->headers = node->headers;

					// This is now our fallback loop break target.
					full_break_target = node;

					auto *loop = create_helper_pred_block(node->headers[0]);

					// Reassign header node.
					assert(node->headers[0]->merge == MergeType::Selection);
					node->headers[0]->selection_merge_block = new_selection_merge;
					node->headers[0] = loop;

					loop->merge = MergeType::Loop;
					loop->loop_merge_block = node;
					loop->freeze_structured_analysis = true;

					node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(new_selection_merge, node);
					node = new_selection_merge;
				}
			}
			else
				fprintf(stderr, "Invalid merge type.\n");
		}
	}
}

void CFGStructurizer::structurize(unsigned pass)
{
	find_loops();
	find_selection_merges(pass);
	fixup_broken_selection_merges(pass);
	if (pass == 0)
		split_merge_blocks();
}

void CFGStructurizer::validate_structured()
{
	for (auto *node : post_visit_order)
	{
		if (node->headers.size() > 1)
		{
			fprintf(stderr, "Node %s has %u headers!\n", node->name.c_str(), unsigned(node->headers.size()));
			return;
		}

		if (node->merge == MergeType::Loop)
		{
			if (!node->dominates(node->loop_merge_block) && !node->loop_merge_block->pred.empty())
			{
				fprintf(stderr, "Node %s does not dominate its merge block %s!\n", node->name.c_str(),
				        node->loop_merge_block->name.c_str());
				return;
			}
		}
		else if (node->merge == MergeType::Selection)
		{
			if (!node->dominates(node->selection_merge_block) && !node->selection_merge_block->pred.empty())
			{
				fprintf(stderr, "Node %s does not dominate its selection merge block %s!\n", node->name.c_str(),
				        node->selection_merge_block->name.c_str());
				return;
			}
		}

		if (node->succ.size() >= 2 && node->merge == MergeType::None)
		{
			// This might not be critical.
			fprintf(stderr, "Node %s has %u successors, but no merge header.\n", node->name.c_str(),
			        unsigned(node->succ.size()));
		}
	}
	fprintf(stderr, "Successful CFG validation!\n");
}

void CFGStructurizer::traverse(BlockEmissionInterface &iface)
{
	// Make sure all blocks are known to the backend before we emit code.
	for (auto *block : post_visit_order)
		iface.register_block(block);

	// Need to emit blocks such that dominating blocks come before dominated blocks.
	for (auto index = post_visit_order.size(); index; index--)
	{
		auto *block = post_visit_order[index - 1];

		block->ensure_ids(iface);
		for (auto *succ : block->succ)
			succ->ensure_ids(iface);
		if (block->pred_back_edge)
			block->pred_back_edge->ensure_ids(iface);
		if (block->selection_merge_block)
			block->selection_merge_block->ensure_ids(iface);
		if (block->loop_merge_block)
			block->loop_merge_block->ensure_ids(iface);

		BlockEmissionInterface::MergeInfo merge;

		switch (block->merge)
		{
		case MergeType::Selection:
			merge.merge_block = block->selection_merge_block;
			merge.merge_type = block->merge;
			iface.emit_basic_block(block, merge);
			break;

		case MergeType::Loop:
			merge.merge_block = block->loop_merge_block;
			merge.merge_type = block->merge;
			merge.continue_block = block->pred_back_edge;

			iface.emit_basic_block(block, merge);
			break;

		default:
			iface.emit_basic_block(block, merge);
			break;
		}
	}
}

CFGNode *CFGNodePool::get_node_from_userdata(void *userdata)
{
	auto *node = find_node_from_userdata(userdata);
	if (node)
		return node;

	auto &cfg = nodes[userdata];
	cfg.reset(new CFGNode);
	cfg->userdata = userdata;
	return cfg.get();
}

void CFGNodePool::set_name(void *userdata, const std::string &str)
{
	get_node_from_userdata(userdata)->name = str;
}

const std::string &CFGNodePool::get_name(void *userdata)
{
	return get_node_from_userdata(userdata)->name;
}

void CFGNodePool::add_branch(void *from, void *to)
{
	get_node_from_userdata(from)->add_branch(get_node_from_userdata(to));
}

CFGNode *CFGNodePool::find_node_from_userdata(void *userdata) const
{
	auto itr = nodes.find(userdata);
	if (itr != nodes.end())
		return itr->second.get();
	else
		return nullptr;
}

CFGNode *CFGNodePool::create_internal_node()
{
	internal_nodes.emplace_back(new CFGNode);
	return internal_nodes.back().get();
}

uint32_t CFGNodePool::get_block_id(void *userdata) const
{
	auto *node = find_node_from_userdata(userdata);
	if (node)
		return node->id;
	else
		return 0;
}

CFGNodePool::CFGNodePool()
{
}

CFGNodePool::~CFGNodePool()
{
}
} // namespace DXIL2SPIRV