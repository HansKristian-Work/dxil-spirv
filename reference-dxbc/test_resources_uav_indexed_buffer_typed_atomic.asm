SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 29
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %11 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "BUFFER_INDEX"
OpName %14 "BUFFER_ADDRESS"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %11 Component 2
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %15 NonUniform
OpDecorate %18 NonUniform
OpDecorate %23 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 2
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%16 = OpTypePointer UniformConstant %6
%20 = OpConstant %5 0
%22 = OpTypePointer Image %5
%25 = OpConstant %5 5
%26 = OpConstant %5 16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %27
%27 = OpLabel
%15 = OpLoad %5 %11
%17 = OpAccessChain %16 %9 %15
%18 = OpLoad %6 %17
%19 = OpAccessChain %10 %14 %20
%21 = OpLoad %5 %19
%23 = OpImageTexelPointer %22 %17 %21 %20
%24 = OpAtomicIAdd %5 %23 %25 %20 %26
OpReturn
OpFunctionEnd

