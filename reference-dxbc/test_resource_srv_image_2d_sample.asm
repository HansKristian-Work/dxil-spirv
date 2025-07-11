SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 163
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
%43 = OpTypeSampledImage %6
%50 = OpConstant %5 0
%58 = OpTypePointer Output %5
%62 = OpConstant %36 2
%64 = OpConstant %36 3
%65 = OpTypeInt 32 1
%66 = OpConstant %65 -1
%67 = OpConstant %65 0
%70 = OpTypeVector %65 2
%71 = OpConstantComposite %70 %66 %67
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %161
%161 = OpLabel
%33 = OpLoad %6 %8
%34 = OpLoad %9 %11
%35 = OpAccessChain %15 %14 %37
%38 = OpLoad %5 %35
%39 = OpAccessChain %15 %14 %40
%41 = OpLoad %5 %39
%42 = OpCompositeConstruct %20 %38 %41
%44 = OpSampledImage %43 %33 %34
%46 = OpCompositeConstruct %20 %38 %41
%45 = OpImageQueryLod %20 %44 %46
%47 = OpCompositeExtract %5 %45 0
%48 = OpLoad %5 %17
%49 = OpLoad %5 %18
%52 = OpCompositeConstruct %20 %38 %41
%51 = OpImageSampleImplicitLod %23 %44 %52 None
%53 = OpCompositeExtract %5 %51 0
%54 = OpCompositeExtract %5 %51 1
%55 = OpCompositeExtract %5 %51 2
%56 = OpCompositeExtract %5 %51 3
%57 = OpCompositeConstruct %23 %53 %54 %55 %56
%59 = OpAccessChain %58 %25 %37
OpStore %59 %53
%60 = OpAccessChain %58 %25 %40
OpStore %60 %54
%61 = OpAccessChain %58 %25 %62
OpStore %61 %55
%63 = OpAccessChain %58 %25 %64
OpStore %63 %56
%69 = OpCompositeConstruct %20 %38 %41
%68 = OpImageSampleImplicitLod %23 %44 %69 ConstOffset %71
%72 = OpCompositeExtract %5 %68 0
%73 = OpCompositeExtract %5 %68 1
%74 = OpCompositeExtract %5 %68 2
%75 = OpCompositeExtract %5 %68 3
%76 = OpCompositeConstruct %23 %72 %73 %74 %75
%77 = OpAccessChain %58 %26 %37
OpStore %77 %72
%78 = OpAccessChain %58 %26 %40
OpStore %78 %73
%79 = OpAccessChain %58 %26 %62
OpStore %79 %74
%80 = OpAccessChain %58 %26 %64
OpStore %80 %75
%82 = OpCompositeConstruct %20 %38 %41
%81 = OpImageSampleExplicitLod %23 %44 %82 Lod %47
%83 = OpCompositeExtract %5 %81 0
%84 = OpCompositeExtract %5 %81 1
%85 = OpCompositeExtract %5 %81 2
%86 = OpCompositeExtract %5 %81 3
%87 = OpCompositeConstruct %23 %83 %84 %85 %86
%88 = OpAccessChain %58 %27 %37
OpStore %88 %83
%89 = OpAccessChain %58 %27 %40
OpStore %89 %84
%90 = OpAccessChain %58 %27 %62
OpStore %90 %85
%91 = OpAccessChain %58 %27 %64
OpStore %91 %86
%93 = OpCompositeConstruct %20 %38 %41
%92 = OpImageSampleImplicitLod %23 %44 %93 Bias %48
%94 = OpCompositeExtract %5 %92 0
%95 = OpCompositeExtract %5 %92 1
%96 = OpCompositeExtract %5 %92 2
%97 = OpCompositeExtract %5 %92 3
%98 = OpCompositeConstruct %23 %94 %95 %96 %97
%99 = OpAccessChain %58 %28 %37
OpStore %99 %94
%100 = OpAccessChain %58 %28 %40
OpStore %100 %95
%101 = OpAccessChain %58 %28 %62
OpStore %101 %96
%102 = OpAccessChain %58 %28 %64
OpStore %102 %97
%104 = OpCompositeConstruct %20 %38 %41
%103 = OpImageSampleImplicitLod %23 %44 %104 MinLod %49
%105 = OpCompositeExtract %5 %103 0
%106 = OpCompositeExtract %5 %103 1
%107 = OpCompositeExtract %5 %103 2
%108 = OpCompositeExtract %5 %103 3
%109 = OpCompositeConstruct %23 %105 %106 %107 %108
%110 = OpAccessChain %58 %29 %37
OpStore %110 %105
%111 = OpAccessChain %58 %29 %40
OpStore %111 %106
%112 = OpAccessChain %58 %29 %62
OpStore %112 %107
%113 = OpAccessChain %58 %29 %64
OpStore %113 %108
%115 = OpCompositeConstruct %20 %38 %41
%114 = OpImageSampleImplicitLod %23 %44 %115 Bias|ConstOffset|MinLod %48 %71 %49
%116 = OpCompositeExtract %5 %114 0
%117 = OpCompositeExtract %5 %114 1
%118 = OpCompositeExtract %5 %114 2
%119 = OpCompositeExtract %5 %114 3
%120 = OpCompositeConstruct %23 %116 %117 %118 %119
%121 = OpAccessChain %58 %30 %37
OpStore %121 %116
%122 = OpAccessChain %58 %30 %40
OpStore %122 %117
%123 = OpAccessChain %58 %30 %62
OpStore %123 %118
%124 = OpAccessChain %58 %30 %64
OpStore %124 %119
%125 = OpAccessChain %15 %22 %37
%126 = OpLoad %5 %125
%127 = OpDPdx %5 %126
%128 = OpDPdy %5 %126
%129 = OpAccessChain %15 %22 %40
%130 = OpLoad %5 %129
%131 = OpDPdx %5 %130
%132 = OpDPdy %5 %130
%133 = OpCompositeConstruct %20 %127 %131
%134 = OpCompositeConstruct %20 %128 %132
%136 = OpCompositeConstruct %20 %38 %41
%137 = OpCompositeConstruct %20 %127 %131
%138 = OpCompositeConstruct %20 %128 %132
%135 = OpImageSampleExplicitLod %23 %44 %136 Grad %137 %138
%139 = OpCompositeExtract %5 %135 0
%140 = OpCompositeExtract %5 %135 1
%141 = OpCompositeExtract %5 %135 2
%142 = OpCompositeExtract %5 %135 3
%143 = OpCompositeConstruct %23 %139 %140 %141 %142
%144 = OpAccessChain %58 %31 %37
OpStore %144 %139
%145 = OpAccessChain %58 %31 %40
OpStore %145 %140
%146 = OpAccessChain %58 %31 %62
OpStore %146 %141
%147 = OpAccessChain %58 %31 %64
OpStore %147 %142
%149 = OpCompositeConstruct %20 %38 %41
%150 = OpCompositeConstruct %20 %127 %131
%151 = OpCompositeConstruct %20 %128 %132
%148 = OpImageSampleExplicitLod %23 %44 %149 Grad|ConstOffset %150 %151 %71
%152 = OpCompositeExtract %5 %148 0
%153 = OpCompositeExtract %5 %148 1
%154 = OpCompositeExtract %5 %148 2
%155 = OpCompositeExtract %5 %148 3
%156 = OpCompositeConstruct %23 %152 %153 %154 %155
%157 = OpAccessChain %58 %32 %37
OpStore %157 %152
%158 = OpAccessChain %58 %32 %40
OpStore %158 %153
%159 = OpAccessChain %58 %32 %62
OpStore %159 %154
%160 = OpAccessChain %58 %32 %64
OpStore %160 %155
OpReturn
OpFunctionEnd

