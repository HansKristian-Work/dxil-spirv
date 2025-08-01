SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_TARGET"
OpName %14 ""
OpDecorate %8 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeFunction %6 %5 %5 %5 %5
%21 = OpConstant %5 0.200000003
%22 = OpConstant %5 0.5
%23 = OpConstant %5 1
%24 = OpConstant %5 0.800000012
%26 = OpTypePointer Output %5
%28 = OpTypeInt 32 0
%29 = OpConstant %28 0
%32 = OpConstant %28 1
%35 = OpConstant %28 2
%38 = OpConstant %28 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%20 = OpFunctionCall %6 %14 %21 %22 %23 %24
%25 = OpCompositeExtract %5 %20 0
%27 = OpAccessChain %26 %8 %29
OpStore %27 %25
%30 = OpCompositeExtract %5 %20 1
%31 = OpAccessChain %26 %8 %32
OpStore %31 %30
%33 = OpCompositeExtract %5 %20 2
%34 = OpAccessChain %26 %8 %35
OpStore %34 %33
%36 = OpCompositeExtract %5 %20 3
%37 = OpAccessChain %26 %8 %38
OpStore %37 %36
OpReturn
OpFunctionEnd
%14 = OpFunction %6 None %9
%10 = OpFunctionParameter %5
%11 = OpFunctionParameter %5
%12 = OpFunctionParameter %5
%13 = OpFunctionParameter %5
%15 = OpLabel
OpBranch %41
%41 = OpLabel
%16 = OpFMul %5 %10 %13
%17 = OpFMul %5 %11 %13
%18 = OpFMul %5 %12 %13
%19 = OpCompositeConstruct %6 %16 %17 %18 %13
OpReturnValue %19
OpFunctionEnd

