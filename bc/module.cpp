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

#include "module.hpp"
#include "cast.hpp"
#include "context.hpp"
#include "function.hpp"
#include "instruction.hpp"
#include "logging.hpp"
#include "metadata.hpp"
#include "type.hpp"
#include "value.hpp"
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

enum class AttributeRecord : uint32_t
{
	NONE = 0,
	ALIGNMENT = 1,
	BY_VAL = 3,
	STACK_ALIGNMENT = 25,
	DEREFERENCEABLE = 41,
	DEREFERENCEABLE_OR_NULL = 42,
	ALLOC_SIZE = 51
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
	BINOP = 10,
	CE_CAST = 11,
	GEP = 12,
	INBOUNDS_GEP = 20,
	DATA = 22,
	GEP_WITH_INRANGE_INDEX = 24
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

enum class AttributeCodes : uint32_t
{
	CodeEntryOld = 1,
	CodeEntry = 2,
	GroupCodeEntry = 3
};

enum class TypeRecord : uint32_t
{
	NUMENTRY = 1,
	VOID_TYPE = 2,
	FLOAT = 3,
	DOUBLE = 4,
	LABEL = 5,
	OPAQUE_TYPE = 6,
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

enum FastMathFlagBits
{
	FAST_MATH_UNSAFE_ALGEBRA_BIT = 1 << 0,
	FAST_MATH_ALLOW_CONTRACT_BIT = 1 << 5
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
	Vector<BasicBlock *> basic_blocks;

	Vector<Value *> values;
	Vector<Instruction *> instructions;

	Vector<Type *> types;
	Vector<Function *> functions_with_bodies;
	UnorderedMap<uint64_t, MDOperand *> metadata;
	UnorderedMap<uint64_t, String> metadata_kind_map;
	Vector<Vector<std::pair<String, String>>> attribute_lists;
	UnorderedMap<uint64_t, Vector<std::pair<String, String>>> attribute_groups;
	Type *constant_type = nullptr;
	String current_metadata_name;

	bool parse_function_child_block(const BlockOrRecord &entry);
	bool parse_record(const BlockOrRecord &entry);
	bool parse_constants_record(const BlockOrRecord &entry);
	bool parse_constants_block(const BlockOrRecord &entry);
	bool parse_metadata_block(const BlockOrRecord &entry);
	bool parse_paramattr_block(const BlockOrRecord &entry);
	bool parse_paramattr_group_block(const BlockOrRecord &entry);
	bool parse_metadata_attachment_record(const BlockOrRecord &entry);
	bool parse_metadata_record(const BlockOrRecord &entry, unsigned index);
	Type *get_constant_type();
	bool parse_function_body(const BlockOrRecord &entry);
	bool parse_types(const BlockOrRecord &entry);
	bool parse_value_symtab(const BlockOrRecord &entry);
	bool parse_function_record(const BlockOrRecord &entry);
	bool parse_global_variable_record(const BlockOrRecord &entry);
	bool parse_version_record(const BlockOrRecord &entry);
	bool parse_type(const BlockOrRecord &entry);
	bool add_instruction(Instruction *inst);
	bool add_value(Value *value);

	bool add_type(Type *type);
	Type *get_type(uint64_t index);
	bool finish_basic_block();
	bool add_successor(BasicBlock *bb);
	BasicBlock *get_basic_block(uint64_t index) const;
	BasicBlock *current_bb = nullptr;
	unsigned basic_block_index = 0;

	Value *get_value(uint64_t op, Type *expected_type = nullptr, bool force_absolute = false);
	std::pair<Value *, Type *> get_value_and_type(const Vector<uint64_t> &ops, unsigned &index);
	Value *get_value(const Vector<uint64_t> &ops, unsigned &index, Type *expected_type);
	Value *get_value_signed(uint64_t op, Type *expected_type = nullptr);
	MDOperand *get_metadata(uint64_t index) const;
	const char *get_metadata_kind(uint64_t index) const;

	Instruction *get_instruction(uint64_t index) const;

	Vector<ValueProxy *> pending_forward_references;
	Vector<std::pair<GlobalVariable *, uint64_t>> global_initializations;
	bool resolve_forward_references();
	bool resolve_global_initializations();

	uint64_t tween_id = 1;
	uint64_t metadata_tween_id = 1;

