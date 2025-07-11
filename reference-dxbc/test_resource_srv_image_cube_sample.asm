SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 125
; Schema: 0
OpCapability Shader
OpCapability MinLod
OpCapability ImageQuery
OpCapability DerivativeControl
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %20 %23 %24 %25 %26 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %20 "TEXCOORD_2"
OpName %23 "SV_TARGET"
OpName %24 "SV_TARGET_1"
OpName %25 "SV_TARGET_2"
OpName %26 "SV_TARGET_3"
OpName %27 "SV_TARGET_4"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %18 Location 1
OpDecorate %18 Component 2
OpDecorate %19 Location 1
OpDecorate %19 Component 3
OpDecorate %20 Location 2
OpDecorate %23 Location 0
OpDecorate %24 Location 1
OpDecorate %25 Location 2
OpDecorate %26 Location 3
OpDecorate %27 Location 4
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 0 0 1 Unknown
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
%18 = OpVariable %15 Input
%19 = OpVariable %15 Input
%20 = OpVariable %13 Input
%21 = OpTypeVector %5 4
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpVariable %22 Output
%25 = OpVariable %22 Output
%26 = OpVariable %22 Output
%27 = OpVariable %22 Output
%31 = OpTypeInt 32 0
%32 = OpConstant %31 0
%35 = OpConstant %31 1
%38 = OpConstant %31 2
%41 = OpTypeSampledImage %6
%43 = OpTypeVector %5 2
%49 = OpConstant %5 0
%57 = OpTypePointer Output %5
%62 = OpConstant %31 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %123
%123 = OpLabel
%28 = OpLoad %6 %8
%29 = OpLoad %9 %11
%30 = OpAccessChain %15 %14 %32
%33 = OpLoad %5 %30
%34 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %15 %14 %38
%39 = OpLoad %5 %37
%42 = OpSampledImage %41 %28 %29
%45 = OpCompositeConstruct %12 %33 %36 %39
%44 = OpImageQueryLod %43 %42 %45
%46 = OpCompositeExtract %5 %44 0
%47 = OpLoad %5 %17
%48 = OpLoad %5 %18
%51 = OpCompositeConstruct %12 %33 %36 %39
%50 = OpImageSampleImplicitLod %21 %42 %51 None
%52 = OpCompositeExtract %5 %50 0
%53 = OpCompositeExtract %5 %50 1
%54 = OpCompositeExtract %5 %50 2
%55 = OpCompositeExtract %5 %50 3
%58 = OpAccessChain %57 %23 %32
OpStore %58 %52
%59 = OpAccessChain %57 %23 %35
OpStore %59 %53
%60 = OpAccessChain %57 %23 %38
OpStore %60 %54
%61 = OpAccessChain %57 %23 %62
OpStore %61 %55
%64 = OpCompositeConstruct %12 %33 %36 %39
%63 = OpImageSampleExplicitLod %21 %42 %64 Lod %46
%65 = OpCompositeExtract %5 %63 0
%66 = OpCompositeExtract %5 %63 1
%67 = OpCompositeExtract %5 %63 2
%68 = OpCompositeExtract %5 %63 3
%70 = OpAccessChain %57 %24 %32
OpStore %70 %65
%71 = OpAccessChain %57 %24 %35
OpStore %71 %66
%72 = OpAccessChain %57 %24 %38
OpStore %72 %67
%73 = OpAccessChain %57 %24 %62
OpStore %73 %68
%75 = OpCompositeConstruct %12 %33 %36 %39
%74 = OpImageSampleImplicitLod %21 %42 %75 Bias %47
%76 = OpCompositeExtract %5 %74 0
%77 = OpCompositeExtract %5 %74 1
%78 = OpCompositeExtract %5 %74 2
%79 = OpCompositeExtract %5 %74 3
%81 = OpAccessChain %57 %25 %32
OpStore %81 %76
%82 = OpAccessChain %57 %25 %35
OpStore %82 %77
%83 = OpAccessChain %57 %25 %38
OpStore %83 %78
%84 = OpAccessChain %57 %25 %62
OpStore %84 %79
%86 = OpCompositeConstruct %12 %33 %36 %39
%85 = OpImageSampleImplicitLod %21 %42 %86 MinLod %48
%87 = OpCompositeExtract %5 %85 0
%88 = OpCompositeExtract %5 %85 1
%89 = OpCompositeExtract %5 %85 2
%90 = OpCompositeExtract %5 %85 3
%92 = OpAccessChain %57 %26 %32
OpStore %92 %87
%93 = OpAccessChain %57 %26 %35
OpStore %93 %88
%94 = OpAccessChain %57 %26 %38
OpStore %94 %89
%95 = OpAccessChain %57 %26 %62
OpStore %95 %90
%96 = OpAccessChain %15 %20 %32
%97 = OpLoad %5 %96
%98 = OpDPdx %5 %97
%99 = OpDPdy %5 %97
%100 = OpAccessChain %15 %20 %35
%101 = OpLoad %5 %100
%102 = OpDPdx %5 %101
%103 = OpDPdy %5 %101
%104 = OpAccessChain %15 %20 %38
%105 = OpLoad %5 %104
%106 = OpDPdx %5 %105
%107 = OpDPdy %5 %105
%111 = OpCompositeConstruct %12 %33 %36 %39
%112 = OpCompositeConstruct %12 %98 %102 %106
%113 = OpCompositeConstruct %12 %99 %103 %107
%110 = OpImageSampleExplicitLod %21 %42 %111 Grad %112 %113
%114 = OpCompositeExtract %5 %110 0
%115 = OpCompositeExtract %5 %110 1
%116 = OpCompositeExtract %5 %110 2
%117 = OpCompositeExtract %5 %110 3
%119 = OpAccessChain %57 %27 %32
OpStore %119 %114
%120 = OpAccessChain %57 %27 %35
OpStore %120 %115
%121 = OpAccessChain %57 %27 %38
OpStore %121 %116
%122 = OpAccessChain %57 %27 %62
OpStore %122 %117
OpReturn
OpFunctionEnd

