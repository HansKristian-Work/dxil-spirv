SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 54
; Schema: 0
OpCapability Shader
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "BUFFER_ADDRESS"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 2
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%17 = OpTypePointer Image %5
%20 = OpConstant %5 5
%22 = OpConstant %5 10
%48 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %52
%52 = OpLabel
%14 = OpAccessChain %13 %11 %15
%16 = OpLoad %5 %14
%18 = OpImageTexelPointer %17 %8 %16 %15
%19 = OpAtomicLoad %5 %18 %20 %15
%21 = OpIAdd %5 %19 %22
%23 = OpImageTexelPointer %17 %8 %16 %15
%24 = OpAtomicExchange %5 %23 %20 %15 %21
%26 = OpImageTexelPointer %17 %8 %16 %15
%27 = OpAtomicCompareExchange %5 %26 %20 %15 %15 %24 %22
%28 = OpImageTexelPointer %17 %8 %16 %15
%29 = OpAtomicIAdd %5 %28 %20 %15 %27
%30 = OpImageTexelPointer %17 %8 %16 %15
%31 = OpAtomicISub %5 %30 %20 %15 %29
%32 = OpImageTexelPointer %17 %8 %16 %15
%33 = OpAtomicSMin %5 %32 %20 %15 %31
%34 = OpImageTexelPointer %17 %8 %16 %15
%35 = OpAtomicSMax %5 %34 %20 %15 %33
%36 = OpImageTexelPointer %17 %8 %16 %15
%37 = OpAtomicUMin %5 %36 %20 %15 %35
%38 = OpImageTexelPointer %17 %8 %16 %15
%39 = OpAtomicUMax %5 %38 %20 %15 %37
%40 = OpImageTexelPointer %17 %8 %16 %15
%41 = OpAtomicAnd %5 %40 %20 %15 %39
%42 = OpImageTexelPointer %17 %8 %16 %15
%43 = OpAtomicOr %5 %42 %20 %15 %41
%44 = OpImageTexelPointer %17 %8 %16 %15
%45 = OpAtomicXor %5 %44 %20 %15 %43
%46 = OpImageTexelPointer %17 %8 %16 %15
%47 = OpAtomicIAdd %5 %46 %20 %15 %48
%49 = OpImageTexelPointer %17 %8 %16 %15
%50 = OpAtomicISub %5 %49 %20 %15 %48
%51 = OpImageTexelPointer %17 %8 %16 %15
OpAtomicStore %51 %20 %15 %50
OpReturn
OpFunctionEnd

