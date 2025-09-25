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

#include "instruction.hpp"
#include "cast.hpp"
#include <assert.h>

namespace LLVMBC
{
Instruction::Instruction(Type *type, ValueKind kind)
    : Value(type, kind)
{
}

void Instruction::set_operands(Vector<Value *> op)
{
	operands = std::move(op);
}

unsigned Instruction::getNumOperands() const
{
	return operands.size();
}

Value *Instruction::getOperand(unsigned index) const
{
	if (index >= operands.size())
	{
		LOGE("Operand index is out of range.\n");
		return nullptr;
	}

	return Internal::resolve_proxy(operands[index]);
}

bool Instruction::isTerminator() const
{
	return is_terminator;
}

void Instruction::set_terminator()
{
	is_terminator = true;
}

bool Instruction::resolve_proxy_values()
{
	for (auto &op : operands)
		while (op && op->get_value_kind() == ValueKind::Proxy)
			op = cast<ValueProxy>(op)->get_proxy_value();

	if (get_value_kind() == ValueKind::PHI)
	{
		auto *phi = cast<PHINode>(this);
		if (!phi->resolve_proxy_values_incoming())
			return false;
	}
	return true;
}

void Instruction::setMetadata(const String &str, MDNode *node)
{
	attachments[str] = node;
}

UnorderedMap<String, MDNode *>::const_iterator Instruction::metadata_begin() const
{
	return attachments.begin();
}

UnorderedMap<String, MDNode *>::const_iterator Instruction::metadata_end() const
{
	return attachments.end();
}

bool Instruction::hasMetadata(const String &str) const
{
	return attachments.find(str) != attachments.end();
}

MDNode *Instruction::getMetadata(const String &str) const
{
	auto itr = attachments.find(str);
	if (itr != attachments.end())
		return itr->second;
	else
		return nullptr;
}

bool Instruction::is_base_of_value_kind(ValueKind kind)
{
	switch (kind)
	{
	case ValueKind::Return:
	case ValueKind::Unreachable:
	case ValueKind::Call:
	case ValueKind::UnaryOperator:
	case ValueKind::BinaryOperator:
	case ValueKind::Cast:
	case ValueKind::Select:
	case ValueKind::ExtractValue:
	case ValueKind::Alloca:
	case ValueKind::GetElementPtr:
	case ValueKind::Load:
	case ValueKind::Store:
	case ValueKind::CompareBase:
	case ValueKind::FCmp:
	case ValueKind::ICmp:
	case ValueKind::Branch:
	case ValueKind::Switch:
	case ValueKind::PHI:
	case ValueKind::AtomicRMW:
	case ValueKind::AtomicCmpXchg:
	case ValueKind::ShuffleVector:
	case ValueKind::ExtractElement:
	case ValueKind::InsertElement:
		return true;

	default:
		break;
	}

	return false;
}

BinaryOperator::BinaryOperator(Value *LHS, Value *RHS, BinaryOps op_)
    : Instruction(LHS->getType(), ValueKind::BinaryOperator)
    , op(op_)
{
	set_operands({ LHS, RHS });
}

BinaryOperator::BinaryOps BinaryOperator::getOpcode() const
{
	return op;
}

bool BinaryOperator::isFast() const
{
	return fast_math;
}

void BinaryOperator::setFast(bool enabled)
{
	fast_math = enabled;
}

UnaryOperator::UnaryOperator(UnaryOps uop, Value *value)
    : Instruction(value->getType(), ValueKind::UnaryOperator), op(uop)
{
	set_operands({ value });
}

UnaryOperator::UnaryOps UnaryOperator::getOpcode() const
{
	return op;
}

ReturnInst::ReturnInst(Value *value_)
    : Instruction(value_ ? value_->getType() : nullptr, ValueKind::Return)
    , value(value_)
{
	set_terminator();
}

UnreachableInst::UnreachableInst()
	: Instruction(nullptr, ValueKind::Unreachable)
{
	set_terminator();
}

CallInst::CallInst(FunctionType *function_type_, Function *callee_, Vector<Value *> params)
    : Instruction(function_type_->getReturnType(), ValueKind::Call)
    , callee(callee_)
{
	set_operands(std::move(params));
}

Function *CallInst::getCalledFunction() const
{
	return callee;
}

Value *ReturnInst::getReturnValue() const
{
	return Internal::resolve_proxy(value);
}

CmpInst::CmpInst(ValueKind kind, Predicate pred_, Value *LHS, Value *RHS)
    : Instruction(Type::getInt1Ty(LHS->getType()->getContext()), kind)
    , pred(pred_)
{
	set_operands({ LHS, RHS });
}

CastInst::CastInst(Type *type, Value *value, Instruction::CastOps op_)
    : Instruction(type, ValueKind::Cast)
    , op(op_)
{
	set_operands({ value });
}

SelectInst::SelectInst(Value *true_value, Value *false_value, Value *cond)
    : Instruction(true_value->getType(), ValueKind::Select)
{
	set_operands({ cond, true_value, false_value });
}

ExtractValueInst::ExtractValueInst(Type *type, Value *aggregate, Vector<unsigned> indices_)
    : Instruction(type, ValueKind::ExtractValue)
    , indices(std::move(indices_))
{
	set_operands({ aggregate });
}

Value *ExtractValueInst::getAggregateOperand() const
{
	return Internal::resolve_proxy(operands[0]);
}

unsigned ExtractValueInst::getNumIndices() const
{
	return indices.size();
}

const unsigned *ExtractValueInst::getIndices() const
{
	return indices.data();
}

Instruction::CastOps CastInst::getOpcode() const
{
	return op;
}

Instruction::Predicate CmpInst::getPredicate() const
{
	return pred;
}

bool CmpInst::is_base_of_value_kind(ValueKind kind)
{
	return kind == ValueKind::ICmp || kind == ValueKind::FCmp;
}

FCmpInst::FCmpInst(Predicate pred_, Value *LHS, Value *RHS)
    : CmpInst(ValueKind::FCmp, pred_, LHS, RHS)
{
	set_operands({ LHS, RHS });
}

ICmpInst::ICmpInst(Predicate pred_, Value *LHS, Value *RHS)
    : CmpInst(ValueKind::ICmp, pred_, LHS, RHS)
{
	set_operands({ LHS, RHS });
}

BranchInst::BranchInst(BasicBlock *true_block, BasicBlock *false_block, Value *cond_)
    : Instruction(nullptr, ValueKind::Branch)
    , cond(cond_)
{
	set_terminator();
	num_blocks = 2;
	bbs[0] = true_block;
	bbs[1] = false_block;
}

BranchInst::BranchInst(BasicBlock *true_block)
    : Instruction(nullptr, ValueKind::Branch)
{
	set_terminator();
	num_blocks = 1;
	bbs[0] = true_block;
}

bool BranchInst::isConditional() const
{
	return cond != nullptr;
}

Value *BranchInst::getCondition() const
{
	return Internal::resolve_proxy(cond);
}

BasicBlock *BranchInst::getSuccessor(unsigned index) const
{
	assert(index < num_blocks);
	return bbs[index];
}

unsigned BranchInst::getNumSuccessors() const
{
	return num_blocks;
}

SwitchInst::SwitchInst(Value *cond_, BasicBlock *default_block_, unsigned num_cases)
    : Instruction(Type::getVoidTy(cond_->getType()->getContext()), ValueKind::Switch)
    , cond(cond_)
    , default_block(default_block_)
{
	set_terminator();
	cases.reserve(num_cases);
}

void SwitchInst::addCase(Value *case_value, BasicBlock *bb)
{
	cases.push_back({ case_value, bb });
}

Vector<SwitchInst::Case>::const_iterator SwitchInst::case_begin() const
{
	return cases.begin();
}

Vector<SwitchInst::Case>::const_iterator SwitchInst::case_end() const
{
	return cases.end();
}

BasicBlock *SwitchInst::getDefaultDest() const
{
	return default_block;
}

Value *SwitchInst::getCondition() const
{
	return Internal::resolve_proxy(cond);
}

ConstantInt *SwitchInst::Case::getCaseValue() const
{
	return cast<ConstantInt>(value);
}

BasicBlock *SwitchInst::Case::getCaseSuccessor() const
{
	return bb;
}

PHINode::PHINode(Type *type, size_t num_edges)
    : Instruction(type, ValueKind::PHI)
{
	incoming.reserve(num_edges);
}

void PHINode::add_incoming(Value *value, BasicBlock *bb)
{
	incoming.push_back({ value, bb });
}

unsigned PHINode::getNumIncomingValues() const
{
	return unsigned(incoming.size());
}

AllocaInst::AllocaInst(Type *pointer_type, Type *element_type_, Value *size)
    : Instruction(pointer_type, ValueKind::Alloca)
    , array_size(size)
{
}

Value *AllocaInst::getArraySize() const
{
	return Internal::resolve_proxy(array_size);
}

GetElementPtrInst::GetElementPtrInst(Type *pointer_type, Vector<Value *> indices, bool inbounds_)
    : Instruction(pointer_type, ValueKind::GetElementPtr)
    , inbounds(inbounds_)
{
	set_operands(std::move(indices));
}

bool GetElementPtrInst::isInBounds() const
{
	return inbounds;
}

LoadInst::LoadInst(Type *type, Value *ptr)
    : Instruction(type, ValueKind::Load)
{
	set_operands({ ptr });
}

Value *LoadInst::getPointerOperand() const
{
	return getOperand(0);
}

StoreInst::StoreInst(Value *ptr, Value *value)
    : Instruction(Type::getVoidTy(ptr->getType()->getContext()), ValueKind::Store)
{
	set_operands({ value, ptr });
}

BasicBlock *PHINode::getIncomingBlock(unsigned index) const
{
	if (index >= incoming.size())
		return nullptr;
	return incoming[index].bb;
}

Value *PHINode::getIncomingValue(unsigned index) const
{
	if (index >= incoming.size())
		return nullptr;
	return Internal::resolve_proxy(incoming[index].value);
}

bool PHINode::resolve_proxy_values_incoming()
{
	for (auto &node : incoming)
	{
		while (node.value && node.value->get_value_kind() == ValueKind::Proxy)
		{
			node.value = cast<ValueProxy>(node.value)->get_proxy_value();
			if (!node.value)
				return false;
		}
	}
	return true;
}

AtomicRMWInst::AtomicRMWInst(Type *type, Value *ptr_, Value *value_, BinOp op_)
    : Instruction(type, ValueKind::AtomicRMW)
    , ptr(ptr_)
    , value(value_)
    , op(op_)
{
	set_operands({ ptr, value });
}

Value *AtomicRMWInst::getPointerOperand() const
{
	return Internal::resolve_proxy(ptr);
}

Value *AtomicRMWInst::getValOperand() const
{
	return Internal::resolve_proxy(value);
}

AtomicRMWInst::BinOp AtomicRMWInst::getOperation() const
{
	return op;
}

AtomicCmpXchgInst::AtomicCmpXchgInst(Value *ptr_, Value *cmp_, Value *new_value_, Type *type_override)
	: Instruction(type_override ?
	              type_override :
	              StructType::get(new_value_->getType()->getContext(),
	                              { new_value_->getType(), Type::getInt1Ty(new_value_->getType()->getContext()) }),
	              ValueKind::AtomicCmpXchg)
	, ptr(ptr_)
	, new_value(new_value_)
	, cmp_value(cmp_)
{
	set_operands({ ptr, new_value, cmp_value });
}

Value *AtomicCmpXchgInst::getPointerOperand() const
{
	return Internal::resolve_proxy(ptr);
}

Value *AtomicCmpXchgInst::getCompareOperand() const
{
	return Internal::resolve_proxy(cmp_value);
}

Value *AtomicCmpXchgInst::getNewValOperand() const
{
	return Internal::resolve_proxy(new_value);
}

ShuffleVectorInst::ShuffleVectorInst(Type *type, Value *a, Value *b, Value *shuf)
	: Instruction(type, ValueKind::ShuffleVector)
{
	set_operands({ a, b });
	auto *masks = cast<ConstantDataVector>(shuf);
	shuffle_mask.reserve(masks->getNumElements());
	for (unsigned i = 0; i < masks->getNumElements(); i++)
		shuffle_mask.push_back(cast<ConstantInt>(masks->getElementAsConstant(i))->getUniqueInteger().getSExtValue());
}

int ShuffleVectorInst::getMaskValue(unsigned index) const
{
	assert(index < shuffle_mask.size());
	return shuffle_mask[index];
}

ExtractElementInst::ExtractElementInst(Value *vec_, Value *index_)
	: Instruction(cast<VectorType>(vec_->getType())->getElementType(), ValueKind::ExtractElement),
	  vec(vec_), index(index_)
{
	set_operands({ vec, index });
}

Value *ExtractElementInst::getVectorOperand() const
{
	return Internal::resolve_proxy(vec);
}

Value *ExtractElementInst::getIndexOperand() const
{
	return Internal::resolve_proxy(index);
}

InsertElementInst::InsertElementInst(Value *vec, Value *value, Value *index)
	: Instruction(vec->getType(), ValueKind::InsertElement)
{
	set_operands({ vec, value, index });
}

CompositeConstructInst::CompositeConstructInst(Type *type, Vector<Value *> constituents)
	: Instruction(type, ValueKind::CompositeConstruct)
{
	set_operands(std::move(constituents));
}
} // namespace LLVMBC
