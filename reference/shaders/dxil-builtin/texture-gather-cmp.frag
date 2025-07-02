#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) flat in ivec2 OFF;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _60 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _61 = textureGather(sampler2DShadow(_8, _20), _60, TEXCOORD.z);
    vec3 _70 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _71 = textureGather(sampler2DArrayShadow(_11, _20), _70, TEXCOORD.w);
    vec3 _83 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _84 = textureGather(samplerCubeShadow(_14, _20), _83, TEXCOORD.w);
    vec4 _96 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    vec4 _97 = textureGather(samplerCubeArrayShadow(_17, _20), _96, TEXCOORD.w);
    vec2 _106 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _109 = textureGatherOffset(sampler2DShadow(_8, _20), _106, TEXCOORD.z, ivec2(int(uint(OFF.x)), int(uint(OFF.y))));
    SV_Target.x = (((_71.x + _61.x) + _84.x) + _97.x) + _109.x;
    SV_Target.y = (((_71.y + _61.y) + _84.y) + _97.y) + _109.y;
    SV_Target.z = (((_71.z + _61.z) + _84.z) + _97.z) + _109.z;
    SV_Target.w = (((_71.w + _61.w) + _84.w) + _97.w) + _109.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %27 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %27 "OFF"
OpName %29 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 3
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 4
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 6
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 7
OpDecorate %20 DescriptorSet 0
OpDecorate %20 Binding 1
OpDecorate %23 Location 0
OpDecorate %27 Flat
OpDecorate %27 Location 1
OpDecorate %29 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 2D 0 1 0 1 Unknown
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeSampler
%19 = OpTypePointer UniformConstant %18
%20 = OpVariable %19 UniformConstant
%21 = OpTypeVector %5 4
%22 = OpTypePointer Input %21
%23 = OpVariable %22 Input
%24 = OpTypeInt 32 1
%25 = OpTypeVector %24 2
%26 = OpTypePointer Input %25
%27 = OpVariable %26 Input
%28 = OpTypePointer Output %21
%29 = OpVariable %28 Output
%35 = OpTypePointer Input %24
%37 = OpTypeInt 32 0
%38 = OpConstant %37 0
%42 = OpConstant %37 1
%45 = OpTypePointer Input %5
%51 = OpConstant %37 2
%54 = OpConstant %37 3
%56 = OpTypeImage %5 2D 1 0 0 1 Unknown
%57 = OpTypeSampledImage %56
%59 = OpTypeVector %5 2
%66 = OpTypeImage %5 2D 1 1 0 1 Unknown
%67 = OpTypeSampledImage %66
%69 = OpTypeVector %5 3
%80 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%81 = OpTypeSampledImage %80
%93 = OpTypeImage %5 Cube 1 1 0 1 Unknown
%94 = OpTypeSampledImage %93
%119 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %124
%124 = OpLabel
%30 = OpLoad %15 %17
%31 = OpLoad %12 %14
%32 = OpLoad %9 %11
%33 = OpLoad %6 %8
%34 = OpLoad %18 %20
%36 = OpAccessChain %35 %27 %38
%39 = OpLoad %24 %36
%40 = OpBitcast %37 %39
%41 = OpAccessChain %35 %27 %42
%43 = OpLoad %24 %41
%44 = OpBitcast %37 %43
%46 = OpAccessChain %45 %23 %38
%47 = OpLoad %5 %46
%48 = OpAccessChain %45 %23 %42
%49 = OpLoad %5 %48
%50 = OpAccessChain %45 %23 %51
%52 = OpLoad %5 %50
%53 = OpAccessChain %45 %23 %54
%55 = OpLoad %5 %53
%58 = OpSampledImage %57 %33 %34
%60 = OpCompositeConstruct %59 %47 %49
%61 = OpImageDrefGather %21 %58 %60 %52
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeExtract %5 %61 2
%65 = OpCompositeExtract %5 %61 3
%68 = OpSampledImage %67 %32 %34
%70 = OpCompositeConstruct %69 %47 %49 %52
%71 = OpImageDrefGather %21 %68 %70 %55
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %5 %71 2
%75 = OpCompositeExtract %5 %71 3
%76 = OpFAdd %5 %72 %62
%77 = OpFAdd %5 %73 %63
%78 = OpFAdd %5 %74 %64
%79 = OpFAdd %5 %75 %65
%82 = OpSampledImage %81 %31 %34
%83 = OpCompositeConstruct %69 %47 %49 %52
%84 = OpImageDrefGather %21 %82 %83 %55
%85 = OpCompositeExtract %5 %84 0
%86 = OpCompositeExtract %5 %84 1
%87 = OpCompositeExtract %5 %84 2
%88 = OpCompositeExtract %5 %84 3
%89 = OpFAdd %5 %76 %85
%90 = OpFAdd %5 %77 %86
%91 = OpFAdd %5 %78 %87
%92 = OpFAdd %5 %79 %88
%95 = OpSampledImage %94 %30 %34
%96 = OpCompositeConstruct %21 %47 %49 %52 %55
%97 = OpImageDrefGather %21 %95 %96 %55
%98 = OpCompositeExtract %5 %97 0
%99 = OpCompositeExtract %5 %97 1
%100 = OpCompositeExtract %5 %97 2
%101 = OpCompositeExtract %5 %97 3
%102 = OpFAdd %5 %89 %98
%103 = OpFAdd %5 %90 %99
%104 = OpFAdd %5 %91 %100
%105 = OpFAdd %5 %92 %101
%106 = OpCompositeConstruct %59 %47 %49
%107 = OpBitcast %24 %40
%108 = OpBitcast %24 %44
%110 = OpCompositeConstruct %25 %107 %108
%109 = OpImageDrefGather %21 %58 %106 %52 Offset %110
%111 = OpCompositeExtract %5 %109 0
%112 = OpCompositeExtract %5 %109 1
%113 = OpCompositeExtract %5 %109 2
%114 = OpCompositeExtract %5 %109 3
%115 = OpFAdd %5 %102 %111
%116 = OpFAdd %5 %103 %112
%117 = OpFAdd %5 %104 %113
%118 = OpFAdd %5 %105 %114
%120 = OpAccessChain %119 %29 %38
OpStore %120 %115
%121 = OpAccessChain %119 %29 %42
OpStore %121 %116
%122 = OpAccessChain %119 %29 %51
OpStore %122 %117
%123 = OpAccessChain %119 %29 %54
OpStore %123 %118
OpReturn
OpFunctionEnd
#endif
