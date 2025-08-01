SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 80
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %10 %14
OpExecutionMode %3 LocalSize 1 1 1
OpName %3 "main"
OpName %8 "SSBO"
OpName %12 "SSBO"
OpName %22 "WideArithResult"
OpDecorate %7 ArrayStride 8
OpMemberDecorate %8 0 Offset 0
OpDecorate %8 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %10 NonWritable
OpDecorate %10 Restrict
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 0
OpDecorate %14 NonReadable
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypeRuntimeArray %6
%8 = OpTypeStruct %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypeRuntimeArray %6
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpConstant %5 0
%16 = OpTypePointer StorageBuffer %6
%22 = OpTypeStruct %5 %5
%31 = OpConstant %5 1
%45 = OpConstant %5 2
%64 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %78
%78 = OpLabel
%17 = OpAccessChain %16 %10 %15 %15
%18 = OpLoad %6 %17
%19 = OpCompositeExtract %5 %18 0
%20 = OpCompositeExtract %5 %18 1
%23 = OpIAddCarry %22 %19 %20
%24 = OpCompositeExtract %5 %23 0
%25 = OpCompositeExtract %5 %23 1
%26 = OpCompositeConstruct %6 %24 %25
%27 = OpCompositeExtract %5 %26 0
%28 = OpCompositeExtract %5 %26 1
%29 = OpCompositeConstruct %6 %27 %28
%30 = OpAccessChain %16 %14 %15 %15
OpStore %30 %29 NonPrivatePointer
%32 = OpAccessChain %16 %10 %15 %31
%33 = OpLoad %6 %32
%34 = OpCompositeExtract %5 %33 0
%35 = OpCompositeExtract %5 %33 1
%37 = OpISubBorrow %22 %34 %35
%38 = OpCompositeExtract %5 %37 0
%39 = OpCompositeExtract %5 %37 1
%40 = OpCompositeConstruct %6 %38 %39
%41 = OpCompositeExtract %5 %40 0
%42 = OpCompositeExtract %5 %40 1
%43 = OpCompositeConstruct %6 %41 %42
%44 = OpAccessChain %16 %14 %15 %31
OpStore %44 %43 NonPrivatePointer
%46 = OpAccessChain %16 %10 %15 %45
%47 = OpLoad %6 %46
%48 = OpCompositeExtract %5 %47 0
%49 = OpCompositeExtract %5 %47 1
%51 = OpBitcast %5 %48
%52 = OpBitcast %5 %49
%53 = OpSMulExtended %22 %51 %52
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%56 = OpCompositeConstruct %6 %54 %55
%57 = OpCompositeExtract %5 %56 0
%58 = OpCompositeExtract %5 %56 1
%59 = OpBitcast %5 %57
%60 = OpBitcast %5 %58
%62 = OpCompositeConstruct %6 %59 %60
%63 = OpAccessChain %16 %14 %15 %45
OpStore %63 %62 NonPrivatePointer
%65 = OpAccessChain %16 %10 %15 %64
%66 = OpLoad %6 %65
%67 = OpCompositeExtract %5 %66 0
%68 = OpCompositeExtract %5 %66 1
%70 = OpUMulExtended %22 %67 %68
%71 = OpCompositeExtract %5 %70 0
%72 = OpCompositeExtract %5 %70 1
%73 = OpCompositeConstruct %6 %71 %72
%74 = OpCompositeExtract %5 %73 0
%75 = OpCompositeExtract %5 %73 1
%76 = OpCompositeConstruct %6 %74 %75
%77 = OpAccessChain %16 %14 %15 %64
OpStore %77 %76 NonPrivatePointer
OpReturn
OpFunctionEnd

