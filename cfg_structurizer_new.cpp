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

void CFGStructurizer::convert_phi_to_variables()
{

}

void CFGStructurizer::rewrite_switch_blocks()
{

}

Vector<CFGNode *> CFGStructurizer::get_idom_children(CFGNode *node)
{
	// TODO: Extremely inefficient, should be replaced by an array in recompute_cfg().
	Vector<CFGNode *> nodes;
	for (auto *n : forward_post_visit_order)
		if (n->immediate_dominator == node)
			nodes.push_back(n);
	return nodes;
}

const CFGStructurizer::SerializationLevel *CFGStructurizer::find_level_for_block(
		const Vector<SerializationLevel> &levels, CFGNode *block)
{
	for (auto &level : levels)
		if (has_element(level.paths, block))
			return &level;
	return nullptr;
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
void CFGStructurizer::serialize_merge_levels_for_dominated_paths(
		CFGNode *node, const Vector<SerializationLevel> &outer_levels, CFGNode *outer_merge)
{
	auto children = get_idom_children(node);
	Vector<CFGNode *> frontier_nodes;

	// Only consider blocks that the header dominates.
	// If we're exiting a dominance relationship, those branches will be handled specially.
	for (auto *child: children)
		for (auto *front: child->dominance_frontier)
			if (!has_element(frontier_nodes, front) && node->dominates(front))
				frontier_nodes.push_back(front);

	// Any frontier node becomes a level in this dominance chain.
	// Every level represents some kind of merge of execution.
	std::sort(frontier_nodes.begin(), frontier_nodes.end(), [](const CFGNode *a, const CFGNode *b)
	{
		return a->forward_post_visit_order > b->forward_post_visit_order;
	});

	// A stack of serialization levels.
	Vector<SerializationLevel> levels;

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

	for (auto *df : node->dominance_frontier)
	{
		for (auto *pred : df->pred)
		{
			// Only look for critical nodes inside this construct.
			if (!node->dominates(pred))
				continue;

			// pred *can* exit the overall construct, so we must effectively skip all the way to the end.
			// We could potentially model this as a big loop break, but ideally we don't.

			for (auto &level : levels)
			{
				if (level.skippable)
					continue;

				// Conservative. It's always valid to make a block skippable.
				// We'd just rather avoid it if possible.
				level.skippable = true;
				for (auto *path: level.paths)
				{
					if (path->dominates(pred))
					{
						level.skippable = false;
						break;
					}
				}
			}
		}
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
				auto *pred_level = find_level_for_block(levels, pred);
				auto itr = &level + 1;
				auto *end_itr = pred_level ? pred_level : levels.data() + levels.size();

				// Mark everything in the region skippable.
				for (; itr != end_itr; ++itr)
					itr->skippable = true;
			}
		}

		uint32_t num_potential_paths = level.paths.size() + level.skippable;

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

		auto level_str = std::to_string(&level - levels.data());
		level.input_node = pool.create_node();
		level.input_node->name = node->name + ".level.input." + level_str.c_str();

		level.output_node = pool.create_node();
		level.output_node->name = node->name + ".level.output." + level_str.c_str();

		for (auto *path: level.paths)
			level.input_node->add_branch(path);
		if (level.skippable)
			level.input_node->add_branch(level.output_node);

		// TODO: Setup branch and merge targets.
	}

	auto break_levels = outer_levels;
	break_levels.insert(break_levels.end(), levels.begin(), levels.end());

	if (node->ir.terminator.type == Terminator::Type::Condition)
	{
		CFGNode *merge_node = pool.create_node();
		// Now we can either enter a path we dominate (and therefore we recursively keep structurizing),
		// or we set path variables and stop.
		// Execution must reconvene at the top level.
		enter_succ(node->ir.terminator.true_block,
		           node->ir.terminator.false_block,
		           node->ir.terminator.conditional_id,
		           levels, merge_node);
	}
	else if (node->ir.terminator.type == Terminator::Type::Branch)
	{
		enter_succ(node->ir.terminator.direct_block, break_levels, outer_merge);
	}

	// All execution should have been collected at levels now.
	// Dispatch execution to those now.
	while (!levels.empty())
	{
		auto level = std::move(levels.back());
		levels.pop_back();
		break_levels.pop_back();

		for (auto *path : level.paths)
			enter_succ(path, break_levels, level.output_node);
	}

	if (!node->dominance_frontier.empty() && outer_merge)
	{
		// Branch from last level to outer_merge.
		// If we dominate everything in the path to exit, there is nothing to exit to.
	}
}

void CFGStructurizer::enter_succ(CFGNode *succ, const Vector<SerializationLevel> &levels, CFGNode *merge_node)
{
	auto *level = find_level_for_block(levels, succ);
	if (level)
	{
		// Write path variables and leave.
	}
	else
	{
		serialize_merge_levels_for_dominated_paths(succ, levels, merge_node);
	}
}

void CFGStructurizer::enter_succ(CFGNode *true_path, CFGNode *false_path,
                                 spv::Id cond, const Vector<SerializationLevel> &levels,
                                 CFGNode *merge_node)
{
	auto *true_level = find_level_for_block(levels, true_path);
	auto *false_level = find_level_for_block(levels, false_path);

	if (!true_level && !false_level)
	{
		// It's possible that we dominate both paths, and therefore there are no associated break levels.
		// Just walk the graph in both directions as normal.
		serialize_merge_levels_for_dominated_paths(true_path, levels, merge_node);
		serialize_merge_levels_for_dominated_paths(false_path, levels, merge_node);
	}
	else if (true_level == false_level)
	{
		// We can be a little smarter and rewrite a selection into a direct branch with adjusted cond value.
	}
	else
	{
		// Both paths are breaks, but they break to different scopes, so resolve those separately in two separate branches.
	}
}

void CFGStructurizer::serialize_merge_levels_for_dominated_paths_entry()
{
	Vector<SerializationLevel> levels;
	serialize_merge_levels_for_dominated_paths(entry_block, levels, nullptr);
}

bool CFGStructurizer::run_experimental()
{
	run_common_preamble();

	// We will not rely on re-inserting PHI here, so convert everything back to plain old variables.
	convert_phi_to_variables();

	// Switch blocks complicate too many things.
	// NIR does this too, which this implementation is heavily based on.
	// Explode any non-trivial switch blocks into a series of conditional branches.
	rewrite_switch_blocks();

	serialize_merge_levels_for_dominated_paths_entry();

	return true;
}
}