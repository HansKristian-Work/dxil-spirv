SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %14 %16 %18 %19 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "SSBO"
OpName %16 "BUFFER_ADDRESS"
OpName %18 "SV_TARGET"
OpName %19 "SV_TARGET_1"
OpName %21 "SV_TARGET_3"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %11 ArrayStride 8
OpMemberDecorate %12 0 Offset 0
OpDecorate %12 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %14 DescriptorSet 0
OpDecorate %14 Binding 0
OpDecorate %14 NonWritable
OpDecorate %14 Restrict
OpDecorate %16 Flat
OpDecorate %16 Location 0
OpDecorate %18 Location 0
OpDecorate %19 Location 1
OpDecorate %21 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeVector %5 2
%11 = OpTypeRuntimeArray %10
%12 = OpTypeStruct %11
%13 = OpTypePointer StorageBuffer %12
%14 = OpVariable %13 StorageBuffer
%15 = OpTypePointer Input %10
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %10
%18 = OpVariable %17 Output
%19 = OpVariable %17 Output
%20 = OpTypePointer Output %5
%21 = OpVariable %20 Output
%22 = OpTypePointer Input %5
%24 = OpConstant %5 0
%27 = OpConstant %5 4
%29 = OpConstant %5 2
%31 = OpConstant %5 16
%33 = OpConstant %5 8
%36 = OpConstant %5 1
%37 = OpTypePointer StorageBuffer %10
%43 = OpConstant %5 7
%44 = OpTypePointer StorageBuffer %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %64
%64 = OpLabel
%23 = OpAccessChain %22 %16 %24
%25 = OpLoad %5 %23
%26 = OpIMul %5 %25 %27
%30 = OpIMul %5 %31 %25
%34 = OpIMul %5 %25 %29
%35 = OpIAdd %5 %34 %36
%38 = OpAccessChain %37 %14 %24 %35
%39 = OpLoad %10 %38
%40 = OpCompositeExtract %5 %39 0
%41 = OpCompositeExtract %5 %39 1
%45 = OpAccessChain %44 %9 %24 %43
%46 = OpLoad %5 %45
%48 = OpIAdd %5 %43 %36
%47 = OpAccessChain %44 %9 %24 %48
%49 = OpLoad %5 %47
%50 = OpCompositeConstruct %10 %46 %49
%51 = OpCompositeExtract %5 %50 0
%52 = OpCompositeExtract %5 %50 1
%54 = OpAccessChain %20 %18 %24
OpStore %54 %40
%55 = OpAccessChain %20 %18 %36
OpStore %55 %41
%56 = OpAccessChain %20 %19 %24
OpStore %56 %51
%57 = OpAccessChain %20 %19 %36
OpStore %57 %52
%58 = OpIMul %5 %31 %25
%60 = OpIMul %5 %25 %27
%61 = OpIAdd %5 %60 %29
%62 = OpAccessChain %44 %9 %24 %61
%63 = OpLoad %5 %62
OpStore %21 %63
OpReturn
OpFunctionEnd

