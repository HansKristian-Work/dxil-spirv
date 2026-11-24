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
	exit_block = pool.create_helper_node();
	exit_block->name = "EXIT";
}

#ifdef DXIL_SPIRV_DEBUG_DUMPING
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
			if (node->ir.merge_info.merge_type == MergeType::Loop)
				shape = "circle";
			else if (node->ir.merge_info.merge_type == MergeType::Selection)
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

		if (node->ir.merge_info.merge_type == MergeType::Loop)
		{
			if (node->ir.merge_info.continue_block)
				fprintf(file, "%u -> %u [style=\"dotted\"];\n", get_node_id(node), get_node_id(node->ir.merge_info.continue_block));
			else if (node->pred_back_edge)
				fprintf(file, "%u -> %u [style=\"dotted\"];\n", get_node_id(node), get_node_id(node->pred_back_edge));

			if (node->ir.merge_info.merge_block)
				fprintf(file, "%u -> %u [style=\"dashed\"];\n", get_node_id(node), get_node_id(node->ir.merge_info.merge_block));
		}
		else if (node->ir.merge_info.merge_type == MergeType::Selection)
		{
			if (node->ir.merge_info.merge_block)
				fprintf(file, "%u -> %u [style=\"dashed\"];\n", get_node_id(node), get_node_id(node->ir.merge_info.merge_block));
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

		switch (node->ir.merge_info.merge_type)
		{
		case MergeType::Selection:
			LOGI("  SelectionMerge -> %s\n",
			     node->ir.merge_info.merge_block ? node->ir.merge_info.merge_block->name.c_str() : "N/A");
			break;

		case MergeType::Loop:
			LOGI("  LoopMerge -> %s\n", node->ir.merge_info.merge_block ? node->ir.merge_info.merge_block->name.c_str() : "N/A");
			LOGI("    Continue -> %s\n", node->pred_back_edge ? node->pred_back_edge->name.c_str() : "N/A");
			break;

		default:
			break;
		}

		LOGI("\n");
	}
	LOGI("\n=====================\n");
}

void CFGStructurizer::log_cfg_structurize_test(const char *path) const
{
	FILE *f = fopen(path, "w");
	if (!f)
		return;

	UnorderedMap<const CFGNode *, String> names;
	Vector<const CFGNode *> stack;

	auto name = [&](const CFGNode *n) -> const char * {
		auto itr = names.find(n);
		if (itr == names.end())
		{
			String s = n == entry_block ? "entry" : ("n" + std::to_string(names.size())).c_str();
			itr = names.insert({ n, s }).first;
			stack.push_back(n);
		}
		return itr->second.c_str();
	};

	name(entry_block);

	while (!stack.empty())
	{
		auto *n = stack.back();
		stack.pop_back();
		auto &t = n->ir.terminator;
		if (t.type == Terminator::Type::Branch)
			fprintf(f, "b %s %s\n", name(n), name(t.direct_block));
		else if (t.type == Terminator::Type::Condition)
			fprintf(f, "c %s %s %s\n", name(n), name(t.true_block), name(t.false_block));
		else if (t.type == Terminator::Type::Switch)
		{
			// structurize-test takes the default target first.
			fprintf(f, "switch %s", name(n));
			for (auto &c : t.cases)
				if (c.is_default)
					fprintf(f, " %s", name(c.node));
			for (auto &c : t.cases)
				if (!c.is_default)
					fprintf(f, " %s", name(c.node));
			fprintf(f, "\n");
		}
	}
	fclose(f);
}
#endif

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

bool CFGStructurizer::run_trivial()
{
	experimental_unstructured_flow = false;
	recompute_cfg();
	sink_ssa_constructs();
	propagate_branch_control_hints();
	// Remove unused SSA ops in this path.
	remove_unused_ssa();

	return true;
}

bool CFGStructurizer::run_experimental_unstructured()
{
	experimental_unstructured_flow = true;
	reset_traversal();
	forward_visit();
	return true;
}

