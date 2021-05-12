#version 460

layout(location = 0) in vec3 A;
layout(location = 0) out float SV_Target;

void main()
{
    precise float _22 = A.x * A.y;
    precise float _23 = _22 + A.z;
    SV_Target = _23;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
OpDecorate %22 NoContraction
OpDecorate %23 NoContraction
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpFMul %5 %15 %18
%23 = OpFAdd %5 %22 %21
OpStore %10 %23
OpReturn
OpFunctionEnd
#endif
