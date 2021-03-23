#version 460

layout(location = 0) in vec4 ATTR[4];
layout(location = 4) in float ATTR_4[4];

void main()
{
    float _46 = ATTR_4[2u] + ATTR_4[1u];
    gl_Position.x = (ATTR[3u].x + ATTR[0u].x) + _46;
    gl_Position.y = (ATTR[3u].y + ATTR[0u].y) + _46;
    gl_Position.z = (ATTR[3u].z + ATTR[0u].z) + _46;
    gl_Position.w = (ATTR[3u].w + ATTR[0u].w) + _46;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 57
; Schema: 0
OpCapability Shader
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %11 %14 %16
OpName %3 "main"
OpName %11 "ATTR"
OpName %14 "ATTR_4"
OpName %16 "SV_Position"
OpDecorate %11 Location 0
OpDecorate %14 Location 4
OpDecorate %16 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 4
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeArray %5 %8
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypePointer Output %6
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %7 0
%22 = OpConstant %7 1
%25 = OpConstant %7 2
%28 = OpConstant %7 3
%51 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %56
%56 = OpLabel
%18 = OpAccessChain %17 %11 %19 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %17 %11 %19 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %17 %11 %19 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %17 %11 %19 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %17 %11 %28 %19
%31 = OpLoad %5 %30
%32 = OpAccessChain %17 %11 %28 %22
%33 = OpLoad %5 %32
%34 = OpAccessChain %17 %11 %28 %25
%35 = OpLoad %5 %34
%36 = OpAccessChain %17 %11 %28 %28
%37 = OpLoad %5 %36
%38 = OpFAdd %5 %31 %20
%39 = OpFAdd %5 %33 %23
%40 = OpFAdd %5 %35 %26
%41 = OpFAdd %5 %37 %29
%42 = OpAccessChain %17 %14 %22
%43 = OpLoad %5 %42
%44 = OpAccessChain %17 %14 %25
%45 = OpLoad %5 %44
%46 = OpFAdd %5 %45 %43
%47 = OpFAdd %5 %38 %46
%48 = OpFAdd %5 %39 %46
%49 = OpFAdd %5 %40 %46
%50 = OpFAdd %5 %41 %46
%52 = OpAccessChain %51 %16 %19
OpStore %52 %47
%53 = OpAccessChain %51 %16 %22
OpStore %53 %48
%54 = OpAccessChain %51 %16 %25
OpStore %54 %49
%55 = OpAccessChain %51 %16 %28
OpStore %55 %50
OpReturn
OpFunctionEnd
#endif
