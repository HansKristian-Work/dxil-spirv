SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability ImageQuery
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %14 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SV_TARGET"
OpName %14 "SV_TARGET_1"
OpName %15 "SV_TARGET_2"
OpName %22 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Location 0
OpDecorate %14 Location 1
OpDecorate %15 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %9
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%18 = OpConstant %9 0
%22 = OpTypeStruct %10 %9
%24 = OpConstant %9 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%16 = OpLoad %6 %8
%17 = OpImageQuerySizeLod %10 %16 %18
%19 = OpCompositeExtract %9 %17 0
%20 = OpCompositeExtract %9 %17 1
%21 = OpCompositeConstruct %10 %19 %20
%25 = OpAccessChain %13 %12 %18
OpStore %25 %19
%26 = OpAccessChain %13 %12 %24
OpStore %26 %20
OpStore %14 %24
%27 = OpImageQueryLevels %9 %16
OpStore %15 %27
OpReturn
OpFunctionEnd

