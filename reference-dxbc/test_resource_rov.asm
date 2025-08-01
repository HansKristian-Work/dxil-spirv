SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpCapability FragmentShaderPixelInterlockEXT
OpExtension "SPV_EXT_fragment_shader_interlock"
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 PixelInterlockOrderedEXT
OpName %3 "main"
OpName %11 ""
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %11 BuiltIn FragCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeImage %5 2D 0 0 0 2 R32f
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpTypeVector %5 4
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%13 = OpTypePointer Input %5
%15 = OpTypeInt 32 0
%16 = OpConstant %15 1
%20 = OpConstant %15 0
%23 = OpTypeVector %15 2
%27 = OpConstant %15 5
%34 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %42
%42 = OpLabel
%12 = OpLoad %6 %8
%14 = OpAccessChain %13 %11 %16
%17 = OpLoad %5 %14
%18 = OpConvertFToS %15 %17
%19 = OpAccessChain %13 %11 %20
%21 = OpLoad %5 %19
%22 = OpConvertFToS %15 %21
%26 = OpCompositeConstruct %23 %22 %18
OpBeginInvocationInterlockEXT
%25 = OpImageRead %9 %12 %26 MakeTexelVisible|NonPrivateTexel %27
%28 = OpCompositeExtract %5 %25 0
%29 = OpCompositeExtract %5 %25 1
%30 = OpCompositeExtract %5 %25 2
%31 = OpCompositeExtract %5 %25 3
%32 = OpCompositeConstruct %9 %28 %29 %30 %31
%33 = OpFMul %5 %28 %34
%35 = OpCompositeInsert %9 %33 %32 0
%36 = OpCompositeExtract %5 %35 0
%37 = OpCompositeExtract %5 %35 1
%38 = OpCompositeExtract %5 %35 2
%39 = OpCompositeExtract %5 %35 3
%40 = OpCompositeConstruct %23 %22 %18
%41 = OpCompositeConstruct %9 %36 %37 %38 %39
OpImageWrite %12 %40 %41 MakeTexelAvailable|NonPrivateTexel %27
OpEndInvocationInterlockEXT
OpReturn
OpFunctionEnd

