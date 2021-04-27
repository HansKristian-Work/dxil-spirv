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
    vec4 _65 = texture(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w);
    float _67 = _65.x;
    vec4 _72 = texture(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.w);
    vec4 _80 = texture(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    float _83 = _80.x;
    vec4 _88 = texture(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    vec4 _96 = texture(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    vec4 _104 = texture(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), TEXCOORD.w);
    float _106 = _104.x;
    SV_Target.x = (((((_67 + _60.x) + _72.x) + _83) + _88.x) + _96.x) + _106;
    SV_Target.y = (((((_67 + _60.y) + _72.y) + _83) + _88.y) + _96.y) + _106;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 114
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
%78 = OpTypeSampledImage %15
%81 = OpTypeVector %5 3
%86 = OpTypeSampledImage %18
%94 = OpTypeSampledImage %21
%102 = OpTypeSampledImage %24
%109 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %112
%112 = OpLabel
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
%68 = OpFAdd %5 %67 %61
%69 = OpFAdd %5 %67 %62
%71 = OpSampledImage %70 %40 %43
%73 = OpCompositeConstruct %33 %48 %51
%72 = OpImageSampleImplicitLod %30 %71 %73 Bias %57
%74 = OpCompositeExtract %5 %72 0
%75 = OpCompositeExtract %5 %72 1
%76 = OpFAdd %5 %68 %74
%77 = OpFAdd %5 %69 %75
%79 = OpSampledImage %78 %39 %43
%82 = OpCompositeConstruct %81 %48 %51 %54
%80 = OpImageSampleImplicitLod %30 %79 %82 Bias %57
%83 = OpCompositeExtract %5 %80 0
%84 = OpFAdd %5 %76 %83
%85 = OpFAdd %5 %77 %83
%87 = OpSampledImage %86 %38 %43
%89 = OpCompositeConstruct %81 %48 %51 %54
%88 = OpImageSampleImplicitLod %30 %87 %89 Bias %57
%90 = OpCompositeExtract %5 %88 0
%91 = OpCompositeExtract %5 %88 1
%92 = OpFAdd %5 %84 %90
%93 = OpFAdd %5 %85 %91
%95 = OpSampledImage %94 %37 %43
%97 = OpCompositeConstruct %81 %48 %51 %54
%96 = OpImageSampleImplicitLod %30 %95 %97 Bias %57
%98 = OpCompositeExtract %5 %96 0
%99 = OpCompositeExtract %5 %96 1
%100 = OpFAdd %5 %92 %98
%101 = OpFAdd %5 %93 %99
%103 = OpSampledImage %102 %36 %43
%105 = OpCompositeConstruct %30 %48 %51 %54 %57
%104 = OpImageSampleImplicitLod %30 %103 %105 Bias %57
%106 = OpCompositeExtract %5 %104 0
%107 = OpFAdd %5 %100 %106
%108 = OpFAdd %5 %101 %106
%110 = OpAccessChain %109 %35 %47
OpStore %110 %107
%111 = OpAccessChain %109 %35 %50
OpStore %111 %108
OpReturn
OpFunctionEnd
#endif
