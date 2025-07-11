SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 65
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %22 %24 %25 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %22 "TEXCOORD_2"
OpName %24 "SV_TARGET"
OpName %25 "SV_TARGET_1"
OpName %26 "SV_TARGET_2"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %18 Location 1
OpDecorate %18 Component 2
OpDecorate %19 Location 1
OpDecorate %19 Component 3
OpDecorate %22 Location 2
OpDecorate %24 Location 0
OpDecorate %25 Location 1
OpDecorate %26 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeVector %5 3
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypePointer Input %5
%16 = OpVariable %15 Input
%17 = OpVariable %15 Input
%18 = OpVariable %15 Input
%19 = OpVariable %15 Input
%20 = OpTypeVector %5 2
%21 = OpTypePointer Input %20
%22 = OpVariable %21 Input
%23 = OpTypePointer Output %5
%24 = OpVariable %23 Output
%25 = OpVariable %23 Output
%26 = OpVariable %23 Output
%30 = OpTypeInt 32 0
%31 = OpConstant %30 0
%34 = OpConstant %30 1
%41 = OpTypeImage %5 2D 1 1 0 1 Unknown
%42 = OpTypeSampledImage %41
%44 = OpConstant %5 0
%47 = OpTypeVector %5 4
%50 = OpTypeInt 32 1
%51 = OpConstant %50 -1
%52 = OpConstant %50 0
%55 = OpTypeVector %50 2
%56 = OpConstantComposite %55 %51 %52
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %63
%63 = OpLabel
%27 = OpLoad %6 %8
%28 = OpLoad %9 %11
%29 = OpAccessChain %15 %14 %31
%32 = OpLoad %5 %29
%33 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %33
%36 = OpCompositeConstruct %20 %32 %35
%37 = OpLoad %5 %16
%38 = OpLoad %5 %19
%39 = OpLoad %5 %17
%40 = OpLoad %5 %18
%43 = OpSampledImage %42 %27 %28
%46 = OpCompositeConstruct %12 %32 %35 %38
%45 = OpImageSampleDrefImplicitLod %5 %43 %46 %37 None
%48 = OpCompositeConstruct %47 %45 %45 %45 %45
%49 = OpCompositeExtract %5 %48 0
OpStore %24 %49
%54 = OpCompositeConstruct %12 %32 %35 %38
%53 = OpImageSampleDrefImplicitLod %5 %43 %54 %37 ConstOffset %56
%57 = OpCompositeConstruct %47 %53 %53 %53 %53
%58 = OpCompositeExtract %5 %57 0
OpStore %25 %58
%60 = OpCompositeConstruct %12 %32 %35 %38
%59 = OpImageSampleDrefExplicitLod %5 %43 %60 %37 Lod %44
%61 = OpCompositeConstruct %47 %59 %59 %59 %59
%62 = OpCompositeExtract %5 %61 0
OpStore %26 %62
OpReturn
OpFunctionEnd

