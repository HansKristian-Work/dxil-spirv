#version 460

layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = gl_SampleMaskIn[0u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 17
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %11 BuiltIn SampleMask
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Output %5
%7 = OpVariable %6 Output
%8 = OpConstant %5 1
%9 = OpTypeArray %5 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %5
%14 = OpConstant %5 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %16
%16 = OpLabel
%13 = OpAccessChain %12 %11 %14
%15 = OpLoad %5 %13
OpStore %7 %15
OpReturn
OpFunctionEnd
#endif
