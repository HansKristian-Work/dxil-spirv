SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
OpCapability Shader
OpCapability Int64
OpCapability Int16
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INPUT"
OpName %9 "SV_TARGET"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpTypeInt 16 0
%13 = OpTypeInt 64 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %33
%33 = OpLabel
%10 = OpLoad %5 %7
%12 = OpUConvert %11 %10
%14 = OpUConvert %13 %12
%15 = OpUConvert %5 %14
%16 = OpUConvert %13 %15
%17 = OpUConvert %11 %16
%18 = OpUConvert %5 %17
%19 = OpSConvert %13 %18
%20 = OpUConvert %11 %19
%21 = OpSConvert %13 %20
%22 = OpUConvert %5 %21
%23 = OpUConvert %11 %22
%24 = OpSConvert %5 %23
%25 = OpSConvert %13 %24
%26 = OpUConvert %5 %25
%27 = OpUConvert %11 %26
%28 = OpUConvert %5 %27
%29 = OpUConvert %11 %28
%30 = OpUConvert %13 %29
%31 = OpUConvert %11 %30
%32 = OpUConvert %5 %31
OpStore %9 %32
OpReturn
OpFunctionEnd

