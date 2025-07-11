SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %12 %14 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "INDEX"
OpName %16 "SV_TARGET"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Flat
OpDecorate %14 Location 0
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4096
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Input %5
%14 = OpVariable %13 Input
%15 = OpTypePointer Output %8
%16 = OpVariable %15 Output
%18 = OpTypePointer Uniform %8
%20 = OpConstant %5 0
%23 = OpTypePointer Output %7
%27 = OpConstant %5 1
%30 = OpConstant %5 2
%33 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%17 = OpLoad %5 %14
%19 = OpAccessChain %18 %12 %20 %17
%21 = OpLoad %8 %19
%22 = OpCompositeExtract %7 %21 0
%24 = OpAccessChain %23 %16 %20
OpStore %24 %22
%25 = OpCompositeExtract %7 %21 1
%26 = OpAccessChain %23 %16 %27
OpStore %26 %25
%28 = OpCompositeExtract %7 %21 2
%29 = OpAccessChain %23 %16 %30
OpStore %29 %28
%31 = OpCompositeExtract %7 %21 3
%32 = OpAccessChain %23 %16 %33
OpStore %32 %31
OpReturn
OpFunctionEnd

