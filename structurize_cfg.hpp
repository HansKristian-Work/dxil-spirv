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
	Selection,
	LoopToSelection
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
	CFGNode *selection_merge_block = nullptr;
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
	bool dominates_all_reachable_exits() const;
	bool trivial_flow_to_exit() const;
	void ensure_ids(BlockEmissionInterface &iface);
	static CFGNode *find_common_dominator(const CFGNode *a, const CFGNode *b);

	void *userdata = nullptr;

private:
	bool dominates_all_reachable_exits(const CFGNode &header) const;
};

class CFGNodePool
{
public:
	CFGNodePool();
	~CFGNodePool();

	CFGNode *get_node_from_userdata(void *userdata);
	CFGNode *find_node_from_userdata(void *userdata) const;
	uint32_t get_block_id(void *userdata) const;
	void add_branch(void *from, void *to);
	void set_name(void *userdata, const std::string &str);
	const std::string &get_name(void *username);

private:
	std::unordered_map<void *, std::unique_ptr<CFGNode>> nodes;
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
	virtual void emit_basic_block(uint32_t id, void *userdata, const MergeInfo &info) = 0;
	virtual void emit_helper_block(uint32_t id, uint32_t next_block, const MergeInfo &info) = 0;
};

class CFGStructurizer
{
public:
	explicit CFGStructurizer(CFGNode &entry);
	void traverse(BlockEmissionInterface &iface);

private:
	CFGNode &entry_block;
	std::vector<CFGNode *> post_visit_order;
	void visit(CFGNode &entry);
	void build_immediate_dominators(CFGNode &entry);
	void structurize();
	void find_loops();
	void find_selection_merges();
	void split_merge_blocks();
	static CFGNode *find_common_post_dominator(std::vector<CFGNode *> candidates);

	enum class LoopExitType
	{
		Exit,
		Merge,
		Escape
	};
	LoopExitType get_loop_exit_type(const CFGNode &header, const CFGNode &node) const;
};
}