#version 460

layout(location = 1) flat in uint INDEX;
layout(location = 0) out float SV_Target;

void main()
{
    float _33[4];
    _33[0u] = gl_FragCoord.x;
    _33[1u] = gl_FragCoord.y;
    _33[2u] = gl_FragCoord.z;
    _33[3u] = 1.0 / gl_FragCoord.w;
    SV_Target = _33[INDEX];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 42
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %11 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Position"
OpName %11 "INDEX"
OpName %13 "SV_Target"
OpDecorate %8 BuiltIn FragCoord
OpDecorate %11 Flat
OpDecorate %11 Location 1
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeInt 32 0
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %9 0
%20 = OpConstant %9 1
%23 = OpConstant %9 2
%26 = OpConstant %9 3
%29 = OpConstant %5 1
%30 = OpConstant %9 4
%31 = OpTypeArray %5 %30
%32 = OpTypePointer Function %31
%34 = OpTypePointer Function %5
%3 = OpFunction %1 None %2
%4 = OpLabel
%33 = OpVariable %32 Function
OpBranch %41
%41 = OpLabel
%14 = OpLoad %9 %11
%16 = OpAccessChain %15 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %15 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %15 %8 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %15 %8 %26
%27 = OpLoad %5 %25
%28 = OpFDiv %5 %29 %27
%35 = OpInBoundsAccessChain %34 %33 %17
OpStore %35 %18
%36 = OpInBoundsAccessChain %34 %33 %20
OpStore %36 %21
%37 = OpInBoundsAccessChain %34 %33 %23
OpStore %37 %24
%38 = OpInBoundsAccessChain %34 %33 %26
OpStore %38 %28
%39 = OpAccessChain %34 %33 %14
%40 = OpLoad %5 %39
OpStore %13 %40
OpReturn
OpFunctionEnd
#endif
