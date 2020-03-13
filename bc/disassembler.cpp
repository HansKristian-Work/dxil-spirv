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
#include "metadata.hpp"
#include <sstream>
#include <type_traits>
#include <assert.h>

namespace LLVMBC
{
struct StreamState
{
	std::ostringstream stream;
	unsigned indent = 0;

	void append(Type *type);
	void append(IntegerType *type);
	void append(PointerType *type);
	void append(ArrayType *type);
	void append(StructType *type);
	void append(FunctionType *type);
	void append(VectorType *type);

	void append(const std::string &str);
	void append(Value *value, bool decl = false);
	void append(GlobalVariable *value, bool decl = false);
	void append(Instruction *value);
	void append(Function *value, bool decl = false);
	void append(BinaryOperator *value, bool decl = false);
	void append(UnaryOperator *uop, bool decl = false);
	void append(CallInst *value, bool decl = false);
	void append(BranchInst *value, bool decl = false);
	void append(SwitchInst *branch, bool decl = false);
	void append(ReturnInst *value, bool decl = false);
	void append(UndefValue *value, bool decl = false);
	void append(Constant *value, bool decl = false);
	void append(ConstantInt *value, bool decl = false);
	void append(ConstantFP *value, bool decl = false);
	void append(BasicBlock *bb, bool decl = false);
	void append(FCmpInst *value, bool decl = false);
	void append(ICmpInst *value, bool decl = false);
	void append(PHINode *value, bool decl = false);
	void append(CastInst *value, bool decl = false);
	void append(SelectInst *value, bool decl = false);
	void append(ExtractValueInst *value, bool decl = false);
	void append(AllocaInst *value, bool decl = false);
	void append(GetElementPtrInst *value, bool decl = false);
	void append(LoadInst *value, bool decl = false);
	void append(StoreInst *value, bool decl = false);
	void append(AtomicRMWInst *value, bool decl = false);
	void append(AtomicCmpXchgInst *xchg, bool decl = false);
	void append(ConstantAggregateZero *zero, bool decl = false);
	void append(ConstantDataArray *data, bool decl = false);

	void append(MDOperand *md);
	void append(NamedMDNode *md);
	void append(MDNode *md, bool decl = false);

	void append(float v);
	void append(double v);
	void append(bool v);
	void append(const char *str);

	void newline();
	void newline_noindent();
	void begin_scope();
	void end_scope();

	template <typename T, typename... Ts>
	void append(T &&t, Ts &&... ts)
	{
		append(std::forward<T>(t));
		append(std::forward<Ts>(ts)...);
	}

	// Only want this overload to trigger on various integer types.
	template <typename T>
	typename std::enable_if<std::is_integral<T>::value, void>::type append(T value)
	{
		stream << value;
	}

