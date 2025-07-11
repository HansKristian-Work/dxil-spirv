SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 85
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
OpDecorate %63 NonUniform
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
%61 = OpTypeImage %5 2D 1 0 0 1 Unknown
%62 = OpTypeSampledImage %61
%64 = OpConstant %5 0
%67 = OpTypeVector %5 4
%70 = OpTypeInt 32 1
%71 = OpConstant %70 -1
%72 = OpConstant %70 0
%75 = OpTypeVector %70 2
%76 = OpConstantComposite %75 %71 %72
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %83
%83 = OpLabel
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
%58 = OpLoad %5 %24
%63 = OpSampledImage %62 %48 %51
%66 = OpCompositeConstruct %28 %53 %56
%65 = OpImageSampleDrefImplicitLod %5 %63 %66 %58 None
%68 = OpCompositeConstruct %67 %65 %65 %65 %65
%69 = OpCompositeExtract %5 %68 0
OpStore %32 %69
%74 = OpCompositeConstruct %28 %53 %56
%73 = OpImageSampleDrefImplicitLod %5 %63 %74 %58 ConstOffset %76
%77 = OpCompositeConstruct %67 %73 %73 %73 %73
%78 = OpCompositeExtract %5 %77 0
OpStore %33 %78
%80 = OpCompositeConstruct %28 %53 %56
%79 = OpImageSampleDrefExplicitLod %5 %63 %80 %58 Lod %64
%81 = OpCompositeConstruct %67 %79 %79 %79 %79
%82 = OpCompositeExtract %5 %81 0
OpStore %34 %82
OpReturn
OpFunctionEnd

