#version 460

out float gl_ClipDistance[4];

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
    gl_ClipDistance[2u] = CLIP.x + 1.0;
    gl_ClipDistance[3u] = CLIP.y + 1.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 50
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %11 %13 %20
OpName %3 "main"
OpName %8 "POS"
OpName %11 "CLIP"
OpName %13 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %11 Location 1
OpDecorate %13 BuiltIn Position
OpDecorate %20 BuiltIn ClipDistance
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
%16 = OpTypeArray %9 %15
%17 = OpConstant %14 4
%18 = OpTypeArray %5 %17
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%21 = OpTypePointer Input %5
%23 = OpConstant %14 0
%26 = OpConstant %14 1
%35 = OpConstant %14 3
%37 = OpTypePointer Output %5
%45 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %49
%49 = OpLabel
%22 = OpAccessChain %21 %11 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %21 %11 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %21 %8 %23
%29 = OpLoad %5 %28
%30 = OpAccessChain %21 %8 %26
%31 = OpLoad %5 %30
%32 = OpAccessChain %21 %8 %15
%33 = OpLoad %5 %32
%34 = OpAccessChain %21 %8 %35
%36 = OpLoad %5 %34
%38 = OpAccessChain %37 %13 %23
OpStore %38 %29
%39 = OpAccessChain %37 %13 %26
OpStore %39 %31
%40 = OpAccessChain %37 %13 %15
OpStore %40 %33
%41 = OpAccessChain %37 %13 %35
OpStore %41 %36
%42 = OpAccessChain %37 %20 %23
OpStore %42 %24
%43 = OpAccessChain %37 %20 %26
OpStore %43 %27
%44 = OpFAdd %5 %24 %45
%46 = OpFAdd %5 %27 %45
%47 = OpAccessChain %37 %20 %15
OpStore %47 %44
%48 = OpAccessChain %37 %20 %35
OpStore %48 %46
OpReturn
OpFunctionEnd
#endif
