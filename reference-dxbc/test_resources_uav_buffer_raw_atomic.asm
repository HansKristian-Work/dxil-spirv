SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 120
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_ADDRESS"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeVector %5 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Input %5
%15 = OpConstant %5 0
%18 = OpConstant %5 4
%20 = OpConstant %5 2
%22 = OpConstant %5 16
%24 = OpConstant %5 8
%27 = OpTypePointer StorageBuffer %5
%30 = OpConstant %5 5
%32 = OpConstant %5 10
%106 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %118
%118 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %5 %14
%17 = OpIMul %5 %16 %18
%21 = OpIMul %5 %22 %16
%25 = OpIMul %5 %16 %18
%26 = OpIAdd %5 %25 %20
%28 = OpAccessChain %27 %9 %15 %26
%29 = OpAtomicLoad %5 %28 %30 %15
%31 = OpIAdd %5 %29 %32
%33 = OpIMul %5 %22 %16
%35 = OpIMul %5 %16 %18
%36 = OpIAdd %5 %35 %20
%37 = OpAccessChain %27 %9 %15 %36
%38 = OpAtomicExchange %5 %37 %30 %15 %31
%40 = OpIMul %5 %22 %16
%42 = OpIMul %5 %16 %18
%43 = OpIAdd %5 %42 %20
%44 = OpAccessChain %27 %9 %15 %43
%45 = OpAtomicCompareExchange %5 %44 %30 %15 %15 %38 %32
%46 = OpIMul %5 %22 %16
%48 = OpIMul %5 %16 %18
%49 = OpIAdd %5 %48 %20
%50 = OpAccessChain %27 %9 %15 %49
%51 = OpAtomicIAdd %5 %50 %30 %15 %45
%52 = OpIMul %5 %22 %16
%54 = OpIMul %5 %16 %18
%55 = OpIAdd %5 %54 %20
%56 = OpAccessChain %27 %9 %15 %55
%57 = OpAtomicISub %5 %56 %30 %15 %51
%58 = OpIMul %5 %22 %16
%60 = OpIMul %5 %16 %18
%61 = OpIAdd %5 %60 %20
%62 = OpAccessChain %27 %9 %15 %61
%63 = OpAtomicSMin %5 %62 %30 %15 %57
%64 = OpIMul %5 %22 %16
%66 = OpIMul %5 %16 %18
%67 = OpIAdd %5 %66 %20
%68 = OpAccessChain %27 %9 %15 %67
%69 = OpAtomicSMax %5 %68 %30 %15 %63
%70 = OpIMul %5 %22 %16
%72 = OpIMul %5 %16 %18
%73 = OpIAdd %5 %72 %20
%74 = OpAccessChain %27 %9 %15 %73
%75 = OpAtomicUMin %5 %74 %30 %15 %69
%76 = OpIMul %5 %22 %16
%78 = OpIMul %5 %16 %18
%79 = OpIAdd %5 %78 %20
%80 = OpAccessChain %27 %9 %15 %79
%81 = OpAtomicUMax %5 %80 %30 %15 %75
%82 = OpIMul %5 %22 %16
%84 = OpIMul %5 %16 %18
%85 = OpIAdd %5 %84 %20
%86 = OpAccessChain %27 %9 %15 %85
%87 = OpAtomicAnd %5 %86 %30 %15 %81
%88 = OpIMul %5 %22 %16
%90 = OpIMul %5 %16 %18
%91 = OpIAdd %5 %90 %20
%92 = OpAccessChain %27 %9 %15 %91
%93 = OpAtomicOr %5 %92 %30 %15 %87
%94 = OpIMul %5 %22 %16
%96 = OpIMul %5 %16 %18
%97 = OpIAdd %5 %96 %20
%98 = OpAccessChain %27 %9 %15 %97
%99 = OpAtomicXor %5 %98 %30 %15 %93
%100 = OpIMul %5 %22 %16
%102 = OpIMul %5 %16 %18
%103 = OpIAdd %5 %102 %20
%104 = OpAccessChain %27 %9 %15 %103
%105 = OpAtomicIAdd %5 %104 %30 %15 %106
%107 = OpIMul %5 %22 %16
%109 = OpIMul %5 %16 %18
%110 = OpIAdd %5 %109 %20
%111 = OpAccessChain %27 %9 %15 %110
%112 = OpAtomicISub %5 %111 %30 %15 %106
%113 = OpIMul %5 %22 %16
%115 = OpIMul %5 %16 %18
%116 = OpIAdd %5 %115 %20
%117 = OpAccessChain %27 %9 %15 %116
OpAtomicStore %117 %30 %15 %112
OpReturn
OpFunctionEnd

