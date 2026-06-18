#version 460

vec4 _18;

layout(location = 0) in vec4 A;
layout(location = 1) in vec4 B;
layout(location = 0) out float SV_Target;

void main()
{
    vec4 _17;
    _17.x = B.x;
    _17.y = B.y;
    _17.z = B.z;
    _17.w = B.w;
    vec4 _33;
    _33.x = A.x;
    _33.y = A.y;
    _33.z = A.z;
    _33.w = A.w;
    SV_Target = dot(_33, _17);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 46
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
%10 = OpTypePointer Output %5
%11 = OpVariable %10 Output
%12 = OpTypePointer Input %5
%14 = OpTypeInt 32 0
%15 = OpConstant %14 0
%20 = OpConstant %14 1
%24 = OpConstant %14 2
%28 = OpConstant %14 3
%3 = OpFunction %1 None %2
%4 = OpLabel
%18 = OpUndef %6
OpBranch %44
%44 = OpLabel
%13 = OpAccessChain %12 %9 %15
%16 = OpLoad %5 %13
%17 = OpCompositeInsert %6 %16 %18 0
%19 = OpAccessChain %12 %9 %20
%21 = OpLoad %5 %19
%22 = OpCompositeInsert %6 %21 %17 1
%23 = OpAccessChain %12 %9 %24
%25 = OpLoad %5 %23
%26 = OpCompositeInsert %6 %25 %22 2
%27 = OpAccessChain %12 %9 %28
%29 = OpLoad %5 %27
%30 = OpCompositeInsert %6 %29 %26 3
%31 = OpAccessChain %12 %8 %15
%32 = OpLoad %5 %31
%33 = OpCompositeInsert %6 %32 %18 0
%34 = OpAccessChain %12 %8 %20
%35 = OpLoad %5 %34
%36 = OpCompositeInsert %6 %35 %33 1
%37 = OpAccessChain %12 %8 %24
%38 = OpLoad %5 %37
%39 = OpCompositeInsert %6 %38 %36 2
%40 = OpAccessChain %12 %8 %28
%41 = OpLoad %5 %40
%42 = OpCompositeInsert %6 %41 %39 3
%43 = OpDot %5 %42 %30
OpStore %11 %43
OpReturn
OpFunctionEnd
#endif
