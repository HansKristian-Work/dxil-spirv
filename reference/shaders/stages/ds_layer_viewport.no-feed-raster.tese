#version 460
layout(triangles) in;

layout(location = 0) in vec4 SV_Position[];
layout(location = 1) in uint SV_RenderTargetArrayIndex[];
layout(location = 1, component = 1) in uint SV_ViewportArrayIndex[];
layout(location = 1) flat out uint SV_RenderTargetArrayIndex_1;
layout(location = 1, component = 1) flat out uint SV_ViewportArrayIndex_1;

void main()
{
    gl_Position.x = ((SV_Position[1u].x * gl_TessCoord.y) + (SV_Position[0u].x * gl_TessCoord.x)) + (SV_Position[2u].x * gl_TessCoord.z);
    gl_Position.y = ((SV_Position[1u].y * gl_TessCoord.y) + (SV_Position[0u].y * gl_TessCoord.x)) + (SV_Position[2u].y * gl_TessCoord.z);
    gl_Position.z = ((SV_Position[1u].z * gl_TessCoord.y) + (SV_Position[0u].z * gl_TessCoord.x)) + (SV_Position[2u].z * gl_TessCoord.z);
    gl_Position.w = ((SV_Position[1u].w * gl_TessCoord.y) + (SV_Position[0u].w * gl_TessCoord.x)) + (SV_Position[2u].w * gl_TessCoord.z);
    SV_RenderTargetArrayIndex_1 = SV_RenderTargetArrayIndex[0u];
    SV_ViewportArrayIndex_1 = SV_ViewportArrayIndex[1u];
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 96
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpCapability VulkanMemoryModel
OpMemoryModel Logical Vulkan
OpEntryPoint TessellationEvaluation %3 "main" %11 %14 %15 %17 %19 %20 %24 %28 %31
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %11 "SV_Position"
OpName %14 "SV_RenderTargetArrayIndex"
OpName %15 "SV_ViewportArrayIndex"
OpName %17 "SV_Position"
OpName %19 "SV_RenderTargetArrayIndex"
OpName %20 "SV_ViewportArrayIndex"
OpName %24 "SV_TessFactor"
OpName %28 "SV_InsideTessFactor"
OpDecorate %11 Location 0
OpDecorate %14 Location 1
OpDecorate %15 Location 1
OpDecorate %15 Component 1
OpDecorate %17 BuiltIn Position
OpDecorate %19 Flat
OpDecorate %19 Location 1
OpDecorate %20 Flat
OpDecorate %20 Location 1
OpDecorate %20 Component 1
OpDecorate %24 BuiltIn TessLevelOuter
OpDecorate %24 Patch
OpDecorate %28 BuiltIn TessLevelInner
OpDecorate %28 Patch
OpDecorate %31 BuiltIn TessCoord
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypeInt 32 0
%8 = OpConstant %7 3
%9 = OpTypeArray %6 %8
%10 = OpTypePointer Input %9
%11 = OpVariable %10 Input
%12 = OpTypeArray %7 %8
%13 = OpTypePointer Input %12
%14 = OpVariable %13 Input
%15 = OpVariable %13 Input
%16 = OpTypePointer Output %6
%17 = OpVariable %16 Output
%18 = OpTypePointer Output %7
%19 = OpVariable %18 Output
%20 = OpVariable %18 Output
%21 = OpConstant %7 4
%22 = OpTypeArray %5 %21
%23 = OpTypePointer Input %22
%24 = OpVariable %23 Input
%25 = OpConstant %7 2
%26 = OpTypeArray %5 %25
%27 = OpTypePointer Input %26
%28 = OpVariable %27 Input
%29 = OpTypeVector %5 3
%30 = OpTypePointer Input %29
%31 = OpVariable %30 Input
%32 = OpTypePointer Input %5
%34 = OpConstant %7 0
%37 = OpConstant %7 1
%85 = OpTypePointer Input %7
%90 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %95
%95 = OpLabel
%33 = OpAccessChain %32 %31 %34
%35 = OpLoad %5 %33
%36 = OpAccessChain %32 %31 %37
%38 = OpLoad %5 %36
%39 = OpAccessChain %32 %31 %25
%40 = OpLoad %5 %39
%41 = OpAccessChain %32 %11 %34 %34
%42 = OpLoad %5 %41
%43 = OpAccessChain %32 %11 %34 %37
%44 = OpLoad %5 %43
%45 = OpAccessChain %32 %11 %34 %25
%46 = OpLoad %5 %45
%47 = OpAccessChain %32 %11 %34 %8
%48 = OpLoad %5 %47
%49 = OpFMul %5 %42 %35
%50 = OpFMul %5 %44 %35
%51 = OpFMul %5 %46 %35
%52 = OpFMul %5 %48 %35
%53 = OpAccessChain %32 %11 %37 %34
%54 = OpLoad %5 %53
%55 = OpAccessChain %32 %11 %37 %37
%56 = OpLoad %5 %55
%57 = OpAccessChain %32 %11 %37 %25
%58 = OpLoad %5 %57
%59 = OpAccessChain %32 %11 %37 %8
%60 = OpLoad %5 %59
%61 = OpFMul %5 %54 %38
%62 = OpFMul %5 %56 %38
%63 = OpFMul %5 %58 %38
%64 = OpFMul %5 %60 %38
%65 = OpFAdd %5 %61 %49
%66 = OpFAdd %5 %62 %50
%67 = OpFAdd %5 %63 %51
%68 = OpFAdd %5 %64 %52
%69 = OpAccessChain %32 %11 %25 %34
%70 = OpLoad %5 %69
%71 = OpAccessChain %32 %11 %25 %37
%72 = OpLoad %5 %71
%73 = OpAccessChain %32 %11 %25 %25
%74 = OpLoad %5 %73
%75 = OpAccessChain %32 %11 %25 %8
%76 = OpLoad %5 %75
%77 = OpFMul %5 %70 %40
%78 = OpFMul %5 %72 %40
%79 = OpFMul %5 %74 %40
%80 = OpFMul %5 %76 %40
%81 = OpFAdd %5 %65 %77
%82 = OpFAdd %5 %66 %78
%83 = OpFAdd %5 %67 %79
%84 = OpFAdd %5 %68 %80
%86 = OpAccessChain %85 %14 %34
%87 = OpLoad %7 %86
%88 = OpAccessChain %85 %15 %37
%89 = OpLoad %7 %88
%91 = OpAccessChain %90 %17 %34
OpStore %91 %81
%92 = OpAccessChain %90 %17 %37
OpStore %92 %82
%93 = OpAccessChain %90 %17 %25
OpStore %93 %83
%94 = OpAccessChain %90 %17 %8
OpStore %94 %84
OpStore %19 %87
OpStore %20 %89
OpReturn
OpFunctionEnd
#endif
