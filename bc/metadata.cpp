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

#include "metadata.hpp"
#include "module.hpp"
#include "value.hpp"
#include <assert.h>
#include <utility>

namespace LLVMBC
{
MDOperand::MDOperand(Module *parent_, MetadataKind kind_)
    : parent(parent_)
    , kind(kind_)
{
}

MDOperand::MDOperand(Module *parent_)
    : parent(parent_)
{
}

Module *MDOperand::getParent() const
{
	return parent;
}

MetadataKind MDOperand::get_metadata_kind() const
{
	return kind;
}

MDNode::MDNode(Module *module, Vector<MDOperand *> operands_)
    : MDOperand(module, MetadataKind::Node)
    , operands(std::move(operands_))
{
}

unsigned MDNode::getNumOperands() const
{
	return unsigned(operands.size());
}

MDOperand &MDNode::getOperand(unsigned index) const
{
	assert(index < operands.size());
	return *operands[index];
}

uint64_t MDNode::get_tween_id() const
{
	return tween;
}

void MDNode::set_tween_id(uint64_t id)
{
	tween = id;
}

NamedMDNode::NamedMDNode(Module *module, String name_, Vector<MDNode *> operands_)
    : MDOperand(module, MetadataKind::NamedNode)
    , name(std::move(name_))
    , operands(std::move(operands_))
{
}

unsigned NamedMDNode::getNumOperands() const
{
	return unsigned(operands.size());
}

MDNode *NamedMDNode::getOperand(unsigned index) const
{
	assert(index < operands.size());
	return operands[index];
}

const String &NamedMDNode::getName() const
{
	return name;
}

ConstantAsMetadata::ConstantAsMetadata(Module *module, Constant *value_)
    : MDOperand(module, MetadataKind::Constant)
    , value(value_)
{
}

Constant *ConstantAsMetadata::getValue() const
{
	return value;
}

MDString::MDString(LLVMBC::Module *module, String str_)
    : MDOperand(module, MetadataKind::String)
    , str(std::move(str_))
{
}

const String &MDString::getString() const
{
	return str;
}

} // namespace LLVMBC
