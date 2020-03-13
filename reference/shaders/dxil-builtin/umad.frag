#version 460

layout(location = 0) flat in uvec3 A;
layout(location = 0) out uint SV_Target;

void main()
{
    SV_Target = (A.x * A.y) + A.z;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 25
; Schema: 0
OpCapability Shader
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
%6 = OpTypeVector %5 3
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %5
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpConstant %5 0
%16 = OpConstant %5 1
%19 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %23
%23 = OpLabel
%12 = OpAccessChain %11 %8 %13
%14 = OpLoad %5 %12
%15 = OpAccessChain %11 %8 %16
%17 = OpLoad %5 %15
%18 = OpAccessChain %11 %8 %19
%20 = OpLoad %5 %18
%21 = OpIMul %5 %14 %17
%22 = OpIAdd %5 %21 %20
OpStore %10 %22
OpReturn
OpFunctionEnd
#endif
