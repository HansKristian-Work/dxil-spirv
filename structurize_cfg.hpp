#pragma once

#include <vector>
#include <stdint.h>
#include <string>
#include <unordered_map>
#include <memory>

namespace DXIL2SPIRV
{
enum class MergeType
{
	None,
	Loop,
	Selection
};

class BlockEmissionInterface;

struct CFGNode
{
	std::string name;
	uint32_t id = 0;
	uint32_t visit_order = 0;
	bool visited = false;
	bool traversing = false;

	MergeType merge = MergeType::None;
	CFGNode *loop_merge_block = nullptr;
	CFGNode *loop_ladder_block = nullptr;
	CFGNode *selection_merge_block = nullptr;
	std::vector<CFGNode *> headers;

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
	bool branchless_path_to(const CFGNode *to) const;
	bool post_dominates(const CFGNode *other) const;
	bool dominates_all_reachable_exits() const;
	void ensure_ids(BlockEmissionInterface &iface);
	static CFGNode *find_common_dominator(const CFGNode *a, const CFGNode *b);

	void retarget_branch(CFGNode *to_prev, CFGNode *to_next);
	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *from, CFGNode *to);
	void retarget_succ_from(CFGNode *node);
	void retarget_pred_from(CFGNode *node);

	void *userdata = nullptr;

private:
	bool dominates_all_reachable_exits(const CFGNode &header) const;
	void traverse_dominated_blocks_and_rewrite_branch(const CFGNode &header, CFGNode *from, CFGNode *to);
};

class CFGNodePool
{
public:
	CFGNodePool();
	~CFGNodePool();

	CFGNode *get_node_from_userdata(void *userdata);
	CFGNode *find_node_from_userdata(void *userdata) const;
	CFGNode *create_internal_node();
	uint32_t get_block_id(void *userdata) const;
	void add_branch(void *from, void *to);
	void set_name(void *userdata, const std::string &str);
	const std::string &get_name(void *username);

	template <typename Op>
	void for_each_node(const Op &op)
	{
		for (auto &node : nodes)
			op(*node.second);
		for (auto &node : internal_nodes)
			op(*node);
	}

private:
	std::unordered_map<void *, std::unique_ptr<CFGNode>> nodes;
	std::vector<std::unique_ptr<CFGNode>> internal_nodes;
};

class BlockEmissionInterface
{
public:
	virtual uint32_t allocate_id() = 0;
	virtual uint32_t allocate_ids(uint32_t count) = 0;

	struct MergeInfo
	{
		MergeType merge_type = MergeType::None;
		uint32_t merge_block = 0;
		uint32_t continue_block = 0;
	};
	virtual void emit_basic_block(uint32_t id, CFGNode *node, void *userdata, const MergeInfo &info) = 0;
	virtual void emit_helper_block(uint32_t id, CFGNode *node, uint32_t next_block, const MergeInfo &info) = 0;
};

class CFGStructurizer
{
public:
	CFGStructurizer(CFGNode &entry, CFGNodePool &pool);
	void traverse(BlockEmissionInterface &iface);

private:
	CFGNode *entry_block;
	CFGNodePool &pool;

	std::vector<CFGNode *> post_visit_order;
	void visit(CFGNode &entry);
	void build_immediate_dominators(CFGNode &entry);
	void structurize(unsigned pass);
	void find_loops();
	void find_selection_merges();
	void fixup_broken_selection_merges();
	void split_merge_blocks();
	static CFGNode *find_common_post_dominator(std::vector<CFGNode *> candidates);
	static CFGNode *find_common_dominated_merge_block(CFGNode *header);

	enum class LoopExitType
	{
		Exit,
		Merge,
		Escape
	};
	LoopExitType get_loop_exit_type(const CFGNode &header, const CFGNode &node) const;
	CFGNode *create_helper_pred_block(CFGNode *node);
	CFGNode *create_helper_succ_block(CFGNode *node);
	void reset_traversal();
	void validate_structured();
};
}