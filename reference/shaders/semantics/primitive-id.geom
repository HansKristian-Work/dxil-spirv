#version 460
layout(points) in;
layout(max_vertices = 1, points) out;

layout(location = 0) in vec4 A[1];

void main()
{
    gl_Position.x = A[0u].x;
    gl_Position.y = A[0u].y;
    gl_Position.z = A[0u].z;
    gl_Position.w = A[0u].w;
    gl_PrimitiveID = int(uint(gl_PrimitiveIDIn) + 1u);
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpMemoryModel Logical GLSL450
OpEntryPoint Geometry %3 "main" %11 %13 %15 %17
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 1
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "A"
OpName %13 "SV_PrimitiveID"
OpName %15 "SV_Position"
OpName %17 "SV_PrimitiveID"
OpDecorate %11 Location 0
OpDecorate %13 BuiltIn PrimitiveId
OpDecorate %15 BuiltIn Position
OpDecorate %17 BuiltIn PrimitiveId
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 1
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %7
%13 = OpVariable %12 Input
%14 = OpTypePointer Output %6
%15 = OpVariable %14 Output
%16 = OpTypePointer Output %7
%17 = OpVariable %16 Output
%19 = OpTypePointer Input %5
%21 = OpConstant %7 0
%26 = OpConstant %7 2
%29 = OpConstant %7 3
%32 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%18 = OpLoad %7 %13
%20 = OpAccessChain %19 %11 %21 %21
%22 = OpLoad %5 %20
%23 = OpAccessChain %19 %11 %21 %8
%24 = OpLoad %5 %23
%25 = OpAccessChain %19 %11 %21 %26
%27 = OpLoad %5 %25
%28 = OpAccessChain %19 %11 %21 %29
%30 = OpLoad %5 %28
%31 = OpIAdd %7 %18 %8
%33 = OpAccessChain %32 %15 %21
OpStore %33 %22
%34 = OpAccessChain %32 %15 %8
OpStore %34 %24
%35 = OpAccessChain %32 %15 %26
OpStore %35 %27
%36 = OpAccessChain %32 %15 %29
OpStore %36 %30
OpStore %17 %31
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
