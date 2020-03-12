#version 460
layout(triangles) in;
layout(max_vertices = 6, triangle_strip) out;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    float _55 = gl_in[1u].gl_Position.x + 0.0199999995529651641845703125;
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = _55;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 91
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15
OpExecutionMode %3 Invocations 1
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
%16 = OpTypePointer Input %5
%18 = OpConstant %7 0
%21 = OpConstant %7 1
%24 = OpConstant %7 2
%36 = OpTypePointer Output %5
%46 = OpConstant %5 0.00999999978
%56 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %89
%89 = OpLabel
%17 = OpAccessChain %16 %11 %18 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %16 %11 %18 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %16 %11 %18 %24
%25 = OpLoad %5 %23
%26 = OpAccessChain %16 %11 %18 %8
%27 = OpLoad %5 %26
%28 = OpAccessChain %16 %12 %21 %18
%29 = OpLoad %5 %28
%30 = OpAccessChain %16 %12 %21 %21
%31 = OpLoad %5 %30
%32 = OpAccessChain %16 %12 %21 %24
%33 = OpLoad %5 %32
%34 = OpAccessChain %16 %12 %21 %8
%35 = OpLoad %5 %34
%37 = OpAccessChain %36 %14 %18
OpStore %37 %19
%38 = OpAccessChain %36 %14 %21
OpStore %38 %22
%39 = OpAccessChain %36 %14 %24
OpStore %39 %25
%40 = OpAccessChain %36 %14 %8
OpStore %40 %27
%41 = OpAccessChain %36 %15 %18
OpStore %41 %29
%42 = OpAccessChain %36 %15 %21
OpStore %42 %31
%43 = OpAccessChain %36 %15 %24
OpStore %43 %33
%44 = OpAccessChain %36 %15 %8
OpStore %44 %35
OpEmitVertex
%45 = OpFAdd %5 %29 %46
%47 = OpAccessChain %36 %14 %18
OpStore %47 %19
%48 = OpAccessChain %36 %14 %21
OpStore %48 %22
%49 = OpAccessChain %36 %14 %24
OpStore %49 %25
%50 = OpAccessChain %36 %14 %8
OpStore %50 %27
%51 = OpAccessChain %36 %15 %18
OpStore %51 %45
%52 = OpAccessChain %36 %15 %21
OpStore %52 %31
%53 = OpAccessChain %36 %15 %24
OpStore %53 %33
%54 = OpAccessChain %36 %15 %8
OpStore %54 %35
OpEmitVertex
%55 = OpFAdd %5 %29 %56
%57 = OpAccessChain %36 %14 %18
OpStore %57 %19
%58 = OpAccessChain %36 %14 %21
OpStore %58 %22
%59 = OpAccessChain %36 %14 %24
OpStore %59 %25
%60 = OpAccessChain %36 %14 %8
OpStore %60 %27
%61 = OpAccessChain %36 %15 %18
OpStore %61 %55
%62 = OpAccessChain %36 %15 %21
OpStore %62 %31
%63 = OpAccessChain %36 %15 %24
OpStore %63 %33
%64 = OpAccessChain %36 %15 %8
OpStore %64 %35
OpEmitVertex
OpEndPrimitive
%65 = OpAccessChain %36 %14 %18
OpStore %65 %19
%66 = OpAccessChain %36 %14 %21
OpStore %66 %22
%67 = OpAccessChain %36 %14 %24
OpStore %67 %25
%68 = OpAccessChain %36 %14 %8
OpStore %68 %27
%69 = OpAccessChain %36 %15 %18
OpStore %69 %55
%70 = OpAccessChain %36 %15 %21
OpStore %70 %31
%71 = OpAccessChain %36 %15 %24
OpStore %71 %33
%72 = OpAccessChain %36 %15 %8
OpStore %72 %35
OpEmitVertex
%73 = OpAccessChain %36 %14 %18
OpStore %73 %19
%74 = OpAccessChain %36 %14 %21
OpStore %74 %22
%75 = OpAccessChain %36 %14 %24
OpStore %75 %25
%76 = OpAccessChain %36 %14 %8
OpStore %76 %27
%77 = OpAccessChain %36 %15 %18
OpStore %77 %55
%78 = OpAccessChain %36 %15 %21
OpStore %78 %31
%79 = OpAccessChain %36 %15 %24
OpStore %79 %33
%80 = OpAccessChain %36 %15 %8
OpStore %80 %35
OpEmitVertex
%81 = OpAccessChain %36 %14 %18
OpStore %81 %19
%82 = OpAccessChain %36 %14 %21
OpStore %82 %22
%83 = OpAccessChain %36 %14 %24
OpStore %83 %25
%84 = OpAccessChain %36 %14 %8
OpStore %84 %27
%85 = OpAccessChain %36 %15 %18
OpStore %85 %55
%86 = OpAccessChain %36 %15 %21
OpStore %86 %31
%87 = OpAccessChain %36 %15 %24
OpStore %87 %33
%88 = OpAccessChain %36 %15 %8
OpStore %88 %35
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
