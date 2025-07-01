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
    vec4 _65 = textureOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), ivec2(3, 4));
    vec4 _83 = textureOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec3(7, 6, 5));
    float _89 = textureOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), ivec2(5, 6)).x + textureOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), 2).x;
    SV_Target.x = ((_65.x + _52.x) + _89) + _83.x;
    SV_Target.y = ((_65.y + _52.y) + _89) + _83.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 101
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
%61 = OpTypeSampledImage %12
%63 = OpConstant %49 3
%64 = OpConstant %49 4
%67 = OpTypeVector %49 2
%68 = OpConstantComposite %67 %63 %64
%71 = OpTypeSampledImage %15
%73 = OpConstant %49 5
%74 = OpConstant %49 6
%76 = OpTypeVector %5 3
%78 = OpConstantComposite %67 %73 %74
%80 = OpTypeSampledImage %18
%82 = OpConstant %49 7
%85 = OpTypeVector %49 3
%86 = OpConstantComposite %85 %82 %74 %73
%96 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %99
%99 = OpLabel
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
%62 = OpSampledImage %61 %32 %35
%66 = OpCompositeConstruct %27 %40 %43
%65 = OpImageSampleImplicitLod %24 %62 %66 ConstOffset %68
%69 = OpCompositeExtract %5 %65 0
%70 = OpCompositeExtract %5 %65 1
%72 = OpSampledImage %71 %31 %35
%77 = OpCompositeConstruct %76 %40 %43 %46
%75 = OpImageSampleImplicitLod %24 %72 %77 ConstOffset %78
%79 = OpCompositeExtract %5 %75 0
%81 = OpSampledImage %80 %30 %35
%84 = OpCompositeConstruct %76 %40 %43 %46
%83 = OpImageSampleImplicitLod %24 %81 %84 ConstOffset %86
%87 = OpCompositeExtract %5 %83 0
%88 = OpCompositeExtract %5 %83 1
%89 = OpFAdd %5 %79 %60
%90 = OpFAdd %5 %69 %53
%91 = OpFAdd %5 %90 %89
%92 = OpFAdd %5 %91 %87
%93 = OpFAdd %5 %70 %54
%94 = OpFAdd %5 %93 %89
%95 = OpFAdd %5 %94 %88
%97 = OpAccessChain %96 %29 %39
OpStore %97 %92
%98 = OpAccessChain %96 %29 %42
OpStore %98 %95
OpReturn
OpFunctionEnd
#endif
