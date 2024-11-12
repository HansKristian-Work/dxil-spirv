#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require

layout(location = 0) flat in mediump uint A;
layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = uint(findLSB(uint(uint16_t(A))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 18
; Schema: 0
OpCapability Shader
OpCapability Int16
%13 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %9 "SV_Target"
OpDecorate %7 RelaxedPrecision
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
%11 = OpTypeInt 16 0
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %16
%16 = OpLabel
%10 = OpLoad %5 %7
%12 = OpUConvert %11 %10
%14 = OpUConvert %5 %12
%15 = OpExtInst %5 %13 FindILsb %14
OpStore %9 %15
OpReturn
OpFunctionEnd
#endif
