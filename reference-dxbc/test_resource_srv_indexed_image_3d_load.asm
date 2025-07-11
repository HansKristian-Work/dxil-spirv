SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 78
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
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
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
%53 = OpTypePointer Output %5
%58 = OpConstant %10 3
%59 = OpTypeInt 32 1
%60 = OpConstant %59 -1
%61 = OpConstant %59 0
%62 = OpConstant %59 1
%65 = OpTypeVector %59 3
%66 = OpConstantComposite %65 %60 %61 %62
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %76
%76 = OpLabel
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
%43 = OpAccessChain %37 %18 %29
%44 = OpLoad %10 %43
%45 = OpCompositeConstruct %16 %39 %42 %44
%47 = OpCompositeConstruct %16 %39 %42 %44
%46 = OpImageFetch %19 %36 %47 Lod %41
%48 = OpCompositeExtract %5 %46 0
%49 = OpCompositeExtract %5 %46 1
%50 = OpCompositeExtract %5 %46 2
%51 = OpCompositeExtract %5 %46 3
%52 = OpCompositeConstruct %19 %48 %49 %50 %51
%54 = OpAccessChain %53 %21 %24
OpStore %54 %48
%55 = OpAccessChain %53 %21 %41
OpStore %55 %49
%56 = OpAccessChain %53 %21 %29
OpStore %56 %50
%57 = OpAccessChain %53 %21 %58
OpStore %57 %51
%64 = OpCompositeConstruct %16 %39 %42 %44
%63 = OpImageFetch %19 %36 %64 Lod|ConstOffset %41 %66
%67 = OpCompositeExtract %5 %63 0
%68 = OpCompositeExtract %5 %63 1
%69 = OpCompositeExtract %5 %63 2
%70 = OpCompositeExtract %5 %63 3
%71 = OpCompositeConstruct %19 %67 %68 %69 %70
%72 = OpAccessChain %53 %22 %24
OpStore %72 %67
%73 = OpAccessChain %53 %22 %41
OpStore %73 %68
%74 = OpAccessChain %53 %22 %29
OpStore %74 %69
%75 = OpAccessChain %53 %22 %58
OpStore %75 %70
OpReturn
OpFunctionEnd

