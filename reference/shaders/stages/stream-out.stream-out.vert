#version 460

layout(xfb_buffer = 1, xfb_stride = 32) out gl_PerVertex
{
    layout(xfb_offset = 16) vec4 gl_Position;
};

layout(location = 1, xfb_buffer = 0, xfb_stride = 32, xfb_offset = 0) out vec4 StreamOut;
layout(location = 2, xfb_buffer = 1, xfb_stride = 16, xfb_offset = 0) out vec4 StreamOut_1;

void main()
{
    gl_Position.x = 2.0;
    gl_Position.y = 2.0;
    gl_Position.z = 2.0;
    gl_Position.w = 2.0;
    StreamOut.x = 4.0;
    StreamOut.y = 4.0;
    StreamOut.z = 4.0;
    StreamOut.w = 4.0;
    StreamOut_1.x = 6.0;
    StreamOut_1.y = 6.0;
    StreamOut_1.z = 6.0;
    StreamOut_1.w = 6.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 34
; Schema: 0
OpCapability Shader
OpCapability TransformFeedback
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %9 %10
OpExecutionMode %3 Xfb
OpName %3 "main"
OpName %8 "SV_Position"
OpName %9 "StreamOut"
OpName %10 "StreamOut_1"
OpDecorate %8 Offset 16
OpDecorate %8 XfbStride 32
OpDecorate %8 XfbBuffer 1
OpDecorate %8 BuiltIn Position
OpDecorate %9 Offset 0
OpDecorate %9 XfbStride 32
OpDecorate %9 XfbBuffer 0
OpDecorate %9 Location 1
OpDecorate %10 Offset 0
OpDecorate %10 XfbStride 16
OpDecorate %10 XfbBuffer 1
OpDecorate %10 Location 2
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpVariable %7 Output
%10 = OpVariable %7 Output
%11 = OpTypePointer Output %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%15 = OpConstant %5 2
%17 = OpConstant %13 1
%19 = OpConstant %13 2
%21 = OpConstant %13 3
%23 = OpConstant %5 4
%28 = OpConstant %5 6
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %32
%32 = OpLabel
%12 = OpAccessChain %11 %8 %14
OpStore %12 %15
%16 = OpAccessChain %11 %8 %17
OpStore %16 %15
%18 = OpAccessChain %11 %8 %19
OpStore %18 %15
%20 = OpAccessChain %11 %8 %21
OpStore %20 %15
%22 = OpAccessChain %11 %9 %14
OpStore %22 %23
%24 = OpAccessChain %11 %9 %17
OpStore %24 %23
%25 = OpAccessChain %11 %9 %19
OpStore %25 %23
%26 = OpAccessChain %11 %9 %21
OpStore %26 %23
%27 = OpAccessChain %11 %10 %14
OpStore %27 %28
%29 = OpAccessChain %11 %10 %17
OpStore %29 %28
%30 = OpAccessChain %11 %10 %19
OpStore %30 %28
%31 = OpAccessChain %11 %10 %21
OpStore %31 %28
OpReturn
OpFunctionEnd
#endif
