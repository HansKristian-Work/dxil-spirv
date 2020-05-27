#version 460

layout(location = 0) flat in uint V;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = float(V != 0u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 20
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "V"
OpName %10 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypePointer Output %8
%10 = OpVariable %9 Output
%12 = OpTypeBool
%14 = OpConstant %5 0
%15 = OpConstant %8 0
%16 = OpConstant %8 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %18
%18 = OpLabel
%11 = OpLoad %5 %7
%13 = OpINotEqual %12 %11 %14
%17 = OpSelect %8 %13 %16 %15
OpStore %10 %17
OpReturn
OpFunctionEnd
#endif
