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
#include "node.hpp"
#include "node_pool.hpp"
#include "spirv_module.hpp"
#include <algorithm>
#include <assert.h>

namespace dxil_spv
{
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

	duplicated_op->flags = op->flags;
	return duplicated_op;
}

void CFGStructurizer::duplicate_node(CFGNode *node)
{
	Vector<UnorderedMap<spv::Id, spv::Id>> rewritten_ids;
	assert(node->ir.terminator.type == Terminator::Type::Branch || node->ir.terminator.type == Terminator::Type::Condition);
	assert(node->pred.size() >= 2);
	assert(std::all_of(node->succ.begin(), node->succ.end(), [node](const CFGNode *succ) { return !node->dominates(succ); }));

	// We have removed PHI when doing this pass already.
	assert(node->ir.phi.empty());

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

		// The algorithm that uses duplicate_node does not bother with checking dominance really.
		block->reset_immediate_dominator_after_interposing(pred, false);

		pred->idom_children.push_back(block);
		pred->retarget_branch_pre_traversal(node, block);

		for (auto *succ : node_succs)
			block->add_branch(succ);

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

void CFGStructurizer::retarget_succ_from(CFGNode *new_node, CFGNode *old_pred)
{
	for (auto *s : new_node->succ)
		for (auto &p : s->pred)
			if (p == old_pred)
				p = new_node;

	for (auto *node : new_node->idom_children)
		if (node->immediate_dominator == old_pred)
			node->immediate_dominator = new_node;

	new_node->reset_immediate_dominator_after_interposing(old_pred, true);

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
	std::swap(succ_node->idom_children, node->idom_children);
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
	node->idom_children.push_back(succ_node);
	return succ_node;
}
}