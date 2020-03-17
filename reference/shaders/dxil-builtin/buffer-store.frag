#version 460

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _13;
layout(set = 0, binding = 3, r32ui) uniform writeonly uimageBuffer _14;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in vec2 DATA;

uint _40;
float _48;

void main()
{
    imageStore(_8, int(INDEX), vec4(DATA.x, DATA.y, DATA.x, DATA.x));
    uint _38 = (INDEX << 3u) >> 2u;
    imageStore(_12, int(_38), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_12, int(_38 + 1u), uvec4(floatBitsToUint(DATA.y)));
    uint _45 = INDEX * 2u;
    imageStore(_13, int(_45), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_13, int(_45 + 1u), uvec4(floatBitsToUint(DATA.y)));
    uint _55 = (INDEX * 5u) + 3u;
    imageStore(_14, int(_55), uvec4(floatBitsToUint(DATA.x)));
    imageStore(_14, int(_55 + 1u), uvec4(floatBitsToUint(DATA.y)));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "INDEX"
OpName %19 "DATA"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 1
OpDecorate %12 NonReadable
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 2
OpDecorate %13 NonReadable
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 3
OpDecorate %14 NonReadable
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %19 Component 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeImage %9 Buffer 0 0 0 2 R32ui
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpVariable %11 UniformConstant
%14 = OpVariable %11 UniformConstant
%15 = OpTypePointer Input %9
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 2
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%24 = OpTypePointer Input %5
%26 = OpConstant %9 0
%29 = OpConstant %9 1
%32 = OpTypeVector %5 4
%37 = OpConstant %9 3
%39 = OpConstant %9 2
%41 = OpTypeVector %9 4
%52 = OpConstant %9 12
%54 = OpConstant %9 5
%3 = OpFunction %1 None %2
%4 = OpLabel
%40 = OpUndef %9
%48 = OpUndef %5
OpBranch %61
%61 = OpLabel
%20 = OpLoad %10 %14
%21 = OpLoad %10 %13
%22 = OpLoad %10 %12
%23 = OpLoad %6 %8
%25 = OpAccessChain %24 %19 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %24 %19 %29
%30 = OpLoad %5 %28
%31 = OpLoad %9 %16
%33 = OpCompositeConstruct %32 %27 %30 %27 %27
OpImageWrite %23 %31 %33
%34 = OpBitcast %9 %27
%35 = OpBitcast %9 %30
%36 = OpShiftLeftLogical %9 %31 %37
%38 = OpShiftRightLogical %9 %36 %39
%42 = OpCompositeConstruct %41 %34 %34 %34 %34
OpImageWrite %22 %38 %42
%43 = OpCompositeConstruct %41 %35 %35 %35 %35
%44 = OpIAdd %9 %38 %29
OpImageWrite %22 %44 %43
%45 = OpIMul %9 %31 %39
%46 = OpBitcast %9 %27
%47 = OpBitcast %9 %30
%49 = OpCompositeConstruct %41 %46 %46 %46 %46
OpImageWrite %21 %45 %49
%50 = OpCompositeConstruct %41 %47 %47 %47 %47
%51 = OpIAdd %9 %45 %29
OpImageWrite %21 %51 %50
%53 = OpIMul %9 %31 %54
%55 = OpIAdd %9 %53 %37
%56 = OpBitcast %9 %27
%57 = OpBitcast %9 %30
%58 = OpCompositeConstruct %41 %56 %56 %56 %56
OpImageWrite %20 %55 %58
%59 = OpCompositeConstruct %41 %57 %57 %57 %57
%60 = OpIAdd %9 %55 %29
OpImageWrite %20 %60 %59
OpReturn
OpFunctionEnd
#endif
