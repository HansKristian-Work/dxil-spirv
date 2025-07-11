SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability Image1D
OpCapability ImageQuery
OpCapability RuntimeDescriptorArray
OpCapability StorageImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %17 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %17 "SV_TARGET"
OpName %18 "SV_TARGET_1"
OpName %34 ""
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonReadable
OpDecorate %9 NonWritable
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %17 Location 0
OpDecorate %18 Location 1
OpDecorate %29 NonUniform
OpDecorate %32 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 2 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 4
%12 = OpTypeArray %5 %11
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypePointer Output %10
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%20 = OpConstant %10 0
%21 = OpConstant %10 16
%25 = OpConstant %10 2
%26 = OpTypePointer Uniform %5
%30 = OpTypePointer UniformConstant %6
%34 = OpTypeStruct %10 %10
%36 = OpConstant %10 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%19 = OpIMul %10 %20 %21
%22 = OpIMul %10 %20 %11
%23 = OpIAdd %10 %19 %22
%24 = OpShiftRightLogical %10 %23 %25
%27 = OpAccessChain %26 %15 %20 %24
%28 = OpLoad %5 %27
%29 = OpBitcast %10 %28
%31 = OpAccessChain %30 %9 %29
%32 = OpLoad %6 %31
%33 = OpImageQuerySize %10 %32
%35 = OpCompositeConstruct %34 %33 %36
OpStore %17 %33
OpStore %18 %36
OpReturn
OpFunctionEnd

