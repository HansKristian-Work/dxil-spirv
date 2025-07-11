SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability StorageImageWriteWithoutFormat
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonReadable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %16 NonUniform
OpDecorate %19 NonUniform
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
%13 = OpTypeVector %10 2
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%17 = OpTypePointer UniformConstant %6
%21 = OpConstant %10 0
%23 = OpTypeVector %5 4
%25 = OpConstant %5 1
%26 = OpConstant %5 2
%27 = OpConstant %5 3
%28 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%16 = OpLoad %10 %12
%18 = OpAccessChain %17 %9 %16
%19 = OpLoad %6 %18
%20 = OpAccessChain %11 %15 %21
%22 = OpLoad %10 %20
%29 = OpCompositeConstruct %23 %25 %26 %27 %28
OpImageWrite %19 %22 %29 NonPrivateTexel
OpReturn
OpFunctionEnd

