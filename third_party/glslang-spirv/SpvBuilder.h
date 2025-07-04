//
// Copyright (C) 2014-2015 LunarG, Inc.
// Copyright (C) 2015-2016 Google, Inc.
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

//
// "Builder" is an interface to fully build SPIR-V IR.   Allocate one of
// these to build (a thread safe) internal SPIR-V representation (IR),
// and then dump it as a binary stream according to the SPIR-V specification.
//
// A Builder has a 1:1 relationship with a SPIR-V module.
//

#pragma once
#ifndef SpvBuilder_H
#define SpvBuilder_H

#include "Logger.h"
#include "spirv.hpp"
#include "spvIR.h"

#include <algorithm>
#include <memory>
#include <sstream>
#include <stack>

#include "thread_local_allocator.hpp"

namespace spv {

class Builder {
public:
    Builder(unsigned int userNumber, SpvBuildLogger* logger);
    virtual ~Builder();

    static const int maxMatrixSize = 4;

    void setSource(spv::SourceLanguage lang, int version)
    {
        source = lang;
        sourceVersion = version;
    }
    void setSourceFile(const dxil_spv::String& file)
    {
        Instruction* fileString = new Instruction(getUniqueId(), NoType, OpString);
        fileString->addStringOperand(file.c_str());
        sourceFileStringId = fileString->getResultId();
        strings.push_back(std::unique_ptr<Instruction>(fileString));
    }
    void setSourceText(const dxil_spv::String& text) { sourceText = text; }
    void addSourceExtension(const char* ext) { sourceExtensions.push_back(ext); }
    void addModuleProcessed(const dxil_spv::String& p) { moduleProcesses.push_back(p.c_str()); }
    void setEmitOpLines() { emitOpLines = true; }
    void addExtension(const char* ext) { extensions.insert(ext); }
    Id import(const char*);
    void setMemoryModel(spv::AddressingModel addr, spv::MemoryModel mem)
    {
        addressModel = addr;
        memoryModel = mem;
    }

    void addCapability(spv::Capability cap) { capabilities.insert(cap); }
    bool hasCapability(spv::Capability cap) const
    {
        return capabilities.count(cap) != 0;
    }

    // To get a new <id> for anything needing a new one.
    Id getUniqueId() { return ++uniqueId; }

    // To get a set of new <id>s, e.g., for a set of function parameters
    Id getUniqueIds(int numIds)
    {
        Id id = uniqueId + 1;
        uniqueId += numIds;
        return id;
    }

    spv::Instruction *addInstruction(spv::Id typeId, spv::Op op);
    spv::Instruction *addInstruction(spv::Op op);

    // Log the current line, and if different than the last one,
    // issue a new OpLine, using the current file name.
    void setLine(int line);
    // Low-level OpLine. See setLine() for a layered helper.
    void addLine(Id fileName, int line, int column);

    // For creating new types (will return old type if the requested one was already made).
    Id makeVoidType();
    Id makeBoolType();
    Id makePointer(StorageClass, Id type);
    Id makeIntegerType(int width, bool hasSign);   // generic
    Id makeIntType(int width) { return makeIntegerType(width, true); }
    Id makeUintType(int width) { return makeIntegerType(width, false); }
    Id makeFloatType(int width, int encoding = -1);
    Id makeCooperativeMatrixType(spv::Id scalar_type, spv::Id rows, spv::Id cols, spv::Id use);
    Id makeStructType(const dxil_spv::Vector<Id>& members, const char*);
    Id makeStructResultType(Id type0, Id type1);
    Id makeVectorType(Id component, int size);
    Id makeMatrixType(Id component, int cols, int rows);
    Id makeArrayType(Id element, Id sizeId, int stride);  // 0 stride means no stride decoration
    Id makeRuntimeArray(Id element);
    Id makeFunctionType(Id returnType, const dxil_spv::Vector<Id>& paramTypes);
    Id makeImageType(Id sampledType, Dim, bool depth, bool arrayed, bool ms, unsigned sampled, ImageFormat format);
    Id makeAccelerationStructureType();
    Id makeRayQueryType();
    Id makeSamplerType();
    Id makeSampledImageType(Id imageType);