CFGNode *CFGStructurizer::get_entry_block() const
{
	return entry_block;
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

	duplicated_op->reserve_arguments(op->num_arguments());
	for (unsigned i = 0; i < op->num_arguments(); i++)
	{
		if (op->argument_is_literal(i))
			duplicated_op->add_literal(op->argument(i));
		else
			duplicated_op->add_id(get_remapped_id_for_duplicated_block(op->argument(i), id_remap));
	}

	if (op->id)
		id_remap[op->id] = duplicated_op->id;

	return duplicated_op;
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
			if (candidate == incoming.end() || block->forward_post_visit_order < candidate->block->forward_post_visit_order)
				candidate = itr;
	}

	return candidate;
}

void CFGStructurizer::duplicate_node(CFGNode *node)
{
	Vector<UnorderedMap<spv::Id, spv::Id>> rewritten_ids;
	assert(node->ir.terminator.type == Terminator::Type::Branch || node->ir.terminator.type == Terminator::Type::Condition);
	assert(node->pred.size() >= 2);
	assert(std::all_of(node->succ.begin(), node->succ.end(), [node](const CFGNode *succ) { return !node->dominates(succ); }));

	auto node_succs = node->succ;

	Vector<CFGNode *> break_blocks(node->pred.size());
	rewritten_ids.resize(node->pred.size());

	auto tmp_pred = node->pred;
	for (size_t i = 0, n = tmp_pred.size(); i < n; i++)
	{
		auto *pred = tmp_pred[i];
		auto &remap = rewritten_ids[i];

		// First, rewrite PHI inputs.
		// Since we only have one pred now, we can resolve PHIs directly.
		auto *block = pool.create_helper_node();
		block->interposing = true;
		block->name = node->name + ".dup." + pred->name;

		block->immediate_post_dominator = node->immediate_post_dominator;
		block->immediate_dominator = pred;

		pred->idom_children.push_back(block);
		pred->retarget_branch_pre_traversal(node, block);

		for (auto *succ : node_succs)
			block->add_branch(succ);

		for (auto &phi : node->ir.phi)
		{
			auto itr = find_incoming_value(pred, phi.incoming);
			assert(itr != phi.incoming.end());
			remap[phi.id] = itr->id;
		}

		UnorderedSet<spv::Id> remove_decoration_ids;

		for (auto *op : node->ir.operations)
		{
			auto *dup_op = duplicate_op(op, remap);

			bool nocontract = module.get_builder().hasDecoration(op->id, spv::DecorationNoContraction);
			if (nocontract)
			{
				remove_decoration_ids.insert(op->id);
				module.get_builder().addDecoration(dup_op->id, spv::DecorationNoContraction);
			}

			bool fpmode = module.get_builder().hasDecoration(op->id, spv::DecorationFPFastMathMode);
			if (fpmode)
			{
				// Reciprocals should always be allowed.
				// Should not be needed, but some drivers might get confused if it's not set on an fdiv.
				remove_decoration_ids.insert(op->id);
				module.get_builder().addDecoration(dup_op->id, spv::DecorationFPFastMathMode,
				                                   spv::FPFastMathModeAllowRecipMask);
			}

			block->ir.operations.push_back(dup_op);
		}

		module.get_builder().removeDecorations(remove_decoration_ids);

		block->ir.terminator.type = node->ir.terminator.type;
		block->ir.terminator.direct_block = node->ir.terminator.direct_block;
		block->ir.terminator.true_block = node->ir.terminator.true_block;
		block->ir.terminator.false_block = node->ir.terminator.false_block;
		if (node->ir.terminator.conditional_id)
		{
			block->ir.terminator.conditional_id =
				get_remapped_id_for_duplicated_block(node->ir.terminator.conditional_id, remap);
		}

		break_blocks[i] = block;
	}

	assert(node->pred.empty());

	// Finally, look at succ. If it takes PHI inputs from node, we'll have to rewrite the PHIs.
	// We know that node does not dominate succ,
	// so succ cannot use any SSA variables node generated directly
	// without using PHI nodes.

	// We might have placed ladders in between so that we need to fixup PHI later than just plain succ.
	// Chase down the chain and replace all PHIs.

	// First, collect all the succs that we are supposed to examine.
	// The list should also include succ_back_edge because it is not in the succ chain after recompute_cfg.
	Vector<CFGNode *> succs;
	for (auto *succ : node_succs)
	{
		while (succ)
		{
			if (succ->succ_back_edge)
				succs.push_back(succ->succ_back_edge);
			succs.push_back(succ);
			if (succ->succ.size() == 1)
				succ = succ->succ.front();
			else
				succ = nullptr;
		}
	}

	for (auto *succ : succs)
	{
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
			}
		}
	}
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
		for (unsigned i = 0; i < op->num_arguments(); i++)
		{
			if (!op->argument_is_literal(i))
				if (op->argument(i) == from)
					op->set_argument(i, to);
		}
	}

	if (ir.terminator.conditional_id == from)
		ir.terminator.conditional_id = to;
	if (ir.terminator.return_value == from)
		ir.terminator.return_value = to;
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

