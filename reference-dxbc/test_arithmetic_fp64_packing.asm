SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability Float64
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %10 %14
OpExecutionMode %3 LocalSize 1 1 1
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 0
OpDecorate %14 NonReadable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeRuntimeArray %6
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpConstant %5 0
%16 = OpTypePointer StorageBuffer %6
%22 = OpConstant %5 1
%28 = OpTypeFloat 64
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%17 = OpAccessChain %16 %10 %15 %15
%18 = OpLoad %6 %17
%19 = OpCompositeExtract %5 %18 0
%20 = OpCompositeExtract %5 %18 1
%21 = OpCompositeConstruct %6 %19 %20
%23 = OpAccessChain %16 %10 %15 %22
%24 = OpLoad %6 %23
%25 = OpCompositeExtract %5 %24 0
%26 = OpCompositeExtract %5 %24 1
%27 = OpCompositeConstruct %6 %25 %26
%29 = OpBitcast %28 %21
%30 = OpBitcast %28 %27
%31 = OpFAdd %28 %29 %30
%32 = OpBitcast %6 %31
%33 = OpCompositeExtract %5 %32 0
%34 = OpCompositeExtract %5 %32 1
%35 = OpCompositeConstruct %6 %33 %34
%36 = OpAccessChain %16 %14 %15 %15
OpStore %36 %35 NonPrivatePointer
OpReturn
OpFunctionEnd

