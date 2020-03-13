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

#include "module.hpp"
#include "type.hpp"
#include "logging.hpp"
#include "context.hpp"
#include "function.hpp"
#include "value.hpp"
#include "instruction.hpp"
#include "cast.hpp"
#include "metadata.hpp"
#include "cast.hpp"
#include <algorithm>

#include "llvm_decoder.h"

namespace LLVMBC
{
enum class KnownBlocks : uint32_t
{
	BLOCKINFO = 0,

	// 1-7 reserved,

	MODULE_BLOCK = 8,
	PARAMATTR_BLOCK = 9,
	PARAMATTR_GROUP_BLOCK = 10,
	CONSTANTS_BLOCK = 11,
	FUNCTION_BLOCK = 12,
	TYPE_SYMTAB_BLOCK = 13,
	VALUE_SYMTAB_BLOCK = 14,
	METADATA_BLOCK = 15,
	METADATA_ATTACHMENT = 16,
	TYPE_BLOCK = 17,
};

enum class ModuleRecord : uint32_t
{
	VERSION = 1,
	TRIPLE = 2,
	DATALAYOUT = 3,
	GLOBAL_VARIABLE = 7,
	FUNCTION = 8,
};

enum class ConstantsRecord : uint32_t
{
	SETTYPE = 1,
	CONST_NULL = 2,
	UNDEF = 3,
	INTEGER = 4,
	WIDE_INTEGER = 5,
	FLOAT = 6,
	AGGREGATE = 7,
	STRING = 8,
	DATA = 22,
};

enum class FunctionRecord : uint32_t
{
	DECLAREBLOCKS = 1,
	INST_BINOP = 2,
	INST_CAST = 3,
	INST_GEP_OLD = 4,
	INST_SELECT = 5,
	INST_EXTRACTELT = 6,
	INST_INSERTELT = 7,
	INST_SHUFFLEVEC = 8,
	INST_CMP = 9,
	INST_RET = 10,
	INST_BR = 11,
	INST_SWITCH = 12,
	INST_INVOKE = 13,
	INST_UNREACHABLE = 15,
	INST_PHI = 16,
	INST_ALLOCA = 19,
	INST_LOAD = 20,
	INST_VAARG = 23,
	INST_STORE_OLD = 24,
	INST_EXTRACTVAL = 26,
	INST_INSERTVAL = 27,
	INST_CMP2 = 28,
	INST_VSELECT = 29,
	INST_INBOUNDS_GEP_OLD = 30,
	INST_INDIRECTBR = 31,
	DEBUG_LOC_AGAIN = 33,
	INST_CALL = 34,
	DEBUG_LOC = 35,
	INST_FENCE = 36,
	INST_CMPXCHG_OLD = 37,
	INST_ATOMICRMW = 38,
	INST_RESUME = 39,
	INST_LANDINGPAD_OLD = 40,
	INST_LOADATOMIC = 41,
	INST_STOREATOMIC_OLD = 42,
	INST_GEP = 43,
	INST_STORE = 44,
	INST_STOREATOMIC = 45,
	INST_CMPXCHG = 46,
	INST_LANDINGPAD = 47,
	INST_CLEANUPRET = 48,
	INST_CATCHRET = 49,
	INST_CATCHPAD = 50,
	INST_CLEANUPPAD = 51,
	INST_CATCHSWITCH = 52,
	OPERAND_BUNDLE = 55,
	INST_UNOP = 56,
	INST_CALLBR = 57,
};

enum class ValueSymtabRecord : uint32_t
{
	ENTRY = 1,
	BBENTRY = 2,
	FNENTRY = 3,
	COMBINED_ENTRY = 5,
};

enum class MetaDataRecord : uint32_t
{
	STRING_OLD = 1,
	VALUE = 2,
	NODE = 3,
	NAME = 4,
	DISTINCT_NODE = 5,
	KIND = 6,
	LOCATION = 7,
	OLD_NODE = 8,
	OLD_FN_NODE = 9,
	NAMED_NODE = 10,
	ATTACHMENT = 11,
	GENERIC_DEBUG = 12,
	SUBRANGE = 13,
	ENUMERATOR = 14,
	BASIC_TYPE = 15,
	FILE = 16,
	DERIVED_TYPE = 17,
	COMPOSITE_TYPE = 18,
	SUBROUTINE_TYPE = 19,
	COMPILE_UNIT = 20,
	SUBPROGRAM = 21,
	LEXICAL_BLOCK = 22,
	LEXICAL_BLOCK_FILE = 23,
	NAMESPACE = 24,
	TEMPLATE_TYPE = 25,
	TEMPLATE_VALUE = 26,
	GLOBAL_VAR = 27,
	LOCAL_VAR = 28,
	EXPRESSION = 29,
	OBJC_PROPERTY = 30,
	IMPORTED_ENTITY = 31,
	MODULE = 32,
	MACRO = 33,
	MACRO_FILE = 34,
	STRINGS = 35,
	GLOBAL_DECL_ATTACHMENT = 36,
	GLOBAL_VAR_EXPR = 37,
	INDEX_OFFSET = 38,
	INDEX = 39,
	LABEL = 40,
	COMMON_BLOCK = 44,
};

enum class TypeRecord : uint32_t
{
	NUMENTRY = 1,
	VOID = 2,
	FLOAT = 3,
	DOUBLE = 4,
	LABEL = 5,
	OPAQUE = 6,
	INTEGER = 7,
	POINTER = 8,
	FUNCTION_OLD = 9,
	HALF = 10,
	ARRAY = 11,
	VECTOR = 12,
	METADATA = 16,
	STRUCT_ANON = 18,
	STRUCT_NAME = 19,
	STRUCT_NAMED = 20,
	FUNCTION = 21,
	TOKEN = 22,
};

enum class UnaryOp : uint32_t
{
	FNEG = 0
};

enum class BinOp : uint32_t
{
	ADD = 0,
	SUB = 1,
	MUL = 2,
	UDIV = 3,
	SDIV = 4,
	UREM = 5,
	SREM = 6,
	SHL = 7,
	LSHR = 8,
	ASHR = 9,
	AND = 10,
	OR = 11,
	XOR = 12
};

enum class AtomicBinOp : uint32_t
{
	RMW_XCHG = 0,
	RMW_ADD = 1,
	RMW_SUB = 2,
	RMW_AND = 3,
	RMW_NAND = 4,
	RMW_OR = 5,
	RMW_XOR = 6,
	RMW_MAX = 7,
	RMW_MIN = 8,
	RMW_UMAX = 9,
	RMW_UMIN = 10,
	RMW_FADD = 11,
	RMW_FSUB = 12
};

enum class CastOp : uint32_t
{
	TRUNC = 0,
	ZEXT = 1,
	SEXT = 2,
	FPTOUI = 3,
	FPTOSI = 4,
	UITOFP = 5,
	SITOFP = 6,
	FPTRUNC = 7,
	FPEXT = 8,
	PTRTOINT = 9,
	INTTOPTR = 10,
	BITCAST = 11,
	ADDSPACECAST = 12
};

enum CallFlagBits
{
	CALL_TAIL_BIT = 1 << 0,
	CALL_CCONV_BIT = 1 << 1,
	CALL_MUSTTAIL_BIT = 1 << 14,
	CALL_EXPLICIT_TYPE_BIT = 1 << 15,
	CALL_NOTAIL_BIT = 1 << 16,
	CALL_FMF_BIT = 1 << 17
};

static int64_t decode_sign_rotated_value(uint64_t v)
{
	bool sign = (v & 1) != 0;
	v >>= 1;
	if (sign)
		v = v ? -int64_t(v) : (1ull << 63u);
	return int64_t(v);
}

struct ModuleParseContext
{
	Function *function = nullptr;
	Module *module = nullptr;
	LLVMContext *context = nullptr;
	std::vector<BasicBlock *> basic_blocks;

