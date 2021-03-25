; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 25
; Schema: 0
OpCapability Shader
OpCapability FragmentShadingRateKHR
OpExtension "SPV_KHR_fragment_shading_rate"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %11
OpName %3 "main"
OpName %8 "SV_Position"
OpName %11 "SV_ShadingRate"
OpDecorate %8 BuiltIn Position
OpDecorate %11 BuiltIn PrimitiveShadingRateKHR
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Output %5
%14 = OpConstant %9 0
%15 = OpConstant %5 1
%17 = OpConstant %9 1
%19 = OpConstant %9 2
%21 = OpConstant %9 3
%22 = OpConstant %9 10
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %23
%23 = OpLabel
%13 = OpAccessChain %12 %8 %14
OpStore %13 %15
%16 = OpAccessChain %12 %8 %17
OpStore %16 %15
%18 = OpAccessChain %12 %8 %19
OpStore %18 %15
%20 = OpAccessChain %12 %8 %21
OpStore %20 %15
OpStore %11 %22
OpReturn
OpFunctionEnd

