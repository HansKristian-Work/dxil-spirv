SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 86
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %26 %27 %30 %32 %33 %34
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %22 "TEXCOORD"
OpName %24 "DEPTH_REF"
OpName %25 "LOD_BIAS"
OpName %26 "LOD_CLAMP"
OpName %27 "LAYER"
OpName %30 "TEXCOORD_2"
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
OpDecorate %26 Location 1
OpDecorate %26 Component 2
OpDecorate %27 Location 1
OpDecorate %27 Component 3
OpDecorate %30 Location 2
OpDecorate %32 Location 0
OpDecorate %33 Location 1
OpDecorate %34 Location 2
OpDecorate %45 NonUniform
OpDecorate %48 NonUniform
OpDecorate %51 NonUniform
OpDecorate %64 NonUniform
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
%26 = OpVariable %23 Input
%27 = OpVariable %23 Input
%28 = OpTypeVector %5 2
%29 = OpTypePointer Input %28
%30 = OpVariable %29 Input
%31 = OpTypePointer Output %5
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
%62 = OpTypeImage %5 2D 1 1 0 1 Unknown
%63 = OpTypeSampledImage %62
%65 = OpConstant %5 0
%68 = OpTypeVector %5 4
%71 = OpTypeInt 32 1
%72 = OpConstant %71 -1
%73 = OpConstant %71 0
%76 = OpTypeVector %71 2
%77 = OpConstantComposite %76 %72 %73
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %84
%84 = OpLabel
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
%57 = OpCompositeConstruct %28 %53 %56
%58 = OpLoad %5 %24
%59 = OpLoad %5 %27
%60 = OpLoad %5 %25
%61 = OpLoad %5 %26
%64 = OpSampledImage %63 %48 %51
%67 = OpCompositeConstruct %20 %53 %56 %59
%66 = OpImageSampleDrefImplicitLod %5 %64 %67 %58 None
%69 = OpCompositeConstruct %68 %66 %66 %66 %66
%70 = OpCompositeExtract %5 %69 0
OpStore %32 %70
%75 = OpCompositeConstruct %20 %53 %56 %59
%74 = OpImageSampleDrefImplicitLod %5 %64 %75 %58 ConstOffset %77
%78 = OpCompositeConstruct %68 %74 %74 %74 %74
%79 = OpCompositeExtract %5 %78 0
OpStore %33 %79
%81 = OpCompositeConstruct %20 %53 %56 %59
%80 = OpImageSampleDrefExplicitLod %5 %64 %81 %58 Lod %65
%82 = OpCompositeConstruct %68 %80 %80 %80 %80
%83 = OpCompositeExtract %5 %82 0
OpStore %34 %83
OpReturn
OpFunctionEnd