	// Need this to avoid the generic template to be deduced.
	template <size_t N>
	void append(char (&str)[N])
	{
		return append(static_cast<const char *>(str));
	}
};

void StreamState::append(IntegerType *type)
{
	append("i", type->getBitWidth());
}

void StreamState::append(StructType *type)
{
	append("{ ");
	for (unsigned i = 0; i < type->getNumElements(); i++)
	{
		append(type->getElementType(i));
		if (i + 1 < type->getNumElements())
			append(", ");
	}
	append(" }");
}

void StreamState::append(PointerType *type)
{
	if (type->getAddressSpace() != 0)
		append(type->getElementType(), " addrspace(", type->getAddressSpace(), ")*");
	else
		append(type->getElementType(), "*");
}

void StreamState::append(ArrayType *type)
{
	append("[", type->getArrayNumElements(), " x ", type->getArrayElementType(), "]");
}

void StreamState::append(FunctionType *type)
{
	append("(", type->getReturnType(), " (*) (");
	for (unsigned i = 0; i < type->getNumParams(); i++)
	{
		append(type->getParamType(i));
		if (i + 1 < type->getNumParams())
			append(", ");
	}
	append("))");
}

void StreamState::append(VectorType *type)
{
	append(type->getElementType(), "x", type->getVectorSize());
}

void StreamState::append(bool v)
{
	stream << (v ? "true" : "false");
}

void StreamState::append(float v)
{
	char buf[1024];
	sprintf(buf, "%e", v);
	append(buf);
}

void StreamState::append(double v)
{
	char buf[1024];
	sprintf(buf, "%e", v);
	append(buf);
}

void StreamState::newline()
{
	stream << "\n";
	for (unsigned i = 0; i < indent; i++)
		stream << "  ";
}

void StreamState::newline_noindent()
{
	stream << "\n";
}

void StreamState::append(const char *str)
{
	stream << str;
}

void StreamState::append(const std::string &str)
{
	stream << str;
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

void StreamState::append(Type *type)
{
	switch (type->getTypeID())
	{
	case Type::TypeID::IntegerTyID:
		return append(cast<IntegerType>(type));
	case Type::TypeID::PointerTyID:
		return append(cast<PointerType>(type));
	case Type::TypeID::StructTyID:
		return append(cast<StructType>(type));
	case Type::TypeID::ArrayTyID:
		return append(cast<ArrayType>(type));
	case Type::TypeID::FunctionTyID:
		return append(cast<FunctionType>(type));
	case Type::TypeID::VectorTyID:
		return append(cast<VectorType>(type));
	case Type::TypeID::HalfTyID:
		return append("half");
	case Type::TypeID::FloatTyID:
		return append("float");
	case Type::TypeID::DoubleTyID:
		return append("double");
	case Type::TypeID::Unknown:
		return append("unknown");
	case Type::TypeID::VoidTyID:
		return append("void");
	default:
		break;
	}

	LOGE("Unknown Type %u.\n", unsigned(type->getTypeID()));
}

void StreamState::append(Function *func, bool decl)
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
}

void StreamState::append(GlobalVariable *var, bool decl)
{
	if (decl)
	{
		append("@", var->get_tween_id(), " = ");

		if (cast<PointerType>(var->getType())->getAddressSpace() != 0)
			append("groupshared ");
		else
			append(var->isConstant() ? "constant" : "global", " ");
		append(var->getType()->getPointerElementType());

		if (var->hasInitializer())
			append(" ", var->getInitializer());
		newline();
	}
	else
	{
		append("@", var->get_tween_id());
	}
}

static const char *to_string(BinaryOperator::BinaryOps op)
{
	switch (op)
	{
#define BINOP(op, str) case BinaryOperator::BinaryOps::op: return str
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

static const char *to_string(UnaryOperator::UnaryOps op)
{
	switch (op)
	{
	case UnaryOperator::UnaryOps::FNeg:
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

static const char *to_string(AtomicRMWInst::BinOp op)
{
	switch (op)
	{
#define RMW(op, str) case AtomicRMWInst::BinOp::op: return str
	RMW(Add, "add");
	RMW(Sub, "sub");
	RMW(Xchg, "xchg");
	RMW(And, "and");
	RMW(Xor, "xor");
	RMW(Or, "or");
	RMW(Nand, "nand");
	RMW(Max, "max");
	RMW(Min, "min");
	RMW(UMax, "umax");
	RMW(UMin, "umin");
	RMW(FAdd, "fadd");
	RMW(FSub, "fsub");
	}
#undef RMW
	assert(0);
}

void StreamState::append(BinaryOperator *binop, bool decl)
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
}

void StreamState::append(UnaryOperator *uop, bool decl)
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
}

void StreamState::append(BasicBlock *bb, bool decl)
{
	if (decl)
	{
		newline_noindent();
		newline_noindent();
		append(bb->get_tween_id(), ":");
		for (auto &inst : *bb)
		{
			newline();
			append(&inst);
		}
	}
	else
	{
		append("label %", bb->get_tween_id());
	}
}

void StreamState::append(FCmpInst *value, bool decl)
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
}

void StreamState::append(ICmpInst *value, bool decl)
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
}

void StreamState::append(BranchInst *br, bool)
{
	append("br ");
	if (br->getCondition())
		append(br->getCondition(), ", ", br->getSuccessor(0), ", ", br->getSuccessor(1));
	else
		append(br->getSuccessor(0));
}

void StreamState::append(SwitchInst *branch, bool)
{
	append("switch ", branch->getCondition(), ", ", branch->getDefaultDest());
	begin_scope();
	for (auto itr = branch->case_begin(); itr != branch->case_end(); ++itr)
	{
		newline();
		append(itr->getCaseValue(), ", ", itr->getCaseSuccessor());
	}
	end_scope();
}

void StreamState::append(CallInst *call, bool decl)
{
	if (decl)
	{
		if (call->getType()->getTypeID() != Type::TypeID::VoidTyID)
			append("%", call->get_tween_id(), " = ");
		append("call ", call->getType(), " @", call->getCalledFunction()->getName(), "(");
		for (unsigned i = 0; i < call->getNumOperands(); i++)
		{
			append(call->getOperand(i));
			if (i + 1 < call->getNumOperands())
				append(", ");
		}
		append(")");

		for (auto itr = call->metadata_begin(); itr != call->metadata_end(); ++itr)
		{
			append(" !", itr->first, " ", itr->second);
		}
	}
	else
	{
		append("%", call->get_tween_id());
	}
}

void StreamState::append(CastInst *cast, bool decl)
{
	if (decl)
	{
		append("%", cast->get_tween_id(), " = ", to_string(cast->getOpcode()), " ", cast->getOperand(0), " to ", cast->getType());
	}
	else
	{
		append("%", cast->get_tween_id());
	}
}

void StreamState::append(SelectInst *cast, bool decl)
{
	if (decl)
	{
		append("%", cast->get_tween_id(), " = ", "select ",
		       cast->getOperand(0), ", ",
		       cast->getOperand(1), ", ",
		       cast->getOperand(2));
	}
	else
	{
		append("%", cast->get_tween_id());
	}
}

void StreamState::append(ExtractValueInst *ext, bool decl)
{
	if (decl)
	{
		append("%", ext->get_tween_id(), " = ", "extractvalue ",
		       ext->getType(), " ", ext->getAggregateOperand());
		for (unsigned i = 0; i < ext->getNumIndices(); i++)
		{
			append(", ");
			append(ext->getIndices()[i]);
		}
	}
	else
	{
		append("%", ext->get_tween_id());
	}
}

void StreamState::append(AllocaInst *alloca, bool decl)
{
	if (decl)
	{
		append("%", alloca->get_tween_id(), " = alloca ", cast<PointerType>(alloca->getType())->getElementType());
	}
	else
	{
		append("%", alloca->get_tween_id());
	}
}

void StreamState::append(GetElementPtrInst *ptr, bool decl)
{
	if (decl)
	{
		append("%", ptr->get_tween_id(), " = getelementptr ", ptr->isInBounds() ? "inbounds " : "", ptr->getType());
		for (unsigned i = 0; i < ptr->getNumOperands(); i++)
		{
			append(", ");
			append(ptr->getOperand(i));
		}
	}
	else
	{
		append("%", ptr->get_tween_id());
	}
}

void StreamState::append(LoadInst *ptr, bool decl)
{
	if (decl)
		append("%", ptr->get_tween_id(), " = load ", ptr->getType(), " ", ptr->getPointerOperand());
	else
		append("%", ptr->get_tween_id());
}

void StreamState::append(StoreInst *ptr, bool decl)
{
	if (decl)
		append("store ", ptr->getOperand(0), ", ", ptr->getOperand(1));
	else
		append("%", ptr->get_tween_id());
}

void StreamState::append(AtomicRMWInst *atomic_op, bool decl)
{
	if (decl)
	{
		append("%", atomic_op->get_tween_id(), " = atomicrmw ", to_string(atomic_op->getOperation()), " ",
		       atomic_op->getType(), " ",
		       atomic_op->getPointerOperand(), ", ", atomic_op->getValOperand());
	}
	else
		append("%", atomic_op->get_tween_id());
}

void StreamState::append(AtomicCmpXchgInst *xchg, bool decl)
{
	if (decl)
	{
		append("%", xchg->get_tween_id(), " = cmpxchg ", xchg->getType(), " ",
		       xchg->getPointerOperand(), ", ", xchg->getCompareOperand(), ", ", xchg->getNewValOperand());
	}
	else
		append("%", xchg->get_tween_id());
}

void StreamState::append(ConstantAggregateZero *zero, bool)
{
	append("[zeroinitialized]");
}

void StreamState::append(ConstantDataArray *arr, bool)
{
	append("[");
	for (unsigned i = 0; i < arr->getNumElements(); i++)
	{
		append(arr->getElementAsConstant(i));
		if (i + 1 < arr->getNumElements())
			append(", ");
	}
	append("]");
}

void StreamState::append(PHINode *phi, bool decl)
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
}

