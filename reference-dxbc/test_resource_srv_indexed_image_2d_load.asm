SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 76
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
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
%41 = OpConstant %10 1
%43 = OpTypeVector %10 2
%52 = OpTypePointer Output %5
%57 = OpConstant %10 3
%58 = OpTypeInt 32 1
%59 = OpConstant %58 -1
%60 = OpConstant %58 0
%63 = OpTypeVector %58 2
%64 = OpConstantComposite %63 %59 %60
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %74
%74 = OpLabel
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
%40 = OpAccessChain %37 %18 %41
%42 = OpLoad %10 %40
%44 = OpCompositeConstruct %43 %39 %42
%46 = OpCompositeConstruct %43 %39 %42
%45 = OpImageFetch %19 %36 %46 Lod %41
%47 = OpCompositeExtract %5 %45 0
%48 = OpCompositeExtract %5 %45 1
%49 = OpCompositeExtract %5 %45 2
%50 = OpCompositeExtract %5 %45 3
%51 = OpCompositeConstruct %19 %47 %48 %49 %50
%53 = OpAccessChain %52 %21 %24
OpStore %53 %47
%54 = OpAccessChain %52 %21 %41
OpStore %54 %48
%55 = OpAccessChain %52 %21 %29
OpStore %55 %49
%56 = OpAccessChain %52 %21 %57
OpStore %56 %50
%62 = OpCompositeConstruct %43 %39 %42
%61 = OpImageFetch %19 %36 %62 Lod|ConstOffset %41 %64
%65 = OpCompositeExtract %5 %61 0
%66 = OpCompositeExtract %5 %61 1
%67 = OpCompositeExtract %5 %61 2
%68 = OpCompositeExtract %5 %61 3
%69 = OpCompositeConstruct %19 %65 %66 %67 %68
%70 = OpAccessChain %52 %22 %24
OpStore %70 %65
%71 = OpAccessChain %52 %22 %41
OpStore %71 %66
%72 = OpAccessChain %52 %22 %29
OpStore %72 %67
%73 = OpAccessChain %52 %22 %57
OpStore %73 %68
OpReturn
OpFunctionEnd

