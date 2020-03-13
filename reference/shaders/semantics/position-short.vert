#version 460

void main()
{
    gl_Position.x = 1.0;
    gl_Position.y = 1.0;
    gl_Position.z = 1.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %9
OpName %3 "main"
OpName %9 "SV_Position"
OpDecorate %9 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypeVector %5 4
%8 = OpTypePointer Output %7
%9 = OpVariable %8 Output
%10 = OpTypePointer Output %5
%12 = OpTypeInt 32 0
%13 = OpConstant %12 0
%14 = OpConstant %5 1
%16 = OpConstant %12 1
%18 = OpConstant %12 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %19
%19 = OpLabel
%11 = OpAccessChain %10 %9 %13
OpStore %11 %14
%15 = OpAccessChain %10 %9 %16
OpStore %15 %14
%17 = OpAccessChain %10 %9 %18
OpStore %17 %14
OpReturn
OpFunctionEnd
#endif
