/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 */

#pragma once

#include "ir.hpp"
#include <memory>
#include <stdint.h>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace dxil_spv
{
class BlockEmissionInterface;
class SPIRVModule;
struct CFGNode;
class CFGNodePool;

class BlockEmissionInterface
{
public:
	virtual ~BlockEmissionInterface() = default;
	virtual void emit_basic_block(CFGNode *node) = 0;
	virtual void register_block(CFGNode *node) = 0;
};

class CFGStructurizer
{
public:
	CFGStructurizer(CFGNode *entry, CFGNodePool &pool, SPIRVModule &module);
	bool run();
	void traverse(BlockEmissionInterface &iface);
	CFGNode *get_entry_block() const;

private:
	CFGNode *entry_block;
	CFGNodePool &pool;
	SPIRVModule &module;

	std::vector<CFGNode *> post_visit_order;
	std::unordered_set<const CFGNode *> reachable_nodes;
	void visit(CFGNode &entry);
	void build_immediate_dominators(CFGNode &entry);
	void structurize(unsigned pass);
	void find_loops();
	void split_merge_scopes();
	void find_selection_merges(unsigned pass);
	void fixup_broken_selection_merges(unsigned pass);
	void find_switch_blocks();
	void split_merge_blocks();
	static CFGNode *find_common_post_dominator(std::vector<CFGNode *> candidates);
	static CFGNode *find_common_post_dominator_with_ignored_break(std::vector<CFGNode *> candidates,
	                                                              const CFGNode *break_node);
	static CFGNode *find_common_post_dominator_with_ignored_exits(const CFGNode *header);
	static bool control_flow_is_escaping(const CFGNode *header, const CFGNode *node, const CFGNode *merge);
	static std::vector<CFGNode *> isolate_structured_sorted(const CFGNode *header, const CFGNode *merge);
	static void isolate_structured(std::unordered_set<CFGNode *> &nodes, const CFGNode *header, const CFGNode *merge);

	static std::vector<IncomingValue>::const_iterator find_incoming_value(const CFGNode *frontier_pred,
	                                                                      const std::vector<IncomingValue> &incoming);

	void rewrite_selection_breaks(CFGNode *header, CFGNode *ladder_to);

	enum class LoopExitType
	{
		Exit,
		Merge,
		Escape,
		InnerLoopExit,
		InnerLoopMerge
	};
	LoopExitType get_loop_exit_type(const CFGNode &header, const CFGNode &node) const;
	CFGNode *create_helper_pred_block(CFGNode *node);
	CFGNode *create_helper_succ_block(CFGNode *node);
	void reset_traversal();
	void validate_structured();
	void recompute_cfg();
	void compute_dominance_frontier();
	void create_continue_block_ladders();
	static void recompute_dominance_frontier(CFGNode *node);
	static void recompute_dominance_frontier(CFGNode *header, const CFGNode *node,
	                                         std::unordered_set<const CFGNode *> traversed);
	static void merge_to_succ(CFGNode *node, unsigned index);
	void retarget_succ_from(CFGNode *new_node, CFGNode *old_pred);

	struct PHINode
	{
		CFGNode *block;
		PHI *phi;
	};
	std::vector<PHINode> phi_nodes;
	void insert_phi();
	void insert_phi(PHINode &node);
	void fixup_phi(PHINode &node);
	void prune_dead_preds();

	std::unordered_map<uint32_t, CFGNode *> value_id_to_block;

	void log_cfg(const char *tag) const;
};
} // namespace dxil_spv
