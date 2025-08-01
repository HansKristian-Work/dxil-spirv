SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability Geometry
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
OpName %15 "BUFFER_B_ATTR"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
OpDecorate %11 Component 3
OpDecorate %15 Location 1
OpDecorate %15 Component 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypeInt 32 1
%13 = OpTypeVector %12 2
%14 = OpTypePointer Output %13
%15 = OpVariable %14 Output
%16 = OpTypePointer Output %5
%18 = OpConstant %9 0
%19 = OpConstant %5 1
%21 = OpConstant %9 1
%22 = OpConstant %5 2
%24 = OpConstant %9 2
%25 = OpConstant %5 3
%26 = OpConstant %9 4
%27 = OpTypePointer Output %12
%29 = OpConstant %9 5
%32 = OpConstant %9 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%17 = OpAccessChain %16 %8 %18
OpStore %17 %19
%20 = OpAccessChain %16 %8 %21
OpStore %20 %22
%23 = OpAccessChain %16 %8 %24
OpStore %23 %25
OpStore %11 %26
OpEmitVertex
OpEndPrimitive
%28 = OpAccessChain %27 %15 %18
%30 = OpBitcast %12 %29
OpStore %28 %30
%31 = OpAccessChain %27 %15 %21
%33 = OpBitcast %12 %32
OpStore %31 %33
OpEmitVertex
OpEndPrimitive
OpReturn
OpFunctionEnd

