SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability Image1D
OpCapability StorageImageWriteWithoutFormat
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
OpName %21 "COLOR"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonReadable
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %21 NoPerspective
OpDecorate %21 Location 2
OpDecorate %32 NonUniform
OpDecorate %35 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 1 0 2 Unknown
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
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%23 = OpConstant %10 0
%24 = OpConstant %10 16
%28 = OpConstant %10 2
%29 = OpTypePointer Uniform %5
%33 = OpTypePointer UniformConstant %6
%36 = OpTypePointer Input %10
%39 = OpTypePointer Input %5
%43 = OpConstant %10 1
%48 = OpConstant %10 3
%51 = OpTypeVector %10 2
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
%40 = OpAccessChain %39 %21 %23
%41 = OpLoad %5 %40
%42 = OpAccessChain %39 %21 %43
%44 = OpLoad %5 %42
%45 = OpAccessChain %39 %21 %28
%46 = OpLoad %5 %45
%47 = OpAccessChain %39 %21 %48
%49 = OpLoad %5 %47
%50 = OpCompositeConstruct %19 %41 %44 %46 %49
%52 = OpCompositeConstruct %51 %38 %28
%53 = OpCompositeConstruct %19 %41 %44 %46 %49
OpImageWrite %35 %52 %53 NonPrivateTexel
OpReturn
OpFunctionEnd

