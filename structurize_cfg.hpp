#pragma once

#include <vector>
#include <stdint.h>
#include <string>

namespace DXIL2SPIRV
{
enum class MergeType
{
	None,
	Loop,
	Selection,
	LoopToSelection
};

struct CFGNode
{
	std::string name;
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
	static CFGNode *find_common_dominator(const CFGNode *a, const CFGNode *b);
};

class CFGStructurizer
{
public:
	explicit CFGStructurizer(CFGNode &entry);

private:
	std::vector<CFGNode *> post_visit_order;
	void visit(CFGNode &entry);
	void build_immediate_dominators(CFGNode &entry);
	void structurize();
	void find_loops();
	void find_selection_merges();
	void split_merge_blocks();
};

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
}