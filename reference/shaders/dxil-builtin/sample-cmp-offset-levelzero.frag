#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 0) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    float _87 = ((vec4(textureLodOffset(sampler1DArrayShadow(_11, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0, 2)).x + vec4(textureLodOffset(sampler1DShadow(_8, _20), vec2(TEXCOORD.x, TEXCOORD.w), 0.0, 1)).x) + vec4(textureLodOffset(sampler2DShadow(_14, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0.0, ivec2(-3, -2))).x) + vec4(textureGradOffset(sampler2DArrayShadow(_17, _20), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), vec2(0.0), vec2(0.0), ivec2(4, 5))).x;
    SV_Target.x = _87;
    SV_Target.y = _87;
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
OpEntryPoint Fragment %3 "main" %23 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %26 "SV_Target"
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
OpDecorate %26 Location 0
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
%24 = OpTypeVector %5 2
%25 = OpTypePointer Output %24
%26 = OpVariable %25 Output
%32 = OpTypePointer Input %5
%34 = OpTypeInt 32 0
%35 = OpConstant %34 0
%38 = OpConstant %34 1
%41 = OpConstant %34 2
%44 = OpConstant %34 3
%46 = OpTypeImage %5 1D 1 0 0 1 Unknown
%47 = OpTypeSampledImage %46
%49 = OpTypeInt 32 1
%50 = OpConstant %49 1
%51 = OpConstant %5 0
%55 = OpTypeImage %5 1D 1 1 0 1 Unknown
%56 = OpTypeSampledImage %55
%58 = OpConstant %49 2
%64 = OpTypeImage %5 2D 1 0 0 1 Unknown
%65 = OpTypeSampledImage %64
%67 = OpConstant %49 -3
%68 = OpConstant %49 -2
%71 = OpTypeVector %49 2
%72 = OpConstantComposite %71 %67 %68
%76 = OpTypeImage %5 2D 1 1 0 1 Unknown
%77 = OpTypeSampledImage %76
%79 = OpConstant %49 4
%80 = OpConstant %49 5
%82 = OpTypeVector %5 3
%84 = OpConstantComposite %71 %79 %80
%88 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%27 = OpLoad %15 %17
%28 = OpLoad %12 %14
%29 = OpLoad %9 %11
%30 = OpLoad %6 %8
%31 = OpLoad %18 %20
%33 = OpAccessChain %32 %23 %35
%36 = OpLoad %5 %33
%37 = OpAccessChain %32 %23 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %32 %23 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %32 %23 %44
%45 = OpLoad %5 %43
%48 = OpSampledImage %47 %30 %31
%52 = OpImageSampleDrefExplicitLod %5 %48 %36 %45 Lod|ConstOffset %51 %50
%53 = OpCompositeConstruct %21 %52 %52 %52 %52
%54 = OpCompositeExtract %5 %53 0
%57 = OpSampledImage %56 %29 %31
%60 = OpCompositeConstruct %24 %36 %39
%59 = OpImageSampleDrefExplicitLod %5 %57 %60 %45 Lod|ConstOffset %51 %58
%61 = OpCompositeConstruct %21 %59 %59 %59 %59
%62 = OpCompositeExtract %5 %61 0
%63 = OpFAdd %5 %62 %54
%66 = OpSampledImage %65 %28 %31
%70 = OpCompositeConstruct %24 %36 %39
%69 = OpImageSampleDrefExplicitLod %5 %66 %70 %45 Lod|ConstOffset %51 %72
%73 = OpCompositeConstruct %21 %69 %69 %69 %69
%74 = OpCompositeExtract %5 %73 0
%75 = OpFAdd %5 %63 %74
%78 = OpSampledImage %77 %27 %31
%83 = OpCompositeConstruct %82 %36 %39 %42
%81 = OpImageSampleDrefExplicitLod %5 %78 %83 %45 Lod|ConstOffset %51 %84
%85 = OpCompositeConstruct %21 %81 %81 %81 %81
%86 = OpCompositeExtract %5 %85 0
%87 = OpFAdd %5 %75 %86
%89 = OpAccessChain %88 %26 %35
OpStore %89 %87
%90 = OpAccessChain %88 %26 %38
OpStore %90 %87
OpReturn
OpFunctionEnd
#endif
