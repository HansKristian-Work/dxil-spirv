SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 149
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %29 %32 %33 %34 %35 %36 %37
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %22 "TEXCOORD"
OpName %24 "DEPTH_REF"
OpName %25 "LAYER"
OpName %29 "OFFSET"
OpName %32 "SV_TARGET"
OpName %33 "SV_TARGET_1"
OpName %34 "SV_TARGET_2"
OpName %35 "SV_TARGET_3"
OpName %36 "SV_TARGET_4"
OpName %37 "SV_TARGET_5"
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
OpDecorate %29 Flat
OpDecorate %29 Location 2
OpDecorate %32 Location 0
OpDecorate %33 Location 1
OpDecorate %34 Location 2
OpDecorate %35 Location 3
OpDecorate %36 Location 4
OpDecorate %37 Location 5
OpDecorate %48 NonUniform
OpDecorate %51 NonUniform
OpDecorate %54 NonUniform
OpDecorate %72 NonUniform
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
%26 = OpTypeInt 32 1
%27 = OpTypeVector %26 2
%28 = OpTypePointer Input %27
%29 = OpVariable %28 Input
%30 = OpTypeVector %5 4
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%33 = OpVariable %31 Output
%34 = OpVariable %31 Output
%35 = OpVariable %31 Output
%36 = OpVariable %31 Output
%37 = OpVariable %31 Output
%39 = OpConstant %10 0
%40 = OpConstant %10 16
%44 = OpConstant %10 2
%45 = OpTypePointer Uniform %5
%49 = OpTypePointer UniformConstant %6
%52 = OpTypePointer UniformConstant %16
%58 = OpConstant %10 1
%60 = OpTypeVector %5 2
%62 = OpTypePointer Input %26
%69 = OpTypeVector %10 2
%71 = OpTypeSampledImage %6
%80 = OpTypePointer Output %5
%85 = OpConstant %10 3
%87 = OpConstant %26 -1
%88 = OpConstant %26 0
%90 = OpConstantComposite %27 %87 %88
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %147
%147 = OpLabel
%38 = OpIMul %10 %39 %40
%41 = OpIMul %10 %39 %11
%42 = OpIAdd %10 %38 %41
%43 = OpShiftRightLogical %10 %42 %44
%46 = OpAccessChain %45 %15 %39 %43
%47 = OpLoad %5 %46
%48 = OpBitcast %10 %47
%50 = OpAccessChain %49 %9 %48
%51 = OpLoad %6 %50
%53 = OpAccessChain %52 %19 %48
%54 = OpLoad %16 %53
%55 = OpAccessChain %23 %22 %39
%56 = OpLoad %5 %55
%57 = OpAccessChain %23 %22 %58
%59 = OpLoad %5 %57
%63 = OpAccessChain %62 %29 %39
%64 = OpLoad %26 %63
%65 = OpBitcast %10 %64
%66 = OpAccessChain %62 %29 %58
%67 = OpLoad %26 %66
%68 = OpBitcast %10 %67
%72 = OpSampledImage %71 %51 %54
%73 = OpCompositeConstruct %60 %56 %59
%74 = OpImageGather %30 %72 %73 %39
%75 = OpCompositeExtract %5 %74 0
%76 = OpCompositeExtract %5 %74 1
%77 = OpCompositeExtract %5 %74 2
%78 = OpCompositeExtract %5 %74 3
%81 = OpAccessChain %80 %32 %39
OpStore %81 %75
%82 = OpAccessChain %80 %32 %58
OpStore %82 %76
%83 = OpAccessChain %80 %32 %44
OpStore %83 %77
%84 = OpAccessChain %80 %32 %85
OpStore %84 %78
%86 = OpCompositeConstruct %60 %56 %59
%89 = OpImageGather %30 %72 %86 %39 ConstOffset %90
%91 = OpCompositeExtract %5 %89 0
%92 = OpCompositeExtract %5 %89 1
%93 = OpCompositeExtract %5 %89 2
%94 = OpCompositeExtract %5 %89 3
%96 = OpAccessChain %80 %33 %39
OpStore %96 %91
%97 = OpAccessChain %80 %33 %58
OpStore %97 %92
%98 = OpAccessChain %80 %33 %44
OpStore %98 %93
%99 = OpAccessChain %80 %33 %85
OpStore %99 %94
%100 = OpCompositeConstruct %60 %56 %59
%101 = OpImageGather %30 %72 %100 %58
%102 = OpCompositeExtract %5 %101 0
%103 = OpCompositeExtract %5 %101 1
%104 = OpCompositeExtract %5 %101 2
%105 = OpCompositeExtract %5 %101 3
%107 = OpAccessChain %80 %34 %39
OpStore %107 %102
%108 = OpAccessChain %80 %34 %58
OpStore %108 %103
%109 = OpAccessChain %80 %34 %44
OpStore %109 %104
%110 = OpAccessChain %80 %34 %85
OpStore %110 %105
%111 = OpCompositeConstruct %60 %56 %59
%112 = OpImageGather %30 %72 %111 %44
%113 = OpCompositeExtract %5 %112 0
%114 = OpCompositeExtract %5 %112 1
%115 = OpCompositeExtract %5 %112 2
%116 = OpCompositeExtract %5 %112 3
%118 = OpAccessChain %80 %35 %39
OpStore %118 %113
%119 = OpAccessChain %80 %35 %58
OpStore %119 %114
%120 = OpAccessChain %80 %35 %44
OpStore %120 %115
%121 = OpAccessChain %80 %35 %85
OpStore %121 %116
%122 = OpCompositeConstruct %60 %56 %59
%123 = OpImageGather %30 %72 %122 %85
%124 = OpCompositeExtract %5 %123 0
%125 = OpCompositeExtract %5 %123 1
%126 = OpCompositeExtract %5 %123 2
%127 = OpCompositeExtract %5 %123 3
%129 = OpAccessChain %80 %36 %39
OpStore %129 %124
%130 = OpAccessChain %80 %36 %58
OpStore %130 %125
%131 = OpAccessChain %80 %36 %44
OpStore %131 %126
%132 = OpAccessChain %80 %36 %85
OpStore %132 %127
%133 = OpCompositeConstruct %60 %56 %59
%134 = OpBitcast %26 %65
%135 = OpBitcast %26 %68
%137 = OpCompositeConstruct %27 %134 %135
%136 = OpImageGather %30 %72 %133 %39 Offset %137
%138 = OpCompositeExtract %5 %136 0
%139 = OpCompositeExtract %5 %136 1
%140 = OpCompositeExtract %5 %136 2
%141 = OpCompositeExtract %5 %136 3
%143 = OpAccessChain %80 %37 %39
OpStore %143 %138
%144 = OpAccessChain %80 %37 %58
OpStore %144 %139
%145 = OpAccessChain %80 %37 %44
OpStore %145 %140
%146 = OpAccessChain %80 %37 %85
OpStore %146 %141
OpReturn
OpFunctionEnd

