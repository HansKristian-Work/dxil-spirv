#include "structurize_cfg.hpp"
#include <stdio.h>
#include <string>
#include <unordered_map>
using namespace DXIL2SPIRV;

struct BlockMeta
{
	CFGNode *node = nullptr;
};

struct Emitter : BlockEmissionInterface
{
	uint32_t allocate_id() override;
	uint32_t allocate_ids(uint32_t count) override;
	void emit_basic_block(uint32_t id, CFGNode *node, void *userdata, const DXIL2SPIRV::BlockEmissionInterface::MergeInfo &info) override;
	void emit_helper_block(uint32_t id, CFGNode *node, uint32_t next_id, const DXIL2SPIRV::BlockEmissionInterface::MergeInfo &info) override;

	uint32_t base_id = 1;
	CFGNodePool *pool = nullptr;
};

uint32_t Emitter::allocate_id()
{
	uint32_t ret = base_id;
	base_id += 1;
	return ret;
}

uint32_t Emitter::allocate_ids(uint32_t count)
{
	uint32_t ret = base_id;
	base_id += count;
	return ret;
}

void Emitter::emit_basic_block(uint32_t id, CFGNode *node, void *, const BlockEmissionInterface::MergeInfo &info)
{
	fprintf(stderr, "%u (%s):\n", id, node->name.c_str());

	// Emit opcodes here ...

	switch (info.merge_type)
	{
	case MergeType::Selection:
		fprintf(stderr, "    SelectionMerge -> %u\n", info.merge_block);
		break;

	case MergeType::Loop:
		fprintf(stderr, "    LoopMerge -> %u, Continue <- %u\n", info.merge_block, info.continue_block);
		break;

	default:
		break;
	}

	for (auto *succ : node->succ)
		fprintf(stderr, " -> %s\n", succ->name.c_str());
	if (node->succ_back_edge)
		fprintf(stderr, " %s <- back edge\n", node->succ_back_edge->name.c_str());
}

void Emitter::emit_helper_block(uint32_t id, CFGNode *, uint32_t next_id, const BlockEmissionInterface::MergeInfo &info)
{
#if 0
	fprintf(stderr, "%u:\n", id);
	if (next_id)
	{
		switch (info.merge_type)
		{
		case MergeType::Selection:
			fprintf(stderr, "    SelectionMerge -> %u\n", info.merge_block);
			break;

		case MergeType::Loop:
			fprintf(stderr, "    LoopMerge -> %u, Continue <- %u\n", info.merge_block, info.continue_block);
			break;

		default:
			break;
		}

		fprintf(stderr, "  -> %u\n", next_id);
	}
	else
	{
		fprintf(stderr, "  Unreachable\n");
	}
#endif
}

int main()
{
	std::unordered_map<std::string, BlockMeta> block_metas;

	CFGNodePool pool;
	const auto get = [&](const std::string &name) -> CFGNode * {
		auto itr = block_metas.find(name);
		if (itr == block_metas.end())
		{
			auto &new_entry = block_metas[name];
			auto *node = pool.get_node_from_userdata(&new_entry);
			pool.set_name(&new_entry, name);
			new_entry.node = node;
			return node;
		}
		else
			return itr->second.node;
	};

	const auto get_user = [&](const std::string &name) -> void * {
		return &block_metas[name];
	};

	const auto add_branch = [&](const char *from, const char *to) {
		get(from);
		get(to);
		pool.add_branch(get_user(from), get_user(to));
	};

	const auto add_selection = [&](const char *from, const char *to0, const char *to1) {
		add_branch(from, to0);
		add_branch(from, to1);
	};

#if 1
	add_selection("b0", "l0", "b0.exit");
	{
		add_selection("l0", "l1", "c0");
		{
			add_branch("l1", "l1.cond");
			add_selection("l1.cond", "b0.exit", "c1");
			add_selection("c1", "l1", "m1");
			add_branch("m1", "c0");
		}
		add_selection("c0", "l0", "l0.exit");
		add_branch("l0.exit", "b0.exit");
	}
#elif 0
	add_selection("b0", "body", "b0.exit");
	add_branch("body", "b0.exit");
#else
	add_selection("b0", "l0", "b0.exit");
	{
		add_selection("l0", "b1", "b0.exit");
		{
			add_selection("b1", "a", "b");
			{
				add_branch("a", "c0");
			}
			{
				add_branch("b", "c0");
			}
		}
		add_selection("c0", "l0", "l0.exit");
		add_branch("l0.exit", "b0.exit");
	}
#endif

	CFGStructurizer traverser(*get("b0"), pool);
	Emitter emitter;
	emitter.pool = &pool;
	traverser.traverse(emitter);
}