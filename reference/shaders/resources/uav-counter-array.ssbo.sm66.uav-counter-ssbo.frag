#version 460

layout(set = 0, binding = 10, std430) writeonly readonly buffer SSBO
{
    uint _m0[];
} _11[5];

layout(set = 7, binding = 0, std430) buffer AtomicCounterSSBO
{
    uint counter;
} _15[5];

layout(location = 0) flat in uint I;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _28 = atomicAdd(_15[nonuniformEXT(I)].counter, 1u);
    SV_Target = _28;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "AtomicCounterSSBO"
OpMemberName %12 0 "counter"
OpName %17 "I"
OpName %19 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 10
OpDecorate %11 NonReadable
OpDecorate %11 NonWritable
OpDecorate %12 Block
OpMemberDecorate %12 0 Offset 0
OpDecorate %15 DescriptorSet 7
OpDecorate %15 Binding 0
OpDecorate %17 Flat
OpDecorate %17 Location 0
OpDecorate %19 Location 0
OpDecorate %20 NonUniform
OpDecorate %24 NonUniform
OpDecorate %26 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpConstant %5 5
%9 = OpTypeArray %7 %8
%10 = OpTypePointer StorageBuffer %9
%11 = OpVariable %10 StorageBuffer
%12 = OpTypeStruct %5
%13 = OpTypeArray %12 %8
%14 = OpTypePointer StorageBuffer %13
%15 = OpVariable %14 StorageBuffer
%16 = OpTypePointer Input %5
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %5
%19 = OpVariable %18 Output
%22 = OpConstant %5 10
%23 = OpTypePointer StorageBuffer %7
%25 = OpTypePointer StorageBuffer %5
%27 = OpConstant %5 0
%29 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%20 = OpLoad %5 %17
%21 = OpIAdd %5 %20 %22
%24 = OpAccessChain %23 %11 %20
%26 = OpAccessChain %25 %15 %20 %27
%28 = OpAtomicIAdd %5 %26 %29 %27 %29
OpStore %19 %28
OpReturn
OpFunctionEnd
#endif
