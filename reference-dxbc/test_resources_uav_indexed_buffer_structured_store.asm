SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 38
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonReadable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %16 NonUniform
OpDecorate %18 NonUniform
OpDecorate %33 NonUniform
OpDecorate %34 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypePointer Input %5
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 2
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%17 = OpTypePointer StorageBuffer %7
%20 = OpConstant %5 0
%23 = OpConstant %5 1
%27 = OpConstant %5 2
%29 = OpConstant %5 20
%32 = OpTypePointer StorageBuffer %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %36
%36 = OpLabel
%16 = OpLoad %5 %12
%18 = OpAccessChain %17 %10 %16
%19 = OpAccessChain %11 %15 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %15 %23
%24 = OpLoad %5 %22
%25 = OpCompositeConstruct %13 %21 %24
%26 = OpCompositeConstruct %13 %23 %27
%28 = OpIMul %5 %21 %29
%30 = OpShiftRightLogical %5 %24 %27
%31 = OpIAdd %5 %28 %30
%33 = OpAccessChain %32 %18 %20 %31
OpStore %33 %23 NonPrivatePointer
%35 = OpIAdd %5 %31 %23
%34 = OpAccessChain %32 %18 %20 %35
OpStore %34 %27 NonPrivatePointer
OpReturn
OpFunctionEnd

