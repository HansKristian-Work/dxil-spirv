SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 50
; Schema: 0
OpCapability Shader
OpCapability SparseResidency
OpCapability ImageBuffer
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "SV_TARGET"
OpName %13 "SV_TARGET_1"
OpName %17 "SparseTexel"
OpName %25 ""
OpName %33 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonWritable
OpDecorate %11 Location 0
OpDecorate %13 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 Buffer 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%15 = OpTypeInt 32 0
%16 = OpConstant %15 12345
%17 = OpTypeStruct %15 %9
%25 = OpTypeStruct %5 %5 %5 %5 %15
%33 = OpTypeStruct %15 %9
%36 = OpConstant %15 0
%38 = OpConstant %15 1
%40 = OpConstant %15 2
%42 = OpConstant %15 3
%43 = OpTypeBool
%46 = OpConstant %5 1
%47 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %48
%48 = OpLabel
%14 = OpLoad %6 %8
%18 = OpImageSparseRead %17 %14 %16 NonPrivateTexel
%19 = OpCompositeExtract %15 %18 0
%20 = OpCompositeExtract %9 %18 1
%21 = OpCompositeExtract %5 %20 0
%22 = OpCompositeExtract %5 %20 1
%23 = OpCompositeExtract %5 %20 2
%24 = OpCompositeExtract %5 %20 3
%26 = OpCompositeConstruct %25 %21 %22 %23 %24 %19
%27 = OpCompositeExtract %15 %26 4
%28 = OpCompositeExtract %5 %26 0
%29 = OpCompositeExtract %5 %26 1
%30 = OpCompositeExtract %5 %26 2
%31 = OpCompositeExtract %5 %26 3
%32 = OpCompositeConstruct %9 %28 %29 %30 %31
%35 = OpAccessChain %12 %11 %36
OpStore %35 %28
%37 = OpAccessChain %12 %11 %38
OpStore %37 %29
%39 = OpAccessChain %12 %11 %40
OpStore %39 %30
%41 = OpAccessChain %12 %11 %42
OpStore %41 %31
%44 = OpImageSparseTexelsResident %43 %27
%45 = OpSelect %5 %44 %46 %47
OpStore %13 %45
OpReturn
OpFunctionEnd