    // For querying about types.
    Id getTypeId(Id resultId) const { return module.getTypeId(resultId); }
    Id getDerefTypeId(Id resultId) const;
    Op getOpCode(Id id) const { return module.getInstruction(id)->getOpCode(); }
    Op getTypeClass(Id typeId) const { return getOpCode(typeId); }
    Op getMostBasicTypeClass(Id typeId) const;
    int getNumComponents(Id resultId) const { return getNumTypeComponents(getTypeId(resultId)); }
    int getNumTypeConstituents(Id typeId) const;
    int getNumTypeComponents(Id typeId) const { return getNumTypeConstituents(typeId); }
    Id getScalarTypeId(Id typeId) const;
    Id getContainedTypeId(Id typeId) const;
    Id getContainedTypeId(Id typeId, int) const;
    StorageClass getTypeStorageClass(Id typeId) const { return module.getStorageClass(typeId); }
    ImageFormat getImageTypeFormat(Id typeId) const { return (ImageFormat)module.getInstruction(typeId)->getImmediateOperand(6); }

    bool isPointer(Id resultId)      const { return isPointerType(getTypeId(resultId)); }
    bool isScalar(Id resultId)       const { return isScalarType(getTypeId(resultId)); }
    bool isVector(Id resultId)       const { return isVectorType(getTypeId(resultId)); }
    bool isMatrix(Id resultId)       const { return isMatrixType(getTypeId(resultId)); }
    bool isAggregate(Id resultId)    const { return isAggregateType(getTypeId(resultId)); }
    bool isSampledImage(Id resultId) const { return isSampledImageType(getTypeId(resultId)); }

    bool isBoolType(Id typeId)         const { return groupedTypes[OpTypeBool].size() > 0 && typeId == groupedTypes[OpTypeBool].back()->getResultId(); }
    bool isIntType(Id typeId)          const { return getTypeClass(typeId) == OpTypeInt && module.getInstruction(typeId)->getImmediateOperand(1) != 0; }
    bool isUintType(Id typeId)         const { return getTypeClass(typeId) == OpTypeInt && module.getInstruction(typeId)->getImmediateOperand(1) == 0; }
    bool isFloatType(Id typeId)        const { return getTypeClass(typeId) == OpTypeFloat; }
    bool isPointerType(Id typeId)      const { return getTypeClass(typeId) == OpTypePointer; }
    bool isScalarType(Id typeId)       const { return getTypeClass(typeId) == OpTypeFloat  || getTypeClass(typeId) == OpTypeInt || getTypeClass(typeId) == OpTypeBool; }
    bool isVectorType(Id typeId)       const { return getTypeClass(typeId) == OpTypeVector; }
    bool isMatrixType(Id typeId)       const { return getTypeClass(typeId) == OpTypeMatrix; }
    bool isStructType(Id typeId)       const { return getTypeClass(typeId) == OpTypeStruct; }
    bool isArrayType(Id typeId)        const {
        auto typeClass = getTypeClass(typeId);
        return typeClass == OpTypeArray || typeClass == OpTypeRuntimeArray;
    }
    bool isAggregateType(Id typeId)    const { return isArrayType(typeId) || isStructType(typeId); }
    bool isImageType(Id typeId)        const { return getTypeClass(typeId) == OpTypeImage; }
    bool isSamplerType(Id typeId)      const { return getTypeClass(typeId) == OpTypeSampler; }
    bool isSampledImageType(Id typeId) const { return getTypeClass(typeId) == OpTypeSampledImage; }

