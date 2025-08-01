SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_TARGET"
OpName %14 ""
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeFunction %1 %5 %5 %5 %5
%16 = OpTypePointer Output %5
%18 = OpTypeInt 32 0
%19 = OpConstant %18 0
%21 = OpConstant %18 1
%23 = OpConstant %18 2
%25 = OpConstant %18 3
%27 = OpConstant %5 1
%28 = OpConstant %5 2
%29 = OpConstant %5 3
%30 = OpConstant %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%26 = OpFunctionCall %1 %14 %27 %28 %29 %30
OpReturn
OpFunctionEnd
%14 = OpFunction %1 None %9
%10 = OpFunctionParameter %5
%11 = OpFunctionParameter %5
%12 = OpFunctionParameter %5
%13 = OpFunctionParameter %5
%15 = OpLabel
OpBranch %33
%33 = OpLabel
%17 = OpAccessChain %16 %8 %19
OpStore %17 %10
%20 = OpAccessChain %16 %8 %21
OpStore %20 %11
%22 = OpAccessChain %16 %8 %23
OpStore %22 %12
%24 = OpAccessChain %16 %8 %25
OpStore %24 %13
OpReturn
OpFunctionEnd

