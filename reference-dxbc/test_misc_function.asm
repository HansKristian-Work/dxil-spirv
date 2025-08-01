SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_TARGET"
OpName %9 ""
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%11 = OpTypePointer Output %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%15 = OpConstant %5 1
%17 = OpConstant %13 1
%18 = OpConstant %5 2
%20 = OpConstant %13 2
%21 = OpConstant %5 3
%23 = OpConstant %13 3
%24 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%25 = OpFunctionCall %1 %9
OpReturn
OpFunctionEnd
%9 = OpFunction %1 None %2
%10 = OpLabel
OpBranch %28
%28 = OpLabel
%12 = OpAccessChain %11 %8 %14
OpStore %12 %15
%16 = OpAccessChain %11 %8 %17
OpStore %16 %18
%19 = OpAccessChain %11 %8 %20
OpStore %19 %21
%22 = OpAccessChain %11 %8 %23
OpStore %22 %24
OpReturn
OpFunctionEnd

