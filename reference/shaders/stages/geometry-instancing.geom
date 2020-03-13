#version 460
layout(invocations = 2, triangles) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    uint _31 = gl_InvocationID ^ 1u;
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = gl_in[_31].gl_Position.x;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = gl_in[_31].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    float _59 = gl_in[_31].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[gl_InvocationID].x;
    TEXCOORD_1.y = TEXCOORD[gl_InvocationID].y;
    TEXCOORD_1.z = TEXCOORD[gl_InvocationID].z;
    TEXCOORD_1.w = TEXCOORD[gl_InvocationID].w;
    gl_Position.x = _59;
    gl_Position.y = gl_in[_31].gl_Position.y;
    gl_Position.z = gl_in[_31].gl_Position.z;
    gl_Position.w = gl_in[_31].gl_Position.w;
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 95
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %17
OpExecutionMode %3 Invocations 2
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 Triangles
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
OpDecorate %17 BuiltIn InvocationId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpVariable %10 Input
%13 = OpTypePointer Output %6
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%16 = OpTypePointer Input %7
%17 = OpVariable %16 Input
%19 = OpTypePointer Input %5
%21 = OpConstant %7 0
%24 = OpConstant %7 1
%27 = OpConstant %7 2
%40 = OpTypePointer Output %5
%50 = OpConstant %5 0.00999999978
%60 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %93
%93 = OpLabel
%18 = OpLoad %7 %17
%20 = OpAccessChain %19 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %19 %11 %18 %27
%28 = OpLoad %5 %26
%29 = OpAccessChain %19 %11 %18 %8
%30 = OpLoad %5 %29
%31 = OpBitwiseXor %7 %18 %24
%32 = OpAccessChain %19 %12 %31 %21
%33 = OpLoad %5 %32
%34 = OpAccessChain %19 %12 %31 %24
%35 = OpLoad %5 %34
%36 = OpAccessChain %19 %12 %31 %27
%37 = OpLoad %5 %36
%38 = OpAccessChain %19 %12 %31 %8
%39 = OpLoad %5 %38
%41 = OpAccessChain %40 %14 %21
OpStore %41 %22
%42 = OpAccessChain %40 %14 %24
OpStore %42 %25
%43 = OpAccessChain %40 %14 %27
OpStore %43 %28
%44 = OpAccessChain %40 %14 %8
OpStore %44 %30
%45 = OpAccessChain %40 %15 %21
OpStore %45 %33
%46 = OpAccessChain %40 %15 %24
OpStore %46 %35
%47 = OpAccessChain %40 %15 %27
OpStore %47 %37
%48 = OpAccessChain %40 %15 %8
OpStore %48 %39
OpEmitVertex
%49 = OpFAdd %5 %33 %50
%51 = OpAccessChain %40 %14 %21
OpStore %51 %22
%52 = OpAccessChain %40 %14 %24
OpStore %52 %25
%53 = OpAccessChain %40 %14 %27
OpStore %53 %28
%54 = OpAccessChain %40 %14 %8
OpStore %54 %30
%55 = OpAccessChain %40 %15 %21
OpStore %55 %49
%56 = OpAccessChain %40 %15 %24
OpStore %56 %35
%57 = OpAccessChain %40 %15 %27
OpStore %57 %37
%58 = OpAccessChain %40 %15 %8
OpStore %58 %39
OpEmitVertex
%59 = OpFAdd %5 %33 %60
%61 = OpAccessChain %40 %14 %21
OpStore %61 %22
%62 = OpAccessChain %40 %14 %24
OpStore %62 %25
%63 = OpAccessChain %40 %14 %27
OpStore %63 %28
%64 = OpAccessChain %40 %14 %8
OpStore %64 %30
%65 = OpAccessChain %40 %15 %21
OpStore %65 %59
%66 = OpAccessChain %40 %15 %24
OpStore %66 %35
%67 = OpAccessChain %40 %15 %27
OpStore %67 %37
%68 = OpAccessChain %40 %15 %8
OpStore %68 %39
OpEmitVertex
OpEndPrimitive
%69 = OpAccessChain %40 %14 %21
OpStore %69 %22
%70 = OpAccessChain %40 %14 %24
OpStore %70 %25
%71 = OpAccessChain %40 %14 %27
OpStore %71 %28
%72 = OpAccessChain %40 %14 %8
OpStore %72 %30
%73 = OpAccessChain %40 %15 %21
OpStore %73 %59
%74 = OpAccessChain %40 %15 %24
OpStore %74 %35
%75 = OpAccessChain %40 %15 %27
OpStore %75 %37
%76 = OpAccessChain %40 %15 %8
OpStore %76 %39
OpEmitVertex
%77 = OpAccessChain %40 %14 %21
OpStore %77 %22
%78 = OpAccessChain %40 %14 %24
OpStore %78 %25
%79 = OpAccessChain %40 %14 %27
OpStore %79 %28
%80 = OpAccessChain %40 %14 %8
OpStore %80 %30
%81 = OpAccessChain %40 %15 %21
OpStore %81 %59
%82 = OpAccessChain %40 %15 %24
OpStore %82 %35
%83 = OpAccessChain %40 %15 %27
OpStore %83 %37
%84 = OpAccessChain %40 %15 %8
OpStore %84 %39
OpEmitVertex
%85 = OpAccessChain %40 %14 %21
OpStore %85 %22
%86 = OpAccessChain %40 %14 %24
OpStore %86 %25
%87 = OpAccessChain %40 %14 %27
OpStore %87 %28
%88 = OpAccessChain %40 %14 %8
OpStore %88 %30
%89 = OpAccessChain %40 %15 %21
OpStore %89 %59
%90 = OpAccessChain %40 %15 %24
OpStore %90 %35
%91 = OpAccessChain %40 %15 %27
OpStore %91 %37
%92 = OpAccessChain %40 %15 %8
OpStore %92 %39
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
