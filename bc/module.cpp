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
	std::vector<Function *> functions_with_bodies;
	Type *constant_type = nullptr;

	void parse_function_child_block(const BlockOrRecord &entry);
	void parse_record(const BlockOrRecord &entry);
	void parse_constants_record(const BlockOrRecord &entry);
	void parse_constants_block(const BlockOrRecord &entry);
	Type *get_constant_type();
	void parse_function_body(const BlockOrRecord &entry);
	void parse_types(const BlockOrRecord &entry);
	void parse_value_symtab(const BlockOrRecord &entry);
	void parse_function_record(const BlockOrRecord &entry);
	void parse_version_record(const BlockOrRecord &entry);
	void add_instruction(Instruction *inst);

	void finish_basic_block();
	BasicBlock *get_basic_block(unsigned index) const;
	BasicBlock *current_bb = nullptr;
	unsigned basic_block_index = 0;

	Value *get_value(uint64_t op) const;
	Value *get_value_signed(uint64_t op) const;

	bool use_relative_id = true;
	bool use_strtab = false;
	bool seen_first_function_body = false;
};

void ModuleParseContext::finish_basic_block()
{
	basic_block_index++;
	if (basic_block_index >= basic_blocks.size())
		current_bb = nullptr;
	else
		current_bb = basic_blocks[basic_block_index];
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

Value *ModuleParseContext::get_value(uint64_t op) const
{
	if (use_relative_id)
		op = values.size() - op;

	if (op >= values.size())
	{
		LOGE("Forward reference?\n");
		return nullptr;
	}
	return values[op];
}

Value *ModuleParseContext::get_value_signed(uint64_t op) const
{
	int64_t signed_op = decode_sign_rotated_value(op);
	if (use_relative_id)
		signed_op = values.size() - signed_op;
	op = signed_op;

	if (op >= values.size())
	{
		LOGE("Forward reference?\n");
		return nullptr;
	}
	return values[op];
}

void ModuleParseContext::add_instruction(Instruction *inst)
{
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
	{
		inst->set_tween_id(values.size());
		values.push_back(inst);
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
		LOGI("Setting constant type index %u.\n", unsigned(entry.ops[0]));
		constant_type = module->get_type(entry.ops[0]);
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
		LOGI("Adding undef as ID %u.\n", unsigned(values.size()));
		values.push_back(UndefValue::get(type));
		break;
	}

	case ConstantsRecord::INTEGER:
	{
		LOGI("Adding constant integer as ID %u.\n", unsigned(values.size()));
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
		LOGI("Adding constant float as ID %u.\n", unsigned(values.size()));
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
		LOGW("DATA unimplemented.\n");
		values.push_back(nullptr);
		break;

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

	default:
		break;
	}
}

static UnaryOperation translate_uop(UnaryOp op, Type *type)
{
	bool is_fp = type->isFloatingPointTy();
	if (op == UnaryOp::FNEG && is_fp)
		return UnaryOperation::FNeg;
	else
		return UnaryOperation::Invalid;
}

static BinaryOperation translate_binop(BinOp op, Type *type)
{
	bool is_fp = type->isFloatingPointTy();
	switch (op)
	{
	case BinOp::ADD:
		return is_fp ? BinaryOperation::FAdd : BinaryOperation::Add;
	case BinOp::SUB:
		return is_fp ? BinaryOperation::FSub : BinaryOperation::Sub;
	case BinOp::MUL:
		return is_fp ? BinaryOperation::FMul : BinaryOperation::Mul;
	case BinOp::UDIV:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::UDiv;
	case BinOp::SDIV:
		return is_fp ? BinaryOperation::FDiv : BinaryOperation::SDiv;
	case BinOp::UREM:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::URem;
	case BinOp::SREM:
		return is_fp ? BinaryOperation::FRem : BinaryOperation::SRem;
	case BinOp::SHL:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::Shl;
	case BinOp::LSHR:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::LShr;
	case BinOp::ASHR:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::AShr;
	case BinOp::AND:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::And;
	case BinOp::OR:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::Or;
	case BinOp::XOR:
		return is_fp ? BinaryOperation::Invalid : BinaryOperation::Xor;
	default:
		return BinaryOperation::Invalid;
	}
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
			function_type = cast<FunctionType>(module->get_type(entry.ops[index++]));

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
		auto *type = module->get_type(entry.ops[0]);
		size_t num_args = (entry.ops.size() - 1) / 2;

		auto *phi_node = context->construct<PHINode>(type, num_args);

		for (size_t i = 0; i < num_args; i++)
		{
			Value *value = nullptr;
			if (use_relative_id)
				value = get_value_signed(entry.ops[2 * i + 1]);
			else
				value = get_value(entry.ops[2 * i + 1]);

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

	case FunctionRecord::INST_BR:
	{
		auto *true_block = get_basic_block(entry.ops[0]);
		if (entry.ops.size() == 1)
		{
			auto *value = context->construct<BranchInst>(true_block);
			add_instruction(value);
		}
		else
		{
			auto *false_block = get_basic_block(entry.ops[1]);
			auto *cond = get_value(entry.ops[2]);
			auto *value = context->construct<BranchInst>(true_block, false_block, cond);
			add_instruction(value);
		}
		break;
	}

	default:
		LOGE("Unhandled instruction!\n");
		add_instruction(nullptr);
		break;
	}
}

void ModuleParseContext::parse_function_body(const BlockOrRecord &entry)
{
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

	auto tween_id = values.size();
	for (auto *bb : basic_blocks)
		bb->set_tween_id(tween_id++);

	function->set_basic_blocks(std::move(basic_blocks));
	basic_blocks = {};
	module->add_function_implementation(function);
}

static void parse_type(Module *module, const BlockOrRecord &child)
{
	auto &context = module->getContext();

	Type *type = nullptr;
	switch (TypeRecord(child.id))
	{
	case TypeRecord::NUMENTRY:
		return;

	case TypeRecord::VOID:
	{
		type = Type::getVoidTy(context);
		LOGI("Type: VOID\n");
		break;
	}

	case TypeRecord::HALF:
		type = Type::getHalfTy(context);
		LOGI("Type: HALF\n");
		break;

	case TypeRecord::FLOAT:
		type = Type::getFloatTy(context);
		LOGI("Type: FLOAT\n");
		break;

	case TypeRecord::DOUBLE:
		type = Type::getDoubleTy(context);
		LOGI("Type: DOUBLE\n");
		break;

	case TypeRecord::POINTER:
		type = PointerType::get(module->get_type(child.ops[0]), child.ops[1]);
		LOGI("Type: POINTER\n");
		break;

	case TypeRecord::ARRAY:
		type = ArrayType::get(module->get_type(child.ops[1]), child.ops[0]);
		LOGI("Type: ARRAY\n");
		break;

	case TypeRecord::INTEGER:
		switch (child.ops[0])
		{
		case 1:
			type = Type::getInt1Ty(context);
			LOGI("Type: INT1\n");
			break;

		case 8:
			type = Type::getInt8Ty(context);
			LOGI("Type: INT8\n");
			break;

		case 16:
			type = Type::getInt16Ty(context);
			LOGI("Type: INT16\n");
			break;

		case 32:
			type = Type::getInt32Ty(context);
			LOGI("Type: INT32\n");
			break;

		case 64:
			type = Type::getInt64Ty(context);
			LOGI("Type: INT64\n");
			break;
		}
		break;

	case TypeRecord::STRUCT_NAME:
		return;

	case TypeRecord::STRUCT_NAMED:
	case TypeRecord::STRUCT_ANON:
	{
		std::vector<Type *> members;
		members.reserve(child.ops.size());
		for (auto &op : child.ops)
			members.push_back(module->get_type(op));
		type = StructType::get(std::move(members));
		LOGI("Type: STRUCT\n");
		break;
	}

	case TypeRecord::FUNCTION:
	{
		std::vector<Type *> argument_types;
		argument_types.reserve(child.ops.size());
		for (size_t i = 2; i < child.ops.size(); i++)
			argument_types.push_back(module->get_type(child.ops[i]));

		type = context.construct<FunctionType>(context,
		                                       module->get_type(child.ops[1]),
		                                       std::move(argument_types));

		LOGI("Type: FUNCTION\n");
		break;
	}

	case TypeRecord::LABEL:
	{
		type = Type::getLabelTy(context);
		LOGI("Type: LABEL\n");
		break;
	}

	case TypeRecord::METADATA:
	{
		type = Type::getMetadataTy(context);
		LOGI("Type: METADATA\n");
		break;
	}

	default:
		LOGE("Unknown type!\n");
		break;
	}

	module->add_type(type);
}

void ModuleParseContext::parse_types(const BlockOrRecord &entry)
{
	for (auto &child : entry.children)
		parse_type(module, child);
}

void ModuleParseContext::parse_value_symtab(const BlockOrRecord &entry)
{
	for (auto &symtab : entry.children)
	{
		auto name = symtab.getString(1);
		module->add_value_name(symtab.ops[0], name);
		LOGI("Value %u is \"%s\"\n", unsigned(symtab.ops[0]), name.c_str());
	}
}

void ModuleParseContext::parse_function_record(const BlockOrRecord &entry)
{
	if (use_strtab)
	{
		LOGE("Unknown module code 2 which uses strtab.\n");
		return;
	}

	auto *type = module->get_type(entry.ops[0]);
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
Type *Module::get_type(uint64_t index)
{
	assert(index < types.size());
	return types[index];
}

void Module::add_type(Type *type)
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

			default:
				break;
			}
		}
	}

	return module;
}
}
