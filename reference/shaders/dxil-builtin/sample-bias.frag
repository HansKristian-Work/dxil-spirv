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
    vec4 _60 = texture(sampler1D(_8, _29), TEXCOORD.x, TEXCOORD.w);
    vec4 _70 = texture(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w);
    vec4 _82 = texture(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    vec4 _88 = texture(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    float _98 = texture(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), TEXCOORD.w).x + (texture(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w).x + texture(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w).x);
    SV_Target.x = (((_98 + _60.x) + _70.x) + _82.x) + _88.x;
    SV_Target.y = (((_98 + _60.y) + _70.y) + _82.y) + _88.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 112
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
%68 = OpTypeSampledImage %12
%74 = OpTypeSampledImage %15
%77 = OpTypeVector %5 3
%80 = OpTypeSampledImage %18
%86 = OpTypeSampledImage %21
%92 = OpTypeSampledImage %24
%107 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %110
%110 = OpLabel
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
%60 = OpImageSampleImplicitLod %30 %59 %48 Bias %57
%61 = OpCompositeExtract %5 %60 0
%62 = OpCompositeExtract %5 %60 1
%64 = OpSampledImage %63 %41 %43
%66 = OpCompositeConstruct %33 %48 %51
%65 = OpImageSampleImplicitLod %30 %64 %66 Bias %57
%67 = OpCompositeExtract %5 %65 0
%69 = OpSampledImage %68 %40 %43
%71 = OpCompositeConstruct %33 %48 %51
%70 = OpImageSampleImplicitLod %30 %69 %71 Bias %57
%72 = OpCompositeExtract %5 %70 0
%73 = OpCompositeExtract %5 %70 1
%75 = OpSampledImage %74 %39 %43
%78 = OpCompositeConstruct %77 %48 %51 %54
%76 = OpImageSampleImplicitLod %30 %75 %78 Bias %57
%79 = OpCompositeExtract %5 %76 0
%81 = OpSampledImage %80 %38 %43
%83 = OpCompositeConstruct %77 %48 %51 %54
%82 = OpImageSampleImplicitLod %30 %81 %83 Bias %57
%84 = OpCompositeExtract %5 %82 0
%85 = OpCompositeExtract %5 %82 1
%87 = OpSampledImage %86 %37 %43
%89 = OpCompositeConstruct %77 %48 %51 %54
%88 = OpImageSampleImplicitLod %30 %87 %89 Bias %57
%90 = OpCompositeExtract %5 %88 0
%91 = OpCompositeExtract %5 %88 1
%93 = OpSampledImage %92 %36 %43
%95 = OpCompositeConstruct %30 %48 %51 %54 %57
%94 = OpImageSampleImplicitLod %30 %93 %95 Bias %57
%96 = OpCompositeExtract %5 %94 0
%97 = OpFAdd %5 %79 %67
%98 = OpFAdd %5 %96 %97
%99 = OpFAdd %5 %98 %61
%100 = OpFAdd %5 %99 %72
%101 = OpFAdd %5 %100 %84
%102 = OpFAdd %5 %101 %90
%103 = OpFAdd %5 %98 %62
%104 = OpFAdd %5 %103 %73
%105 = OpFAdd %5 %104 %85
%106 = OpFAdd %5 %105 %91
%108 = OpAccessChain %107 %35 %47
OpStore %108 %102
%109 = OpAccessChain %107 %35 %50
OpStore %109 %106
OpReturn
OpFunctionEnd
#endif
