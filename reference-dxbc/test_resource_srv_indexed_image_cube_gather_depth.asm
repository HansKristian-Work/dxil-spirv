SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 77
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %29 %32
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %22 "TEXCOORD"
OpName %24 "DEPTH_REF"
OpName %25 "LAYER"
OpName %29 "OFFSET"
OpName %32 "SV_TARGET"
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
OpDecorate %43 NonUniform
OpDecorate %46 NonUniform
OpDecorate %49 NonUniform
OpDecorate %61 NonUniform
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
%26 = OpTypeInt 32 1
%27 = OpTypeVector %26 3
%28 = OpTypePointer Input %27
%29 = OpVariable %28 Input
%30 = OpTypeVector %5 4
%31 = OpTypePointer Output %30
%32 = OpVariable %31 Output
%34 = OpConstant %10 0
%35 = OpConstant %10 16
%39 = OpConstant %10 2
%40 = OpTypePointer Uniform %5
%44 = OpTypePointer UniformConstant %6
%47 = OpTypePointer UniformConstant %16
%53 = OpConstant %10 1
%59 = OpTypeImage %5 Cube 1 0 0 1 Unknown
%60 = OpTypeSampledImage %59
%69 = OpTypePointer Output %5
%74 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %75
%75 = OpLabel
%33 = OpIMul %10 %34 %35
%36 = OpIMul %10 %34 %11
%37 = OpIAdd %10 %33 %36
%38 = OpShiftRightLogical %10 %37 %39
%41 = OpAccessChain %40 %15 %34 %38
%42 = OpLoad %5 %41
%43 = OpBitcast %10 %42
%45 = OpAccessChain %44 %9 %43
%46 = OpLoad %6 %45
%48 = OpAccessChain %47 %19 %43
%49 = OpLoad %16 %48
%50 = OpAccessChain %23 %22 %34
%51 = OpLoad %5 %50
%52 = OpAccessChain %23 %22 %53
%54 = OpLoad %5 %52
%55 = OpAccessChain %23 %22 %39
%56 = OpLoad %5 %55
%57 = OpCompositeConstruct %20 %51 %54 %56
%58 = OpLoad %5 %24
%61 = OpSampledImage %60 %46 %49
%62 = OpCompositeConstruct %20 %51 %54 %56
%63 = OpImageDrefGather %30 %61 %62 %58
%64 = OpCompositeExtract %5 %63 0
%65 = OpCompositeExtract %5 %63 1
%66 = OpCompositeExtract %5 %63 2
%67 = OpCompositeExtract %5 %63 3
%68 = OpCompositeConstruct %30 %64 %65 %66 %67
%70 = OpAccessChain %69 %32 %34
OpStore %70 %64
%71 = OpAccessChain %69 %32 %53
OpStore %71 %65
%72 = OpAccessChain %69 %32 %39
OpStore %72 %66
%73 = OpAccessChain %69 %32 %74
OpStore %73 %67
OpReturn
OpFunctionEnd