    bool isConstantOpCode(Op opcode) const;
    bool isSpecConstantOpCode(Op opcode) const;
    bool isConstant(Id resultId) const { return isConstantOpCode(getOpCode(resultId)); }
    bool isConstantScalar(Id resultId) const { return getOpCode(resultId) == OpConstant; }
    bool isSpecConstant(Id resultId) const { return isSpecConstantOpCode(getOpCode(resultId)); }
    unsigned int getConstantScalar(Id resultId) const { return module.getInstruction(resultId)->getImmediateOperand(0); }
    StorageClass getStorageClass(Id resultId) const { return getTypeStorageClass(getTypeId(resultId)); }

    int getScalarTypeWidth(Id typeId) const
    {
        Id scalarTypeId = getScalarTypeId(typeId);
        assert(getTypeClass(scalarTypeId) == OpTypeInt || getTypeClass(scalarTypeId) == OpTypeFloat);
        return module.getInstruction(scalarTypeId)->getImmediateOperand(0);
    }

    int getTypeNumColumns(Id typeId) const
    {
        assert(isMatrixType(typeId));
        return getNumTypeConstituents(typeId);
    }
    int getNumColumns(Id resultId) const { return getTypeNumColumns(getTypeId(resultId)); }
    int getTypeNumRows(Id typeId) const
    {
        assert(isMatrixType(typeId));
        return getNumTypeComponents(getContainedTypeId(typeId));
    }
    int getNumRows(Id resultId) const { return getTypeNumRows(getTypeId(resultId)); }

    Dim getTypeDimensionality(Id typeId) const
    {
        assert(isImageType(typeId));
        return (Dim)module.getInstruction(typeId)->getImmediateOperand(1);
    }
    Id getImageType(Id resultId) const
    {
        Id typeId = getTypeId(resultId);
        assert(isImageType(typeId) || isSampledImageType(typeId));
        return isSampledImageType(typeId) ? module.getInstruction(typeId)->getIdOperand(0) : typeId;
    }
    bool isArrayedImageType(Id typeId) const
    {
        assert(isImageType(typeId));
        return module.getInstruction(typeId)->getImmediateOperand(3) != 0;
    }
    bool isMultisampledImageType(Id typeId) const
    {
        assert(isImageType(typeId));
        return module.getInstruction(typeId)->getImmediateOperand(4) != 0;
    }
    bool isStorageImageType(Id typeId) const
    {
        assert(isImageType(typeId));
        return module.getInstruction(typeId)->getImmediateOperand(5) == 2;
    }
    Id getImageComponentType(Id typeId) const
    {
        assert(isImageType(typeId));
        return module.getInstruction(typeId)->getImmediateOperand(0);
    }

    // For making new constants (will return old constant if the requested one was already made).
    Id makeBoolConstant(bool b, bool specConstant = false);
    Id makeIntConstant(int i, bool specConstant = false)         { return makeIntConstant(makeIntType(32),  (unsigned)i, specConstant); }
    Id makeUintConstant(unsigned u, bool specConstant = false)   { return makeIntConstant(makeUintType(32),           u, specConstant); }
    Id makeInt64Constant(long long i, bool specConstant = false)            { return makeInt64Constant(makeIntType(64),  (unsigned long long)i, specConstant); }
    Id makeUint64Constant(unsigned long long u, bool specConstant = false)  { return makeInt64Constant(makeUintType(64),                     u, specConstant); }
#ifdef AMD_EXTENSIONS
    Id makeInt16Constant(short i, bool specConstant = false)        { return makeIntConstant(makeIntType(16),      (unsigned)i, specConstant); }
    Id makeUint16Constant(unsigned short u, bool specConstant = false)  { return makeIntConstant(makeUintType(16), (unsigned)u, specConstant); }
    Id makeUint8Constant(unsigned char u, bool specConstant = false)  { return makeIntConstant(makeUintType(8), (unsigned)u, specConstant); }
    Id makeInt8Constant(signed char u, bool specConstant = false)  { return makeIntConstant(makeIntType(8), (unsigned)u, specConstant); }
#endif
    Id makeFloatConstant(float f, bool specConstant = false);
    Id makeDoubleConstant(double d, bool specConstant = false);
#ifdef AMD_EXTENSIONS
    Id makeFloat16Constant(uint16_t f16, bool specConstant = false);
    Id makeFloat8Constant(uint8_t f8, int encoding, bool specConstant = false);
#endif
    Id makeNullConstant(Id type);

