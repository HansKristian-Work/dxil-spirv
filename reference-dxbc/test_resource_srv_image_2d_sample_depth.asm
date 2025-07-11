SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 64
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
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
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
%40 = OpTypeImage %5 2D 1 0 0 1 Unknown
%41 = OpTypeSampledImage %40
%43 = OpConstant %5 0
%46 = OpTypeVector %5 4
%49 = OpTypeInt 32 1
%50 = OpConstant %49 -1
%51 = OpConstant %49 0
%54 = OpTypeVector %49 2
%55 = OpConstantComposite %54 %50 %51
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %62
%62 = OpLabel
%27 = OpLoad %6 %8
%28 = OpLoad %9 %11
%29 = OpAccessChain %15 %14 %31
%32 = OpLoad %5 %29
%33 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %33
%36 = OpCompositeConstruct %20 %32 %35
%37 = OpLoad %5 %16
%38 = OpLoad %5 %17
%39 = OpLoad %5 %18
%42 = OpSampledImage %41 %27 %28
%45 = OpCompositeConstruct %20 %32 %35
%44 = OpImageSampleDrefImplicitLod %5 %42 %45 %37 None
%47 = OpCompositeConstruct %46 %44 %44 %44 %44
%48 = OpCompositeExtract %5 %47 0
OpStore %24 %48
%53 = OpCompositeConstruct %20 %32 %35
%52 = OpImageSampleDrefImplicitLod %5 %42 %53 %37 ConstOffset %55
%56 = OpCompositeConstruct %46 %52 %52 %52 %52
%57 = OpCompositeExtract %5 %56 0
OpStore %25 %57
%59 = OpCompositeConstruct %20 %32 %35
%58 = OpImageSampleDrefExplicitLod %5 %42 %59 %37 Lod %43
%60 = OpCompositeConstruct %46 %58 %58 %58 %58
%61 = OpCompositeExtract %5 %60 0
OpStore %26 %61
OpReturn
OpFunctionEnd

