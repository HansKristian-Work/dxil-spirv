SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 81
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %18 %19 %22 %24 %25 %26 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LOD_BIAS"
OpName %18 "LOD_CLAMP"
OpName %19 "LAYER"
OpName %22 "TEXCOORD_2"
OpName %24 "SV_TARGET"
OpName %25 "SV_TARGET_1"
OpName %26 "SV_TARGET_2"
OpName %27 "SV_TARGET_3"
OpName %46 "SparseTexel"
OpName %55 ""
OpName %59 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %18 Location 1
OpDecorate %18 Component 2
OpDecorate %19 Location 1
OpDecorate %19 Component 3
OpDecorate %22 Location 2
OpDecorate %24 Location 0
OpDecorate %25 Location 1
OpDecorate %26 Location 2
OpDecorate %27 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 1 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeSampler
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypeVector %5 3
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypePointer Input %5
%16 = OpVariable %15 Input
%17 = OpVariable %15 Input
%18 = OpVariable %15 Input
%19 = OpVariable %15 Input
%20 = OpTypeVector %5 2
%21 = OpTypePointer Input %20
%22 = OpVariable %21 Input
%23 = OpTypePointer Output %5
%24 = OpVariable %23 Output
%25 = OpVariable %23 Output
%26 = OpVariable %23 Output
%27 = OpVariable %23 Output
%31 = OpTypeInt 32 0
%32 = OpConstant %31 0
%35 = OpConstant %31 1
%42 = OpTypeSampledImage %6
%44 = OpConstant %5 0
%45 = OpTypeVector %5 4
%46 = OpTypeStruct %31 %45
%55 = OpTypeStruct %5 %5 %5 %5 %31
%59 = OpTypeStruct %31 %5
%61 = OpTypeBool
%64 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %79
%79 = OpLabel
%28 = OpLoad %6 %8
%29 = OpLoad %9 %11
%30 = OpAccessChain %15 %14 %32
%33 = OpLoad %5 %30
%34 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %34
%39 = OpLoad %5 %19
%43 = OpSampledImage %42 %28 %29
%48 = OpCompositeConstruct %12 %33 %36 %39
%47 = OpImageSparseSampleImplicitLod %46 %43 %48 None
%49 = OpCompositeExtract %31 %47 0
%50 = OpCompositeExtract %45 %47 1
%51 = OpCompositeExtract %5 %50 0
%52 = OpCompositeExtract %5 %50 1
%53 = OpCompositeExtract %5 %50 2
%54 = OpCompositeExtract %5 %50 3
%56 = OpCompositeConstruct %55 %51 %52 %53 %54 %49
%57 = OpCompositeExtract %31 %56 4
%58 = OpCompositeExtract %5 %56 0
OpStore %24 %58
%62 = OpImageSparseTexelsResident %61 %57
%63 = OpSelect %5 %62 %64 %44
OpStore %25 %63
%66 = OpCompositeConstruct %12 %33 %36 %39
%65 = OpImageSparseSampleExplicitLod %46 %43 %66 Lod %44
%67 = OpCompositeExtract %31 %65 0
%68 = OpCompositeExtract %45 %65 1
%69 = OpCompositeExtract %5 %68 0
%70 = OpCompositeExtract %5 %68 1
%71 = OpCompositeExtract %5 %68 2
%72 = OpCompositeExtract %5 %68 3
%73 = OpCompositeConstruct %55 %69 %70 %71 %72 %67
%74 = OpCompositeExtract %31 %73 4
%75 = OpCompositeExtract %5 %73 0
OpStore %26 %75
%77 = OpImageSparseTexelsResident %61 %74
%78 = OpSelect %5 %77 %64 %44
OpStore %27 %78
OpReturn
OpFunctionEnd

