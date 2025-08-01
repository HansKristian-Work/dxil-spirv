SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %9 %13
OpExecutionMode %3 LocalSize 1 1 1
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 NonReadable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpConstant %5 0
%15 = OpTypePointer StorageBuffer %5
%18 = OpTypeFloat 32
%20 = OpConstant %5 1
%24 = OpTypeBool
%33 = OpConstant %5 2
%37 = OpConstant %5 3
%41 = OpConstant %5 4
%45 = OpConstant %5 5
%49 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %51
%51 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpBitcast %18 %17
%21 = OpAccessChain %15 %9 %14 %20
%22 = OpLoad %5 %21
%23 = OpBitcast %18 %22
%25 = OpFOrdEqual %24 %19 %23
%26 = OpSelect %5 %25 %20 %14
%27 = OpAccessChain %15 %13 %14 %14
OpStore %27 %26 NonPrivatePointer
%28 = OpFUnordNotEqual %24 %19 %23
%29 = OpSelect %5 %28 %20 %14
%30 = OpAccessChain %15 %13 %14 %20
OpStore %30 %29 NonPrivatePointer
%31 = OpFOrdLessThan %24 %19 %23
%32 = OpSelect %5 %31 %20 %14
%34 = OpAccessChain %15 %13 %14 %33
OpStore %34 %32 NonPrivatePointer
%35 = OpFOrdLessThanEqual %24 %19 %23
%36 = OpSelect %5 %35 %20 %14
%38 = OpAccessChain %15 %13 %14 %37
OpStore %38 %36 NonPrivatePointer
%39 = OpFOrdGreaterThan %24 %19 %23
%40 = OpSelect %5 %39 %20 %14
%42 = OpAccessChain %15 %13 %14 %41
OpStore %42 %40 NonPrivatePointer
%43 = OpFOrdGreaterThanEqual %24 %19 %23
%44 = OpSelect %5 %43 %20 %14
%46 = OpAccessChain %15 %13 %14 %45
OpStore %46 %44 NonPrivatePointer
%47 = OpIsNan %24 %19
%48 = OpSelect %5 %47 %20 %14
%50 = OpAccessChain %15 %13 %14 %49
OpStore %50 %48 NonPrivatePointer
OpReturn
OpFunctionEnd

