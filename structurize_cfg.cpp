#include "structurize_cfg.hpp"
#include <algorithm>
#include <unordered_set>
#include <assert.h>

namespace DXIL2SPIRV
{
class DominatorBuilder
{
public:
	void add_block(CFGNode *block);
	CFGNode *get_dominator() const
	{
		return dominator;
	}

private:
	CFGNode *dominator = nullptr;
};

CFGStructurizer::CFGStructurizer(CFGNode &entry, CFGNodePool &pool_)
	: entry_block(entry), pool(pool_)
{
	visit(entry);
	build_immediate_dominators(entry);

	fprintf(stderr, "=== Structurize pass ===\n");
	structurize();

	reset_traversal();

	// We have created new blocks, so recompute these.
	visit(entry);
	build_immediate_dominators(entry);

	fprintf(stderr, "=== Structurize pass ===\n");
	structurize();

	validate_structured();
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
				block->immediate_dominator = CFGNode::find_common_dominator(block->immediate_dominator, edge);
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

void CFGNode::add_unique_header(CFGNode *node)
{
	auto itr = std::find(headers.begin(), headers.end(), node);
	if (itr == headers.end())
		headers.push_back(node);
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

void CFGNode::ensure_ids(BlockEmissionInterface &iface)
{
	if (id != 0)
		return;

	uint32_t count = 1;
	if (headers.size() > 1)
		count = headers.size();

	id = iface.allocate_ids(count);
}

unsigned CFGNode::num_forward_preds() const
{
	return unsigned(pred.size());
}

bool CFGNode::has_pred_back_edges() const
{
	return pred_back_edge != nullptr;
}

bool CFGNode::dominates(const CFGNode *other) const
{
	// Follow immediate dominator graph. Either we end up at this, or entry block.
	while (this != other)
	{
		// Entry block case.
		if (other->pred.empty())
			break;

		other = other->immediate_dominator;
	}

	return this == other;
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

	// If post-visit order is lower, post-dominance is impossible.
	// As we traverse, post visit order will monotonically decrease.
	if (start_node->visit_order < visit_order)
		return false;

	for (auto *node : start_node->succ)
		if (!post_dominates(node))
			return false;

	return true;
}

bool CFGNode::dominates_all_reachable_exits(const CFGNode &header) const
{
	if (succ_back_edge)
		return false;

	for (auto *node : succ)
		if (!header.dominates(node) || !node->dominates_all_reachable_exits(header))
			return false;

	return true;
}

bool CFGNode::dominates_all_reachable_exits() const
{
	return dominates_all_reachable_exits(*this);
}

void CFGStructurizer::reset_traversal()
{
	post_visit_order.clear();
	pool.for_each_node([](CFGNode &node) {
		node.visited = false;
		node.traversing = false;
		node.immediate_dominator = nullptr;
		node.headers.clear();
		node.merge = MergeType::None;
		node.loop_merge_block = nullptr;
		node.selection_merge_block = nullptr;

		if (node.succ_back_edge)
			node.succ.push_back(node.succ_back_edge);
		if (node.pred_back_edge)
			node.pred.push_back(node.pred_back_edge);
		node.succ_back_edge = nullptr;
		node.pred_back_edge = nullptr;
	});
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
	entry.visit_order = post_visit_order.size();
	post_visit_order.push_back(&entry);
}

CFGNode *CFGNode::find_common_dominator(const CFGNode *a, const CFGNode *b)
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

void CFGNode::retarget_branch(CFGNode *to_prev, CFGNode *to_next)
{
	assert(std::find(succ.begin(), succ.end(), to_prev) != succ.end());
	assert(std::find(to_prev->pred.begin(), to_prev->pred.end(), this) != to_prev->pred.end());
	assert(std::find(succ.begin(), succ.end(), to_next) == succ.end());
	assert(std::find(to_next->pred.begin(), to_next->pred.end(), this) == to_next->pred.end());

	to_prev->pred.erase(std::find(to_prev->pred.begin(), to_prev->pred.end(), this));
	succ.erase(std::find(succ.begin(), succ.end(), to_prev));
	add_branch(to_next);
}

void CFGNode::traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to)
{
	traverse_dominated_blocks_and_rewrite_branch(*this, from, to);
}

void CFGNode::traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to)
{
	for (auto *node : succ)
	{
		if (node == from)
			retarget_branch(from, to);
		else if (header.dominates(node))
			node->traverse_dominated_blocks_and_rewrite_branch(header, from, to);
	}
}

void CFGNode::retarget_succ_from(CFGNode *old_pred)
{
	for (auto *s : succ)
	{
		if (s->immediate_dominator == old_pred)
			s->immediate_dominator = this;

		for (auto &p : s->pred)
			if (p == old_pred)
				p = this;
	}
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

void CFGStructurizer::find_selection_merges()
{
	for (auto *node : post_visit_order)
	{
		if (node->num_forward_preds() <= 1)
			continue;

		// If there are 2 or more pred edges, try to merge execution.

		// The idom is the natural header block.
		auto *idom = node->immediate_dominator;
		assert(idom->succ.size() >= 2);

		if (idom->merge == MergeType::None)
		{
			idom->merge = MergeType::Selection;
			idom->selection_merge_block = node;
			node->add_unique_header(idom);
			fprintf(stderr, "Selection merge: %p (%s) -> %p (%s)\n",
			        static_cast<const void *>(idom),
					idom->name.c_str(),
					static_cast<const void *>(node),
					node->name.c_str());
		}
		else if (idom->merge == MergeType::Loop)
		{
			//fprintf(stderr, "IDOM is already a loop header somewhere else.\n");

			if (idom->loop_merge_block == node)
			{
				// This was a loop merge, not selection merge, ignore.
			}
			else
			{
				auto *selection_idom = create_helper_succ_block(idom);
				// If we split the loop header into the loop header -> selection merge header,
				// then we can merge into a continue block for example.
				selection_idom->merge = MergeType::Selection;
				idom->selection_merge_block = node;
				node->add_unique_header(idom);
				fprintf(stderr, "Selection merge: %p (%s) -> %p (%s)\n",
				        static_cast<const void *>(selection_idom),
				        selection_idom->name.c_str(),
				        static_cast<const void *>(node),
				        node->name.c_str());
			}
		}
		else if (idom->merge == MergeType::Selection)
		{
#if 0
			//fprintf(stderr, "IDOM is already a selection header somewhere else.\n");

			// We might have a classic "exit sequence" here.
			// This is a case where a return is called from nested branches.
			// The only way we can perform this "exit" in a structured way is by wrapping
			// the construct in a loop.
			if (idom->selection_merge_block->post_dominates(node))
			{
				// If the outer selection merge post dominates our inner merge block,
				// we can split the outer selection header in two. One outer loop header,
				// and one outer selection construct.

				idom->merge = MergeType::LoopToSelection;
				idom->loop_merge_block = idom->selection_merge_block;
				idom->selection_merge_block = node;
				node->add_unique_header(idom);
				fprintf(stderr, "Selection merge: %p (%s) -> %p (%s)\n",
				        static_cast<const void *>(idom),
				        idom->name.c_str(),
				        static_cast<const void *>(node),
				        node->name.c_str());
				fprintf(stderr, "Hoisted loop: %p (%s) -> %p (%s)\n",
				        static_cast<const void *>(idom),
						idom->name.c_str(),
						static_cast<const void *>(idom->loop_merge_block),
						idom->loop_merge_block->name.c_str());
			}
			else
			{
				// We are hosed. There is no obvious way to merge execution here.
				// This might be okay.
				fprintf(stderr, "Cannot merge execution for node %p (%s).\n",
						static_cast<const void *>(node),
						node->name.c_str());
			}
#endif
		}
		else
		{
			// We are hosed. There is no obvious way to merge execution here.
			// This might be okay.
			fprintf(stderr, "Cannot merge execution for node %p (%s).\n",
			        static_cast<const void *>(node),
			        node->name.c_str());
		}
	}
}

CFGStructurizer::LoopExitType CFGStructurizer::get_loop_exit_type(const CFGNode &header, const CFGNode &node) const
{
	if (header.dominates(&node) && node.dominates_all_reachable_exits())
		return LoopExitType::Exit;

	if (header.dominates(&node))
		return LoopExitType::Merge;
	else
		return LoopExitType::Escape;
}

CFGNode *CFGStructurizer::create_helper_pred_block(CFGNode *node)
{
	auto *pred_node = pool.create_internal_node();
	pred_node->add_branch(node);
	pred_node->name = node->name + ".pred";

	// Fixed up later.
	pred_node->immediate_dominator = node->immediate_dominator;

	return pred_node;
}

CFGNode *CFGStructurizer::create_helper_succ_block(CFGNode *node)
{
	auto *succ_node = pool.create_internal_node();
	succ_node->name = node->name + ".succ";

	// Fixup visit order later.
	succ_node->visit_order = node->visit_order;

	std::swap(succ_node->succ, node->succ);
	std::swap(succ_node->pred, node->pred);

	// Do not swap back edges, only forward edges.
	succ_node->retarget_succ_from(node);

	node->add_branch(succ_node);
	return succ_node;
}

CFGNode *CFGStructurizer::find_common_post_dominator(std::vector<CFGNode *> candidates)
{
	std::vector<CFGNode *> next_nodes;
	const auto add_unique_next_node = [&](CFGNode *node) {
		if (std::find(next_nodes.begin(), next_nodes.end(), node) == next_nodes.end())
			next_nodes.push_back(node);
	};

	while (candidates.size() != 1)
	{
		// Sort candidates by post visit order.
		std::sort(candidates.begin(), candidates.end(), [](const CFGNode *a, const CFGNode *b) {
			return a->visit_order > b->visit_order;
		});

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

	return candidates.front();
}

void CFGStructurizer::find_loops()
{
	for (auto index = post_visit_order.size(); index; index--)
	{
		// Visit in reverse order so we resolve outer loops first,
		// this lets us detect ladder-breaking loops.
		auto *node = post_visit_order[index - 1];

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
		std::vector<CFGNode *> dominated_exit;
		std::vector<CFGNode *> non_dominated_exit;

		for (auto *loop_exit : merge_tracer.loop_exits)
		{
			auto exit_type = get_loop_exit_type(*node, *loop_exit);
			switch (exit_type)
			{
			case LoopExitType::Exit:
				direct_exits.push_back(loop_exit);
				break;

			case LoopExitType::Merge:
				dominated_exit.push_back(loop_exit);
				break;

			case LoopExitType::Escape:
				non_dominated_exit.push_back(loop_exit);
				break;
			}
		}

		// If we only have one direct exit, consider it our merge block.
		// Pick either Merge or Escape.
		if (direct_exits.size() == 1 && dominated_exit.empty() && non_dominated_exit.empty())
		{
			if (node->dominates(direct_exits.front()))
				std::swap(dominated_exit, direct_exits);
			else
				std::swap(non_dominated_exit, direct_exits);
		}

		if (dominated_exit.empty() && non_dominated_exit.empty())
		{
			// There can be zero loop exits. This means we have no merge block.
			// We will invent a merge block to satisfy SPIR-V validator, and declare it as unreachable.
			node->loop_merge_block = nullptr;
			fprintf(stderr, "Loop without merge: %p (%s)\n",
			        static_cast<const void *>(node), node->name.c_str());
		}
		else if (dominated_exit.size() == 1 && non_dominated_exit.empty())
		{
			// Clean merge.
			// This is a unique merge block. There can be no other merge candidate.
			node->loop_merge_block = dominated_exit.front();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			fprintf(stderr, "Loop with simple merge: %p (%s) -> %p (%s)\n",
			        static_cast<const void *>(node),
			        node->name.c_str(),
			        static_cast<const void *>(node->loop_merge_block),
			        node->loop_merge_block->name.c_str());
		}
		else if (dominated_exit.empty() && non_dominated_exit.size() == 1)
		{
			// Single-escape merge.
			// It is unique, but we need workarounds later.
			node->loop_merge_block = non_dominated_exit.front();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			fprintf(stderr, "Loop with ladder merge: %p (%s) -> %p (%s)\n",
			        static_cast<const void *>(node),
			        node->name.c_str(),
			        static_cast<const void *>(node->loop_merge_block),
			        node->loop_merge_block->name.c_str());
		}
		else
		{
			// We have multiple blocks which are merge candidates. We need to figure out where execution reconvenes.
			std::vector<CFGNode *> merges;
			merges.insert(merges.end(), dominated_exit.begin(), dominated_exit.end());
			merges.insert(merges.end(), non_dominated_exit.begin(), non_dominated_exit.end());

			// If we have multiple exit blocks, figure out where execution can reconvene.
			CFGNode *merge = CFGStructurizer::find_common_post_dominator(std::move(merges));
			if (!merge)
			{
				fprintf(stderr, "Failed to find a common merge ...\n");
			}
			else
			{
				node->loop_merge_block = merge;
				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);

				if (node->dominates(merge))
				{
					// Clean merge.
					// This is a unique merge block. There can be no other merge candidate.
					fprintf(stderr, "Loop with simple multi-exit merge: %p (%s) -> %p (%s)\n",
					        static_cast<const void *>(node),
					        node->name.c_str(),
					        static_cast<const void *>(node->loop_merge_block),
					        node->loop_merge_block->name.c_str());
				}
				else
				{
					// Single-escape merge.
					// It is unique, but we need workarounds later.
					fprintf(stderr, "Loop with ladder multi-exit merge: %p (%s) -> %p (%s)\n",
					        static_cast<const void *>(node),
					        node->name.c_str(),
					        static_cast<const void *>(node->loop_merge_block),
					        node->loop_merge_block->name.c_str());
				}
			}
		}
	}
}

void CFGStructurizer::split_merge_blocks()
{
	for (auto *node : post_visit_order)
	{
		if (node->headers.size() <= 1)
			continue;

		// If this block was the merge target for more than one construct,
		// we will need to split the block. In SPIR-V, a merge block can only be the merge target for one construct.
		// However, we can set up a chain of merges where inner scope breaks to outer scope with a dummy basic block.
		// The outer scope comes before the inner scope merge.
		std::sort(node->headers.begin(), node->headers.end(),
		          [](const CFGNode *a, const CFGNode *b) {
			          return a->visit_order > b->visit_order;
		          });

		// Verify that scopes are actually nested.
		// This means header[N] must dominate header[M] where N > M.
		for (size_t i = 1; i < node->headers.size(); i++)
		{
			if (!node->headers[i - 1]->dominates(node->headers[i]))
				fprintf(stderr, "Scopes are not nested.\n");
		}

		std::vector<CFGNode *> intermediate_blocks(node->headers.size() - 1);
		intermediate_blocks[0] = create_helper_pred_block(node);
		for (size_t i = 1; i < node->headers.size() - 1; i++)
			intermediate_blocks[i] = create_helper_pred_block(intermediate_blocks[i - 1]);

		// Start from innermost scope, and rewrite all branches to merge block to our intermediate block instead,
		// but only as long as we dominate the rewritten block.
		for (size_t i = node->headers.size() - 1; i; i--)
		{
			node->headers[i]->traverse_dominated_blocks_and_rewrite_branch(node, intermediate_blocks[i - 1]);
		}
	}
}

void CFGStructurizer::structurize()
{
	find_loops();
	find_selection_merges();
	split_merge_blocks();
}

void CFGStructurizer::validate_structured()
{
	for (auto *node : post_visit_order)
	{
		if (node->headers.size() > 1)
		{
			fprintf(stderr, "Node %s has %u headers!\n", node->name.c_str(), unsigned(node->headers.size()));
		}

		if (node->merge == MergeType::Loop)
		{
			if (!node->dominates(node->loop_merge_block))
			{
				fprintf(stderr, "Node %s does not dominate its merge block %s!\n",
				        node->name.c_str(),
				        node->loop_merge_block->name.c_str());
			}
		}
		else if (node->merge == MergeType::Selection)
		{
			if (!node->dominates(node->selection_merge_block))
			{
				fprintf(stderr, "Node %s does not dominate its selection merge block %s!\n",
				        node->name.c_str(),
				        node->selection_merge_block->name.c_str());
			}
		}
	}
	fprintf(stderr, "Successful CFG validation!\n");
}

void CFGStructurizer::traverse(BlockEmissionInterface &iface)
{
	// Need to emit blocks such that dominating blocks come before dominated blocks.
	for (auto index = post_visit_order.size(); index; index--)
	{
		auto *block = post_visit_order[index - 1];

		block->ensure_ids(iface);
		for (auto *succ : block->succ)
			succ->ensure_ids(iface);
		if (block->pred_back_edge)
			block->pred_back_edge->ensure_ids(iface);
		if (block->selection_merge_block)
			block->selection_merge_block->ensure_ids(iface);
		if (block->loop_merge_block)
			block->loop_merge_block->ensure_ids(iface);

		if (block->headers.size() >= 2)
		{
			// Emit ladder breaking branches to resolve multi-level merges.
			uint32_t start_id = block->id + (block->headers.size() - 1);
			for (size_t i = 0; i < block->headers.size() - 1; i++, start_id--)
				iface.emit_helper_block(start_id, nullptr, start_id - 1, {});
		}

		BlockEmissionInterface::MergeInfo merge;

		switch (block->merge)
		{
		case MergeType::Selection:
			merge.merge_block = block->selection_merge_block->id;
			merge.merge_type = block->merge;
			iface.emit_basic_block(block->id, block, block->userdata, merge);
			break;

		case MergeType::Loop:
			merge.merge_block = block->loop_merge_block->id;
			merge.merge_type = block->merge;
			merge.continue_block = block->pred_back_edge->id;
			iface.emit_basic_block(block->id, block, block->userdata, merge);
			break;

		default:
			iface.emit_basic_block(block->id, block, block->userdata, merge);
			break;
		}
	}
}

void DominatorBuilder::add_block(CFGNode *block)
{
	if (!dominator)
		dominator = block;
	else if (dominator != block)
		dominator = CFGNode::find_common_dominator(dominator, block);
}

CFGNode *CFGNodePool::get_node_from_userdata(void *userdata)
{
	auto *node = find_node_from_userdata(userdata);
	if (node)
		return node;

	auto &cfg = nodes[userdata];
	cfg.reset(new CFGNode);
	cfg->userdata = userdata;
	return cfg.get();
}

void CFGNodePool::set_name(void *userdata, const std::string &str)
{
	get_node_from_userdata(userdata)->name = str;
}

const std::string &CFGNodePool::get_name(void *userdata)
{
	return get_node_from_userdata(userdata)->name;
}

void CFGNodePool::add_branch(void *from, void *to)
{
	get_node_from_userdata(from)->add_branch(get_node_from_userdata(to));
}

CFGNode *CFGNodePool::find_node_from_userdata(void *userdata) const
{
	auto itr = nodes.find(userdata);
	if (itr != nodes.end())
		return itr->second.get();
	else
		return nullptr;
}

CFGNode *CFGNodePool::create_internal_node()
{
	internal_nodes.emplace_back(new CFGNode);
	return internal_nodes.back().get();
}

uint32_t CFGNodePool::get_block_id(void *userdata) const
{
	auto *node = find_node_from_userdata(userdata);
	if (node)
		return node->id;
	else
		return 0;
}

CFGNodePool::CFGNodePool()
{}

CFGNodePool::~CFGNodePool()
{}
}