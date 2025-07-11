SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 59
; Schema: 0
OpCapability Shader
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
%6 = OpTypeImage %5 2D 0 1 0 1 Unknown
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
%23 = OpConstant %9 1
%25 = OpTypeVector %9 2
%27 = OpConstant %9 2
%35 = OpTypePointer Output %5
%40 = OpConstant %9 3
%41 = OpTypeInt 32 1
%42 = OpConstant %41 -1
%43 = OpConstant %41 0
%46 = OpTypeVector %41 2
%47 = OpConstantComposite %46 %42 %43
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %9 %19
%22 = OpAccessChain %18 %12 %23
%24 = OpLoad %9 %22
%29 = OpCompositeConstruct %10 %21 %24 %27
%28 = OpImageFetch %13 %17 %29 Lod %23
%30 = OpCompositeExtract %5 %28 0
%31 = OpCompositeExtract %5 %28 1
%32 = OpCompositeExtract %5 %28 2
%33 = OpCompositeExtract %5 %28 3
%36 = OpAccessChain %35 %15 %20
OpStore %36 %30
%37 = OpAccessChain %35 %15 %23
OpStore %37 %31
%38 = OpAccessChain %35 %15 %27
OpStore %38 %32
%39 = OpAccessChain %35 %15 %40
OpStore %39 %33
%45 = OpCompositeConstruct %10 %21 %24 %27
%44 = OpImageFetch %13 %17 %45 Lod|ConstOffset %23 %47
%48 = OpCompositeExtract %5 %44 0
%49 = OpCompositeExtract %5 %44 1
%50 = OpCompositeExtract %5 %44 2
%51 = OpCompositeExtract %5 %44 3
%53 = OpAccessChain %35 %16 %20
OpStore %53 %48
%54 = OpAccessChain %35 %16 %23
OpStore %54 %49
%55 = OpAccessChain %35 %16 %27
OpStore %55 %50
%56 = OpAccessChain %35 %16 %40
OpStore %56 %51
OpReturn
OpFunctionEnd

