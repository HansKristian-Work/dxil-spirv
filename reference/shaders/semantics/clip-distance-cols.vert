#version 460

out float gl_ClipDistance[2];

layout(location = 0) in vec4 POS;
layout(location = 1) in vec2 CLIP;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP.x;
    gl_ClipDistance[1u] = CLIP.y;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 43
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %11 %13 %18
OpName %3 "main"
OpName %8 "POS"
OpName %11 "CLIP"
OpName %13 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %11 Location 1
OpDecorate %13 BuiltIn Position
OpDecorate %18 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeVector %5 2
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %6
%13 = OpVariable %12 Output
%14 = OpTypeInt 32 0
%15 = OpConstant %14 2
%16 = OpTypeArray %5 %15
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %14 0
%24 = OpConstant %14 1
%33 = OpConstant %14 3
%35 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %42
%42 = OpLabel
%20 = OpAccessChain %19 %11 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %11 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %8 %21
%27 = OpLoad %5 %26
%28 = OpAccessChain %19 %8 %24
%29 = OpLoad %5 %28
%30 = OpAccessChain %19 %8 %15
%31 = OpLoad %5 %30
%32 = OpAccessChain %19 %8 %33
%34 = OpLoad %5 %32
%36 = OpAccessChain %35 %13 %21
OpStore %36 %27
%37 = OpAccessChain %35 %13 %24
OpStore %37 %29
%38 = OpAccessChain %35 %13 %15
OpStore %38 %31
%39 = OpAccessChain %35 %13 %33
OpStore %39 %34
%40 = OpAccessChain %35 %18 %21
OpStore %40 %22
%41 = OpAccessChain %35 %18 %24
OpStore %41 %25
OpReturn
OpFunctionEnd
#endif
