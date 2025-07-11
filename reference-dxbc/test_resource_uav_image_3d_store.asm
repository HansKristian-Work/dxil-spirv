SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
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
%6 = OpTypeImage %5 3D 0 0 0 2 Unknown
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
%22 = OpConstant %9 1
%25 = OpConstant %9 2
%28 = OpTypePointer Input %5
%36 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %41
%41 = OpLabel
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %12 %19
%20 = OpLoad %9 %18
%21 = OpAccessChain %17 %12 %22
%23 = OpLoad %9 %21
%24 = OpAccessChain %17 %12 %25
%26 = OpLoad %9 %24
%29 = OpAccessChain %28 %15 %19
%30 = OpLoad %5 %29
%31 = OpAccessChain %28 %15 %22
%32 = OpLoad %5 %31
%33 = OpAccessChain %28 %15 %25
%34 = OpLoad %5 %33
%35 = OpAccessChain %28 %15 %36
%37 = OpLoad %5 %35
%39 = OpCompositeConstruct %10 %20 %23 %26
%40 = OpCompositeConstruct %13 %30 %32 %34 %37
OpImageWrite %16 %39 %40 NonPrivateTexel
OpReturn
OpFunctionEnd

