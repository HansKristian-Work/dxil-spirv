#version 460

layout(location = 0) in vec2 A;
layout(location = 0, component = 2) in vec2 B;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = dot(vec2(A.x, A.y), vec2(B.x, B.y));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %9 %11
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %11 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %9 Location 0
OpDecorate %9 Component 2
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpTypePointer Output %5
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %27
%27 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %9 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %8 %15
%21 = OpLoad %5 %20
%22 = OpAccessChain %12 %8 %18
%23 = OpLoad %5 %22
%25 = OpCompositeConstruct %6 %21 %23
%26 = OpCompositeConstruct %6 %16 %19
%24 = OpDot %5 %25 %26
OpStore %11 %24
OpReturn
OpFunctionEnd
#endif
