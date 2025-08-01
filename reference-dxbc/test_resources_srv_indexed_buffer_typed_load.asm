SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 54
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability RuntimeDescriptorArray
OpCapability UniformTexelBufferArrayDynamicIndexing
OpCapability UniformTexelBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12 %15 %18 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpName %18 "SV_TARGET"
OpName %19 "SV_TARGET_1"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %18 Location 0
OpDecorate %19 Location 1
OpDecorate %20 NonUniform
OpDecorate %23 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
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
%19 = OpVariable %17 Output
%21 = OpTypePointer UniformConstant %6
%25 = OpConstant %10 0
%33 = OpConstant %10 7
%40 = OpTypePointer Output %5
%43 = OpConstant %10 1
%45 = OpConstant %10 2
%47 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %52
%52 = OpLabel
%20 = OpLoad %10 %12
%22 = OpAccessChain %21 %9 %20
%23 = OpLoad %6 %22
%24 = OpAccessChain %11 %15 %25
%26 = OpLoad %10 %24
%27 = OpImageFetch %16 %23 %26
%28 = OpCompositeExtract %5 %27 0
%29 = OpCompositeExtract %5 %27 1
%30 = OpCompositeExtract %5 %27 2
%31 = OpCompositeExtract %5 %27 3
%34 = OpImageFetch %16 %23 %33
%35 = OpCompositeExtract %5 %34 0
%36 = OpCompositeExtract %5 %34 1
%37 = OpCompositeExtract %5 %34 2
%38 = OpCompositeExtract %5 %34 3
%41 = OpAccessChain %40 %18 %25
OpStore %41 %28
%42 = OpAccessChain %40 %18 %43
OpStore %42 %29
%44 = OpAccessChain %40 %18 %45
OpStore %44 %30
%46 = OpAccessChain %40 %18 %47
OpStore %46 %31
%48 = OpAccessChain %40 %19 %25
OpStore %48 %35
%49 = OpAccessChain %40 %19 %43
OpStore %49 %36
%50 = OpAccessChain %40 %19 %45
OpStore %50 %37
%51 = OpAccessChain %40 %19 %47
OpStore %51 %38
OpReturn
OpFunctionEnd

