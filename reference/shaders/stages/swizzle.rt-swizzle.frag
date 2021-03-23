#version 460

layout(location = 0) in vec4 TEXCOORD;
layout(location = 0) out vec4 SV_Target;
layout(location = 1) out vec4 SV_Target_1;

void main()
{
    SV_Target.y = TEXCOORD.x;
    SV_Target.z = TEXCOORD.y;
    SV_Target.w = TEXCOORD.z;
    SV_Target.x = TEXCOORD.w;
    SV_Target_1.y = TEXCOORD.x;
    SV_Target_1.x = TEXCOORD.y;
    SV_Target_1.w = TEXCOORD.z;
    SV_Target_1.z = TEXCOORD.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 36
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "TEXCOORD"
OpName %10 "SV_Target"
OpName %11 "SV_Target_1"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
OpDecorate %11 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpVariable %9 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%21 = OpConstant %14 2
%24 = OpConstant %14 3
%26 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%13 = OpAccessChain %12 %8 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %8 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %8 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %12 %8 %24
%25 = OpLoad %5 %23
%27 = OpAccessChain %26 %10 %18
OpStore %27 %16
%28 = OpAccessChain %26 %10 %21
OpStore %28 %19
%29 = OpAccessChain %26 %10 %24
OpStore %29 %22
%30 = OpAccessChain %26 %10 %15
OpStore %30 %25
%31 = OpAccessChain %26 %11 %18
OpStore %31 %16
%32 = OpAccessChain %26 %11 %15
OpStore %32 %19
%33 = OpAccessChain %26 %11 %24
OpStore %33 %22
%34 = OpAccessChain %26 %11 %21
OpStore %34 %25
OpReturn
OpFunctionEnd
#endif
