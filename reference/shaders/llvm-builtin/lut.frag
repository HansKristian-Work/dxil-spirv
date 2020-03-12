#version 460

const uint _29[16] = uint[](1u, 4294967295u, 2u, 4294967294u, 3u, 4294967293u, 5u, 4294967291u, 7u, 4294967289u, 11u, 4294967285u, 13u, 4294967283u, 17u, 4294967279u);

layout(location = 0) flat in uint TEXCOORD;
layout(location = 0) out uvec2 SV_Target;

void main()
{
    SV_Target.x = _29[0u + (TEXCOORD * 2u)];
    SV_Target.y = _29[1u + (TEXCOORD * 2u)];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "TEXCOORD"
OpName %10 "SV_Target"
OpName %31 "values.v.1dim"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeVector %5 2
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%11 = OpConstant %5 16
%12 = OpTypeArray %5 %11
%13 = OpConstant %5 1
%14 = OpConstant %5 4294967295
%15 = OpConstant %5 2
%16 = OpConstant %5 4294967294
%17 = OpConstant %5 3
%18 = OpConstant %5 4294967293
%19 = OpConstant %5 5
%20 = OpConstant %5 4294967291
%21 = OpConstant %5 7
%22 = OpConstant %5 4294967289
%23 = OpConstant %5 11
%24 = OpConstant %5 4294967285
%25 = OpConstant %5 13
%26 = OpConstant %5 4294967283
%27 = OpConstant %5 17
%28 = OpConstant %5 4294967279
%29 = OpConstantComposite %12 %13 %14 %15 %16 %17 %18 %19 %20 %21 %22 %23 %24 %25 %26 %27 %28
%30 = OpTypePointer Private %12
%31 = OpVariable %30 Private %29
%35 = OpConstant %5 0
%36 = OpTypePointer Private %5
%43 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%32 = OpLoad %5 %7
%33 = OpIMul %5 %32 %15
%34 = OpIAdd %5 %35 %33
%37 = OpAccessChain %36 %31 %34
%38 = OpLoad %5 %37
%39 = OpIMul %5 %32 %15
%40 = OpIAdd %5 %13 %39
%41 = OpAccessChain %36 %31 %40
%42 = OpLoad %5 %41
%44 = OpAccessChain %43 %10 %35
OpStore %44 %38
%45 = OpAccessChain %43 %10 %13
OpStore %45 %42
OpReturn
OpFunctionEnd
#endif
