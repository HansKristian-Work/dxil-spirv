SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %17 %43
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %17 "SV_TARGET"
OpName %43 "discard_state"
OpName %56 "discard_exit"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %17 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeVector %5 2
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 4
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%20 = OpTypePointer Input %5
%22 = OpTypeInt 32 0
%23 = OpConstant %22 0
%26 = OpConstant %22 1
%29 = OpTypeSampledImage %6
%31 = OpConstant %5 0
%39 = OpTypeBool
%41 = OpConstant %5 0.00499999989
%42 = OpTypePointer Private %39
%43 = OpVariable %42 Private
%44 = OpConstantFalse %39
%45 = OpTypePointer Output %5
%49 = OpConstant %22 2
%51 = OpConstant %22 3
%55 = OpConstantTrue %39
%3 = OpFunction %1 None %2
%4 = OpLabel
OpStore %43 %44
OpBranch %52
%52 = OpLabel
%18 = OpLoad %6 %8
%19 = OpLoad %9 %11
%21 = OpAccessChain %20 %14 %23
%24 = OpLoad %5 %21
%25 = OpAccessChain %20 %14 %26
%27 = OpLoad %5 %25
%30 = OpSampledImage %29 %18 %19
%33 = OpCompositeConstruct %12 %24 %27
%32 = OpImageSampleImplicitLod %15 %30 %33 None
%34 = OpCompositeExtract %5 %32 0
%35 = OpCompositeExtract %5 %32 1
%36 = OpCompositeExtract %5 %32 2
%37 = OpCompositeExtract %5 %32 3
%40 = OpFOrdLessThan %39 %37 %41
OpSelectionMerge %54 None
OpBranchConditional %40 %53 %54
%53 = OpLabel
OpStore %43 %55
OpBranch %54
%54 = OpLabel
%46 = OpAccessChain %45 %17 %23
OpStore %46 %34
%47 = OpAccessChain %45 %17 %26
OpStore %47 %35
%48 = OpAccessChain %45 %17 %49
OpStore %48 %36
%50 = OpAccessChain %45 %17 %51
OpStore %50 %37
%62 = OpFunctionCall %1 %56
OpReturn
OpFunctionEnd
%56 = OpFunction %1 None %2
%57 = OpLabel
%60 = OpLoad %39 %43
OpSelectionMerge %59 None
OpBranchConditional %60 %58 %59
%58 = OpLabel
OpKill
%59 = OpLabel
OpReturn
OpFunctionEnd

