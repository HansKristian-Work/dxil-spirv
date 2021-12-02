#version 460

layout(set = 0, binding = 0, std430) restrict readonly buffer SSBO
{
    uint _m0[];
} _9;

layout(set = 0, binding = 0, std430) writeonly buffer _11_13
{
    uint _m0[];
} _13;

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

void main()
{
    uint _20 = uint(A);
    float _26 = uintBitsToFloat(_9._m0[_20]);
    mediump float mp_copy_26 = _26;
    float _31 = uintBitsToFloat(_9._m0[_20 + 1u]);
    mediump float mp_copy_31 = _31;
    _13._m0[_20] = floatBitsToUint(mp_copy_31 + mp_copy_26);
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpName %16 "A"
OpName %18 "SV_Target"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 NonReadable
OpDecorate %16 RelaxedPrecision
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %18 Location 0
OpDecorate %32 RelaxedPrecision
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
%14 = OpTypeInt 32 1
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %14
%18 = OpVariable %17 Output
%21 = OpTypePointer StorageBuffer %5
%23 = OpConstant %5 0
%25 = OpTypeFloat 32
%28 = OpConstant %5 1
%35 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%19 = OpLoad %14 %16
%20 = OpBitcast %5 %19
%22 = OpAccessChain %21 %9 %23 %20
%24 = OpLoad %5 %22
%26 = OpBitcast %25 %24
%27 = OpIAdd %5 %20 %28
%29 = OpAccessChain %21 %9 %23 %27
%30 = OpLoad %5 %29
%31 = OpBitcast %25 %30
%32 = OpFAdd %25 %31 %26
%33 = OpBitcast %5 %32
%34 = OpAccessChain %21 %13 %23 %20
OpStore %34 %33
%36 = OpBitcast %14 %35
OpStore %18 %36
OpReturn
OpFunctionEnd
#endif
