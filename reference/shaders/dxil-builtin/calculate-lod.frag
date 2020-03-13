#version 460

layout(set = 0, binding = 0) uniform texture1D _8;
layout(set = 0, binding = 1) uniform texture1DArray _11;
layout(set = 0, binding = 2) uniform texture2D _14;
layout(set = 0, binding = 3) uniform texture2DArray _17;
layout(set = 0, binding = 4) uniform texture3D _20;
layout(set = 0, binding = 5) uniform textureCube _23;
layout(set = 0, binding = 6) uniform textureCubeArray _26;
layout(set = 0, binding = 0) uniform sampler _29;

layout(location = 0) in vec3 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    SV_Target.x = (((((textureQueryLod(sampler1DArray(_11, _29), TEXCOORD.x).x + textureQueryLod(sampler1D(_8, _29), TEXCOORD.x).x) + textureQueryLod(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y)).x) + textureQueryLod(sampler2DArray(_17, _29), vec2(TEXCOORD.x, TEXCOORD.y)).x) + textureQueryLod(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x) + textureQueryLod(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x) + textureQueryLod(samplerCubeArray(_26, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).x;
    SV_Target.y = (((((textureQueryLod(sampler1DArray(_11, _29), TEXCOORD.x).y + textureQueryLod(sampler1D(_8, _29), TEXCOORD.x).y) + textureQueryLod(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y)).y) + textureQueryLod(sampler2DArray(_17, _29), vec2(TEXCOORD.x, TEXCOORD.y)).y) + textureQueryLod(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).y) + textureQueryLod(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).y) + textureQueryLod(samplerCubeArray(_26, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z)).y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 138
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability Sampled1D
OpCapability Image1D
OpCapability SampledCubeArray
OpCapability ImageQuery
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 1
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 2
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 3
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 4
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 0
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
%30 = OpTypeVector %5 3
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
%55 = OpTypeImage %5 1D 0 0 0 2 Unknown
%56 = OpTypeSampledImage %55
%60 = OpTypeImage %5 1D 0 1 0 2 Unknown
%61 = OpTypeSampledImage %60
%66 = OpTypeImage %5 2D 0 0 0 2 Unknown
%67 = OpTypeSampledImage %66
%73 = OpTypeImage %5 2D 0 1 0 2 Unknown
%74 = OpTypeSampledImage %73
%80 = OpTypeImage %5 3D 0 0 0 2 Unknown
%81 = OpTypeSampledImage %80
%87 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%88 = OpTypeSampledImage %87
%94 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%95 = OpTypeSampledImage %94
%133 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %136
%136 = OpLabel
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
%57 = OpSampledImage %56 %42 %43
%58 = OpImageQueryLod %33 %57 %48
%59 = OpCompositeExtract %5 %58 0
%62 = OpSampledImage %61 %41 %43
%63 = OpImageQueryLod %33 %62 %48
%64 = OpCompositeExtract %5 %63 0
%65 = OpFAdd %5 %64 %59
%68 = OpSampledImage %67 %40 %43
%70 = OpCompositeConstruct %33 %48 %51
%69 = OpImageQueryLod %33 %68 %70
%71 = OpCompositeExtract %5 %69 0
%72 = OpFAdd %5 %65 %71
%75 = OpSampledImage %74 %39 %43
%77 = OpCompositeConstruct %33 %48 %51
%76 = OpImageQueryLod %33 %75 %77
%78 = OpCompositeExtract %5 %76 0
%79 = OpFAdd %5 %72 %78
%82 = OpSampledImage %81 %38 %43
%84 = OpCompositeConstruct %30 %48 %51 %54
%83 = OpImageQueryLod %33 %82 %84
%85 = OpCompositeExtract %5 %83 0
%86 = OpFAdd %5 %79 %85
%89 = OpSampledImage %88 %37 %43
%91 = OpCompositeConstruct %30 %48 %51 %54
%90 = OpImageQueryLod %33 %89 %91
%92 = OpCompositeExtract %5 %90 0
%93 = OpFAdd %5 %86 %92
%96 = OpSampledImage %95 %36 %43
%98 = OpCompositeConstruct %30 %48 %51 %54
%97 = OpImageQueryLod %33 %96 %98
%99 = OpCompositeExtract %5 %97 0
%100 = OpFAdd %5 %93 %99
%101 = OpSampledImage %56 %42 %43
%102 = OpImageQueryLod %33 %101 %48
%103 = OpCompositeExtract %5 %102 1
%104 = OpSampledImage %61 %41 %43
%105 = OpImageQueryLod %33 %104 %48
%106 = OpCompositeExtract %5 %105 1
%107 = OpFAdd %5 %106 %103
%108 = OpSampledImage %67 %40 %43
%110 = OpCompositeConstruct %33 %48 %51
%109 = OpImageQueryLod %33 %108 %110
%111 = OpCompositeExtract %5 %109 1
%112 = OpFAdd %5 %107 %111
%113 = OpSampledImage %74 %39 %43
%115 = OpCompositeConstruct %33 %48 %51
%114 = OpImageQueryLod %33 %113 %115
%116 = OpCompositeExtract %5 %114 1
%117 = OpFAdd %5 %112 %116
%118 = OpSampledImage %81 %38 %43
%120 = OpCompositeConstruct %30 %48 %51 %54
%119 = OpImageQueryLod %33 %118 %120
%121 = OpCompositeExtract %5 %119 1
%122 = OpFAdd %5 %117 %121
%123 = OpSampledImage %88 %37 %43
%125 = OpCompositeConstruct %30 %48 %51 %54
%124 = OpImageQueryLod %33 %123 %125
%126 = OpCompositeExtract %5 %124 1
%127 = OpFAdd %5 %122 %126
%128 = OpSampledImage %95 %36 %43
%130 = OpCompositeConstruct %30 %48 %51 %54
%129 = OpImageQueryLod %33 %128 %130
%131 = OpCompositeExtract %5 %129 1
%132 = OpFAdd %5 %127 %131
%134 = OpAccessChain %133 %35 %47
OpStore %134 %100
%135 = OpAccessChain %133 %35 %50
OpStore %135 %132
OpReturn
OpFunctionEnd
#endif
