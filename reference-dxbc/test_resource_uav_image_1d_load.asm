SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
OpCapability Shader
OpCapability Image1D
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "TEXCOORD"
OpName %15 "SV_TARGET"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%17 = OpTypePointer Input %9
%19 = OpConstant %9 0
%27 = OpTypePointer Output %5
%30 = OpConstant %9 1
%32 = OpConstant %9 2
%34 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%16 = OpLoad %6 %8
%18 = OpAccessChain %17 %12 %19
%20 = OpLoad %9 %18
%21 = OpImageRead %13 %16 %20 NonPrivateTexel
%22 = OpCompositeExtract %5 %21 0
%23 = OpCompositeExtract %5 %21 1
%24 = OpCompositeExtract %5 %21 2
%25 = OpCompositeExtract %5 %21 3
%28 = OpAccessChain %27 %15 %19
OpStore %28 %22
%29 = OpAccessChain %27 %15 %30
OpStore %29 %23
%31 = OpAccessChain %27 %15 %32
OpStore %31 %24
%33 = OpAccessChain %27 %15 %34
OpStore %33 %25
OpReturn
OpFunctionEnd

