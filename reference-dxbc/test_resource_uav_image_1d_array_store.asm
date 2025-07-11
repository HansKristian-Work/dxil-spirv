SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "TEXCOORD"
OpName %15 "COLOR"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 NoPerspective
OpDecorate %15 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 1 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%17 = OpTypePointer Input %9
%19 = OpConstant %9 0
%21 = OpTypePointer Input %5
%25 = OpConstant %9 1
%28 = OpConstant %9 2
%31 = OpConstant %9 3
%34 = OpTypeVector %9 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %12 %19
%20 = OpLoad %9 %18
%22 = OpAccessChain %21 %15 %19
%23 = OpLoad %5 %22
%24 = OpAccessChain %21 %15 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %21 %15 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %21 %15 %31
%32 = OpLoad %5 %30
%33 = OpCompositeConstruct %13 %23 %26 %29 %32
%35 = OpCompositeConstruct %34 %20 %28
%36 = OpCompositeConstruct %13 %23 %26 %29 %32
OpImageWrite %16 %35 %36 NonPrivateTexel
OpReturn
OpFunctionEnd

