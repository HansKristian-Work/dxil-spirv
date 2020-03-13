#version 460

out float gl_ClipDistance[1];

layout(location = 0) in vec4 POS;
layout(location = 1) in float CLIP;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 38
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %10 %12 %17
OpName %3 "main"
OpName %8 "POS"
OpName %10 "CLIP"
OpName %12 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %10 Location 1
OpDecorate %12 BuiltIn Position
OpDecorate %17 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Input %5
%10 = OpVariable %9 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypeInt 32 0
%14 = OpConstant %13 1
%15 = OpTypeArray %5 %14
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%20 = OpConstant %13 0
%25 = OpConstant %13 2
%28 = OpConstant %13 3
%30 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %36
%36 = OpLabel
%18 = OpLoad %5 %10
%19 = OpAccessChain %9 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %9 %8 %14
%23 = OpLoad %5 %22
%24 = OpAccessChain %9 %8 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %9 %8 %28
%29 = OpLoad %5 %27
%31 = OpAccessChain %30 %12 %20
OpStore %31 %21
%32 = OpAccessChain %30 %12 %14
OpStore %32 %23
%33 = OpAccessChain %30 %12 %25
OpStore %33 %26
%34 = OpAccessChain %30 %12 %28
OpStore %34 %29
%35 = OpAccessChain %30 %17 %20
OpStore %35 %18
OpReturn
OpFunctionEnd
#endif
