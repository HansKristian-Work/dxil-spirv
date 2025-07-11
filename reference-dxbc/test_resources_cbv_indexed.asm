SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 51
; Schema: 0
OpCapability Shader
OpCapability UniformBufferArrayDynamicIndexing
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %11 %19 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 ""
OpName %15 ""
OpName %21 "SV_TARGET"
OpDecorate %8 ArrayStride 4
OpMemberDecorate %9 0 Offset 0
OpDecorate %9 Block
OpDecorate %11 DescriptorSet 1
OpDecorate %11 Binding 0
OpDecorate %14 ArrayStride 16
OpMemberDecorate %15 0 Offset 0
OpDecorate %15 Block
OpDecorate %19 DescriptorSet 0
OpDecorate %19 Binding 0
OpDecorate %21 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 4
%7 = OpTypeFloat 32
%8 = OpTypeArray %7 %6
%9 = OpTypeStruct %8
%10 = OpTypePointer Uniform %9
%11 = OpVariable %10 Uniform
%12 = OpConstant %5 8
%13 = OpTypeVector %7 4
%14 = OpTypeArray %13 %12
%15 = OpTypeStruct %14
%16 = OpConstant %5 256
%17 = OpTypeArray %15 %16
%18 = OpTypePointer Uniform %17
%19 = OpVariable %18 Uniform
%20 = OpTypePointer Output %13
%21 = OpVariable %20 Output
%23 = OpConstant %5 0
%24 = OpConstant %5 16
%26 = OpConstant %5 1
%29 = OpConstant %5 2
%30 = OpTypePointer Uniform %7
%34 = OpTypePointer Uniform %15
%36 = OpTypePointer Uniform %13
%40 = OpTypePointer Output %7
%48 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %49
%49 = OpLabel
%22 = OpIMul %5 %23 %24
%25 = OpIMul %5 %26 %6
%27 = OpIAdd %5 %22 %25
%28 = OpShiftRightLogical %5 %27 %29
%31 = OpAccessChain %30 %11 %23 %28
%32 = OpLoad %7 %31
%33 = OpBitcast %5 %32
%35 = OpAccessChain %34 %19 %33
%37 = OpAccessChain %36 %35 %23 %29
%38 = OpLoad %13 %37
%39 = OpCompositeExtract %7 %38 0
%41 = OpAccessChain %40 %21 %23
OpStore %41 %39
%42 = OpCompositeExtract %7 %38 1
%43 = OpAccessChain %40 %21 %26
OpStore %43 %42
%44 = OpCompositeExtract %7 %38 2
%45 = OpAccessChain %40 %21 %29
OpStore %45 %44
%46 = OpCompositeExtract %7 %38 3
%47 = OpAccessChain %40 %21 %48
OpStore %47 %46
OpReturn
OpFunctionEnd

