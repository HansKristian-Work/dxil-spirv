SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 46
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
OpDecorate %32 NonUniform
OpDecorate %33 NonUniform
OpDecorate %35 NonUniform
OpDecorate %37 NonUniform
OpDecorate %38 NonUniform
OpDecorate %40 NonUniform
OpDecorate %43 NonUniform
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
%23 = OpConstant %5 4
%25 = OpConstant %5 2
%26 = OpTypeVector %5 3
%28 = OpConstant %5 1
%29 = OpConstant %5 3
%31 = OpTypePointer StorageBuffer %5
%42 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %44
%44 = OpLabel
%16 = OpLoad %5 %12
%18 = OpAccessChain %17 %10 %16
%19 = OpAccessChain %11 %15 %20
%21 = OpLoad %5 %19
%22 = OpIMul %5 %21 %23
%24 = OpIAdd %5 %22 %25
%30 = OpShiftRightLogical %5 %24 %25
%32 = OpAccessChain %31 %18 %20 %30
OpStore %32 %28 NonPrivatePointer
%34 = OpIAdd %5 %30 %28
%33 = OpAccessChain %31 %18 %20 %34
OpStore %33 %25 NonPrivatePointer
%36 = OpIAdd %5 %30 %25
%35 = OpAccessChain %31 %18 %20 %36
OpStore %35 %29 NonPrivatePointer
%37 = OpAccessChain %31 %18 %20 %28
OpStore %37 %28 NonPrivatePointer
%39 = OpIAdd %5 %28 %28
%38 = OpAccessChain %31 %18 %20 %39
OpStore %38 %25 NonPrivatePointer
%41 = OpIAdd %5 %28 %25
%40 = OpAccessChain %31 %18 %20 %41
OpStore %40 %29 NonPrivatePointer
%43 = OpAccessChain %31 %18 %20 %28
OpStore %43 %42 NonPrivatePointer
OpReturn
OpFunctionEnd

