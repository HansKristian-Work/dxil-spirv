SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 102
; Schema: 0
OpCapability Shader
OpCapability Int16
OpCapability VulkanMemoryModel
%47 = OpExtInstImport "GLSL.std.450"
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
%20 = OpConstant %5 1
%25 = OpConstant %5 2
%30 = OpConstant %5 3
%36 = OpConstant %5 4
%41 = OpConstant %5 5
%49 = OpConstant %5 6
%54 = OpConstant %5 7
%59 = OpConstant %5 8
%64 = OpConstant %5 9
%69 = OpConstant %5 10
%74 = OpConstant %5 11
%79 = OpConstant %5 12
%84 = OpConstant %5 13
%89 = OpConstant %5 14
%93 = OpConstant %5 15
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %100
%100 = OpLabel
%16 = OpAccessChain %15 %9 %14 %14
%17 = OpLoad %5 %16
%19 = OpUConvert %18 %17
%21 = OpAccessChain %15 %9 %14 %20
%22 = OpLoad %5 %21
%23 = OpUConvert %18 %22
%24 = OpBitwiseAnd %18 %19 %23
%26 = OpAccessChain %15 %9 %14 %25
%27 = OpLoad %5 %26
%28 = OpUConvert %18 %27
%29 = OpBitwiseOr %18 %24 %28
%31 = OpAccessChain %15 %9 %14 %30
%32 = OpLoad %5 %31
%33 = OpUConvert %18 %32
%34 = OpBitwiseXor %18 %29 %33
%35 = OpNot %18 %34
%37 = OpAccessChain %15 %9 %14 %36
%38 = OpLoad %5 %37
%39 = OpUConvert %18 %38
%40 = OpIAdd %18 %35 %39
%42 = OpAccessChain %15 %9 %14 %41
%43 = OpLoad %5 %42
%44 = OpUConvert %18 %43
%45 = OpISub %18 %40 %44
%46 = OpSNegate %18 %45
%48 = OpExtInst %18 %47 SAbs %46
%50 = OpAccessChain %15 %9 %14 %49
%51 = OpLoad %5 %50
%52 = OpUConvert %18 %51
%53 = OpIMul %18 %48 %52
%55 = OpAccessChain %15 %9 %14 %54
%56 = OpLoad %5 %55
%57 = OpUConvert %18 %56
%58 = OpShiftLeftLogical %18 %53 %57
%60 = OpAccessChain %15 %9 %14 %59
%61 = OpLoad %5 %60
%62 = OpUConvert %18 %61
%63 = OpShiftRightArithmetic %18 %58 %62
%65 = OpAccessChain %15 %9 %14 %64
%66 = OpLoad %5 %65
%67 = OpUConvert %18 %66
%68 = OpShiftRightLogical %18 %63 %67
%70 = OpAccessChain %15 %9 %14 %69
%71 = OpLoad %5 %70
%72 = OpUConvert %18 %71
%73 = OpUDiv %18 %68 %72
%75 = OpAccessChain %15 %9 %14 %74
%76 = OpLoad %5 %75
%77 = OpUConvert %18 %76
%78 = OpUMod %18 %73 %77
%80 = OpAccessChain %15 %9 %14 %79
%81 = OpLoad %5 %80
%82 = OpUConvert %18 %81
%83 = OpExtInst %18 %47 UMin %78 %82
%85 = OpAccessChain %15 %9 %14 %84
%86 = OpLoad %5 %85
%87 = OpUConvert %18 %86
%88 = OpExtInst %18 %47 UMax %83 %87
%90 = OpAccessChain %15 %9 %14 %89
%91 = OpLoad %5 %90
%92 = OpUConvert %18 %91
%94 = OpAccessChain %15 %9 %14 %93
%95 = OpLoad %5 %94
%96 = OpUConvert %18 %95
%97 = OpExtInst %18 %47 UClamp %88 %92 %96
%98 = OpUConvert %5 %97
%99 = OpAccessChain %15 %13 %14 %14
OpStore %99 %98 NonPrivatePointer
OpReturn
OpFunctionEnd

