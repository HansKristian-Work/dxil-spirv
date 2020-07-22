/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

#include "cfg_structurizer.hpp"
#include "SpvBuilder.h"
#include "logging.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"
#include <algorithm>
#include <assert.h>
#include <unordered_set>

namespace dxil_spv
{
CFGStructurizer::CFGStructurizer(CFGNode *entry, CFGNodePool &pool_, SPIRVModule &module_)
    : entry_block(entry)
    , pool(pool_)
    , module(module_)
{
	exit_block = pool.create_node();
	exit_block->name = "EXIT";
}

void CFGStructurizer::log_cfg_graphviz(const char *path) const
{
	FILE *file = fopen(path, "w");
	if (!file)
	{
		LOGE("Failed to open graphviz dump path: %s\n", path);
		return;
	}

	std::unordered_map<const CFGNode *, uint32_t> node_to_id;
	uint32_t accum_id = 0;

	const auto get_node_id = [&](const CFGNode *node) -> uint32_t {
		auto itr = node_to_id.find(node);
		if (itr == node_to_id.end())
		{
			const char *shape = nullptr;
			if (node->merge == MergeType::Loop)
				shape = "circle";
			else if (node->merge == MergeType::Selection)
				shape = "triangle";
			else
				shape = "box";

			node_to_id[node] = ++accum_id;
			fprintf(file, "%u [label=\"%s\", shape=\"%s\"];\n", accum_id, node->name.c_str(), shape);
			return accum_id;
		}
		else
			return itr->second;
	};

	fprintf(file, "digraph {\n");
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];
		switch (node->ir.terminator.type)
		{
		case Terminator::Type::Branch:
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.direct_block));
			break;

		case Terminator::Type::Condition:
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.true_block));
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.false_block));
			break;

		case Terminator::Type::Switch:
			for (auto &c : node->ir.terminator.cases)
				fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(c.node));
			fprintf(file, "%u -> %u;\n", get_node_id(node), get_node_id(node->ir.terminator.default_node));
			break;

		default:
			break;
		}

		if (node->merge == MergeType::Loop)
		{
			if (node->pred_back_edge)
				fprintf(file, "%u -> %u [style=\"dotted\"];\n", get_node_id(node), get_node_id(node->pred_back_edge));
			if (node->loop_merge_block)
				fprintf(file, "%u -> %u [style=\"dashed\"];\n", get_node_id(node), get_node_id(node->loop_merge_block));
		}
		else if (node->merge == MergeType::Selection)
		{
			if (node->selection_merge_block)
				fprintf(file, "%u -> %u [style=\"dashed\"];\n", get_node_id(node), get_node_id(node->selection_merge_block));
		}
	}

	fprintf(file, "}\n");
	fclose(file);
}

void CFGStructurizer::log_cfg(const char *tag) const
{
	LOGI("\n======== %s =========\n", tag);
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];

		LOGI("%s:\n", node->name.c_str());
		switch (node->ir.terminator.type)
		{
		case Terminator::Type::Branch:
			LOGI("  Branch -> %s\n", node->ir.terminator.direct_block->name.c_str());
			break;

		case Terminator::Type::Condition:
			LOGI("  Cond -> %s | %s\n", node->ir.terminator.true_block->name.c_str(),
			     node->ir.terminator.false_block->name.c_str());
			break;

		case Terminator::Type::Return:
			LOGI("  Return\n");
			break;

		case Terminator::Type::Unreachable:
			LOGI("  Unreachable\n");
			break;

		case Terminator::Type::Switch:
			LOGI("  Switch\n");
			for (auto &c : node->ir.terminator.cases)
				LOGI("    Case %u -> %s\n", c.value, c.node->name.c_str());
			LOGI("    Default -> %s\n", node->ir.terminator.default_node->name.c_str());
			break;

		case Terminator::Type::Kill:
			LOGI("  Kill\n");
			break;
		}

		switch (node->merge)
		{
		case MergeType::Selection:
			LOGI("  SelectionMerge -> %s\n",
			     node->selection_merge_block ? node->selection_merge_block->name.c_str() : "N/A");
			break;

		case MergeType::Loop:
			LOGI("  LoopMerge -> %s\n", node->loop_merge_block ? node->loop_merge_block->name.c_str() : "N/A");
			LOGI("    Continue -> %s\n", node->pred_back_edge ? node->pred_back_edge->name.c_str() : "N/A");
			break;

		default:
			break;
		}

		LOGI("\n");
	}
	LOGI("\n=====================\n");
}

bool CFGStructurizer::run()
{
	std::string graphviz_path;
	if (const char *env = getenv("DXIL_SPIRV_GRAPHVIZ_PATH"))
		graphviz_path = env;

	recompute_cfg();
	//log_cfg("Input state");
	if (!graphviz_path.empty())
	{
		auto graphviz_input = graphviz_path + ".input";
		log_cfg_graphviz(graphviz_input.c_str());
	}

	create_continue_block_ladders();

	split_merge_scopes();
	recompute_cfg();

	//log_cfg("Split merge scopes");
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".split";
		log_cfg_graphviz(graphviz_split.c_str());
	}

	//LOGI("=== Structurize pass ===\n");
	structurize(0);

	recompute_cfg();

	//log_cfg("Structurize pass 0");
	if (!graphviz_path.empty())
	{
		auto graphviz_struct = graphviz_path + ".struct";
		log_cfg_graphviz(graphviz_struct.c_str());
	}

	//LOGI("=== Structurize pass ===\n");
	structurize(1);

	//validate_structured();
	//log_cfg("Final");
	if (!graphviz_path.empty())
	{
		auto graphviz_final = graphviz_path + ".final";
		log_cfg_graphviz(graphviz_final.c_str());
	}

	insert_phi();

	return true;
}

CFGNode *CFGStructurizer::get_entry_block() const
{
	return entry_block;
}

void CFGStructurizer::create_continue_block_ladders()
{
	// It does not seem to be legal to merge directly to continue blocks.
	// To make it possible to merge execution, we need to create a ladder block which we can merge to.
	bool need_recompute_cfg = false;
	for (auto *node : forward_post_visit_order)
	{
		if (node->succ_back_edge && node->succ_back_edge != node)
		{
			//LOGI("Creating helper pred block for continue block: %s\n", node->name.c_str());
			create_helper_pred_block(node);
			need_recompute_cfg = true;
		}
	}

	if (need_recompute_cfg)
		recompute_cfg();
}

void CFGStructurizer::prune_dead_preds()
{
	// We do not want to see unreachable preds.
	// Having a pred means we need to map it to an incoming value when dealing with PHI.
	for (auto *node : forward_post_visit_order)
	{
		auto itr = std::remove_if(node->pred.begin(), node->pred.end(),
		                          [&](const CFGNode *node) { return reachable_nodes.count(node) == 0; });
		if (itr != node->pred.end())
			node->pred.erase(itr, node->pred.end());
	}
}

