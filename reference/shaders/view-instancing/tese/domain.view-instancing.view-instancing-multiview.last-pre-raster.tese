#version 460
#extension GL_EXT_multiview : require
layout(triangles) in;

layout(constant_id = 1000) const uint ViewIndexToViewInstanceMap = 0u;

layout(location = 0) in float A[][3];
layout(location = 0, component = 1) in float B[];
layout(location = 3) patch in float C[3];
layout(location = 3, component = 1) patch in float D;

void main()
{
    gl_Position.x = ((((A[0u][2u] + B[0u]) * gl_TessCoord.x) + float(bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u)))) + ((A[1u][1u] + B[1u]) * gl_TessCoord.y)) + ((A[2u][0u] + B[2u]) * gl_TessCoord.z);
    gl_Position.y = C[1u] + C[0u];
    gl_Position.z = C[2u];
    gl_Position.w = D;
}


#if 0
// SPIR-V disassembly
// MultiviewCompatible
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 75
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability MultiView
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %13 %16 %17 %19 %23 %30
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %11 "A"
OpName %13 "B"
OpName %16 "SV_Position"
OpName %17 "C"
OpName %19 "D"
OpName %21 "ViewIndexToViewInstanceMap"
OpDecorate %11 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %16 BuiltIn Position
OpDecorate %17 Location 3
OpDecorate %17 Patch
OpDecorate %19 Location 3
OpDecorate %19 Component 1
OpDecorate %19 Patch
OpDecorate %21 SpecId 1000
OpDecorate %23 BuiltIn ViewIndex
OpDecorate %30 BuiltIn TessCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeInt 32 0
%7 = OpConstant %6 3
%8 = OpTypeArray %5 %7
%9 = OpTypeArray %8 %7
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypePointer Input %8
%13 = OpVariable %12 Input
%14 = OpTypeVector %5 4
%15 = OpTypePointer Output %14
%16 = OpVariable %15 Output
%17 = OpVariable %12 Input
%18 = OpTypePointer Input %5
%19 = OpVariable %18 Input
%21 = OpSpecConstant %6 0
%22 = OpTypePointer Input %6
%23 = OpVariable %22 Input
%26 = OpConstant %6 2
%28 = OpTypeVector %5 3
%29 = OpTypePointer Input %28
%30 = OpVariable %29 Input
%32 = OpConstant %6 0
%35 = OpConstant %6 1
%68 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %73
%73 = OpLabel
%20 = OpLoad %5 %19
%24 = OpLoad %6 %23
%25 = OpIMul %6 %24 %26
%27 = OpBitFieldUExtract %6 %21 %25 %26
%31 = OpAccessChain %18 %30 %32
%33 = OpLoad %5 %31
%34 = OpAccessChain %18 %30 %35
%36 = OpLoad %5 %34
%37 = OpAccessChain %18 %30 %26
%38 = OpLoad %5 %37
%39 = OpAccessChain %18 %13 %32
%40 = OpLoad %5 %39
%41 = OpAccessChain %18 %13 %35
%42 = OpLoad %5 %41
%43 = OpAccessChain %18 %13 %26
%44 = OpLoad %5 %43
%45 = OpConvertUToF %5 %27
%46 = OpAccessChain %18 %11 %32 %26
%47 = OpLoad %5 %46
%48 = OpAccessChain %18 %11 %35 %35
%49 = OpLoad %5 %48
%50 = OpAccessChain %18 %11 %26 %32
%51 = OpLoad %5 %50
%52 = OpFAdd %5 %51 %44
%53 = OpFMul %5 %52 %38
%54 = OpFAdd %5 %49 %42
%55 = OpFMul %5 %54 %36
%56 = OpFAdd %5 %47 %40
%57 = OpFMul %5 %56 %33
%58 = OpFAdd %5 %57 %45
%59 = OpFAdd %5 %58 %55
%60 = OpFAdd %5 %59 %53
%61 = OpAccessChain %18 %17 %32
%62 = OpLoad %5 %61
%63 = OpAccessChain %18 %17 %35
%64 = OpLoad %5 %63
%65 = OpFAdd %5 %64 %62
%66 = OpAccessChain %18 %17 %26
%67 = OpLoad %5 %66
%69 = OpAccessChain %68 %16 %32
OpStore %69 %60
%70 = OpAccessChain %68 %16 %35
OpStore %70 %65
%71 = OpAccessChain %68 %16 %26
OpStore %71 %67
%72 = OpAccessChain %68 %16 %7
OpStore %72 %20
OpReturn
OpFunctionEnd
#endif
