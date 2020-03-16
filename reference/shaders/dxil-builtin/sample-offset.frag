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
    vec4 _51 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1);
    vec4 _57 = textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2);
    float _59 = _57.x;
    vec4 _66 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(3, 4));
    vec4 _78 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(5, 6));
    float _82 = _78.x;
    vec4 _88 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(7, 6, 5));
    SV_Target.x = (((_59 + _51.x) + _66.x) + _82) + _88.x;
    SV_Target.y = (((_59 + _51.y) + _66.y) + _82) + _88.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 101
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
%47 = OpTypeSampledImage %6
%49 = OpTypeInt 32 1
%50 = OpConstant %49 1
%54 = OpTypeSampledImage %9
%56 = OpConstant %49 2
%62 = OpTypeSampledImage %12
%64 = OpConstant %49 3
%65 = OpConstant %49 4
%68 = OpTypeVector %49 2
%69 = OpConstantComposite %68 %64 %65
%74 = OpTypeSampledImage %15
%76 = OpConstant %49 5
%77 = OpConstant %49 6
%79 = OpTypeVector %5 3
%81 = OpConstantComposite %68 %76 %77
%85 = OpTypeSampledImage %18
%87 = OpConstant %49 7
%90 = OpTypeVector %49 3
%91 = OpConstantComposite %90 %87 %77 %76
%96 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %99
%99 = OpLabel
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
%48 = OpSampledImage %47 %34 %35
%51 = OpImageSampleImplicitLod %24 %48 %40 ConstOffset %50
%52 = OpCompositeExtract %5 %51 0
%53 = OpCompositeExtract %5 %51 1
%55 = OpSampledImage %54 %33 %35
%58 = OpCompositeConstruct %27 %40 %43
%57 = OpImageSampleImplicitLod %24 %55 %58 ConstOffset %56
%59 = OpCompositeExtract %5 %57 0
%60 = OpFAdd %5 %59 %52
%61 = OpFAdd %5 %59 %53
%63 = OpSampledImage %62 %32 %35
%67 = OpCompositeConstruct %27 %40 %43
%66 = OpImageSampleImplicitLod %24 %63 %67 ConstOffset %69
%70 = OpCompositeExtract %5 %66 0
%71 = OpCompositeExtract %5 %66 1
%72 = OpFAdd %5 %60 %70
%73 = OpFAdd %5 %61 %71
%75 = OpSampledImage %74 %31 %35
%80 = OpCompositeConstruct %79 %40 %43 %46
%78 = OpImageSampleImplicitLod %24 %75 %80 ConstOffset %81
%82 = OpCompositeExtract %5 %78 0
%83 = OpFAdd %5 %72 %82
%84 = OpFAdd %5 %73 %82
%86 = OpSampledImage %85 %30 %35
%89 = OpCompositeConstruct %79 %40 %43 %46
%88 = OpImageSampleImplicitLod %24 %86 %89 ConstOffset %91
%92 = OpCompositeExtract %5 %88 0
%93 = OpCompositeExtract %5 %88 1
%94 = OpFAdd %5 %83 %92
%95 = OpFAdd %5 %84 %93
%97 = OpAccessChain %96 %29 %39
OpStore %97 %94
%98 = OpAccessChain %96 %29 %42
OpStore %98 %95
OpReturn
OpFunctionEnd
#endif
