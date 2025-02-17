#version 460
#extension GL_EXT_fragment_shader_barycentric : require

layout(location = 0) pervertexEXT in uint ATTRIB[3];
layout(location = 0, component = 1) pervertexEXT in uint ATTRIB_1[3];
layout(location = 0, component = 2) pervertexEXT in uint ATTRIB_2[3];
layout(location = 1) centroid in float FOO;
layout(location = 0) out float SV_Target;

void main()
{
    SV_Target = (((uintBitsToFloat(ATTRIB[0u]) * gl_BaryCoordEXT.x) + FOO) + (uintBitsToFloat(ATTRIB_1[1u]) * gl_BaryCoordEXT.y)) + (uintBitsToFloat(ATTRIB_2[2u]) * gl_BaryCoordEXT.z);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 48
; Schema: 0
OpCapability Shader
OpCapability SampleRateShading
OpCapability FragmentBarycentricKHR
OpExtension "SPV_KHR_fragment_shader_barycentric"
OpMemoryModel Logical GLSL450
OpEntryPoint Fragment %3 "main" %9 %10 %11 %15 %17 %19
OpExecutionMode %3 OriginUpperLeft
OpName %3 "main"
OpName %9 "ATTRIB"
OpName %10 "ATTRIB_1"
OpName %11 "ATTRIB_2"
OpName %15 "SV_Barycentrics"
OpName %17 "FOO"
OpName %19 "SV_Target"
OpDecorate %9 PerVertexKHR
OpDecorate %9 Location 0
OpDecorate %10 PerVertexKHR
OpDecorate %10 Location 0
OpDecorate %10 Component 1
OpDecorate %11 PerVertexKHR
OpDecorate %11 Location 0
OpDecorate %11 Component 2
OpDecorate %15 BuiltIn BaryCoordKHR
OpDecorate %15 Sample
OpDecorate %17 Centroid
OpDecorate %17 Location 1
OpDecorate %19 Location 0
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpConstant %5 3
%7 = OpTypeArray %5 %6
%8 = OpTypePointer Input %7
%9 = OpVariable %8 Input
%10 = OpVariable %8 Input
%11 = OpVariable %8 Input
%12 = OpTypeFloat 32
%13 = OpTypeVector %12 3
%14 = OpTypePointer Input %13
%15 = OpVariable %14 Input
%16 = OpTypePointer Input %12
%17 = OpVariable %16 Input
%18 = OpTypePointer Output %12
%19 = OpVariable %18 Output
%22 = OpConstant %5 0
%25 = OpConstant %5 1
%28 = OpConstant %5 2
%30 = OpTypePointer Input %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%20 = OpLoad %12 %17
%21 = OpAccessChain %16 %15 %22
%23 = OpLoad %12 %21
%24 = OpAccessChain %16 %15 %25
%26 = OpLoad %12 %24
%27 = OpAccessChain %16 %15 %28
%29 = OpLoad %12 %27
%31 = OpAccessChain %30 %9 %22
%32 = OpLoad %5 %31
%33 = OpBitcast %12 %32
%34 = OpFMul %12 %33 %23
%35 = OpAccessChain %30 %10 %25
%36 = OpLoad %5 %35
%37 = OpBitcast %12 %36
%38 = OpFMul %12 %37 %26
%39 = OpAccessChain %30 %11 %28
%40 = OpLoad %5 %39
%41 = OpBitcast %12 %40
%42 = OpFMul %12 %41 %29
%43 = OpFAdd %12 %34 %20
%44 = OpFAdd %12 %43 %38
%45 = OpFAdd %12 %44 %42
OpStore %19 %45
OpReturn
OpFunctionEnd
#endif
