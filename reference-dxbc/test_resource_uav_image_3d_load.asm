SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
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
%6 = OpTypeImage %5 3D 0 0 0 2 R32f
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
%22 = OpConstant %9 1
%25 = OpConstant %9 2
%35 = OpTypePointer Output %5
%40 = OpConstant %9 3
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
%29 = OpCompositeConstruct %10 %20 %23 %26
%28 = OpImageRead %13 %16 %29 NonPrivateTexel
%30 = OpCompositeExtract %5 %28 0
%31 = OpCompositeExtract %5 %28 1
%32 = OpCompositeExtract %5 %28 2
%33 = OpCompositeExtract %5 %28 3
%36 = OpAccessChain %35 %15 %19
OpStore %36 %30
%37 = OpAccessChain %35 %15 %22
OpStore %37 %31
%38 = OpAccessChain %35 %15 %25
OpStore %38 %32
%39 = OpAccessChain %35 %15 %40
OpStore %39 %33
OpReturn
OpFunctionEnd

