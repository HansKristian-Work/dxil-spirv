SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability UniformBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %13 %15 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %15 "INDEX"
OpName %17 "SV_TARGET"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %17 Location 0
OpDecorate %18 NonUniform
OpDecorate %20 NonUniform
OpDecorate %23 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 8
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypeRuntimeArray %10
%12 = OpTypePointer Uniform %11
%13 = OpVariable %12 Uniform
%14 = OpTypePointer Input %5
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %8
%17 = OpVariable %16 Output
%19 = OpTypePointer Uniform %10
%21 = OpConstant %5 2
%22 = OpTypePointer Uniform %8
%24 = OpConstant %5 0
%27 = OpTypePointer Output %7
%31 = OpConstant %5 1
%36 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%18 = OpLoad %5 %15
%20 = OpAccessChain %19 %13 %18
%23 = OpAccessChain %22 %20 %24 %21
%25 = OpLoad %8 %23
%26 = OpCompositeExtract %7 %25 0
%28 = OpAccessChain %27 %17 %24
OpStore %28 %26
%29 = OpCompositeExtract %7 %25 1
%30 = OpAccessChain %27 %17 %31
OpStore %30 %29
%32 = OpCompositeExtract %7 %25 2
%33 = OpAccessChain %27 %17 %21
OpStore %33 %32
%34 = OpCompositeExtract %7 %25 3
%35 = OpAccessChain %27 %17 %36
OpStore %35 %34
OpReturn
OpFunctionEnd

