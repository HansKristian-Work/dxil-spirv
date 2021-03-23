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
    vec4 _54 = textureGradOffset(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w, 1);
    vec4 _60 = textureGradOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 2);
    float _62 = _60.x;
    vec4 _69 = textureGradOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4));
    vec4 _83 = textureGradOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5));
    float _89 = _83.x;
    vec4 _97 = textureGradOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(5, 6, 7));
    SV_Target.x = (((_62 + _54.x) + _69.x) + _89) + _97.x;
    SV_Target.y = (((_62 + _54.y) + _69.y) + _89) + _97.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 111
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
%48 = OpConstant %38 3
%50 = OpTypeSampledImage %6
%52 = OpTypeInt 32 1
%53 = OpConstant %52 1
%57 = OpTypeSampledImage %9
%59 = OpConstant %52 2
%65 = OpTypeSampledImage %12
%67 = OpConstant %52 -3
%68 = OpConstant %52 -4
%73 = OpTypeVector %52 2
%74 = OpConstantComposite %73 %67 %68
%79 = OpTypeSampledImage %15
%81 = OpConstant %52 4
%82 = OpConstant %52 -5
%84 = OpTypeVector %5 3
%88 = OpConstantComposite %73 %81 %82
%92 = OpTypeSampledImage %18
%94 = OpConstant %52 5
%95 = OpConstant %52 6
%96 = OpConstant %52 7
%101 = OpTypeVector %52 3
%102 = OpConstantComposite %101 %94 %95 %96
%107 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %110
%110 = OpLabel
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
%47 = OpAccessChain %36 %26 %48
%49 = OpLoad %5 %47
%51 = OpSampledImage %50 %34 %35
%54 = OpImageSampleExplicitLod %24 %51 %40 Grad|ConstOffset %46 %49 %53
%55 = OpCompositeExtract %5 %54 0
%56 = OpCompositeExtract %5 %54 1
%58 = OpSampledImage %57 %33 %35
%61 = OpCompositeConstruct %27 %40 %43
%60 = OpImageSampleExplicitLod %24 %58 %61 Grad|ConstOffset %46 %43 %59
%62 = OpCompositeExtract %5 %60 0
%63 = OpFAdd %5 %62 %55
%64 = OpFAdd %5 %62 %56
%66 = OpSampledImage %65 %32 %35
%70 = OpCompositeConstruct %27 %40 %43
%71 = OpCompositeConstruct %27 %46 %46
%72 = OpCompositeConstruct %27 %49 %49
%69 = OpImageSampleExplicitLod %24 %66 %70 Grad|ConstOffset %71 %72 %74
%75 = OpCompositeExtract %5 %69 0
%76 = OpCompositeExtract %5 %69 1
%77 = OpFAdd %5 %63 %75
%78 = OpFAdd %5 %64 %76
%80 = OpSampledImage %79 %31 %35
%85 = OpCompositeConstruct %84 %40 %43 %46
%86 = OpCompositeConstruct %27 %46 %46
%87 = OpCompositeConstruct %27 %49 %49
%83 = OpImageSampleExplicitLod %24 %80 %85 Grad|ConstOffset %86 %87 %88
%89 = OpCompositeExtract %5 %83 0
%90 = OpFAdd %5 %77 %89
%91 = OpFAdd %5 %78 %89
%93 = OpSampledImage %92 %30 %35
%98 = OpCompositeConstruct %84 %40 %43 %46
%99 = OpCompositeConstruct %84 %46 %46 %46
%100 = OpCompositeConstruct %84 %49 %49 %49
%97 = OpImageSampleExplicitLod %24 %93 %98 Grad|ConstOffset %99 %100 %102
%103 = OpCompositeExtract %5 %97 0
%104 = OpCompositeExtract %5 %97 1
%105 = OpFAdd %5 %90 %103
%106 = OpFAdd %5 %91 %104
%108 = OpAccessChain %107 %29 %39
OpStore %108 %105
%109 = OpAccessChain %107 %29 %42
OpStore %109 %106
OpReturn
OpFunctionEnd
#endif
