SPIR-V:
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 20
; Schema: 0
OpCapability Shader
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %10
OpName %3 "main"
OpDecorate %10 BuiltIn CullDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 2
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpTypePointer Output %5
%13 = OpConstant %6 0
%14 = OpConstant %5 0.699999988
%16 = OpConstant %6 1
%17 = OpConstant %5 0.100000001
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %18
%18 = OpLabel
%12 = OpAccessChain %11 %10 %13
OpStore %12 %14
%15 = OpAccessChain %11 %10 %16
OpStore %15 %17
OpReturn
OpFunctionEnd

