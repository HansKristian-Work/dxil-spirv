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
	assert(node->succ.size() == 1 || node->succ.size() == 2);

#ifdef PHI_DEBUG
	for (auto *succ : node->succ)
		validate_phi(succ->ir.phi);
#endif

	Vector<CFGNode *> break_nodes;
	auto pred_copy = node->pred;
	auto succ_copy = node->succ;

	for (auto *pred : pred_copy)
	{
		auto *break_node = pool.create_node();
		break_node->name = node->name + ".break." + pred->name;

		break_node->ir.terminator = node->ir.terminator;
		for (auto *succ : succ_copy)
			break_node->add_branch(succ);

		break_node->immediate_post_dominator = node->immediate_post_dominator;
		break_node->immediate_dominator = pred;
		pred->retarget_branch(node, break_node);

		break_nodes.push_back(break_node);

		for (auto &phi : node->ir.phi)
		{
			for (auto &incoming : phi.incoming)
			{
				if (incoming.block == pred)
				{
					incoming.block = break_node;
					// We have no opcodes in this block, but we may depend on a PHI variable to do conditional branch.
					if (phi.id == break_node->ir.terminator.conditional_id)
						break_node->ir.terminator.conditional_id = incoming.id;
				}
			}
		}
	}
	assert(node->pred.empty());

	for (auto *succ : node->succ)
	{
		for (auto &phi : succ->ir.phi)
		{
			// Find incoming ID from the block we're splitting up.
			auto incoming_itr = std::find_if(phi.incoming.begin(), phi.incoming.end(),
			                                 [&](const IncomingValue &incoming) { return incoming.block == node; });

			assert(incoming_itr != phi.incoming.end());
			spv::Id incoming_from_node = incoming_itr->id;
			phi.incoming.erase(incoming_itr);

			// Try to see if the ID is a PHI that was generated by this block.
			auto outgoing_itr = std::find_if(node->ir.phi.begin(), node->ir.phi.end(),
			                                 [&](const PHI &phi) { return phi.id == incoming_from_node; });

			if (outgoing_itr != node->ir.phi.end())
			{
				// If it was then we need to split up the PHI node. The break block will serve as a proxy
				// incoming block instead.
				phi.incoming.insert(phi.incoming.end(), outgoing_itr->incoming.begin(), outgoing_itr->incoming.end());
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

		// Remove any lingering pred, since node is now unreachable, and if we do more transforms without
		// recomputing CFG, we'll add impossible PHI inputs.
		auto erase_itr = std::find(succ->pred.begin(), succ->pred.end(), node);
		if (erase_itr != succ->pred.end())
			succ->pred.erase(erase_itr);
	}

	node->ir.phi.clear();
}

bool CFGStructurizer::cleanup_breaking_return_constructs()
{
	unsigned post_dominating_returns = 0;
	CFGNode *split_candidate = nullptr;

	for (auto *node : forward_post_visit_order)
	{
		if (node->ir.terminator.type != Terminator::Type::Return)
			continue;

		// If this block is only serving to return, it's meaningless to merge.
		// It will only complicate the CFG.
		if (node->ir.operations.empty() && node->num_forward_preds() > 1 && !node->post_dominates_any_work())
		{
			split_candidate = node;
		}
		else
		{
			// If we're actually post-dominating other blocks, the split candidate is relevant.
			for (auto *pred : node->pred)
			{
				if (node->post_dominates(pred))
				{
					post_dominating_returns++;
					break;
				}
			}
		}
	}

	// Only bother if we have more than one return and at least another return that is actually post-dominating
	// work. Avoids potential false positives.
	if (!post_dominating_returns)
		return false;

	if (split_candidate)
	{
		auto preds = split_candidate->pred;

		for (auto *pred : preds)
		{
			auto *dummy_return = pool.create_node();
			dummy_return->name = split_candidate->name + ".dup";
			dummy_return->immediate_dominator = split_candidate->immediate_dominator;
			dummy_return->immediate_post_dominator = exit_block;
			dummy_return->forward_post_visit_order = split_candidate->forward_post_visit_order;
			dummy_return->backward_post_visit_order = split_candidate->backward_post_visit_order;
			dummy_return->ir.terminator.type = Terminator::Type::Return;
			pred->retarget_branch(split_candidate, dummy_return);
		}

		// Iterate until we are done.
		recompute_cfg();
		return true;
	}

	return false;
}

bool CFGStructurizer::block_is_breaking_phi_construct(const CFGNode *node) const
{
	// Only bother with blocks which don't do anything useful work.
	// The only opcodes they should have are PHI nodes and a (conditional) branch.
	if (!node->ir.operations.empty())
		return false;
	if (node->pred.size() <= 1)
		return false;

	// Don't bother with anything that could be considered load bearing.
	if (node->post_dominates_perfect_structured_construct())
		return false;

	// Anything related to loop/continue blocks, we don't bother with.
	if (node->succ_back_edge || node->pred_back_edge)
		return false;

	if (node->succ.size() == 1)
	{
		if (node->ir.terminator.type != Terminator::Type::Branch)
			return false;
	}
	else if (node->succ.size() == 2)
	{
		if (node->ir.terminator.type != Terminator::Type::Condition)
			return false;
	}
	else
		return false;

	for (auto *succ : node->succ)
	{
		if (node->dominates(succ))
			return false;

		// Checks if either the merge block or successor is sensitive to PHI somehow.
		if (!ladder_chain_has_phi_dependencies(succ, node))
			return false;
	}

	// This is a merge block candidate for a loop, don't split.
	// It will only confuse things where we'll need to re-merge the split blocks anyways.
	for (auto *pred : node->pred)
		if (pred->succ_back_edge)
			return false;

	// A more complicated case where we want the block to remain as a ladder block.
	auto *loop_header = get_innermost_loop_header_for(node);
	if (loop_header && loop_header->pred_back_edge &&
	    loop_header->dominates(node) && loop_header->pred_back_edge->succ.empty())
	{
		bool merge_is_outside_loop = !query_reachability(*node, *loop_header->pred_back_edge);
		if (merge_is_outside_loop)
		{
			auto *header_pdom = loop_header->pred_back_edge->immediate_post_dominator;

			// We only want to avoid the split when this is a meaningful ladder.
			// If the paths all end up in the same merge anyway, it's safer to split.
			for (auto *df : node->dominance_frontier)
				if (df == header_pdom)
					return true;

			for (auto *pdf : node->post_dominance_frontier)
			{
				// We can't reach, but the PDF can. We're confident we're a loop exit.
				if (query_reachability(*pdf, *loop_header->pred_back_edge))
					return false;
			}
		}
	}

	return true;
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

		if (block_is_breaking_phi_construct(node))
		{
			eliminate_node_link_preds_to_succ(node);
			did_work = true;
		}
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

void CFGStructurizer::set_driver_version(uint32_t driver_id_, uint32_t driver_version_)
{
	driver_id = driver_id_;
	driver_version = driver_version_;
}

bool CFGStructurizer::find_single_entry_exit_lock_region(
	CFGNode *&idom, CFGNode *&pdom, const Vector<CFGNode *> &rov_blocks)
{
	// If the lock region has multiple instances, i.e. a loop, give up right away, unless the construct is simple
	// and we can trivially do:
	// begin(); for(;;) {} end();
	// For this to work, all ROV blocks must be contained by one loop. The must be a trivial input branch to the loop
	// header, and trivial exit out of the loop, i.e. one loop exit which is covered by the continue block.
	auto *outermost_loop_header = idom ? const_cast<CFGNode *>(get_innermost_loop_header_for(entry_block, idom)) : nullptr;

	while (outermost_loop_header && outermost_loop_header != entry_block)
	{
		auto *innermost_loop_header = const_cast<CFGNode *>(
		    get_innermost_loop_header_for(entry_block, outermost_loop_header->immediate_dominator));

		// Stop right before we hit the entry block.
		if (innermost_loop_header && innermost_loop_header != entry_block)
			outermost_loop_header = innermost_loop_header;
		else
			break;
	}

	if (idom && outermost_loop_header != entry_block)
	{
		// First, all ROV blocks must be inside the loop construct.
		for (auto *rov : rov_blocks)
		{
			if (!outermost_loop_header->dominates(rov) ||
			    !query_reachability(*rov, *outermost_loop_header->pred_back_edge))
			{
				// Cannot promote directly. Can only promote if idom is entered once.
				return execution_path_is_single_entry_and_dominates_exit(idom, pdom);
			}
		}

		idom = outermost_loop_header;

		auto analysis = analyze_loop(outermost_loop_header);
		auto merge = analyze_loop_merge(outermost_loop_header, analysis);
		if (!merge.merge || !merge.dominated_merge || merge.infinite_continue_ladder ||
		    merge.merge != merge.dominated_merge)
		{
			return false;
		}
		else
		{
			pdom = merge.merge;
		}

		// We must insert the lock before entering loop.
		// This only works if we have exactly one pred and that pred directly branches to us.
		if (idom->pred.size() == 1 && idom->pred.front()->ir.terminator.type == Terminator::Type::Branch)
			idom = idom->pred.front();
		else
			return false;
	}

	return true;
}

bool CFGStructurizer::execution_path_is_single_entry_and_dominates_exit(CFGNode *idom, CFGNode *pdom)
{
	if (!idom->dominates_all_reachable_exits())
		return false;

	pdom = CFGNode::find_common_post_dominator(pdom, idom);

	bool internal_early_return = !pdom || pdom->immediate_post_dominator == pdom;
	if (internal_early_return)
		return false;

	// If we're dominating all reachable exits despite being inside a loop, it's okay to use ROV as-is.
	// We have proven that this path will only be executed once per thread.
	// We will have to make sure that this exit path doesn't loop itself.
	// Just prove this by making sure there are no back-edges on the path from idom to pdom.
	// If there are back-edges that loop back to an earlier header, that is covered by dominates_all_reachable_exits.

	if (idom->pred_back_edge || !idom->dominates(pdom))
		return false;

	while (pdom != idom)
	{
		if (pdom->pred_back_edge)
			return false;
		pdom = pdom->immediate_dominator;
	}

	return true;
}

void CFGStructurizer::flatten_subgroup_shuffles()
{
	recompute_cfg();

	// Look for cases where shuffles happen inside small branches.
	// This comes up due to HLSL's short-cicruit rules.
	for (auto *n : forward_post_visit_order)
	{
		// Only care about blocks which don't dominate anything.
		if (n->succ.size() != 1 || n->dominance_frontier.size() != 1 || n->dominance_frontier.front() != n->succ.front())
			continue;
		if (n->pred.size() != 1)
			continue;
		if (!n->pred.front()->dominates(n->succ.front()))
			continue;
		if (n->pred.front()->succ.size() != 2)
			continue;

		// There's a limit to how much we want to peephole.
		if (n->ir.operations.size() > 4)
			continue;

		// We don't want to hoist if both sides of the branch have meaningful work associated with them.
		auto *succ = n->succ.front();
		auto *pred = n->pred.front();
		auto *sibling0 = pred->succ[0];
		auto *sibling1 = pred->succ[1];

		if (sibling0 != succ && sibling0 != n && !sibling0->ir.operations.empty())
			continue;
		if (sibling1 != succ && sibling1 != n && !sibling1->ir.operations.empty())
			continue;

		// Now we've detected:
		// if (blah) { a = shuffle(); } phi(a);

		bool has_dubious_shuffle = false;

		for (auto *op : n->ir.operations)
		{
			if (op->op == spv::OpGroupNonUniformShuffle || op->op == spv::OpGroupNonUniformBroadcast)
			{
				for (auto &phi : n->succ.front()->ir.phi)
				{
					for (auto &incoming : phi.incoming)
					{
						if (incoming.id == op->id)
						{
							has_dubious_shuffle = true;
							goto out;
						}
					}
				}
			}
		}
	out:

		if (has_dubious_shuffle)
		{
			// Now the question is if it's safe to do this. There can be nothing control dependent (except for shuffles).
			for (auto *op : n->ir.operations)
			{
				if (op->op == spv::OpGroupNonUniformShuffle ||
				    op->op == spv::OpGroupNonUniformBroadcast)
					continue;

				if (op->op == spv::OpLoad)
				{
					// Only allow loads if it's loading from plain OpVariables.
					// Hoisting a buffer read is not acceptable.
					if (!module.get_builder().hasDecoration(op->arguments[0], spv::DecorationBuiltIn))
					{
						has_dubious_shuffle = false;
						break;
					}
				}

				if (SPIRVModule::opcode_is_control_dependent(op->op) || op->id == 0 ||
				    SPIRVModule::opcode_has_side_effect_and_result(op->op))
				{
					has_dubious_shuffle = false;
					break;
				}
			}
		}

		if (has_dubious_shuffle)
		{
			for (auto *op : n->ir.operations)
				n->pred.front()->ir.operations.push_back(op);
			n->ir.operations.clear();
		}
	}
}

void CFGStructurizer::rewrite_auto_group_shared_barrier()
{
	recompute_cfg();

	enum class Kind { None, Load, Store, Atomic };

	struct Block
	{
		CFGNode *node;
		const CFGNode *innermost_loop;
		Kind pre_kind;
		Kind post_kind;
	};

	// In linear traversal order, find all BBs that use group shared.
	Vector<Block> shared_blocks;

	for (size_t i = forward_post_visit_order.size(); i; i--)
	{
		auto *node = forward_post_visit_order[i - 1];
		for (auto *op : node->ir.operations)
		{
			if ((op->flags & Operation::AutoGroupSharedBarrier) != 0)
			{
				shared_blocks.push_back({ node, get_innermost_loop_header_for(node), Kind::None, Kind::None });
				break;
			}
		}
	}

	// Deal with intra-BB hazards.
	for (auto &block : shared_blocks)
	{
		Kind pending = Kind::None;

		// If we're the first BB to access shared, no need for a post block.
		// Similar for the last block.
		// Loops can complicate this analysis, but ... eh.
		// This is a workaround, not required by spec or anything.

		for (auto *op : block.node->ir.operations)
		{
			if ((op->flags & Operation::AutoGroupSharedBarrier) != 0)
			{
				if (op->op == spv::OpLoad || op->op == spv::PseudoOpMaskedLoad)
				{
					if (pending != Kind::Load && pending != Kind::None)
						op->flags |= Operation::SubgroupSyncPre;
					pending = Kind::Load;
				}
				else if (op->op == spv::OpStore || op->op == spv::PseudoOpMaskedStore)
				{
					if (pending != Kind::Store && pending != Kind::None)
						op->flags |= Operation::SubgroupSyncPre;
					pending = Kind::Store;
				}
				else
				{
					if (pending != Kind::Atomic && pending != Kind::None)
						op->flags |= Operation::SubgroupSyncPre;
					pending = Kind::Atomic;
				}

				if (block.pre_kind == Kind::None)
					block.pre_kind = pending;
			}
		}

		block.post_kind = pending;
	}

	for (size_t i = 0; i < shared_blocks.size(); i++)
	{
		auto &first = shared_blocks[i];

		for (size_t j = i + 1; j < shared_blocks.size(); j++)
		{
			auto &second = shared_blocks[j];
			if (!query_reachability(*first.node, *second.node))
				continue;

			if (first.post_kind != second.pre_kind)
			{
				// Find an intermediate block which:
				// - post dominates the first
				// - dominates the second
				// Has the maximal number of invocations.
				// The subgroup barrier should be run with as many threads as possible.
				if (second.node->post_dominates(first.node))
					second.node->ir.operations.front()->flags |= Operation::SubgroupSyncPre;
				else if (first.node->dominates(second.node))
					first.node->ir.operations.back()->flags |= Operation::SubgroupSyncPost;
				else
				{
					// Try to find some intermediate node. If we cannot find it, just yolo in a barrier
					// somewhere. This is just a workaround, so if it doesn't work 100%, it's not a big deal.
					auto *pdom = first.node->immediate_post_dominator;
					while (pdom && query_reachability(*pdom, *second.node) && !pdom->dominates(second.node) &&
					       pdom->immediate_post_dominator && pdom->immediate_post_dominator != pdom)
					{
						pdom = pdom->immediate_post_dominator;
					}

					if (pdom && pdom != second.node)
					{
						if (pdom->ir.operations.empty())
						{
							auto *nop = module.allocate_op(spv::OpNop);
							nop->flags |= Operation::SubgroupSyncPost;
							pdom->ir.operations.push_back(nop);
						}
						else
							pdom->ir.operations.back()->flags |= Operation::SubgroupSyncPost;
					}
					else if (pdom == second.node)
					{
						second.node->ir.operations.front()->flags |= Operation::SubgroupSyncPre;
					}
				}

				// We've added appropriate barriers for this node now.
				second.pre_kind = Kind::None;
			}

			break;
		}

		// Analyze re-entrant code. We may depend on memory coming from an earlier loop iteration.
		if (first.pre_kind != Kind::None && first.innermost_loop != entry_block && first.innermost_loop->pred_back_edge)
		{
			bool has_complex_dependency = false;
			// Other blocks within the loop may require a dependency.
			for (size_t j = i + 1; j < shared_blocks.size() && !has_complex_dependency; j++)
			{
				if (query_reachability(*shared_blocks[j].node, *first.innermost_loop->pred_back_edge))
				{
					first.node->ir.operations.front()->flags |= Operation::SubgroupSyncPre;
					has_complex_dependency = true;
				}
			}

			if (!has_complex_dependency && first.pre_kind != first.post_kind)
			{
				// Self-dependency within the BB.
				first.node->ir.operations.back()->flags |= Operation::SubgroupSyncPost;
			}
		}
	}
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

	auto *pdom = find_common_post_dominator(rov_blocks);

	if (!find_single_entry_exit_lock_region(idom, pdom, rov_blocks) ||
	    !idom || !idom->dominates(pdom))
	{
		idom = nullptr;
		pdom = nullptr;
	}

	// Stretch post-dominator if we need to.
	if (idom && pdom)
		pdom = CFGNode::find_common_post_dominator(pdom, idom);

	bool internal_early_return = !pdom || pdom->immediate_post_dominator == pdom;

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

void CFGStructurizer::rewrite_multiple_back_edges()
{
	reset_traversal();
	visit_for_back_edge_analysis(*entry_block);
}

void CFGStructurizer::sink_ssa_constructs()
{
	sink_ssa_constructs_run(true);
	sink_ssa_constructs_run(false);
}

void CFGStructurizer::sink_ssa_constructs_run(bool dry_run)
{
	// First, propagate sinkability state to any operation that uses a sinkable SSA.
	// If an SSA expression is used in a BB, but that use of the SSA can be sunk, we need to
	// sink everything as a group.
	Vector<spv::Id> sinkable_ops;

	struct RewriteState
	{
		CFGNode *consumed_block;
		Operation *op;
	};
	UnorderedMap<spv::Id, RewriteState> sinks;

	for (auto *n : forward_post_visit_order)
	{
		sinkable_ops.clear();

		auto &ops = n->ir.operations;
		for (auto *op : ops)
		{
			if ((op->flags & Operation::SinkableBit) != 0)
			{
				sinkable_ops.push_back(op->id);
				sinks[op->id] = { nullptr, op };
			}
			else if (op->id && !SPIRVModule::opcode_is_control_dependent(op->op) &&
			         !SPIRVModule::opcode_has_side_effect_and_result(op->op))
			{
				// We cannot sink any opcode which is control dependent, or has side effects.
				for (uint32_t i = 0; i < op->num_arguments; i++)
				{
					if ((op->literal_mask & (1u << i)) != 0)
						continue;

					spv::Id consumed_id = op->arguments[i];
					if (std::find(sinkable_ops.begin(), sinkable_ops.end(), consumed_id) != sinkable_ops.end())
					{
						sinkable_ops.push_back(op->id);
						op->flags |= Operation::DependencySinkableBit;
						sinks[op->id] = { nullptr, op };
						break;
					}
				}
			}
			else if (op->op == spv::OpControlBarrier || op->op == spv::OpMemoryBarrier)
			{
				// We cannot sink beyond this barrier. Invalidate every sinkable op we saw so far.
				for (spv::Id id : sinkable_ops)
				{
					auto *op_ptr = sinks[id].op;
					assert(op_ptr);
					op_ptr->flags &= ~(Operation::SinkableBit | Operation::DependencySinkableBit);
				}
				sinkable_ops.clear();
			}
		}
	}

	// If an expression is used as a PHI input assume we cannot sink.
	// It gets a bit awkward to deal with this, and it's not required for this workaround pass.
	for (auto *n : forward_post_visit_order)
	{
		for (auto &phi : n->ir.phi)
		{
			for (auto &incoming : phi.incoming)
			{
				auto itr = sinks.find(incoming.id);
				if (itr != sinks.end())
				{
					auto *op_ptr = itr->second.op;
					assert(op_ptr);
					op_ptr->flags &= ~(Operation::SinkableBit | Operation::DependencySinkableBit);
				}
			}
		}
	}

	const auto consume_id = [&](spv::Id consumed_id, CFGNode *n) {
		auto itr = sinks.find(consumed_id);
		if (itr != sinks.end())
		{
			if (!itr->second.consumed_block)
				itr->second.consumed_block = n;
			else if (itr->second.consumed_block != n)
				itr->second.op->flags &= ~(Operation::SinkableBit | Operation::DependencySinkableBit);
		}
	};

	const auto path_is_reorderable = [&](const CFGNode *src, const CFGNode *dst) {
		// There cannot be any control or memory barriers along the way, or we have to be conservative.

		// There is absolutely no point in sinking if dst ends up post-dominating src anyway.
		// We cannot avoid any bug from happening.
		if (dst->post_dominates(src))
			return false;

		// Never sink into a loop.
		if (dst->pred_back_edge)
			return false;

		// Could deal with multiple preds, but we mostly just care about trivial sinks.
		if (dst->pred.size() > 1)
			return false;
		dst = dst->immediate_dominator;

		while (src != dst)
		{
			if (dst->pred.size() > 1 || dst->pred_back_edge)
				return false;

			for (auto *op : dst->ir.operations)
				if (op->op == spv::OpControlBarrier || op->op == spv::OpMemoryBarrier)
					return false;

			dst = dst->pred.front();
		}

		// We reached src, and we validated that block already when deciding on what is sinkable or not, so we're good.
		return true;
	};

	// Walk all instructions in reverse order.
	// We can sink an instruction if:
	// - An ID was only consumed in a BB != generating BB.
	//   The consumed BB must be unique for us to consider it for simplicity.
	for (auto *n : forward_post_visit_order)
	{
		if (n->ir.terminator.type == Terminator::Type::Condition ||
		    n->ir.terminator.type == Terminator::Type::Switch)
		{
			consume_id(n->ir.terminator.conditional_id, n);
		}

		auto &ops = n->ir.operations;

		for (size_t i = ops.size(); i; i--)
		{
			auto *op = ops[i - 1];
			auto *target_block = n;

			if (op->id && (op->flags & (Operation::SinkableBit | Operation::DependencySinkableBit)) != 0)
			{
				auto sink_itr = sinks.find(op->id);

				if (sink_itr != sinks.end() &&
				    sink_itr->second.consumed_block &&
				    sink_itr->second.consumed_block != n &&
				    path_is_reorderable(n, sink_itr->second.consumed_block))
				{
					// Move the operation to the beginning of the consumed block instead.
					target_block = sink_itr->second.consumed_block;

					// Don't actually move the instruction until we have confirmed the entire chain can be sunk,
					// otherwise this exercise is meaningless.
					if (!dry_run)
					{
						target_block->ir.operations.insert(target_block->ir.operations.begin(), op);
						ops.erase(ops.begin() + int(i - 1));
					}
				}
				else
				{
					// This failed to sink. Remember this for the next run.
					op->flags &= ~Operation::SinkableBit;
				}
			}

			// Mark uses after we have sunk the instruction. This allows us to sink a chain of SSA instructions.
			for (uint32_t j = 0; j < op->num_arguments; j++)
				if ((op->literal_mask & (1u << j)) == 0)
					consume_id(op->arguments[j], target_block);
		}
	}

	if (dry_run)
		for (auto *n : forward_post_visit_order)
			for (auto *op : n->ir.operations)
				op->flags &= ~Operation::DependencySinkableBit;
}

void CFGStructurizer::propagate_branch_control_hints()
{
	for (auto *n : forward_post_visit_order)
	{
		if (n->pred_back_edge)
		{
			if (n->pred_back_edge->ir.terminator.force_loop)
				n->ir.merge_info.loop_control_mask = spv::LoopControlDontUnrollMask;
			else if (n->pred_back_edge->ir.terminator.force_unroll)
				n->ir.merge_info.loop_control_mask = spv::LoopControlUnrollMask;
		}

		if (n->ir.terminator.type == Terminator::Type::Condition)
		{
			if (n->ir.terminator.force_flatten)
				n->ir.merge_info.selection_control_mask = spv::SelectionControlFlattenMask;
			else if (n->ir.terminator.force_branch)
				n->ir.merge_info.selection_control_mask = spv::SelectionControlDontFlattenMask;
		}

		// Both are possible if a selection construct is also a loop header.
	}
}

bool CFGStructurizer::rewrite_impossible_back_edges()
{
	bool did_rewrite = false;

	for (auto *node : forward_post_visit_order)
	{
		if (!node->succ_back_edge)
			continue;

		// Make sure that the continue block in question branches to the innermost loop header.
		// If this is not the case, it is not a valid structured CFG.
		// In unstructured CFG, as long as the continue block cannot reach the back-edge of any inner loop constructs,
		// it's technically not considered part of their loops, even if the loops dominate it.
		// Utter nonsense ... >_<
		// The only viable solution is to transpose out the continue block and use ladder selection
		// to resolve the control flow.

		auto *header = get_innermost_loop_header_for(node);
		if (header == node->succ_back_edge)
			continue;

		// Make sure that we're in valid unstructured control flow. Our node cannot reach any back edge on the way,
		// meaning it's okay to transpose code. If the continue block can reach us, it means we're already
		// outside the loop, stop any attempt to transpose.
		const auto validate_header_suitability = [this, node](const CFGNode *header) {
			return !query_reachability(*node, *header->pred_back_edge) &&
			       !query_reachability(*header->pred_back_edge, *node);
		};

		// Find a more appropriate place to put it.
		// We want to rewrite the flow so that the continue block lives outside any inner scopes.
		// The succ of the outer continue block is appropriate.
		const CFGNode *next_header;
		while ((next_header = get_innermost_loop_header_for(header->immediate_dominator)) != node->succ_back_edge &&
		       validate_header_suitability(next_header))
		{
			header = next_header;
		}

		if (next_header != node->succ_back_edge || !validate_header_suitability(header))
			continue;

		auto *outer_continue = header->pred_back_edge;

		// The outer continue must have a normal succ.
		if (outer_continue->succ.size() != 1)
			continue;

		// This succ is now in the loop scope of node->succ_back_edge. We can do the continue construct here.
		auto *succ = outer_continue->succ.front();
		auto *ladder = create_helper_pred_block(succ);

		auto orig_preds = node->pred;
		traverse_dominated_blocks_and_rewrite_branch(node->succ_back_edge, node, ladder);
		rewrite_ladder_conditional_branch_from_incoming_blocks(
			ladder, node, succ,
			[&orig_preds](const CFGNode *n) { return std::find(orig_preds.begin(), orig_preds.end(), n) != orig_preds.end(); },
			"tranpose_continue_phi");

		did_rewrite = true;
		break;
	}

	if (did_rewrite)
		recompute_cfg();
	return did_rewrite;
}

bool CFGStructurizer::run()
{
	String graphviz_path;
	if (const char *env = getenv("DXIL_SPIRV_GRAPHVIZ_PATH"))
		graphviz_path = env;

	// We make the assumption during traversal that there is only one back edge.
	// Fix this up here.
	rewrite_multiple_back_edges();

	//log_cfg("Input state");
	if (!graphviz_path.empty())
	{
		reset_traversal();
		visit(*entry_block);
		auto graphviz_input = graphviz_path + ".input";
		log_cfg_graphviz(graphviz_input.c_str());
	}

	recompute_cfg();
	sink_ssa_constructs();
	propagate_branch_control_hints();

	cleanup_breaking_phi_constructs();

	if (!graphviz_path.empty())
	{
		auto graphviz_split = graphviz_path + ".phi-split";
		log_cfg_graphviz(graphviz_split.c_str());
	}

	while (cleanup_breaking_return_constructs())
	{
		if (!graphviz_path.empty())
		{
			auto graphviz_split = graphviz_path + ".break-return";
			log_cfg_graphviz(graphviz_split.c_str());
		}
	}

	create_continue_block_ladders();

	while (serialize_interleaved_merge_scopes())
	{
		if (!graphviz_path.empty())
		{
			auto graphviz_split = graphviz_path + ".serialize";
			log_cfg_graphviz(graphviz_split.c_str());
		}
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
		if (!graphviz_path.empty())
		{
			auto graphviz_split = graphviz_path + ".transpose-loop-rewrite";
			log_cfg_graphviz(graphviz_split.c_str());
		}
	}

	// If there are back-edges that punch through multiple loop headers, fix this up.
	while (rewrite_impossible_back_edges())
	{
		if (!graphviz_path.empty())
		{
			auto graphviz_split = graphviz_path + ".impossible-continue";
			log_cfg_graphviz(graphviz_split.c_str());
		}
	}

	//LOGI("=== Structurize pass ===\n");
	while (structurize(0))
	{
		recompute_cfg();
		if (!graphviz_path.empty())
		{
			auto graphviz_final = graphviz_path + ".partial-struct0";
			log_cfg_graphviz(graphviz_final.c_str());
		}
	}

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
		// This is the merge block of another inner loop, we really need an intermediate merge.
		if (pred->succ_back_edge && header != pred->succ_back_edge && header->dominates(pred->succ_back_edge))
			return true;
	}

	// Plain continue block that does nothing useful. No point merging this.
	// A continue block's succ is sometimes used to aid analysis and simplify other passes,
	// use terminator here explicitly.
	if (node->ir.operations.empty() && node->ir.terminator.type == Terminator::Type::Branch)
		return false;

	if (header->ir.terminator.type == Terminator::Type::Switch)
	{
		// If the loop header is also a switch statement, there can be some nasty edge cases.
		// We likely never intend for the continue block to be maximally convergent here
		// if the natural merge block is not the continue block.
		auto *merge = find_common_post_dominator(header->succ);
		auto *natural_merge = find_natural_switch_merge_block(header, merge);
		if (merge == node && natural_merge != merge)
			return false;
	}

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
			}
		}

		// If we have a situation where a switch block inside our loop uses the continue block
		// as a continue target, it's important that we keep this block as a continue block,
		// otherwise, it will complicate the switch block greatly.
		if (pred->ir.terminator.type == Terminator::Type::Switch && !node->post_dominates(pred))
			return false;
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

		// Never duplicate back-edges.
		if (node->succ_back_edge)
			continue;

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
		    !node->is_pseudo_back_edge &&
		    node->succ.size() == 1 &&
		    node->ir.terminator.type == Terminator::Type::Branch &&
		    node->merge == MergeType::None &&
		    // Loop merge targets are sacred, and must not be removed.
		    structured_loop_merge_targets.count(node) == 0 &&
		    !ladder_chain_has_phi_dependencies(node->succ.front(), node))
		{
			auto check_is_load_bearing_continue_succ = [node](const CFGNode *n) {
				if (!n->succ_back_edge)
					return false;

				// If we eliminate the block, we want the succ to post-dominate the header,
				// so it can be considered a merge block.
				// Similarly, we want the header to dominate the succ.
				if (!node->succ.front()->post_dominates(n->succ_back_edge))
					return true;
				if (!n->succ_back_edge->dominates(node->succ.front()))
					return true;

				// No point in eliminating since we're inside the construct.
				if (n->dominates(node))
					return true;

				return false;
			};

			// If any pred is a continue block, this block is also load-bearing, since it can be used as a merge block.
			// Even if a continue block branches to us, it may be a fake load bearing block.
			// If the succ of node post-dominates the entire loop construct, we can eliminate the block safely
			// since we're not taking away a nice merge target.
			if (std::find_if(node->pred.begin(), node->pred.end(), check_is_load_bearing_continue_succ) != node->pred.end())
				continue;

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

				pred->dominance_frontier.clear();
				// Propagates any idom information up to pred if pred dominates succ.
				recompute_dominance_frontier(succ);
				recompute_dominance_frontier(pred);
			}
			else if (merge_candidate_is_inside_continue_construct(node) || merge_candidate_is_on_breaking_path(node))
			{
				// If we have two or more preds, we have to be really careful.
				// If this node is on a breaking path, without being important for merging control flow,
				// it is fine to eliminate the block.
				did_work = true;
				auto tmp_pred = node->pred;
				for (auto *pred : tmp_pred)
					pred->retarget_branch_with_intermediate_node(node, node->succ.front());

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
		const Operation *rematerialize_op;
	};

	UnorderedMap<spv::Id, Origin> origin;
	UnorderedMap<spv::Id, Vector<CFGNode *>> id_to_non_local_consumers;

	// First, scan through all blocks and figure out which block creates an ID.
	for (auto *node : forward_post_visit_order)
	{
		for (auto *op : node->ir.operations)
		{
			// OpVariable is always hoisted to function entry or above.
			// It can never not have dominance relationship.
			if (op->op != spv::OpVariable && op->id)
				origin[op->id] = { node, op->type_id, op->op == spv::OpSampledImage ? op : nullptr };
		}

		for (auto &phi : node->ir.phi)
			origin[phi.id] = { node, phi.type_id, nullptr };
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
		if (!origin_node->dominates(node) || (origin_itr->second.rematerialize_op && node != origin_node))
		{
			// We have a problem. Mark that we need to rewrite a certain variable.
			id_to_non_local_consumers[id].push_back(node);
		}
	};

	// Need value copy here since we might be updating node->ir.operations inline leading to iterator invalidation.
	Vector<Operation> access_chain_operations;

	// Now, scan through all blocks and figure out which values are consumed in different blocks.
	for (auto *node : forward_post_visit_order)
	{
		for (auto *op : node->ir.operations)
		{
			auto literal_mask = op->literal_mask;
			for (unsigned i = 0; i < op->num_arguments; i++)
				if (((1u << i) & literal_mask) == 0)
					mark_node_value_access(node, op->arguments[i]);

			// We're only interested in bindless-style access here.
			if (op->op == spv::OpAccessChain)
				access_chain_operations.push_back(*op);
		}

		// Incoming PHI values are handled elsewhere by modifying the incoming block to the creating block.
		// Ignore these kinds of usage here.

		if (node->ir.terminator.conditional_id != 0)
			mark_node_value_access(node, node->ir.terminator.conditional_id);
		if (node->ir.terminator.return_value != 0)
			mark_node_value_access(node, node->ir.terminator.return_value);
	}

	for (auto &chain_op : access_chain_operations)
	{
		auto itr = id_to_non_local_consumers.find(chain_op.id);
		if (itr != id_to_non_local_consumers.end())
		{
			// We will need to sink the AccessChain.
			// Make sure the resource index is also marked as used in potentially non-local block.

			// Sort for deterministic output.
			Vector<CFGNode *> local_consumers_sorted;
			for (auto *non_local_node : itr->second)
				local_consumers_sorted.push_back(non_local_node);

			std::sort(local_consumers_sorted.begin(), local_consumers_sorted.end(),
			          [](const CFGNode *a, const CFGNode *b) {
			              return a->forward_post_visit_order < b->forward_post_visit_order;
			          });

			auto literal_mask = chain_op.literal_mask;

			// The first access chain is always OpVariable, so don't bother checking that.
			for (unsigned i = 1; i < chain_op.num_arguments; i++)
			{
				if (((1u << i) & literal_mask) == 0)
				{
					for (auto *non_local_node : local_consumers_sorted)
						mark_node_value_access(non_local_node, chain_op.arguments[i]);
				}
			}

			auto *sunk_chain = module.allocate_op();
			*sunk_chain = chain_op;
			sunk_chain->id = module.allocate_id();

			if (module.get_builder().hasDecoration(chain_op.id, spv::DecorationNonUniform))
				module.get_builder().addDecoration(chain_op.id, spv::DecorationNonUniform);

			for (auto *non_local_node : local_consumers_sorted)
			{
				auto &ops = non_local_node->ir.operations;
				rewrite_consumed_ids(non_local_node->ir, chain_op.id, sunk_chain->id);
				ops.insert(ops.begin(), sunk_chain);
			}
		}
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

		// We don't rely on VariablePointers, so if this comes up, we need to figure out something else.
		bool is_invalid_pointer = module.get_builder().isPointerType(orig.type_id);

		if (orig.rematerialize_op)
		{
			auto *rematerialize_op = module.allocate_op();
			*rematerialize_op = *orig.rematerialize_op;
			rematerialize_op->id = module.allocate_id();

			if (module.get_builder().hasDecoration(orig.rematerialize_op->id, spv::DecorationNonUniform))
				module.get_builder().addDecoration(rematerialize_op->id, spv::DecorationNonUniform);

			for (auto *consumer : *rewrite.consumers)
			{
				rewrite_consumed_ids(consumer->ir, rewrite.id, rematerialize_op->id);
				consumer->ir.operations.insert(consumer->ir.operations.begin(), rematerialize_op);
			}
		}
		else if (!is_invalid_pointer)
		{
			// Invalid access chains are resolved above. We end up rewriting any non-dominated values instead.
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
}

void CFGStructurizer::insert_phi()
{
	// If we inserted dummy branches from back-edge to rewrite infinite loops, we must prune these branches
	// now, so we don't end up creating a wrong amount of PHI incoming values.
	// We don't have to recompute the CFG since we don't really care about post-visit orders at this stage.
	for (auto *node : forward_post_visit_order)
	{
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
			succ->recompute_immediate_dominator();
		}
	}

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
	auto &phi = node.block->ir.phi[node.phi_index];
	auto &incomings = phi.incoming;

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
			bool hoist_incoming = true;
			if (phi_incoming_blocks_find_block(incomings, source_block) != nullptr)
			{
				// Sanity check. This would create ambiguity.
				hoist_incoming = false;
			}

			// Don't hoist PHI inputs across the loop header boundary.
			if (incoming.block->succ_back_edge && query_reachability(*source_block, *incoming.block->succ_back_edge))
			{
				// If this happens somehow, we have a problem. It's a bit unclear how this is supposed to work.
				// It's possible we'd need to synthesize a fake input to back-edge which can be resolved
				// in a code path that does dominate the loop ...
				LOGW("Incoming value to back edge does not dominate loop header.\n");
				hoist_incoming = false;
			}

			if (hoist_incoming)
			{
#ifdef PHI_DEBUG
				LOGI("For node %s, move incoming node %s to %s.\n", node.block->name.c_str(),
				     incoming.block->name.c_str(), itr->second->name.c_str());
#endif
				incoming.block = itr->second;
			}
			else
			{
				// We cannot hoist, so need to use dummy OpVariable instead.
				spv::Id alloca_var_id = module.create_variable(spv::StorageClassFunction, phi.type_id, "phi_fixup");
				auto *store_op = module.allocate_op(spv::OpStore);
				store_op->add_id(alloca_var_id);
				store_op->add_id(incoming.id);
				itr->second->ir.operations.push_back(store_op);

				spv::Id loaded_id = module.allocate_id();
				auto *load_op = module.allocate_op(spv::OpLoad, loaded_id, phi.type_id);
				load_op->add_id(alloca_var_id);
				incoming.block->ir.operations.push_back(load_op);

				incoming.id = loaded_id;
			}

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

	// Triggers for RADV pre 24.0.0.
	constexpr uint32_t DRIVER_ID_MESA_RADV = 3;
	bool is_old_mesa_radv = driver_version && driver_id == DRIVER_ID_MESA_RADV && driver_version < (24u << 22);

	pool.for_each_node([is_old_mesa_radv](CFGNode &node) {
		node.visited = false;
		node.backward_visited = false;
		node.traversing = false;
		node.immediate_dominator = nullptr;
		node.immediate_post_dominator = nullptr;
		node.split_merge_block_candidate = nullptr;
		node.fake_pred.clear();
		node.fake_succ.clear();

		// Extremely specific workaround for HFW on Mesa 23.3.1 on stableOS Deck.
		// The better code path trips a bug causing GPU hang, but does not happen on newer Mesa.
		if (!is_old_mesa_radv)
			node.headers.clear();

		if (!node.freeze_structured_analysis)
		{
			if (is_old_mesa_radv)
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
	for (size_t i = forward_post_visit_order.size(); i; i--)
	{
		// Resolve outer loops before inner loops since we can have nested loops which need
		// to link into each other.
		auto *node = forward_post_visit_order[i - 1];

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
						if (f->reaches_backward_visited_node())
							node->pred_back_edge->add_fake_branch(f);
				}

				if (!node->pred_back_edge->succ.empty() ||
				    !node->pred_back_edge->fake_succ.empty())
				{
					// Consider this to be backwards visited in case we have a nested inner loop
					// that needs to link up to node->pred_back_edge.
					node->pred_back_edge->backward_visited = true;
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

void CFGStructurizer::visit_for_back_edge_analysis(CFGNode &entry)
{
	entry.visited = true;
	entry.traversing = true;
	reachable_nodes.insert(&entry);

	for (auto *succ : entry.succ)
	{
		// Reuse the existing vector to keep track of back edges.
		if (succ->traversing)
			succ->fake_pred.push_back(&entry);
		else if (!succ->visited)
			visit_for_back_edge_analysis(*succ);
	}

	entry.traversing = false;

	// After we get here, we must have observed all back edges.
	// If there is more than one back edge, merge them.
	if (entry.fake_pred.size() >= 2)
	{
		auto *new_back_edge = pool.create_node();
		new_back_edge->name = entry.name + ".back-edge-merge";
		for (auto *n : entry.fake_pred)
			n->retarget_branch_pre_traversal(&entry, new_back_edge);
		new_back_edge->succ.push_back(&entry);
		new_back_edge->ir.terminator.type = Terminator::Type::Branch;
		new_back_edge->ir.terminator.direct_block = &entry;
		new_back_edge->add_branch(&entry);
	}
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
	while (merge->succ.size() == 1)
	{
		// If we're going to eliminate a block due to impossible merge,
		// we should look ahead since we might get a false positive.
		bool breaking = merge_candidate_is_on_breaking_path(merge);
		if (breaking && !merge->ir.operations.empty() && !block_is_control_dependent(merge))
			merge = merge->succ.front();
		else
			break;
	}

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

	// If we have two different switch blocks in our PDF frontier something ridiculous is happening
	// where we effectively have one switch block falling through to another switch block (?!?!?!)
	// Definitely needs to be split up.
	unsigned switch_pdf_frontiers = 0;
	for (auto *frontier : node->post_dominance_frontier)
		if (frontier->ir.terminator.type == Terminator::Type::Switch)
			switch_pdf_frontiers++;

	if (switch_pdf_frontiers >= 2)
		return true;

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
		if (node->succ.size() == 1 && node->succ.front()->succ_back_edge)
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

const CFGNode *CFGStructurizer::scan_plain_continue_block(const CFGNode *node)
{
	auto *base_node = node;
	while (!block_is_plain_continue(node) &&
	       base_node->dominates(node) &&
	       !node->succ_back_edge &&
	       !node->pred_back_edge &&
	       node->immediate_post_dominator &&
	       node->immediate_post_dominator != node)
	{
		node = node->immediate_post_dominator;
	}

	return node;
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

				bool a_path_is_break = control_flow_is_escaping(node->succ[0], merge);
				bool a_path_is_continue = block_is_plain_continue(scan_plain_continue_block(node->succ[0]));
				bool b_path_is_break = control_flow_is_escaping(node->succ[1], merge);
				bool b_path_is_continue = block_is_plain_continue(scan_plain_continue_block(node->succ[1]));

				bool a_path_is_break_or_continue = a_path_is_break || a_path_is_continue;
				bool b_path_is_break_or_continue = b_path_is_break || b_path_is_continue;

				// Continue is stronger than break. A breaking path may still need to merge control flow
				// especially if that breaking path is very complicated. If we detect continue, the back-edge
				// post-dominates our succ, so we are guaranteed to never need to merge control flow on that path.
				// Demote the other path to a non-breaking path.
				if (a_path_is_continue != b_path_is_continue)
				{
					tie_break_merge = true;
					if (a_path_is_continue)
						b_path_is_break_or_continue = false;
					else
						a_path_is_break_or_continue = false;
				}

				if (tie_break_merge)
				{
					if (a_path_is_break_or_continue && b_path_is_break_or_continue)
					{
						// Both paths break, so we don't need to merge anything. Use Unreachable merge target.
						node->merge = MergeType::Selection;
						node->selection_merge_block = nullptr;
						//LOGI("Merging %s -> Unreachable\n", node->name.c_str());
					}
					else if (b_path_is_break_or_continue)
						merge_to_succ(node, 0);
					else if (a_path_is_break_or_continue)
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

					const auto node_is_degenerate_merge_block = [](const CFGNode *n) {
						return n->ir.terminator.type == Terminator::Type::Unreachable ||
						       (n->ir.terminator.type == Terminator::Type::Return &&
						        n->ir.operations.empty());
					};

					// In some cases however, we have to try even harder to tie-break these blocks,
					// since post-domination analysis may break due to early exit blocks.
					// Use principle of least break to tie-break.
					if (node->succ[0]->dominance_frontier.size() == 1 &&
					    node->succ[1]->dominance_frontier.size() == 1)
					{
						auto *a_frontier = node->succ[0]->dominance_frontier.front();
						auto *b_frontier = node->succ[1]->dominance_frontier.front();
						if (a_frontier != b_frontier)
						{
							// Try to merge in the direction of early returns, since the other direction
							// will likely result in a loop break or something like that.
							// Inner constructs tend to use weaker selection merges, which means we need
							// to merge in that direction to stay valid.
							if (query_reachability(*a_frontier, *b_frontier))
								merge_to_succ(node, 0);
							else if (query_reachability(*b_frontier, *a_frontier))
								merge_to_succ(node, 1);
							else
							{
								auto a_succ_count = a_frontier->succ.size();
								auto b_succ_count = b_frontier->succ.size();

								// First look at the idoms. This can give us an idea how the code is nested.
								// Merge towards innermost idom.
								// If that fails, merge against early returns as a last resort.

								a_frontier = a_frontier->immediate_dominator;
								b_frontier = b_frontier->immediate_dominator;
								if (a_frontier != b_frontier && query_reachability(*a_frontier, *b_frontier))
									merge_to_succ(node, 1);
								else if (a_frontier != b_frontier && query_reachability(*b_frontier, *a_frontier))
									merge_to_succ(node, 0);
								else if (a_succ_count == 0 && b_succ_count != 0)
									merge_to_succ(node, 0);
								else if (b_succ_count == 0 && a_succ_count != 0)
									merge_to_succ(node, 1);
							}
						}
					}
					else if (node_is_degenerate_merge_block(node->succ[1]) &&
					         !node_is_degenerate_merge_block(node->succ[0]))
					{
						// Try to merge away from blank returns.
						merge_to_succ(node, 0);
					}
					else if (node_is_degenerate_merge_block(node->succ[0]) &&
					         !node_is_degenerate_merge_block(node->succ[1]))
					{
						// Try to merge away from blank returns.
						merge_to_succ(node, 1);
					}
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

				bool current_escapes = current_candidate == merge || control_flow_is_escaping(current_candidate, merge);

				// It's possible that our other candidate is a merge target. If we don't dominate the candidate,
				// it means it's on the dominance frontier and we should not consider it escaping.

				// Trivial heuristic for escape.
				bool other_escapes = other_candidate == merge || block_is_plain_continue(other_candidate);

				// Second level heuristic.
				if (!other_escapes && control_flow_is_escaping(other_candidate, merge))
				{
					// Final layer of hell.
					if (node->dominates(other_candidate))
					{
						// There is no frontier, so we accept escape analysis as-is.
						other_escapes = true;
					}
					else
					{
						// This is a frontier, so it shouldn't be considered an escape,
						// but if this is a "weak" frontier, we can avoid creating a dummy interim block.
						// If the other candidate is a loop merge, then we will resolve the merge in another way,
						// which will make the interim block superfluous.
						bool other_is_loop_merge_candidate =
							other_candidate->headers.size() == 1 &&
							other_candidate->headers.front()->merge == MergeType::Loop &&
							(other_candidate->headers.front()->loop_merge_block == other_candidate ||
							 other_candidate->headers.front()->loop_ladder_block == other_candidate);
						other_escapes = other_is_loop_merge_candidate;
					}
				}

				if (!current_escapes && !other_escapes)
				{
					// Neither is considered an escape. This is strange and should not happen unless we have
					// a fake frontier block to contend with.
					// Attempt to tie-break by observing if current candidate has a direct branch to merge,
					// but other does not.
					if (std::find(current_candidate->succ.begin(), current_candidate->succ.end(), merge) != current_candidate->succ.end() &&
					    std::find(other_candidate->succ.begin(), other_candidate->succ.end(), merge) == other_candidate->succ.end())
					{
						current_escapes = true;

						// If current candidate's frontier can reach the other candidate directly,
						// this is a final tie-break to show that we should accept the current situation.
						for (auto *frontier : current_candidate->dominance_frontier)
						{
							if (frontier != other_candidate && query_reachability(*frontier, *other_candidate))
							{
								current_escapes = false;
								break;
							}
						}
					}
				}

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
		if (node != ladder_to)
		{
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

	const auto is_earlier = [](const CFGNode *candidate, const CFGNode *existing) {
		return !existing || (candidate->forward_post_visit_order > existing->forward_post_visit_order);
	};

	const auto is_later = [](const CFGNode *candidate, const CFGNode *existing) {
		return !existing || (candidate->forward_post_visit_order < existing->forward_post_visit_order);
	};

	header->traverse_dominated_blocks([&](const CFGNode *node) {
		if (node == merge)
			return false;

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

	header->traverse_dominated_blocks([&](const CFGNode *node) {
		if (node == merge || node == potential_inner_merge_target)
			return false;
		if (!query_reachability(*node, *merge) || !query_reachability(*node, *potential_inner_merge_target))
			return false;

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

		Vector<CFGNode *> complex_inner_constructs;
		Vector<CFGNode *> inner_constructs;
		Vector<CFGNode *> valid_constructs;

		// Find merge block candidates that are strictly dominated by idom and immediately post-dominated by node.
		// They also must not be good merge candidates on their own.
		// Also, we're not interested in any loop merge candidates.
		for (auto *candidate : potential_merge_nodes)
		{
			if (candidate != idom && idom->dominates(candidate) &&
				node->post_dominates(candidate) &&
			    !candidate->post_dominates_perfect_structured_construct() &&
			    get_innermost_loop_header_for(idom, candidate) == idom)
			{
				bool direct_dominance_frontier = candidate->dominance_frontier.size() == 1 &&
				                                 candidate->dominance_frontier.front() == node;
				// The candidate must not try to merge to other code since we might end up introducing loops that way.
				// All code reachable by candidate must cleanly break to node.
				// We can make use of a simpler rewrite path if all code paths to node goes through our candidates.
				// Accept a construct and determine if we need to promote the complex constructs instead of the inner constructs.
				// The inner construct may just be a false positive that ends up blocking the rewrite.
				if (direct_dominance_frontier)
					inner_constructs.push_back(candidate);
				else
					complex_inner_constructs.push_back(candidate);
			}
		}

		// If true, we need a complex rewrite. This means taking unrelated branches to node and fuse them into
		// one big merge. This requires very simple control flow from the candidates,
		// since otherwise we end up with unintended loops in the rewrite.
		// The simplified flow requires that all code paths from idom flow through the complex inner candidates.
		bool collect_all_paths_to_pdom = true;

		if (inner_constructs.size() == 1 && complex_inner_constructs.size() >= 2)
		{
			auto *candidate_inner = inner_constructs.front();
			auto *common_idom = candidate_inner;

			inner_constructs.clear();

			// Try to detect a false positive where we should ignore inner_constructs.

			// Ensure that the inner construct comes after the candidate constructs.
			bool should_promote_complex = true;
			for (auto *candidate : complex_inner_constructs)
			{
				if (!query_reachability(*candidate, *candidate_inner))
				{
					should_promote_complex = false;
					break;
				}
			}

			if (should_promote_complex)
			{
				// The inner candidate should not post-dominate any other candidate block.
				// We're looking for unusual merge patterns here.
				for (auto *pred : complex_inner_constructs)
				{
					if (candidate_inner->post_dominates(pred))
					{
						should_promote_complex = false;
						break;
					}
				}
			}

			if (should_promote_complex)
			{
				// In complex merges, we focus on merging as early as possible, rather than as late as possible.
				// Remove any candidates which are reachable by other candidates.

				// Disregard the inner constructs, promote the complex ones.
				collect_all_paths_to_pdom = false;

				// Ensure stable order.
				std::sort(complex_inner_constructs.begin(), complex_inner_constructs.end(), [](const CFGNode *a, const CFGNode *b) {
					return a->forward_post_visit_order > b->forward_post_visit_order;
				});

				size_t count = complex_inner_constructs.size();
				for (size_t j = 0; j < count; j++)
				{
					bool is_reachable = false;
					for (size_t i = 0; i < j && !is_reachable; i++)
						if (query_reachability(*complex_inner_constructs[i], *complex_inner_constructs[j]))
							is_reachable = true;

					if (!is_reachable)
						inner_constructs.push_back(complex_inner_constructs[j]);
				}
			}

			if (should_promote_complex && inner_constructs.size() >= 2)
			{
				for (auto *inner : inner_constructs)
					common_idom = CFGNode::find_common_dominator(common_idom, inner);

				// Verify that all paths to node must go through the inner constructs.
				// We cannot handle more awkward merges.
				should_promote_complex = !node->can_backtrace_to_with_blockers(common_idom, inner_constructs);
			}

			if (!should_promote_complex)
				continue;
		}

		// Ensure stable order.
		std::sort(inner_constructs.begin(), inner_constructs.end(), [](const CFGNode *a, const CFGNode *b) {
			return a->forward_post_visit_order < b->forward_post_visit_order;
		});

		if (inner_constructs.size() < 2)
			continue;

		auto *common_idom = inner_constructs[0];
		for (size_t i = 1, n = inner_constructs.size(); i < n; i++)
			common_idom = CFGNode::find_common_dominator(common_idom, inner_constructs[i]);

		// Filter out false positive inner constructs.
		// If we're dominated by another inner construct, and we don't post-dominate that construct, we should yield.
		for (auto itr = inner_constructs.begin(); itr != inner_constructs.end(); )
		{
			bool eliminated = false;
			for (auto candidate_itr = itr + 1; candidate_itr != inner_constructs.end() && !eliminated; ++candidate_itr)
			{
				// Don't let the common idom of constructs consume subsequent constructs.
				if ((*candidate_itr) == common_idom ||
				    !(*candidate_itr)->dominates(*itr) ||
				    (*itr)->post_dominates(*candidate_itr))
				{
					continue;
				}

				// To accept a dominator, we don't want any common idom removing every node.
				std::move(itr + 1, inner_constructs.end(), itr);
				inner_constructs.pop_back();
				eliminated = true;
			}

			if (!eliminated)
				++itr;
		}

		// Prune any candidate that can reach another candidate. The sort ensures that candidate to be removed comes last.
		size_t count = inner_constructs.size();
		for (size_t i = 0; i < count; i++)
		{
			bool valid = true;
			for (size_t j = 0; j < i; j++)
			{
				if (query_reachability(*inner_constructs[i], *inner_constructs[j]))
				{
					valid = false;
					break;
				}
			}

			// Another sanity check for candidates, the idom must be able to reach other nodes.
			if (valid)
			{
				valid = false;
				for (size_t j = 0; j < count; j++)
				{
					if (i == j)
						continue;

					if (query_reachability(*inner_constructs[i]->immediate_dominator, *inner_constructs[j]))
					{
						valid = true;
						break;
					}
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

		CFGNode *common_anchor = nullptr;

		if (!need_deinterleave)
		{
			// Detect a complicated pattern that comes up which looks a lot like interleaved merges, but isn't really.
			// A       B
			// |\     /|
			// | \   / |
			// |   E   |
			// | /  \  |
			// C      D
			//  \    /
			//   \  /
			//    F
			// Candidates: {C, D}
			// Where {A, E} is pdf range of C
			// and {B, E} is pdf range of D
			// The last PDF can be considered a merge anchor that distributes code further.
			// E must have {C, D} - and only those - in the dominance frontier.
			common_anchor = pdf_ranges[0].second;

			bool can_be_anchor = common_anchor->pred.size() >= 2 ||
			                     (common_anchor->pred.size() == 1 && common_anchor->pred.front()->succ_back_edge);

			need_deinterleave = common_anchor->dominance_frontier.size() == count &&
			                    common_anchor->succ.size() == count &&
			                    common_anchor->ir.terminator.type == Terminator::Type::Condition &&
			                    can_be_anchor;

			for (size_t i = 0; i < count && need_deinterleave; i++)
			{
				need_deinterleave =
					query_reachability(*pdf_ranges[i].first, *pdf_ranges[i].second) &&
					pdf_ranges[0].second == pdf_ranges[i].second;

				need_deinterleave = need_deinterleave &&
				                    std::find(common_anchor->dominance_frontier.begin(),
				                              common_anchor->dominance_frontier.end(),
				                              valid_constructs[i]) != common_anchor->dominance_frontier.end();
			}

			if (!need_deinterleave)
				common_anchor = nullptr;
		}

		if (!need_deinterleave)
		{
			const CFGNode *interleaved_exit_loop = nullptr;

			// Try finding interleaved loops exits. Extremely rare and awkward scenario.
			// This pattern makes it so that loop resolves cannot work well since nothing ends up being nested.
			// We can deal with one, but if two or more loops end up with awkward resolves, we have to employ magic.

			// First, look at the PDFs, try to find a node in an inner loop.
			// If the loop exits in a way where they can both reach the interleaving candidates,
			// that's a scenario where we need to consider rewriting.
			for (auto *candidate : valid_constructs)
			{
				auto &pdf = candidate->post_dominance_frontier;
				for (auto *pdf_candidate : pdf)
				{
					auto *inner_header = get_innermost_loop_header_for(idom, pdf_candidate);
					if (inner_header != idom && inner_header != interleaved_exit_loop)
					{
						// Don't allow nested loops to be considered as two loops.
						if (interleaved_exit_loop && query_reachability(*inner_header, *interleaved_exit_loop))
							continue;

						if (query_reachability(*pdf_candidate, *inner_header->pred_back_edge))
						{
							// The back-edge can only reach one of the interleave nodes, while the candidate PDF
							// can reach both. This proves weird break cases.

							unsigned back_edge_reach_count = 0;
							unsigned pdf_reach_count = 0;
							for (auto *reach_candidate : valid_constructs)
							{
								if (query_reachability(*inner_header->pred_back_edge, *reach_candidate))
									back_edge_reach_count++;
								if (query_reachability(*pdf_candidate, *reach_candidate))
									pdf_reach_count++;
							}

							if (back_edge_reach_count == 1 && pdf_reach_count == valid_constructs.size())
							{
								// We've found two candidates now, break out.
								need_deinterleave = interleaved_exit_loop != nullptr;
								interleaved_exit_loop = inner_header;
								break;
							}
						}
					}
				}

				if (need_deinterleave)
					break;
			}
		}

		if (need_deinterleave)
		{
			if (common_anchor)
				collect_and_dispatch_control_flow_from_anchor(common_anchor, node, valid_constructs);
			else
				collect_and_dispatch_control_flow(idom, node, valid_constructs, collect_all_paths_to_pdom);

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
			// If a case label is a continue block, ignore it, since it will be a pure continue break in this scenario.
			// This is not considered a fallthrough, just a common break.
			if (child.node != post_dominator && parent.node != child.node &&
			    !(child.node->succ_back_edge || child.node->is_pseudo_back_edge) &&
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
				// Pick the earliest one.
				candidate = c.node;
				break;
			}
		}
	}

	bool case_labels_can_be_candidate_frontier = false;

	if (has_impossible_fallthrough && !candidate)
	{
		// This can happen if the impossible candidate block is a pred of yet another case label ?!?!
		// If this happens, do the full analysis in the loop below.
		case_labels_can_be_candidate_frontier = true;
	}

	// We found a candidate, but there might be multiple candidates which are considered impossible.

	// If two case labels merge execution before the candidate merge, we should consider that the natural merge,
	// since it is not possible to express this without a switch merge.
	for (auto &c : node->ir.terminator.cases)
	{
		for (auto *front : c.node->dominance_frontier)
		{
			// Never consider continue constructs here.
			if (front->succ_back_edge || front->is_pseudo_back_edge)
				continue;

			if (!case_labels_can_be_candidate_frontier)
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
			}

			if (!front)
				continue;

			if (!post_dominator ||
			    (front->forward_post_visit_order != post_dominator->forward_post_visit_order &&
			     query_reachability(*front, *post_dominator)))
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

Operation *CFGStructurizer::build_switch_case_equal_check(
    const CFGNode *header, CFGNode *insert_node, const Terminator::Case &c)
{
	Operation *ieq;

	if (c.is_default)
	{
		// Awkward since we have to compare all other case labels.
		Operation *neq_and = nullptr;
		for (auto &label : header->ir.terminator.cases)
		{
			if (!label.is_default)
			{
				Operation *neq = module.allocate_op(spv::OpINotEqual,
				                                    module.allocate_id(),
				                                    module.get_builder().makeBoolType());
				neq->add_id(header->ir.terminator.conditional_id);
				neq->add_id(module.get_builder().makeUintConstant(label.value));
				insert_node->ir.operations.push_back(neq);

				if (neq_and)
				{
					Operation *and_op = module.allocate_op(spv::OpLogicalAnd,
					                                       module.allocate_id(),
					                                       module.get_builder().makeBoolType());
					and_op->add_id(neq_and->id);
					and_op->add_id(neq->id);
					insert_node->ir.operations.push_back(and_op);
					neq_and = and_op;
				}
				else
				{
					neq_and = neq;
				}
			}
		}

		ieq = neq_and;
	}
	else
	{
		ieq = module.allocate_op(spv::OpIEqual, module.allocate_id(), module.get_builder().makeBoolType());
		ieq->add_id(header->ir.terminator.conditional_id);
		ieq->add_id(module.get_builder().makeUintConstant(c.value));
		insert_node->ir.operations.push_back(ieq);
	}

	return ieq;
}

void CFGStructurizer::hoist_switch_branches_to_frontier(CFGNode *node, CFGNode *merge,
                                                        CFGNode *dominance_frontier_candidate)
{
	// Dispatch to the dominance frontier before we enter switch scope.
	auto *pred = create_helper_pred_block(node);
	std::swap(pred->ir.operations, node->ir.operations);

	auto succs = node->succ;
	for (auto *succ : succs)
	{
		if (!query_reachability(*succ, *dominance_frontier_candidate))
			continue;

		// Rewrite the case label to reach merge block in a unique path.
		// That way we can PHI select whether to branch to dominance frontier or not
		// in the switch merge block.

		spv::Id cond_id = 0;
		for (auto &c : node->ir.terminator.cases)
		{
			if (c.node == succ)
			{
				auto *ieq = build_switch_case_equal_check(node, pred, c);

				if (cond_id)
				{
					auto *bor = module.allocate_op(spv::OpLogicalOr, module.allocate_id(),
					                               module.get_builder().makeBoolType());
					bor->add_id(cond_id);
					bor->add_id(ieq->id);
					pred->ir.operations.push_back(bor);
					cond_id = bor->id;
				}
				else
				{
					cond_id = ieq->id;
				}
			}
		}

		if (succ == dominance_frontier_candidate)
		{
			// We're directly branching to target, so might have to rewrite PHI incoming
			// block to pred helper block instead.
			for (auto &phi : dominance_frontier_candidate->ir.phi)
				for (auto &incoming : phi.incoming)
					if (incoming.block == node)
						incoming.block = pred;
		}

		for (auto *&p : succ->pred)
			if (p == node)
				p = pred;

		for (auto &c : node->ir.terminator.cases)
			if (c.node == succ)
				c.node = merge;

		node->succ.erase(std::find(node->succ.begin(), node->succ.end(), succ));
		node->add_branch(merge);
		pred->add_branch(succ);

		// Make sure that our selection branch has somewhere to merge if it has to.
		if (succ == dominance_frontier_candidate)
		{
			succ = pred->rewrite_branch_through_intermediate_node(dominance_frontier_candidate,
			                                                      dominance_frontier_candidate);
		}

		pred->ir.terminator.type = Terminator::Type::Condition;
		pred->ir.terminator.conditional_id = cond_id;
		pred->ir.terminator.true_block = succ;
		pred->ir.terminator.false_block = node;
		pred->ir.terminator.direct_block = nullptr;

		// Have to assume that there is only one path to this frontier,
		// otherwise we're in a world of impossible case merges
		// which should have been handled elsewhere ...
		return;
	}
}

CFGStructurizer::SwitchProgressMode CFGStructurizer::process_switch_blocks(unsigned pass)
{
	bool modified_cfg = false;
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *node = forward_post_visit_order[index - 1];
		if (node->ir.terminator.type != Terminator::Type::Switch)
			continue;

		auto *merge = find_common_post_dominator(node->succ);
		auto *natural_merge = find_natural_switch_merge_block(node, merge);

		// If there are early exits inside the switch statement, post-dominance analysis won't work.
		// Just pick the natural merge.
		// This only seems to happen in dxbc2dxil.
		if (!merge)
			merge = natural_merge;

		// If there is still nothing, it's possible one of the case labels is the only non-exiting path.
		// If we have no natural merge either, this is the likely merge point.
		if (!merge)
		{
			CFGNode *pdom = nullptr;
			for (auto *succ : node->succ)
			{
				if (!succ->dominates_all_reachable_exits())
				{
					if (!pdom)
					{
						pdom = succ;
					}
					else
					{
						auto *new_pdom = CFGNode::find_common_post_dominator(pdom, succ);
						if (new_pdom)
							pdom = new_pdom;
					}

					// If there is at least one exit, have a fallback.
					merge = succ;
					natural_merge = succ;
				}
			}

			// If we have a valid pdom, that is the more reasonable target.
			if (pdom)
			{
				merge = pdom;
				natural_merge = pdom;
			}
		}

		if (!merge)
		{
			// Merge to unreachable.
			node->merge = MergeType::Selection;
			continue;
		}

		if (node->freeze_structured_analysis && node->merge == MergeType::Selection)
		{
			natural_merge = node->selection_merge_block;
		}
		else if (pass == 0)
		{
			// It is possible that we don't necessarily want to merge to the post-dominator.
			// There might be inner constructs which are better suited.
			// This can happen if some branches break farther out than some other branches.
			// We should let the loop ladder system take care of that.
			// The switch merge should consume the smallest possible scope.
			if (merge != natural_merge)
			{
				CFGNode *inner_merge = merge;
				for (auto *frontier_node : natural_merge->dominance_frontier)
				{
					if (node->dominates(frontier_node) && merge->post_dominates(frontier_node) &&
					    frontier_node->forward_post_visit_order > inner_merge->forward_post_visit_order)
					{
						inner_merge = frontier_node;
					}
				}

				if (merge != inner_merge && inner_merge != natural_merge && node->dominates(merge))
				{
					// If node dominates the merge, it's important that node remains a header block.
					// If we have an inner merge, we need to transpose the control flow so that
					// we avoid the inner merge altogether.
					Vector<CFGNode *> constructs = { natural_merge };
					for (auto *pred : inner_merge->pred)
						if (!query_reachability(*pred, *natural_merge) && !query_reachability(*natural_merge, *pred))
							constructs.push_back(pred);

					if (constructs.size() >= 2)
					{
						collect_and_dispatch_control_flow(node, merge, constructs, false);
						return SwitchProgressMode::IterativeModify;
					}
				}

				merge = inner_merge;

				// Relying on loop ladder system might not be possible in all situations.
				// It's possible that the switch block is also a loop header for example.
				// Need to transpose the code with a ladder to avoid impossible problems later.
				if (node->pred_back_edge)
					natural_merge = transpose_code_path_through_ladder_block(node, natural_merge, inner_merge);
			}
			else if (merge && !node->dominates(merge))
			{
				CFGNode *dominance_frontier_candidate = nullptr;

				// If we have a normal merge scenario (merge == natural_merge),
				// there might still be breaks which can reach the switch merge block.
				// This can happen if a switch block is in an if() {} block, and
				// one of the case labels branch to the else() block. Both the switch and else() block
				// reconvene later, which means that we should hoist the break so it's not contained
				// in switch scope.
				for (auto *frontier : node->dominance_frontier)
				{
					if (frontier->forward_post_visit_order != merge->forward_post_visit_order &&
					    query_reachability(*frontier, *merge))
					{
						// Uncertain if we can deal with this.
						// Multiple nested branches perhaps?
						if (dominance_frontier_candidate)
							LOGW("Multiple candidates for switch break transposition.\n");
						dominance_frontier_candidate = frontier;
					}
				}

				if (dominance_frontier_candidate)
					hoist_switch_branches_to_frontier(node, merge, dominance_frontier_candidate);
			}

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

			// Need to rewrite the switch if we're not already a loop header.
			if (merge != natural_merge && can_merge_to_post_dominator && !node->pred_back_edge)
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
				bool need_fixup = false;
				if (succ == merge)
				{
					if (merge != natural_merge)
					{
						// If we used outer shell method, we dominate merge,
						// but not structurally, since there's a loop merge already.
						need_fixup = can_merge_to_post_dominator;
					}
					else
					{
						// If this happens we are our own outer shell.
						// The node itself is both a loop header *and* switch header,
						// so similar analysis applies.
						// Only consider fixup if we cannot reach continue block.
						// This can still be a normal inner merge for the switch, which then branches to continue block.
						need_fixup = node->pred_back_edge != nullptr &&
						             !query_reachability(*succ, *node->pred_back_edge);
					}
				}
				else
				{
					// If we don't dominate succ, but it's not the common merge block, this is
					// an edge case we have to handle as well.
					// We might dominate a continue block, but these actually belong to outer loop scope.
					need_fixup = !node->dominates(succ) || succ->succ_back_edge;
				}

				// Guard against duplicate label branches.
				bool has_succ = std::find(node->succ.begin(), node->succ.end(), succ) != node->succ.end();

				if (need_fixup && has_succ)
				{
					auto *dummy_break = pool.create_node();
					dummy_break->name = node->name + (succ->succ_back_edge ? ".continue" : ".break");
					dummy_break->immediate_dominator = node;
					dummy_break->immediate_post_dominator = succ;
					dummy_break->forward_post_visit_order = node->forward_post_visit_order;
					dummy_break->backward_post_visit_order = node->backward_post_visit_order;
					dummy_break->ir.terminator.type = Terminator::Type::Branch;
					dummy_break->ir.terminator.direct_block = succ;
					dummy_break->is_pseudo_back_edge = succ->succ_back_edge != nullptr;
					dummy_break->add_branch(succ);
					node->retarget_branch(succ, dummy_break);
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
			// If there are early-exits, the pdom may be nullptr. Safeguard against this.
			// This only seems to happen in dxbc2dxil.
			if (!merge)
				merge = merge_ladder;
			modified_cfg = true;
		}

		if (node->dominates(merge))
		{
			//LOGI("Switch merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(merge), merge->name.c_str());
			node->merge = MergeType::Selection;

			// There is a small chance that this is supposed to be a loop merge target.
			// We'll fix that up later if needed. In that case, the switch block will merge to unreachable.

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

	return modified_cfg ? SwitchProgressMode::SimpleModify : SwitchProgressMode::Done;
}

bool CFGStructurizer::merge_candidate_is_inside_continue_construct(const CFGNode *node) const
{
	// If we've reached the continue construct, we cannot merge away from that construct.
	// Any such merge must be eliminated. We can know this for certain if the succ of node
	// post dominates the entire loop construct, since that node is the obvious merge node.
	assert(node->succ.size() == 1);
	for (auto *pred : node->pred)
	{
		if (pred->succ_back_edge &&
		    node->succ.front()->post_dominates(pred->succ_back_edge) &&
			pred->succ_back_edge->dominates(node->succ.front()) &&
		    !pred->dominates(node))
		{
			return true;
		}
	}

	return false;
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
			if (pass == 0)
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

	// If a back-edge can reach this node, it's not really an exit, but an Escape.
	// Exits must never branch "out" of the loop.
	if (header.dominates(&node) &&
	    (!header.pred_back_edge || !query_reachability(*header.pred_back_edge, node)) &&
	    node.dominates_all_reachable_exits())
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

	// Inherit selection construct from parent since we're taking over any selection.
	if (succ_node->ir.terminator.type == Terminator::Type::Condition)
		succ_node->ir.merge_info.selection_control_mask = node->ir.merge_info.selection_control_mask;

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
			{
				// The breaking path might be vestigal.
				// I.e., it might just be exiting directly without dominating anything.
				// Have to detect this false positive, since it's not really a break, just early return.
				if (!n->dominates_all_reachable_exits())
					candidates.push_back(n);
			}
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

void CFGStructurizer::rewrite_ladder_conditional_branch_from_incoming_blocks(
	CFGNode *ladder, CFGNode *true_block, CFGNode *false_block,
	const std::function<bool (const CFGNode *)> &path_cb, const String &name)
{
	ladder->add_branch(true_block);
	ladder->add_branch(false_block);

	ladder->ir.terminator.type = Terminator::Type::Condition;
	ladder->ir.terminator.conditional_id = module.allocate_id();
	ladder->ir.terminator.true_block = true_block;
	ladder->ir.terminator.false_block = false_block;
	ladder->ir.terminator.direct_block = nullptr;

	PHI phi;
	phi.id = ladder->ir.terminator.conditional_id;
	phi.type_id = module.get_builder().makeBoolType();
	module.get_builder().addName(phi.id, name.c_str());

	for (auto *pred : ladder->pred)
	{
		IncomingValue incoming = {};
		incoming.block = pred;
		incoming.id = module.get_builder().makeBoolConstant(path_cb(pred));
		phi.incoming.push_back(incoming);
	}

	ladder->ir.phi.push_back(std::move(phi));
}

CFGNode *CFGStructurizer::transpose_code_path_through_ladder_block(
    CFGNode *header, CFGNode *merge, CFGNode *path)
{
	assert(header->dominates(merge) && header->dominates(path));
	assert(query_reachability(*merge, *path));
	assert(!merge->dominates(path));
	assert(header != merge);
	assert(merge != path);
	assert(header != path);

	// Rewrite the merge block into merge.pred where merge.pred will branch to either merge or path.
	auto *ladder = create_ladder_block(header, merge, ".transpose");

	UnorderedSet<const CFGNode *> normal_preds;
	for (auto *p : ladder->pred)
		normal_preds.insert(p);
	traverse_dominated_blocks_and_rewrite_branch(header, path, ladder);
	rewrite_ladder_conditional_branch_from_incoming_blocks(
		ladder, path, merge, [&](const CFGNode *n) { return normal_preds.count(n) == 0; },
		String("transpose_ladder_phi_") + ladder->name);
	return ladder;
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

	rewrite_ladder_conditional_branch_from_incoming_blocks(
		replaced_merge_block,
		impossible_merge_target, analysis.dominated_merge,
		[&](const CFGNode *n) {
			return std::find(impossible_preds.begin(), impossible_preds.end(), n) != impossible_preds.end();
		}, String("transposed_selector_") + node->name);
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

	rewrite_ladder_conditional_branch_from_incoming_blocks(
		ladder_selection,
		dominated_merge, ladder_break,
		[&](const CFGNode *n) { return std::find(ladder_preds.begin(), ladder_preds.end(), n) != ladder_preds.end(); },
		String("transposed_selector_") + node->name);
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

	// A dominated continue exit should not be considered as such if it can reach other "normal" exits.
	// In this case, it's just a break.
	auto continue_itr = result.dominated_continue_exit.begin();
	while (continue_itr != result.dominated_continue_exit.end())
	{
		auto *candidate = *continue_itr;
		bool found_candidate = false;
		for (auto *dominated : result.dominated_exit)
		{
			if (query_reachability(*candidate, *dominated))
			{
				result.non_dominated_exit.push_back(candidate);
				continue_itr = result.dominated_continue_exit.erase(continue_itr);
				found_candidate = true;
				break;
			}
		}

		if (!found_candidate)
		{
			for (auto *non_dominated : result.non_dominated_exit)
			{
				if (query_reachability(*candidate, *non_dominated))
				{
					result.non_dominated_exit.push_back(candidate);
					continue_itr = result.dominated_continue_exit.erase(continue_itr);
					found_candidate = true;
					break;
				}
			}
		}

		if (!found_candidate)
			++continue_itr;
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

		if (!non_breaking_exits.empty())
			dominated_merge = CFGStructurizer::find_common_post_dominator(non_breaking_exits);

		if (!dominated_merge)
		{
			// If we get here, we likely have some questionable tie-break situation.
			// One possible case is an infinite loop where one path does a multi-level break,
			// and other paths branch to outer loop's continue. We'll want to only look at dominated exits
			// with the smallest break scope and try to find a common post dominator.
			auto *innermost_header = get_innermost_loop_header_for(node->immediate_dominator);
			Vector<CFGNode *> continue_exits;

			if (innermost_header && innermost_header->pred_back_edge)
				for (auto *exit : analysis.dominated_exit)
					if (query_reachability(*exit, *innermost_header->pred_back_edge))
						continue_exits.push_back(exit);

			if (!continue_exits.empty())
				dominated_merge = CFGStructurizer::find_common_post_dominator(continue_exits);
		}
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

void CFGStructurizer::collect_and_dispatch_control_flow_from_anchor(
	CFGNode *anchor, CFGNode *common_pdom, const Vector<CFGNode *> &constructs)
{
	auto &builder = module.get_builder();

	// If we have an anchor, it should collect all control flow, maybe dispatch itself, then dispatch to the constructs.
	// It must be a conditional branch, since it's too much of a mess to deal with switch.
	assert(anchor->ir.terminator.type == Terminator::Type::Condition);
	assert(constructs.size() == 2);
	assert(constructs[0]->post_dominates(anchor->ir.terminator.true_block) ||
	       constructs[0]->post_dominates(anchor->ir.terminator.false_block));
	assert(constructs[1]->post_dominates(anchor->ir.terminator.true_block) ||
	       constructs[1]->post_dominates(anchor->ir.terminator.false_block));

	auto *anchor_pred = create_helper_pred_block(anchor);

	auto *anchor_to_construct0 = pool.create_node();
	auto *anchor_to_construct1 = pool.create_node();
	auto *anchor_terminator = pool.create_node();
	auto *anchor_dispatcher = pool.create_node();

	anchor_to_construct0->name = anchor->name + ".anchor0";
	anchor_to_construct1->name = anchor->name + ".anchor1";

	anchor_to_construct0->immediate_dominator = anchor;
	anchor_to_construct1->immediate_dominator = anchor;
	anchor_to_construct0->immediate_post_dominator = constructs[0];
	anchor_to_construct1->immediate_post_dominator = constructs[1];
	anchor_to_construct0->forward_post_visit_order = constructs[0]->forward_post_visit_order;
	anchor_to_construct1->forward_post_visit_order = constructs[1]->forward_post_visit_order;
	anchor_to_construct0->backward_post_visit_order = constructs[0]->backward_post_visit_order;
	anchor_to_construct1->backward_post_visit_order = constructs[1]->backward_post_visit_order;

	anchor_to_construct0->add_branch(anchor_terminator);
	anchor_to_construct1->add_branch(anchor_terminator);
	anchor_to_construct0->ir.terminator.type = Terminator::Type::Branch;
	anchor_to_construct0->ir.terminator.direct_block = anchor_terminator;
	anchor_to_construct1->ir.terminator.type = Terminator::Type::Branch;
	anchor_to_construct1->ir.terminator.direct_block = anchor_terminator;
	anchor_terminator->name = anchor->name + ".anchor-term";
	anchor_terminator->add_branch(anchor_dispatcher);
	anchor_terminator->ir.terminator.type = Terminator::Type::Branch;
	anchor_terminator->ir.terminator.direct_block = anchor_dispatcher;
	anchor_dispatcher->name = anchor->name + ".anchor-dispatch";

	PHI terminator_selector;
	terminator_selector.id = module.allocate_id();
	terminator_selector.type_id = builder.makeBoolType();
	terminator_selector.incoming.push_back({ anchor_to_construct0, builder.makeBoolConstant(true) });
	terminator_selector.incoming.push_back({ anchor_to_construct1, builder.makeBoolConstant(false) });

	traverse_dominated_blocks_and_rewrite_branch(anchor, constructs[0], anchor_to_construct0);
	traverse_dominated_blocks_and_rewrite_branch(anchor, constructs[1], anchor_to_construct1);

	size_t cutoff_normal_path = anchor_pred->pred.size();
	traverse_dominated_blocks_and_rewrite_branch(constructs[0]->immediate_dominator, constructs[0], anchor_pred);
	size_t cutoff_path0 = anchor_pred->pred.size();
	traverse_dominated_blocks_and_rewrite_branch(constructs[1]->immediate_dominator, constructs[1], anchor_pred);

	assert(constructs[0]->pred.empty());
	assert(constructs[1]->pred.empty());

	// Branch to anchor as normal if we have a pre-existing pred.
	PHI take_anchor_phi;
	take_anchor_phi.id = module.allocate_id();
	take_anchor_phi.type_id = builder.makeBoolType();
	for (size_t i = 0; i < cutoff_normal_path; i++)
		take_anchor_phi.incoming.push_back({ anchor_pred->pred[i], builder.makeBoolConstant(true) });
	for (size_t i = cutoff_normal_path; i < anchor_pred->pred.size(); i++)
		take_anchor_phi.incoming.push_back({ anchor_pred->pred[i], builder.makeBoolConstant(false) });

	anchor_pred->add_branch(anchor);
	anchor_pred->add_branch(anchor_dispatcher);
	anchor_pred->ir.terminator.type = Terminator::Type::Condition;
	anchor_pred->ir.terminator.true_block = anchor;
	anchor_pred->ir.terminator.false_block = anchor_dispatcher;
	anchor_pred->ir.terminator.direct_block = nullptr;
	anchor_pred->ir.terminator.conditional_id = take_anchor_phi.id;

	PHI outside_true_phi;
	outside_true_phi.id = module.allocate_id();
	outside_true_phi.type_id = builder.makeBoolType();
	for (size_t i = 0; i < cutoff_path0; i++)
		outside_true_phi.incoming.push_back({ anchor_pred->pred[i], builder.makeBoolConstant(true) });
	for (size_t i = cutoff_path0; i < anchor_pred->pred.size(); i++)
		outside_true_phi.incoming.push_back({ anchor_pred->pred[i], builder.makeBoolConstant(false) });

	PHI anchor_cond_phi;
	anchor_cond_phi.id = module.allocate_id();
	anchor_cond_phi.type_id = builder.makeBoolType();
	// If we took the path through anchor, use that conditional. Otherwise, use the selector between path 0 or 1.
	anchor_cond_phi.incoming.push_back({ anchor, terminator_selector.id });
	anchor_cond_phi.incoming.push_back({ anchor_pred, outside_true_phi.id });

	anchor_pred->ir.phi.push_back(std::move(take_anchor_phi));
	anchor_pred->ir.phi.push_back(std::move(outside_true_phi));
	anchor_terminator->ir.phi.push_back(std::move(terminator_selector));
	anchor_dispatcher->ir.terminator.conditional_id = anchor_cond_phi.id;
	anchor_dispatcher->ir.terminator.type = Terminator::Type::Condition;
	anchor_dispatcher->ir.terminator.true_block = constructs[0];
	anchor_dispatcher->ir.terminator.false_block = constructs[1];
	anchor_dispatcher->add_branch(constructs[0]);
	anchor_dispatcher->add_branch(constructs[1]);
	anchor_dispatcher->ir.phi.push_back(std::move(anchor_cond_phi));
}

void CFGStructurizer::collect_and_dispatch_control_flow(
	CFGNode *common_idom, CFGNode *common_pdom, const Vector<CFGNode *> &constructs,
	bool collect_all_code_paths_to_pdom)
{
	assert(constructs.size() >= 2);
	auto &builder = module.get_builder();
	bool need_default_case = false;
	bool plain_branch = false;
	size_t cutoff_index = 0;
	CFGNode *dispatcher;

	PHI phi;
	phi.id = module.allocate_id();

	if (collect_all_code_paths_to_pdom)
	{
		// In some merge scenarios, we need to make sure we encapsulate all code into this new dispatcher.
		// This will become our new merge block. Incoming impossible merges will be transposed to after this new merge.
		dispatcher = create_helper_pred_block(common_pdom);
		for (auto *candidate : constructs)
			traverse_dominated_blocks_and_rewrite_branch(candidate, dispatcher, common_pdom);

		cutoff_index = dispatcher->pred.size();

		// If there is no direct branch intended for node, the default case label will never be reached,
		// so just pilfer one of the cases as default.
		need_default_case = !dispatcher->pred.empty();

		plain_branch = !need_default_case && constructs.size() == 2;
		if (!plain_branch)
		{
			for (size_t i = 0; i < cutoff_index; i++)
				phi.incoming.push_back({ dispatcher->pred[i], builder.makeIntConstant(-1) });
			phi.type_id = builder.makeIntType(32);
		}
		else
		{
			phi.type_id = builder.makeBoolType();
		}
	}
	else
	{
		dispatcher = pool.create_node();
		dispatcher->name = common_idom->name + ".collector";
		dispatcher->immediate_dominator = common_idom;
		dispatcher->immediate_post_dominator = common_pdom;
		dispatcher->forward_post_visit_order = common_pdom->forward_post_visit_order;
		dispatcher->backward_post_visit_order = common_pdom->backward_post_visit_order;
		plain_branch = constructs.size() == 2;
	}

	phi.type_id = plain_branch ? builder.makeBoolType() : builder.makeIntType(32);

	for (size_t i = 0, n = constructs.size(); i < n; i++)
	{
		auto *candidate = constructs[i];
		traverse_dominated_blocks_and_rewrite_branch(common_idom, candidate, dispatcher);
		size_t next_cutoff_index = dispatcher->pred.size();
		for (size_t j = cutoff_index; j < next_cutoff_index; j++)
		{
			spv::Id cond_id;
			if (plain_branch)
				cond_id = builder.makeBoolConstant(i != 0);
			else
				cond_id = builder.makeIntConstant(int32_t(i));

			phi.incoming.push_back({ dispatcher->pred[j], cond_id });
		}
		cutoff_index = next_cutoff_index;
	}

	if (!common_idom->pred_back_edge)
	{
		common_idom->freeze_structured_analysis = true;
		common_idom->merge = MergeType::Loop;
		common_idom->loop_merge_block = dispatcher;
	}

	dispatcher->ir.terminator.conditional_id = phi.id;
	dispatcher->ir.phi.push_back(std::move(phi));
	builder.addName(phi.id, String("selector_" + common_pdom->name).c_str());

	dispatcher->ir.terminator.direct_block = nullptr;
	dispatcher->clear_branches();

	if (plain_branch)
	{
		dispatcher->ir.terminator.type = Terminator::Type::Condition;
		dispatcher->ir.terminator.false_block = constructs[0];
		dispatcher->ir.terminator.true_block = constructs[1];
		dispatcher->add_branch(constructs[0]);
		dispatcher->add_branch(constructs[1]);
	}
	else
	{
		dispatcher->ir.terminator.type = Terminator::Type::Switch;
		Terminator::Case default_case;
		default_case.node = need_default_case ? common_pdom : constructs[0];
		default_case.is_default = true;
		dispatcher->ir.terminator.cases.push_back(default_case);
		dispatcher->add_branch(default_case.node);

		for (size_t i = 0, n = constructs.size(); i < n; i++)
		{
			auto *candidate = constructs[i];
			assert(candidate->pred.empty() || candidate == default_case.node);
			dispatcher->add_branch(candidate);

			if (need_default_case || i)
			{
				Terminator::Case break_case;
				break_case.node = candidate;
				break_case.value = uint32_t(i);
				dispatcher->ir.terminator.cases.push_back(break_case);
			}
		}
	}
}

bool CFGStructurizer::rewrite_complex_loop_exits(CFGNode *node, CFGNode *merge, Vector<CFGNode *> &dominated_exits)
{
	if (!merge || !node->pred_back_edge->succ.empty() || dominated_exits.size() < 2)
		return false;

	// This heuristic is somewhat questionable. :')
	bool needs_early_explicit_ladder = false;
	CFGNode *common_idom = node;

	// Use a stricter definition when there is a clean merge candidate.
	if (node->can_loop_merge_to(merge))
	{
		// If all nodes share a frontier node which is not the target merge block, we have a spicy merge
		// that should be collected in a ladder first, since there is no natural latter block
		// in this scenario. The shared frontier node is the more plausible true merge target,
		// and the outer merge was a red herring, but since we don't have a proper ladder block,
		// it will complicate things.
		Vector<const CFGNode *> frontier_nodes;
		for (auto *n : dominated_exits)
		{
			frontier_nodes.insert(frontier_nodes.end(),
			                      n->dominance_frontier.begin(),
			                      n->dominance_frontier.end());
		}

		std::sort(frontier_nodes.begin(), frontier_nodes.end());
		const CFGNode *frontier_base = nullptr;
		uint32_t count = 0;

		for (auto *n : frontier_nodes)
		{
			if (n == frontier_base)
				count++;
			else
				count = 1;

			frontier_base = n;

			if (count == dominated_exits.size() && n != merge && query_reachability(*n, *merge))
			{
				needs_early_explicit_ladder = true;
				break;
			}
		}
	}
	else
	{
		// If we cannot do a clean merge anyway, then we should try to look for frontier nodes.
		auto frontier_nodes = dominated_exits;

		// Skip forward to the dominance frontier. This makes control flow easier to deal with
		// since unrelated branches to the frontiers can also be resolved.
		// This heuristic is admittedly somewhat arbitrary,
		// but it is meant to help on some specific real-world shaders.
		for (auto *&n : frontier_nodes)
		{
			if (n->dominance_frontier.size() == 1 && !node->dominates(n->dominance_frontier.front()))
			{
				n = n->dominance_frontier.front();
			}
			else
			{
				// We don't have a clean frontier, skip this check.
				frontier_nodes.clear();
				break;
			}
		}

		if (!frontier_nodes.empty())
		{
			// If the frontiers are all different, and it's not the merge block, something is afoot.
			// Don't sort by pointer since we care about codegen invariance.
			std::sort(frontier_nodes.begin(), frontier_nodes.end(), [](const CFGNode *a, const CFGNode *b)
			          { return a->forward_post_visit_order > b->forward_post_visit_order; });

			bool has_dup_frontier = false;
			for (size_t i = 1, n = frontier_nodes.size(); i < n && !has_dup_frontier; i++)
				if (frontier_nodes[i] == frontier_nodes[i - 1] || frontier_nodes[i] == merge)
					has_dup_frontier = true;

			if (has_dup_frontier)
				frontier_nodes.clear();
		}

		if (!frontier_nodes.empty())
		{
			// Make sure that the frontier nodes we found fully dominate all preds of merge,
			// otherwise, the transpose of code will likely break.
			for (auto *pred : merge->pred)
			{
				bool has_dominating = false;
				for (auto *f : frontier_nodes)
				{
					if (f->dominates(pred))
					{
						has_dominating = true;
						break;
					}
				}

				if (!has_dominating)
				{
					frontier_nodes.clear();
					break;
				}
			}
		}

		if (!frontier_nodes.empty())
		{
			needs_early_explicit_ladder = true;
			// First collect the inner break blocks in a neat bow.
			node->pred_back_edge->fake_succ.clear();
			node->pred_back_edge->fake_pred.clear();
			collect_and_dispatch_control_flow(node, merge, dominated_exits, false);

			recompute_cfg();

			// Then collect the outer layer.
			dominated_exits = std::move(frontier_nodes);
			common_idom = merge->immediate_dominator;
		}
	}

	if (needs_early_explicit_ladder)
	{
		// Avoids false-positive assertions when trying to rewrite branches.
		// We're going to recompute the CFG after this anyway.
		node->pred_back_edge->fake_succ.clear();
		node->pred_back_edge->fake_pred.clear();
		collect_and_dispatch_control_flow(common_idom, merge, dominated_exits, false);
		return true;
	}

	return false;
}

bool CFGStructurizer::find_loops(unsigned pass)
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

		// If we have a trivial case where there is only one possible loop exit which we dominate,
		// we shouldn't consider it an infinite loop, but a merge.
		bool trivial_exit_loop = dominated_exit.size() == 1 && result.non_dominated_exit.empty() &&
		                         result.inner_dominated_exit.empty() && result.direct_exits.empty() &&
		                         result.inner_direct_exits.empty();

		if (trivial_exit_loop)
		{
			auto *candidate = dominated_exit.front();

			// Resolve some false positives. It's possible that a loop exit can be detected as inner,
			// but it's just a good merge candidate for an inner infinite loop.
			bool loop_exit_dominates_continue =
				candidate->immediate_dominator &&
			    candidate->immediate_dominator->dominates(node->pred_back_edge);

			// If we promoted inner header, this is not a trivial exit.
			const CFGNode *innermost_loop_header = get_innermost_loop_header_for(node, dominated_exit.front());
			if (node != innermost_loop_header)
			{
				// There are at least two scenarios where we have to be careful:
				// - If the innermost header has a edge out of continue block.
				//   If we still detect this as belong to inner loop, it must be the case.
				// - Also, only accept this as a trivial exit if the immediate dominator of exit also dominates
				//   continue block.
				if (!innermost_loop_header->pred_back_edge->succ.empty() || !loop_exit_dominates_continue)
					trivial_exit_loop = false;
			}
		}

		if (node->pred_back_edge->succ.empty() && !trivial_exit_loop)
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
			CFGNode *direct_exit_pdom = nullptr;
			if (!result.direct_exits.empty())
				direct_exit_pdom = find_common_post_dominator(result.direct_exits);

			if (direct_exit_pdom && query_reachability(*dominated_exit.front(), *direct_exit_pdom))
			{
				node->loop_ladder_block = dominated_exit.front();
				node->loop_merge_block = direct_exit_pdom;
			}
			else
			{
				// Clean merge.
				// This is a unique merge block. There can be no other merge candidate.
				node->loop_merge_block = dominated_exit.front();
			}

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
			auto *ladder = create_ladder_block(node, merge_block, ".merge");
			node->loop_ladder_block = nullptr;
			node->loop_merge_block = ladder;

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			//LOGI("Loop with ladder merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node), node->name.c_str(),
			//     static_cast<const void *>(node->loop_merge_block), node->loop_merge_block->name.c_str());
		}
		else
		{
			auto merge_result = analyze_loop_merge(node, result);
			auto *merge = merge_result.merge;
			auto *dominated_merge = merge_result.dominated_merge;

			if (pass == 0 && rewrite_complex_loop_exits(node, merge, dominated_exit))
				return true;

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
				if (!dominated_merge && node->pred_back_edge->succ.size() == 1)
				{
					// If continue block exits, and it still does not dominate, we should invent a ladder block
					// so we get one, otherwise splitting merge scopes will break.
					dominated_merge = create_ladder_block(node->pred_back_edge, node->pred_back_edge->succ.front(), ".merge");
				}

				// Single-escape merge.
				// It is unique, but we need workarounds later.
				//LOGI("Loop with ladder multi-exit merge: %p (%s) -> %p (%s)\n", static_cast<const void *>(node),
				//     node->name.c_str(), static_cast<const void *>(node->loop_merge_block),
				//     node->loop_merge_block->name.c_str());

				//if (dominated_merge)
				//{
					//LOGI("    Ladder block: %p (%s)\n", static_cast<const void *>(dominated_merge),
					//     dominated_merge->name.c_str());
				//}

				// We will use this block as a ladder.
				node->loop_ladder_block = dominated_merge;
				node->loop_merge_block = merge;

				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			}
		}
	}

	return false;
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

		unsigned header_index;
		for (header_index = 0; header_index < uint32_t(node->headers.size()); header_index++)
			if (node->headers[header_index] == header)
				break;

		assert(header_index != node->headers.size());

		// Merge to ladder instead.
		// If we're fixing up ladders for header index 0 it means we've already rewritten everything,
		// only apply the last fixup branch.
		if (header_index != 0 || block_is_plain_continue(node))
		{
			traverse_dominated_blocks_and_rewrite_branch(
				header, node, ladder,
				[node, header_index](const CFGNode *next)
				{
					for (unsigned i = 0; i < header_index; i++)
					{
						auto *target = node->headers[i];
						// Do not introduce cycles. Outer scopes must never be rewritten to branch to inner scopes.
						if (target && target->loop_ladder_block == next)
							return false;
					}
					return true;
				});
		}

		CFGNode *true_block = nullptr;

		// Ladder breaks out to outer scope.
		if (target_header && target_header->loop_ladder_block)
			true_block = target_header->loop_ladder_block;
		else if (target_header && target_header->loop_merge_block)
			true_block = target_header->loop_merge_block;
		else if (full_break_target)
			true_block = full_break_target;
		else
			LOGW("No loop merge block?\n");

		if (true_block)
		{
			rewrite_ladder_conditional_branch_from_incoming_blocks(
				ladder,
				true_block, loop_ladder, [&](const CFGNode *n) { return normal_preds.count(n) == 0; },
				String("ladder_phi_") + loop_ladder->name);

			// This can happen in some scenarios, fixup the branch to be a direct one instead.
			if (ladder->ir.terminator.true_block == ladder->ir.terminator.false_block)
			{
				ladder->ir.terminator.direct_block = ladder->ir.terminator.true_block;
				ladder->ir.terminator.type = Terminator::Type::Branch;
			}
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

			// Merge to ladder instead.
			traverse_dominated_blocks_and_rewrite_branch(header, node, ladder_pre);

			rewrite_ladder_conditional_branch_from_incoming_blocks(
				ladder_pre,
				ladder_post, loop_ladder,
				[&](const CFGNode *n) { return normal_preds.count(n) == 0; },
				String("ladder_phi_") + loop_ladder->name);

			new_ladder_block = ladder_pre;
		}
	}

	return new_ladder_block;
}

void CFGStructurizer::eliminate_degenerate_switch_merges()
{
	for (auto *node : forward_post_visit_order)
	{
		if (node->headers.size() <= 1)
			continue;

		// In the second pass, it's illegal to have more than two target headers, so we have to turn some
		// headers into unreachable. The outermost scope wins.
		std::sort(node->headers.begin(), node->headers.end(),
		          [](const CFGNode *a, const CFGNode *b) -> bool {
			          if (a->dominates(b))
				          return true;
			          else if (b->dominates(a))
				          return false;
			          else
				          return a->forward_post_visit_order > b->forward_post_visit_order;
		          });

		// Can only elide if we have a true loop merge to this node.
		if (node->headers[0]->merge != MergeType::Loop || node->headers[0]->loop_merge_block != node)
			continue;

		for (size_t i = 1, n = node->headers.size(); i < n; i++)
		{
			auto *header = node->headers[i];
			// This cannot possibly work with loops.
			// We can generally turn selections into unreachable merges without trouble however ...
			if (header->merge == MergeType::Selection && header->selection_merge_block == node)
				header->selection_merge_block = nullptr;
		}
	}
}

CFGNode *CFGStructurizer::rewind_candidate_split_node(CFGNode *node)
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
	       node->split_merge_block_candidate->forward_post_visit_order == node->forward_post_visit_order)
	{
		auto *candidate = node->split_merge_block_candidate;
		if (candidate->succ.size() != 1 || candidate->succ.front() != node)
		{
			// This is a ladder block of some sort. It's possible we're already in a "resolved" state,
			// so we really should not try to split further.
			// If we're considered a proper ladder block by any of our headers, bail.
			for (auto *header : candidate->headers)
				if (header->loop_ladder_block == node || header->loop_merge_block == node)
					return node;
		}

		node = candidate;
	}

	return node;
}

void CFGStructurizer::split_merge_blocks()
{
	for (auto *node : forward_post_visit_order)
	{
		node = rewind_candidate_split_node(node);

		if (node->headers.size() <= 1 && !block_is_plain_continue(node))
			continue;

		// It's possible that we have just one header.
		// One loop has a ladder block which is not this block, but the post-dominator is a pure continue block.
		// This gets rather awkward, since we need to special case this scenario.
		if (node->headers.empty())
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

		// If we're a plain continue block, we're implicitly the full break target.
		bool plain_continue_resolve = block_is_plain_continue(node);
		if (plain_continue_resolve)
			full_break_target = node;

		// Before we start splitting and rewriting branches, we need to know which preds are considered "normal",
		// and which branches are considered ladder breaking branches (rewritten branches).
		// This will influence if a pred block gets false or true when emitting ladder breaking blocks later.
		Vector<UnorderedSet<const CFGNode *>> normal_preds(node->headers.size());
		for (size_t i = 0; i < node->headers.size(); i++)
			if (node->headers[i]->loop_ladder_block)
				for (auto *pred : node->headers[i]->loop_ladder_block->pred)
					normal_preds[i].insert(pred);

		bool has_rewrites_to_outer_ladder = false;

		// Start from innermost scope, and rewrite all escape branches to a merge block which is dominated by the loop header in question.
		// The merge block for the loop must have a ladder block before the old merge block.
		// This ladder block will break to outer scope, or keep executing the old merge block.
		for (size_t i = node->headers.size() - 1; i || plain_continue_resolve; i--)
		{
			auto *current_node = node->headers[i];

			// Find innermost loop header scope we can break to when resolving ladders.
			CFGNode *target_header = i != 0 ? get_target_break_block_for_inner_header(node, i) : nullptr;

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

					if (target_header == node->headers[0])
						has_rewrites_to_outer_ladder = true;
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
					{
						traverse_dominated_blocks_and_rewrite_branch(current_node, node, rewrite_to);
						if (target_header == node->headers[0])
							has_rewrites_to_outer_ladder = true;
					}
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

			if (i == 0)
				break;
		}

		auto *outer_header = node->headers[0];
		if (has_rewrites_to_outer_ladder &&
		    outer_header->merge == MergeType::Loop &&
		    outer_header->loop_ladder_block &&
		    outer_header->loop_merge_block &&
		    outer_header->loop_ladder_block->dominates(outer_header->loop_merge_block))
		{
			auto *ladder = outer_header->loop_ladder_block;
			bool non_trivial_ladder = !ladder->ir.operations.empty() ||
			                          ladder_chain_has_phi_dependencies(ladder, outer_header->loop_merge_block);

			if (non_trivial_ladder)
			{
				// It's possible we have branches that intended to rewrite to loop_merge_block
				// but ended up writing to loop_ladder_block instead.
				// Perform a final fixup branch if this is necessary.
				// If the ladder block is a dummy, we can ignore this.
				build_ladder_block_for_escaping_edge_handling(
					node, outer_header, outer_header->loop_ladder_block,
					nullptr, outer_header->loop_merge_block, normal_preds[0]);
			}
		}
	}
}

bool CFGStructurizer::structurize(unsigned pass)
{
	auto switch_mode = process_switch_blocks(pass);
	while (switch_mode == SwitchProgressMode::IterativeModify)
	{
		// For complex rewrites, we damage the CFG, so need to start over every iteration.
		recompute_cfg();
		switch_mode = process_switch_blocks(pass);
	}

	// After a trivial modify, we must be able to complete the process in one iteration.
	if (switch_mode == SwitchProgressMode::SimpleModify)
	{
		recompute_cfg();
		if (process_switch_blocks(pass) != SwitchProgressMode::Done)
		{
			LOGE("Fatal, detected infinite loop.\n");
			abort();
		}
	}

	if (find_loops(pass))
		return true;
	find_selection_merges(pass);
	fixup_broken_selection_merges(pass);
	if (pass == 0)
		split_merge_blocks();
	else
		eliminate_degenerate_switch_merges();

	return false;
}

bool CFGStructurizer::exists_path_in_cfg_without_intermediate_node(const CFGNode *start_block,
                                                                   const CFGNode *end_block,
                                                                   const CFGNode *stop_block) const
{
	// If we're resolving PHI for a frontier inside a loop, consider the back-edge as the end target for analysis.
	// If we start outside the loop, don't move the end block.
	if (end_block->pred_back_edge &&
	    !query_reachability(*stop_block, *end_block) &&
	    !query_reachability(*start_block, *end_block))
	{
		end_block = end_block->pred_back_edge;
	}

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
		bool ret = query_reachability_through_back_edges(*start_block, *end_block);
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

		auto *frontier = frontiers.back();

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
                                                                   UnorderedSet<CFGNode *> &visitation_cache)
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
				candidate->retarget_branch_with_intermediate_node(from, to);
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

	UnorderedSet<CFGNode *> visitation_cache;
	traverse_dominated_blocks_and_rewrite_branch(dominator, dominator, from, to, op, visitation_cache);
	dominator->fixup_merge_info_after_branch_rewrite(from, to);

	// Force all post-domination information to be recomputed.
	Vector<CFGNode *> linear_visitation_cache;
	linear_visitation_cache.reserve(visitation_cache.size());

	for (auto *n : visitation_cache)
	{
		if (n->immediate_post_dominator == from)
		{
			if (n->fake_succ.empty())
			{
				n->immediate_post_dominator = nullptr;
				// Ignore any infinite continue blocks.
				// They wreak havoc in post-dominance analysis.
				linear_visitation_cache.push_back(n);
			}
			else
			{
				// Infinite loop blocks must not be traversed again.
				n->immediate_post_dominator = to;
			}
		}
	}

	// Will recompute everything that was cleared out.
	// Compute later nodes first. This way we avoid a potential recursive loop.
	std::sort(linear_visitation_cache.begin(), linear_visitation_cache.end(), [](const CFGNode *a, const CFGNode *b) {
		return a->forward_post_visit_order < b->forward_post_visit_order;
	});

	for (auto *n : linear_visitation_cache)
		if (!n->immediate_post_dominator)
			n->recompute_immediate_post_dominator();
	dominator->recompute_immediate_post_dominator();
}

void CFGStructurizer::traverse_dominated_blocks_and_rewrite_branch(CFGNode *dominator, CFGNode *from, CFGNode *to)
{
	traverse_dominated_blocks_and_rewrite_branch(dominator, from, to, [](const CFGNode *node) -> bool { return true; });
}
} // namespace dxil_spv
