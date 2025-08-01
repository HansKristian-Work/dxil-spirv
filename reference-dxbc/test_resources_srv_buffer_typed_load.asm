SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 49
; Schema: 0
OpCapability Shader
OpCapability SampledBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %15 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "BUFFER_ADDRESS"
OpName %15 "SV_TARGET"
OpName %16 "SV_TARGET_1"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 0
OpDecorate %16 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpVariable %14 Output
%18 = OpTypePointer Input %9
%20 = OpConstant %9 0
%28 = OpConstant %9 7
%35 = OpTypePointer Output %5
%38 = OpConstant %9 1
%40 = OpConstant %9 2
%42 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %47
%47 = OpLabel
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %9 %19
%22 = OpImageFetch %13 %17 %21
%23 = OpCompositeExtract %5 %22 0
%24 = OpCompositeExtract %5 %22 1
%25 = OpCompositeExtract %5 %22 2
%26 = OpCompositeExtract %5 %22 3
%29 = OpImageFetch %13 %17 %28
%30 = OpCompositeExtract %5 %29 0
%31 = OpCompositeExtract %5 %29 1
%32 = OpCompositeExtract %5 %29 2
%33 = OpCompositeExtract %5 %29 3
%36 = OpAccessChain %35 %15 %20
OpStore %36 %23
%37 = OpAccessChain %35 %15 %38
OpStore %37 %24
%39 = OpAccessChain %35 %15 %40
OpStore %39 %25
%41 = OpAccessChain %35 %15 %42
OpStore %41 %26
%43 = OpAccessChain %35 %16 %20
OpStore %43 %30
%44 = OpAccessChain %35 %16 %38
OpStore %44 %31
%45 = OpAccessChain %35 %16 %40
OpStore %45 %32
%46 = OpAccessChain %35 %16 %42
OpStore %46 %33
OpReturn
OpFunctionEnd

