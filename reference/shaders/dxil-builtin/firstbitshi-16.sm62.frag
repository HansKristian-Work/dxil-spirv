#version 460
#extension GL_EXT_shader_explicit_arithmetic_types_int16 : require
#extension GL_EXT_shader_16bit_storage : require

layout(location = 0) flat in mediump int A;
layout(location = 0) out int SV_Target;

void main()
{
    uint16_t _12 = uint16_t(A);
    uint _16 = uint(findMSB(int(uint(int16_t(_12)))));
    uint _22 = (_16 == 4294967295u) ? 4294967295u : (15u - _16);
    SV_Target = int(uint(findMSB(int(uint(int16_t(_12))))));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 30
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
%5 = OpTypeInt 32 1
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%11 = OpTypeInt 16 0
%14 = OpTypeInt 32 0
%17 = OpTypeBool
%19 = OpConstant %14 4294967295
%21 = OpConstant %14 15
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %28
%28 = OpLabel
%10 = OpLoad %5 %7
%12 = OpSConvert %11 %10
%15 = OpSConvert %14 %12
%16 = OpExtInst %14 %13 FindSMsb %15
%18 = OpIEqual %17 %16 %19
%20 = OpISub %14 %21 %16
%22 = OpSelect %14 %18 %19 %20
%23 = OpISub %14 %21 %22
%24 = OpIEqual %17 %22 %19
%25 = OpSConvert %14 %12
%26 = OpExtInst %14 %13 FindSMsb %25
%27 = OpBitcast %5 %26
OpStore %9 %27
OpReturn
OpFunctionEnd
#endif
