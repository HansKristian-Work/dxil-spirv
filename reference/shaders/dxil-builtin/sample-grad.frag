#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 1, binding = 5) uniform textureCube _23;
layout(set = 1, binding = 6) uniform textureCubeArray _26;
layout(set = 0, binding = 0) uniform sampler _29;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _60 = textureGrad(sampler1D(_8, _29), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w);
    vec4 _65 = textureGrad(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y);
    float _67 = _65.x;
    vec4 _72 = textureGrad(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w));
    vec4 _82 = textureGrad(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w));
    float _87 = _82.x;
    vec4 _92 = textureGrad(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    vec4 _102 = textureGrad(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    vec4 _112 = textureGrad(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    float _116 = _112.x;
    SV_Target.x = (((((_67 + _60.x) + _72.x) + _87) + _92.x) + _102.x) + _116;
    SV_Target.y = (((((_67 + _60.y) + _72.y) + _87) + _92.y) + _102.y) + _116;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 124
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
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
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 1
OpDecorate %26 Binding 6
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 0
OpDecorate %32 Location 0
OpDecorate %35 Location 0
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
%21 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeSampler
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeVector %5 4
%31 = OpTypePointer Input %30
%32 = OpVariable %31 Input
%33 = OpTypeVector %5 2
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%44 = OpTypePointer Input %5
%46 = OpTypeInt 32 0
%47 = OpConstant %46 0
%50 = OpConstant %46 1
%53 = OpConstant %46 2
%56 = OpConstant %46 3
%58 = OpTypeSampledImage %6
%63 = OpTypeSampledImage %9
%70 = OpTypeSampledImage %12
%80 = OpTypeSampledImage %15
%83 = OpTypeVector %5 3
%90 = OpTypeSampledImage %18
%100 = OpTypeSampledImage %21
%110 = OpTypeSampledImage %24
%119 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %122
%122 = OpLabel
%36 = OpLoad %24 %26
%37 = OpLoad %21 %23
%38 = OpLoad %18 %20
%39 = OpLoad %15 %17
%40 = OpLoad %12 %14
%41 = OpLoad %9 %11
%42 = OpLoad %6 %8
%43 = OpLoad %27 %29
%45 = OpAccessChain %44 %32 %47
%48 = OpLoad %5 %45
%49 = OpAccessChain %44 %32 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %44 %32 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %44 %32 %56
%57 = OpLoad %5 %55
%59 = OpSampledImage %58 %42 %43
%60 = OpImageSampleExplicitLod %30 %59 %48 Grad %54 %57
%61 = OpCompositeExtract %5 %60 0
%62 = OpCompositeExtract %5 %60 1
%64 = OpSampledImage %63 %41 %43
%66 = OpCompositeConstruct %33 %48 %51
%65 = OpImageSampleExplicitLod %30 %64 %66 Grad %54 %51
%67 = OpCompositeExtract %5 %65 0
%68 = OpFAdd %5 %67 %61
%69 = OpFAdd %5 %67 %62
%71 = OpSampledImage %70 %40 %43
%73 = OpCompositeConstruct %33 %48 %51
%74 = OpCompositeConstruct %33 %54 %54
%75 = OpCompositeConstruct %33 %57 %57
%72 = OpImageSampleExplicitLod %30 %71 %73 Grad %74 %75
%76 = OpCompositeExtract %5 %72 0
%77 = OpCompositeExtract %5 %72 1
%78 = OpFAdd %5 %68 %76
%79 = OpFAdd %5 %69 %77
%81 = OpSampledImage %80 %39 %43
%84 = OpCompositeConstruct %83 %48 %51 %54
%85 = OpCompositeConstruct %33 %54 %54
%86 = OpCompositeConstruct %33 %57 %57
%82 = OpImageSampleExplicitLod %30 %81 %84 Grad %85 %86
%87 = OpCompositeExtract %5 %82 0
%88 = OpFAdd %5 %78 %87
%89 = OpFAdd %5 %79 %87
%91 = OpSampledImage %90 %38 %43
%93 = OpCompositeConstruct %83 %48 %51 %54
%94 = OpCompositeConstruct %83 %54 %54 %54
%95 = OpCompositeConstruct %83 %57 %57 %57
%92 = OpImageSampleExplicitLod %30 %91 %93 Grad %94 %95
%96 = OpCompositeExtract %5 %92 0
%97 = OpCompositeExtract %5 %92 1
%98 = OpFAdd %5 %88 %96
%99 = OpFAdd %5 %89 %97
%101 = OpSampledImage %100 %37 %43
%103 = OpCompositeConstruct %83 %48 %51 %54
%104 = OpCompositeConstruct %83 %54 %54 %54
%105 = OpCompositeConstruct %83 %57 %57 %57
%102 = OpImageSampleExplicitLod %30 %101 %103 Grad %104 %105
%106 = OpCompositeExtract %5 %102 0
%107 = OpCompositeExtract %5 %102 1
%108 = OpFAdd %5 %98 %106
%109 = OpFAdd %5 %99 %107
%111 = OpSampledImage %110 %36 %43
%113 = OpCompositeConstruct %30 %48 %51 %54 %57
%114 = OpCompositeConstruct %83 %54 %54 %54
%115 = OpCompositeConstruct %83 %57 %57 %57
%112 = OpImageSampleExplicitLod %30 %111 %113 Grad %114 %115
%116 = OpCompositeExtract %5 %112 0
%117 = OpFAdd %5 %108 %116
%118 = OpFAdd %5 %109 %116
%120 = OpAccessChain %119 %35 %47
OpStore %120 %117
%121 = OpAccessChain %119 %35 %50
OpStore %121 %118
OpReturn
OpFunctionEnd
#endif
