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
    vec4 _67 = textureGradOffset(sampler2D(_14, _23), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(-3, -4));
    vec4 _91 = textureGradOffset(sampler3D(_20, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(5, 6, 7));
    float _99 = textureGradOffset(sampler2DArray(_17, _23), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(4, -5)).x + textureGradOffset(sampler1DArray(_11, _23), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 2).x;
    SV_Target.x = ((_67.x + _54.x) + _99) + _91.x;
    SV_Target.y = ((_67.y + _54.y) + _99) + _91.y;
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
%63 = OpTypeSampledImage %12
%65 = OpConstant %52 -3
%66 = OpConstant %52 -4
%71 = OpTypeVector %52 2
%72 = OpConstantComposite %71 %65 %66
%75 = OpTypeSampledImage %15
%77 = OpConstant %52 4
%78 = OpConstant %52 -5
%80 = OpTypeVector %5 3
%84 = OpConstantComposite %71 %77 %78
%86 = OpTypeSampledImage %18
%88 = OpConstant %52 5
%89 = OpConstant %52 6
%90 = OpConstant %52 7
%95 = OpTypeVector %52 3
%96 = OpConstantComposite %95 %88 %89 %90
%106 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %109
%109 = OpLabel
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
%64 = OpSampledImage %63 %32 %35
%68 = OpCompositeConstruct %27 %40 %43
%69 = OpCompositeConstruct %27 %46 %46
%70 = OpCompositeConstruct %27 %49 %49
%67 = OpImageSampleExplicitLod %24 %64 %68 Grad|ConstOffset %69 %70 %72
%73 = OpCompositeExtract %5 %67 0
%74 = OpCompositeExtract %5 %67 1
%76 = OpSampledImage %75 %31 %35
%81 = OpCompositeConstruct %80 %40 %43 %46
%82 = OpCompositeConstruct %27 %46 %46
%83 = OpCompositeConstruct %27 %49 %49
%79 = OpImageSampleExplicitLod %24 %76 %81 Grad|ConstOffset %82 %83 %84
%85 = OpCompositeExtract %5 %79 0
%87 = OpSampledImage %86 %30 %35
%92 = OpCompositeConstruct %80 %40 %43 %46
%93 = OpCompositeConstruct %80 %46 %46 %46
%94 = OpCompositeConstruct %80 %49 %49 %49
%91 = OpImageSampleExplicitLod %24 %87 %92 Grad|ConstOffset %93 %94 %96
%97 = OpCompositeExtract %5 %91 0
%98 = OpCompositeExtract %5 %91 1
%99 = OpFAdd %5 %85 %62
%100 = OpFAdd %5 %73 %55
%101 = OpFAdd %5 %100 %99
%102 = OpFAdd %5 %101 %97
%103 = OpFAdd %5 %74 %56
%104 = OpFAdd %5 %103 %99
%105 = OpFAdd %5 %104 %98
%107 = OpAccessChain %106 %29 %39
OpStore %107 %102
%108 = OpAccessChain %106 %29 %42
OpStore %108 %105
OpReturn
OpFunctionEnd
#endif
