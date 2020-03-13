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

MDNode::MDNode(Module *module, std::vector<MDOperand *> operands_)
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

NamedMDNode::NamedMDNode(Module *module, std::string name_, std::vector<MDNode *> operands_)
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

const std::string &NamedMDNode::getName() const
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

MDString::MDString(LLVMBC::Module *module, std::string str_)
    : MDOperand(module, MetadataKind::String)
    , str(std::move(str_))
{
}

const std::string &MDString::getString() const
{
	return str;
}

} // namespace LLVMBC
