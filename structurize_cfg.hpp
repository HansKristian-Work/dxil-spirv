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

struct CFGNode;

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
};
}