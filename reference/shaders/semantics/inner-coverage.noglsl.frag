; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability FragmentFullyCoveredEXT
OpExtension "SPV_EXT_fragment_fully_covered"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %12 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_Target"
OpName %26 "discard_state"
OpName %33 "discard_exit"
OpDecorate %7 Location 0
OpDecorate %12 BuiltIn SampleMask
OpDecorate %21 BuiltIn FullyCoveredEXT
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Output %5
%7 = OpVariable %6 Output
%8 = OpTypeInt 32 0
%9 = OpConstant %8 1
%10 = OpTypeArray %8 %9
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Input %8
%15 = OpConstant %8 0
%17 = OpTypeBool
%20 = OpTypePointer Input %17
%21 = OpVariable %20 Input
%25 = OpTypePointer Private %17
%26 = OpVariable %25 Private
%27 = OpConstantFalse %17
%28 = OpConstant %5 1
%32 = OpConstantTrue %17
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %26 %27
OpBranch %29
%29 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %8 %14
%18 = OpIEqual %17 %15 %16
%19 = OpSelect %8 %18 %9 %15
%22 = OpLoad %17 %21
%23 = OpSelect %8 %22 %9 %15
%24 = OpIEqual %17 %23 %15
OpSelectionMerge %31 None
OpBranchConditional %24 %30 %31
%30 = OpLabel
OpStore %26 %32
OpBranch %31
%31 = OpLabel
OpStore %7 %28
%39 = OpFunctionCall %1 %33
OpReturn
OpFunctionEnd
%33 = OpFunction %1 None %2
%34 = OpLabel
%37 = OpLoad %17 %26
OpSelectionMerge %36 None
OpBranchConditional %37 %35 %36
%35 = OpLabel
OpKill
%36 = OpLabel
OpReturn
OpFunctionEnd

