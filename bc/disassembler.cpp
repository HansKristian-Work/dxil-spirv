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
	StreamState &append(Function *value, bool decl = false);
	StreamState &append(BinaryOperator *value, bool decl = false);
	StreamState &append(UnaryOperator *value, bool decl = false);
	StreamState &append(CallInst *value, bool decl = false);
	StreamState &append(ReturnInst *value, bool decl = false);
	StreamState &append(UndefValue *value, bool decl = false);
	StreamState &append(ConstantInt *value, bool decl = false);
	StreamState &append(ConstantFP *value, bool decl = false);

	StreamState &append(float v);
	StreamState &append(double v);
	StreamState &append(bool v);
	StreamState &append(const char *str);

	StreamState &newline();
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
	sprintf(buf, "%.800g", v);
	return append(buf);
}

StreamState &StreamState::append(double v)
{
	char buf[1024];
	sprintf(buf, "%.800g", v);
	return append(buf);
}

StreamState &StreamState::newline()
{
	stream << "\n";
	for (unsigned i = 0; i < indent; i++)
		stream << "  ";
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
			{
				for (auto *inst : *bb)
				{
					newline();
					append(static_cast<Value *>(inst), true);
				}
			}
			end_scope();
		}
	}
	else
		append("@", func->getName());

	return *this;
}

static const char *binop_string(BinaryOperation op)
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

StreamState &StreamState::append(BinaryOperator *binop, bool decl)
{
	if (decl)
	{
		append("%", binop->get_tween_id(), " = ", binop_string(binop->getOpcode()), " ", binop->getType(),
		       " ", binop->getOperand(0), ", ", binop->getOperand(1));
	}
	else
	{
		append(binop->getType(), " %", binop->get_tween_id());
	}

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
		append(call->getType(), " %", call->get_tween_id());
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
	return append(value->getType(), " ", value->get_double());
}

StreamState &StreamState::append(ConstantInt *value, bool decl)
{
	return append(value->getType(), " ", value->get_sext());
}

StreamState &StreamState::append(Value *value, bool decl)
{
	switch (value->get_value_kind())
	{
	case ValueKind::Function:
		return append(cast<Function>(value), decl);
	case ValueKind::BinaryOperator:
		return append(cast<BinaryOperator>(value), decl);
	//case ValueKind::UnaryOperator:
	//	return append(cast<UnaryOperator>(value), decl);
	case ValueKind::Call:
		return append(cast<CallInst>(value), decl);
	case ValueKind::Return:
		return append(cast<ReturnInst>(value), decl);
	case ValueKind::Undef:
		return append(cast<UndefValue>(value), decl);
	case ValueKind::ConstantInt:
		return append(cast<ConstantInt>(value), decl);
	case ValueKind::ConstantFP:
		return append(cast<ConstantFP>(value), decl);
	}

	LOGE("Unknown ValueKind %u.\n", unsigned(value->get_value_kind()));
	return *this;
}

std::string disassemble(Module &module)
{
	StreamState state;
	for (auto *func : module)
		state.append(func, true);
	return state.stream.str();
}
}
