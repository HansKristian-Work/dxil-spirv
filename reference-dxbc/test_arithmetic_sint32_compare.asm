SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 62
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
%18 = OpConstant %5 1
%21 = OpTypeBool
%30 = OpConstant %5 2
%34 = OpConstant %5 3
%38 = OpConstant %5 4
%42 = OpConstant %5 5
%46 = OpConstant %5 6
%50 = OpConstant %5 7
%54 = OpConstant %5 8
%58 = OpConstant %5 9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %60
%60 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpAccessChain %15 %9 %14 %18
%20 = OpLoad %5 %19
%22 = OpIEqual %21 %17 %20
%23 = OpSelect %5 %22 %18 %14
%24 = OpAccessChain %15 %13 %14 %14
OpStore %24 %23 NonPrivatePointer
%25 = OpINotEqual %21 %17 %20
%26 = OpSelect %5 %25 %18 %14
%27 = OpAccessChain %15 %13 %14 %18
OpStore %27 %26 NonPrivatePointer
%28 = OpSLessThan %21 %17 %20
%29 = OpSelect %5 %28 %18 %14
%31 = OpAccessChain %15 %13 %14 %30
OpStore %31 %29 NonPrivatePointer
%32 = OpSLessThanEqual %21 %17 %20
%33 = OpSelect %5 %32 %18 %14
%35 = OpAccessChain %15 %13 %14 %34
OpStore %35 %33 NonPrivatePointer
%36 = OpSGreaterThan %21 %17 %20
%37 = OpSelect %5 %36 %18 %14
%39 = OpAccessChain %15 %13 %14 %38
OpStore %39 %37 NonPrivatePointer
%40 = OpSGreaterThanEqual %21 %17 %20
%41 = OpSelect %5 %40 %18 %14
%43 = OpAccessChain %15 %13 %14 %42
OpStore %43 %41 NonPrivatePointer
%44 = OpULessThan %21 %17 %20
%45 = OpSelect %5 %44 %18 %14
%47 = OpAccessChain %15 %13 %14 %46
OpStore %47 %45 NonPrivatePointer
%48 = OpULessThanEqual %21 %17 %20
%49 = OpSelect %5 %48 %18 %14
%51 = OpAccessChain %15 %13 %14 %50
OpStore %51 %49 NonPrivatePointer
%52 = OpUGreaterThan %21 %17 %20
%53 = OpSelect %5 %52 %18 %14
%55 = OpAccessChain %15 %13 %14 %54
OpStore %55 %53 NonPrivatePointer
%56 = OpUGreaterThanEqual %21 %17 %20
%57 = OpSelect %5 %56 %18 %14
%59 = OpAccessChain %15 %13 %14 %58
OpStore %59 %57 NonPrivatePointer
OpReturn
OpFunctionEnd

