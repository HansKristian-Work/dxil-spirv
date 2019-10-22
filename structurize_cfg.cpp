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

struct CFGNode
{
	std::string name;
	uint32_t id = 0;
	uint32_t visit_order = 0;
	bool visited = false;
	bool traversing = false;

	MergeType merge = MergeType::None;
	const CFGNode *loop_merge_block = nullptr;
	const CFGNode *selection_merge_block = nullptr;
	std::vector<const CFGNode *> headers;

	CFGNode *immediate_dominator = nullptr;
	std::vector<CFGNode *> succ;
	std::vector<CFGNode *> pred;
	CFGNode *pred_back_edge = nullptr;
	CFGNode *succ_back_edge = nullptr;

	void add_branch(CFGNode *to);
	void add_unique_succ(CFGNode *node);
	void add_unique_pred(CFGNode *node);
	void add_unique_header(CFGNode *node);
	unsigned num_forward_preds() const;
	bool has_pred_back_edges() const;
	bool dominates(const CFGNode *other) const;
	bool post_dominates(const CFGNode *other) const;
	bool trivial_flow_to_exit() const;
	void ensure_ids(BlockEmissionInterface &iface);
	static CFGNode *find_common_dominator(const CFGNode *a, const CFGNode *b);

	void *userdata = nullptr;
};

CFGStructurizer::CFGStructurizer(CFGNode &entry)
	: entry_block(entry)
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
	if (merge == MergeType::LoopToSelection)
		count++;

	id = iface.allocate_ids(count);
}

bool CFGNode::trivial_flow_to_exit() const
{
	// Checks if there is a direct, branch-less path to a terminating block.
	// There cannot be any merge on this path. We're essentially checking if we could trivially reduce
	// a path of A (start) -> B -> C -> EXIT into one block.
	const auto *node = this;
	while (!node->succ.empty())
	{
		if (node->succ.size() >= 2)
			return false;
		else
			node = node->succ.front();

		if (node->pred.size() >= 2)
			return false;
	}
	return true;
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
			assert(!entry.succ_back_edge);
			entry.succ_back_edge = succ;

			// For now, only support one back edge.
			// DXIL seems to obey this.
			assert(!succ->pred_back_edge);
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

			// TODO: If idom is a loop header, we might have to split blocks here?
			// If we split the loop header into the loop header -> selection merge header,
			// then we can merge into a continue block.
			idom->merge = MergeType::LoopToSelection;
			idom->selection_merge_block = node;
			node->add_unique_header(idom);
			fprintf(stderr, "Selection merge: %p (%s) -> %p (%s)\n",
			        static_cast<const void *>(idom),
			        idom->name.c_str(),
			        static_cast<const void *>(node),
					node->name.c_str());
		}
		else if (idom->merge == MergeType::Selection)
		{
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

		// Only care about exit blocks which do not terminate the CFG right away (e.g. kill/return/etc).
		std::vector<const CFGNode *> non_terminating_exits;
		for (auto *loop_exit : merge_tracer.loop_exits)
			if (!loop_exit->trivial_flow_to_exit())
				non_terminating_exits.push_back(loop_exit);

		// There are several cases here.
		if (non_terminating_exits.empty())
		{
			// There can be zero loop exits. This means we have no merge block.
			// We will invent a merge block to satisfy SPIR-V validator, and declare it as unreachable.

			node->loop_merge_block = nullptr;
			fprintf(stderr, "Loop without merge: %p (%s)\n",
					static_cast<const void *>(node), node->name.c_str());
		}
		else if (non_terminating_exits.size() == 1)
		{
			// This is a unique merge block. There can be no other merge candidate.
			node->loop_merge_block = *merge_tracer.loop_exits.begin();

			const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
			fprintf(stderr, "Loop with merge: %p (%s) -> %p (%s)\n",
					static_cast<const void *>(node),
					node->name.c_str(),
					static_cast<const void *>(node->loop_merge_block),
					node->loop_merge_block->name.c_str());
		}
		else
		{
			// Multiple candidates. Hopefully, there exists a block which post-dominates all candidates.
			// That block becomes the merge target.
			const CFGNode *merge_block = nullptr;

			// Try to thread through blocks with unique successor to make it
			// possible to use post-domination check in more cases.
			// This lets us detect multi-level breaks, which DXIL can do, but SPIR-V cannot.
			bool did_work;
			do
			{
				did_work = false;
				for (auto *&candidate : non_terminating_exits)
				{
					for (auto *other : non_terminating_exits)
					{
						if (candidate == other)
							continue;

						// Only iterate if our post visit order is > the other one. This lets blocks catch up
						// with each other.
						if (candidate->succ.size() == 1 && candidate->visit_order > other->visit_order)
						{
							candidate = candidate->succ.front();
							did_work = true;
						}
					}
				}
			} while (did_work);

			// Now, we try to figure out is there is a post-dominating block among the candidates.
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
				node->loop_merge_block = merge_block;
				const_cast<CFGNode *>(node->loop_merge_block)->add_unique_header(node);
				fprintf(stderr, "Loop with merge: %s -> %s\n", node->name.c_str(),
				        node->loop_merge_block->name.c_str());
			}
			else
			{
				// No candidate was found. We are kinda screwed ...
				assert(0 && "Could not find unique loop merge candidate.");
			}
		}
	}
}

void CFGStructurizer::split_merge_blocks()
{
	for (auto *node : post_visit_order)
	{
		if (node->headers.size() > 1)
		{
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
		}
	}
}

void CFGStructurizer::structurize()
{
	find_loops();
	find_selection_merges();
	split_merge_blocks();
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

		if (block->headers.size() >= 2)
		{
			// Emit ladder breaking branches to resolve multi-level merges.
			uint32_t start_id = block->id + (block->headers.size() - 1) +
			                    (block->merge == MergeType::LoopToSelection ? 1 : 0);
			for (size_t i = 0; i < block->headers.size() - 1; i++, start_id--)
				iface.emit_helper_block(start_id, start_id - 1, {});
		}

		BlockEmissionInterface::MergeInfo merge;

		switch (block->merge)
		{
		case MergeType::Selection:
			merge.merge_block = block->selection_merge_block->id;
			merge.merge_type = block->merge;
			iface.emit_basic_block(block->id, block->userdata, merge);
			break;

		case MergeType::Loop:
			merge.merge_block = block->loop_merge_block->id;
			merge.merge_type = block->merge;
			merge.continue_block = block->pred_back_edge->id;
			iface.emit_basic_block(block->id, block->userdata, merge);
			break;

		case MergeType::LoopToSelection:
			// Start with a dummy loop header.
			merge.merge_block = block->loop_merge_block->id;
			merge.merge_type = MergeType::Loop;
			merge.continue_block = iface.allocate_id();
			iface.emit_helper_block(block->id, block->id + 1, merge);
			iface.emit_helper_block(merge.continue_block, block->id, {});
			merge.merge_block = block->selection_merge_block->id;
			merge.merge_type = MergeType::Selection;
			merge.continue_block = 0;
			iface.emit_basic_block(block->id + 1, block->userdata, merge);
			break;

		default:
			iface.emit_basic_block(block->id, block->userdata, merge);
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