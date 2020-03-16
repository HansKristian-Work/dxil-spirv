#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _12[];
layout(set = 1, binding = 0) uniform sampler _17[100];

layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _32 = textureOffset(sampler2D(_8, _12[2u]), vec2(0.5), ivec2(0));
    vec4 _45 = textureOffset(sampler2D(_8, _17[3u]), vec2(0.5), ivec2(0));
    SV_Target.x = _45.x + _32.x;
    SV_Target.y = _45.y + _32.y;
    SV_Target.z = _45.z + _32.z;
    SV_Target.w = _45.w + _32.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %20 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %17 DescriptorSet 1
OpDecorate %17 Binding 0
OpDecorate %20 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypeRuntimeArray %9
%11 = OpTypePointer UniformConstant %10
%12 = OpVariable %11 UniformConstant
%13 = OpTypeInt 32 0
%14 = OpConstant %13 100
%15 = OpTypeArray %9 %14
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypeVector %5 4
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%22 = OpTypePointer UniformConstant %9
%24 = OpConstant %13 2
%26 = OpTypeImage %5 2D 0 0 0 2 Unknown
%27 = OpTypeSampledImage %26
%29 = OpConstant %5 0.5
%30 = OpTypeInt 32 1
%31 = OpConstant %30 0
%33 = OpTypeVector %5 2
%35 = OpTypeVector %30 2
%36 = OpConstantComposite %35 %31 %31
%42 = OpConstant %13 3
%55 = OpTypePointer Output %5
%57 = OpConstant %13 0
%59 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %62
%62 = OpLabel
%21 = OpLoad %6 %8
%23 = OpAccessChain %22 %12 %24
%25 = OpLoad %9 %23
%28 = OpSampledImage %27 %21 %25
%34 = OpCompositeConstruct %33 %29 %29
%32 = OpImageSampleImplicitLod %18 %28 %34 ConstOffset %36
%37 = OpCompositeExtract %5 %32 0
%38 = OpCompositeExtract %5 %32 1
%39 = OpCompositeExtract %5 %32 2
%40 = OpCompositeExtract %5 %32 3
%41 = OpAccessChain %22 %17 %42
%43 = OpLoad %9 %41
%44 = OpSampledImage %27 %21 %43
%46 = OpCompositeConstruct %33 %29 %29
%45 = OpImageSampleImplicitLod %18 %44 %46 ConstOffset %36
%47 = OpCompositeExtract %5 %45 0
%48 = OpCompositeExtract %5 %45 1
%49 = OpCompositeExtract %5 %45 2
%50 = OpCompositeExtract %5 %45 3
%51 = OpFAdd %5 %47 %37
%52 = OpFAdd %5 %48 %38
%53 = OpFAdd %5 %49 %39
%54 = OpFAdd %5 %50 %40
%56 = OpAccessChain %55 %20 %57
OpStore %56 %51
%58 = OpAccessChain %55 %20 %59
OpStore %58 %52
%60 = OpAccessChain %55 %20 %24
OpStore %60 %53
%61 = OpAccessChain %55 %20 %42
OpStore %61 %54
OpReturn
OpFunctionEnd
#endif
