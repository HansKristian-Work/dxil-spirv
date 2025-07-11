SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12 %15 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpName %18 "SV_TARGET"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %18 Location 0
OpDecorate %19 NonUniform
OpDecorate %22 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %10 2
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypeVector %5 4
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%20 = OpTypePointer UniformConstant %6
%24 = OpConstant %10 0
%32 = OpTypePointer Output %5
%35 = OpConstant %10 1
%37 = OpConstant %10 2
%39 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%19 = OpLoad %10 %12
%21 = OpAccessChain %20 %9 %19
%22 = OpLoad %6 %21
%23 = OpAccessChain %11 %15 %24
%25 = OpLoad %10 %23
%26 = OpImageRead %16 %22 %25 NonPrivateTexel
%27 = OpCompositeExtract %5 %26 0
%28 = OpCompositeExtract %5 %26 1
%29 = OpCompositeExtract %5 %26 2
%30 = OpCompositeExtract %5 %26 3
%33 = OpAccessChain %32 %18 %24
OpStore %33 %27
%34 = OpAccessChain %32 %18 %35
OpStore %34 %28
%36 = OpAccessChain %32 %18 %37
OpStore %36 %29
%38 = OpAccessChain %32 %18 %39
OpStore %38 %30
OpReturn
OpFunctionEnd

