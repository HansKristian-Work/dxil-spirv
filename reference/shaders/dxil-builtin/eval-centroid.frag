#version 460

layout(location = 0) in vec2 TEXCOORD[2];
layout(location = 0, component = 2) in float UV;
layout(location = 0, component = 3) in float UV_1[2];
layout(location = 2) flat in uint A;
layout(location = 2, component = 1) flat in uint B;
layout(location = 0) out vec2 SV_Target;

void main()
{
    float _38 = interpolateAtCentroid(UV_1[A]) + interpolateAtCentroid(UV);
    SV_Target.x = (interpolateAtCentroid(TEXCOORD[B].x) + interpolateAtCentroid(TEXCOORD[A].x)) + _38;
    SV_Target.y = (interpolateAtCentroid(TEXCOORD[B].y) + interpolateAtCentroid(TEXCOORD[A].y)) + _38;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability InterpolationFunction
%26 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %13 %16 %18 %19 %21
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %13 "UV"
OpName %16 "UV_1"
OpName %18 "A"
OpName %19 "B"
OpName %21 "SV_Target"
OpDecorate %11 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 2
OpDecorate %16 Location 0
OpDecorate %16 Component 3
OpDecorate %18 Flat
OpDecorate %18 Location 2
OpDecorate %19 Flat
OpDecorate %19 Location 2
OpDecorate %19 Component 1
OpDecorate %21 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %5
%13 = OpVariable %12 Input
%14 = OpTypeArray %5 %8
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Input %7
%18 = OpVariable %17 Input
%19 = OpVariable %17 Input
%20 = OpTypePointer Output %6
%21 = OpVariable %20 Output
%25 = OpConstant %7 0
%29 = OpConstant %7 1
%43 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%22 = OpLoad %7 %19
%23 = OpLoad %7 %18
%24 = OpAccessChain %12 %11 %23 %25
%27 = OpExtInst %5 %26 InterpolateAtCentroid %24
%28 = OpAccessChain %12 %11 %23 %29
%30 = OpExtInst %5 %26 InterpolateAtCentroid %28
%31 = OpAccessChain %12 %11 %22 %25
%32 = OpExtInst %5 %26 InterpolateAtCentroid %31
%33 = OpAccessChain %12 %11 %22 %29
%34 = OpExtInst %5 %26 InterpolateAtCentroid %33
%35 = OpExtInst %5 %26 InterpolateAtCentroid %13
%36 = OpAccessChain %12 %16 %23
%37 = OpExtInst %5 %26 InterpolateAtCentroid %36
%38 = OpFAdd %5 %37 %35
%39 = OpFAdd %5 %32 %27
%40 = OpFAdd %5 %39 %38
%41 = OpFAdd %5 %34 %30
%42 = OpFAdd %5 %41 %38
%44 = OpAccessChain %43 %21 %25
OpStore %44 %40
%45 = OpAccessChain %43 %21 %29
OpStore %45 %42
OpReturn
OpFunctionEnd
#endif
