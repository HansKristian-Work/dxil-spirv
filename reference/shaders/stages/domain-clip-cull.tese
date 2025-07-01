#version 460
layout(triangles) in;

out float gl_ClipDistance[1];

layout(location = 0) in vec3 SV_CullDistance[];
layout(location = 0, component = 3) in float SV_ClipDistance[];
layout(location = 1) patch in float C[3];
layout(location = 1, component = 1) patch in float D;

void main()
{
    gl_Position.x = (((SV_CullDistance[1u].y + SV_ClipDistance[1u]) * gl_TessCoord.y) + ((SV_CullDistance[0u].z + SV_ClipDistance[0u]) * gl_TessCoord.x)) + ((SV_CullDistance[2u].x + SV_ClipDistance[2u]) * gl_TessCoord.z);
    gl_Position.y = C[1u] + C[0u];
    gl_Position.z = C[2u];
    gl_Position.w = D;
    gl_ClipDistance[0u] = 5.0;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 72
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability ClipDistance
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %14 %17 %21 %22 %24 %27
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %11 "SV_CullDistance"
OpName %14 "SV_ClipDistance"
OpName %17 "SV_Position"
OpName %22 "C"
OpName %24 "D"
OpDecorate %11 Location 0
OpDecorate %14 Location 0
OpDecorate %14 Component 3
OpDecorate %17 BuiltIn Position
OpDecorate %21 BuiltIn ClipDistance
OpDecorate %22 Location 1
OpDecorate %22 Patch
OpDecorate %24 Location 1
OpDecorate %24 Component 1
OpDecorate %24 Patch
OpDecorate %27 BuiltIn TessCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 3
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeArray %5 %8
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpTypeVector %5 4
%16 = OpTypePointer Output %15
%17 = OpVariable %16 Output
%18 = OpConstant %7 1
%19 = OpTypeArray %5 %18
%20 = OpTypePointer Output %19
%21 = OpVariable %20 Output
%22 = OpVariable %13 Input
%23 = OpTypePointer Input %5
%24 = OpVariable %23 Input
%26 = OpTypePointer Input %6
%27 = OpVariable %26 Input
%29 = OpConstant %7 0
%34 = OpConstant %7 2
%63 = OpTypePointer Output %5
%69 = OpConstant %5 5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %70
%70 = OpLabel
%25 = OpLoad %5 %24
%28 = OpAccessChain %23 %27 %29
%30 = OpLoad %5 %28
%31 = OpAccessChain %23 %27 %18
%32 = OpLoad %5 %31
%33 = OpAccessChain %23 %27 %34
%35 = OpLoad %5 %33
%36 = OpAccessChain %23 %14 %29
%37 = OpLoad %5 %36
%38 = OpAccessChain %23 %14 %18
%39 = OpLoad %5 %38
%40 = OpAccessChain %23 %14 %34
%41 = OpLoad %5 %40
%42 = OpAccessChain %23 %11 %29 %34
%43 = OpLoad %5 %42
%44 = OpAccessChain %23 %11 %18 %18
%45 = OpLoad %5 %44
%46 = OpAccessChain %23 %11 %34 %29
%47 = OpLoad %5 %46
%48 = OpFAdd %5 %47 %41
%49 = OpFMul %5 %48 %35
%50 = OpFAdd %5 %45 %39
%51 = OpFMul %5 %50 %32
%52 = OpFAdd %5 %43 %37
%53 = OpFMul %5 %52 %30
%54 = OpFAdd %5 %51 %53
%55 = OpFAdd %5 %54 %49
%56 = OpAccessChain %23 %22 %29
%57 = OpLoad %5 %56
%58 = OpAccessChain %23 %22 %18
%59 = OpLoad %5 %58
%60 = OpFAdd %5 %59 %57
%61 = OpAccessChain %23 %22 %34
%62 = OpLoad %5 %61
%64 = OpAccessChain %63 %17 %29
OpStore %64 %55
%65 = OpAccessChain %63 %17 %18
OpStore %65 %60
%66 = OpAccessChain %63 %17 %34
OpStore %66 %62
%67 = OpAccessChain %63 %17 %8
OpStore %67 %25
%68 = OpAccessChain %63 %21 %29
OpStore %68 %69
OpReturn
OpFunctionEnd
#endif
