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
    vec4 _54 = textureLodOffset(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.w, 1);
    vec4 _60 = textureLodOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w, 2);
    float _62 = _60.x;
    vec4 _68 = textureLodOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w, ivec2(2, 3));
    vec4 _80 = textureLodOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w, ivec2(-1, -3));
    float _84 = _80.x;
    vec4 _91 = textureLodOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w, ivec3(-4, -5, 3));
    SV_Target.x = (((_62 + _54.x) + _68.x) + _84) + _91.x;
    SV_Target.y = (((_62 + _54.y) + _68.y) + _84) + _91.y;
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
%65 = OpTypeSampledImage %12
%67 = OpConstant %52 3
%70 = OpTypeVector %52 2
%71 = OpConstantComposite %70 %59 %67
%76 = OpTypeSampledImage %15
%78 = OpConstant %52 -1
%79 = OpConstant %52 -3
%81 = OpTypeVector %5 3
%83 = OpConstantComposite %70 %78 %79
%87 = OpTypeSampledImage %18
%89 = OpConstant %52 -4
%90 = OpConstant %52 -5
%93 = OpTypeVector %52 3
%94 = OpConstantComposite %93 %89 %90 %67
%99 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %102
%102 = OpLabel
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
%54 = OpImageSampleExplicitLod %24 %51 %40 Lod|ConstOffset %49 %53
%55 = OpCompositeExtract %5 %54 0
%56 = OpCompositeExtract %5 %54 1
%58 = OpSampledImage %57 %33 %35
%61 = OpCompositeConstruct %27 %40 %43
%60 = OpImageSampleExplicitLod %24 %58 %61 Lod|ConstOffset %49 %59
%62 = OpCompositeExtract %5 %60 0
%63 = OpFAdd %5 %62 %55
%64 = OpFAdd %5 %62 %56
%66 = OpSampledImage %65 %32 %35
%69 = OpCompositeConstruct %27 %40 %43
%68 = OpImageSampleExplicitLod %24 %66 %69 Lod|ConstOffset %49 %71
%72 = OpCompositeExtract %5 %68 0
%73 = OpCompositeExtract %5 %68 1
%74 = OpFAdd %5 %63 %72
%75 = OpFAdd %5 %64 %73
%77 = OpSampledImage %76 %31 %35
%82 = OpCompositeConstruct %81 %40 %43 %46
%80 = OpImageSampleExplicitLod %24 %77 %82 Lod|ConstOffset %49 %83
%84 = OpCompositeExtract %5 %80 0
%85 = OpFAdd %5 %74 %84
%86 = OpFAdd %5 %75 %84
%88 = OpSampledImage %87 %30 %35
%92 = OpCompositeConstruct %81 %40 %43 %46
%91 = OpImageSampleExplicitLod %24 %88 %92 Lod|ConstOffset %49 %94
%95 = OpCompositeExtract %5 %91 0
%96 = OpCompositeExtract %5 %91 1
%97 = OpFAdd %5 %85 %95
%98 = OpFAdd %5 %86 %96
%100 = OpAccessChain %99 %29 %39
OpStore %100 %97
%101 = OpAccessChain %99 %29 %42
OpStore %101 %98
OpReturn
OpFunctionEnd
#endif
