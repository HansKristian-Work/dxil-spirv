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
    vec4 _55 = textureGradOffset(sampler1D(_8, _23), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w, 1);
    vec4 _62 = textureGradOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 2);
    float _64 = _62.x;
    vec4 _72 = textureGradOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4));
    vec4 _87 = textureGradOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5));
    float _93 = _87.x;
    vec4 _102 = textureGradOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(5, 6, 7));
    SV_Target.x = (((_64 + _55.x) + _72.x) + _93) + _102.x;
    SV_Target.y = (((_64 + _55.y) + _72.y) + _93) + _102.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 117
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability Image1D
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
%50 = OpTypeImage %5 1D 0 0 0 2 Unknown
%51 = OpTypeSampledImage %50
%53 = OpTypeInt 32 1
%54 = OpConstant %53 1
%58 = OpTypeImage %5 1D 0 1 0 2 Unknown
%59 = OpTypeSampledImage %58
%61 = OpConstant %53 2
%67 = OpTypeImage %5 2D 0 0 0 2 Unknown
%68 = OpTypeSampledImage %67
%70 = OpConstant %53 -3
%71 = OpConstant %53 -4
%76 = OpTypeVector %53 2
%77 = OpConstantComposite %76 %70 %71
%82 = OpTypeImage %5 2D 0 1 0 2 Unknown
%83 = OpTypeSampledImage %82
%85 = OpConstant %53 4
%86 = OpConstant %53 -5
%88 = OpTypeVector %5 3
%92 = OpConstantComposite %76 %85 %86
%96 = OpTypeImage %5 3D 0 0 0 2 Unknown
%97 = OpTypeSampledImage %96
%99 = OpConstant %53 5
%100 = OpConstant %53 6
%101 = OpConstant %53 7
%106 = OpTypeVector %53 3
%107 = OpConstantComposite %106 %99 %100 %101
%112 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %115
%115 = OpLabel
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
%52 = OpSampledImage %51 %34 %35
%55 = OpImageSampleExplicitLod %24 %52 %40 Grad|ConstOffset %46 %49 %54
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1
%60 = OpSampledImage %59 %33 %35
%63 = OpCompositeConstruct %27 %40 %43
%62 = OpImageSampleExplicitLod %24 %60 %63 Grad|ConstOffset %46 %43 %61
%64 = OpCompositeExtract %5 %62 0
%65 = OpFAdd %5 %64 %56
%66 = OpFAdd %5 %64 %57
%69 = OpSampledImage %68 %32 %35
%73 = OpCompositeConstruct %27 %40 %43
%74 = OpCompositeConstruct %27 %46 %46
%75 = OpCompositeConstruct %27 %49 %49
%72 = OpImageSampleExplicitLod %24 %69 %73 Grad|ConstOffset %74 %75 %77
%78 = OpCompositeExtract %5 %72 0
%79 = OpCompositeExtract %5 %72 1
%80 = OpFAdd %5 %65 %78
%81 = OpFAdd %5 %66 %79
%84 = OpSampledImage %83 %31 %35
%89 = OpCompositeConstruct %88 %40 %43 %46
%90 = OpCompositeConstruct %27 %46 %46
%91 = OpCompositeConstruct %27 %49 %49
%87 = OpImageSampleExplicitLod %24 %84 %89 Grad|ConstOffset %90 %91 %92
%93 = OpCompositeExtract %5 %87 0
%94 = OpFAdd %5 %80 %93
%95 = OpFAdd %5 %81 %93
%98 = OpSampledImage %97 %30 %35
%103 = OpCompositeConstruct %88 %40 %43 %46
%104 = OpCompositeConstruct %88 %46 %46 %46
%105 = OpCompositeConstruct %88 %49 %49 %49
%102 = OpImageSampleExplicitLod %24 %98 %103 Grad|ConstOffset %104 %105 %107
%108 = OpCompositeExtract %5 %102 0
%109 = OpCompositeExtract %5 %102 1
%110 = OpFAdd %5 %94 %108
%111 = OpFAdd %5 %95 %109
%113 = OpAccessChain %112 %29 %39
OpStore %113 %110
%114 = OpAccessChain %112 %29 %42
OpStore %114 %111
OpReturn
OpFunctionEnd
#endif
