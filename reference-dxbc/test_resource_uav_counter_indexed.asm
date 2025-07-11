SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %10 %13 %16
OpExecutionMode %3 LocalSize 32 1 1
OpName %3 "main"
OpName %7 "SSBO"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonReadable
OpDecorate %10 NonWritable
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %16 BuiltIn WorkgroupId
OpDecorate %20 NonUniform
OpDecorate %22 NonUniform
OpDecorate %24 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%12 = OpTypePointer UniformConstant %11
%13 = OpVariable %12 UniformConstant
%14 = OpTypeVector %5 3
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Input %5
%19 = OpConstant %5 0
%21 = OpTypePointer StorageBuffer %7
%23 = OpTypePointer Image %5
%26 = OpConstant %5 5
%27 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%18 = OpAccessChain %17 %16 %19
%20 = OpLoad %5 %18
%22 = OpAccessChain %21 %10 %20
%24 = OpImageTexelPointer %23 %13 %19 %19
%25 = OpAtomicIAdd %5 %24 %26 %19 %27
OpReturn
OpFunctionEnd

