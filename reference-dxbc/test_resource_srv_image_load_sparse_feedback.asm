SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 89
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %15 %17 %18 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "TEXCOORD"
OpName %15 "SV_TARGET"
OpName %17 "SV_TARGET_1"
OpName %18 "SV_TARGET_2"
OpName %19 "SV_TARGET_3"
OpName %30 "SparseTexel"
OpName %39 ""
OpName %47 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 0
OpDecorate %17 Location 1
OpDecorate %18 Location 2
OpDecorate %19 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpTypePointer Output %5
%17 = OpVariable %16 Output
%18 = OpVariable %14 Output
%19 = OpVariable %16 Output
%21 = OpTypePointer Input %9
%23 = OpConstant %9 0
%26 = OpConstant %9 1
%28 = OpTypeVector %9 2
%30 = OpTypeStruct %9 %13
%39 = OpTypeStruct %5 %5 %5 %5 %9
%47 = OpTypeStruct %9 %13
%52 = OpConstant %9 2
%54 = OpConstant %9 3
%55 = OpTypeBool
%58 = OpConstant %5 1
%59 = OpConstant %5 0
%60 = OpTypeInt 32 1
%61 = OpConstant %60 -1
%62 = OpConstant %60 0
%65 = OpTypeVector %60 2
%66 = OpConstantComposite %65 %61 %62
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %87
%87 = OpLabel
%20 = OpLoad %6 %8
%22 = OpAccessChain %21 %12 %23
%24 = OpLoad %9 %22
%25 = OpAccessChain %21 %12 %26
%27 = OpLoad %9 %25
%29 = OpCompositeConstruct %28 %24 %27
%32 = OpCompositeConstruct %28 %24 %27
%31 = OpImageSparseFetch %30 %20 %32 Lod %26
%33 = OpCompositeExtract %9 %31 0
%34 = OpCompositeExtract %13 %31 1
%35 = OpCompositeExtract %5 %34 0
%36 = OpCompositeExtract %5 %34 1
%37 = OpCompositeExtract %5 %34 2
%38 = OpCompositeExtract %5 %34 3
%40 = OpCompositeConstruct %39 %35 %36 %37 %38 %33
%41 = OpCompositeExtract %9 %40 4
%42 = OpCompositeExtract %5 %40 0
%43 = OpCompositeExtract %5 %40 1
%44 = OpCompositeExtract %5 %40 2
%45 = OpCompositeExtract %5 %40 3
%46 = OpCompositeConstruct %13 %42 %43 %44 %45
%48 = OpCompositeConstruct %47 %41 %46
%49 = OpAccessChain %16 %15 %23
OpStore %49 %42
%50 = OpAccessChain %16 %15 %26
OpStore %50 %43
%51 = OpAccessChain %16 %15 %52
OpStore %51 %44
%53 = OpAccessChain %16 %15 %54
OpStore %53 %45
%56 = OpImageSparseTexelsResident %55 %41
%57 = OpSelect %5 %56 %58 %59
OpStore %17 %57
%64 = OpCompositeConstruct %28 %24 %27
%63 = OpImageSparseFetch %30 %20 %64 Lod|ConstOffset %26 %66
%67 = OpCompositeExtract %9 %63 0
%68 = OpCompositeExtract %13 %63 1
%69 = OpCompositeExtract %5 %68 0
%70 = OpCompositeExtract %5 %68 1
%71 = OpCompositeExtract %5 %68 2
%72 = OpCompositeExtract %5 %68 3
%73 = OpCompositeConstruct %39 %69 %70 %71 %72 %67
%74 = OpCompositeExtract %9 %73 4
%75 = OpCompositeExtract %5 %73 0
%76 = OpCompositeExtract %5 %73 1
%77 = OpCompositeExtract %5 %73 2
%78 = OpCompositeExtract %5 %73 3
%79 = OpCompositeConstruct %13 %75 %76 %77 %78
%80 = OpCompositeConstruct %47 %74 %79
%81 = OpAccessChain %16 %18 %23
OpStore %81 %75
%82 = OpAccessChain %16 %18 %26
OpStore %82 %76
%83 = OpAccessChain %16 %18 %52
OpStore %83 %77
%84 = OpAccessChain %16 %18 %54
OpStore %84 %78
%85 = OpImageSparseTexelsResident %55 %74
%86 = OpSelect %5 %85 %58 %59
OpStore %19 %86
OpReturn
OpFunctionEnd

