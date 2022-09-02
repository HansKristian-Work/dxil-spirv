#version 460

layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = 1.0;
    SV_Target.y = 1.0;
    SV_Target.z = 1.0;
    SV_Target.w = 1.0;
    gl_SampleMask[0u] = int(uint(gl_SampleMaskIn[0u]) & 3u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 33
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %8 %13 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %8 "SV_Target"
OpName %13 "SV_Coverage"
OpDecorate %8 Location 0
OpDecorate %13 BuiltIn SampleMask
OpDecorate %15 BuiltIn SampleMask
OpDecorate %15 Flat
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpConstant %9 1
%11 = OpTypeArray %9 %10
%12 = OpTypePointer Output %11
%13 = OpVariable %12 Output
%14 = OpTypePointer Input %11
%15 = OpVariable %14 Input
%16 = OpTypePointer Input %9
%18 = OpConstant %9 0
%21 = OpConstant %9 3
%22 = OpTypePointer Output %5
%24 = OpConstant %5 1
%27 = OpConstant %9 2
%29 = OpTypePointer Output %9
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %31
%31 = OpLabel
%17 = OpAccessChain %16 %15 %18
%19 = OpLoad %9 %17
%20 = OpBitwiseAnd %9 %19 %21
%23 = OpAccessChain %22 %8 %18
OpStore %23 %24
%25 = OpAccessChain %22 %8 %10
OpStore %25 %24
%26 = OpAccessChain %22 %8 %27
OpStore %26 %24
%28 = OpAccessChain %22 %8 %21
OpStore %28 %24
%30 = OpAccessChain %29 %13 %18
OpStore %30 %20
OpReturn
OpFunctionEnd
#endif
