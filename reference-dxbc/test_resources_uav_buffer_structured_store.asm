SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_ADDRESS"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonReadable
OpDecorate %12 Flat
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeVector %5 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%18 = OpConstant %5 1
%22 = OpConstant %5 2
%24 = OpConstant %5 20
%27 = OpTypePointer StorageBuffer %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %12 %18
%19 = OpLoad %5 %17
%23 = OpIMul %5 %16 %24
%25 = OpShiftRightLogical %5 %19 %22
%26 = OpIAdd %5 %23 %25
%28 = OpAccessChain %27 %9 %15 %26
OpStore %28 %18 NonPrivatePointer
%30 = OpIAdd %5 %26 %18
%29 = OpAccessChain %27 %9 %15 %30
OpStore %29 %22 NonPrivatePointer
OpReturn
OpFunctionEnd

