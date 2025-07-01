#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 0, binding = 0) uniform sampler _23;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _54 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1, TEXCOORD.w);
    vec4 _66 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(2, 3), TEXCOORD.w);
    vec4 _85 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-4, -5, 3), TEXCOORD.w);
    float _91 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(-1, -3), TEXCOORD.w).x + textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2, TEXCOORD.w).x;
    SV_Target.x = ((_66.x + _54.x) + _91) + _85.x;
    SV_Target.y = ((_66.y + _54.y) + _91) + _85.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 103
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %29 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %26 Location 0
OpDecorate %29 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 1D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 2D 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 2D 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeImage %5 3D 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeSampler
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeVector %5 4
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%27 = OpTypeVector %5 2
%28 = OpTypePointer Output %27
%29 = OpVariable %28 Output
%36 = OpTypePointer Input %5
%38 = OpTypeInt 32 0
%39 = OpConstant %38 0
%42 = OpConstant %38 1
%45 = OpConstant %38 2
%48 = OpConstant %38 3
%50 = OpTypeSampledImage %6
%52 = OpTypeInt 32 1
%53 = OpConstant %52 1
%57 = OpTypeSampledImage %9
%59 = OpConstant %52 2
%63 = OpTypeSampledImage %12
%65 = OpConstant %52 3
%68 = OpTypeVector %52 2
%69 = OpConstantComposite %68 %59 %65
%72 = OpTypeSampledImage %15
%74 = OpConstant %52 -1
%75 = OpConstant %52 -3
%77 = OpTypeVector %5 3
%79 = OpConstantComposite %68 %74 %75
%81 = OpTypeSampledImage %18
%83 = OpConstant %52 -4
%84 = OpConstant %52 -5
%87 = OpTypeVector %52 3
%88 = OpConstantComposite %87 %83 %84 %65
%98 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %101
%101 = OpLabel
%30 = OpLoad %18 %20
%31 = OpLoad %15 %17
%32 = OpLoad %12 %14
%33 = OpLoad %9 %11
%34 = OpLoad %6 %8
%35 = OpLoad %21 %23
%37 = OpAccessChain %36 %26 %39
%40 = OpLoad %5 %37
%41 = OpAccessChain %36 %26 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %36 %26 %45
%46 = OpLoad %5 %44
%47 = OpAccessChain %36 %26 %48
%49 = OpLoad %5 %47
%51 = OpSampledImage %50 %34 %35
%54 = OpImageSampleImplicitLod %24 %51 %40 Bias|ConstOffset %49 %53
%55 = OpCompositeExtract %5 %54 0
%56 = OpCompositeExtract %5 %54 1
%58 = OpSampledImage %57 %33 %35
%61 = OpCompositeConstruct %27 %40 %43
%60 = OpImageSampleImplicitLod %24 %58 %61 Bias|ConstOffset %49 %59
%62 = OpCompositeExtract %5 %60 0
%64 = OpSampledImage %63 %32 %35
%67 = OpCompositeConstruct %27 %40 %43
%66 = OpImageSampleImplicitLod %24 %64 %67 Bias|ConstOffset %49 %69
%70 = OpCompositeExtract %5 %66 0
%71 = OpCompositeExtract %5 %66 1
%73 = OpSampledImage %72 %31 %35
%78 = OpCompositeConstruct %77 %40 %43 %46
%76 = OpImageSampleImplicitLod %24 %73 %78 Bias|ConstOffset %49 %79
%80 = OpCompositeExtract %5 %76 0
%82 = OpSampledImage %81 %30 %35
%86 = OpCompositeConstruct %77 %40 %43 %46
%85 = OpImageSampleImplicitLod %24 %82 %86 Bias|ConstOffset %49 %88
%89 = OpCompositeExtract %5 %85 0
%90 = OpCompositeExtract %5 %85 1
%91 = OpFAdd %5 %80 %62
%92 = OpFAdd %5 %70 %55
%93 = OpFAdd %5 %92 %91
%94 = OpFAdd %5 %93 %89
%95 = OpFAdd %5 %71 %56
%96 = OpFAdd %5 %95 %91
%97 = OpFAdd %5 %96 %90
%99 = OpAccessChain %98 %29 %39
OpStore %99 %94
%100 = OpAccessChain %98 %29 %42
OpStore %100 %97
OpReturn
OpFunctionEnd
#endif
