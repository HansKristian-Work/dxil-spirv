SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 116
; Schema: 0
OpCapability Shader
OpCapability ImageGatherExtended
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %29 %32 %33 %34
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
OpDecorate %45 NonUniform
OpDecorate %48 NonUniform
OpDecorate %51 NonUniform
OpDecorate %72 NonUniform
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
%36 = OpConstant %10 0
%37 = OpConstant %10 16
%41 = OpConstant %10 2
%42 = OpTypePointer Uniform %5
%46 = OpTypePointer UniformConstant %6
%49 = OpTypePointer UniformConstant %16
%55 = OpConstant %10 1
%57 = OpTypeVector %5 2
%61 = OpTypePointer Input %26
%68 = OpTypeVector %10 2
%70 = OpTypeImage %5 2D 1 1 0 1 Unknown
%71 = OpTypeSampledImage %70
%80 = OpTypePointer Output %5
%85 = OpConstant %10 3
%87 = OpConstant %26 -1
%88 = OpConstant %26 0
%90 = OpConstantComposite %27 %87 %88
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %114
%114 = OpLabel
%35 = OpIMul %10 %36 %37
%38 = OpIMul %10 %36 %11
%39 = OpIAdd %10 %35 %38
%40 = OpShiftRightLogical %10 %39 %41
%43 = OpAccessChain %42 %15 %36 %40
%44 = OpLoad %5 %43
%45 = OpBitcast %10 %44
%47 = OpAccessChain %46 %9 %45
%48 = OpLoad %6 %47
%50 = OpAccessChain %49 %19 %45
%51 = OpLoad %16 %50
%52 = OpAccessChain %23 %22 %36
%53 = OpLoad %5 %52
%54 = OpAccessChain %23 %22 %55
%56 = OpLoad %5 %54
%58 = OpCompositeConstruct %57 %53 %56
%59 = OpLoad %5 %24
%60 = OpLoad %5 %25
%62 = OpAccessChain %61 %29 %36
%63 = OpLoad %26 %62
%64 = OpBitcast %10 %63
%65 = OpAccessChain %61 %29 %55
%66 = OpLoad %26 %65
%67 = OpBitcast %10 %66
%69 = OpCompositeConstruct %68 %64 %67
%72 = OpSampledImage %71 %48 %51
%73 = OpCompositeConstruct %20 %53 %56 %60
%74 = OpImageDrefGather %30 %72 %73 %59
%75 = OpCompositeExtract %5 %74 0
%76 = OpCompositeExtract %5 %74 1
%77 = OpCompositeExtract %5 %74 2
%78 = OpCompositeExtract %5 %74 3
%79 = OpCompositeConstruct %30 %75 %76 %77 %78
%81 = OpAccessChain %80 %32 %36
OpStore %81 %75
%82 = OpAccessChain %80 %32 %55
OpStore %82 %76
%83 = OpAccessChain %80 %32 %41
OpStore %83 %77
%84 = OpAccessChain %80 %32 %85
OpStore %84 %78
%86 = OpCompositeConstruct %20 %53 %56 %60
%89 = OpImageDrefGather %30 %72 %86 %59 ConstOffset %90
%91 = OpCompositeExtract %5 %89 0
%92 = OpCompositeExtract %5 %89 1
%93 = OpCompositeExtract %5 %89 2
%94 = OpCompositeExtract %5 %89 3
%95 = OpCompositeConstruct %30 %91 %92 %93 %94
%96 = OpAccessChain %80 %33 %36
OpStore %96 %91
%97 = OpAccessChain %80 %33 %55
OpStore %97 %92
%98 = OpAccessChain %80 %33 %41
OpStore %98 %93
%99 = OpAccessChain %80 %33 %85
OpStore %99 %94
%100 = OpCompositeConstruct %20 %53 %56 %60
%101 = OpBitcast %26 %64
%102 = OpBitcast %26 %67
%104 = OpCompositeConstruct %27 %101 %102
%103 = OpImageDrefGather %30 %72 %100 %59 Offset %104
%105 = OpCompositeExtract %5 %103 0
%106 = OpCompositeExtract %5 %103 1
%107 = OpCompositeExtract %5 %103 2
%108 = OpCompositeExtract %5 %103 3
%109 = OpCompositeConstruct %30 %105 %106 %107 %108
%110 = OpAccessChain %80 %34 %36
OpStore %110 %105
%111 = OpAccessChain %80 %34 %55
OpStore %111 %106
%112 = OpAccessChain %80 %34 %41
OpStore %112 %107
%113 = OpAccessChain %80 %34 %85
OpStore %113 %108
OpReturn
OpFunctionEnd

