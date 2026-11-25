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
#include <algorithm>
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
	bool run_structurizer();
	bool run_experimental_unstructured();
	bool run_trivial();
	void traverse(BlockEmissionInterface &iface);
	CFGNode *get_entry_block() const;

	bool rewrite_rov_lock_region();
	void rewrite_auto_group_shared_barrier();
	void flatten_subgroup_shuffles();
	void fixup_loop_header_undef_phis();

	void fixup_partial_stage_output_writes();

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
	uint32_t dominance_order_counter = 0;
	bool experimental_unstructured_flow = false;
	bool limited_control_flow_analysis = true;
	bool debug_labels = false;

	UnorderedSet<const CFGNode *> reachable_nodes;
	Vector<CFGNode *> visit_stack;

	template <typename PushOp, typename ResolveOp, typename VisitedOp>
	void recursive_visit(CFGNode *node,
	                     const PushOp &push_op, const ResolveOp &resolve_op,
	                     const VisitedOp &is_visited_op);
	void push_visit_stack(CFGNode *node);
	void push_visit_stack_backwards(CFGNode *node);

	void forward_visit();
	void forward_visit_push(CFGNode *node);
	void forward_visit_resolve(CFGNode *node);

	void visit_for_back_edge_analysis();
	void visit_for_back_edge_analysis_push(CFGNode *entry);
	void visit_for_back_edge_analysis_resolve(CFGNode *entry);

	void backwards_visit();
	void backwards_visit_push(CFGNode *node);
	void backwards_visit_resolve(CFGNode *entry);

	void forward_dominance_order_visit_push(CFGNode *node);
	void forward_dominance_order_visit_resolve(CFGNode *node);

	void build_immediate_dominators();
	void build_immediate_post_dominators();
	void build_forward_dominance_order();
	void build_reachability();
	void visit_reachability(const CFGNode &node);
	bool query_reachability(const CFGNode &from, const CFGNode &to) const;

	void duplicate_node(CFGNode *node);
	Operation *duplicate_op(Operation *op, UnorderedMap<spv::Id, spv::Id> &id_remap);

	const CFGNode *get_innermost_loop_header_for(const CFGNode *node) const;
	const CFGNode *get_innermost_loop_header_for(const CFGNode *header, const CFGNode *node) const;

	static CFGNode *find_common_post_dominator(const Vector<CFGNode *> &candidates);

	CFGNode *create_helper_succ_block(CFGNode *node);
	void reset_traversal();

	void recompute_cfg();
	void compute_full_control_flow_analysis();
	void rewrite_multiple_back_edges();
	void compute_dominance_frontier();
	void compute_post_dominance_frontier();
	static void recompute_dominance_frontier(CFGNode *node);
	static void recompute_post_dominance_frontier(CFGNode *node);
	void retarget_succ_from(CFGNode *new_node, CFGNode *old_pred);

	struct PHINode
	{
		CFGNode *block;
		unsigned phi_index;
	};
	Vector<PHINode> phi_nodes;
	void prune_dead_preds();

	void fixup_broken_value_dominance();

	UnorderedMap<uint32_t, CFGNode *> value_id_to_block;

#ifdef DXIL_SPIRV_DEBUG_DUMPING
	void log_cfg(const char *tag) const;
	void log_cfg_graphviz(const char *path) const;
	void log_cfg_structurize_test(const char *path) const;
