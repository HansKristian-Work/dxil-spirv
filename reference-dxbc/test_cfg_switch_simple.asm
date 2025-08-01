SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_POSITION"
OpName %11 "SEL"
OpName %13 "SV_TARGET"
OpDecorate %8 BuiltIn FragCoord
OpDecorate %11 Flat
OpDecorate %11 Location 1
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 1
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%15 = OpTypeInt 32 0
%17 = OpTypePointer Input %5
%19 = OpConstant %15 3
%22 = OpConstant %5 1
%24 = OpConstant %15 0
%27 = OpConstant %15 1
%30 = OpConstant %15 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%14 = OpLoad %9 %11
%16 = OpBitcast %15 %14
OpSelectionMerge %37 None
OpSwitch %16 %36 3 %35 6 %34 7 %34 9 %33
%36 = OpLabel
%18 = OpAccessChain %17 %8 %19
%20 = OpLoad %5 %18
%21 = OpFDiv %5 %22 %20
OpStore %13 %21
OpBranch %37
%35 = OpLabel
%23 = OpAccessChain %17 %8 %24
%25 = OpLoad %5 %23
OpStore %13 %25
OpBranch %37
%34 = OpLabel
%26 = OpAccessChain %17 %8 %27
%28 = OpLoad %5 %26
OpStore %13 %28
OpBranch %37
%33 = OpLabel
%29 = OpAccessChain %17 %8 %30
%31 = OpLoad %5 %29
OpStore %13 %31
OpBranch %37
%37 = OpLabel
OpReturn
OpFunctionEnd

