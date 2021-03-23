#version 460
layout(points) in;
layout(max_vertices = 3, points) out;

layout(location = 0) in vec4 TEXCOORD[1];
layout(location = 0) out vec4 A;
layout(location = 2, stream = 1) out vec4 B;
layout(location = 3, stream = 1) out vec4 D[2];
layout(location = 5, stream = 2) out vec4 C;
layout(location = 6, stream = 2) out vec4 E;

void main()
{
    A.x = TEXCOORD[0u].x;
    A.y = TEXCOORD[0u].y;
    A.z = TEXCOORD[0u].z;
    A.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[0u].gl_Position.x;
    gl_Position.y = gl_in[0u].gl_Position.y;
    gl_Position.z = gl_in[0u].gl_Position.z;
    gl_Position.w = gl_in[0u].gl_Position.w;
    EmitStreamVertex(int(0u));
    B.x = TEXCOORD[0u].x + 1.0;
    B.y = TEXCOORD[0u].y + 1.0;
    B.z = TEXCOORD[0u].z + 1.0;
    B.w = TEXCOORD[0u].w + 1.0;
    D[0u].x = 1.0;
    D[0u].y = 1.0;
    D[0u].z = 1.0;
    D[0u].w = 1.0;
    D[1u].x = 3.0;
    D[1u].y = 3.0;
    D[1u].z = 3.0;
    D[1u].w = 3.0;
    EmitStreamVertex(int(1u));
    C.x = TEXCOORD[0u].x + 2.0;
    C.y = TEXCOORD[0u].y + 2.0;
    C.z = TEXCOORD[0u].z + 2.0;
    C.w = TEXCOORD[0u].w + 2.0;
    E.x = TEXCOORD[0u].x + 3.0;
    E.y = TEXCOORD[0u].y + 3.0;
    E.z = TEXCOORD[0u].z + 3.0;
    E.w = TEXCOORD[0u].w + 3.0;
    EmitStreamVertex(int(2u));
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 87
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability GeometryStreams
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %16 %20 %21 %22
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 3
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "A"
OpName %15 "SV_Position"
OpName %16 "B"
OpName %20 "D"
OpName %21 "C"
OpName %22 "E"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
OpDecorate %16 Stream 1
OpDecorate %16 Location 2
OpDecorate %20 Stream 1
OpDecorate %20 Location 3
OpDecorate %21 Stream 2
OpDecorate %21 Location 5
OpDecorate %22 Stream 2
OpDecorate %22 Location 6
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
%15 = OpVariable %13 Output
%16 = OpVariable %13 Output
%17 = OpConstant %7 2
%18 = OpTypeArray %6 %17
%19 = OpTypePointer Output %18
%20 = OpVariable %19 Output
%21 = OpVariable %13 Output
%22 = OpVariable %13 Output
%23 = OpTypePointer Input %5
%25 = OpConstant %7 0
%32 = OpConstant %7 3
%42 = OpTypePointer Output %5
%52 = OpConstant %5 1
%65 = OpConstant %5 3
%70 = OpConstant %5 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %86
%86 = OpLabel
%24 = OpAccessChain %23 %11 %25 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %23 %11 %25 %8
%28 = OpLoad %5 %27
%29 = OpAccessChain %23 %11 %25 %17
%30 = OpLoad %5 %29
%31 = OpAccessChain %23 %11 %25 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %23 %12 %25 %25
%35 = OpLoad %5 %34
%36 = OpAccessChain %23 %12 %25 %8
%37 = OpLoad %5 %36
%38 = OpAccessChain %23 %12 %25 %17
%39 = OpLoad %5 %38
%40 = OpAccessChain %23 %12 %25 %32
%41 = OpLoad %5 %40
%43 = OpAccessChain %42 %14 %25
OpStore %43 %26
%44 = OpAccessChain %42 %14 %8
OpStore %44 %28
%45 = OpAccessChain %42 %14 %17
OpStore %45 %30
%46 = OpAccessChain %42 %14 %32
OpStore %46 %33
%47 = OpAccessChain %42 %15 %25
OpStore %47 %35
%48 = OpAccessChain %42 %15 %8
OpStore %48 %37
%49 = OpAccessChain %42 %15 %17
OpStore %49 %39
%50 = OpAccessChain %42 %15 %32
OpStore %50 %41
OpEmitStreamVertex %25
%51 = OpFAdd %5 %26 %52
%53 = OpFAdd %5 %28 %52
%54 = OpFAdd %5 %30 %52
%55 = OpFAdd %5 %33 %52
%56 = OpAccessChain %42 %16 %25
OpStore %56 %51
%57 = OpAccessChain %42 %16 %8
OpStore %57 %53
%58 = OpAccessChain %42 %16 %17
OpStore %58 %54
%59 = OpAccessChain %42 %16 %32
OpStore %59 %55
%60 = OpAccessChain %42 %20 %25 %25
OpStore %60 %52
%61 = OpAccessChain %42 %20 %25 %8
OpStore %61 %52
%62 = OpAccessChain %42 %20 %25 %17
OpStore %62 %52
%63 = OpAccessChain %42 %20 %25 %32
OpStore %63 %52
%64 = OpAccessChain %42 %20 %8 %25
OpStore %64 %65
%66 = OpAccessChain %42 %20 %8 %8
OpStore %66 %65
%67 = OpAccessChain %42 %20 %8 %17
OpStore %67 %65
%68 = OpAccessChain %42 %20 %8 %32
OpStore %68 %65
OpEmitStreamVertex %8
%69 = OpFAdd %5 %26 %70
%71 = OpFAdd %5 %28 %70
%72 = OpFAdd %5 %30 %70
%73 = OpFAdd %5 %33 %70
%74 = OpFAdd %5 %26 %65
%75 = OpFAdd %5 %28 %65
%76 = OpFAdd %5 %30 %65
%77 = OpFAdd %5 %33 %65
%78 = OpAccessChain %42 %21 %25
OpStore %78 %69
%79 = OpAccessChain %42 %21 %8
OpStore %79 %71
%80 = OpAccessChain %42 %21 %17
OpStore %80 %72
%81 = OpAccessChain %42 %21 %32
OpStore %81 %73
%82 = OpAccessChain %42 %22 %25
OpStore %82 %74
%83 = OpAccessChain %42 %22 %8
OpStore %83 %75
%84 = OpAccessChain %42 %22 %17
OpStore %84 %76
%85 = OpAccessChain %42 %22 %32
OpStore %85 %77
OpEmitStreamVertex %17
OpReturn
OpFunctionEnd
#endif
