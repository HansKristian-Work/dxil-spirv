SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 183
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability MinLod
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %26 %27 %30 %33 %34 %35 %36 %37 %38 %39 %40
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %22 "TEXCOORD"
OpName %24 "DEPTH_REF"
OpName %25 "LOD_BIAS"
OpName %26 "LOD_CLAMP"
OpName %27 "LAYER"
OpName %30 "TEXCOORD_2"
OpName %33 "SV_TARGET"
OpName %34 "SV_TARGET_1"
OpName %35 "SV_TARGET_2"
OpName %36 "SV_TARGET_3"
OpName %37 "SV_TARGET_4"
OpName %38 "SV_TARGET_5"
OpName %39 "SV_TARGET_6"
OpName %40 "SV_TARGET_7"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 0
OpDecorate %22 Location 0
OpDecorate %24 Location 1
OpDecorate %25 Location 1
OpDecorate %25 Component 1
OpDecorate %26 Location 1
OpDecorate %26 Component 2
OpDecorate %27 Location 1
OpDecorate %27 Component 3
OpDecorate %30 Location 2
OpDecorate %33 Location 0
OpDecorate %34 Location 1
OpDecorate %35 Location 2
OpDecorate %36 Location 3
OpDecorate %37 Location 4
OpDecorate %38 Location 5
OpDecorate %39 Location 6
OpDecorate %40 Location 7
OpDecorate %51 NonUniform
OpDecorate %54 NonUniform
OpDecorate %57 NonUniform
OpDecorate %65 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 4
%12 = OpTypeArray %5 %11
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeSampler
%17 = OpTypeRuntimeArray %16
%18 = OpTypePointer UniformConstant %17
%19 = OpVariable %18 UniformConstant
%20 = OpTypeVector %5 3
%21 = OpTypePointer Input %20
%22 = OpVariable %21 Input
%23 = OpTypePointer Input %5
%24 = OpVariable %23 Input
%25 = OpVariable %23 Input
%26 = OpVariable %23 Input
%27 = OpVariable %23 Input
%28 = OpTypeVector %5 2
%29 = OpTypePointer Input %28
%30 = OpVariable %29 Input
%31 = OpTypeVector %5 4
%32 = OpTypePointer Output %31
%33 = OpVariable %32 Output
%34 = OpVariable %32 Output
%35 = OpVariable %32 Output
%36 = OpVariable %32 Output
%37 = OpVariable %32 Output
%38 = OpVariable %32 Output
%39 = OpVariable %32 Output
%40 = OpVariable %32 Output
%42 = OpConstant %10 0
%43 = OpConstant %10 16
%47 = OpConstant %10 2
%48 = OpTypePointer Uniform %5
%52 = OpTypePointer UniformConstant %6
%55 = OpTypePointer UniformConstant %16
%61 = OpConstant %10 1
%64 = OpTypeSampledImage %6
%71 = OpConstant %5 0
%79 = OpTypePointer Output %5
%84 = OpConstant %10 3
%85 = OpTypeInt 32 1
%86 = OpConstant %85 -1
%87 = OpConstant %85 0
%90 = OpTypeVector %85 2
%91 = OpConstantComposite %90 %86 %87
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %181
%181 = OpLabel
%41 = OpIMul %10 %42 %43
%44 = OpIMul %10 %42 %11
%45 = OpIAdd %10 %41 %44
%46 = OpShiftRightLogical %10 %45 %47
%49 = OpAccessChain %48 %15 %42 %46
%50 = OpLoad %5 %49
%51 = OpBitcast %10 %50
%53 = OpAccessChain %52 %9 %51
%54 = OpLoad %6 %53
%56 = OpAccessChain %55 %19 %51
%57 = OpLoad %16 %56
%58 = OpAccessChain %23 %22 %42
%59 = OpLoad %5 %58
%60 = OpAccessChain %23 %22 %61
%62 = OpLoad %5 %60
%63 = OpCompositeConstruct %28 %59 %62
%65 = OpSampledImage %64 %54 %57
%67 = OpCompositeConstruct %28 %59 %62
%66 = OpImageQueryLod %28 %65 %67
%68 = OpCompositeExtract %5 %66 0
%69 = OpLoad %5 %25
%70 = OpLoad %5 %26
%73 = OpCompositeConstruct %28 %59 %62
%72 = OpImageSampleImplicitLod %31 %65 %73 None
%74 = OpCompositeExtract %5 %72 0
%75 = OpCompositeExtract %5 %72 1
%76 = OpCompositeExtract %5 %72 2
%77 = OpCompositeExtract %5 %72 3
%78 = OpCompositeConstruct %31 %74 %75 %76 %77
%80 = OpAccessChain %79 %33 %42
OpStore %80 %74
%81 = OpAccessChain %79 %33 %61
OpStore %81 %75
%82 = OpAccessChain %79 %33 %47
OpStore %82 %76
%83 = OpAccessChain %79 %33 %84
OpStore %83 %77
%89 = OpCompositeConstruct %28 %59 %62
%88 = OpImageSampleImplicitLod %31 %65 %89 ConstOffset %91
%92 = OpCompositeExtract %5 %88 0
%93 = OpCompositeExtract %5 %88 1
%94 = OpCompositeExtract %5 %88 2
%95 = OpCompositeExtract %5 %88 3
%96 = OpCompositeConstruct %31 %92 %93 %94 %95
%97 = OpAccessChain %79 %34 %42
OpStore %97 %92
%98 = OpAccessChain %79 %34 %61
OpStore %98 %93
%99 = OpAccessChain %79 %34 %47
OpStore %99 %94
%100 = OpAccessChain %79 %34 %84
OpStore %100 %95
%102 = OpCompositeConstruct %28 %59 %62
%101 = OpImageSampleExplicitLod %31 %65 %102 Lod %68
%103 = OpCompositeExtract %5 %101 0
%104 = OpCompositeExtract %5 %101 1
%105 = OpCompositeExtract %5 %101 2
%106 = OpCompositeExtract %5 %101 3
%107 = OpCompositeConstruct %31 %103 %104 %105 %106
%108 = OpAccessChain %79 %35 %42
OpStore %108 %103
%109 = OpAccessChain %79 %35 %61
OpStore %109 %104
%110 = OpAccessChain %79 %35 %47
OpStore %110 %105
%111 = OpAccessChain %79 %35 %84
OpStore %111 %106
%113 = OpCompositeConstruct %28 %59 %62
%112 = OpImageSampleImplicitLod %31 %65 %113 Bias %69
%114 = OpCompositeExtract %5 %112 0
%115 = OpCompositeExtract %5 %112 1
%116 = OpCompositeExtract %5 %112 2
%117 = OpCompositeExtract %5 %112 3
%118 = OpCompositeConstruct %31 %114 %115 %116 %117
%119 = OpAccessChain %79 %36 %42
OpStore %119 %114
%120 = OpAccessChain %79 %36 %61
OpStore %120 %115
%121 = OpAccessChain %79 %36 %47
OpStore %121 %116
%122 = OpAccessChain %79 %36 %84
OpStore %122 %117
%124 = OpCompositeConstruct %28 %59 %62
%123 = OpImageSampleImplicitLod %31 %65 %124 MinLod %70
%125 = OpCompositeExtract %5 %123 0
%126 = OpCompositeExtract %5 %123 1
%127 = OpCompositeExtract %5 %123 2
%128 = OpCompositeExtract %5 %123 3
%129 = OpCompositeConstruct %31 %125 %126 %127 %128
%130 = OpAccessChain %79 %37 %42
OpStore %130 %125
%131 = OpAccessChain %79 %37 %61
OpStore %131 %126
%132 = OpAccessChain %79 %37 %47
OpStore %132 %127
%133 = OpAccessChain %79 %37 %84
OpStore %133 %128
%135 = OpCompositeConstruct %28 %59 %62
%134 = OpImageSampleImplicitLod %31 %65 %135 Bias|ConstOffset|MinLod %69 %91 %70
%136 = OpCompositeExtract %5 %134 0
%137 = OpCompositeExtract %5 %134 1
%138 = OpCompositeExtract %5 %134 2
%139 = OpCompositeExtract %5 %134 3
%140 = OpCompositeConstruct %31 %136 %137 %138 %139
%141 = OpAccessChain %79 %38 %42
OpStore %141 %136
%142 = OpAccessChain %79 %38 %61
OpStore %142 %137
%143 = OpAccessChain %79 %38 %47
OpStore %143 %138
%144 = OpAccessChain %79 %38 %84
OpStore %144 %139
%145 = OpAccessChain %23 %30 %42
%146 = OpLoad %5 %145
%147 = OpDPdx %5 %146
%148 = OpDPdy %5 %146
%149 = OpAccessChain %23 %30 %61
%150 = OpLoad %5 %149
%151 = OpDPdx %5 %150
%152 = OpDPdy %5 %150
%153 = OpCompositeConstruct %28 %147 %151
%154 = OpCompositeConstruct %28 %148 %152
%156 = OpCompositeConstruct %28 %59 %62
%157 = OpCompositeConstruct %28 %147 %151
%158 = OpCompositeConstruct %28 %148 %152
%155 = OpImageSampleExplicitLod %31 %65 %156 Grad %157 %158
%159 = OpCompositeExtract %5 %155 0
%160 = OpCompositeExtract %5 %155 1
%161 = OpCompositeExtract %5 %155 2
%162 = OpCompositeExtract %5 %155 3
%163 = OpCompositeConstruct %31 %159 %160 %161 %162
%164 = OpAccessChain %79 %39 %42
OpStore %164 %159
%165 = OpAccessChain %79 %39 %61
OpStore %165 %160
%166 = OpAccessChain %79 %39 %47
OpStore %166 %161
%167 = OpAccessChain %79 %39 %84
OpStore %167 %162
%169 = OpCompositeConstruct %28 %59 %62
%170 = OpCompositeConstruct %28 %147 %151
%171 = OpCompositeConstruct %28 %148 %152
%168 = OpImageSampleExplicitLod %31 %65 %169 Grad|ConstOffset %170 %171 %91
%172 = OpCompositeExtract %5 %168 0
%173 = OpCompositeExtract %5 %168 1
%174 = OpCompositeExtract %5 %168 2
%175 = OpCompositeExtract %5 %168 3
%176 = OpCompositeConstruct %31 %172 %173 %174 %175
%177 = OpAccessChain %79 %40 %42
OpStore %177 %172
%178 = OpAccessChain %79 %40 %61
OpStore %178 %173
%179 = OpAccessChain %79 %40 %47
OpStore %179 %174
%180 = OpAccessChain %79 %40 %84
OpStore %180 %175
OpReturn
OpFunctionEnd

