SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability SampledCubeArray
OpCapability ImageQuery
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %14 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SV_TARGET"
OpName %14 "SV_TARGET_1"
OpName %15 "SV_TARGET_2"
OpName %24 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Location 0
OpDecorate %14 Location 1
OpDecorate %15 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 1 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %9
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%17 = OpTypeVector %9 3
%19 = OpConstant %9 0
%24 = OpTypeStruct %10 %9
%28 = OpConstant %9 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%16 = OpLoad %6 %8
%18 = OpImageQuerySizeLod %17 %16 %19
%20 = OpCompositeExtract %9 %18 0
%21 = OpCompositeExtract %9 %18 1
%22 = OpCompositeConstruct %10 %20 %21
%23 = OpCompositeExtract %9 %18 2
%25 = OpCompositeConstruct %24 %22 %23
%26 = OpAccessChain %13 %12 %19
OpStore %26 %20
%27 = OpAccessChain %13 %12 %28
OpStore %27 %21
OpStore %14 %23
%29 = OpImageQueryLevels %9 %16
OpStore %15 %29
OpReturn
OpFunctionEnd

