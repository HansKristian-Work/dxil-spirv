SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
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
%14 = OpConstant %13 2
%17 = OpConstant %13 3
%20 = OpConstant %5 1
%21 = OpTypeBool
%23 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpFDiv %5 %20 %18
%22 = OpFUnordNotEqual %21 %19 %23
OpSelectionMerge %28 None
OpBranchConditional %22 %27 %28
%27 = OpLabel
%24 = OpFDiv %5 %15 %19
OpBranch %28
%28 = OpLabel
%25 = OpPhi %5 %15 %26 %24 %27
OpStore %10 %25
OpReturn
OpFunctionEnd

