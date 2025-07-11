SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 129
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
%41 = OpTypePointer Input %18
%48 = OpTypeVector %33 2
%50 = OpTypeSampledImage %6
%59 = OpTypePointer Output %5
%63 = OpConstant %33 2
%65 = OpConstant %33 3
%67 = OpConstant %18 -1
%68 = OpConstant %18 0
%70 = OpConstantComposite %19 %67 %68
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %127
%127 = OpLabel
%30 = OpLoad %6 %8
%31 = OpLoad %9 %11
%32 = OpAccessChain %15 %14 %34
%35 = OpLoad %5 %32
%36 = OpAccessChain %15 %14 %37
%38 = OpLoad %5 %36
%42 = OpAccessChain %41 %21 %34
%43 = OpLoad %18 %42
%44 = OpBitcast %33 %43
%45 = OpAccessChain %41 %21 %37
%46 = OpLoad %18 %45
%47 = OpBitcast %33 %46
%51 = OpSampledImage %50 %30 %31
%52 = OpCompositeConstruct %39 %35 %38
%53 = OpImageGather %22 %51 %52 %34
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpCompositeExtract %5 %53 2
%57 = OpCompositeExtract %5 %53 3
%60 = OpAccessChain %59 %24 %34
OpStore %60 %54
%61 = OpAccessChain %59 %24 %37
OpStore %61 %55
%62 = OpAccessChain %59 %24 %63
OpStore %62 %56
%64 = OpAccessChain %59 %24 %65
OpStore %64 %57
%66 = OpCompositeConstruct %39 %35 %38
%69 = OpImageGather %22 %51 %66 %34 ConstOffset %70
%71 = OpCompositeExtract %5 %69 0
%72 = OpCompositeExtract %5 %69 1
%73 = OpCompositeExtract %5 %69 2
%74 = OpCompositeExtract %5 %69 3
%76 = OpAccessChain %59 %25 %34
OpStore %76 %71
%77 = OpAccessChain %59 %25 %37
OpStore %77 %72
%78 = OpAccessChain %59 %25 %63
OpStore %78 %73
%79 = OpAccessChain %59 %25 %65
OpStore %79 %74
%80 = OpCompositeConstruct %39 %35 %38
%81 = OpImageGather %22 %51 %80 %37
%82 = OpCompositeExtract %5 %81 0
%83 = OpCompositeExtract %5 %81 1
%84 = OpCompositeExtract %5 %81 2
%85 = OpCompositeExtract %5 %81 3
%87 = OpAccessChain %59 %26 %34
OpStore %87 %82
%88 = OpAccessChain %59 %26 %37
OpStore %88 %83
%89 = OpAccessChain %59 %26 %63
OpStore %89 %84
%90 = OpAccessChain %59 %26 %65
OpStore %90 %85
%91 = OpCompositeConstruct %39 %35 %38
%92 = OpImageGather %22 %51 %91 %63
%93 = OpCompositeExtract %5 %92 0
%94 = OpCompositeExtract %5 %92 1
%95 = OpCompositeExtract %5 %92 2
%96 = OpCompositeExtract %5 %92 3
%98 = OpAccessChain %59 %27 %34
OpStore %98 %93
%99 = OpAccessChain %59 %27 %37
OpStore %99 %94
%100 = OpAccessChain %59 %27 %63
OpStore %100 %95
%101 = OpAccessChain %59 %27 %65
OpStore %101 %96
%102 = OpCompositeConstruct %39 %35 %38
%103 = OpImageGather %22 %51 %102 %65
%104 = OpCompositeExtract %5 %103 0
%105 = OpCompositeExtract %5 %103 1
%106 = OpCompositeExtract %5 %103 2
%107 = OpCompositeExtract %5 %103 3
%109 = OpAccessChain %59 %28 %34
OpStore %109 %104
%110 = OpAccessChain %59 %28 %37
OpStore %110 %105
%111 = OpAccessChain %59 %28 %63
OpStore %111 %106
%112 = OpAccessChain %59 %28 %65
OpStore %112 %107
%113 = OpCompositeConstruct %39 %35 %38
%114 = OpBitcast %18 %44
%115 = OpBitcast %18 %47
%117 = OpCompositeConstruct %19 %114 %115
%116 = OpImageGather %22 %51 %113 %34 Offset %117
%118 = OpCompositeExtract %5 %116 0
%119 = OpCompositeExtract %5 %116 1
%120 = OpCompositeExtract %5 %116 2
%121 = OpCompositeExtract %5 %116 3
%123 = OpAccessChain %59 %29 %34
OpStore %123 %118
%124 = OpAccessChain %59 %29 %37
OpStore %124 %119
%125 = OpAccessChain %59 %29 %63
OpStore %125 %120
%126 = OpAccessChain %59 %29 %65
OpStore %126 %121
OpReturn
OpFunctionEnd

