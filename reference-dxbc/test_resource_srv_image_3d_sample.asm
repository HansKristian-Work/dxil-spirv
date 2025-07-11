SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 169
; Schema: 0
OpCapability Shader
OpCapability MinLod
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
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
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
%28 = OpVariable %22 Output
%29 = OpVariable %22 Output
%30 = OpVariable %22 Output
%34 = OpTypeInt 32 0
%35 = OpConstant %34 0
%38 = OpConstant %34 1
%41 = OpConstant %34 2
%44 = OpTypeSampledImage %6
%46 = OpTypeVector %5 2
%52 = OpConstant %5 0
%60 = OpTypePointer Output %5
%65 = OpConstant %34 3
%66 = OpTypeInt 32 1
%67 = OpConstant %66 -1
%68 = OpConstant %66 0
%69 = OpConstant %66 1
%72 = OpTypeVector %66 3
%73 = OpConstantComposite %72 %67 %68 %69
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %167
%167 = OpLabel
%31 = OpLoad %6 %8
%32 = OpLoad %9 %11
%33 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %33
%37 = OpAccessChain %15 %14 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %15 %14 %41
%42 = OpLoad %5 %40
%43 = OpCompositeConstruct %12 %36 %39 %42
%45 = OpSampledImage %44 %31 %32
%48 = OpCompositeConstruct %12 %36 %39 %42
%47 = OpImageQueryLod %46 %45 %48
%49 = OpCompositeExtract %5 %47 0
%50 = OpLoad %5 %17
%51 = OpLoad %5 %18
%54 = OpCompositeConstruct %12 %36 %39 %42
%53 = OpImageSampleImplicitLod %21 %45 %54 None
%55 = OpCompositeExtract %5 %53 0
%56 = OpCompositeExtract %5 %53 1
%57 = OpCompositeExtract %5 %53 2
%58 = OpCompositeExtract %5 %53 3
%59 = OpCompositeConstruct %21 %55 %56 %57 %58
%61 = OpAccessChain %60 %23 %35
OpStore %61 %55
%62 = OpAccessChain %60 %23 %38
OpStore %62 %56
%63 = OpAccessChain %60 %23 %41
OpStore %63 %57
%64 = OpAccessChain %60 %23 %65
OpStore %64 %58
%71 = OpCompositeConstruct %12 %36 %39 %42
%70 = OpImageSampleImplicitLod %21 %45 %71 ConstOffset %73
%74 = OpCompositeExtract %5 %70 0
%75 = OpCompositeExtract %5 %70 1
%76 = OpCompositeExtract %5 %70 2
%77 = OpCompositeExtract %5 %70 3
%78 = OpCompositeConstruct %21 %74 %75 %76 %77
%79 = OpAccessChain %60 %24 %35
OpStore %79 %74
%80 = OpAccessChain %60 %24 %38
OpStore %80 %75
%81 = OpAccessChain %60 %24 %41
OpStore %81 %76
%82 = OpAccessChain %60 %24 %65
OpStore %82 %77
%84 = OpCompositeConstruct %12 %36 %39 %42
%83 = OpImageSampleExplicitLod %21 %45 %84 Lod %49
%85 = OpCompositeExtract %5 %83 0
%86 = OpCompositeExtract %5 %83 1
%87 = OpCompositeExtract %5 %83 2
%88 = OpCompositeExtract %5 %83 3
%89 = OpCompositeConstruct %21 %85 %86 %87 %88
%90 = OpAccessChain %60 %25 %35
OpStore %90 %85
%91 = OpAccessChain %60 %25 %38
OpStore %91 %86
%92 = OpAccessChain %60 %25 %41
OpStore %92 %87
%93 = OpAccessChain %60 %25 %65
OpStore %93 %88
%95 = OpCompositeConstruct %12 %36 %39 %42
%94 = OpImageSampleImplicitLod %21 %45 %95 Bias %50
%96 = OpCompositeExtract %5 %94 0
%97 = OpCompositeExtract %5 %94 1
%98 = OpCompositeExtract %5 %94 2
%99 = OpCompositeExtract %5 %94 3
%100 = OpCompositeConstruct %21 %96 %97 %98 %99
%101 = OpAccessChain %60 %26 %35
OpStore %101 %96
%102 = OpAccessChain %60 %26 %38
OpStore %102 %97
%103 = OpAccessChain %60 %26 %41
OpStore %103 %98
%104 = OpAccessChain %60 %26 %65
OpStore %104 %99
%106 = OpCompositeConstruct %12 %36 %39 %42
%105 = OpImageSampleImplicitLod %21 %45 %106 MinLod %51
%107 = OpCompositeExtract %5 %105 0
%108 = OpCompositeExtract %5 %105 1
%109 = OpCompositeExtract %5 %105 2
%110 = OpCompositeExtract %5 %105 3
%111 = OpCompositeConstruct %21 %107 %108 %109 %110
%112 = OpAccessChain %60 %27 %35
OpStore %112 %107
%113 = OpAccessChain %60 %27 %38
OpStore %113 %108
%114 = OpAccessChain %60 %27 %41
OpStore %114 %109
%115 = OpAccessChain %60 %27 %65
OpStore %115 %110
%117 = OpCompositeConstruct %12 %36 %39 %42
%116 = OpImageSampleImplicitLod %21 %45 %117 Bias|ConstOffset|MinLod %50 %73 %51
%118 = OpCompositeExtract %5 %116 0
%119 = OpCompositeExtract %5 %116 1
%120 = OpCompositeExtract %5 %116 2
%121 = OpCompositeExtract %5 %116 3
%122 = OpCompositeConstruct %21 %118 %119 %120 %121
%123 = OpAccessChain %60 %28 %35
OpStore %123 %118
%124 = OpAccessChain %60 %28 %38
OpStore %124 %119
%125 = OpAccessChain %60 %28 %41
OpStore %125 %120
%126 = OpAccessChain %60 %28 %65
OpStore %126 %121
%127 = OpAccessChain %15 %20 %35
%128 = OpLoad %5 %127
%129 = OpDPdx %5 %128
%130 = OpDPdy %5 %128
%131 = OpAccessChain %15 %20 %38
%132 = OpLoad %5 %131
%133 = OpDPdx %5 %132
%134 = OpDPdy %5 %132
%135 = OpAccessChain %15 %20 %41
%136 = OpLoad %5 %135
%137 = OpDPdx %5 %136
%138 = OpDPdy %5 %136
%139 = OpCompositeConstruct %12 %129 %133 %137
%140 = OpCompositeConstruct %12 %130 %134 %138
%142 = OpCompositeConstruct %12 %36 %39 %42
%143 = OpCompositeConstruct %12 %129 %133 %137
%144 = OpCompositeConstruct %12 %130 %134 %138
%141 = OpImageSampleExplicitLod %21 %45 %142 Grad %143 %144
%145 = OpCompositeExtract %5 %141 0
%146 = OpCompositeExtract %5 %141 1
%147 = OpCompositeExtract %5 %141 2
%148 = OpCompositeExtract %5 %141 3
%149 = OpCompositeConstruct %21 %145 %146 %147 %148
%150 = OpAccessChain %60 %29 %35
OpStore %150 %145
%151 = OpAccessChain %60 %29 %38
OpStore %151 %146
%152 = OpAccessChain %60 %29 %41
OpStore %152 %147
%153 = OpAccessChain %60 %29 %65
OpStore %153 %148
%155 = OpCompositeConstruct %12 %36 %39 %42
%156 = OpCompositeConstruct %12 %129 %133 %137
%157 = OpCompositeConstruct %12 %130 %134 %138
%154 = OpImageSampleExplicitLod %21 %45 %155 Grad|ConstOffset %156 %157 %73
%158 = OpCompositeExtract %5 %154 0
%159 = OpCompositeExtract %5 %154 1
%160 = OpCompositeExtract %5 %154 2
%161 = OpCompositeExtract %5 %154 3
%162 = OpCompositeConstruct %21 %158 %159 %160 %161
%163 = OpAccessChain %60 %30 %35
OpStore %163 %158
%164 = OpAccessChain %60 %30 %38
OpStore %164 %159
%165 = OpAccessChain %60 %30 %41
OpStore %165 %160
%166 = OpAccessChain %60 %30 %65
OpStore %166 %161
OpReturn
OpFunctionEnd

