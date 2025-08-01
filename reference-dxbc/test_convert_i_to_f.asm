SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability Float64
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %7 %10 %13 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "UINPUT"
OpName %10 "SINPUT"
OpName %13 "SV_TARGET"
OpName %14 "SV_TARGET_1"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Flat
OpDecorate %10 Location 0
OpDecorate %10 Component 1
OpDecorate %13 Location 0
OpDecorate %14 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeInt 32 1
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeFloat 32
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpVariable %12 Output
%20 = OpTypeFloat 16
%27 = OpTypeFloat 64
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%15 = OpLoad %5 %7
%16 = OpLoad %8 %10
%17 = OpBitcast %5 %16
%18 = OpConvertUToF %11 %15
%19 = OpConvertSToF %11 %17
%21 = OpConvertUToF %20 %15
%22 = OpFConvert %11 %21
%23 = OpFAdd %11 %18 %22
%24 = OpConvertSToF %20 %17
%25 = OpFConvert %11 %24
%26 = OpFAdd %11 %19 %25
%28 = OpConvertUToF %27 %15
%29 = OpFConvert %11 %28
%30 = OpFAdd %11 %23 %29
%31 = OpConvertSToF %27 %17
%32 = OpFConvert %11 %31
%33 = OpFAdd %11 %26 %32
OpStore %13 %30
OpStore %14 %33
OpReturn
OpFunctionEnd

