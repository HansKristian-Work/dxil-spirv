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
    float _86 = ((vec4(textureOffset(sampler1DArrayShadow(_11, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 2)).x + vec4(textureOffset(sampler1DShadow(_8, _20), vec2(TEXCOORD.x, TEXCOORD.w), 1)).x) + vec4(textureOffset(sampler2DShadow(_14, _20), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), ivec2(-3, -2))).x) + vec4(textureOffset(sampler2DArrayShadow(_17, _20), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), ivec2(4, 5))).x;
    SV_Target.x = _86;
    SV_Target.y = _86;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
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
%46 = OpTypeImage %5 1D 1 0 0 2 Unknown
%47 = OpTypeSampledImage %46
%49 = OpTypeInt 32 1
%50 = OpConstant %49 1
%54 = OpTypeImage %5 1D 1 1 0 2 Unknown
%55 = OpTypeSampledImage %54
%57 = OpConstant %49 2
%63 = OpTypeImage %5 2D 1 0 0 2 Unknown
%64 = OpTypeSampledImage %63
%66 = OpConstant %49 -3
%67 = OpConstant %49 -2
%70 = OpTypeVector %49 2
%71 = OpConstantComposite %70 %66 %67
%75 = OpTypeImage %5 2D 1 1 0 2 Unknown
%76 = OpTypeSampledImage %75
%78 = OpConstant %49 4
%79 = OpConstant %49 5
%81 = OpTypeVector %5 3
%83 = OpConstantComposite %70 %78 %79
%87 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
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
%51 = OpImageSampleDrefImplicitLod %5 %48 %36 %45 ConstOffset %50
%52 = OpCompositeConstruct %21 %51 %51 %51 %51
%53 = OpCompositeExtract %5 %52 0
%56 = OpSampledImage %55 %29 %31
%59 = OpCompositeConstruct %24 %36 %39
%58 = OpImageSampleDrefImplicitLod %5 %56 %59 %45 ConstOffset %57
%60 = OpCompositeConstruct %21 %58 %58 %58 %58
%61 = OpCompositeExtract %5 %60 0
%62 = OpFAdd %5 %61 %53
%65 = OpSampledImage %64 %28 %31
%69 = OpCompositeConstruct %24 %36 %39
%68 = OpImageSampleDrefImplicitLod %5 %65 %69 %45 ConstOffset %71
%72 = OpCompositeConstruct %21 %68 %68 %68 %68
%73 = OpCompositeExtract %5 %72 0
%74 = OpFAdd %5 %62 %73
%77 = OpSampledImage %76 %27 %31
%82 = OpCompositeConstruct %81 %36 %39 %42
%80 = OpImageSampleDrefImplicitLod %5 %77 %82 %45 ConstOffset %83
%84 = OpCompositeConstruct %21 %80 %80 %80 %80
%85 = OpCompositeExtract %5 %84 0
%86 = OpFAdd %5 %74 %85
%88 = OpAccessChain %87 %26 %35
OpStore %88 %86
%89 = OpAccessChain %87 %26 %38
OpStore %89 %86
OpReturn
OpFunctionEnd
#endif
