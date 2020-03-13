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

#include <string>
#include <vector>

namespace LLVMBC
{
class Value;
class Module;
class Constant;

enum class MetadataKind
{
	NamedNode,
	Node,
	Constant,
	String,
	None
};

class MDOperand
{
public:
	explicit MDOperand(Module *parent);
	MDOperand(Module *parent, MetadataKind kind);
	Module *getParent() const;

	MetadataKind get_metadata_kind() const;

	explicit operator bool() const
	{
		return kind != MetadataKind::None;
	}

private:
	Module *parent;
	MetadataKind kind = MetadataKind::None;
};

class MDNode : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind() { return MetadataKind::Node; }
	MDNode(Module *module, std::vector<MDOperand *> operands);

	MDOperand &getOperand(unsigned index) const;
	unsigned getNumOperands() const;

	void set_tween_id(uint64_t id);
	uint64_t get_tween_id() const;

private:
	std::vector<MDOperand *> operands;
	uint64_t tween = 0;
};

class NamedMDNode : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind() { return MetadataKind::NamedNode; }
	NamedMDNode(Module *module, std::string name, std::vector<MDNode *> operands);
	const std::string &getName() const;

	MDNode *getOperand(unsigned index) const;
	unsigned getNumOperands() const;

private:
	std::string name;
	std::vector<MDNode *> operands;
};

class ConstantAsMetadata : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind() { return MetadataKind::Constant; }
	ConstantAsMetadata(Module *module, Constant *value);
	Constant *getValue() const;

private:
	Constant *value;
};

class MDString : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind() { return MetadataKind::String; }
	MDString(Module *module, std::string str);
	const std::string &getString() const;

private:
	std::string str;
};

}
