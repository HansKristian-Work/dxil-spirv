#version 460
#extension GL_EXT_nonuniform_qualifier : require

layout(set = 0, binding = 0) uniform readonly imageBuffer _9[];

layout(location = 0) flat in uint INDEX;
layout(location = 0) out vec4 SV_Target;

void main()
{
    vec4 _22 = imageLoad(_9[nonuniformEXT(INDEX + 0u)], int(INDEX));
    SV_Target.x = _22.x;
    SV_Target.y = _22.y;
    SV_Target.z = _22.z;
    SV_Target.w = _22.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageReadWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "INDEX"
OpName %15 "SV_Target"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 0
OpDecorate %21 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%18 = OpConstant %10 0
%19 = OpTypePointer UniformConstant %6
%27 = OpTypePointer Output %5
%30 = OpConstant %10 1
%32 = OpConstant %10 2
%34 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%16 = OpLoad %10 %12
%17 = OpIAdd %10 %16 %18
%20 = OpAccessChain %19 %9 %17
%21 = OpLoad %6 %20
%22 = OpImageRead %13 %21 %16
%23 = OpCompositeExtract %5 %22 0
%24 = OpCompositeExtract %5 %22 1
%25 = OpCompositeExtract %5 %22 2
%26 = OpCompositeExtract %5 %22 3
%28 = OpAccessChain %27 %15 %18
OpStore %28 %23
%29 = OpAccessChain %27 %15 %30
OpStore %29 %24
%31 = OpAccessChain %27 %15 %32
OpStore %31 %25
%33 = OpAccessChain %27 %15 %34
OpStore %33 %26
OpReturn
OpFunctionEnd
#endif
