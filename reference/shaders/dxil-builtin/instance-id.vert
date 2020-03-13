#version 460

void main()
{
    float _16 = float(uint(gl_InstanceIndex) - uint(gl_BaseInstance));
    gl_Position.x = _16;
    gl_Position.y = _16;
    gl_Position.z = _16;
    gl_Position.w = _16;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability DrawParameters
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13
OpName %3 "main"
OpName %7 "SV_InstanceID"
OpName %11 "SV_Position"
OpDecorate %7 BuiltIn InstanceIndex
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn BaseInstance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypeVector %8 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%13 = OpVariable %6 Input
%17 = OpTypePointer Output %8
%19 = OpConstant %5 0
%21 = OpConstant %5 1
%23 = OpConstant %5 2
%25 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%12 = OpLoad %5 %7
%14 = OpLoad %5 %13
%15 = OpISub %5 %12 %14
%16 = OpConvertUToF %8 %15
%18 = OpAccessChain %17 %11 %19
OpStore %18 %16
%20 = OpAccessChain %17 %11 %21
OpStore %20 %16
%22 = OpAccessChain %17 %11 %23
OpStore %22 %16
%24 = OpAccessChain %17 %11 %25
OpStore %24 %16
OpReturn
OpFunctionEnd
#endif
