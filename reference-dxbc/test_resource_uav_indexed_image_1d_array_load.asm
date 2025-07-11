SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability Image1D
OpCapability RuntimeDescriptorArray
OpCapability StorageImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %18 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %18 "TEXCOORD"
OpName %21 "SV_TARGET"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %21 Location 0
OpDecorate %32 NonUniform
OpDecorate %35 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 1 0 2 R32f
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
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypeVector %5 4
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%23 = OpConstant %10 0
%24 = OpConstant %10 16
%28 = OpConstant %10 2
%29 = OpTypePointer Uniform %5
%33 = OpTypePointer UniformConstant %6
%36 = OpTypePointer Input %10
%40 = OpTypeVector %10 2
%47 = OpTypePointer Output %5
%50 = OpConstant %10 1
%53 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%22 = OpIMul %10 %23 %24
%25 = OpIMul %10 %23 %11
%26 = OpIAdd %10 %22 %25
%27 = OpShiftRightLogical %10 %26 %28
%30 = OpAccessChain %29 %15 %23 %27
%31 = OpLoad %5 %30
%32 = OpBitcast %10 %31
%34 = OpAccessChain %33 %9 %32
%35 = OpLoad %6 %34
%37 = OpAccessChain %36 %18 %23
%38 = OpLoad %10 %37
%41 = OpCompositeConstruct %40 %38 %28
%39 = OpImageRead %19 %35 %41 NonPrivateTexel
%42 = OpCompositeExtract %5 %39 0
%43 = OpCompositeExtract %5 %39 1
%44 = OpCompositeExtract %5 %39 2
%45 = OpCompositeExtract %5 %39 3
%48 = OpAccessChain %47 %21 %23
OpStore %48 %42
%49 = OpAccessChain %47 %21 %50
OpStore %49 %43
%51 = OpAccessChain %47 %21 %28
OpStore %51 %44
%52 = OpAccessChain %47 %21 %53
OpStore %52 %45
OpReturn
OpFunctionEnd

