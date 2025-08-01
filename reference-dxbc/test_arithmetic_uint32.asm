SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 105
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
%40 = OpExtInstImport "GLSL.std.450"
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
%22 = OpConstant %5 2
%26 = OpConstant %5 3
%31 = OpConstant %5 4
%35 = OpConstant %5 5
%42 = OpConstant %5 6
%46 = OpConstant %5 7
%50 = OpConstant %5 8
%54 = OpConstant %5 9
%58 = OpConstant %5 10
%62 = OpConstant %5 11
%66 = OpConstant %5 12
%70 = OpConstant %5 13
%74 = OpConstant %5 14
%77 = OpConstant %5 15
%81 = OpConstant %5 16
%84 = OpConstant %5 17
%87 = OpConstant %5 18
%91 = OpConstant %5 19
%94 = OpConstant %5 20
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %103
%103 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpAccessChain %15 %9 %14 %18
%20 = OpLoad %5 %19
%21 = OpBitwiseAnd %5 %17 %20
%23 = OpAccessChain %15 %9 %14 %22
%24 = OpLoad %5 %23
%25 = OpBitwiseOr %5 %21 %24
%27 = OpAccessChain %15 %9 %14 %26
%28 = OpLoad %5 %27
%29 = OpBitwiseXor %5 %25 %28
%30 = OpNot %5 %29
%32 = OpAccessChain %15 %9 %14 %31
%33 = OpLoad %5 %32
%34 = OpIAdd %5 %30 %33
%36 = OpAccessChain %15 %9 %14 %35
%37 = OpLoad %5 %36
%38 = OpISub %5 %34 %37
%39 = OpSNegate %5 %38
%41 = OpExtInst %5 %40 SAbs %39
%43 = OpAccessChain %15 %9 %14 %42
%44 = OpLoad %5 %43
%45 = OpIMul %5 %41 %44
%47 = OpAccessChain %15 %9 %14 %46
%48 = OpLoad %5 %47
%49 = OpShiftLeftLogical %5 %45 %48
%51 = OpAccessChain %15 %9 %14 %50
%52 = OpLoad %5 %51
%53 = OpShiftRightArithmetic %5 %49 %52
%55 = OpAccessChain %15 %9 %14 %54
%56 = OpLoad %5 %55
%57 = OpShiftRightLogical %5 %53 %56
%59 = OpAccessChain %15 %9 %14 %58
%60 = OpLoad %5 %59
%61 = OpUDiv %5 %57 %60
%63 = OpAccessChain %15 %9 %14 %62
%64 = OpLoad %5 %63
%65 = OpUMod %5 %61 %64
%67 = OpAccessChain %15 %9 %14 %66
%68 = OpLoad %5 %67
%69 = OpExtInst %5 %40 UMin %65 %68
%71 = OpAccessChain %15 %9 %14 %70
%72 = OpLoad %5 %71
%73 = OpExtInst %5 %40 UMax %69 %72
%75 = OpAccessChain %15 %9 %14 %74
%76 = OpLoad %5 %75
%78 = OpAccessChain %15 %9 %14 %77
%79 = OpLoad %5 %78
%80 = OpExtInst %5 %40 UClamp %73 %76 %79
%82 = OpAccessChain %15 %9 %14 %81
%83 = OpLoad %5 %82
%85 = OpAccessChain %15 %9 %14 %84
%86 = OpLoad %5 %85
%88 = OpAccessChain %15 %9 %14 %87
%89 = OpLoad %5 %88
%90 = OpBitFieldInsert %5 %80 %83 %86 %89
%92 = OpAccessChain %15 %9 %14 %91
%93 = OpLoad %5 %92
%95 = OpAccessChain %15 %9 %14 %94
%96 = OpLoad %5 %95
%97 = OpBitFieldUExtract %5 %90 %93 %96
%98 = OpBitCount %5 %97
%99 = OpBitReverse %5 %98
%100 = OpExtInst %5 %40 FindILsb %99
%101 = OpExtInst %5 %40 FindUMsb %100
%102 = OpAccessChain %15 %13 %14 %14
OpStore %102 %101 NonPrivatePointer
OpReturn
OpFunctionEnd

