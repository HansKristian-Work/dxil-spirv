/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
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

#pragma once

#include "thread_local_allocator.hpp"
#include "ir.hpp"
#include <memory>
#include <stdint.h>

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

	bool rewrite_rov_lock_region();

private:
	CFGNode *entry_block;
	CFGNode *exit_block;
	CFGNodePool &pool;
	SPIRVModule &module;

	// For dominance analysis.
	Vector<CFGNode *> forward_post_visit_order;
	// For post-dominance analysis.
	Vector<CFGNode *> backward_post_visit_order;

	Vector<uint32_t> reachability_bitset;
	unsigned reachability_stride = 0;

	UnorderedSet<const CFGNode *> reachable_nodes;
	UnorderedSet<const CFGNode *> structured_loop_merge_targets;
	void visit(CFGNode &entry);
	void visit_for_back_edge_analysis(CFGNode &entry);
	void backwards_visit();
	void backwards_visit(CFGNode &entry);
	void build_immediate_dominators();
	void build_immediate_post_dominators();
	void build_reachability();
	void visit_reachability(const CFGNode &node);
	bool query_reachability(const CFGNode &from, const CFGNode &to) const;
	void structurize(unsigned pass);
	void find_loops();
	bool rewrite_transposed_loops();

	struct LoopAnalysis
	{
		Vector<CFGNode *> direct_exits;
		Vector<CFGNode *> inner_direct_exits;
		Vector<CFGNode *> dominated_exit;
		Vector<CFGNode *> inner_dominated_exit;
		Vector<CFGNode *> non_dominated_exit;
		Vector<CFGNode *> dominated_continue_exit;
	};
	LoopAnalysis analyze_loop(CFGNode *node) const;

	struct LoopMergeAnalysis
	{
		CFGNode *merge;
		CFGNode *dominated_merge;
		CFGNode *infinite_continue_ladder;
	};
	LoopMergeAnalysis analyze_loop_merge(CFGNode *node, const LoopAnalysis &analysis);
	void rewrite_transposed_loop_inner(CFGNode *node, CFGNode *impossible_merge_target,
	                                   const LoopMergeAnalysis &analysis);
	void rewrite_transposed_loop_outer(CFGNode *node, CFGNode *impossible_merge_target,
	                                   const LoopMergeAnalysis &analysis);

	static bool is_ordered(const CFGNode *a, const CFGNode *b, const CFGNode *c);
	bool serialize_interleaved_merge_scopes();
	void split_merge_scopes();
	void eliminate_degenerate_blocks();
	static bool ladder_chain_has_phi_dependencies(const CFGNode *chain, const CFGNode *incoming);
	void duplicate_impossible_merge_constructs();
	void duplicate_node(CFGNode *node);
	static bool can_duplicate_phis(const CFGNode *node);
	Operation *duplicate_op(Operation *op, UnorderedMap<spv::Id, spv::Id> &id_remap);
	void update_structured_loop_merge_targets();
	void find_selection_merges(unsigned pass);
	bool header_and_merge_block_have_entry_exit_relationship(const CFGNode *header, const CFGNode *merge) const;
	void fixup_broken_selection_merges(unsigned pass);
	bool find_switch_blocks(unsigned pass);
	void hoist_switch_branches_to_frontier(CFGNode *node, CFGNode *merge, CFGNode *frontier);
	Operation *build_switch_case_equal_check(const CFGNode *header, CFGNode *insert_node,
	                                         const Terminator::Case &case_label);
	CFGNode *create_switch_merge_ladder(CFGNode *header, CFGNode *merge);
	CFGNode *find_natural_switch_merge_block(CFGNode *node, CFGNode *post_dominator) const;
	const CFGNode *get_innermost_loop_header_for(const CFGNode *node) const;
	const CFGNode *get_innermost_loop_header_for(const CFGNode *header, const CFGNode *node) const;
	bool loop_exit_supports_infinite_loop(const CFGNode *header, const CFGNode *loop_exit) const;

	void split_merge_blocks();
	bool merge_candidate_is_on_breaking_path(const CFGNode *node) const;
	bool continue_block_can_merge(CFGNode *node) const;
	static bool block_is_plain_continue(const CFGNode *node);

	// Create a new block. Rewrite all branches to node from blocks that are dominated by header to that block.
	// The new block then branches to node.
	CFGNode *create_ladder_block(CFGNode *header, CFGNode *node, const char *tag);

	CFGNode *get_target_break_block_for_inner_header(const CFGNode *node, size_t header_index);
	CFGNode *get_or_create_ladder_block(CFGNode *node, size_t header_index);
	CFGNode *build_enclosing_break_target_for_loop_ladder(CFGNode *&node, CFGNode *loop_ladder);
	CFGNode *build_ladder_block_for_escaping_edge_handling(CFGNode *node, CFGNode *header,
	                                                       CFGNode *loop_ladder,
	                                                       CFGNode *target_header,
	                                                       CFGNode *full_break_target,
	                                                       const UnorderedSet<const CFGNode *> &normal_preds);

	static CFGNode *find_common_post_dominator(const Vector<CFGNode *> &candidates);
	static CFGNode *find_common_post_dominator_with_ignored_break(Vector<CFGNode *> candidates,
	                                                              const CFGNode *break_node);
	CFGNode *find_break_target_for_selection_construct(CFGNode *idom, CFGNode *merge);
	bool control_flow_is_escaping(const CFGNode *node, const CFGNode *merge) const;
	bool control_flow_is_escaping_from_loop(const CFGNode *node, const CFGNode *merge) const;
	bool block_is_load_bearing(const CFGNode *node, const CFGNode *merge) const;
	static Vector<CFGNode *> isolate_structured_sorted(const CFGNode *header, const CFGNode *merge);
	static void isolate_structured(UnorderedSet<CFGNode *> &nodes, const CFGNode *header, const CFGNode *merge);

	static Vector<IncomingValue>::const_iterator find_incoming_value(const CFGNode *frontier_pred,
	                                                                 const Vector<IncomingValue> &incoming);

	void rewrite_selection_breaks(CFGNode *header, CFGNode *ladder_to);

	enum class LoopExitType
	{
		Exit,
		Merge,
		Escape,
		MergeToInfiniteLoop,
		InnerLoopExit,
		InnerLoopMerge,
		InnerLoopFalsePositive
	};
	LoopExitType get_loop_exit_type(const CFGNode &header, const CFGNode &node) const;
	CFGNode *create_helper_pred_block(CFGNode *node);
	CFGNode *create_helper_succ_block(CFGNode *node);
	void reset_traversal();
	bool rewrite_invalid_loop_breaks();
	void recompute_cfg();
	void rewrite_multiple_back_edges();
	void compute_dominance_frontier();
	void compute_post_dominance_frontier();
	void create_continue_block_ladders();
	static void recompute_dominance_frontier(CFGNode *node);
	static void recompute_post_dominance_frontier(CFGNode *node);
	static void merge_to_succ(CFGNode *node, unsigned index);
	void retarget_pred_from(CFGNode *new_node, CFGNode *old_succ);
	void retarget_succ_from(CFGNode *new_node, CFGNode *old_pred);

	CFGNode *get_post_dominance_frontier_with_cfg_subset_that_reaches(const CFGNode *node,
	                                                                  const CFGNode *must_reach,
	                                                                  const CFGNode *must_reach_frontier) const;
	bool exists_path_in_cfg_without_intermediate_node(const CFGNode *start_block,
	                                                  const CFGNode *end_block,
	                                                  const CFGNode *stop_block) const;

	struct PHINode
	{
		CFGNode *block;
		unsigned phi_index;
	};
	Vector<PHINode> phi_nodes;
	void insert_phi();
	void insert_phi(PHINode &node);
	void fixup_phi(PHINode &node);
	void cleanup_breaking_phi_constructs();
	bool cleanup_breaking_return_constructs();
	void eliminate_node_link_preds_to_succ(CFGNode *node);
	void prune_dead_preds();

	void fixup_broken_value_dominance();

	UnorderedMap<uint32_t, CFGNode *> value_id_to_block;

	void log_cfg(const char *tag) const;
	void log_cfg_graphviz(const char *path) const;

	static bool can_complete_phi_insertion(const PHI &phi, const CFGNode *end_node);
	bool query_reachability_through_back_edges(const CFGNode &from, const CFGNode &to) const;
	bool query_reachability_split_loop_header(const CFGNode &from, const CFGNode &to, const CFGNode &end_node) const;
	bool phi_frontier_makes_forward_progress(const PHI &phi, const CFGNode *frontier,
	                                         const CFGNode *end_node) const;

	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *dominator, CFGNode *from, CFGNode *to);
	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(CFGNode *dominator, CFGNode *from, CFGNode *to, const Op &op);
	template <typename Op>
	void traverse_dominated_blocks_and_rewrite_branch(const CFGNode *dominator, CFGNode *candidate,
	                                                  CFGNode *from, CFGNode *to, const Op &op,
	                                                  UnorderedSet<const CFGNode *> &visitation_cache);
};
} // namespace dxil_spv
