#version 460

layout(set = 0, binding = 0, r32ui) uniform readonly writeonly uimageBuffer _8;
layout(set = 7, binding = 0, r32ui) uniform uimageBuffer _9;
layout(set = 0, binding = 1, r32ui) uniform readonly writeonly uimageBuffer _10;
layout(set = 7, binding = 1, r32ui) uniform uimageBuffer _11;

layout(location = 0) out uint SV_Target;

void main()
{
    uint _19 = imageAtomicAdd(_9, int(0u), 1u);
    uint _23 = imageAtomicAdd(_11, int(0u), 4294967295u);
    SV_Target = (_23 - 1u) + _19;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %9 %10 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "SV_Target"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %8 NonWritable
OpDecorate %9 DescriptorSet 7
OpDecorate %9 Binding 0
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 1
OpDecorate %10 NonReadable
OpDecorate %10 NonWritable
OpDecorate %11 DescriptorSet 7
OpDecorate %11 Binding 1
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpVariable %7 UniformConstant
%11 = OpVariable %7 UniformConstant
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%16 = OpTypePointer Image %5
%18 = OpConstant %5 0
%20 = OpConstant %5 5
%21 = OpConstant %5 1
%24 = OpConstant %5 4294967295
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %27
%27 = OpLabel
%14 = OpLoad %6 %10
%15 = OpLoad %6 %8
%17 = OpImageTexelPointer %16 %9 %18 %18
%19 = OpAtomicIAdd %5 %17 %20 %18 %21
%22 = OpImageTexelPointer %16 %11 %18 %18
%23 = OpAtomicIAdd %5 %22 %20 %18 %24
%25 = OpISub %5 %23 %21
%26 = OpIAdd %5 %25 %19
OpStore %13 %26
OpReturn
OpFunctionEnd
#endif
