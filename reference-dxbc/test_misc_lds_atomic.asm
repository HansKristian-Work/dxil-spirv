SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 38
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %9 %13 %16 %20
OpExecutionMode %3 LocalSize 1 1 1
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpName %16 "SV_DispatchThreadID"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 NonReadable
OpDecorate %16 BuiltIn GlobalInvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeVector %5 3
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpConstant %5 1
%18 = OpTypeArray %5 %17
%19 = OpTypePointer Workgroup %18
%20 = OpVariable %19 Workgroup
%21 = OpTypePointer Input %5
%23 = OpConstant %5 0
%25 = OpTypeVector %5 2
%27 = OpTypePointer StorageBuffer %5
%30 = OpTypePointer Workgroup %5
%33 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %36
%36 = OpLabel
%22 = OpAccessChain %21 %16 %23
%24 = OpLoad %5 %22
%28 = OpAccessChain %27 %9 %23 %24
%29 = OpLoad %5 %28
%31 = OpInBoundsAccessChain %30 %20 %23
%32 = OpAtomicIAdd %5 %31 %33 %23 %29
%35 = OpAccessChain %27 %13 %23 %24
OpStore %35 %32 NonPrivatePointer
OpReturn
OpFunctionEnd

