#version 460
#extension GL_EXT_multiview : require
layout(triangles) in;
layout(max_vertices = 2, points) out;

layout(constant_id = 1000) const uint ViewIndexToViewInstanceMap = 0u;
layout(constant_id = 1001) const uint ViewIDToViewport = 0u;

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
    gl_ViewportIndex = int(bitfieldExtract(ViewIDToViewport, int(bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u)) * 8u), int(8u)));
    EmitVertex();
    TEXCOORD_1.x = TEXCOORD[0u].x;
    TEXCOORD_1.y = TEXCOORD[0u].y;
    TEXCOORD_1.z = TEXCOORD[0u].z;
    TEXCOORD_1.w = TEXCOORD[0u].w;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    gl_ViewportIndex = int(bitfieldExtract(ViewIDToViewport, int(bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u)) * 8u), int(8u)));
    EmitVertex();
}


#if 0
// SPIR-V disassembly
// MultiviewCompatible
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpCapability MultiView
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %47 %56
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 2
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "TEXCOORD"
OpName %15 "SV_Position"
OpName %45 "ViewIndexToViewInstanceMap"
OpName %51 "ViewIDToViewport"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
OpDecorate %45 SpecId 1000
OpDecorate %47 BuiltIn ViewIndex
OpDecorate %51 SpecId 1001
OpDecorate %56 BuiltIn ViewportIndex
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
%45 = OpSpecConstant %7 0
%46 = OpTypePointer Input %7
%47 = OpVariable %46 Input
%51 = OpSpecConstant %7 0
%53 = OpConstant %7 8
%55 = OpTypePointer Output %7
%56 = OpVariable %55 Output
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
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
%48 = OpLoad %7 %47
%49 = OpIMul %7 %48 %24
%50 = OpBitFieldUExtract %7 %45 %49 %24
%52 = OpIMul %7 %50 %53
%54 = OpBitFieldUExtract %7 %51 %52 %53
OpStore %56 %54
OpEmitVertex
%57 = OpAccessChain %36 %14 %18
OpStore %57 %19
%58 = OpAccessChain %36 %14 %21
OpStore %58 %22
%59 = OpAccessChain %36 %14 %24
OpStore %59 %25
%60 = OpAccessChain %36 %14 %8
OpStore %60 %27
%61 = OpAccessChain %36 %15 %18
OpStore %61 %29
%62 = OpAccessChain %36 %15 %21
OpStore %62 %31
%63 = OpAccessChain %36 %15 %24
OpStore %63 %33
%64 = OpAccessChain %36 %15 %8
OpStore %64 %35
%65 = OpLoad %7 %47
%66 = OpIMul %7 %65 %24
%67 = OpBitFieldUExtract %7 %45 %66 %24
%68 = OpIMul %7 %67 %53
%69 = OpBitFieldUExtract %7 %51 %68 %53
OpStore %56 %69
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
