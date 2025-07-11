SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability ImageQuery
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SV_TARGET"
OpName %14 "SV_TARGET_1"
OpName %20 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %8 NonWritable
OpDecorate %12 Location 0
OpDecorate %14 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %9
%14 = OpVariable %13 Output
%20 = OpTypeStruct %10 %9
%22 = OpConstant %9 1
%24 = OpConstant %9 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%15 = OpLoad %6 %8
%16 = OpImageQuerySize %10 %15
%17 = OpCompositeExtract %9 %16 0
%18 = OpCompositeExtract %9 %16 1
%19 = OpCompositeConstruct %10 %17 %18
%23 = OpAccessChain %13 %12 %24
OpStore %23 %17
%25 = OpAccessChain %13 %12 %22
OpStore %25 %18
OpStore %14 %22
OpReturn
OpFunctionEnd

