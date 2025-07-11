SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 75
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %26 %27 %28 %30 %31
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %22 "TEXCOORD"
OpName %24 "DEPTH_REF"
OpName %25 "LOD_BIAS"
OpName %26 "LOD_CLAMP"
OpName %27 "LAYER"
OpName %28 "TEXCOORD_2"
OpName %30 "SV_TARGET"
OpName %31 "SV_TARGET_1"
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
OpDecorate %28 Location 2
OpDecorate %30 Location 0
OpDecorate %31 Location 1
OpDecorate %42 NonUniform
OpDecorate %45 NonUniform
OpDecorate %48 NonUniform
OpDecorate %62 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 0 0 1 Unknown
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
%28 = OpVariable %21 Input
%29 = OpTypePointer Output %5
%30 = OpVariable %29 Output
%31 = OpVariable %29 Output
%33 = OpConstant %10 0
%34 = OpConstant %10 16
%38 = OpConstant %10 2
%39 = OpTypePointer Uniform %5
%43 = OpTypePointer UniformConstant %6
%46 = OpTypePointer UniformConstant %16
%52 = OpConstant %10 1
%60 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%61 = OpTypeSampledImage %60
%63 = OpConstant %5 0
%66 = OpTypeVector %5 4
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %73
%73 = OpLabel
%32 = OpIMul %10 %33 %34
%35 = OpIMul %10 %33 %11
%36 = OpIAdd %10 %32 %35
%37 = OpShiftRightLogical %10 %36 %38
%40 = OpAccessChain %39 %15 %33 %37
%41 = OpLoad %5 %40
%42 = OpBitcast %10 %41
%44 = OpAccessChain %43 %9 %42
%45 = OpLoad %6 %44
%47 = OpAccessChain %46 %19 %42
%48 = OpLoad %16 %47
%49 = OpAccessChain %23 %22 %33
%50 = OpLoad %5 %49
%51 = OpAccessChain %23 %22 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %23 %22 %38
%55 = OpLoad %5 %54
%56 = OpCompositeConstruct %20 %50 %53 %55
%57 = OpLoad %5 %24
%58 = OpLoad %5 %25
%59 = OpLoad %5 %26
%62 = OpSampledImage %61 %45 %48
%65 = OpCompositeConstruct %20 %50 %53 %55
%64 = OpImageSampleDrefImplicitLod %5 %62 %65 %57 None
%67 = OpCompositeConstruct %66 %64 %64 %64 %64
%68 = OpCompositeExtract %5 %67 0
OpStore %30 %68
%70 = OpCompositeConstruct %20 %50 %53 %55
%69 = OpImageSampleDrefExplicitLod %5 %62 %70 %57 Lod %63
%71 = OpCompositeConstruct %66 %69 %69 %69 %69
%72 = OpCompositeExtract %5 %71 0
OpStore %31 %72
OpReturn
OpFunctionEnd

