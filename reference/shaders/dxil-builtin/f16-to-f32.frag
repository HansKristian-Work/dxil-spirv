#version 460

layout(location = 0) flat in uint A;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = unpackHalf2x16(A).x;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 17
; Schema: 0
OpCapability Shader
%12 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
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
%13 = OpTypeVector %8 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %16
%16 = OpLabel
%11 = OpLoad %5 %7
%14 = OpExtInst %13 %12 UnpackHalf2x16 %11
%15 = OpCompositeExtract %8 %14 0
OpStore %10 %15
OpReturn
OpFunctionEnd
#endif
