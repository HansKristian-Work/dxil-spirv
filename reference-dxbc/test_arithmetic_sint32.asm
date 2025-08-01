SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 117
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
%46 = OpExtInstImport "GLSL.std.450"
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
%19 = OpConstant %5 1
%24 = OpConstant %5 2
%29 = OpConstant %5 3
%35 = OpConstant %5 4
%40 = OpConstant %5 5
%48 = OpConstant %5 6
%53 = OpConstant %5 7
%58 = OpConstant %5 8
%63 = OpConstant %5 9
%68 = OpConstant %5 10
%73 = OpConstant %5 11
%78 = OpConstant %5 12
%82 = OpConstant %5 13
%87 = OpConstant %5 14
%91 = OpConstant %5 15
%95 = OpConstant %5 16
%100 = OpConstant %5 17
%104 = OpConstant %5 18
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %115
%115 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%18 = OpBitcast %5 %17
%20 = OpAccessChain %15 %9 %14 %19
%21 = OpLoad %5 %20
%22 = OpBitcast %5 %21
%23 = OpBitwiseAnd %5 %18 %22
%25 = OpAccessChain %15 %9 %14 %24
%26 = OpLoad %5 %25
%27 = OpBitcast %5 %26
%28 = OpBitwiseOr %5 %23 %27
%30 = OpAccessChain %15 %9 %14 %29
%31 = OpLoad %5 %30
%32 = OpBitcast %5 %31
%33 = OpBitwiseXor %5 %28 %32
%34 = OpNot %5 %33
%36 = OpAccessChain %15 %9 %14 %35
%37 = OpLoad %5 %36
%38 = OpBitcast %5 %37
%39 = OpIAdd %5 %34 %38
%41 = OpAccessChain %15 %9 %14 %40
%42 = OpLoad %5 %41
%43 = OpBitcast %5 %42
%44 = OpISub %5 %39 %43
%45 = OpSNegate %5 %44
%47 = OpExtInst %5 %46 SAbs %45
%49 = OpAccessChain %15 %9 %14 %48
%50 = OpLoad %5 %49
%51 = OpBitcast %5 %50
%52 = OpIMul %5 %47 %51
%54 = OpAccessChain %15 %9 %14 %53
%55 = OpLoad %5 %54
%56 = OpBitcast %5 %55
%57 = OpShiftLeftLogical %5 %52 %56
%59 = OpAccessChain %15 %9 %14 %58
%60 = OpLoad %5 %59
%61 = OpBitcast %5 %60
%62 = OpShiftRightArithmetic %5 %57 %61
%64 = OpAccessChain %15 %9 %14 %63
%65 = OpLoad %5 %64
%66 = OpBitcast %5 %65
%67 = OpShiftRightLogical %5 %62 %66
%69 = OpAccessChain %15 %9 %14 %68
%70 = OpLoad %5 %69
%71 = OpBitcast %5 %70
%72 = OpExtInst %5 %46 SMin %67 %71
%74 = OpAccessChain %15 %9 %14 %73
%75 = OpLoad %5 %74
%76 = OpBitcast %5 %75
%77 = OpExtInst %5 %46 SMax %72 %76
%79 = OpAccessChain %15 %9 %14 %78
%80 = OpLoad %5 %79
%81 = OpBitcast %5 %80
%83 = OpAccessChain %15 %9 %14 %82
%84 = OpLoad %5 %83
%85 = OpBitcast %5 %84
%86 = OpExtInst %5 %46 SClamp %77 %81 %85
%88 = OpAccessChain %15 %9 %14 %87
%89 = OpLoad %5 %88
%90 = OpBitcast %5 %89
%92 = OpAccessChain %15 %9 %14 %91
%93 = OpLoad %5 %92
%94 = OpBitcast %5 %93
%96 = OpAccessChain %15 %9 %14 %95
%97 = OpLoad %5 %96
%98 = OpBitcast %5 %97
%99 = OpBitFieldInsert %5 %86 %90 %94 %98
%101 = OpAccessChain %15 %9 %14 %100
%102 = OpLoad %5 %101
%103 = OpBitcast %5 %102
%105 = OpAccessChain %15 %9 %14 %104
%106 = OpLoad %5 %105
%107 = OpBitcast %5 %106
%108 = OpBitFieldSExtract %5 %99 %103 %107
%109 = OpBitCount %5 %108
%110 = OpBitReverse %5 %109
%111 = OpExtInst %5 %46 FindILsb %110
%112 = OpExtInst %5 %46 FindSMsb %111
%113 = OpBitcast %5 %112
%114 = OpAccessChain %15 %13 %14 %14
OpStore %114 %113 NonPrivatePointer
OpReturn
OpFunctionEnd

