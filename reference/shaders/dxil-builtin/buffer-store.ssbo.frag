#version 460

layout(set = 0, binding = 1, std430) writeonly buffer SSBO
{
    uint _m0[];
} _13;

layout(set = 0, binding = 2, std430) writeonly buffer _15_17
{
    uint _m0[];
} _17;

layout(set = 0, binding = 3, std430) writeonly buffer _19_21
{
    uint _m0[];
} _21;

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in vec2 DATA;

void main()
{
    imageStore(_8, int(INDEX), vec4(DATA.x, DATA.y, DATA.x, DATA.x));
    uint _42 = INDEX * 2u;
    _13._m0[_42] = floatBitsToUint(DATA.x);
    _13._m0[_42 + 1u] = floatBitsToUint(DATA.y);
    uint _48 = INDEX * 2u;
    _17._m0[_48] = floatBitsToUint(DATA.x);
    _17._m0[_48 + 1u] = floatBitsToUint(DATA.y);
    uint _57 = (INDEX * 5u) + 3u;
    _21._m0[_57] = floatBitsToUint(DATA.x);
    _21._m0[_57 + 1u] = floatBitsToUint(DATA.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 65
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "SSBO"
OpName %15 "SSBO"
OpName %19 "SSBO"
OpName %23 "INDEX"
OpName %26 "DATA"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 1
OpDecorate %13 NonReadable
OpDecorate %14 ArrayStride 4
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 2
OpDecorate %17 NonReadable
OpDecorate %18 ArrayStride 4
OpMemberDecorate %19 0 Offset 0
OpDecorate %19 Block
OpDecorate %21 DescriptorSet 0
OpDecorate %21 Binding 3
OpDecorate %21 NonReadable
OpDecorate %23 Flat
OpDecorate %23 Location 0
OpDecorate %26 Flat
OpDecorate %26 Location 0
OpDecorate %26 Component 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeRuntimeArray %9
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeRuntimeArray %9
%15 = OpTypeStruct %14
%16 = OpTypePointer StorageBuffer %15
%17 = OpVariable %16 StorageBuffer
%18 = OpTypeRuntimeArray %9
%19 = OpTypeStruct %18
%20 = OpTypePointer StorageBuffer %19
%21 = OpVariable %20 StorageBuffer
%22 = OpTypePointer Input %9
%23 = OpVariable %22 Input
%24 = OpTypeVector %5 2
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%28 = OpTypePointer Input %5
%30 = OpConstant %9 0
%33 = OpConstant %9 1
%36 = OpTypeVector %5 4
%41 = OpConstant %9 3
%43 = OpConstant %9 2
%44 = OpTypePointer StorageBuffer %9
%54 = OpConstant %9 12
%56 = OpConstant %9 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %63
%63 = OpLabel
%27 = OpLoad %6 %8
%29 = OpAccessChain %28 %26 %30
%31 = OpLoad %5 %29
%32 = OpAccessChain %28 %26 %33
%34 = OpLoad %5 %32
%35 = OpLoad %9 %23
%37 = OpCompositeConstruct %36 %31 %34 %31 %31
OpImageWrite %27 %35 %37
%38 = OpBitcast %9 %31
%39 = OpBitcast %9 %34
%40 = OpShiftLeftLogical %9 %35 %41
%42 = OpIMul %9 %35 %43
%45 = OpAccessChain %44 %13 %30 %42
OpStore %45 %38
%47 = OpIAdd %9 %42 %33
%46 = OpAccessChain %44 %13 %30 %47
OpStore %46 %39
%48 = OpIMul %9 %35 %43
%49 = OpBitcast %9 %31
%50 = OpBitcast %9 %34
%51 = OpAccessChain %44 %17 %30 %48
OpStore %51 %49
%53 = OpIAdd %9 %48 %33
%52 = OpAccessChain %44 %17 %30 %53
OpStore %52 %50
%55 = OpIMul %9 %35 %56
%57 = OpIAdd %9 %55 %41
%58 = OpBitcast %9 %31
%59 = OpBitcast %9 %34
%60 = OpAccessChain %44 %21 %30 %57
OpStore %60 %58
%62 = OpIAdd %9 %57 %33
%61 = OpAccessChain %44 %21 %30 %62
OpStore %61 %59
OpReturn
OpFunctionEnd
#endif
