SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability Float64
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
%20 = OpTypeFloat 64
%22 = OpConstant %5 1
%27 = OpTypeBool
%36 = OpConstant %5 2
%40 = OpConstant %5 3
%44 = OpConstant %5 4
%48 = OpConstant %5 5
%52 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpBitcast %18 %17
%21 = OpFConvert %20 %19
%23 = OpAccessChain %15 %9 %14 %22
%24 = OpLoad %5 %23
%25 = OpBitcast %18 %24
%26 = OpFConvert %20 %25
%28 = OpFOrdEqual %27 %21 %26
%29 = OpSelect %5 %28 %22 %14
%30 = OpAccessChain %15 %13 %14 %14
OpStore %30 %29 NonPrivatePointer
%31 = OpFUnordNotEqual %27 %21 %26
%32 = OpSelect %5 %31 %22 %14
%33 = OpAccessChain %15 %13 %14 %22
OpStore %33 %32 NonPrivatePointer
%34 = OpFOrdLessThan %27 %21 %26
%35 = OpSelect %5 %34 %22 %14
%37 = OpAccessChain %15 %13 %14 %36
OpStore %37 %35 NonPrivatePointer
%38 = OpFOrdLessThanEqual %27 %21 %26
%39 = OpSelect %5 %38 %22 %14
%41 = OpAccessChain %15 %13 %14 %40
OpStore %41 %39 NonPrivatePointer
%42 = OpFOrdGreaterThan %27 %21 %26
%43 = OpSelect %5 %42 %22 %14
%45 = OpAccessChain %15 %13 %14 %44
OpStore %45 %43 NonPrivatePointer
%46 = OpFOrdGreaterThanEqual %27 %21 %26
%47 = OpSelect %5 %46 %22 %14
%49 = OpAccessChain %15 %13 %14 %48
OpStore %49 %47 NonPrivatePointer
%50 = OpIsNan %27 %21
%51 = OpSelect %5 %50 %22 %14
%53 = OpAccessChain %15 %13 %14 %52
OpStore %53 %51 NonPrivatePointer
OpReturn
OpFunctionEnd

