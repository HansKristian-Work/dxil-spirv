#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 0, binding = 0) uniform sampler _23;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _52 = textureOffset(sampler1D(_8, _23), TEXCOORD.x, 1);
    vec4 _58 = textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2);
    float _60 = _58.x;
    vec4 _67 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(3, 4));
    vec4 _79 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(5, 6));
    float _83 = _79.x;
    vec4 _89 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(7, 6, 5));
    SV_Target.x = (((_60 + _52.x) + _67.x) + _83) + _89.x;
    SV_Target.y = (((_60 + _52.y) + _67.y) + _83) + _89.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 102
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %26 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %26 "TEXCOORD"
OpName %29 "SV_Target"
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
OpDecorate %23 DescriptorSet 0
OpDecorate %23 Binding 0
OpDecorate %26 Location 0
OpDecorate %29 Location 0
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
%21 = OpTypeSampler
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeVector %5 4
%25 = OpTypePointer Input %24
%26 = OpVariable %25 Input
%27 = OpTypeVector %5 2
%28 = OpTypePointer Output %27
%29 = OpVariable %28 Output
%36 = OpTypePointer Input %5
%38 = OpTypeInt 32 0
%39 = OpConstant %38 0
%42 = OpConstant %38 1
%45 = OpConstant %38 2
%47 = OpTypeSampledImage %6
%49 = OpTypeInt 32 1
%50 = OpConstant %49 1
%51 = OpConstant %5 0
%55 = OpTypeSampledImage %9
%57 = OpConstant %49 2
%63 = OpTypeSampledImage %12
%65 = OpConstant %49 3
%66 = OpConstant %49 4
%69 = OpTypeVector %49 2
%70 = OpConstantComposite %69 %65 %66
%75 = OpTypeSampledImage %15
%77 = OpConstant %49 5
%78 = OpConstant %49 6
%80 = OpTypeVector %5 3
%82 = OpConstantComposite %69 %77 %78
%86 = OpTypeSampledImage %18
%88 = OpConstant %49 7
%91 = OpTypeVector %49 3
%92 = OpConstantComposite %91 %88 %78 %77
%97 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %100
%100 = OpLabel
%30 = OpLoad %18 %20
%31 = OpLoad %15 %17
%32 = OpLoad %12 %14
%33 = OpLoad %9 %11
%34 = OpLoad %6 %8
%35 = OpLoad %21 %23
%37 = OpAccessChain %36 %26 %39
%40 = OpLoad %5 %37
%41 = OpAccessChain %36 %26 %42
%43 = OpLoad %5 %41
%44 = OpAccessChain %36 %26 %45
%46 = OpLoad %5 %44
%48 = OpSampledImage %47 %34 %35
%52 = OpImageSampleImplicitLod %24 %48 %40 ConstOffset %50
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%56 = OpSampledImage %55 %33 %35
%59 = OpCompositeConstruct %27 %40 %43
%58 = OpImageSampleImplicitLod %24 %56 %59 ConstOffset %57
%60 = OpCompositeExtract %5 %58 0
%61 = OpFAdd %5 %60 %53
%62 = OpFAdd %5 %60 %54
%64 = OpSampledImage %63 %32 %35
%68 = OpCompositeConstruct %27 %40 %43
%67 = OpImageSampleImplicitLod %24 %64 %68 ConstOffset %70
%71 = OpCompositeExtract %5 %67 0
%72 = OpCompositeExtract %5 %67 1
%73 = OpFAdd %5 %61 %71
%74 = OpFAdd %5 %62 %72
%76 = OpSampledImage %75 %31 %35
%81 = OpCompositeConstruct %80 %40 %43 %46
%79 = OpImageSampleImplicitLod %24 %76 %81 ConstOffset %82
%83 = OpCompositeExtract %5 %79 0
%84 = OpFAdd %5 %73 %83
%85 = OpFAdd %5 %74 %83
%87 = OpSampledImage %86 %30 %35
%90 = OpCompositeConstruct %80 %40 %43 %46
%89 = OpImageSampleImplicitLod %24 %87 %90 ConstOffset %92
%93 = OpCompositeExtract %5 %89 0
%94 = OpCompositeExtract %5 %89 1
%95 = OpFAdd %5 %84 %93
%96 = OpFAdd %5 %85 %94
%98 = OpAccessChain %97 %29 %39
OpStore %98 %95
%99 = OpAccessChain %97 %29 %42
OpStore %99 %96
OpReturn
OpFunctionEnd
#endif
