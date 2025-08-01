SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %10 %14 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_ISFRONTFACE"
OpName %10 "SV_SAMPLEINDEX"
OpName %14 "SV_COVERAGE"
OpDecorate %8 BuiltIn FrontFacing
OpDecorate %10 BuiltIn SampleId
OpDecorate %10 Flat
OpDecorate %14 BuiltIn SampleMask
OpDecorate %16 BuiltIn SampleMask
OpDecorate %16 Flat
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeBool
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%11 = OpConstant %5 1
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %12
%16 = OpVariable %15 Input
%18 = OpConstant %5 0
%24 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%17 = OpAccessChain %9 %16 %18
%19 = OpLoad %5 %17
%20 = OpLoad %5 %10
%21 = OpBitFieldUExtract %5 %19 %18 %20
%22 = OpLoad %6 %8
%23 = OpSelect %5 %22 %21 %18
%25 = OpAccessChain %24 %14 %18
OpStore %25 %23
OpReturn
OpFunctionEnd

