#version 460

layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = uint(gl_ViewportIndex);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 12
; Schema: 0
OpCapability Shader
OpCapability MultiViewport
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_ViewportArrayIndex"
OpName %9 "SV_Target"
OpDecorate %7 BuiltIn ViewportIndex
OpDecorate %7 Flat
OpDecorate %9 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
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
