SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 56
; Schema: 0
OpCapability Shader
OpCapability StorageImageWriteWithoutFormat
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %8 %9 %10 %13 %14 %15 %20
OpExecutionMode %3 LocalSize 4 4 4
OpName %3 "main"
OpName %13 "SV_DispatchThreadId"
OpName %14 "SV_GroupId"
OpName %15 "SV_GroupThreadId"
OpDecorate %8 DescriptorSet 0
OpDecorate %8 Binding 0
OpDecorate %8 NonReadable
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 1
OpDecorate %9 NonReadable
OpDecorate %10 DescriptorSet 0
OpDecorate %10 Binding 2
OpDecorate %10 NonReadable
OpDecorate %13 BuiltIn GlobalInvocationId
OpDecorate %14 BuiltIn WorkgroupId
OpDecorate %15 BuiltIn LocalInvocationId
OpDecorate %20 BuiltIn LocalInvocationIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeImage %5 3D 0 0 0 2 Unknown
%7 = OpTypePointer UniformConstant %6
%8 = OpVariable %7 UniformConstant
%9 = OpVariable %7 UniformConstant
%10 = OpVariable %7 UniformConstant
%11 = OpTypeVector %5 3
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpVariable %12 Input
%15 = OpVariable %12 Input
%19 = OpTypePointer Input %5
%20 = OpVariable %19 Input
%22 = OpTypeVector %5 4
%25 = OpConstant %5 0
%28 = OpConstant %5 1
%31 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %54
%54 = OpLabel
%16 = OpLoad %6 %8
%17 = OpLoad %6 %9
%18 = OpLoad %6 %10
%21 = OpLoad %5 %20
%24 = OpAccessChain %19 %13 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %19 %13 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %19 %13 %31
%32 = OpLoad %5 %30
%34 = OpAccessChain %19 %14 %25
%35 = OpLoad %5 %34
%36 = OpAccessChain %19 %14 %28
%37 = OpLoad %5 %36
%38 = OpAccessChain %19 %14 %31
%39 = OpLoad %5 %38
%41 = OpAccessChain %19 %15 %25
%42 = OpLoad %5 %41
%43 = OpAccessChain %19 %15 %28
%44 = OpLoad %5 %43
%45 = OpAccessChain %19 %15 %31
%46 = OpLoad %5 %45
%48 = OpCompositeConstruct %11 %26 %29 %32
%49 = OpCompositeConstruct %22 %21 %21 %21 %21
OpImageWrite %16 %48 %49 NonPrivateTexel
%50 = OpCompositeConstruct %11 %35 %37 %39
%51 = OpCompositeConstruct %22 %21 %21 %21 %21
OpImageWrite %17 %50 %51 NonPrivateTexel
%52 = OpCompositeConstruct %11 %42 %44 %46
%53 = OpCompositeConstruct %22 %21 %21 %21 %21
OpImageWrite %18 %52 %53 NonPrivateTexel
OpReturn
OpFunctionEnd