	bool use_relative_id = true;
	bool use_strtab = false;
	bool seen_first_function_body = false;
};

ValueProxy::ValueProxy(Type *type, ModuleParseContext &context_, uint64_t id_)
    : Value(type, ValueKind::Proxy)
    , id(id_)
    , context(context_)
{
}

bool ValueProxy::resolve()
{
	if (proxy)
		return true;

	if (id >= context.values.size())
	{
		LOGE("Value proxy is out of range.\n");
		return false;
	}

	proxy = context.values[id];
	while (proxy && proxy->get_value_kind() == ValueKind::Proxy)
	{
		cast<ValueProxy>(proxy)->resolve();
		proxy = cast<ValueProxy>(proxy)->get_proxy_value();
	}

	if (!proxy)
	{
		LOGE("Failed to resolve proxy value.\n");
		return false;
	}
	return true;
}

Value *ValueProxy::get_proxy_value() const
{
	return proxy;
}

bool ModuleParseContext::finish_basic_block()
{
	basic_block_index++;
	if (basic_block_index >= basic_blocks.size())
		current_bb = nullptr;
	else
	{
		current_bb = basic_blocks[basic_block_index];
		current_bb->set_tween_id(tween_id++);
	}

	return true;
}

bool ModuleParseContext::add_successor(BasicBlock *bb)
{
	if (!current_bb)
	{
		LOGE("No basic block is active in add_successor().\n");
		return false;
	}

	current_bb->add_successor(bb);
	return true;
}

BasicBlock *ModuleParseContext::get_basic_block(uint64_t index) const
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
		op = uint32_t(values.size() - op);

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
	{
		// A pointer to function and a constant function do match.
		if (auto *ptr_type = dyn_cast<PointerType>(expected_type))
			if (ptr_type->getPointerElementType()->getTypeID() == Type::TypeID::FunctionTyID)
				expected_type = ptr_type->getPointerElementType();

		if (expected_type && expected_type != values[op]->getType())
		{
			LOGE("Type mismatch.\n");
			return nullptr;
		}
		return values[op];
	}
}

Value *ModuleParseContext::get_value(const Vector<uint64_t> &ops, unsigned &index, Type *expected_type)
{
	if (index >= ops.size())
		return nullptr;
	return get_value(ops[index++], expected_type);
}

std::pair<Value *, Type *> ModuleParseContext::get_value_and_type(const Vector<uint64_t> &ops, unsigned &index)
{
	if (index >= ops.size())
		return {};

	uint64_t op = ops[index++];
	if (use_relative_id)
		op = uint32_t(values.size() - op);

	if (op < values.size())
	{
		// Normal reference.
		return { values[op], values[op]->getType() };
	}
	else
	{
		// Forward reference, the type is encoded in the next element.
		if (index >= ops.size())
			return {};

		auto *type = get_type(ops[index++]);
		auto *proxy = context->construct<ValueProxy>(type, *this, op);
		pending_forward_references.push_back(proxy);
		return { proxy, type };
	}
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

bool ModuleParseContext::add_instruction(Instruction *inst)
{
	instructions.push_back(inst);

	if (current_bb)
		current_bb->add_instruction(inst);
	else
	{
		LOGE("No basic block is currently set!\n");
		return false;
	}

	if (inst->isTerminator())
		return finish_basic_block();
	else
		return add_value(inst);
}

bool ModuleParseContext::add_value(Value *value)
{
	if (value->getType()->getTypeID() != Type::TypeID::VoidTyID)
	{
		value->set_tween_id(tween_id++);
		values.push_back(value);
	}
	return true;
}

Type *ModuleParseContext::get_constant_type()
{
	if (constant_type)
		return constant_type;
	else
		return Type::getInt32Ty(*context);
}

static Type *resolve_gep_element_type(Type *type, const Vector<Value *> &args)
{
	for (unsigned i = 2; i < args.size(); i++)
	{
		auto *arg = args[i];
		if (type->getTypeID() == Type::TypeID::StructTyID)
		{
			auto *const_int = dyn_cast<ConstantInt>(arg);
			if (!const_int)
			{
				LOGE("Indexing into a struct without a constant integer.\n");
				return nullptr;
			}

			unsigned index = const_int->getUniqueInteger().getZExtValue();
			if (index >= cast<StructType>(type)->getNumElements())
			{
				LOGE("Struct element index out of range.\n");
				return nullptr;
			}
			type = cast<StructType>(type)->getElementType(index);
		}
		else if (type->getTypeID() == Type::TypeID::ArrayTyID)
		{
			type = type->getArrayElementType();
		}
		else if (type->getTypeID() == Type::TypeID::VectorTyID)
		{
			type = cast<VectorType>(type)->getElementType();
		}
		else
			return nullptr;
	}

	return type;
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
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::UDiv;
	case BinOp::SDIV:
		return is_fp ? BinaryOperator::BinaryOps::FDiv : BinaryOperator::BinaryOps::SDiv;
	case BinOp::UREM:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::URem;
	case BinOp::SREM:
		return is_fp ? BinaryOperator::BinaryOps::FRem : BinaryOperator::BinaryOps::SRem;
	case BinOp::SHL:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::Shl;
	case BinOp::LSHR:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::LShr;
	case BinOp::ASHR:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::AShr;
	case BinOp::AND:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::And;
	case BinOp::OR:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::Or;
	case BinOp::XOR:
		return is_fp ? BinaryOperator::BinaryOps::InvalidBinaryOp : BinaryOperator::BinaryOps::Xor;
	default:
		return BinaryOperator::BinaryOps::InvalidBinaryOp;
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
	return Instruction::CastOps::InvalidCastOp;
}

bool ModuleParseContext::parse_constants_record(const BlockOrRecord &entry)
{
	if (entry.IsBlock())
		return true;

	switch (ConstantsRecord(entry.id))
	{
	case ConstantsRecord::SETTYPE:
		if (entry.ops.size() < 1)
			return false;
		constant_type = get_type(entry.ops[0]);
		break;

	case ConstantsRecord::CONST_NULL:
	{
		auto *type = get_constant_type();
		Value *value = nullptr;
		if (type->isIntegerTy())
			value = ConstantInt::get(type, 0);
		else if (type->isFloatingPointTy())
			value = ConstantFP::get(type, 0);
		else if (isa<ArrayType>(type) || isa<StructType>(type) || isa<VectorType>(type))
			value = context->construct<ConstantAggregateZero>(type);
		else if (isa<PointerType>(type))
			value = context->construct<ConstantPointerNull>(type);

		if (!value)
		{
			LOGE("Unknown type for CONST_NULL.\n");
			return false;
		}

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
		if (entry.ops.size() < 1)
			return false;
		auto *type = get_constant_type();
		if (!type->isIntegerTy())
		{
			LOGE("Constant type is not integer.\n");
			return false;
		}

		uint64_t literal = entry.ops[0];
		int64_t signed_literal = decode_sign_rotated_value(literal);
		ConstantInt *value = ConstantInt::get(type, signed_literal);
		values.push_back(value);
		break;
	}

	case ConstantsRecord::WIDE_INTEGER:
		LOGE("WIDE_INTEGER unimplemented.\n");
		return false;

	case ConstantsRecord::FLOAT:
	{
		if (entry.ops.size() < 1)
			return false;
		auto *type = get_constant_type();
		if (!type->isFloatingPointTy())
		{
			LOGE("Constant type is not FP.\n");
			return false;
		}
		ConstantFP *value = ConstantFP::get(type, entry.ops[0]);
		values.push_back(value);
		break;
	}

	case ConstantsRecord::AGGREGATE:
	{
		Vector<Value *> constants;
		Value *value;
		constants.reserve(entry.ops.size());

		if (auto *struct_type = dyn_cast<StructType>(get_constant_type()))
		{
			if (entry.ops.size() != struct_type->getStructNumElements())
			{
				LOGE("Mismatch in struct element counts.\n");
				return false;
			}

			constants.reserve(struct_type->getStructNumElements());
			for (unsigned i = 0; i < struct_type->getStructNumElements(); i++)
				constants.push_back(get_value(entry.ops[i], struct_type->getStructElementType(i), true));
			value = context->construct<ConstantAggregate>(get_constant_type(), std::move(constants));
		}
		else if (isa<ArrayType>(get_constant_type()))
		{
			auto *element_type = get_constant_type()->getArrayElementType();
			constants.reserve(entry.ops.size());
			for (auto &op : entry.ops)
				constants.push_back(get_value(op, element_type, true));
			value = context->construct<ConstantAggregate>(get_constant_type(), std::move(constants));
		}
		else if (isa<VectorType>(get_constant_type()))
		{
			auto *element_type = cast<VectorType>(get_constant_type())->getElementType();
			constants.reserve(entry.ops.size());
			for (auto &op : entry.ops)
				constants.push_back(get_value(op, element_type, true));
			value = context->construct<ConstantAggregate>(get_constant_type(), std::move(constants));
		}
		else
		{
			value = UndefValue::get(get_constant_type());
		}

		values.push_back(value);
		break;
	}

	case ConstantsRecord::STRING:
		LOGE("STRING unimplemented.\n");
		return false;

	case ConstantsRecord::BINOP:
	{
		unsigned index = 0;
		auto *type = get_constant_type();
		auto op = translate_binop(BinOp(entry.ops[index++]), type);
		auto *a = get_value(entry.ops[index++], type, true);
		auto *b = get_value(entry.ops[index++], type, true);
		auto elements = Vector<Value *>{a, b};
		Value *value = context->construct<ConstantExpr>(op, type, std::move(elements));
		values.push_back(value);
		break;
	}

	case ConstantsRecord::CE_CAST:
	{
		unsigned index = 0;

		auto op = translate_castop(CastOp(entry.ops[index++]));

		auto *type = get_constant_type();

		auto *input_value_type = get_type(entry.ops[index++]);
		if (!input_value_type)
			return false;
		auto *input_value = get_value(entry.ops[index++], input_value_type, true);

		auto elements = Vector<Value *>{input_value};
		Value *value = context->construct<ConstantExpr>(op, type, std::move(elements));
		values.push_back(value);
		break;
	}

	case ConstantsRecord::DATA:
	{
		bool is_vector = false;
		Type *element_type = nullptr;
		if (isa<ArrayType>(get_constant_type()))
			element_type = get_constant_type()->getArrayElementType();
		else if (isa<VectorType>(get_constant_type()))
		{
			element_type = cast<VectorType>(get_constant_type())->getElementType();
			is_vector = true;
		}
		else
		{
			LOGE("Unknown DATA type.\n");
			return false;
		}

		bool is_fp = element_type->isFloatingPointTy();
		bool is_int = element_type->isIntegerTy();
		Vector<Value *> constants;
		constants.reserve(entry.ops.size());
		if (is_fp)
		{
			for (auto &op : entry.ops)
				constants.push_back(ConstantFP::get(element_type, op));
		}
		else if (is_int)
		{
			for (auto &op : entry.ops)
				constants.push_back(ConstantInt::get(element_type, op));
		}
		else
		{
			LOGE("Unknown DATA type.\n");
			return false;
		}

		Value *value;
		if (is_vector)
			value = context->construct<ConstantDataVector>(get_constant_type(), std::move(constants));
		else
			value = context->construct<ConstantDataArray>(get_constant_type(), std::move(constants));

		values.push_back(value);
		break;
	}

	case ConstantsRecord::GEP:
	case ConstantsRecord::INBOUNDS_GEP:
	case ConstantsRecord::GEP_WITH_INRANGE_INDEX:
	{
		if (entry.ops.size() < 2)
			return false;
		Type *pointee_type = nullptr;
		unsigned index = 0;
		if (ConstantsRecord(entry.id) == ConstantsRecord::GEP_WITH_INRANGE_INDEX ||
			(entry.ops.size() & 1))
		{
			pointee_type = get_type(entry.ops[index++]);
		}

		if (ConstantsRecord(entry.id) == ConstantsRecord::GEP_WITH_INRANGE_INDEX)
			index++;

		Vector<Value *> elements;
		elements.reserve(entry.ops.size() / 2);
		while (index < entry.ops.size())
		{
			auto *type = get_type(entry.ops[index++]);
			auto *value = get_value(entry.ops[index++], type, true);
			elements.push_back(value);
		}

		if (elements.size() < 2)
			return false;

		if (!pointee_type)
			pointee_type = elements[0]->getType()->getPointerElementType();

		pointee_type = resolve_gep_element_type(pointee_type, elements);
		if (!pointee_type)
			return false;
		pointee_type = PointerType::get(pointee_type, cast<PointerType>(elements[0]->getType())->getAddressSpace());

		auto *value = context->construct<ConstantExpr>(Instruction::GetElementPtr, pointee_type, std::move(elements));
		values.push_back(value);
		break;
	}

	default:
		LOGE("UNKNOWN unimplemented.\n");
		return false;
	}

	return true;
}

bool ModuleParseContext::parse_constants_block(const BlockOrRecord &entry)
{
	constant_type = nullptr;
	for (auto &child : entry.children)
		if (!parse_constants_record(child))
			return false;
	return true;
}

bool ModuleParseContext::parse_metadata_attachment_record(const BlockOrRecord &entry)
{
	if (MetaDataRecord(entry.id) != MetaDataRecord::ATTACHMENT)
		return true;

	if (entry.ops.size() < 1)
		return false;

	size_t size = entry.ops.size();
	size_t num_nodes = (size - 1) / 2;
	auto *inst = get_instruction(entry.ops[0]);

	if (!inst)
	{
		LOGE("Invalid instruction.\n");
		return false;
	}

	for (size_t i = 0; i < num_nodes; i++)
	{
		auto *kind = get_metadata_kind(entry.ops[2 * i + 1]);
		auto *operand = get_metadata(entry.ops[2 * i + 2]);
		auto *node = dyn_cast<MDNode>(operand);

		if (!kind)
		{
			LOGE("Invalid metadata kind.\n");
			return false;
		}

		if (!node)
		{
			LOGE("Invalid metadata attachment.\n");
			return false;
		}

		inst->setMetadata(kind, node);
	}
	return true;
}

bool ModuleParseContext::parse_metadata_record(const BlockOrRecord &entry, unsigned index)
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
		Vector<MDNode *> ops;
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

	case MetaDataRecord::DISTINCT_NODE:
	case MetaDataRecord::NODE:
	{
		Vector<MDOperand *> ops;
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
		if (entry.ops.size() < 2)
			return false;

		auto *value = get_value(entry.ops[1], nullptr, true);
		if (!value)
		{
			LOGE("Null value!\n");
			return false;
		}

		auto *constant_value = dyn_cast<Constant>(value);
		if (!constant_value)
		{
			LOGE("Not a constant!\n");
			return false;
		}

		auto *node = context->construct<ConstantAsMetadata>(module, constant_value);
		metadata[index] = node;
		break;
	}

	case MetaDataRecord::KIND:
	{
		if (entry.ops.size() < 1)
			return false;

		metadata_kind_map[entry.ops[0]] = entry.getString(1);
		break;
	}

	default:
		break;
	}