	std::vector<Value *> values;
	std::vector<Instruction *> instructions;

	std::vector<Type *> types;
	std::vector<Function *> functions_with_bodies;
	std::unordered_map<uint64_t, MDOperand *> metadata;
	std::unordered_map<uint64_t, std::string> metadata_kind_map;
	Type *constant_type = nullptr;
	std::string current_metadata_name;

	void parse_function_child_block(const BlockOrRecord &entry);
	void parse_record(const BlockOrRecord &entry);
	void parse_constants_record(const BlockOrRecord &entry);
	void parse_constants_block(const BlockOrRecord &entry);
	void parse_metadata_block(const BlockOrRecord &entry);
	void parse_metadata_attachment_record(const BlockOrRecord &entry);
	void parse_metadata_record(const BlockOrRecord &entry, unsigned index);
	Type *get_constant_type();
	void parse_function_body(const BlockOrRecord &entry);
	void parse_types(const BlockOrRecord &entry);
	void parse_value_symtab(const BlockOrRecord &entry);
	void parse_function_record(const BlockOrRecord &entry);
	void parse_global_variable_record(const BlockOrRecord &entry);
	void parse_version_record(const BlockOrRecord &entry);
	void parse_type(const BlockOrRecord &entry);
	void add_instruction(Instruction *inst);
	void add_value(Value *value);

	void add_type(Type *type);
	Type *get_type(uint64_t index);
	void finish_basic_block();
	void add_successor(BasicBlock *bb);
	BasicBlock *get_basic_block(unsigned index) const;
	BasicBlock *current_bb = nullptr;
	unsigned basic_block_index = 0;

	Value *get_value(uint64_t op, Type *expected_type = nullptr, bool force_absolute = false);
	Value *get_value_signed(uint64_t op, Type *expected_type = nullptr);
	MDOperand *get_metadata(uint64_t index) const;
	const char *get_metadata_kind(uint64_t index) const;

	Instruction *get_instruction(uint64_t index) const;

	std::vector<ValueProxy *> pending_forward_references;
	std::vector<std::pair<GlobalVariable *, uint64_t>> global_initializations;
	void resolve_forward_references();
	void resolve_global_initializations();

	uint64_t tween_id = 1;
	uint64_t metadata_tween_id = 1;

