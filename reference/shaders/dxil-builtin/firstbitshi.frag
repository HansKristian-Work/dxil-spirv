#version 460

layout(location = 0) flat in int A;
layout(location = 0) out int SV_Target;

void main()
{
    uint _14 = uint(findMSB(int(uint(A))));
    uint _20 = (_14 == 4294967295u) ? 4294967295u : (31u - _14);
    SV_Target = int((_20 == 4294967295u) ? 4294967295u : (31u - _20));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
%13 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %7 %9
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %7 "A"
OpName %9 "SV_Target"
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
%11 = OpTypeInt 32 0
%15 = OpTypeBool
%17 = OpConstant %11 4294967295
%19 = OpConstant %11 31
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %25
%25 = OpLabel
%10 = OpLoad %5 %7
%12 = OpBitcast %11 %10
%14 = OpExtInst %11 %13 FindSMsb %12
%16 = OpIEqual %15 %14 %17
%18 = OpISub %11 %19 %14
%20 = OpSelect %11 %16 %17 %18
%21 = OpISub %11 %19 %20
%22 = OpIEqual %15 %20 %17
%23 = OpSelect %11 %22 %17 %21
%24 = OpBitcast %5 %23
OpStore %9 %24
OpReturn
OpFunctionEnd
#endif
