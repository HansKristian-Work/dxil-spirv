#version 460

layout(location = 0) flat in uint A;
layout(location = 0) out uint SV_Target;

void main()
{
    uint _12 = uint(findMSB(A));
    uint _18 = (_12 == 4294967295u) ? 4294967295u : (31u - _12);
    SV_Target = (_18 == 4294967295u) ? 4294967295u : (31u - _18);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 24
; Schema: 0
OpCapability Shader
%11 = OpExtInstImport "GLSL.std.450"
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
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypePointer Output %5
%9 = OpVariable %8 Output
%13 = OpTypeBool
%15 = OpConstant %5 4294967295
%17 = OpConstant %5 31
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %22
%22 = OpLabel
%10 = OpLoad %5 %7
%12 = OpExtInst %5 %11 FindUMsb %10
%14 = OpIEqual %13 %12 %15
%16 = OpISub %5 %17 %12
%18 = OpSelect %5 %14 %15 %16
%19 = OpISub %5 %17 %18
%20 = OpIEqual %13 %18 %15
%21 = OpSelect %5 %20 %15 %19
OpStore %9 %21
OpReturn
OpFunctionEnd
#endif
