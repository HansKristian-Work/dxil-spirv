#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _8;
layout(set = 0, binding = 0) uniform sampler _12[];
layout(set = 1, binding = 0) uniform sampler _17[100];

layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _31 = textureOffset(sampler2D(_8, _12[2u]), vec2(0.5), ivec2(0));
    vec4 _44 = textureOffset(sampler2D(_8, _17[3u]), vec2(0.5), ivec2(0));
    SV_Target.x = _44.x + _31.x;
    SV_Target.y = _44.y + _31.y;
    SV_Target.z = _44.z + _31.z;
    SV_Target.w = _44.w + _31.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 63
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
%29 = OpTypeInt 32 1
%30 = OpConstant %29 0
%32 = OpTypeVector %5 2
%34 = OpTypeVector %29 2
%35 = OpConstantComposite %34 %30 %30
%41 = OpConstant %13 3
%54 = OpTypePointer Output %5
%56 = OpConstant %13 0
%58 = OpConstant %13 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %61
%61 = OpLabel
%21 = OpLoad %6 %8
%23 = OpAccessChain %22 %12 %24
%25 = OpLoad %9 %23
%27 = OpSampledImage %26 %21 %25
%33 = OpCompositeConstruct %32 %28 %28
%31 = OpImageSampleImplicitLod %18 %27 %33 ConstOffset %35
%36 = OpCompositeExtract %5 %31 0
%37 = OpCompositeExtract %5 %31 1
%38 = OpCompositeExtract %5 %31 2
%39 = OpCompositeExtract %5 %31 3
%40 = OpAccessChain %22 %17 %41
%42 = OpLoad %9 %40
%43 = OpSampledImage %26 %21 %42
%45 = OpCompositeConstruct %32 %28 %28
%44 = OpImageSampleImplicitLod %18 %43 %45 ConstOffset %35
%46 = OpCompositeExtract %5 %44 0
%47 = OpCompositeExtract %5 %44 1
%48 = OpCompositeExtract %5 %44 2
%49 = OpCompositeExtract %5 %44 3
%50 = OpFAdd %5 %46 %36
%51 = OpFAdd %5 %47 %37
%52 = OpFAdd %5 %48 %38
%53 = OpFAdd %5 %49 %39
%55 = OpAccessChain %54 %20 %56
OpStore %55 %50
%57 = OpAccessChain %54 %20 %58
OpStore %57 %51
%59 = OpAccessChain %54 %20 %24
OpStore %59 %52
%60 = OpAccessChain %54 %20 %41
OpStore %60 %53
OpReturn
OpFunctionEnd
#endif
