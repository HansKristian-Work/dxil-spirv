#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0, r32f) uniform readonly image2D _9[];
layout(set = 1, binding = 0, r32f) uniform readonly image2D _14[100];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _26 = imageLoad(_9[nonuniformEXT(INDEX + 0u)], ivec2(uvec2(0u)));
    vec4 _38 = imageLoad(_14[nonuniformEXT((INDEX ^ 1u) + 0u)], ivec2(uvec2(0u)));
    SV_Target.x = _38.x + _26.x;
    SV_Target.y = _38.y + _26.y;
    SV_Target.z = _38.z + _26.z;
    SV_Target.w = _38.w + _26.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 57
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
OpDecorate %35 NonUniform
OpDecorate %37 NonUniform
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
%27 = OpTypeVector %10 2
%34 = OpConstant %10 1
%48 = OpTypePointer Output %5
%52 = OpConstant %10 2
%54 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %55
%55 = OpLabel
%20 = OpLoad %10 %16
%21 = OpIAdd %10 %20 %22
%24 = OpAccessChain %23 %9 %21
%25 = OpLoad %6 %24
%28 = OpCompositeConstruct %27 %22 %22
%26 = OpImageRead %17 %25 %28 None
%29 = OpCompositeExtract %5 %26 0
%30 = OpCompositeExtract %5 %26 1
%31 = OpCompositeExtract %5 %26 2
%32 = OpCompositeExtract %5 %26 3
%33 = OpBitwiseXor %10 %20 %34
%35 = OpIAdd %10 %33 %22
%36 = OpAccessChain %23 %14 %35
%37 = OpLoad %6 %36
%39 = OpCompositeConstruct %27 %22 %22
%38 = OpImageRead %17 %37 %39 None
%40 = OpCompositeExtract %5 %38 0
%41 = OpCompositeExtract %5 %38 1
%42 = OpCompositeExtract %5 %38 2
%43 = OpCompositeExtract %5 %38 3
%44 = OpFAdd %5 %40 %29
%45 = OpFAdd %5 %41 %30
%46 = OpFAdd %5 %42 %31
%47 = OpFAdd %5 %43 %32
%49 = OpAccessChain %48 %19 %22
OpStore %49 %44
%50 = OpAccessChain %48 %19 %34
OpStore %50 %45
%51 = OpAccessChain %48 %19 %52
OpStore %51 %46
%53 = OpAccessChain %48 %19 %54
OpStore %53 %47
OpReturn
OpFunctionEnd
#endif
