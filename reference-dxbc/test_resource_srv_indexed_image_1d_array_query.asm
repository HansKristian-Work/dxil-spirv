SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability Sampled1D
OpCapability ImageQuery
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %17 %18 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %17 "SV_TARGET"
OpName %18 "SV_TARGET_1"
OpName %19 "SV_TARGET_2"
OpName %38 ""
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %17 Location 0
OpDecorate %18 Location 1
OpDecorate %19 Location 2
OpDecorate %30 NonUniform
OpDecorate %33 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 1 0 1 Unknown
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
%19 = OpVariable %16 Output
%21 = OpConstant %10 0
%22 = OpConstant %10 16
%26 = OpConstant %10 2
%27 = OpTypePointer Uniform %5
%31 = OpTypePointer UniformConstant %6
%34 = OpTypeVector %10 2
%38 = OpTypeStruct %10 %10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %41
%41 = OpLabel
%20 = OpIMul %10 %21 %22
%23 = OpIMul %10 %21 %11
%24 = OpIAdd %10 %20 %23
%25 = OpShiftRightLogical %10 %24 %26
%28 = OpAccessChain %27 %15 %21 %25
%29 = OpLoad %5 %28
%30 = OpBitcast %10 %29
%32 = OpAccessChain %31 %9 %30
%33 = OpLoad %6 %32
%35 = OpImageQuerySizeLod %34 %33 %21
%36 = OpCompositeExtract %10 %35 0
%37 = OpCompositeExtract %10 %35 1
%39 = OpCompositeConstruct %38 %36 %37
OpStore %17 %36
OpStore %18 %37
%40 = OpImageQueryLevels %10 %33
OpStore %19 %40
OpReturn
OpFunctionEnd