	return true;
}

bool ModuleParseContext::parse_metadata_block(const BlockOrRecord &entry)
{
	unsigned index = 0;
	for (auto &child : entry.children)
		if (!parse_metadata_record(child, index++))
			return false;
	return true;
}

bool ModuleParseContext::parse_paramattr_block(const BlockOrRecord &entry)
{
	for (auto &child : entry.children)
	{
		if (!child.IsRecord())
			continue;

		// Don't support the OLD variant unless we observe it in the wild.
		// DXC doesn't generate it.
		if (AttributeCodes(child.id) != AttributeCodes::CodeEntry)
			return false;

		Vector<std::pair<String, String>> pairs;
		pairs.reserve(child.ops.size());
		for (auto op : child.ops)
		{
			auto &grp = attribute_groups[op];
			pairs.reserve(grp.size());
			for (auto &elem : grp)
				pairs.push_back(elem);
		}
		attribute_lists.push_back(std::move(pairs));
	}
	return true;
}

bool ModuleParseContext::parse_paramattr_group_block(const BlockOrRecord &entry)
{
	if (!attribute_groups.empty())
	{
		LOGE("Cannot use multiple group blocks.\n");
		return false;
	}

	for (auto &child : entry.children)
	{
		if (!child.IsRecord())
			continue;
		if (AttributeCodes(child.id) != AttributeCodes::GroupCodeEntry)
			continue;

		if (child.ops.size() < 3)
			return false;

		uint64_t group_id = child.ops[0];
		uint64_t index = child.ops[1];

		if (index != ~0u) // Only care about attributes on function scope
			continue;

		auto &attr_group = attribute_groups[group_id];

		size_t i = 2;
		size_t count = child.ops.size();
		while (i < count)
		{
			if (child.ops[i] == 0) // Enum attribute, skip 2 values
			{
				i += 2;
			}
			else if (child.ops[i] == 1) // Integer attribute, skip 2 or 3 values
			{
				i++;
				if (i >= count)
					return false;

				switch (AttributeRecord(child.ops[i++]))
				{
				case AttributeRecord::ALIGNMENT:
				case AttributeRecord::STACK_ALIGNMENT:
				case AttributeRecord::ALLOC_SIZE:
				case AttributeRecord::DEREFERENCEABLE:
				case AttributeRecord::DEREFERENCEABLE_OR_NULL:
					i++;
					break;

				default:
					break;
				}
			}
			else if (child.ops[i] == 3 || child.ops[i] == 4) // String attribute
			{
				bool has_value = child.ops[i++] == 4;
				String kind, value;

				kind.reserve(count - i);
				while (child.ops[i] != 0 && i < count)
					kind.push_back(char(child.ops[i++]));
				if (child.ops[i] != 0)
					return false;
				i++;

				if (has_value)
				{
					value.reserve(count - i);
					while (child.ops[i] != 0 && i < count)
						value.push_back(char(child.ops[i++]));
					if (child.ops[i] != 0)
						return false;
					i++;
				}
				attr_group.emplace_back(std::move(kind), std::move(value));
			}
			else if (child.ops[i] == 5 || child.ops[i] == 6) // Value attribute
			{
				bool has_type = child.ops[i++] == 6;
				if (i >= count)
					return false;
				if (AttributeRecord(child.ops[i++]) == AttributeRecord::BY_VAL && has_type)
					i++;
			}
			else
				return false;
		}

		if (i > count)
			return false;
	}

	return true;
}

