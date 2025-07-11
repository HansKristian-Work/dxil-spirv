SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 50
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability ImageQuery
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %18 %20 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %18 "SV_TARGET"
OpName %20 "SV_TARGET_1"
OpName %21 "SV_TARGET_3"
OpName %42 ""
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Location 0
OpDecorate %20 Location 1
OpDecorate %21 Location 3
OpDecorate %32 NonUniform
OpDecorate %35 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 1 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 4
%12 = OpTypeArray %5 %11
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeVector %10 2
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Output %10
%20 = OpVariable %19 Output
%21 = OpVariable %19 Output
%23 = OpConstant %10 0
%24 = OpConstant %10 16
%28 = OpConstant %10 2
%29 = OpTypePointer Uniform %5
%33 = OpTypePointer UniformConstant %6
%36 = OpTypeVector %10 3
%42 = OpTypeStruct %16 %10
%46 = OpConstant %10 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %48
%48 = OpLabel
%22 = OpIMul %10 %23 %24
%25 = OpIMul %10 %23 %11
%26 = OpIAdd %10 %22 %25
%27 = OpShiftRightLogical %10 %26 %28
%30 = OpAccessChain %29 %15 %23 %27
%31 = OpLoad %5 %30
%32 = OpBitcast %10 %31
%34 = OpAccessChain %33 %9 %32
%35 = OpLoad %6 %34
%37 = OpImageQuerySize %36 %35
%38 = OpCompositeExtract %10 %37 0
%39 = OpCompositeExtract %10 %37 1
%40 = OpCompositeConstruct %16 %38 %39
%41 = OpCompositeExtract %10 %37 2
%43 = OpCompositeConstruct %42 %40 %41
%44 = OpAccessChain %19 %18 %23
OpStore %44 %38
%45 = OpAccessChain %19 %18 %46
OpStore %45 %39
OpStore %20 %41
%47 = OpImageQuerySamples %10 %35
OpStore %21 %47
OpReturn
OpFunctionEnd

