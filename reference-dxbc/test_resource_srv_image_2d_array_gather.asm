SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 130
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %21 %24 %25 %26 %27 %28 %29
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LAYER"
OpName %21 "OFFSET"
OpName %24 "SV_TARGET"
OpName %25 "SV_TARGET_1"
OpName %26 "SV_TARGET_2"
OpName %27 "SV_TARGET_3"
OpName %28 "SV_TARGET_4"
OpName %29 "SV_TARGET_5"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %21 Flat
OpDecorate %21 Location 2
OpDecorate %24 Location 0
OpDecorate %25 Location 1
OpDecorate %26 Location 2
OpDecorate %27 Location 3
OpDecorate %28 Location 4
OpDecorate %29 Location 5
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 0 1 Unknown
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
%17 = OpVariable %15 Input
%18 = OpTypeInt 32 1
%19 = OpTypeVector %18 2
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeVector %5 4
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpVariable %23 Output
%26 = OpVariable %23 Output
%27 = OpVariable %23 Output
%28 = OpVariable %23 Output
%29 = OpVariable %23 Output
%33 = OpTypeInt 32 0
%34 = OpConstant %33 0
%37 = OpConstant %33 1
%39 = OpTypeVector %5 2
%42 = OpTypePointer Input %18
%49 = OpTypeVector %33 2
%51 = OpTypeSampledImage %6
%60 = OpTypePointer Output %5
%64 = OpConstant %33 2
%66 = OpConstant %33 3
%68 = OpConstant %18 -1
%69 = OpConstant %18 0
%71 = OpConstantComposite %19 %68 %69
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %128
%128 = OpLabel
%30 = OpLoad %6 %8
%31 = OpLoad %9 %11
%32 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %15 %14 %37
%38 = OpLoad %5 %36
%41 = OpLoad %5 %17
%43 = OpAccessChain %42 %21 %34
%44 = OpLoad %18 %43
%45 = OpBitcast %33 %44
%46 = OpAccessChain %42 %21 %37
%47 = OpLoad %18 %46
%48 = OpBitcast %33 %47
%52 = OpSampledImage %51 %30 %31
%53 = OpCompositeConstruct %12 %35 %38 %41
%54 = OpImageGather %22 %52 %53 %34
%55 = OpCompositeExtract %5 %54 0
%56 = OpCompositeExtract %5 %54 1
%57 = OpCompositeExtract %5 %54 2
%58 = OpCompositeExtract %5 %54 3
%61 = OpAccessChain %60 %24 %34
OpStore %61 %55
%62 = OpAccessChain %60 %24 %37
OpStore %62 %56
%63 = OpAccessChain %60 %24 %64
OpStore %63 %57
%65 = OpAccessChain %60 %24 %66
OpStore %65 %58
%67 = OpCompositeConstruct %12 %35 %38 %41
%70 = OpImageGather %22 %52 %67 %34 ConstOffset %71
%72 = OpCompositeExtract %5 %70 0
%73 = OpCompositeExtract %5 %70 1
%74 = OpCompositeExtract %5 %70 2
%75 = OpCompositeExtract %5 %70 3
%77 = OpAccessChain %60 %25 %34
OpStore %77 %72
%78 = OpAccessChain %60 %25 %37
OpStore %78 %73
%79 = OpAccessChain %60 %25 %64
OpStore %79 %74
%80 = OpAccessChain %60 %25 %66
OpStore %80 %75
%81 = OpCompositeConstruct %12 %35 %38 %41
%82 = OpImageGather %22 %52 %81 %37
%83 = OpCompositeExtract %5 %82 0
%84 = OpCompositeExtract %5 %82 1
%85 = OpCompositeExtract %5 %82 2
%86 = OpCompositeExtract %5 %82 3
%88 = OpAccessChain %60 %26 %34
OpStore %88 %83
%89 = OpAccessChain %60 %26 %37
OpStore %89 %84
%90 = OpAccessChain %60 %26 %64
OpStore %90 %85
%91 = OpAccessChain %60 %26 %66
OpStore %91 %86
%92 = OpCompositeConstruct %12 %35 %38 %41
%93 = OpImageGather %22 %52 %92 %64
%94 = OpCompositeExtract %5 %93 0
%95 = OpCompositeExtract %5 %93 1
%96 = OpCompositeExtract %5 %93 2
%97 = OpCompositeExtract %5 %93 3
%99 = OpAccessChain %60 %27 %34
OpStore %99 %94
%100 = OpAccessChain %60 %27 %37
OpStore %100 %95
%101 = OpAccessChain %60 %27 %64
OpStore %101 %96
%102 = OpAccessChain %60 %27 %66
OpStore %102 %97
%103 = OpCompositeConstruct %12 %35 %38 %41
%104 = OpImageGather %22 %52 %103 %66
%105 = OpCompositeExtract %5 %104 0
%106 = OpCompositeExtract %5 %104 1
%107 = OpCompositeExtract %5 %104 2
%108 = OpCompositeExtract %5 %104 3
%110 = OpAccessChain %60 %28 %34
OpStore %110 %105
%111 = OpAccessChain %60 %28 %37
OpStore %111 %106
%112 = OpAccessChain %60 %28 %64
OpStore %112 %107
%113 = OpAccessChain %60 %28 %66
OpStore %113 %108
%114 = OpCompositeConstruct %12 %35 %38 %41
%115 = OpBitcast %18 %45
%116 = OpBitcast %18 %48
%118 = OpCompositeConstruct %19 %115 %116
%117 = OpImageGather %22 %52 %114 %34 Offset %118
%119 = OpCompositeExtract %5 %117 0
%120 = OpCompositeExtract %5 %117 1
%121 = OpCompositeExtract %5 %117 2
%122 = OpCompositeExtract %5 %117 3
%124 = OpAccessChain %60 %29 %34
OpStore %124 %119
%125 = OpAccessChain %60 %29 %37
OpStore %125 %120
%126 = OpAccessChain %60 %29 %64
OpStore %126 %121
%127 = OpAccessChain %60 %29 %66
OpStore %127 %122
OpReturn
OpFunctionEnd

