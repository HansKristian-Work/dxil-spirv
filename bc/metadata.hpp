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

#include "data_structures.hpp"

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
	static constexpr MetadataKind get_metadata_kind()
	{
		return MetadataKind::Node;
	}
	MDNode(Module *module, Vector<MDOperand *> operands);

	MDOperand &getOperand(unsigned index) const;
	unsigned getNumOperands() const;

	void set_tween_id(uint64_t id);
	uint64_t get_tween_id() const;

private:
	Vector<MDOperand *> operands;
	uint64_t tween = 0;
};

class NamedMDNode : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind()
	{
		return MetadataKind::NamedNode;
	}
	NamedMDNode(Module *module, String name, Vector<MDNode *> operands);
	const String &getName() const;

	MDNode *getOperand(unsigned index) const;
	unsigned getNumOperands() const;

private:
	String name;
	Vector<MDNode *> operands;
};

class ConstantAsMetadata : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind()
	{
		return MetadataKind::Constant;
	}
	ConstantAsMetadata(Module *module, Constant *value);
	Constant *getValue() const;

private:
	Constant *value;
};

class MDString : public MDOperand
{
public:
	static constexpr MetadataKind get_metadata_kind()
	{
		return MetadataKind::String;
	}
	MDString(Module *module, String str);
	const String &getString() const;

private:
	String str;
};

} // namespace LLVMBC
