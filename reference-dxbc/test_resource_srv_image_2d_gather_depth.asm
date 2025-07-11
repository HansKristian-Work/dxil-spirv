SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %21 %24 %25 %26
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LAYER"
OpName %21 "OFFSET"
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
OpDecorate %21 Flat
OpDecorate %21 Location 2
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
%18 = OpTypeInt 32 1
%19 = OpTypeVector %18 2
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeVector %5 4
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpVariable %23 Output
%26 = OpVariable %23 Output
%30 = OpTypeInt 32 0
%31 = OpConstant %30 0
%34 = OpConstant %30 1
%36 = OpTypeVector %5 2
%39 = OpTypePointer Input %18
%46 = OpTypeVector %30 2
%48 = OpTypeImage %5 2D 1 0 0 1 Unknown
%49 = OpTypeSampledImage %48
%58 = OpTypePointer Output %5
%62 = OpConstant %30 2
%64 = OpConstant %30 3
%66 = OpConstant %18 -1
%67 = OpConstant %18 0
%69 = OpConstantComposite %19 %66 %67
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %93
%93 = OpLabel
%27 = OpLoad %6 %8
%28 = OpLoad %9 %11
%29 = OpAccessChain %15 %14 %31
%32 = OpLoad %5 %29
%33 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %33
%37 = OpCompositeConstruct %36 %32 %35
%38 = OpLoad %5 %16
%40 = OpAccessChain %39 %21 %31
%41 = OpLoad %18 %40
%42 = OpBitcast %30 %41
%43 = OpAccessChain %39 %21 %34
%44 = OpLoad %18 %43
%45 = OpBitcast %30 %44
%47 = OpCompositeConstruct %46 %42 %45
%50 = OpSampledImage %49 %27 %28
%51 = OpCompositeConstruct %36 %32 %35
%52 = OpImageDrefGather %22 %50 %51 %38
%53 = OpCompositeExtract %5 %52 0
%54 = OpCompositeExtract %5 %52 1
%55 = OpCompositeExtract %5 %52 2
%56 = OpCompositeExtract %5 %52 3
%57 = OpCompositeConstruct %22 %53 %54 %55 %56
%59 = OpAccessChain %58 %24 %31
OpStore %59 %53
%60 = OpAccessChain %58 %24 %34
OpStore %60 %54
%61 = OpAccessChain %58 %24 %62
OpStore %61 %55
%63 = OpAccessChain %58 %24 %64
OpStore %63 %56
%65 = OpCompositeConstruct %36 %32 %35
%68 = OpImageDrefGather %22 %50 %65 %38 ConstOffset %69
%70 = OpCompositeExtract %5 %68 0
%71 = OpCompositeExtract %5 %68 1
%72 = OpCompositeExtract %5 %68 2
%73 = OpCompositeExtract %5 %68 3
%74 = OpCompositeConstruct %22 %70 %71 %72 %73
%75 = OpAccessChain %58 %25 %31
OpStore %75 %70
%76 = OpAccessChain %58 %25 %34
OpStore %76 %71
%77 = OpAccessChain %58 %25 %62
OpStore %77 %72
%78 = OpAccessChain %58 %25 %64
OpStore %78 %73
%79 = OpCompositeConstruct %36 %32 %35
%80 = OpBitcast %18 %42
%81 = OpBitcast %18 %45
%83 = OpCompositeConstruct %19 %80 %81
%82 = OpImageDrefGather %22 %50 %79 %38 Offset %83
%84 = OpCompositeExtract %5 %82 0
%85 = OpCompositeExtract %5 %82 1
%86 = OpCompositeExtract %5 %82 2
%87 = OpCompositeExtract %5 %82 3
%88 = OpCompositeConstruct %22 %84 %85 %86 %87
%89 = OpAccessChain %58 %26 %31
OpStore %89 %84
%90 = OpAccessChain %58 %26 %34
OpStore %90 %85
%91 = OpAccessChain %58 %26 %62
OpStore %91 %86
%92 = OpAccessChain %58 %26 %64
OpStore %92 %87
OpReturn
OpFunctionEnd

