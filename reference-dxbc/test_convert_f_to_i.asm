SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %10 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "INPUT"
OpName %10 "SV_TARGET"
OpName %13 "SV_TARGET_1"
OpDecorate %7 Location 0
OpDecorate %10 Location 0
OpDecorate %13 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeInt 32 0
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpTypeInt 32 1
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%17 = OpTypeFloat 64
%24 = OpTypeFloat 16
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%14 = OpLoad %5 %7
%15 = OpConvertFToU %8 %14
%16 = OpConvertFToS %8 %14
%18 = OpFConvert %17 %14
%19 = OpConvertFToU %8 %18
%20 = OpIAdd %8 %15 %19
%21 = OpFConvert %17 %14
%22 = OpConvertFToS %8 %21
%23 = OpIAdd %8 %16 %22
%25 = OpFConvert %24 %14
%26 = OpConvertFToU %8 %25
%27 = OpIAdd %8 %20 %26
%28 = OpFConvert %24 %14
%29 = OpConvertFToS %8 %28
%30 = OpIAdd %8 %23 %29
OpStore %10 %27
%31 = OpBitcast %11 %30
OpStore %13 %31
OpReturn
OpFunctionEnd

