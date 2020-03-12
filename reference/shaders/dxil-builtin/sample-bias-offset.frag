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
    vec4 _55 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1, TEXCOORD.w);
    vec4 _62 = textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2, TEXCOORD.w);
    float _64 = _62.x;
    vec4 _71 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(2, 3), TEXCOORD.w);
    vec4 _84 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(-1, -3), TEXCOORD.w);
    float _88 = _84.x;
    vec4 _96 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(-4, -5, 3), TEXCOORD.w);
    SV_Target.x = (((_64 + _55.x) + _71.x) + _88) + _96.x;
    SV_Target.y = (((_64 + _55.y) + _71.y) + _88) + _96.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 109
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
%48 = OpConstant %38 3
%50 = OpTypeImage %5 1D 0 0 0 2 Unknown
%51 = OpTypeSampledImage %50
%53 = OpTypeInt 32 1
%54 = OpConstant %53 1
%58 = OpTypeImage %5 1D 0 1 0 2 Unknown
%59 = OpTypeSampledImage %58
%61 = OpConstant %53 2
%67 = OpTypeImage %5 2D 0 0 0 2 Unknown
%68 = OpTypeSampledImage %67
%70 = OpConstant %53 3
%73 = OpTypeVector %53 2
%74 = OpConstantComposite %73 %61 %70
%79 = OpTypeImage %5 2D 0 1 0 2 Unknown
%80 = OpTypeSampledImage %79
%82 = OpConstant %53 -1
%83 = OpConstant %53 -3
%85 = OpTypeVector %5 3
%87 = OpConstantComposite %73 %82 %83
%91 = OpTypeImage %5 3D 0 0 0 2 Unknown
%92 = OpTypeSampledImage %91
%94 = OpConstant %53 -4
%95 = OpConstant %53 -5
%98 = OpTypeVector %53 3
%99 = OpConstantComposite %98 %94 %95 %70
%104 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %107
%107 = OpLabel
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
%52 = OpSampledImage %51 %34 %35
%55 = OpImageSampleImplicitLod %24 %52 %40 Bias|ConstOffset %49 %54
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1
%60 = OpSampledImage %59 %33 %35
%63 = OpCompositeConstruct %27 %40 %43
%62 = OpImageSampleImplicitLod %24 %60 %63 Bias|ConstOffset %49 %61
%64 = OpCompositeExtract %5 %62 0
%65 = OpFAdd %5 %64 %56
%66 = OpFAdd %5 %64 %57
%69 = OpSampledImage %68 %32 %35
%72 = OpCompositeConstruct %27 %40 %43
%71 = OpImageSampleImplicitLod %24 %69 %72 Bias|ConstOffset %49 %74
%75 = OpCompositeExtract %5 %71 0
%76 = OpCompositeExtract %5 %71 1
%77 = OpFAdd %5 %65 %75
%78 = OpFAdd %5 %66 %76
%81 = OpSampledImage %80 %31 %35
%86 = OpCompositeConstruct %85 %40 %43 %46
%84 = OpImageSampleImplicitLod %24 %81 %86 Bias|ConstOffset %49 %87
%88 = OpCompositeExtract %5 %84 0
%89 = OpFAdd %5 %77 %88
%90 = OpFAdd %5 %78 %88
%93 = OpSampledImage %92 %30 %35
%97 = OpCompositeConstruct %85 %40 %43 %46
%96 = OpImageSampleImplicitLod %24 %93 %97 Bias|ConstOffset %49 %99
%100 = OpCompositeExtract %5 %96 0
%101 = OpCompositeExtract %5 %96 1
%102 = OpFAdd %5 %89 %100
%103 = OpFAdd %5 %90 %101
%105 = OpAccessChain %104 %29 %39
OpStore %105 %102
%106 = OpAccessChain %104 %29 %42
OpStore %106 %103
OpReturn
OpFunctionEnd
#endif
