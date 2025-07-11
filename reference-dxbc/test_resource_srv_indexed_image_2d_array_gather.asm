SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 150
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
OpDecorate %73 NonUniform
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
%63 = OpTypePointer Input %26
%70 = OpTypeVector %10 2
%72 = OpTypeSampledImage %6
%81 = OpTypePointer Output %5
%86 = OpConstant %10 3
%88 = OpConstant %26 -1
%89 = OpConstant %26 0
%91 = OpConstantComposite %27 %88 %89
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %148
%148 = OpLabel
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
%62 = OpLoad %5 %25
%64 = OpAccessChain %63 %29 %39
%65 = OpLoad %26 %64
%66 = OpBitcast %10 %65
%67 = OpAccessChain %63 %29 %58
%68 = OpLoad %26 %67
%69 = OpBitcast %10 %68
%73 = OpSampledImage %72 %51 %54
%74 = OpCompositeConstruct %20 %56 %59 %62
%75 = OpImageGather %30 %73 %74 %39
%76 = OpCompositeExtract %5 %75 0
%77 = OpCompositeExtract %5 %75 1
%78 = OpCompositeExtract %5 %75 2
%79 = OpCompositeExtract %5 %75 3
%82 = OpAccessChain %81 %32 %39
OpStore %82 %76
%83 = OpAccessChain %81 %32 %58
OpStore %83 %77
%84 = OpAccessChain %81 %32 %44
OpStore %84 %78
%85 = OpAccessChain %81 %32 %86
OpStore %85 %79
%87 = OpCompositeConstruct %20 %56 %59 %62
%90 = OpImageGather %30 %73 %87 %39 ConstOffset %91
%92 = OpCompositeExtract %5 %90 0
%93 = OpCompositeExtract %5 %90 1
%94 = OpCompositeExtract %5 %90 2
%95 = OpCompositeExtract %5 %90 3
%97 = OpAccessChain %81 %33 %39
OpStore %97 %92
%98 = OpAccessChain %81 %33 %58
OpStore %98 %93
%99 = OpAccessChain %81 %33 %44
OpStore %99 %94
%100 = OpAccessChain %81 %33 %86
OpStore %100 %95
%101 = OpCompositeConstruct %20 %56 %59 %62
%102 = OpImageGather %30 %73 %101 %58
%103 = OpCompositeExtract %5 %102 0
%104 = OpCompositeExtract %5 %102 1
%105 = OpCompositeExtract %5 %102 2
%106 = OpCompositeExtract %5 %102 3
%108 = OpAccessChain %81 %34 %39
OpStore %108 %103
%109 = OpAccessChain %81 %34 %58
OpStore %109 %104
%110 = OpAccessChain %81 %34 %44
OpStore %110 %105
%111 = OpAccessChain %81 %34 %86
OpStore %111 %106
%112 = OpCompositeConstruct %20 %56 %59 %62
%113 = OpImageGather %30 %73 %112 %44
%114 = OpCompositeExtract %5 %113 0
%115 = OpCompositeExtract %5 %113 1
%116 = OpCompositeExtract %5 %113 2
%117 = OpCompositeExtract %5 %113 3
%119 = OpAccessChain %81 %35 %39
OpStore %119 %114
%120 = OpAccessChain %81 %35 %58
OpStore %120 %115
%121 = OpAccessChain %81 %35 %44
OpStore %121 %116
%122 = OpAccessChain %81 %35 %86
OpStore %122 %117
%123 = OpCompositeConstruct %20 %56 %59 %62
%124 = OpImageGather %30 %73 %123 %86
%125 = OpCompositeExtract %5 %124 0
%126 = OpCompositeExtract %5 %124 1
%127 = OpCompositeExtract %5 %124 2
%128 = OpCompositeExtract %5 %124 3
%130 = OpAccessChain %81 %36 %39
OpStore %130 %125
%131 = OpAccessChain %81 %36 %58
OpStore %131 %126
%132 = OpAccessChain %81 %36 %44
OpStore %132 %127
%133 = OpAccessChain %81 %36 %86
OpStore %133 %128
%134 = OpCompositeConstruct %20 %56 %59 %62
%135 = OpBitcast %26 %66
%136 = OpBitcast %26 %69
%138 = OpCompositeConstruct %27 %135 %136
%137 = OpImageGather %30 %73 %134 %39 Offset %138
%139 = OpCompositeExtract %5 %137 0
%140 = OpCompositeExtract %5 %137 1
%141 = OpCompositeExtract %5 %137 2
%142 = OpCompositeExtract %5 %137 3
%144 = OpAccessChain %81 %37 %39
OpStore %144 %139
%145 = OpAccessChain %81 %37 %58
OpStore %145 %140
%146 = OpAccessChain %81 %37 %44
OpStore %146 %141
%147 = OpAccessChain %81 %37 %86
OpStore %147 %142
OpReturn
OpFunctionEnd

