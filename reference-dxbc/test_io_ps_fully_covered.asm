SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 17
; Schema: 0
OpCapability Shader
OpCapability FragmentFullyCoveredEXT
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_fragment_fully_covered"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_TARGET"
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
%13 = OpConstant %5 1
%14 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %15
%15 = OpLabel
%11 = OpLoad %8 %10
%12 = OpSelect %5 %11 %13 %14
OpStore %7 %12
OpReturn
OpFunctionEnd

