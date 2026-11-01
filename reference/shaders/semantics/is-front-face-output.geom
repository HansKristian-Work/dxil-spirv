#version 460
layout(points) in;
layout(max_vertices = 1, points) out;

layout(location = 1) flat out uint SV_IsFrontFace;

void main()
{
    gl_Position.x = gl_in[0u].gl_Position.x;
    gl_Position.y = gl_in[0u].gl_Position.y;
    gl_Position.z = gl_in[0u].gl_Position.z;
    gl_Position.w = gl_in[0u].gl_Position.w;
    SV_IsFrontFace = 1u;
    EmitVertex();
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint Geometry %3 "main" %11 %13 %15
OpExecutionMode %3 Invocations 1
OpExecutionMode %3 OutputVertices 1
OpExecutionMode %3 InputPoints
OpExecutionMode %3 OutputPoints
OpName %3 "main"
OpName %11 "SV_Position"
OpName %13 "SV_Position"
OpName %15 "SV_IsFrontFace"
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn Position
OpDecorate %15 Flat
OpDecorate %15 Location 1
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 1
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Output %6
%13 = OpVariable %12 Output
%14 = OpTypePointer Output %7
%15 = OpVariable %14 Output
%16 = OpTypePointer Input %5
%18 = OpConstant %7 0
%23 = OpConstant %7 2
%26 = OpConstant %7 3
%28 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %33
%33 = OpLabel
%17 = OpAccessChain %16 %11 %18 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %16 %11 %18 %8
%21 = OpLoad %5 %20
%22 = OpAccessChain %16 %11 %18 %23
%24 = OpLoad %5 %22
%25 = OpAccessChain %16 %11 %18 %26
%27 = OpLoad %5 %25
%29 = OpAccessChain %28 %13 %18
OpStore %29 %19
%30 = OpAccessChain %28 %13 %8
OpStore %30 %21
%31 = OpAccessChain %28 %13 %23
OpStore %31 %24
%32 = OpAccessChain %28 %13 %26
OpStore %32 %27
OpStore %15 %8
OpEmitVertex
OpReturn
OpFunctionEnd
#endif
