#version 460

in float gl_ClipDistance[2];

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = gl_ClipDistance[0u];
    SV_Target.y = gl_ClipDistance[0u];
    SV_Target.z = gl_ClipDistance[1u];
    SV_Target.w = gl_ClipDistance[1u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %13
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %13 "SV_Target"
OpDecorate %10 BuiltIn ClipDistance
OpDecorate %13 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 2
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeVector %5 4
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpTypePointer Input %5
%16 = OpConstant %6 0
%19 = OpConstant %6 1
%21 = OpTypePointer Output %5
%26 = OpConstant %6 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %27
%27 = OpLabel
%15 = OpAccessChain %14 %10 %16
%17 = OpLoad %5 %15
%18 = OpAccessChain %14 %10 %19
%20 = OpLoad %5 %18
%22 = OpAccessChain %21 %13 %16
OpStore %22 %17
%23 = OpAccessChain %21 %13 %19
OpStore %23 %17
%24 = OpAccessChain %21 %13 %7
OpStore %24 %20
%25 = OpAccessChain %21 %13 %26
OpStore %25 %20
OpReturn
OpFunctionEnd
#endif
