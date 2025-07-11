SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 55
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %20 %22 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %20 "TEXCOORD_2"
OpName %22 "SV_TARGET"
OpName %23 "SV_TARGET_1"
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
OpDecorate %20 Location 2
OpDecorate %22 Location 0
OpDecorate %23 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 0 0 1 Unknown
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
%20 = OpVariable %13 Input
%21 = OpTypePointer Output %5
%22 = OpVariable %21 Output
%23 = OpVariable %21 Output
%27 = OpTypeInt 32 0
%28 = OpConstant %27 0
%31 = OpConstant %27 1
%34 = OpConstant %27 2
%40 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%41 = OpTypeSampledImage %40
%43 = OpConstant %5 0
%46 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %53
%53 = OpLabel
%24 = OpLoad %6 %8
%25 = OpLoad %9 %11
%26 = OpAccessChain %15 %14 %28
%29 = OpLoad %5 %26
%30 = OpAccessChain %15 %14 %31
%32 = OpLoad %5 %30
%33 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %33
%36 = OpCompositeConstruct %12 %29 %32 %35
%37 = OpLoad %5 %16
%38 = OpLoad %5 %17
%39 = OpLoad %5 %18
%42 = OpSampledImage %41 %24 %25
%45 = OpCompositeConstruct %12 %29 %32 %35
%44 = OpImageSampleDrefImplicitLod %5 %42 %45 %37 None
%47 = OpCompositeConstruct %46 %44 %44 %44 %44
%48 = OpCompositeExtract %5 %47 0
OpStore %22 %48
%50 = OpCompositeConstruct %12 %29 %32 %35
%49 = OpImageSampleDrefExplicitLod %5 %42 %50 %37 Lod %43
%51 = OpCompositeConstruct %46 %49 %49 %49 %49
%52 = OpCompositeExtract %5 %51 0
OpStore %23 %52
OpReturn
OpFunctionEnd

