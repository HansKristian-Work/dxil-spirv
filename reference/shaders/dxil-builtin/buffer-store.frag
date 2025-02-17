#version 460

layout(set = 0, binding = 0) uniform writeonly imageBuffer _8;
layout(set = 0, binding = 1, r32ui) uniform writeonly uimageBuffer _12;
layout(set = 0, binding = 2, r32ui) uniform writeonly uimageBuffer _13;
layout(set = 0, binding = 3, r32ui) uniform writeonly uimageBuffer _14;

layout(location = 0) flat in uint INDEX;
layout(location = 0, component = 1) flat in uvec2 DATA;

void main()
{
    float _27 = uintBitsToFloat(DATA.x);
    float _31 = uintBitsToFloat(DATA.y);
    imageStore(_8, int(INDEX), vec4(_27, _31, _27, _27));
    uint _39 = INDEX * 2u;
    imageStore(_12, int(_39), uvec4(floatBitsToUint(_27)));
    imageStore(_12, int(_39 + 1u), uvec4(floatBitsToUint(_31)));
    uint _45 = INDEX * 2u;
    imageStore(_13, int(_45), uvec4(floatBitsToUint(_27)));
    imageStore(_13, int(_45 + 1u), uvec4(floatBitsToUint(_31)));
    uint _53 = (INDEX * 5u) + 3u;
    imageStore(_14, int(_53), uvec4(floatBitsToUint(_27)));
    imageStore(_14, int(_53 + 1u), uvec4(floatBitsToUint(_31)));
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
%17 = OpTypeVector %9 2
%18 = OpTypePointer Input %17
%19 = OpVariable %18 Input
%25 = OpConstant %9 0
%29 = OpConstant %9 1
%33 = OpTypeVector %5 4
%38 = OpConstant %9 3
%40 = OpConstant %9 2
%41 = OpTypeVector %9 4
%52 = OpConstant %9 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %59
%59 = OpLabel
%20 = OpLoad %10 %14
%21 = OpLoad %10 %13
%22 = OpLoad %10 %12
%23 = OpLoad %6 %8
%24 = OpAccessChain %15 %19 %25
%26 = OpLoad %9 %24
%27 = OpBitcast %5 %26
%28 = OpAccessChain %15 %19 %29
%30 = OpLoad %9 %28
%31 = OpBitcast %5 %30
%32 = OpLoad %9 %16
%34 = OpCompositeConstruct %33 %27 %31 %27 %27
OpImageWrite %23 %32 %34
%35 = OpBitcast %9 %27
%36 = OpBitcast %9 %31
%37 = OpShiftLeftLogical %9 %32 %38
%39 = OpIMul %9 %32 %40
%42 = OpCompositeConstruct %41 %35 %35 %35 %35
OpImageWrite %22 %39 %42
%43 = OpCompositeConstruct %41 %36 %36 %36 %36
%44 = OpIAdd %9 %39 %29
OpImageWrite %22 %44 %43
%45 = OpIMul %9 %32 %40
%46 = OpBitcast %9 %27
%47 = OpBitcast %9 %31
%48 = OpCompositeConstruct %41 %46 %46 %46 %46
OpImageWrite %21 %45 %48
%49 = OpCompositeConstruct %41 %47 %47 %47 %47
%50 = OpIAdd %9 %45 %29
OpImageWrite %21 %50 %49
%51 = OpIMul %9 %32 %52
%53 = OpIAdd %9 %51 %38
%54 = OpBitcast %9 %27
%55 = OpBitcast %9 %31
%56 = OpCompositeConstruct %41 %54 %54 %54 %54
OpImageWrite %20 %53 %56
%57 = OpCompositeConstruct %41 %55 %55 %55 %55
%58 = OpIAdd %9 %53 %29
OpImageWrite %20 %58 %57
OpReturn
OpFunctionEnd
#endif
