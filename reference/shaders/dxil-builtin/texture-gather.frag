#version 460

layout(set = 0, binding = 3) uniform texture2D _8;
layout(set = 0, binding = 4) uniform texture2DArray _11;
layout(set = 0, binding = 6) uniform textureCube _14;
layout(set = 0, binding = 7) uniform textureCubeArray _17;
layout(set = 0, binding = 1) uniform sampler _20;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _51 = textureGather(sampler2D(_8, _20), vec2(TEXCOORD.x, TEXCOORD.y), 0u);
    vec4 _60 = textureGather(sampler2DArray(_11, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 1u);
    vec4 _72 = textureGather(samplerCube(_14, _20), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), 2u);
    vec4 _84 = textureGather(samplerCubeArray(_17, _20), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), 3u);
    SV_Target.x = ((_60.x + _51.x) + _72.x) + _84.x;
    SV_Target.y = ((_60.y + _51.y) + _72.y) + _84.y;
    SV_Target.z = ((_60.z + _51.z) + _72.z) + _84.z;
    SV_Target.w = ((_60.w + _51.w) + _72.w) + _84.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 100
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
%49 = OpTypeInt 32 1
%50 = OpConstant %49 0
%56 = OpTypeSampledImage %9
%58 = OpTypeVector %5 3
%69 = OpTypeSampledImage %12
%81 = OpTypeSampledImage %15
%93 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %98
%98 = OpLabel
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
%51 = OpImageGather %21 %46 %48 %34
%52 = OpCompositeExtract %5 %51 0
%53 = OpCompositeExtract %5 %51 1
%54 = OpCompositeExtract %5 %51 2
%55 = OpCompositeExtract %5 %51 3
%57 = OpSampledImage %56 %28 %30
%59 = OpCompositeConstruct %58 %35 %38 %41
%60 = OpImageGather %21 %57 %59 %37
%61 = OpCompositeExtract %5 %60 0
%62 = OpCompositeExtract %5 %60 1
%63 = OpCompositeExtract %5 %60 2
%64 = OpCompositeExtract %5 %60 3
%65 = OpFAdd %5 %61 %52
%66 = OpFAdd %5 %62 %53
%67 = OpFAdd %5 %63 %54
%68 = OpFAdd %5 %64 %55
%70 = OpSampledImage %69 %27 %30
%71 = OpCompositeConstruct %58 %35 %38 %41
%72 = OpImageGather %21 %70 %71 %40
%73 = OpCompositeExtract %5 %72 0
%74 = OpCompositeExtract %5 %72 1
%75 = OpCompositeExtract %5 %72 2
%76 = OpCompositeExtract %5 %72 3
%77 = OpFAdd %5 %65 %73
%78 = OpFAdd %5 %66 %74
%79 = OpFAdd %5 %67 %75
%80 = OpFAdd %5 %68 %76
%82 = OpSampledImage %81 %26 %30
%83 = OpCompositeConstruct %21 %35 %38 %41 %44
%84 = OpImageGather %21 %82 %83 %43
%85 = OpCompositeExtract %5 %84 0
%86 = OpCompositeExtract %5 %84 1
%87 = OpCompositeExtract %5 %84 2
%88 = OpCompositeExtract %5 %84 3
%89 = OpFAdd %5 %77 %85
%90 = OpFAdd %5 %78 %86
%91 = OpFAdd %5 %79 %87
%92 = OpFAdd %5 %80 %88
%94 = OpAccessChain %93 %25 %34
OpStore %94 %89
%95 = OpAccessChain %93 %25 %37
OpStore %95 %90
%96 = OpAccessChain %93 %25 %40
OpStore %96 %91
%97 = OpAccessChain %93 %25 %43
OpStore %97 %92
OpReturn
OpFunctionEnd
#endif
