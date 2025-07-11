SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Vertex %3 "main" %10
OpName %3 "main"
OpDecorate %10 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 6
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpTypePointer Output %5
%13 = OpConstant %6 0
%14 = OpConstant %5 -2.5
%16 = OpConstant %6 1
%17 = OpConstant %5 -1.5
%19 = OpConstant %6 2
%20 = OpConstant %5 -0.5
%22 = OpConstant %6 3
%23 = OpConstant %5 0.5
%25 = OpConstant %6 4
%26 = OpConstant %5 1.5
%28 = OpConstant %6 5
%29 = OpConstant %5 2.5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%12 = OpAccessChain %11 %10 %13
OpStore %12 %14
%15 = OpAccessChain %11 %10 %16
OpStore %15 %17
%18 = OpAccessChain %11 %10 %19
OpStore %18 %20
%21 = OpAccessChain %11 %10 %22
OpStore %21 %23
%24 = OpAccessChain %11 %10 %25
OpStore %24 %26
%27 = OpAccessChain %11 %10 %28
OpStore %27 %29
OpReturn
OpFunctionEnd

