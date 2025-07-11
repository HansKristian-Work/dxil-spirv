SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 ""
OpName %14 "SV_TARGET"
OpDecorate %9 ArrayStride 16
OpMemberDecorate %10 0 Offset 0
OpDecorate %10 Block
OpDecorate %12 DescriptorSet 0
OpDecorate %12 Binding 0
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 8
%7 = OpTypeFloat 32
%8 = OpTypeVector %7 4
%9 = OpTypeArray %8 %6
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Output %8
%14 = OpVariable %13 Output
%15 = OpConstant %5 2
%16 = OpTypePointer Uniform %8
%18 = OpConstant %5 0
%21 = OpTypePointer Output %7
%25 = OpConstant %5 1
%30 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%17 = OpAccessChain %16 %12 %18 %15
%19 = OpLoad %8 %17
%20 = OpCompositeExtract %7 %19 0
%22 = OpAccessChain %21 %14 %18
OpStore %22 %20
%23 = OpCompositeExtract %7 %19 1
%24 = OpAccessChain %21 %14 %25
OpStore %24 %23
%26 = OpCompositeExtract %7 %19 2
%27 = OpAccessChain %21 %14 %15
OpStore %27 %26
%28 = OpCompositeExtract %7 %19 3
%29 = OpAccessChain %21 %14 %30
OpStore %29 %28
OpReturn
OpFunctionEnd

