//
// Copyright (C) 2014 LunarG, Inc.
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//    Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//
//    Redistributions in binary form must reproduce the above
//    copyright notice, this list of conditions and the following
//    disclaimer in the documentation and/or other materials provided
//    with the distribution.
//
//    Neither the name of 3Dlabs Inc. Ltd. nor the names of its
//    contributors may be used to endorse or promote products derived
//    from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDERS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

// SPIRV-IR
//
// Simple in-memory representation (IR) of SPIRV.  Just for holding
// Each function's CFG of blocks.  Has this hierarchy:
//  - Module, which is a list of
//    - Function, which is a list of
//      - Block, which is a list of
//        - Instruction
//

#pragma once
#ifndef spvIR_H
#define spvIR_H

#include "spirv.hpp"
#include "thread_local_allocator.hpp"

#include <algorithm>
#include <cassert>
#include <functional>
#include <iostream>
#include <memory>
#include <utility>

namespace spv {

class Block;
class Function;
class Module;

const Id NoResult = 0;
const Id NoType = 0;

const Decoration NoPrecision = DecorationMax;

#ifdef __GNUC__
#   define POTENTIALLY_UNUSED __attribute__((unused))
#else
#   define POTENTIALLY_UNUSED
#endif

POTENTIALLY_UNUSED
const MemorySemanticsMask MemorySemanticsAllMemory =
                (MemorySemanticsMask)(MemorySemanticsSequentiallyConsistentMask |
                                      MemorySemanticsUniformMemoryMask |
                                      MemorySemanticsSubgroupMemoryMask |
                                      MemorySemanticsWorkgroupMemoryMask |
                                      MemorySemanticsCrossWorkgroupMemoryMask |
                                      MemorySemanticsAtomicCounterMemoryMask |
                                      MemorySemanticsImageMemoryMask);

//
// SPIR-V IR instruction.
//

class Instruction {
public:
    Instruction(Id resultId, Id typeId, Op opCode) : resultId(resultId), typeId(typeId), opCode(opCode), block(nullptr) { }
    explicit Instruction(Op opCode) : resultId(NoResult), typeId(NoType), opCode(opCode), block(nullptr) { }
    virtual ~Instruction() {}
    void addIdOperand(Id id) { operands.push_back(id); }
    void addImmediateOperand(unsigned int immediate) { operands.push_back(immediate); }
    void addStringOperand(const char* str)
    {
        unsigned int word;
        char* wordString = (char*)&word;
        char* wordPtr = wordString;
        int charCount = 0;
        char c;
        do {
            c = *(str++);
            *(wordPtr++) = c;
            ++charCount;
            if (charCount == 4) {
                addImmediateOperand(word);
                wordPtr = wordString;
                charCount = 0;
            }
        } while (c != 0);

        // deal with partial last word
        if (charCount > 0) {
            // pad with 0s
            for (; charCount < 4; ++charCount)
                *(wordPtr++) = 0;
            addImmediateOperand(word);
        }
    }
    void setBlock(Block* b) { block = b; }
    Block* getBlock() const { return block; }
    Op getOpCode() const { return opCode; }
    int getNumOperands() const { return (int)operands.size(); }
    Id getResultId() const { return resultId; }
    void setResultId(Id id) { resultId = id; }
    Id getTypeId() const { return typeId; }
    Id getIdOperand(int op) const { return operands[op]; }
    void setIdOperand(int op, spv::Id id) { operands[op] = id; }
    unsigned int getImmediateOperand(int op) const { return operands[op]; }

    // Write out the binary form.
    void dump(dxil_spv::Vector<unsigned int>& out) const
    {
        // Compute the wordCount
        unsigned int wordCount = 1;
        if (typeId)
            ++wordCount;
        if (resultId)
            ++wordCount;
        wordCount += (unsigned int)operands.size();

        // Write out the beginning of the instruction
        out.push_back(((wordCount) << WordCountShift) | opCode);
        if (typeId)
            out.push_back(typeId);
        if (resultId)
            out.push_back(resultId);

        // Write out the operands
        for (int op = 0; op < (int)operands.size(); ++op)
            out.push_back(operands[op]);
    }

    DXIL_SPV_OVERRIDE_NEW_DELETE

protected:
    Instruction(const Instruction&);
    Id resultId;
    Id typeId;
    Op opCode;
    dxil_spv::Vector<Id> operands;
    Block* block;
};

//
// SPIR-V IR block.
//

class Block {
public:
    Block(Id id, Function& parent);
    virtual ~Block()
    {
    }

