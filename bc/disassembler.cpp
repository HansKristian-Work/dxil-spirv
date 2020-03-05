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
#include "context.hpp"
#include "type.hpp"
#include "value.hpp"
#include "cast.hpp"
#include "instruction.hpp"
#include "function.hpp"
#include <sstream>
#include <type_traits>
#include <assert.h>

namespace LLVMBC
{
struct StreamState
{
	std::ostringstream stream;
	unsigned indent = 0;

	StreamState &append(Type *type);
	StreamState &append(IntegerType *type);
	StreamState &append(PointerType *type);
	StreamState &append(ArrayType *type);
	StreamState &append(StructType *type);
	StreamState &append(FunctionType *type);

	StreamState &append(const std::string &str);
	StreamState &append(Value *value, bool decl = false);
	StreamState &append(Instruction *value);
	StreamState &append(Function *value, bool decl = false);
	StreamState &append(BinaryOperator *value, bool decl = false);
	StreamState &append(UnaryOperator *uop, bool decl = false);
	StreamState &append(CallInst *value, bool decl = false);
	StreamState &append(BranchInst *value, bool decl = false);
	StreamState &append(ReturnInst *value, bool decl = false);
	StreamState &append(UndefValue *value, bool decl = false);
	StreamState &append(ConstantInt *value, bool decl = false);
	StreamState &append(ConstantFP *value, bool decl = false);
	StreamState &append(BasicBlock *bb, bool decl = false);
	StreamState &append(FCmpInst *value, bool decl = false);
	StreamState &append(ICmpInst *value, bool decl = false);
	StreamState &append(PHINode *value, bool decl = false);
	StreamState &append(CastInst *value, bool decl = false);

	StreamState &append(float v);
	StreamState &append(double v);
	StreamState &append(bool v);
	StreamState &append(const char *str);

	StreamState &newline();
	StreamState &newline_noindent();
	void begin_scope();
	void end_scope();

	template <typename T, typename... Ts>
	StreamState &append(T &&t, Ts &&... ts)
	{
		append(std::forward<T>(t));
		append(std::forward<Ts>(ts)...);
		return *this;
	}

	// Only want this overload to trigger on various integer types.
	template <typename T>
	typename std::enable_if<std::is_integral<T>::value, StreamState &>::type append(T value)
	{
		stream << value;
		return *this;
	}

