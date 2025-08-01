SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10 %12
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DepthReplacing
OpName %3 "main"
OpName %8 "SV_POSITION"
OpName %10 "DELTA"
OpName %12 "SV_DEPTH"
OpDecorate %8 BuiltIn FragCoord
OpDecorate %10 Location 1
OpDecorate %12 BuiltIn FragDepth
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%11 = OpTypePointer Output %5
%12 = OpVariable %11 Output
%14 = OpTypeInt 32 0
%15 = OpConstant %14 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %19
%19 = OpLabel
%13 = OpAccessChain %9 %8 %15
%16 = OpLoad %5 %13
%17 = OpLoad %5 %10
%18 = OpFAdd %5 %17 %16
OpStore %12 %18
OpReturn
OpFunctionEnd

