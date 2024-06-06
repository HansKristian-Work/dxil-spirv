#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 0) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) in float DREF;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = ((vec4(textureGradOffset(sampler1DArrayShadow(_11, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), TEXCOORD.z, TEXCOORD.w, 2)).x + vec4(textureGradOffset(sampler1DShadow(_8, _20), vec2(TEXCOORD.x, DREF), TEXCOORD.z, TEXCOORD.w, 1)).x) + vec4(textureGradOffset(sampler2DShadow(_14, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), DREF), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4))).x) + vec4(textureGradOffset(sampler2DArrayShadow(_17, _20), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), DREF), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5))).x;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %25 "DREF"
OpName %27 "SV_Target"
OpDecorate %8 DescriptorSet 1
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 0
OpDecorate %23 Location 0
OpDecorate %25 Location 1
OpDecorate %27 Location 0
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
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 4
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypePointer Input %5
%25 = OpVariable %24 Input
%26 = OpTypePointer Output %5
%27 = OpVariable %26 Output
%35 = OpTypeInt 32 0
%36 = OpConstant %35 0
%39 = OpConstant %35 1
%42 = OpConstant %35 2
%45 = OpConstant %35 3
%47 = OpTypeImage %5 1D 1 0 0 1 Unknown
%48 = OpTypeSampledImage %47
%50 = OpTypeInt 32 1
%51 = OpConstant %50 1
%55 = OpTypeImage %5 1D 1 1 0 1 Unknown
%56 = OpTypeSampledImage %55
%58 = OpConstant %50 2
%60 = OpTypeVector %5 2
%65 = OpTypeImage %5 2D 1 0 0 1 Unknown
%66 = OpTypeSampledImage %65
%68 = OpConstant %50 -3
%69 = OpConstant %50 -4
%74 = OpTypeVector %50 2
%75 = OpConstantComposite %74 %68 %69
%79 = OpTypeImage %5 2D 1 1 0 1 Unknown
%80 = OpTypeSampledImage %79
%82 = OpConstant %50 4
%83 = OpConstant %50 -5
%85 = OpTypeVector %5 3
%89 = OpConstantComposite %74 %82 %83
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %93
%93 = OpLabel
%28 = OpLoad %15 %17
%29 = OpLoad %12 %14
%30 = OpLoad %9 %11
%31 = OpLoad %6 %8
%32 = OpLoad %18 %20
%33 = OpLoad %5 %25
%34 = OpAccessChain %24 %23 %36
%37 = OpLoad %5 %34
%38 = OpAccessChain %24 %23 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %24 %23 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %24 %23 %45
%46 = OpLoad %5 %44
%49 = OpSampledImage %48 %31 %32
%52 = OpImageSampleDrefExplicitLod %5 %49 %37 %33 Grad|ConstOffset %43 %46 %51
%53 = OpCompositeConstruct %21 %52 %52 %52 %52
%54 = OpCompositeExtract %5 %53 0
%57 = OpSampledImage %56 %30 %32
%61 = OpCompositeConstruct %60 %37 %40
%59 = OpImageSampleDrefExplicitLod %5 %57 %61 %33 Grad|ConstOffset %43 %46 %58
%62 = OpCompositeConstruct %21 %59 %59 %59 %59
%63 = OpCompositeExtract %5 %62 0
%64 = OpFAdd %5 %63 %54
%67 = OpSampledImage %66 %29 %32
%71 = OpCompositeConstruct %60 %37 %40
%72 = OpCompositeConstruct %60 %43 %43
%73 = OpCompositeConstruct %60 %46 %46
%70 = OpImageSampleDrefExplicitLod %5 %67 %71 %33 Grad|ConstOffset %72 %73 %75
%76 = OpCompositeConstruct %21 %70 %70 %70 %70
%77 = OpCompositeExtract %5 %76 0
%78 = OpFAdd %5 %64 %77
%81 = OpSampledImage %80 %28 %32
%86 = OpCompositeConstruct %85 %37 %40 %43
%87 = OpCompositeConstruct %60 %43 %43
%88 = OpCompositeConstruct %60 %46 %46
%84 = OpImageSampleDrefExplicitLod %5 %81 %86 %33 Grad|ConstOffset %87 %88 %89
%90 = OpCompositeConstruct %21 %84 %84 %84 %84
%91 = OpCompositeExtract %5 %90 0
%92 = OpFAdd %5 %78 %91
OpStore %27 %92
OpReturn
OpFunctionEnd
#endif
