SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 78
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability SampleRateShading
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %18 %20 %23 %24
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %18 "TEXCOORD"
OpName %20 "SV_SAMPLEINDEX"
OpName %23 "SV_TARGET"
OpName %24 "SV_TARGET_1"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %20 BuiltIn SampleId
OpDecorate %20 Flat
OpDecorate %23 Location 0
OpDecorate %24 Location 1
OpDecorate %35 NonUniform
OpDecorate %38 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 1 1 Unknown
%7 = OpTypeRuntimeArray %6
%8 = OpTypePointer UniformConstant %7
%9 = OpVariable %8 UniformConstant
%10 = OpTypeInt 32 0
%11 = OpConstant %10 4
%12 = OpTypeArray %5 %11
%13 = OpTypeStruct %12
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypeVector %10 3
%17 = OpTypePointer Input %16
%18 = OpVariable %17 Input
%19 = OpTypePointer Input %10
%20 = OpVariable %19 Input
%21 = OpTypeVector %5 4
%22 = OpTypePointer Output %21
%23 = OpVariable %22 Output
%24 = OpVariable %22 Output
%26 = OpConstant %10 0
%27 = OpConstant %10 16
%31 = OpConstant %10 2
%32 = OpTypePointer Uniform %5
%36 = OpTypePointer UniformConstant %6
%42 = OpConstant %10 1
%44 = OpTypeVector %10 2
%54 = OpTypePointer Output %5
%59 = OpConstant %10 3
%60 = OpTypeInt 32 1
%61 = OpConstant %60 -1
%62 = OpConstant %60 0
%65 = OpTypeVector %60 2
%66 = OpConstantComposite %65 %61 %62
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %76
%76 = OpLabel
%25 = OpIMul %10 %26 %27
%28 = OpIMul %10 %26 %11
%29 = OpIAdd %10 %25 %28
%30 = OpShiftRightLogical %10 %29 %31
%33 = OpAccessChain %32 %15 %26 %30
%34 = OpLoad %5 %33
%35 = OpBitcast %10 %34
%37 = OpAccessChain %36 %9 %35
%38 = OpLoad %6 %37
%39 = OpAccessChain %19 %18 %26
%40 = OpLoad %10 %39
%41 = OpAccessChain %19 %18 %42
%43 = OpLoad %10 %41
%45 = OpCompositeConstruct %44 %40 %43
%46 = OpLoad %10 %20
%48 = OpCompositeConstruct %44 %40 %43
%47 = OpImageFetch %21 %38 %48 Sample %46
%49 = OpCompositeExtract %5 %47 0
%50 = OpCompositeExtract %5 %47 1
%51 = OpCompositeExtract %5 %47 2
%52 = OpCompositeExtract %5 %47 3
%53 = OpCompositeConstruct %21 %49 %50 %51 %52
%55 = OpAccessChain %54 %23 %26
OpStore %55 %49
%56 = OpAccessChain %54 %23 %42
OpStore %56 %50
%57 = OpAccessChain %54 %23 %31
OpStore %57 %51
%58 = OpAccessChain %54 %23 %59
OpStore %58 %52
%64 = OpCompositeConstruct %44 %40 %43
%63 = OpImageFetch %21 %38 %64 ConstOffset|Sample %66 %46
%67 = OpCompositeExtract %5 %63 0
%68 = OpCompositeExtract %5 %63 1
%69 = OpCompositeExtract %5 %63 2
%70 = OpCompositeExtract %5 %63 3
%71 = OpCompositeConstruct %21 %67 %68 %69 %70
%72 = OpAccessChain %54 %24 %26
OpStore %72 %67
%73 = OpAccessChain %54 %24 %42
OpStore %73 %68
%74 = OpAccessChain %54 %24 %31
OpStore %74 %69
%75 = OpAccessChain %54 %24 %59
OpStore %75 %70
OpReturn
OpFunctionEnd

