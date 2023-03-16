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
			{
				if (c.is_default)
					LOGI("    Default -> %s\n", c.node->name.c_str());
				else
					LOGI("    Case %u -> %s\n", c.value, c.node->name.c_str());
			}
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
		if (!ladder_chain_has_phi_dependencies(succ, node))
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

static void scrub_rov_begin_lock(CFGNode *node, bool preserve_first_begin)
{
	auto begin_itr = node->ir.operations.begin();
	if (preserve_first_begin)
	{
		begin_itr = std::find_if(node->ir.operations.begin(), node->ir.operations.end(),
		                         [](const Operation *op) { return op->op == spv::OpBeginInvocationInterlockEXT; });
		assert(begin_itr != node->ir.operations.end());
		++begin_itr;
	}

	auto itr = std::remove_if(begin_itr, node->ir.operations.end(),
	                          [](const Operation *op) { return op->op == spv::OpBeginInvocationInterlockEXT; });
	node->ir.operations.erase(itr, node->ir.operations.end());
}

static void scrub_rov_end_lock(CFGNode *node, bool preserve_last_end)
{
	auto end_itr = node->ir.operations.end();

	if (preserve_last_end)
	{
		for (size_t i = node->ir.operations.size(); i; i--)
		{
			size_t index = i - 1;
			auto &op = node->ir.operations[index];
			if (op->op == spv::OpEndInvocationInterlockEXT)
			{
				end_itr = node->ir.operations.begin() + index;
				break;
			}
		}
	}

	auto itr = std::remove_if(node->ir.operations.begin(), end_itr,
	                          [](const Operation *op) { return op->op == spv::OpEndInvocationInterlockEXT; });
	node->ir.operations.erase(itr, end_itr);
}

static void scrub_rov_lock_regions(CFGNode *node, bool preserve_first_begin, bool preserve_last_end)
{
	scrub_rov_begin_lock(node, preserve_first_begin);
	scrub_rov_end_lock(node, preserve_last_end);
}

