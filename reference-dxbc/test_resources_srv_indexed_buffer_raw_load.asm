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
OpEntryPoint Fragment %3 "main" %11 %13 %15 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO"
OpName %13 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpName %17 "SV_TARGET"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonWritable
OpDecorate %11 Restrict
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %13 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %17 Location 0
OpDecorate %18 NonUniform
OpDecorate %20 NonUniform
OpDecorate %36 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypeRuntimeArray %8
%10 = OpTypePointer StorageBuffer %9
%11 = OpVariable %10 StorageBuffer
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%14 = OpTypePointer Input %6
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %6
%17 = OpVariable %16 Output
%19 = OpTypePointer StorageBuffer %8
%22 = OpConstant %5 0
%25 = OpConstant %5 4
%27 = OpConstant %5 2
%29 = OpConstant %5 16
%31 = OpConstant %5 8
%34 = OpConstant %5 1
%35 = OpTypePointer StorageBuffer %6
%41 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %44
%44 = OpLabel
%18 = OpLoad %5 %13
%20 = OpAccessChain %19 %11 %18
%21 = OpAccessChain %12 %15 %22
%23 = OpLoad %5 %21
%24 = OpIMul %5 %23 %25
%26 = OpIAdd %5 %24 %27
%28 = OpIMul %5 %29 %23
%30 = OpIAdd %5 %28 %31
%32 = OpIMul %5 %23 %27
%33 = OpIAdd %5 %32 %34
%36 = OpAccessChain %35 %20 %22 %33
%37 = OpLoad %6 %36
%38 = OpCompositeExtract %5 %37 0
%39 = OpCompositeExtract %5 %37 1
%40 = OpCompositeConstruct %6 %38 %39
%42 = OpAccessChain %41 %17 %22
OpStore %42 %38
%43 = OpAccessChain %41 %17 %34
OpStore %43 %39
OpReturn
OpFunctionEnd

