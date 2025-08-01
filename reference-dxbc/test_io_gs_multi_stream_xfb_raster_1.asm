SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability GeometryStreams
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Geometry %3 "main" %8 %11 %15
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 1
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %8 "BUFFER_A_ATTR"
OpName %11 "BUFFER_A_ATTR_1"
OpName %15 "SV_POSITION"
OpDecorate %8 Location 0
OpDecorate %11 Location 1
OpDecorate %15 Stream 1
OpDecorate %15 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 1
%6 = OpTypeVector %5 2
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 4
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpTypePointer Output %5
%18 = OpConstant %9 0
%19 = OpConstant %9 1
%22 = OpConstant %9 2
%24 = OpConstant %9 3
%25 = OpTypePointer Output %12
%27 = OpConstant %12 4
%29 = OpConstant %12 5
%31 = OpConstant %12 6
%33 = OpConstant %12 7
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%17 = OpAccessChain %16 %8 %18
%20 = OpBitcast %5 %19
OpStore %17 %20
%21 = OpAccessChain %16 %8 %19
%23 = OpBitcast %5 %22
OpStore %21 %23
OpStore %11 %24
OpEmitStreamVertex %18
OpEndStreamPrimitive %18
%26 = OpAccessChain %25 %15 %18
OpStore %26 %27
%28 = OpAccessChain %25 %15 %19
OpStore %28 %29
%30 = OpAccessChain %25 %15 %22
OpStore %30 %31
%32 = OpAccessChain %25 %15 %24
OpStore %32 %33
OpEmitStreamVertex %19
OpEndStreamPrimitive %19
OpReturn
OpFunctionEnd

