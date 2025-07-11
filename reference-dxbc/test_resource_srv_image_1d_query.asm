SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 23
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability ImageQuery
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %12 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "SV_TARGET"
OpName %12 "SV_TARGET_1"
OpName %13 "SV_TARGET_2"
OpName %17 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 Location 0
OpDecorate %12 Location 1
OpDecorate %13 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpVariable %10 Output
%13 = OpVariable %10 Output
%16 = OpConstant %9 0
%17 = OpTypeStruct %9 %9
%19 = OpConstant %9 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %21
%21 = OpLabel
%14 = OpLoad %6 %8
%15 = OpImageQuerySizeLod %9 %14 %16
OpStore %11 %15
OpStore %12 %19
%20 = OpImageQueryLevels %9 %14
OpStore %13 %20
OpReturn
OpFunctionEnd

