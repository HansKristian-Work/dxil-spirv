; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
OpCapability Shader
OpCapability FragmentFullyCoveredEXT
OpExtension "SPV_EXT_fragment_fully_covered"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_Target"
OpName %18 "discard_state"
OpName %27 "discard_exit"
OpDecorate %7 Location 0
OpDecorate %10 BuiltIn FullyCoveredEXT
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Output %5
%7 = OpVariable %6 Output
%8 = OpTypeBool
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%12 = OpTypeInt 32 0
%14 = OpConstant %12 1
%15 = OpConstant %12 0
%17 = OpTypePointer Private %8
%18 = OpVariable %17 Private
%19 = OpConstantFalse %8
%20 = OpConstant %5 1
%26 = OpConstantTrue %8
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %18 %19
OpBranch %21
%21 = OpLabel
%11 = OpLoad %8 %10
%13 = OpSelect %12 %11 %14 %15
%16 = OpIEqual %8 %13 %15
OpSelectionMerge %23 None
OpBranchConditional %16 %22 %23
%22 = OpLabel
OpStore %18 %26
OpBranch %23
%23 = OpLabel
OpBranch %24
%24 = OpLabel
OpBranch %25
%25 = OpLabel
OpStore %7 %20
%33 = OpFunctionCall %1 %27
OpReturn
OpFunctionEnd
%27 = OpFunction %1 None %2
%28 = OpLabel
%31 = OpLoad %8 %18
OpSelectionMerge %30 None
OpBranchConditional %31 %29 %30
%29 = OpLabel
OpKill
%30 = OpLabel
OpReturn
OpFunctionEnd

