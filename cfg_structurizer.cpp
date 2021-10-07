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

	UnorderedMap<const CFGNode *, uint32_t> node_to_id;
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

//#define PHI_DEBUG
#ifdef PHI_DEBUG
static void validate_phi(const PHI &phi)
{
	auto incomings = phi.incoming;
	std::sort(incomings.begin(), incomings.end(), [](const IncomingValue &a, const IncomingValue &b) {
		return a.block < b.block;
	});
	auto itr = std::unique(incomings.begin(), incomings.end(), [](const IncomingValue &a, const IncomingValue &b) {
		return a.block == b.block;
	});
	if (itr != incomings.end())
		abort();
}

static void validate_phi(const Vector<PHI> &phis)
{
	for (auto &phi : phis)
		validate_phi(phi);
}
#else
#define validate_phi(phi) ((void)0)
#endif

void CFGStructurizer::eliminate_node_link_preds_to_succ(CFGNode *node)
{
	assert(node->succ.size() == 1);
	auto *succ = node->succ.front();

	validate_phi(succ->ir.phi);

	Vector<CFGNode *> break_nodes;
	auto pred_copy = node->pred;
	for (auto *pred : pred_copy)
	{
		auto *break_node = pool.create_node();
		break_node->name = node->name + ".break." + pred->name;
		break_node->ir.terminator.type = Terminator::Type::Branch;
		break_node->ir.terminator.direct_block = succ;
		break_node->add_branch(succ);
		break_node->immediate_post_dominator = succ;
		break_node->immediate_dominator = pred;
		pred->retarget_branch(node, break_node);

		break_nodes.push_back(break_node);

		for (auto &phi : node->ir.phi)
			for (auto &incoming : phi.incoming)
				if (incoming.block == pred)
					incoming.block = break_node;
	}
	assert(node->pred.empty());

	for (auto &phi : succ->ir.phi)
	{
		// Find incoming ID from the block we're splitting up.
		auto incoming_itr = std::find_if(phi.incoming.begin(), phi.incoming.end(), [&](const IncomingValue &incoming) {
			return incoming.block == node;
		});
		assert(incoming_itr != phi.incoming.end());
		spv::Id incoming_from_node = incoming_itr->id;
		phi.incoming.erase(incoming_itr);

		// Try to see if the ID is a PHI that was generated by this block.
		auto outgoing_itr = std::find_if(node->ir.phi.begin(), node->ir.phi.end(), [&](const PHI &phi) {
			return phi.id == incoming_from_node;
		});

		if (outgoing_itr != node->ir.phi.end())
		{
			// If it was then we need to split up the PHI node. The break block will serve as a proxy
			// incoming block instead.
			phi.incoming.insert(phi.incoming.end(), outgoing_itr->incoming.begin(), outgoing_itr->incoming.end());
			node->ir.phi.erase(outgoing_itr);
			validate_phi(succ->ir.phi);
		}
		else
		{
			// A plain value is passed down to succ, most likely a constant which lives at global scope.
			// We know this block does not generate this ID, so it must be either a value generated at global scope
			// (constant), or a value created by a block which dominates this node,
			// which also means it dominates all preds to this node.
			for (auto *break_pred : break_nodes)
				phi.incoming.push_back({ break_pred, incoming_from_node });
			validate_phi(succ->ir.phi);
		}
	}
	assert(node->ir.phi.empty());
}

static bool node_has_phi_inputs_from(const CFGNode *from, const CFGNode *to)
{
	for (auto &phi : to->ir.phi)
		for (auto &incoming : phi.incoming)
			if (incoming.block == from)
				return true;
	return false;
}

void CFGStructurizer::cleanup_breaking_phi_constructs()
{
	bool did_work = false;

	// There might be cases where we have a common break block from different scopes which only serves to PHI together some values
	// before actually breaking, and passing that PHI node on to the actual break block.
	// This causes problems because this looks very much like a merge, but it is actually not and forces validation errors.
	// Another case is where the succ block takes PHI nodes from the breaking block only,
	// which is relevant if only constants are somehow used in the PHI construct.

	for (size_t i = forward_post_visit_order.size(); i; i--)
	{
		auto *node = forward_post_visit_order[i - 1];

		// Only bother with blocks which don't do anything useful work.
		// The only opcodes they should have are PHI nodes and a direct branch.
		if (!node->ir.operations.empty())
			continue;
		if (node->pred.size() <= 1)
			continue;
		if (node->succ.size() != 1)
			continue;
		if (node->ir.terminator.type != Terminator::Type::Branch)
			continue;

		auto *succ = node->succ.front();

		// Checks if either the merge block or successor is sensitive to PHI somehow.
		if (!node_has_phi_inputs_from(node, succ))
			continue;

		if (node->dominates(succ))
			continue;

		// Anything related to loop/continue blocks, we don't bother with.
		if (node->succ_back_edge || node->pred_back_edge)
			continue;

		// This is a merge block candidate for a loop, don't split.
		// It will only confuse things where we'll need to re-merge the split blocks anyways.
		bool is_merge_block_candidate = false;
		for (auto *pred : node->pred)
		{
			if (pred->succ_back_edge)
			{
				is_merge_block_candidate = true;
				continue;
			}
		}

		if (is_merge_block_candidate)
			continue;

		eliminate_node_link_preds_to_succ(node);
		did_work = true;
	}

	if (did_work)
		recompute_cfg();
}

bool CFGStructurizer::run()
{
	String graphviz_path;
	if (const char *env = getenv("DXIL_SPIRV_GRAPHVIZ_PATH"))
		graphviz_path = env;

	//log_cfg("Input state");
	if (!graphviz_path.empty())
	{
		reset_traversal();
		visit(*entry_block);
		auto graphviz_input = graphviz_path + ".input";
		log_cfg_graphviz(graphviz_input.c_str());
	}

	recompute_cfg();

	cleanup_breaking_phi_constructs();
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".phi-split";
		log_cfg_graphviz(graphviz_split.c_str());
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

	// We will have generated lots of ladder blocks
	// which might cause issues with further analysis, so
	// nuke them as required.
	eliminate_degenerate_blocks();

	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".eliminate0";
		log_cfg_graphviz(graphviz_split.c_str());
	}

	//LOGI("=== Structurize pass ===\n");
	structurize(0);
	update_structured_loop_merge_targets();

	//log_cfg("Structurize pass 0");
	if (!graphviz_path.empty())
	{
		auto graphviz_final = graphviz_path + ".struct0";
		log_cfg_graphviz(graphviz_final.c_str());
	}

	// We will have generated lots of ladder blocks
	// which might cause issues with further analysis, so
	// nuke them as required.
	eliminate_degenerate_blocks();

	//log_cfg("Split merge scopes");
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".eliminate1";
		log_cfg_graphviz(graphviz_split.c_str());
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

void CFGStructurizer::update_structured_loop_merge_targets()
{
	// First, we need to do this before recomputing the CFG, since we lose
	// normal loop merge targets when recomputing.
	structured_loop_merge_targets.clear();
	for (auto *node : forward_post_visit_order)
	{
		if (node->loop_merge_block)
			structured_loop_merge_targets.insert(node->loop_merge_block);
		if (node->loop_ladder_block)
			structured_loop_merge_targets.insert(node->loop_ladder_block);
	}

	recompute_cfg();

	// Make sure we include merge blocks which are frozen merge targets in ladder blocks, which
	// were not included in the post visit order yet.
	for (auto *node : forward_post_visit_order)
	{
		if (node->loop_merge_block)
			structured_loop_merge_targets.insert(node->loop_merge_block);
		if (node->loop_ladder_block)
			structured_loop_merge_targets.insert(node->loop_ladder_block);
	}
}

