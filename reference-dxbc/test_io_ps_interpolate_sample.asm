SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability InterpolationFunction
OpCapability VulkanMemoryModel
%21 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %10 %13 %14 %16 %18 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_SAMPLEINDEX"
OpName %10 "IN_SCALAR"
OpName %13 "IN_VECTOR"
OpName %14 "IN_VECTOR_1"
OpName %16 "SV_TARGET"
OpName %18 "SV_TARGET_1"
OpName %19 "SV_TARGET_2"
OpDecorate %7 BuiltIn SampleId
OpDecorate %7 Flat
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
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeVector %8 3
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpVariable %12 Input
%15 = OpTypePointer Output %8
%16 = OpVariable %15 Output
%17 = OpTypePointer Output %11
%18 = OpVariable %17 Output
%19 = OpVariable %15 Output
%25 = OpConstant %5 0
%28 = OpConstant %5 1
%31 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %40
%40 = OpLabel
%20 = OpLoad %5 %7
%22 = OpExtInst %8 %21 InterpolateAtSample %10 %20
OpStore %16 %22
%23 = OpLoad %5 %7
%24 = OpAccessChain %9 %13 %25
%26 = OpExtInst %8 %21 InterpolateAtSample %24 %23
%27 = OpAccessChain %9 %13 %28
%29 = OpExtInst %8 %21 InterpolateAtSample %27 %23
%30 = OpAccessChain %9 %13 %31
%32 = OpExtInst %8 %21 InterpolateAtSample %30 %23
%34 = OpAccessChain %15 %18 %25
OpStore %34 %26
%35 = OpAccessChain %15 %18 %28
OpStore %35 %29
%36 = OpAccessChain %15 %18 %31
OpStore %36 %32
%37 = OpLoad %5 %7
%38 = OpAccessChain %9 %14 %28
%39 = OpExtInst %8 %21 InterpolateAtSample %38 %37
OpStore %19 %39
OpReturn
OpFunctionEnd

