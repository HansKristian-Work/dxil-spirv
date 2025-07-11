SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 61
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
%6 = OpTypeImage %5 3D 0 0 0 1 Unknown
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
%26 = OpConstant %9 2
%36 = OpTypePointer Output %5
%41 = OpConstant %9 3
%42 = OpTypeInt 32 1
%43 = OpConstant %42 -1
%44 = OpConstant %42 0
%45 = OpConstant %42 1
%48 = OpTypeVector %42 3
%49 = OpConstantComposite %48 %43 %44 %45
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %59
%59 = OpLabel
%17 = OpLoad %6 %8
%19 = OpAccessChain %18 %12 %20
%21 = OpLoad %9 %19
%22 = OpAccessChain %18 %12 %23
%24 = OpLoad %9 %22
%25 = OpAccessChain %18 %12 %26
%27 = OpLoad %9 %25
%30 = OpCompositeConstruct %10 %21 %24 %27
%29 = OpImageFetch %13 %17 %30 Lod %23
%31 = OpCompositeExtract %5 %29 0
%32 = OpCompositeExtract %5 %29 1
%33 = OpCompositeExtract %5 %29 2
%34 = OpCompositeExtract %5 %29 3
%37 = OpAccessChain %36 %15 %20
OpStore %37 %31
%38 = OpAccessChain %36 %15 %23
OpStore %38 %32
%39 = OpAccessChain %36 %15 %26
OpStore %39 %33
%40 = OpAccessChain %36 %15 %41
OpStore %40 %34
%47 = OpCompositeConstruct %10 %21 %24 %27
%46 = OpImageFetch %13 %17 %47 Lod|ConstOffset %23 %49
%50 = OpCompositeExtract %5 %46 0
%51 = OpCompositeExtract %5 %46 1
%52 = OpCompositeExtract %5 %46 2
%53 = OpCompositeExtract %5 %46 3
%55 = OpAccessChain %36 %16 %20
OpStore %55 %50
%56 = OpAccessChain %36 %16 %23
OpStore %56 %51
%57 = OpAccessChain %36 %16 %26
OpStore %57 %52
%58 = OpAccessChain %36 %16 %41
OpStore %58 %53
OpReturn
OpFunctionEnd

