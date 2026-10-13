#version 460
#extension GL_EXT_fragment_shader_barycentric : require

layout(location = 0) pervertexEXT in float ATTRIB[3];
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = ATTRIB[2u] * gl_BaryCoordEXT.x;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 26
; Schema: 0
OpCapability Shader
OpCapability FragmentBarycentricKHR
OpExtension "SPV_KHR_fragment_shader_barycentric"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %13 %15
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "ATTRIB"
OpName %13 "SV_Barycentrics"
OpName %15 "SV_Target"
OpDecorate %10 PerVertexKHR
OpDecorate %10 Location 0
OpDecorate %13 BuiltIn BaryCoordKHR
OpDecorate %15 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 3
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpTypeVector %5 3
%12 = OpTypePointer Input %11
%13 = OpVariable %12 Input
%14 = OpTypePointer Output %5
%15 = OpVariable %14 Output
%16 = OpTypePointer Input %5
%18 = OpConstant %6 0
%21 = OpConstant %6 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %24
%24 = OpLabel
%17 = OpAccessChain %16 %13 %18
%19 = OpLoad %5 %17
%20 = OpAccessChain %16 %10 %21
%22 = OpLoad %5 %20
%23 = OpFMul %5 %22 %19
OpStore %15 %23
OpReturn
OpFunctionEnd
#endif
