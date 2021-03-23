#version 460

in float gl_ClipDistance[4];

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = gl_ClipDistance[0u];
    SV_Target.y = gl_ClipDistance[1u];
    SV_Target.z = gl_ClipDistance[2u];
    SV_Target.w = gl_ClipDistance[3u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %13 %16
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %16 "SV_Target"
OpDecorate %13 BuiltIn ClipDistance
OpDecorate %16 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %6 %8
%10 = OpConstant %7 4
%11 = OpTypeArray %5 %10
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpTypeVector %5 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %7 0
%22 = OpConstant %7 1
%27 = OpConstant %7 3
%29 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %34
%34 = OpLabel
%18 = OpAccessChain %17 %13 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %17 %13 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %17 %13 %8
%25 = OpLoad %5 %24
%26 = OpAccessChain %17 %13 %27
%28 = OpLoad %5 %26
%30 = OpAccessChain %29 %16 %19
OpStore %30 %20
%31 = OpAccessChain %29 %16 %22
OpStore %31 %23
%32 = OpAccessChain %29 %16 %8
OpStore %32 %25
%33 = OpAccessChain %29 %16 %27
OpStore %33 %28
OpReturn
OpFunctionEnd
#endif
