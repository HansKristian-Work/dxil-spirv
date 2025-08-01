SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
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
%18 = OpConstant %5 0
%22 = OpTypePointer Input %5
%24 = OpConstant %15 0
%26 = OpConstant %15 1
%29 = OpConstant %5 -1
%31 = OpConstant %15 2
%34 = OpConstant %15 3
%36 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%14 = OpLoad %9 %11
%16 = OpBitcast %15 %14
OpSelectionMerge %42 None
OpSwitch %16 %42 3 %41 7 %39 9 %40 17 %38
%41 = OpLabel
%23 = OpAccessChain %22 %8 %24
%19 = OpLoad %5 %23
OpBranch %42
%39 = OpLabel
%25 = OpAccessChain %22 %8 %26
%27 = OpLoad %5 %25
OpBranch %40
%40 = OpLabel
%28 = OpPhi %5 %29 %37 %27 %39
%30 = OpAccessChain %22 %8 %31
%32 = OpLoad %5 %30
%20 = OpFAdd %5 %32 %28
OpBranch %42
%38 = OpLabel
%33 = OpAccessChain %22 %8 %34
%21 = OpLoad %5 %33
%35 = OpFDiv %5 %36 %21
OpBranch %42
%42 = OpLabel
%17 = OpPhi %5 %18 %37 %19 %41 %20 %40 %35 %38
OpStore %13 %17
OpReturn
OpFunctionEnd

