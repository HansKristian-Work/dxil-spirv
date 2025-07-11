SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 52
; Schema: 0
OpCapability Shader
OpCapability StorageImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %18 %20 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %18 "TEXCOORD"
OpName %20 "VALUE"
OpName %22 "SV_TARGET"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %20 Flat
OpDecorate %20 Location 2
OpDecorate %22 Location 0
OpDecorate %33 NonUniform
OpDecorate %36 NonUniform
OpDecorate %47 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 2D 0 0 0 2 R32ui
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpConstant %5 4
%11 = OpTypeFloat 32
%12 = OpTypeArray %11 %10
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeVector %5 3
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypePointer Input %5
%20 = OpVariable %19 Input
%21 = OpTypePointer Output %5
%22 = OpVariable %21 Output
%24 = OpConstant %5 0
%25 = OpConstant %5 16
%29 = OpConstant %5 2
%30 = OpTypePointer Uniform %11
%34 = OpTypePointer UniformConstant %6
%40 = OpConstant %5 1
%42 = OpTypeVector %5 2
%46 = OpTypePointer Image %5
%49 = OpConstant %5 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%23 = OpIMul %5 %24 %25
%26 = OpIMul %5 %24 %10
%27 = OpIAdd %5 %23 %26
%28 = OpShiftRightLogical %5 %27 %29
%31 = OpAccessChain %30 %15 %24 %28
%32 = OpLoad %11 %31
%33 = OpBitcast %5 %32
%35 = OpAccessChain %34 %9 %33
%36 = OpLoad %6 %35
%37 = OpAccessChain %19 %18 %24
%38 = OpLoad %5 %37
%39 = OpAccessChain %19 %18 %40
%41 = OpLoad %5 %39
%43 = OpCompositeConstruct %42 %38 %41
%44 = OpLoad %5 %20
%45 = OpCompositeConstruct %42 %38 %41
%47 = OpImageTexelPointer %46 %35 %45 %24
%48 = OpAtomicIAdd %5 %47 %49 %24 %44
OpStore %22 %48
OpReturn
OpFunctionEnd

