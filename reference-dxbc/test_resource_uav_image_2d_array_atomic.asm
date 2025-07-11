SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %13 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %13 "VALUE"
OpName %15 "SV_TARGET"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 Flat
OpDecorate %11 Location 0
OpDecorate %13 Flat
OpDecorate %13 Location 2
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 2D 0 1 0 2 R32ui
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 3
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%14 = OpTypePointer Output %5
%15 = OpVariable %14 Output
%18 = OpConstant %5 0
%21 = OpConstant %5 1
%23 = OpTypeVector %5 2
%26 = OpConstant %5 2
%28 = OpTypePointer Image %5
%31 = OpConstant %5 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%17 = OpAccessChain %12 %11 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %11 %21
%22 = OpLoad %5 %20
%25 = OpLoad %5 %13
%27 = OpCompositeConstruct %9 %19 %22 %26
%29 = OpImageTexelPointer %28 %8 %27 %18
%30 = OpAtomicIAdd %5 %29 %31 %18 %25
OpStore %15 %30
OpReturn
OpFunctionEnd

