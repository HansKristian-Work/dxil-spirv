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
    uvec4 _53 = uvec4(textureGather(isampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y)));
    uvec4 _63 = uvec4(textureGather(isampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1u));
    uvec4 _76 = uvec4(textureGather(isamplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 2u));
    uvec4 _89 = uvec4(textureGather(isamplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 3u));
    SV_Target.x = int(((_63.x + _53.x) + _76.x) + _89.x);
    SV_Target.y = int(((_63.y + _53.y) + _76.y) + _89.y);
    SV_Target.z = int(((_63.z + _53.z) + _76.z) + _89.z);
    SV_Target.w = int(((_63.w + _53.w) + _76.w) + _89.w);
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
%52 = OpTypeVector %35 4
%58 = OpTypeSampledImage %9
%60 = OpTypeVector %21 3
%72 = OpTypeSampledImage %12
%85 = OpTypeSampledImage %15
%98 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %107
%107 = OpLabel
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
%51 = OpImageGather %25 %48 %50 %36
%53 = OpBitcast %52 %51
%54 = OpCompositeExtract %35 %53 0
%55 = OpCompositeExtract %35 %53 1
%56 = OpCompositeExtract %35 %53 2
%57 = OpCompositeExtract %35 %53 3
%59 = OpSampledImage %58 %30 %32
%61 = OpCompositeConstruct %60 %37 %40 %43
%62 = OpImageGather %25 %59 %61 %39
%63 = OpBitcast %52 %62
%64 = OpCompositeExtract %35 %63 0
%65 = OpCompositeExtract %35 %63 1
%66 = OpCompositeExtract %35 %63 2
%67 = OpCompositeExtract %35 %63 3
%68 = OpIAdd %35 %64 %54
%69 = OpIAdd %35 %65 %55
%70 = OpIAdd %35 %66 %56
%71 = OpIAdd %35 %67 %57
%73 = OpSampledImage %72 %29 %32
%74 = OpCompositeConstruct %60 %37 %40 %43
%75 = OpImageGather %25 %73 %74 %42
%76 = OpBitcast %52 %75
%77 = OpCompositeExtract %35 %76 0
%78 = OpCompositeExtract %35 %76 1
%79 = OpCompositeExtract %35 %76 2
%80 = OpCompositeExtract %35 %76 3
%81 = OpIAdd %35 %68 %77
%82 = OpIAdd %35 %69 %78
%83 = OpIAdd %35 %70 %79
%84 = OpIAdd %35 %71 %80
%86 = OpSampledImage %85 %28 %32
%87 = OpCompositeConstruct %22 %37 %40 %43 %46
%88 = OpImageGather %25 %86 %87 %45
%89 = OpBitcast %52 %88
%90 = OpCompositeExtract %35 %89 0
%91 = OpCompositeExtract %35 %89 1
%92 = OpCompositeExtract %35 %89 2
%93 = OpCompositeExtract %35 %89 3
%94 = OpIAdd %35 %81 %90
%95 = OpIAdd %35 %82 %91
%96 = OpIAdd %35 %83 %92
%97 = OpIAdd %35 %84 %93
%99 = OpAccessChain %98 %27 %36
%100 = OpBitcast %5 %94
OpStore %99 %100
%101 = OpAccessChain %98 %27 %39
%102 = OpBitcast %5 %95
OpStore %101 %102
%103 = OpAccessChain %98 %27 %42
%104 = OpBitcast %5 %96
OpStore %103 %104
%105 = OpAccessChain %98 %27 %45
%106 = OpBitcast %5 %97
OpStore %105 %106
OpReturn
OpFunctionEnd
#endif
