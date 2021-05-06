#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 1) uniform sampler _11;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) flat in ivec2 OFF;
layout(location = 1, component = 2) flat in ivec2 OFF_2;
layout(location = 0) out vec4 SV_Target;

void main()
{
    uint _29 = uint(OFF_2.x);
    uint _33 = uint(OFF_2.y);
    uint _36 = uint(OFF.x);
    uint _39 = uint(OFF.y);
    SV_Target.x = textureGatherOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(_36), int(_39))).x;
    SV_Target.y = textureGatherOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(_36 + _29), int(_39 + _33))).y;
    SV_Target.z = textureGatherOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(_36 - _29), int(_39 - _33))).z;
    SV_Target.w = textureGatherOffset(sampler2D(_8, _11), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(_29), int(_33))).w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 85
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %14 %18 %19 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %18 "OFF"
OpName %19 "OFF_2"
OpName %21 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 Location 0
OpDecorate %18 Flat
OpDecorate %18 Location 1
OpDecorate %19 Flat
OpDecorate %19 Location 1
OpDecorate %19 Component 2
OpDecorate %21 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeVector %5 4
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeInt 32 1
%16 = OpTypeVector %15 2
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpVariable %17 Input
%20 = OpTypePointer Output %12
%21 = OpVariable %20 Output
%24 = OpTypePointer Input %15
%26 = OpTypeInt 32 0
%27 = OpConstant %26 0
%31 = OpConstant %26 1
%40 = OpTypePointer Input %5
%49 = OpTypeSampledImage %6
%51 = OpTypeVector %5 2
%76 = OpTypePointer Output %5
%80 = OpConstant %26 2
%82 = OpConstant %26 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %83
%83 = OpLabel
%22 = OpLoad %6 %8
%23 = OpLoad %9 %11
%25 = OpAccessChain %24 %19 %27
%28 = OpLoad %15 %25
%29 = OpBitcast %26 %28
%30 = OpAccessChain %24 %19 %31
%32 = OpLoad %15 %30
%33 = OpBitcast %26 %32
%34 = OpAccessChain %24 %18 %27
%35 = OpLoad %15 %34
%36 = OpBitcast %26 %35
%37 = OpAccessChain %24 %18 %31
%38 = OpLoad %15 %37
%39 = OpBitcast %26 %38
%41 = OpAccessChain %40 %14 %27
%42 = OpLoad %5 %41
%43 = OpAccessChain %40 %14 %31
%44 = OpLoad %5 %43
%45 = OpISub %26 %36 %29
%46 = OpISub %26 %39 %33
%47 = OpIAdd %26 %36 %29
%48 = OpIAdd %26 %39 %33
%50 = OpSampledImage %49 %22 %23
%52 = OpCompositeConstruct %51 %42 %44
%53 = OpBitcast %15 %36
%54 = OpBitcast %15 %39
%56 = OpCompositeConstruct %16 %53 %54
%55 = OpImageGather %12 %50 %52 %27 Offset %56
%57 = OpCompositeExtract %5 %55 0
%58 = OpCompositeConstruct %51 %42 %44
%59 = OpBitcast %15 %47
%60 = OpBitcast %15 %48
%62 = OpCompositeConstruct %16 %59 %60
%61 = OpImageGather %12 %50 %58 %27 Offset %62
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeConstruct %51 %42 %44
%65 = OpBitcast %15 %45
%66 = OpBitcast %15 %46
%68 = OpCompositeConstruct %16 %65 %66
%67 = OpImageGather %12 %50 %64 %27 Offset %68
%69 = OpCompositeExtract %5 %67 2
%70 = OpCompositeConstruct %51 %42 %44
%71 = OpBitcast %15 %29
%72 = OpBitcast %15 %33
%74 = OpCompositeConstruct %16 %71 %72
%73 = OpImageGather %12 %50 %70 %27 Offset %74
%75 = OpCompositeExtract %5 %73 3
%77 = OpAccessChain %76 %21 %27
OpStore %77 %57
%78 = OpAccessChain %76 %21 %31
OpStore %78 %63
%79 = OpAccessChain %76 %21 %80
OpStore %79 %69
%81 = OpAccessChain %76 %21 %82
OpStore %81 %75
OpReturn
OpFunctionEnd
#endif
