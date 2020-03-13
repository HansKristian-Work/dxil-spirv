#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _49 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _52 = textureGather(sampler2DShadow(_8, _20), _49, TEXCOORD.z);
    vec3 _61 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _62 = textureGather(sampler2DArrayShadow(_11, _20), _61, TEXCOORD.w);
    vec3 _74 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _75 = textureGather(samplerCubeShadow(_14, _20), _74, TEXCOORD.w);
    vec4 _87 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    vec4 _88 = textureGather(samplerCubeArrayShadow(_17, _20), _87, TEXCOORD.w);
    SV_Target.x = ((_62.x + _52.x) + _75.x) + _88.x;
    SV_Target.y = ((_62.y + _52.y) + _75.y) + _88.y;
    SV_Target.z = ((_62.z + _52.z) + _75.z) + _88.z;
    SV_Target.w = ((_62.w + _52.w) + _75.w) + _88.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 104
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %25 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 6
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 7
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %23 Location 0
OpDecorate %25 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 4
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Output %21
%25 = OpVariable %24 Output
%31 = OpTypePointer Input %5
%33 = OpTypeInt 32 0
%34 = OpConstant %33 0
%37 = OpConstant %33 1
%40 = OpConstant %33 2
%43 = OpConstant %33 3
%45 = OpTypeImage %5 2D 0 0 0 2 Unknown
%46 = OpTypeSampledImage %45
%48 = OpTypeVector %5 2
%50 = OpTypeInt 32 1
%51 = OpConstant %50 0
%57 = OpTypeImage %5 2D 0 1 0 2 Unknown
%58 = OpTypeSampledImage %57
%60 = OpTypeVector %5 3
%71 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%72 = OpTypeSampledImage %71
%84 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%85 = OpTypeSampledImage %84
%97 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %102
%102 = OpLabel
%26 = OpLoad %15 %17
%27 = OpLoad %12 %14
%28 = OpLoad %9 %11
%29 = OpLoad %6 %8
%30 = OpLoad %18 %20
%32 = OpAccessChain %31 %23 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %31 %23 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %31 %23 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %31 %23 %43
%44 = OpLoad %5 %42
%47 = OpSampledImage %46 %29 %30
%49 = OpCompositeConstruct %48 %35 %38
%52 = OpImageDrefGather %21 %47 %49 %41
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%55 = OpCompositeExtract %5 %52 2
%56 = OpCompositeExtract %5 %52 3
%59 = OpSampledImage %58 %28 %30
%61 = OpCompositeConstruct %60 %35 %38 %41
%62 = OpImageDrefGather %21 %59 %61 %44
%63 = OpCompositeExtract %5 %62 0
%64 = OpCompositeExtract %5 %62 1
%65 = OpCompositeExtract %5 %62 2
%66 = OpCompositeExtract %5 %62 3
%67 = OpFAdd %5 %63 %53
%68 = OpFAdd %5 %64 %54
%69 = OpFAdd %5 %65 %55
%70 = OpFAdd %5 %66 %56
%73 = OpSampledImage %72 %27 %30
%74 = OpCompositeConstruct %60 %35 %38 %41
%75 = OpImageDrefGather %21 %73 %74 %44
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpCompositeExtract %5 %75 2
%79 = OpCompositeExtract %5 %75 3
%80 = OpFAdd %5 %67 %76
%81 = OpFAdd %5 %68 %77
%82 = OpFAdd %5 %69 %78
%83 = OpFAdd %5 %70 %79
%86 = OpSampledImage %85 %26 %30
%87 = OpCompositeConstruct %21 %35 %38 %41 %44
%88 = OpImageDrefGather %21 %86 %87 %44
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1
%91 = OpCompositeExtract %5 %88 2
%92 = OpCompositeExtract %5 %88 3
%93 = OpFAdd %5 %80 %89
%94 = OpFAdd %5 %81 %90
%95 = OpFAdd %5 %82 %91
%96 = OpFAdd %5 %83 %92
%98 = OpAccessChain %97 %25 %34
OpStore %98 %93
%99 = OpAccessChain %97 %25 %37
OpStore %99 %94
%100 = OpAccessChain %97 %25 %40
OpStore %100 %95
%101 = OpAccessChain %97 %25 %43
OpStore %101 %96
OpReturn
OpFunctionEnd
#endif
