#version 460
layout(triangles) in;

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in float A[][3];
layout(location = 0, component = 1) in float B[];
layout(location = 3) patch in float C[3];
layout(location = 3, component = 1) patch in float D;

void main()
{
    gl_Position.x = ((((A[0u][2u] + B[0u]) * gl_TessCoord.x) + float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)))) + ((A[1u][1u] + B[1u]) * gl_TessCoord.y)) + ((A[2u][0u] + B[2u]) * gl_TessCoord.z);
    gl_Position.y = C[1u] + C[0u];
    gl_Position.z = C[2u];
    gl_Position.w = D;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 77
; Schema: 0
OpCapability Shader
OpCapability Tessellation
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %13 %16 %17 %19 %32
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %11 "A"
OpName %13 "B"
OpName %16 "SV_Position"
OpName %17 "C"
OpName %19 "D"
OpName %21 "ViewInstancingOffsetsUBO"
OpMemberName %21 0 "ViewID_Layer"
OpName %23 "ViewInstancingOffsets"
OpDecorate %11 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %16 BuiltIn Position
OpDecorate %17 Location 3
OpDecorate %17 Patch
OpDecorate %19 Location 3
OpDecorate %19 Component 1
OpDecorate %19 Patch
OpDecorate %21 Block
OpMemberDecorate %21 0 Offset 0
OpDecorate %23 DescriptorSet 10
OpDecorate %23 Binding 22
OpDecorate %32 BuiltIn TessCoord
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
%21 = OpTypeStruct %6
%22 = OpTypePointer Uniform %21
%23 = OpVariable %22 Uniform
%24 = OpTypePointer Uniform %6
%26 = OpConstant %6 0
%29 = OpConstant %6 16
%30 = OpTypeVector %5 3
%31 = OpTypePointer Input %30
%32 = OpVariable %31 Input
%36 = OpConstant %6 1
%39 = OpConstant %6 2
%70 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %75
%75 = OpLabel
%20 = OpLoad %5 %19
%25 = OpAccessChain %24 %23 %26
%27 = OpLoad %6 %25
%28 = OpBitFieldUExtract %6 %27 %26 %29
%33 = OpAccessChain %18 %32 %26
%34 = OpLoad %5 %33
%35 = OpAccessChain %18 %32 %36
%37 = OpLoad %5 %35
%38 = OpAccessChain %18 %32 %39
%40 = OpLoad %5 %38
%41 = OpAccessChain %18 %13 %26
%42 = OpLoad %5 %41
%43 = OpAccessChain %18 %13 %36
%44 = OpLoad %5 %43
%45 = OpAccessChain %18 %13 %39
%46 = OpLoad %5 %45
%47 = OpConvertUToF %5 %28
%48 = OpAccessChain %18 %11 %26 %39
%49 = OpLoad %5 %48
%50 = OpAccessChain %18 %11 %36 %36
%51 = OpLoad %5 %50
%52 = OpAccessChain %18 %11 %39 %26
%53 = OpLoad %5 %52
%54 = OpFAdd %5 %53 %46
%55 = OpFMul %5 %54 %40
%56 = OpFAdd %5 %51 %44
%57 = OpFMul %5 %56 %37
%58 = OpFAdd %5 %49 %42
%59 = OpFMul %5 %58 %34
%60 = OpFAdd %5 %59 %47
%61 = OpFAdd %5 %60 %57
%62 = OpFAdd %5 %61 %55
%63 = OpAccessChain %18 %17 %26
%64 = OpLoad %5 %63
%65 = OpAccessChain %18 %17 %36
%66 = OpLoad %5 %65
%67 = OpFAdd %5 %66 %64
%68 = OpAccessChain %18 %17 %39
%69 = OpLoad %5 %68
%71 = OpAccessChain %70 %16 %26
OpStore %71 %62
%72 = OpAccessChain %70 %16 %36
OpStore %72 %67
%73 = OpAccessChain %70 %16 %39
OpStore %73 %69
%74 = OpAccessChain %70 %16 %7
OpStore %74 %20
OpReturn
OpFunctionEnd
#endif