bool CFGStructurizer::rewrite_rov_lock_region()
{
	recompute_cfg();

	// First, find all BBs that use ROV.
	Vector<CFGNode *> rov_blocks;

	for (auto *node : forward_post_visit_order)
	{
		for (auto &op : node->ir.operations)
		{
			if (op->op == spv::OpBeginInvocationInterlockEXT)
			{
				rov_blocks.push_back(node);
				break;
			}
		}
	}

	// If we declare ROVs but never actually use them ... *shrug*
	if (rov_blocks.empty())
		return true;

	// Rules: OpBegin and OpEnd must be dynamically called exactly once.
	// To simplify, we want to only emit one begin and one end that covers the entire shader.
	// Usually ROV access is constrained to a single BB as a simple case.
	// Simple BB case fails with control flow. E.g. a loop or conditional. In this case we must widen the range
	// of the lock such that: end post-dominates begin. Begin post-dominates entry.
	// If we cannot make this work, flag as non-trivial and wrap the entire shader in a big lock.

	auto *idom = rov_blocks.front();
	for (size_t i = 1; i < rov_blocks.size() && idom; i++)
		idom = CFGNode::find_common_dominator(idom, rov_blocks[i]);

	// Stretch scope as long as we don't post-dominate entry.
	while (idom && idom != entry_block && !idom->post_dominates(entry_block))
		idom = idom->immediate_dominator;

	// If the lock region has multiple instances, i.e. a loop, give up right away.
	if (idom && get_innermost_loop_header_for(entry_block, idom) != entry_block)
	{
		for (auto *node : rov_blocks)
			scrub_rov_lock_regions(node, false, false);
		return false;
	}

	auto *pdom = find_common_post_dominator(rov_blocks);

	// Stretch post-dominator if we need to.
	if (pdom)
		pdom = CFGNode::find_common_post_dominator(pdom, idom);

	bool internal_early_return = pdom && pdom->immediate_post_dominator == pdom;

	// Non trivial case.
	if (!idom || !pdom || internal_early_return)
	{
		for (auto *node : rov_blocks)
			scrub_rov_lock_regions(node, false, false);
		return false;
	}

	bool begin_block_has_lock = std::find(rov_blocks.begin(), rov_blocks.end(), idom) != rov_blocks.end();
	bool end_block_has_lock = std::find(rov_blocks.begin(), rov_blocks.end(), pdom) != rov_blocks.end();

	for (auto *node : rov_blocks)
		scrub_rov_lock_regions(node, node == idom, node == pdom);

	if (!begin_block_has_lock)
		idom->ir.operations.push_back(module.allocate_op(spv::OpBeginInvocationInterlockEXT));

	if (!end_block_has_lock)
		pdom->ir.operations.insert(pdom->ir.operations.begin(), module.allocate_op(spv::OpEndInvocationInterlockEXT));

	return true;
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

	while (serialize_interleaved_merge_scopes())
	{
		auto graphviz_split = graphviz_path + ".serialize";
		log_cfg_graphviz(graphviz_split.c_str());
	}

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

	// Similar to cleanup_breaking_phi_constructs() in spirit,
	// but here we are forced to duplicate code blocks to make it work.
	duplicate_impossible_merge_constructs();

	//log_cfg("Split impossible merges");
	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".duplicate";
		log_cfg_graphviz(graphviz_split.c_str());
	}

	while (rewrite_transposed_loops())
	{
		auto graphviz_split = graphviz_path + ".transpose-loop-rewrite";
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

	if (!graphviz_path.empty())
	{
		auto graphviz_final = graphviz_path + ".struct1";
		log_cfg_graphviz(graphviz_final.c_str());
	}

	bool need_restructure = false;
	while (rewrite_invalid_loop_breaks())
	{
		if (!graphviz_path.empty())
		{
			auto graphviz_final = graphviz_path + ".loop-break-rewrite";
			log_cfg_graphviz(graphviz_final.c_str());
		}

		need_restructure = true;
	}

	if (need_restructure)
	{
		// Need to redo the final structurization pass if we end up here.
		structurize(1);
	}

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

static bool block_is_control_dependent(const CFGNode *node)
{
	for (auto *op : node->ir.operations)
		if (SPIRVModule::opcode_is_control_dependent(op->op))
			return true;
	return false;
}

bool CFGStructurizer::continue_block_can_merge(CFGNode *node) const
{
	const CFGNode *pred_candidate = nullptr;
	auto *header = node->succ_back_edge;

	// This algorithm is very arbitrary and should be seen as a nasty heuristic which solves real shaders
	// we see in the wild. It's probably safe to block continue merge in far more cases than this, but we
	// want to be maximally convergent as often as we can.

	for (auto *pred : node->pred)
	{
		// If we have a situation where a continue block has a pred which is itself a selection merge target, that
		// block is the merge target where we follow maximum convergence.
		// The candidate must be inside loop body and not the header itself.
		// Neither continue block nor merge target have any dominance relationship.

		if (pred->num_forward_preds() >= 2 && pred->succ.size() >= 2 &&
		    header != pred && !pred->dominates(node) &&
		    !node->post_dominates(pred))
		{
			// If execution does not merge up right at the natural break block,
			// things will get very complicated.
			// In practice, we can handle merges as long as the candidate just breaks out normally.
			// If not, we have to introduce ladder breaking and this is (almost) impossible to get right.
			auto *common_post_dominator = CFGNode::find_common_post_dominator(node, pred);
			if (common_post_dominator &&
			    std::find(node->succ.begin(), node->succ.end(), common_post_dominator) == node->succ.end())
			{
				pred_candidate = pred;
				break;
			}
		}
	}

	// No obviously nasty case to handle, probably safe to let the algorithm do its thing ...
	if (!pred_candidate)
		return true;

	// Need to find another escape edge which is neither header nor the candidate.
	bool found_another_escape_edge = false;
	for (auto *pred : node->pred)
	{
		if (pred != header && pred != pred_candidate && !pred->dominates(node))
		{
			found_another_escape_edge = true;
			break;
		}
	}

	// If we have yet another escape edge, we probably cannot merge to continue ...
	return !found_another_escape_edge;
}

void CFGStructurizer::create_continue_block_ladders()
{
	// It does not seem to be legal to merge directly to continue blocks.
	// To make it possible to merge execution, we need to create a ladder block which we can merge to.
	// There are certain scenarios where it is impossible to merge to a continue block.
	// In this case, we will abandom maximum convergence and use the continue block as a "break"-like target.
	bool need_recompute_cfg = false;
	for (auto *node : forward_post_visit_order)
	{
		if (block_is_plain_continue(node) && continue_block_can_merge(node))
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

static spv::Id get_remapped_id_for_duplicated_block(spv::Id id, const UnorderedMap<spv::Id, spv::Id> &remap)
{
	auto itr = remap.find(id);
	if (itr != remap.end())
		return itr->second;
	else
		return id;
}

Operation *CFGStructurizer::duplicate_op(Operation *op, UnorderedMap<spv::Id, spv::Id> &id_remap)
{
	Operation *duplicated_op;
	if (op->id)
		duplicated_op = module.allocate_op(op->op, module.allocate_id(), op->type_id);
	else
		duplicated_op = module.allocate_op(op->op);

	for (unsigned i = 0; i < op->num_arguments; i++)
	{
		if (op->literal_mask & (1u << i))
			duplicated_op->add_literal(op->arguments[i]);
		else
			duplicated_op->add_id(get_remapped_id_for_duplicated_block(op->arguments[i], id_remap));
	}

	if (op->id)
		id_remap[op->id] = duplicated_op->id;

	return duplicated_op;
}

bool CFGStructurizer::can_duplicate_phis(const CFGNode *node)
{
	// If we want to duplicate nodes, we cannot do so in complicated scenarios where
	// we need to resolve PHIs. For example, if a node is split, the split nodes might have to
	// insert PHI nodes covering the subset of nodes which can reach each split.
	// This get very hairy, very quickly.
	// To check this, ensure that the node we want to split does not require any complex PHI handling.

	// First, validate that we can even find incoming values properly.
	for (auto *pred : node->pred)
	{
		for (auto &phi : node->ir.phi)
		{
			auto itr = find_incoming_value(pred, phi.incoming);
			if (itr == phi.incoming.end())
				return false;
		}
	}

	// Then, make sure that every incoming value dominates at least pred of node.
	// This way, we know that we don't need complicated PHI frontier merges along the way.
	for (auto &phi : node->ir.phi)
	{
		for (auto &incoming : phi.incoming)
		{
			bool dominates_at_least_one_pred = false;
			for (auto *pred : node->pred)
			{
				if (incoming.block->dominates(pred))
				{
					dominates_at_least_one_pred = true;
					break;
				}
			}

			if (!dominates_at_least_one_pred)
				return false;
		}
	}

	return true;
}

void CFGStructurizer::duplicate_node(CFGNode *node)
{
	Vector<UnorderedMap<spv::Id, spv::Id>> rewritten_ids;
	assert(node->succ.size() == 1);
	assert(node->pred.size() >= 2);
	assert(!node->dominates(node->succ.front()));

	Vector<CFGNode *> break_blocks(node->pred.size());
	rewritten_ids.resize(node->pred.size());
	auto *succ = node->succ.front();

	auto tmp_pred = node->pred;
	for (size_t i = 0, n = tmp_pred.size(); i < n; i++)
	{
		auto *pred = tmp_pred[i];
		auto &remap = rewritten_ids[i];

		// First, rewrite PHI inputs.
		// Since we only have one pred now, we can resolve PHIs directly.
		auto *block = pool.create_node();
		block->name = node->name + ".dup." + pred->name;
		block->ir.terminator.type = Terminator::Type::Branch;
		block->ir.terminator.direct_block = succ;
		block->immediate_post_dominator = succ;
		block->immediate_dominator = pred;
		pred->retarget_branch(node, block);
		block->add_branch(succ);

		for (auto &phi : node->ir.phi)
		{
			auto itr = find_incoming_value(pred, phi.incoming);
			assert(itr != phi.incoming.end());
			remap[phi.id] = itr->id;
		}

		for (auto *op : node->ir.operations)
			block->ir.operations.push_back(duplicate_op(op, remap));

		break_blocks[i] = block;
	}

	assert(node->pred.empty());

	// Finally, look at succ. If it takes PHI inputs from node, we'll have to rewrite the PHIs.
	// We know that node does not dominate succ,
	// so succ cannot use any SSA variables node generated directly
	// without using PHI nodes.

	// We might have placed ladders in between so that we need to fixup PHI later than just plain succ.
	// Chase down the chain and replace all PHIs.

	while (succ)
	{
		bool done = false;
		for (auto &phi : succ->ir.phi)
		{
			// Find incoming ID from the block we're splitting up.
			auto incoming_itr = std::find_if(phi.incoming.begin(), phi.incoming.end(), [&](const IncomingValue &incoming) {
				return incoming.block == node;
			});

			if (incoming_itr != phi.incoming.end())
			{
				spv::Id incoming_from_node = incoming_itr->id;
				phi.incoming.erase(incoming_itr);

				for (size_t i = 0, n = tmp_pred.size(); i < n; i++)
				{
					auto &remap = rewritten_ids[i];
					phi.incoming.push_back({ break_blocks[i], get_remapped_id_for_duplicated_block(incoming_from_node, remap) });
				}

				// We've found the block we wanted to rewrite, terminate loop now.
				done = true;
			}
		}

		if (!done && succ->succ.size() == 1)
			succ = succ->succ.front();
		else
			succ = nullptr;
	}
}

void CFGStructurizer::duplicate_impossible_merge_constructs()
{
	Vector<CFGNode *> duplicate_queue;

	for (size_t i = forward_post_visit_order.size(); i; i--)
	{
		auto *node = forward_post_visit_order[i - 1];

		// Check for breaking merge blocks which were not considered degenerate.
		// This can happen if we actually have code in the breaking construct ... (scary!)
		// We'll have to split this block somehow.
		// If the candidate has control dependent effects like barriers and such,
		// this will likely break completely,
		// but I don't see how that would work on native drivers either ...

		// WARNING: This check is EXTREMELY sensitive and microscopic changes to the implementation
		// will dramatically affect codegen.
		bool breaking = merge_candidate_is_on_breaking_path(node);

		if (breaking && !node->ir.operations.empty() && !block_is_control_dependent(node))
			duplicate_queue.push_back(node);
	}

	if (duplicate_queue.empty())
		return;

	for (auto *node : duplicate_queue)
	{
		if (!can_duplicate_phis(node))
		{
			// A block could be subtly load bearing, in that if we split the node, it becomes impossible to resolve
			// PHIs and we hit assertions in duplicate_node().
			// This means the block is probably load bearing after all, and we should not split it.
			// Normally, we only want to break up blocks which have fairly trivial PHI resolves.
			LOGW("Was asked to duplicate node %s, but cannot split phis without crashing ...\n", node->name.c_str());
			continue;
		}

		duplicate_node(node);
	}
	recompute_cfg();
}

bool CFGStructurizer::ladder_chain_has_phi_dependencies(const CFGNode *succ, const CFGNode *node)
{
	while (succ)
	{
		for (auto &phi : succ->ir.phi)
			for (auto &incoming : phi.incoming)
				if (incoming.block == node)
					return true;

		if (succ->succ.size() == 1)
			succ = succ->succ.front();
		else
			succ = nullptr;
	}

	return false;
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
		    !ladder_chain_has_phi_dependencies(node->succ.front(), node))
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

			auto *succ = node->succ.front();

			if (node->pred.size() == 1 && node->post_dominates(node->pred.front()))
			{
				// Trivial case.
				did_work = true;
				auto *pred = node->pred.front();
				pred->retarget_branch(node, succ);
			}
			else if (merge_candidate_is_on_breaking_path(node))
			{
				// If we have two or more preds, we have to be really careful.
				// If this node is on a breaking path, without being important for merging control flow,
				// it is fine to eliminate the block.
				did_work = true;
				auto tmp_pred = node->pred;
				for (auto *pred : tmp_pred)
					pred->retarget_branch(node, node->succ.front());

				// Iteratively, we need to recompute the dominance frontier for all preds.
				// When we eliminate nodes like this, we might cause the pred blocks to become degenerate in
				// future iterations in this loop.
				std::sort(tmp_pred.begin(), tmp_pred.end(), [](const CFGNode *a, const CFGNode *b) {
					return a->forward_post_visit_order < b->forward_post_visit_order;
				});

				// Need to compute dominance frontiers from inside out.
				for (auto *pred : tmp_pred)
				{
					pred->dominance_frontier.clear();
					recompute_dominance_frontier(pred);
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

		// If we inserted dummy branches from back-edge to rewrite infinite loops, we must prune these branches
		// now, so we don't end up creating a wrong amount of PHI incoming values.
		// We don't have to recompute the CFG since we don't really care about post-visit orders at this stage.
		if (node->pred_back_edge && node->pred_back_edge->ir.terminator.type == Terminator::Type::Branch &&
		    node->pred_back_edge->succ_back_edge == node->pred_back_edge->ir.terminator.direct_block &&
		    node->pred_back_edge->succ.size() == 1)
		{
			auto *back_edge = node->pred_back_edge;
			auto *succ = back_edge->succ.front();
			back_edge->succ.clear();
			auto itr = std::find(succ->pred.begin(), succ->pred.end(), back_edge);
			assert(itr != succ->pred.end());
			succ->pred.erase(itr);
		}
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

static IncomingValue *phi_incoming_blocks_find_block(Vector<IncomingValue> &incomings, const CFGNode *block)
{
	for (auto &incoming : incomings)
		if (incoming.block == block)
			return &incoming;
	return nullptr;
}

static bool id_is_generated_by_block(const CFGNode *block, spv::Id id)
{
	for (const auto *op : block->ir.operations)
		if (op->id == id)
			return true;

	for (const auto &phi : block->ir.phi)
		if (phi.id == id)
			return true;

	return false;
}

static void retarget_phi_incoming_block(PHI &phi, CFGNode *from, CFGNode *to)
{
	auto *value = phi_incoming_blocks_find_block(phi.incoming, from);
	if (value)
		value->block = to;
}

void CFGStructurizer::fixup_phi(PHINode &node)
{
	// We want to move any incoming block to where the ID was created.
	// This avoids some problematic cases of crossing edges when using ladders.
	auto &incomings = node.block->ir.phi[node.phi_index].incoming;

	for (auto &incoming : incomings)
	{
		auto itr = value_id_to_block.find(incoming.id);
		if (itr == end(value_id_to_block))
		{
			// This is a global.
			continue;
		}

		auto *source_block = itr->second;

		// Only hoist PHI inputs if there used to be a dominance relationship in the original CFG,
		// but there no longer is.
		if (!source_block->dominates(incoming.block))
		{
			if (phi_incoming_blocks_find_block(incomings, source_block) != nullptr)
			{
				// Sanity check. This would create ambiguity.
				continue;
			}

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
		// Avoid checking the edge case where frontier candidate == incoming block.
		// Removing an input only to place a new frontier there is nonsensical.
		if (frontier != incoming_block && !exists_path_in_cfg_without_intermediate_node(incoming_block, end_node, frontier))
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
		frontier_phi.relaxed = phi.relaxed;
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

			// This is fundamentally ambiguous and should never happen.
			if (incoming_block == frontier)
				LOGE("Invalid PHI collapse detected!\n");
			assert(incoming_block != frontier);

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
			merge_phi.relaxed = phi.relaxed;

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
				op->add_id(merge_phi.id);
				op->add_id(dominated_incoming->id);
				op->add_id(frontier_phi.id);
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
		node.split_merge_block_candidate = nullptr;
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

				// If we have an infinite loop, the continue block will not be reachable with backwards traversal.
				// Also, the only way to exit the loop construct could be through a single return block.
				// In this case, the return block should be moved and considered to be the merge block.
				// We add true branches from the continue block to return block instead of fake branches.

				// Ensure stable codegen order.
				Vector<CFGNode *> exits;
				exits.reserve(merge_tracer.loop_exits.size());
				for (auto *exit_node : merge_tracer.loop_exits)
					exits.push_back(exit_node);
				std::sort(exits.begin(), exits.end(), [](const CFGNode *a, const CFGNode *b) {
					return a->forward_post_visit_order > b->forward_post_visit_order;
				});

				bool transpose_loop_exit = false;
				if (exits.size() == 1)
				{
					auto *exit_node = exits.front();
					// If this is true, we never really leave the loop, which is problematic.
					transpose_loop_exit = exit_node->dominates_all_reachable_exits();

					// Only transpose if we're the innermost header, otherwise, inner loops which try to branch
					// to the return will be considered a multi-break which is very awkward.
					if (transpose_loop_exit)
					{
						auto *innermost_header = get_innermost_loop_header_for(node, exit_node);
						transpose_loop_exit = innermost_header == node;
					}
				}

				if (transpose_loop_exit)
				{
					for (auto *f : exits)
						node->pred_back_edge->add_branch(f);
				}
				else
				{
					// Only consider exits that are themselves backwards reachable.
					// Otherwise, we'll be adding fake succs that resolve to outer infinite loops again.
					for (auto *f : exits)
						if (f->backward_visited)
							node->pred_back_edge->add_fake_branch(f);
				}
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

bool CFGStructurizer::control_flow_is_escaping_from_loop(const CFGNode *node, const CFGNode *merge) const
{
	bool escaping_path = false;

	if (node == merge)
		return escaping_path;

	assert(merge->post_dominates(node));

	// First, test the loop scenario.
	// If we're inside a loop, we're a break construct if we can prove that:
	// - node has a loop header which dominates it.
	// - node cannot reach the continue block.
	// - Continue block cannot reach node.
	// - All post-domination frontiers can reach the continue block, meaning that at some point control flow
	//   decided to break out of the loop construct.
	auto *innermost_loop_header = get_innermost_loop_header_for(node);
	if (innermost_loop_header && innermost_loop_header->pred_back_edge)
	{
		bool dominates_merge = node->dominates(merge);
		bool can_reach_continue = query_reachability(*node, *innermost_loop_header->pred_back_edge);
		bool continue_can_reach = query_reachability(*innermost_loop_header->pred_back_edge, *node);
		bool pdf_can_reach_continue = true;

		for (auto *frontier : node->post_dominance_frontier)
		{
			bool header_dominates_frontier = innermost_loop_header->dominates(frontier);
			bool frontier_is_inside_loop_construct =
				query_reachability(*frontier, *innermost_loop_header->pred_back_edge);
			if (!header_dominates_frontier || !frontier_is_inside_loop_construct)
			{
				pdf_can_reach_continue = false;
				break;
			}
		}

		if (!dominates_merge && !continue_can_reach && !can_reach_continue && pdf_can_reach_continue)
			escaping_path = true;
	}

	return escaping_path;
}

bool CFGStructurizer::control_flow_is_escaping(const CFGNode *node, const CFGNode *merge) const
{
	if (node == merge)
		return false;

	if (control_flow_is_escaping_from_loop(node, merge))
		return true;

	// Try to test if our block is load bearing, in which case it cannot be considered a break block.
	// If the only path from idom to merge goes through node, it must be considered load bearing,
	// since removing break paths must not change reachability.
	if (block_is_load_bearing(node, merge))
		return false;

	// If we cannot prove the escape through loop analysis, we might be able to deduce it from domination frontiers.
	// If control flow is not escaping, then there must exist a dominance frontier node A,
	// where merge strictly post-dominates A.
	// This means that control flow can merge somewhere before we hit the merge block, and we consider that
	// normal structured control flow.

	bool escaping_path = !node->reaches_domination_frontier_before_merge(merge);

	// This is a strong check.
	// If node directly branches to merge, but PDF does not,
	// we have detected a control flow pattern which is clearly a break.
	// The PDF candidate must dominate node for this check to be meaningful.
	if (escaping_path)
	{
		for (auto *frontier : node->post_dominance_frontier)
			if (frontier->dominates(node) && frontier->reaches_domination_frontier_before_merge(merge))
				return true;

		// Strong check as well.
		// If branching directly to continue block like this, this is a non-merging continue,
		// which we should always consider an escape.
		if (node->succ_back_edge)
			return true;
	}

	if (escaping_path && node->ir.operations.empty() && node->ir.phi.empty())
	{
		// If we post-dominate nothing useful or do nothing useful ourselves,
		// this is a good indication we're a common escape edge ladder block.
		// This can happen if we have a graph of:
		// A -> B
		// A -> C
		// B -> merge
		// C -> merge
		// B -> node
		// C -> node
		// node -> merge
		// This super jank diamond pattern will break the heuristics.
		if (!node->post_dominates_any_work())
			return true;
	}

	if (escaping_path && node->pred.size() >= 2)
	{
		// We also need to consider false positives here, which are mostly only relevant for merge candidates.

		// One case would be selection construct A, which terminates in block B. B then branches to C.
		// Earlier in the A -> B construct, there might be a break block D which also branches to B.
		// This means that C will be a "false" domination frontier of B and our analysis above is wrong.

		// The algorithm here:
		// - Get idom of node, which represents the header. For this analysis, we're only interested
		//   in code paths which are dominated by idom.
		// - Find all preds of merge which are dominated by idom(node).
		// - Backtrace every pred P until they can reach B, or B can reach P.
		// - If B has strictly lowest post-visit order, we are not escaping. P was.

		auto *idom = node->immediate_dominator;
		bool found_false_positive = false;

		for (auto *pred : merge->pred)
		{
			// Don't care about these.
			if (!idom->dominates(pred))
				continue;

			while (pred != node && !query_reachability(*pred, *node) && !query_reachability(*node, *pred))
				pred = pred->immediate_dominator;

			// Ignore these.
			if (pred == node)
				continue;

			if (query_reachability(*pred, *node))
			{
				// Seems good. Keep going. If we don't find a counter example, we'll accept this as a false positive.
				found_false_positive = true;
			}
			else
			{
				// Indeed, this is an escape.
				found_false_positive = false;
				break;
			}
		}

		escaping_path = !found_false_positive;
	}

	return escaping_path;
}

bool CFGStructurizer::block_is_plain_continue(const CFGNode *node)
{
	return node->succ_back_edge != nullptr && node != node->succ_back_edge;
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

		// Continue blocks should also be considered to have a header already. Makes sure we don't merge to them.
		bool merge_a_has_header = !node->succ[0]->headers.empty() || block_is_plain_continue(node->succ[0]);
		bool merge_b_has_header = !node->succ[1]->headers.empty() || block_is_plain_continue(node->succ[1]);

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
				bool merges_to_continue = block_is_plain_continue(merge);

				// Here we have a likely case where one block is doing a clean "break" out of a loop, and
				// the other path continues as normal, and then conditionally breaks in a continue block or something similar.
				bool ambiguous_merge_case = !merges_to_continue && dominates_merge && !merge->headers.empty();

				// Happens first iteration. We'll have to split blocks, so register a merge target where we want it.
				// Otherwise, this is the easy case if we observe it in pass 1.
				// This shouldn't really happen though, as we'd normally resolve this earlier in find_selection_merges.
				bool mark_merge_block_case = !merges_to_continue && (merge->headers.empty() || pass == 0);

				// Another scenario is that we don't dominate the merge block in pass 1. We cannot split blocks now.
				// Check to see which paths can actually reach the merge target without going through a ladder block.
				// If we don't go through ladder it means an outer scope will actually reach the merge node.
				// If we reach a ladder it means a block we dominate will make the escape.

				// If we're in pass 1 and we still don't dominate our merge target, consider it ambiguous.
				if (pass == 1 && !dominates_merge)
					ambiguous_merge_case = true;

				// Another case is when one path is "breaking" out to a continue block which we don't dominate.
				// We should not attempt to do ladder breaking here in pass 0 since it's unnecessary.
				bool tie_break_merge = ambiguous_merge_case || !mark_merge_block_case;

				if (tie_break_merge)
				{
					bool a_path_is_break = control_flow_is_escaping(node->succ[0], merge);
					bool b_path_is_break = control_flow_is_escaping(node->succ[1], merge);

					if (a_path_is_break && b_path_is_break)
					{
						// Both paths break, so we don't need to merge anything. Use Unreachable merge target.
						node->merge = MergeType::Selection;
						node->selection_merge_block = nullptr;
						//LOGI("Merging %s -> Unreachable\n", node->name.c_str());
					}
					else if (b_path_is_break)
						merge_to_succ(node, 0);
					else if (a_path_is_break)
						merge_to_succ(node, 1);
					else
					{
						// Need more interesting tie-breaking.
						// We can deduce which path is breaking or not based on the dominance frontier.
						// If a dominance frontier for A can reach B, then we assume that B is breaking further than A
						// is, so we should merge to A.
						// The breaking path for B will likely need to ensure that the selection header can
						// support such a break.
						// If we hit this path, the common post-dominator will not find the intended merge
						// target for B, so we never get to perform the necessary fixup.
						auto *a_front = node->succ[0]->dominance_frontier.size() == 1 ?
						                node->succ[0]->dominance_frontier.front() : nullptr;
						auto *b_front = node->succ[1]->dominance_frontier.size() == 1 ?
						                node->succ[1]->dominance_frontier.front() : nullptr;
						bool found_candidate = false;

						CFGNode *inner_merge_candidate = nullptr;

						// If there is no unique dominance frontier for one path, pick the one that has a unique frontier
						// as that in considered a merge.
						if ((a_front || b_front) && a_front != b_front)
						{
							if (!b_front || (a_front && query_reachability(*a_front, *b_front)))
							{
								merge_to_succ(node, 0);
								inner_merge_candidate = b_front;
								found_candidate = true;
							}
							else if (!a_front || (b_front && query_reachability(*b_front, *a_front)))
							{
								merge_to_succ(node, 1);
								inner_merge_candidate = a_front;
								found_candidate = true;
							}
						}

						if (!found_candidate)
						{
							node->merge = MergeType::Selection;
							node->selection_merge_block = nullptr;

							if (a_front && b_front && a_front->headers.size() == 1 && b_front->headers.size() == 1)
							{
								// Extremely ambiguous merge where the selection construct can merge to two different paths.
								// Our only option at this point is to pick an arbitrary winner
								// and consider one path the breaking one arbitrarily.
								auto *a_header = a_front->headers.front();
								auto *b_header = b_front->headers.front();

								// Pick the largest enclosing header as a heuristic.
								inner_merge_candidate =
									a_header->forward_post_visit_order > b_header->forward_post_visit_order ?
									a_front : b_front;
							}
						}

						if (inner_merge_candidate && inner_merge_candidate->headers.size() == 1)
						{
							// The breaking path tries to break to this node.
							// This will only trigger in pass 1.
							auto *header = inner_merge_candidate->headers.front();
							if (header->merge == MergeType::Selection)
							{
								// Promote to loop header instead.
								// We might have to enter the loop ladder fixup stages later
								// to insert ladders as required.
								header->merge = MergeType::Loop;
								header->loop_merge_block = header->selection_merge_block;
								header->selection_merge_block = nullptr;
								header->freeze_structured_analysis = true;
							}
						}
					}
				}
				else
				{
					assert(merge);
					node->selection_merge_block = merge;
					node->merge = MergeType::Selection;
					merge->headers.push_back(node);
					//LOGI("Merging %s -> %s\n", node->name.c_str(), node->selection_merge_block->name.c_str());
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
			if (merge && !node->dominates(merge) && !block_is_plain_continue(merge))
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
	auto *innermost_loop_header = get_innermost_loop_header_for(header);
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
		traverse_dominated_blocks_and_rewrite_branch(inner_block,
		    ladder_to, ladder, [inner_block](CFGNode *node) -> bool {
			    return inner_block->selection_merge_block != node;
		    });

		ladder->recompute_immediate_dominator();
		rewrite_selection_breaks(inner_block, ladder);
	}
}

bool CFGStructurizer::is_ordered(const CFGNode *a, const CFGNode *b, const CFGNode *c)
{
	return a != b && a->dominates(b) && b != c && b->dominates(c);
}

bool CFGStructurizer::header_and_merge_block_have_entry_exit_relationship(const CFGNode *header, const CFGNode *merge) const
{
	if (!merge->post_dominates(header))
		return false;

	// If there are other blocks which need merging, and that idom is the header,
	// then header is some kind of exit block.
	bool found_inner_merge_target = false;
	const CFGNode *potential_inner_merge_target = nullptr;

	UnorderedSet<const CFGNode *> traversed;

	const auto is_earlier = [](const CFGNode *candidate, const CFGNode *existing) {
		return !existing || (candidate->forward_post_visit_order > existing->forward_post_visit_order);
	};

	const auto is_later = [](const CFGNode *candidate, const CFGNode *existing) {
		return !existing || (candidate->forward_post_visit_order < existing->forward_post_visit_order);
	};

	header->traverse_dominated_blocks([&](const CFGNode *node) {
		if (node == merge)
			return false;
		if (traversed.count(node))
			return false;
		traversed.insert(node);

		// Don't analyze loops, this path is mostly for selections only.
		if (node->pred_back_edge)
			return false;

		if (node->num_forward_preds() <= 1)
			return true;
		auto *idom = node->immediate_dominator;

		if (idom == header)
		{
			found_inner_merge_target = true;
			return false;
		}
		else if (is_later(node, potential_inner_merge_target) &&
		         idom->immediate_post_dominator == merge &&
		         !exists_path_in_cfg_without_intermediate_node(header, node, idom))
		{
			// Need to analyze this further to determine if it's one of those insane crossing merge cases ...
			// Find the lowest post visit order if there are multiple candidates.
			potential_inner_merge_target = node;
		}

		return true;
	});

	if (found_inner_merge_target)
		return true;
	if (!potential_inner_merge_target)
		return false;

	// Alternatively, try to find a situation where the natural merge is difficult to determine.
	// In this scenario, selection constructs appear to be "breaking" in different directions.
	// Any attempt to split scopes here will fail spectacularly.

	const CFGNode *first_natural_breaks_to_outer = nullptr;
	const CFGNode *first_natural_breaks_to_inner = nullptr;
	const CFGNode *last_natural_breaks_to_outer = nullptr;
	const CFGNode *last_natural_breaks_to_inner = nullptr;
	traversed.clear();

	header->traverse_dominated_blocks([&](const CFGNode *node) {
		if (node == merge || node == potential_inner_merge_target)
			return false;
		if (!query_reachability(*node, *merge) || !query_reachability(*node, *potential_inner_merge_target))
			return false;
		if (traversed.count(node))
			return false;
		traversed.insert(node);

		if (node->succ.size() < 2)
			return true;

		bool breaks_to_outer = std::find_if(node->succ.begin(), node->succ.end(), [&](const CFGNode *candidate) {
			return merge->post_dominates(candidate);
		}) != node->succ.end();

		bool breaks_to_inner = std::find_if(node->succ.begin(), node->succ.end(), [&](const CFGNode *candidate) {
			return potential_inner_merge_target->post_dominates(candidate);
		}) != node->succ.end();

		if (breaks_to_inner)
			breaks_to_outer = false;

		if (breaks_to_outer)
		{
			if (is_earlier(node, first_natural_breaks_to_outer))
				first_natural_breaks_to_outer = node;
			if (is_later(node, last_natural_breaks_to_outer))
				last_natural_breaks_to_outer = node;
		}

		if (breaks_to_inner)
		{
			if (is_earlier(node, first_natural_breaks_to_inner))
				first_natural_breaks_to_inner = node;
			if (is_later(node, last_natural_breaks_to_inner))
				last_natural_breaks_to_inner = node;
		}

		return true;
	});

	if (!first_natural_breaks_to_outer || !first_natural_breaks_to_inner ||
	    !last_natural_breaks_to_outer || !last_natural_breaks_to_inner)
	{
		return false;
	}

	// Crossing break scenario.
	if (is_ordered(first_natural_breaks_to_inner, first_natural_breaks_to_outer, last_natural_breaks_to_inner))
		return true;
	else if (is_ordered(first_natural_breaks_to_outer, first_natural_breaks_to_inner, last_natural_breaks_to_outer))
		return true;
	else
		return false;
}

bool CFGStructurizer::serialize_interleaved_merge_scopes()
{
	// Try to fixup scenarios which arise from unrolled loops with multiple break blocks.
	// DXC will emit maximal convergence and force all dynamic instances of a given break to branch to the same
	// block, which then breaks, e.g.:
	// for (int i = 0; i < CONSTANT; i++) { cond_break_construct1(); cond_break_construct2(); cond_break_construct3(); }
	// When this unrolls we can end up with merge blocks which are entangled. Only sane way to make this work
	// is to serialize the breaks to after the merge block.
	UnorderedSet<CFGNode *> potential_merge_nodes;

	for (auto *node : forward_post_visit_order)
		if (node->num_forward_preds() >= 2 && !block_is_plain_continue(node))
			potential_merge_nodes.insert(node);

	UnorderedSet<const CFGNode *> visited;

	for (auto *node : forward_post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;
		if (block_is_plain_continue(node))
			continue;

		auto *idom = node->immediate_dominator;

		Vector<CFGNode *> inner_constructs;
		Vector<CFGNode *> valid_constructs;

		// Find merge block candidates that are strictly dominated by idom and immediately post-dominated by node.
		// They also must not be good merge candidates on their own.
		// Also, we're not interested in any loop merge candidates.
		for (auto *candidate : potential_merge_nodes)
		{
			if (candidate != idom && idom->dominates(candidate) &&
			    candidate->immediate_post_dominator == node &&
			    !candidate->post_dominates_perfect_structured_construct() &&
			    get_innermost_loop_header_for(idom, node) == idom)
			{
				bool direct_dominance_frontier = candidate->dominance_frontier.size() == 1 &&
				                                 candidate->dominance_frontier.front() == node;
				// The candidate must not try to merge to other code since we might end up introducing loops that way.
				// All code reachable by candidate must cleanly break to node.
				if (direct_dominance_frontier)
					inner_constructs.push_back(candidate);
			}
		}

		// Ensure stable order.
		std::sort(inner_constructs.begin(), inner_constructs.end(), [](const CFGNode *a, const CFGNode *b) {
			return a->forward_post_visit_order < b->forward_post_visit_order;
		});

		// Prune any candidate that can reach another candidate. The sort ensures that candidate to be removed comes last.
		size_t count = inner_constructs.size();
		for (size_t i = 0; i < count; i++)
		{
			bool valid = true;
			for (size_t j = 0; j < i; j++)
			{
				if (query_reachability(*inner_constructs[j], *inner_constructs[i]))
				{
					valid = false;
					break;
				}
			}

			if (valid)
				valid_constructs.push_back(inner_constructs[i]);
		}

		if (valid_constructs.size() < 2)
			continue;

		Vector<std::pair<CFGNode *, CFGNode *>> pdf_ranges;
		pdf_ranges.reserve(inner_constructs.size());

		// If breaking merge constructs are entangled, their PDFs will overlap.
		for (auto *candidate : valid_constructs)
		{
			auto &pdf = candidate->post_dominance_frontier;
			assert(!pdf.empty());
			CFGNode *first = pdf.front();
			CFGNode *last = first;

			for (auto *n : pdf)
			{
				if (n->forward_post_visit_order > first->forward_post_visit_order)
					first = n;
				if (n->forward_post_visit_order < last->forward_post_visit_order)
					last = n;
			}

			pdf_ranges.push_back({ first, last });
		}

		bool need_deinterleave = false;
		count = valid_constructs.size();
		for (size_t i = 0; i < count && !need_deinterleave; i++)
			for (size_t j = 0; j < count && !need_deinterleave; j++)
				if (i != j)
					need_deinterleave = is_ordered(pdf_ranges[i].first, pdf_ranges[j].first, pdf_ranges[i].second);

		if (need_deinterleave)
		{
			// Rewrite the control flow to serialize execution of the candidate blocks.
			auto *dispatcher = create_helper_pred_block(node);

			auto &builder = module.get_builder();
			PHI phi;
			phi.id = module.allocate_id();
			phi.type_id = builder.makeIntType(32);

			for (auto *candidate : valid_constructs)
				traverse_dominated_blocks_and_rewrite_branch(candidate, dispatcher, node);

			size_t cutoff_index = dispatcher->pred.size();

			// If there is no direct branch intended for node, the default case label will never be reached,
			// so just pilfer one of the cases as default.
			bool need_default_case = !dispatcher->pred.empty();

			for (size_t i = 0; i < cutoff_index; i++)
				phi.incoming.push_back({ dispatcher->pred[i], builder.makeIntConstant(-1) });

			for (size_t i = 0; i < count; i++)
			{
				auto *candidate = valid_constructs[i];
				traverse_dominated_blocks_and_rewrite_branch(idom, candidate, dispatcher);
				size_t next_cutoff_index = dispatcher->pred.size();
				for (size_t j = cutoff_index; j < next_cutoff_index; j++)
					phi.incoming.push_back({ dispatcher->pred[j], builder.makeIntConstant(int32_t(i)) });
				cutoff_index = next_cutoff_index;
			}

			idom->freeze_structured_analysis = true;
			idom->merge = MergeType::Loop;
			idom->loop_merge_block = dispatcher;

			dispatcher->ir.terminator.conditional_id = phi.id;
			dispatcher->ir.phi.push_back(std::move(phi));
			builder.addName(phi.id, String("selector_" + node->name).c_str());

			Terminator::Case default_case;
			dispatcher->ir.terminator.type = Terminator::Type::Switch;
			dispatcher->ir.terminator.direct_block = nullptr;
			default_case.node = need_default_case ? node : valid_constructs[0];
			default_case.is_default = true;
			dispatcher->ir.terminator.cases.push_back(default_case);

			for (size_t i = 0; i < count; i++)
			{
				auto *candidate = valid_constructs[i];
				assert(candidate->pred.empty());
				dispatcher->add_branch(candidate);

				if (need_default_case || i)
				{
					Terminator::Case break_case;
					break_case.node = candidate;
					break_case.value = uint32_t(i);
					dispatcher->ir.terminator.cases.push_back(break_case);
				}
			}

			// This completely transposes the CFG, so need to recompute CFG to keep going.
			recompute_cfg();
			return true;
		}
	}

	return false;
}

void CFGStructurizer::split_merge_scopes()
{
	for (auto *node : forward_post_visit_order)
	{
		// Setup a preliminary merge scope so we know when to stop traversal.
		// We don't care about traversing inner scopes, out starting from merge block as well.
		if (node->num_forward_preds() <= 1)
			continue;

		if (block_is_plain_continue(node))
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

		// We already rewrote this selection construct in serialize_interleaved_merge_scopes.
		// Don't try to introduce unnecessary ladders.
		if (idom->merge == MergeType::Loop && idom->loop_merge_block == node)
			continue;

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

CFGNode *CFGStructurizer::find_natural_switch_merge_block(CFGNode *node, CFGNode *post_dominator) const
{
	// Maintain the original switch block order if possible to avoid awkward churn in reference output.
	uint64_t order = 1;
	for (auto &c : node->ir.terminator.cases)
	{
		// We'll need to decrement global order up to N times in the worst case.
		// Use 64-bit here as a safeguard in case the module is using a ridiculous amount of case labels.
		c.global_order = order * node->ir.terminator.cases.size();
		order++;
	}

	// First, sort so that any fallthrough parent comes before fallthrough target.
	std::sort(node->ir.terminator.cases.begin(), node->ir.terminator.cases.end(),
			  [](const Terminator::Case &a, const Terminator::Case &b)
			  { return a.node->forward_post_visit_order > b.node->forward_post_visit_order; });

	// Look at all potential fallthrough candidates and reassign global order.
	for (size_t i = 0, n = node->ir.terminator.cases.size(); i < n; i++)
	{
		for (size_t j = i + 1; j < n; j++)
		{
			auto &parent = node->ir.terminator.cases[i];
			auto &child = node->ir.terminator.cases[j];

			// A case label might be the merge block candidate of the switch.
			// Don't consider case fallthrough if b post-dominates the entire switch statement.
			if (child.node != post_dominator && parent.node != child.node &&
			    query_reachability(*parent.node, *child.node))
			{
				parent.global_order = child.global_order - 1;
				break;
			}
		}
	}

	// Sort again, but this time, by global order.
	std::stable_sort(node->ir.terminator.cases.begin(), node->ir.terminator.cases.end(),
					 [](const Terminator::Case &a, const Terminator::Case &b)
					 { return a.global_order < b.global_order; });

	// Detect impossible fallthrough scenarios. We can have A -> B -> C fallthrough, but not
	// A -> C and B -> C. In this situation, we should see C as the actual switch merge block,
	// and rewrite the switch to loop + switch.
	// Detect this by having two entries with identical global order.

	bool has_impossible_fallthrough = false;
	uint64_t target_order = 0;

	for (size_t i = 1, n = node->ir.terminator.cases.size(); i < n; i++)
	{
		if (node->ir.terminator.cases[i].global_order == node->ir.terminator.cases[i - 1].global_order)
		{
			target_order = node->ir.terminator.cases[i].global_order + 1;
			has_impossible_fallthrough = true;
			break;
		}
	}

	CFGNode *candidate = nullptr;
	if (has_impossible_fallthrough)
	{
		for (auto &c : node->ir.terminator.cases)
		{
			if (c.global_order == target_order)
			{
				candidate = c.node;
				break;
			}
		}
	}

	// We found a candidate, but there might be multiple candidates which are considered impossible.

	// If two case labels merge execution before the candidate merge, we should consider that the natural merge,
	// since it is not possible to express this without a switch merge.
	for (auto &c : node->ir.terminator.cases)
	{
		for (auto *front : c.node->dominance_frontier)
		{
			// Ignore frontiers that are other case labels.
			// We allow simple fallthrough, and if we found an impossible case we would have handled it already.
			for (auto &ic : node->ir.terminator.cases)
			{
				if (ic.node == front)
				{
					front = nullptr;
					break;
				}
			}

			if (!front)
				continue;

			if (front->forward_post_visit_order != post_dominator->forward_post_visit_order &&
			    query_reachability(*front, *post_dominator))
			{
				// If this is reachable by a different case label, we have a winner. This must be a fake fallthrough
				// that we should promote to switch merge.
				for (auto &ic : node->ir.terminator.cases)
				{
					if (ic.node != c.node && query_reachability(*ic.node, *front))
					{
						// Select the innermost block that is impossible.
						// Breaking further out can be handled with loops, etc.
						if (!candidate || front->forward_post_visit_order > candidate->forward_post_visit_order)
							candidate = front;
					}
				}
			}
		}
	}

	return candidate ? candidate : post_dominator;
}

CFGNode *CFGStructurizer::create_switch_merge_ladder(CFGNode *header, CFGNode *merge)
{
	// We did not rewrite switch blocks w.r.t. selection breaks.
	// We might be in a situation where the switch block is trying to merge to a block which is already being merged to.
	// Create a ladder which the switch block could merge to.
	return create_ladder_block(header, merge, ".switch-merge");
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
		auto *natural_merge = find_natural_switch_merge_block(node, merge);

		if (node->freeze_structured_analysis && node->merge == MergeType::Selection)
		{
			natural_merge = node->selection_merge_block;
		}
		else if (pass == 0)
		{
			bool can_merge_to_post_dominator = merge && node->dominates(merge) && merge->headers.empty();

			// Need to guarantee that we can merge somewhere.
			// If possible we want to make it so that by creating a ladder,
			// we change the post-dominator to something we dominate.
			// For this to work, the dominance frontier of node must only contain the merge node.
			if (merge != natural_merge && !can_merge_to_post_dominator &&
			    node->dominance_frontier.size() == 1 && node->dominance_frontier.front() == merge)
			{
				merge = create_switch_merge_ladder(node, merge);
				assert(node->dominates(merge));
				modified_cfg = true;
				can_merge_to_post_dominator = true;
			}

			// Need to rewrite the switch.
			if (merge != natural_merge)
			{
				if (can_merge_to_post_dominator)
				{
					auto *switch_outer = create_helper_pred_block(node);
					switch_outer->merge = MergeType::Loop;
					switch_outer->loop_merge_block = merge;
					switch_outer->freeze_structured_analysis = true;
					merge->headers.push_back(switch_outer);

					// Shouldn't be needed (I believe), but spirv-val is a bit temperamental when double breaking
					// straight out of a switch block in some situations,
					// so try not to ruffle too many feathers.
					if (std::find(node->succ.begin(), node->succ.end(), natural_merge) != node->succ.end())
					{
						auto *dummy_case = pool.create_node();
						dummy_case->name = natural_merge->name + ".pred";
						dummy_case->immediate_dominator = node;
						dummy_case->immediate_post_dominator = natural_merge;
						dummy_case->forward_post_visit_order = node->forward_post_visit_order;
						dummy_case->backward_post_visit_order = node->backward_post_visit_order;
						dummy_case->ir.terminator.type = Terminator::Type::Branch;
						dummy_case->ir.terminator.direct_block = natural_merge;
						dummy_case->add_branch(natural_merge);
						node->retarget_branch(natural_merge, dummy_case);
					}

					node->freeze_structured_analysis = true;
				}

				// Switch case labels must be contained within the switch statement.
				// Use a dummy label if we have to.
				auto succs = node->succ;
				for (auto *succ : succs)
				{
					bool need_fixup;
					if (succ == merge)
					{
						// If we used outer shell method, we dominate merge,
						// but not structurally, since there's a loop merge already.
						need_fixup = can_merge_to_post_dominator;
					}
					else
					{
						// If we don't dominate succ, but it's not the common merge block, this is
						// an edge case we have to handle as well.
						need_fixup = !node->dominates(succ);
					}

					// Guard against duplicate label branches.
					bool has_succ = std::find(node->succ.begin(), node->succ.end(), succ) != node->succ.end();

					if (need_fixup && has_succ)
					{
						auto *dummy_break = pool.create_node();
						dummy_break->name = node->name + ".break";
						dummy_break->immediate_dominator = node;
						dummy_break->immediate_post_dominator = succ;
						dummy_break->forward_post_visit_order = node->forward_post_visit_order;
						dummy_break->backward_post_visit_order = node->backward_post_visit_order;
						dummy_break->ir.terminator.type = Terminator::Type::Branch;
						dummy_break->ir.terminator.direct_block = succ;
						dummy_break->add_branch(succ);
						node->retarget_branch(succ, dummy_break);
					}
				}
			}
		}

		merge = natural_merge;

		CFGNode *merge_ladder = nullptr;

		// We cannot rewrite the CFG in pass 1 safely, this should have happened in pass 0.
		if (pass == 0 && (!node->dominates(merge) || block_is_plain_continue(merge)))
		{
			merge_ladder = create_switch_merge_ladder(node, merge);
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

			if (!dominated_merge_target)
			{
				LOGW("No dominated merge target found. Likely a bug. Falling back to merge ladder.\n");
				dominated_merge_target = merge_ladder;
			}

			assert(dominated_merge_target);

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

bool CFGStructurizer::merge_candidate_is_on_breaking_path(const CFGNode *node) const
{
	return node->pred.size() >= 2 && node->succ.size() == 1 &&
	       !node->dominates(node->succ.front()) &&
	       node->succ.front()->post_dominates(node) &&
	       control_flow_is_escaping(node, node->succ.front()) &&
	       !node->post_dominates_perfect_structured_construct();
}

void CFGStructurizer::find_selection_merges(unsigned pass)
{
	for (auto *node : forward_post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;

		// Never merge to continue block.
		// We should never hit this path unless we explicitly
		// avoided creating a continue ladder block earlier.
		if (block_is_plain_continue(node))
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

		// Similar, but also check if we have associated ladder blocks with the idom.
		if (!idom->pred_back_edge)
		{
			auto *inner_loop_header = get_innermost_loop_header_for(idom);
			if (inner_loop_header && inner_loop_header->loop_ladder_block == node)
				idom = const_cast<CFGNode *>(inner_loop_header);
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

			// If we're in a pass 1, opting for a selection merge better make sure that we can
			// actually use this as a merge block.
			// If we have more than 2 preds, there is no way this is not a break block merge.
			// It is not a switch statement and selections spawn two new scopes.
			// We should have resolved this in pass 0, but it can slip through the cracks if there
			// are multiple interleaving merge scopes in play.
			bool force_loop = pass == 1 &&
			                  node->num_forward_preds() > 2 &&
			                  idom->merge == MergeType::None;

			if (force_loop)
			{
				idom->merge = MergeType::Loop;
				node->add_unique_header(idom);
				idom->loop_merge_block = node;
				idom->freeze_structured_analysis = true;
			}
			else
			{
				idom->merge = MergeType::Selection;
				node->add_unique_header(idom);
				assert(node);
				idom->selection_merge_block = node;
				//LOGI("Selection merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(idom), idom->name.c_str(),
				//     static_cast<const void *>(node), node->name.c_str());
			}
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
			else if (idom->loop_merge_block != node && idom->loop_ladder_block != node)
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

bool CFGStructurizer::loop_exit_supports_infinite_loop(const CFGNode *header, const CFGNode *loop_exit) const
{
	auto *inner_header = get_innermost_loop_header_for(header, loop_exit);
	// A loop exit can exit out to an outer scope such that inner_header dominates the header.
	// If there is no inner loop we can transform the loop exit into a merge block quite easily
	// and avoid the infinite loop.
	if (inner_header->dominates(header))
		return false;

	// We have a candidate. If the candidates dominates all reachable exits, there is never a need to merge later.
	return loop_exit->dominates_all_reachable_exits();
}

CFGStructurizer::LoopExitType CFGStructurizer::get_loop_exit_type(const CFGNode &header, const CFGNode &node) const
{
	// If there exists an inner loop which dominates this exit, we treat it as an inner loop exit.
	const CFGNode *innermost_loop_header = get_innermost_loop_header_for(&header, &node);
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
			{
				// This is an escape we dominate, but this could also be a case where we break
				// to a continue construct in the outer loop which is not reachable through back traversal.
				// This will confuse loop analysis, since this kind of double continue will not resolve properly.
				// In this case we need to rendezvous at this block with a ladder to avoid
				// double-continue.

				auto *outer_infinite_loop = get_innermost_loop_header_for(entry_block,
				                                                          innermost_loop_header->immediate_dominator);
				if (outer_infinite_loop && outer_infinite_loop->pred_back_edge &&
				    outer_infinite_loop->pred_back_edge->succ.empty() &&
				    outer_infinite_loop->pred_back_edge->post_dominates(&node))
				{
					return LoopExitType::MergeToInfiniteLoop;
				}
				else
					return LoopExitType::Escape;
			}

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

	// When splitting merge scopes, need to consider these pred blocks as well
	// since they might end up with headers.size() >= 2.
	node->split_merge_block_candidate = pred_node;

	// We're replacing entry block.
	if (node == node->immediate_dominator)
		pred_node->immediate_dominator = pred_node;
	else
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
		// A continue block which only branches back to header is conveniently ignored here.
		if (candidates.front()->succ.empty() && !candidates.front()->succ_back_edge)
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

void CFGStructurizer::rewrite_transposed_loop_outer(CFGNode *node, CFGNode *impossible_merge_target,
                                                    const LoopMergeAnalysis &analysis)
{
	auto impossible_preds = impossible_merge_target->pred;

	auto *replaced_merge_block = create_helper_pred_block(analysis.dominated_merge);
	replaced_merge_block->name = analysis.dominated_merge->name + ".transposed-merge-outer";

	for (auto *pred : impossible_preds)
		if (!query_reachability(*analysis.dominated_merge, *pred))
			pred->retarget_branch(impossible_merge_target, replaced_merge_block);

	replaced_merge_block->add_branch(impossible_merge_target);
	replaced_merge_block->ir.terminator.true_block = impossible_merge_target;
	replaced_merge_block->ir.terminator.false_block = analysis.dominated_merge;
	replaced_merge_block->ir.terminator.type = Terminator::Type::Condition;
	replaced_merge_block->ir.terminator.conditional_id = module.allocate_id();

	PHI phi;
	phi.id = replaced_merge_block->ir.terminator.conditional_id;
	phi.type_id = module.get_builder().makeBoolType();
	module.get_builder().addName(phi.id, (String("transposed_selector_") + node->name).c_str());

	for (auto *ladder_pred : replaced_merge_block->pred)
	{
		IncomingValue incoming = {};
		incoming.block = ladder_pred;
		bool branches_to_impossible =
				std::find(impossible_preds.begin(), impossible_preds.end(), ladder_pred) != impossible_preds.end();
		incoming.id = module.get_builder().makeBoolConstant(branches_to_impossible);
		phi.incoming.push_back(incoming);
	}

	replaced_merge_block->ir.phi.push_back(std::move(phi));
}

void CFGStructurizer::rewrite_transposed_loop_inner(CFGNode *node, CFGNode *impossible_merge_target,
                                                    const LoopMergeAnalysis &analysis)
{
	// Rewrite the control flow from the inside out through a transposition.
	// The common break target will become the merge block instead.
	// The continue will break out to the transposed merge instead.
	// In the ladder, we will enter a breaking path which branches out to loop_ladder.

	// We just arbitrary call this "inner", since I don't think it has a formal name.
	// In this case, dominated merge cannot reach impossible merge target.

	auto *merge = analysis.merge;
	auto *dominated_merge = analysis.dominated_merge;

	auto *ladder_break = pool.create_node();
	ladder_break->name = node->name + ".transposed-merge-inner.break";
	ladder_break->ir.terminator.type = Terminator::Type::Branch;
	ladder_break->ir.terminator.direct_block = impossible_merge_target;
	ladder_break->immediate_post_dominator = impossible_merge_target;
	ladder_break->forward_post_visit_order = impossible_merge_target->forward_post_visit_order;
	ladder_break->backward_post_visit_order = impossible_merge_target->backward_post_visit_order;

	auto *ladder_selection = pool.create_node();
	ladder_selection->name = node->name + ".transposed-merge-inner";
	ladder_selection->forward_post_visit_order = impossible_merge_target->forward_post_visit_order;
	ladder_selection->backward_post_visit_order = impossible_merge_target->backward_post_visit_order;
	ladder_selection->immediate_post_dominator = merge;
	ladder_break->immediate_dominator = ladder_selection;

	auto ladder_preds = dominated_merge->pred;

	ladder_selection->add_branch(ladder_break);
	ladder_selection->add_branch(dominated_merge);
	traverse_dominated_blocks_and_rewrite_branch(node, impossible_merge_target, ladder_selection);
	ladder_selection->recompute_immediate_dominator();

	ladder_break->add_branch(impossible_merge_target);

	// Branches from these blocks should be rewritten to target transposed-merge.
	for (auto *ladder_pred : ladder_preds)
		ladder_pred->retarget_branch(dominated_merge, ladder_selection);

	ladder_selection->ir.terminator.type = Terminator::Type::Condition;
	ladder_selection->ir.terminator.true_block = dominated_merge;
	ladder_selection->ir.terminator.false_block = ladder_break;
	ladder_selection->ir.terminator.conditional_id = module.allocate_id();

	PHI phi;
	phi.id = ladder_selection->ir.terminator.conditional_id;
	phi.type_id = module.get_builder().makeBoolType();
	module.get_builder().addName(phi.id, (String("transposed_selector_") + node->name).c_str());
	for (auto *ladder_pred : ladder_selection->pred)
	{
		IncomingValue incoming = {};
		incoming.block = ladder_pred;
		bool branches_to_dominated_merge =
				std::find(ladder_preds.begin(), ladder_preds.end(), ladder_pred) != ladder_preds.end();
		incoming.id = module.get_builder().makeBoolConstant(branches_to_dominated_merge);
		phi.incoming.push_back(incoming);
	}
	ladder_selection->ir.phi.push_back(std::move(phi));
}

bool CFGStructurizer::rewrite_transposed_loops()
{
	bool did_rewrite = false;

	for (auto index = forward_post_visit_order.size(); index && !did_rewrite; index--)
	{
		// Visit in reverse order so we resolve outer loops first,
		// this lets us detect ladder-breaking loops.
		auto *node = forward_post_visit_order[index - 1];

		if (node->freeze_structured_analysis && node->merge == MergeType::Loop)
			continue;
		if (!node->has_pred_back_edges())
			continue;

		auto result = analyze_loop(node);
		auto merge_result = analyze_loop_merge(node, result);

		auto *merge = merge_result.merge;
		auto *dominated_merge = merge_result.dominated_merge;

		if (!merge || !dominated_merge)
			continue;

		// We might have a horribly complex scenario where a loop breaks, but it breaks to an outer scope
		// which is not consistent with the merge block, i.e. we need structured control flow to resolve properly
		// before we can break. This is ... problematic.

		// We call this an "inner" transposed loop here since merge block cannot reach this block.

		// Always resolve infinite continue ladders. This is where we break to
		// an outer infinite loop. We must resolve the scopes by making this ladder the
		// merge point, then we can break further.
		CFGNode *impossible_merge_target = merge_result.infinite_continue_ladder;

		if (!impossible_merge_target && !result.non_dominated_exit.empty())
		{
			auto *common_break_target = find_common_post_dominator(result.non_dominated_exit);
			if (common_break_target && common_break_target != merge &&
			    common_break_target->reaches_domination_frontier_before_merge(merge) &&
			    !query_reachability(*dominated_merge, *common_break_target) &&
			    !query_reachability(*common_break_target, *dominated_merge))
			{
				impossible_merge_target = common_break_target;
			}
		}

		if (!impossible_merge_target)
		{
			// We might have a different scenario where there are multiple breaks, but they break out to different
			// scopes. One of these might require a similar impossible merge.
			// Common post dominator analysis would not catch this.
			// What we're looking for is a node which:
			// - Is dominated by loop header (or is in the domination frontier of loop header)
			// - Is reachable, but not dominated by dominated_merge.
			// - Post dominates one of the non_dominated_exits.
			// This means the node is in a twilight zone where the node is kinda in the loop construct, but kinda not.

			// Structured rules for a loop state that a node is in the construct if:
			// - It is dominated by loop header
			// - Not dominated by merge block.
			// In a sense, the merge block ends up branching back into its own loop, which is irreducible, kinda ...

			// We call this an "outer" transposed loop here since merge block *can* reach this block.

			for (size_t i = 0, n = result.non_dominated_exit.size(); i < n && !impossible_merge_target; i++)
			{
				auto *candidate = result.non_dominated_exit[i];

				while (candidate != merge && candidate != dominated_merge)
				{
					if (query_reachability(*dominated_merge, *candidate) && !dominated_merge->dominates(candidate))
					{
						// Merge block attempts to branch back into its own loop construct (yikes).
						impossible_merge_target = candidate;

						// If we don't dominate the merge target, i.e. we're in the domination frontier,
						// we have to synthesize a fake impossible merge target first since the rewrite
						// algorithm depends on node dominating the merge target.
						if (!node->dominates(impossible_merge_target))
							impossible_merge_target = create_ladder_block(node, impossible_merge_target, ".impossible-ladder");
						break;
					}
					else if (node->dominates(candidate) && candidate != candidate->immediate_post_dominator)
					{
						candidate = candidate->immediate_post_dominator;
					}
					else
					{
						// We will be able to select a candidate in the domination frontier once.
						// If we failed to find a candidate in the domination frontier, we're done checking.
						break;
					}
				}
			}
		}

		if (impossible_merge_target)
		{
			if (query_reachability(*dominated_merge, *impossible_merge_target))
				rewrite_transposed_loop_outer(node, impossible_merge_target, merge_result);
			else
				rewrite_transposed_loop_inner(node, impossible_merge_target, merge_result);

			// We have obliterated the existing control flow through transposition,
			// and any domination or post-domination analysis will break.
			// Re-traverse the CFG and try again.
			// Continue until we have eliminated all impossible loops (should be extremely rare).
			did_rewrite = true;
		}
	}

	if (did_rewrite)
		recompute_cfg();
	return did_rewrite;
}

CFGStructurizer::LoopAnalysis CFGStructurizer::analyze_loop(CFGNode *node) const
{
	LoopAnalysis result;

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

	for (auto *loop_exit : merge_tracer.loop_exits)
	{
		auto exit_type = get_loop_exit_type(*node, *loop_exit);
		switch (exit_type)
		{
		case LoopExitType::Exit:
			result.direct_exits.push_back(loop_exit);
			break;

		case LoopExitType::InnerLoopExit:
			// It's not an exit for us, but the inner loop.
			result.inner_direct_exits.push_back(loop_exit);
			break;

		case LoopExitType::Merge:
			result.dominated_exit.push_back(loop_exit);
			break;

		case LoopExitType::InnerLoopMerge:
			result.inner_dominated_exit.push_back(loop_exit);
			break;

		case LoopExitType::InnerLoopFalsePositive:
			// In this case, the inner loop can only exit at the loop header,
			// and thus post-dominance analysis will always fail.
			// Ignore this case as it's a false exit.
			break;

		case LoopExitType::Escape:
			result.non_dominated_exit.push_back(loop_exit);
			break;

		case LoopExitType::MergeToInfiniteLoop:
			result.dominated_continue_exit.push_back(loop_exit);
			break;
		}
	}

	if (result.dominated_continue_exit.size() > 1)
	{
		// If we have multiple continue exit candidates, they better merge into a single clean candidate that we
		// still dominate, otherwise, ignore this case and treat them all as normal Escape nodes.
		auto *common = find_common_post_dominator(result.dominated_continue_exit);
		if (common && node->dominates(common))
		{
			result.dominated_continue_exit.clear();
			result.dominated_continue_exit.push_back(common);
		}
		else
		{
			result.non_dominated_exit.insert(result.non_dominated_exit.end(),
			                                 result.dominated_continue_exit.begin(),
			                                 result.dominated_continue_exit.end());
			result.dominated_continue_exit.clear();
		}
	}

	// If the only merge candidates we have are inner dominated, treat them as true dominated exits.
	if (result.dominated_exit.empty() && !result.inner_dominated_exit.empty())
		std::swap(result.dominated_exit, result.inner_dominated_exit);

	// If there are no direct exists, treat inner direct exists as direct exits.
	if (result.direct_exits.empty())
		std::swap(result.direct_exits, result.inner_direct_exits);

	// A direct exit can be considered a dominated exit if there are no better candidates.
	if (result.dominated_exit.empty() && !result.direct_exits.empty())
		std::swap(result.dominated_exit, result.direct_exits);

	// If we only have one direct exit, consider it our merge block.
	// Pick either Merge or Escape.
	if (result.direct_exits.size() == 1 && result.dominated_exit.empty() && result.non_dominated_exit.empty())
	{
		if (node->dominates(result.direct_exits.front()))
			std::swap(result.dominated_exit, result.direct_exits);
		else
			std::swap(result.non_dominated_exit, result.direct_exits);
	}

	if (result.dominated_exit.size() >= 2)
	{
		// Try to see if we can reduce the number of merge blocks to just 1.
		// This is relevant if we have various "clean" break blocks.
		auto *post_dominator = find_common_post_dominator(result.dominated_exit);
		if (std::find(result.dominated_exit.begin(), result.dominated_exit.end(),
		              post_dominator) != result.dominated_exit.end())
		{
			result.dominated_exit.clear();
			result.dominated_exit.push_back(post_dominator);
		}
	}

	return result;
}

CFGStructurizer::LoopMergeAnalysis CFGStructurizer::analyze_loop_merge(CFGNode *node, const LoopAnalysis &analysis)
{
	// We have multiple blocks which are merge candidates. We need to figure out where execution reconvenes.
	Vector<CFGNode *> merges;
	merges.reserve(analysis.inner_dominated_exit.size() + analysis.dominated_exit.size() + analysis.non_dominated_exit.size());
	merges.insert(merges.end(), analysis.inner_dominated_exit.begin(), analysis.inner_dominated_exit.end());
	merges.insert(merges.end(), analysis.dominated_exit.begin(), analysis.dominated_exit.end());
	merges.insert(merges.end(), analysis.non_dominated_exit.begin(), analysis.non_dominated_exit.end());
	CFGNode *merge = CFGStructurizer::find_common_post_dominator(merges);

	CFGNode *dominated_merge = nullptr;

	// Try to find the sensible target first.
	// If one of our merge blocks is the successor of the continue block,
	// this is a prime candidate for a ladder block.
	if (node->pred_back_edge && node->pred_back_edge->succ.size() == 1 &&
	    std::find(analysis.dominated_exit.begin(),
	              analysis.dominated_exit.end(),
	              node->pred_back_edge->succ.front()) != analysis.dominated_exit.end())
	{
		dominated_merge = node->pred_back_edge->succ.front();
	}
	else if (merge && !node->dominates(merge) && analysis.dominated_exit.size() > 1)
	{
		// Now, we might have Merge blocks which end up escaping out of the loop construct.
		// We might have to remove candidates which end up being break blocks after all.
		Vector<CFGNode *> non_breaking_exits;
		non_breaking_exits.reserve(analysis.dominated_exit.size());
		for (auto *exit : analysis.dominated_exit)
			if (!control_flow_is_escaping(exit, merge))
				non_breaking_exits.push_back(exit);

		dominated_merge = CFGStructurizer::find_common_post_dominator(non_breaking_exits);
	}
	else
	{
		dominated_merge = CFGStructurizer::find_common_post_dominator(analysis.dominated_exit);
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

	LoopMergeAnalysis merge_result = {};
	merge_result.merge = merge;
	merge_result.dominated_merge = dominated_merge;

	if (!analysis.dominated_continue_exit.empty())
	{
		assert(analysis.dominated_continue_exit.size() == 1);
		merge_result.infinite_continue_ladder = analysis.dominated_continue_exit.front();
	}

	return merge_result;
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

		auto result = analyze_loop(node);
		auto &dominated_exit = result.dominated_exit;
		auto &inner_dominated_exit = result.inner_dominated_exit;
		auto &non_dominated_exit = result.non_dominated_exit;

		// This should not come up here, and must be handled in transpose loops.
		assert(result.dominated_continue_exit.empty());

		// Detect infinite loop with an exit which is only in inner loop construct.
		// It is impossible to construct a merge block in this case since the merge targets,
		// so just merge to unreachable.
		bool force_infinite_loop = false;
		if (node->pred_back_edge->succ.empty())
		{
			force_infinite_loop = true;
			for (auto *e : result.dominated_exit)
				force_infinite_loop = force_infinite_loop && loop_exit_supports_infinite_loop(node, e);
			for (auto *e : result.non_dominated_exit)
				force_infinite_loop = force_infinite_loop && loop_exit_supports_infinite_loop(node, e);
			for (auto *e : result.inner_dominated_exit)
				force_infinite_loop = force_infinite_loop && loop_exit_supports_infinite_loop(node, e);
			for (auto *e : result.direct_exits)
				force_infinite_loop = force_infinite_loop && loop_exit_supports_infinite_loop(node, e);
			for (auto *e : result.inner_direct_exits)
				force_infinite_loop = force_infinite_loop && loop_exit_supports_infinite_loop(node, e);
		}

		if (force_infinite_loop ||
		    (dominated_exit.empty() && inner_dominated_exit.empty() && non_dominated_exit.empty()))
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

			traverse_dominated_blocks_and_rewrite_branch(node, merge_block, ladder);
			node->loop_ladder_block = nullptr;
			node->loop_merge_block = ladder;
			ladder->recompute_immediate_dominator();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			//LOGI("Loop with ladder merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());
		}
		else
		{
			auto merge_result = analyze_loop_merge(node, result);
			auto *merge = merge_result.merge;
			auto *dominated_merge = merge_result.dominated_merge;

			if (!merge)
			{
				LOGW("Failed to find a common merge point ...\n");
			}
			else if (node->can_loop_merge_to(merge))
			{
				// Clean merge.
				// This is a unique merge block. There can be no other merge candidate.
				//LOGI("Loop with simple multi-exit merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node),
				//     node->name.c_str(), static_cast<const void *>(node->loop_merge_block),
				//     node->loop_merge_block->name.c_str());

				node->loop_merge_block = merge;
				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
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
				node->loop_merge_block = merge;

				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			}
		}
	}
}

CFGNode *CFGStructurizer::get_target_break_block_for_inner_header(const CFGNode *node, size_t header_index)
{
	CFGNode *inner_header = node->headers[header_index];
	CFGNode *target_header = nullptr;

	for (size_t j = header_index; j && !target_header; j--)
	{
		auto *candidate_header = node->headers[j - 1];

		if (candidate_header->merge == MergeType::Loop)
		{
			// We might have two loops, each at equal scopes.
			// In order to break out to an outer loop, we must verify that the loops actually nest.
			// We must not introduce any backwards branches here.
			CFGNode *candidate_merge = nullptr;
			if (candidate_header->loop_ladder_block)
				candidate_merge = candidate_header->loop_ladder_block;
			else if (candidate_header->loop_merge_block)
				candidate_merge = candidate_header->loop_merge_block;

			if (!candidate_merge)
				continue;

			// Check for backwards branch.
			if (query_reachability(*candidate_merge, *inner_header))
				continue;

			// An outer header is expected to dominate the inner header. Otherwise, they live in
			// separate scopes, and we should look for a header that is further out.
			if (!candidate_header->dominates(inner_header))
				continue;

			target_header = candidate_header;
		}
	}

	return target_header;
}

CFGNode *CFGStructurizer::create_ladder_block(CFGNode *header, CFGNode *node, const char *tag)
{
	auto *ladder = pool.create_node();
	ladder->name = node->name + tag;
	ladder->add_branch(node);
	ladder->ir.terminator.type = Terminator::Type::Branch;
	ladder->ir.terminator.direct_block = node;
	ladder->immediate_post_dominator = node;
	ladder->forward_post_visit_order = node->forward_post_visit_order;
	ladder->backward_post_visit_order = node->backward_post_visit_order;
	ladder->dominance_frontier.push_back(node);

	traverse_dominated_blocks_and_rewrite_branch(header, node, ladder);
	ladder->recompute_immediate_dominator();

	return ladder;
}

CFGNode *CFGStructurizer::get_or_create_ladder_block(CFGNode *node, size_t header_index)
{
	auto *header = node->headers[header_index];
	auto *loop_ladder = header->loop_ladder_block;

	if (!loop_ladder)
	{
		// We don't have a ladder, because the loop merged to an outer scope, so we need to fake a ladder.
		// If we hit this case, we did not hit the simpler case in find_loops().
		auto *ladder = create_ladder_block(header, node, ".merge");
		header->loop_ladder_block = ladder;

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

	if (ladder_to_merge_is_trivial)
	{
		auto *succ = loop_ladder->succ.front();

		// Chase through dummy ladders until we find something tangible that is actually PHI sensitive.
		while (succ->ir.phi.empty() && succ->succ.size() == 1)
			succ = succ->succ.front();

		IncomingValue *incoming_from_ladder = nullptr;
		if (!succ->ir.phi.empty())
		{
			// All PHIs are fundamentally the same w.r.t. input blocks.
			auto &phi = succ->ir.phi.front();
			incoming_from_ladder = phi_incoming_blocks_find_block(phi.incoming, loop_ladder);
		}

		CFGNode *retarget_idom = nullptr;
		if (incoming_from_ladder != nullptr)
		{
			// If succ takes this ladder as a PHI input, we have to be careful.
			// We can only treat this merge as trivial if we can trivially hoist the input to the idom.
			// Hoisting to idom only works if that idom is not already a PHI input for succ,
			// and that idom dominates the input value.
			retarget_idom = loop_ladder->immediate_dominator;

			bool can_hoist_incoming_value =
			    retarget_idom && retarget_idom != loop_ladder &&
			    !phi_incoming_blocks_find_block(succ->ir.phi.front().incoming, retarget_idom);

			if (!can_hoist_incoming_value)
				retarget_idom = nullptr;
		}

		if (retarget_idom)
		{
			bool is_generated = false;

			// We have no opcodes in loop ladder, but theoretically,
			// we can have some PHI values that are being depended on.
			for (auto &override_phi : succ->ir.phi)
			{
				auto *incoming = phi_incoming_blocks_find_block(override_phi.incoming, loop_ladder);
				if (!incoming)
					continue;

				if (id_is_generated_by_block(loop_ladder, incoming->id))
				{
					is_generated = true;
					break;
				}
			}

			if (!is_generated)
			{
				// If we don't generate the ID ourselves and idom dominates this block we can prove
				// that idom is a valid incoming value.
				for (auto &override_phi : succ->ir.phi)
					retarget_phi_incoming_block(override_phi, loop_ladder, retarget_idom);
			}
			else
			{
				// It's not a trivial merge after all :(
				ladder_to_merge_is_trivial = false;
			}
		}
	}

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
		traverse_dominated_blocks_and_rewrite_branch(loop_ladder, new_selection_merge, node);

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
		traverse_dominated_blocks_and_rewrite_branch(header, node, ladder);

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
			traverse_dominated_blocks_and_rewrite_branch(header, node, loop_ladder);
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
			traverse_dominated_blocks_and_rewrite_branch(header, node, ladder_pre);
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
		// If we created a new helper pred block during traversal, it might not
		// exist in forward_post_visit_order.
		// Look for the replacement block here to make sure it gets processed in the appropriate order.
		// The replacement can happen in-line in this function,
		// so there is no chance to re-traverse the CFG.
		// Only consider blocks that we trivially post-dominate and that
		// definitely have no entry in forward_post_visit_order already.
		while (node->headers.empty() &&
		       node->pred.size() == 1 &&
		       node->split_merge_block_candidate &&
		       node->split_merge_block_candidate->forward_post_visit_order == node->forward_post_visit_order &&
		       node->split_merge_block_candidate->succ.size() == 1 &&
		       node->split_merge_block_candidate->succ.front() == node)
		{
			node = node->split_merge_block_candidate;
		}

		if (node->headers.size() <= 1)
			continue;

		assert(!block_is_plain_continue(node));

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
			auto *current_node = node->headers[i];

			// Find innermost loop header scope we can break to when resolving ladders.
			CFGNode *target_header = get_target_break_block_for_inner_header(node, i);

			//LOGI("Current: %s, target: %s.\n", current_node->name.c_str(), target_header->name.c_str());

			if (current_node->merge == MergeType::Loop)
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
						node, current_node, loop_ladder,
						target_header, full_break_target,
						normal_preds[i]);
				}

				// We won't analyze this again, so make sure header knows
				// about the new merge block.
				if (current_node->freeze_structured_analysis)
				{
					if (new_ladder_block)
						current_node->loop_ladder_block = new_ladder_block;
					current_node->loop_merge_block = current_node->loop_ladder_block;
					current_node->loop_ladder_block = nullptr;
				}
			}
			else if (current_node->merge == MergeType::Selection)
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
						traverse_dominated_blocks_and_rewrite_branch(current_node, node, rewrite_to);
					else
						LOGW("No loop merge block?\n");
				}
				else if (full_break_target)
				{
					traverse_dominated_blocks_and_rewrite_branch(current_node, node, full_break_target);
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

bool CFGStructurizer::rewrite_invalid_loop_breaks()
{
	// Keep iterating here until we have validated a clean CFG w.r.t. block-like loops.
	// This should pass through first time without issue with extremely high probability,
	// so hitting the slow path isn't a real concern until proven otherwise.
	CFGNode *rewrite_header = nullptr;
	CFGNode *invalid_target = nullptr;

	// Process from inside out.
	for (auto *node : forward_post_visit_order)
	{
		// Structured loop constructs can end up with problematic merge scenarios where we missed
		// some cases where blocks branch outside our construct.
		// At some point, we were considered mere selection constructs and breaking out of it is fine,
		// but if the selection is promoted to a loop at some point after this analysis, we are a bit screwed.
		// This can happen in complex ladder resolve scenarios.
		// The fix-up means introducing multiple levels of ladder blocks.
		if (node->merge == MergeType::Loop && node->freeze_structured_analysis)
		{
			auto *merge = node->loop_merge_block;
			if (!merge || merge->post_dominates(node))
				continue;

			node->traverse_dominated_blocks([&](CFGNode *candidate) {
				if (candidate == merge || invalid_target)
					return false;

				// If the succ can reach outside the loop construct, we have an error condition.
				for (auto *succ : candidate->succ)
				{
					if (!query_reachability(*succ, *merge))
					{
						// Determine if we're an inner terminate/return, or a loop exit.
						// If the common post-dominator is EXIT node, this is a return-like relationship,
						// and we skip any fixup.
						auto *pdom = CFGNode::find_common_post_dominator(succ, merge);
						if (pdom != nullptr && !pdom->pred.empty())
							invalid_target = succ;
					}
				}
				return true;
			});

			if (invalid_target)
			{
				rewrite_header = node;
				break;
			}
		}
	}

	if (invalid_target)
	{
		auto *merge = rewrite_header->loop_merge_block;
		auto *dispatcher = create_helper_pred_block(merge);
		rewrite_header->loop_merge_block = dispatcher;

		size_t natural_preds = dispatcher->pred.size();
		traverse_dominated_blocks_and_rewrite_branch(rewrite_header, invalid_target, dispatcher);

		PHI phi;
		phi.id = module.allocate_id();
		phi.type_id = module.get_builder().makeBoolType();
		module.get_builder().addName(phi.id, (String("break_selector_") + merge->name).c_str());

		for (size_t i = 0; i < natural_preds; i++)
		{
			IncomingValue incoming = {};
			incoming.block = dispatcher->pred[i];
			incoming.id = module.get_builder().makeBoolConstant(true);
			phi.incoming.push_back(incoming);
		}

		for (size_t i = natural_preds, n = dispatcher->pred.size(); i < n; i++)
		{
			IncomingValue incoming = {};
			incoming.block = dispatcher->pred[i];
			incoming.id = module.get_builder().makeBoolConstant(false);
			phi.incoming.push_back(incoming);
		}

		dispatcher->ir.terminator.type = Terminator::Type::Condition;
		dispatcher->ir.terminator.true_block = merge;
		dispatcher->ir.terminator.false_block = invalid_target;
		dispatcher->ir.terminator.direct_block = nullptr;
		dispatcher->ir.terminator.conditional_id = phi.id;

		dispatcher->ir.phi.push_back(std::move(phi));
		dispatcher->add_branch(invalid_target);

		recompute_cfg();
		return true;
	}

	return false;
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

template <typename Op>
void CFGStructurizer::traverse_dominated_blocks_and_rewrite_branch(const CFGNode *dominator, CFGNode *candidate,
                                                                   CFGNode *from, CFGNode *to, const Op &op,
                                                                   UnorderedSet<const CFGNode *> &visitation_cache)
{
	visitation_cache.insert(candidate);

	for (auto *node : candidate->succ)
	{
		if (!op(node))
			continue;

		if (node == from)
		{
			// Don't introduce a cycle.
			// We only retarget branches when we have "escape-like" edges.
			bool introduces_cycle;

			if (to->forward_post_visit_order == candidate->forward_post_visit_order && to != candidate)
			{
				// Can happen when resolving ladders. We cannot use reachability query, do it slow way.
				introduces_cycle = candidate->can_backtrace_to(to);
			}
			else
				introduces_cycle = query_reachability(*to, *candidate);

			if (!introduces_cycle)
			{
				// If we already have a branch to "to", need to branch there via an intermediate node.
				// This way, we can distinguish between a normal branch and a rewritten branch.
				if (std::find(candidate->succ.begin(), candidate->succ.end(), to) != candidate->succ.end())
					candidate->retarget_branch_with_intermediate_node(from, to);
				else
					candidate->retarget_branch(from, to);
			}
		}
		else if (dominator->dominates(node) && node != to) // Do not traverse beyond the new branch target.
		{
			if (!visitation_cache.count(node))
				traverse_dominated_blocks_and_rewrite_branch(dominator, node, from, to, op, visitation_cache);
		}
	}

	// In case we are rewriting branches to a new merge block, we might
	// change the immediate post dominator for continue blocks inside this loop construct.
	// When analysing post dominance in these cases, we need to make sure that we merge to the new merge block,
	// and not the old one. This avoids some redundant awkward loop constructs.
	for (auto &fake_next : candidate->fake_succ)
	{
		if (fake_next == from)
		{
			candidate->retarget_fake_succ(from, to);
			break;
		}
	}
}

template <typename Op>
void CFGStructurizer::traverse_dominated_blocks_and_rewrite_branch(CFGNode *dominator, CFGNode *from, CFGNode *to,
                                                                   const Op &op)
{
	if (from == to)
		return;

	UnorderedSet<const CFGNode *> visitation_cache;
	traverse_dominated_blocks_and_rewrite_branch(dominator, dominator, from, to, op, visitation_cache);
	dominator->fixup_merge_info_after_branch_rewrite(from, to);
}

void CFGStructurizer::traverse_dominated_blocks_and_rewrite_branch(CFGNode *dominator, CFGNode *from, CFGNode *to)
{
	traverse_dominated_blocks_and_rewrite_branch(dominator, from, to, [](const CFGNode *node) -> bool { return true; });
}
} // namespace dxil_spv
