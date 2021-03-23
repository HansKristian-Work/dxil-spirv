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
    vec4 _63 = textureOffset(sampler1D(_8, _29), TEXCOORD.x, 0);
    vec4 _68 = textureOffset(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), 0);
    float _70 = _68.x;
    vec4 _75 = textureOffset(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0));
    vec4 _85 = textureOffset(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0));
    float _88 = _85.x;
    vec4 _93 = textureOffset(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(0));
    vec4 _103 = texture(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    vec4 _111 = texture(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w));
    float _113 = _111.x;
    SV_Target.x = (((((_70 + _63.x) + _75.x) + _88) + _93.x) + _103.x) + _113;
    SV_Target.y = (((((_70 + _63.y) + _75.y) + _88) + _93.y) + _103.y) + _113;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 120
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
%62 = OpConstant %5 0
%66 = OpTypeSampledImage %9
%73 = OpTypeSampledImage %12
%77 = OpTypeVector %60 2
%78 = OpConstantComposite %77 %61 %61
%83 = OpTypeSampledImage %15
%86 = OpTypeVector %5 3
%91 = OpTypeSampledImage %18
%95 = OpTypeVector %60 3
%96 = OpConstantComposite %95 %61 %61 %61
%101 = OpTypeSampledImage %21
%109 = OpTypeSampledImage %24
%116 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %119
%119 = OpLabel
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
%63 = OpImageSampleImplicitLod %30 %59 %48 ConstOffset %61
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%67 = OpSampledImage %66 %41 %43
%69 = OpCompositeConstruct %33 %48 %51
%68 = OpImageSampleImplicitLod %30 %67 %69 ConstOffset %61
%70 = OpCompositeExtract %5 %68 0
%71 = OpFAdd %5 %70 %64
%72 = OpFAdd %5 %70 %65
%74 = OpSampledImage %73 %40 %43
%76 = OpCompositeConstruct %33 %48 %51
%75 = OpImageSampleImplicitLod %30 %74 %76 ConstOffset %78
%79 = OpCompositeExtract %5 %75 0
%80 = OpCompositeExtract %5 %75 1
%81 = OpFAdd %5 %71 %79
%82 = OpFAdd %5 %72 %80
%84 = OpSampledImage %83 %39 %43
%87 = OpCompositeConstruct %86 %48 %51 %54
%85 = OpImageSampleImplicitLod %30 %84 %87 ConstOffset %78
%88 = OpCompositeExtract %5 %85 0
%89 = OpFAdd %5 %81 %88
%90 = OpFAdd %5 %82 %88
%92 = OpSampledImage %91 %38 %43
%94 = OpCompositeConstruct %86 %48 %51 %54
%93 = OpImageSampleImplicitLod %30 %92 %94 ConstOffset %96
%97 = OpCompositeExtract %5 %93 0
%98 = OpCompositeExtract %5 %93 1
%99 = OpFAdd %5 %89 %97
%100 = OpFAdd %5 %90 %98
%102 = OpSampledImage %101 %37 %43
%104 = OpCompositeConstruct %86 %48 %51 %54
%103 = OpImageSampleImplicitLod %30 %102 %104 None
%105 = OpCompositeExtract %5 %103 0
%106 = OpCompositeExtract %5 %103 1
%107 = OpFAdd %5 %99 %105
%108 = OpFAdd %5 %100 %106
%110 = OpSampledImage %109 %36 %43
%112 = OpCompositeConstruct %30 %48 %51 %54 %57
%111 = OpImageSampleImplicitLod %30 %110 %112 None
%113 = OpCompositeExtract %5 %111 0
%114 = OpFAdd %5 %107 %113
%115 = OpFAdd %5 %108 %113
%117 = OpAccessChain %116 %35 %47
OpStore %117 %114
%118 = OpAccessChain %116 %35 %50
OpStore %118 %115
OpReturn
OpFunctionEnd
#endif