    // Turn the array of constants into a proper spv constant of the requested type.
    Id makeCompositeConstant(Id type, const dxil_spv::Vector<Id>& comps, bool specConst = false);

    // Methods for adding information outside the CFG.
    Instruction* addEntryPoint(ExecutionModel, Function*, const char* name);
    void addExecutionMode(Function*, ExecutionMode mode, int value1 = -1, int value2 = -1, int value3 = -1);
    void addExecutionModeId(Function*, ExecutionMode mode, spv::Id id1 = 0, spv::Id id2 = 0, spv::Id id3 = 0);
    void addName(Id, const char* name);
    void addMemberName(Id, int member, const char* name);
    void addDecoration(Id, Decoration, int num = -1);
    bool hasDecoration(Id, Decoration) const;
    void addUniqueDecoration(Id, Decoration, int num = -1);
    void addMemberDecoration(Id, unsigned int member, Decoration, int num = -1);

    // At the end of what block do the next create*() instructions go?
    void setBuildPoint(Block* bp) { buildPoint = bp; }
    Block* getBuildPoint() const { return buildPoint; }

    // Make the entry-point function. The returned pointer is only valid
    // for the lifetime of this builder.
    Function* makeEntryPoint(const char*);

    // Make a shader-style function, and create its entry block if entry is non-zero.
    // Return the function, pass back the entry.
    // The returned pointer is only valid for the lifetime of this builder.
    Function* makeFunctionEntry(Decoration precision, Id returnType, const char* name, const dxil_spv::Vector<Id>& paramTypes,
                                const dxil_spv::Vector<dxil_spv::Vector<Decoration>>& precisions, Block **entry = 0);

    // Create a return. An 'implicit' return is one not appearing in the source
    // code.  In the case of an implicit return, no post-return block is inserted.
    void makeReturn(bool implicit, Id retVal = 0);

    // Generate all the code needed to finish up a function.
    void leaveFunction();

    // Create a discard.
    void makeDiscard();

    // Create a global or function local or IO variable.
    Id createVariable(StorageClass, Id type, const char* name = 0);
    Id createVariableWithInitializer(StorageClass, Id type, Id initializer, const char* name = 0);

    // Create an intermediate with an undefined value.
    Id createUndefined(Id type);
    // Create at global scope.
    Id createUndefinedConstant(Id type);

    // Store into an Id and return the l-value
    void createStore(Id rValue, Id lValue);

    // Load from an Id and return it
    Id createLoad(Id lValue);

    // Create an OpAccessChain instruction
    Id createAccessChain(StorageClass, Id base, const dxil_spv::Vector<Id>& offsets);

    // Create an OpArrayLength instruction
    Id createArrayLength(Id base, unsigned int member);

    // Create an OpCompositeExtract instruction
    Id createCompositeExtract(Id composite, Id typeId, unsigned index);
    Id createCompositeExtract(Id composite, Id typeId, const dxil_spv::Vector<unsigned>& indexes);
    Id createCompositeInsert(Id object, Id composite, Id typeId, unsigned index);
    Id createCompositeInsert(Id object, Id composite, Id typeId, const dxil_spv::Vector<unsigned>& indexes);

    Id createVectorExtractDynamic(Id vector, Id typeId, Id componentIndex);
    Id createVectorInsertDynamic(Id vector, Id typeId, Id component, Id componentIndex);