void CFGStructurizer::eliminate_degenerate_blocks()
{
	// After we create ladder blocks, we will likely end up with a lot of blocks which don't do much.
	// We might also have created merge scenarios which should *not* merge, i.e. cleanup_breaking_phi_constructs(),
	// except we caused it ourselves.

	// Eliminate bottom-up. First eliminate B, in A -> B -> C, where B contributes nothing.
	bool did_work = false;
	for (auto *node : forward_post_visit_order)
	{
		if (node->ir.operations.empty() &&
		    node->ir.phi.empty() &&
		    !node->pred_back_edge &&
		    !node->succ_back_edge &&
		    node->succ.size() == 1 &&
		    node->ir.terminator.type == Terminator::Type::Branch &&
		    node->merge == MergeType::None &&
		    // Loop merge targets are sacred, and must not be removed.
		    structured_loop_merge_targets.count(node) == 0 &&
		    !node_has_phi_inputs_from(node, node->succ.front()))
		{
			// If any pred is a continue block, this block is also load-bearing, since it can be used as a merge block.
			if (std::find_if(node->pred.begin(), node->pred.end(),
			                 [](const CFGNode *n) { return n->succ_back_edge != nullptr; }) != node->pred.end())
			{
				continue;
			}

			// If any succ is a continue block, this block is also load-bearing, since it can be used as a merge block
			// (merge-to-continue ladder).
			if (std::find_if(node->succ.begin(), node->succ.end(),
			                 [](const CFGNode *n) { return n->succ_back_edge != nullptr; }) != node->succ.end())
			{
				continue;
			}

			// If succ uses this block as an incoming block, we should keep the block around.
			// We're only really interested in eliminating degenerate ladder blocks,
			// which generally do not deal with PHI.
			auto *succ = node->succ.front();
			if (std::find_if(succ->ir.phi.begin(), succ->ir.phi.end(),
			                 [node](const PHI &phi) {
			                   return std::find_if(phi.incoming.begin(), phi.incoming.end(),
			                                       [node](const IncomingValue &incoming) {
				                                     return incoming.block == node;
			                                       }) != phi.incoming.end();
			                 }) != succ->ir.phi.end())
			{
				continue;
			}

			if (node->pred.size() == 1 && node->post_dominates(node->pred.front()))
			{
				// Trivial case.
				did_work = true;
				auto *pred = node->pred.front();
				pred->retarget_branch(node, succ);
			}
			else if (node->pred.size() >= 2 && !node->dominates(node->succ.front()) &&
			         node->succ.front()->post_dominates(node))
			{
				// If we have two or more preds, we have to be really careful.
				// If this node is on a breaking path, without being important for merging control flow,
				// it is fine to eliminate the block.
				if (control_flow_is_escaping(node, node->succ.front()) &&
				    !block_is_load_bearing(node, node->succ.front()))
				{
					did_work = true;
					auto tmp_pred = node->pred;
					for (auto *pred : tmp_pred)
						pred->retarget_branch(node, node->succ.front());
				}
			}
		}
	}

	if (did_work)
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
		node->pred.erase(itr, node->pred.end());
	}
}

static void rewrite_consumed_ids(IRBlock &ir, spv::Id from, spv::Id to)
{
	for (auto *op : ir.operations)
	{
		for (unsigned i = 0; i < op->num_arguments; i++)
		{
			if ((op->literal_mask & (1u << i)) == 0)
				if (op->arguments[i] == from)
					op->arguments[i] = to;
		}
	}

	if (ir.terminator.conditional_id == from)
		ir.terminator.conditional_id = to;
	if (ir.terminator.return_value == from)
		ir.terminator.return_value = to;
}

void CFGStructurizer::fixup_broken_value_dominance()
{
	struct Origin
	{
		CFGNode *node;
		spv::Id type_id;
	};

	UnorderedMap<spv::Id, Origin> origin;
	UnorderedMap<spv::Id, Vector<CFGNode *>> id_to_non_local_consumers;

	// First, scan through all blocks and figure out which block creates an ID.
	for (auto *node : forward_post_visit_order)
	{
		for (auto *op : node->ir.operations)
			if (op->id)
				origin[op->id] = { node, op->type_id };
		for (auto &phi : node->ir.phi)
			origin[phi.id] = { node, phi.type_id };
	}

	const auto sort_unique_node_vector = [](Vector<CFGNode *> &nodes) {
		// Fixup nodes in order.
		std::sort(nodes.begin(), nodes.end(), [](const CFGNode *a, const CFGNode *b) -> bool {
			return a->forward_post_visit_order > b->forward_post_visit_order;
		});
		nodes.erase(std::unique(nodes.begin(), nodes.end()), nodes.end());
	};

	const auto mark_node_value_access = [&](CFGNode *node, spv::Id id) {
		auto origin_itr = origin.find(id);
		if (origin_itr == origin.end())
			return;

		auto *origin_node = origin_itr->second.node;
		if (!origin_node->dominates(node))
		{
			// We have a problem. Mark that we need to rewrite a certain variable.
			id_to_non_local_consumers[id].push_back(node);
		}
	};

	// Now, scan through all blocks and figure out which values are consumed in different blocks.
	for (auto *node : forward_post_visit_order)
	{
		for (auto *op : node->ir.operations)
		{
			auto literal_mask = op->literal_mask;
			for (unsigned i = 0; i < op->num_arguments; i++)
				if (((1u << i) & literal_mask) == 0)
					mark_node_value_access(node, op->arguments[i]);
		}

		// Incoming PHI values are handled elsewhere by modifying the incoming block to the creating block.
		// Ignore these kinds of usage here.

		if (node->ir.terminator.conditional_id != 0)
			mark_node_value_access(node, node->ir.terminator.conditional_id);
		if (node->ir.terminator.return_value != 0)
			mark_node_value_access(node, node->ir.terminator.return_value);
	}

	// Resolve these broken PHIs by using OpVariable. It is the simplest solution, and this is a very rare case to begin with.
	struct Rewrite
	{
		spv::Id id;
		const Vector<CFGNode *> *consumers;
	};
	Vector<Rewrite> rewrites;
	rewrites.reserve(id_to_non_local_consumers.size());

	for (auto &pair : id_to_non_local_consumers)
	{
		sort_unique_node_vector(pair.second);
		rewrites.push_back({ pair.first, &pair.second });
	}

	// Ensure ordering so that output remains stable.
	std::sort(rewrites.begin(), rewrites.end(), [](const Rewrite &a, const Rewrite &b) {
		return a.id < b.id;
	});

	for (auto &rewrite : rewrites)
	{
		auto &orig = origin[rewrite.id];
		spv::Id alloca_var_id = module.create_variable(spv::StorageClassFunction, orig.type_id);

		auto *store_op = module.allocate_op(spv::OpStore);
		store_op->add_id(alloca_var_id);
		store_op->add_id(rewrite.id);
		orig.node->ir.operations.push_back(store_op);

		// For every non-local node which consumes ID, we load from the alloca'd variable instead.
		// Rewrite all ID references to point to the loaded value.
		for (auto *consumer : *rewrite.consumers)
		{
			spv::Id loaded_id = module.allocate_id();
			auto *load_op = module.allocate_op(spv::OpLoad, loaded_id, orig.type_id);
			load_op->add_id(alloca_var_id);

			rewrite_consumed_ids(consumer->ir, rewrite.id, loaded_id);

			consumer->ir.operations.insert(consumer->ir.operations.begin(), load_op);
		}
	}
}

