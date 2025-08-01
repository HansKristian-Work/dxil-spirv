SPIR-V:
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Geometry %3 "main" %8 %11 %12 %13 %15 %17
OpExecutionMode %3 Invocations 12
OpExecutionMode %3 OutputVertices 1
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %8 "SV_POSITION"
OpName %11 "SV_RenderTargetArrayIndex"
OpName %12 "SV_ViewportArrayIndex"
OpName %13 "SV_PrimitiveId"
OpDecorate %8 BuiltIn Position
OpDecorate %11 BuiltIn Layer
OpDecorate %12 BuiltIn ViewportIndex
OpDecorate %13 BuiltIn PrimitiveId
OpDecorate %15 BuiltIn InvocationId
OpDecorate %17 BuiltIn PrimitiveId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpVariable %10 Output
%13 = OpVariable %10 Output
%14 = OpTypePointer Input %9
%15 = OpVariable %14 Input
%17 = OpVariable %14 Input
%20 = OpConstant %9 12
%23 = OpConstant %9 1
%25 = OpTypePointer Output %5
%27 = OpConstant %9 0
%28 = OpConstant %5 1
%31 = OpConstant %9 2
%33 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%16 = OpLoad %9 %15
%18 = OpLoad %9 %17
%19 = OpIMul %9 %18 %20
%21 = OpIAdd %9 %16 %19
OpStore %13 %21
%22 = OpShiftRightLogical %9 %16 %23
OpStore %11 %22
%24 = OpBitwiseAnd %9 %16 %23
OpStore %12 %24
%26 = OpAccessChain %25 %8 %27
OpStore %26 %28
%29 = OpAccessChain %25 %8 %23
OpStore %29 %28
%30 = OpAccessChain %25 %8 %31
OpStore %30 %28
%32 = OpAccessChain %25 %8 %33
OpStore %32 %28
OpEmitVertex
OpEndPrimitive
OpReturn
OpFunctionEnd

