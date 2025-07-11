SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
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
OpName %23 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Location 0
OpDecorate %14 Location 1
OpDecorate %15 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %9
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%18 = OpConstant %9 0
%23 = OpTypeStruct %10 %9
%25 = OpConstant %9 1
%29 = OpConstant %9 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%16 = OpLoad %6 %8
%17 = OpImageQuerySizeLod %10 %16 %18
%19 = OpCompositeExtract %9 %17 0
%20 = OpCompositeExtract %9 %17 1
%21 = OpCompositeExtract %9 %17 2
%22 = OpCompositeConstruct %10 %19 %20 %21
%26 = OpAccessChain %13 %12 %18
OpStore %26 %19
%27 = OpAccessChain %13 %12 %25
OpStore %27 %20
%28 = OpAccessChain %13 %12 %29
OpStore %28 %21
OpStore %14 %25
%30 = OpImageQueryLevels %9 %16
OpStore %15 %30
OpReturn
OpFunctionEnd

