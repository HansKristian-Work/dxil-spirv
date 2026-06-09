#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require

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
    uint16_t _21 = uint16_t(A);
    uint _22 = uint(int16_t(_21));
    mediump float _29 = uintBitsToFloat(_9._m0[_22]);
    mediump float _36 = uintBitsToFloat(_9._m0[uint(int16_t(_21 + 1us))]);
    _13._m0[_22] = floatBitsToUint(_36 + _29);
    SV_Target = int(10u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability Int16
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
OpDecorate %29 RelaxedPrecision
OpDecorate %36 RelaxedPrecision
OpDecorate %37 RelaxedPrecision
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
%20 = OpTypeInt 16 0
%23 = OpTypePointer StorageBuffer %5
%25 = OpConstant %5 0
%27 = OpTypeFloat 32
%31 = OpConstant %20 1
%40 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %42
%42 = OpLabel
%19 = OpLoad %14 %16
%21 = OpSConvert %20 %19
%22 = OpSConvert %5 %21
%24 = OpAccessChain %23 %9 %25 %22
%26 = OpLoad %5 %24
%28 = OpBitcast %27 %26
%29 = OpCopyObject %27 %28
%30 = OpIAdd %20 %21 %31
%32 = OpSConvert %5 %30
%33 = OpAccessChain %23 %9 %25 %32
%34 = OpLoad %5 %33
%35 = OpBitcast %27 %34
%36 = OpCopyObject %27 %35
%37 = OpFAdd %27 %36 %29
%38 = OpBitcast %5 %37
%39 = OpAccessChain %23 %13 %25 %22
OpStore %39 %38
%41 = OpBitcast %14 %40
OpStore %18 %41
OpReturn
OpFunctionEnd
#endif
