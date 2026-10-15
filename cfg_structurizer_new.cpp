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

const CFGStructurizer::SerializationLevel *CFGStructurizer::find_level_for_block(
		const Vector<SerializationLevel> &levels, CFGNode *block)
{
	for (auto &level : levels)
		if (has_element(level.paths, block))
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
	Vector<CFGNode *> frontier_nodes;

	fixup_degenerate_conditional_branch(node);

	// Only consider blocks that the header dominates.
	// If we're exiting a dominance relationship, those branches will be handled specially.
	for (auto *child : node->idom_children)
	{
		for (auto *front: child->dominance_frontier)
		{
			// Only consider new frontiers if we're the first scope to identify it.
			// A block must only belong to one scope.
			if (!has_element(frontier_nodes, front) && node->dominates(front) &&
			    !find_level_for_block(outer_levels, front))
			{
				frontier_nodes.push_back(front);
			}
		}
	}

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

	if (!levels.empty())
	{
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
				auto *pred_level = find_level_for_block(levels, pred);
				auto itr = &level + 1;
				auto *end_itr = pred_level ? pred_level : levels.data() + levels.size();

				// Mark everything in the region skippable.
				for (; itr != end_itr; ++itr)
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

	if (node->ir.terminator.type == Terminator::Type::Condition)
	{
		auto break_levels = outer_levels;
		break_levels.insert(break_levels.end(), levels.begin(), levels.end());

		CFGNode *merge_node = pool.create_node();
		auto *current_output_node = merge_node;

		// Reconvene execution at the merge node.
		node->ir.merge_info.merge_type = MergeType::Selection;
		node->ir.merge_info.merge_block = merge_node;
		merge_node->name = node->name + ".merge";

		// Now we can either enter a path we dominate (and therefore we recursively keep structurizing),
		// or we set path variables and stop.
		// Execution must reconvene at the top level.
		enter_succ(node,
		           node->ir.terminator.true_block,
		           node->ir.terminator.false_block,
		           node->ir.terminator.conditional_id,
		           break_levels, merge_node);

		// All execution should have been collected at merge_node.
		// Dispatch execution to those now.
		while (!levels.empty())
		{
			auto level = std::move(levels.back());
			levels.pop_back();
			break_levels.pop_back();

			// Link up level stages.
			current_output_node->add_branch(level.input_node);
			current_output_node->ir.terminator.type = Terminator::Type::Branch;
			current_output_node->ir.terminator.direct_block = level.input_node;

			current_output_node = level.output_node;
			for (auto *path : level.paths)
				serialize_merge_levels_for_dominated_paths(path, break_levels, level.output_node);
		}

		if (outer_merge)
		{
			// Branch from last level to outer_merge.
			// If we dominate everything in the path to exit, there is nothing to exit to.
			current_output_node->add_branch(outer_merge);
			current_output_node->ir.terminator.type = Terminator::Type::Branch;
			current_output_node->ir.terminator.direct_block = outer_merge;
		}
		else
		{
			// Nowhere to branch, this must be a return.
			current_output_node->ir.terminator.type = Terminator::Type::Return;
		}
	}
	else if (node->ir.terminator.type == Terminator::Type::Branch)
	{
		enter_succ(node, node->ir.terminator.direct_block, outer_levels, outer_merge);
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

void CFGStructurizer::enter_succ(CFGNode *node, CFGNode *true_path, CFGNode *false_path,
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

		node->collapse_conditional_to_direct(merge_node);
	}
	else
	{
		// Divergence. Handle each branch separately.

		if (true_level)
		{
			auto *dummy_true = pool.create_node();
			dummy_true->name = node->name + ".dummy-true";
			dummy_true->add_branch(true_path);
			dummy_true->ir.terminator.type = Terminator::Type::Branch;
			dummy_true->ir.terminator.direct_block = true_path;

			node->retarget_branch_pre_traversal(true_path, dummy_true);
			resolve_direct_path(dummy_true, true_path, *true_level);
			dummy_true->retarget_branch_pre_traversal(true_path, merge_node);
		}
		else
		{
			serialize_merge_levels_for_dominated_paths(true_path, levels, merge_node);
		}

		if (false_level)
		{
			auto *dummy_false = pool.create_node();
			dummy_false->name = node->name + ".dummy-false";
			dummy_false->add_branch(false_path);
			dummy_false->ir.terminator.type = Terminator::Type::Branch;
			dummy_false->ir.terminator.direct_block = false_path;

			node->retarget_branch_pre_traversal(false_path, dummy_false);
			resolve_direct_path(dummy_false, false_path, *false_level);
			dummy_false->retarget_branch_pre_traversal(false_path, merge_node);
		}
		else
		{
			serialize_merge_levels_for_dominated_paths(false_path, levels, merge_node);
		}
	}
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

	// We will not rely on re-inserting PHI here, so convert everything back to plain old variables.
	convert_phi_to_variables();

	// Switch blocks complicate too many things.
	// NIR does this too, which this implementation is heavily based on.
	// Explode any non-trivial switch blocks into a series of conditional branches.
	rewrite_switch_blocks();

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