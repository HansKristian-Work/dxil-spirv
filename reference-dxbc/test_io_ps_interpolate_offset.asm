SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 45
; Schema: 0
OpCapability Shader
OpCapability InterpolationFunction
OpCapability VulkanMemoryModel
%28 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10 %13 %14 %16 %18 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "OFFSET"
OpName %10 "IN_SCALAR"
OpName %13 "IN_VECTOR"
OpName %14 "IN_VECTOR_1"
OpName %16 "SV_TARGET"
OpName %18 "SV_TARGET_1"
OpName %19 "SV_TARGET_2"
OpDecorate %8 Location 3
OpDecorate %10 NoPerspective
OpDecorate %10 Location 0
OpDecorate %13 Location 1
OpDecorate %14 Centroid
OpDecorate %14 Location 2
OpDecorate %16 Location 0
OpDecorate %18 Location 1
OpDecorate %19 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%11 = OpTypeVector %5 3
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpVariable %12 Input
%15 = OpTypePointer Output %5
%16 = OpVariable %15 Output
%17 = OpTypePointer Output %11
%18 = OpVariable %17 Output
%19 = OpVariable %15 Output
%21 = OpTypeInt 32 0
%22 = OpConstant %21 0
%25 = OpConstant %21 1
%35 = OpConstant %21 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %43
%43 = OpLabel
%20 = OpAccessChain %9 %8 %22
%23 = OpLoad %5 %20
%24 = OpAccessChain %9 %8 %25
%26 = OpLoad %5 %24
%27 = OpCompositeConstruct %6 %23 %26
%29 = OpExtInst %5 %28 InterpolateAtOffset %10 %27
OpStore %16 %29
%30 = OpAccessChain %9 %13 %22
%31 = OpExtInst %5 %28 InterpolateAtOffset %30 %27
%32 = OpAccessChain %9 %13 %25
%33 = OpExtInst %5 %28 InterpolateAtOffset %32 %27
%34 = OpAccessChain %9 %13 %35
%36 = OpExtInst %5 %28 InterpolateAtOffset %34 %27
%38 = OpAccessChain %15 %18 %22
OpStore %38 %31
%39 = OpAccessChain %15 %18 %25
OpStore %39 %33
%40 = OpAccessChain %15 %18 %35
OpStore %40 %36
%41 = OpAccessChain %9 %14 %25
%42 = OpExtInst %5 %28 InterpolateAtOffset %41 %27
OpStore %19 %42
OpReturn
OpFunctionEnd

