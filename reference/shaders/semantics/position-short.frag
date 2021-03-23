#version 460

layout(location = 0) out vec3 SV_Target;

void main()
{
    SV_Target.x = gl_FragCoord.x;
    SV_Target.y = gl_FragCoord.y;
    SV_Target.z = gl_FragCoord.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 "SV_Position"
OpName %11 "SV_Target"
OpDecorate %9 BuiltIn FragCoord
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypeVector %5 4
%8 = OpTypePointer Input %7
%9 = OpVariable %8 Input
%10 = OpTypePointer Output %6
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%21 = OpConstant %14 2
%23 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %27
%27 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %9 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %9 %21
%22 = OpLoad %5 %20
%24 = OpAccessChain %23 %11 %15
OpStore %24 %16
%25 = OpAccessChain %23 %11 %18
OpStore %25 %19
%26 = OpAccessChain %23 %11 %21
OpStore %26 %22
OpReturn
OpFunctionEnd
#endif
