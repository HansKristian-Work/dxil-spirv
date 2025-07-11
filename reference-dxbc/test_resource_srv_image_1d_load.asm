SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 50
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
%6 = OpTypeImage %5 1D 0 0 0 1 Unknown
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
%29 = OpTypePointer Output %5
%33 = OpConstant %9 2
%35 = OpConstant %9 3
%36 = OpTypeInt 32 1
%37 = OpConstant %36 -1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %48
%48 = OpLabel
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %9 %19
%23 = OpImageFetch %13 %17 %21 Lod %22
%24 = OpCompositeExtract %5 %23 0
%25 = OpCompositeExtract %5 %23 1
%26 = OpCompositeExtract %5 %23 2
%27 = OpCompositeExtract %5 %23 3
%28 = OpCompositeConstruct %13 %24 %25 %26 %27
%30 = OpAccessChain %29 %15 %20
OpStore %30 %24
%31 = OpAccessChain %29 %15 %22
OpStore %31 %25
%32 = OpAccessChain %29 %15 %33
OpStore %32 %26
%34 = OpAccessChain %29 %15 %35
OpStore %34 %27
%38 = OpImageFetch %13 %17 %21 Lod|ConstOffset %22 %37
%39 = OpCompositeExtract %5 %38 0
%40 = OpCompositeExtract %5 %38 1
%41 = OpCompositeExtract %5 %38 2
%42 = OpCompositeExtract %5 %38 3
%43 = OpCompositeConstruct %13 %39 %40 %41 %42
%44 = OpAccessChain %29 %16 %20
OpStore %44 %39
%45 = OpAccessChain %29 %16 %22
OpStore %45 %40
%46 = OpAccessChain %29 %16 %33
OpStore %46 %41
%47 = OpAccessChain %29 %16 %35
OpStore %47 %42
OpReturn
OpFunctionEnd