    Id getId() { return instructions.front()->getResultId(); }

    Function& getParent() const { return parent; }
    void addInstruction(std::unique_ptr<Instruction> inst);
    void addPredecessor(Block* pred) { predecessors.push_back(pred); pred->successors.push_back(this);}
    void addLocalVariable(std::unique_ptr<Instruction> inst) { localVariables.push_back(std::move(inst)); }
    const dxil_spv::Vector<Block*>& getPredecessors() const { return predecessors; }
    const dxil_spv::Vector<Block*>& getSuccessors() const { return successors; }
    const dxil_spv::Vector<std::unique_ptr<Instruction> >& getInstructions() const {
        return instructions;
    }
    void setUnreachable() { unreachable = true; }
    bool isUnreachable() const { return unreachable; }
    // Returns the block's merge instruction, if one exists (otherwise null).
    const Instruction* getMergeInstruction() const {
        if (instructions.size() < 2) return nullptr;
        const Instruction* nextToLast = (instructions.cend() - 2)->get();
        switch (nextToLast->getOpCode()) {
            case OpSelectionMerge:
            case OpLoopMerge:
                return nextToLast;
            default:
                return nullptr;
        }
        return nullptr;
    }

    void rewritePhiIncoming(spv::Id from_id, spv::Id to_id);

    bool isTerminated() const
    {
        switch (instructions.back()->getOpCode()) {
        case OpBranch:
        case OpBranchConditional:
        case OpSwitch:
        case OpKill:
        case OpReturn:
        case OpReturnValue:
        case OpUnreachable:
            return true;
        default:
            return false;
        }
    }

    void dump(dxil_spv::Vector<unsigned int>& out) const
    {
        instructions[0]->dump(out);
        for (int i = 0; i < (int)localVariables.size(); ++i)
            localVariables[i]->dump(out);
        for (int i = 1; i < (int)instructions.size(); ++i)
            instructions[i]->dump(out);
    }

    DXIL_SPV_OVERRIDE_NEW_DELETE

protected:
    Block(const Block&);
    Block& operator=(Block&);

    // To enforce keeping parent and ownership in sync:
    friend Function;

    dxil_spv::Vector<std::unique_ptr<Instruction> > instructions;
    dxil_spv::Vector<Block*> predecessors, successors;
    dxil_spv::Vector<std::unique_ptr<Instruction> > localVariables;
    Function& parent;

    // track whether this block is known to be uncreachable (not necessarily
    // true for all unreachable blocks, but should be set at least
    // for the extraneous ones introduced by the builder).
    bool unreachable;
};

// Traverses the control-flow graph rooted at root in an order suited for
// readable code generation.  Invokes callback at every node in the traversal
// order.
void inReadableOrder(Block* root, std::function<void(Block*)> callback);

//
// SPIR-V IR Function.
//

class Function {
public:
    Function(Id id, Id resultType, Id functionType, Id firstParam, Module& parent);
    virtual ~Function()
    {
        for (int i = 0; i < (int)parameterInstructions.size(); ++i)
            delete parameterInstructions[i];

        for (int i = 0; i < (int)blocks.size(); ++i)
            delete blocks[i];
    }
    Id getId() const { return functionInstruction.getResultId(); }
    Id getParamId(int p) { return parameterInstructions[p]->getResultId(); }

    void addBlock(Block* block) { blocks.push_back(block); }
    void removeBlock(Block* block)
    {
        auto found = find(blocks.begin(), blocks.end(), block);
        assert(found != blocks.end());
        blocks.erase(found);
        delete block;
    }

    Module& getParent() const { return parent; }
    Block* getEntryBlock() const { return blocks.front(); }
    Block* getLastBlock() const { return blocks.back(); }
    const dxil_spv::Vector<Block*>& getBlocks() const { return blocks; }
    void addLocalVariable(std::unique_ptr<Instruction> inst);
    Id getReturnType() const { return functionInstruction.getTypeId(); }

    void moveLocalVariablesFrom(Function* other);

    void setImplicitThis() { implicitThis = true; }
    bool hasImplicitThis() const { return implicitThis; }

    void dump(dxil_spv::Vector<unsigned int>& out) const
    {
        // OpFunction
        functionInstruction.dump(out);

        // OpFunctionParameter
        for (int p = 0; p < (int)parameterInstructions.size(); ++p)
            parameterInstructions[p]->dump(out);

        // Blocks
        inReadableOrder(blocks[0], [&out](const Block* b) { b->dump(out); });
        Instruction end(0, 0, OpFunctionEnd);
        end.dump(out);
    }

