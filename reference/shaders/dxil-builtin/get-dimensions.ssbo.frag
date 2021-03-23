#version 460

layout(set = 0, binding = 10, std430) writeonly readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 11, std430) writeonly readonly buffer _11_13
{
    uint _m0[];
} _13;

layout(location = 0) flat in uint LEVEL;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _19 = uint(_9._m0.length()) / 4u;
    uint _25 = uint(_13._m0.length()) * 4u;
    SV_Target = ((_19 * _19) + 16u) + (_25 * _25);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 29
; Schema: 0
OpCapability Shader
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %15 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpName %15 "LEVEL"
OpName %17 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 10
OpDecorate %9 NonReadable
OpDecorate %9 NonWritable
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 11
OpDecorate %13 NonReadable
OpDecorate %13 NonWritable
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypePointer Input %5
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %5
%17 = OpVariable %16 Output
%20 = OpConstant %5 4
%23 = OpConstant %5 16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%18 = OpArrayLength %5 %9 0
%19 = OpUDiv %5 %18 %20
%21 = OpIMul %5 %19 %19
%22 = OpIAdd %5 %21 %23
%24 = OpArrayLength %5 %13 0
%25 = OpIMul %5 %24 %20
%26 = OpIMul %5 %25 %25
%27 = OpIAdd %5 %22 %26
OpStore %17 %27
OpReturn
OpFunctionEnd
#endif
