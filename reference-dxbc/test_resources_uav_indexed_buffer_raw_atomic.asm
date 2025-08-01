SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 125
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
OpDecorate %33 NonUniform
OpDecorate %42 NonUniform
OpDecorate %49 NonUniform
OpDecorate %55 NonUniform
OpDecorate %61 NonUniform
OpDecorate %67 NonUniform
OpDecorate %73 NonUniform
OpDecorate %79 NonUniform
OpDecorate %85 NonUniform
OpDecorate %91 NonUniform
OpDecorate %97 NonUniform
OpDecorate %103 NonUniform
OpDecorate %109 NonUniform
OpDecorate %116 NonUniform
OpDecorate %122 NonUniform
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
%23 = OpConstant %5 4
%25 = OpConstant %5 2
%27 = OpConstant %5 16
%29 = OpConstant %5 8
%32 = OpTypePointer StorageBuffer %5
%35 = OpConstant %5 5
%37 = OpConstant %5 10
%111 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %123
%123 = OpLabel
%16 = OpLoad %5 %12
%18 = OpAccessChain %17 %10 %16
%19 = OpAccessChain %11 %15 %20
%21 = OpLoad %5 %19
%22 = OpIMul %5 %21 %23
%26 = OpIMul %5 %27 %21
%30 = OpIMul %5 %21 %23
%31 = OpIAdd %5 %30 %25
%33 = OpAccessChain %32 %18 %20 %31
%34 = OpAtomicLoad %5 %33 %35 %20
%36 = OpIAdd %5 %34 %37
%38 = OpIMul %5 %27 %21
%40 = OpIMul %5 %21 %23
%41 = OpIAdd %5 %40 %25
%42 = OpAccessChain %32 %18 %20 %41
%43 = OpAtomicExchange %5 %42 %35 %20 %36
%45 = OpIMul %5 %27 %21
%47 = OpIMul %5 %21 %23
%48 = OpIAdd %5 %47 %25
%49 = OpAccessChain %32 %18 %20 %48
%50 = OpAtomicCompareExchange %5 %49 %35 %20 %20 %43 %37
%51 = OpIMul %5 %27 %21
%53 = OpIMul %5 %21 %23
%54 = OpIAdd %5 %53 %25
%55 = OpAccessChain %32 %18 %20 %54
%56 = OpAtomicIAdd %5 %55 %35 %20 %50
%57 = OpIMul %5 %27 %21
%59 = OpIMul %5 %21 %23
%60 = OpIAdd %5 %59 %25
%61 = OpAccessChain %32 %18 %20 %60
%62 = OpAtomicISub %5 %61 %35 %20 %56
%63 = OpIMul %5 %27 %21
%65 = OpIMul %5 %21 %23
%66 = OpIAdd %5 %65 %25
%67 = OpAccessChain %32 %18 %20 %66
%68 = OpAtomicSMin %5 %67 %35 %20 %62
%69 = OpIMul %5 %27 %21
%71 = OpIMul %5 %21 %23
%72 = OpIAdd %5 %71 %25
%73 = OpAccessChain %32 %18 %20 %72
%74 = OpAtomicSMax %5 %73 %35 %20 %68
%75 = OpIMul %5 %27 %21
%77 = OpIMul %5 %21 %23
%78 = OpIAdd %5 %77 %25
%79 = OpAccessChain %32 %18 %20 %78
%80 = OpAtomicUMin %5 %79 %35 %20 %74
%81 = OpIMul %5 %27 %21
%83 = OpIMul %5 %21 %23
%84 = OpIAdd %5 %83 %25
%85 = OpAccessChain %32 %18 %20 %84
%86 = OpAtomicUMax %5 %85 %35 %20 %80
%87 = OpIMul %5 %27 %21
%89 = OpIMul %5 %21 %23
%90 = OpIAdd %5 %89 %25
%91 = OpAccessChain %32 %18 %20 %90
%92 = OpAtomicAnd %5 %91 %35 %20 %86
%93 = OpIMul %5 %27 %21
%95 = OpIMul %5 %21 %23
%96 = OpIAdd %5 %95 %25
%97 = OpAccessChain %32 %18 %20 %96
%98 = OpAtomicOr %5 %97 %35 %20 %92
%99 = OpIMul %5 %27 %21
%101 = OpIMul %5 %21 %23
%102 = OpIAdd %5 %101 %25
%103 = OpAccessChain %32 %18 %20 %102
%104 = OpAtomicXor %5 %103 %35 %20 %98
%105 = OpIMul %5 %27 %21
%107 = OpIMul %5 %21 %23
%108 = OpIAdd %5 %107 %25
%109 = OpAccessChain %32 %18 %20 %108
%110 = OpAtomicIAdd %5 %109 %35 %20 %111
%112 = OpIMul %5 %27 %21
%114 = OpIMul %5 %21 %23
%115 = OpIAdd %5 %114 %25
%116 = OpAccessChain %32 %18 %20 %115
%117 = OpAtomicISub %5 %116 %35 %20 %111
%118 = OpIMul %5 %27 %21
%120 = OpIMul %5 %21 %23
%121 = OpIAdd %5 %120 %25
%122 = OpAccessChain %32 %18 %20 %121
OpAtomicStore %122 %35 %20 %117
OpReturn
OpFunctionEnd

