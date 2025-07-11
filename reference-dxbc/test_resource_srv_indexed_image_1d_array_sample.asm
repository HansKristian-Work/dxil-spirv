SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 165
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
OpDecorate %60 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 1 0 1 Unknown
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
%59 = OpTypeSampledImage %6
%61 = OpTypeVector %5 2
%66 = OpConstant %5 0
%74 = OpTypePointer Output %5
%77 = OpConstant %10 1
%80 = OpConstant %10 3
%81 = OpTypeInt 32 1
%82 = OpConstant %81 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %163
%163 = OpLabel
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
%58 = OpLoad %5 %27
%60 = OpSampledImage %59 %52 %55
%62 = OpImageQueryLod %61 %60 %57
%63 = OpCompositeExtract %5 %62 0
%64 = OpLoad %5 %25
%65 = OpLoad %5 %26
%68 = OpCompositeConstruct %61 %57 %58
%67 = OpImageSampleImplicitLod %29 %60 %68 None
%69 = OpCompositeExtract %5 %67 0
%70 = OpCompositeExtract %5 %67 1
%71 = OpCompositeExtract %5 %67 2
%72 = OpCompositeExtract %5 %67 3
%75 = OpAccessChain %74 %31 %40
OpStore %75 %69
%76 = OpAccessChain %74 %31 %77
OpStore %76 %70
%78 = OpAccessChain %74 %31 %45
OpStore %78 %71
%79 = OpAccessChain %74 %31 %80
OpStore %79 %72
%84 = OpCompositeConstruct %61 %57 %58
%83 = OpImageSampleImplicitLod %29 %60 %84 ConstOffset %82
%85 = OpCompositeExtract %5 %83 0
%86 = OpCompositeExtract %5 %83 1
%87 = OpCompositeExtract %5 %83 2
%88 = OpCompositeExtract %5 %83 3
%90 = OpAccessChain %74 %32 %40
OpStore %90 %85
%91 = OpAccessChain %74 %32 %77
OpStore %91 %86
%92 = OpAccessChain %74 %32 %45
OpStore %92 %87
%93 = OpAccessChain %74 %32 %80
OpStore %93 %88
%95 = OpCompositeConstruct %61 %57 %58
%94 = OpImageSampleExplicitLod %29 %60 %95 Lod %63
%96 = OpCompositeExtract %5 %94 0
%97 = OpCompositeExtract %5 %94 1
%98 = OpCompositeExtract %5 %94 2
%99 = OpCompositeExtract %5 %94 3
%101 = OpAccessChain %74 %33 %40
OpStore %101 %96
%102 = OpAccessChain %74 %33 %77
OpStore %102 %97
%103 = OpAccessChain %74 %33 %45
OpStore %103 %98
%104 = OpAccessChain %74 %33 %80
OpStore %104 %99
%106 = OpCompositeConstruct %61 %57 %58
%105 = OpImageSampleImplicitLod %29 %60 %106 Bias %64
%107 = OpCompositeExtract %5 %105 0
%108 = OpCompositeExtract %5 %105 1
%109 = OpCompositeExtract %5 %105 2
%110 = OpCompositeExtract %5 %105 3
%112 = OpAccessChain %74 %34 %40
OpStore %112 %107
%113 = OpAccessChain %74 %34 %77
OpStore %113 %108
%114 = OpAccessChain %74 %34 %45
OpStore %114 %109
%115 = OpAccessChain %74 %34 %80
OpStore %115 %110
%117 = OpCompositeConstruct %61 %57 %58
%116 = OpImageSampleImplicitLod %29 %60 %117 MinLod %65
%118 = OpCompositeExtract %5 %116 0
%119 = OpCompositeExtract %5 %116 1
%120 = OpCompositeExtract %5 %116 2
%121 = OpCompositeExtract %5 %116 3
%123 = OpAccessChain %74 %35 %40
OpStore %123 %118
%124 = OpAccessChain %74 %35 %77
OpStore %124 %119
%125 = OpAccessChain %74 %35 %45
OpStore %125 %120
%126 = OpAccessChain %74 %35 %80
OpStore %126 %121
%128 = OpCompositeConstruct %61 %57 %58
%127 = OpImageSampleImplicitLod %29 %60 %128 Bias|ConstOffset|MinLod %64 %82 %65
%129 = OpCompositeExtract %5 %127 0
%130 = OpCompositeExtract %5 %127 1
%131 = OpCompositeExtract %5 %127 2
%132 = OpCompositeExtract %5 %127 3
%134 = OpAccessChain %74 %36 %40
OpStore %134 %129
%135 = OpAccessChain %74 %36 %77
OpStore %135 %130
%136 = OpAccessChain %74 %36 %45
OpStore %136 %131
%137 = OpAccessChain %74 %36 %80
OpStore %137 %132
%138 = OpLoad %5 %28
%139 = OpDPdx %5 %138
%140 = OpDPdy %5 %138
%142 = OpCompositeConstruct %61 %57 %58
%141 = OpImageSampleExplicitLod %29 %60 %142 Grad %139 %140
%143 = OpCompositeExtract %5 %141 0
%144 = OpCompositeExtract %5 %141 1
%145 = OpCompositeExtract %5 %141 2
%146 = OpCompositeExtract %5 %141 3
%148 = OpAccessChain %74 %37 %40
OpStore %148 %143
%149 = OpAccessChain %74 %37 %77
OpStore %149 %144
%150 = OpAccessChain %74 %37 %45
OpStore %150 %145
%151 = OpAccessChain %74 %37 %80
OpStore %151 %146
%153 = OpCompositeConstruct %61 %57 %58
%152 = OpImageSampleExplicitLod %29 %60 %153 Grad|ConstOffset %139 %140 %82
%154 = OpCompositeExtract %5 %152 0
%155 = OpCompositeExtract %5 %152 1
%156 = OpCompositeExtract %5 %152 2
%157 = OpCompositeExtract %5 %152 3
%159 = OpAccessChain %74 %38 %40
OpStore %159 %154
%160 = OpAccessChain %74 %38 %77
OpStore %160 %155
%161 = OpAccessChain %74 %38 %45
OpStore %161 %156
%162 = OpAccessChain %74 %38 %80
OpStore %162 %157
OpReturn
OpFunctionEnd

