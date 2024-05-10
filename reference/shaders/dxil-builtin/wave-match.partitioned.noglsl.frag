; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 85
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability ImageBuffer
OpCapability GroupNonUniformBallot
OpCapability GroupNonUniformPartitionedNV
OpExtension "SPV_NV_shader_subgroup_partitioned"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %83
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "THR"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 DescriptorSet 0
OpDecorate %11 Binding 0
OpDecorate %11 NonReadable
OpDecorate %13 Flat
OpDecorate %13 Location 0
OpDecorate %83 BuiltIn HelperInvocation
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeImage %5 Buffer 0 0 0 2 R32ui
%10 = OpTypePointer UniformConstant %9
%11 = OpVariable %10 UniformConstant
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%17 = OpTypeVector %5 4
%21 = OpTypeBool
%25 = OpConstant %5 3
%33 = OpTypeFloat 32
%52 = OpConstant %5 20
%53 = OpConstant %33 0
%54 = OpConstant %33 1
%71 = OpConstant %5 4
%75 = OpConstant %5 1
%78 = OpConstant %5 2
%82 = OpTypePointer Input %21
%83 = OpVariable %82 Input
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %81
%81 = OpLabel
%14 = OpLoad %9 %11
%15 = OpLoad %6 %8
%16 = OpLoad %5 %13
%18 = OpImageFetch %17 %15 %16
%19 = OpCompositeExtract %5 %18 0
%20 = OpGroupNonUniformPartitionNV %17 %19
%22 = OpLoad %21 %83
%23 = OpLogicalNot %21 %22
%24 = OpGroupNonUniformBallot %17 %25 %23
%26 = OpBitwiseAnd %17 %20 %24
%27 = OpCompositeExtract %5 %26 0
%28 = OpCompositeExtract %5 %26 1
%29 = OpCompositeExtract %5 %26 2
%30 = OpCompositeExtract %5 %26 3
%31 = OpImageFetch %17 %15 %16
%32 = OpCompositeExtract %5 %31 0
%34 = OpBitcast %33 %32
%35 = OpBitcast %5 %34
%36 = OpGroupNonUniformPartitionNV %17 %35
%37 = OpLoad %21 %83
%38 = OpLogicalNot %21 %37
%39 = OpGroupNonUniformBallot %17 %25 %38
%40 = OpBitwiseAnd %17 %36 %39
%41 = OpCompositeExtract %5 %40 0
%42 = OpCompositeExtract %5 %40 1
%43 = OpCompositeExtract %5 %40 2
%44 = OpCompositeExtract %5 %40 3
%45 = OpBitwiseOr %5 %41 %27
%46 = OpBitwiseOr %5 %42 %28
%47 = OpBitwiseOr %5 %43 %29
%48 = OpBitwiseOr %5 %44 %30
%49 = OpImageFetch %17 %15 %16
%50 = OpCompositeExtract %5 %49 0
%51 = OpINotEqual %21 %50 %52
%55 = OpSelect %33 %51 %54 %53
%56 = OpBitcast %5 %55
%57 = OpGroupNonUniformPartitionNV %17 %56
%58 = OpLoad %21 %83
%59 = OpLogicalNot %21 %58
%60 = OpGroupNonUniformBallot %17 %25 %59
%61 = OpBitwiseAnd %17 %57 %60
%62 = OpCompositeExtract %5 %61 0
%63 = OpCompositeExtract %5 %61 1
%64 = OpCompositeExtract %5 %61 2
%65 = OpCompositeExtract %5 %61 3
%66 = OpBitwiseOr %5 %45 %62
%67 = OpBitwiseOr %5 %46 %63
%68 = OpBitwiseOr %5 %47 %64
%69 = OpBitwiseOr %5 %48 %65
%70 = OpIMul %5 %16 %71
%72 = OpCompositeConstruct %17 %66 %66 %66 %66
OpImageWrite %14 %70 %72
%73 = OpCompositeConstruct %17 %67 %67 %67 %67
%74 = OpIAdd %5 %70 %75
OpImageWrite %14 %74 %73
%76 = OpCompositeConstruct %17 %68 %68 %68 %68
%77 = OpIAdd %5 %70 %78
OpImageWrite %14 %77 %76
%79 = OpCompositeConstruct %17 %69 %69 %69 %69
%80 = OpIAdd %5 %70 %25
OpImageWrite %14 %80 %79
OpReturn
OpFunctionEnd

