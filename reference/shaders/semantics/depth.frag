#version 460

layout(location = 0) in float D;

void main()
{
    gl_FragDepth = D;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 12
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpExecutionMode %3 DepthReplacing
OpName %3 "main"
OpName %7 "D"
OpName %9 "SV_Depth"
OpDecorate %7 Location 0
OpDecorate %9 BuiltIn FragDepth
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %11
%11 = OpLabel
%10 = OpLoad %5 %7
OpStore %9 %10
OpReturn
OpFunctionEnd
#endif
