SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability Float16
OpCapability DenormPreserve
OpCapability DenormFlushToZero
OpCapability RoundingModeRTE
OpCapability VulkanMemoryModel
OpExtension "SPV_KHR_float_controls"
%22 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %9 %13
OpExecutionMode %3 LocalSize 1 1 1
OpExecutionMode %3 DenormPreserve 16
OpExecutionMode %3 DenormFlushToZero 32
OpExecutionMode %3 RoundingModeRTE 16
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
%20 = OpTypeFloat 16
%26 = OpConstant %5 1
%33 = OpConstant %5 2
%40 = OpConstant %5 3
%47 = OpConstant %5 4
%52 = OpConstant %5 5
%58 = OpConstant %5 6
%65 = OpConstant %20 0x1p+0
%67 = OpConstant %5 7
%73 = OpConstant %5 8
%79 = OpConstant %5 9
%84 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %93
%93 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpBitcast %18 %17
%21 = OpFConvert %20 %19
%23 = OpExtInst %20 %22 Trunc %21
%24 = OpExtInst %20 %22 FAbs %23
%25 = OpFNegate %20 %24
%27 = OpAccessChain %15 %9 %14 %26
%28 = OpLoad %5 %27
%29 = OpBitcast %18 %28
%30 = OpFConvert %20 %29
%31 = OpFAdd %20 %25 %30
%32 = OpExtInst %20 %22 RoundEven %31
%34 = OpAccessChain %15 %9 %14 %33
%35 = OpLoad %5 %34
%36 = OpBitcast %18 %35
%37 = OpFConvert %20 %36
%38 = OpFSub %20 %32 %37
%39 = OpExtInst %20 %22 Floor %38
%41 = OpAccessChain %15 %9 %14 %40
%42 = OpLoad %5 %41
%43 = OpBitcast %18 %42
%44 = OpFConvert %20 %43
%45 = OpFMul %20 %39 %44
%46 = OpExtInst %20 %22 Ceil %45
%48 = OpAccessChain %15 %9 %14 %47
%49 = OpLoad %5 %48
%50 = OpBitcast %18 %49
%51 = OpFConvert %20 %50
%53 = OpAccessChain %15 %9 %14 %52
%54 = OpLoad %5 %53
%55 = OpBitcast %18 %54
%56 = OpFConvert %20 %55
%57 = OpExtInst %20 %22 Fma %46 %51 %56
%59 = OpAccessChain %15 %9 %14 %58
%60 = OpLoad %5 %59
%61 = OpBitcast %18 %60
%62 = OpFConvert %20 %61
%63 = OpFDiv %20 %57 %62
%64 = OpFDiv %20 %65 %63
%66 = OpExtInst %20 %22 Fract %64
%68 = OpAccessChain %15 %9 %14 %67
%69 = OpLoad %5 %68
%70 = OpBitcast %18 %69
%71 = OpFConvert %20 %70
%72 = OpExtInst %20 %22 NMin %66 %71
%74 = OpAccessChain %15 %9 %14 %73
%75 = OpLoad %5 %74
%76 = OpBitcast %18 %75
%77 = OpFConvert %20 %76
%78 = OpExtInst %20 %22 NMax %72 %77
%80 = OpAccessChain %15 %9 %14 %79
%81 = OpLoad %5 %80
%82 = OpBitcast %18 %81
%83 = OpFConvert %20 %82
%85 = OpAccessChain %15 %9 %14 %84
%86 = OpLoad %5 %85
%87 = OpBitcast %18 %86
%88 = OpFConvert %20 %87
%89 = OpExtInst %20 %22 NClamp %78 %83 %88
%90 = OpFConvert %18 %89
%91 = OpBitcast %5 %90
%92 = OpAccessChain %15 %13 %14 %14
OpStore %92 %91 NonPrivatePointer
OpReturn
OpFunctionEnd

