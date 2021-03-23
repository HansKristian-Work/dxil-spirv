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
    uvec4 _54 = uvec4(textureGather(isampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y)));
    uvec4 _64 = uvec4(textureGather(isampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1u));
    uvec4 _77 = uvec4(textureGather(isamplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 2u));
    uvec4 _90 = uvec4(textureGather(isamplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 3u));
    SV_Target.x = int(((_64.x + _54.x) + _77.x) + _90.x);
    SV_Target.y = int(((_64.y + _54.y) + _77.y) + _90.y);
    SV_Target.z = int(((_64.z + _54.z) + _77.z) + _90.z);
    SV_Target.w = int(((_64.w + _54.w) + _77.w) + _90.w);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 109
; Schema: 0
OpCapability Shader
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
%47 = OpTypeSampledImage %6
%49 = OpTypeVector %21 2
%51 = OpConstant %5 0
%53 = OpTypeVector %35 4
%59 = OpTypeSampledImage %9
%61 = OpTypeVector %21 3
%73 = OpTypeSampledImage %12
%86 = OpTypeSampledImage %15
%99 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %108
%108 = OpLabel
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
%48 = OpSampledImage %47 %31 %32
%50 = OpCompositeConstruct %49 %37 %40
%52 = OpImageGather %25 %48 %50 %36
%54 = OpBitcast %53 %52
%55 = OpCompositeExtract %35 %54 0
%56 = OpCompositeExtract %35 %54 1
%57 = OpCompositeExtract %35 %54 2
%58 = OpCompositeExtract %35 %54 3
%60 = OpSampledImage %59 %30 %32
%62 = OpCompositeConstruct %61 %37 %40 %43
%63 = OpImageGather %25 %60 %62 %39
%64 = OpBitcast %53 %63
%65 = OpCompositeExtract %35 %64 0
%66 = OpCompositeExtract %35 %64 1
%67 = OpCompositeExtract %35 %64 2
%68 = OpCompositeExtract %35 %64 3
%69 = OpIAdd %35 %65 %55
%70 = OpIAdd %35 %66 %56
%71 = OpIAdd %35 %67 %57
%72 = OpIAdd %35 %68 %58
%74 = OpSampledImage %73 %29 %32
%75 = OpCompositeConstruct %61 %37 %40 %43
%76 = OpImageGather %25 %74 %75 %42
%77 = OpBitcast %53 %76
%78 = OpCompositeExtract %35 %77 0
%79 = OpCompositeExtract %35 %77 1
%80 = OpCompositeExtract %35 %77 2
%81 = OpCompositeExtract %35 %77 3
%82 = OpIAdd %35 %69 %78
%83 = OpIAdd %35 %70 %79
%84 = OpIAdd %35 %71 %80
%85 = OpIAdd %35 %72 %81
%87 = OpSampledImage %86 %28 %32
%88 = OpCompositeConstruct %22 %37 %40 %43 %46
%89 = OpImageGather %25 %87 %88 %45
%90 = OpBitcast %53 %89
%91 = OpCompositeExtract %35 %90 0
%92 = OpCompositeExtract %35 %90 1
%93 = OpCompositeExtract %35 %90 2
%94 = OpCompositeExtract %35 %90 3
%95 = OpIAdd %35 %82 %91
%96 = OpIAdd %35 %83 %92
%97 = OpIAdd %35 %84 %93
%98 = OpIAdd %35 %85 %94
%100 = OpAccessChain %99 %27 %36
%101 = OpBitcast %5 %95
OpStore %100 %101
%102 = OpAccessChain %99 %27 %39
%103 = OpBitcast %5 %96
OpStore %102 %103
%104 = OpAccessChain %99 %27 %42
%105 = OpBitcast %5 %97
OpStore %104 %105
%106 = OpAccessChain %99 %27 %45
%107 = OpBitcast %5 %98
OpStore %106 %107
OpReturn
OpFunctionEnd
#endif
