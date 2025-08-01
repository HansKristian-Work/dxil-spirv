SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 23
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %11
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 EarlyFragmentTests
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "INDEX"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%14 = OpConstant %5 4
%15 = OpTypePointer StorageBuffer %5
%17 = OpConstant %5 0
%19 = OpConstant %5 5
%20 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %21
%21 = OpLabel
%12 = OpLoad %5 %11
%16 = OpAccessChain %15 %9 %17 %12
%18 = OpAtomicOr %5 %16 %19 %17 %20
OpReturn
OpFunctionEnd

