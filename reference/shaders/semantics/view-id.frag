#version 460

layout(location = 0) in vec4 POSITION;
layout(location = 0) out vec4 SV_Target;

void main()
{
    float _25 = float(0u);
    SV_Target.x = _25 + POSITION.x;
    SV_Target.y = _25 + POSITION.y;
    SV_Target.z = _25 + POSITION.z;
    SV_Target.w = _25 + POSITION.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 37
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %10
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "POSITION"
OpName %10 "SV_Target"
OpDecorate %8 Location 0
OpDecorate %10 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%23 = OpConstant %13 3
%30 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %35
%35 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%25 = OpConvertUToF %5 %14
%26 = OpFAdd %5 %25 %15
%27 = OpFAdd %5 %25 %18
%28 = OpFAdd %5 %25 %21
%29 = OpFAdd %5 %25 %24
%31 = OpAccessChain %30 %10 %14
OpStore %31 %26
%32 = OpAccessChain %30 %10 %17
OpStore %32 %27
%33 = OpAccessChain %30 %10 %20
OpStore %33 %28
%34 = OpAccessChain %30 %10 %23
OpStore %34 %29
OpReturn
OpFunctionEnd
#endif
