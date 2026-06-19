#version 460

layout(location = 0) in float V;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = unpackHalf2x16(packHalf2x16(vec2(V, 0.0))).x;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 22
; Schema: 0
OpCapability Shader
OpCapability FloatControls2
OpExtension "SPV_KHR_float_controls2"
%11 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpExecutionModeId %3 FPFastMathDefault %5 %19
OpName %3 "main"
OpName %7 "V"
OpName %9 "SV_Target"
OpDecorate %7 Location 0
OpDecorate %9 Location 0
OpDecorate %13 FPFastMathMode AllowRecip
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%12 = OpTypeInt 32 0
%14 = OpConstant %5 0
%15 = OpTypeVector %5 2
%19 = OpConstant %12 458767
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%10 = OpLoad %5 %7
%16 = OpCompositeConstruct %15 %10 %14
%13 = OpExtInst %12 %11 PackHalf2x16 %16
%17 = OpExtInst %15 %11 UnpackHalf2x16 %13
%18 = OpCompositeExtract %5 %17 0
OpStore %9 %18
OpReturn
OpFunctionEnd
#endif
