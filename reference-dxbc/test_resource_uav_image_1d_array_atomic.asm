SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 30
; Schema: 0
OpCapability Shader
OpCapability Image1D
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
%6 = OpTypeImage %5 1D 0 1 0 2 R32ui
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
%21 = OpConstant %5 2
%22 = OpTypeVector %5 2
%24 = OpTypePointer Image %5
%27 = OpConstant %5 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%17 = OpAccessChain %12 %11 %18
%19 = OpLoad %5 %17
%20 = OpLoad %5 %13
%23 = OpCompositeConstruct %22 %19 %21
%25 = OpImageTexelPointer %24 %8 %23 %18
%26 = OpAtomicIAdd %5 %25 %27 %18 %20
OpStore %15 %26
OpReturn
OpFunctionEnd