void CFGStructurizer::insert_phi()
{
	prune_dead_preds();

	// It is possible that an SSA value was created in a block, and consumed in another.
	// With CFG rewriting branches, it is possible that dominance relationship no longer holds
	// and we must insert new dummy IDs to resolve this.
	fixup_broken_value_dominance();

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

Vector<IncomingValue>::const_iterator CFGStructurizer::find_incoming_value(
    const CFGNode *frontier_pred, const Vector<IncomingValue> &incoming)
{
	// Find the incoming block which dominates frontier_pred and has the lowest post visit order.
	// There are cases where two or more blocks dominate, but we want the most immediate dominator.
	auto candidate = incoming.end();

	for (auto itr = incoming.begin(); itr != incoming.end(); ++itr)
	{
		auto *block = itr->block;
		if (block->dominates(frontier_pred))
		{
			if (candidate == incoming.end() || (block->forward_post_visit_order < candidate->block->forward_post_visit_order))
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
#ifdef PHI_DEBUG
			LOGI("For node %s, move incoming node %s to %s.\n", node.block->name.c_str(), incoming.block->name.c_str(),
			     itr->second->name.c_str());
#endif
			incoming.block = itr->second;
			validate_phi(node.block->ir.phi[node.phi_index]);
		}
	}
}

bool CFGStructurizer::can_complete_phi_insertion(const PHI &phi, const CFGNode *block)
{
	// If all incoming values have at least one pred block they dominate, we can merge the final PHI.
	auto &incoming_values = phi.incoming;
	for (auto &incoming : incoming_values)
	{
		auto itr = std::find_if(block->pred.begin(), block->pred.end(),
		                        [&](const CFGNode *n) { return incoming.block->dominates(n); });

		if (itr == block->pred.end() &&
		    (!block->pred_back_edge || !incoming.block->dominates(block->pred_back_edge)))
		{
			return false;
		}
	}

	return true;
}

bool CFGStructurizer::query_reachability_through_back_edges(const CFGNode &from, const CFGNode &to) const
{
	if (to.dominates(&from))
	{
		// If we're dominated by end node, only way we can reach is through a back edge.
		return to.pred_back_edge && query_reachability(from, *to.pred_back_edge);
	}
	else
		return query_reachability(from, to);
}

bool CFGStructurizer::query_reachability_split_loop_header(const CFGNode &from, const CFGNode &to, const CFGNode &end_node) const
{
	// A special query where from and to must lie on the same side of a loop header to be considered reachable.
	if (!end_node.pred_back_edge)
		return query_reachability(from, to);

	bool from_reaches_header = query_reachability(from, end_node);
	bool to_reaches_header = query_reachability(to, end_node);
	if (from_reaches_header != to_reaches_header)
		return false;

	return query_reachability(from, to);
}

bool CFGStructurizer::phi_frontier_makes_forward_progress(const PHI &phi, const CFGNode *frontier,
                                                          const CFGNode *end_node) const
{
	// Not all PHI frontiers are nodes we need to care about.
	// There are two conditions we must meet to disregard a placement.
	// - We do not remove any inputs as a result.
	// - The frontier can reach another incoming value.
	// In this situation, a frontier is completely meaningless.
	auto &incoming = phi.incoming;

	for (auto &incoming_value : incoming)
	{
		auto *incoming_block = incoming_value.block;
		// We will remove an input, this is forward progress.
		if (!exists_path_in_cfg_without_intermediate_node(incoming_block, end_node, frontier))
			return true;
	}

	// Nothing is removed as a result, so check if the frontier can reach another incoming value.
	// If end_node is a loop header, makes sure we only consider a node visible if they are both on the correct side of the
	// loop header.
	for (auto &incoming_value : incoming)
		if (query_reachability_split_loop_header(*frontier, *incoming_value.block, *end_node))
			return false;

	// Assume we make forward progress. Either way, we will never look at a frontier twice,
	// so this should be safe. The only real risk is that we add some redundant PHI nodes.
	return true;
}

void CFGStructurizer::insert_phi(PHINode &node)
{
	// We start off with N values defined in N blocks.
	// These N blocks *used* to branch to the PHI node, but due to our structurizer,
	// there might not be branch targets here anymore, primary example here is ladders.
	// In order to fix this we need to follow control flow from these values and insert phi nodes as necessary to link up
	// a set of values where dominance frontiers are shared.

#ifdef PHI_DEBUG
	LOGI("\n=== INSERT PHI FOR %s ===\n", node.block->name.c_str());
#endif

	auto &phi = node.block->ir.phi[node.phi_index];
	auto &incoming_values = phi.incoming;

	UnorderedSet<const CFGNode *> placed_frontiers;

	for (;;)
	{
#ifdef PHI_DEBUG
		LOGI("\n=== PHI iteration ===\n");

		for (auto &incoming : incoming_values)
			LOGI("  Incoming value from %s\n", incoming.block->name.c_str());
#endif

		// Inside the CFG subset, find a dominance frontiers where we merge PHIs this iteration.
		CFGNode *frontier = node.block;
		if (!can_complete_phi_insertion(phi, node.block))
		{
			frontier = nullptr;

			// We need some intermediate merge, so find a frontier node to work on.
			for (auto &incoming : incoming_values)
			{
				for (auto *candidate_frontier : incoming.block->dominance_frontier)
				{
					if (placed_frontiers.count(candidate_frontier))
						continue;

					if (!phi_frontier_makes_forward_progress(phi, candidate_frontier, node.block))
					{
						// Makes sure we don't redundantly test this again.
						placed_frontiers.insert(candidate_frontier);
						continue;
					}

					// Only consider a frontier if we can reach node.block or its back edge from it.
					if (query_reachability_through_back_edges(*candidate_frontier, *node.block))
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

			if (frontier)
				placed_frontiers.insert(frontier);
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
				Vector<IncomingValue> final_incoming;

				// Final merge.
				for (auto *input : frontier->pred)
				{
					auto itr = find_incoming_value(input, incoming_values);

					IncomingValue value = {};
					if (itr != incoming_values.end())
						value.id = itr->id;
					else
						value.id = module.get_builder().createUndefined(phi.type_id);

					value.block = input;
					final_incoming.push_back(value);
				}

				if (frontier->pred_back_edge)
				{
					auto itr = find_incoming_value(frontier->pred_back_edge, incoming_values);

					IncomingValue value = {};
					if (itr != incoming_values.end())
						value.id = itr->id;
					else
						value.id = module.get_builder().createUndefined(phi.type_id);

					value.block = frontier->pred_back_edge;
					final_incoming.push_back(value);
				}

				incoming_values = std::move(final_incoming);
			}
			return;
		}

		// A candidate dominance frontier is a place where we might want to place a PHI node in order to merge values.
		// For a successful iteration, we need to find at least one candidate where we can merge PHI.

#ifdef PHI_DEBUG
		LOGI("Testing dominance frontier %s ...\n", frontier->name.c_str());
#endif

		// Remove old inputs.
		PHI frontier_phi;
		frontier_phi.id = module.allocate_id();
		frontier_phi.type_id = phi.type_id;
		module.get_builder().addName(frontier_phi.id, (String("frontier_phi_") + frontier->name).c_str());

		assert(!frontier->pred_back_edge);
		for (auto *input : frontier->pred)
		{
			auto itr = find_incoming_value(input, incoming_values);
			if (itr != incoming_values.end())
			{
#ifdef PHI_DEBUG
				auto *incoming_block = itr->block;
				LOGI("   ... found incoming block %s for input %s.\n", incoming_block->name.c_str(), input->name.c_str());
				LOGI(" ... For pred %s (%p), found incoming value from %s (%p)\n", input->name.c_str(),
				     static_cast<const void *>(input), incoming_block->name.c_str(),
				     static_cast<const void *>(incoming_block));
#endif

				IncomingValue value = {};
				value.id = itr->id;
				value.block = input;
				frontier_phi.incoming.push_back(value);
			}
			else
			{
#ifdef PHI_DEBUG
				LOGI("   ... creating undefined input for %s\n", input->name.c_str());
#endif
				// If there is no incoming value, we need to hallucinate an undefined value.
				IncomingValue value = {};
				value.id = module.get_builder().createUndefined(phi.type_id);
				value.block = input;
				frontier_phi.incoming.push_back(value);
			}
		}

		// Do we remove the incoming value now or not?
		// If all paths from incoming value must go through frontier, we can remove it,
		// otherwise, we might still need to use the incoming value somewhere else.
		size_t num_alive_incoming_values = incoming_values.size();
		for (size_t i = 0; i < num_alive_incoming_values; )
		{
			auto *incoming_block = incoming_values[i].block;
			if (!exists_path_in_cfg_without_intermediate_node(incoming_block, node.block, frontier))
			{
#ifdef PHI_DEBUG
				LOGI("     ... removing input in %s\n", incoming_block->name.c_str());
#endif
				if (i != num_alive_incoming_values - 1)
					std::swap(incoming_values[num_alive_incoming_values - 1], incoming_values[i]);
				num_alive_incoming_values--;
			}
			else
			{
#ifdef PHI_DEBUG
				LOGI("     ... keeping input in %s\n", incoming_block->name.c_str());
#endif
				i++;
			}
		}

		// Need to clean up exhausted incoming values after the loop,
		// since an incoming value can be used multiple times before a frontier PHI is resolved.
		incoming_values.erase(incoming_values.begin() + num_alive_incoming_values, incoming_values.end());

		IncomingValue *dominated_incoming = nullptr;
		for (auto &incoming : incoming_values)
		{
			if (frontier->dominates(incoming.block) &&
			    !exists_path_in_cfg_without_intermediate_node(frontier, node.block, incoming.block))
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
				                             (String("merged_phi_") + dominated_incoming->block->name).c_str());
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

#ifdef PHI_DEBUG
		LOGI("=========================\n");
#endif
		frontier->ir.phi.push_back(std::move(frontier_phi));
	}
}

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
		node.fake_pred.clear();
		node.fake_succ.clear();

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

struct LoopBacktracer
{
	void trace_to_parent(CFGNode *header, CFGNode *block);
	UnorderedSet<CFGNode *> traced_blocks;
};

struct LoopMergeTracer
{
	explicit LoopMergeTracer(const LoopBacktracer &backtracer_)
		: backtracer(backtracer_)
	{
	}

	void trace_from_parent(CFGNode *header);
	const LoopBacktracer &backtracer;
	UnorderedSet<CFGNode *> loop_exits;
	UnorderedSet<CFGNode *> traced_blocks;
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

		// A backtrace will not pick up continue blocks which only branch back to header,
		// and thus they will be considered loop exists by mistake.
		// Start traversing from the continue block to catch these nodes as well.
		// If a loop header is part of an outer loop construct, the loop body must
		// also be part of the loop construct.
		if (block->pred_back_edge)
			trace_to_parent(header, block->pred_back_edge);
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
		// We'll visit them explicitly later.
		if (node->succ.empty() && !node->succ_back_edge)
			leaf_nodes.push_back(node);
	}

	for (auto *leaf : leaf_nodes)
		backwards_visit(*leaf);

	// It might be case that some continue blocks are not reachable through backwards traversal.
	// This effectively means that our flipped CFG is not reducible, which is rather annoying.
	// To work around this, we fake some branches from the continue block out to other blocks.
	// This way, we ensure that every forward-reachable block is reachable in a backwards traversal as well.
	// The algorithm works where given the innermost loop header A, a block B (A dom B) and continue block C,
	// For successors of B, we will observe some successors which can reach C ({E}), and some successors which can not reach C.
	// C will add fake successor edges to {E}.
	bool need_revisit = false;
	for (auto *node : forward_post_visit_order)
	{
		if (node->pred_back_edge)
		{
			if (!node->pred_back_edge->backward_visited)
			{
				LoopBacktracer tracer;
				tracer.trace_to_parent(node, node->pred_back_edge);
				LoopMergeTracer merge_tracer(tracer);
				merge_tracer.trace_from_parent(node);
				for (auto *f : merge_tracer.loop_exits)
					node->pred_back_edge->add_fake_branch(f);
				need_revisit = true;
			}
		}
	}

	if (need_revisit)
	{
		for (auto *node : forward_post_visit_order)
		{
			node->backward_visited = false;
			node->traversing = false;
			node->backward_post_visit_order = 0;
		}

		for (auto *leaf : leaf_nodes)
			backwards_visit(*leaf);
	}

	exit_block->backward_post_visit_order = backward_post_visit_order.size();
	exit_block->immediate_post_dominator = exit_block;
	exit_block->backward_visited = true;
	for (auto *leaf : leaf_nodes)
		leaf->immediate_post_dominator = exit_block;
}

void CFGStructurizer::backwards_visit(CFGNode &entry)
{
	entry.backward_visited = true;

	for (auto *pred : entry.pred)
		if (!pred->backward_visited)
			backwards_visit(*pred);

	for (auto *pred : entry.fake_pred)
		if (!pred->backward_visited)
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

void CFGStructurizer::merge_to_succ(CFGNode *node, unsigned index)
{
	node->succ[index]->headers.push_back(node);
	node->selection_merge_block = node->succ[index];
	node->merge = MergeType::Selection;
	//LOGI("Fixup selection merge %s -> %s\n", node->name.c_str(), node->selection_merge_block->name.c_str());
}

void CFGStructurizer::isolate_structured(UnorderedSet<CFGNode *> &nodes, const CFGNode *header,
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

Vector<CFGNode *> CFGStructurizer::isolate_structured_sorted(const CFGNode *header, const CFGNode *merge)
{
	UnorderedSet<CFGNode *> nodes;
	isolate_structured(nodes, header, merge);

	Vector<CFGNode *> sorted;
	sorted.reserve(nodes.size());

	for (auto *node : nodes)
		sorted.push_back(node);

	std::sort(sorted.begin(), sorted.end(),
	          [](const CFGNode *a, const CFGNode *b) { return a->forward_post_visit_order > b->forward_post_visit_order; });
	return sorted;
}

bool CFGStructurizer::block_is_load_bearing(const CFGNode *node, const CFGNode *merge) const
{
	return node->pred.size() >= 2 &&
	       !exists_path_in_cfg_without_intermediate_node(node->immediate_dominator, merge, node);
}

bool CFGStructurizer::control_flow_is_escaping(const CFGNode *node, const CFGNode *merge) const
{
	if (node == merge)
		return false;

	assert(merge->post_dominates(node));
	bool escaping_path = false;

	// First, test the loop scenario.
	// If we're inside a loop, we're a break construct if we can prove that:
	// - node has a loop header which dominates it.
	// - node cannot reach the continue block.
	// - Continue block cannot reach node.
	// - All post-domination frontiers can reach the continue block, meaning that at some point control flow
	//   decided to break out of the loop construct.
	auto *innermost_loop_header = entry_block->get_innermost_loop_header_for(node);
	if (innermost_loop_header && innermost_loop_header->pred_back_edge)
	{
		bool dominates_merge = node->dominates(merge);
		bool can_reach_continue = query_reachability(*node, *innermost_loop_header->pred_back_edge);
		bool continue_can_reach = query_reachability(*innermost_loop_header->pred_back_edge, *node);
		bool pdf_can_reach_continue = true;

		for (auto *frontier : node->post_dominance_frontier)
		{
			bool header_dominates_frontier = innermost_loop_header->dominates(frontier);
			bool fronter_is_inside_loop_construct =
				query_reachability(*frontier, *innermost_loop_header->pred_back_edge);
			if (!header_dominates_frontier || !fronter_is_inside_loop_construct)
			{
				pdf_can_reach_continue = false;
				break;
			}
		}

		if (!dominates_merge && !continue_can_reach && !can_reach_continue && pdf_can_reach_continue)
			escaping_path = true;
	}

	if (!escaping_path)
	{
		// Try to test if our block is load bearing, in which case it cannot be considered a break block.
		// If the only path from idom to merge goes through node, it must be considered load bearing,
		// since removing break paths must not change reachability.
		bool load_bearing_escape = block_is_load_bearing(node, merge);

		if (!load_bearing_escape)
		{
			// If we cannot prove the escape through loop analysis, we might be able to deduce it from domination frontiers.
			// If control flow is not escaping, then there must exist a dominance frontier node A,
			// where merge strictly post-dominates A.
			// This means that control flow can merge somewhere before we hit the merge block, and we consider that
			// normal structured control flow.

			escaping_path = true;
			for (auto *frontier : node->dominance_frontier)
			{
				if (merge != frontier && merge->post_dominates(frontier))
				{
					escaping_path = false;
					break;
				}
			}
		}
	}

	return escaping_path;
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

		int trivial_merge_index = -1;

		// Only allow the obvious merge candidates in pass 1.
		// In pass 0, we might have a clear merge candidate,
		// but the other path might be an escaping edge, which needs to be considered.
		if (dominates_a && !dominates_b && !merge_a_has_header)
		{
			// A is obvious candidate. B is a direct break/continue construct target most likely.
			merge_to_succ(node, 0);
			trivial_merge_index = 0;
		}
		else if (dominates_b && !dominates_a && !merge_b_has_header)
		{
			// B is obvious candidate. A is a direct break/continue construct target most likely.
			merge_to_succ(node, 1);
			trivial_merge_index = 1;
		}
		else if (dominates_a && dominates_b && !merge_a_has_header && merge_b_has_header)
		{
			// Not as obvious of a candidate, but this can happen if one path hits continue block,
			// and other path hits a ladder merge block.
			// For do/while(false) style loop, the loop body may dominate the merge block.
			merge_to_succ(node, 0);
			trivial_merge_index = 0;
		}
		else if (dominates_a && dominates_b && !merge_b_has_header && merge_a_has_header)
		{
			// Not as obvious of a candidate, but this can happen if one path hits continue block,
			// and other path hits a ladder merge block.
			// For do/while style loop, the loop body may dominate the merge block.
			merge_to_succ(node, 1);
			trivial_merge_index = 1;
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
					bool a_path_is_break = control_flow_is_escaping(node->succ[0], merge);
					bool b_path_is_break = control_flow_is_escaping(node->succ[1], merge);

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

					bool a_path_is_break = control_flow_is_escaping(node->succ[0], merge);
					bool b_path_is_break = control_flow_is_escaping(node->succ[1], merge);
					if (a_path_is_break && b_path_is_break)
					{
						// Both paths break, so we never merge. Merge against Unreachable node if necessary ...
						node->merge = MergeType::Selection;
						node->selection_merge_block = nullptr;
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
					node->selection_merge_block = nullptr;
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

		if (trivial_merge_index >= 0 && pass == 0)
		{
			CFGNode *merge = CFGStructurizer::find_common_post_dominator(node->succ);
			if (merge && !node->dominates(merge))
			{
				if (!merge->headers.empty())
				{
					// We might have a trivial merge, yet the other branch direction
					// is a breaking construct. We will have to split some blocks.
					merge->headers.push_back(node);
				}

				auto *current_candidate = node->succ[trivial_merge_index];
				auto *other_candidate = node->succ[1 - trivial_merge_index];

				bool current_escapes = control_flow_is_escaping(current_candidate, merge) || current_candidate == merge;
				bool other_escapes = control_flow_is_escaping(other_candidate, merge) || other_candidate == merge;

				// If we tried to merge in a direction which is a breaking construct,
				// this means that the other path is actual desired break path.
				if (current_escapes && !other_escapes)
				{
					auto *target_block = node->succ[1 - trivial_merge_index];
					// We kinda want to merge the other way, but to do that, we need an interim block.
					auto *ladder = pool.create_node();
					ladder->name = node->name + "." + target_block->name + ".interim";
					ladder->add_branch(target_block);
					ladder->ir.terminator.type = Terminator::Type::Branch;
					ladder->ir.terminator.direct_block = target_block;
					ladder->immediate_dominator = node;
					ladder->immediate_post_dominator = target_block;
					ladder->dominance_frontier.push_back(target_block);
					ladder->forward_post_visit_order = node->forward_post_visit_order;
					ladder->backward_post_visit_order = node->backward_post_visit_order;
					node->retarget_branch(target_block, ladder);
					node->selection_merge_block = ladder;
				}
			}
		}
	}
}

void CFGStructurizer::rewrite_selection_breaks(CFGNode *header, CFGNode *ladder_to)
{
	// Don't rewrite loops here (since this is likely a loop merge block),
	// unless we're rewriting header -> inner construct scenario.
	// Check if the ladder_to block has a path to continue block.
	// If it does, it is part of the loop construct, and cannot be a loop merge block.
	if (header->pred_back_edge && !header->pred_back_edge->can_backtrace_to(ladder_to))
		return;

	// Don't rewrite switch blocks either.
	if (header->ir.terminator.type == Terminator::Type::Switch)
		return;

	//LOGI("Rewriting selection breaks %s -> %s\n", header->name.c_str(), ladder_to->name.c_str());

	UnorderedSet<CFGNode *> nodes;
	UnorderedSet<CFGNode *> construct;

	// Be careful about rewriting branches in continuing constructs.
	CFGNode *inner_continue_block = nullptr;
	CFGNode *inner_continue_succ = nullptr;
	bool ladder_to_dominates_continue = false;
	bool break_post_dominates_ladder_to = false;
	auto *innermost_loop_header = entry_block->get_innermost_loop_header_for(header);
	if (innermost_loop_header && innermost_loop_header->pred_back_edge)
		inner_continue_block = innermost_loop_header->pred_back_edge;
	if (inner_continue_block && inner_continue_block->succ.size() == 1)
	{
		inner_continue_succ = inner_continue_block->succ.front();
		break_post_dominates_ladder_to = inner_continue_succ->post_dominates(ladder_to);
		ladder_to_dominates_continue = ladder_to->dominates(inner_continue_block);
	}

	header->traverse_dominated_blocks([&](CFGNode *node) -> bool {
		// Inner loop headers are not candidates for a rewrite. They are split in split_merge_blocks.
		// Similar with switch blocks.
		// Also, we need to stop traversing when we hit the target block ladder_to.
		if (node != ladder_to && nodes.count(node) == 0)
		{
			nodes.insert(node);
			if (!query_reachability(*node, *ladder_to))
				return false;

			bool branch_is_loop_or_switch = node->pred_back_edge ||
			                                node->ir.terminator.type == Terminator::Type::Switch;

			// If our candidate scope splits a loop scope in half, ignore this candidate.
			if (break_post_dominates_ladder_to && !ladder_to_dominates_continue &&
			    node->dominates(inner_continue_block))
			{
				return false;
			}

			if (node->succ.size() >= 2 && !branch_is_loop_or_switch)
			{
				auto *outer_header = get_post_dominance_frontier_with_cfg_subset_that_reaches(node, ladder_to, nullptr);
				if (outer_header == header)
					construct.insert(node);
			}
			return true;
		}
		else
			return false;
	});

	Vector<CFGNode *> sorted_construct;
	sorted_construct.reserve(construct.size());
	for (auto *inner_block : construct)
		sorted_construct.push_back(inner_block);

	// Emit inner constructs before outer constructs.
	// This way we get natural nesting in case of certain if/else if ladders.
	std::sort(sorted_construct.begin(), sorted_construct.end(), [](const CFGNode *a, const CFGNode *b) {
		return a->forward_post_visit_order < b->forward_post_visit_order;
	});

	for (auto *inner_block : sorted_construct)
	{
		//LOGI("Header: %s, Inner: %s.\n", header->name.c_str(), inner_block->name.c_str());
		auto *ladder = pool.create_node();
		ladder->name = ladder_to->name + "." + inner_block->name + ".ladder";
		//LOGI("Walking dominated blocks of %s, rewrite branches %s -> %s.\n", inner_block->name.c_str(),
		//     ladder_to->name.c_str(), ladder->name.c_str());

		ladder->add_branch(ladder_to);
		ladder->ir.terminator.type = Terminator::Type::Branch;
		ladder->ir.terminator.direct_block = ladder_to;
		ladder->immediate_post_dominator = ladder_to;
		ladder->dominance_frontier.push_back(ladder_to);
		ladder->forward_post_visit_order = ladder_to->forward_post_visit_order;
		ladder->backward_post_visit_order = ladder_to->backward_post_visit_order;

		// Stop rewriting once we hit a merge block.
		inner_block->traverse_dominated_blocks_and_rewrite_branch(
		    ladder_to, ladder, [inner_block](CFGNode *node) -> bool {
			    return inner_block->selection_merge_block != node;
		    });

		ladder->recompute_immediate_dominator();
		rewrite_selection_breaks(inner_block, ladder);
	}
}

bool CFGStructurizer::header_and_merge_block_have_entry_exit_relationship(CFGNode *header, CFGNode *merge)
{
	if (!merge->post_dominates(header))
		return false;

	// If there are other blocks which need merging, and that idom is the header,
	// then header is some kind of exit block.
	bool found_inner_merge_target = false;

	UnorderedSet<CFGNode *> traversed;

	header->traverse_dominated_blocks([&](CFGNode *node) {
		if (node == merge)
			return false;
		if (traversed.count(node))
			return false;
		traversed.insert(node);

		if (node->num_forward_preds() <= 1)
			return true;
		auto *idom = node->immediate_dominator;
		if (idom == header)
		{
			found_inner_merge_target = true;
			return false;
		}
		return true;
	});
	return found_inner_merge_target;
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

		// If we find a construct which is a typical entry <-> exit scenario, do not attempt to rewrite
		// any branches. The real merge block might be contained inside this construct, and this block merely
		// serves as the exit merge point. It should generally turn into a loop merge later.
		if (header_and_merge_block_have_entry_exit_relationship(idom, node))
			continue;

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
	visit(*entry_block);
	// Need to prune dead preds before computing dominance.
	prune_dead_preds();
	build_immediate_dominators();
	build_reachability();

	backwards_visit();
	build_immediate_post_dominators();

	compute_dominance_frontier();
	compute_post_dominance_frontier();
}

bool CFGStructurizer::find_switch_blocks(unsigned pass)
{
	bool modified_cfg = false;
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];
		if (node->ir.terminator.type != Terminator::Type::Switch)
			continue;

		auto *merge = find_common_post_dominator(node->succ);

		if (pass == 0)
		{
			// Maintain the original switch block order if possible to avoid awkward churn in reference output.
			uint64_t order = 0;
			for (auto &c : node->ir.terminator.cases)
			{
				// We'll need to increment global order up to N times in the worst case.
				// Use 64-bit here as a safeguard in case the module is using a ridiculous amount of case labels.
				c.global_order = order * node->ir.terminator.cases.size();
				order++;
			}

			// First, sort so that any fallthrough parent comes before fallthrough target.
			std::sort(node->ir.terminator.cases.begin(), node->ir.terminator.cases.end(),
			          [](const Terminator::Case &a, const Terminator::Case &b)
			          { return a.node->forward_post_visit_order > b.node->forward_post_visit_order; });

			// Look at all potential fallthrough candidates and reassign global order.
			for (size_t i = 1, n = node->ir.terminator.cases.size(); i < n; i++)
			{
				for (size_t j = 0; j < i; j++)
				{
					auto &a = node->ir.terminator.cases[j];
					auto &b = node->ir.terminator.cases[i];

					// A case label might be the merge block candidate of the switch.
					// Don't consider case fallthrough if b post-dominates the entire switch statement.
					if (b.node != merge && a.node != b.node && b.node->can_backtrace_to(a.node))
						b.global_order = a.global_order + 1;
				}
			}

			// Sort again, but this time, by global order.
			std::stable_sort(node->ir.terminator.cases.begin(), node->ir.terminator.cases.end(),
			                 [](const Terminator::Case &a, const Terminator::Case &b)
			                 { return a.global_order < b.global_order; });
		}

		// We cannot rewrite the CFG in pass 1 safely, this should have happened in pass 0.
		if (pass == 0 && !node->dominates(merge))
		{
			// We did not rewrite switch blocks w.r.t. selection breaks.
			// We might be in a situation where the switch block is trying to merge to a block which is already being merged to.
			// Create a ladder which the switch block could merge to.
			auto *ladder = pool.create_node();
			ladder->name = merge->name + ".switch-merge";
			ladder->add_branch(merge);
			ladder->ir.terminator.type = Terminator::Type::Branch;
			ladder->ir.terminator.direct_block = merge;
			ladder->immediate_post_dominator = merge;
			ladder->immediate_dominator = merge->immediate_dominator;
			ladder->dominance_frontier.push_back(merge);
			ladder->forward_post_visit_order = merge->forward_post_visit_order;
			ladder->backward_post_visit_order = merge->backward_post_visit_order;
			node->traverse_dominated_blocks_and_rewrite_branch(merge, ladder);

			merge = find_common_post_dominator(node->succ);
			modified_cfg = true;
		}

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

		// A switch header might also be a loop header. Create a helper succ block for this case.
		if (pass == 0 && node->pred_back_edge)
		{
			node = create_helper_succ_block(node);
			modified_cfg = true;
		}
	}

	return modified_cfg;
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

		for (auto *header : node->headers)
		{
			// If we have a loop header already associated with this block, treat that as our idom.
			if (header->forward_post_visit_order > idom->forward_post_visit_order)
				idom = header;
		}

		if (pass == 0)
		{
			// Check that we're not merging ourselves into the aether.
			// This is a scenario that can happen if we attempt to merge to a block which terminates the CFG
			// (return or unreachable),
			// but does not post-dominate the idom candidate,
			// i.e. the selection construct needs to break to some other scope.
			// If this happens, we won't be able to register a typical breaking scenario
			// (since post-domination analysis won't help us),
			// and we need to do some magic fixups.

			auto *merge_candidate = CFGNode::find_common_post_dominator(idom, node);
			bool post_dominator_is_exit_node =
				merge_candidate && merge_candidate->immediate_post_dominator == merge_candidate;
			bool merged_into_terminating_path = post_dominator_is_exit_node && node->dominates_all_reachable_exits();

			// If our candidate idom post dominates the entry block, we consider this the main path of execution.
			if (merged_into_terminating_path && idom->post_dominates(entry_block))
				merged_into_terminating_path = false;

			if (merged_into_terminating_path)
			{
				// Similar to loops, find the break target for this construct.
				auto *break_target = find_break_target_for_selection_construct(idom, node);

				// Have not observed any scenario where we won't have a dominated break target we can use.
				if (break_target && idom->dominates(break_target) && break_target->headers.empty())
				{
					// Enclose this scope in a loop.
					auto *helper_pred = create_helper_pred_block(idom);
					helper_pred->merge = MergeType::Loop;
					helper_pred->loop_merge_block = break_target;
					helper_pred->freeze_structured_analysis = true;
					break_target->headers.push_back(helper_pred);
				}
			}
		}

		if (idom->merge == MergeType::None || idom->merge == MergeType::Selection)
		{
			// We just found a switch block which we have already handled.
			if (idom->ir.terminator.type == Terminator::Type::Switch)
				continue;

			// If the idom is already a selection construct, this must mean
			// we have some form of breaking construct inside this inner construct.
			// This fooled find_selection_merges() to think we had a selection merge target at the break target.
			// Fix this up here, where we rewrite the outer construct as a fixed loop instead.
			if (idom->merge == MergeType::Selection)
			{
				if (pass == 0)
				{
					assert(idom->selection_merge_block);

					// If we turn the outer selection construct into a loop,
					// we remove the possibility to break further out (without adding ladders like we do for loops).
					// To make this work, we must ensure that the new merge block post-dominates the loop and selection merge.
					auto *merge_candidate = CFGNode::find_common_post_dominator(idom->selection_merge_block, idom);

					if (!merge_candidate || merge_candidate == idom->selection_merge_block)
					{
						idom->loop_merge_block = idom->selection_merge_block;
					}
					else
					{
						// Make sure we split merge scopes. Pretend we have a true loop.
						idom->loop_ladder_block = idom->selection_merge_block;
						idom->loop_merge_block = merge_candidate;
					}

					idom->loop_merge_block->add_unique_header(idom);

					idom->merge = MergeType::Loop;
					idom->selection_merge_block = nullptr;
					idom->freeze_structured_analysis = true;
					idom = create_helper_succ_block(idom);
				}
				else
					LOGW("Mismatch headers in pass 1 ... ?\n");
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
				selection_idom->merge = MergeType::Selection;
				selection_idom->selection_merge_block = node;
				node->add_unique_header(selection_idom);
				//LOGI("Selection merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(selection_idom),
				//     selection_idom->name.c_str(), static_cast<const void *>(node), node->name.c_str());
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
	for (auto *header : node->headers)
		header->fixup_merge_info_after_branch_rewrite(node, pred_node);
	node->headers.clear();

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
	{
		if (node != old_pred)
		{
			// Don't override immediate dominator for entry block.
			if (node->immediate_dominator == old_pred)
				node->immediate_dominator = new_node;
		}
	}
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

CFGNode *CFGStructurizer::find_break_target_for_selection_construct(CFGNode *idom, CFGNode *merge)
{
	Vector<CFGNode *> new_visit_queue;
	UnorderedSet<CFGNode *> visited;
	Vector<CFGNode *> visit_queue;
	Vector<CFGNode *> candidates;

	visit_queue.push_back(idom);
	do
	{
		for (auto *n : visit_queue)
		{
			if (visited.count(n))
				continue;
			visited.insert(n);

			if (query_reachability(*n, *merge))
			{
				for (auto *succ : n->succ)
					new_visit_queue.push_back(succ);
			}
			else
				candidates.push_back(n);
		}

		visit_queue = new_visit_queue;
		new_visit_queue.clear();
	} while (!visit_queue.empty());

	if (candidates.empty())
		return nullptr;
	else
		return find_common_post_dominator(candidates);
}

CFGNode *CFGStructurizer::find_common_post_dominator_with_ignored_break(Vector<CFGNode *> candidates,
                                                                        const CFGNode *ignored_node)
{
	if (candidates.empty())
		return nullptr;

	Vector<CFGNode *> next_nodes;
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

		Vector<CFGNode *> direct_exits;
		Vector<CFGNode *> inner_direct_exits;
		Vector<CFGNode *> dominated_exit;
		Vector<CFGNode *> inner_dominated_exit;
		Vector<CFGNode *> non_dominated_exit;

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

		// If there are no direct exists, treat inner direct exists as direct exits.
		if (direct_exits.empty())
			direct_exits = std::move(inner_direct_exits);

		// A direct exit can be considered a dominated exit if there are no better candidates.
		if (dominated_exit.empty() && !direct_exits.empty())
			std::swap(dominated_exit, direct_exits);

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
			auto *merge_block = non_dominated_exit.front();

			// We can make the non-dominated exit dominated by
			// adding a ladder block in-between. This allows us to merge the loop cleanly
			// before breaking out.

			auto *ladder = pool.create_node();
			ladder->name = node->name + ".merge";
			ladder->add_branch(merge_block);
			ladder->ir.terminator.type = Terminator::Type::Branch;
			ladder->ir.terminator.direct_block = merge_block;
			ladder->immediate_post_dominator = merge_block;
			ladder->forward_post_visit_order = merge_block->forward_post_visit_order;
			ladder->backward_post_visit_order = merge_block->backward_post_visit_order;

			node->traverse_dominated_blocks_and_rewrite_branch(merge_block, ladder);
			node->loop_ladder_block = nullptr;
			node->loop_merge_block = ladder;
			ladder->recompute_immediate_dominator();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			//LOGI("Loop with ladder merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());
		}
		else
		{
			// We have multiple blocks which are merge candidates. We need to figure out where execution reconvenes.
			Vector<CFGNode *> merges;
			merges.reserve(inner_dominated_exit.size() + dominated_exit.size() + non_dominated_exit.size());
			merges.insert(merges.end(), inner_dominated_exit.begin(), inner_dominated_exit.end());
			merges.insert(merges.end(), dominated_exit.begin(), dominated_exit.end());
			merges.insert(merges.end(), non_dominated_exit.begin(), non_dominated_exit.end());
			CFGNode *merge = CFGStructurizer::find_common_post_dominator(merges);

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
				Vector<CFGNode *> non_breaking_exits;
				non_breaking_exits.reserve(dominated_exit.size());
				for (auto *exit : dominated_exit)
					if (!control_flow_is_escaping(exit, merge))
						non_breaking_exits.push_back(exit);

				dominated_merge = CFGStructurizer::find_common_post_dominator(non_breaking_exits);
			}
			else
			{
				dominated_merge = CFGStructurizer::find_common_post_dominator(dominated_exit);
			}

			if (!dominated_merge)
			{
				LOGW("There is no candidate for ladder merging.\n");
			}

			if (dominated_merge && !node->dominates(dominated_merge))
			{
				LOGW("We don't dominate the merge target ...\n");
				dominated_merge = nullptr;
			}

			if (!merge)
			{
				LOGW("Failed to find a common merge point ...\n");
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

CFGNode *CFGStructurizer::get_target_break_block_for_inner_header(const CFGNode *node, size_t header_index)
{
	CFGNode *target_header = nullptr;
	for (size_t j = header_index; j; j--)
	{
		if (node->headers[j - 1]->merge == MergeType::Loop)
		{
			// We might have two loops, each at equal scopes.
			// In order to break out to an outer loop, we must verify that the loops actually nest.
			// We must not introduce any backwards branches here.
			auto *candidate_header = node->headers[j - 1];
			CFGNode *candidate_merge = nullptr;
			if (candidate_header->loop_ladder_block)
				candidate_merge = candidate_header->loop_ladder_block;
			else if (candidate_header->loop_merge_block)
				candidate_merge = candidate_header->loop_merge_block;

			if (candidate_merge && !candidate_merge->dominates(node->headers[header_index]))
			{
				target_header = candidate_header;
				break;
			}
		}
	}

	return target_header;
}

CFGNode *CFGStructurizer::get_or_create_ladder_block(CFGNode *node, size_t header_index)
{
	auto *header = node->headers[header_index];
	auto *loop_ladder = header->loop_ladder_block;

	if (!loop_ladder)
	{
		// We don't have a ladder, because the loop merged to an outer scope, so we need to fake a ladder.
		// If we hit this case, we did not hit the simpler case in find_loops().
		auto *ladder = pool.create_node();
		ladder->name = node->name + ".merge";
		ladder->add_branch(node);
		ladder->ir.terminator.type = Terminator::Type::Branch;
		ladder->ir.terminator.direct_block = node;
		ladder->immediate_post_dominator = node;
		ladder->forward_post_visit_order = node->forward_post_visit_order;
		ladder->backward_post_visit_order = node->backward_post_visit_order;

		header->traverse_dominated_blocks_and_rewrite_branch(node, ladder);
		header->loop_ladder_block = ladder;
		ladder->recompute_immediate_dominator();

		// If this is the second outermost scope, we don't need to deal with ladders.
		// ladder is a dummy branch straight out to the outer merge point.
		if (header_index > 1)
			loop_ladder = header->loop_ladder_block;
	}

	return loop_ladder;
}

CFGNode *CFGStructurizer::build_enclosing_break_target_for_loop_ladder(CFGNode *&node, CFGNode *loop_ladder)
{
	// A loop ladder needs to break out somewhere. If we don't have a candidate
	// place to break out to, we will need to create one for the outer scope.
	// This is the purpose of the full_break_target fallback.

	bool ladder_to_merge_is_trivial = loop_ladder->succ.size() == 1 && loop_ladder->succ.front() == node;
	CFGNode *full_break_target = nullptr;

	// We have to break somewhere, turn the outer selection construct into
	// a loop.
	if (!ladder_to_merge_is_trivial)
	{
		// Selection merge to this dummy instead.
		auto *new_selection_merge = create_helper_pred_block(node);

		// This is now our fallback loop break target.
		full_break_target = node;

		auto *loop = create_helper_pred_block(new_selection_merge->headers[0]);

		// Reassign header node.
		assert(new_selection_merge->headers[0]->merge == MergeType::Selection);
		new_selection_merge->headers[0]->selection_merge_block = new_selection_merge;
		new_selection_merge->headers[0] = loop;

		loop->merge = MergeType::Loop;
		loop->loop_merge_block = node;
		loop->freeze_structured_analysis = true;

		// After the loop ladder, make sure we always branch to the break target.
		loop_ladder->traverse_dominated_blocks_and_rewrite_branch(new_selection_merge, node);

		node = new_selection_merge;
	}

	return full_break_target;
}

CFGNode *CFGStructurizer::build_ladder_block_for_escaping_edge_handling(CFGNode *node, CFGNode *header,
                                                                        CFGNode *loop_ladder,
                                                                        CFGNode *target_header,
                                                                        CFGNode *full_break_target,
                                                                        const UnorderedSet<const CFGNode *> &normal_preds)
{
	CFGNode *new_ladder_block = nullptr;

	if (target_header || full_break_target)
	{
		// If we have a ladder block, there exists a merge candidate which the loop header dominates.
		// We create a ladder block before the merge block, which becomes the true merge block.
		// In this ladder block, we can detect with Phi nodes whether the break was "clean",
		// or if we had an escape edge.
		// If we have an escape edge, we can break to outer level, and continue the ladder that way.
		// Otherwise we branch to the existing merge block and continue as normal.
		// We'll also need to rewrite a lot of Phi nodes this way as well.
		auto *ladder = create_helper_pred_block(loop_ladder);
		new_ladder_block = ladder;

		// Merge to ladder instead.
		header->traverse_dominated_blocks_and_rewrite_branch(node, ladder);

		ladder->ir.terminator.type = Terminator::Type::Condition;
		ladder->ir.terminator.conditional_id = module.allocate_id();
		ladder->ir.terminator.false_block = loop_ladder;

		PHI phi;
		phi.id = ladder->ir.terminator.conditional_id;
		phi.type_id = module.get_builder().makeBoolType();
		module.get_builder().addName(phi.id, (String("ladder_phi_") + loop_ladder->name).c_str());

		for (auto *pred : ladder->pred)
		{
			IncomingValue incoming = {};
			incoming.block = pred;
			bool is_breaking_pred = normal_preds.count(pred) == 0;
			incoming.id = module.get_builder().makeBoolConstant(is_breaking_pred);
			phi.incoming.push_back(incoming);
		}
		ladder->ir.phi.push_back(std::move(phi));

		// Ladder breaks out to outer scope.
		if (target_header && target_header->loop_ladder_block)
		{
			ladder->ir.terminator.true_block = target_header->loop_ladder_block;
			ladder->add_branch(target_header->loop_ladder_block);
		}
		else if (target_header && target_header->loop_merge_block)
		{
			ladder->ir.terminator.true_block = target_header->loop_merge_block;
			ladder->add_branch(target_header->loop_merge_block);
		}
		else if (full_break_target)
		{
			ladder->ir.terminator.true_block = full_break_target;
			ladder->add_branch(full_break_target);
		}
		else
			LOGW("No loop merge block?\n");

		// This can happen in some scenarios, fixup the branch to be a direct one instead.
		if (ladder->ir.terminator.true_block == ladder->ir.terminator.false_block)
		{
			ladder->ir.terminator.direct_block = ladder->ir.terminator.true_block;
			ladder->ir.terminator.type = Terminator::Type::Branch;
		}
	}
	else
	{
		// Here, loop_ladder -> final merge is a trivial, direct branch.

		if (loop_ladder->ir.operations.empty())
		{
			// Simplest common case.
			// If the loop ladder just branches to outer scope, and this block does not perform
			// any operations we can avoid messing around with ladder PHI variables and just execute the branch.
			// This block will likely become a frontier node when merging PHI instead.
			// This is a common case when breaking out of a simple for loop.
			header->traverse_dominated_blocks_and_rewrite_branch(node, loop_ladder);
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
			header->traverse_dominated_blocks_and_rewrite_branch(node, ladder_pre);
			new_ladder_block = ladder_pre;

			PHI phi;
			phi.id = ladder_pre->ir.terminator.conditional_id;
			phi.type_id = module.get_builder().makeBoolType();
			module.get_builder().addName(phi.id,
										 (String("ladder_phi_") + loop_ladder->name).c_str());
			for (auto *pred : ladder_pre->pred)
			{
				IncomingValue incoming = {};
				incoming.block = pred;
				bool is_breaking_pred = normal_preds.count(pred) == 0;
				incoming.id = module.get_builder().makeBoolConstant(is_breaking_pred);
				phi.incoming.push_back(incoming);
			}
			ladder_pre->ir.phi.push_back(std::move(phi));
		}
	}

	return new_ladder_block;
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

		//LOGI("Splitting merge blocks for %s\n", node->name.c_str());
		//for (auto *header : node->headers)
		//	LOGI("  Header: %s.\n", header->name.c_str());

		CFGNode *full_break_target = nullptr;

		// Before we start splitting and rewriting branches, we need to know which preds are considered "normal",
		// and which branches are considered ladder breaking branches (rewritten branches).
		// This will influence if a pred block gets false or true when emitting ladder breaking blocks later.
		Vector<UnorderedSet<const CFGNode *>> normal_preds(node->headers.size());
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
			CFGNode *target_header = get_target_break_block_for_inner_header(node, i);

			if (node->headers[i]->merge == MergeType::Loop)
			{
				auto *loop_ladder = get_or_create_ladder_block(node, i);

				// The loop ladder needs to break to somewhere.
				// Either this is an outer loop scope, or we need to create a fake loop we can break out of if
				// the break is non-trivial.
				if (loop_ladder && !target_header && !full_break_target)
					full_break_target = build_enclosing_break_target_for_loop_ladder(node, loop_ladder);

				CFGNode *new_ladder_block = nullptr;
				if (loop_ladder)
				{
					new_ladder_block = build_ladder_block_for_escaping_edge_handling(
						node, node->headers[i], loop_ladder,
						target_header, full_break_target,
						normal_preds[i]);
				}

				// We won't analyze this again, so make sure header knows
				// about the new merge block.
				if (node->headers[i]->freeze_structured_analysis)
				{
					if (new_ladder_block)
						node->headers[i]->loop_ladder_block = new_ladder_block;
					node->headers[i]->loop_merge_block = node->headers[i]->loop_ladder_block;
					node->headers[i]->loop_ladder_block = nullptr;
				}
			}
			else if (node->headers[i]->merge == MergeType::Selection)
			{
				if (target_header)
				{
					// Breaks out to outer available scope.
					CFGNode *rewrite_to = nullptr;
					if (target_header->loop_ladder_block)
						rewrite_to = target_header->loop_ladder_block;
					else if (target_header->loop_merge_block)
						rewrite_to = target_header->loop_merge_block;

					if (rewrite_to)
						node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, rewrite_to);
					else
						LOGW("No loop merge block?\n");
				}
				else if (full_break_target)
				{
					node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, full_break_target);
				}
				else
				{
					// The outer scope *must* now become a loop, no matter what.
					// We cannot rely on a traversal to rewrite breaking constructs in the entire loop,
					// so "everything" must essentially become a break instead.
					full_break_target = node;
					assert(node->headers[0]->merge == MergeType::Selection);
					node->headers[0]->merge = MergeType::Loop;
					node->headers[0]->freeze_structured_analysis = true;

					assert(node->headers[0]->selection_merge_block == node);
					node->headers[0]->loop_merge_block = node->headers[0]->selection_merge_block;
					node->headers[0]->selection_merge_block = nullptr;
				}
			}
			else
				LOGE("Invalid merge type.\n");
		}
	}
}

void CFGStructurizer::structurize(unsigned pass)
{
	if (find_switch_blocks(pass))
	{
		recompute_cfg();
		if (find_switch_blocks(pass))
		{
			LOGE("Fatal, detected infinite loop.\n");
			abort();
		}
	}

	find_loops();
	find_selection_merges(pass);
	fixup_broken_selection_merges(pass);
	if (pass == 0)
		split_merge_blocks();
}

bool CFGStructurizer::exists_path_in_cfg_without_intermediate_node(const CFGNode *start_block,
                                                                   const CFGNode *end_block,
                                                                   const CFGNode *stop_block) const
{
	if (query_reachability(*start_block, *end_block) &&
	    query_reachability(*start_block, *stop_block) &&
	    query_reachability(*stop_block, *end_block))
	{
		auto *frontier = get_post_dominance_frontier_with_cfg_subset_that_reaches(stop_block, end_block, start_block);
		// We already know start_block reaches the frontier.
		return frontier != nullptr;
	}
	else
	{
		bool ret = query_reachability(*start_block, *end_block);
		return ret;
	}
}

CFGNode *CFGStructurizer::get_post_dominance_frontier_with_cfg_subset_that_reaches(const CFGNode *node,
                                                                                   const CFGNode *must_reach,
                                                                                   const CFGNode *must_reach_frontier) const
{
	UnorderedSet<const CFGNode *> promoted_post_dominators;
	promoted_post_dominators.insert(node);
	auto frontiers = node->post_dominance_frontier;

	assert(query_reachability(*node, *must_reach));

	if (frontiers.empty())
		return nullptr;

	while (!frontiers.empty())
	{
		// We might not be interested in post-domination-frontiers that we cannot reach.
		// Filter our search based on this.
		if (must_reach_frontier)
		{
			auto itr = std::remove_if(frontiers.begin(), frontiers.end(), [&](CFGNode *candidate) {
			    return !query_reachability(*must_reach_frontier, *candidate);
			});
			frontiers.erase(itr, frontiers.end());
		}

		if (frontiers.size() > 1)
		{
			std::sort(frontiers.begin(), frontiers.end(), [](const CFGNode *a, const CFGNode *b) {
				return a->backward_post_visit_order < b->backward_post_visit_order;
			});
			frontiers.erase(std::unique(frontiers.begin(), frontiers.end()), frontiers.end());
		}
		else if (frontiers.empty())
			break;

		auto &frontier = frontiers.back();

		// For a frontier to be discounted, we look at all successors and check
		// if there no node in promoted_post_dominators that post-dominate the successor, that path cannot reach must_reach.
		// If a post dominance frontier satisfies this rule, it is promoted to be considered an alias of node.

		bool all_succs_must_go_via_node = true;
		for (auto *succ : frontier->succ)
		{
			bool promote = true;
			if (query_reachability(*succ, *must_reach))
			{
				promote = false;
				for (auto *pdom : promoted_post_dominators)
				{
					if (pdom->post_dominates(succ))
					{
						promote = true;
						break;
					}
				}
			}

			if (!promote)
			{
				all_succs_must_go_via_node = false;
				break;
			}
		}

		if (!all_succs_must_go_via_node)
		{
			return frontier;
		}
		else
		{
			promoted_post_dominators.insert(frontier);
			frontiers.pop_back();
			for (auto *pdoms : frontier->post_dominance_frontier)
				frontiers.push_back(pdoms);
		}
	}

	return frontiers.empty() ? nullptr : frontiers.front();
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
		if (succ->immediate_dominator != node &&
		    std::find(node->dominance_frontier.begin(),
		              node->dominance_frontier.end(),
		              succ) == node->dominance_frontier.end())
		{
			node->dominance_frontier.push_back(succ);
		}

		if (auto *idom = node->immediate_dominator)
		{
			for (auto *frontier_node : node->dominance_frontier)
			{
				if (!idom->dominates(frontier_node) &&
				    std::find(idom->dominance_frontier.begin(),
				              idom->dominance_frontier.end(),
				              frontier_node) == idom->dominance_frontier.end())
				{
					idom->dominance_frontier.push_back(frontier_node);
				}
			}
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