SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INPUT"
OpName %9 "SV_TARGET"
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpTypeFloat 16
%13 = OpTypeFloat 64
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %19
%19 = OpLabel
%10 = OpLoad %5 %7
%12 = OpFConvert %11 %10
%14 = OpFConvert %13 %12
%15 = OpFConvert %5 %14
%16 = OpFConvert %13 %15
%17 = OpFConvert %11 %16
%18 = OpFConvert %5 %17
OpStore %9 %18
OpReturn
OpFunctionEnd

