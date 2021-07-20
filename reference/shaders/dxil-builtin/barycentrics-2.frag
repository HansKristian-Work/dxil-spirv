#version 460
#extension GL_NV_fragment_shader_barycentric : require

layout(location = 0) pervertexNV in float ATTRIB[3];
layout(location = 0, component = 1) pervertexNV in float ATTRIB_1[3];
layout(location = 0, component = 2) pervertexNV in float ATTRIB_2[3];
layout(location = 1) centroid in float FOO;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = (((ATTRIB[0u] * gl_BaryCoordNV.x) + FOO) + (ATTRIB_1[1u] * gl_BaryCoordNV.y)) + (ATTRIB_2[2u] * gl_BaryCoordNV.z);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability FragmentBarycentricNV
OpExtension "SPV_NV_fragment_shader_barycentric"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %10 %11 %12 %15 %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %10 "ATTRIB"
OpName %11 "ATTRIB_1"
OpName %12 "ATTRIB_2"
OpName %15 "SV_Barycentrics"
OpName %17 "FOO"
OpName %19 "SV_Target"
OpDecorate %10 PerVertexNV
OpDecorate %10 Location 0
OpDecorate %11 PerVertexNV
OpDecorate %11 Location 0
OpDecorate %11 Component 1
OpDecorate %12 PerVertexNV
OpDecorate %12 Location 0
OpDecorate %12 Component 2
OpDecorate %15 BuiltIn BaryCoordNV
OpDecorate %15 Sample
OpDecorate %17 Centroid
OpDecorate %17 Location 1
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 3
%8 = OpTypeArray %5 %7
%9 = OpTypePointer Input %8
%10 = OpVariable %9 Input
%11 = OpVariable %9 Input
%12 = OpVariable %9 Input
%13 = OpTypeVector %5 3
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Input %5
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %5
%19 = OpVariable %18 Output
%22 = OpConstant %6 0
%25 = OpConstant %6 1
%28 = OpConstant %6 2
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %42
%42 = OpLabel
%20 = OpLoad %5 %17
%21 = OpAccessChain %16 %15 %22
%23 = OpLoad %5 %21
%24 = OpAccessChain %16 %15 %25
%26 = OpLoad %5 %24
%27 = OpAccessChain %16 %15 %28
%29 = OpLoad %5 %27
%30 = OpAccessChain %16 %10 %22
%31 = OpLoad %5 %30
%32 = OpFMul %5 %31 %23
%33 = OpAccessChain %16 %11 %25
%34 = OpLoad %5 %33
%35 = OpFMul %5 %34 %26
%36 = OpAccessChain %16 %12 %28
%37 = OpLoad %5 %36
%38 = OpFMul %5 %37 %29
%39 = OpFAdd %5 %32 %20
%40 = OpFAdd %5 %39 %35
%41 = OpFAdd %5 %40 %38
OpStore %19 %41
OpReturn
OpFunctionEnd
#endif
