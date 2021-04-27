#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform samplerShadow _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec2 _48 = vec2(TEXCOORD.x, TEXCOORD.y);
    vec4 _49 = textureGather(sampler2DShadow(_8, _20), _48, TEXCOORD.z);
    vec3 _57 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _58 = textureGather(sampler2DArrayShadow(_11, _20), _57, TEXCOORD.w);
    vec3 _69 = vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z);
    vec4 _70 = textureGather(samplerCubeShadow(_14, _20), _69, TEXCOORD.w);
    vec4 _81 = vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w);
    vec4 _82 = textureGather(samplerCubeArrayShadow(_17, _20), _81, TEXCOORD.w);
    SV_Target.x = ((_58.x + _49.x) + _70.x) + _82.x;
    SV_Target.y = ((_58.y + _49.y) + _70.y) + _82.y;
    SV_Target.z = ((_58.z + _49.z) + _70.z) + _82.z;
    SV_Target.w = ((_58.w + _49.w) + _70.w) + _82.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 98
; Schema: 0
OpCapability Shader
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %23 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %23 "TEXCOORD"
OpName %25 "SV_Target"
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
OpDecorate %25 Location 0
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
%24 = OpTypePointer Output %21
%25 = OpVariable %24 Output
%31 = OpTypePointer Input %5
%33 = OpTypeInt 32 0
%34 = OpConstant %33 0
%37 = OpConstant %33 1
%40 = OpConstant %33 2
%43 = OpConstant %33 3
%45 = OpTypeSampledImage %6
%47 = OpTypeVector %5 2
%54 = OpTypeSampledImage %9
%56 = OpTypeVector %5 3
%67 = OpTypeSampledImage %12
%79 = OpTypeSampledImage %15
%91 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %96
%96 = OpLabel
%26 = OpLoad %15 %17
%27 = OpLoad %12 %14
%28 = OpLoad %9 %11
%29 = OpLoad %6 %8
%30 = OpLoad %18 %20
%32 = OpAccessChain %31 %23 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %31 %23 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %31 %23 %40
%41 = OpLoad %5 %39
%42 = OpAccessChain %31 %23 %43
%44 = OpLoad %5 %42
%46 = OpSampledImage %45 %29 %30
%48 = OpCompositeConstruct %47 %35 %38
%49 = OpImageDrefGather %21 %46 %48 %41
%50 = OpCompositeExtract %5 %49 0
%51 = OpCompositeExtract %5 %49 1
%52 = OpCompositeExtract %5 %49 2
%53 = OpCompositeExtract %5 %49 3
%55 = OpSampledImage %54 %28 %30
%57 = OpCompositeConstruct %56 %35 %38 %41
%58 = OpImageDrefGather %21 %55 %57 %44
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%61 = OpCompositeExtract %5 %58 2
%62 = OpCompositeExtract %5 %58 3
%63 = OpFAdd %5 %59 %50
%64 = OpFAdd %5 %60 %51
%65 = OpFAdd %5 %61 %52
%66 = OpFAdd %5 %62 %53
%68 = OpSampledImage %67 %27 %30
%69 = OpCompositeConstruct %56 %35 %38 %41
%70 = OpImageDrefGather %21 %68 %69 %44
%71 = OpCompositeExtract %5 %70 0
%72 = OpCompositeExtract %5 %70 1
%73 = OpCompositeExtract %5 %70 2
%74 = OpCompositeExtract %5 %70 3
%75 = OpFAdd %5 %63 %71
%76 = OpFAdd %5 %64 %72
%77 = OpFAdd %5 %65 %73
%78 = OpFAdd %5 %66 %74
%80 = OpSampledImage %79 %26 %30
%81 = OpCompositeConstruct %21 %35 %38 %41 %44
%82 = OpImageDrefGather %21 %80 %81 %44
%83 = OpCompositeExtract %5 %82 0
%84 = OpCompositeExtract %5 %82 1
%85 = OpCompositeExtract %5 %82 2
%86 = OpCompositeExtract %5 %82 3
%87 = OpFAdd %5 %75 %83
%88 = OpFAdd %5 %76 %84
%89 = OpFAdd %5 %77 %85
%90 = OpFAdd %5 %78 %86
%92 = OpAccessChain %91 %25 %34
OpStore %92 %87
%93 = OpAccessChain %91 %25 %37
OpStore %93 %88
%94 = OpAccessChain %91 %25 %40
OpStore %94 %89
%95 = OpAccessChain %91 %25 %43
OpStore %95 %90
OpReturn
OpFunctionEnd
#endif
