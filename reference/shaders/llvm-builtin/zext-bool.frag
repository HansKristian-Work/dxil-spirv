#version 460

layout(location = 0) flat in uint V;
layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = uint(V != 40u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 18
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "V"
OpName %9 "SV_Target"
OpDecorate %7 Flat
OpDecorate %7 Location 0
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpTypeBool
%13 = OpConstant %5 40
%14 = OpConstant %5 0
%15 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %17
%17 = OpLabel
%10 = OpLoad %5 %7
%12 = OpINotEqual %11 %10 %13
%16 = OpSelect %5 %12 %15 %14
OpStore %9 %16
OpReturn
OpFunctionEnd
#endif
