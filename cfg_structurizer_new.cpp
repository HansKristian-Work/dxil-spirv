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
		graphviz_path = env;

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
		if (incoming.block->ir.terminator.type != Terminator::Type::Branch)
		{
			auto *interposing = pool.create_node();
			interposing->name = node->name + ".interposing";
			interposing->add_branch(node);
			interposing->ir.terminator.type = Terminator::Type::Branch;
			interposing->ir.terminator.direct_block = node;

			incoming.block->retarget_branch_pre_traversal(node, interposing);
			interposing_nodes.emplace_back(incoming.block, interposing);
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
				assert(incoming.block->ir.terminator.type == Terminator::Type::Branch &&
					incoming.block->ir.terminator.direct_block == node);

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
				spv::Id conditional = build_conditional_for_switch_block(node, n, cases, cond_id);
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
CFGStructurizer::find_latest_level_reaching_block(const Vector<SerializationLevel> &levels, CFGNode *block)
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
void CFGStructurizer::split_loop_inner_outer(
		CFGNode *node, CFGNode *back_edge, Vector<CFGNode *> &back_edge_candidates,
		Vector<CFGNode *> &outer_dominated, Vector<CFGNode *> &loop_exits)
{
	Vector<CFGNode *> remaining;

	// TODO: Only add nodes if we're the innermost loop that dominates.
	// For nested loops it's possible that the outer loop is the loop that actually "owns" the exit.
	remaining = node->idom_children;

	for (auto *remain : remaining)
		if (remain->dominates(back_edge))
			push_back_unique(back_edge_candidates, remain);

	bool progress = true;
	while (!remaining.empty() && progress)
	{
		progress = false;

		for (auto itr = remaining.begin(); itr != remaining.end(); )
		{
			auto *remain = *itr;
			bool can_jump_back = remain->dominates(back_edge);

			if (!can_jump_back)
			{
				for (auto *front : remain->dominance_frontier)
				{
					if (has_element(remaining, front) || has_element(back_edge_candidates, front) || front->dominates(back_edge))
					{
						can_jump_back = true;
						break;
					}
				}
			}

			if (!can_jump_back)
			{
				push_back_unique(outer_dominated, remain);
				itr = remaining.erase(itr);
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
	for (auto *remain: remaining)
		split_loop_inner_outer(remain, back_edge, back_edge_candidates, outer_dominated, loop_exits);

	for (auto *succ : node->succ)
		if (!has_element(back_edge_candidates, succ))
			push_back_unique(loop_exits, succ);
}

void CFGStructurizer::analyze_levels_skippability(CFGNode *node, Vector<SerializationLevel> &levels)
{
	if (!levels.empty())
	{
		for (auto *df : node->dominance_frontier)
		{
			// TODO: If df represents a direct continue or break in this scope, we do not have to keep executing all the levels.
			// if (branch_is_break_or_continue(df)) continue;

			for (auto *pred : df->pred)
			{
				// Only look for critical nodes inside this construct.
				if (!node->dominates(pred))
					continue;

				// pred *can* exit the overall construct, so we must effectively skip all the way to the end if that happens.
				// We could potentially model this as a big loop break, but ideally we don't.
				auto *end_itr = find_latest_level_reaching_block(levels, pred);
				if (!end_itr)
					end_itr = levels.data() + levels.size();

				for (auto *itr = levels.data(); itr != end_itr; ++itr)
					itr->skippable = true;
			}
		}

		// Direct branches will either just write a path variable and branch to merge node, or keep iterating.
		assert(node->ir.terminator.type == Terminator::Type::Condition);
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
				auto *end_itr = find_latest_level_reaching_block(levels, pred);
				if (!end_itr)
					end_itr = levels.data() + levels.size();

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

		if (level.path_selector_id)
		{
			module.get_builder().addName(level.path_selector_id,
				(node->name + "_sel_" + level_str.c_str()).c_str());
		}

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

void CFGStructurizer::organize_levels(CFGNode *node, const Vector<CFGNode *> &children,
                                      const Vector<SerializationLevel> &outer_levels,
                                      Vector<SerializationLevel> &levels,
                                      const Vector<CFGNode *> *block_exits,
                                      bool promote_children_to_frontier)
{
	Vector<CFGNode *> frontier_nodes;

	// Only consider blocks that the header dominates and isn't already assigned to some other scope.
	// If we're exiting a dominance relationship, those branches will be handled specially when we branch to them.
	// Exiting means writing some path variables and potentially doing special breaks and continues
	// if the situation calls for it.

	// Used for loop exits. Make sure they are all represented by a level.
	if (promote_children_to_frontier)
		for (auto *child : children)
			push_back_unique(frontier_nodes, child);

	for (auto *child : children)
	{
		for (auto *front: child->dominance_frontier)
		{
			if (block_exits && has_element(*block_exits, front))
				continue;

			// Only consider new frontiers if we're the first scope to identify it.
			// A block must only belong to one scope.
			if (node->dominates(front) && !find_level_for_block(outer_levels, front))
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

void CFGStructurizer::route_branches(CFGNode *node,
                                     const Vector<SerializationLevel> &outer_levels,
                                     const Vector<SerializationLevel> &levels,
                                     CFGNode *outer_merge)
{
	if (node->succ_back_edge)
	{
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

		const auto level_has_non_breaking_non_continue_path = [](CFGNode *succ, const SerializationLevel *level)
		{
			// This is a continue block we're traversing from inside a loop. This is a proper continue.
			if (succ->succ_back_edge && succ->succ_back_edge != succ)
				return false;

			// A loop break of some kind.
			// If we're overwriting a branch targeting a level that is not in a different loop scope,
			// we still need to merge control flow (and skip over code).
			if (level && level->breaking_branch)
				return false;

			return true;
		};

		auto true_non_trivial = level_has_non_breaking_non_continue_path(node->ir.terminator.true_block, true_level);
		auto false_non_trivial = level_has_non_breaking_non_continue_path(node->ir.terminator.false_block, false_level);

		CFGNode *merge_node = nullptr;
		if (true_non_trivial && false_non_trivial)
			merge_node = pool.create_node();

		// Cannot declare both selection merge and loop merge in same block.
		if ((true_non_trivial || false_non_trivial) && node->ir.merge_info.merge_type == MergeType::Loop)
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
		Vector<CFGNode *> exits;
		split_loop_inner_outer(node, node->pred_back_edge, back_edge_candidates, outer_idom, exits);

		// back_edge_candidates contains all nodes inside the construct.
		// outer_idom contains all nodes outside the construct that we still dominate.
		// exits contains all exits from the loop, but which we don't necessary dominate.
		// All branches to exit must reroute to the loop's merge node.
		// From there we dispatch control flow further.
		Vector<SerializationLevel> in_loop_levels, out_loop_levels;
		organize_levels(node, back_edge_candidates, outer_levels, in_loop_levels, &exits, false);
		analyze_levels_skippability(node, in_loop_levels);

		organize_levels(node, outer_idom, outer_levels, out_loop_levels, nullptr, true);
		analyze_levels_skippability(node, out_loop_levels);

		auto *merge_node = pool.create_node();
		merge_node->name = node->name + ".loop-merge";
		node->ir.merge_info.merge_type = MergeType::Loop;
		node->ir.merge_info.continue_block = node->pred_back_edge;
		node->ir.merge_info.merge_block = merge_node;

		// Anything that exits the loop must do so through the merge node instead of inner merge.
		for (auto &outer_level : out_loop_levels)
			outer_level.breaking_branch = merge_node;

		auto merge_levels = outer_levels;
		merge_levels.insert(merge_levels.end(), out_loop_levels.begin(), out_loop_levels.end());

		// Route the inner scope.
		route_branches(node, merge_levels, in_loop_levels, merge_node);

		// We're outside the loop now, so it's not a break anymore.
		for (size_t i = merge_levels.size() - out_loop_levels.size(); i < merge_levels.size(); i++)
			merge_levels[i].breaking_branch = nullptr;

		// Maybe this can happen for a true infinite loop?
		// Early return will manifest as a loop exit in this model.
		assert(!out_loop_levels.empty());

		// Resolve the outer branches. Do not use route_branches here since we've already dealt with branches.
		// We're effectively starting routing from the merge node now.
		traverse_routes(std::move(merge_levels), out_loop_levels.size(), merge_node, outer_merge);
	}
	else
	{
		Vector<SerializationLevel> levels;
		organize_levels(node, node->idom_children, outer_levels, levels, nullptr, false);
		analyze_levels_skippability(node, levels);
		route_branches(node, outer_levels, levels, outer_merge);
	}
}

void CFGStructurizer::resolve_direct_path(CFGNode *from, CFGNode *succ, const SerializationLevel &level)
{
	for (size_t i = 0, n = level.paths.size(); i < n; i++)
	{
		if (level.paths[i] == succ)
		{
			uint32_t num_paths = level.paths.size() + level.skippable;

			if (num_paths >= 3)
			{
				auto *store_op = module.allocate_op(spv::OpStore);
				store_op->add_id(level.path_selector_id);
				store_op->add_id(module.get_builder().makeIntConstant(i));
				from->ir.operations.push_back(store_op);
			}
			else if (num_paths == 2)
			{
				auto *store_op = module.allocate_op(spv::OpStore);
				store_op->add_id(level.path_selector_id);
				store_op->add_id(module.get_builder().makeBoolConstant(bool(i) || level.skippable));
				from->ir.operations.push_back(store_op);
			}

			break;
		}
	}
}

void CFGStructurizer::enter_succ(
		CFGNode *node, CFGNode *succ, const Vector<SerializationLevel> &levels, CFGNode *merge_node)
{
	auto *level = find_level_for_block(levels, succ);
	if (level)
	{
		// Write path variables and leave.
		resolve_direct_path(node, succ, *level);
		node->retarget_branch_pre_traversal(succ, merge_node);
	}
	else
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
	if (!true_level && !false_level)
	{
		// It's possible that we dominate both paths, and therefore there are no associated break levels.
		// Just walk the graph in both directions as normal.
		if (true_path != node->succ_back_edge)
			serialize_merge_levels_for_dominated_paths(true_path, levels, merge_node);
		if (false_path != node->succ_back_edge)
			serialize_merge_levels_for_dominated_paths(false_path, levels, merge_node);
	}
	else if (true_level == false_level)
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

		auto *rewrite_target = level.breaking_branch ? level.breaking_branch : merge_node;
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

			bool true_is_break = true_level && true_level->breaking_branch;
			bool false_is_break = false_level && false_level->breaking_branch;

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
	if (level)
	{
		if (node->succ_back_edge)
		{
			// Due to SPIR-V structurization rules we cannot create an interposing block between back-edge and merge.
			// The back-edge must branch directly to merge target or loop header in the end.
			// This means we're redundantly writing selections, but that's okay for our purposes.
			resolve_direct_path(node, path, *level);
			assert(level->breaking_branch);
			node->retarget_branch_pre_traversal(path, level->breaking_branch);
		}
		else
		{
			auto *dummy_true = pool.create_node();
			dummy_true->name = node->name + tag;
			dummy_true->add_branch(path);
			dummy_true->ir.terminator.type = Terminator::Type::Branch;
			dummy_true->ir.terminator.direct_block = path;

			node->retarget_branch_pre_traversal(path, dummy_true);
			resolve_direct_path(dummy_true, path, *level);

			auto *rewrite_target = level->breaking_branch ? level->breaking_branch : merge_node;
			if (rewrite_target)
				dummy_true->retarget_branch_pre_traversal(path, rewrite_target);

			return true;
		}
	}
	else if (path != node->succ_back_edge)
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

bool CFGStructurizer::run_experimental()
{
	experimental_flow = true;
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

	serialize_merge_levels_for_dominated_paths_entry();

	reset_traversal();
	visit(*entry_block);

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".final";
		log_cfg_graphviz(graphviz_split.c_str());
	}
#endif

	return true;
}
}