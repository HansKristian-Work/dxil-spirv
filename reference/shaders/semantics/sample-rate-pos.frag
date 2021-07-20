#version 460

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = gl_FragCoord.x;
    SV_Target.y = gl_FragCoord.y;
    SV_Target.z = gl_FragCoord.z;
    SV_Target.w = 1.0 / gl_FragCoord.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Position"
OpName %10 "SV_Target"
OpDecorate %8 BuiltIn FragCoord
OpDecorate %8 Sample
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%23 = OpConstant %13 3
%26 = OpConstant %5 1
%27 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%25 = OpFDiv %5 %26 %24
%28 = OpAccessChain %27 %10 %14
OpStore %28 %15
%29 = OpAccessChain %27 %10 %17
OpStore %29 %18
%30 = OpAccessChain %27 %10 %20
OpStore %30 %21
%31 = OpAccessChain %27 %10 %23
OpStore %31 %25
OpReturn
OpFunctionEnd
#endif
