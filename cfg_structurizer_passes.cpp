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
					if (!module.get_builder().hasDecoration(op->argument(0), spv::DecorationBuiltIn))
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
	assert(!forward_post_visit_order.empty());
	if (limited_control_flow_analysis)
	{
		// Need full fat analysis with post-dominance, reachability, etc.
		compute_full_control_flow_analysis();
		limited_control_flow_analysis = false;
	}

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
	assert(!forward_post_visit_order.empty());
	if (limited_control_flow_analysis)
	{
		// Need full fat analysis with post-dominance, reachability, etc.
		compute_full_control_flow_analysis();
		limited_control_flow_analysis = false;
	}

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

	if (!pdom || !idom || !idom->dominates(pdom))
	{
		idom = nullptr;
		pdom = nullptr;
	}

	// Make sure we enclose the entire scope.
	if (idom && pdom && idom->ir.merge_info.merge_type != MergeType::None)
	{
		if (idom->ir.merge_info.merge_block && (idom != pdom || idom->ir.merge_info.merge_type == MergeType::Loop))
		{
			pdom = CFGNode::find_common_post_dominator(pdom, idom->ir.merge_info.merge_block);
		}
		else
		{
			idom = nullptr;
			pdom = nullptr;
		}
	}

	while (idom && idom->pred_back_edge)
	{
		// We must insert the lock before entering loop.
		// Hopefully the idom of the loop header is not a header.
		if (idom->post_dominates(idom->immediate_dominator))
		{
			idom = idom->immediate_dominator;
		}
		else
		{
			idom = nullptr;
			pdom = nullptr;
		}
	}

	// Stretch post-dominator if we need to.
	if (idom && pdom)
		pdom = CFGNode::find_common_post_dominator(pdom, idom);

	// It's possible idom is outside of a loop and pdom is inline a loop.
	while (pdom)
	{
		auto *pdom_inner_loop = get_innermost_loop_header_for(pdom, idom);
		if (pdom_inner_loop->ir.merge_info.merge_block)
		{
			auto *extended_pdom = CFGNode::find_common_post_dominator(pdom, pdom_inner_loop->ir.merge_info.merge_block);
			if (pdom == extended_pdom)
				break;
			pdom = extended_pdom;
		}
		else
			break;
	}

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
	visit_for_back_edge_analysis();
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
				for (uint32_t i = 0; i < op->num_arguments(); i++)
				{
					if (op->argument_is_literal(i))
						continue;

					spv::Id consumed_id = op->argument(i);
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
		else if (n->ir.terminator.type == Terminator::Type::Return &&
		         n->ir.terminator.return_value != 0)
		{
			consume_id(n->ir.terminator.return_value, n);
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
			for (uint32_t j = 0; j < op->num_arguments(); j++)
				if (!op->argument_is_literal(j))
					consume_id(op->argument(j), target_block);
		}
	}

	if (dry_run)
		for (auto *n : forward_post_visit_order)
			for (auto *op : n->ir.operations)
				op->flags &= ~Operation::DependencySinkableBit;
}

void CFGStructurizer::remove_unused_ssa()
{
	UnorderedSet<spv::Id> removed_ids;
	UnorderedSet<spv::Id> used_ids;

	for (auto *node : forward_post_visit_order)
	{
		for (auto &phi : node->ir.phi)
			for (auto &incoming : phi.incoming)
				used_ids.insert(incoming.id);

		for (auto *op : node->ir.operations)
			for (unsigned i = 0; i < op->num_arguments(); i++)
				if (!op->argument_is_literal(i))
					used_ids.insert(op->argument(i));

		if (node->ir.terminator.conditional_id)
			used_ids.insert(node->ir.terminator.conditional_id);

		if (node->ir.terminator.type == Terminator::Type::Return &&
			node->ir.terminator.return_value != 0)
		{
			used_ids.insert(node->ir.terminator.return_value);
		}
	}

	for (auto *node : forward_post_visit_order)
	{
		node->ir.phi.erase(std::remove_if(node->ir.phi.begin(), node->ir.phi.end(),
										  [&](const PHI &phi) { return used_ids.count(phi.id) == 0; }),
						   node->ir.phi.end());

		node->ir.operations.erase(
			std::remove_if(
				node->ir.operations.begin(), node->ir.operations.end(),
				[&](const Operation *op)
				{
					bool ret = op->id != 0 &&
							   !SPIRVModule::opcode_has_side_effect_and_result(op->op) &&
							   used_ids.count(op->id) == 0;
					if (ret)
						removed_ids.insert(op->id);
					return ret;
				}),
			node->ir.operations.end());
	}

	module.get_builder().removeDecorations(removed_ids);
}

