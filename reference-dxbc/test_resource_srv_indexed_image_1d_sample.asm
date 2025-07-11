SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 156
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability MinLod
OpCapability Sampled1D
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
OpDecorate %59 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
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
%28 = OpVariable %23 Input
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
%58 = OpTypeSampledImage %6
%60 = OpTypeVector %5 2
%65 = OpConstant %5 0
%72 = OpTypePointer Output %5
%75 = OpConstant %10 1
%78 = OpConstant %10 3
%79 = OpTypeInt 32 1
%80 = OpConstant %79 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %154
%154 = OpLabel
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
%59 = OpSampledImage %58 %52 %55
%61 = OpImageQueryLod %60 %59 %57
%62 = OpCompositeExtract %5 %61 0
%63 = OpLoad %5 %25
%64 = OpLoad %5 %26
%66 = OpImageSampleImplicitLod %29 %59 %57 None
%67 = OpCompositeExtract %5 %66 0
%68 = OpCompositeExtract %5 %66 1
%69 = OpCompositeExtract %5 %66 2
%70 = OpCompositeExtract %5 %66 3
%71 = OpCompositeConstruct %29 %67 %68 %69 %70
%73 = OpAccessChain %72 %31 %40
OpStore %73 %67
%74 = OpAccessChain %72 %31 %75
OpStore %74 %68
%76 = OpAccessChain %72 %31 %45
OpStore %76 %69
%77 = OpAccessChain %72 %31 %78
OpStore %77 %70
%81 = OpImageSampleImplicitLod %29 %59 %57 ConstOffset %80
%82 = OpCompositeExtract %5 %81 0
%83 = OpCompositeExtract %5 %81 1
%84 = OpCompositeExtract %5 %81 2
%85 = OpCompositeExtract %5 %81 3
%86 = OpCompositeConstruct %29 %82 %83 %84 %85
%87 = OpAccessChain %72 %32 %40
OpStore %87 %82
%88 = OpAccessChain %72 %32 %75
OpStore %88 %83
%89 = OpAccessChain %72 %32 %45
OpStore %89 %84
%90 = OpAccessChain %72 %32 %78
OpStore %90 %85
%91 = OpImageSampleExplicitLod %29 %59 %57 Lod %62
%92 = OpCompositeExtract %5 %91 0
%93 = OpCompositeExtract %5 %91 1
%94 = OpCompositeExtract %5 %91 2
%95 = OpCompositeExtract %5 %91 3
%96 = OpCompositeConstruct %29 %92 %93 %94 %95
%97 = OpAccessChain %72 %33 %40
OpStore %97 %92
%98 = OpAccessChain %72 %33 %75
OpStore %98 %93
%99 = OpAccessChain %72 %33 %45
OpStore %99 %94
%100 = OpAccessChain %72 %33 %78
OpStore %100 %95
%101 = OpImageSampleImplicitLod %29 %59 %57 Bias %63
%102 = OpCompositeExtract %5 %101 0
%103 = OpCompositeExtract %5 %101 1
%104 = OpCompositeExtract %5 %101 2
%105 = OpCompositeExtract %5 %101 3
%106 = OpCompositeConstruct %29 %102 %103 %104 %105
%107 = OpAccessChain %72 %34 %40
OpStore %107 %102
%108 = OpAccessChain %72 %34 %75
OpStore %108 %103
%109 = OpAccessChain %72 %34 %45
OpStore %109 %104
%110 = OpAccessChain %72 %34 %78
OpStore %110 %105
%111 = OpImageSampleImplicitLod %29 %59 %57 MinLod %64
%112 = OpCompositeExtract %5 %111 0
%113 = OpCompositeExtract %5 %111 1
%114 = OpCompositeExtract %5 %111 2
%115 = OpCompositeExtract %5 %111 3
%116 = OpCompositeConstruct %29 %112 %113 %114 %115
%117 = OpAccessChain %72 %35 %40
OpStore %117 %112
%118 = OpAccessChain %72 %35 %75
OpStore %118 %113
%119 = OpAccessChain %72 %35 %45
OpStore %119 %114
%120 = OpAccessChain %72 %35 %78
OpStore %120 %115
%121 = OpImageSampleImplicitLod %29 %59 %57 Bias|ConstOffset|MinLod %63 %80 %64
%122 = OpCompositeExtract %5 %121 0
%123 = OpCompositeExtract %5 %121 1
%124 = OpCompositeExtract %5 %121 2
%125 = OpCompositeExtract %5 %121 3
%126 = OpCompositeConstruct %29 %122 %123 %124 %125
%127 = OpAccessChain %72 %36 %40
OpStore %127 %122
%128 = OpAccessChain %72 %36 %75
OpStore %128 %123
%129 = OpAccessChain %72 %36 %45
OpStore %129 %124
%130 = OpAccessChain %72 %36 %78
OpStore %130 %125
%131 = OpLoad %5 %28
%132 = OpDPdx %5 %131
%133 = OpDPdy %5 %131
%134 = OpImageSampleExplicitLod %29 %59 %57 Grad %132 %133
%135 = OpCompositeExtract %5 %134 0
%136 = OpCompositeExtract %5 %134 1
%137 = OpCompositeExtract %5 %134 2
%138 = OpCompositeExtract %5 %134 3
%139 = OpCompositeConstruct %29 %135 %136 %137 %138
%140 = OpAccessChain %72 %37 %40
OpStore %140 %135
%141 = OpAccessChain %72 %37 %75
OpStore %141 %136
%142 = OpAccessChain %72 %37 %45
OpStore %142 %137
%143 = OpAccessChain %72 %37 %78
OpStore %143 %138
%144 = OpImageSampleExplicitLod %29 %59 %57 Grad|ConstOffset %132 %133 %80
%145 = OpCompositeExtract %5 %144 0
%146 = OpCompositeExtract %5 %144 1
%147 = OpCompositeExtract %5 %144 2
%148 = OpCompositeExtract %5 %144 3
%149 = OpCompositeConstruct %29 %145 %146 %147 %148
%150 = OpAccessChain %72 %38 %40
OpStore %150 %145
%151 = OpAccessChain %72 %38 %75
OpStore %151 %146
%152 = OpAccessChain %72 %38 %45
OpStore %152 %147
%153 = OpAccessChain %72 %38 %78
OpStore %153 %148
OpReturn
OpFunctionEnd

