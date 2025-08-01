SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 109
; Schema: 0
OpCapability Shader
OpCapability StorageBufferArrayDynamicIndexing
OpCapability RuntimeDescriptorArray
OpCapability StorageBufferArrayNonUniformIndexing
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_descriptor_indexing"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %10 %12 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_INDEX"
OpName %15 "BUFFER_ADDRESS"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 Flat
OpDecorate %15 Location 0
OpDecorate %16 NonUniform
OpDecorate %18 NonUniform
OpDecorate %32 NonUniform
OpDecorate %40 NonUniform
OpDecorate %46 NonUniform
OpDecorate %51 NonUniform
OpDecorate %56 NonUniform
OpDecorate %61 NonUniform
OpDecorate %66 NonUniform
OpDecorate %71 NonUniform
OpDecorate %76 NonUniform
OpDecorate %81 NonUniform
OpDecorate %86 NonUniform
OpDecorate %91 NonUniform
OpDecorate %96 NonUniform
OpDecorate %101 NonUniform
OpDecorate %106 NonUniform
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypeRuntimeArray %7
%9 = OpTypePointer StorageBuffer %8
%10 = OpVariable %9 StorageBuffer
%11 = OpTypePointer Input %5
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 2
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%17 = OpTypePointer StorageBuffer %7
%20 = OpConstant %5 0
%23 = OpConstant %5 1
%27 = OpConstant %5 4
%29 = OpConstant %5 20
%31 = OpTypePointer StorageBuffer %5
%34 = OpConstant %5 5
%36 = OpConstant %5 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %107
%107 = OpLabel
%16 = OpLoad %5 %12
%18 = OpAccessChain %17 %10 %16
%19 = OpAccessChain %11 %15 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %15 %23
%24 = OpLoad %5 %22
%28 = OpIMul %5 %21 %29
%30 = OpIAdd %5 %28 %24
%32 = OpAccessChain %31 %18 %20 %30
%33 = OpAtomicLoad %5 %32 %34 %20
%35 = OpIAdd %5 %33 %36
%38 = OpIMul %5 %21 %29
%39 = OpIAdd %5 %38 %24
%40 = OpAccessChain %31 %18 %20 %39
%41 = OpAtomicExchange %5 %40 %34 %20 %35
%44 = OpIMul %5 %21 %29
%45 = OpIAdd %5 %44 %24
%46 = OpAccessChain %31 %18 %20 %45
%47 = OpAtomicCompareExchange %5 %46 %34 %20 %20 %41 %36
%49 = OpIMul %5 %21 %29
%50 = OpIAdd %5 %49 %24
%51 = OpAccessChain %31 %18 %20 %50
%52 = OpAtomicIAdd %5 %51 %34 %20 %47
%54 = OpIMul %5 %21 %29
%55 = OpIAdd %5 %54 %24
%56 = OpAccessChain %31 %18 %20 %55
%57 = OpAtomicISub %5 %56 %34 %20 %52
%59 = OpIMul %5 %21 %29
%60 = OpIAdd %5 %59 %24
%61 = OpAccessChain %31 %18 %20 %60
%62 = OpAtomicSMin %5 %61 %34 %20 %57
%64 = OpIMul %5 %21 %29
%65 = OpIAdd %5 %64 %24
%66 = OpAccessChain %31 %18 %20 %65
%67 = OpAtomicSMax %5 %66 %34 %20 %62
%69 = OpIMul %5 %21 %29
%70 = OpIAdd %5 %69 %24
%71 = OpAccessChain %31 %18 %20 %70
%72 = OpAtomicUMin %5 %71 %34 %20 %67
%74 = OpIMul %5 %21 %29
%75 = OpIAdd %5 %74 %24
%76 = OpAccessChain %31 %18 %20 %75
%77 = OpAtomicUMax %5 %76 %34 %20 %72
%79 = OpIMul %5 %21 %29
%80 = OpIAdd %5 %79 %24
%81 = OpAccessChain %31 %18 %20 %80
%82 = OpAtomicAnd %5 %81 %34 %20 %77
%84 = OpIMul %5 %21 %29
%85 = OpIAdd %5 %84 %24
%86 = OpAccessChain %31 %18 %20 %85
%87 = OpAtomicOr %5 %86 %34 %20 %82
%89 = OpIMul %5 %21 %29
%90 = OpIAdd %5 %89 %24
%91 = OpAccessChain %31 %18 %20 %90
%92 = OpAtomicXor %5 %91 %34 %20 %87
%94 = OpIMul %5 %21 %29
%95 = OpIAdd %5 %94 %24
%96 = OpAccessChain %31 %18 %20 %95
%97 = OpAtomicIAdd %5 %96 %34 %20 %23
%99 = OpIMul %5 %21 %29
%100 = OpIAdd %5 %99 %24
%101 = OpAccessChain %31 %18 %20 %100
%102 = OpAtomicISub %5 %101 %34 %20 %23
%104 = OpIMul %5 %21 %29
%105 = OpIAdd %5 %104 %24
%106 = OpAccessChain %31 %18 %20 %105
OpAtomicStore %106 %34 %20 %102
OpReturn
OpFunctionEnd

