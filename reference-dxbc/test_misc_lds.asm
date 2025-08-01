SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 68
; Schema: 0
OpCapability Shader
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint GLCompute %3 "main" %9 %13 %16 %21 %26
OpExecutionMode %3 LocalSize 32 1 1
OpName %3 "main"
OpName %7 "SSBO"
OpName %11 "SSBO"
OpName %16 "SV_DispatchThreadID"
OpDecorate %6 ArrayStride 4
OpMemberDecorate %7 0 Offset 0
OpDecorate %7 Block
OpDecorate %9 DescriptorSet 0
OpDecorate %9 Binding 0
OpDecorate %9 NonWritable
OpDecorate %9 Restrict
OpDecorate %10 ArrayStride 4
OpMemberDecorate %11 0 Offset 0
OpDecorate %11 Block
OpDecorate %13 DescriptorSet 0
OpDecorate %13 Binding 0
OpDecorate %13 NonReadable
OpDecorate %16 BuiltIn GlobalInvocationId
OpDecorate %26 BuiltIn LocalInvocationIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeRuntimeArray %5
%7 = OpTypeStruct %6
%8 = OpTypePointer StorageBuffer %7
%9 = OpVariable %8 StorageBuffer
%10 = OpTypeRuntimeArray %5
%11 = OpTypeStruct %10
%12 = OpTypePointer StorageBuffer %11
%13 = OpVariable %12 StorageBuffer
%14 = OpTypeVector %5 3
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpConstant %5 32
%18 = OpTypeFloat 32
%19 = OpTypeArray %18 %17
%20 = OpTypePointer Workgroup %19
%21 = OpVariable %20 Workgroup
%22 = OpTypePointer Input %5
%24 = OpConstant %5 0
%26 = OpVariable %22 Input
%28 = OpTypeVector %5 2
%30 = OpTypePointer StorageBuffer %5
%34 = OpTypePointer Workgroup %18
%37 = OpConstant %5 16
%39 = OpConstant %5 2
%40 = OpConstant %5 24840
%41 = OpTypeBool
%52 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
%50 = OpUndef %18
OpBranch %59
%59 = OpLabel
%23 = OpAccessChain %22 %16 %24
%25 = OpLoad %5 %23
%27 = OpLoad %5 %26
%31 = OpAccessChain %30 %9 %24 %25
%32 = OpLoad %5 %31
%33 = OpBitcast %18 %32
%35 = OpInBoundsAccessChain %34 %21 %27
OpStore %35 %33 NonPrivatePointer
OpBranch %60
%60 = OpLabel
%36 = OpPhi %5 %37 %59 %38 %65
OpLoopMerge %66 %61 None
OpBranch %61
%61 = OpLabel
OpControlBarrier %39 %39 %40
%42 = OpULessThan %41 %27 %36
OpSelectionMerge %63 None
OpBranchConditional %42 %62 %63
%62 = OpLabel
%43 = OpIAdd %5 %27 %36
%44 = OpInBoundsAccessChain %34 %21 %43
%45 = OpLoad %18 %44 NonPrivatePointer
%46 = OpInBoundsAccessChain %34 %21 %27
%47 = OpLoad %18 %46 NonPrivatePointer
%48 = OpFAdd %18 %47 %45
OpBranch %63
%63 = OpLabel
%49 = OpPhi %18 %50 %61 %48 %62
OpControlBarrier %39 %39 %40
OpSelectionMerge %65 None
OpBranchConditional %42 %64 %65
%64 = OpLabel
%51 = OpInBoundsAccessChain %34 %21 %27
OpStore %51 %49 NonPrivatePointer
OpBranch %65
%65 = OpLabel
%38 = OpShiftRightLogical %5 %36 %52
%53 = OpINotEqual %41 %38 %24
OpBranchConditional %53 %60 %66
%66 = OpLabel
OpControlBarrier %39 %39 %40
%54 = OpInBoundsAccessChain %34 %21 %24
%55 = OpLoad %18 %54 NonPrivatePointer
%57 = OpBitcast %5 %55
%58 = OpAccessChain %30 %13 %24 %25
OpStore %58 %57 NonPrivatePointer
OpReturn
OpFunctionEnd

