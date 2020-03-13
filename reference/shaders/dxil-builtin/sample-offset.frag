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
    vec4 _52 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1);
    vec4 _59 = textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2);
    float _61 = _59.x;
    vec4 _69 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(3, 4));
    vec4 _82 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(5, 6));
    float _86 = _82.x;
    vec4 _93 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(7, 6, 5));
    SV_Target.x = (((_61 + _52.x) + _69.x) + _86) + _93.x;
    SV_Target.y = (((_61 + _52.y) + _69.y) + _86) + _93.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 106
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
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
%47 = OpTypeImage %5 1D 0 0 0 2 Unknown
%48 = OpTypeSampledImage %47
%50 = OpTypeInt 32 1
%51 = OpConstant %50 1
%55 = OpTypeImage %5 1D 0 1 0 2 Unknown
%56 = OpTypeSampledImage %55
%58 = OpConstant %50 2
%64 = OpTypeImage %5 2D 0 0 0 2 Unknown
%65 = OpTypeSampledImage %64
%67 = OpConstant %50 3
%68 = OpConstant %50 4
%71 = OpTypeVector %50 2
%72 = OpConstantComposite %71 %67 %68
%77 = OpTypeImage %5 2D 0 1 0 2 Unknown
%78 = OpTypeSampledImage %77
%80 = OpConstant %50 5
%81 = OpConstant %50 6
%83 = OpTypeVector %5 3
%85 = OpConstantComposite %71 %80 %81
%89 = OpTypeImage %5 3D 0 0 0 2 Unknown
%90 = OpTypeSampledImage %89
%92 = OpConstant %50 7
%95 = OpTypeVector %50 3
%96 = OpConstantComposite %95 %92 %81 %80
%101 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %104
%104 = OpLabel
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
%49 = OpSampledImage %48 %34 %35
%52 = OpImageSampleImplicitLod %24 %49 %40 ConstOffset %51
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%57 = OpSampledImage %56 %33 %35
%60 = OpCompositeConstruct %27 %40 %43
%59 = OpImageSampleImplicitLod %24 %57 %60 ConstOffset %58
%61 = OpCompositeExtract %5 %59 0
%62 = OpFAdd %5 %61 %53
%63 = OpFAdd %5 %61 %54
%66 = OpSampledImage %65 %32 %35
%70 = OpCompositeConstruct %27 %40 %43
%69 = OpImageSampleImplicitLod %24 %66 %70 ConstOffset %72
%73 = OpCompositeExtract %5 %69 0
%74 = OpCompositeExtract %5 %69 1
%75 = OpFAdd %5 %62 %73
%76 = OpFAdd %5 %63 %74
%79 = OpSampledImage %78 %31 %35
%84 = OpCompositeConstruct %83 %40 %43 %46
%82 = OpImageSampleImplicitLod %24 %79 %84 ConstOffset %85
%86 = OpCompositeExtract %5 %82 0
%87 = OpFAdd %5 %75 %86
%88 = OpFAdd %5 %76 %86
%91 = OpSampledImage %90 %30 %35
%94 = OpCompositeConstruct %83 %40 %43 %46
%93 = OpImageSampleImplicitLod %24 %91 %94 ConstOffset %96
%97 = OpCompositeExtract %5 %93 0
%98 = OpCompositeExtract %5 %93 1
%99 = OpFAdd %5 %87 %97
%100 = OpFAdd %5 %88 %98
%102 = OpAccessChain %101 %29 %39
OpStore %102 %99
%103 = OpAccessChain %101 %29 %42
OpStore %103 %100
OpReturn
OpFunctionEnd
#endif