void CFGStructurizer::insert_phi()
{
	compute_dominance_frontier();
	prune_dead_preds();

	// Build a map of value ID -> creating block.
	// This allows us to detect if a value is consumed in a situation where the declaration does not dominate use.
	// This can happen when introducing ladder blocks or similar.
	for (auto *node : forward_post_visit_order)
	{
		unsigned phi_index = 0;
		for (auto &phi : node->ir.phi)
		{
			phi_nodes.push_back({ node, phi_index });
			if (phi.id)
				value_id_to_block[phi.id] = node;
			phi_index++;
		}

		for (auto *op : node->ir.operations)
			if (op->id)
				value_id_to_block[op->id] = node;
	}

	// Resolve phi-nodes top-down since PHI nodes may depend on other PHI nodes.
	std::sort(phi_nodes.begin(), phi_nodes.end(),
	          [](const PHINode &a, const PHINode &b) { return a.block->forward_post_visit_order > b.block->forward_post_visit_order; });

	for (auto &phi_node : phi_nodes)
	{
		fixup_phi(phi_node);
		insert_phi(phi_node);
	}
}

std::vector<IncomingValue>::const_iterator CFGStructurizer::find_incoming_value(
    const CFGNode *frontier_pred, const std::vector<IncomingValue> &incoming)
{
	// Find the incoming block which dominates frontier_pred and has the lowest post visit order.
	// There are cases where two or more blocks dominate, but we want the most immediate dominator.
	auto candidate = incoming.end();

	for (auto itr = incoming.begin(); itr != incoming.end(); ++itr)
	{
		auto *block = itr->block;
		if (block->dominates(frontier_pred))
		{
			if (candidate == incoming.end() || block->forward_post_visit_order < candidate->block->forward_post_visit_order)
				candidate = itr;
		}
	}

	return candidate;
}

void CFGStructurizer::fixup_phi(PHINode &node)
{
	// We want to move any incoming block to where the ID was created.
	// This avoids some problematic cases of crossing edges when using ladders.

	for (auto &incoming : node.block->ir.phi[node.phi_index].incoming)
	{
		auto itr = value_id_to_block.find(incoming.id);
		if (itr == end(value_id_to_block))
		{
			// This is a global.
			continue;
		}

		if (!itr->second->dominates(incoming.block))
		{
			//LOGI("For node %s, move incoming node %s to %s.\n", node.block->name.c_str(), incoming.block->name.c_str(),
			//     itr->second->name.c_str());
			incoming.block = itr->second;
		}
	}
}

