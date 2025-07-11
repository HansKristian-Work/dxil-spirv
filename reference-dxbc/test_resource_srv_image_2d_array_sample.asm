SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 164
; Schema: 0
OpCapability Shader
OpCapability MinLod
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %22 %25 %26 %27 %28 %29 %30 %31 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %22 "TEXCOORD_2"
OpName %25 "SV_TARGET"
OpName %26 "SV_TARGET_1"
OpName %27 "SV_TARGET_2"
OpName %28 "SV_TARGET_3"
OpName %29 "SV_TARGET_4"
OpName %30 "SV_TARGET_5"
OpName %31 "SV_TARGET_6"
OpName %32 "SV_TARGET_7"
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
OpDecorate %25 Location 0
OpDecorate %26 Location 1
OpDecorate %27 Location 2
OpDecorate %28 Location 3
OpDecorate %29 Location 4
OpDecorate %30 Location 5
OpDecorate %31 Location 6
OpDecorate %32 Location 7
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
%23 = OpTypeVector %5 4
%24 = OpTypePointer Output %23
%25 = OpVariable %24 Output
%26 = OpVariable %24 Output
%27 = OpVariable %24 Output
%28 = OpVariable %24 Output
%29 = OpVariable %24 Output
%30 = OpVariable %24 Output
%31 = OpVariable %24 Output
%32 = OpVariable %24 Output
%36 = OpTypeInt 32 0
%37 = OpConstant %36 0
%40 = OpConstant %36 1
%44 = OpTypeSampledImage %6
%51 = OpConstant %5 0
%59 = OpTypePointer Output %5
%63 = OpConstant %36 2
%65 = OpConstant %36 3
%66 = OpTypeInt 32 1
%67 = OpConstant %66 -1
%68 = OpConstant %66 0
%71 = OpTypeVector %66 2
%72 = OpConstantComposite %71 %67 %68
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %162
%162 = OpLabel
%33 = OpLoad %6 %8
%34 = OpLoad %9 %11
%35 = OpAccessChain %15 %14 %37
%38 = OpLoad %5 %35
%39 = OpAccessChain %15 %14 %40
%41 = OpLoad %5 %39
%43 = OpLoad %5 %19
%45 = OpSampledImage %44 %33 %34
%47 = OpCompositeConstruct %20 %38 %41
%46 = OpImageQueryLod %20 %45 %47
%48 = OpCompositeExtract %5 %46 0
%49 = OpLoad %5 %17
%50 = OpLoad %5 %18
%53 = OpCompositeConstruct %12 %38 %41 %43
%52 = OpImageSampleImplicitLod %23 %45 %53 None
%54 = OpCompositeExtract %5 %52 0
%55 = OpCompositeExtract %5 %52 1
%56 = OpCompositeExtract %5 %52 2
%57 = OpCompositeExtract %5 %52 3
%60 = OpAccessChain %59 %25 %37
OpStore %60 %54
%61 = OpAccessChain %59 %25 %40
OpStore %61 %55
%62 = OpAccessChain %59 %25 %63
OpStore %62 %56
%64 = OpAccessChain %59 %25 %65
OpStore %64 %57
%70 = OpCompositeConstruct %12 %38 %41 %43
%69 = OpImageSampleImplicitLod %23 %45 %70 ConstOffset %72
%73 = OpCompositeExtract %5 %69 0
%74 = OpCompositeExtract %5 %69 1
%75 = OpCompositeExtract %5 %69 2
%76 = OpCompositeExtract %5 %69 3
%78 = OpAccessChain %59 %26 %37
OpStore %78 %73
%79 = OpAccessChain %59 %26 %40
OpStore %79 %74
%80 = OpAccessChain %59 %26 %63
OpStore %80 %75
%81 = OpAccessChain %59 %26 %65
OpStore %81 %76
%83 = OpCompositeConstruct %12 %38 %41 %43
%82 = OpImageSampleExplicitLod %23 %45 %83 Lod %48
%84 = OpCompositeExtract %5 %82 0
%85 = OpCompositeExtract %5 %82 1
%86 = OpCompositeExtract %5 %82 2
%87 = OpCompositeExtract %5 %82 3
%89 = OpAccessChain %59 %27 %37
OpStore %89 %84
%90 = OpAccessChain %59 %27 %40
OpStore %90 %85
%91 = OpAccessChain %59 %27 %63
OpStore %91 %86
%92 = OpAccessChain %59 %27 %65
OpStore %92 %87
%94 = OpCompositeConstruct %12 %38 %41 %43
%93 = OpImageSampleImplicitLod %23 %45 %94 Bias %49
%95 = OpCompositeExtract %5 %93 0
%96 = OpCompositeExtract %5 %93 1
%97 = OpCompositeExtract %5 %93 2
%98 = OpCompositeExtract %5 %93 3
%100 = OpAccessChain %59 %28 %37
OpStore %100 %95
%101 = OpAccessChain %59 %28 %40
OpStore %101 %96
%102 = OpAccessChain %59 %28 %63
OpStore %102 %97
%103 = OpAccessChain %59 %28 %65
OpStore %103 %98
%105 = OpCompositeConstruct %12 %38 %41 %43
%104 = OpImageSampleImplicitLod %23 %45 %105 MinLod %50
%106 = OpCompositeExtract %5 %104 0
%107 = OpCompositeExtract %5 %104 1
%108 = OpCompositeExtract %5 %104 2
%109 = OpCompositeExtract %5 %104 3
%111 = OpAccessChain %59 %29 %37
OpStore %111 %106
%112 = OpAccessChain %59 %29 %40
OpStore %112 %107
%113 = OpAccessChain %59 %29 %63
OpStore %113 %108
%114 = OpAccessChain %59 %29 %65
OpStore %114 %109
%116 = OpCompositeConstruct %12 %38 %41 %43
%115 = OpImageSampleImplicitLod %23 %45 %116 Bias|ConstOffset|MinLod %49 %72 %50
%117 = OpCompositeExtract %5 %115 0
%118 = OpCompositeExtract %5 %115 1
%119 = OpCompositeExtract %5 %115 2
%120 = OpCompositeExtract %5 %115 3
%122 = OpAccessChain %59 %30 %37
OpStore %122 %117
%123 = OpAccessChain %59 %30 %40
OpStore %123 %118
%124 = OpAccessChain %59 %30 %63
OpStore %124 %119
%125 = OpAccessChain %59 %30 %65
OpStore %125 %120
%126 = OpAccessChain %15 %22 %37
%127 = OpLoad %5 %126
%128 = OpDPdx %5 %127
%129 = OpDPdy %5 %127
%130 = OpAccessChain %15 %22 %40
%131 = OpLoad %5 %130
%132 = OpDPdx %5 %131
%133 = OpDPdy %5 %131
%137 = OpCompositeConstruct %12 %38 %41 %43
%138 = OpCompositeConstruct %20 %128 %132
%139 = OpCompositeConstruct %20 %129 %133
%136 = OpImageSampleExplicitLod %23 %45 %137 Grad %138 %139
%140 = OpCompositeExtract %5 %136 0
%141 = OpCompositeExtract %5 %136 1
%142 = OpCompositeExtract %5 %136 2
%143 = OpCompositeExtract %5 %136 3
%145 = OpAccessChain %59 %31 %37
OpStore %145 %140
%146 = OpAccessChain %59 %31 %40
OpStore %146 %141
%147 = OpAccessChain %59 %31 %63
OpStore %147 %142
%148 = OpAccessChain %59 %31 %65
OpStore %148 %143
%150 = OpCompositeConstruct %12 %38 %41 %43
%151 = OpCompositeConstruct %20 %128 %132
%152 = OpCompositeConstruct %20 %129 %133
%149 = OpImageSampleExplicitLod %23 %45 %150 Grad|ConstOffset %151 %152 %72
%153 = OpCompositeExtract %5 %149 0
%154 = OpCompositeExtract %5 %149 1
%155 = OpCompositeExtract %5 %149 2
%156 = OpCompositeExtract %5 %149 3
%158 = OpAccessChain %59 %32 %37
OpStore %158 %153
%159 = OpAccessChain %59 %32 %40
OpStore %159 %154
%160 = OpAccessChain %59 %32 %63
OpStore %160 %155
%161 = OpAccessChain %59 %32 %65
OpStore %161 %156
OpReturn
OpFunctionEnd

