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
; Bound: 131
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
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
%55 = OpTypeSampledImage %6
%59 = OpTypeSampledImage %9
%64 = OpTypeSampledImage %12
%70 = OpTypeSampledImage %15
%76 = OpTypeSampledImage %18
%82 = OpTypeSampledImage %21
%88 = OpTypeSampledImage %24
%126 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %129
%129 = OpLabel
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
%56 = OpSampledImage %55 %42 %43
%57 = OpImageQueryLod %33 %56 %48
%58 = OpCompositeExtract %5 %57 0
%60 = OpSampledImage %59 %41 %43
%61 = OpImageQueryLod %33 %60 %48
%62 = OpCompositeExtract %5 %61 0
%63 = OpFAdd %5 %62 %58
%65 = OpSampledImage %64 %40 %43
%67 = OpCompositeConstruct %33 %48 %51
%66 = OpImageQueryLod %33 %65 %67
%68 = OpCompositeExtract %5 %66 0
%69 = OpFAdd %5 %63 %68
%71 = OpSampledImage %70 %39 %43
%73 = OpCompositeConstruct %33 %48 %51
%72 = OpImageQueryLod %33 %71 %73
%74 = OpCompositeExtract %5 %72 0
%75 = OpFAdd %5 %69 %74
%77 = OpSampledImage %76 %38 %43
%79 = OpCompositeConstruct %30 %48 %51 %54
%78 = OpImageQueryLod %33 %77 %79
%80 = OpCompositeExtract %5 %78 0
%81 = OpFAdd %5 %75 %80
%83 = OpSampledImage %82 %37 %43
%85 = OpCompositeConstruct %30 %48 %51 %54
%84 = OpImageQueryLod %33 %83 %85
%86 = OpCompositeExtract %5 %84 0
%87 = OpFAdd %5 %81 %86
%89 = OpSampledImage %88 %36 %43
%91 = OpCompositeConstruct %30 %48 %51 %54
%90 = OpImageQueryLod %33 %89 %91
%92 = OpCompositeExtract %5 %90 0
%93 = OpFAdd %5 %87 %92
%94 = OpSampledImage %55 %42 %43
%95 = OpImageQueryLod %33 %94 %48
%96 = OpCompositeExtract %5 %95 1
%97 = OpSampledImage %59 %41 %43
%98 = OpImageQueryLod %33 %97 %48
%99 = OpCompositeExtract %5 %98 1
%100 = OpFAdd %5 %99 %96
%101 = OpSampledImage %64 %40 %43
%103 = OpCompositeConstruct %33 %48 %51
%102 = OpImageQueryLod %33 %101 %103
%104 = OpCompositeExtract %5 %102 1
%105 = OpFAdd %5 %100 %104
%106 = OpSampledImage %70 %39 %43
%108 = OpCompositeConstruct %33 %48 %51
%107 = OpImageQueryLod %33 %106 %108
%109 = OpCompositeExtract %5 %107 1
%110 = OpFAdd %5 %105 %109
%111 = OpSampledImage %76 %38 %43
%113 = OpCompositeConstruct %30 %48 %51 %54
%112 = OpImageQueryLod %33 %111 %113
%114 = OpCompositeExtract %5 %112 1
%115 = OpFAdd %5 %110 %114
%116 = OpSampledImage %82 %37 %43
%118 = OpCompositeConstruct %30 %48 %51 %54
%117 = OpImageQueryLod %33 %116 %118
%119 = OpCompositeExtract %5 %117 1
%120 = OpFAdd %5 %115 %119
%121 = OpSampledImage %88 %36 %43
%123 = OpCompositeConstruct %30 %48 %51 %54
%122 = OpImageQueryLod %33 %121 %123
%124 = OpCompositeExtract %5 %122 1
%125 = OpFAdd %5 %120 %124
%127 = OpAccessChain %126 %35 %47
OpStore %127 %93
%128 = OpAccessChain %126 %35 %50
OpStore %128 %125
OpReturn
OpFunctionEnd
#endif
