#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform sampler _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 1) flat in ivec2 OFF;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _60 = textureGather(sampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y));
    vec4 _69 = textureGather(sampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(1u));
    vec4 _81 = textureGather(samplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), int(2u));
    vec4 _93 = textureGather(samplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), int(3u));
    vec4 _105 = textureGatherOffset(sampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(int(uint(OFF.x)), int(uint(OFF.y))));
    SV_Target.x = (((_69.x + _60.x) + _81.x) + _93.x) + _105.x;
    SV_Target.y = (((_69.y + _60.y) + _81.y) + _93.y) + _105.y;
    SV_Target.z = (((_69.z + _60.z) + _81.z) + _93.z) + _105.z;
    SV_Target.w = (((_69.w + _60.w) + _81.w) + _93.w) + _105.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 122
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
%56 = OpTypeSampledImage %6
%58 = OpTypeVector %5 2
%65 = OpTypeSampledImage %9
%67 = OpTypeVector %5 3
%78 = OpTypeSampledImage %12
%90 = OpTypeSampledImage %15
%115 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %120
%120 = OpLabel
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
%57 = OpSampledImage %56 %33 %34
%59 = OpCompositeConstruct %58 %47 %49
%60 = OpImageGather %21 %57 %59 %38
%61 = OpCompositeExtract %5 %60 0
%62 = OpCompositeExtract %5 %60 1
%63 = OpCompositeExtract %5 %60 2
%64 = OpCompositeExtract %5 %60 3
%66 = OpSampledImage %65 %32 %34
%68 = OpCompositeConstruct %67 %47 %49 %52
%69 = OpImageGather %21 %66 %68 %42
%70 = OpCompositeExtract %5 %69 0
%71 = OpCompositeExtract %5 %69 1
%72 = OpCompositeExtract %5 %69 2
%73 = OpCompositeExtract %5 %69 3
%74 = OpFAdd %5 %70 %61
%75 = OpFAdd %5 %71 %62
%76 = OpFAdd %5 %72 %63
%77 = OpFAdd %5 %73 %64
%79 = OpSampledImage %78 %31 %34
%80 = OpCompositeConstruct %67 %47 %49 %52
%81 = OpImageGather %21 %79 %80 %51
%82 = OpCompositeExtract %5 %81 0
%83 = OpCompositeExtract %5 %81 1
%84 = OpCompositeExtract %5 %81 2
%85 = OpCompositeExtract %5 %81 3
%86 = OpFAdd %5 %74 %82
%87 = OpFAdd %5 %75 %83
%88 = OpFAdd %5 %76 %84
%89 = OpFAdd %5 %77 %85
%91 = OpSampledImage %90 %30 %34
%92 = OpCompositeConstruct %21 %47 %49 %52 %55
%93 = OpImageGather %21 %91 %92 %54
%94 = OpCompositeExtract %5 %93 0
%95 = OpCompositeExtract %5 %93 1
%96 = OpCompositeExtract %5 %93 2
%97 = OpCompositeExtract %5 %93 3
%98 = OpFAdd %5 %86 %94
%99 = OpFAdd %5 %87 %95
%100 = OpFAdd %5 %88 %96
%101 = OpFAdd %5 %89 %97
%102 = OpCompositeConstruct %58 %47 %49
%103 = OpBitcast %24 %40
%104 = OpBitcast %24 %44
%106 = OpCompositeConstruct %25 %103 %104
%105 = OpImageGather %21 %57 %102 %38 Offset %106
%107 = OpCompositeExtract %5 %105 0
%108 = OpCompositeExtract %5 %105 1
%109 = OpCompositeExtract %5 %105 2
%110 = OpCompositeExtract %5 %105 3
%111 = OpFAdd %5 %98 %107
%112 = OpFAdd %5 %99 %108
%113 = OpFAdd %5 %100 %109
%114 = OpFAdd %5 %101 %110
%116 = OpAccessChain %115 %29 %38
OpStore %116 %111
%117 = OpAccessChain %115 %29 %42
OpStore %117 %112
%118 = OpAccessChain %115 %29 %51
OpStore %118 %113
%119 = OpAccessChain %115 %29 %54
OpStore %119 %114
OpReturn
OpFunctionEnd
#endif
