SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability RuntimeDescriptorArray
OpCapability StorageTexelBufferArrayDynamicIndexing
OpCapability StorageTexelBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %11 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "BUFFER_INDEX"
OpName %14 "BUFFER_ADDRESS"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %11 Component 2
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %15 NonUniform
OpDecorate %23 NonUniform
OpDecorate %28 NonUniform
OpDecorate %31 NonUniform
OpDecorate %33 NonUniform
OpDecorate %35 NonUniform
OpDecorate %37 NonUniform
OpDecorate %39 NonUniform
OpDecorate %41 NonUniform
OpDecorate %43 NonUniform
OpDecorate %45 NonUniform
OpDecorate %47 NonUniform
OpDecorate %49 NonUniform
OpDecorate %51 NonUniform
OpDecorate %54 NonUniform
OpDecorate %56 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypePointer Input %5
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 2
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%16 = OpTypePointer UniformConstant %6
%20 = OpConstant %5 0
%22 = OpTypePointer Image %5
%25 = OpConstant %5 5
%27 = OpConstant %5 10
%53 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%15 = OpLoad %5 %11
%17 = OpAccessChain %16 %9 %15
%19 = OpAccessChain %10 %14 %20
%21 = OpLoad %5 %19
%23 = OpImageTexelPointer %22 %17 %21 %20
%24 = OpAtomicLoad %5 %23 %25 %20
%26 = OpIAdd %5 %24 %27
%28 = OpImageTexelPointer %22 %17 %21 %20
%29 = OpAtomicExchange %5 %28 %25 %20 %26
%31 = OpImageTexelPointer %22 %17 %21 %20
%32 = OpAtomicCompareExchange %5 %31 %25 %20 %20 %29 %27
%33 = OpImageTexelPointer %22 %17 %21 %20
%34 = OpAtomicIAdd %5 %33 %25 %20 %32
%35 = OpImageTexelPointer %22 %17 %21 %20
%36 = OpAtomicISub %5 %35 %25 %20 %34
%37 = OpImageTexelPointer %22 %17 %21 %20
%38 = OpAtomicSMin %5 %37 %25 %20 %36
%39 = OpImageTexelPointer %22 %17 %21 %20
%40 = OpAtomicSMax %5 %39 %25 %20 %38
%41 = OpImageTexelPointer %22 %17 %21 %20
%42 = OpAtomicUMin %5 %41 %25 %20 %40
%43 = OpImageTexelPointer %22 %17 %21 %20
%44 = OpAtomicUMax %5 %43 %25 %20 %42
%45 = OpImageTexelPointer %22 %17 %21 %20
%46 = OpAtomicAnd %5 %45 %25 %20 %44
%47 = OpImageTexelPointer %22 %17 %21 %20
%48 = OpAtomicOr %5 %47 %25 %20 %46
%49 = OpImageTexelPointer %22 %17 %21 %20
%50 = OpAtomicXor %5 %49 %25 %20 %48
%51 = OpImageTexelPointer %22 %17 %21 %20
%52 = OpAtomicIAdd %5 %51 %25 %20 %53
%54 = OpImageTexelPointer %22 %17 %21 %20
%55 = OpAtomicISub %5 %54 %25 %20 %53
%56 = OpImageTexelPointer %22 %17 %21 %20
OpAtomicStore %56 %25 %20 %55
OpReturn
OpFunctionEnd

