SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 53
; Schema: 0
OpCapability Shader
OpCapability Sampled1D
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %15 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "TEXCOORD"
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
%6 = OpTypeImage %5 1D 0 1 0 1 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpVariable %14 Output
%18 = OpTypePointer Input %9
%20 = OpConstant %9 0
%22 = OpConstant %9 1
%23 = OpConstant %9 2
%25 = OpTypeVector %9 2
%32 = OpTypePointer Output %5
%37 = OpConstant %9 3
%38 = OpTypeInt 32 1
%39 = OpConstant %38 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %51
%51 = OpLabel
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %9 %19
%26 = OpCompositeConstruct %25 %21 %23
%24 = OpImageFetch %13 %17 %26 Lod %22
%27 = OpCompositeExtract %5 %24 0
%28 = OpCompositeExtract %5 %24 1
%29 = OpCompositeExtract %5 %24 2
%30 = OpCompositeExtract %5 %24 3
%31 = OpCompositeConstruct %13 %27 %28 %29 %30
%33 = OpAccessChain %32 %15 %20
OpStore %33 %27
%34 = OpAccessChain %32 %15 %22
OpStore %34 %28
%35 = OpAccessChain %32 %15 %23
OpStore %35 %29
%36 = OpAccessChain %32 %15 %37
OpStore %36 %30
%41 = OpCompositeConstruct %25 %21 %23
%40 = OpImageFetch %13 %17 %41 Lod|ConstOffset %22 %39
%42 = OpCompositeExtract %5 %40 0
%43 = OpCompositeExtract %5 %40 1
%44 = OpCompositeExtract %5 %40 2
%45 = OpCompositeExtract %5 %40 3
%46 = OpCompositeConstruct %13 %42 %43 %44 %45
%47 = OpAccessChain %32 %16 %20
OpStore %47 %42
%48 = OpAccessChain %32 %16 %22
OpStore %48 %43
%49 = OpAccessChain %32 %16 %23
OpStore %49 %44
%50 = OpAccessChain %32 %16 %37
OpStore %50 %45
OpReturn
OpFunctionEnd

