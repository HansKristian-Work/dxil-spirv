SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 136
; Schema: 0
OpCapability Shader
OpCapability MinLod
OpCapability Sampled1D
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %20 %23 %24 %25 %26 %27 %28 %29 %30
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
OpName %28 "SV_TARGET_5"
OpName %29 "SV_TARGET_6"
OpName %30 "SV_TARGET_7"
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
OpDecorate %28 Location 5
OpDecorate %29 Location 6
OpDecorate %30 Location 7
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
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
%20 = OpVariable %15 Input
%21 = OpTypeVector %5 4
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpVariable %22 Output
%25 = OpVariable %22 Output
%26 = OpVariable %22 Output
%27 = OpVariable %22 Output
%28 = OpVariable %22 Output
%29 = OpVariable %22 Output
%30 = OpVariable %22 Output
%34 = OpTypeInt 32 0
%35 = OpConstant %34 0
%37 = OpTypeSampledImage %6
%39 = OpTypeVector %5 2
%44 = OpConstant %5 0
%51 = OpTypePointer Output %5
%54 = OpConstant %34 1
%56 = OpConstant %34 2
%58 = OpConstant %34 3
%59 = OpTypeInt 32 1
%60 = OpConstant %59 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %134
%134 = OpLabel
%31 = OpLoad %6 %8
%32 = OpLoad %9 %11
%33 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %33
%38 = OpSampledImage %37 %31 %32
%40 = OpImageQueryLod %39 %38 %36
%41 = OpCompositeExtract %5 %40 0
%42 = OpLoad %5 %17
%43 = OpLoad %5 %18
%45 = OpImageSampleImplicitLod %21 %38 %36 None
%46 = OpCompositeExtract %5 %45 0
%47 = OpCompositeExtract %5 %45 1
%48 = OpCompositeExtract %5 %45 2
%49 = OpCompositeExtract %5 %45 3
%50 = OpCompositeConstruct %21 %46 %47 %48 %49
%52 = OpAccessChain %51 %23 %35
OpStore %52 %46
%53 = OpAccessChain %51 %23 %54
OpStore %53 %47
%55 = OpAccessChain %51 %23 %56
OpStore %55 %48
%57 = OpAccessChain %51 %23 %58
OpStore %57 %49
%61 = OpImageSampleImplicitLod %21 %38 %36 ConstOffset %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeExtract %5 %61 2
%65 = OpCompositeExtract %5 %61 3
%66 = OpCompositeConstruct %21 %62 %63 %64 %65
%67 = OpAccessChain %51 %24 %35
OpStore %67 %62
%68 = OpAccessChain %51 %24 %54
OpStore %68 %63
%69 = OpAccessChain %51 %24 %56
OpStore %69 %64
%70 = OpAccessChain %51 %24 %58
OpStore %70 %65
%71 = OpImageSampleExplicitLod %21 %38 %36 Lod %41
%72 = OpCompositeExtract %5 %71 0
%73 = OpCompositeExtract %5 %71 1
%74 = OpCompositeExtract %5 %71 2
%75 = OpCompositeExtract %5 %71 3
%76 = OpCompositeConstruct %21 %72 %73 %74 %75
%77 = OpAccessChain %51 %25 %35
OpStore %77 %72
%78 = OpAccessChain %51 %25 %54
OpStore %78 %73
%79 = OpAccessChain %51 %25 %56
OpStore %79 %74
%80 = OpAccessChain %51 %25 %58
OpStore %80 %75
%81 = OpImageSampleImplicitLod %21 %38 %36 Bias %42
%82 = OpCompositeExtract %5 %81 0
%83 = OpCompositeExtract %5 %81 1
%84 = OpCompositeExtract %5 %81 2
%85 = OpCompositeExtract %5 %81 3
%86 = OpCompositeConstruct %21 %82 %83 %84 %85
%87 = OpAccessChain %51 %26 %35
OpStore %87 %82
%88 = OpAccessChain %51 %26 %54
OpStore %88 %83
%89 = OpAccessChain %51 %26 %56
OpStore %89 %84
%90 = OpAccessChain %51 %26 %58
OpStore %90 %85
%91 = OpImageSampleImplicitLod %21 %38 %36 MinLod %43
%92 = OpCompositeExtract %5 %91 0
%93 = OpCompositeExtract %5 %91 1
%94 = OpCompositeExtract %5 %91 2
%95 = OpCompositeExtract %5 %91 3
%96 = OpCompositeConstruct %21 %92 %93 %94 %95
%97 = OpAccessChain %51 %27 %35
OpStore %97 %92
%98 = OpAccessChain %51 %27 %54
OpStore %98 %93
%99 = OpAccessChain %51 %27 %56
OpStore %99 %94
%100 = OpAccessChain %51 %27 %58
OpStore %100 %95
%101 = OpImageSampleImplicitLod %21 %38 %36 Bias|ConstOffset|MinLod %42 %60 %43
%102 = OpCompositeExtract %5 %101 0
%103 = OpCompositeExtract %5 %101 1
%104 = OpCompositeExtract %5 %101 2
%105 = OpCompositeExtract %5 %101 3
%106 = OpCompositeConstruct %21 %102 %103 %104 %105
%107 = OpAccessChain %51 %28 %35
OpStore %107 %102
%108 = OpAccessChain %51 %28 %54
OpStore %108 %103
%109 = OpAccessChain %51 %28 %56
OpStore %109 %104
%110 = OpAccessChain %51 %28 %58
OpStore %110 %105
%111 = OpLoad %5 %20
%112 = OpDPdx %5 %111
%113 = OpDPdy %5 %111
%114 = OpImageSampleExplicitLod %21 %38 %36 Grad %112 %113
%115 = OpCompositeExtract %5 %114 0
%116 = OpCompositeExtract %5 %114 1
%117 = OpCompositeExtract %5 %114 2
%118 = OpCompositeExtract %5 %114 3
%119 = OpCompositeConstruct %21 %115 %116 %117 %118
%120 = OpAccessChain %51 %29 %35
OpStore %120 %115
%121 = OpAccessChain %51 %29 %54
OpStore %121 %116
%122 = OpAccessChain %51 %29 %56
OpStore %122 %117
%123 = OpAccessChain %51 %29 %58
OpStore %123 %118
%124 = OpImageSampleExplicitLod %21 %38 %36 Grad|ConstOffset %112 %113 %60
%125 = OpCompositeExtract %5 %124 0
%126 = OpCompositeExtract %5 %124 1
%127 = OpCompositeExtract %5 %124 2
%128 = OpCompositeExtract %5 %124 3
%129 = OpCompositeConstruct %21 %125 %126 %127 %128
%130 = OpAccessChain %51 %30 %35
OpStore %130 %125
%131 = OpAccessChain %51 %30 %54
OpStore %131 %126
%132 = OpAccessChain %51 %30 %56
OpStore %132 %127
%133 = OpAccessChain %51 %30 %58
OpStore %133 %128
OpReturn
OpFunctionEnd

