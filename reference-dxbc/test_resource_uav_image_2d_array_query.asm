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
OpEntryPoint Fragment %3 "main" %8 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "SV_TARGET"
OpName %14 "SV_TARGET_1"
OpName %22 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %8 NonWritable
OpDecorate %12 Location 0
OpDecorate %14 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %9
%14 = OpVariable %13 Output
%16 = OpTypeVector %9 3
%22 = OpTypeStruct %10 %9
%25 = OpConstant %9 0
%27 = OpConstant %9 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%15 = OpLoad %6 %8
%17 = OpImageQuerySize %16 %15
%18 = OpCompositeExtract %9 %17 0
%19 = OpCompositeExtract %9 %17 1
%20 = OpCompositeConstruct %10 %18 %19
%21 = OpCompositeExtract %9 %17 2
%23 = OpCompositeConstruct %22 %20 %21
%24 = OpAccessChain %13 %12 %25
OpStore %24 %18
%26 = OpAccessChain %13 %12 %27
OpStore %26 %19
OpStore %14 %21
OpReturn
OpFunctionEnd