void StreamState::append(ReturnInst *value, bool)
{
	if (value->getReturnValue())
		append("ret ", value);
	else
		append("ret void");
}

void StreamState::append(UndefValue *undef, bool decl)
{
	append(undef->getType(), " undef");
}

void StreamState::append(ConstantFP *value, bool decl)
{
	append(value->getValueAPF().convertToDouble());
}

void StreamState::append(ConstantInt *value, bool decl)
{
	append(value->getType(), " ", value->getUniqueInteger().getSExtValue());
}

void StreamState::append(Constant *value, bool decl)
{
	append(static_cast<Value *>(value), decl);
}

void StreamState::append(Instruction *inst)
{
	append(static_cast<Value *>(inst), true);
}

void StreamState::append(MDNode *md, bool decl)
{
	if (md)
	{
		if (decl)
		{
			append("!", md->get_tween_id(), " = !{");
			for (unsigned i = 0; i < md->getNumOperands(); i++)
			{
				append(&md->getOperand(i));
				if (i + 1 < md->getNumOperands())
					append(", ");
			}
			append("}");
		}
		else
			append("!", md->get_tween_id());
	}
	else
		append("null");
}

void StreamState::append(NamedMDNode *md)
{
	append("!", md->getName(), " = !{");
	for (unsigned i = 0; i < md->getNumOperands(); i++)
	{
		append(md->getOperand(i), false);
		if (i + 1 < md->getNumOperands())
			append(", ");
	}

	append("}");
}

