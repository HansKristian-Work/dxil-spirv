#version 460

layout(location = 0) flat in uvec2 A;
layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = min(A.x, A.y);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 21
; Schema: 0
OpCapability Shader
%18 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %10 "SV_Target"
OpDecorate %8 Flat
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpConstant %5 0
%16 = OpConstant %5 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %20
%20 = OpLabel
%12 = OpAccessChain %11 %8 %13
%14 = OpLoad %5 %12
%15 = OpAccessChain %11 %8 %16
%17 = OpLoad %5 %15
%19 = OpExtInst %5 %18 UMin %14 %17
OpStore %10 %19
OpReturn
OpFunctionEnd
#endif
