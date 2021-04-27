#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform texture2D _9[];
layout(set = 1, binding = 0) uniform texture2D _14[100];
layout(set = 0, binding = 0) uniform sampler _17;

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _34 = texture(nonuniformEXT(sampler2D(_9[INDEX + 0u], _17)), vec2(0.5));
    vec4 _47 = texture(nonuniformEXT(sampler2D(_14[(INDEX ^ 1u) + 0u], _17)), vec2(0.5));
    SV_Target.x = _47.x + _34.x;
    SV_Target.y = _47.y + _34.y;
    SV_Target.z = _47.z + _34.z;
    SV_Target.w = _47.w + _34.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %19 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %19 "INDEX"
OpName %22 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %17 DescriptorSet 0
OpDecorate %17 Binding 0
OpDecorate %19 Flat
OpDecorate %19 Location 0
OpDecorate %22 Location 0
OpDecorate %25 NonUniform
OpDecorate %29 NonUniform
OpDecorate %31 NonUniform
OpDecorate %43 NonUniform
OpDecorate %45 NonUniform
OpDecorate %46 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 100
%12 = OpTypeArray %6 %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypeSampler
%16 = OpTypePointer UniformConstant %15
%17 = OpVariable %16 UniformConstant
%18 = OpTypePointer Input %10
%19 = OpVariable %18 Input
%20 = OpTypeVector %5 4
%21 = OpTypePointer Output %20
%22 = OpVariable %21 Output
%26 = OpConstant %10 0
%27 = OpTypePointer UniformConstant %6
%30 = OpTypeSampledImage %6
%32 = OpConstant %5 0.5
%33 = OpConstant %5 0
%35 = OpTypeVector %5 2
%42 = OpConstant %10 1
%57 = OpTypePointer Output %5
%61 = OpConstant %10 2
%63 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %64
%64 = OpLabel
%23 = OpLoad %15 %17
%24 = OpLoad %10 %19
%25 = OpIAdd %10 %24 %26
%28 = OpAccessChain %27 %9 %25
%29 = OpLoad %6 %28
%31 = OpSampledImage %30 %29 %23
%36 = OpCompositeConstruct %35 %32 %32
%34 = OpImageSampleImplicitLod %20 %31 %36 None
%37 = OpCompositeExtract %5 %34 0
%38 = OpCompositeExtract %5 %34 1
%39 = OpCompositeExtract %5 %34 2
%40 = OpCompositeExtract %5 %34 3
%41 = OpBitwiseXor %10 %24 %42
%43 = OpIAdd %10 %41 %26
%44 = OpAccessChain %27 %14 %43
%45 = OpLoad %6 %44
%46 = OpSampledImage %30 %45 %23
%48 = OpCompositeConstruct %35 %32 %32
%47 = OpImageSampleImplicitLod %20 %46 %48 None
%49 = OpCompositeExtract %5 %47 0
%50 = OpCompositeExtract %5 %47 1
%51 = OpCompositeExtract %5 %47 2
%52 = OpCompositeExtract %5 %47 3
%53 = OpFAdd %5 %49 %37
%54 = OpFAdd %5 %50 %38
%55 = OpFAdd %5 %51 %39
%56 = OpFAdd %5 %52 %40
%58 = OpAccessChain %57 %22 %26
OpStore %58 %53
%59 = OpAccessChain %57 %22 %42
OpStore %59 %54
%60 = OpAccessChain %57 %22 %61
OpStore %60 %55
%62 = OpAccessChain %57 %22 %63
OpStore %62 %56
OpReturn
OpFunctionEnd
#endif
