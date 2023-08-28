#version 460

layout(location = 0) in vec2 TEXCOORD;
layout(location = 0) out vec4 SV_Target;

void main()
{
    mediump float _32 = TEXCOORD.x;
    mediump float _33 = TEXCOORD.y;
    SV_Target.x = ((dFdxFine(TEXCOORD.x) + dFdxCoarse(TEXCOORD.x)) + dFdxCoarse(_32)) + dFdxFine(_32);
    SV_Target.y = ((dFdxFine(TEXCOORD.y) + dFdxCoarse(TEXCOORD.y)) + dFdxCoarse(_33)) + dFdxFine(_33);
    SV_Target.z = ((dFdyFine(TEXCOORD.x) + dFdyCoarse(TEXCOORD.x)) + dFdyCoarse(_32)) + dFdyFine(_32);
    SV_Target.w = ((dFdyFine(TEXCOORD.y) + dFdyCoarse(TEXCOORD.y)) + dFdyCoarse(_33)) + dFdyFine(_33);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 59
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
OpDecorate %32 RelaxedPrecision
OpDecorate %33 RelaxedPrecision
OpDecorate %34 RelaxedPrecision
OpDecorate %35 RelaxedPrecision
OpDecorate %38 RelaxedPrecision
OpDecorate %39 RelaxedPrecision
OpDecorate %42 RelaxedPrecision
OpDecorate %43 RelaxedPrecision
OpDecorate %46 RelaxedPrecision
OpDecorate %47 RelaxedPrecision
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
%50 = OpTypePointer Output %5
%54 = OpConstant %14 2
%56 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %57
%57 = OpLabel
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
%32 = OpCopyObject %5 %16
%33 = OpCopyObject %5 %19
%34 = OpDPdxCoarse %5 %32
%35 = OpDPdxCoarse %5 %33
%36 = OpFAdd %5 %26 %34
%37 = OpFAdd %5 %27 %35
%38 = OpDPdyCoarse %5 %32
%39 = OpDPdyCoarse %5 %33
%40 = OpFAdd %5 %30 %38
%41 = OpFAdd %5 %31 %39
%42 = OpDPdxFine %5 %32
%43 = OpDPdxFine %5 %33
%44 = OpFAdd %5 %36 %42
%45 = OpFAdd %5 %37 %43
%46 = OpDPdyFine %5 %32
%47 = OpDPdyFine %5 %33
%48 = OpFAdd %5 %40 %46
%49 = OpFAdd %5 %41 %47
%51 = OpAccessChain %50 %11 %15
OpStore %51 %44
%52 = OpAccessChain %50 %11 %18
OpStore %52 %45
%53 = OpAccessChain %50 %11 %54
OpStore %53 %48
%55 = OpAccessChain %50 %11 %56
OpStore %55 %49
OpReturn
OpFunctionEnd
#endif
