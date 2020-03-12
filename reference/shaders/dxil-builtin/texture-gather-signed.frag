#version 460

layout(set = 0, binding = 3) uniform itexture2D _8;
layout(set = 0, binding = 4) uniform itexture2DArray _11;
layout(set = 0, binding = 6) uniform itextureCube _14;
layout(set = 0, binding = 7) uniform itextureCubeArray _17;
layout(set = 0, binding = 1) uniform sampler _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out ivec4 SV_Target;

void main()
{
    uvec4 _55 = uvec4(textureGather(isampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), 0u));
    uvec4 _66 = uvec4(textureGather(isampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1u));
    uvec4 _80 = uvec4(textureGather(isamplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 2u));
    uvec4 _94 = uvec4(textureGather(isamplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 3u));
    SV_Target.x = int(((_66.x + _55.x) + _80.x) + _94.x);
    SV_Target.y = int(((_66.y + _55.y) + _80.y) + _94.y);
    SV_Target.z = int(((_66.z + _55.z) + _80.z) + _94.z);
    SV_Target.w = int(((_66.w + _55.w) + _80.w) + _94.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 114
; Schema: 0
OpCapability Shader
OpCapability ImageCubeArray
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %24 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %24 "TEXCOORD"
OpName %27 "SV_Target"
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
OpDecorate %24 Location 0
OpDecorate %27 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
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
%21 = OpTypeFloat 32
%22 = OpTypeVector %21 4
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpTypeVector %5 4
%26 = OpTypePointer Output %25
%27 = OpVariable %26 Output
%33 = OpTypePointer Input %21
%35 = OpTypeInt 32 0
%36 = OpConstant %35 0
%39 = OpConstant %35 1
%42 = OpConstant %35 2
%45 = OpConstant %35 3
%47 = OpTypeImage %5 2D 0 0 0 2 Unknown
%48 = OpTypeSampledImage %47
%50 = OpTypeVector %21 2
%52 = OpConstant %5 0
%54 = OpTypeVector %35 4
%60 = OpTypeImage %5 2D 0 1 0 2 Unknown
%61 = OpTypeSampledImage %60
%63 = OpTypeVector %21 3
%75 = OpTypeImage %5 Cube 0 0 0 2 Unknown
%76 = OpTypeSampledImage %75
%89 = OpTypeImage %5 Cube 0 1 0 2 Unknown
%90 = OpTypeSampledImage %89
%103 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %112
%112 = OpLabel
%28 = OpLoad %15 %17
%29 = OpLoad %12 %14
%30 = OpLoad %9 %11
%31 = OpLoad %6 %8
%32 = OpLoad %18 %20
%34 = OpAccessChain %33 %24 %36
%37 = OpLoad %21 %34
%38 = OpAccessChain %33 %24 %39
%40 = OpLoad %21 %38
%41 = OpAccessChain %33 %24 %42
%43 = OpLoad %21 %41
%44 = OpAccessChain %33 %24 %45
%46 = OpLoad %21 %44
%49 = OpSampledImage %48 %31 %32
%51 = OpCompositeConstruct %50 %37 %40
%53 = OpImageGather %25 %49 %51 %36
%55 = OpBitcast %54 %53
%56 = OpCompositeExtract %35 %55 0
%57 = OpCompositeExtract %35 %55 1
%58 = OpCompositeExtract %35 %55 2
%59 = OpCompositeExtract %35 %55 3
%62 = OpSampledImage %61 %30 %32
%64 = OpCompositeConstruct %63 %37 %40 %43
%65 = OpImageGather %25 %62 %64 %39
%66 = OpBitcast %54 %65
%67 = OpCompositeExtract %35 %66 0
%68 = OpCompositeExtract %35 %66 1
%69 = OpCompositeExtract %35 %66 2
%70 = OpCompositeExtract %35 %66 3
%71 = OpIAdd %35 %67 %56
%72 = OpIAdd %35 %68 %57
%73 = OpIAdd %35 %69 %58
%74 = OpIAdd %35 %70 %59
%77 = OpSampledImage %76 %29 %32
%78 = OpCompositeConstruct %63 %37 %40 %43
%79 = OpImageGather %25 %77 %78 %42
%80 = OpBitcast %54 %79
%81 = OpCompositeExtract %35 %80 0
%82 = OpCompositeExtract %35 %80 1
%83 = OpCompositeExtract %35 %80 2
%84 = OpCompositeExtract %35 %80 3
%85 = OpIAdd %35 %71 %81
%86 = OpIAdd %35 %72 %82
%87 = OpIAdd %35 %73 %83
%88 = OpIAdd %35 %74 %84
%91 = OpSampledImage %90 %28 %32
%92 = OpCompositeConstruct %22 %37 %40 %43 %46
%93 = OpImageGather %25 %91 %92 %45
%94 = OpBitcast %54 %93
%95 = OpCompositeExtract %35 %94 0
%96 = OpCompositeExtract %35 %94 1
%97 = OpCompositeExtract %35 %94 2
%98 = OpCompositeExtract %35 %94 3
%99 = OpIAdd %35 %85 %95
%100 = OpIAdd %35 %86 %96
%101 = OpIAdd %35 %87 %97
%102 = OpIAdd %35 %88 %98
%104 = OpAccessChain %103 %27 %36
%105 = OpBitcast %5 %99
OpStore %104 %105
%106 = OpAccessChain %103 %27 %39
%107 = OpBitcast %5 %100
OpStore %106 %107
%108 = OpAccessChain %103 %27 %42
%109 = OpBitcast %5 %101
OpStore %108 %109
%110 = OpAccessChain %103 %27 %45
%111 = OpBitcast %5 %102
OpStore %110 %111
OpReturn
OpFunctionEnd
#endif
