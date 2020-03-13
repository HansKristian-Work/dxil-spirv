#version 460
layout(lines_adjacency) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[4];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[3u].gl_Position.x;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[3u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    float _56 = gl_in[3u].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _56;
    gl_Position.y = gl_in[3u].gl_Position.y;
    gl_Position.z = gl_in[3u].gl_Position.z;
    gl_Position.w = gl_in[3u].gl_Position.w;
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 92
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 InputLinesAdjacency
OpExecutionMode %3 OutputTriangleStrip
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "TEXCOORD"
OpName %15 "SV_Position"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 4
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpVariable %10 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpTypePointer Input %5
%18 = OpConstant %7 0
%21 = OpConstant %7 1
%24 = OpConstant %7 2
%27 = OpConstant %7 3
%37 = OpTypePointer Output %5
%47 = OpConstant %5 0.00999999978
%57 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %90
%90 = OpLabel
%17 = OpAccessChain %16 %11 %18 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %16 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %16 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %16 %11 %18 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %16 %12 %27 %18
%30 = OpLoad %5 %29
%31 = OpAccessChain %16 %12 %27 %21
%32 = OpLoad %5 %31
%33 = OpAccessChain %16 %12 %27 %24
%34 = OpLoad %5 %33
%35 = OpAccessChain %16 %12 %27 %27
%36 = OpLoad %5 %35
%38 = OpAccessChain %37 %14 %18
OpStore %38 %19
%39 = OpAccessChain %37 %14 %21
OpStore %39 %22
%40 = OpAccessChain %37 %14 %24
OpStore %40 %25
%41 = OpAccessChain %37 %14 %27
OpStore %41 %28
%42 = OpAccessChain %37 %15 %18
OpStore %42 %30
%43 = OpAccessChain %37 %15 %21
OpStore %43 %32
%44 = OpAccessChain %37 %15 %24
OpStore %44 %34
%45 = OpAccessChain %37 %15 %27
OpStore %45 %36
OpEmitVertex
%46 = OpFAdd %5 %30 %47
%48 = OpAccessChain %37 %14 %18
OpStore %48 %19
%49 = OpAccessChain %37 %14 %21
OpStore %49 %22
%50 = OpAccessChain %37 %14 %24
OpStore %50 %25
%51 = OpAccessChain %37 %14 %27
OpStore %51 %28
%52 = OpAccessChain %37 %15 %18
OpStore %52 %46
%53 = OpAccessChain %37 %15 %21
OpStore %53 %32
%54 = OpAccessChain %37 %15 %24
OpStore %54 %34
%55 = OpAccessChain %37 %15 %27
OpStore %55 %36
OpEmitVertex
%56 = OpFAdd %5 %30 %57
%58 = OpAccessChain %37 %14 %18
OpStore %58 %19
%59 = OpAccessChain %37 %14 %21
OpStore %59 %22
%60 = OpAccessChain %37 %14 %24
OpStore %60 %25
%61 = OpAccessChain %37 %14 %27
OpStore %61 %28
%62 = OpAccessChain %37 %15 %18
OpStore %62 %56
%63 = OpAccessChain %37 %15 %21
OpStore %63 %32
%64 = OpAccessChain %37 %15 %24
OpStore %64 %34
%65 = OpAccessChain %37 %15 %27
OpStore %65 %36
OpEmitVertex
OpEndPrimitive
%66 = OpAccessChain %37 %14 %18
OpStore %66 %19
%67 = OpAccessChain %37 %14 %21
OpStore %67 %22
%68 = OpAccessChain %37 %14 %24
OpStore %68 %25
%69 = OpAccessChain %37 %14 %27
OpStore %69 %28
%70 = OpAccessChain %37 %15 %18
OpStore %70 %56
%71 = OpAccessChain %37 %15 %21
OpStore %71 %32
%72 = OpAccessChain %37 %15 %24
OpStore %72 %34
%73 = OpAccessChain %37 %15 %27
OpStore %73 %36
OpEmitVertex
%74 = OpAccessChain %37 %14 %18
OpStore %74 %19
%75 = OpAccessChain %37 %14 %21
OpStore %75 %22
%76 = OpAccessChain %37 %14 %24
OpStore %76 %25
%77 = OpAccessChain %37 %14 %27
OpStore %77 %28
%78 = OpAccessChain %37 %15 %18
OpStore %78 %56
%79 = OpAccessChain %37 %15 %21
OpStore %79 %32
%80 = OpAccessChain %37 %15 %24
OpStore %80 %34
%81 = OpAccessChain %37 %15 %27
OpStore %81 %36
OpEmitVertex
%82 = OpAccessChain %37 %14 %18
OpStore %82 %19
%83 = OpAccessChain %37 %14 %21
OpStore %83 %22
%84 = OpAccessChain %37 %14 %24
OpStore %84 %25
%85 = OpAccessChain %37 %14 %27
OpStore %85 %28
%86 = OpAccessChain %37 %15 %18
OpStore %86 %56
%87 = OpAccessChain %37 %15 %21
OpStore %87 %32
%88 = OpAccessChain %37 %15 %24
OpStore %88 %34
%89 = OpAccessChain %37 %15 %27
OpStore %89 %36
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
