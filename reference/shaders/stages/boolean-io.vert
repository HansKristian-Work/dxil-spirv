#version 460

layout(location = 0) in uint A;
layout(location = 1) flat out uint V;

void main()
{
    gl_Position.x = 1.0;
    gl_Position.y = 1.0;
    gl_Position.z = 1.0;
    gl_Position.w = 1.0;
    V = 1u;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 25
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13
OpName %3 "main"
OpName %7 "A"
OpName %11 "SV_Position"
OpName %13 "V"
OpDecorate %7 Location 0
OpDecorate %11 BuiltIn Position
OpDecorate %13 Flat
OpDecorate %13 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypeVector %8 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%14 = OpTypePointer Output %8
%16 = OpConstant %5 0
%17 = OpConstant %8 1
%19 = OpConstant %5 1
%21 = OpConstant %5 2
%23 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%15 = OpAccessChain %14 %11 %16
OpStore %15 %17
%18 = OpAccessChain %14 %11 %19
OpStore %18 %17
%20 = OpAccessChain %14 %11 %21
OpStore %20 %17
%22 = OpAccessChain %14 %11 %23
OpStore %22 %17
OpStore %13 %19
OpReturn
OpFunctionEnd
#endif