void StreamState::append(MDOperand *md)
{
	if (md)
	{
		switch (md->get_metadata_kind())
		{
		case MetadataKind::NamedNode:
			return append(cast<NamedMDNode>(md));
		case MetadataKind::Node:
			return append(cast<MDNode>(md), false);
		case MetadataKind::Constant:
			return append(cast<ConstantAsMetadata>(md)->getValue());
		case MetadataKind::String:
			return append("\"", cast<MDString>(md)->getString(), "\"");
		case MetadataKind::None:
			return append("null");
		default:
			LOGE("Unknown MetadataKind %u.\n", unsigned(md->get_metadata_kind()));
			break;
		}
	}
	else
		append("null");
}

void StreamState::append(Value *value, bool decl)
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
	case ValueKind::Select:
		return append(cast<SelectInst>(value), decl);
	case ValueKind::ExtractValue:
		return append(cast<ExtractValueInst>(value), decl);
	case ValueKind::Alloca:
		return append(cast<AllocaInst>(value), decl);
	case ValueKind::GetElementPtr:
		return append(cast<GetElementPtrInst>(value), decl);
	case ValueKind::Load:
		return append(cast<LoadInst>(value), decl);
	case ValueKind::Store:
		return append(cast<StoreInst>(value), decl);
	case ValueKind::AtomicRMW:
		return append(cast<AtomicRMWInst>(value), decl);
	case ValueKind::AtomicCmpXchg:
		return append(cast<AtomicCmpXchgInst>(value), decl);
	case ValueKind::Global:
		return append(cast<GlobalVariable>(value), decl);
	case ValueKind::ConstantAggregateZero:
		return append(cast<ConstantAggregateZero>(value), decl);
	case ValueKind::ConstantDataArray:
		return append(cast<ConstantDataArray>(value), decl);
	case ValueKind::Switch:
		return append(cast<SwitchInst>(value), decl);
	default:
		break;
	}

	LOGE("Unknown ValueKind %u.\n", unsigned(value->get_value_kind()));

	if (decl)
		append("%", value->get_tween_id(), " = unimplemented");
	else
		append("%", value->get_tween_id());
}

std::string disassemble(Module &module)
{
	StreamState state;

	for (auto itr = module.global_begin(); itr != module.global_end(); ++itr)
		state.append(&*itr, true);

	for (auto *func : module)
	{
		state.newline();
		state.append(func, true);
	}

	state.newline();

	for (auto itr = module.named_metadata_begin(); itr != module.named_metadata_end(); ++itr)
	{
		state.newline();
		state.append(itr->second);
	}

	state.newline();

	for (auto itr = module.unnamed_metadata_begin(); itr != module.unnamed_metadata_end(); ++itr)
	{
		state.newline();
		state.append(*itr, true);
	}

	return state.stream.str();
}
}
