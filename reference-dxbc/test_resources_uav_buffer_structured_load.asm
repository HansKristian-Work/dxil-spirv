SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 91
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Fragment %3 "main" %9 %12 %14 %15 %18 %20
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SSBO"
OpName %12 "BUFFER_ADDRESS"
OpName %14 "SV_TARGET"
OpName %15 "SV_TARGET_1"
OpName %18 "SV_TARGET_2"
OpName %20 "SV_TARGET_3"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %12 Flat
OpDecorate %12 Location 0
OpDecorate %14 Location 0
OpDecorate %15 Location 1
OpDecorate %18 Location 2
OpDecorate %20 Location 3
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeVector %5 2
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%13 = OpTypePointer Output %10
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpTypeVector %5 4
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Output %5
%20 = OpVariable %19 Output
%21 = OpTypePointer Input %5
%23 = OpConstant %5 0
%26 = OpConstant %5 1
%30 = OpConstant %5 7
%31 = OpConstant %5 3
%33 = OpConstant %5 4
%35 = OpConstant %5 20
%37 = OpTypePointer StorageBuffer %5
%47 = OpConstant %5 143
%61 = OpConstant %5 331
%69 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %89
%89 = OpLabel
%22 = OpAccessChain %21 %12 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %21 %12 %26
%27 = OpLoad %5 %25
%34 = OpIMul %5 %24 %35
%36 = OpIAdd %5 %34 %27
%38 = OpAccessChain %37 %9 %23 %36
%39 = OpLoad %5 %38 NonPrivatePointer
%41 = OpIAdd %5 %36 %26
%40 = OpAccessChain %37 %9 %23 %41
%42 = OpLoad %5 %40 NonPrivatePointer
%43 = OpCompositeConstruct %10 %39 %42
%44 = OpCompositeExtract %5 %43 0
%45 = OpCompositeExtract %5 %43 1
%48 = OpAccessChain %37 %9 %23 %47
%49 = OpLoad %5 %48 NonPrivatePointer
%51 = OpIAdd %5 %47 %26
%50 = OpAccessChain %37 %9 %23 %51
%52 = OpLoad %5 %50 NonPrivatePointer
%53 = OpCompositeConstruct %10 %49 %52
%54 = OpCompositeExtract %5 %53 0
%55 = OpCompositeExtract %5 %53 1
%57 = OpAccessChain %19 %14 %23
OpStore %57 %44
%58 = OpAccessChain %19 %14 %26
OpStore %58 %45
%59 = OpAccessChain %19 %15 %23
OpStore %59 %54
%60 = OpAccessChain %19 %15 %26
OpStore %60 %55
%62 = OpAccessChain %37 %9 %23 %61
%63 = OpLoad %5 %62 NonPrivatePointer
%65 = OpIAdd %5 %61 %26
%64 = OpAccessChain %37 %9 %23 %65
%66 = OpLoad %5 %64 NonPrivatePointer
%68 = OpIAdd %5 %61 %69
%67 = OpAccessChain %37 %9 %23 %68
%70 = OpLoad %5 %67 NonPrivatePointer
%72 = OpIAdd %5 %61 %31
%71 = OpAccessChain %37 %9 %23 %72
%73 = OpLoad %5 %71 NonPrivatePointer
%74 = OpCompositeConstruct %16 %63 %66 %70 %73
%75 = OpCompositeExtract %5 %74 0
%76 = OpCompositeExtract %5 %74 1
%77 = OpCompositeExtract %5 %74 2
%78 = OpCompositeExtract %5 %74 3
%80 = OpAccessChain %19 %18 %23
OpStore %80 %75
%81 = OpAccessChain %19 %18 %26
OpStore %81 %76
%82 = OpAccessChain %19 %18 %69
OpStore %82 %77
%83 = OpAccessChain %19 %18 %31
OpStore %83 %78
%85 = OpIMul %5 %24 %35
%86 = OpIAdd %5 %85 %27
%87 = OpAccessChain %37 %9 %23 %86
%88 = OpLoad %5 %87 NonPrivatePointer
OpStore %20 %88
OpReturn
OpFunctionEnd

