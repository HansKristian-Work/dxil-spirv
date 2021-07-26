#version 460
#extension GL_EXT_multiview : require

layout(location = 0) in vec4 POSITION;

void main()
{
    float _28 = float(gl_ViewIndex);
    gl_Position.x = _28 + POSITION.x;
    gl_Position.y = _28 + POSITION.y;
    gl_Position.z = _28 + POSITION.z;
    gl_Position.w = _28 + POSITION.w;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 40
; Schema: 0
OpCapability Shader
OpCapability MultiView
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %10 %26
OpName %3 "main"
OpName %8 "POSITION"
OpName %10 "SV_Position"
OpDecorate %8 Location 0
OpDecorate %10 BuiltIn Position
OpDecorate %26 BuiltIn ViewIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Input %6
%8 = OpVariable %7 Input
%9 = OpTypePointer Output %6
%10 = OpVariable %9 Output
%11 = OpTypePointer Input %5
%13 = OpTypeInt 32 0
%14 = OpConstant %13 0
%17 = OpConstant %13 1
%20 = OpConstant %13 2
%23 = OpConstant %13 3
%25 = OpTypePointer Input %13
%26 = OpVariable %25 Input
%33 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %38
%38 = OpLabel
%12 = OpAccessChain %11 %8 %14
%15 = OpLoad %5 %12
%16 = OpAccessChain %11 %8 %17
%18 = OpLoad %5 %16
%19 = OpAccessChain %11 %8 %20
%21 = OpLoad %5 %19
%22 = OpAccessChain %11 %8 %23
%24 = OpLoad %5 %22
%27 = OpLoad %13 %26
%28 = OpConvertUToF %5 %27
%29 = OpFAdd %5 %28 %15
%30 = OpFAdd %5 %28 %18
%31 = OpFAdd %5 %28 %21
%32 = OpFAdd %5 %28 %24
%34 = OpAccessChain %33 %10 %14
OpStore %34 %29
%35 = OpAccessChain %33 %10 %17
OpStore %35 %30
%36 = OpAccessChain %33 %10 %20
OpStore %36 %31
%37 = OpAccessChain %33 %10 %23
OpStore %37 %32
OpReturn
OpFunctionEnd
#endif
