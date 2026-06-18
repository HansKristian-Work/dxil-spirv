#version 460

void main()
{
    float _14 = float(uint(gl_DrawID));
    gl_Position.x = _14;
    gl_Position.y = _14;
    gl_Position.z = _14;
    gl_Position.w = _14;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %12
OpName %3 "main"
OpName %8 "SV_Position"
OpDecorate %8 BuiltIn Position
OpDecorate %12 BuiltIn DrawIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%10 = OpTypeInt 32 0
%11 = OpTypePointer Input %10
%12 = OpVariable %11 Input
%15 = OpTypePointer Output %5
%17 = OpConstant %10 0
%19 = OpConstant %10 1
%21 = OpConstant %10 2
%23 = OpConstant %10 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%13 = OpLoad %10 %12
%14 = OpConvertUToF %5 %13
%16 = OpAccessChain %15 %8 %17
OpStore %16 %14
%18 = OpAccessChain %15 %8 %19
OpStore %18 %14
%20 = OpAccessChain %15 %8 %21
OpStore %20 %14
%22 = OpAccessChain %15 %8 %23
OpStore %22 %14
OpReturn
OpFunctionEnd
#endif
