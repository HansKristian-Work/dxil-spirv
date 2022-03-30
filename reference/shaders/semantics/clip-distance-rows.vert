#version 460

out float gl_ClipDistance[2];

layout(location = 0) in vec4 POS;
layout(location = 1) in float CLIP;

void main()
{
    gl_Position.x = POS.x;
    gl_Position.y = POS.y;
    gl_Position.z = POS.z;
    gl_Position.w = POS.w;
    gl_ClipDistance[0u] = CLIP;
    gl_ClipDistance[1u] = CLIP + 1.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 41
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
%14 = OpConstant %13 2
%15 = OpTypeArray %5 %14
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%20 = OpConstant %13 0
%23 = OpConstant %13 1
%28 = OpConstant %13 3
%31 = OpConstant %5 1
%32 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %39
%39 = OpLabel
%18 = OpLoad %5 %10
%19 = OpAccessChain %9 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %9 %8 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %9 %8 %14
%26 = OpLoad %5 %25
%27 = OpAccessChain %9 %8 %28
%29 = OpLoad %5 %27
%30 = OpFAdd %5 %18 %31
%33 = OpAccessChain %32 %12 %20
OpStore %33 %21
%34 = OpAccessChain %32 %12 %23
OpStore %34 %24
%35 = OpAccessChain %32 %12 %14
OpStore %35 %26
%36 = OpAccessChain %32 %12 %28
OpStore %36 %29
%37 = OpAccessChain %32 %17 %20
OpStore %37 %18
%38 = OpAccessChain %32 %17 %23
OpStore %38 %30
OpReturn
OpFunctionEnd
#endif
