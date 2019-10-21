#include "structurize_cfg.hpp"
#include <algorithm>
#include <unordered_set>
#include <assert.h>

namespace DXIL2SPIRV
{
CFGStructurizer::CFGStructurizer(CFGNode &entry)
{
	visit(entry);
	build_immediate_dominators(entry);
	structurize();
}

void CFGStructurizer::build_immediate_dominators(CFGNode &entry)
{
	entry.immediate_dominator = &entry;
	for (auto i = post_visit_order.size(); i; i--)
	{
		auto *block = post_visit_order[i - 1];
		auto &pred = block->pred;

		// This is for the entry block, but we've already set up the dominators.
		if (pred.empty())
			continue;

		for (auto *edge : pred)
		{
			if (block->immediate_dominator)
				block->immediate_dominator = find_common_dominator(block->immediate_dominator, edge);
			else
				block->immediate_dominator = edge;
		}
	}
}

void CFGNode::add_unique_pred(CFGNode *node)
{
	auto itr = std::find(pred.begin(), pred.end(), node);
	if (itr == pred.end())
		pred.push_back(node);
}

void CFGNode::add_branch(CFGNode *to)
{
	add_unique_succ(to);
	to->add_unique_pred(this);
}

void CFGNode::add_unique_succ(CFGNode *node)
{
	auto itr = std::find(succ.begin(), succ.end(), node);
	if (itr == succ.end())
		succ.push_back(node);
}

unsigned CFGNode::num_forward_preds() const
{
	return unsigned(pred.size());
}

bool CFGNode::has_pred_back_edges() const
{
	return pred_back_edge != nullptr;
}

bool CFGNode::post_dominates(const CFGNode *start_node) const
{
	// Crude algorithm, try to traverse from start_node, and if we can find an exit without entering this,
	// we do not post-dominate.
	// Creating a post-dominator tree might be viable?

	// Terminated at this.
	if (start_node == this)
		return true;

	// Found exit.
	if (start_node->succ.empty())
		return false;

	for (auto *node : start_node->succ)
		if (!post_dominates(node))
			return false;

	return true;
}

void CFGStructurizer::visit(CFGNode &entry)
{
	entry.visited = true;
	entry.traversing = true;

	for (auto *succ : entry.succ)
	{
		if (succ->traversing)
		{
			// For now, only support one back edge.
			assert(!entry.succ_back_edge);
			entry.succ_back_edge = succ;

			// For now, only support one back edge.
			assert(!succ->pred_back_edge);
			succ->pred_back_edge = &entry;
		}
		else if (!succ->visited)
			visit(*succ);
	}

	// Any back edges need to be handled specifically, only keep forward edges in succ/pred lists.
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
	entry.visit_order = post_visit_order.size();
	post_visit_order.push_back(&entry);
}

CFGNode *CFGStructurizer::find_common_dominator(const CFGNode *a, const CFGNode *b)
{
	assert(a);
	assert(b);

	while (a != b)
	{
		assert(a->immediate_dominator);
		assert(b->immediate_dominator);

		if (a->visit_order < b->visit_order)
			a = a->immediate_dominator;
		else
			b = b->immediate_dominator;
	}
	return const_cast<CFGNode *>(a);
}

struct LoopBacktracer
{
	void trace_to_parent(const CFGNode *header, const CFGNode *block);
	std::unordered_set<const CFGNode *> traced_blocks;
};

struct LoopMergeTracer
{
	explicit LoopMergeTracer(const LoopBacktracer &backtracer_)
		: backtracer(backtracer_)
	{
	}