void CFGStructurizer::fixup_partial_stage_output_writes()
{
	assert(!forward_post_visit_order.empty());
	if (limited_control_flow_analysis)
	{
		// Need full fat analysis with post-dominance, reachability, etc.
		compute_full_control_flow_analysis();
		limited_control_flow_analysis = false;
	}

	// This isn't a perfect check by any means, but it's good enough.
	// D3D12 isn't entirely well defined in these situations,
	// so do whatever is needed to fixup obviously broken games.
	Vector<spv::Id> output_conditionally_written;
	Vector<spv::Id> output_always_written;
	Vector<CFGNode *> exit_blocks;
	Vector<CFGNode *> demote_blocks;

	UnorderedMap<spv::Id, Vector<CFGNode *>> output_written_in_blocks;

	for (auto *node : forward_post_visit_order)
	{
		for (auto *op : node->ir.operations)
		{
			// If we demote, any fragment outputs are irrelevant.
			if (op->op == spv::OpDemoteToHelperInvocation && op->num_arguments() == 0 && !has_element(demote_blocks, node))
				demote_blocks.push_back(node);

			if ((op->flags & Operation::StageOutputWriteAnalysis) == 0)
				continue;

			spv::Id var_id = op->argument(0);

			// Be conservative with outputs written inside loops.
			// We have no great way to analyze it, and we assume app is correct.
			if (get_innermost_loop_header_for(node) != entry_block || node->post_dominates(entry_block))
				push_back_unique(output_always_written, var_id);
			else
				push_back_unique(output_conditionally_written, var_id);

			auto &written_blocks = output_written_in_blocks[var_id];
			push_back_unique(written_blocks, node);
		}

		if (node->ir.terminator.type == Terminator::Type::Return)
			exit_blocks.push_back(node);
	}

	for (spv::Id var_id : output_conditionally_written)
	{
		if (has_element(output_always_written, var_id))
			continue;

		bool has_uninitialized_path = false;

		auto &written_blocks = output_written_in_blocks[var_id];
		for (auto *demote_block : demote_blocks)
			push_back_unique(written_blocks, demote_block);

		// Analyze if there exists a code path from entry to exit that does not write to output.
		// We don't analyze if all components or all array elements are written, just
		// that the output is written *somehow*.
		for (auto *exit_block : exit_blocks)
		{
			if (has_element(written_blocks, exit_block))
				continue;

			if (exit_block->can_backtrace_to_with_blockers(entry_block, written_blocks))
			{
				has_uninitialized_path = true;
				break;
			}
		}

		if (has_uninitialized_path)
		{
			auto &builder = module.get_builder();
			builder.addGlobalVariableZeroInitializer(var_id);
		}
	}
}

void CFGStructurizer::fixup_loop_header_undef_phis()
{
	auto &builder = module.get_builder();

	recompute_cfg();

	// If the incoming value to the loop is undef, something is deeply wrong.
	// This is almost a guarantee that we will consume the value as undef, causing breakage in the wild.
	// Observed in Dune.
	for (auto *node : forward_post_visit_order)
	{
		if (!node->pred_back_edge)
			continue;

		for (auto &phi : node->ir.phi)
			for (auto &incoming : phi.incoming)
				if (incoming.block != node && incoming.block->dominates(node))
					if (const auto *inst = builder.getInstruction(incoming.id))
						if (inst->getOpCode() == spv::OpUndef)
							incoming.id = builder.makeNullConstant(phi.type_id);
	}
}
}
