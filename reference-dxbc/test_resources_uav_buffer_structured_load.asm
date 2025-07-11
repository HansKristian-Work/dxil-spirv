SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_ADDRESS"
OpName %14 "SV_TARGET"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeVector %5 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %10
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %5 0
%20 = OpConstant %5 1
%24 = OpConstant %5 4
%26 = OpConstant %5 20
%28 = OpTypePointer StorageBuffer %5
%38 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %41
%41 = OpLabel
%16 = OpAccessChain %15 %12 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %15 %12 %20
%21 = OpLoad %5 %19
%22 = OpCompositeConstruct %10 %18 %21
%23 = OpIMul %5 %24 %21
%25 = OpIMul %5 %18 %26
%27 = OpIAdd %5 %25 %21
%29 = OpAccessChain %28 %9 %17 %27
%30 = OpLoad %5 %29 NonPrivatePointer
%32 = OpIAdd %5 %27 %20
%31 = OpAccessChain %28 %9 %17 %32
%33 = OpLoad %5 %31 NonPrivatePointer
%34 = OpCompositeConstruct %10 %30 %33
%35 = OpCompositeExtract %5 %34 0
%36 = OpCompositeExtract %5 %34 1
%37 = OpCompositeConstruct %10 %35 %36
%39 = OpAccessChain %38 %14 %17
OpStore %39 %35
%40 = OpAccessChain %38 %14 %20
OpStore %40 %36
OpReturn
OpFunctionEnd

