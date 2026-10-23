; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
OpCapability Shader
OpCapability FragmentFullyCoveredEXT
OpCapability DemoteToHelperInvocation
OpExtension "SPV_EXT_demote_to_helper_invocation"
OpExtension "SPV_EXT_fragment_fully_covered"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_Target"
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
%17 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %18
%18 = OpLabel
%11 = OpLoad %8 %10
%13 = OpSelect %12 %11 %14 %15
%16 = OpIEqual %8 %13 %15
OpSelectionMerge %20 None
OpBranchConditional %16 %19 %20
%19 = OpLabel
OpDemoteToHelperInvocation
OpBranch %20
%20 = OpLabel
OpBranch %21
%21 = OpLabel
OpStore %7 %17
OpReturn
OpFunctionEnd

