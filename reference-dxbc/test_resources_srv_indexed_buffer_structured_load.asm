SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %12 %15 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpName %17 "SV_TARGET"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %17 Location 0
OpDecorate %18 NonUniform
OpDecorate %20 NonUniform
OpDecorate %34 NonUniform
OpDecorate %36 NonUniform
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
%16 = OpTypePointer Output %13
%17 = OpVariable %16 Output
%19 = OpTypePointer StorageBuffer %7
%22 = OpConstant %5 0
%25 = OpConstant %5 1
%29 = OpConstant %5 4
%31 = OpConstant %5 20
%33 = OpTypePointer StorageBuffer %5
%43 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%18 = OpLoad %5 %12
%20 = OpAccessChain %19 %10 %18
%21 = OpAccessChain %11 %15 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %11 %15 %25
%26 = OpLoad %5 %24
%30 = OpIMul %5 %23 %31
%32 = OpIAdd %5 %30 %26
%34 = OpAccessChain %33 %20 %22 %32
%35 = OpLoad %5 %34
%37 = OpIAdd %5 %32 %25
%36 = OpAccessChain %33 %20 %22 %37
%38 = OpLoad %5 %36
%39 = OpCompositeConstruct %13 %35 %38
%40 = OpCompositeExtract %5 %39 0
%41 = OpCompositeExtract %5 %39 1
%44 = OpAccessChain %43 %17 %22
OpStore %44 %40
%45 = OpAccessChain %43 %17 %25
OpStore %45 %41
OpReturn
OpFunctionEnd

