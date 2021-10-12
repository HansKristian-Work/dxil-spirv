#version 460

invariant gl_Position;

layout(location = 0) in vec4 A;
layout(location = 1) in vec4 B;
layout(location = 2) in vec4 C;

void main()
{
    float _44 = fma(A.x, B.x, C.x);
    float _45 = fma(A.y, B.y, C.y);
    float _46 = fma(A.z, B.z, C.z);
    float _47 = fma(A.w, B.w, C.w);
    gl_Position.x = _44;
    gl_Position.y = _45;
    gl_Position.z = _46;
    gl_Position.w = _47;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 55
; Schema: 0
OpCapability Shader
%43 = OpExtInstImport "GLSL.std.450"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %9 %10 %12
OpName %3 "main"
OpName %8 "A"
OpName %9 "B"
OpName %10 "C"
OpName %12 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %9 Location 1
OpDecorate %10 Location 2
OpDecorate %12 BuiltIn Position
OpDecorate %12 Invariant
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpVariable %7 Input
%10 = OpVariable %7 Input
%11 = OpTypePointer Output %6
%12 = OpVariable %11 Output
%13 = OpTypePointer Input %5
%15 = OpTypeInt 32 0
%16 = OpConstant %15 0
%19 = OpConstant %15 1
%22 = OpConstant %15 2
%25 = OpConstant %15 3
%48 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %53
%53 = OpLabel
%14 = OpAccessChain %13 %10 %16
%17 = OpLoad %5 %14
%18 = OpAccessChain %13 %10 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %13 %10 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %13 %10 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %13 %9 %16
%28 = OpLoad %5 %27
%29 = OpAccessChain %13 %9 %19
%30 = OpLoad %5 %29
%31 = OpAccessChain %13 %9 %22
%32 = OpLoad %5 %31
%33 = OpAccessChain %13 %9 %25
%34 = OpLoad %5 %33
%35 = OpAccessChain %13 %8 %16
%36 = OpLoad %5 %35
%37 = OpAccessChain %13 %8 %19
%38 = OpLoad %5 %37
%39 = OpAccessChain %13 %8 %22
%40 = OpLoad %5 %39
%41 = OpAccessChain %13 %8 %25
%42 = OpLoad %5 %41
%44 = OpExtInst %5 %43 Fma %36 %28 %17
%45 = OpExtInst %5 %43 Fma %38 %30 %20
%46 = OpExtInst %5 %43 Fma %40 %32 %23
%47 = OpExtInst %5 %43 Fma %42 %34 %26
%49 = OpAccessChain %48 %12 %16
OpStore %49 %44
%50 = OpAccessChain %48 %12 %19
OpStore %50 %45
%51 = OpAccessChain %48 %12 %22
OpStore %51 %46
%52 = OpAccessChain %48 %12 %25
OpStore %52 %47
OpReturn
OpFunctionEnd
#endif
