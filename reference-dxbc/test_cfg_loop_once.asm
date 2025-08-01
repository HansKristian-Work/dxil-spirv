SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 24
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_POSITION"
OpName %10 "SV_TARGET"
OpDecorate %8 BuiltIn FragCoord
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %18
%18 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
OpBranch %19
%19 = OpLabel
OpLoopMerge %21 %22 None
OpBranch %20
%20 = OpLabel
%16 = OpFAdd %5 %15 %17
OpBranch %21
%22 = OpLabel
OpBranch %19
%21 = OpLabel
OpStore %10 %16
OpReturn
OpFunctionEnd

