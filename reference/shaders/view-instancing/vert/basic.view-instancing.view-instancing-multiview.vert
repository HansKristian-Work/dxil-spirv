#version 460
#extension GL_EXT_multiview : require

layout(constant_id = 1000) const uint ViewIndexToViewInstanceMap = 0u;

void main()
{
    float _17 = float(bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u)));
    gl_Position.x = _17;
    gl_Position.y = _17;
    gl_Position.z = _17;
    gl_Position.w = _17;
}


#if 0
// SPIR-V disassembly
// MultiviewCompatible; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 28
; Schema: 0
OpCapability Shader
OpCapability MultiView
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %12
OpName %3 "main"
OpName %8 "SV_Position"
OpName %10 "ViewIndexToViewInstanceMap"
OpDecorate %8 BuiltIn Position
OpDecorate %10 SpecId 1000
OpDecorate %12 BuiltIn ViewIndex
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpSpecConstant %9 0
%11 = OpTypePointer Input %9
%12 = OpVariable %11 Input
%15 = OpConstant %9 2
%18 = OpTypePointer Output %5
%20 = OpConstant %9 0
%22 = OpConstant %9 1
%25 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %26
%26 = OpLabel
%13 = OpLoad %9 %12
%14 = OpIMul %9 %13 %15
%16 = OpBitFieldUExtract %9 %10 %14 %15
%17 = OpConvertUToF %5 %16
%19 = OpAccessChain %18 %8 %20
OpStore %19 %17
%21 = OpAccessChain %18 %8 %22
OpStore %21 %17
%23 = OpAccessChain %18 %8 %15
OpStore %23 %17
%24 = OpAccessChain %18 %8 %25
OpStore %24 %17
OpReturn
OpFunctionEnd
#endif
