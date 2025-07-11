SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 91
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %14 %16 %17 %21 %24 %25 %26 %27
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "TEXCOORD"
OpName %16 "DEPTH_REF"
OpName %17 "LAYER"
OpName %21 "OFFSET"
OpName %24 "SV_TARGET"
OpName %25 "SV_TARGET_1"
OpName %26 "SV_TARGET_2"
OpName %27 "SV_TARGET_3"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %14 Location 0
OpDecorate %16 Location 1
OpDecorate %17 Location 1
OpDecorate %17 Component 1
OpDecorate %21 Flat
OpDecorate %21 Location 2
OpDecorate %24 Location 0
OpDecorate %25 Location 1
OpDecorate %26 Location 2
OpDecorate %27 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Cube 0 0 0 1 Unknown
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
%18 = OpTypeInt 32 1
%19 = OpTypeVector %18 3
%20 = OpTypePointer Input %19
%21 = OpVariable %20 Input
%22 = OpTypeVector %5 4
%23 = OpTypePointer Output %22
%24 = OpVariable %23 Output
%25 = OpVariable %23 Output
%26 = OpVariable %23 Output
%27 = OpVariable %23 Output
%31 = OpTypeInt 32 0
%32 = OpConstant %31 0
%35 = OpConstant %31 1
%38 = OpConstant %31 2
%41 = OpTypeSampledImage %6
%50 = OpTypePointer Output %5
%55 = OpConstant %31 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %89
%89 = OpLabel
%28 = OpLoad %6 %8
%29 = OpLoad %9 %11
%30 = OpAccessChain %15 %14 %32
%33 = OpLoad %5 %30
%34 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %15 %14 %38
%39 = OpLoad %5 %37
%40 = OpCompositeConstruct %12 %33 %36 %39
%42 = OpSampledImage %41 %28 %29
%43 = OpCompositeConstruct %12 %33 %36 %39
%44 = OpImageGather %22 %42 %43 %32
%45 = OpCompositeExtract %5 %44 0
%46 = OpCompositeExtract %5 %44 1
%47 = OpCompositeExtract %5 %44 2
%48 = OpCompositeExtract %5 %44 3
%49 = OpCompositeConstruct %22 %45 %46 %47 %48
%51 = OpAccessChain %50 %24 %32
OpStore %51 %45
%52 = OpAccessChain %50 %24 %35
OpStore %52 %46
%53 = OpAccessChain %50 %24 %38
OpStore %53 %47
%54 = OpAccessChain %50 %24 %55
OpStore %54 %48
%56 = OpCompositeConstruct %12 %33 %36 %39
%57 = OpImageGather %22 %42 %56 %35
%58 = OpCompositeExtract %5 %57 0
%59 = OpCompositeExtract %5 %57 1
%60 = OpCompositeExtract %5 %57 2
%61 = OpCompositeExtract %5 %57 3
%62 = OpCompositeConstruct %22 %58 %59 %60 %61
%63 = OpAccessChain %50 %25 %32
OpStore %63 %58
%64 = OpAccessChain %50 %25 %35
OpStore %64 %59
%65 = OpAccessChain %50 %25 %38
OpStore %65 %60
%66 = OpAccessChain %50 %25 %55
OpStore %66 %61
%67 = OpCompositeConstruct %12 %33 %36 %39
%68 = OpImageGather %22 %42 %67 %38
%69 = OpCompositeExtract %5 %68 0
%70 = OpCompositeExtract %5 %68 1
%71 = OpCompositeExtract %5 %68 2
%72 = OpCompositeExtract %5 %68 3
%73 = OpCompositeConstruct %22 %69 %70 %71 %72
%74 = OpAccessChain %50 %26 %32
OpStore %74 %69
%75 = OpAccessChain %50 %26 %35
OpStore %75 %70
%76 = OpAccessChain %50 %26 %38
OpStore %76 %71
%77 = OpAccessChain %50 %26 %55
OpStore %77 %72
%78 = OpCompositeConstruct %12 %33 %36 %39
%79 = OpImageGather %22 %42 %78 %55
%80 = OpCompositeExtract %5 %79 0
%81 = OpCompositeExtract %5 %79 1
%82 = OpCompositeExtract %5 %79 2
%83 = OpCompositeExtract %5 %79 3
%84 = OpCompositeConstruct %22 %80 %81 %82 %83
%85 = OpAccessChain %50 %27 %32
OpStore %85 %80
%86 = OpAccessChain %50 %27 %35
OpStore %86 %81
%87 = OpAccessChain %50 %27 %38
OpStore %87 %82
%88 = OpAccessChain %50 %27 %55
OpStore %88 %83
OpReturn
OpFunctionEnd

