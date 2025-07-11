SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %12 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "BUFFER_ADDRESS"
OpName %14 "SV_TARGET"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypePointer Input %6
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %5 0
%20 = OpConstant %5 4
%22 = OpConstant %5 2
%24 = OpConstant %5 16
%26 = OpConstant %5 8
%29 = OpConstant %5 1
%30 = OpTypePointer StorageBuffer %6
%36 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%16 = OpAccessChain %15 %12 %17
%18 = OpLoad %5 %16
%19 = OpIMul %5 %18 %20
%23 = OpIMul %5 %24 %18
%27 = OpIMul %5 %18 %22
%28 = OpIAdd %5 %27 %29
%31 = OpAccessChain %30 %10 %17 %28
%32 = OpLoad %6 %31
%33 = OpCompositeExtract %5 %32 0
%34 = OpCompositeExtract %5 %32 1
%37 = OpAccessChain %36 %14 %17
OpStore %37 %33
%38 = OpAccessChain %36 %14 %29
OpStore %38 %34
OpReturn
OpFunctionEnd