    DXIL_SPV_OVERRIDE_NEW_DELETE

protected:
    Function(const Function&);
    Function& operator=(Function&);

    Module& parent;
    Instruction functionInstruction;
    dxil_spv::Vector<Instruction*> parameterInstructions;
    dxil_spv::Vector<Block*> blocks;
    bool implicitThis;  // true if this is a member function expecting to be passed a 'this' as the first argument
};

//
// SPIR-V IR Module.
//

class Module {
public:
    Module() {}
    virtual ~Module()
    {
        // TODO delete things
    }

    void addFunction(Function *fun) { functions.push_back(fun); }

    void mapInstruction(Instruction *instruction)
    {
        spv::Id resultId = instruction->getResultId();
        // map the instruction's result id
        if (resultId >= idToInstruction.size())
            idToInstruction.resize(resultId + 16);
        idToInstruction[resultId] = instruction;
    }

    Instruction* getInstruction(Id id) const { return idToInstruction[id]; }
    const dxil_spv::Vector<Function*>& getFunctions() const { return functions; }
    spv::Id getTypeId(Id resultId) const { return idToInstruction[resultId]->getTypeId(); }
    StorageClass getStorageClass(Id typeId) const
    {
        assert(idToInstruction[typeId]->getOpCode() == spv::OpTypePointer);
        return (StorageClass)idToInstruction[typeId]->getImmediateOperand(0);
    }

    void dump(dxil_spv::Vector<unsigned int>& out) const
    {
        for (int f = 0; f < (int)functions.size(); ++f)
            functions[f]->dump(out);
    }

    DXIL_SPV_OVERRIDE_NEW_DELETE

protected:
    Module(const Module&);
    dxil_spv::Vector<Function*> functions;

    // map from result id to instruction having that result id
    dxil_spv::Vector<Instruction*> idToInstruction;

    // map from a result id to its type id
};

//
// Implementation (it's here due to circular type definitions).
//

// Add both
// - the OpFunction instruction
// - all the OpFunctionParameter instructions
__inline Function::Function(Id id, Id resultType, Id functionType, Id firstParamId, Module& parent)
    : parent(parent), functionInstruction(id, resultType, OpFunction), implicitThis(false)
{
    // OpFunction
    functionInstruction.addImmediateOperand(FunctionControlMaskNone);
    functionInstruction.addIdOperand(functionType);
    parent.mapInstruction(&functionInstruction);
    parent.addFunction(this);

    // OpFunctionParameter
    Instruction* typeInst = parent.getInstruction(functionType);
    int numParams = typeInst->getNumOperands() - 1;
    for (int p = 0; p < numParams; ++p) {
        Instruction* param = new Instruction(firstParamId + p, typeInst->getIdOperand(p + 1), OpFunctionParameter);
        parent.mapInstruction(param);
        parameterInstructions.push_back(param);
    }
}

__inline void Function::moveLocalVariablesFrom(Function* other)
{
    blocks[0]->localVariables.clear();
    std::swap(blocks[0]->localVariables, other->blocks[0]->localVariables);
}

__inline void Function::addLocalVariable(std::unique_ptr<Instruction> inst)
{
    Instruction* raw_instruction = inst.get();
    blocks[0]->addLocalVariable(std::move(inst));
    parent.mapInstruction(raw_instruction);
}

__inline Block::Block(Id id, Function& parent) : parent(parent), unreachable(false)
{
    instructions.push_back(std::unique_ptr<Instruction>(new Instruction(id, NoType, OpLabel)));
    instructions.back()->setBlock(this);
    parent.getParent().mapInstruction(instructions.back().get());
}

__inline void Block::addInstruction(std::unique_ptr<Instruction> inst)
{
    Instruction* raw_instruction = inst.get();
    instructions.push_back(std::move(inst));
    raw_instruction->setBlock(this);
    if (raw_instruction->getResultId())
        parent.getParent().mapInstruction(raw_instruction);
}

__inline void Block::rewritePhiIncoming(spv::Id from_id, spv::Id to_id)
{
    for (auto &inst : instructions)
    {
        if (inst->getOpCode() == spv::OpPhi)
        {
            for (int i = 1, n = inst->getNumOperands(); i < n; i += 2)
                if (inst->getIdOperand(i) == from_id)
                    inst->setIdOperand(i, to_id);
        }
    }
}

};  // end spv namespace

#endif // spvIR_H
