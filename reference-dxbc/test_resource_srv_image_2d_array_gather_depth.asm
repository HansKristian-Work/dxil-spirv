SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 96
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
%40 = OpTypePointer Input %18
%47 = OpTypeVector %30 2
%49 = OpTypeImage %5 2D 1 1 0 1 Unknown
%50 = OpTypeSampledImage %49
%59 = OpTypePointer Output %5
%63 = OpConstant %30 2
%65 = OpConstant %30 3
%67 = OpConstant %18 -1
%68 = OpConstant %18 0
%70 = OpConstantComposite %19 %67 %68
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %94
%94 = OpLabel
%27 = OpLoad %6 %8
%28 = OpLoad %9 %11
%29 = OpAccessChain %15 %14 %31
%32 = OpLoad %5 %29
%33 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %33
%38 = OpLoad %5 %16
%39 = OpLoad %5 %17
%41 = OpAccessChain %40 %21 %31
%42 = OpLoad %18 %41
%43 = OpBitcast %30 %42
%44 = OpAccessChain %40 %21 %34
%45 = OpLoad %18 %44
%46 = OpBitcast %30 %45
%51 = OpSampledImage %50 %27 %28
%52 = OpCompositeConstruct %12 %32 %35 %39
%53 = OpImageDrefGather %22 %51 %52 %38
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpCompositeExtract %5 %53 2
%57 = OpCompositeExtract %5 %53 3
%60 = OpAccessChain %59 %24 %31
OpStore %60 %54
%61 = OpAccessChain %59 %24 %34
OpStore %61 %55
%62 = OpAccessChain %59 %24 %63
OpStore %62 %56
%64 = OpAccessChain %59 %24 %65
OpStore %64 %57
%66 = OpCompositeConstruct %12 %32 %35 %39
%69 = OpImageDrefGather %22 %51 %66 %38 ConstOffset %70
%71 = OpCompositeExtract %5 %69 0
%72 = OpCompositeExtract %5 %69 1
%73 = OpCompositeExtract %5 %69 2
%74 = OpCompositeExtract %5 %69 3
%76 = OpAccessChain %59 %25 %31
OpStore %76 %71
%77 = OpAccessChain %59 %25 %34
OpStore %77 %72
%78 = OpAccessChain %59 %25 %63
OpStore %78 %73
%79 = OpAccessChain %59 %25 %65
OpStore %79 %74
%80 = OpCompositeConstruct %12 %32 %35 %39
%81 = OpBitcast %18 %43
%82 = OpBitcast %18 %46
%84 = OpCompositeConstruct %19 %81 %82
%83 = OpImageDrefGather %22 %51 %80 %38 Offset %84
%85 = OpCompositeExtract %5 %83 0
%86 = OpCompositeExtract %5 %83 1
%87 = OpCompositeExtract %5 %83 2
%88 = OpCompositeExtract %5 %83 3
%90 = OpAccessChain %59 %26 %31
OpStore %90 %85
%91 = OpAccessChain %59 %26 %34
OpStore %91 %86
%92 = OpAccessChain %59 %26 %63
OpStore %92 %87
%93 = OpAccessChain %59 %26 %65
OpStore %93 %88
OpReturn
OpFunctionEnd

