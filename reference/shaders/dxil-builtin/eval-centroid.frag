#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec2 SV_Target;

void main()
{
    SV_Target.x = interpolateAtCentroid(TEXCOORD.x);
    SV_Target.y = interpolateAtCentroid(TEXCOORD.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 25
; Schema: 0
OpCapability Shader
OpCapability InterpolationFunction
%15 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%18 = OpConstant %13 1
%20 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %23
%23 = OpLabel
%12 = OpAccessChain %11 %8 %14
%16 = OpExtInst %5 %15 InterpolateAtCentroid %12
%17 = OpAccessChain %11 %8 %18
%19 = OpExtInst %5 %15 InterpolateAtCentroid %17
%21 = OpAccessChain %20 %10 %14
OpStore %21 %16
%22 = OpAccessChain %20 %10 %18
OpStore %22 %19
OpReturn
OpFunctionEnd
#endif
