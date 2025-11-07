#version 460
#extension GL_ARB_shader_viewport_layer_array : require
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
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
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
; Bound: 82
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability Tessellation
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %13 %16 %17 %19 %30 %37
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %11 "A"
OpName %13 "B"
OpName %16 "SV_Position"
OpName %17 "C"
OpName %19 "D"
OpName %20 "ViewInstancingOffsetsUBO"
OpMemberName %20 0 "ViewID_Layer"
OpName %22 "ViewInstancingOffsets"
OpDecorate %11 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %16 BuiltIn Position
OpDecorate %17 Location 3
OpDecorate %17 Patch
OpDecorate %19 Location 3
OpDecorate %19 Component 1
OpDecorate %19 Patch
OpDecorate %20 Block
OpMemberDecorate %20 0 Offset 0
OpDecorate %22 DescriptorSet 10
OpDecorate %22 Binding 22
OpDecorate %30 BuiltIn Layer
OpDecorate %37 BuiltIn TessCoord
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
%20 = OpTypeStruct %6
%21 = OpTypePointer Uniform %20
%22 = OpVariable %21 Uniform
%23 = OpTypePointer Uniform %6
%25 = OpConstant %6 0
%28 = OpConstant %6 16
%29 = OpTypePointer Output %6
%30 = OpVariable %29 Output
%35 = OpTypeVector %5 3
%36 = OpTypePointer Input %35
%37 = OpVariable %36 Input
%41 = OpConstant %6 1
%44 = OpConstant %6 2
%75 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %80
%80 = OpLabel
%24 = OpAccessChain %23 %22 %25
%26 = OpLoad %6 %24
%27 = OpBitFieldUExtract %6 %26 %28 %28
OpStore %30 %27
%31 = OpLoad %5 %19
%32 = OpAccessChain %23 %22 %25
%33 = OpLoad %6 %32
%34 = OpBitFieldUExtract %6 %33 %25 %28
%38 = OpAccessChain %18 %37 %25
%39 = OpLoad %5 %38
%40 = OpAccessChain %18 %37 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %18 %37 %44
%45 = OpLoad %5 %43
%46 = OpAccessChain %18 %13 %25
%47 = OpLoad %5 %46
%48 = OpAccessChain %18 %13 %41
%49 = OpLoad %5 %48
%50 = OpAccessChain %18 %13 %44
%51 = OpLoad %5 %50
%52 = OpConvertUToF %5 %34
%53 = OpAccessChain %18 %11 %25 %44
%54 = OpLoad %5 %53
%55 = OpAccessChain %18 %11 %41 %41
%56 = OpLoad %5 %55
%57 = OpAccessChain %18 %11 %44 %25
%58 = OpLoad %5 %57
%59 = OpFAdd %5 %58 %51
%60 = OpFMul %5 %59 %45
%61 = OpFAdd %5 %56 %49
%62 = OpFMul %5 %61 %42
%63 = OpFAdd %5 %54 %47
%64 = OpFMul %5 %63 %39
%65 = OpFAdd %5 %64 %52
%66 = OpFAdd %5 %65 %62
%67 = OpFAdd %5 %66 %60
%68 = OpAccessChain %18 %17 %25
%69 = OpLoad %5 %68
%70 = OpAccessChain %18 %17 %41
%71 = OpLoad %5 %70
%72 = OpFAdd %5 %71 %69
%73 = OpAccessChain %18 %17 %44
%74 = OpLoad %5 %73
%76 = OpAccessChain %75 %16 %25
OpStore %76 %67
%77 = OpAccessChain %75 %16 %41
OpStore %77 %72
%78 = OpAccessChain %75 %16 %44
OpStore %78 %74
%79 = OpAccessChain %75 %16 %7
OpStore %79 %31
OpReturn
OpFunctionEnd
#endif
