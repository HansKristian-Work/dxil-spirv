#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 5) uniform textureCube _20;
layout(set = 1, binding = 6) uniform textureCubeArray _23;
layout(set = 0, binding = 0) uniform samplerShadow _26;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _98 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    float _101 = ((((vec4(texture(sampler1DArrayShadow(_11, _26), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w))).x + vec4(texture(sampler1DShadow(_8, _26), vec2(TEXCOORD.x, TEXCOORD.w))).x) + vec4(texture(sampler2DShadow(_14, _26), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w))).x) + vec4(texture(sampler2DArrayShadow(_17, _26), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w))).x) + vec4(texture(samplerCubeShadow(_20, _26), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w))).x) + vec4(texture(samplerCubeArrayShadow(_23, _26), _98, TEXCOORD.w)).x;
    SV_Target.x = _101;
    SV_Target.y = _101;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 107
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %29 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %29 "TEXCOORD"
OpName %32 "SV_Target"
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
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 6
OpDecorate %26 DescriptorSet 0
OpDecorate %26 Binding 0
OpDecorate %29 Location 0
OpDecorate %32 Location 0
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
%21 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeSampler
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeVector %5 4
%28 = OpTypePointer Input %27
%29 = OpVariable %28 Input
%30 = OpTypeVector %5 2
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%40 = OpTypePointer Input %5
%42 = OpTypeInt 32 0
%43 = OpConstant %42 0
%46 = OpConstant %42 1
%49 = OpConstant %42 2
%52 = OpConstant %42 3
%54 = OpTypeImage %5 1D 1 0 0 1 Unknown
%55 = OpTypeSampledImage %54
%57 = OpConstant %5 0
%61 = OpTypeImage %5 1D 1 1 0 1 Unknown
%62 = OpTypeSampledImage %61
%69 = OpTypeImage %5 2D 1 0 0 1 Unknown
%70 = OpTypeSampledImage %69
%77 = OpTypeImage %5 2D 1 1 0 1 Unknown
%78 = OpTypeSampledImage %77
%81 = OpTypeVector %5 3
%86 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%87 = OpTypeSampledImage %86
%94 = OpTypeImage %5 Cube 1 1 0 1 Unknown
%95 = OpTypeSampledImage %94
%102 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %105
%105 = OpLabel
%33 = OpLoad %21 %23
%34 = OpLoad %18 %20
%35 = OpLoad %15 %17
%36 = OpLoad %12 %14
%37 = OpLoad %9 %11
%38 = OpLoad %6 %8
%39 = OpLoad %24 %26
%41 = OpAccessChain %40 %29 %43
%44 = OpLoad %5 %41
%45 = OpAccessChain %40 %29 %46
%47 = OpLoad %5 %45
%48 = OpAccessChain %40 %29 %49
%50 = OpLoad %5 %48
%51 = OpAccessChain %40 %29 %52
%53 = OpLoad %5 %51
%56 = OpSampledImage %55 %38 %39
%58 = OpImageSampleDrefImplicitLod %5 %56 %44 %53 None
%59 = OpCompositeConstruct %27 %58 %58 %58 %58
%60 = OpCompositeExtract %5 %59 0
%63 = OpSampledImage %62 %37 %39
%65 = OpCompositeConstruct %30 %44 %47
%64 = OpImageSampleDrefImplicitLod %5 %63 %65 %53 None
%66 = OpCompositeConstruct %27 %64 %64 %64 %64
%67 = OpCompositeExtract %5 %66 0
%68 = OpFAdd %5 %67 %60
%71 = OpSampledImage %70 %36 %39
%73 = OpCompositeConstruct %30 %44 %47
%72 = OpImageSampleDrefImplicitLod %5 %71 %73 %53 None
%74 = OpCompositeConstruct %27 %72 %72 %72 %72
%75 = OpCompositeExtract %5 %74 0
%76 = OpFAdd %5 %68 %75
%79 = OpSampledImage %78 %35 %39
%82 = OpCompositeConstruct %81 %44 %47 %50
%80 = OpImageSampleDrefImplicitLod %5 %79 %82 %53 None
%83 = OpCompositeConstruct %27 %80 %80 %80 %80
%84 = OpCompositeExtract %5 %83 0
%85 = OpFAdd %5 %76 %84
%88 = OpSampledImage %87 %34 %39
%90 = OpCompositeConstruct %81 %44 %47 %50
%89 = OpImageSampleDrefImplicitLod %5 %88 %90 %53 None
%91 = OpCompositeConstruct %27 %89 %89 %89 %89
%92 = OpCompositeExtract %5 %91 0
%93 = OpFAdd %5 %85 %92
%96 = OpSampledImage %95 %33 %39
%98 = OpCompositeConstruct %27 %44 %47 %50 %53
%97 = OpImageSampleDrefImplicitLod %5 %96 %98 %53 None
%99 = OpCompositeConstruct %27 %97 %97 %97 %97
%100 = OpCompositeExtract %5 %99 0
%101 = OpFAdd %5 %93 %100
%103 = OpAccessChain %102 %32 %43
OpStore %103 %101
%104 = OpAccessChain %102 %32 %46
OpStore %104 %101
OpReturn
OpFunctionEnd
#endif
