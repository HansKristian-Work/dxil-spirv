SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 145
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
%6 = OpTypeImage %5 1D 0 1 0 1 Unknown
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
%38 = OpTypeSampledImage %6
%40 = OpTypeVector %5 2
%45 = OpConstant %5 0
%53 = OpTypePointer Output %5
%56 = OpConstant %34 1
%58 = OpConstant %34 2
%60 = OpConstant %34 3
%61 = OpTypeInt 32 1
%62 = OpConstant %61 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %143
%143 = OpLabel
%31 = OpLoad %6 %8
%32 = OpLoad %9 %11
%33 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %33
%37 = OpLoad %5 %19
%39 = OpSampledImage %38 %31 %32
%41 = OpImageQueryLod %40 %39 %36
%42 = OpCompositeExtract %5 %41 0
%43 = OpLoad %5 %17
%44 = OpLoad %5 %18
%47 = OpCompositeConstruct %40 %36 %37
%46 = OpImageSampleImplicitLod %21 %39 %47 None
%48 = OpCompositeExtract %5 %46 0
%49 = OpCompositeExtract %5 %46 1
%50 = OpCompositeExtract %5 %46 2
%51 = OpCompositeExtract %5 %46 3
%54 = OpAccessChain %53 %23 %35
OpStore %54 %48
%55 = OpAccessChain %53 %23 %56
OpStore %55 %49
%57 = OpAccessChain %53 %23 %58
OpStore %57 %50
%59 = OpAccessChain %53 %23 %60
OpStore %59 %51
%64 = OpCompositeConstruct %40 %36 %37
%63 = OpImageSampleImplicitLod %21 %39 %64 ConstOffset %62
%65 = OpCompositeExtract %5 %63 0
%66 = OpCompositeExtract %5 %63 1
%67 = OpCompositeExtract %5 %63 2
%68 = OpCompositeExtract %5 %63 3
%70 = OpAccessChain %53 %24 %35
OpStore %70 %65
%71 = OpAccessChain %53 %24 %56
OpStore %71 %66
%72 = OpAccessChain %53 %24 %58
OpStore %72 %67
%73 = OpAccessChain %53 %24 %60
OpStore %73 %68
%75 = OpCompositeConstruct %40 %36 %37
%74 = OpImageSampleExplicitLod %21 %39 %75 Lod %42
%76 = OpCompositeExtract %5 %74 0
%77 = OpCompositeExtract %5 %74 1
%78 = OpCompositeExtract %5 %74 2
%79 = OpCompositeExtract %5 %74 3
%81 = OpAccessChain %53 %25 %35
OpStore %81 %76
%82 = OpAccessChain %53 %25 %56
OpStore %82 %77
%83 = OpAccessChain %53 %25 %58
OpStore %83 %78
%84 = OpAccessChain %53 %25 %60
OpStore %84 %79
%86 = OpCompositeConstruct %40 %36 %37
%85 = OpImageSampleImplicitLod %21 %39 %86 Bias %43
%87 = OpCompositeExtract %5 %85 0
%88 = OpCompositeExtract %5 %85 1
%89 = OpCompositeExtract %5 %85 2
%90 = OpCompositeExtract %5 %85 3
%92 = OpAccessChain %53 %26 %35
OpStore %92 %87
%93 = OpAccessChain %53 %26 %56
OpStore %93 %88
%94 = OpAccessChain %53 %26 %58
OpStore %94 %89
%95 = OpAccessChain %53 %26 %60
OpStore %95 %90
%97 = OpCompositeConstruct %40 %36 %37
%96 = OpImageSampleImplicitLod %21 %39 %97 MinLod %44
%98 = OpCompositeExtract %5 %96 0
%99 = OpCompositeExtract %5 %96 1
%100 = OpCompositeExtract %5 %96 2
%101 = OpCompositeExtract %5 %96 3
%103 = OpAccessChain %53 %27 %35
OpStore %103 %98
%104 = OpAccessChain %53 %27 %56
OpStore %104 %99
%105 = OpAccessChain %53 %27 %58
OpStore %105 %100
%106 = OpAccessChain %53 %27 %60
OpStore %106 %101
%108 = OpCompositeConstruct %40 %36 %37
%107 = OpImageSampleImplicitLod %21 %39 %108 Bias|ConstOffset|MinLod %43 %62 %44
%109 = OpCompositeExtract %5 %107 0
%110 = OpCompositeExtract %5 %107 1
%111 = OpCompositeExtract %5 %107 2
%112 = OpCompositeExtract %5 %107 3
%114 = OpAccessChain %53 %28 %35
OpStore %114 %109
%115 = OpAccessChain %53 %28 %56
OpStore %115 %110
%116 = OpAccessChain %53 %28 %58
OpStore %116 %111
%117 = OpAccessChain %53 %28 %60
OpStore %117 %112
%118 = OpLoad %5 %20
%119 = OpDPdx %5 %118
%120 = OpDPdy %5 %118
%122 = OpCompositeConstruct %40 %36 %37
%121 = OpImageSampleExplicitLod %21 %39 %122 Grad %119 %120
%123 = OpCompositeExtract %5 %121 0
%124 = OpCompositeExtract %5 %121 1
%125 = OpCompositeExtract %5 %121 2
%126 = OpCompositeExtract %5 %121 3
%128 = OpAccessChain %53 %29 %35
OpStore %128 %123
%129 = OpAccessChain %53 %29 %56
OpStore %129 %124
%130 = OpAccessChain %53 %29 %58
OpStore %130 %125
%131 = OpAccessChain %53 %29 %60
OpStore %131 %126
%133 = OpCompositeConstruct %40 %36 %37
%132 = OpImageSampleExplicitLod %21 %39 %133 Grad|ConstOffset %119 %120 %62
%134 = OpCompositeExtract %5 %132 0
%135 = OpCompositeExtract %5 %132 1
%136 = OpCompositeExtract %5 %132 2
%137 = OpCompositeExtract %5 %132 3
%139 = OpAccessChain %53 %30 %35
OpStore %139 %134
%140 = OpAccessChain %53 %30 %56
OpStore %140 %135
%141 = OpAccessChain %53 %30 %58
OpStore %141 %136
%142 = OpAccessChain %53 %30 %60
OpStore %142 %137
OpReturn
OpFunctionEnd

