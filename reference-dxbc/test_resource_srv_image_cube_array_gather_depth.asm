SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 58
; Schema: 0
OpCapability Shader
OpCapability SampledCubeArray
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %21 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LAYER"
OpName %21 "OFFSET"
OpName %24 "SV_TARGET"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %21 Flat
OpDecorate %21 Location 2
OpDecorate %24 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 1 0 1 Unknown
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
%18 = OpTypeInt 32 1
%19 = OpTypeVector %18 3
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeVector %5 4
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%28 = OpTypeInt 32 0
%29 = OpConstant %28 0
%32 = OpConstant %28 1
%35 = OpConstant %28 2
%40 = OpTypeImage %5 Cube 1 1 0 1 Unknown
%41 = OpTypeSampledImage %40
%50 = OpTypePointer Output %5
%55 = OpConstant %28 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %56
%56 = OpLabel
%25 = OpLoad %6 %8
%26 = OpLoad %9 %11
%27 = OpAccessChain %15 %14 %29
%30 = OpLoad %5 %27
%31 = OpAccessChain %15 %14 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %34
%37 = OpCompositeConstruct %12 %30 %33 %36
%38 = OpLoad %5 %16
%39 = OpLoad %5 %17
%42 = OpSampledImage %41 %25 %26
%43 = OpCompositeConstruct %22 %30 %33 %36 %39
%44 = OpImageDrefGather %22 %42 %43 %38
%45 = OpCompositeExtract %5 %44 0
%46 = OpCompositeExtract %5 %44 1
%47 = OpCompositeExtract %5 %44 2
%48 = OpCompositeExtract %5 %44 3
%49 = OpCompositeConstruct %22 %45 %46 %47 %48
%51 = OpAccessChain %50 %24 %29
OpStore %51 %45
%52 = OpAccessChain %50 %24 %32
OpStore %52 %46
%53 = OpAccessChain %50 %24 %35
OpStore %53 %47
%54 = OpAccessChain %50 %24 %55
OpStore %54 %48
OpReturn
OpFunctionEnd

