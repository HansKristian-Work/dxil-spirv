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
%14 = OpConstant %13 0
%18 = OpConstant %5 1
%19 = OpTypeBool
%21 = OpConstant %5 10000
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %22
%22 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
OpBranch %23
%23 = OpLabel
%16 = OpPhi %5 %15 %22 %17 %26
OpLoopMerge %28 %26 None
OpBranch %24
%24 = OpLabel
%17 = OpFAdd %5 %16 %18
%20 = OpFOrdGreaterThanEqual %19 %17 %21
OpSelectionMerge %25 None
OpBranchConditional %20 %27 %25
%27 = OpLabel
OpStore %10 %17
OpReturn
%25 = OpLabel
OpBranch %26
%26 = OpLabel
OpBranch %23
%28 = OpLabel
OpUnreachable
OpFunctionEnd