    void createNoResultOp(Op);
    void createNoResultOp(Op, Id operand);
    void createNoResultOp(Op, const dxil_spv::Vector<Id>& operands);
    void createControlBarrier(Scope execution, Scope memory, MemorySemanticsMask);
    void createMemoryBarrier(unsigned executionScope, unsigned memorySemantics);
    Id createUnaryOp(Op, Id typeId, Id operand);
    Id createBinOp(Op, Id typeId, Id operand1, Id operand2);
    Id createTriOp(Op, Id typeId, Id operand1, Id operand2, Id operand3);
    Id createOp(Op, Id typeId, const dxil_spv::Vector<Id>& operands);
    Id createFunctionCall(spv::Function*, const dxil_spv::Vector<spv::Id>&);
    Id createSpecConstantOp(Op, Id typeId, const dxil_spv::Vector<spv::Id>& operands, const dxil_spv::Vector<unsigned>& literals);

    // Take an rvalue (source) and a set of channels to extract from it to
    // make a new rvalue, which is returned.
    Id createRvalueSwizzle(Decoration precision, Id typeId, Id source, const dxil_spv::Vector<unsigned>& channels);

    // Take a copy of an lvalue (target) and a source of components, and set the
    // source components into the lvalue where the 'channels' say to put them.
    // An updated version of the target is returned.
    // (No true lvalue or stores are used.)
    Id createLvalueSwizzle(Id typeId, Id target, Id source, const dxil_spv::Vector<unsigned>& channels);

    // If both the id and precision are valid, the id
    // gets tagged with the requested precision.
    // The passed in id is always the returned id, to simplify use patterns.
    Id setPrecision(Id id, Decoration precision)
    {
        if (precision != NoPrecision && id != NoResult)
            addDecoration(id, precision);

        return id;
    }

    // Can smear a scalar to a vector for the following forms:
    //   - promoteScalar(scalar, vector)  // smear scalar to width of vector
    //   - promoteScalar(vector, scalar)  // smear scalar to width of vector
    //   - promoteScalar(pointer, scalar) // smear scalar to width of what pointer points to
    //   - promoteScalar(scalar, scalar)  // do nothing
    // Other forms are not allowed.
    //
    // Generally, the type of 'scalar' does not need to be the same type as the components in 'vector'.
    // The type of the created vector is a vector of components of the same type as the scalar.
    //
    // Note: One of the arguments will change, with the result coming back that way rather than 
    // through the return value.
    void promoteScalar(Decoration precision, Id& left, Id& right);

    // Make a value by smearing the scalar to fill the type.
    // vectorType should be the correct type for making a vector of scalarVal.
    // (No conversions are done.)
    Id smearScalar(Decoration precision, Id scalarVal, Id vectorType);

    // Create a call to a built-in function.
    Id createBuiltinCall(Id resultType, Id builtins, int entryPoint, const dxil_spv::Vector<Id>& args);

    // List of parameters used to create a texture operation
    struct TextureParameters {
        Id sampler;
        Id coords;
        Id bias;
        Id lod;
        Id Dref;
        Id offset;
        Id offsets;
        Id gradX;
        Id gradY;
        Id sample;
        Id component;
        Id texelOut;
        Id lodClamp;
    };

    // Select the correct texture operation based on all inputs, and emit the correct instruction
    Id createTextureCall(Decoration precision, Id resultType, bool sparse, bool fetch, bool proj, bool gather, bool noImplicit, const TextureParameters&);

    // Emit the OpTextureQuery* instruction that was passed in.
    // Figure out the right return value and type, and return it.
    Id createTextureQueryCall(Op, const TextureParameters&, bool isUnsignedResult);

    Id createSamplePositionCall(Decoration precision, Id, Id);

    Id createBitFieldExtractCall(Decoration precision, Id, Id, Id, bool isSigned);
    Id createBitFieldInsertCall(Decoration precision, Id, Id, Id, Id);

    // Reduction comparison for composites:  For equal and not-equal resulting in a scalar.
    Id createCompositeCompare(Decoration precision, Id, Id, bool /* true if for equal, false if for not-equal */);

    // OpCompositeConstruct
    Id createCompositeConstruct(Id typeId, const dxil_spv::Vector<Id>& constituents);

