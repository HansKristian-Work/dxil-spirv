SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 104
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
%18 = OpConstant %5 1
%22 = OpConstant %5 4
%24 = OpConstant %5 20
%26 = OpTypePointer StorageBuffer %5
%29 = OpConstant %5 5
%31 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %102
%102 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %5 %14
%17 = OpAccessChain %13 %12 %18
%19 = OpLoad %5 %17
%23 = OpIMul %5 %16 %24
%25 = OpIAdd %5 %23 %19
%27 = OpAccessChain %26 %9 %15 %25
%28 = OpAtomicLoad %5 %27 %29 %15
%30 = OpIAdd %5 %28 %31
%33 = OpIMul %5 %16 %24
%34 = OpIAdd %5 %33 %19
%35 = OpAccessChain %26 %9 %15 %34
%36 = OpAtomicExchange %5 %35 %29 %15 %30
%39 = OpIMul %5 %16 %24
%40 = OpIAdd %5 %39 %19
%41 = OpAccessChain %26 %9 %15 %40
%42 = OpAtomicCompareExchange %5 %41 %29 %15 %15 %36 %31
%44 = OpIMul %5 %16 %24
%45 = OpIAdd %5 %44 %19
%46 = OpAccessChain %26 %9 %15 %45
%47 = OpAtomicIAdd %5 %46 %29 %15 %42
%49 = OpIMul %5 %16 %24
%50 = OpIAdd %5 %49 %19
%51 = OpAccessChain %26 %9 %15 %50
%52 = OpAtomicISub %5 %51 %29 %15 %47
%54 = OpIMul %5 %16 %24
%55 = OpIAdd %5 %54 %19
%56 = OpAccessChain %26 %9 %15 %55
%57 = OpAtomicSMin %5 %56 %29 %15 %52
%59 = OpIMul %5 %16 %24
%60 = OpIAdd %5 %59 %19
%61 = OpAccessChain %26 %9 %15 %60
%62 = OpAtomicSMax %5 %61 %29 %15 %57
%64 = OpIMul %5 %16 %24
%65 = OpIAdd %5 %64 %19
%66 = OpAccessChain %26 %9 %15 %65
%67 = OpAtomicUMin %5 %66 %29 %15 %62
%69 = OpIMul %5 %16 %24
%70 = OpIAdd %5 %69 %19
%71 = OpAccessChain %26 %9 %15 %70
%72 = OpAtomicUMax %5 %71 %29 %15 %67
%74 = OpIMul %5 %16 %24
%75 = OpIAdd %5 %74 %19
%76 = OpAccessChain %26 %9 %15 %75
%77 = OpAtomicAnd %5 %76 %29 %15 %72
%79 = OpIMul %5 %16 %24
%80 = OpIAdd %5 %79 %19
%81 = OpAccessChain %26 %9 %15 %80
%82 = OpAtomicOr %5 %81 %29 %15 %77
%84 = OpIMul %5 %16 %24
%85 = OpIAdd %5 %84 %19
%86 = OpAccessChain %26 %9 %15 %85
%87 = OpAtomicXor %5 %86 %29 %15 %82
%89 = OpIMul %5 %16 %24
%90 = OpIAdd %5 %89 %19
%91 = OpAccessChain %26 %9 %15 %90
%92 = OpAtomicIAdd %5 %91 %29 %15 %18
%94 = OpIMul %5 %16 %24
%95 = OpIAdd %5 %94 %19
%96 = OpAccessChain %26 %9 %15 %95
%97 = OpAtomicISub %5 %96 %29 %15 %18
%99 = OpIMul %5 %16 %24
%100 = OpIAdd %5 %99 %19
%101 = OpAccessChain %26 %9 %15 %100
OpAtomicStore %101 %29 %15 %97
OpReturn
OpFunctionEnd

