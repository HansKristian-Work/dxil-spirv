SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpCapability CullDistance
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Vertex %3 "main" %10 %14
OpName %3 "main"
OpDecorate %10 BuiltIn ClipDistance
OpDecorate %14 BuiltIn CullDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 7
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpConstant %6 1
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpTypePointer Output %5
%17 = OpConstant %6 0
%18 = OpConstant %5 -2.5
%20 = OpConstant %5 -1.5
%22 = OpConstant %6 2
%23 = OpConstant %5 -0.5
%25 = OpConstant %6 3
%26 = OpConstant %5 0.5
%28 = OpConstant %6 4
%29 = OpConstant %5 1.5
%31 = OpConstant %6 5
%32 = OpConstant %5 2.5
%34 = OpConstant %6 6
%35 = OpConstant %5 3.5
%37 = OpConstant %5 -2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %38
%38 = OpLabel
%16 = OpAccessChain %15 %10 %17
OpStore %16 %18
%19 = OpAccessChain %15 %10 %11
OpStore %19 %20
%21 = OpAccessChain %15 %10 %22
OpStore %21 %23
%24 = OpAccessChain %15 %10 %25
OpStore %24 %26
%27 = OpAccessChain %15 %10 %28
OpStore %27 %29
%30 = OpAccessChain %15 %10 %31
OpStore %30 %32
%33 = OpAccessChain %15 %10 %34
OpStore %33 %35
%36 = OpAccessChain %15 %14 %17
OpStore %36 %37
OpReturn
OpFunctionEnd

