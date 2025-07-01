#version 460

in float gl_ClipDistance[4];
in float gl_CullDistance[3];

layout(location = 0) out vec4 SV_Target;

void main()
{
    float _37 = gl_CullDistance[0u] + gl_CullDistance[2u];
    float _39 = gl_CullDistance[1u] + gl_CullDistance[2u];
    SV_Target.x = gl_ClipDistance[0u] + _37;
    SV_Target.y = gl_ClipDistance[1u] + _39;
    SV_Target.z = gl_ClipDistance[2u] + _37;
    SV_Target.w = _39 + gl_ClipDistance[3u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 50
; Schema: 0
OpCapability Shader
OpCapability ClipDistance
OpCapability CullDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %11 %15 %18
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %18 "SV_Target"
OpDecorate %11 BuiltIn ClipDistance
OpDecorate %15 BuiltIn CullDistance
OpDecorate %18 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 2
%7 = OpTypeInt 32 0
%8 = OpConstant %7 4
%9 = OpTypeArray %5 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpConstant %7 3
%13 = OpTypeArray %5 %12
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypeVector %5 4
%17 = OpTypePointer Output %16
%18 = OpVariable %17 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %7 2
%24 = OpConstant %7 0
%27 = OpConstant %7 1
%43 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %48
%48 = OpLabel
%20 = OpAccessChain %19 %15 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %15 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %15 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %19 %11 %12
%30 = OpLoad %5 %29
%31 = OpAccessChain %19 %11 %21
%32 = OpLoad %5 %31
%33 = OpAccessChain %19 %11 %24
%34 = OpLoad %5 %33
%35 = OpAccessChain %19 %11 %27
%36 = OpLoad %5 %35
%37 = OpFAdd %5 %25 %22
%38 = OpFAdd %5 %34 %37
%39 = OpFAdd %5 %28 %22
%40 = OpFAdd %5 %36 %39
%41 = OpFAdd %5 %32 %37
%42 = OpFAdd %5 %39 %30
%44 = OpAccessChain %43 %18 %24
OpStore %44 %38
%45 = OpAccessChain %43 %18 %27
OpStore %45 %40
%46 = OpAccessChain %43 %18 %21
OpStore %46 %41
%47 = OpAccessChain %43 %18 %12
OpStore %47 %42
OpReturn
OpFunctionEnd
#endif