    // vector or scalar constructor
    Id createConstructor(Decoration precision, const dxil_spv::Vector<Id>& sources, Id resultTypeId);

    // matrix constructor
    Id createMatrixConstructor(Decoration precision, const dxil_spv::Vector<Id>& sources, Id constructee);

    // Helper to use for building nested control flow with if-then-else.
    class If {
    public:
        If(Id condition, unsigned int ctrl, Builder& builder);
        ~If() {}

        void makeBeginElse();
        void makeEndIf();

    private:
        If(const If&);
        If& operator=(If&);

        Builder& builder;
        Id condition;
        unsigned int control;
        Function* function;
        Block* headerBlock;
        Block* thenBlock;
        Block* elseBlock;
        Block* mergeBlock;
    };

    // Make a switch statement.  A switch has 'numSegments' of pieces of code, not containing
    // any case/default labels, all separated by one or more case/default labels.  Each possible
    // case value v is a jump to the caseValues[v] segment.  The defaultSegment is also in this
    // number space.  How to compute the value is given by 'condition', as in switch(condition).
    //
    // The SPIR-V Builder will maintain the stack of post-switch merge blocks for nested switches.
    //
    // Use a defaultSegment < 0 if there is no default segment (to branch to post switch).
    //
    // Returns the right set of basic blocks to start each code segment with, so that the caller's
    // recursion stack can hold the memory for it.
    //
    void makeSwitch(Id condition, unsigned int control, int numSegments, const dxil_spv::Vector<int>& caseValues,
                    const dxil_spv::Vector<int>& valueToSegment, int defaultSegment, dxil_spv::Vector<Block*>& segmentBB); // return argument

    // Add a branch to the innermost switch's merge block.
    void addSwitchBreak();

    // Move to the next code segment, passing in the return argument in makeSwitch()
    void nextSwitchSegment(dxil_spv::Vector<Block*>& segmentBB, int segment);

    // Finish off the innermost switch.
    void endSwitch(dxil_spv::Vector<Block*>& segmentBB);

    struct LoopBlocks {
        LoopBlocks(Block& head, Block& body, Block& merge, Block& continue_target) :
            head(head), body(body), merge(merge), continue_target(continue_target) { }
        Block &head, &body, &merge, &continue_target;
        LoopBlocks& operator=(const LoopBlocks&) = delete;
        LoopBlocks(const LoopBlocks&) = default;
    private:
        LoopBlocks();
    };

    // Start a new loop and prepare the builder to generate code for it.  Until
    // closeLoop() is called for this loop, createLoopContinue() and
    // createLoopExit() will target its corresponding blocks.
    LoopBlocks& makeNewLoop();

    // Create a new block in the function containing the build point.  Memory is
    // owned by the function object.
    Block& makeNewBlock();

    // Add a branch to the continue_target of the current (innermost) loop.
    void createLoopContinue();

    // Add an exit (e.g. "break") from the innermost loop that we're currently
    // in.
    void createLoopExit();

    // Close the innermost loop that you're in
    void closeLoop();

    //
    // Access chain design for an R-Value vs. L-Value:
    //
    // There is a single access chain the builder is building at
    // any particular time.  Such a chain can be used to either to a load or
    // a store, when desired.
    //
    // Expressions can be r-values, l-values, or both, or only r-values:
    //    a[b.c].d = ....  // l-value
    //    ... = a[b.c].d;  // r-value, that also looks like an l-value
    //    ++a[b.c].d;      // r-value and l-value
    //    (x + y)[2];      // r-value only, can't possibly be l-value
    //
    // Computing an r-value means generating code.  Hence,
    // r-values should only be computed when they are needed, not speculatively.
    //
    // Computing an l-value means saving away information for later use in the compiler,
    // no code is generated until the l-value is later dereferenced.  It is okay
    // to speculatively generate an l-value, just not okay to speculatively dereference it.
    //
    // The base of the access chain (the left-most variable or expression
    // from which everything is based) can be set either as an l-value
    // or as an r-value.  Most efficient would be to set an l-value if one
    // is available.  If an expression was evaluated, the resulting r-value
    // can be set as the chain base.
    //
    // The users of this single access chain can save and restore if they
    // want to nest or manage multiple chains.
    //

