SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 41
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
%18 = OpConstant %5 4
%20 = OpConstant %5 2
%21 = OpTypeVector %5 3
%23 = OpConstant %5 1
%24 = OpConstant %5 3
%26 = OpTypePointer StorageBuffer %5
%37 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %5 %14
%17 = OpIMul %5 %16 %18
%19 = OpIAdd %5 %17 %20
%25 = OpShiftRightLogical %5 %19 %20
%27 = OpAccessChain %26 %9 %15 %25
OpStore %27 %23 NonPrivatePointer
%29 = OpIAdd %5 %25 %23
%28 = OpAccessChain %26 %9 %15 %29
OpStore %28 %20 NonPrivatePointer
%31 = OpIAdd %5 %25 %20
%30 = OpAccessChain %26 %9 %15 %31
OpStore %30 %24 NonPrivatePointer
%32 = OpAccessChain %26 %9 %15 %23
OpStore %32 %23 NonPrivatePointer
%34 = OpIAdd %5 %23 %23
%33 = OpAccessChain %26 %9 %15 %34
OpStore %33 %20 NonPrivatePointer
%36 = OpIAdd %5 %23 %20
%35 = OpAccessChain %26 %9 %15 %36
OpStore %35 %24 NonPrivatePointer
%38 = OpAccessChain %26 %9 %15 %23
OpStore %38 %37 NonPrivatePointer
OpReturn
OpFunctionEnd

