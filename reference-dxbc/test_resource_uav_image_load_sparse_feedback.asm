SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 60
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %12 %15 %17
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %12 "TEXCOORD"
OpName %15 "SV_TARGET"
OpName %17 "SV_TARGET_1"
OpName %28 "SparseTexel"
OpName %37 ""
OpName %45 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %15 Location 0
OpDecorate %17 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeInt 32 0
%10 = OpTypeVector %9 3
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypeVector %5 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpTypePointer Output %5
%17 = OpVariable %16 Output
%19 = OpTypePointer Input %9
%21 = OpConstant %9 0
%24 = OpConstant %9 1
%26 = OpTypeVector %9 2
%28 = OpTypeStruct %9 %13
%37 = OpTypeStruct %5 %5 %5 %5 %9
%45 = OpTypeStruct %9 %13
%50 = OpConstant %9 2
%52 = OpConstant %9 3
%53 = OpTypeBool
%56 = OpConstant %5 1
%57 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %58
%58 = OpLabel
%18 = OpLoad %6 %8
%20 = OpAccessChain %19 %12 %21
%22 = OpLoad %9 %20
%23 = OpAccessChain %19 %12 %24
%25 = OpLoad %9 %23
%30 = OpCompositeConstruct %26 %22 %25
%29 = OpImageSparseRead %28 %18 %30 NonPrivateTexel
%31 = OpCompositeExtract %9 %29 0
%32 = OpCompositeExtract %13 %29 1
%33 = OpCompositeExtract %5 %32 0
%34 = OpCompositeExtract %5 %32 1
%35 = OpCompositeExtract %5 %32 2
%36 = OpCompositeExtract %5 %32 3
%38 = OpCompositeConstruct %37 %33 %34 %35 %36 %31
%39 = OpCompositeExtract %9 %38 4
%40 = OpCompositeExtract %5 %38 0
%41 = OpCompositeExtract %5 %38 1
%42 = OpCompositeExtract %5 %38 2
%43 = OpCompositeExtract %5 %38 3
%44 = OpCompositeConstruct %13 %40 %41 %42 %43
%47 = OpAccessChain %16 %15 %21
OpStore %47 %40
%48 = OpAccessChain %16 %15 %24
OpStore %48 %41
%49 = OpAccessChain %16 %15 %50
OpStore %49 %42
%51 = OpAccessChain %16 %15 %52
OpStore %51 %43
%54 = OpImageSparseTexelsResident %53 %39
%55 = OpSelect %5 %54 %56 %57
OpStore %17 %55
OpReturn
OpFunctionEnd