	void trace_from_parent(const CFGNode *header);
	const LoopBacktracer &backtracer;
	std::unordered_set<const CFGNode *> loop_exits;
	std::unordered_set<const CFGNode *> traced_blocks;
};

void LoopBacktracer::trace_to_parent(const CFGNode *header, const CFGNode *block)
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

void LoopMergeTracer::trace_from_parent(const CFGNode *header)
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

void CFGStructurizer::find_loops()
{
	for (auto *node : post_visit_order)
	{
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

		// Only care about exit blocks which do not terminate the CFG (e.g. kill/return/etc).
		std::vector<const CFGNode *> non_terminating_exits;
		for (auto *loop_exit : merge_tracer.loop_exits)
			if (!loop_exit->succ.empty())
				non_terminating_exits.push_back(loop_exit);

		// There are several cases here.
		if (non_terminating_exits.empty())
		{
			// There can be zero loop exits. This means we have no merge block.
			// We will invent a merge block, and declare it as unreachable.

			// Unreachable.
			node->merge_block = nullptr;
			fprintf(stderr, "Loop without merge: %s\n", node->name.c_str());
		}
		else if (non_terminating_exits.size() == 1)
		{
			// This is a unique merge block. There can be no other candidate.
			node->merge_block = *merge_tracer.loop_exits.begin();

			assert(node->merge_block->merged_from_header == nullptr);
			const_cast<CFGNode *>(node->merge_block)->merged_from_header = node;
			fprintf(stderr, "Loop with merge: %s -> %s\n", node->name.c_str(), node->merge_block->name.c_str());
		}
		else
		{
			// Multiple candidates. Hopefully, there is a block which post-dominates the others.
			// That block becomes the merge target.
			const CFGNode *merge_block = nullptr;
			for (auto *candidate : non_terminating_exits)
			{
				bool post_dominates_all = true;
				for (auto *source : non_terminating_exits)
				{
					if (!candidate->post_dominates(source))
					{
						post_dominates_all = false;
						break;
					}
				}

				if (post_dominates_all)
				{
					merge_block = candidate;
					break;
				}
			}

			if (merge_block)
			{
				node->merge_block = merge_block;
				assert(node->merge_block->merged_from_header == nullptr);
				const_cast<CFGNode *>(node->merge_block)->merged_from_header = node;
				fprintf(stderr, "Loop with merge: %s -> %s\n", node->name.c_str(), node->merge_block->name.c_str());
			}
			else
			{
				// No candidate was found. We are kinda screwed ...
				assert(0 && "Could not find unique loop merge candidate.");
			}
		}
	}
}

void CFGStructurizer::structurize()
{
	find_loops();
#if 0
	for (auto *node : post_visit_order)
	{
		if (node->merge != MergeType::None)
			continue;

		if (node->num_forward_preds() > 1)
		{
			// This is a merge candidate.
			DominatorBuilder builder;
			for (auto *pred : node->pred)
			{
				if (pred->back_edge != node)
					builder.add_block(pred);
			}

			auto *dominator = builder.get_dominator();
			assert(dominator->merge == MergeType::None);

			if (dominator->has_pred_back_edges())
			{
				dominator->merge = MergeType::Loop;
				fprintf(stderr, "Found loop header: %s\n", dominator->name.c_str());
				fprintf(stderr, "  Merge: %s\n", node->name.c_str());
			}
			else
			{
				dominator->merge = MergeType::Selection;
				fprintf(stderr, "Found selection header: %s\n", dominator->name.c_str());
				fprintf(stderr, "  Merge: %s\n", node->name.c_str());
			}
			dominator->merge_block = node;
		}
		else if (node->has_pred_back_edges())
		{
			// This is a loop.
			assert(node->succ.size() == 2);
			node->merge = MergeType::Loop;
			node->merge_block = node->succ[0] != node ? node->succ[0] : node->succ[1];
			fprintf(stderr, "Found loop header: %s\n", node->name.c_str());
			fprintf(stderr, "  Merge: %s\n", node->merge_block->name.c_str());
		}
	}
#endif
}

void DominatorBuilder::add_block(CFGNode *block)
{
	if (!dominator)
		dominator = block;
	else if (dominator != block)
		dominator = CFGStructurizer::find_common_dominator(dominator, block);
}
}