bool ModuleParseContext::parse_function_child_block(const BlockOrRecord &entry)
{
	switch (KnownBlocks(entry.id))
	{
	case KnownBlocks::CONSTANTS_BLOCK:
	{
		for (auto &child : entry.children)
			if (!parse_constants_record(child))
				return false;
		break;
	}

	case KnownBlocks::METADATA_ATTACHMENT:
	{
		for (auto &child : entry.children)
			if (!parse_metadata_attachment_record(child))
				return false;
		break;
	}

	default:
		break;
	}

	return true;
}

static UnaryOperator::UnaryOps translate_uop(UnaryOp op, Type *type)
{
	bool is_fp = type->isFloatingPointTy();
	if (op == UnaryOp::FNEG && is_fp)
		return UnaryOperator::UnaryOps::FNeg;
	else
		return UnaryOperator::UnaryOps::Invalid;
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

bool ModuleParseContext::parse_record(const BlockOrRecord &entry)
{
	switch (FunctionRecord(entry.id))
	{
	case FunctionRecord::DECLAREBLOCKS:
	{
		if (entry.ops.size() < 1)
			return false;
		basic_blocks.resize(entry.ops[0]);
		basic_block_index = 0;
		for (auto &bb : basic_blocks)
			bb = context->construct<BasicBlock>(*context);
		current_bb = basic_blocks.front();
		break;
	}

	case FunctionRecord::INST_CALL:
	{
		unsigned index = 1;

		if (index >= entry.ops.size())
			return false;
		auto CCInfo = entry.ops[index++];

		if (CCInfo & CALL_FMF_BIT)
		{
			if (index >= entry.ops.size())
				return false;
			auto fmf = entry.ops[index++];
			(void)fmf;
		}

		FunctionType *function_type = nullptr;
		if (CCInfo & CALL_EXPLICIT_TYPE_BIT)
		{
			if (index >= entry.ops.size())
				return false;
			function_type = cast<FunctionType>(get_type(entry.ops[index++]));
		}

		if (index >= entry.ops.size())
			return false;

		auto *callee = dyn_cast<Function>(get_value(entry.ops[index++]));
		if (!callee)
			return false;

		if (!function_type)
			function_type = callee->getFunctionType();

		if (!function_type)
			return false;

		unsigned num_params = function_type->getNumParams();
		if (entry.ops.size() != index + num_params)
		{
			LOGE("Number of params does not match record.\n");
			return false;
		}

		Vector<Value *> params;
		params.reserve(num_params);

		for (unsigned i = 0; i < num_params; i++)
		{
			auto *arg = get_value(entry.ops[index + i], function_type->getParamType(i));
			if (!arg)
				return false;
			params.push_back(arg);
		}

		auto *value = context->construct<CallInst>(function_type, callee, std::move(params));
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_RET:
	{
		auto *ret = context->construct<ReturnInst>(nullptr);
		if (!add_instruction(ret))
			return false;
		break;
	}

	case FunctionRecord::INST_UNREACHABLE:
	{
		auto *ret = context->construct<UnreachableInst>();
		if (!add_instruction(ret))
			return false;
		break;
	}

	case FunctionRecord::INST_UNOP:
	{
		unsigned index = 0;
		auto val = get_value_and_type(entry.ops, index);
		if (!val.first)
			return false;
		if (index == entry.ops.size())
			return false;
		auto op = UnaryOp(entry.ops[index++]);
		auto *value = context->construct<UnaryOperator>(translate_uop(op, val.second), val.first);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_CMP:
	case FunctionRecord::INST_CMP2:
	{
		unsigned index = 0;
		auto lhs = get_value_and_type(entry.ops, index);
		if (!lhs.first)
			return false;
		auto *rhs = get_value(entry.ops, index, lhs.second);
		if (index == entry.ops.size())
			return false;
		auto pred = Instruction::Predicate(entry.ops[index++]);

		if (!rhs)
			return false;

		Instruction *value = nullptr;
		if (lhs.second->isFloatingPointTy())
			value = context->construct<FCmpInst>(pred, lhs.first, rhs);
		else
			value = context->construct<ICmpInst>(pred, lhs.first, rhs);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_PHI:
	{
		if (entry.ops.size() < 1)
			return false;

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
			if (!value || !bb)
				return false;
			phi_node->add_incoming(value, bb);
		}
		if (!add_instruction(phi_node))
			return false;
		break;
	}

	case FunctionRecord::INST_BINOP:
	{
		unsigned index = 0;
		auto lhs = get_value_and_type(entry.ops, index);
		if (!lhs.first)
			return false;
		auto *rhs = get_value(entry.ops, index, lhs.second);
		if (!lhs.first || !rhs)
			return false;
		if (index == entry.ops.size())
			return false;
		auto op = BinOp(entry.ops[index++]);
		auto *value = context->construct<BinaryOperator>(lhs.first, rhs, translate_binop(op, lhs.second));
		if (index < entry.ops.size())
		{
			// Only relevant for FP math, but we only look at fast math state for
			// FP operations anyways.
			auto fast_math_flags = entry.ops[index];
			bool fast = (fast_math_flags & (FAST_MATH_UNSAFE_ALGEBRA_BIT | FAST_MATH_ALLOW_CONTRACT_BIT)) != 0;
			value->setFast(fast);
		}
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_ATOMICRMW:
	{
		unsigned index = 0;
		auto ptr = get_value_and_type(entry.ops, index);
		if (!ptr.first || !isa<PointerType>(ptr.second))
			return false;
		auto *val = get_value(entry.ops, index, ptr.second->getPointerElementType());
		if (!val)
			return false;
		if (index == entry.ops.size())
			return false;
		AtomicRMWInst::BinOp op = translate_atomic_binop(AtomicBinOp(entry.ops[index++]));
		auto *value = context->construct<AtomicRMWInst>(val->getType(), ptr.first, val, op);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_CMPXCHG:
	{
		unsigned index = 0;
		auto ptr = get_value_and_type(entry.ops, index);
		auto cmp = get_value_and_type(entry.ops, index);
		if (!ptr.first || !cmp.first || !isa<PointerType>(ptr.second))
			return false;
		auto *new_value = get_value(entry.ops, index, cmp.second);
		auto *value = context->construct<AtomicCmpXchgInst>(ptr.first, cmp.first, new_value);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_CAST:
	{
		unsigned index = 0;
		auto input_value = get_value_and_type(entry.ops, index);
		if (!input_value.first || index + 2 > entry.ops.size())
			return false;
		auto *type = get_type(entry.ops[index++]);
		if (!type)
			return false;
		auto op = Instruction::CastOps(translate_castop(CastOp(entry.ops[index++])));
		auto *value = context->construct<CastInst>(type, input_value.first, op);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_SELECT:
	case FunctionRecord::INST_VSELECT:
	{
		unsigned index = 0;
		auto true_value = get_value_and_type(entry.ops, index);
		if (!true_value.first || index + 2 > entry.ops.size())
			return false;
		auto *false_value = get_value(entry.ops[index++], true_value.second);
		auto *cond_value = get_value(entry.ops[index++], Type::getInt1Ty(*context));
		if (!false_value || !cond_value)
			return false;
		auto *value = context->construct<SelectInst>(true_value.first, false_value, cond_value);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_EXTRACTVAL:
	{
		unsigned index = 0;
		auto aggregate = get_value_and_type(entry.ops, index);
		if (!aggregate.first)
			return false;

		if (index == entry.ops.size())
			return false;

		Vector<unsigned> indices;
		indices.reserve(entry.ops.size() - index);
		unsigned num_args = entry.ops.size();

		Type *type = aggregate.second;
		for (; index < num_args; index++)
		{
			auto element = unsigned(entry.ops[index]);
			if (type->getTypeID() == Type::TypeID::StructTyID)
			{
				if (element >= cast<StructType>(type)->getNumElements())
				{
					LOGE("Struct element index out of range.\n");
					return false;
				}
				type = cast<StructType>(type)->getElementType(element);
			}
			else if (type->getTypeID() == Type::TypeID::ArrayTyID)
			{
				type = type->getArrayElementType();
			}
			else if (type->getTypeID() == Type::TypeID::VectorTyID)
			{
				type = cast<VectorType>(type)->getElementType();
			}
			else
				return false;

			// DXIL does not support vectors, so we're not supposed to index into them any further.
			indices.push_back(element);
		}

		auto *value = context->construct<ExtractValueInst>(type, aggregate.first, std::move(indices));
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_BR:
	{
		if (entry.ops.size() < 1)
			return false;

		auto *true_block = get_basic_block(entry.ops[0]);
		if (!true_block)
			return false;

		if (!add_successor(true_block))
			return false;

		if (entry.ops.size() == 1)
		{
			auto *value = context->construct<BranchInst>(true_block);
			if (!add_instruction(value))
				return false;
		}
		else if (entry.ops.size() == 3)
		{
			auto *false_block = get_basic_block(entry.ops[1]);
			if (!false_block)
				return false;
			if (!add_successor(false_block))
				return false;
			auto *cond = get_value(entry.ops[2], Type::getInt1Ty(*context));
			auto *value = context->construct<BranchInst>(true_block, false_block, cond);
			if (!add_instruction(value))
				return false;
		}
		else
			return false;
		break;
	}

	case FunctionRecord::INST_SWITCH:
	{
		if (entry.ops.size() < 3)
			return false;

		auto *type = get_type(entry.ops[0]);
		auto *cond = get_value(entry.ops[1]);
		auto *default_block = get_basic_block(entry.ops[2]);

		if (!type || !cond || !default_block)
			return false;
		if (!add_successor(default_block))
			return false;

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
				return false;
			}
			if (!add_successor(bb))
				return false;
			inst->addCase(case_value, bb);
		}
		if (!add_instruction(inst))
			return false;
		break;
	}

	case FunctionRecord::INST_ALLOCA:
	{
		if (entry.ops.size() < 3)
			return false;
		auto *allocated_type = get_type(entry.ops[0]);
		auto *type = get_type(entry.ops[1]);
		auto *size = get_value(entry.ops[2], nullptr, true);

		if (!allocated_type || !type || !size)
			return false;

		auto *ptr_type = PointerType::get(allocated_type, 0);

		auto *value = context->construct<AllocaInst>(ptr_type, type, size);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_GEP:
	{
		if (entry.ops.size() < 3)
			return false;

		bool inbounds = entry.ops[0] != 0;
		auto *type = get_type(entry.ops[1]);
		unsigned count = entry.ops.size();
		Vector<Value *> args;
		args.reserve(count);
		for (unsigned i = 2; i < count;)
		{
			auto value = get_value_and_type(entry.ops, i);
			if (!value.first)
				return false;
			args.push_back(value.first);
		}

		type = resolve_gep_element_type(type, args);
		if (!type)
			return false;
		type = PointerType::get(type, cast<PointerType>(args[0]->getType())->getAddressSpace());

		auto *value = context->construct<GetElementPtrInst>(type, std::move(args), inbounds);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_LOAD:
	{
		unsigned index = 0;
		auto ptr = get_value_and_type(entry.ops, index);
		if (index + 2 != entry.ops.size() && index + 3 != entry.ops.size())
			return false;

		if (!ptr.first || !isa<PointerType>(ptr.second))
		{
			LOGE("Loading from something that is not a pointer.\n");
			return false;
		}

		Type *loaded_type = nullptr;
		if (index + 3 == entry.ops.size())
			loaded_type = get_type(entry.ops[index++]);
		else
			loaded_type = cast<PointerType>(ptr.second)->getElementType();

		auto *value = context->construct<LoadInst>(loaded_type, ptr.first);
		add_instruction(value);
		break;
	}

	case FunctionRecord::INST_STORE:
	{
		unsigned index = 0;
		auto ptr = get_value_and_type(entry.ops, index);
		auto val = get_value_and_type(entry.ops, index);
		if (!ptr.first || !val.first || index + 2 != entry.ops.size())
			return false;
		auto *value = context->construct<StoreInst>(ptr.first, val.first);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_SHUFFLEVEC:
	{
		unsigned index = 0;
		auto a = get_value_and_type(entry.ops, index);
		auto *b = get_value(entry.ops, index, a.second);
		auto shuf = get_value_and_type(entry.ops, index);
		if (!a.first || !b || !shuf.first || !isa<VectorType>(a.second))
			return false;

		auto *vec_type = VectorType::get(cast<ConstantDataVector>(shuf.first)->getNumElements(),
		                                 cast<VectorType>(a.second)->getElementType());
		auto *value = context->construct<ShuffleVectorInst>(vec_type, a.first, b, shuf.first);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_EXTRACTELT:
	{
		unsigned index = 0;
		auto vec = get_value_and_type(entry.ops, index);
		if (!vec.first || !isa<VectorType>(vec.second))
			return false;
		auto element_index = get_value_and_type(entry.ops, index);
		if (!element_index.first)
			return false;

		auto *value = context->construct<ExtractElementInst>(vec.first, element_index.first);
		if (!add_instruction(value))
			return false;
		break;
	}

	case FunctionRecord::INST_INSERTELT:
	{
		unsigned index = 0;
		auto vec = get_value_and_type(entry.ops, index);
		if (!vec.first || !isa<VectorType>(vec.second))
			return false;
		auto *value = get_value(entry.ops, index, cast<VectorType>(vec.second)->getElementType());
		auto element_index = get_value_and_type(entry.ops, index);
		if (!value || !element_index.first)
			return false;
		auto *new_value = context->construct<InsertElementInst>(vec.first, value, element_index.first);
		if (!add_instruction(new_value))
			return false;
		break;
	}

	default:
		LOGE("Unhandled instruction!\n");
		return false;
	}

	return true;
}

bool ModuleParseContext::resolve_forward_references()
{
	for (auto *ref : pending_forward_references)
		if (!ref->resolve())
			return false;
	pending_forward_references.clear();

	for (auto *bb : basic_blocks)
		for (auto &inst : *bb)
			if (!inst.resolve_proxy_values())
				return false;

	return true;
}

bool ModuleParseContext::resolve_global_initializations()
{
	for (auto &ref : global_initializations)
	{
		Value *value = get_value(ref.second, nullptr, true);
		if (!value)
			return false;
		auto *constant_value = dyn_cast<Constant>(value);
		if (!constant_value)
		{
			LOGE("Global initializer is not a constant!\n");
			return false;
		}
		ref.first->set_initializer(constant_value);
	}
	global_initializations.clear();
	return true;
}

bool ModuleParseContext::parse_function_body(const BlockOrRecord &entry)
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
		return false;
	}

	function = functions_with_bodies.back();
	functions_with_bodies.pop_back();

	auto *func_type = function->getFunctionType();
	for (unsigned i = 0; i < func_type->getNumParams(); i++)
	{
		auto *param_type = func_type->getParamType(i);
		auto *arg = context->construct<Argument>(param_type, i);
		function->add_argument(arg);
		add_value(arg);
	}

	for (auto &child : entry.children)
	{
		if (child.IsBlock())
		{
			if (!parse_function_child_block(child))
				return false;
		}
		else
		{
			if (!parse_record(child))
				return false;
		}
	}

	if (!resolve_forward_references())
		return false;
	if (!resolve_global_initializations())
		return false;

	function->set_basic_blocks(std::move(basic_blocks));
	basic_blocks = {};
	basic_block_index = 0;
	module->add_function_implementation(function);

	values = global_values;
	instructions.clear();
	return true;
}

bool ModuleParseContext::parse_type(const BlockOrRecord &child)
{
	Type *type = nullptr;
	switch (TypeRecord(child.id))
	{
	case TypeRecord::NUMENTRY:
	case TypeRecord::STRUCT_NAME:
		return true;

	case TypeRecord::VOID_TYPE:
		type = Type::getVoidTy(*context);
		break;

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
	{
		if (child.ops.size() < 2)
			return false;

		auto *pointee_type = get_type(child.ops[0]);
		if (!pointee_type)
			return false;
		type = PointerType::get(pointee_type, child.ops[1]);
		break;
	}

	case TypeRecord::ARRAY:
	{
		if (child.ops.size() < 2)
			return false;

		auto *elem_type = get_type(child.ops[1]);
		if (!elem_type)
			return false;
		type = ArrayType::get(elem_type, child.ops[0]);
		break;
	}

	case TypeRecord::INTEGER:
	{
		if (child.ops.size() < 1)
			return false;

		auto bit_width = child.ops[0];
		if (bit_width <= 64)
			type = Type::getIntTy(*context, unsigned(bit_width));
		else
			return false;
		break;
	}

	case TypeRecord::STRUCT_NAMED:
	case TypeRecord::STRUCT_ANON:
	{
		if (child.ops.size() < 1)
			return false;

		Vector<Type *> members;
		unsigned num_members = child.ops.size() - 1;
		members.reserve(num_members);
		for (unsigned i = 0; i < num_members; i++)
			members.push_back(get_type(child.ops[i + 1]));
		type = StructType::get(*context, std::move(members));
		break;
	}

	case TypeRecord::VECTOR:
	{
		if (child.ops.size() < 2)
			return false;

		auto *elem_type = get_type(child.ops[1]);
		if (!elem_type)
			return false;
		type = VectorType::get(child.ops[0], elem_type);
		break;
	}

	case TypeRecord::FUNCTION:
	{
		if (child.ops.size() < 2)
			return false;
		Vector<Type *> argument_types;
		argument_types.reserve(child.ops.size() - 2);
		for (size_t i = 2; i < child.ops.size(); i++)
			argument_types.push_back(get_type(child.ops[i]));

		auto *func_type = get_type(child.ops[1]);
		if (!func_type)
			return false;

		type = context->construct<FunctionType>(*context, func_type, std::move(argument_types));
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

	case TypeRecord::OPAQUE_TYPE:
	{
		type = Type::getOpaqueTy(*context);
		break;
	}

	default:
		LOGE("Unknown type!\n");
		return false;
	}

	add_type(type);
	return true;
}

bool ModuleParseContext::parse_types(const BlockOrRecord &entry)
{
	for (auto &child : entry.children)
		if (!parse_type(child))
			return false;
	return true;
}

bool ModuleParseContext::parse_value_symtab(const BlockOrRecord &entry)
{
	for (auto &symtab : entry.children)
	{
		switch (ValueSymtabRecord(symtab.id))
		{
		case ValueSymtabRecord::ENTRY:
		{
			if (symtab.ops.size() < 1)
				return false;

			auto name = symtab.getString(1);
			module->add_value_name(symtab.ops[0], name);
			break;
		}

		default:
			break;
		}
	}
	return true;
}

static GlobalVariable::LinkageTypes decode_linkage(uint64_t v)
{
	switch (v)
	{
	case 0:
	case 5:
	case 6:
	case 15:
		return GlobalVariable::ExternalLinkage;

	case 2:
		return GlobalVariable::AppendingLinkage;

	default:
		return GlobalVariable::InternalLinkage;
	}
}

bool ModuleParseContext::parse_global_variable_record(const BlockOrRecord &entry)
{
	if (use_strtab)
	{
		LOGE("Unknown module code 2 which uses strtab.\n");
		return false;
	}

	if (entry.ops.size() < 4)
		return false;

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

	if (!type)
		return false;

	auto linkage = decode_linkage(entry.ops[3]);

	auto *value = context->construct<GlobalVariable>(PointerType::get(type, address_space), linkage, is_const);
	module->add_global_variable(value);
	add_value(value);

	uint64_t init_id = entry.ops[2];
	if (init_id != 0)
		global_initializations.push_back({ value, init_id - 1 });

	return true;
}

bool ModuleParseContext::parse_function_record(const BlockOrRecord &entry)
{
	if (use_strtab)
	{
		LOGE("Unknown module code 2 which uses strtab.\n");
		return false;
	}

	if (entry.ops.size() < 3)
		return false;

	auto *type = get_type(entry.ops[0]);
	if (!type)
		return false;

	// Calling convention is [1], not relevant.
	bool is_proto = entry.ops[2];
	// Lots of other irrelevant arguments ...

	auto *func_type = dyn_cast<FunctionType>(type);
	if (!func_type)
		func_type = cast<FunctionType>(cast<PointerType>(type)->getElementType());

	if (!func_type)
		return false;

	auto id = values.size();
	auto *func = context->construct<Function>(func_type, id, *module);

	if (entry.ops.size() >= 5 && entry.ops[4] != 0 && (entry.ops[4] - 1) < attribute_lists.size())
		func->set_attributes(attribute_lists[entry.ops[4] - 1]);

	values.push_back(func);

	if (!is_proto)
		functions_with_bodies.push_back(func);

	return true;
}

bool ModuleParseContext::parse_version_record(const BlockOrRecord &entry)
{
	if (entry.ops.size() < 1)
		return false;
	unsigned version = entry.ops[0];
	use_relative_id = version >= 1;
	use_strtab = version >= 2;
	return true;
}

Type *ModuleParseContext::get_type(uint64_t index)
{
	if (index >= types.size())
		return nullptr;
	return types[index];
}

bool ModuleParseContext::add_type(Type *type)
{
	types.push_back(type);
	return true;
}

void Module::add_value_name(uint64_t id, const String &name)
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

void Module::add_named_metadata(const String &name, NamedMDNode *node)
{
	named_metadata[name] = node;
}

void Module::add_unnamed_metadata(MDNode *node)
{
	unnamed_metadata.push_back(node);
}

Function *Module::getFunction(const String &name) const
{
	auto itr =
	    std::find_if(functions.begin(), functions.end(), [&](const Function *func) { return func->getName() == name; });

	if (itr != functions.end())
		return *itr;
	else
		return nullptr;
}

NamedMDNode *Module::getNamedMetadata(const String &name) const
{
	auto itr = named_metadata.find(name);
	if (itr != named_metadata.end())
		return itr->second;
	else
		return nullptr;
}

static const String empty_string;
const String &Module::get_value_name(uint64_t id) const
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

Vector<Function *>::const_iterator Module::begin() const
{
	return functions.begin();
}

Vector<Function *>::const_iterator Module::end() const
{
	return functions.end();
}

IteratorAdaptor<GlobalVariable, Vector<GlobalVariable *>::const_iterator> Module::global_begin() const
{
	return globals.begin();
}

IteratorAdaptor<GlobalVariable, Vector<GlobalVariable *>::const_iterator> Module::global_end() const
{
	return globals.end();
}

UnorderedMap<String, NamedMDNode *>::const_iterator Module::named_metadata_begin() const
{
	return named_metadata.begin();
}

UnorderedMap<String, NamedMDNode *>::const_iterator Module::named_metadata_end() const
{
	return named_metadata.end();
}

Vector<MDNode *>::const_iterator Module::unnamed_metadata_begin() const
{
	return unnamed_metadata.begin();
}

Vector<MDNode *>::const_iterator Module::unnamed_metadata_end() const
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
				if (!parse_context.parse_value_symtab(child))
					return nullptr;
				break;

			case KnownBlocks::FUNCTION_BLOCK:
				if (!parse_context.parse_function_body(child))
					return nullptr;
				break;

			case KnownBlocks::TYPE_BLOCK:
				if (!parse_context.parse_types(child))
					return nullptr;
				break;

			case KnownBlocks::CONSTANTS_BLOCK:
				if (!parse_context.parse_constants_block(child))
					return nullptr;
				break;

			case KnownBlocks::METADATA_BLOCK:
				if (!parse_context.parse_metadata_block(child))
					return nullptr;
				break;

			case KnownBlocks::PARAMATTR_BLOCK:
				if (!parse_context.parse_paramattr_block(child))
					return nullptr;
				break;

			case KnownBlocks::PARAMATTR_GROUP_BLOCK:
				if (!parse_context.parse_paramattr_group_block(child))
					return nullptr;
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
				if (!parse_context.parse_version_record(child))
					return nullptr;
				break;

			case ModuleRecord::FUNCTION:
				if (!parse_context.parse_function_record(child))
					return nullptr;
				break;

			case ModuleRecord::GLOBAL_VARIABLE:
				if (!parse_context.parse_global_variable_record(child))
					return nullptr;
				break;

			default:
				break;
			}
		}
	}

	return module;
}
} // namespace LLVMBC
