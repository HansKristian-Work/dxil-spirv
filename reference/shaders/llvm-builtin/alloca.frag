#version 460

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _14[4];
    _14[0u] = 1u;
    _14[1u] = 2u;
    _14[2u] = 3u;
    _14[3u] = 4u;
    _14[TEXCOORD & 3u] = TEXCOORD;
    SV_Target = ((_14[1u] + _14[0u]) + _14[2u]) + _14[3u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "TEXCOORD"
OpName %9 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpConstant %5 4
%12 = OpTypeArray %5 %11
%13 = OpTypePointer Function %12
%15 = OpTypePointer Function %5
%17 = OpConstant %5 0
%18 = OpConstant %5 1
%20 = OpConstant %5 2
%22 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
%14 = OpVariable %13 Function
OpBranch %33
%33 = OpLabel
%10 = OpLoad %5 %7
%16 = OpInBoundsAccessChain %15 %14 %17
OpStore %16 %18
%19 = OpInBoundsAccessChain %15 %14 %18
OpStore %19 %20
%21 = OpInBoundsAccessChain %15 %14 %20
OpStore %21 %22
%23 = OpInBoundsAccessChain %15 %14 %22
OpStore %23 %11
%24 = OpBitwiseAnd %5 %10 %22
%25 = OpInBoundsAccessChain %15 %14 %24
OpStore %25 %10
%26 = OpLoad %5 %16
%27 = OpLoad %5 %19
%28 = OpIAdd %5 %27 %26
%29 = OpLoad %5 %21
%30 = OpIAdd %5 %28 %29
%31 = OpLoad %5 %23
%32 = OpIAdd %5 %30 %31
OpStore %9 %32
OpReturn
OpFunctionEnd
#endif
