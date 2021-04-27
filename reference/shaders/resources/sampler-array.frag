#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _12[];
layout(set = 1, binding = 0) uniform sampler _17[100];

layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _30 = texture(sampler2D(_8, _12[2u]), vec2(0.5));
    vec4 _41 = texture(sampler2D(_8, _17[3u]), vec2(0.5));
    SV_Target.x = _41.x + _30.x;
    SV_Target.y = _41.y + _30.y;
    SV_Target.z = _41.z + _30.z;
    SV_Target.w = _41.w + _30.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 60
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
%26 = OpTypeSampledImage %6
%28 = OpConstant %5 0.5
%29 = OpConstant %5 0
%31 = OpTypeVector %5 2
%38 = OpConstant %13 3
%51 = OpTypePointer Output %5
%53 = OpConstant %13 0
%55 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %58
%58 = OpLabel
%21 = OpLoad %6 %8
%23 = OpAccessChain %22 %12 %24
%25 = OpLoad %9 %23
%27 = OpSampledImage %26 %21 %25
%32 = OpCompositeConstruct %31 %28 %28
%30 = OpImageSampleImplicitLod %18 %27 %32 None
%33 = OpCompositeExtract %5 %30 0
%34 = OpCompositeExtract %5 %30 1
%35 = OpCompositeExtract %5 %30 2
%36 = OpCompositeExtract %5 %30 3
%37 = OpAccessChain %22 %17 %38
%39 = OpLoad %9 %37
%40 = OpSampledImage %26 %21 %39
%42 = OpCompositeConstruct %31 %28 %28
%41 = OpImageSampleImplicitLod %18 %40 %42 None
%43 = OpCompositeExtract %5 %41 0
%44 = OpCompositeExtract %5 %41 1
%45 = OpCompositeExtract %5 %41 2
%46 = OpCompositeExtract %5 %41 3
%47 = OpFAdd %5 %43 %33
%48 = OpFAdd %5 %44 %34
%49 = OpFAdd %5 %45 %35
%50 = OpFAdd %5 %46 %36
%52 = OpAccessChain %51 %20 %53
OpStore %52 %47
%54 = OpAccessChain %51 %20 %55
OpStore %54 %48
%56 = OpAccessChain %51 %20 %24
OpStore %56 %49
%57 = OpAccessChain %51 %20 %38
OpStore %57 %50
OpReturn
OpFunctionEnd
#endif
