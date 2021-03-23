#version 460

in float gl_ClipDistance[2];

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = gl_ClipDistance[0u];
    SV_Target.y = gl_ClipDistance[1u];
    SV_Target.z = gl_ClipDistance[1u];
    SV_Target.w = gl_ClipDistance[0u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 29
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %14
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %14 "SV_Target"
OpDecorate %11 BuiltIn ClipDistance
OpDecorate %14 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 2
%9 = OpTypeArray %5 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeVector %5 4
%13 = OpTypePointer Output %12
%14 = OpVariable %13 Output
%15 = OpTypePointer Input %5
%17 = OpConstant %7 0
%20 = OpConstant %7 1
%22 = OpTypePointer Output %5
%27 = OpConstant %7 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%16 = OpAccessChain %15 %11 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %15 %11 %20
%21 = OpLoad %5 %19
%23 = OpAccessChain %22 %14 %17
OpStore %23 %18
%24 = OpAccessChain %22 %14 %20
OpStore %24 %21
%25 = OpAccessChain %22 %14 %8
OpStore %25 %21
%26 = OpAccessChain %22 %14 %27
OpStore %26 %18
OpReturn
OpFunctionEnd
#endif
