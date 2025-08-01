SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 74
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %16 %18 %20 %22 %23 %25
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %13 "SSBO"
OpName %18 "BUFFER_INDEX"
OpName %20 "BUFFER_ADDRESS"
OpName %22 "SV_TARGET"
OpName %23 "SV_TARGET_1"
OpName %25 "SV_TARGET_3"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %12 ArrayStride 8
OpMemberDecorate %13 0 Offset 0
OpDecorate %13 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Aliased
OpDecorate %16 DescriptorSet 0
OpDecorate %16 Binding 0
OpDecorate %16 NonWritable
OpDecorate %16 Aliased
OpDecorate %18 Flat
OpDecorate %18 Location 0
OpDecorate %18 Component 2
OpDecorate %20 Flat
OpDecorate %20 Location 0
OpDecorate %22 Location 0
OpDecorate %23 Location 1
OpDecorate %25 Location 3
OpDecorate %26 NonUniform
OpDecorate %28 NonUniform
OpDecorate %30 NonUniform
OpDecorate %46 NonUniform
OpDecorate %53 NonUniform
OpDecorate %55 NonUniform
OpDecorate %70 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeVector %5 2
%12 = OpTypeRuntimeArray %11
%13 = OpTypeStruct %12
%14 = OpTypeRuntimeArray %13
%15 = OpTypePointer StorageBuffer %14
%16 = OpVariable %15 StorageBuffer
%17 = OpTypePointer Input %5
%18 = OpVariable %17 Input
%19 = OpTypePointer Input %11
%20 = OpVariable %19 Input
%21 = OpTypePointer Output %11
%22 = OpVariable %21 Output
%23 = OpVariable %21 Output
%24 = OpTypePointer Output %5
%25 = OpVariable %24 Output
%27 = OpTypePointer StorageBuffer %7
%29 = OpTypePointer StorageBuffer %13
%32 = OpConstant %5 0
%35 = OpConstant %5 4
%37 = OpConstant %5 2
%39 = OpConstant %5 16
%41 = OpConstant %5 8
%44 = OpConstant %5 1
%45 = OpTypePointer StorageBuffer %11
%51 = OpConstant %5 7
%52 = OpTypePointer StorageBuffer %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %72
%72 = OpLabel
%26 = OpLoad %5 %18
%28 = OpAccessChain %27 %10 %26
%30 = OpAccessChain %29 %16 %26
%31 = OpAccessChain %17 %20 %32
%33 = OpLoad %5 %31
%34 = OpIMul %5 %33 %35
%38 = OpIMul %5 %39 %33
%42 = OpIMul %5 %33 %37
%43 = OpIAdd %5 %42 %44
%46 = OpAccessChain %45 %30 %32 %43
%47 = OpLoad %11 %46 NonPrivatePointer
%48 = OpCompositeExtract %5 %47 0
%49 = OpCompositeExtract %5 %47 1
%53 = OpAccessChain %52 %28 %32 %51
%54 = OpLoad %5 %53 NonPrivatePointer
%56 = OpIAdd %5 %51 %44
%55 = OpAccessChain %52 %28 %32 %56
%57 = OpLoad %5 %55 NonPrivatePointer
%58 = OpCompositeConstruct %11 %54 %57
%59 = OpCompositeExtract %5 %58 0
%60 = OpCompositeExtract %5 %58 1
%62 = OpAccessChain %24 %22 %32
OpStore %62 %48
%63 = OpAccessChain %24 %22 %44
OpStore %63 %49
%64 = OpAccessChain %24 %23 %32
OpStore %64 %59
%65 = OpAccessChain %24 %23 %44
OpStore %65 %60
%66 = OpIMul %5 %39 %33
%68 = OpIMul %5 %33 %35
%69 = OpIAdd %5 %68 %37
%70 = OpAccessChain %52 %28 %32 %69
%71 = OpLoad %5 %70 NonPrivatePointer
OpStore %25 %71
OpReturn
OpFunctionEnd

