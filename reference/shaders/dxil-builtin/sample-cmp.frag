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
    vec4 _101 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    float _104 = ((((vec4(textureOffset(sampler1DArrayShadow(_11, _26), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), 0)).x + vec4(textureOffset(sampler1DShadow(_8, _26), vec2(TEXCOORD.x, TEXCOORD.w), 0)).x) + vec4(textureOffset(sampler2DShadow(_14, _26), vec3(vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w), ivec2(0))).x) + vec4(textureOffset(sampler2DArrayShadow(_17, _26), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w), ivec2(0))).x) + vec4(texture(samplerCubeShadow(_20, _26), vec4(vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w))).x) + vec4(texture(samplerCubeArrayShadow(_23, _26), _101, TEXCOORD.w)).x;
    SV_Target.x = _104;
    SV_Target.y = _104;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 110
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
%57 = OpTypeInt 32 1
%58 = OpConstant %57 0
%62 = OpTypeImage %5 1D 1 1 0 1 Unknown
%63 = OpTypeSampledImage %62
%70 = OpTypeImage %5 2D 1 0 0 1 Unknown
%71 = OpTypeSampledImage %70
%75 = OpTypeVector %57 2
%76 = OpConstantComposite %75 %58 %58
%80 = OpTypeImage %5 2D 1 1 0 1 Unknown
%81 = OpTypeSampledImage %80
%84 = OpTypeVector %5 3
%89 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%90 = OpTypeSampledImage %89
%97 = OpTypeImage %5 Cube 1 1 0 1 Unknown
%98 = OpTypeSampledImage %97
%105 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %108
%108 = OpLabel
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
%59 = OpImageSampleDrefImplicitLod %5 %56 %44 %53 ConstOffset %58
%60 = OpCompositeConstruct %27 %59 %59 %59 %59
%61 = OpCompositeExtract %5 %60 0
%64 = OpSampledImage %63 %37 %39
%66 = OpCompositeConstruct %30 %44 %47
%65 = OpImageSampleDrefImplicitLod %5 %64 %66 %53 ConstOffset %58
%67 = OpCompositeConstruct %27 %65 %65 %65 %65
%68 = OpCompositeExtract %5 %67 0
%69 = OpFAdd %5 %68 %61
%72 = OpSampledImage %71 %36 %39
%74 = OpCompositeConstruct %30 %44 %47
%73 = OpImageSampleDrefImplicitLod %5 %72 %74 %53 ConstOffset %76
%77 = OpCompositeConstruct %27 %73 %73 %73 %73
%78 = OpCompositeExtract %5 %77 0
%79 = OpFAdd %5 %69 %78
%82 = OpSampledImage %81 %35 %39
%85 = OpCompositeConstruct %84 %44 %47 %50
%83 = OpImageSampleDrefImplicitLod %5 %82 %85 %53 ConstOffset %76
%86 = OpCompositeConstruct %27 %83 %83 %83 %83
%87 = OpCompositeExtract %5 %86 0
%88 = OpFAdd %5 %79 %87
%91 = OpSampledImage %90 %34 %39
%93 = OpCompositeConstruct %84 %44 %47 %50
%92 = OpImageSampleDrefImplicitLod %5 %91 %93 %53 None
%94 = OpCompositeConstruct %27 %92 %92 %92 %92
%95 = OpCompositeExtract %5 %94 0
%96 = OpFAdd %5 %88 %95
%99 = OpSampledImage %98 %33 %39
%101 = OpCompositeConstruct %27 %44 %47 %50 %53
%100 = OpImageSampleDrefImplicitLod %5 %99 %101 %53 None
%102 = OpCompositeConstruct %27 %100 %100 %100 %100
%103 = OpCompositeExtract %5 %102 0
%104 = OpFAdd %5 %96 %103
%106 = OpAccessChain %105 %32 %43
OpStore %106 %104
%107 = OpAccessChain %105 %32 %46
OpStore %107 %104
OpReturn
OpFunctionEnd
#endif
