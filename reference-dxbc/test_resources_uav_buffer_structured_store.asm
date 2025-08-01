SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 47
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
%22 = OpConstant %5 7
%23 = OpConstant %5 3
%24 = OpTypeVector %5 3
%26 = OpConstant %5 2
%28 = OpConstant %5 20
%31 = OpTypePointer StorageBuffer %5
%37 = OpConstant %5 140
%43 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %45
%45 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %12 %18
%19 = OpLoad %5 %17
%27 = OpIMul %5 %16 %28
%29 = OpShiftRightLogical %5 %19 %26
%30 = OpIAdd %5 %27 %29
%32 = OpAccessChain %31 %9 %15 %30
OpStore %32 %18 NonPrivatePointer
%34 = OpIAdd %5 %30 %18
%33 = OpAccessChain %31 %9 %15 %34
OpStore %33 %26 NonPrivatePointer
%36 = OpIAdd %5 %30 %26
%35 = OpAccessChain %31 %9 %15 %36
OpStore %35 %23 NonPrivatePointer
%38 = OpAccessChain %31 %9 %15 %37
OpStore %38 %18 NonPrivatePointer
%40 = OpIAdd %5 %37 %18
%39 = OpAccessChain %31 %9 %15 %40
OpStore %39 %26 NonPrivatePointer
%42 = OpIAdd %5 %37 %26
%41 = OpAccessChain %31 %9 %15 %42
OpStore %41 %23 NonPrivatePointer
%44 = OpAccessChain %31 %9 %15 %37
OpStore %44 %43 NonPrivatePointer
OpReturn
OpFunctionEnd

