SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 134
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
OpName %53 "SparseTexel"
OpName %61 ""
OpName %69 ""
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
%41 = OpTypePointer Input %17
%48 = OpTypeVector %33 2
%50 = OpTypeSampledImage %6
%53 = OpTypeStruct %33 %21
%61 = OpTypeStruct %5 %5 %5 %5 %33
%69 = OpTypeStruct %33 %21
%74 = OpConstant %33 2
%76 = OpConstant %33 3
%77 = OpTypeBool
%80 = OpConstant %5 1
%81 = OpConstant %5 0
%83 = OpConstant %17 -1
%84 = OpConstant %17 0
%86 = OpConstantComposite %18 %83 %84
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %132
%132 = OpLabel
%30 = OpLoad %6 %8
%31 = OpLoad %9 %11
%32 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %15 %14 %37
%38 = OpLoad %5 %36
%42 = OpAccessChain %41 %20 %34
%43 = OpLoad %17 %42
%44 = OpBitcast %33 %43
%45 = OpAccessChain %41 %20 %37
%46 = OpLoad %17 %45
%47 = OpBitcast %33 %46
%51 = OpSampledImage %50 %30 %31
%52 = OpCompositeConstruct %39 %35 %38
%54 = OpImageSparseGather %53 %51 %52 %34
%55 = OpCompositeExtract %33 %54 0
%56 = OpCompositeExtract %21 %54 1
%57 = OpCompositeExtract %5 %56 0
%58 = OpCompositeExtract %5 %56 1
%59 = OpCompositeExtract %5 %56 2
%60 = OpCompositeExtract %5 %56 3
%62 = OpCompositeConstruct %61 %57 %58 %59 %60 %55
%63 = OpCompositeExtract %33 %62 4
%64 = OpCompositeExtract %5 %62 0
%65 = OpCompositeExtract %5 %62 1
%66 = OpCompositeExtract %5 %62 2
%67 = OpCompositeExtract %5 %62 3
%68 = OpCompositeConstruct %21 %64 %65 %66 %67
%71 = OpAccessChain %24 %23 %34
OpStore %71 %64
%72 = OpAccessChain %24 %23 %37
OpStore %72 %65
%73 = OpAccessChain %24 %23 %74
OpStore %73 %66
%75 = OpAccessChain %24 %23 %76
OpStore %75 %67
%78 = OpImageSparseTexelsResident %77 %63
%79 = OpSelect %5 %78 %80 %81
OpStore %25 %79
%82 = OpCompositeConstruct %39 %35 %38
%85 = OpImageSparseGather %53 %51 %82 %34 ConstOffset %86
%87 = OpCompositeExtract %33 %85 0
%88 = OpCompositeExtract %21 %85 1
%89 = OpCompositeExtract %5 %88 0
%90 = OpCompositeExtract %5 %88 1
%91 = OpCompositeExtract %5 %88 2
%92 = OpCompositeExtract %5 %88 3
%93 = OpCompositeConstruct %61 %89 %90 %91 %92 %87
%94 = OpCompositeExtract %33 %93 4
%95 = OpCompositeExtract %5 %93 0
%96 = OpCompositeExtract %5 %93 1
%97 = OpCompositeExtract %5 %93 2
%98 = OpCompositeExtract %5 %93 3
%99 = OpCompositeConstruct %21 %95 %96 %97 %98
%101 = OpAccessChain %24 %26 %34
OpStore %101 %95
%102 = OpAccessChain %24 %26 %37
OpStore %102 %96
%103 = OpAccessChain %24 %26 %74
OpStore %103 %97
%104 = OpAccessChain %24 %26 %76
OpStore %104 %98
%105 = OpImageSparseTexelsResident %77 %94
%106 = OpSelect %5 %105 %80 %81
OpStore %27 %106
%107 = OpCompositeConstruct %39 %35 %38
%108 = OpBitcast %17 %44
%109 = OpBitcast %17 %47
%111 = OpCompositeConstruct %18 %108 %109
%110 = OpImageSparseGather %53 %51 %107 %34 Offset %111
%112 = OpCompositeExtract %33 %110 0
%113 = OpCompositeExtract %21 %110 1
%114 = OpCompositeExtract %5 %113 0
%115 = OpCompositeExtract %5 %113 1
%116 = OpCompositeExtract %5 %113 2
%117 = OpCompositeExtract %5 %113 3
%118 = OpCompositeConstruct %61 %114 %115 %116 %117 %112
%119 = OpCompositeExtract %33 %118 4
%120 = OpCompositeExtract %5 %118 0
%121 = OpCompositeExtract %5 %118 1
%122 = OpCompositeExtract %5 %118 2
%123 = OpCompositeExtract %5 %118 3
%124 = OpCompositeConstruct %21 %120 %121 %122 %123
%126 = OpAccessChain %24 %28 %34
OpStore %126 %120
%127 = OpAccessChain %24 %28 %37
OpStore %127 %121
%128 = OpAccessChain %24 %28 %74
OpStore %128 %122
%129 = OpAccessChain %24 %28 %76
OpStore %129 %123
%130 = OpImageSparseTexelsResident %77 %119
%131 = OpSelect %5 %130 %80 %81
OpStore %29 %131
OpReturn
OpFunctionEnd

