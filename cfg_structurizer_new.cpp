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
#include "logging.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"
#include <algorithm>
#include <assert.h>

namespace dxil_spv
{
void CFGStructurizer::run_common_preamble()
{
#ifdef DXIL_SPIRV_DEBUG_DUMPING
	String graphviz_path;
	if (const char *env = getenv("DXIL_SPIRV_GRAPHVIZ_PATH"))
	{
		graphviz_path = env;
		debug_labels = true;
	}

	// Debug only: dump the input CFG in the format structurize-test reads.
	if (const char *env = getenv("DXIL_SPIRV_STRUCTURIZE_TEST_PATH"))
		log_cfg_structurize_test(env);
#endif

	// We make the assumption during traversal that there is only one back edge.
	// Fix this up here.
	rewrite_multiple_back_edges();

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	//log_cfg("Input state");
	if (!graphviz_path.empty())
	{
		reset_traversal();
		visit(*entry_block);
		auto graphviz_input = graphviz_path + ".input";
		log_cfg_graphviz(graphviz_input.c_str());
	}
#endif

	recompute_cfg();
	sink_ssa_constructs();
	propagate_branch_control_hints();
}

bool CFGStructurizer::ensure_valid_phi_rewrites(CFGNode *node)
{
	Vector<std::pair<CFGNode *, CFGNode *>> interposing_nodes;
	bool rewrote = false;

	auto &incomings = node->ir.phi.front().incoming;
	for (auto &incoming : incomings)
	{
		auto *ib = incoming.block;

		if (ib->ir.terminator.type != Terminator::Type::Branch)
		{
			auto *interposing = pool.create_node();
			interposing->interposing = true;
			interposing->name = node->name + ".interposing." + std::to_string(&incoming - incomings.data()).c_str();
			interposing->ir.terminator.type = Terminator::Type::Branch;

			// We may have created interposing blocks to resolve multi-back-edge cases.
			bool has_existing_interposing = !has_element(node->pred, ib) && node->pred_back_edge != ib;

			if (ib == node->pred_back_edge)
			{
				interposing->add_branch(node);
				interposing->ir.terminator.direct_block = node;

				// Some special cases since the helpers don't know how to rewrite back-edges properly.
				ib->add_branch(interposing);
				if (ib->ir.terminator.true_block == node)
					ib->ir.terminator.true_block = interposing;
				if (ib->ir.terminator.false_block == node)
					ib->ir.terminator.false_block = interposing;
				for (auto &c : ib->ir.terminator.cases)
					if (c.node == node)
						c.node = interposing;

				ib->succ_back_edge = nullptr;
				node->pred_back_edge = nullptr;
			}
			else if (has_existing_interposing)
			{
				// Need to figure out which succ is the correct path and rewrite in that direction.
				// If we have interposers it's all direct branches.
				for (auto *succ : ib->succ)
				{
					auto *scan = succ;
					while (scan != node && scan->succ.size() == 1)
						scan = scan->succ.front();

					if (scan == node || scan->succ_back_edge == node)
					{
						interposing->add_branch(succ);
						interposing->ir.terminator.direct_block = succ;
						ib->retarget_branch_pre_traversal(succ, interposing);
						break;
					}
				}

				assert(!interposing->succ.empty());
			}
			else
			{
				interposing->add_branch(node);
				interposing->ir.terminator.direct_block = node;
				ib->retarget_branch_pre_traversal(node, interposing);
			}

			interposing_nodes.emplace_back(ib, interposing);
			rewrote = true;
		}
	}

	if (!rewrote)
		return false;

	const auto rewrite_incoming = [&](CFGNode *&n)
	{
		for (auto &pair : interposing_nodes)
		{
			if (pair.first == n)
			{
				n = pair.second;
				return;
			}
		}
	};

	for (auto &phi : node->ir.phi)
		for (auto &incoming : phi.incoming)
			rewrite_incoming(incoming.block);

	return true;
}

void CFGStructurizer::convert_phi_to_variables()
{
	// Go out of SSA by writing to alloca variable on a branch.
	bool rewrote_cfg = false;

	for (auto *node : forward_post_visit_order)
	{
		if (node->ir.phi.empty())
			continue;

		// An incoming block must not have more than one successor,
		// otherwise we cannot meaningfully write to a phi variable.
		if (ensure_valid_phi_rewrites(node))
			rewrote_cfg = true;

		for (auto &phi : node->ir.phi)
		{
			spv::Id alloca_id = module.create_variable(spv::StorageClassFunction, phi.type_id);
			if (phi.relaxed)
				module.get_builder().addDecoration(alloca_id, spv::DecorationRelaxedPrecision);

			for (auto &incoming : phi.incoming)
			{
				assert(incoming.block->ir.terminator.type == Terminator::Type::Branch);
				auto *store_op = module.allocate_op(spv::OpStore);
				store_op->add_id(alloca_id);
				store_op->add_id(incoming.id);
				incoming.block->ir.operations.push_back(store_op);
			}

			// Back to SSA since future opcodes depend on it.
			auto *load_phi = module.allocate_op(spv::OpLoad, phi.id, phi.type_id);
			load_phi->add_id(alloca_id);
			node->ir.operations.insert(node->ir.operations.begin(), load_phi);
		}

		node->ir.phi.clear();
	}

	if (rewrote_cfg)
		recompute_cfg();
}

spv::Id CFGStructurizer::build_conditional_for_switch_block(
		CFGNode *node, CFGNode *target, const Vector<Terminator::Case> &cases, spv::Id cond_id)
{
	spv::Id cond = 0;

	for (auto &c : cases)
	{
		if (c.node == target)
		{
			auto *iseq = module.allocate_op(spv::OpIEqual, module.allocate_id(), module.get_builder().makeBoolType());
			iseq->add_id(cond_id);

			// TODO: Are all switch statements 32-bit?
			iseq->add_id(module.get_builder().makeUintConstant(c.value));
			node->ir.operations.push_back(iseq);

			if (cond)
			{
				auto *or_op = module.allocate_op(spv::OpLogicalOr, module.allocate_id(), module.get_builder().makeBoolType());
				or_op->add_id(cond);
				or_op->add_id(iseq->id);
				node->ir.operations.push_back(or_op);

				cond = or_op->id;
			}
			else
			{
				cond = iseq->id;
			}
		}
	}

	assert(cond);
	return cond;
}

void CFGStructurizer::rewrite_complex_loop_successors()
{
	bool rewrote = false;

	const auto is_innermost_loop_header = [](const CFGNode *header, const CFGNode *back_edge)
	{
		while (back_edge != header)
		{
			if (back_edge->pred_back_edge)
				return false;

			// Shouldn't happen unless we have a broken CFG.
			if (back_edge->immediate_dominator && back_edge->immediate_dominator != back_edge)
			{
				back_edge = back_edge->immediate_dominator;
			}
			else
			{
				LOGE("Potentially irreducible CFG detected?\n");
				abort();
			}
		}

		return true;
	};

	for (auto *node : forward_post_visit_order)
	{
		if (node->pred_back_edge && node->succ_back_edge == node)
		{
			if (node->ir.terminator.type == Terminator::Type::Branch)
			{
				// Guaranteed infinite loop that will never terminate.
				// This is UB, so replace with simple unreachable.
				node->ir.terminator.type = Terminator::Type::Unreachable;
				node->clear_branches();
			}
			else
			{
				auto *back_edge = pool.create_node();
				back_edge->interposing = true;
				back_edge->name = node->name + ".back-edge";

				std::swap(back_edge->succ, node->succ);
				std::swap(back_edge->succ_back_edge, node->succ_back_edge);
				std::swap(back_edge->ir.terminator, node->ir.terminator);
				node->pred_back_edge = back_edge;
				node->add_branch(back_edge);

				node->ir.terminator.type = Terminator::Type::Branch;
				node->ir.terminator.direct_block = back_edge;

				retarget_succ_from(back_edge, node);
			}

			rewrote = true;
		}
		else if (node->ir.terminator.type == Terminator::Type::Condition &&
		         node->succ_back_edge && !is_innermost_loop_header(node->succ_back_edge, node))
		{
			// Workaround a very awkward scenario where we're conditionally double-continuing and another path
			// continues executing the loop.
			// The traversal assumes that once we reach a back-edge we should stop, which breaks things,
			// and dealing with it inline is too awkward.
			// Workaround it by creating an interposing branch as always.
			auto *back_edge = pool.create_node();
			back_edge->interposing = true;
			back_edge->name = node->name + ".back-edge";
			back_edge->ir.terminator.type = Terminator::Type::Branch;
			back_edge->ir.terminator.direct_block = node->succ_back_edge;

			if (node->ir.terminator.true_block == node->succ_back_edge)
				node->ir.terminator.true_block = back_edge;
			if (node->ir.terminator.false_block == node->succ_back_edge)
				node->ir.terminator.false_block = back_edge;

			node->succ_back_edge->pred_back_edge = back_edge;
			back_edge->succ_back_edge = node->succ_back_edge;
			node->succ_back_edge = nullptr;
			node->add_branch(back_edge);

			rewrote = true;
		}
	}

	if (rewrote)
		recompute_cfg();
}

void CFGStructurizer::rewrite_switch_blocks()
{
	bool rewrote = false;

	// Just like NIR, untangle a switch statement into a series of conditional branches.
	// It should be possible to preserve the true switch in cases where there is nothing exciting happening w.r.t control flow.
	// E.g. the case labels share one dominance frontier. We can merge there as a perfect self-contained construct.
	// For now, always do the pessimized thing.

	for (auto *node : forward_post_visit_order)
	{
		if (node->ir.terminator.type == Terminator::Type::Switch)
		{
			Terminator::Case default_case = {};
			Vector<Terminator::Case> cases;
			std::swap(cases, node->ir.terminator.cases);

			auto itr = std::find_if(cases.begin(), cases.end(), [&](const Terminator::Case &c)
			{
				return c.is_default;
			});

			if (itr != cases.end())
			{
				default_case = *itr;
				cases.erase(itr);
			}

			// Pretty sure there must be a default case?
			assert(default_case.node);

			if (cases.empty())
			{
				// We only had one degenerate default branch somehow ...
				node->ir.terminator.type = Terminator::Type::Branch;
				node->ir.terminator.direct_block = default_case.node;
				continue;
			}

			node->clear_branches();

			spv::Id cond_id = node->ir.terminator.conditional_id;

			auto *current_node = node;
			CFGNode *current_residual = nullptr;
			current_node->ir.terminator.type = Terminator::Type::Condition;

			while (!cases.empty())
			{
				auto *n = cases.front().node;
				spv::Id conditional = build_conditional_for_switch_block(current_node, n, cases, cond_id);
				cases.erase(std::remove_if(cases.begin(), cases.end(), [&](const Terminator::Case &candidate)
				{
					return candidate.node == n;
				}), cases.end());

				current_residual = pool.create_node();
				current_residual->name = node->name + ".residual";

				current_node->ir.terminator.type = Terminator::Type::Condition;
				current_node->ir.terminator.true_block = n;
				current_node->ir.terminator.false_block = current_residual;
				current_node->ir.terminator.conditional_id = conditional;

				current_node->add_branch(n);
				current_node->add_branch(current_residual);

				current_node = current_residual;
			}

			assert(current_residual);

			current_residual->ir.terminator.type = Terminator::Type::Branch;
			current_residual->ir.terminator.direct_block = default_case.node;
			current_residual->add_branch(default_case.node);
			rewrote = true;
		}
	}

	if (rewrote)
		recompute_cfg();
}

const CFGStructurizer::SerializationLevel *
CFGStructurizer::find_level_for_block(
	const Vector<SerializationLevel> &levels, CFGNode *block)
{
	for (auto &level : levels)
		if (has_element(level.paths, block))
			return &level;
	return nullptr;
}

const CFGStructurizer::SerializationLevel *
CFGStructurizer::find_latest_level_dominating_block(const Vector<SerializationLevel> &levels, CFGNode *block)
{
	// From what I understand, a candidate block here is either a frontier in some form, in which case it should already
	// be part of a level, or it is dominated by a path directly.
	// Worst case, we have slightly less than optimal codegen.
	for (auto &level : levels)
		for (auto *path : level.paths)
			if (path->dominates(block))
				return &level;

	return nullptr;
}

void CFGStructurizer::fixup_degenerate_conditional_branch(CFGNode *node)
{
	if (node->ir.terminator.type == Terminator::Type::Condition &&
	    node->ir.terminator.true_block == node->ir.terminator.false_block)
	{
		node->collapse_conditional_to_direct(node->ir.terminator.true_block);
	}
}

void CFGStructurizer::fixup_degenerate_conditional_branches()
{
	// This doesn't really rewrite anything interesting w.r.t succs/preds,
	// just cleans up so that future passes don't have to worry.
	for (auto *node : forward_post_visit_order)
		fixup_degenerate_conditional_branch(node);
}

// Organizes a dominated sequence of code as a series of selection constructs.
// Each sequence can be represented as:
// if (path_is_not_skipped) {
//     if (path_selector) {
//         take(path[1]);
//     } else {
//         take(path[0]);
//     }
// }
// If there are more than 2 parallel paths, a switch is used instead:
// skip variable does not exist in this mode since we can just encode -1 as skip.
// switch (path_selector) {
//    case 0: take(path[0]);
//    case 1: take(path[1]);
//    case 2: take(path[2]);
//    default: skip;
// }
//
// outer_levels represents branch targets which break.

// Basically a port of inside_outside in Mesa goto_if pass.
// This is a little more clumsy than ideal.
// Mesa's implementation seems to represent back-edges as a loop header being its own dominance frontier,
// which automatically solves a lot of the edge cases here with inner loops, but that's too much of a rewrite,
// so get our hands dirty instead by checking for back-edges more explicitly.
void CFGStructurizer::split_loop_inner_outer(
		CFGNode *node, CFGNode *back_edge, Vector<CFGNode *> &back_edge_candidates,
		Vector<CFGNode *> &outer_dominated)
{
	Vector<CFGNode *> remaining;

	remaining = node->idom_children;

	// Also makes sure that back-edges are still considered in-loop.
	// As long as the header remains, the back-edge (and therefore all its loop contents) will remain too.
	// This is equivalent to Mesa since the loop header would be in the DF.
	for (auto *child : node->idom_children)
		if (child->pred_back_edge)
			push_back_unique(remaining, child->pred_back_edge);

	for (auto *remain : remaining)
	{
		if (remain->dominates(back_edge))
		{
			push_back_unique(back_edge_candidates, remain);
			// Also makes sure that back-edges are still considered in-loop.
			if (remain->pred_back_edge)
				push_back_unique(back_edge_candidates, remain->pred_back_edge);
		}
	}

	bool progress = true;
	while (!remaining.empty() && progress)
	{
		progress = false;

		for (auto itr = remaining.begin(); itr != remaining.end(); )
		{
			auto *remain = *itr;

			// Basic idea is that we either dominate the back-edge,
			// or we can form a chain of dominance frontiers that terminate at the back-edge.
			// query_reachable would also work, but we'd like to avoid relying too much on that since we don't want to
			// compute that all the time. It's also quite murky with the amount of CFG rewrites we're doing inline ...
			bool can_jump_back = remain->dominates(back_edge);

			const auto should_remain = [&](CFGNode *n)
			{
				return has_element(remaining, n) || has_element(back_edge_candidates, n) || n->dominates(back_edge);
			};

			if (!can_jump_back)
			{
				for (auto *front : remain->dominance_frontier)
				{
					if (should_remain(front))
					{
						can_jump_back = true;
						break;
					}
				}
			}

			auto *top_level_header = back_edge->succ_back_edge;
			// A back-edge will have loop header in the DF in Mesa's impl.
			// Make sure we don't mistake a long back-edge as staying inside the construct.
			if (!can_jump_back && remain->succ_back_edge &&
				top_level_header->dominates(remain->succ_back_edge) &&
				should_remain(remain->succ_back_edge))
			{
				can_jump_back = true;
			}

			// It's possible we dominate the back-edge of an inner loop.
			// We will miss any dominance frontier analysis that way.
			// Try to detect that case too. It's a bit awkward, and another goof of not using back-edge == frontier.
			// Dominating the back-edge is equivalent to having loop header in the DF in Mesa's impl.
			if (!can_jump_back)
			{
				const auto found_header_candidate = [&](CFGNode *candidate)
				{
					// Never accept our own block as ground-truth here.
					return candidate != remain && candidate->pred_back_edge &&
					       remain->dominates(candidate->pred_back_edge) && should_remain(candidate);
				};

				const auto can_iterate_idom = [top_level_header](const CFGNode *candidate)
				{
					return top_level_header->dominates(candidate) &&
					       top_level_header != candidate &&
					       candidate->immediate_dominator != candidate &&
					       candidate->immediate_dominator;
				};

				// Cannot necessarily accept the innermost loop header here. We might pass the check for an outer loop instead.
				for (auto *inner_loop_header = remain; ; inner_loop_header = inner_loop_header->immediate_dominator)
				{
					if (found_header_candidate(inner_loop_header))
					{
						can_jump_back = true;
						break;
					}

					if (!can_iterate_idom(inner_loop_header))
						break;
				}
			}

			if (!can_jump_back)
			{
				// Never add a back-edge for an outer loop into the outer dominated set.
				// We only added it temporarily as a hack to aid reachability analysis.
				if (!remain->succ_back_edge)
					push_back_unique(outer_dominated, remain);

				*itr = remaining.back();
				remaining.pop_back();
				progress = true;
			}
			else
			{
				++itr;
			}
		}
	}

	for (auto *remain : remaining)
		push_back_unique(back_edge_candidates, remain);

	// Recurse through the CFG.
	// Never process the back-edge before we have processed the header.
	// The back-edge is merely added as a temporary node to aid analysis.
	// If only the back-edge is seen here, it means the loop header has been processed.
	for (auto *remain: remaining)
		if (!remain->succ_back_edge || !has_element(remaining, remain->succ_back_edge))
			split_loop_inner_outer(remain, back_edge, back_edge_candidates, outer_dominated);
}

void CFGStructurizer::filter_outer_idom_candidates(Vector<CFGNode *> &outer_idom)
{
	// Filter out outer_idom if it's actually dominated by another candidate.
	// It would break level analysis, since they depend on dominance frontiers to work as expected.

	for (auto itr = outer_idom.begin(); itr != outer_idom.end(); )
	{
		bool has_other_dominator = false;
		for (auto &other : outer_idom)
		{
			if (other != *itr && other->dominates(*itr))
			{
				has_other_dominator = true;
				break;
			}
		}

		if (has_other_dominator)
		{
			*itr = outer_idom.back();
			outer_idom.pop_back();
		}
		else
		{
			++itr;
		}
	}
}

void CFGStructurizer::analyze_levels_skippability(CFGNode *node,
                                                  const Vector<SerializationLevel> &outer_levels,
                                                  Vector<SerializationLevel> &levels)
{
	if (!levels.empty())
	{
		for (auto *df : node->dominance_frontier)
		{
			// If df represents a direct continue or break in this scope, we do not have to keep executing all the levels.
			// If this is a dominance frontier within a selection scope, we resolve it without breaks or continues as normal.
			if (branch_requires_breaking_construct(outer_levels, df))
				continue;

			for (auto *pred : df->pred)
			{
				// Only look for critical nodes inside this construct.
				// Even if we dominate a block, it might be outside our scope for nested loops.
				if (!node->dominates(pred))
					continue;

				// pred *can* exit the overall construct, so we must effectively skip all the way to the end if that happens.
				// We could potentially model this as a big loop break, but ideally we don't.
				auto *end_itr = find_latest_level_dominating_block(levels, pred);
				if (!end_itr)
					end_itr = levels.data() + levels.size();

				for (auto *itr = levels.data(); itr != end_itr; ++itr)
					itr->skippable = true;
			}
		}

		// Direct branches will either just write a path variable and branch to merge node, or keep iterating.
		assert(node->ir.terminator.type == Terminator::Type::Condition || node->pred_back_edge);
	}

	// Now, analyze if we can reach a level by skipping over previous levels.
	// If so, we need to create a dummy skip block for all levels which could get skipped.
	for (auto &level : levels)
	{
		assert(!level.paths.empty());

		for (auto *path : level.paths)
		{
			for (auto *pred : path->pred)
			{
				// It's possible that we skipped across some levels to reach here.
				// Try to deduce which level we came from.
				auto *end_itr = find_latest_level_dominating_block(levels, pred);
				if (!end_itr)
					end_itr = levels.data() + levels.size();

				assert(&level + 1 <= end_itr);

				// Mark everything in the region skippable.
				for (auto *itr = &level + 1; itr != end_itr; ++itr)
					itr->skippable = true;
			}
		}

		uint32_t num_potential_paths = level.paths.size() + level.skippable;
		auto level_str = std::to_string(&level - levels.data());

		if (num_potential_paths > 2)
		{
			level.path_selector_id = module.create_variable(
				spv::StorageClassFunction, module.get_builder().makeIntType(32));

			if (level.skippable)
			{
				// Unless we explicitly branch to a level, consider it skipped by default.
				auto *store_op = module.allocate_op(spv::OpStore);
				store_op->add_id(level.path_selector_id);
				store_op->add_id(module.get_builder().makeIntConstant(-1));
				node->ir.operations.push_back(store_op);
			}
		}
		else if (num_potential_paths == 2)
		{
			level.path_selector_id = module.create_variable(
				spv::StorageClassFunction, module.get_builder().makeBoolType());

			if (level.skippable)
			{
				// Unless we explicitly branch to a level, consider it skipped by default.
				auto *store_op = module.allocate_op(spv::OpStore);
				store_op->add_id(level.path_selector_id);
				store_op->add_id(module.get_builder().makeBoolConstant(false));
				node->ir.operations.push_back(store_op);
			}
		}

#ifdef DXIL_SPIRV_DEBUG_DUMPING
		if (debug_labels && level.path_selector_id)
		{
			module.get_builder().addName(level.path_selector_id,
				("sel_" + node->name + "_" + level_str.c_str()).c_str());
		}
#endif

		level.input_node = pool.create_node();
		level.input_node->name = node->name + ".level.input." + level_str.c_str();

		level.output_node = pool.create_node();
		level.output_node->name = node->name + ".level.output." + level_str.c_str();

		for (auto *path: level.paths)
			level.input_node->add_branch(path);
		if (level.skippable || num_potential_paths > 2)
			level.input_node->add_branch(level.output_node);

		if (num_potential_paths >= 2)
		{
			level.input_node->ir.merge_info.merge_type = MergeType::Selection;
			level.input_node->ir.merge_info.merge_block = level.output_node;

			if (num_potential_paths > 2)
			{
				level.input_node->ir.terminator.type = Terminator::Type::Switch;

				auto *load_op = module.allocate_op(
					spv::OpLoad, module.allocate_id(), module.get_builder().makeIntType(32));
				load_op->add_id(level.path_selector_id);
				level.input_node->ir.operations.push_back(load_op);
				level.input_node->ir.terminator.conditional_id = load_op->id;

				for (size_t i = 0, n = level.paths.size(); i < n; i++)
				{
					Terminator::Case c = {};
					c.value = i;
					c.node = level.paths[i];
					level.input_node->ir.terminator.cases.push_back(c);
				}

				Terminator::Case c = {};
				c.is_default = true;
				c.node = level.output_node;
				level.input_node->ir.terminator.cases.push_back(c);
			}
			else
			{
				level.input_node->ir.terminator.type = Terminator::Type::Condition;

				auto *load_op = module.allocate_op(
					spv::OpLoad, module.allocate_id(), module.get_builder().makeBoolType());
				load_op->add_id(level.path_selector_id);
				level.input_node->ir.operations.push_back(load_op);
				level.input_node->ir.terminator.conditional_id = load_op->id;

				if (level.skippable)
				{
					level.input_node->ir.terminator.true_block = level.paths[0];
					level.input_node->ir.terminator.false_block = level.output_node;
				}
				else
				{
					level.input_node->ir.terminator.true_block = level.paths[1];
					level.input_node->ir.terminator.false_block = level.paths[0];
				}
			}
		}
		else
		{
			level.input_node->ir.terminator.type = Terminator::Type::Branch;
			level.input_node->ir.terminator.direct_block = level.paths[0];
		}
	}
}

bool CFGStructurizer::branch_requires_redirection(const Vector<SerializationLevel> &levels, CFGNode *node)
{
	// Inner continues are handled through merging execution as normal.
	return find_outer_continue_scope_for_block(node) || find_level_for_block(levels, node);
}

bool CFGStructurizer::branch_requires_breaking_construct(const Vector<SerializationLevel> &levels, CFGNode *node)
{
	if (find_outer_continue_scope_for_block(node))
		return true;

	if (auto *level = find_level_for_block(levels, node))
		return level->breaking_branch != nullptr;
	else
		return false;
}

void CFGStructurizer::organize_levels(CFGNode *node, const Vector<CFGNode *> &children,
                                      const Vector<SerializationLevel> &outer_levels,
                                      Vector<SerializationLevel> &levels,
                                      const Vector<CFGNode *> *allow_frontiers,
                                      bool promote_children_to_frontier)
{
	Vector<CFGNode *> frontier_nodes;

	// Only consider blocks that the header dominates and isn't already assigned to some other scope.
	// If we're exiting a dominance relationship, those branches will be handled specially when we branch to them.
	// Exiting means writing some path variables and potentially doing special breaks and continues
	// if the situation calls for it.

	// Used for loop exits. Make sure they are all represented by a level.
	if (promote_children_to_frontier)
	{
		for (auto *child : children)
		{
			if (allow_frontiers && !has_element(*allow_frontiers, child))
				continue;
			if (branch_requires_redirection(outer_levels, child))
				continue;

			push_back_unique(frontier_nodes, child);
		}
	}

	for (auto *child : children)
	{
		if (allow_frontiers && !has_element(*allow_frontiers, child))
			continue;
		if (branch_requires_redirection(outer_levels, child))
			continue;

		for (auto *front: child->dominance_frontier)
		{
			if (allow_frontiers && !has_element(*allow_frontiers, front))
				continue;
			if (branch_requires_redirection(outer_levels, front))
				continue;

			// Only consider new frontiers if we're the first scope to identify it.
			// A block must only belong to one scope.
			if (node->dominates(front))
				push_back_unique(frontier_nodes, front);
		}
	}

	// Any frontier node becomes a level in this dominance chain.
	// Every level represents some kind of merge of execution.
	std::sort(frontier_nodes.begin(), frontier_nodes.end(), [](const CFGNode *a, const CFGNode *b)
	{
		return a->forward_post_visit_order > b->forward_post_visit_order;
	});

	// Multiple nodes can be on the same level. This happens when there is no dominance frontier relationship
	// and we're merging execution in multiple directions at once. Shouldn't happen often.
	Vector<CFGNode *> level_blocks;

	while (!frontier_nodes.empty())
	{
		auto *candidate = frontier_nodes.back();
		frontier_nodes.pop_back();

		bool ends_level = false;

		for (auto *current_level_block : level_blocks)
		{
			// If a candidate is reachable, it must be as a frontier node.
			// If it's not a frontier, it would be dominated and would not show up here.
			if (has_element(candidate->dominance_frontier, current_level_block))
			{
				ends_level = true;
				break;
			}
		}

		if (ends_level)
		{
			levels.push_back({ std::move(level_blocks) });
			level_blocks = { candidate };
		}
		else
		{
			level_blocks.push_back(candidate);
		}
	}

	if (!level_blocks.empty())
		levels.push_back({ std::move(level_blocks) });
}

void CFGStructurizer::traverse_routes(
		Vector<SerializationLevel> &&levels,
		size_t num_traverse_levels,
		CFGNode *start_node, CFGNode *outer_merge)
{
	// All execution should have been collected at merge_node.
	// Dispatch execution to those now.
	for (size_t i = 0; i < num_traverse_levels; i++)
	{
		auto level = std::move(levels.back());
		levels.pop_back();

		// Link up level stages.
		start_node->add_branch(level.input_node);
		start_node->ir.terminator.type = Terminator::Type::Branch;
		start_node->ir.terminator.direct_block = level.input_node;

		start_node = level.output_node;
		for (auto *path : level.paths)
			serialize_merge_levels_for_dominated_paths(path, levels, level.output_node);
	}

	if (start_node != outer_merge)
	{
		if (outer_merge)
		{
			// Branch from last level to outer_merge.
			// If we dominate everything in the path to exit, there is nothing to exit to.
			start_node->add_branch(outer_merge);
			start_node->ir.terminator.type = Terminator::Type::Branch;
			start_node->ir.terminator.direct_block = outer_merge;
		}
		else
		{
			// Nowhere to branch, this must be a return.
			start_node->ir.terminator.type = Terminator::Type::Return;
		}
	}
}

bool CFGStructurizer::level_has_non_breaking_non_continue_path(CFGNode *succ, const SerializationLevel *level)
{
	// This is a continue block we're traversing from inside a loop. This is a proper continue.
	// If the continue block is reached via a frontier, we treat it as a normal merge.
	if (!level && (succ->succ_back_edge || !succ->headers.empty()))
		return false;

	// A loop break of some kind.
	// If we're overwriting a branch targeting a level that is not in a different loop scope,
	// we still need to merge control flow (and skip over code).
	if (level && level->breaking_branch)
		return false;

	return true;
}

void CFGStructurizer::route_branches(CFGNode *node,
                                     const Vector<SerializationLevel> &outer_levels,
                                     const Vector<SerializationLevel> &levels,
                                     CFGNode *outer_merge)
{
	if (node->succ_back_edge)
	{
		// We must never merge anywhere other than the merge block.
		outer_merge = node->succ_back_edge->ir.merge_info.merge_block;

		if (node->ir.terminator.type == Terminator::Type::Condition)
		{
			auto *true_level = find_level_for_block(outer_levels, node->ir.terminator.true_block);
			auto *false_level = find_level_for_block(outer_levels, node->ir.terminator.false_block);

			// The path back to header will terminate traversal.
			// The other path must be a loop exit, and will also terminate traversal,
			// so there is no need to create a new merge scope.
			enter_succ(node,
					   node->ir.terminator.true_block,
					   node->ir.terminator.false_block,
					   node->ir.terminator.conditional_id,
					   true_level, false_level,
					   outer_levels, outer_merge);
		}
		else
		{
			enter_succ(node, node->ir.terminator.direct_block, outer_levels, outer_merge);
		}

		// Direct branches need not do anything since it can only branch backwards to header anyway.
		return;
	}

	if (node->ir.terminator.type == Terminator::Type::Condition)
	{
		auto break_levels = outer_levels;
		break_levels.insert(break_levels.end(), levels.begin(), levels.end());

		// Be careful with back-edges.
		// They will not see a level, but only a header.
		// We never need to select control-flow when branching backwards, just terminate the recursion.
		// If we're directly breaking or continuing in at least one path, we do not need selection merges.
		auto *true_level = find_level_for_block(break_levels, node->ir.terminator.true_block);
		auto *false_level = find_level_for_block(break_levels, node->ir.terminator.false_block);

		auto true_non_trivial = level_has_non_breaking_non_continue_path(node->ir.terminator.true_block, true_level);
		auto false_non_trivial = level_has_non_breaking_non_continue_path(node->ir.terminator.false_block, false_level);

		CFGNode *merge_node = nullptr;
		if (true_non_trivial && false_non_trivial)
			merge_node = pool.create_node();

		// Cannot declare both selection merge and loop merge in same block.
		// There is a risk that we may have to force a selection merge after resolving branches, so be conservative for now.
		if (node->ir.merge_info.merge_type == MergeType::Loop)
			node = create_helper_succ_block(node);

		if (merge_node)
		{
			// Reconvene execution at the merge node.
			assert(node->ir.merge_info.merge_type == MergeType::None);
			node->ir.merge_info.merge_type = MergeType::Selection;
			node->ir.merge_info.merge_block = merge_node;
			merge_node->name = node->name + ".merge";
		}
		else if (true_non_trivial && node->dominates(node->ir.terminator.true_block))
		{
			// Technically we don't need to merge, but it makes the codegen a little neater since we can collapse scopes.
			// Only do so if it's possible. We might not dominate the succ here.
			assert(node->ir.merge_info.merge_type == MergeType::None);
			node->ir.merge_info.merge_type = MergeType::Selection;
			node->ir.merge_info.merge_block = node->ir.terminator.true_block;
		}
		else if (false_non_trivial && node->dominates(node->ir.terminator.false_block))
		{
			// Only do so if it's possible. We might not dominate the succ here.
			assert(node->ir.merge_info.merge_type == MergeType::None);
			node->ir.merge_info.merge_type = MergeType::Selection;
			node->ir.merge_info.merge_block = node->ir.terminator.false_block;
		}

		if (!merge_node)
			merge_node = outer_merge;

		// Now we can either enter a path we dominate (and therefore we recursively keep structurizing),
		// or we set path variables and stop.
		// Execution must reconvene at the top level.
		enter_succ(node,
		           node->ir.terminator.true_block, node->ir.terminator.false_block,
		           node->ir.terminator.conditional_id,
		           true_level, false_level,
		           break_levels, merge_node);

		assert(merge_node || levels.empty());

		// If this branch is a conditional continue or break, we don't need resolve any scopes.
		if (merge_node)
			traverse_routes(std::move(break_levels), levels.size(), merge_node, outer_merge);
	}
	else if (node->ir.terminator.type == Terminator::Type::Branch)
	{
		enter_succ(node, node->ir.terminator.direct_block, outer_levels, outer_merge);
	}
}

void CFGStructurizer::move_interposing_nodes_into_loop(
		CFGNode *header, const Vector<SerializationLevel> &outer_levels,
		Vector<CFGNode *> &back_edge_candidates, Vector<CFGNode *> &outer_idom)
{
	// An optimization (runtime and readability).
	// For conditional breaks or continues, the interposing nodes will be observed as loop exits,
	// but this creates really stupid and potentially slow codegen since we now need to route through the merge block
	// only to set some routing variables, which then need to route to other variables ...
	// Interposing nodes never do anything that can observe maximal convergence, so it's a valid transform.
	// Just move the interposing node into the loop and mark the idoms of interposer instead as outer_idom.

	for (auto itr = outer_idom.begin(); itr != outer_idom.end(); )
	{
		auto *candidate = *itr;

		// If the back-edge needs to interpose, we cannot do anything about that.
		// The continue block is not allowed to keep interposers inside the loop in SPIR-V.
		// In some extreme cases (switch blocks ...),
		// the interposer is actually a frontier for some nodes, so need to keep it outside the loop.
		if (candidate->interposing && candidate->immediate_dominator != header->pred_back_edge &&
			candidate->num_forward_preds() == 1 &&
		    has_element(back_edge_candidates, candidate->immediate_dominator))
		{
			push_back_unique(back_edge_candidates, candidate);
			assert(candidate->ir.terminator.type == Terminator::Type::Branch);
			*itr = outer_idom.back();
			outer_idom.pop_back();

			auto *real_next = candidate->ir.terminator.direct_block;

			// This cannot invalidate iterators since we just popped, so current reservation cannot be exceeded.
			if (header->dominates(real_next) && !find_level_for_block(outer_levels, real_next))
				push_back_unique(outer_idom, real_next);
		}
		else
		{
			++itr;
		}
	}
}

void CFGStructurizer::serialize_merge_levels_for_dominated_paths(
		CFGNode *node, const Vector<SerializationLevel> &outer_levels, CFGNode *outer_merge)
{
	if (node->pred_back_edge)
	{
		// This is a loop header. As expected, this gets extremely painful in unstructured control flow.
		// Split the blocks into two sets. One set that is inside the loop, and one set that is outside the loop, but we still dominate.
		// We can exit from a loop in a way that we don't (structurally) dominate ourselves.
		// This could mean a multi-level break or continue that needs to be resolved by punching through multiple ladders.
		// The only saving grace is that DXIL does not allow irreducible control flow, so we don't have to ponder that hellscape fortunately.
		Vector<CFGNode *> back_edge_candidates { node->pred_back_edge };
		push_back_unique(back_edge_candidates, node);

		Vector<CFGNode *> outer_idom;
		split_loop_inner_outer(node, node->pred_back_edge, back_edge_candidates, outer_idom);
		move_interposing_nodes_into_loop(node, outer_levels, back_edge_candidates, outer_idom);
		filter_outer_idom_candidates(outer_idom);

		// back_edge_candidates contains all nodes inside the construct.
		// outer_idom contains all nodes outside the construct that we still dominate.
		// exits contains all exits from the loop, but which we don't necessary dominate.
		// All branches to exit must reroute to the loop's merge node.
		// From there we dispatch control flow further.
		Vector<SerializationLevel> in_loop_levels, out_loop_levels;

		organize_levels(node, outer_idom, outer_levels, out_loop_levels, nullptr, true);
		analyze_levels_skippability(node, outer_levels, out_loop_levels);

		auto *merge_node = pool.create_node();
		merge_node->name = node->name + ".loop-merge";
		node->ir.merge_info.merge_type = MergeType::Loop;
		node->ir.merge_info.continue_block = node->pred_back_edge;
		node->ir.merge_info.merge_block = merge_node;

		// If an inner scope intends to directly branch here, it needs to untangle its own loop before it can branch there.
		LoopScope scope = {};
		scope.header_block = node;
		scope.merge_block = node->ir.merge_info.merge_block;
		scope.continue_block = node->ir.merge_info.continue_block;
		loop_scopes.push_back(scope);

		// Anything that exits the loop must do so through the merge node instead of inner merge.
		// Make sure that any outer level sees a breaking branch.
		// If there is no such break, it's reachable through the innermost break.
		auto merge_levels = outer_levels;
		merge_levels.insert(merge_levels.end(), out_loop_levels.begin(), out_loop_levels.end());
		for (auto &outer_level : merge_levels)
			if (!outer_level.breaking_branch)
				outer_level.breaking_branch = merge_node;

		organize_levels(node, node->idom_children, merge_levels, in_loop_levels, &back_edge_candidates, false);

		// Inside the loop anything that reaches outside the loop must be a direct break no matter what,
		// so we never infer skips inside the loop.
		analyze_levels_skippability(node, merge_levels, in_loop_levels);

		// Route the inner scope.
		route_branches(node, merge_levels, in_loop_levels, merge_node);

		assert(!loop_scopes.empty());

		// It's possible we never visited the continue block in some cases. Force a visit now to make
		// sure branches are re-directed to merge block properly.
		if (!loop_scopes.back().visited_continue_block)
			route_branches(node->ir.merge_info.continue_block, merge_levels, in_loop_levels, merge_node);

		scope = loop_scopes.back();
		loop_scopes.pop_back();
		assert(scope.merge_block == node->ir.merge_info.merge_block);
		assert(scope.continue_block == node->ir.merge_info.continue_block);
		assert(scope.visited_continue_block);

		// We're outside the loop now, so it's not a break anymore.
		for (auto &merge_level : merge_levels)
			if (merge_level.breaking_branch == merge_node)
				merge_level.breaking_branch = nullptr;

		if (!loop_scopes.empty())
			merge_node = route_loop_bypass(node, merge_node, scope.bypass_break_id, scope.bypass_continue_id, loop_scopes.back());
		else
			assert(scope.bypass_break_id == 0 && scope.bypass_continue_id == 0);

		// Resolve the outer branches. Do not use route_branches here since we've already dealt with branches.
		// We're effectively starting routing from the merge node now.
		traverse_routes(std::move(merge_levels), out_loop_levels.size(), merge_node, outer_merge);
	}
	else
	{
		Vector<SerializationLevel> levels;
		organize_levels(node, node->idom_children, outer_levels, levels, nullptr, false);
		analyze_levels_skippability(node, outer_levels, levels);
		route_branches(node, outer_levels, levels, outer_merge);
	}
}

CFGNode *CFGStructurizer::route_conditional_break(CFGNode *node, spv::Id var_id, CFGNode *break_candidate, const char *tag)
{
	assert(var_id != 0);

	auto *load_op = module.allocate_op(spv::OpLoad, module.allocate_id(), module.get_builder().makeBoolType());
	load_op->add_id(var_id);
	node->ir.operations.push_back(load_op);

	auto *merge = pool.create_node();
	merge->name = node->name + tag;

	node->add_branch(break_candidate);
	node->add_branch(merge);

	node->ir.terminator.true_block = break_candidate;
	node->ir.terminator.false_block = merge;
	node->ir.terminator.type = Terminator::Type::Condition;
	node->ir.terminator.conditional_id = load_op->id;
	node->ir.merge_info.merge_type = MergeType::Selection;
	node->ir.merge_info.merge_block = merge;

	return merge;
}

CFGNode *CFGStructurizer::route_loop_bypass(CFGNode *header, CFGNode *merge,
                                            spv::Id bypass_break_id, spv::Id bypass_continue_id,
                                            const LoopScope &outer_scope)
{
	if (bypass_break_id != 0)
	{
		auto *store_op = module.allocate_op(spv::OpStore);
		store_op->add_id(bypass_break_id);
		store_op->add_id(module.get_builder().makeBoolConstant(false));
		header->ir.operations.push_back(store_op);

		merge = route_conditional_break(merge, bypass_break_id, outer_scope.merge_block, ".post-break");
	}

	if (bypass_continue_id != 0)
	{
		auto *store_op = module.allocate_op(spv::OpStore);
		store_op->add_id(bypass_continue_id);
		store_op->add_id(module.get_builder().makeBoolConstant(false));
		header->ir.operations.push_back(store_op);

		merge = route_conditional_break(merge, bypass_continue_id, outer_scope.continue_block, ".post-continue");
	}
	return merge;
}

CFGStructurizer::LoopScope *CFGStructurizer::find_scope_for_block(CFGNode *node)
{
	for (auto &scope : loop_scopes)
		if (scope.merge_block == node || scope.continue_block == node || scope.header_block == node)
			return &scope;

	return nullptr;
}

bool CFGStructurizer::is_backwards_branch(CFGNode *node) const
{
	for (auto &scope : loop_scopes)
		if (scope.header_block == node)
			return true;

	return false;
}

CFGStructurizer::LoopScope *CFGStructurizer::find_outer_continue_scope_for_block(CFGNode *node)
{
	auto *scope = find_scope_for_block(node);
	if (scope && scope == &loop_scopes.back())
		scope = nullptr;
	return scope && scope->continue_block == node ? scope : nullptr;
}

bool CFGStructurizer::resolve_complex_breaks(CFGNode *from, CFGNode *rerouted_succ, CFGNode *intended_succ)
{
	bool has_side_effect = false;
	bool masked_write = from->ir.terminator.type == Terminator::Type::Condition && intended_succ;

	// Check if we're doing multiple levels of loops.
	// Need to setup routing variables that are run after the loop(s) merge.
	auto *scope = find_scope_for_block(rerouted_succ);
	if (scope && scope != &loop_scopes.back())
	{
		auto *end_itr = loop_scopes.data() + loop_scopes.size();
		assert(scope != end_itr);

		spv::Id cond_id;
		if (masked_write)
		{
			cond_id = from->ir.terminator.conditional_id;
			assert(from->ir.terminator.true_block == intended_succ || from->ir.terminator.false_block == intended_succ);

			if (from->ir.terminator.false_block == intended_succ)
			{
				auto *selector = module.allocate_op(spv::OpLogicalNot, module.allocate_id(), module.get_builder().makeBoolType());
				selector->add_id(cond_id);
				from->ir.operations.push_back(selector);
				cond_id = selector->id;
			}
		}
		else
		{
			cond_id = module.get_builder().makeBoolConstant(true);
		}

		if (scope->continue_block == rerouted_succ)
		{
			scope++;
			if (scope->bypass_continue_id == 0)
				scope->bypass_continue_id = module.create_variable(spv::StorageClassFunction, module.get_builder().makeBoolType());

			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->add_id(scope->bypass_continue_id);
			store_op->add_id(cond_id);
			from->ir.operations.push_back(store_op);
			has_side_effect = true;
		}

		scope++;

		for (; scope != end_itr; scope++)
		{
			if (scope->bypass_break_id == 0)
				scope->bypass_break_id = module.create_variable(spv::StorageClassFunction, module.get_builder().makeBoolType());

			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->add_id(scope->bypass_break_id);
			store_op->add_id(cond_id);
			from->ir.operations.push_back(store_op);
			has_side_effect = true;
		}
	}

	return has_side_effect;
}

bool CFGStructurizer::resolve_direct_path(CFGNode *from, CFGNode *succ, const SerializationLevel *level)
{
	bool has_side_effect = false;

	// We cannot create interposing blocks, so do the conditional write as selects instead.
	// Normally we expect only back-edges to hit this path.
	bool masked_write = from->ir.terminator.type == Terminator::Type::Condition;

	for (size_t i = 0, n = (level ? level->paths.size() : 0); i < n; i++)
	{
		if (level->paths[i] != succ)
			continue;

		has_side_effect = resolve_complex_breaks(from, level->breaking_branch ? level->breaking_branch : succ, succ);

		uint32_t num_paths = level->paths.size() + level->skippable;

		if (num_paths >= 3)
		{
			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->add_id(level->path_selector_id);

			// If the level is not skippable, we can write garbage. It must be overwritten by someone else on the way.
			if (masked_write && level->skippable)
			{
				auto *selector = module.allocate_op(spv::OpSelect, module.allocate_id(), module.get_builder().makeIntType(32));
				selector->add_id(from->ir.terminator.conditional_id);

				assert(from->ir.terminator.true_block == succ || from->ir.terminator.false_block == succ);

				if (succ == from->ir.terminator.true_block)
				{
					selector->add_id(module.get_builder().makeIntConstant(i));
					selector->add_id(module.get_builder().makeIntConstant(-1));
				}
				else
				{
					selector->add_id(module.get_builder().makeIntConstant(-1));
					selector->add_id(module.get_builder().makeIntConstant(i));
				}

				from->ir.operations.push_back(selector);
				store_op->add_id(selector->id);
			}
			else
			{
				store_op->add_id(module.get_builder().makeIntConstant(i));
			}

			from->ir.operations.push_back(store_op);
			has_side_effect = true;
			break;
		}
		else if (num_paths == 2)
		{
			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->add_id(level->path_selector_id);

			bool path_is_true = bool(i) || level->skippable;

			// If we're going to write false regardless of path being taken or not, no need to be fancy.
			if (masked_write && path_is_true)
			{
				spv::Id cond_id = from->ir.terminator.conditional_id;
				if (succ == from->ir.terminator.false_block)
				{
					auto *selector = module.allocate_op(spv::OpLogicalNot, module.allocate_id(), module.get_builder().makeBoolType());
					selector->add_id(cond_id);
					from->ir.operations.push_back(selector);
					cond_id = selector->id;
				}
				store_op->add_id(cond_id);
			}
			else
			{
				store_op->add_id(module.get_builder().makeBoolConstant(path_is_true));
			}

			from->ir.operations.push_back(store_op);
			has_side_effect = true;
			break;
		}
	}

	// We might be doing a complex backwards branch instead.
	if (!level)
		has_side_effect = resolve_complex_breaks(from, succ, succ);

	return has_side_effect;
}

void CFGStructurizer::enter_succ(
		CFGNode *node, CFGNode *succ, const Vector<SerializationLevel> &levels, CFGNode *merge_node)
{
	if (node->succ_back_edge)
		find_scope_for_block(node)->visited_continue_block = true;

	auto *level = find_level_for_block(levels, succ);
	if (level)
	{
		// Write path variables and leave.
		resolve_direct_path(node, succ, level);
		node->retarget_branch_pre_traversal(succ, level->breaking_branch ? loop_scopes.back().merge_block : merge_node);
	}
	else if (resolve_complex_breaks(node, succ, succ))
	{
		// Could happen for direct continue to outer loop header. It won't show up as a level.
		node->retarget_branch_pre_traversal(succ, loop_scopes.back().merge_block);
	}
	else if (!is_backwards_branch(succ))
	{
		assert(node->dominates(succ));
		serialize_merge_levels_for_dominated_paths(succ, levels, merge_node);
	}
}

void CFGStructurizer::enter_succ(CFGNode *node, CFGNode *true_path, CFGNode *false_path, spv::Id cond,
                                 const SerializationLevel *true_level, const SerializationLevel *false_level,
                                 const Vector<SerializationLevel> &levels,
                                 CFGNode *merge_node)
{
	if (node->succ_back_edge)
		find_scope_for_block(node)->visited_continue_block = true;

	auto *true_outer_continue = find_outer_continue_scope_for_block(true_path);
	auto *false_outer_continue = find_outer_continue_scope_for_block(false_path);

	if (!true_level && !false_level && !true_outer_continue && !false_outer_continue)
	{
		// It's possible that we dominate both paths, and therefore there are no associated break levels.
		// Just walk the graph in both directions as normal.
		// Never walk backwards though.
		if (!is_backwards_branch(true_path))
			serialize_merge_levels_for_dominated_paths(true_path, levels, merge_node);
		if (!is_backwards_branch(false_path))
			serialize_merge_levels_for_dominated_paths(false_path, levels, merge_node);
	}
	else if (true_level && true_level == false_level)
	{
		// We can be a little smarter and rewrite a selection into a direct branch with adjusted cond value.
		auto &level = *true_level;
		auto &builder = module.get_builder();

		uint32_t num_paths = level.paths.size() + level.skippable;

		// It should never happen that we get here with num_paths == 1.
		// We already collapsed degenerate branches.
		assert(num_paths >= 2);

		if (num_paths >= 3)
		{
			auto true_value = std::find(level.paths.begin(), level.paths.end(), true_path) - level.paths.begin();
			auto false_value = std::find(level.paths.begin(), level.paths.end(), false_path) - level.paths.begin();

			auto *sel = module.allocate_op(spv::OpSelect, module.allocate_id(), builder.makeIntType(32));
			sel->add_id(cond);
			sel->add_id(builder.makeIntConstant(true_value));
			sel->add_id(builder.makeIntConstant(false_value));
			node->ir.operations.push_back(sel);

			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->add_id(level.path_selector_id);
			store_op->add_id(sel->id);
			node->ir.operations.push_back(store_op);
		}
		else
		{
			auto true_value = std::find(level.paths.begin(), level.paths.end(), true_path) - level.paths.begin() + level.skippable;
			assert(true_value < 2);

			if (true_value == 0)
			{
				// Flip the condition.
				auto *flip = module.allocate_op(spv::OpLogicalNot, module.allocate_id(), builder.makeBoolType());
				flip->add_id(cond);
				node->ir.operations.push_back(flip);

				cond = flip->id;
			}

			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->add_id(level.path_selector_id);
			store_op->add_id(cond);
			node->ir.operations.push_back(store_op);
		}

		// If we branch to same level, we must also take the same multi-break routing to get there.
		if (level.breaking_branch)
			resolve_complex_breaks(node, level.breaking_branch, nullptr);

		auto *rewrite_target = level.breaking_branch ? loop_scopes.back().merge_block : merge_node;
		if (rewrite_target)
			node->collapse_conditional_to_direct(rewrite_target);
	}
	else
	{
		// Divergence. Handle each branch separately.
		bool true_block = select_path(node, true_level, true_path, ".sel-true", levels, merge_node);
		bool false_block = select_path(node, false_level, false_path, ".sel-false", levels, merge_node);

		// It's possible that we started off with assumption of not needing to merge selection control flow.
		// When interposing blocks are introduced however, we are forced to merge *somewhere*.
		if (node->ir.merge_info.merge_type == MergeType::None && (true_block || false_block))
		{
			// We could opt for merge to Unreachable if both paths were actually breaking paths.
			node->ir.merge_info.merge_type = MergeType::Selection;

			bool true_is_break = !level_has_non_breaking_non_continue_path(true_path, true_level);
			bool false_is_break = !level_has_non_breaking_non_continue_path(false_path, false_level);

			if (true_block && !true_is_break && false_is_break)
				node->ir.merge_info.merge_block = node->ir.terminator.true_block;
			else if (false_block && !false_is_break && true_is_break)
				node->ir.merge_info.merge_block = node->ir.terminator.false_block;
		}
	}
}

bool CFGStructurizer::select_path(CFGNode *node, const SerializationLevel *level, CFGNode *path, const char *tag,
                                  const Vector<SerializationLevel> &levels, CFGNode *merge_node)
{
	// We're only interested in outer scopes here.
	// Local merge needs to be handled, but local continue is done through normal structured path.
	bool outer_continue = find_outer_continue_scope_for_block(path) != nullptr;

	if (level || outer_continue)
	{
		auto *interposing = pool.create_node();
		interposing->name = node->name + tag;
		interposing->ir.terminator.type = Terminator::Type::Branch;
		interposing->ir.terminator.direct_block = path;
		interposing->interposing = true;

		// Breaking out of loop, or multiple continues is considered complex.
		bool complex_break = branch_requires_breaking_construct(levels, path);

		if (node->succ_back_edge)
		{
			// Due to SPIR-V structurization rules we cannot create an interposing block between back-edge and merge.
			// The back-edge must branch directly to merge target or loop header in the end.
			// We cannot unconditionally write the path variables either, since there may exist a path through the CFG
			// that does not reset the path variable appropriately in some edge cases
			// if continue tried to break to some weird scope. Be conservative and use a select + write.
			// If we don't take the exit path, we keep the default value.
			resolve_direct_path(node, path, level);
			auto *rewrite_target = loop_scopes.back().merge_block;
			node->retarget_branch_pre_traversal(path, rewrite_target);
			return false;
		}
		else
		{
			// There is a risk that when we introduce interposing blocks in a different path
			// we have to merge somewhere anyway, and that *anywhere* might have to be this very interposing block.
			// Be conservative and keep it around.
			bool need_interposing = resolve_direct_path(interposing, path, level) ||
			                        node->ir.merge_info.merge_type == MergeType::None;

			if (need_interposing)
			{
				interposing->add_branch(path);
				node->retarget_branch_pre_traversal(path, interposing);
			}
			else
			{
				interposing = node;
			}

			auto *rewrite_target = complex_break ? loop_scopes.back().merge_block : merge_node;
			if (rewrite_target)
				interposing->retarget_branch_pre_traversal(path, rewrite_target);
			return need_interposing;
		}
	}
	else if (!is_backwards_branch(path))
	{
		serialize_merge_levels_for_dominated_paths(path, levels, merge_node);
	}

	return false;
}

void CFGStructurizer::serialize_merge_levels_for_dominated_paths_entry()
{
	Vector<SerializationLevel> levels;
	serialize_merge_levels_for_dominated_paths(entry_block, levels, nullptr);
}

bool CFGStructurizer::run_structurizer()
{
	limited_control_flow_analysis = true;
	experimental_unstructured_flow = false;

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	String graphviz_path;
	if (const char *env = getenv("DXIL_SPIRV_GRAPHVIZ_PATH"))
		graphviz_path = env;
#endif

	run_common_preamble();

	// Shouldn't happen, but it's valid and fuzzer can hit it.
	fixup_degenerate_conditional_branches();

	// We will not rely on re-inserting PHI here, so convert everything back to plain old variables.
	convert_phi_to_variables();

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".phi";
		log_cfg_graphviz(graphviz_split.c_str());
	}
#endif

	// Switch blocks complicate too many things.
	// NIR does this too, which this implementation is heavily based on.
	// Explode any non-trivial switch blocks into a series of conditional branches.
	rewrite_switch_blocks();

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".switch";
		log_cfg_graphviz(graphviz_split.c_str());
	}
#endif

	// Single block loops are annoying to deal with. Ensure that back-edge != header.
	rewrite_complex_loop_successors();

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".single-block-loop";
		log_cfg_graphviz(graphviz_split.c_str());
	}
#endif

	serialize_merge_levels_for_dominated_paths_entry();
	recompute_cfg();

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".final";
		log_cfg_graphviz(graphviz_split.c_str());
	}
#endif

	// It's possible SSA dominance is broken as a result of splitting loop scopes and maximal reconvergence.
	// Fix this up now.
	fixup_broken_value_dominance();

	return true;
}
}