	// Need this to avoid the generic template to be deduced.
	template <size_t N>
	StreamState &append(char (&str)[N])
	{
		return append(static_cast<const char *>(str));
	}
};

StreamState &StreamState::append(IntegerType *type)
{
	return append("i", type->getBitWidth());
}

StreamState &StreamState::append(StructType *type)
{
	append("{ ");
	for (unsigned i = 0; i < type->getNumElements(); i++)
	{
		append(type->getElementType(i));
		if (i + 1 < type->getNumElements())
			append(", ");
	}
	append(" }");
	return *this;
}

StreamState &StreamState::append(PointerType *type)
{
	return append(type->getElementType(), "*");
}

StreamState &StreamState::append(ArrayType *type)
{
	return append(type->getArrayElementType(), "[", type->getArrayNumElements(), "]");
}

StreamState &StreamState::append(FunctionType *type)
{
	append("(", type->getReturnType(), " (*) (");
	for (unsigned i = 0; i < type->getNumParams(); i++)
	{
		append(type->getParamType(i));
		if (i + 1 < type->getNumParams())
			append(", ");
	}
	append("))");
	return *this;
}

StreamState &StreamState::append(bool v)
{
	stream << (v ? "true" : "false");
	return *this;
}

StreamState &StreamState::append(float v)
{
	char buf[1024];
	sprintf(buf, "%e", v);
	return append(buf);
}

StreamState &StreamState::append(double v)
{
	char buf[1024];
	sprintf(buf, "%e", v);
	return append(buf);
}

StreamState &StreamState::newline()
{
	stream << "\n";
	for (unsigned i = 0; i < indent; i++)
		stream << "  ";
	return *this;
}

StreamState &StreamState::newline_noindent()
{
	stream << "\n";
	return *this;
}

StreamState &StreamState::append(const char *str)
{
	stream << str;
	return *this;
}

StreamState &StreamState::append(const std::string &str)
{
	stream << str;
	return *this;
}

void StreamState::begin_scope()
{
	append(" {");
	indent++;
}

void StreamState::end_scope()
{
	assert(indent > 0);
	indent--;
	newline();
	append("}");
}

StreamState &StreamState::append(Type *type)
{
	switch (type->getTypeID())
	{
	case TypeID::Int:
		return append(cast<IntegerType>(type));
	case TypeID::Pointer:
		return append(cast<PointerType>(type));
	case TypeID::Struct:
		return append(cast<StructType>(type));
	case TypeID::Array:
		return append(cast<ArrayType>(type));
	case TypeID::Function:
		return append(cast<FunctionType>(type));
	case TypeID::Half:
		return append("half");
	case TypeID::Float:
		return append("float");
	case TypeID::Double:
		return append("double");
	case TypeID::Unknown:
		return append("unknown");
	case TypeID::Void:
		return append("void");
	}

	LOGE("Unknown Type %u.\n", unsigned(type->getTypeID()));
	return *this;
}

StreamState &StreamState::append(Function *func, bool decl)
{
	if (decl)
	{
		append("define ", func->getType(), " @", func->getName(), "(");
		auto *type = func->getFunctionType();
		for (unsigned i = 0; i < type->getNumParams(); i++)
		{
			append(type->getParamType(i));
			if (i + 1 < type->getNumParams())
				append(", ");
		}
		append(")");

		if (func->begin() != func->end())
		{
			begin_scope();
			for (auto *bb : *func)
				append(bb, true);
			end_scope();
		}
	}
	else
		append("@", func->getName());

	return *this;
}

static const char *to_string(BinaryOperation op)
{
	switch (op)
	{
#define BINOP(op, str) case BinaryOperation::op: return str
	BINOP(Invalid, "invalid");
	BINOP(Add, "add");
	BINOP(FAdd, "fadd");
	BINOP(Sub, "sub");
	BINOP(FSub, "fsub");
	BINOP(Mul, "mul");
	BINOP(FMul, "fmul");
	BINOP(UDiv, "udiv");
	BINOP(SDiv, "sdiv");
	BINOP(FDiv, "fdiv");
	BINOP(URem, "urem");
	BINOP(SRem, "srem");
	BINOP(FRem, "frem");
	BINOP(Shl, "shl");
	BINOP(LShr, "lshr");
	BINOP(AShr, "ashr");
	BINOP(And, "and");
	BINOP(Or, "or");
	BINOP(Xor, "xor");
	}
#undef BINOP
	assert(0);
}

static const char *to_string(UnaryOperation op)
{
	switch (op)
	{
	case UnaryOperation::FNeg:
		return "fneg";
	default:
		return "invalid";
	}
}

static const char *to_string(Instruction::Predicate pred)
{
	switch (pred)
	{
#define PRED(op, str) case Instruction::FCMP_##op: return str
	PRED(FALSE, "false");
	PRED(OEQ, "oeq");
	PRED(OGT, "ogt");
	PRED(OGE, "oge");
	PRED(OLT, "olt");
	PRED(OLE, "ole");
	PRED(ONE, "one");
	PRED(ORD, "ord");
	PRED(UNO, "uno");
	PRED(UEQ, "ueq");
	PRED(UGT, "ugt");
	PRED(UGE, "uge");
	PRED(ULT, "ult");
	PRED(ULE, "ule");
	PRED(UNE, "une");
	PRED(TRUE, "true");
#undef PRED
#define PRED(op, str) case Instruction::ICMP_##op: return str
	PRED(EQ, "eq");
	PRED(NE, "ne");
	PRED(UGT, "ugt");
	PRED(UGE, "uge");
	PRED(ULT, "ult");
	PRED(ULE, "ule");
	PRED(SGT, "sgt");
	PRED(SGE, "sge");
	PRED(SLT, "slt");
	PRED(SLE, "sle");
	}
#undef PRED
	assert(0);
}

static const char *to_string(Instruction::CastOps op)
{
	switch (op)
	{
#define CAST(op, str) case Instruction::op: return str
	CAST(Trunc, "trunc");
	CAST(ZExt, "zext");
	CAST(SExt, "sext");
	CAST(FPToUI, "fptoui");
	CAST(FPToSI, "fptosi");
	CAST(UIToFP, "uitofp");
	CAST(SIToFP, "sitofp");
	CAST(FPTrunc, "fptrunc");
	CAST(FPExt, "fpext");
	CAST(PtrToInt, "ptrtoint");
	CAST(IntToPtr, "inttoptr");
	CAST(BitCast, "bitcast");
	CAST(AddrSpaceCast, "addrspacecast");
	}
#undef CAST
	assert(0);
}

StreamState &StreamState::append(BinaryOperator *binop, bool decl)
{
	if (decl)
	{
		append("%", binop->get_tween_id(), " = ", to_string(binop->getOpcode()), " ", binop->getType(),
		       " ", binop->getOperand(0), ", ", binop->getOperand(1));
	}
	else
	{
		append("%", binop->get_tween_id());
	}

	return *this;
}

StreamState &StreamState::append(UnaryOperator *uop, bool decl)
{
	if (decl)
	{
		append("%", uop->get_tween_id(), " = ", to_string(uop->getOpcode()), " ", uop->getType(),
		       " ", uop->getOperand(0), ", ", uop->getOperand(1));
	}
	else
	{
		append("%", uop->get_tween_id());
	}

	return *this;
}

StreamState &StreamState::append(BasicBlock *bb, bool decl)
{
	if (decl)
	{
		newline_noindent();
		newline_noindent();
		append(bb->get_tween_id(), ":");
		for (auto *inst : *bb)
		{
			newline();
			append(inst);
		}
	}
	else
	{
		append("label %", bb->get_tween_id());
	}
	return *this;
}

StreamState &StreamState::append(FCmpInst *value, bool decl)
{
	if (decl)
	{
		append("%", value->get_tween_id(), " = fcmp ", to_string(value->getPredicate()),
		       " ", value->getOperand(0), ", ", value->getOperand(1));
	}
	else
	{
		append("%", value->get_tween_id());
	}
	return *this;
}

StreamState &StreamState::append(ICmpInst *value, bool decl)
{
	if (decl)
	{
		append("%", value->get_tween_id(), " = icmp ", to_string(value->getPredicate()),
		       " ", value->getOperand(0), ", ", value->getOperand(1));
	}
	else
	{
		append("%", value->get_tween_id());
	}
	return *this;
}

StreamState &StreamState::append(BranchInst *br, bool)
{
	append("br ");
	if (br->getCondition())
		append(br->getCondition(), ", ", br->getTrueBlock(), ", ", br->getFalseBlock());
	else
		append(br->getTrueBlock());
	return *this;
}

StreamState &StreamState::append(CallInst *call, bool decl)
{
	if (decl)
	{
		append("%", call->get_tween_id(), " = ", "call ", call->getType(), " @", call->getCalledFunction()->getName(), "(");
		for (unsigned i = 0; i < call->getNumOperands(); i++)
		{
			append(call->getOperand(i));
			if (i + 1 < call->getNumOperands())
				append(", ");
		}
		append(")");
	}
	else
	{
		append("%", call->get_tween_id());
	}

	return *this;
}

StreamState &StreamState::append(CastInst *cast, bool decl)
{
	if (decl)
	{
		append("%", cast->get_tween_id(), " = ", to_string(cast->getOpcode()), " ", cast->getOperand(0), " to ", cast->getType());
	}
	else
	{
		append("%", cast->get_tween_id());
	}

	return *this;
}

StreamState &StreamState::append(PHINode *phi, bool decl)
{
	if (decl)
	{
		append("%", phi->get_tween_id(), " = phi ", phi->getType(), " ");
		unsigned count = phi->getNumIncomingValues();
		for (unsigned i = 0; i < count; i++)
		{
			Value *value = phi->getIncomingValue(i);
			BasicBlock *bb = phi->getIncomingBlock(i);
			append("[ ", value, ", ", bb, " ]");
			if (i + 1 < count)
				append(", ");
		}
	}
	else
	{
		append("%", phi->get_tween_id());
	}
	return *this;
}

StreamState &StreamState::append(ReturnInst *value, bool)
{
	return append("ret");
}

StreamState &StreamState::append(UndefValue *undef, bool decl)
{
	return append(undef->getType(), " undef");
}

StreamState &StreamState::append(ConstantFP *value, bool decl)
{
	return append(value->get_double());
}

StreamState &StreamState::append(ConstantInt *value, bool decl)
{
	return append(value->getType(), " ", value->get_sext());
}

StreamState &StreamState::append(Instruction *inst)
{
	return append(static_cast<Value *>(inst), true);
}

StreamState &StreamState::append(Value *value, bool decl)
{
	switch (value->get_value_kind())
	{
	case ValueKind::Function:
		return append(cast<Function>(value), decl);
	case ValueKind::BinaryOperator:
		return append(cast<BinaryOperator>(value), decl);
	case ValueKind::UnaryOperator:
		return append(cast<UnaryOperator>(value), decl);
	case ValueKind::Call:
		return append(cast<CallInst>(value), decl);
	case ValueKind::Branch:
		return append(cast<BranchInst>(value), decl);
	case ValueKind::FCmp:
		return append(cast<FCmpInst>(value), decl);
	case ValueKind::ICmp:
		return append(cast<ICmpInst>(value), decl);
	case ValueKind::Return:
		return append(cast<ReturnInst>(value), decl);
	case ValueKind::Undef:
		return append(cast<UndefValue>(value), decl);
	case ValueKind::ConstantInt:
		return append(cast<ConstantInt>(value), decl);
	case ValueKind::ConstantFP:
		return append(cast<ConstantFP>(value), decl);
	case ValueKind::BasicBlock:
		return append(cast<BasicBlock>(value), decl);
	case ValueKind::PHI:
		return append(cast<PHINode>(value), decl);
	case ValueKind::Cast:
		return append(cast<CastInst>(value), decl);
	}

	LOGE("Unknown ValueKind %u.\n", unsigned(value->get_value_kind()));

	if (decl)
		return append("%", value->get_tween_id(), " = unimplemented");
	else
		return append("%", value->get_tween_id());
}

std::string disassemble(Module &module)
{
	StreamState state;
	for (auto *func : module)
		state.append(func, true);
	return state.stream.str();
}
}
