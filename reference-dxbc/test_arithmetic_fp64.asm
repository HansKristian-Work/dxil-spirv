SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 90
; Schema: 0
OpCapability Shader
OpCapability Float64
OpCapability DenormPreserve
OpCapability DenormFlushToZero
OpCapability RoundingModeRTE
OpCapability VulkanMemoryModel
OpExtension "SPV_KHR_float_controls"
%22 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %9 %13
OpExecutionMode %3 LocalSize 1 1 1
OpExecutionMode %3 DenormFlushToZero 32
OpExecutionMode %3 DenormPreserve 64
OpExecutionMode %3 RoundingModeRTE 32
OpExecutionMode %3 RoundingModeRTE 64
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
%25 = OpConstant %5 1
%31 = OpConstant %5 2
%37 = OpConstant %5 3
%43 = OpConstant %5 4
%48 = OpConstant %5 5
%54 = OpConstant %5 6
%61 = OpConstant %20 1
%62 = OpConstant %5 7
%68 = OpConstant %5 8
%74 = OpConstant %5 9
%79 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %88
%88 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpBitcast %18 %17
%21 = OpFConvert %20 %19
%23 = OpExtInst %20 %22 FAbs %21
%24 = OpFNegate %20 %23
%26 = OpAccessChain %15 %9 %14 %25
%27 = OpLoad %5 %26
%28 = OpBitcast %18 %27
%29 = OpFConvert %20 %28
%30 = OpFAdd %20 %24 %29
%32 = OpAccessChain %15 %9 %14 %31
%33 = OpLoad %5 %32
%34 = OpBitcast %18 %33
%35 = OpFConvert %20 %34
%36 = OpFSub %20 %30 %35
%38 = OpAccessChain %15 %9 %14 %37
%39 = OpLoad %5 %38
%40 = OpBitcast %18 %39
%41 = OpFConvert %20 %40
%42 = OpFMul %20 %36 %41
%44 = OpAccessChain %15 %9 %14 %43
%45 = OpLoad %5 %44
%46 = OpBitcast %18 %45
%47 = OpFConvert %20 %46
%49 = OpAccessChain %15 %9 %14 %48
%50 = OpLoad %5 %49
%51 = OpBitcast %18 %50
%52 = OpFConvert %20 %51
%53 = OpExtInst %20 %22 Fma %42 %47 %52
%55 = OpAccessChain %15 %9 %14 %54
%56 = OpLoad %5 %55
%57 = OpBitcast %18 %56
%58 = OpFConvert %20 %57
%59 = OpFDiv %20 %53 %58
%60 = OpFDiv %20 %61 %59
%63 = OpAccessChain %15 %9 %14 %62
%64 = OpLoad %5 %63
%65 = OpBitcast %18 %64
%66 = OpFConvert %20 %65
%67 = OpExtInst %20 %22 NMin %60 %66
%69 = OpAccessChain %15 %9 %14 %68
%70 = OpLoad %5 %69
%71 = OpBitcast %18 %70
%72 = OpFConvert %20 %71
%73 = OpExtInst %20 %22 NMax %67 %72
%75 = OpAccessChain %15 %9 %14 %74
%76 = OpLoad %5 %75
%77 = OpBitcast %18 %76
%78 = OpFConvert %20 %77
%80 = OpAccessChain %15 %9 %14 %79
%81 = OpLoad %5 %80
%82 = OpBitcast %18 %81
%83 = OpFConvert %20 %82
%84 = OpExtInst %20 %22 NClamp %73 %78 %83
%85 = OpFConvert %18 %84
%86 = OpBitcast %5 %85
%87 = OpAccessChain %15 %13 %14 %14
OpStore %87 %86 NonPrivatePointer
OpReturn
OpFunctionEnd

