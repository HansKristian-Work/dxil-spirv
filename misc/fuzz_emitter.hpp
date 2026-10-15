/* Copyright (c) 2026 Hans-Kristian Arntzen for Valve Corporation
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

#include "cfg_structurizer.hpp"
#include "node.hpp"
#include "node_pool.hpp"
#include "thread_local_allocator.hpp"
#include "SpvBuilder.h"
#include "spirv_module.hpp"

namespace dxil_spv
{
class Emitter : private BlockEmissionInterface
{
public:
	void init();
	spv::Id build_condition(CFGNode *node);
	void add_selection(const char *from, const char *to0, const char *to1);
	void add_branch(const char *from, const char *to);
	void add_switch(const char *from, const String *nodes, size_t num_nodes);
	void add_phi(const char *phi, const Vector<const char *> &from_nodes);

	void parse_line(char *line);

	enum class Style
	{
		Legacy,
		Unstructured,
		Modern
	};

	bool finalize(Style style, Vector<uint32_t> &code, bool validate);

private:
	void emit_basic_block(CFGNode *node) override;
	void register_block(CFGNode *node) override
	{
		if (node->id == 0)
			node->id = module.allocate_id();
	}

	CFGNodePool pool;
	SPIRVModule module;
	std::unordered_map<String, CFGNode *> block_metas;

	void write_feedback(CFGNode *node, spv::Id value);

	CFGNode *get(const String &name);

	spv::Id condition_var_id = 0;
	spv::Id feedback_var_id = 0;
	spv::Id condition_counter_id = 0;
	spv::Id current_block_counter_id = 0;
	uint32_t block_id = 0;
};
}