SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
OpCapability Shader
OpCapability SampledCubeArray
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
%6 = OpTypeImage %5 Cube 0 1 0 1 Unknown
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
%42 = OpTypeSampledImage %6
%51 = OpTypePointer Output %5
%56 = OpConstant %31 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
%28 = OpLoad %6 %8
%29 = OpLoad %9 %11
%30 = OpAccessChain %15 %14 %32
%33 = OpLoad %5 %30
%34 = OpAccessChain %15 %14 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %15 %14 %38
%39 = OpLoad %5 %37
%40 = OpCompositeConstruct %12 %33 %36 %39
%41 = OpLoad %5 %17
%43 = OpSampledImage %42 %28 %29
%44 = OpCompositeConstruct %22 %33 %36 %39 %41
%45 = OpImageGather %22 %43 %44 %32
%46 = OpCompositeExtract %5 %45 0
%47 = OpCompositeExtract %5 %45 1
%48 = OpCompositeExtract %5 %45 2
%49 = OpCompositeExtract %5 %45 3
%50 = OpCompositeConstruct %22 %46 %47 %48 %49
%52 = OpAccessChain %51 %24 %32
OpStore %52 %46
%53 = OpAccessChain %51 %24 %35
OpStore %53 %47
%54 = OpAccessChain %51 %24 %38
OpStore %54 %48
%55 = OpAccessChain %51 %24 %56
OpStore %55 %49
%57 = OpCompositeConstruct %22 %33 %36 %39 %41
%58 = OpImageGather %22 %43 %57 %35
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%61 = OpCompositeExtract %5 %58 2
%62 = OpCompositeExtract %5 %58 3
%63 = OpCompositeConstruct %22 %59 %60 %61 %62
%64 = OpAccessChain %51 %25 %32
OpStore %64 %59
%65 = OpAccessChain %51 %25 %35
OpStore %65 %60
%66 = OpAccessChain %51 %25 %38
OpStore %66 %61
%67 = OpAccessChain %51 %25 %56
OpStore %67 %62
%68 = OpCompositeConstruct %22 %33 %36 %39 %41
%69 = OpImageGather %22 %43 %68 %38
%70 = OpCompositeExtract %5 %69 0
%71 = OpCompositeExtract %5 %69 1
%72 = OpCompositeExtract %5 %69 2
%73 = OpCompositeExtract %5 %69 3
%74 = OpCompositeConstruct %22 %70 %71 %72 %73
%75 = OpAccessChain %51 %26 %32
OpStore %75 %70
%76 = OpAccessChain %51 %26 %35
OpStore %76 %71
%77 = OpAccessChain %51 %26 %38
OpStore %77 %72
%78 = OpAccessChain %51 %26 %56
OpStore %78 %73
%79 = OpCompositeConstruct %22 %33 %36 %39 %41
%80 = OpImageGather %22 %43 %79 %56
%81 = OpCompositeExtract %5 %80 0
%82 = OpCompositeExtract %5 %80 1
%83 = OpCompositeExtract %5 %80 2
%84 = OpCompositeExtract %5 %80 3
%85 = OpCompositeConstruct %22 %81 %82 %83 %84
%86 = OpAccessChain %51 %27 %32
OpStore %86 %81
%87 = OpAccessChain %51 %27 %35
OpStore %87 %82
%88 = OpAccessChain %51 %27 %38
OpStore %88 %83
%89 = OpAccessChain %51 %27 %56
OpStore %89 %84
OpReturn
OpFunctionEnd

