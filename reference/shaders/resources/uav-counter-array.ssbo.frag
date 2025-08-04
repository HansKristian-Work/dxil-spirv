#version 460

layout(set = 0, binding = 10, std430) writeonly readonly buffer SSBO
{
    uint _m0[];
} _11[5];

layout(set = 7, binding = 0, r32ui) uniform uimageBuffer _15[5];

layout(location = 0) flat in uint I;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _30 = imageAtomicAdd(_15[nonuniformEXT(I)], int(0u), 1u);
    SV_Target = _30;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability ImageBuffer
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %17 "I"
OpName %19 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 10
OpDecorate %11 NonReadable
OpDecorate %11 NonWritable
OpDecorate %15 DescriptorSet 7
OpDecorate %15 Binding 0
OpDecorate %17 Flat
OpDecorate %17 Location 0
OpDecorate %19 Location 0
OpDecorate %20 NonUniform
OpDecorate %24 NonUniform
OpDecorate %28 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpConstant %5 5
%9 = OpTypeArray %7 %8
%10 = OpTypePointer StorageBuffer %9
%11 = OpVariable %10 StorageBuffer
%12 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%13 = OpTypeArray %12 %8
%14 = OpTypePointer UniformConstant %13
%15 = OpVariable %14 UniformConstant
%16 = OpTypePointer Input %5
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %5
%19 = OpVariable %18 Output
%22 = OpConstant %5 10
%23 = OpTypePointer StorageBuffer %7
%25 = OpTypePointer UniformConstant %12
%27 = OpTypePointer Image %5
%29 = OpConstant %5 0
%31 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%20 = OpLoad %5 %17
%21 = OpIAdd %5 %20 %22
%24 = OpAccessChain %23 %11 %20
%26 = OpAccessChain %25 %15 %20
%28 = OpImageTexelPointer %27 %26 %29 %29
%30 = OpAtomicIAdd %5 %28 %31 %29 %31
OpStore %19 %30
OpReturn
OpFunctionEnd
#endif
