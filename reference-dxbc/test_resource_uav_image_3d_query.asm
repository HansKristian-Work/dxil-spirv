SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 31
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
OpName %21 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %8 NonWritable
OpDecorate %12 Location 0
OpDecorate %14 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %9
%14 = OpVariable %13 Output
%21 = OpTypeStruct %10 %9
%23 = OpConstant %9 1
%25 = OpConstant %9 0
%28 = OpConstant %9 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %29
%29 = OpLabel
%15 = OpLoad %6 %8
%16 = OpImageQuerySize %10 %15
%17 = OpCompositeExtract %9 %16 0
%18 = OpCompositeExtract %9 %16 1
%19 = OpCompositeExtract %9 %16 2
%20 = OpCompositeConstruct %10 %17 %18 %19
%24 = OpAccessChain %13 %12 %25
OpStore %24 %17
%26 = OpAccessChain %13 %12 %23
OpStore %26 %18
%27 = OpAccessChain %13 %12 %28
OpStore %27 %19
OpStore %14 %23
OpReturn
OpFunctionEnd

