#version 460

layout(location = 0) in vec4 A;
layout(location = 1) in vec4 B;
layout(location = 0) out vec4 SV_Target;

void main()
{
    SV_Target.x = A.x / B.x;
    SV_Target.y = A.y / B.y;
    SV_Target.z = A.z / B.z;
    SV_Target.w = A.w / B.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 44
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
OpDecorate %9 Location 1
OpDecorate %11 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpTypePointer Output %6
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%18 = OpConstant %14 1
%21 = OpConstant %14 2
%24 = OpConstant %14 3
%38 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %43
%43 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpAccessChain %12 %9 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %12 %9 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %12 %9 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %12 %8 %15
%27 = OpLoad %5 %26
%28 = OpAccessChain %12 %8 %18
%29 = OpLoad %5 %28
%30 = OpAccessChain %12 %8 %21
%31 = OpLoad %5 %30
%32 = OpAccessChain %12 %8 %24
%33 = OpLoad %5 %32
%34 = OpFDiv %5 %27 %16
%35 = OpFDiv %5 %29 %19
%36 = OpFDiv %5 %31 %22
%37 = OpFDiv %5 %33 %25
%39 = OpAccessChain %38 %11 %15
OpStore %39 %34
%40 = OpAccessChain %38 %11 %18
OpStore %40 %35
%41 = OpAccessChain %38 %11 %21
OpStore %41 %36
%42 = OpAccessChain %38 %11 %24
OpStore %42 %37
OpReturn
OpFunctionEnd
#endif
