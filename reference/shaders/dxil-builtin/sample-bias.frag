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
    vec4 _62 = textureOffset(sampler1D(_8, _29), TEXCOORD.x, 0, TEXCOORD.w);
    vec4 _67 = textureOffset(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), 0, TEXCOORD.w);
    float _69 = _67.x;
    vec4 _74 = textureOffset(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0), TEXCOORD.w);
    vec4 _84 = textureOffset(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0), TEXCOORD.w);
    float _87 = _84.x;
    vec4 _92 = textureOffset(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(0), TEXCOORD.w);
    vec4 _102 = texture(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), TEXCOORD.w);
    vec4 _110 = texture(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), TEXCOORD.w);
    float _112 = _110.x;
    SV_Target.x = (((((_69 + _62.x) + _74.x) + _87) + _92.x) + _102.x) + _112;
    SV_Target.y = (((((_69 + _62.y) + _74.y) + _87) + _92.y) + _102.y) + _112;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 119
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
%60 = OpTypeInt 32 1
%61 = OpConstant %60 0
%65 = OpTypeSampledImage %9
%72 = OpTypeSampledImage %12
%76 = OpTypeVector %60 2
%77 = OpConstantComposite %76 %61 %61
%82 = OpTypeSampledImage %15
%85 = OpTypeVector %5 3
%90 = OpTypeSampledImage %18
%94 = OpTypeVector %60 3
%95 = OpConstantComposite %94 %61 %61 %61
%100 = OpTypeSampledImage %21
%108 = OpTypeSampledImage %24
%115 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %118
%118 = OpLabel
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
%62 = OpImageSampleImplicitLod %30 %59 %48 Bias|ConstOffset %57 %61
%63 = OpCompositeExtract %5 %62 0
%64 = OpCompositeExtract %5 %62 1
%66 = OpSampledImage %65 %41 %43
%68 = OpCompositeConstruct %33 %48 %51
%67 = OpImageSampleImplicitLod %30 %66 %68 Bias|ConstOffset %57 %61
%69 = OpCompositeExtract %5 %67 0
%70 = OpFAdd %5 %69 %63
%71 = OpFAdd %5 %69 %64
%73 = OpSampledImage %72 %40 %43
%75 = OpCompositeConstruct %33 %48 %51
%74 = OpImageSampleImplicitLod %30 %73 %75 Bias|ConstOffset %57 %77
%78 = OpCompositeExtract %5 %74 0
%79 = OpCompositeExtract %5 %74 1
%80 = OpFAdd %5 %70 %78
%81 = OpFAdd %5 %71 %79
%83 = OpSampledImage %82 %39 %43
%86 = OpCompositeConstruct %85 %48 %51 %54
%84 = OpImageSampleImplicitLod %30 %83 %86 Bias|ConstOffset %57 %77
%87 = OpCompositeExtract %5 %84 0
%88 = OpFAdd %5 %80 %87
%89 = OpFAdd %5 %81 %87
%91 = OpSampledImage %90 %38 %43
%93 = OpCompositeConstruct %85 %48 %51 %54
%92 = OpImageSampleImplicitLod %30 %91 %93 Bias|ConstOffset %57 %95
%96 = OpCompositeExtract %5 %92 0
%97 = OpCompositeExtract %5 %92 1
%98 = OpFAdd %5 %88 %96
%99 = OpFAdd %5 %89 %97
%101 = OpSampledImage %100 %37 %43
%103 = OpCompositeConstruct %85 %48 %51 %54
%102 = OpImageSampleImplicitLod %30 %101 %103 Bias %57
%104 = OpCompositeExtract %5 %102 0
%105 = OpCompositeExtract %5 %102 1
%106 = OpFAdd %5 %98 %104
%107 = OpFAdd %5 %99 %105
%109 = OpSampledImage %108 %36 %43
%111 = OpCompositeConstruct %30 %48 %51 %54 %57
%110 = OpImageSampleImplicitLod %30 %109 %111 Bias %57
%112 = OpCompositeExtract %5 %110 0
%113 = OpFAdd %5 %106 %112
%114 = OpFAdd %5 %107 %112
%116 = OpAccessChain %115 %35 %47
OpStore %116 %113
%117 = OpAccessChain %115 %35 %50
OpStore %117 %114
OpReturn
OpFunctionEnd
#endif