    struct AccessChain {
        Id base;                       // for l-values, pointer to the base object, for r-values, the base object
        dxil_spv::Vector<Id> indexChain;
        Id instr;                      // cache the instruction that generates this access chain
        dxil_spv::Vector<unsigned> swizzle; // each dxil_spv::Vector element selects the next GLSL component number
        Id component;                  // a dynamic component index, can coexist with a swizzle, done after the swizzle, NoResult if not present
        Id preSwizzleBaseType;         // dereferenced type, before swizzle or component is applied; NoType unless a swizzle or component is present
        bool isRValue;                 // true if 'base' is an r-value, otherwise, base is an l-value
    };

    //
    // the SPIR-V builder maintains a single active chain that
    // the following methods operate on
    //

    // for external save and restore
    AccessChain getAccessChain() { return accessChain; }
    void setAccessChain(AccessChain newChain) { accessChain = newChain; }

    // clear accessChain
    void clearAccessChain();

    // set new base as an l-value base
    void setAccessChainLValue(Id lValue)
    {
        assert(isPointer(lValue));
        accessChain.base = lValue;
    }

    // set new base value as an r-value
    void setAccessChainRValue(Id rValue)
    {
        accessChain.isRValue = true;
        accessChain.base = rValue;
    }

    // push offset onto the end of the chain
    void accessChainPush(Id offset)
    {
        accessChain.indexChain.push_back(offset);
    }

    // push new swizzle onto the end of any existing swizzle, merging into a single swizzle
    void accessChainPushSwizzle(dxil_spv::Vector<unsigned>& swizzle, Id preSwizzleBaseType);

    // push a variable component selection onto the access chain; supporting only one, so unsided
    void accessChainPushComponent(Id component, Id preSwizzleBaseType)
    {
        accessChain.component = component;
        if (accessChain.preSwizzleBaseType == NoType)
            accessChain.preSwizzleBaseType = preSwizzleBaseType;
    }

    // use accessChain and swizzle to store value
    void accessChainStore(Id rvalue);

    // use accessChain and swizzle to load an r-value
    Id accessChainLoad(Decoration precision, Id ResultType);

    // get the direct pointer for an l-value
    Id accessChainGetLValue();

    // Get the inferred SPIR-V type of the result of the current access chain,
    // based on the type of the base and the chain of dereferences.
    Id accessChainGetInferredType();

    // Remove OpDecorate instructions whose operands are defined in unreachable
    // blocks.
    void eliminateDeadDecorations();
    void dump(dxil_spv::Vector<unsigned int>&) const;

    void createBranch(Block* block);
    void createConditionalBranch(Id condition, Block* thenBlock, Block* elseBlock);
    void createLoopMerge(Block* mergeBlock, Block* continueBlock, unsigned int control);
    void createUnreachable();

    // Sets to generate opcode for specialization constants.
    void setToSpecConstCodeGenMode() { generatingOpCodeForSpecConst = true; }
    // Sets to generate opcode for non-specialization constants (normal mode).
    void setToNormalCodeGenMode() { generatingOpCodeForSpecConst = false; }
    // Check if the builder is generating code for spec constants.
    bool isInSpecConstCodeGenMode() { return generatingOpCodeForSpecConst; }

    void createSelectionMerge(Block* mergeBlock, unsigned int control);

    spv::Scope getAtomicDeviceScope() const
    {
        if (hasCapability(spv::CapabilityVulkanMemoryModel))
            return spv::ScopeQueueFamily;
        else
            return spv::ScopeDevice;
    }

    spv::Id getAtomicDeviceScopeId()
    {
        return makeUintConstant(getAtomicDeviceScope());
    }

