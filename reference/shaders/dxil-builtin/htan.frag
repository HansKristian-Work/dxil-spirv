#version 460

layout(location = 0) in float A;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = tanh(A);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 15
; Schema: 0
OpCapability Shader
%11 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %9 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %13
%13 = OpLabel
%10 = OpLoad %5 %7
%12 = OpExtInst %5 %11 Tanh %10
OpStore %9 %12
OpReturn
OpFunctionEnd
#endif
