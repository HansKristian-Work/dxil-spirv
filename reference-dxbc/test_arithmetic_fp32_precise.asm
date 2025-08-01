SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 82
; Schema: 0
OpCapability Shader
OpCapability DenormFlushToZero
OpCapability RoundingModeRTE
OpCapability VulkanMemoryModel
OpExtension "SPV_KHR_float_controls"
%20 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %9 %13
OpExecutionMode %3 LocalSize 1 1 1
OpExecutionMode %3 DenormFlushToZero 32
OpExecutionMode %3 RoundingModeRTE 32
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
%24 = OpConstant %5 1
%30 = OpConstant %5 2
%36 = OpConstant %5 3
%42 = OpConstant %5 4
%46 = OpConstant %5 5
%51 = OpConstant %5 6
%57 = OpConstant %18 1
%59 = OpConstant %5 7
%64 = OpConstant %5 8
%69 = OpConstant %5 9
%73 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %80
%80 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpBitcast %18 %17
%21 = OpExtInst %18 %20 Trunc %19
%22 = OpExtInst %18 %20 FAbs %21
%23 = OpFNegate %18 %22
%25 = OpAccessChain %15 %9 %14 %24
%26 = OpLoad %5 %25
%27 = OpBitcast %18 %26
%28 = OpFAdd %18 %23 %27
%29 = OpExtInst %18 %20 RoundEven %28
%31 = OpAccessChain %15 %9 %14 %30
%32 = OpLoad %5 %31
%33 = OpBitcast %18 %32
%34 = OpFSub %18 %29 %33
%35 = OpExtInst %18 %20 Floor %34
%37 = OpAccessChain %15 %9 %14 %36
%38 = OpLoad %5 %37
%39 = OpBitcast %18 %38
%40 = OpFMul %18 %35 %39
%41 = OpExtInst %18 %20 Ceil %40
%43 = OpAccessChain %15 %9 %14 %42
%44 = OpLoad %5 %43
%45 = OpBitcast %18 %44
%47 = OpAccessChain %15 %9 %14 %46
%48 = OpLoad %5 %47
%49 = OpBitcast %18 %48
%50 = OpExtInst %18 %20 Fma %41 %45 %49
%52 = OpAccessChain %15 %9 %14 %51
%53 = OpLoad %5 %52
%54 = OpBitcast %18 %53
%55 = OpFDiv %18 %50 %54
%56 = OpFDiv %18 %57 %55
%58 = OpExtInst %18 %20 Fract %56
%60 = OpAccessChain %15 %9 %14 %59
%61 = OpLoad %5 %60
%62 = OpBitcast %18 %61
%63 = OpExtInst %18 %20 NMin %58 %62
%65 = OpAccessChain %15 %9 %14 %64
%66 = OpLoad %5 %65
%67 = OpBitcast %18 %66
%68 = OpExtInst %18 %20 NMax %63 %67
%70 = OpAccessChain %15 %9 %14 %69
%71 = OpLoad %5 %70
%72 = OpBitcast %18 %71
%74 = OpAccessChain %15 %9 %14 %73
%75 = OpLoad %5 %74
%76 = OpBitcast %18 %75
%77 = OpExtInst %18 %20 NClamp %68 %72 %76
%78 = OpBitcast %5 %77
%79 = OpAccessChain %15 %13 %14 %14
OpStore %79 %78 NonPrivatePointer
OpReturn
OpFunctionEnd

