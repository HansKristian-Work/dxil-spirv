SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 61
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %14 %17 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "TEXCOORD"
OpName %14 "SV_SAMPLEINDEX"
OpName %17 "SV_TARGET"
OpName %18 "SV_TARGET_1"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 BuiltIn SampleId
OpDecorate %14 Flat
OpDecorate %17 Location 0
OpDecorate %18 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 1 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Input %9
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 4
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%21 = OpConstant %9 0
%24 = OpConstant %9 1
%26 = OpTypeVector %9 2
%36 = OpTypePointer Output %5
%40 = OpConstant %9 2
%42 = OpConstant %9 3
%43 = OpTypeInt 32 1
%44 = OpConstant %43 -1
%45 = OpConstant %43 0
%48 = OpTypeVector %43 2
%49 = OpConstantComposite %48 %44 %45
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %59
%59 = OpLabel
%19 = OpLoad %6 %8
%20 = OpAccessChain %13 %12 %21
%22 = OpLoad %9 %20
%23 = OpAccessChain %13 %12 %24
%25 = OpLoad %9 %23
%28 = OpLoad %9 %14
%30 = OpCompositeConstruct %26 %22 %25
%29 = OpImageFetch %15 %19 %30 Sample %28
%31 = OpCompositeExtract %5 %29 0
%32 = OpCompositeExtract %5 %29 1
%33 = OpCompositeExtract %5 %29 2
%34 = OpCompositeExtract %5 %29 3
%37 = OpAccessChain %36 %17 %21
OpStore %37 %31
%38 = OpAccessChain %36 %17 %24
OpStore %38 %32
%39 = OpAccessChain %36 %17 %40
OpStore %39 %33
%41 = OpAccessChain %36 %17 %42
OpStore %41 %34
%47 = OpCompositeConstruct %26 %22 %25
%46 = OpImageFetch %15 %19 %47 ConstOffset|Sample %49 %28
%50 = OpCompositeExtract %5 %46 0
%51 = OpCompositeExtract %5 %46 1
%52 = OpCompositeExtract %5 %46 2
%53 = OpCompositeExtract %5 %46 3
%55 = OpAccessChain %36 %18 %21
OpStore %55 %50
%56 = OpAccessChain %36 %18 %24
OpStore %56 %51
%57 = OpAccessChain %36 %18 %40
OpStore %57 %52
%58 = OpAccessChain %36 %18 %42
OpStore %58 %53
OpReturn
OpFunctionEnd