#endif

	void propagate_branch_control_hints();
	void remove_unused_ssa();

	void sink_ssa_constructs();
	void sink_ssa_constructs_run(bool dry_run);

	// The new structurizer rewritten from ground up.
	struct SerializationLevel
	{
		Vector<CFGNode *> paths;
		// If skipping is possible, a dummy path is.
		// If number of paths + skip is 1: No selector.
		// If number of paths + skip is 2: A simple boolean.
		// If number of paths + skip is >2: Switch value.
		spv::Id path_selector_id = 0;
		bool skippable = false;

		CFGNode *input_node = nullptr;
		CFGNode *output_node = nullptr;

		// If set, redirect any branch here instead of the normal merge target.
		CFGNode *breaking_branch = nullptr;
	};

	void run_common_preamble();
	void rewrite_switch_blocks();
	static bool dominates_any_back_edge_on_dominance_path(CFGNode *node, CFGNode *end_node);
	CFGNode *switch_block_trivially_merges(CFGNode *node);
	void rewrite_complex_loop_successors();
	void convert_phi_to_variables();

	// Ideally we just recurse, but there will always be the most ridiculous shader out there ... <_<
	struct SerializeContinuation
	{
		enum class Kind { None, TraverseRoutes, RouteBranches, EnterSuccDirect };
		Kind kind = Kind::None;
		CFGNode *node = nullptr;
		Vector<SerializationLevel> outer_levels;
		Vector<SerializationLevel> levels;
		size_t num_traverse_levels = 0;
		CFGNode *merge_node = nullptr;
		CFGNode *outer_merge = nullptr;
	};

	void iterate_continuation(SerializeContinuation cont);
	static void link_nodes(CFGNode *from, CFGNode *to);

	void serialize_merge_levels_for_dominated_paths_recursive(
		CFGNode *node, const Vector<SerializationLevel> &levels, CFGNode *merge_node);

	SerializeContinuation
	serialize_merge_levels_for_dominated_paths_with_continuation(
		CFGNode *node, const Vector<SerializationLevel> &levels, CFGNode *merge_node);

	SerializeContinuation
	enter_succ_with_continuation(CFGNode *from, CFGNode *succ,
	           const Vector<SerializationLevel> &levels, CFGNode *merge_node);

	void enter_succ_recursive(CFGNode *from, CFGNode *succ,
	                          const Vector<SerializationLevel> &levels, CFGNode *merge_node);

	void enter_succ(CFGNode *from, CFGNode *true_path, CFGNode *false_path, spv::Id cond,
	                const SerializationLevel *true_level, const SerializationLevel *false_level,
	                const Vector<SerializationLevel> &levels, CFGNode *merge_node);

	bool resolve_direct_path(CFGNode *from, CFGNode *succ, const SerializationLevel *level);

	bool resolve_complex_breaks(CFGNode *from, CFGNode *rerouted_succ);

	void serialize_merge_levels_for_dominated_paths_entry();
	static const SerializationLevel *find_level_for_block(const Vector<SerializationLevel> &levels, CFGNode *block);
	static const SerializationLevel *find_latest_level_dominating_block(const Vector<SerializationLevel> &levels, CFGNode *block);
	static void fixup_degenerate_conditional_branch(CFGNode *node);
	void fixup_degenerate_conditional_branches();

	spv::Id build_conditional_for_switch_block(CFGNode *block, CFGNode *target, const Vector<Terminator::Case> &cases, spv::Id cond_id);
	bool ensure_valid_phi_rewrites(CFGNode *node);

	void split_loop_inner_outer(
		CFGNode *node, CFGNode *back_edge, UnorderedSet<CFGNode *> &back_edge_candidates,
		Vector<CFGNode *> &outer_dominated);

	void move_interposing_nodes_into_loop(CFGNode *header,
	                                      const Vector<SerializationLevel> &outer_levels,
	                                      UnorderedSet<CFGNode *> &back_edge_candidates, Vector<CFGNode *> &outer_idom);

	void filter_outer_idom_candidates(Vector<CFGNode *> &outer_idom);

	void organize_levels(CFGNode *node, const Vector<CFGNode *> &children,
	                     const Vector<SerializationLevel> &outer_levels,
	                     Vector<SerializationLevel> &levels,
	                     const UnorderedSet<CFGNode *> *allow_frontiers,
	                     bool promote_children_to_frontier);

	void analyze_levels_skippability(CFGNode *node, const Vector<SerializationLevel> &outer_levels,
	                                 Vector<SerializationLevel> &levels);

	SerializeContinuation
	route_branches_with_continuation(CFGNode *node, const Vector<SerializationLevel> &outer_levels,
	                                 const Vector<SerializationLevel> &levels,
	                                 CFGNode *outer_merge);

	void route_branches_recursive(CFGNode *node, const Vector<SerializationLevel> &outer_levels,
	                              const Vector<SerializationLevel> &levels,
	                              CFGNode *outer_merge);

	SerializeContinuation
	traverse_routes_with_continuation(Vector<SerializationLevel> &&levels, size_t num_traverse_levels,
	                                  CFGNode *start_node, CFGNode *outer_merge);

	bool select_path(CFGNode *node, const SerializationLevel *level, CFGNode *path, const char *tag,
	                 const Vector<SerializationLevel> &levels, CFGNode *merge_node);

	static bool level_has_non_breaking_non_continue_path(CFGNode *succ, const SerializationLevel *level);

	// For nested loops.
	struct LoopScope
	{
		CFGNode *header_block = nullptr;
		CFGNode *merge_block = nullptr;
		CFGNode *continue_block = nullptr;
		// Can be set by inner loops. If this is a variable, we need to insert an "if (bypass) break;" or
		// "if (bypass) continue;"
		spv::Id bypass_break_id = 0;
		spv::Id bypass_continue_id = 0;

		// Usually we visit the continue block through normal dominance, but with multiple breaks and continues in play,
		// we may end up skipping over it.
		// This can happen if an inner continue is the only way to reach this continue.
		// We stop traversing at loop boundaries.
		bool visited_continue_block = false;
	};
	Vector<LoopScope> loop_scopes;

	CFGNode *route_loop_bypass(CFGNode *header, CFGNode *merge,
	                           spv::Id bypass_break_id, spv::Id bypass_continue_id,
	                           const LoopScope &outer_scope);

	CFGNode *route_conditional_break(CFGNode *node, spv::Id var_id, CFGNode *break_candidate, const char *tag);

	LoopScope *find_scope_for_block(CFGNode *node);
	bool is_backwards_branch(CFGNode *node) const;
	LoopScope *find_outer_continue_scope_for_block(CFGNode *node);

	bool branch_requires_breaking_construct(const Vector<SerializationLevel> &levels, CFGNode *node);
	bool branch_requires_redirection(const Vector<SerializationLevel> &levels, CFGNode *node);

	void cleanup_degenerate_blocks();
	void rewrite_degenerate_phi_constructs();
	void rewrite_degenerate_interposing_frontiers();

	struct SSAVariableAccess
	{
		spv::Id type_id = 0;
		Vector<CFGNode *> readers;
		Vector<CFGNode *> writers;
	};
	UnorderedMap<uint32_t, SSAVariableAccess> ssa_variable_access;
	void analyze_ssa_variable_access();
	void reintroduce_ssa_phi();

	spv::Id rewrite_local_variable_to_phi(spv::Id variable_id, const SSAVariableAccess &accesses,
	                                      const Vector<CFGNode *> &frontiers, spv::Id back_edge_incoming_id);

	void clamp_ssa_variable_lifetimes();

	bool phi_frontiers_converge(const Vector<CFGNode *> &writers, CFGNode *reader_idom,
	                            Vector<CFGNode *> &frontiers);
	PHI *insert_phi_frontiers(const Vector<CFGNode *> &frontiers, PHI &phi);

	static CFGNode *find_forward_progress_dominance_frontier(CFGNode *node, CFGNode *reader_idom,
	                                                         bool allow_user_blocks_on_path_to_frontier);
	static bool path_is_purely_through_helper_blocks(CFGNode *from, CFGNode *to);
	void build_helper_node_direct_reachability_network();
};

template <typename Container, typename T>
static inline bool has_element(const Container &c, const T &value)
{
	auto itr = std::find(c.begin(), c.end(), value);
	return itr != c.end();
}

template <typename T>
static inline bool has_element(const UnorderedSet<T> &c, const T &value)
{
	return c.count(value) != 0;
}

template <typename Container, typename T>
static inline void push_back_unique(Container &c, const T &value)
{
	if (!has_element(c, value))
		c.push_back(value);
}
} // namespace dxil_spv
