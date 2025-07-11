SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 184
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
OpDecorate %66 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 0 1 Unknown
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
%65 = OpTypeSampledImage %6
%72 = OpConstant %5 0
%80 = OpTypePointer Output %5
%85 = OpConstant %10 3
%86 = OpTypeInt 32 1
%87 = OpConstant %86 -1
%88 = OpConstant %86 0
%91 = OpTypeVector %86 2
%92 = OpConstantComposite %91 %87 %88
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %182
%182 = OpLabel
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
%64 = OpLoad %5 %27
%66 = OpSampledImage %65 %54 %57
%68 = OpCompositeConstruct %28 %59 %62
%67 = OpImageQueryLod %28 %66 %68
%69 = OpCompositeExtract %5 %67 0
%70 = OpLoad %5 %25
%71 = OpLoad %5 %26
%74 = OpCompositeConstruct %20 %59 %62 %64
%73 = OpImageSampleImplicitLod %31 %66 %74 None
%75 = OpCompositeExtract %5 %73 0
%76 = OpCompositeExtract %5 %73 1
%77 = OpCompositeExtract %5 %73 2
%78 = OpCompositeExtract %5 %73 3
%81 = OpAccessChain %80 %33 %42
OpStore %81 %75
%82 = OpAccessChain %80 %33 %61
OpStore %82 %76
%83 = OpAccessChain %80 %33 %47
OpStore %83 %77
%84 = OpAccessChain %80 %33 %85
OpStore %84 %78
%90 = OpCompositeConstruct %20 %59 %62 %64
%89 = OpImageSampleImplicitLod %31 %66 %90 ConstOffset %92
%93 = OpCompositeExtract %5 %89 0
%94 = OpCompositeExtract %5 %89 1
%95 = OpCompositeExtract %5 %89 2
%96 = OpCompositeExtract %5 %89 3
%98 = OpAccessChain %80 %34 %42
OpStore %98 %93
%99 = OpAccessChain %80 %34 %61
OpStore %99 %94
%100 = OpAccessChain %80 %34 %47
OpStore %100 %95
%101 = OpAccessChain %80 %34 %85
OpStore %101 %96
%103 = OpCompositeConstruct %20 %59 %62 %64
%102 = OpImageSampleExplicitLod %31 %66 %103 Lod %69
%104 = OpCompositeExtract %5 %102 0
%105 = OpCompositeExtract %5 %102 1
%106 = OpCompositeExtract %5 %102 2
%107 = OpCompositeExtract %5 %102 3
%109 = OpAccessChain %80 %35 %42
OpStore %109 %104
%110 = OpAccessChain %80 %35 %61
OpStore %110 %105
%111 = OpAccessChain %80 %35 %47
OpStore %111 %106
%112 = OpAccessChain %80 %35 %85
OpStore %112 %107
%114 = OpCompositeConstruct %20 %59 %62 %64
%113 = OpImageSampleImplicitLod %31 %66 %114 Bias %70
%115 = OpCompositeExtract %5 %113 0
%116 = OpCompositeExtract %5 %113 1
%117 = OpCompositeExtract %5 %113 2
%118 = OpCompositeExtract %5 %113 3
%120 = OpAccessChain %80 %36 %42
OpStore %120 %115
%121 = OpAccessChain %80 %36 %61
OpStore %121 %116
%122 = OpAccessChain %80 %36 %47
OpStore %122 %117
%123 = OpAccessChain %80 %36 %85
OpStore %123 %118
%125 = OpCompositeConstruct %20 %59 %62 %64
%124 = OpImageSampleImplicitLod %31 %66 %125 MinLod %71
%126 = OpCompositeExtract %5 %124 0
%127 = OpCompositeExtract %5 %124 1
%128 = OpCompositeExtract %5 %124 2
%129 = OpCompositeExtract %5 %124 3
%131 = OpAccessChain %80 %37 %42
OpStore %131 %126
%132 = OpAccessChain %80 %37 %61
OpStore %132 %127
%133 = OpAccessChain %80 %37 %47
OpStore %133 %128
%134 = OpAccessChain %80 %37 %85
OpStore %134 %129
%136 = OpCompositeConstruct %20 %59 %62 %64
%135 = OpImageSampleImplicitLod %31 %66 %136 Bias|ConstOffset|MinLod %70 %92 %71
%137 = OpCompositeExtract %5 %135 0
%138 = OpCompositeExtract %5 %135 1
%139 = OpCompositeExtract %5 %135 2
%140 = OpCompositeExtract %5 %135 3
%142 = OpAccessChain %80 %38 %42
OpStore %142 %137
%143 = OpAccessChain %80 %38 %61
OpStore %143 %138
%144 = OpAccessChain %80 %38 %47
OpStore %144 %139
%145 = OpAccessChain %80 %38 %85
OpStore %145 %140
%146 = OpAccessChain %23 %30 %42
%147 = OpLoad %5 %146
%148 = OpDPdx %5 %147
%149 = OpDPdy %5 %147
%150 = OpAccessChain %23 %30 %61
%151 = OpLoad %5 %150
%152 = OpDPdx %5 %151
%153 = OpDPdy %5 %151
%157 = OpCompositeConstruct %20 %59 %62 %64
%158 = OpCompositeConstruct %28 %148 %152
%159 = OpCompositeConstruct %28 %149 %153
%156 = OpImageSampleExplicitLod %31 %66 %157 Grad %158 %159
%160 = OpCompositeExtract %5 %156 0
%161 = OpCompositeExtract %5 %156 1
%162 = OpCompositeExtract %5 %156 2
%163 = OpCompositeExtract %5 %156 3
%165 = OpAccessChain %80 %39 %42
OpStore %165 %160
%166 = OpAccessChain %80 %39 %61
OpStore %166 %161
%167 = OpAccessChain %80 %39 %47
OpStore %167 %162
%168 = OpAccessChain %80 %39 %85
OpStore %168 %163
%170 = OpCompositeConstruct %20 %59 %62 %64
%171 = OpCompositeConstruct %28 %148 %152
%172 = OpCompositeConstruct %28 %149 %153
%169 = OpImageSampleExplicitLod %31 %66 %170 Grad|ConstOffset %171 %172 %92
%173 = OpCompositeExtract %5 %169 0
%174 = OpCompositeExtract %5 %169 1
%175 = OpCompositeExtract %5 %169 2
%176 = OpCompositeExtract %5 %169 3
%178 = OpAccessChain %80 %40 %42
OpStore %178 %173
%179 = OpAccessChain %80 %40 %61
OpStore %179 %174
%180 = OpAccessChain %80 %40 %47
OpStore %180 %175
%181 = OpAccessChain %80 %40 %85
OpStore %181 %176
OpReturn
OpFunctionEnd

