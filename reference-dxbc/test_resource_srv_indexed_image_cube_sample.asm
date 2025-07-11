SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 145
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
OpDecorate %62 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 0 0 1 Unknown
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
%61 = OpTypeSampledImage %6
%63 = OpTypeVector %5 2
%69 = OpConstant %5 0
%77 = OpTypePointer Output %5
%82 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %143
%143 = OpLabel
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
%62 = OpSampledImage %61 %49 %52
%65 = OpCompositeConstruct %20 %54 %57 %59
%64 = OpImageQueryLod %63 %62 %65
%66 = OpCompositeExtract %5 %64 0
%67 = OpLoad %5 %25
%68 = OpLoad %5 %26
%71 = OpCompositeConstruct %20 %54 %57 %59
%70 = OpImageSampleImplicitLod %29 %62 %71 None
%72 = OpCompositeExtract %5 %70 0
%73 = OpCompositeExtract %5 %70 1
%74 = OpCompositeExtract %5 %70 2
%75 = OpCompositeExtract %5 %70 3
%78 = OpAccessChain %77 %31 %37
OpStore %78 %72
%79 = OpAccessChain %77 %31 %56
OpStore %79 %73
%80 = OpAccessChain %77 %31 %42
OpStore %80 %74
%81 = OpAccessChain %77 %31 %82
OpStore %81 %75
%84 = OpCompositeConstruct %20 %54 %57 %59
%83 = OpImageSampleExplicitLod %29 %62 %84 Lod %66
%85 = OpCompositeExtract %5 %83 0
%86 = OpCompositeExtract %5 %83 1
%87 = OpCompositeExtract %5 %83 2
%88 = OpCompositeExtract %5 %83 3
%90 = OpAccessChain %77 %32 %37
OpStore %90 %85
%91 = OpAccessChain %77 %32 %56
OpStore %91 %86
%92 = OpAccessChain %77 %32 %42
OpStore %92 %87
%93 = OpAccessChain %77 %32 %82
OpStore %93 %88
%95 = OpCompositeConstruct %20 %54 %57 %59
%94 = OpImageSampleImplicitLod %29 %62 %95 Bias %67
%96 = OpCompositeExtract %5 %94 0
%97 = OpCompositeExtract %5 %94 1
%98 = OpCompositeExtract %5 %94 2
%99 = OpCompositeExtract %5 %94 3
%101 = OpAccessChain %77 %33 %37
OpStore %101 %96
%102 = OpAccessChain %77 %33 %56
OpStore %102 %97
%103 = OpAccessChain %77 %33 %42
OpStore %103 %98
%104 = OpAccessChain %77 %33 %82
OpStore %104 %99
%106 = OpCompositeConstruct %20 %54 %57 %59
%105 = OpImageSampleImplicitLod %29 %62 %106 MinLod %68
%107 = OpCompositeExtract %5 %105 0
%108 = OpCompositeExtract %5 %105 1
%109 = OpCompositeExtract %5 %105 2
%110 = OpCompositeExtract %5 %105 3
%112 = OpAccessChain %77 %34 %37
OpStore %112 %107
%113 = OpAccessChain %77 %34 %56
OpStore %113 %108
%114 = OpAccessChain %77 %34 %42
OpStore %114 %109
%115 = OpAccessChain %77 %34 %82
OpStore %115 %110
%116 = OpAccessChain %23 %28 %37
%117 = OpLoad %5 %116
%118 = OpDPdx %5 %117
%119 = OpDPdy %5 %117
%120 = OpAccessChain %23 %28 %56
%121 = OpLoad %5 %120
%122 = OpDPdx %5 %121
%123 = OpDPdy %5 %121
%124 = OpAccessChain %23 %28 %42
%125 = OpLoad %5 %124
%126 = OpDPdx %5 %125
%127 = OpDPdy %5 %125
%131 = OpCompositeConstruct %20 %54 %57 %59
%132 = OpCompositeConstruct %20 %118 %122 %126
%133 = OpCompositeConstruct %20 %119 %123 %127
%130 = OpImageSampleExplicitLod %29 %62 %131 Grad %132 %133
%134 = OpCompositeExtract %5 %130 0
%135 = OpCompositeExtract %5 %130 1
%136 = OpCompositeExtract %5 %130 2
%137 = OpCompositeExtract %5 %130 3
%139 = OpAccessChain %77 %35 %37
OpStore %139 %134
%140 = OpAccessChain %77 %35 %56
OpStore %140 %135
%141 = OpAccessChain %77 %35 %42
OpStore %141 %136
%142 = OpAccessChain %77 %35 %82
OpStore %142 %137
OpReturn
OpFunctionEnd