	bool use_relative_id = true;
	bool use_strtab = false;
	bool seen_first_function_body = false;
};

ValueProxy::ValueProxy(Type *type, ModuleParseContext &context_, uint64_t id_)
	: Value(type, ValueKind::Proxy), context(context_), id(id_)
{
}

void ValueProxy::resolve()
{
	if (proxy)
		return;

	if (id >= context.values.size())
	{
		LOGE("Value proxy is out of range.\n");
		return;
	}

	proxy = context.values[id];
	while (proxy && proxy->get_value_kind() == ValueKind::Proxy)
	{
		cast<ValueProxy>(proxy)->resolve();
		proxy = cast<ValueProxy>(proxy)->get_proxy_value();
	}

	if (!proxy)
		LOGE("Failed to resolve proxy value.\n");
}

Value *ValueProxy::get_proxy_value() const
{
	return proxy;
}

void ModuleParseContext::finish_basic_block()
{
	basic_block_index++;
	if (basic_block_index >= basic_blocks.size())
		current_bb = nullptr;
	else
	{
		current_bb = basic_blocks[basic_block_index];
		current_bb->set_tween_id(tween_id++);
	}
}

void ModuleParseContext::add_successor(BasicBlock *bb)
{
	if (!current_bb)
		return;

	current_bb->add_successor(bb);
}

BasicBlock *ModuleParseContext::get_basic_block(unsigned index) const
{
	if (index >= basic_blocks.size())
	{
		LOGE("Basic block index is out of bounds!\n");
		return nullptr;
	}

	return basic_blocks[index];
}

Value *ModuleParseContext::get_value(uint64_t op, Type *expected_type, bool force_absolute)
{
	if (!force_absolute && use_relative_id)
		op = values.size() - op;

	if (op >= values.size())
	{
		if (!expected_type)
		{
			LOGE("Must have an expected type for forward references!\n");
			return nullptr;
		}
		auto *proxy = context->construct<ValueProxy>(expected_type, *this, op);
		pending_forward_references.push_back(proxy);
		return proxy;
	}
	else
		return values[op];
}

Instruction *ModuleParseContext::get_instruction(uint64_t index) const
{
	if (index >= instructions.size())
	{
		LOGE("Instruction index is out of range!\n");
		return nullptr;
	}

	return instructions[index];
}

MDOperand *ModuleParseContext::get_metadata(uint64_t index) const
{
	auto itr = metadata.find(index);
	if (itr != metadata.end())
		return itr->second;
	else
	{
		// Need to return a null-node like this since MDOperand is used as a reference in the LLVM API for some reason.
		return context->construct<MDOperand>(module);
	}
}

const char *ModuleParseContext::get_metadata_kind(uint64_t index) const
{
	auto itr = metadata_kind_map.find(index);
	if (itr != metadata_kind_map.end())
		return itr->second.c_str();
	else
		return nullptr;
}

Value *ModuleParseContext::get_value_signed(uint64_t op, Type *expected_type)
{
	int64_t signed_op = decode_sign_rotated_value(op);
	if (use_relative_id)
		signed_op = values.size() - signed_op;
	op = signed_op;

	if (op >= values.size())
	{
		if (!expected_type)
		{
			LOGE("Must have an expected type for forward references!\n");
			return nullptr;
		}
		auto *proxy = context->construct<ValueProxy>(expected_type, *this, op);
		pending_forward_references.push_back(proxy);
		return proxy;
	}
	else
		return values[op];
}

void ModuleParseContext::add_instruction(Instruction *inst)
{
	instructions.push_back(inst);

	if (current_bb)
		current_bb->add_instruction(inst);
	else
	{
		LOGE("No basic block is currently set!\n");
		return;
	}

	if (inst->isTerminator())
		finish_basic_block();
	else
		add_value(inst);
}

void ModuleParseContext::add_value(Value *value)
{
	if (value->getType()->getTypeID() != Type::TypeID::VoidTyID)
	{
		value->set_tween_id(tween_id++);
		values.push_back(value);
	}
}

Type *ModuleParseContext::get_constant_type()
{
	if (constant_type)
		return constant_type;
	else
		return Type::getInt32Ty(*context);
}

void ModuleParseContext::parse_constants_record(const BlockOrRecord &entry)
{
	if (entry.IsBlock())
		return;

	switch (ConstantsRecord(entry.id))
	{
	case ConstantsRecord::SETTYPE:
		constant_type = get_type(entry.ops[0]);
		break;

	case ConstantsRecord::CONST_NULL:
	{
		Value *value = nullptr;
		if (constant_type->isIntegerTy())
			value = ConstantInt::get(constant_type, 0);
		else if (constant_type->isFloatingPointTy())
			value = ConstantFP::get(constant_type, 0);

		if (!value)
			LOGE("Unknown type for CONST_NULL.\n");
		values.push_back(value);
		break;
	}

	case ConstantsRecord::UNDEF:
	{
		auto *type = get_constant_type();
		values.push_back(UndefValue::get(type));
		break;
	}

	case ConstantsRecord::INTEGER:
	{
		auto *type = get_constant_type();
		assert(type->isIntegerTy());

		uint64_t literal = entry.ops[0];
		int64_t signed_literal = decode_sign_rotated_value(literal);
		ConstantInt *value = ConstantInt::get(type, signed_literal);
		values.push_back(value);
		break;
	}

	case ConstantsRecord::WIDE_INTEGER:
		LOGW("WIDE_INTEGER unimplemented.\n");
		values.push_back(nullptr);
		break;

	case ConstantsRecord::FLOAT:
	{
		auto *type = get_constant_type();
		assert(type->isFloatingPointTy());
		ConstantFP *value = ConstantFP::get(type, entry.ops[0]);
		values.push_back(value);
		break;
	}

	case ConstantsRecord::AGGREGATE:
		LOGW("AGGREGATE unimplemented.\n");
		values.push_back(nullptr);
		break;

	case ConstantsRecord::STRING:
		LOGW("STRING unimplemented.\n");
		values.push_back(nullptr);
		break;

	case ConstantsRecord::DATA:
	{
		Type *element_type = nullptr;
		if (isa<ArrayType>(get_constant_type()))
			element_type = get_constant_type()->getArrayElementType();
		else if (isa<VectorType>(get_constant_type()))
			element_type = cast<VectorType>(get_constant_type())->getElementType();
		else
		{
			LOGE("Unknown DATA type.\n");
			values.push_back(nullptr);
			break;
		}

		bool is_fp = element_type->isFloatingPointTy();
		std::vector<Constant *> constants;
		constants.reserve(entry.ops.size());
		if (is_fp)
		{
			for (auto &op : entry.ops)
				constants.push_back(ConstantFP::get(element_type, op));
		}
		else
		{
			for (auto &op : entry.ops)
				constants.push_back(ConstantInt::get(element_type, op));
		}
		auto *value = context->construct<ConstantDataArray>(get_constant_type(), std::move(constants));
		values.push_back(value);
		break;
	}

	default:
		LOGW("UNKNOWN unimplemented.\n");
		values.push_back(nullptr);
		break;
	}
}

void ModuleParseContext::parse_constants_block(const BlockOrRecord &entry)
{
	constant_type = nullptr;
	for (auto &child : entry.children)
		parse_constants_record(child);
}

void ModuleParseContext::parse_metadata_attachment_record(const BlockOrRecord &entry)
{
	if (MetaDataRecord(entry.id) != MetaDataRecord::ATTACHMENT)
		return;

	size_t size = entry.ops.size();
	size_t num_nodes = (size - 1) / 2;
	auto *inst = get_instruction(entry.ops[0]);

	if (!inst)
	{
		LOGE("Invalid instruction.\n");
		return;
	}

	for (size_t i = 0; i < num_nodes; i++)
	{
		auto *kind = get_metadata_kind(entry.ops[2 * i + 1]);
		auto *operand = get_metadata(entry.ops[2 * i + 2]);
		auto *node = dyn_cast<MDNode>(operand);

		if (!kind)
		{
			LOGE("Invalid metadata kind.\n");
			return;
		}

		if (!node)
		{
			LOGE("Invalid metadata attachment.\n");
			return;
		}

		inst->add_metadata(kind, node);
	}
}

void ModuleParseContext::parse_metadata_record(const BlockOrRecord &entry, unsigned index)
{
	switch (MetaDataRecord(entry.id))
	{
	case MetaDataRecord::NAME:
	{
		current_metadata_name = entry.getString();
		break;
	}

	case MetaDataRecord::NAMED_NODE:
	{
		std::vector<MDNode *> ops;
		ops.reserve(entry.ops.size());
		for (auto &op : entry.ops)
		{
			auto *md = get_metadata(op);
			auto *node = dyn_cast<MDNode>(md);
			ops.push_back(node);
		}

		auto *node = context->construct<NamedMDNode>(module, current_metadata_name, std::move(ops));
		module->add_named_metadata(current_metadata_name, node);
		metadata[index] = node;
		break;
	}

	case MetaDataRecord::NODE:
	{
		std::vector<MDOperand *> ops;
		ops.reserve(entry.ops.size());
		for (auto &op : entry.ops)
		{
			// For some reason, here metadata is indexed with -1?
			auto *md = get_metadata(op - 1);
			ops.push_back(md);
		}

		auto *node = context->construct<MDNode>(module, std::move(ops));
		node->set_tween_id(metadata_tween_id++);
		module->add_unnamed_metadata(node);
		metadata[index] = node;
		break;
	}

	case MetaDataRecord::STRING_OLD:
	{
		auto *node = context->construct<MDString>(module, entry.getString());
		metadata[index] = node;
		break;
	}

	case MetaDataRecord::VALUE:
	{
		auto *value = get_value(entry.ops[1], nullptr, true);
		if (!value)
		{
			LOGE("Null value!\n");
			return;
		}

		auto *constant_value = dyn_cast<Constant>(value);
		if (!constant_value)
		{
			LOGE("Not a constant!\n");
			return;
		}

		auto *node = context->construct<ConstantAsMetadata>(module, constant_value);
		metadata[index] = node;
		break;
	}

	case MetaDataRecord::KIND:
	{
		metadata_kind_map[entry.ops[0]] = entry.getString(1);
		break;
	}

	default:
		break;
	}
}

void ModuleParseContext::parse_metadata_block(const BlockOrRecord &entry)
{
	unsigned index = 0;
	for (auto &child : entry.children)
		parse_metadata_record(child, index++);
}

void ModuleParseContext::parse_function_child_block(const BlockOrRecord &entry)
{
	switch (KnownBlocks(entry.id))
	{
	case KnownBlocks::CONSTANTS_BLOCK:
	{
		for (auto &child : entry.children)
			parse_constants_record(child);
		break;
	}

	case KnownBlocks::METADATA_ATTACHMENT:
	{
		for (auto &child : entry.children)
			parse_metadata_attachment_record(child);
		break;
	}

	default:
		break;
	}
}

static UnaryOperator::UnaryOps translate_uop(UnaryOp op, Type *type)
{
	bool is_fp = type->isFloatingPointTy();
	if (op == UnaryOp::FNEG && is_fp)
		return UnaryOperator::UnaryOps::FNeg;
	else
		return UnaryOperator::UnaryOps::Invalid;
}

static BinaryOperator::BinaryOps translate_binop(BinOp op, Type *type)
{
	bool is_fp = type->isFloatingPointTy();
	switch (op)
	{
	case BinOp::ADD:
		return is_fp ? BinaryOperator::BinaryOps::FAdd : BinaryOperator::BinaryOps::Add;
	case BinOp::SUB:
		return is_fp ? BinaryOperator::BinaryOps::FSub : BinaryOperator::BinaryOps::Sub;
	case BinOp::MUL:
		return is_fp ? BinaryOperator::BinaryOps::FMul : BinaryOperator::BinaryOps::Mul;
	case BinOp::UDIV:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::UDiv;
	case BinOp::SDIV:
		return is_fp ? BinaryOperator::BinaryOps::FDiv : BinaryOperator::BinaryOps::SDiv;
	case BinOp::UREM:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::URem;
	case BinOp::SREM:
		return is_fp ? BinaryOperator::BinaryOps::FRem : BinaryOperator::BinaryOps::SRem;
	case BinOp::SHL:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::Shl;
	case BinOp::LSHR:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::LShr;
	case BinOp::ASHR:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::AShr;
	case BinOp::AND:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::And;
	case BinOp::OR:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::Or;
	case BinOp::XOR:
		return is_fp ? BinaryOperator::BinaryOps::Invalid : BinaryOperator::BinaryOps::Xor;
	default:
		return BinaryOperator::BinaryOps::Invalid;
	}
}

static AtomicRMWInst::BinOp translate_atomic_binop(AtomicBinOp op)
{
	switch (op)
	{
	case AtomicBinOp::RMW_XCHG:
		return AtomicRMWInst::BinOp::Xchg;
	case AtomicBinOp::RMW_ADD:
		return AtomicRMWInst::BinOp::Add;
	case AtomicBinOp::RMW_SUB:
		return AtomicRMWInst::BinOp::Sub;
	case AtomicBinOp::RMW_AND:
		return AtomicRMWInst::BinOp::And;
	case AtomicBinOp::RMW_NAND:
		return AtomicRMWInst::BinOp::Nand;
	case AtomicBinOp::RMW_OR:
		return AtomicRMWInst::BinOp::Or;
	case AtomicBinOp::RMW_XOR:
		return AtomicRMWInst::BinOp::Xor;
	case AtomicBinOp::RMW_MAX:
		return AtomicRMWInst::BinOp::Max;
	case AtomicBinOp::RMW_MIN:
		return AtomicRMWInst::BinOp::Min;
	case AtomicBinOp::RMW_UMAX:
		return AtomicRMWInst::BinOp::UMax;
	case AtomicBinOp::RMW_UMIN:
		return AtomicRMWInst::BinOp::UMin;
	case AtomicBinOp::RMW_FADD:
		return AtomicRMWInst::BinOp::FAdd;
	case AtomicBinOp::RMW_FSUB:
		return AtomicRMWInst::BinOp::FSub;
	default:
		return AtomicRMWInst::BinOp::Invalid;
	}
}

static Instruction::CastOps translate_castop(CastOp op)
{
	switch (op)
	{
	case CastOp::TRUNC:
		return Instruction::Trunc;
	case CastOp::ZEXT:
		return Instruction::ZExt;
	case CastOp::SEXT:
		return Instruction::SExt;
	case CastOp::FPTOUI:
		return Instruction::FPToUI;
	case CastOp::FPTOSI:
		return Instruction::FPToSI;
	case CastOp::UITOFP:
		return Instruction::UIToFP;
	case CastOp::SITOFP:
		return Instruction::SIToFP;
	case CastOp::FPTRUNC:
		return Instruction::FPTrunc;
	case CastOp::FPEXT:
		return Instruction::FPExt;
	case CastOp::PTRTOINT:
		return Instruction::PtrToInt;
	case CastOp::INTTOPTR:
		return Instruction::IntToPtr;
	case CastOp::BITCAST:
		return Instruction::BitCast;
	case CastOp::ADDSPACECAST:
		return Instruction::AddrSpaceCast;
	}
	assert(0);
}

void ModuleParseContext::parse_record(const BlockOrRecord &entry)
{
	switch (FunctionRecord(entry.id))
	{
	case FunctionRecord::DECLAREBLOCKS:
	{
		basic_blocks.resize(entry.ops[0]);
		for (auto &bb : basic_blocks)
			bb = context->construct<BasicBlock>(*context);
		current_bb = basic_blocks.front();
		break;
	}

	case FunctionRecord::INST_CALL:
	{
		unsigned index = 1;
		auto CCInfo = entry.ops[index++];

		if (CCInfo & CALL_FMF_BIT)
		{
			auto fmf = entry.ops[index++];
			(void)fmf;
		}

		FunctionType *function_type = nullptr;
		if (CCInfo & CALL_EXPLICIT_TYPE_BIT)
			function_type = cast<FunctionType>(get_type(entry.ops[index++]));

		auto *callee = cast<Function>(get_value(entry.ops[index++]));
		if (!function_type)
			function_type = callee->getFunctionType();

		unsigned num_params = function_type->getNumParams();
		if (entry.ops.size() != index + num_params)
		{
			LOGE("Number of params does not match record.\n");
			return;
		}

		std::vector<Value *> params;
		params.reserve(num_params);

		for (unsigned i = 0; i < num_params; i++)
		{
			Value *arg = get_value(entry.ops[index + i]);
			params.push_back(arg);
		}

		auto *value = context->construct<CallInst>(function_type, cast<Function>(callee), std::move(params));
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_RET:
	{
		auto *ret = context->construct<ReturnInst>(nullptr);
		add_instruction(ret);
		break;
	}

	case FunctionRecord::INST_UNOP:
	{
		auto *val = get_value(entry.ops[0]);
		auto op = UnaryOp(entry.ops[1]);
		auto *value = context->construct<UnaryOperator>(translate_uop(op, val->getType()), val);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_CMP:
	case FunctionRecord::INST_CMP2:
	{
		auto *lhs = get_value(entry.ops[0]);
		auto *rhs = get_value(entry.ops[1]);
		auto pred = Instruction::Predicate(entry.ops[2]);

		Instruction *value = nullptr;
		if (lhs->getType()->isFloatingPointTy())
			value = context->construct<FCmpInst>(pred, lhs, rhs);
		else
			value = context->construct<ICmpInst>(pred, lhs, rhs);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_PHI:
	{
		auto *type = get_type(entry.ops[0]);
		size_t num_args = (entry.ops.size() - 1) / 2;

		auto *phi_node = context->construct<PHINode>(type, num_args);

		for (size_t i = 0; i < num_args; i++)
		{
			Value *value = nullptr;
			if (use_relative_id)
				value = get_value_signed(entry.ops[2 * i + 1], type);
			else
				value = get_value(entry.ops[2 * i + 1], type);

			BasicBlock *bb = get_basic_block(entry.ops[2 * i + 2]);
			phi_node->add_incoming(value, bb);
		}
		add_instruction(phi_node);
		break;
	}

	case FunctionRecord::INST_BINOP:
	{
		auto *lhs = get_value(entry.ops[0]);
		auto *rhs = get_value(entry.ops[1]);
		auto op = BinOp(entry.ops[2]);
		auto *value = context->construct<BinaryOperator>(lhs, rhs, translate_binop(op, lhs->getType()));
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_ATOMICRMW:
	{
		auto *ptr = get_value(entry.ops[0]);
		auto *val = get_value(entry.ops[1]);
		AtomicRMWInst::BinOp op = translate_atomic_binop(AtomicBinOp(entry.ops[2]));
		auto *value = context->construct<AtomicRMWInst>(val->getType(), ptr, val, op);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_CMPXCHG:
	{
		auto *ptr = get_value(entry.ops[0]);
		auto *cmp = get_value(entry.ops[1]);
		auto *new_value = get_value(entry.ops[2]);
		auto *value = context->construct<AtomicCmpXchgInst>(ptr, cmp, new_value);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_CAST:
	{
		auto *input_value = get_value(entry.ops[0]);
		auto *type = get_type(entry.ops[1]);
		auto op = Instruction::CastOps(translate_castop(CastOp(entry.ops[2])));
		auto *value = context->construct<CastInst>(type, input_value, op);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_SELECT:
	case FunctionRecord::INST_VSELECT:
	{
		auto *true_value = get_value(entry.ops[0]);
		auto *false_value = get_value(entry.ops[1]);
		auto *cond_value = get_value(entry.ops[2]);
		auto *value = context->construct<SelectInst>(true_value, false_value, cond_value);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_EXTRACTVAL:
	{
		unsigned num_args = entry.ops.size();
		std::vector<unsigned> indices;
		indices.reserve(entry.ops.size() - 1);
		Value *aggregate = get_value(entry.ops[0]);

		Type *type = aggregate->getType();
		for (unsigned i = 1; i < num_args; i++)
		{
			auto index = unsigned(entry.ops[i]);
			if (type->getTypeID() == Type::TypeID::StructTyID)
			{
				if (index >= cast<StructType>(type)->getNumElements())
				{
					LOGE("Struct element index out of range.\n");
					return;
				}
				type = cast<StructType>(type)->getElementType(index);
			}
			else if (type->getTypeID() == Type::TypeID::ArrayTyID)
			{
				type = type->getArrayElementType();
			}

			// DXIL does not support vectors, so we're not supposed to index into them any further.
			indices.push_back(index);
		}

		auto *value = context->construct<ExtractValueInst>(type, aggregate, std::move(indices));
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_BR:
	{
		auto *true_block = get_basic_block(entry.ops[0]);
		add_successor(true_block);
		if (entry.ops.size() == 1)
		{
			auto *value = context->construct<BranchInst>(true_block);
			add_instruction(value);
		}
		else
		{
			auto *false_block = get_basic_block(entry.ops[1]);
			add_successor(false_block);
			auto *cond = get_value(entry.ops[2]);
			auto *value = context->construct<BranchInst>(true_block, false_block, cond);
			add_instruction(value);
		}
		break;
	}

	case FunctionRecord::INST_SWITCH:
	{
		auto *type = get_type(entry.ops[0]);
		auto *cond = get_value(entry.ops[1]);
		auto *default_block = get_basic_block(entry.ops[2]);
		add_successor(default_block);
		unsigned num_cases = (entry.ops.size() - 3) / 2;
		auto *inst = context->construct<SwitchInst>(cond, default_block, num_cases);
		for (unsigned i = 0; i < num_cases; i++)
		{
			// For some reason, case values are encoded in absolute terms.
			auto *case_value = get_value(entry.ops[3 + 2 * i], type, true);
			BasicBlock *bb = get_basic_block(entry.ops[4 + 2 * i]);
			if (!case_value || !bb)
			{
				LOGE("Invalid switch record.\n");
				return;
			}
			add_successor(bb);
			inst->addCase(case_value, bb);
		}
		add_instruction(inst);
		break;
	}

	case FunctionRecord::INST_ALLOCA:
	{
		auto *allocated_type = get_type(entry.ops[0]);
		auto *type = get_type(entry.ops[1]);
		auto *size = get_value(entry.ops[2], nullptr, true);
		auto *ptr_type = PointerType::get(allocated_type, 0);

		auto *value = context->construct<AllocaInst>(ptr_type, type, size);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_GEP:
	{
		bool inbounds = entry.ops[0] != 0;
		auto *type = get_type(entry.ops[1]);
		unsigned count = entry.ops.size() - 2;
		std::vector<Value *> args;
		args.reserve(count);
		for (unsigned i = 0; i < count; i++)
			args.push_back(get_value(entry.ops[i + 2]));

		for (unsigned i = 1; i < args.size(); i++)
		{
			auto *arg = args[i];
			if (type->getTypeID() == Type::TypeID::StructTyID)
			{
				auto *const_int = dyn_cast<ConstantInt>(arg);
				if (!const_int)
				{
					LOGE("Indexing into a struct without a constant integer.\n");
					return;
				}

				unsigned index = const_int->getUniqueInteger().getZExtValue();
				if (index >= cast<StructType>(type)->getNumElements())
				{
					LOGE("Struct element index out of range.\n");
					return;
				}
				type = cast<StructType>(type)->getElementType(index);
			}
			else if (type->getTypeID() == Type::TypeID::ArrayTyID)
			{
				type = type->getArrayElementType();
			}
		}

		type = PointerType::get(type, cast<PointerType>(args[0]->getType())->getAddressSpace());

		auto *value = context->construct<GetElementPtrInst>(type, std::move(args), inbounds);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_LOAD:
	{
		auto *ptr = get_value(entry.ops[0]);
		if (!isa<PointerType>(ptr->getType()))
		{
			LOGE("Loading from something that is not a pointer.\n");
			return;
		}

		Type *loaded_type = nullptr;
		if (entry.ops.size() == 4)
			loaded_type = get_type(entry.ops[1]);
		else
			loaded_type = cast<PointerType>(ptr->getType())->getElementType();

		auto *value = context->construct<LoadInst>(loaded_type, ptr);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_STORE:
	{
		auto *ptr = get_value(entry.ops[0]);
		auto *v = get_value(entry.ops[1]);
		auto *value = context->construct<StoreInst>(ptr, v);
		add_instruction(value);
		break;
	}

	default:
		LOGE("Unhandled instruction!\n");
		add_instruction(nullptr);
		break;
	}
}

void ModuleParseContext::resolve_forward_references()
{
	for (auto *ref : pending_forward_references)
		ref->resolve();
	pending_forward_references.clear();

	for (auto *bb : basic_blocks)
		for (auto &inst : *bb)
			inst.resolve_proxy_values();
}

void ModuleParseContext::resolve_global_initializations()
{
	for (auto &ref : global_initializations)
	{
		Value *value = get_value(ref.second, nullptr, true);
		auto *constant_value = dyn_cast<Constant>(value);
		if (!constant_value)
		{
			LOGE("Global initializer is not a constant!\n");
			continue;
		}
		ref.first->set_initializer(constant_value);
	}
	global_initializations.clear();
}

void ModuleParseContext::parse_function_body(const BlockOrRecord &entry)
{
	auto global_values = values;

	// I think we are supposed to process functions in same order as the module declared them?
	if (!seen_first_function_body)
	{
		std::reverse(functions_with_bodies.begin(), functions_with_bodies.end());
		seen_first_function_body = true;
	}

	if (functions_with_bodies.empty())
	{
		LOGE("No more functions to process?\n");
		return;
	}

	function = functions_with_bodies.back();
	functions_with_bodies.pop_back();

	for (auto &child : entry.children)
	{
		if (child.IsBlock())
			parse_function_child_block(child);
		else
			parse_record(child);
	}

	resolve_forward_references();
	resolve_global_initializations();

	function->set_basic_blocks(std::move(basic_blocks));
	basic_blocks = {};
	module->add_function_implementation(function);

	values = global_values;
	instructions.clear();
}

void ModuleParseContext::parse_type(const BlockOrRecord &child)
{
	Type *type = nullptr;
	switch (TypeRecord(child.id))
	{
	case TypeRecord::NUMENTRY:
		return;

	case TypeRecord::VOID:
	{
		type = Type::getVoidTy(*context);
		break;
	}

	case TypeRecord::HALF:
		type = Type::getHalfTy(*context);
		break;

	case TypeRecord::FLOAT:
		type = Type::getFloatTy(*context);
		break;

	case TypeRecord::DOUBLE:
		type = Type::getDoubleTy(*context);
		break;

	case TypeRecord::POINTER:
		type = PointerType::get(get_type(child.ops[0]), child.ops[1]);
		break;

	case TypeRecord::ARRAY:
		type = ArrayType::get(get_type(child.ops[1]), child.ops[0]);
		break;

	case TypeRecord::INTEGER:
		switch (child.ops[0])
		{
		case 1:
			type = Type::getInt1Ty(*context);
			break;

		case 8:
			type = Type::getInt8Ty(*context);
			break;

		case 16:
			type = Type::getInt16Ty(*context);
			break;

		case 32:
			type = Type::getInt32Ty(*context);
			break;

		case 64:
			type = Type::getInt64Ty(*context);
			break;
		}
		break;

	case TypeRecord::STRUCT_NAME:
		return;

	case TypeRecord::STRUCT_NAMED:
	case TypeRecord::STRUCT_ANON:
	{
		std::vector<Type *> members;
		unsigned num_members = child.ops.size() - 1;
		members.reserve(num_members);
		for (unsigned i = 0; i < num_members; i++)
			members.push_back(get_type(child.ops[i + 1]));
		type = StructType::get(std::move(members));
		break;
	}

	case TypeRecord::VECTOR:
	{
		type = VectorType::get(child.ops[0], get_type(child.ops[1]));
		break;
	}

	case TypeRecord::FUNCTION:
	{
		std::vector<Type *> argument_types;
		argument_types.reserve(child.ops.size());
		for (size_t i = 2; i < child.ops.size(); i++)
			argument_types.push_back(get_type(child.ops[i]));

		type = context->construct<FunctionType>(*context,
		                                        get_type(child.ops[1]),
		                                        std::move(argument_types));

		break;
	}

	case TypeRecord::LABEL:
	{
		type = Type::getLabelTy(*context);
		break;
	}

	case TypeRecord::METADATA:
	{
		type = Type::getMetadataTy(*context);
		break;
	}

	default:
		LOGE("Unknown type!\n");
		break;
	}

	add_type(type);
}

void ModuleParseContext::parse_types(const BlockOrRecord &entry)
{
	for (auto &child : entry.children)
		parse_type(child);
}

void ModuleParseContext::parse_value_symtab(const BlockOrRecord &entry)
{
	for (auto &symtab : entry.children)
	{
		switch (ValueSymtabRecord(symtab.id))
		{
		case ValueSymtabRecord::ENTRY:
		{
			auto name = symtab.getString(1);
			module->add_value_name(symtab.ops[0], name);
			break;
		}

		default:
			break;
		}
	}
}

void ModuleParseContext::parse_global_variable_record(const BlockOrRecord &entry)
{
	if (use_strtab)
	{
		LOGE("Unknown module code 2 which uses strtab.\n");
		return;
	}

	auto *type = get_type(entry.ops[0]);
	bool is_const = (entry.ops[1] & 1) != 0;
	bool explicit_type = (entry.ops[1] & 2) != 0;
	unsigned address_space = 0;
	if (explicit_type)
		address_space = entry.ops[1] >> 2;
	else
	{
		address_space = cast<PointerType>(type)->getAddressSpace();
		type = cast<PointerType>(type)->getElementType();
	}

	auto *value = context->construct<GlobalVariable>(PointerType::get(type, address_space), is_const);
	module->add_global_variable(value);
	add_value(value);

	uint64_t init_id = entry.ops[2];
	if (init_id != 0)
		global_initializations.push_back({ value, init_id - 1 });
}

void ModuleParseContext::parse_function_record(const BlockOrRecord &entry)
{
	if (use_strtab)
	{
		LOGE("Unknown module code 2 which uses strtab.\n");
		return;
	}

	auto *type = get_type(entry.ops[0]);
	// Calling convention is [1], not relevant.
	bool is_proto = entry.ops[2];
	// Lots of other irrelevant arguments ...

	auto *func_type = dyn_cast<FunctionType>(type);
	if (!func_type)
		func_type = cast<FunctionType>(cast<PointerType>(type)->getElementType());

	auto id = values.size();
	auto *func = context->construct<Function>(func_type, id, *module);
	values.push_back(func);

	if (!is_proto)
		functions_with_bodies.push_back(func);
}

void ModuleParseContext::parse_version_record(const BlockOrRecord &entry)
{
	unsigned version = entry.ops[0];
	use_relative_id = version >= 1;
	use_strtab = version >= 2;
}

Type *ModuleParseContext::get_type(uint64_t index)
{
	assert(index < types.size());
	return types[index];
}

void ModuleParseContext::add_type(Type *type)
{
	types.push_back(type);
}

void Module::add_value_name(uint64_t id, const std::string &name)
{
	value_symtab[id] = name;
}

void Module::add_function_implementation(Function *func)
{
	functions.push_back(func);
}

void Module::add_global_variable(GlobalVariable *variable)
{
	globals.push_back(variable);
}

void Module::add_named_metadata(const std::string &name, NamedMDNode *node)
{
	named_metadata[name] = node;
}

void Module::add_unnamed_metadata(MDNode *node)
{
	unnamed_metadata.push_back(node);
}

Function *Module::getFunction(const std::string &name) const
{
	auto itr = std::find_if(functions.begin(), functions.end(), [&](const Function *func) {
		return func->getName() == name;
	});

	if (itr != functions.end())
		return *itr;
	else
		return nullptr;
}

NamedMDNode *Module::getNamedMetadata(const std::string &name) const
{
	auto itr = named_metadata.find(name);
	if (itr != named_metadata.end())
		return itr->second;
	else
		return nullptr;
}

static const std::string empty_string;
const std::string &Module::get_value_name(uint64_t id) const
{
	auto itr = value_symtab.find(id);
	if (itr != value_symtab.end())
		return itr->second;
	else
		return empty_string;
}

LLVMContext &Module::getContext()
{
	return context;
}

Module::Module(LLVMContext &context_)
		: context(context_)
{
}

std::vector<Function *>::const_iterator Module::begin() const
{
	return functions.begin();
}

std::vector<Function *>::const_iterator Module::end() const
{
	return functions.end();
}

IteratorAdaptor<GlobalVariable, std::vector<GlobalVariable *>::const_iterator> Module::global_begin() const
{
	return globals.begin();
}

IteratorAdaptor<GlobalVariable, std::vector<GlobalVariable *>::const_iterator> Module::global_end() const
{
	return globals.end();
}

std::unordered_map<std::string, NamedMDNode *>::const_iterator Module::named_metadata_begin() const
{
	return named_metadata.begin();
}

std::unordered_map<std::string, NamedMDNode *>::const_iterator Module::named_metadata_end() const
{
	return named_metadata.end();
}

std::vector<MDNode *>::const_iterator Module::unnamed_metadata_begin() const
{
	return unnamed_metadata.begin();
}

std::vector<MDNode *>::const_iterator Module::unnamed_metadata_end() const
{
	return unnamed_metadata.end();
}

Module *parseIR(LLVMContext &context, const void *data, size_t size)
{
	LLVMBC::BitcodeReader reader(static_cast<const uint8_t *>(data), size);
	auto toplevel = reader.ReadToplevelBlock();

	// The top-level block must be MODULE_BLOCK.
	if (KnownBlocks(toplevel.id) != KnownBlocks::MODULE_BLOCK)
		return nullptr;

	// We should have consumed all bits, only one top-level block.
	if (!reader.AtEndOfStream())
		return nullptr;

	auto *module = context.construct<Module>(context);

	ModuleParseContext parse_context;
	parse_context.module = module;
	parse_context.context = &module->getContext();

	for (auto &child : toplevel.children)
	{
		if (child.IsBlock())
		{
			switch (KnownBlocks(child.id))
			{
			case KnownBlocks::VALUE_SYMTAB_BLOCK:
				parse_context.parse_value_symtab(child);
				break;

			case KnownBlocks::FUNCTION_BLOCK:
				parse_context.parse_function_body(child);
				break;

			case KnownBlocks::TYPE_BLOCK:
				parse_context.parse_types(child);
				break;

			case KnownBlocks::CONSTANTS_BLOCK:
				parse_context.parse_constants_block(child);
				break;

			case KnownBlocks::METADATA_BLOCK:
				parse_context.parse_metadata_block(child);
				break;

			default:
				break;
			}
		}
		else
		{
			switch (ModuleRecord(child.id))
			{
			case ModuleRecord::VERSION:
				parse_context.parse_version_record(child);
				break;

			case ModuleRecord::FUNCTION:
				parse_context.parse_function_record(child);
				break;

			case ModuleRecord::GLOBAL_VARIABLE:
				parse_context.parse_global_variable_record(child);
				break;

			default:
				break;
			}
		}
	}

	return module;
}
}
