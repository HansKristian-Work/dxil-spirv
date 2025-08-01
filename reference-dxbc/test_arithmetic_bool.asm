SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 69
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
%18 = OpTypeBool
%20 = OpConstant %5 1
%27 = OpConstant %5 2
%31 = OpConstant %5 3
%38 = OpConstant %5 4
%42 = OpConstant %5 5
%49 = OpConstant %5 6
%53 = OpConstant %5 7
%60 = OpConstant %5 8
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %67
%67 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpINotEqual %18 %14 %17
%21 = OpAccessChain %15 %9 %14 %20
%22 = OpLoad %5 %21
%23 = OpINotEqual %18 %14 %22
%24 = OpLogicalAnd %18 %19 %23
%25 = OpSelect %5 %24 %20 %14
%26 = OpAccessChain %15 %13 %14 %14
OpStore %26 %25 NonPrivatePointer
%28 = OpAccessChain %15 %9 %14 %27
%29 = OpLoad %5 %28
%30 = OpINotEqual %18 %14 %29
%32 = OpAccessChain %15 %9 %14 %31
%33 = OpLoad %5 %32
%34 = OpINotEqual %18 %14 %33
%35 = OpLogicalOr %18 %30 %34
%36 = OpSelect %5 %35 %20 %14
%37 = OpAccessChain %15 %13 %14 %20
OpStore %37 %36 NonPrivatePointer
%39 = OpAccessChain %15 %9 %14 %38
%40 = OpLoad %5 %39
%41 = OpINotEqual %18 %14 %40
%43 = OpAccessChain %15 %9 %14 %42
%44 = OpLoad %5 %43
%45 = OpINotEqual %18 %14 %44
%46 = OpLogicalEqual %18 %41 %45
%47 = OpSelect %5 %46 %20 %14
%48 = OpAccessChain %15 %13 %14 %27
OpStore %48 %47 NonPrivatePointer
%50 = OpAccessChain %15 %9 %14 %49
%51 = OpLoad %5 %50
%52 = OpINotEqual %18 %14 %51
%54 = OpAccessChain %15 %9 %14 %53
%55 = OpLoad %5 %54
%56 = OpINotEqual %18 %14 %55
%57 = OpLogicalNotEqual %18 %52 %56
%58 = OpSelect %5 %57 %20 %14
%59 = OpAccessChain %15 %13 %14 %31
OpStore %59 %58 NonPrivatePointer
%61 = OpAccessChain %15 %9 %14 %60
%62 = OpLoad %5 %61
%63 = OpINotEqual %18 %14 %62
%64 = OpLogicalNot %18 %63
%65 = OpSelect %5 %64 %20 %14
%66 = OpAccessChain %15 %13 %14 %38
OpStore %66 %65 NonPrivatePointer
OpReturn
OpFunctionEnd

