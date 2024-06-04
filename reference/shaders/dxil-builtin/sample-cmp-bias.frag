#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 5) uniform textureCube _20;
layout(set = 0, binding = 0) uniform samplerShadow _23;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) in float DREF;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = (((vec4(texture(sampler1DArrayShadow(_11, _23), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), TEXCOORD.w)).x + vec4(texture(sampler1DShadow(_8, _23), vec2(TEXCOORD.x, DREF), TEXCOORD.w)).x) + vec4(texture(sampler2DShadow(_14, _23), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), TEXCOORD.w)).x) + vec4(texture(sampler2DArrayShadow(_17, _23), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DREF), TEXCOORD.w)).x) + vec4(texture(samplerCubeShadow(_20, _23), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DREF), TEXCOORD.w)).x;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %28 %30
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %28 "DREF"
OpName %30 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 1
OpDecorate %20 Binding 5
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %26 Location 0
OpDecorate %28 Location 1
OpDecorate %30 Location 0
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
%18 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeSampler
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeVector %5 4
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%27 = OpTypePointer Input %5
%28 = OpVariable %27 Input
%29 = OpTypePointer Output %5
%30 = OpVariable %29 Output
%39 = OpTypeInt 32 0
%40 = OpConstant %39 0
%43 = OpConstant %39 1
%46 = OpConstant %39 2
%49 = OpConstant %39 3
%51 = OpTypeImage %5 1D 1 0 0 1 Unknown
%52 = OpTypeSampledImage %51
%57 = OpTypeImage %5 1D 1 1 0 1 Unknown
%58 = OpTypeSampledImage %57
%61 = OpTypeVector %5 2
%66 = OpTypeImage %5 2D 1 0 0 1 Unknown
%67 = OpTypeSampledImage %66
%74 = OpTypeImage %5 2D 1 1 0 1 Unknown
%75 = OpTypeSampledImage %74
%78 = OpTypeVector %5 3
%83 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%84 = OpTypeSampledImage %83
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%31 = OpLoad %18 %20
%32 = OpLoad %15 %17
%33 = OpLoad %12 %14
%34 = OpLoad %9 %11
%35 = OpLoad %6 %8
%36 = OpLoad %21 %23
%37 = OpLoad %5 %28
%38 = OpAccessChain %27 %26 %40
%41 = OpLoad %5 %38
%42 = OpAccessChain %27 %26 %43
%44 = OpLoad %5 %42
%45 = OpAccessChain %27 %26 %46
%47 = OpLoad %5 %45
%48 = OpAccessChain %27 %26 %49
%50 = OpLoad %5 %48
%53 = OpSampledImage %52 %35 %36
%54 = OpImageSampleDrefImplicitLod %5 %53 %41 %37 Bias %50
%55 = OpCompositeConstruct %24 %54 %54 %54 %54
%56 = OpCompositeExtract %5 %55 0
%59 = OpSampledImage %58 %34 %36
%62 = OpCompositeConstruct %61 %41 %44
%60 = OpImageSampleDrefImplicitLod %5 %59 %62 %37 Bias %50
%63 = OpCompositeConstruct %24 %60 %60 %60 %60
%64 = OpCompositeExtract %5 %63 0
%65 = OpFAdd %5 %64 %56
%68 = OpSampledImage %67 %33 %36
%70 = OpCompositeConstruct %61 %41 %44
%69 = OpImageSampleDrefImplicitLod %5 %68 %70 %37 Bias %50
%71 = OpCompositeConstruct %24 %69 %69 %69 %69
%72 = OpCompositeExtract %5 %71 0
%73 = OpFAdd %5 %65 %72
%76 = OpSampledImage %75 %32 %36
%79 = OpCompositeConstruct %78 %41 %44 %47
%77 = OpImageSampleDrefImplicitLod %5 %76 %79 %37 Bias %50
%80 = OpCompositeConstruct %24 %77 %77 %77 %77
%81 = OpCompositeExtract %5 %80 0
%82 = OpFAdd %5 %73 %81
%85 = OpSampledImage %84 %31 %36
%87 = OpCompositeConstruct %78 %41 %44 %47
%86 = OpImageSampleDrefImplicitLod %5 %85 %87 %37 Bias %50
%88 = OpCompositeConstruct %24 %86 %86 %86 %86
%89 = OpCompositeExtract %5 %88 0
%90 = OpFAdd %5 %82 %89
OpStore %30 %90
OpReturn
OpFunctionEnd
#endif
