SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 112
; Schema: 0
OpCapability Shader
OpCapability SampledImageArrayDynamicIndexing
OpCapability SampledCubeArray
OpCapability RuntimeDescriptorArray
OpCapability SampledImageArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %15 %19 %22 %24 %25 %29 %32 %33 %34 %35
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
OpName %35 "SV_TARGET_3"
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
OpDecorate %35 Location 3
OpDecorate %46 NonUniform
OpDecorate %49 NonUniform
OpDecorate %52 NonUniform
OpDecorate %63 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 1 0 1 Unknown
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
%33 = OpVariable %31 Output
%34 = OpVariable %31 Output
%35 = OpVariable %31 Output
%37 = OpConstant %10 0
%38 = OpConstant %10 16
%42 = OpConstant %10 2
%43 = OpTypePointer Uniform %5
%47 = OpTypePointer UniformConstant %6
%50 = OpTypePointer UniformConstant %16
%56 = OpConstant %10 1
%62 = OpTypeSampledImage %6
%71 = OpTypePointer Output %5
%76 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %110
%110 = OpLabel
%36 = OpIMul %10 %37 %38
%39 = OpIMul %10 %37 %11
%40 = OpIAdd %10 %36 %39
%41 = OpShiftRightLogical %10 %40 %42
%44 = OpAccessChain %43 %15 %37 %41
%45 = OpLoad %5 %44
%46 = OpBitcast %10 %45
%48 = OpAccessChain %47 %9 %46
%49 = OpLoad %6 %48
%51 = OpAccessChain %50 %19 %46
%52 = OpLoad %16 %51
%53 = OpAccessChain %23 %22 %37
%54 = OpLoad %5 %53
%55 = OpAccessChain %23 %22 %56
%57 = OpLoad %5 %55
%58 = OpAccessChain %23 %22 %42
%59 = OpLoad %5 %58
%61 = OpLoad %5 %25
%63 = OpSampledImage %62 %49 %52
%64 = OpCompositeConstruct %30 %54 %57 %59 %61
%65 = OpImageGather %30 %63 %64 %37
%66 = OpCompositeExtract %5 %65 0
%67 = OpCompositeExtract %5 %65 1
%68 = OpCompositeExtract %5 %65 2
%69 = OpCompositeExtract %5 %65 3
%72 = OpAccessChain %71 %32 %37
OpStore %72 %66
%73 = OpAccessChain %71 %32 %56
OpStore %73 %67
%74 = OpAccessChain %71 %32 %42
OpStore %74 %68
%75 = OpAccessChain %71 %32 %76
OpStore %75 %69
%77 = OpCompositeConstruct %30 %54 %57 %59 %61
%78 = OpImageGather %30 %63 %77 %56
%79 = OpCompositeExtract %5 %78 0
%80 = OpCompositeExtract %5 %78 1
%81 = OpCompositeExtract %5 %78 2
%82 = OpCompositeExtract %5 %78 3
%84 = OpAccessChain %71 %33 %37
OpStore %84 %79
%85 = OpAccessChain %71 %33 %56
OpStore %85 %80
%86 = OpAccessChain %71 %33 %42
OpStore %86 %81
%87 = OpAccessChain %71 %33 %76
OpStore %87 %82
%88 = OpCompositeConstruct %30 %54 %57 %59 %61
%89 = OpImageGather %30 %63 %88 %42
%90 = OpCompositeExtract %5 %89 0
%91 = OpCompositeExtract %5 %89 1
%92 = OpCompositeExtract %5 %89 2
%93 = OpCompositeExtract %5 %89 3
%95 = OpAccessChain %71 %34 %37
OpStore %95 %90
%96 = OpAccessChain %71 %34 %56
OpStore %96 %91
%97 = OpAccessChain %71 %34 %42
OpStore %97 %92
%98 = OpAccessChain %71 %34 %76
OpStore %98 %93
%99 = OpCompositeConstruct %30 %54 %57 %59 %61
%100 = OpImageGather %30 %63 %99 %76
%101 = OpCompositeExtract %5 %100 0
%102 = OpCompositeExtract %5 %100 1
%103 = OpCompositeExtract %5 %100 2
%104 = OpCompositeExtract %5 %100 3
%106 = OpAccessChain %71 %35 %37
OpStore %106 %101
%107 = OpAccessChain %71 %35 %56
OpStore %107 %102
%108 = OpAccessChain %71 %35 %42
OpStore %108 %103
%109 = OpAccessChain %71 %35 %76
OpStore %109 %104
OpReturn
OpFunctionEnd