void CFGStructurizer::insert_phi(PHINode &node)
{
	// We start off with N values defined in N blocks.
	// These N blocks *used* to branch to the PHI node, but due to our structurizer,
	// there might not be branch targets here anymore, primary example here is ladders.
	// In order to fix this we need to follow control flow from these values and insert phi nodes as necessary to link up
	// a set of values where dominance frontiers are shared.

	//LOGI("\n=== INSERT PHI FOR %s ===\n", node.block->name.c_str());

	// First, figure out which subset of the CFG we need to work on.
	std::unordered_set<const CFGNode *> cfg_subset;
	cfg_subset.insert(node.block);
	const auto walk_op = [&](const CFGNode *n) -> bool {
		// Don't walk past the node we're trying to merge PHI into.
		if (node.block == n)
			return false;

		if (node.block->dominates(n))
		{
			// If there is a path to the node's back edge, we need to link up the Phi nodes there.
			bool can_reach_continue_block = node.block->pred_back_edge &&
			                                n != node.block->pred_back_edge &&
			                                node.block->pred_back_edge->can_backtrace_to(n);
			if (!can_reach_continue_block)
				return false;
		}

		if (cfg_subset.count(n))
		{
			return false;
		}
		else
		{
			cfg_subset.insert(n);
			return true;
		}
	};

	auto &phi = node.block->ir.phi[node.phi_index];
	auto &incoming_values = phi.incoming;
	for (auto &incoming : incoming_values)
		incoming.block->walk_cfg_from(walk_op);

#if 0
	LOGI("\n=== CFG subset ===\n");
	for (auto *subset_node : cfg_subset)
		LOGI("  %s\n", subset_node->name.c_str());
	LOGI("=================\n");
#endif

	for (;;)
	{
		//LOGI("\n=== PHI iteration ===\n");

		//for (auto &incoming : incoming_values)
		//	LOGI("  Incoming value from %s\n", incoming.block->name.c_str());

		// Inside the CFG subset, find a dominance frontiers where we merge PHIs this iteration.
		CFGNode *frontier = node.block;

		// If all incoming values have at least one pred block they dominate, we can merge the final PHI.
		for (auto &incoming : incoming_values)
		{
			auto itr = std::find_if(node.block->pred.begin(), node.block->pred.end(),
			                        [&](const CFGNode *n) { return incoming.block->dominates(n); });

			if (itr == node.block->pred.end() &&
			    (!node.block->pred_back_edge || !incoming.block->dominates(node.block->pred_back_edge)))
			{
				frontier = nullptr;
				break;
			}
		}

		if (!frontier)
		{
			// We need some intermediate merge, so find a frontier node to work on.
			for (auto &incoming : incoming_values)
			{
				for (auto *candidate_frontier : incoming.block->dominance_frontier)
				{
					if (cfg_subset.count(candidate_frontier))
					{
						if (frontier == nullptr || candidate_frontier->forward_post_visit_order > frontier->forward_post_visit_order)
						{
							// Pick the earliest frontier in the CFG.
							// We want to merge top to bottom.
							frontier = candidate_frontier;
						}
					}
				}
			}
		}

		assert(frontier);

		if (frontier == node.block)
		{
			if (frontier->pred.size() == 1 && !frontier->pred_back_edge)
			{
				// The PHI node has already been merged.
				// This can happen if a ladder pred block merged all inputs, and we would
				// end up with a single-pred PHI, which makes no sense (even if it should work).
				// Just copy the ID for the frontier node which made the final merge.
				auto itr = find_incoming_value(frontier->pred.front(), incoming_values);
				assert(itr != incoming_values.end());

				auto *op = module.allocate_op(spv::OpCopyObject, phi.id, phi.type_id);
				op->add_id(itr->id);
				frontier->pred.front()->ir.operations.push_back(op);

				// Ignore this one when emitting PHIs later.
				phi.id = 0;
			}
			else
			{
				std::vector<IncomingValue> final_incoming;

				// Final merge.
				for (auto *input : frontier->pred)
				{
					auto itr = find_incoming_value(input, incoming_values);
					assert(itr != incoming_values.end());

					IncomingValue value = {};
					value.id = itr->id;
					value.block = input;
					final_incoming.push_back(value);
				}

				if (frontier->pred_back_edge)
				{
					auto itr = find_incoming_value(frontier->pred_back_edge, incoming_values);
					assert(itr != incoming_values.end());

					IncomingValue value = {};
					value.id = itr->id;
					value.block = frontier->pred_back_edge;
					final_incoming.push_back(value);
				}

				incoming_values = std::move(final_incoming);
			}
			return;
		}

		// A candidate dominance frontier is a place where we might want to place a PHI node in order to merge values.
		// For a successful iteration, we need to find at least one candidate where we can merge PHI.

		//LOGI("Testing dominance frontier %s ...\n", frontier->name.c_str());

		// Remove old inputs.
		PHI frontier_phi;
		frontier_phi.id = module.allocate_id();
		frontier_phi.type_id = phi.type_id;
		module.get_builder().addName(frontier_phi.id, (std::string("frontier_phi_") + frontier->name).c_str());

		assert(!frontier->pred_back_edge);
		for (auto *input : frontier->pred)
		{
			auto itr = find_incoming_value(input, incoming_values);
			if (itr != incoming_values.end())
			{
				auto *incoming_block = itr->block;

				//LOGI(" ... For pred %s (%p), found incoming value from %s (%p)\n", input->name.c_str(),
				//     static_cast<const void *>(input), incoming_block->name.c_str(),
				//     static_cast<const void *>(incoming_block));

				IncomingValue value = {};
				value.id = itr->id;
				value.block = input;
				frontier_phi.incoming.push_back(value);

				// Do we remove the incoming value now or not?
				// If all paths from incoming value must go through frontier, we can remove it,
				// otherwise, we might still need to use the incoming value somewhere else.
				bool exists_path = incoming_block->exists_path_in_cfg_without_intermediate_node(node.block, frontier);
				if (exists_path)
				{
					//LOGI("   ... keeping input in %s\n", incoming_block->name.c_str());
				}
				else
				{
					//LOGI("   ... removing input in %s\n", incoming_block->name.c_str());
					incoming_values.erase(itr);
				}
			}
			else
			{
				// If there is no incoming value, we need to hallucinate an undefined value.
				IncomingValue value = {};
				value.id = module.get_builder().createUndefined(phi.type_id);
				value.block = input;
				frontier_phi.incoming.push_back(value);
			}
		}

		// We've handled this node now, remove it from consideration w.r.t. frontiers.
		cfg_subset.erase(frontier);

		IncomingValue *dominated_incoming = nullptr;
		for (auto &incoming : incoming_values)
		{
			if (frontier->dominates(incoming.block) &&
			    !frontier->exists_path_in_cfg_without_intermediate_node(node.block, incoming.block))
			{
				// There should be only one block the frontier can dominate.
				// The candidate block must also post-dominate the frontier on the CFG subset which terminates at node.block,
				// otherwise we will get a proper merge later anyways.
				assert(!dominated_incoming);
				dominated_incoming = &incoming;
			}
		}

		if (dominated_incoming)
		{
			// If our frontier dominates another incoming block, we need to merge two incoming values
			// using an auxillary phi node as well as an OpSelect to resolve two conflicting values into one.

			// For every pred edge of the frontier where pred did not dominate, we are now suddenly dominating.
			// If we came from such a block,
			// we should replace the incoming value of dominating_incoming rather than adding a new incoming value.
			PHI merge_phi = {};

			// Here we need to figure out if we have a cross branch which functions as a ladder.
			// If we have such a special edge, the PHI value we find here will override any other value on this path.
			// However, if we only have expected branches, there is nothing to override, and any PHI values
			// we created along this path turned out to be irrelevant after all.

			unsigned normal_branch_count = 0;
			for (auto *input : frontier->pred)
			{
				IncomingValue value = {};
				auto itr = find_incoming_value(input, incoming_values);
				if (itr != incoming_values.end())
				{

					// If the input does not dominate the frontier, this might be a case of cross-edge PHI merge.
					// However, if we still have an incoming value which dominates the input block, ignore.
					// This is considered a normal path and we will merge the actual result in a later iteration, because
					// the frontier is not a post-dominator of the input value.
					bool input_is_normal_edge = true;
					if (!input->dominates(frontier))
					{
						input_is_normal_edge = false;
						for (auto &incoming : incoming_values)
						{
							if (incoming.block->dominates(input))
							{
								input_is_normal_edge = true;
								break;
							}
						}
					}

					if (input_is_normal_edge)
						normal_branch_count++;

					value.id = module.get_builder().makeBoolConstant(input_is_normal_edge);
				}
				else
				{
					// The input is undefined, so we don't really care. Just treat this as a normal edge.
					normal_branch_count++;
					value.id = module.get_builder().makeBoolConstant(true);
				}

				value.block = input;
				merge_phi.incoming.push_back(value);
			}

			if (normal_branch_count != frontier->pred.size())
			{
				merge_phi.id = module.allocate_id();
				merge_phi.type_id = module.get_builder().makeBoolType();

				Operation *op = module.allocate_op(spv::OpSelect, module.allocate_id(), phi.type_id);
				op->add_ids({ merge_phi.id, dominated_incoming->id, frontier_phi.id });
				dominated_incoming->block->ir.operations.push_back(op);
				dominated_incoming->id = op->id;

				module.get_builder().addName(merge_phi.id,
				                             (std::string("merged_phi_") + dominated_incoming->block->name).c_str());
				frontier->ir.phi.push_back(std::move(merge_phi));
			}
		}
		else
		{
			// Replace with merged value.
			IncomingValue new_incoming = {};
			new_incoming.id = frontier_phi.id;
			new_incoming.block = frontier;
			incoming_values.push_back(new_incoming);
		}

		//LOGI("=========================\n");
		frontier->ir.phi.push_back(std::move(frontier_phi));
	}
}

void CFGStructurizer::compute_dominance_frontier()
{
	for (auto *node : forward_post_visit_order)
		recompute_dominance_frontier(node);
}

