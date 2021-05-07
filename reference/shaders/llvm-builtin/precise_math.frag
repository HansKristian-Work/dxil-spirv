#version 460

layout(location = 0) in float A;
layout(location = 0, component = 1) in float B;
layout(location = 0, component = 2) in float C;
layout(location = 0) out float SV_Target;

void main()
{
    precise float _15 = B * A;
    precise float _16 = C + _15;
    precise float _17 = A + _16;
    precise float _18 = _17 - B;
    precise float _19 = C * _18;
    SV_Target = _19;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %8 %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %8 "B"
OpName %9 "C"
OpName %11 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %8 Location 0
OpDecorate %8 Component 1
OpDecorate %9 Location 0
OpDecorate %9 Component 2
OpDecorate %11 Location 0
OpDecorate %15 NoContraction
OpDecorate %16 NoContraction
OpDecorate %17 NoContraction
OpDecorate %18 NoContraction
OpDecorate %19 NoContraction
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpVariable %6 Input
%9 = OpVariable %6 Input
%10 = OpTypePointer Output %5
%11 = OpVariable %10 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%12 = OpLoad %5 %9
%13 = OpLoad %5 %8
%14 = OpLoad %5 %7
%15 = OpFMul %5 %13 %14
%16 = OpFAdd %5 %12 %15
%17 = OpFAdd %5 %14 %16
%18 = OpFSub %5 %17 %13
%19 = OpFMul %5 %12 %18
OpStore %11 %19
OpReturn
OpFunctionEnd
#endif
