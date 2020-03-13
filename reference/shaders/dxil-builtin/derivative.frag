#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = dFdxFine(TEXCOORD.x) + dFdxCoarse(TEXCOORD.x);
    SV_Target.y = dFdxFine(TEXCOORD.y) + dFdxCoarse(TEXCOORD.y);
    SV_Target.z = dFdyFine(TEXCOORD.x) + dFdyCoarse(TEXCOORD.x);
    SV_Target.w = dFdyFine(TEXCOORD.y) + dFdyCoarse(TEXCOORD.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 41
; Schema: 0
OpCapability Shader
OpCapability DerivativeControl
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%32 = OpTypePointer Output %5
%36 = OpConstant %14 2
%38 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%20 = OpDPdxCoarse %5 %16
%21 = OpDPdxCoarse %5 %19
%22 = OpDPdyCoarse %5 %16
%23 = OpDPdyCoarse %5 %19
%24 = OpDPdxFine %5 %16
%25 = OpDPdxFine %5 %19
%26 = OpFAdd %5 %24 %20
%27 = OpFAdd %5 %25 %21
%28 = OpDPdyFine %5 %16
%29 = OpDPdyFine %5 %19
%30 = OpFAdd %5 %28 %22
%31 = OpFAdd %5 %29 %23
%33 = OpAccessChain %32 %11 %15
OpStore %33 %26
%34 = OpAccessChain %32 %11 %18
OpStore %34 %27
%35 = OpAccessChain %32 %11 %36
OpStore %35 %30
%37 = OpAccessChain %32 %11 %38
OpStore %37 %31
OpReturn
OpFunctionEnd
#endif
