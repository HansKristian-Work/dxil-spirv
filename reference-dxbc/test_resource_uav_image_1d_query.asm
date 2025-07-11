SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 20
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability ImageQuery
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "SV_TARGET"
OpName %12 "SV_TARGET_1"
OpName %15 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %8 NonWritable
OpDecorate %11 Location 0
OpDecorate %12 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpVariable %10 Output
%15 = OpTypeStruct %9 %9
%17 = OpConstant %9 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %18
%18 = OpLabel
%13 = OpLoad %6 %8
%14 = OpImageQuerySize %9 %13
OpStore %11 %14
OpStore %12 %17
OpReturn
OpFunctionEnd

