SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 115
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
OpDecorate %71 NonUniform
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
%36 = OpConstant %10 0
%37 = OpConstant %10 16
%41 = OpConstant %10 2
%42 = OpTypePointer Uniform %5
%46 = OpTypePointer UniformConstant %6
%49 = OpTypePointer UniformConstant %16
%55 = OpConstant %10 1
%57 = OpTypeVector %5 2
%60 = OpTypePointer Input %26
%67 = OpTypeVector %10 2
%69 = OpTypeImage %5 2D 1 0 0 1 Unknown
%70 = OpTypeSampledImage %69
%79 = OpTypePointer Output %5
%84 = OpConstant %10 3
%86 = OpConstant %26 -1
%87 = OpConstant %26 0
%89 = OpConstantComposite %27 %86 %87
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %113
%113 = OpLabel
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
%59 = OpLoad %5 %24
%61 = OpAccessChain %60 %29 %36
%62 = OpLoad %26 %61
%63 = OpBitcast %10 %62
%64 = OpAccessChain %60 %29 %55
%65 = OpLoad %26 %64
%66 = OpBitcast %10 %65
%71 = OpSampledImage %70 %48 %51
%72 = OpCompositeConstruct %57 %53 %56
%73 = OpImageDrefGather %30 %71 %72 %59
%74 = OpCompositeExtract %5 %73 0
%75 = OpCompositeExtract %5 %73 1
%76 = OpCompositeExtract %5 %73 2
%77 = OpCompositeExtract %5 %73 3
%80 = OpAccessChain %79 %32 %36
OpStore %80 %74
%81 = OpAccessChain %79 %32 %55
OpStore %81 %75
%82 = OpAccessChain %79 %32 %41
OpStore %82 %76
%83 = OpAccessChain %79 %32 %84
OpStore %83 %77
%85 = OpCompositeConstruct %57 %53 %56
%88 = OpImageDrefGather %30 %71 %85 %59 ConstOffset %89
%90 = OpCompositeExtract %5 %88 0
%91 = OpCompositeExtract %5 %88 1
%92 = OpCompositeExtract %5 %88 2
%93 = OpCompositeExtract %5 %88 3
%95 = OpAccessChain %79 %33 %36
OpStore %95 %90
%96 = OpAccessChain %79 %33 %55
OpStore %96 %91
%97 = OpAccessChain %79 %33 %41
OpStore %97 %92
%98 = OpAccessChain %79 %33 %84
OpStore %98 %93
%99 = OpCompositeConstruct %57 %53 %56
%100 = OpBitcast %26 %63
%101 = OpBitcast %26 %66
%103 = OpCompositeConstruct %27 %100 %101
%102 = OpImageDrefGather %30 %71 %99 %59 Offset %103
%104 = OpCompositeExtract %5 %102 0
%105 = OpCompositeExtract %5 %102 1
%106 = OpCompositeExtract %5 %102 2
%107 = OpCompositeExtract %5 %102 3
%109 = OpAccessChain %79 %34 %36
OpStore %109 %104
%110 = OpAccessChain %79 %34 %55
OpStore %110 %105
%111 = OpAccessChain %79 %34 %41
OpStore %111 %106
%112 = OpAccessChain %79 %34 %84
OpStore %112 %107
OpReturn
OpFunctionEnd

