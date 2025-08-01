SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability InterpolationFunction
OpCapability VulkanMemoryModel
%17 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %10 %11 %13 %15 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "IN_SCALAR"
OpName %10 "IN_VECTOR"
OpName %11 "IN_VECTOR_1"
OpName %13 "SV_TARGET"
OpName %15 "SV_TARGET_1"
OpName %16 "SV_TARGET_2"
OpDecorate %7 NoPerspective
OpDecorate %7 Location 0
OpDecorate %10 Location 1
OpDecorate %11 Sample
OpDecorate %11 Location 2
OpDecorate %13 Location 0
OpDecorate %15 Location 1
OpDecorate %16 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 3
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpVariable %9 Input
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%14 = OpTypePointer Output %8
%15 = OpVariable %14 Output
%16 = OpVariable %12 Output
%20 = OpTypeInt 32 0
%21 = OpConstant %20 0
%24 = OpConstant %20 1
%27 = OpConstant %20 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%18 = OpExtInst %5 %17 InterpolateAtCentroid %7
OpStore %13 %18
%19 = OpAccessChain %6 %10 %21
%22 = OpExtInst %5 %17 InterpolateAtCentroid %19
%23 = OpAccessChain %6 %10 %24
%25 = OpExtInst %5 %17 InterpolateAtCentroid %23
%26 = OpAccessChain %6 %10 %27
%28 = OpExtInst %5 %17 InterpolateAtCentroid %26
%30 = OpAccessChain %12 %15 %21
OpStore %30 %22
%31 = OpAccessChain %12 %15 %24
OpStore %31 %25
%32 = OpAccessChain %12 %15 %27
OpStore %32 %28
%33 = OpAccessChain %6 %11 %24
%34 = OpExtInst %5 %17 InterpolateAtCentroid %33
OpStore %16 %34
OpReturn
OpFunctionEnd

