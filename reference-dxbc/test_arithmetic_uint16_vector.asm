SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 103
; Schema: 0
OpCapability Shader
OpCapability Int16
OpCapability VulkanMemoryModel
%48 = OpExtInstImport "GLSL.std.450"
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
%18 = OpTypeInt 16 0
%19 = OpTypeVector %18 2
%21 = OpConstant %5 1
%26 = OpConstant %5 2
%31 = OpConstant %5 3
%37 = OpConstant %5 4
%42 = OpConstant %5 5
%50 = OpConstant %5 6
%55 = OpConstant %5 7
%60 = OpConstant %5 8
%65 = OpConstant %5 9
%70 = OpConstant %5 10
%75 = OpConstant %5 11
%80 = OpConstant %5 12
%85 = OpConstant %5 13
%90 = OpConstant %5 14
%94 = OpConstant %5 15
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %101
%101 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%20 = OpBitcast %19 %17
%22 = OpAccessChain %15 %9 %14 %21
%23 = OpLoad %5 %22
%24 = OpBitcast %19 %23
%25 = OpBitwiseAnd %19 %20 %24
%27 = OpAccessChain %15 %9 %14 %26
%28 = OpLoad %5 %27
%29 = OpBitcast %19 %28
%30 = OpBitwiseOr %19 %25 %29
%32 = OpAccessChain %15 %9 %14 %31
%33 = OpLoad %5 %32
%34 = OpBitcast %19 %33
%35 = OpBitwiseXor %19 %30 %34
%36 = OpNot %19 %35
%38 = OpAccessChain %15 %9 %14 %37
%39 = OpLoad %5 %38
%40 = OpBitcast %19 %39
%41 = OpIAdd %19 %36 %40
%43 = OpAccessChain %15 %9 %14 %42
%44 = OpLoad %5 %43
%45 = OpBitcast %19 %44
%46 = OpISub %19 %41 %45
%47 = OpSNegate %19 %46
%49 = OpExtInst %19 %48 SAbs %47
%51 = OpAccessChain %15 %9 %14 %50
%52 = OpLoad %5 %51
%53 = OpBitcast %19 %52
%54 = OpIMul %19 %49 %53
%56 = OpAccessChain %15 %9 %14 %55
%57 = OpLoad %5 %56
%58 = OpBitcast %19 %57
%59 = OpShiftLeftLogical %19 %54 %58
%61 = OpAccessChain %15 %9 %14 %60
%62 = OpLoad %5 %61
%63 = OpBitcast %19 %62
%64 = OpShiftRightArithmetic %19 %59 %63
%66 = OpAccessChain %15 %9 %14 %65
%67 = OpLoad %5 %66
%68 = OpBitcast %19 %67
%69 = OpShiftRightLogical %19 %64 %68
%71 = OpAccessChain %15 %9 %14 %70
%72 = OpLoad %5 %71
%73 = OpBitcast %19 %72
%74 = OpUDiv %19 %69 %73
%76 = OpAccessChain %15 %9 %14 %75
%77 = OpLoad %5 %76
%78 = OpBitcast %19 %77
%79 = OpUMod %19 %74 %78
%81 = OpAccessChain %15 %9 %14 %80
%82 = OpLoad %5 %81
%83 = OpBitcast %19 %82
%84 = OpExtInst %19 %48 UMin %79 %83
%86 = OpAccessChain %15 %9 %14 %85
%87 = OpLoad %5 %86
%88 = OpBitcast %19 %87
%89 = OpExtInst %19 %48 UMax %84 %88
%91 = OpAccessChain %15 %9 %14 %90
%92 = OpLoad %5 %91
%93 = OpBitcast %19 %92
%95 = OpAccessChain %15 %9 %14 %94
%96 = OpLoad %5 %95
%97 = OpBitcast %19 %96
%98 = OpExtInst %19 %48 UClamp %89 %93 %97
%99 = OpBitcast %5 %98
%100 = OpAccessChain %15 %13 %14 %14
OpStore %100 %99 NonPrivatePointer
OpReturn
OpFunctionEnd

