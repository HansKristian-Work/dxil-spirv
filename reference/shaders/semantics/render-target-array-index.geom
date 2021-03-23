#version 460
layout(points) in;
layout(max_vertices = 2, points) out;

layout(location = 0) in vec4 A[1];
layout(location = 1) in vec4 B[1];

void main()
{
    gl_Position.x = A[0u].x;
    gl_Position.y = A[0u].y;
    gl_Position.z = A[0u].z;
    gl_Position.w = A[0u].w;
    gl_Layer = int(0u);
    EmitVertex();
    gl_Position.x = B[0u].x;
    gl_Position.y = B[0u].y;
    gl_Position.z = B[0u].z;
    gl_Position.w = B[0u].w;
    gl_Layer = int(1u);
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 47
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %16
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 2
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "A"
OpName %12 "B"
OpName %14 "SV_Position"
OpName %16 "SV_RenderTargetArrayIndex"
OpDecorate %11 Location 0
OpDecorate %12 Location 1
OpDecorate %14 BuiltIn Position
OpDecorate %16 BuiltIn Layer
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 1
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpVariable %10 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpTypePointer Output %7
%16 = OpVariable %15 Output
%17 = OpTypePointer Input %5
%19 = OpConstant %7 0
%24 = OpConstant %7 2
%27 = OpConstant %7 3
%29 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%18 = OpAccessChain %17 %11 %19 %19
%20 = OpLoad %5 %18
%21 = OpAccessChain %17 %11 %19 %8
%22 = OpLoad %5 %21
%23 = OpAccessChain %17 %11 %19 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %17 %11 %19 %27
%28 = OpLoad %5 %26
%30 = OpAccessChain %29 %14 %19
OpStore %30 %20
%31 = OpAccessChain %29 %14 %8
OpStore %31 %22
%32 = OpAccessChain %29 %14 %24
OpStore %32 %25
%33 = OpAccessChain %29 %14 %27
OpStore %33 %28
OpStore %16 %19
OpEmitVertex
%34 = OpAccessChain %17 %12 %19 %19
%35 = OpLoad %5 %34
%36 = OpAccessChain %17 %12 %19 %8
%37 = OpLoad %5 %36
%38 = OpAccessChain %17 %12 %19 %24
%39 = OpLoad %5 %38
%40 = OpAccessChain %17 %12 %19 %27
%41 = OpLoad %5 %40
%42 = OpAccessChain %29 %14 %19
OpStore %42 %35
%43 = OpAccessChain %29 %14 %8
OpStore %43 %37
%44 = OpAccessChain %29 %14 %24
OpStore %44 %39
%45 = OpAccessChain %29 %14 %27
OpStore %45 %41
OpStore %16 %8
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
