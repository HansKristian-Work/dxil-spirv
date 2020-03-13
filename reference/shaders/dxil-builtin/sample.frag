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
    vec4 _69 = textureOffset(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), 0);
    float _71 = _69.x;
    vec4 _77 = textureOffset(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(0));
    vec4 _88 = textureOffset(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(0));
    float _91 = _88.x;
    vec4 _97 = textureOffset(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(0));
    vec4 _108 = texture(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z));
    vec4 _117 = texture(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w));
    float _119 = _117.x;
    SV_Target.x = (((((_71 + _63.x) + _77.x) + _91) + _97.x) + _108.x) + _119;
    SV_Target.y = (((((_71 + _63.y) + _77.y) + _91) + _97.y) + _108.y) + _119;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 127
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability Sampled1D
OpCapability Image1D
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
%58 = OpTypeImage %5 1D 0 0 0 2 Unknown
%59 = OpTypeSampledImage %58
%61 = OpTypeInt 32 1
%62 = OpConstant %61 0
%66 = OpTypeImage %5 1D 0 1 0 2 Unknown
%67 = OpTypeSampledImage %66
%74 = OpTypeImage %5 2D 0 0 0 2 Unknown
%75 = OpTypeSampledImage %74
%79 = OpTypeVector %61 2
%80 = OpConstantComposite %79 %62 %62
%85 = OpTypeImage %5 2D 0 1 0 2 Unknown
%86 = OpTypeSampledImage %85
%89 = OpTypeVector %5 3
%94 = OpTypeImage %5 3D 0 0 0 2 Unknown
%95 = OpTypeSampledImage %94
%99 = OpTypeVector %61 3
%100 = OpConstantComposite %99 %62 %62 %62
%105 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%106 = OpTypeSampledImage %105
%114 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%115 = OpTypeSampledImage %114
%122 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %125
%125 = OpLabel
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
%60 = OpSampledImage %59 %42 %43
%63 = OpImageSampleImplicitLod %30 %60 %48 ConstOffset %62
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%68 = OpSampledImage %67 %41 %43
%70 = OpCompositeConstruct %33 %48 %51
%69 = OpImageSampleImplicitLod %30 %68 %70 ConstOffset %62
%71 = OpCompositeExtract %5 %69 0
%72 = OpFAdd %5 %71 %64
%73 = OpFAdd %5 %71 %65
%76 = OpSampledImage %75 %40 %43
%78 = OpCompositeConstruct %33 %48 %51
%77 = OpImageSampleImplicitLod %30 %76 %78 ConstOffset %80
%81 = OpCompositeExtract %5 %77 0
%82 = OpCompositeExtract %5 %77 1
%83 = OpFAdd %5 %72 %81
%84 = OpFAdd %5 %73 %82
%87 = OpSampledImage %86 %39 %43
%90 = OpCompositeConstruct %89 %48 %51 %54
%88 = OpImageSampleImplicitLod %30 %87 %90 ConstOffset %80
%91 = OpCompositeExtract %5 %88 0
%92 = OpFAdd %5 %83 %91
%93 = OpFAdd %5 %84 %91
%96 = OpSampledImage %95 %38 %43
%98 = OpCompositeConstruct %89 %48 %51 %54
%97 = OpImageSampleImplicitLod %30 %96 %98 ConstOffset %100
%101 = OpCompositeExtract %5 %97 0
%102 = OpCompositeExtract %5 %97 1
%103 = OpFAdd %5 %92 %101
%104 = OpFAdd %5 %93 %102
%107 = OpSampledImage %106 %37 %43
%109 = OpCompositeConstruct %89 %48 %51 %54
%108 = OpImageSampleImplicitLod %30 %107 %109 None
%110 = OpCompositeExtract %5 %108 0
%111 = OpCompositeExtract %5 %108 1
%112 = OpFAdd %5 %103 %110
%113 = OpFAdd %5 %104 %111
%116 = OpSampledImage %115 %36 %43
%118 = OpCompositeConstruct %30 %48 %51 %54 %57
%117 = OpImageSampleImplicitLod %30 %116 %118 None
%119 = OpCompositeExtract %5 %117 0
%120 = OpFAdd %5 %112 %119
%121 = OpFAdd %5 %113 %119
%123 = OpAccessChain %122 %35 %47
OpStore %123 %120
%124 = OpAccessChain %122 %35 %50
OpStore %124 %121
OpReturn
OpFunctionEnd
#endif
