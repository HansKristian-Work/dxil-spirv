SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 67
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability Sampled1D
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %18 %21 %22
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 ""
OpName %18 "TEXCOORD"
OpName %21 "SV_TARGET"
OpName %22 "SV_TARGET_1"
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 ArrayStride 4
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %15 DescriptorSet 0
OpDecorate %15 Binding 0
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %21 Location 0
OpDecorate %22 Location 1
OpDecorate %33 NonUniform
OpDecorate %36 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
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
%19 = OpTypeVector %5 4
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpVariable %20 Output
%24 = OpConstant %10 0
%25 = OpConstant %10 16
%29 = OpConstant %10 2
%30 = OpTypePointer Uniform %5
%34 = OpTypePointer UniformConstant %6
%37 = OpTypePointer Input %10
%40 = OpConstant %10 1
%47 = OpTypePointer Output %5
%52 = OpConstant %10 3
%53 = OpTypeInt 32 1
%54 = OpConstant %53 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %65
%65 = OpLabel
%23 = OpIMul %10 %24 %25
%26 = OpIMul %10 %24 %11
%27 = OpIAdd %10 %23 %26
%28 = OpShiftRightLogical %10 %27 %29
%31 = OpAccessChain %30 %15 %24 %28
%32 = OpLoad %5 %31
%33 = OpBitcast %10 %32
%35 = OpAccessChain %34 %9 %33
%36 = OpLoad %6 %35
%38 = OpAccessChain %37 %18 %24
%39 = OpLoad %10 %38
%41 = OpImageFetch %19 %36 %39 Lod %40
%42 = OpCompositeExtract %5 %41 0
%43 = OpCompositeExtract %5 %41 1
%44 = OpCompositeExtract %5 %41 2
%45 = OpCompositeExtract %5 %41 3
%46 = OpCompositeConstruct %19 %42 %43 %44 %45
%48 = OpAccessChain %47 %21 %24
OpStore %48 %42
%49 = OpAccessChain %47 %21 %40
OpStore %49 %43
%50 = OpAccessChain %47 %21 %29
OpStore %50 %44
%51 = OpAccessChain %47 %21 %52
OpStore %51 %45
%55 = OpImageFetch %19 %36 %39 Lod|ConstOffset %40 %54
%56 = OpCompositeExtract %5 %55 0
%57 = OpCompositeExtract %5 %55 1
%58 = OpCompositeExtract %5 %55 2
%59 = OpCompositeExtract %5 %55 3
%60 = OpCompositeConstruct %19 %56 %57 %58 %59
%61 = OpAccessChain %47 %22 %24
OpStore %61 %56
%62 = OpAccessChain %47 %22 %40
OpStore %62 %57
%63 = OpAccessChain %47 %22 %29
OpStore %63 %58
%64 = OpAccessChain %47 %22 %52
OpStore %64 %59
OpReturn
OpFunctionEnd

