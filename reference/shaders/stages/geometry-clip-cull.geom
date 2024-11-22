#version 460
layout(triangles) in;
layout(max_vertices = 6, triangle_strip) out;

out float gl_ClipDistance[4];

void main()
{
    gl_ClipDistance[0u] = gl_in[0u].gl_ClipDistance[0u];
    gl_ClipDistance[1u] = gl_in[0u].gl_ClipDistance[1u];
    gl_ClipDistance[2u] = gl_in[0u].gl_ClipDistance[2u];
    gl_ClipDistance[3u] = gl_in[0u].gl_ClipDistance[3u];
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    gl_ClipDistance[0u] = gl_in[1u].gl_ClipDistance[0u];
    gl_ClipDistance[1u] = gl_in[1u].gl_ClipDistance[1u];
    gl_ClipDistance[2u] = gl_in[1u].gl_ClipDistance[2u];
    gl_ClipDistance[3u] = gl_in[1u].gl_ClipDistance[3u];
    gl_Position.x = gl_in[1u].gl_Position.x + 0.00999999977648258209228515625;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    float _68 = gl_in[1u].gl_Position.x + 0.0199999995529651641845703125;
    gl_ClipDistance[0u] = gl_in[1u].gl_ClipDistance[0u];
    gl_ClipDistance[1u] = gl_in[1u].gl_ClipDistance[1u];
    gl_ClipDistance[2u] = gl_in[1u].gl_ClipDistance[2u];
    gl_ClipDistance[3u] = gl_in[1u].gl_ClipDistance[3u];
    gl_Position.x = _68;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    EndPrimitive();
    gl_ClipDistance[0u] = gl_in[1u].gl_ClipDistance[0u];
    gl_ClipDistance[1u] = gl_in[1u].gl_ClipDistance[1u];
    gl_ClipDistance[2u] = gl_in[1u].gl_ClipDistance[2u];
    gl_ClipDistance[3u] = gl_in[1u].gl_ClipDistance[3u];
    gl_Position.x = _68;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    gl_ClipDistance[0u] = gl_in[1u].gl_ClipDistance[0u];
    gl_ClipDistance[1u] = gl_in[1u].gl_ClipDistance[1u];
    gl_ClipDistance[2u] = gl_in[1u].gl_ClipDistance[2u];
    gl_ClipDistance[3u] = gl_in[1u].gl_ClipDistance[3u];
    gl_Position.x = _68;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    gl_ClipDistance[0u] = gl_in[1u].gl_ClipDistance[0u];
    gl_ClipDistance[1u] = gl_in[1u].gl_ClipDistance[1u];
    gl_ClipDistance[2u] = gl_in[1u].gl_ClipDistance[2u];
    gl_ClipDistance[3u] = gl_in[1u].gl_ClipDistance[3u];
    gl_Position.x = _68;
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
; Bound: 104
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %16 %18 %20
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 6
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputTriangleStrip
OpName %3 "main"
OpName %11 "SV_Position"
OpName %18 "SV_Position"
OpDecorate %11 BuiltIn Position
OpDecorate %16 BuiltIn ClipDistance
OpDecorate %18 BuiltIn Position
OpDecorate %20 BuiltIn ClipDistance
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpConstant %7 4
%13 = OpTypeArray %5 %12
%14 = OpTypeArray %13 %8
%15 = OpTypePointer Input %14
%16 = OpVariable %15 Input
%17 = OpTypePointer Output %6
%18 = OpVariable %17 Output
%19 = OpTypePointer Output %13
%20 = OpVariable %19 Output
%21 = OpTypePointer Input %5
%23 = OpConstant %7 0
%26 = OpConstant %7 1
%29 = OpConstant %7 2
%41 = OpTypePointer Output %5
%59 = OpConstant %5 0.00999999978
%69 = OpConstant %5 0.0199999996
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %102
%102 = OpLabel
%22 = OpAccessChain %21 %16 %23 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %21 %16 %23 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %21 %16 %23 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %21 %16 %23 %8
%32 = OpLoad %5 %31
%33 = OpAccessChain %21 %11 %26 %23
%34 = OpLoad %5 %33
%35 = OpAccessChain %21 %11 %26 %26
%36 = OpLoad %5 %35
%37 = OpAccessChain %21 %11 %26 %29
%38 = OpLoad %5 %37
%39 = OpAccessChain %21 %11 %26 %8
%40 = OpLoad %5 %39
%42 = OpAccessChain %41 %20 %23
OpStore %42 %24
%43 = OpAccessChain %41 %20 %26
OpStore %43 %27
%44 = OpAccessChain %41 %20 %29
OpStore %44 %30
%45 = OpAccessChain %41 %20 %8
OpStore %45 %32
%46 = OpAccessChain %41 %18 %23
OpStore %46 %34
%47 = OpAccessChain %41 %18 %26
OpStore %47 %36
%48 = OpAccessChain %41 %18 %29
OpStore %48 %38
%49 = OpAccessChain %41 %18 %8
OpStore %49 %40
OpEmitVertex
%50 = OpAccessChain %21 %16 %26 %23
%51 = OpLoad %5 %50
%52 = OpAccessChain %21 %16 %26 %26
%53 = OpLoad %5 %52
%54 = OpAccessChain %21 %16 %26 %29
%55 = OpLoad %5 %54
%56 = OpAccessChain %21 %16 %26 %8
%57 = OpLoad %5 %56
%58 = OpFAdd %5 %34 %59
%60 = OpAccessChain %41 %20 %23
OpStore %60 %51
%61 = OpAccessChain %41 %20 %26
OpStore %61 %53
%62 = OpAccessChain %41 %20 %29
OpStore %62 %55
%63 = OpAccessChain %41 %20 %8
OpStore %63 %57
%64 = OpAccessChain %41 %18 %23
OpStore %64 %58
%65 = OpAccessChain %41 %18 %26
OpStore %65 %36
%66 = OpAccessChain %41 %18 %29
OpStore %66 %38
%67 = OpAccessChain %41 %18 %8
OpStore %67 %40
OpEmitVertex
%68 = OpFAdd %5 %34 %69
%70 = OpAccessChain %41 %20 %23
OpStore %70 %51
%71 = OpAccessChain %41 %20 %26
OpStore %71 %53
%72 = OpAccessChain %41 %20 %29
OpStore %72 %55
%73 = OpAccessChain %41 %20 %8
OpStore %73 %57
%74 = OpAccessChain %41 %18 %23
OpStore %74 %68
%75 = OpAccessChain %41 %18 %26
OpStore %75 %36
%76 = OpAccessChain %41 %18 %29
OpStore %76 %38
%77 = OpAccessChain %41 %18 %8
OpStore %77 %40
OpEmitVertex
OpEndPrimitive
%78 = OpAccessChain %41 %20 %23
OpStore %78 %51
%79 = OpAccessChain %41 %20 %26
OpStore %79 %53
%80 = OpAccessChain %41 %20 %29
OpStore %80 %55
%81 = OpAccessChain %41 %20 %8
OpStore %81 %57
%82 = OpAccessChain %41 %18 %23
OpStore %82 %68
%83 = OpAccessChain %41 %18 %26
OpStore %83 %36
%84 = OpAccessChain %41 %18 %29
OpStore %84 %38
%85 = OpAccessChain %41 %18 %8
OpStore %85 %40
OpEmitVertex
%86 = OpAccessChain %41 %20 %23
OpStore %86 %51
%87 = OpAccessChain %41 %20 %26
OpStore %87 %53
%88 = OpAccessChain %41 %20 %29
OpStore %88 %55
%89 = OpAccessChain %41 %20 %8
OpStore %89 %57
%90 = OpAccessChain %41 %18 %23
OpStore %90 %68
%91 = OpAccessChain %41 %18 %26
OpStore %91 %36
%92 = OpAccessChain %41 %18 %29
OpStore %92 %38
%93 = OpAccessChain %41 %18 %8
OpStore %93 %40
OpEmitVertex
%94 = OpAccessChain %41 %20 %23
OpStore %94 %51
%95 = OpAccessChain %41 %20 %26
OpStore %95 %53
%96 = OpAccessChain %41 %20 %29
OpStore %96 %55
%97 = OpAccessChain %41 %20 %8
OpStore %97 %57
%98 = OpAccessChain %41 %18 %23
OpStore %98 %68
%99 = OpAccessChain %41 %18 %26
OpStore %99 %36
%100 = OpAccessChain %41 %18 %29
OpStore %100 %38
%101 = OpAccessChain %41 %18 %8
OpStore %101 %40
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
