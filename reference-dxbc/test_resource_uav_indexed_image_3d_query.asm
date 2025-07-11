SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability ImageQuery
OpCapability RuntimeDescriptorArray
OpCapability StorageImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %18 %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %18 "SV_TARGET"
OpName %20 "SV_TARGET_1"
OpName %40 ""
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonReadable
OpDecorate %9 NonWritable
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Location 0
OpDecorate %20 Location 1
OpDecorate %31 NonUniform
OpDecorate %34 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 2 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 4
%12 = OpTypeArray %5 %11
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeVector %10 3
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Output %10
%20 = OpVariable %19 Output
%22 = OpConstant %10 0
%23 = OpConstant %10 16
%27 = OpConstant %10 2
%28 = OpTypePointer Uniform %5
%32 = OpTypePointer UniformConstant %6
%40 = OpTypeStruct %16 %10
%42 = OpConstant %10 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%21 = OpIMul %10 %22 %23
%24 = OpIMul %10 %22 %11
%25 = OpIAdd %10 %21 %24
%26 = OpShiftRightLogical %10 %25 %27
%29 = OpAccessChain %28 %15 %22 %26
%30 = OpLoad %5 %29
%31 = OpBitcast %10 %30
%33 = OpAccessChain %32 %9 %31
%34 = OpLoad %6 %33
%35 = OpImageQuerySize %16 %34
%36 = OpCompositeExtract %10 %35 0
%37 = OpCompositeExtract %10 %35 1
%38 = OpCompositeExtract %10 %35 2
%39 = OpCompositeConstruct %16 %36 %37 %38
%43 = OpAccessChain %19 %18 %22
OpStore %43 %36
%44 = OpAccessChain %19 %18 %42
OpStore %44 %37
%45 = OpAccessChain %19 %18 %27
OpStore %45 %38
OpStore %20 %42
OpReturn
OpFunctionEnd