void CFGStructurizer::build_immediate_dominators()
{
	for (auto i = forward_post_visit_order.size(); i; i--)
	{
		auto *block = forward_post_visit_order[i - 1];
		block->recompute_immediate_dominator();
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
		node.traversing = false;
		node.immediate_dominator = nullptr;
		node.immediate_post_dominator = nullptr;

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

void CFGStructurizer::backwards_visit()
{
	std::vector<CFGNode *> leaf_nodes;

	// Traverse from leaf nodes, back through their preds instead.
	// Clear out some state set by forward visit earlier.
	for (auto *node : forward_post_visit_order)
	{
		node->visited = false;
		node->traversing = false;
		if (node->succ.empty())
			leaf_nodes.push_back(node);
	}

	for (auto *leaf : leaf_nodes)
		backwards_visit(*leaf);

	exit_block->backward_post_visit_order = backward_post_visit_order.size();
	exit_block->immediate_post_dominator = exit_block;
	for (auto *leaf : leaf_nodes)
		leaf->immediate_post_dominator = exit_block;
}

void CFGStructurizer::backwards_visit(CFGNode &entry)
{
	entry.visited = true;

	for (auto *pred : entry.pred)
		if (!pred->visited)
			backwards_visit(*pred);

	entry.backward_post_visit_order = backward_post_visit_order.size();
	backward_post_visit_order.push_back(&entry);
}

void CFGStructurizer::visit(CFGNode &entry)
{
	entry.visited = true;
	entry.traversing = true;
	reachable_nodes.insert(&entry);

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
	entry.forward_post_visit_order = forward_post_visit_order.size();
	forward_post_visit_order.push_back(&entry);
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

void CFGStructurizer::merge_to_succ(CFGNode *node, unsigned index)
{
	node->succ[index]->headers.push_back(node);
	node->selection_merge_block = node->succ[index];
	node->merge = MergeType::Selection;
	//LOGI("Fixup selection merge %s -> %s\n", node->name.c_str(), node->selection_merge_block->name.c_str());
}

void CFGStructurizer::isolate_structured(std::unordered_set<CFGNode *> &nodes, const CFGNode *header,
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

std::vector<CFGNode *> CFGStructurizer::isolate_structured_sorted(const CFGNode *header, const CFGNode *merge)
{
	std::unordered_set<CFGNode *> nodes;
	isolate_structured(nodes, header, merge);

	std::vector<CFGNode *> sorted;
	sorted.reserve(nodes.size());

	for (auto *node : nodes)
		sorted.push_back(node);

	std::sort(sorted.begin(), sorted.end(),
	          [](const CFGNode *a, const CFGNode *b) { return a->forward_post_visit_order > b->forward_post_visit_order; });
	return sorted;
}

bool CFGStructurizer::control_flow_is_escaping(const CFGNode *header, const CFGNode *node, const CFGNode *merge)
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
			if (control_flow_is_escaping(header, succ, merge))
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
	for (auto *node : forward_post_visit_order)
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
			// A is obvious candidate. B is a direct break/continue construct target most likely.
			merge_to_succ(node, 0);
		}
		else if (dominates_b && !dominates_a && !merge_b_has_header)
		{
			// B is obvious candidate. A is a direct break/continue construct target most likely.
			merge_to_succ(node, 1);
		}
		else if (dominates_a && dominates_b && !merge_a_has_header && merge_b_has_header)
		{
			// Not as obvious of a candidate, but this can happen if one path hits continue block,
			// and other path hits a ladder merge block.
			// For do/while(false) style loop, the loop body may dominate the merge block.
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
				bool merges_to_continue = merge && merge->succ_back_edge;
				if (dominates_merge && !merge->headers.empty())
				{
					// Here we have a likely case where one block is doing a clean "break" out of a loop, and
					// the other path continues as normal, and then conditionally breaks in a continue block or something similar.
					bool a_path_is_break = control_flow_is_escaping(node, node->succ[0], merge);
					bool b_path_is_break = control_flow_is_escaping(node, node->succ[1], merge);

					if (a_path_is_break && b_path_is_break)
					{
						// If either path branches to the other,
						// we should be able to merge to the node which has not committed to the break path yet.
						if (node->succ[1]->can_backtrace_to(node->succ[0]))
							merge_to_succ(node, 0);
						else if (node->succ[0]->can_backtrace_to(node->succ[1]))
							merge_to_succ(node, 1);
						else
						{
							node->merge = MergeType::Selection;
							node->selection_merge_block = nullptr;
							//LOGI("Merging %s -> Unreachable\n", node->name.c_str());
						}
					}
					else if (b_path_is_break)
						merge_to_succ(node, 0);
					else
						merge_to_succ(node, 1);
				}
				else if (!merges_to_continue && (merge->headers.empty() || pass == 0))
				{
					// Happens first iteration. We'll have to split blocks, so register a merge target where we want it.
					// Otherwise, this is the easy case if we observe it in pass 1.
					// This shouldn't really happen though, as we'd normally resolve this earlier in find_selection_merges.
					assert(merge);
					node->selection_merge_block = merge;
					node->merge = MergeType::Selection;
					merge->headers.push_back(node);
					//LOGI("Merging %s -> %s\n", node->name.c_str(), node->selection_merge_block->name.c_str());
				}
				else
				{
					// We don't dominate the merge block in pass 1. We cannot split blocks now.
					// Check to see which paths can actually reach the merge target without going through a ladder block.
					// If we don't go through ladder it means an outer scope will actually reach the merge node.
					// If we reach a ladder it means a block we dominate will make the escape.

					// Another case is when one path is "breaking" out to a continue block which we don't dominate.
					// We should not attempt to do ladder breaking here in pass 0 since it's unnecessary.

					bool a_path_is_break = control_flow_is_escaping(node, node->succ[0], merge);
					bool b_path_is_break = control_flow_is_escaping(node, node->succ[1], merge);
					if (a_path_is_break && b_path_is_break)
					{
						// Both paths break, so we never merge. Merge against Unreachable node if necessary ...
						node->merge = MergeType::Selection;
						auto *dummy_merge = pool.create_node();
						dummy_merge->ir.terminator.type = Terminator::Type::Unreachable;
						node->selection_merge_block = dummy_merge;
						dummy_merge->name = node->name + ".unreachable";
						//LOGI("Merging %s -> Unreachable\n", node->name.c_str());
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
					auto *dummy_merge = pool.create_node();
					dummy_merge->ir.terminator.type = Terminator::Type::Unreachable;
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
				// Don't try to merge to our switch block.
				auto *inner_header = node->get_outer_header_dominator();
				bool conditional_switch_break = inner_header && inner_header->merge == MergeType::Selection &&
				                                inner_header->selection_merge_block == merge;

				if (!conditional_switch_break)
				{
					node->selection_merge_block = merge;
					node->merge = MergeType::Selection;
					merge->headers.push_back(node);
					//LOGI("Merging %s -> %s\n", node->name.c_str(), node->selection_merge_block->name.c_str());
				}
			}
			else
			{
				//LOGI("Cannot find a merge target for block %s ...\n", node->name.c_str());
			}
		}
	}
}

void CFGStructurizer::rewrite_selection_breaks(CFGNode *header, CFGNode *ladder_to)
{
	// Don't rewrite loops.
	if (header->pred_back_edge)
		return;

	// Don't rewrite switch blocks either.
	if (header->ir.terminator.type == Terminator::Type::Switch)
		return;

	//LOGI("Rewriting selection breaks %s -> %s\n", header->name.c_str(), ladder_to->name.c_str());

	std::unordered_set<CFGNode *> nodes;
	std::unordered_set<CFGNode *> construct;

	header->traverse_dominated_blocks([&](CFGNode *node) -> bool {
		// Inner loop headers are not candidates for a rewrite. They are split in split_merge_blocks.
		// Similar with switch blocks.
		// Also, we need to stop traversing when we hit the target block ladder_to.
		if (node != ladder_to && nodes.count(node) == 0 && !node->pred_back_edge &&
		    node->ir.terminator.type != Terminator::Type::Switch)
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
		auto *ladder = pool.create_node();
		ladder->name = ladder_to->name + "." + inner_block->name + ".ladder";
		//LOGI("Walking dominated blocks of %s, rewrite branches %s -> %s.\n", inner_block->name.c_str(),
		//     ladder_to->name.c_str(), ladder->name.c_str());

		ladder->add_branch(ladder_to);
		ladder->ir.terminator.type = Terminator::Type::Branch;
		ladder->ir.terminator.direct_block = ladder_to;

		// Stop rewriting once we hit a merge block.
		inner_block->traverse_dominated_blocks_and_rewrite_branch(
		    ladder_to, ladder, [inner_block](CFGNode *node) { return inner_block->selection_merge_block != node; });
		rewrite_selection_breaks(inner_block, ladder);
	}
}

void CFGStructurizer::split_merge_scopes()
{
	for (auto *node : forward_post_visit_order)
	{
		// Setup a preliminary merge scope so we know when to stop traversal.
		// We don't care about traversing inner scopes, out starting from merge block as well.
		if (node->num_forward_preds() <= 1)
			continue;

		// The idom is the natural header block.
		auto *idom = node->immediate_dominator;
		assert(idom->succ.size() >= 2);

		if (idom->merge == MergeType::None)
		{
			idom->merge = MergeType::Selection;
			idom->selection_merge_block = node;
		}
		node->headers.push_back(idom);
	}

	for (auto *node : forward_post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;

		// Continue blocks can always be branched to, from any scope, so don't rewrite anything here.
		if (node->succ_back_edge)
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
	build_immediate_dominators();
	prune_dead_preds();

	backwards_visit();
	build_immediate_post_dominators();
}

void CFGStructurizer::find_switch_blocks()
{
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];
		if (node->ir.terminator.type != Terminator::Type::Switch)
			continue;

		auto *merge = find_common_post_dominator(node->succ);
		if (node->dominates(merge))
		{
			//LOGI("Switch merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(merge), merge->name.c_str());
			node->merge = MergeType::Selection;
			node->selection_merge_block = merge;
			merge->add_unique_header(node);
		}
		else
		{
			// We got a switch block where someone is escaping. Similar idea as for loop analysis.
			// Find a post-dominator where we ignore branches which are "escaping".
			auto *dominated_merge_target = find_common_post_dominator_with_ignored_break(node->succ, merge);
			if (node->dominates(dominated_merge_target))
			{
				node->merge = MergeType::Selection;
				node->selection_merge_block = merge;
				dominated_merge_target->add_unique_header(node);
				merge->add_unique_header(node);
			}
		}
	}
}

void CFGStructurizer::find_selection_merges(unsigned pass)
{
	for (auto *node : forward_post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;

		// If there are 2 or more pred edges, try to merge execution.

		// The idom is the natural header block.
		auto *idom = node->immediate_dominator;
		assert(idom->succ.size() >= 2);

		// Check for case fallthrough here. In this case, we do not have a merge scenario, just ignore.
		auto *inner_header = node->get_outer_selection_dominator();
		if (inner_header && inner_header->ir.terminator.type == Terminator::Type::Switch)
		{
			if (inner_header->selection_merge_block == node)
			{
				// We just found a switch block which we have already handled.
				continue;
			}

			if (std::find(inner_header->succ.begin(), inner_header->succ.end(), node) != inner_header->succ.end())
			{
				// Fallthrough.
				continue;
			}
		}

		// Try to detect if this is a breaking construct.
		// We should not merge any execution when inside a breaking construct.
		auto *loop_header = entry_block->get_innermost_loop_header_for(node);
		bool is_breaking_construct = false;

		if (loop_header && loop_header != entry_block &&
		    control_flow_is_escaping(loop_header, node, loop_header->loop_merge_block))
		{
			is_breaking_construct = true;
		}

		for (auto *header : node->headers)
		{
			// If we have a loop header already associated with this block, treat that as our idom.
			if (header->forward_post_visit_order > idom->forward_post_visit_order)
				idom = header;
		}

		if (idom->merge == MergeType::None || idom->merge == MergeType::Selection)
		{
			// We just found a switch block which we have already handled.
			if (idom->ir.terminator.type == Terminator::Type::Switch || is_breaking_construct)
				continue;

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
					LOGE("Mismatch headers in pass 1 ... ?\n");
			}

			idom->merge = MergeType::Selection;
			node->add_unique_header(idom);
			assert(node);
			idom->selection_merge_block = node;
			//LOGI("Selection merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(idom), idom->name.c_str(),
			//     static_cast<const void *>(node), node->name.c_str());
		}
		else if (idom->merge == MergeType::Loop)
		{
			if (idom->loop_merge_block == node && idom->loop_ladder_block)
			{
				// We need to create an outer shell for this header since we need to ladder break to this node.
				auto *loop = create_helper_pred_block(idom);
				loop->merge = MergeType::Loop;
				loop->loop_merge_block = node;
				loop->freeze_structured_analysis = true;
				node->add_unique_header(loop);
				//LOGI("Loop merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(loop), loop->name.c_str(),
				//     static_cast<const void *>(node), node->name.c_str());
			}
			else if (idom->loop_merge_block != node)
			{
				auto *selection_idom = create_helper_succ_block(idom);
				// If we split the loop header into the loop header -> selection merge header,
				// then we can merge into a continue block for example.
				if (!is_breaking_construct)
				{
					// Do not actually merge to this block if we're in a breaking construct, but we might need to
					// create a succ block so we can clean up the selection merge later.
					selection_idom->merge = MergeType::Selection;
					selection_idom->selection_merge_block = node;
					node->add_unique_header(selection_idom);
					//LOGI("Selection merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(selection_idom),
					//     selection_idom->name.c_str(), static_cast<const void *>(node), node->name.c_str());
				}
			}
		}
		else
		{
			// We are hosed. There is no obvious way to merge execution here.
			// This might be okay.
			LOGW("Cannot merge execution for node %p (%s).\n", static_cast<const void *>(node), node->name.c_str());
		}
	}
}

CFGStructurizer::LoopExitType CFGStructurizer::get_loop_exit_type(const CFGNode &header, const CFGNode &node) const
{
	// If there exists an inner loop which dominates this exit, we treat it as an inner loop exit.
	const CFGNode *innermost_loop_header = header.get_innermost_loop_header_for(&node);
	bool is_innermost_loop_header = &header == innermost_loop_header;

	if (header.dominates(&node) && node.dominates_all_reachable_exits())
	{
		if (is_innermost_loop_header)
			return LoopExitType::Exit;
		else
			return LoopExitType::InnerLoopExit;
	}

	if (header.dominates(&node))
	{
		if (is_innermost_loop_header)
		{
			// Even if we dominate node, we might not be able to merge to it.
			if (!header.can_loop_merge_to(&node))
				return LoopExitType::Escape;

			return LoopExitType::Merge;
		}
		else
		{
			// Try to detect if this is a degenerate inner loop merge.
			// If the inner loop header is the only way to exit the loop construct,
			// the loop exit block is a false exit.
			// This is the case if the candidate must pass through the back edge, and the back edge can only branch to header.
			// In this case, the loop will not be visible through back-propagation, but it is definitely part of the loop construct.

			if (!innermost_loop_header->pred_back_edge || innermost_loop_header->pred_back_edge->ir.terminator.type != Terminator::Type::Branch)
				return LoopExitType::InnerLoopMerge;

			auto *post = find_common_post_dominator({ const_cast<CFGNode *>(&node), innermost_loop_header->pred_back_edge });
			if (post == innermost_loop_header->pred_back_edge)
				return LoopExitType::InnerLoopFalsePositive;
			else
				return LoopExitType::InnerLoopMerge;
		}
	}
	else
		return LoopExitType::Escape;
}

CFGNode *CFGStructurizer::create_helper_pred_block(CFGNode *node)
{
	auto *pred_node = pool.create_node();
	pred_node->name = node->name + ".pred";

	// Fixup visit order later.
	pred_node->forward_post_visit_order = node->forward_post_visit_order;
	pred_node->backward_post_visit_order = node->backward_post_visit_order;

	std::swap(pred_node->pred, node->pred);

	pred_node->immediate_dominator = node->immediate_dominator;
	pred_node->immediate_post_dominator = node;
	node->immediate_dominator = pred_node;

	retarget_pred_from(pred_node, node);

	pred_node->add_branch(node);

	if (node == entry_block)
		entry_block = pred_node;

	pred_node->ir.terminator.type = Terminator::Type::Branch;
	pred_node->ir.terminator.direct_block = node;

	return pred_node;
}

void CFGStructurizer::retarget_pred_from(CFGNode *new_node, CFGNode *old_succ)
{
	for (auto *p : new_node->pred)
	{
		for (auto &s : p->succ)
			if (s == old_succ)
				s = new_node;

		auto &p_term = p->ir.terminator;
		if (p_term.direct_block == old_succ)
			p_term.direct_block = new_node;
		if (p_term.true_block == old_succ)
			p_term.true_block = new_node;
		if (p_term.false_block == old_succ)
			p_term.false_block = new_node;
		if (p_term.default_node == old_succ)
			p_term.default_node = new_node;
		for (auto &c : p_term.cases)
			if (c.node == old_succ)
				c.node = new_node;
	}

	// Do not swap back edges.

	// Retarget immediate post dominators.
	for (auto *n : forward_post_visit_order)
		if (n->immediate_post_dominator == old_succ)
			n->immediate_post_dominator = new_node;
}

void CFGStructurizer::retarget_succ_from(CFGNode *new_node, CFGNode *old_pred)
{
	for (auto *s : new_node->succ)
		for (auto &p : s->pred)
			if (p == old_pred)
				p = new_node;

	for (auto *node : forward_post_visit_order)
		if (node->immediate_dominator == old_pred)
			node->immediate_dominator = new_node;
	new_node->immediate_dominator = old_pred;

	// Do not swap back edges.
}

CFGNode *CFGStructurizer::create_helper_succ_block(CFGNode *node)
{
	auto *succ_node = pool.create_node();
	succ_node->name = node->name + ".succ";

	// Fixup visit order later.
	succ_node->forward_post_visit_order = node->forward_post_visit_order;
	succ_node->backward_post_visit_order = node->backward_post_visit_order;

	std::swap(succ_node->succ, node->succ);
	// Do not swap back edges, only forward edges.

	succ_node->immediate_post_dominator = node->immediate_post_dominator;
	node->immediate_post_dominator = succ_node;

	succ_node->ir.terminator = node->ir.terminator;
	node->ir.terminator.type = Terminator::Type::Branch;
	node->ir.terminator.direct_block = succ_node;

	retarget_succ_from(succ_node, node);

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
			return a->forward_post_visit_order > b->forward_post_visit_order;
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
	return find_common_post_dominator_with_ignored_break(std::move(candidates), nullptr);
}

CFGNode *CFGStructurizer::find_common_post_dominator_with_ignored_exits(const CFGNode *header)
{
	std::vector<CFGNode *> candidates;
	std::vector<CFGNode *> next_nodes;
	const auto add_unique_next_node = [&](CFGNode *node) {
		if (std::find(next_nodes.begin(), next_nodes.end(), node) == next_nodes.end())
			next_nodes.push_back(node);
	};

	// Ignore any exit paths.
	for (auto *succ : header->succ)
		if (!succ->dominates_all_reachable_exits())
			add_unique_next_node(succ);
	std::swap(next_nodes, candidates);

	while (candidates.size() != 1)
	{
		// Sort candidates by post visit order.
		std::sort(candidates.begin(), candidates.end(),
		          [](const CFGNode *a, const CFGNode *b) { return a->forward_post_visit_order > b->forward_post_visit_order; });

		for (auto *succ : candidates.front()->succ)
			add_unique_next_node(succ);
		for (auto itr = candidates.begin() + 1; itr != candidates.end(); ++itr)
			add_unique_next_node(*itr);

		candidates.clear();
		std::swap(candidates, next_nodes);
	}

	if (candidates.empty())
		return nullptr;
	else
		return candidates.front();
}

CFGNode *CFGStructurizer::find_common_post_dominator_with_ignored_break(std::vector<CFGNode *> candidates,
                                                                        const CFGNode *ignored_node)
{
	if (candidates.empty())
		return nullptr;

	std::vector<CFGNode *> next_nodes;
	const auto add_unique_next_node = [&](CFGNode *node) {
		if (node != ignored_node)
			if (std::find(next_nodes.begin(), next_nodes.end(), node) == next_nodes.end())
				next_nodes.push_back(node);
	};

	while (candidates.size() != 1)
	{
		// Sort candidates by post visit order.
		std::sort(candidates.begin(), candidates.end(),
		          [](const CFGNode *a, const CFGNode *b) { return a->forward_post_visit_order > b->forward_post_visit_order; });

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

	if (candidates.empty())
		return nullptr;

	return candidates.front();
}

void CFGStructurizer::find_loops()
{
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		// Visit in reverse order so we resolve outer loops first,
		// this lets us detect ladder-breaking loops.
		auto *node = forward_post_visit_order[index - 1];

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
		std::vector<CFGNode *> inner_direct_exits;
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
				inner_direct_exits.push_back(loop_exit);
				break;

			case LoopExitType::Merge:
				dominated_exit.push_back(loop_exit);
				break;

			case LoopExitType::InnerLoopMerge:
				inner_dominated_exit.push_back(loop_exit);
				break;

			case LoopExitType::InnerLoopFalsePositive:
				// In this case, the inner loop can only exit at the loop header,
				// and thus post-dominance analysis will always fail.
				// Ignore this case as it's a false exit.
				break;

			case LoopExitType::Escape:
				non_dominated_exit.push_back(loop_exit);
				break;
			}
		}

		// If the only merge candidates we have are inner dominated, treat them as true dominated exits.
		if (dominated_exit.empty() && !inner_dominated_exit.empty())
			std::swap(dominated_exit, inner_dominated_exit);
		if (direct_exits.empty())
			direct_exits = std::move(inner_direct_exits);

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

		if (dominated_exit.empty() && inner_dominated_exit.empty() && non_dominated_exit.empty())
		{
			// There can be zero loop exits, i.e. infinite loop. This means we have no merge block.
			// We will invent a merge block to satisfy SPIR-V validator, and declare it as unreachable.
			node->loop_merge_block = nullptr;
			//LOGI("Loop without merge: %p (%s)\n", static_cast<const void *>(node), node->name.c_str());
		}
		else if (dominated_exit.size() == 1 && non_dominated_exit.empty() && inner_dominated_exit.empty())
		{
			// Clean merge.
			// This is a unique merge block. There can be no other merge candidate.
			node->loop_merge_block = dominated_exit.front();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			//LOGI("Loop with simple merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());
		}
		else if (dominated_exit.empty() && inner_dominated_exit.empty() && non_dominated_exit.size() == 1)
		{
			// Single-escape merge.
			// It is unique, but we need workarounds later.
			node->loop_merge_block = non_dominated_exit.front();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			//LOGI("Loop with ladder merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());
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

			// Try to find the sensible target first.
			// If one of our merge blocks is the successor of the continue block,
			// this is a prime candidate for a ladder block.
			if (node->pred_back_edge && node->pred_back_edge->succ.size() == 1 &&
			    std::find(dominated_exit.begin(), dominated_exit.end(), node->pred_back_edge->succ.front()) != dominated_exit.end())
			{
				dominated_merge = node->pred_back_edge->succ.front();
			}
			else if (merge && !node->dominates(merge) && dominated_exit.size() > 1)
			{
				// Now, we might have Merge blocks which end up escaping out of the loop construct.
				// We might have to remove candidates which end up being break blocks after all.
				std::vector<CFGNode *> non_breaking_exits;
				non_breaking_exits.reserve(dominated_exit.size());
				for (auto *exit : dominated_exit)
					if (!control_flow_is_escaping(node, exit, merge))
						non_breaking_exits.push_back(exit);

				dominated_merge = CFGStructurizer::find_common_post_dominator(std::move(non_breaking_exits));
			}
			else
			{
				dominated_merge = CFGStructurizer::find_common_post_dominator(std::move(dominated_exit));
			}

			if (!dominated_merge)
			{
				LOGE("There is no candidate for ladder merging.\n");
			}

			if (dominated_merge && !node->dominates(dominated_merge))
			{
				LOGE("We don't dominate the merge target ...\n");
				dominated_merge = nullptr;
			}

			if (!merge)
			{
				LOGE("Failed to find a common merge point ...\n");
			}
			else
			{
				node->loop_merge_block = merge;
				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);

				if (node->can_loop_merge_to(merge))
				{
					// Clean merge.
					// This is a unique merge block. There can be no other merge candidate.
					//LOGI("Loop with simple multi-exit merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node),
					//     node->name.c_str(), static_cast<const void *>(node->loop_merge_block),
					//     node->loop_merge_block->name.c_str());
				}
				else
				{
					// Single-escape merge.
					// It is unique, but we need workarounds later.
					//LOGI("Loop with ladder multi-exit merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node),
					//     node->name.c_str(), static_cast<const void *>(node->loop_merge_block),
					//     node->loop_merge_block->name.c_str());

					if (dominated_merge)
					{
						//LOGI("    Ladder block: %p (%s)\n", static_cast<const void *>(dominated_merge),
						//     dominated_merge->name.c_str());
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
	for (auto *node : forward_post_visit_order)
	{
		if (node->headers.size() <= 1)
			continue;

		// If this block was the merge target for more than one construct,
		// we will need to split the block. In SPIR-V, a merge block can only be the merge target for one construct.
		// However, we can set up a chain of merges where inner scope breaks to outer scope with a dummy basic block.
		// The outer scope comes before the inner scope merge.

		// We cannot fully trust a sort on post-visit order, since if we have two split blocks here,
		// they will have the same post-visit order until we recompute them.
		// FIXME: Should probably be smarter about this ...
		std::sort(node->headers.begin(), node->headers.end(),
		          [](const CFGNode *a, const CFGNode *b) -> bool {
			          if (a->dominates(b))
				          return true;
			          else if (b->dominates(a))
				          return false;
			          else
				          return a->forward_post_visit_order > b->forward_post_visit_order;
		          });

		// Verify that scopes are actually nested.
		// This means header[N] must dominate header[M] where N < M.
		for (size_t i = 1; i < node->headers.size(); i++)
		{
			if (!node->headers[i - 1]->dominates(node->headers[i]))
				LOGE("Scopes are not nested.\n");
		}

		if (node->headers[0]->loop_ladder_block)
		{
			LOGE("Outer loop header needs ladder break.\n");
		}

		//LOGI("Splitting merge blocks for %s\n", node->name.c_str());

		CFGNode *full_break_target = nullptr;

		// Before we start splitting and rewriting branches, we need to know which preds are considered "normal",
		// and which branches are considered ladder breaking branches (rewritten branches).
		// This will influence if a pred block gets false or true when emitting ladder breaking blocks later.
		std::vector<std::unordered_set<const CFGNode *>> normal_preds(node->headers.size());
		for (size_t i = 0; i < node->headers.size(); i++)
			if (node->headers[i]->loop_ladder_block)
				for (auto *pred : node->headers[i]->loop_ladder_block->pred)
					normal_preds[i].insert(pred);

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
				if (!loop_ladder)
				{
					// We don't have a ladder, because the loop merged to an outer scope, so we need to fake a ladder.
					auto *ladder = pool.create_node();
					ladder->name = node->name + ".merge";
					node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, ladder);
					node->headers[i]->loop_ladder_block = ladder;
					ladder->add_branch(node);
					ladder->ir.terminator.type = Terminator::Type::Branch;
					ladder->ir.terminator.direct_block = node;

					// If this is the second outermost scope, we don't need to deal with ladders.
					// ladder is a dummy branch straight out to the outer merge point.
					if (i > 1)
						loop_ladder = node->headers[i]->loop_ladder_block;
				}

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

						ladder->ir.terminator.type = Terminator::Type::Condition;
						ladder->ir.terminator.conditional_id = module.allocate_id();
						ladder->ir.terminator.false_block = loop_ladder;

						PHI phi;
						phi.id = ladder->ir.terminator.conditional_id;
						phi.type_id = module.get_builder().makeBoolType();
						module.get_builder().addName(phi.id, (std::string("ladder_phi_") + loop_ladder->name).c_str());

						for (auto *pred : ladder->pred)
						{
							IncomingValue incoming = {};
							incoming.block = pred;
							bool is_breaking_pred = normal_preds[i].count(pred) == 0;
							incoming.id = module.get_builder().makeBoolConstant(is_breaking_pred);
							phi.incoming.push_back(incoming);
						}
						ladder->ir.phi.push_back(std::move(phi));

						// Ladder breaks out to outer scope.
						if (target_header->loop_ladder_block)
						{
							ladder->ir.terminator.true_block = target_header->loop_ladder_block;
							ladder->add_branch(target_header->loop_ladder_block);
						}
						else if (target_header->loop_merge_block)
						{
							ladder->ir.terminator.true_block = target_header->loop_merge_block;
							ladder->add_branch(target_header->loop_merge_block);
						}
						else
							LOGE("No loop merge block?\n");

						// This can happen in some scenarios, fixup the branch to be a direct one instead.
						if (ladder->ir.terminator.true_block == ladder->ir.terminator.false_block)
						{
							ladder->ir.terminator.direct_block = ladder->ir.terminator.true_block;
							ladder->ir.terminator.type = Terminator::Type::Branch;
						}
					}
					else if (loop_ladder->succ.size() == 1 && loop_ladder->succ.front() == node)
					{
						if (loop_ladder->ir.operations.empty())
						{
							// Simplest common case.
							// If the loop ladder just branches to outer scope, and this block does not perform
							// any operations we can avoid messing around with ladder PHI variables and just execute the branch.
							// This block will likely become a frontier node when merging PHI instead.
							// This is a common case when breaking out of a simple for loop.
							node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, loop_ladder);
						}
						else
						{
							// We have a case where we're trivially breaking out of a selection construct,
							// but the loop ladder block contains operations which we must not execute,
							// since we were supposed to branch directly out to node.
							// We cannot directly break out of a selection construct, so our ladder must be a bit more sophisticated.
							// ladder-pre -> merge -> ladder-post -> selection merge
							//      \-------------------/
							auto *ladder_pre = create_helper_pred_block(loop_ladder);
							auto *ladder_post = create_helper_succ_block(loop_ladder);
							ladder_pre->add_branch(ladder_post);

							ladder_pre->ir.terminator.type = Terminator::Type::Condition;
							ladder_pre->ir.terminator.conditional_id = module.allocate_id();
							ladder_pre->ir.terminator.true_block = ladder_post;
							ladder_pre->ir.terminator.false_block = loop_ladder;

							// Merge to ladder instead.
							node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, ladder_pre);

							PHI phi;
							phi.id = ladder_pre->ir.terminator.conditional_id;
							phi.type_id = module.get_builder().makeBoolType();
							module.get_builder().addName(phi.id,
							                             (std::string("ladder_phi_") + loop_ladder->name).c_str());
							for (auto *pred : ladder_pre->pred)
							{
								IncomingValue incoming = {};
								incoming.block = pred;
								bool is_breaking_pred = normal_preds[i].count(pred) == 0;
								incoming.id = module.get_builder().makeBoolConstant(is_breaking_pred);
								phi.incoming.push_back(incoming);
							}
							ladder_pre->ir.phi.push_back(std::move(phi));
						}
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
			}
			else if (node->headers[i]->merge == MergeType::Selection)
			{
				if (target_header)
				{
					// Breaks out to outer available scope.
					if (target_header->loop_ladder_block)
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(
						    node, target_header->loop_ladder_block);
					else if (target_header->loop_merge_block)
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node,
						                                                               target_header->loop_merge_block);
					else
						LOGE("No loop merge block?\n");
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
				LOGE("Invalid merge type.\n");
		}
	}
}

