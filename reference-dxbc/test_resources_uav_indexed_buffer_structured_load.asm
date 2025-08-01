SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 96
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %12 %15 %17 %18 %21 %23
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpName %17 "SV_TARGET"
OpName %18 "SV_TARGET_1"
OpName %21 "SV_TARGET_2"
OpName %23 "SV_TARGET_3"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %17 Location 0
OpDecorate %18 Location 1
OpDecorate %21 Location 2
OpDecorate %23 Location 3
OpDecorate %24 NonUniform
OpDecorate %26 NonUniform
OpDecorate %43 NonUniform
OpDecorate %45 NonUniform
OpDecorate %53 NonUniform
OpDecorate %55 NonUniform
OpDecorate %67 NonUniform
OpDecorate %69 NonUniform
OpDecorate %72 NonUniform
OpDecorate %76 NonUniform
OpDecorate %92 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypePointer Input %5
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 2
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Output %13
%17 = OpVariable %16 Output
%18 = OpVariable %16 Output
%19 = OpTypeVector %5 4
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpTypePointer Output %5
%23 = OpVariable %22 Output
%25 = OpTypePointer StorageBuffer %7
%28 = OpConstant %5 0
%31 = OpConstant %5 1
%35 = OpConstant %5 7
%36 = OpConstant %5 3
%38 = OpConstant %5 4
%40 = OpConstant %5 20
%42 = OpTypePointer StorageBuffer %5
%52 = OpConstant %5 143
%66 = OpConstant %5 331
%74 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %94
%94 = OpLabel
%24 = OpLoad %5 %12
%26 = OpAccessChain %25 %10 %24
%27 = OpAccessChain %11 %15 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %11 %15 %31
%32 = OpLoad %5 %30
%39 = OpIMul %5 %29 %40
%41 = OpIAdd %5 %39 %32
%43 = OpAccessChain %42 %26 %28 %41
%44 = OpLoad %5 %43 NonPrivatePointer
%46 = OpIAdd %5 %41 %31
%45 = OpAccessChain %42 %26 %28 %46
%47 = OpLoad %5 %45 NonPrivatePointer
%48 = OpCompositeConstruct %13 %44 %47
%49 = OpCompositeExtract %5 %48 0
%50 = OpCompositeExtract %5 %48 1
%53 = OpAccessChain %42 %26 %28 %52
%54 = OpLoad %5 %53 NonPrivatePointer
%56 = OpIAdd %5 %52 %31
%55 = OpAccessChain %42 %26 %28 %56
%57 = OpLoad %5 %55 NonPrivatePointer
%58 = OpCompositeConstruct %13 %54 %57
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%62 = OpAccessChain %22 %17 %28
OpStore %62 %49
%63 = OpAccessChain %22 %17 %31
OpStore %63 %50
%64 = OpAccessChain %22 %18 %28
OpStore %64 %59
%65 = OpAccessChain %22 %18 %31
OpStore %65 %60
%67 = OpAccessChain %42 %26 %28 %66
%68 = OpLoad %5 %67 NonPrivatePointer
%70 = OpIAdd %5 %66 %31
%69 = OpAccessChain %42 %26 %28 %70
%71 = OpLoad %5 %69 NonPrivatePointer
%73 = OpIAdd %5 %66 %74
%72 = OpAccessChain %42 %26 %28 %73
%75 = OpLoad %5 %72 NonPrivatePointer
%77 = OpIAdd %5 %66 %36
%76 = OpAccessChain %42 %26 %28 %77
%78 = OpLoad %5 %76 NonPrivatePointer
%79 = OpCompositeConstruct %19 %68 %71 %75 %78
%80 = OpCompositeExtract %5 %79 0
%81 = OpCompositeExtract %5 %79 1
%82 = OpCompositeExtract %5 %79 2
%83 = OpCompositeExtract %5 %79 3
%85 = OpAccessChain %22 %21 %28
OpStore %85 %80
%86 = OpAccessChain %22 %21 %31
OpStore %86 %81
%87 = OpAccessChain %22 %21 %74
OpStore %87 %82
%88 = OpAccessChain %22 %21 %36
OpStore %88 %83
%90 = OpIMul %5 %29 %40
%91 = OpIAdd %5 %90 %32
%92 = OpAccessChain %42 %26 %28 %91
%93 = OpLoad %5 %92 NonPrivatePointer
OpStore %23 %93
OpReturn
OpFunctionEnd

