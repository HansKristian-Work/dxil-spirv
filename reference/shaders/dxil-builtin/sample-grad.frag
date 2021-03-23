#version 460

layout(set = 1, binding = 0) uniform texture1D _8;
layout(set = 1, binding = 1) uniform texture1DArray _11;
layout(set = 1, binding = 2) uniform texture2D _14;
layout(set = 1, binding = 3) uniform texture2DArray _17;
layout(set = 1, binding = 4) uniform texture3D _20;
layout(set = 1, binding = 5) uniform textureCube _23;
layout(set = 1, binding = 6) uniform textureCubeArray _26;
layout(set = 0, binding = 0) uniform sampler _29;

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    vec4 _62 = textureGradOffset(sampler1D(_8, _29), TEXCOORD.x, TEXCOORD.z, TEXCOORD.w, 0);
    vec4 _67 = textureGradOffset(sampler1DArray(_11, _29), vec2(TEXCOORD.x, TEXCOORD.y), TEXCOORD.z, TEXCOORD.y, 0);
    float _69 = _67.x;
    vec4 _74 = textureGradOffset(sampler2D(_14, _29), vec2(TEXCOORD.x, TEXCOORD.y), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(0));
    vec4 _86 = textureGradOffset(sampler2DArray(_17, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec2(TEXCOORD.z), vec2(TEXCOORD.w), ivec2(0));
    float _91 = _86.x;
    vec4 _96 = textureGradOffset(sampler3D(_20, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w), ivec3(0));
    vec4 _108 = textureGrad(samplerCube(_23, _29), vec3(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    vec4 _118 = textureGrad(samplerCubeArray(_26, _29), vec4(TEXCOORD.x, TEXCOORD.y, TEXCOORD.z, TEXCOORD.w), vec3(TEXCOORD.z), vec3(TEXCOORD.w));
    float _122 = _118.x;
    SV_Target.x = (((((_69 + _62.x) + _74.x) + _91) + _96.x) + _108.x) + _122;
    SV_Target.y = (((((_69 + _62.y) + _74.y) + _91) + _96.y) + _108.y) + _122;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 129
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability SampledCubeArray
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %32 %35
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %32 "TEXCOORD"
OpName %35 "SV_Target"
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
OpDecorate %23 DescriptorSet 1
OpDecorate %23 Binding 5
OpDecorate %26 DescriptorSet 1
OpDecorate %26 Binding 6
OpDecorate %29 DescriptorSet 0
OpDecorate %29 Binding 0
OpDecorate %32 Location 0
OpDecorate %35 Location 0
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
%21 = OpTypeImage %5 Cube 0 0 0 1 Unknown
%22 = OpTypePointer UniformConstant %21
%23 = OpVariable %22 UniformConstant
%24 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%25 = OpTypePointer UniformConstant %24
%26 = OpVariable %25 UniformConstant
%27 = OpTypeSampler
%28 = OpTypePointer UniformConstant %27
%29 = OpVariable %28 UniformConstant
%30 = OpTypeVector %5 4
%31 = OpTypePointer Input %30
%32 = OpVariable %31 Input
%33 = OpTypeVector %5 2
%34 = OpTypePointer Output %33
%35 = OpVariable %34 Output
%44 = OpTypePointer Input %5
%46 = OpTypeInt 32 0
%47 = OpConstant %46 0
%50 = OpConstant %46 1
%53 = OpConstant %46 2
%56 = OpConstant %46 3
%58 = OpTypeSampledImage %6
%60 = OpTypeInt 32 1
%61 = OpConstant %60 0
%65 = OpTypeSampledImage %9
%72 = OpTypeSampledImage %12
%78 = OpTypeVector %60 2
%79 = OpConstantComposite %78 %61 %61
%84 = OpTypeSampledImage %15
%87 = OpTypeVector %5 3
%94 = OpTypeSampledImage %18
%100 = OpTypeVector %60 3
%101 = OpConstantComposite %100 %61 %61 %61
%106 = OpTypeSampledImage %21
%116 = OpTypeSampledImage %24
%125 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %128
%128 = OpLabel
%36 = OpLoad %24 %26
%37 = OpLoad %21 %23
%38 = OpLoad %18 %20
%39 = OpLoad %15 %17
%40 = OpLoad %12 %14
%41 = OpLoad %9 %11
%42 = OpLoad %6 %8
%43 = OpLoad %27 %29
%45 = OpAccessChain %44 %32 %47
%48 = OpLoad %5 %45
%49 = OpAccessChain %44 %32 %50
%51 = OpLoad %5 %49
%52 = OpAccessChain %44 %32 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %44 %32 %56
%57 = OpLoad %5 %55
%59 = OpSampledImage %58 %42 %43
%62 = OpImageSampleExplicitLod %30 %59 %48 Grad|ConstOffset %54 %57 %61
%63 = OpCompositeExtract %5 %62 0
%64 = OpCompositeExtract %5 %62 1
%66 = OpSampledImage %65 %41 %43
%68 = OpCompositeConstruct %33 %48 %51
%67 = OpImageSampleExplicitLod %30 %66 %68 Grad|ConstOffset %54 %51 %61
%69 = OpCompositeExtract %5 %67 0
%70 = OpFAdd %5 %69 %63
%71 = OpFAdd %5 %69 %64
%73 = OpSampledImage %72 %40 %43
%75 = OpCompositeConstruct %33 %48 %51
%76 = OpCompositeConstruct %33 %54 %54
%77 = OpCompositeConstruct %33 %57 %57
%74 = OpImageSampleExplicitLod %30 %73 %75 Grad|ConstOffset %76 %77 %79
%80 = OpCompositeExtract %5 %74 0
%81 = OpCompositeExtract %5 %74 1
%82 = OpFAdd %5 %70 %80
%83 = OpFAdd %5 %71 %81
%85 = OpSampledImage %84 %39 %43
%88 = OpCompositeConstruct %87 %48 %51 %54
%89 = OpCompositeConstruct %33 %54 %54
%90 = OpCompositeConstruct %33 %57 %57
%86 = OpImageSampleExplicitLod %30 %85 %88 Grad|ConstOffset %89 %90 %79
%91 = OpCompositeExtract %5 %86 0
%92 = OpFAdd %5 %82 %91
%93 = OpFAdd %5 %83 %91
%95 = OpSampledImage %94 %38 %43
%97 = OpCompositeConstruct %87 %48 %51 %54
%98 = OpCompositeConstruct %87 %54 %54 %54
%99 = OpCompositeConstruct %87 %57 %57 %57
%96 = OpImageSampleExplicitLod %30 %95 %97 Grad|ConstOffset %98 %99 %101
%102 = OpCompositeExtract %5 %96 0
%103 = OpCompositeExtract %5 %96 1
%104 = OpFAdd %5 %92 %102
%105 = OpFAdd %5 %93 %103
%107 = OpSampledImage %106 %37 %43
%109 = OpCompositeConstruct %87 %48 %51 %54
%110 = OpCompositeConstruct %87 %54 %54 %54
%111 = OpCompositeConstruct %87 %57 %57 %57
%108 = OpImageSampleExplicitLod %30 %107 %109 Grad %110 %111
%112 = OpCompositeExtract %5 %108 0
%113 = OpCompositeExtract %5 %108 1
%114 = OpFAdd %5 %104 %112
%115 = OpFAdd %5 %105 %113
%117 = OpSampledImage %116 %36 %43
%119 = OpCompositeConstruct %30 %48 %51 %54 %57
%120 = OpCompositeConstruct %87 %54 %54 %54
%121 = OpCompositeConstruct %87 %57 %57 %57
%118 = OpImageSampleExplicitLod %30 %117 %119 Grad %120 %121
%122 = OpCompositeExtract %5 %118 0
%123 = OpFAdd %5 %114 %122
%124 = OpFAdd %5 %115 %122
%126 = OpAccessChain %125 %35 %47
OpStore %126 %123
%127 = OpAccessChain %125 %35 %50
OpStore %127 %124
OpReturn
OpFunctionEnd
#endif