void CFGStructurizer::structurize(unsigned pass)
{
	find_loops();
	find_switch_blocks();
	find_selection_merges(pass);
	fixup_broken_selection_merges(pass);
	if (pass == 0)
		split_merge_blocks();
}

void CFGStructurizer::recompute_dominance_frontier(CFGNode *node)
{
	std::unordered_set<const CFGNode *> traversed;
	node->dominance_frontier.clear();
	recompute_dominance_frontier(node, node, traversed);
}

void CFGStructurizer::recompute_dominance_frontier(CFGNode *header, const CFGNode *node,
                                                   std::unordered_set<const CFGNode *> traversed)
{
	// Not very efficient, but it'll do for now ...
	if (traversed.count(node))
		return;
	traversed.insert(node);

	for (auto *succ : node->succ)
	{
		if (header->dominates(succ))
			recompute_dominance_frontier(header, succ, traversed);
		else
		{
			auto &frontier = header->dominance_frontier;
			if (std::find(frontier.begin(), frontier.end(), succ) == frontier.end())
				header->dominance_frontier.push_back(succ);
		}
	}
}

void CFGStructurizer::validate_structured()
{
	for (auto *node : forward_post_visit_order)
	{
		if (node->headers.size() > 1)
		{
			LOGE("Node %s has %u headers!\n", node->name.c_str(), unsigned(node->headers.size()));
			return;
		}

		if (node->merge == MergeType::Loop)
		{
			if (!node->dominates(node->loop_merge_block) && !node->loop_merge_block->pred.empty())
			{
				LOGE("Node %s does not dominate its merge block %s!\n", node->name.c_str(),
				     node->loop_merge_block->name.c_str());
				return;
			}
		}
		else if (node->merge == MergeType::Selection)
		{
			if (!node->selection_merge_block)
				LOGE("No selection merge block for %s\n", node->name.c_str());
			else if (!node->dominates(node->selection_merge_block) && !node->selection_merge_block->pred.empty())
			{
				LOGE("Node %s does not dominate its selection merge block %s!\n", node->name.c_str(),
				     node->selection_merge_block->name.c_str());
				return;
			}
		}

		if (node->succ.size() >= 2 && node->merge == MergeType::None)
		{
			// This might not be critical.
			LOGW("Node %s has %u successors, but no merge header.\n", node->name.c_str(), unsigned(node->succ.size()));
		}
	}
	LOGI("Successful CFG validation!\n");
}

void CFGStructurizer::traverse(BlockEmissionInterface &iface)
{
	// Make sure all blocks are known to the backend before we emit code.
	// Prefer that IDs grow the further down the function we go.
	for (auto itr = forward_post_visit_order.rbegin(); itr != forward_post_visit_order.rend(); ++itr)
	{
		(*itr)->id = 0;
		iface.register_block(*itr);
	}

	// Need to emit blocks such that dominating blocks come before dominated blocks.
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *block = forward_post_visit_order[index - 1];

		auto &merge = block->ir.merge_info;

		switch (block->merge)
		{
		case MergeType::Selection:
			merge.merge_block = block->selection_merge_block;
			if (merge.merge_block)
				iface.register_block(merge.merge_block);
			merge.merge_type = block->merge;
			iface.emit_basic_block(block);
			break;

		case MergeType::Loop:
			merge.merge_block = block->loop_merge_block;
			merge.merge_type = block->merge;
			merge.continue_block = block->pred_back_edge;
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
} // namespace dxil_spv