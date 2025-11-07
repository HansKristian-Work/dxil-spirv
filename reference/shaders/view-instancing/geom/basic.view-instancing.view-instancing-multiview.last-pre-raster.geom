#version 460
#extension GL_EXT_multiview : require
layout(triangles) in;
layout(max_vertices = 2, points) out;

layout(constant_id = 1000) const uint ViewIndexToViewInstanceMap = 0u;

layout(location = 0) in vec4 TEXCOORD[3];
layout(location = 0) out vec4 TEXCOORD_1;

void main()
{
    float _34 = float(bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u)));
    float _35 = TEXCOORD[0u].x + _34;
    float _36 = TEXCOORD[0u].y + _34;
    float _37 = TEXCOORD[0u].z + _34;
    float _38 = TEXCOORD[0u].w + _34;
    TEXCOORD_1.x = _35;
    TEXCOORD_1.y = _36;
    TEXCOORD_1.z = _37;
    TEXCOORD_1.w = _38;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
    TEXCOORD_1.x = _35;
    TEXCOORD_1.y = _36;
    TEXCOORD_1.z = _37;
    TEXCOORD_1.w = _38;
    gl_Position.x = gl_in[1u].gl_Position.x;
    gl_Position.y = gl_in[1u].gl_Position.y;
    gl_Position.z = gl_in[1u].gl_Position.z;
    gl_Position.w = gl_in[1u].gl_Position.w;
    EmitVertex();
}


#if 0
// SPIR-V disassembly
// MultiviewCompatible
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 66
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiView
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %12 %14 %15 %18
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 2
OpExecutionMode %3 Triangles
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "TEXCOORD"
OpName %12 "SV_Position"
OpName %14 "TEXCOORD"
OpName %15 "SV_Position"
OpName %16 "ViewIndexToViewInstanceMap"
OpDecorate %11 Location 0
OpDecorate %12 BuiltIn Position
OpDecorate %14 Location 0
OpDecorate %15 BuiltIn Position
OpDecorate %16 SpecId 1000
OpDecorate %18 BuiltIn ViewIndex
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
%16 = OpSpecConstant %7 0
%17 = OpTypePointer Input %7
%18 = OpVariable %17 Input
%21 = OpConstant %7 2
%23 = OpTypePointer Input %5
%25 = OpConstant %7 0
%28 = OpConstant %7 1
%47 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %64
%64 = OpLabel
%19 = OpLoad %7 %18
%20 = OpIMul %7 %19 %21
%22 = OpBitFieldUExtract %7 %16 %20 %21
%24 = OpAccessChain %23 %11 %25 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %23 %11 %25 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %23 %11 %25 %21
%31 = OpLoad %5 %30
%32 = OpAccessChain %23 %11 %25 %8
%33 = OpLoad %5 %32
%34 = OpConvertUToF %5 %22
%35 = OpFAdd %5 %26 %34
%36 = OpFAdd %5 %29 %34
%37 = OpFAdd %5 %31 %34
%38 = OpFAdd %5 %33 %34
%39 = OpAccessChain %23 %12 %28 %25
%40 = OpLoad %5 %39
%41 = OpAccessChain %23 %12 %28 %28
%42 = OpLoad %5 %41
%43 = OpAccessChain %23 %12 %28 %21
%44 = OpLoad %5 %43
%45 = OpAccessChain %23 %12 %28 %8
%46 = OpLoad %5 %45
%48 = OpAccessChain %47 %14 %25
OpStore %48 %35
%49 = OpAccessChain %47 %14 %28
OpStore %49 %36
%50 = OpAccessChain %47 %14 %21
OpStore %50 %37
%51 = OpAccessChain %47 %14 %8
OpStore %51 %38
%52 = OpAccessChain %47 %15 %25
OpStore %52 %40
%53 = OpAccessChain %47 %15 %28
OpStore %53 %42
%54 = OpAccessChain %47 %15 %21
OpStore %54 %44
%55 = OpAccessChain %47 %15 %8
OpStore %55 %46
OpEmitVertex
%56 = OpAccessChain %47 %14 %25
OpStore %56 %35
%57 = OpAccessChain %47 %14 %28
OpStore %57 %36
%58 = OpAccessChain %47 %14 %21
OpStore %58 %37
%59 = OpAccessChain %47 %14 %8
OpStore %59 %38
%60 = OpAccessChain %47 %15 %25
OpStore %60 %40
%61 = OpAccessChain %47 %15 %28
OpStore %61 %42
%62 = OpAccessChain %47 %15 %21
OpStore %62 %44
%63 = OpAccessChain %47 %15 %8
OpStore %63 %46
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
