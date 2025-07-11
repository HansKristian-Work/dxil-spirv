SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 136
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability SparseResidency
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %20 %23 %25 %26 %27 %28 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %20 "OFFSET"
OpName %23 "SV_TARGET"
OpName %25 "SV_TARGET_1"
OpName %26 "SV_TARGET_2"
OpName %27 "SV_TARGET_3"
OpName %28 "SV_TARGET_4"
OpName %29 "SV_TARGET_5"
OpName %55 "SparseTexel"
OpName %63 ""
OpName %71 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %20 Flat
OpDecorate %20 Location 2
OpDecorate %23 Location 0
OpDecorate %25 Location 1
OpDecorate %26 Location 2
OpDecorate %27 Location 3
OpDecorate %28 Location 4
OpDecorate %29 Location 5
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
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
%17 = OpTypeInt 32 1
%18 = OpTypeVector %17 2
%19 = OpTypePointer Input %18
%20 = OpVariable %19 Input
%21 = OpTypeVector %5 4
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpTypePointer Output %5
%25 = OpVariable %24 Output
%26 = OpVariable %22 Output
%27 = OpVariable %24 Output
%28 = OpVariable %22 Output
%29 = OpVariable %24 Output
%33 = OpTypeInt 32 0
%34 = OpConstant %33 0
%37 = OpConstant %33 1
%39 = OpTypeVector %5 2
%42 = OpTypePointer Input %17
%49 = OpTypeVector %33 2
%51 = OpTypeImage %5 2D 1 0 0 1 Unknown
%52 = OpTypeSampledImage %51
%55 = OpTypeStruct %33 %21
%63 = OpTypeStruct %5 %5 %5 %5 %33
%71 = OpTypeStruct %33 %21
%76 = OpConstant %33 2
%78 = OpConstant %33 3
%79 = OpTypeBool
%82 = OpConstant %5 1
%83 = OpConstant %5 0
%85 = OpConstant %17 -1
%86 = OpConstant %17 0
%88 = OpConstantComposite %18 %85 %86
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %134
%134 = OpLabel
%30 = OpLoad %6 %8
%31 = OpLoad %9 %11
%32 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %15 %14 %37
%38 = OpLoad %5 %36
%40 = OpCompositeConstruct %39 %35 %38
%41 = OpLoad %5 %16
%43 = OpAccessChain %42 %20 %34
%44 = OpLoad %17 %43
%45 = OpBitcast %33 %44
%46 = OpAccessChain %42 %20 %37
%47 = OpLoad %17 %46
%48 = OpBitcast %33 %47
%50 = OpCompositeConstruct %49 %45 %48
%53 = OpSampledImage %52 %30 %31
%54 = OpCompositeConstruct %39 %35 %38
%56 = OpImageSparseDrefGather %55 %53 %54 %41
%57 = OpCompositeExtract %33 %56 0
%58 = OpCompositeExtract %21 %56 1
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%61 = OpCompositeExtract %5 %58 2
%62 = OpCompositeExtract %5 %58 3
%64 = OpCompositeConstruct %63 %59 %60 %61 %62 %57
%65 = OpCompositeExtract %33 %64 4
%66 = OpCompositeExtract %5 %64 0
%67 = OpCompositeExtract %5 %64 1
%68 = OpCompositeExtract %5 %64 2
%69 = OpCompositeExtract %5 %64 3
%70 = OpCompositeConstruct %21 %66 %67 %68 %69
%72 = OpCompositeConstruct %71 %65 %70
%73 = OpAccessChain %24 %23 %34
OpStore %73 %66
%74 = OpAccessChain %24 %23 %37
OpStore %74 %67
%75 = OpAccessChain %24 %23 %76
OpStore %75 %68
%77 = OpAccessChain %24 %23 %78
OpStore %77 %69
%80 = OpImageSparseTexelsResident %79 %65
%81 = OpSelect %5 %80 %82 %83
OpStore %25 %81
%84 = OpCompositeConstruct %39 %35 %38
%87 = OpImageSparseDrefGather %55 %53 %84 %41 ConstOffset %88
%89 = OpCompositeExtract %33 %87 0
%90 = OpCompositeExtract %21 %87 1
%91 = OpCompositeExtract %5 %90 0
%92 = OpCompositeExtract %5 %90 1
%93 = OpCompositeExtract %5 %90 2
%94 = OpCompositeExtract %5 %90 3
%95 = OpCompositeConstruct %63 %91 %92 %93 %94 %89
%96 = OpCompositeExtract %33 %95 4
%97 = OpCompositeExtract %5 %95 0
%98 = OpCompositeExtract %5 %95 1
%99 = OpCompositeExtract %5 %95 2
%100 = OpCompositeExtract %5 %95 3
%101 = OpCompositeConstruct %21 %97 %98 %99 %100
%102 = OpCompositeConstruct %71 %96 %101
%103 = OpAccessChain %24 %26 %34
OpStore %103 %97
%104 = OpAccessChain %24 %26 %37
OpStore %104 %98
%105 = OpAccessChain %24 %26 %76
OpStore %105 %99
%106 = OpAccessChain %24 %26 %78
OpStore %106 %100
%107 = OpImageSparseTexelsResident %79 %96
%108 = OpSelect %5 %107 %82 %83
OpStore %27 %108
%109 = OpCompositeConstruct %39 %35 %38
%110 = OpBitcast %17 %45
%111 = OpBitcast %17 %48
%113 = OpCompositeConstruct %18 %110 %111
%112 = OpImageSparseDrefGather %55 %53 %109 %41 Offset %113
%114 = OpCompositeExtract %33 %112 0
%115 = OpCompositeExtract %21 %112 1
%116 = OpCompositeExtract %5 %115 0
%117 = OpCompositeExtract %5 %115 1
%118 = OpCompositeExtract %5 %115 2
%119 = OpCompositeExtract %5 %115 3
%120 = OpCompositeConstruct %63 %116 %117 %118 %119 %114
%121 = OpCompositeExtract %33 %120 4
%122 = OpCompositeExtract %5 %120 0
%123 = OpCompositeExtract %5 %120 1
%124 = OpCompositeExtract %5 %120 2
%125 = OpCompositeExtract %5 %120 3
%126 = OpCompositeConstruct %21 %122 %123 %124 %125
%127 = OpCompositeConstruct %71 %121 %126
%128 = OpAccessChain %24 %28 %34
OpStore %128 %122
%129 = OpAccessChain %24 %28 %37
OpStore %129 %123
%130 = OpAccessChain %24 %28 %76
OpStore %130 %124
%131 = OpAccessChain %24 %28 %78
OpStore %131 %125
%132 = OpImageSparseTexelsResident %79 %121
%133 = OpSelect %5 %132 %82 %83
OpStore %29 %133
OpReturn
OpFunctionEnd