static bool type_class_is_opaque(spv::Op type_op)
{
	return type_op == spv::OpTypeImage || type_op == spv::OpTypeSampler ||
	       type_op == spv::OpTypeAccelerationStructureKHR;
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
	Vector<Operation> variable_pointer_like_operations[2];

	// Now, scan through all blocks and figure out which values are consumed in different blocks.
	for (auto *node : forward_post_visit_order)
	{
		for (auto *op : node->ir.operations)
		{
			for (unsigned i = 0; i < op->num_arguments(); i++)
				if (!op->argument_is_literal(i))
					mark_node_value_access(node, op->argument(i));

			if (op->op == spv::OpLoad && type_class_is_opaque(module.get_builder().getTypeClass(op->type_id)))
				variable_pointer_like_operations[0].push_back(*op);
			else if (op->op == spv::OpAccessChain)
				variable_pointer_like_operations[1].push_back(*op);
		}

		// Incoming PHI values are handled elsewhere by modifying the incoming block to the creating block.
		// Ignore these kinds of usage here.

		if (node->ir.terminator.conditional_id != 0)
			mark_node_value_access(node, node->ir.terminator.conditional_id);
		if (node->ir.terminator.return_value != 0)
			mark_node_value_access(node, node->ir.terminator.return_value);
	}

	// First, sink any opaque objects which are accessed in unexpected blocks after CFG rewrite.

	for (auto &rewrite_ordering : variable_pointer_like_operations)
	{
		for (auto &variable_op : rewrite_ordering)
		{
			auto itr = id_to_non_local_consumers.find(variable_op.id);
			if (itr != id_to_non_local_consumers.end())
			{
				// We will need to sink the operation.
				// Make sure all dependencies are also marked as used in potentially non-local block.

				// Sort for deterministic output.
				Vector<CFGNode *> local_consumers_sorted;
				for (auto *non_local_node : itr->second)
					local_consumers_sorted.push_back(non_local_node);

				std::sort(local_consumers_sorted.begin(), local_consumers_sorted.end(),
						  [](const CFGNode *a, const CFGNode *b) {
							  return a->forward_post_visit_order < b->forward_post_visit_order;
						  });

				for (unsigned i = 0; i < variable_op.num_arguments(); i++)
					if (!variable_op.argument_is_literal(i))
						for (auto *non_local_node : local_consumers_sorted)
							mark_node_value_access(non_local_node, variable_op.argument(i));

				for (auto *non_local_node : local_consumers_sorted)
				{
					auto *sunk_chain = module.allocate_op();
					*sunk_chain = variable_op;
					sunk_chain->id = module.allocate_id();

					if (module.get_builder().hasDecoration(variable_op.id, spv::DecorationNonUniform))
						module.get_builder().addDecoration(sunk_chain->id, spv::DecorationNonUniform);

					auto &ops = non_local_node->ir.operations;
					rewrite_consumed_ids(non_local_node->ir, variable_op.id, sunk_chain->id);
					ops.insert(ops.begin(), sunk_chain);
				}
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
		// These kinds of ops are handled specially by re-creating them as needed.
		bool rematerialized = module.get_builder().isPointerType(orig.type_id) ||
		                      type_class_is_opaque(module.get_builder().getTypeClass(orig.type_id));

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
		else if (!rematerialized)
		{
			// Invalid access chains are resolved above. We end up rewriting any non-dominated values instead.
			spv::Id alloca_var_id = module.create_variable(spv::StorageClassFunction, orig.type_id);

			auto *store_op = module.allocate_op(spv::OpStore);
			store_op->flags |= Operation::SSALoadStore;
			store_op->add_id(alloca_var_id);
			store_op->add_id(rewrite.id);
			orig.node->ir.operations.push_back(store_op);

			// For every non-local node which consumes ID, we load from the alloca'd variable instead.
			// Rewrite all ID references to point to the loaded value.
			for (auto *consumer : *rewrite.consumers)
			{
				spv::Id loaded_id = module.allocate_id();
				auto *load_op = module.allocate_op(spv::OpLoad, loaded_id, orig.type_id);
				load_op->flags |= Operation::SSALoadStore;
				load_op->add_id(alloca_var_id);

				rewrite_consumed_ids(consumer->ir, rewrite.id, loaded_id);

				consumer->ir.operations.insert(consumer->ir.operations.begin(), load_op);
			}
		}
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

		if (limited_control_flow_analysis && block->immediate_dominator && block->immediate_dominator != block)
			block->immediate_dominator->idom_children.push_back(block);
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
		node.idom_children.clear();
		node.fake_pred.clear();
		node.fake_succ.clear();
		node.reachable_direct_helpers.clear();

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
	Vector<CFGNode *> leaf_nodes;

	// Traverse from leaf nodes, back through their preds instead.
	// Clear out some state set by forward visit earlier.
	for (auto *node : forward_post_visit_order)
	{
		node->backward_visited = false;
		node->traversing = false;

		// For loops which can only exit from their header block,
		// certain loops will be unreachable when doing a backwards traversal.
		// Add fake branches so that backwards traversal still picks them up.
		if (node->succ.empty() && !node->succ_back_edge)
			leaf_nodes.push_back(node);
		else if (node->succ.empty() && node->succ_back_edge && node->succ_back_edge->ir.merge_info.merge_block)
			node->add_fake_branch(node->succ_back_edge->ir.merge_info.merge_block);
	}

	// Ensure stable shader caches compared to the recursive code.
	const auto visit_nodes = [this](const Vector<CFGNode *> &nodes)
	{
		for (auto itr = nodes.rbegin(); itr != nodes.rend(); ++itr)
			visit_stack.push_back(*itr);

		recursive_visit(nullptr,
		                [this](CFGNode *node) { backwards_visit_push(node); },
		                [this](CFGNode *node) { backwards_visit_resolve(node); },
		                [](CFGNode *node) { return node->backward_visited; });
	};

	visit_nodes(leaf_nodes);

	exit_block->backward_post_visit_order = backward_post_visit_order.size();
	exit_block->immediate_post_dominator = exit_block;
	exit_block->backward_visited = true;
	for (auto *leaf : leaf_nodes)
		leaf->immediate_post_dominator = exit_block;
}

void CFGStructurizer::backwards_visit_push(CFGNode *node)
{
	node->backward_visited = true;
	node->traversing = true;
	for (auto *pred : node->pred)
		push_visit_stack_backwards(pred);
	for (auto *pred : node->fake_pred)
		push_visit_stack_backwards(pred);
}

void CFGStructurizer::backwards_visit_resolve(CFGNode *entry)
{
	entry->backward_post_visit_order = backward_post_visit_order.size();
	backward_post_visit_order.push_back(entry);
}

void CFGStructurizer::visit_for_back_edge_analysis_push(CFGNode *entry)
{
	forward_visit_push(entry);
	// Just keep track of visit ordering somehow. Reuse visit order here.
	entry->backward_post_visit_order = backward_post_visit_order.size();
	backward_post_visit_order.push_back(entry);
}

void CFGStructurizer::visit_for_back_edge_analysis_resolve(CFGNode *entry)
{
	for (auto *succ : entry->succ)
	{
		// Reuse the existing vector to keep track of back edges.
		if (succ->traversing)
		{
			succ->fake_pred.push_back(entry);
			// We might have two different back-edges.
			entry->fake_succ.push_back(succ);
		}
	}

	// After we get here, we must have observed all back edges.
	// If there is more than one back edge, merge them.
	if (entry->fake_pred.size() >= 2)
	{
		auto *new_back_edge = pool.create_helper_node();
		new_back_edge->name = entry->name + ".back-edge-merge";
		for (auto *n : entry->fake_pred)
			n->retarget_branch_pre_traversal(entry, new_back_edge);
		new_back_edge->succ.push_back(entry);
		new_back_edge->ir.terminator.type = Terminator::Type::Branch;
		new_back_edge->ir.terminator.direct_block = entry;
		new_back_edge->add_branch(entry);
	}

	if (entry->fake_succ.size() >= 2)
	{
		// A node cannot have more than one back-edge in our implementation. Add interposing blocks to disambiguate.
		// Only the innermost node should remain.
		std::sort(entry->fake_succ.begin(), entry->fake_succ.end(), [](const CFGNode *a, const CFGNode *b)
		{
			return a->backward_post_visit_order < b->backward_post_visit_order;
		});

		entry->fake_succ.pop_back();
		Vector<CFGNode *> rewrites;
		std::swap(rewrites, entry->fake_succ);

		for (auto *succ : rewrites)
		{
			auto *new_back_edge = pool.create_helper_node();
			entry->retarget_branch_pre_traversal(succ, new_back_edge);

			auto itr = std::find(succ->fake_pred.begin(), succ->fake_pred.end(), entry);
			assert(itr != succ->fake_pred.end());
			*itr = new_back_edge;

			new_back_edge->name = entry->name + ".long-edge";
			new_back_edge->add_branch(succ);
			new_back_edge->ir.terminator.type = Terminator::Type::Branch;
			new_back_edge->ir.terminator.direct_block = succ;
		}
	}
}

void CFGStructurizer::push_visit_stack(CFGNode *node)
{
	if (!node->visited)
	{
		visit_stack.push_back(node);
		reachable_nodes.insert(node);
	}
}

void CFGStructurizer::push_visit_stack_backwards(CFGNode *node)
{
	if (!node->backward_visited)
		visit_stack.push_back(node);
}

void CFGStructurizer::forward_visit_resolve(CFGNode *entry)
{
	for (auto *succ : entry->succ)
	{
		if (succ->traversing)
		{
			// For now, only support one back edge.
			assert(experimental_unstructured_flow || !entry->succ_back_edge || entry->succ_back_edge == succ);
			entry->succ_back_edge = succ;

			// For now, only support one back edge.
			// DXIL seems to obey this.
			// For unstructured flow, we don't really do any passes, so just yolo it.
			assert(experimental_unstructured_flow || !succ->pred_back_edge || succ->pred_back_edge == entry);
			succ->pred_back_edge = entry;
		}
	}

	// Any back edges need to be handled specifically, only keep forward edges in succ/pred lists.
	// This avoids any infinite loop scenarios and needing to special case a lot of checks.
	if (entry->succ_back_edge)
	{
		auto itr = std::find(entry->succ.begin(), entry->succ.end(), entry->succ_back_edge);
		if (itr != entry->succ.end())
			entry->succ.erase(itr);
	}

	if (entry->pred_back_edge)
	{
		auto itr = std::find(entry->pred.begin(), entry->pred.end(), entry->pred_back_edge);
		if (itr != entry->pred.end())
			entry->pred.erase(itr);
	}

	entry->forward_post_visit_order = forward_post_visit_order.size();
	forward_post_visit_order.push_back(entry);
}

void CFGStructurizer::forward_visit_push(CFGNode *node)
{
	node->visited = true;
	node->traversing = true;
	for (auto *succ : node->succ)
		push_visit_stack(succ);
}

template <typename PushOp, typename ResolveOp, typename VisitedOp>
void CFGStructurizer::recursive_visit(CFGNode *node,
                                      const PushOp &push_op, const ResolveOp &resolve_op,
                                      const VisitedOp &is_visited_op)
{
	if (node)
		push_visit_stack(node);

	bool keep_iterating;

	while (!visit_stack.empty())
	{
		// Fan-out.
		do
		{
			CFGNode *to_visit = visit_stack.back();
			size_t last_visited_size = visit_stack.size();

			push_op(to_visit);

			keep_iterating = last_visited_size != visit_stack.size();
			// Reverse to avoid nuking shader caches. The first recursion entry will be picked first.
			if (keep_iterating)
				std::reverse(visit_stack.begin() + last_visited_size, visit_stack.end());
		} while (keep_iterating);

		// Resolve the stack.
		while (!visit_stack.empty() && is_visited_op(visit_stack.back()))
		{
			auto *node = visit_stack.back();
			if (node->traversing)
			{
				resolve_op(node);
				node->traversing = false;
			}
			visit_stack.pop_back();
		}
	}
}

void CFGStructurizer::forward_visit()
{
	recursive_visit(entry_block,
	                [this](CFGNode *node) { forward_visit_push(node); },
	                [this](CFGNode *node) { forward_visit_resolve(node); },
	                [this](CFGNode *node) { return node->visited; });
}

void CFGStructurizer::visit_for_back_edge_analysis()
{
	recursive_visit(entry_block,
	                [this](CFGNode *node) { visit_for_back_edge_analysis_push(node); },
	                [this](CFGNode *node) { visit_for_back_edge_analysis_resolve(node); },
	                [this](CFGNode *node) { return node->visited; });
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
	forward_visit();
	// Need to prune dead preds before computing dominance.
	prune_dead_preds();
	build_immediate_dominators();

	compute_dominance_frontier();
	if (!limited_control_flow_analysis)
		compute_full_control_flow_analysis();
}

void CFGStructurizer::compute_full_control_flow_analysis()
{
	build_reachability();
	backwards_visit();
	build_immediate_post_dominators();
	compute_post_dominance_frontier();
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
	auto *succ_node = pool.create_helper_node();
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

void CFGStructurizer::traverse(BlockEmissionInterface &iface)
{
	// Make sure all blocks are known to the backend before we emit code.
	// Prefer that IDs grow the further down the function we go.
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *block = forward_post_visit_order[index - 1];
		block->id = 0;
		iface.register_block(block);
	}

	// Need to emit blocks such that dominating blocks come before dominated blocks.
	for (auto index = forward_post_visit_order.size(); index; index--)
	{
		auto *block = forward_post_visit_order[index - 1];

		auto &merge = block->ir.merge_info;

		// We don't use the top-level merge stuff in the new structurizer.
		switch (merge.merge_type)
		{
		case MergeType::Selection:
			// Not reachable in the end, force merge to unreachable.
			if (merge.merge_block && !merge.merge_block->userdata)
				merge.merge_block = nullptr;

			if (merge.merge_block)
				iface.register_block(merge.merge_block);
			iface.emit_basic_block(block);
			break;

		case MergeType::Loop:
			if (merge.merge_block && !merge.merge_block->userdata)
				merge.merge_block = nullptr;
			if (merge.continue_block && !merge.continue_block->userdata)
				merge.continue_block = nullptr;

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
