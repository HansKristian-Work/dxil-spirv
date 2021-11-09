#version 460

layout(set = 0, binding = 1, std430) writeonly buffer SSBO
{
    uvec2 _m0[];
} _14;

layout(set = 0, binding = 2, std430) writeonly buffer _16_18
{
    uvec2 _m0[];
} _18;

layout(set = 0, binding = 3, std430) writeonly buffer _20_22
{
    uint _m0[];
} _22;

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in vec2 DATA;

void main()
{
    imageStore(_8, int(INDEX), vec4(DATA.x, DATA.y, DATA.x, DATA.x));
    _14._m0[INDEX] = uvec2(floatBitsToUint(DATA.x), floatBitsToUint(DATA.y));
    _18._m0[INDEX] = uvec2(floatBitsToUint(DATA.x), floatBitsToUint(DATA.y));
    uint _52 = (INDEX * 5u) + 3u;
    _22._m0[_52] = floatBitsToUint(DATA.x);
    _22._m0[_52 + 1u] = floatBitsToUint(DATA.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 61
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SSBO"
OpName %16 "SSBO"
OpName %20 "SSBO"
OpName %24 "INDEX"
OpName %27 "DATA"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 1
OpDecorate %14 NonReadable
OpDecorate %15 ArrayStride 8
OpMemberDecorate %16 0 Offset 0
OpDecorate %16 Block
OpDecorate %18 DescriptorSet 0
OpDecorate %18 Binding 2
OpDecorate %18 NonReadable
OpDecorate %19 ArrayStride 4
OpMemberDecorate %20 0 Offset 0
OpDecorate %20 Block
OpDecorate %22 DescriptorSet 0
OpDecorate %22 Binding 3
OpDecorate %22 NonReadable
OpDecorate %24 Flat
OpDecorate %24 Location 0
OpDecorate %27 Flat
OpDecorate %27 Location 0
OpDecorate %27 Component 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypeRuntimeArray %10
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypeRuntimeArray %10
%16 = OpTypeStruct %15
%17 = OpTypePointer StorageBuffer %16
%18 = OpVariable %17 StorageBuffer
%19 = OpTypeRuntimeArray %9
%20 = OpTypeStruct %19
%21 = OpTypePointer StorageBuffer %20
%22 = OpVariable %21 StorageBuffer
%23 = OpTypePointer Input %9
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 2
%26 = OpTypePointer Input %25
%27 = OpVariable %26 Input
%29 = OpTypePointer Input %5
%31 = OpConstant %9 0
%34 = OpConstant %9 1
%37 = OpTypeVector %5 4
%42 = OpConstant %9 3
%44 = OpTypePointer StorageBuffer %10
%51 = OpConstant %9 5
%55 = OpTypePointer StorageBuffer %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %59
%59 = OpLabel
%28 = OpLoad %6 %8
%30 = OpAccessChain %29 %27 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %29 %27 %34
%35 = OpLoad %5 %33
%36 = OpLoad %9 %24
%38 = OpCompositeConstruct %37 %32 %35 %32 %32
OpImageWrite %28 %36 %38
%39 = OpBitcast %9 %32
%40 = OpBitcast %9 %35
%41 = OpShiftLeftLogical %9 %36 %42
%43 = OpCompositeConstruct %10 %39 %40
%45 = OpAccessChain %44 %14 %31 %36
OpStore %45 %43
%46 = OpBitcast %9 %32
%47 = OpBitcast %9 %35
%48 = OpCompositeConstruct %10 %46 %47
%49 = OpAccessChain %44 %18 %31 %36
OpStore %49 %48
%50 = OpIMul %9 %36 %51
%52 = OpIAdd %9 %50 %42
%53 = OpBitcast %9 %32
%54 = OpBitcast %9 %35
%56 = OpAccessChain %55 %22 %31 %52
OpStore %56 %53
%58 = OpIAdd %9 %52 %34
%57 = OpAccessChain %55 %22 %31 %58
OpStore %57 %54
OpReturn
OpFunctionEnd
#endif
