#version 460

layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = float((gl_FrontFacing ? 4294967295u : 0u) != 0u);
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
OpEntryPoint Fragment %3 "main" %8 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_IsFrontFace"
OpName %11 "SV_Target"
OpDecorate %8 BuiltIn FrontFacing
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeBool
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypeFloat 32
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%14 = OpConstant %5 4294967295
%15 = OpConstant %5 0
%18 = OpConstant %9 1
%19 = OpConstant %9 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%12 = OpLoad %6 %8
%13 = OpSelect %5 %12 %14 %15
%16 = OpINotEqual %6 %13 %15
%17 = OpSelect %9 %16 %18 %19
OpStore %11 %17
OpReturn
OpFunctionEnd
#endif
