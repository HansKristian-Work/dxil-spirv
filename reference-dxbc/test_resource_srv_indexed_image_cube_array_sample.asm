SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 146
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability MinLod
OpCapability SampledCubeArray
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %26 %27 %28 %31 %32 %33 %34 %35
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
OpDecorate %46 NonUniform
OpDecorate %49 NonUniform
OpDecorate %52 NonUniform
OpDecorate %63 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 1 0 1 Unknown
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
%37 = OpConstant %10 0
%38 = OpConstant %10 16
%42 = OpConstant %10 2
%43 = OpTypePointer Uniform %5
%47 = OpTypePointer UniformConstant %6
%50 = OpTypePointer UniformConstant %16
%56 = OpConstant %10 1
%62 = OpTypeSampledImage %6
%64 = OpTypeVector %5 2
%70 = OpConstant %5 0
%78 = OpTypePointer Output %5
%83 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %144
%144 = OpLabel
%36 = OpIMul %10 %37 %38
%39 = OpIMul %10 %37 %11
%40 = OpIAdd %10 %36 %39
%41 = OpShiftRightLogical %10 %40 %42
%44 = OpAccessChain %43 %15 %37 %41
%45 = OpLoad %5 %44
%46 = OpBitcast %10 %45
%48 = OpAccessChain %47 %9 %46
%49 = OpLoad %6 %48
%51 = OpAccessChain %50 %19 %46
%52 = OpLoad %16 %51
%53 = OpAccessChain %23 %22 %37
%54 = OpLoad %5 %53
%55 = OpAccessChain %23 %22 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %23 %22 %42
%59 = OpLoad %5 %58
%61 = OpLoad %5 %27
%63 = OpSampledImage %62 %49 %52
%66 = OpCompositeConstruct %20 %54 %57 %59
%65 = OpImageQueryLod %64 %63 %66
%67 = OpCompositeExtract %5 %65 0
%68 = OpLoad %5 %25
%69 = OpLoad %5 %26
%72 = OpCompositeConstruct %29 %54 %57 %59 %61
%71 = OpImageSampleImplicitLod %29 %63 %72 None
%73 = OpCompositeExtract %5 %71 0
%74 = OpCompositeExtract %5 %71 1
%75 = OpCompositeExtract %5 %71 2
%76 = OpCompositeExtract %5 %71 3
%79 = OpAccessChain %78 %31 %37
OpStore %79 %73
%80 = OpAccessChain %78 %31 %56
OpStore %80 %74
%81 = OpAccessChain %78 %31 %42
OpStore %81 %75
%82 = OpAccessChain %78 %31 %83
OpStore %82 %76
%85 = OpCompositeConstruct %29 %54 %57 %59 %61
%84 = OpImageSampleExplicitLod %29 %63 %85 Lod %67
%86 = OpCompositeExtract %5 %84 0
%87 = OpCompositeExtract %5 %84 1
%88 = OpCompositeExtract %5 %84 2
%89 = OpCompositeExtract %5 %84 3
%91 = OpAccessChain %78 %32 %37
OpStore %91 %86
%92 = OpAccessChain %78 %32 %56
OpStore %92 %87
%93 = OpAccessChain %78 %32 %42
OpStore %93 %88
%94 = OpAccessChain %78 %32 %83
OpStore %94 %89
%96 = OpCompositeConstruct %29 %54 %57 %59 %61
%95 = OpImageSampleImplicitLod %29 %63 %96 Bias %68
%97 = OpCompositeExtract %5 %95 0
%98 = OpCompositeExtract %5 %95 1
%99 = OpCompositeExtract %5 %95 2
%100 = OpCompositeExtract %5 %95 3
%102 = OpAccessChain %78 %33 %37
OpStore %102 %97
%103 = OpAccessChain %78 %33 %56
OpStore %103 %98
%104 = OpAccessChain %78 %33 %42
OpStore %104 %99
%105 = OpAccessChain %78 %33 %83
OpStore %105 %100
%107 = OpCompositeConstruct %29 %54 %57 %59 %61
%106 = OpImageSampleImplicitLod %29 %63 %107 MinLod %69
%108 = OpCompositeExtract %5 %106 0
%109 = OpCompositeExtract %5 %106 1
%110 = OpCompositeExtract %5 %106 2
%111 = OpCompositeExtract %5 %106 3
%113 = OpAccessChain %78 %34 %37
OpStore %113 %108
%114 = OpAccessChain %78 %34 %56
OpStore %114 %109
%115 = OpAccessChain %78 %34 %42
OpStore %115 %110
%116 = OpAccessChain %78 %34 %83
OpStore %116 %111
%117 = OpAccessChain %23 %28 %37
%118 = OpLoad %5 %117
%119 = OpDPdx %5 %118
%120 = OpDPdy %5 %118
%121 = OpAccessChain %23 %28 %56
%122 = OpLoad %5 %121
%123 = OpDPdx %5 %122
%124 = OpDPdy %5 %122
%125 = OpAccessChain %23 %28 %42
%126 = OpLoad %5 %125
%127 = OpDPdx %5 %126
%128 = OpDPdy %5 %126
%132 = OpCompositeConstruct %29 %54 %57 %59 %61
%133 = OpCompositeConstruct %20 %119 %123 %127
%134 = OpCompositeConstruct %20 %120 %124 %128
%131 = OpImageSampleExplicitLod %29 %63 %132 Grad %133 %134
%135 = OpCompositeExtract %5 %131 0
%136 = OpCompositeExtract %5 %131 1
%137 = OpCompositeExtract %5 %131 2
%138 = OpCompositeExtract %5 %131 3
%140 = OpAccessChain %78 %35 %37
OpStore %140 %135
%141 = OpAccessChain %78 %35 %56
OpStore %141 %136
%142 = OpAccessChain %78 %35 %42
OpStore %142 %137
%143 = OpAccessChain %78 %35 %83
OpStore %143 %138
OpReturn
OpFunctionEnd

