SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 189
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
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %26 %27 %28 %31 %32 %33 %34 %35 %36 %37 %38
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %22 "TEXCOORD"
OpName %24 "DEPTH_REF"
OpName %25 "LOD_BIAS"
OpName %26 "LOD_CLAMP"
OpName %27 "LAYER"
OpName %28 "TEXCOORD_2"
OpName %31 "SV_TARGET"
OpName %32 "SV_TARGET_1"
OpName %33 "SV_TARGET_2"
OpName %34 "SV_TARGET_3"
OpName %35 "SV_TARGET_4"
OpName %36 "SV_TARGET_5"
OpName %37 "SV_TARGET_6"
OpName %38 "SV_TARGET_7"
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
OpDecorate %28 Location 2
OpDecorate %31 Location 0
OpDecorate %32 Location 1
OpDecorate %33 Location 2
OpDecorate %34 Location 3
OpDecorate %35 Location 4
OpDecorate %36 Location 5
OpDecorate %37 Location 6
OpDecorate %38 Location 7
OpDecorate %49 NonUniform
OpDecorate %52 NonUniform
OpDecorate %55 NonUniform
OpDecorate %65 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
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
%28 = OpVariable %21 Input
%29 = OpTypeVector %5 4
%30 = OpTypePointer Output %29
%31 = OpVariable %30 Output
%32 = OpVariable %30 Output
%33 = OpVariable %30 Output
%34 = OpVariable %30 Output
%35 = OpVariable %30 Output
%36 = OpVariable %30 Output
%37 = OpVariable %30 Output
%38 = OpVariable %30 Output
%40 = OpConstant %10 0
%41 = OpConstant %10 16
%45 = OpConstant %10 2
%46 = OpTypePointer Uniform %5
%50 = OpTypePointer UniformConstant %6
%53 = OpTypePointer UniformConstant %16
%59 = OpConstant %10 1
%64 = OpTypeSampledImage %6
%66 = OpTypeVector %5 2
%72 = OpConstant %5 0
%80 = OpTypePointer Output %5
%85 = OpConstant %10 3
%86 = OpTypeInt 32 1
%87 = OpConstant %86 -1
%88 = OpConstant %86 0
%89 = OpConstant %86 1
%92 = OpTypeVector %86 3
%93 = OpConstantComposite %92 %87 %88 %89
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %187
%187 = OpLabel
%39 = OpIMul %10 %40 %41
%42 = OpIMul %10 %40 %11
%43 = OpIAdd %10 %39 %42
%44 = OpShiftRightLogical %10 %43 %45
%47 = OpAccessChain %46 %15 %40 %44
%48 = OpLoad %5 %47
%49 = OpBitcast %10 %48
%51 = OpAccessChain %50 %9 %49
%52 = OpLoad %6 %51
%54 = OpAccessChain %53 %19 %49
%55 = OpLoad %16 %54
%56 = OpAccessChain %23 %22 %40
%57 = OpLoad %5 %56
%58 = OpAccessChain %23 %22 %59
%60 = OpLoad %5 %58
%61 = OpAccessChain %23 %22 %45
%62 = OpLoad %5 %61
%65 = OpSampledImage %64 %52 %55
%68 = OpCompositeConstruct %20 %57 %60 %62
%67 = OpImageQueryLod %66 %65 %68
%69 = OpCompositeExtract %5 %67 0
%70 = OpLoad %5 %25
%71 = OpLoad %5 %26
%74 = OpCompositeConstruct %20 %57 %60 %62
%73 = OpImageSampleImplicitLod %29 %65 %74 None
%75 = OpCompositeExtract %5 %73 0
%76 = OpCompositeExtract %5 %73 1
%77 = OpCompositeExtract %5 %73 2
%78 = OpCompositeExtract %5 %73 3
%81 = OpAccessChain %80 %31 %40
OpStore %81 %75
%82 = OpAccessChain %80 %31 %59
OpStore %82 %76
%83 = OpAccessChain %80 %31 %45
OpStore %83 %77
%84 = OpAccessChain %80 %31 %85
OpStore %84 %78
%91 = OpCompositeConstruct %20 %57 %60 %62
%90 = OpImageSampleImplicitLod %29 %65 %91 ConstOffset %93
%94 = OpCompositeExtract %5 %90 0
%95 = OpCompositeExtract %5 %90 1
%96 = OpCompositeExtract %5 %90 2
%97 = OpCompositeExtract %5 %90 3
%99 = OpAccessChain %80 %32 %40
OpStore %99 %94
%100 = OpAccessChain %80 %32 %59
OpStore %100 %95
%101 = OpAccessChain %80 %32 %45
OpStore %101 %96
%102 = OpAccessChain %80 %32 %85
OpStore %102 %97
%104 = OpCompositeConstruct %20 %57 %60 %62
%103 = OpImageSampleExplicitLod %29 %65 %104 Lod %69
%105 = OpCompositeExtract %5 %103 0
%106 = OpCompositeExtract %5 %103 1
%107 = OpCompositeExtract %5 %103 2
%108 = OpCompositeExtract %5 %103 3
%110 = OpAccessChain %80 %33 %40
OpStore %110 %105
%111 = OpAccessChain %80 %33 %59
OpStore %111 %106
%112 = OpAccessChain %80 %33 %45
OpStore %112 %107
%113 = OpAccessChain %80 %33 %85
OpStore %113 %108
%115 = OpCompositeConstruct %20 %57 %60 %62
%114 = OpImageSampleImplicitLod %29 %65 %115 Bias %70
%116 = OpCompositeExtract %5 %114 0
%117 = OpCompositeExtract %5 %114 1
%118 = OpCompositeExtract %5 %114 2
%119 = OpCompositeExtract %5 %114 3
%121 = OpAccessChain %80 %34 %40
OpStore %121 %116
%122 = OpAccessChain %80 %34 %59
OpStore %122 %117
%123 = OpAccessChain %80 %34 %45
OpStore %123 %118
%124 = OpAccessChain %80 %34 %85
OpStore %124 %119
%126 = OpCompositeConstruct %20 %57 %60 %62
%125 = OpImageSampleImplicitLod %29 %65 %126 MinLod %71
%127 = OpCompositeExtract %5 %125 0
%128 = OpCompositeExtract %5 %125 1
%129 = OpCompositeExtract %5 %125 2
%130 = OpCompositeExtract %5 %125 3
%132 = OpAccessChain %80 %35 %40
OpStore %132 %127
%133 = OpAccessChain %80 %35 %59
OpStore %133 %128
%134 = OpAccessChain %80 %35 %45
OpStore %134 %129
%135 = OpAccessChain %80 %35 %85
OpStore %135 %130
%137 = OpCompositeConstruct %20 %57 %60 %62
%136 = OpImageSampleImplicitLod %29 %65 %137 Bias|ConstOffset|MinLod %70 %93 %71
%138 = OpCompositeExtract %5 %136 0
%139 = OpCompositeExtract %5 %136 1
%140 = OpCompositeExtract %5 %136 2
%141 = OpCompositeExtract %5 %136 3
%143 = OpAccessChain %80 %36 %40
OpStore %143 %138
%144 = OpAccessChain %80 %36 %59
OpStore %144 %139
%145 = OpAccessChain %80 %36 %45
OpStore %145 %140
%146 = OpAccessChain %80 %36 %85
OpStore %146 %141
%147 = OpAccessChain %23 %28 %40
%148 = OpLoad %5 %147
%149 = OpDPdx %5 %148
%150 = OpDPdy %5 %148
%151 = OpAccessChain %23 %28 %59
%152 = OpLoad %5 %151
%153 = OpDPdx %5 %152
%154 = OpDPdy %5 %152
%155 = OpAccessChain %23 %28 %45
%156 = OpLoad %5 %155
%157 = OpDPdx %5 %156
%158 = OpDPdy %5 %156
%162 = OpCompositeConstruct %20 %57 %60 %62
%163 = OpCompositeConstruct %20 %149 %153 %157
%164 = OpCompositeConstruct %20 %150 %154 %158
%161 = OpImageSampleExplicitLod %29 %65 %162 Grad %163 %164
%165 = OpCompositeExtract %5 %161 0
%166 = OpCompositeExtract %5 %161 1
%167 = OpCompositeExtract %5 %161 2
%168 = OpCompositeExtract %5 %161 3
%170 = OpAccessChain %80 %37 %40
OpStore %170 %165
%171 = OpAccessChain %80 %37 %59
OpStore %171 %166
%172 = OpAccessChain %80 %37 %45
OpStore %172 %167
%173 = OpAccessChain %80 %37 %85
OpStore %173 %168
%175 = OpCompositeConstruct %20 %57 %60 %62
%176 = OpCompositeConstruct %20 %149 %153 %157
%177 = OpCompositeConstruct %20 %150 %154 %158
%174 = OpImageSampleExplicitLod %29 %65 %175 Grad|ConstOffset %176 %177 %93
%178 = OpCompositeExtract %5 %174 0
%179 = OpCompositeExtract %5 %174 1
%180 = OpCompositeExtract %5 %174 2
%181 = OpCompositeExtract %5 %174 3
%183 = OpAccessChain %80 %38 %40
OpStore %183 %178
%184 = OpAccessChain %80 %38 %59
OpStore %184 %179
%185 = OpAccessChain %80 %38 %45
OpStore %185 %180
%186 = OpAccessChain %80 %38 %85
OpStore %186 %181
OpReturn
OpFunctionEnd

