#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32f) uniform readonly image2D _9[];
layout(set = 1, binding = 0, r32f) uniform readonly image2D _14[100];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _28 = imageLoad(_9[nonuniformEXT(INDEX + 0u)], ivec2(uvec2(0u)));
    vec4 _40 = imageLoad(_14[nonuniformEXT((INDEX ^ 1u) + 0u)], ivec2(uvec2(0u)));
    SV_Target.x = _40.x + _28.x;
    SV_Target.y = _40.y + _28.y;
    SV_Target.z = _40.z + _28.z;
    SV_Target.w = _40.w + _28.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageImageArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %16 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "INDEX"
OpName %19 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %14 DescriptorSet 1
OpDecorate %14 Binding 0
OpDecorate %14 NonWritable
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %19 Location 0
OpDecorate %21 NonUniform
OpDecorate %25 NonUniform
OpDecorate %37 NonUniform
OpDecorate %39 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 R32f
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 100
%12 = OpTypeArray %6 %11
%13 = OpTypePointer UniformConstant %12
%14 = OpVariable %13 UniformConstant
%15 = OpTypePointer Input %10
%16 = OpVariable %15 Input
%17 = OpTypeVector %5 4
%18 = OpTypePointer Output %17
%19 = OpVariable %18 Output
%22 = OpConstant %10 0
%23 = OpTypePointer UniformConstant %6
%26 = OpTypeInt 32 1
%27 = OpConstant %26 0
%29 = OpTypeVector %10 2
%36 = OpConstant %10 1
%50 = OpTypePointer Output %5
%54 = OpConstant %10 2
%56 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%20 = OpLoad %10 %16
%21 = OpIAdd %10 %20 %22
%24 = OpAccessChain %23 %9 %21
%25 = OpLoad %6 %24
%30 = OpCompositeConstruct %29 %22 %22
%28 = OpImageRead %17 %25 %30 None
%31 = OpCompositeExtract %5 %28 0
%32 = OpCompositeExtract %5 %28 1
%33 = OpCompositeExtract %5 %28 2
%34 = OpCompositeExtract %5 %28 3
%35 = OpBitwiseXor %10 %20 %36
%37 = OpIAdd %10 %35 %22
%38 = OpAccessChain %23 %14 %37
%39 = OpLoad %6 %38
%41 = OpCompositeConstruct %29 %22 %22
%40 = OpImageRead %17 %39 %41 None
%42 = OpCompositeExtract %5 %40 0
%43 = OpCompositeExtract %5 %40 1
%44 = OpCompositeExtract %5 %40 2
%45 = OpCompositeExtract %5 %40 3
%46 = OpFAdd %5 %42 %31
%47 = OpFAdd %5 %43 %32
%48 = OpFAdd %5 %44 %33
%49 = OpFAdd %5 %45 %34
%51 = OpAccessChain %50 %19 %22
OpStore %51 %46
%52 = OpAccessChain %50 %19 %36
OpStore %52 %47
%53 = OpAccessChain %50 %19 %54
OpStore %53 %48
%55 = OpAccessChain %50 %19 %56
OpStore %55 %49
OpReturn
OpFunctionEnd
#endif
