#version 460
layout(triangles_adjacency) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[6];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[5u].gl_Position.x;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[5u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitVertex();
    float _57 = gl_in[5u].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _57;
    gl_Position.y = gl_in[5u].gl_Position.y;
    gl_Position.z = gl_in[5u].gl_Position.z;
    gl_Position.w = gl_in[5u].gl_Position.w;
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 93
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 InputTrianglesAdjacency
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
%8 = OpConstant %7 6
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
%30 = OpConstant %7 5
%38 = OpTypePointer Output %5
%48 = OpConstant %5 0.00999999978
%58 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %91
%91 = OpLabel
%17 = OpAccessChain %16 %11 %18 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %16 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %16 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %16 %11 %18 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %16 %12 %30 %18
%31 = OpLoad %5 %29
%32 = OpAccessChain %16 %12 %30 %21
%33 = OpLoad %5 %32
%34 = OpAccessChain %16 %12 %30 %24
%35 = OpLoad %5 %34
%36 = OpAccessChain %16 %12 %30 %27
%37 = OpLoad %5 %36
%39 = OpAccessChain %38 %14 %18
OpStore %39 %19
%40 = OpAccessChain %38 %14 %21
OpStore %40 %22
%41 = OpAccessChain %38 %14 %24
OpStore %41 %25
%42 = OpAccessChain %38 %14 %27
OpStore %42 %28
%43 = OpAccessChain %38 %15 %18
OpStore %43 %31
%44 = OpAccessChain %38 %15 %21
OpStore %44 %33
%45 = OpAccessChain %38 %15 %24
OpStore %45 %35
%46 = OpAccessChain %38 %15 %27
OpStore %46 %37
OpEmitVertex
%47 = OpFAdd %5 %31 %48
%49 = OpAccessChain %38 %14 %18
OpStore %49 %19
%50 = OpAccessChain %38 %14 %21
OpStore %50 %22
%51 = OpAccessChain %38 %14 %24
OpStore %51 %25
%52 = OpAccessChain %38 %14 %27
OpStore %52 %28
%53 = OpAccessChain %38 %15 %18
OpStore %53 %47
%54 = OpAccessChain %38 %15 %21
OpStore %54 %33
%55 = OpAccessChain %38 %15 %24
OpStore %55 %35
%56 = OpAccessChain %38 %15 %27
OpStore %56 %37
OpEmitVertex
%57 = OpFAdd %5 %31 %58
%59 = OpAccessChain %38 %14 %18
OpStore %59 %19
%60 = OpAccessChain %38 %14 %21
OpStore %60 %22
%61 = OpAccessChain %38 %14 %24
OpStore %61 %25
%62 = OpAccessChain %38 %14 %27
OpStore %62 %28
%63 = OpAccessChain %38 %15 %18
OpStore %63 %57
%64 = OpAccessChain %38 %15 %21
OpStore %64 %33
%65 = OpAccessChain %38 %15 %24
OpStore %65 %35
%66 = OpAccessChain %38 %15 %27
OpStore %66 %37
OpEmitVertex
OpEndPrimitive
%67 = OpAccessChain %38 %14 %18
OpStore %67 %19
%68 = OpAccessChain %38 %14 %21
OpStore %68 %22
%69 = OpAccessChain %38 %14 %24
OpStore %69 %25
%70 = OpAccessChain %38 %14 %27
OpStore %70 %28
%71 = OpAccessChain %38 %15 %18
OpStore %71 %57
%72 = OpAccessChain %38 %15 %21
OpStore %72 %33
%73 = OpAccessChain %38 %15 %24
OpStore %73 %35
%74 = OpAccessChain %38 %15 %27
OpStore %74 %37
OpEmitVertex
%75 = OpAccessChain %38 %14 %18
OpStore %75 %19
%76 = OpAccessChain %38 %14 %21
OpStore %76 %22
%77 = OpAccessChain %38 %14 %24
OpStore %77 %25
%78 = OpAccessChain %38 %14 %27
OpStore %78 %28
%79 = OpAccessChain %38 %15 %18
OpStore %79 %57
%80 = OpAccessChain %38 %15 %21
OpStore %80 %33
%81 = OpAccessChain %38 %15 %24
OpStore %81 %35
%82 = OpAccessChain %38 %15 %27
OpStore %82 %37
OpEmitVertex
%83 = OpAccessChain %38 %14 %18
OpStore %83 %19
%84 = OpAccessChain %38 %14 %21
OpStore %84 %22
%85 = OpAccessChain %38 %14 %24
OpStore %85 %25
%86 = OpAccessChain %38 %14 %27
OpStore %86 %28
%87 = OpAccessChain %38 %15 %18
OpStore %87 %57
%88 = OpAccessChain %38 %15 %21
OpStore %88 %33
%89 = OpAccessChain %38 %15 %24
OpStore %89 %35
%90 = OpAccessChain %38 %15 %27
OpStore %90 %37
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