    spv::Id getWorkgroupBarrierSemanticsId()
    {
        uint32_t semantics = spv::MemorySemanticsAcquireReleaseMask | spv::MemorySemanticsWorkgroupMemoryMask;
        if (hasCapability(spv::CapabilityVulkanMemoryModel))
            semantics |= spv::MemorySemanticsMakeAvailableMask | spv::MemorySemanticsMakeVisibleMask;
        return makeUintConstant(semantics);
    }

protected:
    Id makeIntConstant(Id typeId, unsigned value, bool specConstant);
    Id makeInt64Constant(Id typeId, unsigned long long value, bool specConstant);
    Id findScalarConstant(Op typeClass, Op opcode, Id typeId, unsigned value) const;
    Id findScalarConstant(Op typeClass, Op opcode, Id typeId, unsigned v1, unsigned v2) const;
    Id findCompositeConstant(Op typeClass, const dxil_spv::Vector<Id>& comps) const;
    Id collapseAccessChain();
    void transferAccessChainSwizzle(bool dynamic);
    void simplifyAccessChainSwizzle();
    void createAndSetNoPredecessorBlock(const char*);
    void dumpSourceInstructions(dxil_spv::Vector<unsigned int>&) const;
    void dumpInstructions(dxil_spv::Vector<unsigned int>&, const dxil_spv::Vector<std::unique_ptr<Instruction> >&) const;
    void dumpModuleProcesses(dxil_spv::Vector<unsigned int>&) const;

    SourceLanguage source;
    int sourceVersion;
    spv::Id sourceFileStringId;
    dxil_spv::String sourceText;
    int currentLine;
    bool emitOpLines;
    dxil_spv::Set<dxil_spv::String> extensions;
    dxil_spv::Vector<const char*> sourceExtensions;
    dxil_spv::Vector<const char*> moduleProcesses;
    AddressingModel addressModel;
    MemoryModel memoryModel;
    dxil_spv::Set<spv::Capability> capabilities;
    int builderNumber;
    Module module;
    Block* buildPoint;
    Id uniqueId;
    Function* entryPointFunction;
    bool generatingOpCodeForSpecConst;
    AccessChain accessChain;

    // special blocks of instructions for output
    dxil_spv::Vector<std::unique_ptr<Instruction> > strings;
    dxil_spv::Vector<std::unique_ptr<Instruction> > imports;
    dxil_spv::Vector<std::unique_ptr<Instruction> > entryPoints;
    dxil_spv::Vector<std::unique_ptr<Instruction> > executionModes;
    dxil_spv::Vector<std::unique_ptr<Instruction> > names;
    dxil_spv::Vector<std::unique_ptr<Instruction> > lines;
    dxil_spv::Vector<std::unique_ptr<Instruction> > decorations;
    dxil_spv::Vector<std::unique_ptr<Instruction> > constantsTypesGlobals;
    dxil_spv::Vector<std::unique_ptr<Instruction> > externals;
    dxil_spv::Vector<std::unique_ptr<Function> > functions;

    // not output, internally used for quick & dirty canonical (unique) creation
    dxil_spv::Vector<Instruction*> groupedConstants[OpConstant];  // all types appear before OpConstant
    dxil_spv::Vector<Instruction*> groupedTypes[OpConstant];
    dxil_spv::Vector<Instruction*> coopmatConstants;  // all types appear before OpConstant
    dxil_spv::Vector<Instruction*> coopmatTypes;
    Instruction *acceleration_structure_type = nullptr;
    Instruction *ray_query_type = nullptr;

    // stack of switches
    std::stack<Block*> switchMerges;

    // Our loop stack.
    std::stack<LoopBlocks> loops;

    // The stream for outputting warnings and errors.
    SpvBuildLogger* logger;

    dxil_spv::Vector<std::pair<dxil_spv::String, spv::Id>> importIDCache;
};  // end Builder class

};  // end spv namespace

#endif // SpvBuilder_H
