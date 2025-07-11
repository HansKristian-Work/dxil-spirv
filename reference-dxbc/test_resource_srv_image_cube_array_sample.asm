SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 126
; Schema: 0
OpCapability Shader
OpCapability MinLod
OpCapability SampledCubeArray
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %20 %23 %24 %25 %26 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %20 "TEXCOORD_2"
OpName %23 "SV_TARGET"
OpName %24 "SV_TARGET_1"
OpName %25 "SV_TARGET_2"
OpName %26 "SV_TARGET_3"
OpName %27 "SV_TARGET_4"
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
OpDecorate %23 Location 0
OpDecorate %24 Location 1
OpDecorate %25 Location 2
OpDecorate %26 Location 3
OpDecorate %27 Location 4
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
%18 = OpVariable %15 Input
%19 = OpVariable %15 Input
%20 = OpVariable %13 Input
%21 = OpTypeVector %5 4
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpVariable %22 Output
%25 = OpVariable %22 Output
%26 = OpVariable %22 Output
%27 = OpVariable %22 Output
%31 = OpTypeInt 32 0
%32 = OpConstant %31 0
%35 = OpConstant %31 1
%38 = OpConstant %31 2
%42 = OpTypeSampledImage %6
%44 = OpTypeVector %5 2
%50 = OpConstant %5 0
%58 = OpTypePointer Output %5
%63 = OpConstant %31 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %124
%124 = OpLabel
%28 = OpLoad %6 %8
%29 = OpLoad %9 %11
%30 = OpAccessChain %15 %14 %32
%33 = OpLoad %5 %30
%34 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %15 %14 %38
%39 = OpLoad %5 %37
%40 = OpCompositeConstruct %12 %33 %36 %39
%41 = OpLoad %5 %19
%43 = OpSampledImage %42 %28 %29
%46 = OpCompositeConstruct %12 %33 %36 %39
%45 = OpImageQueryLod %44 %43 %46
%47 = OpCompositeExtract %5 %45 0
%48 = OpLoad %5 %17
%49 = OpLoad %5 %18
%52 = OpCompositeConstruct %21 %33 %36 %39 %41
%51 = OpImageSampleImplicitLod %21 %43 %52 None
%53 = OpCompositeExtract %5 %51 0
%54 = OpCompositeExtract %5 %51 1
%55 = OpCompositeExtract %5 %51 2
%56 = OpCompositeExtract %5 %51 3
%57 = OpCompositeConstruct %21 %53 %54 %55 %56
%59 = OpAccessChain %58 %23 %32
OpStore %59 %53
%60 = OpAccessChain %58 %23 %35
OpStore %60 %54
%61 = OpAccessChain %58 %23 %38
OpStore %61 %55
%62 = OpAccessChain %58 %23 %63
OpStore %62 %56
%65 = OpCompositeConstruct %21 %33 %36 %39 %41
%64 = OpImageSampleExplicitLod %21 %43 %65 Lod %47
%66 = OpCompositeExtract %5 %64 0
%67 = OpCompositeExtract %5 %64 1
%68 = OpCompositeExtract %5 %64 2
%69 = OpCompositeExtract %5 %64 3
%70 = OpCompositeConstruct %21 %66 %67 %68 %69
%71 = OpAccessChain %58 %24 %32
OpStore %71 %66
%72 = OpAccessChain %58 %24 %35
OpStore %72 %67
%73 = OpAccessChain %58 %24 %38
OpStore %73 %68
%74 = OpAccessChain %58 %24 %63
OpStore %74 %69
%76 = OpCompositeConstruct %21 %33 %36 %39 %41
%75 = OpImageSampleImplicitLod %21 %43 %76 Bias %48
%77 = OpCompositeExtract %5 %75 0
%78 = OpCompositeExtract %5 %75 1
%79 = OpCompositeExtract %5 %75 2
%80 = OpCompositeExtract %5 %75 3
%81 = OpCompositeConstruct %21 %77 %78 %79 %80
%82 = OpAccessChain %58 %25 %32
OpStore %82 %77
%83 = OpAccessChain %58 %25 %35
OpStore %83 %78
%84 = OpAccessChain %58 %25 %38
OpStore %84 %79
%85 = OpAccessChain %58 %25 %63
OpStore %85 %80
%87 = OpCompositeConstruct %21 %33 %36 %39 %41
%86 = OpImageSampleImplicitLod %21 %43 %87 MinLod %49
%88 = OpCompositeExtract %5 %86 0
%89 = OpCompositeExtract %5 %86 1
%90 = OpCompositeExtract %5 %86 2
%91 = OpCompositeExtract %5 %86 3
%92 = OpCompositeConstruct %21 %88 %89 %90 %91
%93 = OpAccessChain %58 %26 %32
OpStore %93 %88
%94 = OpAccessChain %58 %26 %35
OpStore %94 %89
%95 = OpAccessChain %58 %26 %38
OpStore %95 %90
%96 = OpAccessChain %58 %26 %63
OpStore %96 %91
%97 = OpAccessChain %15 %20 %32
%98 = OpLoad %5 %97
%99 = OpDPdx %5 %98
%100 = OpDPdy %5 %98
%101 = OpAccessChain %15 %20 %35
%102 = OpLoad %5 %101
%103 = OpDPdx %5 %102
%104 = OpDPdy %5 %102
%105 = OpAccessChain %15 %20 %38
%106 = OpLoad %5 %105
%107 = OpDPdx %5 %106
%108 = OpDPdy %5 %106
%109 = OpCompositeConstruct %12 %99 %103 %107
%110 = OpCompositeConstruct %12 %100 %104 %108
%112 = OpCompositeConstruct %21 %33 %36 %39 %41
%113 = OpCompositeConstruct %12 %99 %103 %107
%114 = OpCompositeConstruct %12 %100 %104 %108
%111 = OpImageSampleExplicitLod %21 %43 %112 Grad %113 %114
%115 = OpCompositeExtract %5 %111 0
%116 = OpCompositeExtract %5 %111 1
%117 = OpCompositeExtract %5 %111 2
%118 = OpCompositeExtract %5 %111 3
%119 = OpCompositeConstruct %21 %115 %116 %117 %118
%120 = OpAccessChain %58 %27 %32
OpStore %120 %115
%121 = OpAccessChain %58 %27 %35
OpStore %121 %116
%122 = OpAccessChain %58 %27 %38
OpStore %122 %117
%123 = OpAccessChain %58 %27 %63
OpStore %123 %118
OpReturn
OpFunctionEnd

