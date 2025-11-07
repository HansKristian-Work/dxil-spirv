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
    uint _30 = bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u));
    float _64 = ((((A[2u][0u] + B[2u]) * gl_TessCoord.z) + float(_30)) + ((A[1u][1u] + B[1u]) * gl_TessCoord.y)) + ((A[0u][2u] + B[0u]) * gl_TessCoord.x);
    gl_Position.x = _64;
    gl_Position.y = _64;
    gl_Position.z = _64;
    gl_Position.w = _64;
    gl_Layer = int(_30 + bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    gl_ViewportIndex = int(_30 + 1u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 77
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability Tessellation
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %13 %16 %18 %19 %20 %22 %34
OpExecutionMode %3 Triangles
OpName %3 "main"
OpName %11 "A"
OpName %13 "B"
OpName %16 "SV_Position"
OpName %18 "SV_RenderTargetArrayIndex"
OpName %19 "SV_ViewportArrayIndex"
OpName %20 "C"
OpName %22 "D"
OpName %23 "ViewInstancingOffsetsUBO"
OpMemberName %23 0 "ViewID_Layer"
OpName %25 "ViewInstancingOffsets"
OpDecorate %11 Location 0
OpDecorate %13 Location 0
OpDecorate %13 Component 1
OpDecorate %16 BuiltIn Position
OpDecorate %18 BuiltIn Layer
OpDecorate %19 BuiltIn ViewportIndex
OpDecorate %20 Location 3
OpDecorate %20 Patch
OpDecorate %22 Location 3
OpDecorate %22 Component 1
OpDecorate %22 Patch
OpDecorate %23 Block
OpMemberDecorate %23 0 Offset 0
OpDecorate %25 DescriptorSet 10
OpDecorate %25 Binding 22
OpDecorate %34 BuiltIn TessCoord
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
%17 = OpTypePointer Output %6
%18 = OpVariable %17 Output
%19 = OpVariable %17 Output
%20 = OpVariable %12 Input
%21 = OpTypePointer Input %5
%22 = OpVariable %21 Input
%23 = OpTypeStruct %6
%24 = OpTypePointer Uniform %23
%25 = OpVariable %24 Uniform
%26 = OpTypePointer Uniform %6
%28 = OpConstant %6 0
%31 = OpConstant %6 16
%32 = OpTypeVector %5 3
%33 = OpTypePointer Input %32
%34 = OpVariable %33 Input
%38 = OpConstant %6 1
%41 = OpConstant %6 2
%66 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %75
%75 = OpLabel
%27 = OpAccessChain %26 %25 %28
%29 = OpLoad %6 %27
%30 = OpBitFieldUExtract %6 %29 %28 %31
%35 = OpAccessChain %21 %34 %28
%36 = OpLoad %5 %35
%37 = OpAccessChain %21 %34 %38
%39 = OpLoad %5 %37
%40 = OpAccessChain %21 %34 %41
%42 = OpLoad %5 %40
%43 = OpAccessChain %21 %13 %28
%44 = OpLoad %5 %43
%45 = OpAccessChain %21 %13 %38
%46 = OpLoad %5 %45
%47 = OpAccessChain %21 %13 %41
%48 = OpLoad %5 %47
%49 = OpConvertUToF %5 %30
%50 = OpAccessChain %21 %11 %28 %41
%51 = OpLoad %5 %50
%52 = OpAccessChain %21 %11 %38 %38
%53 = OpLoad %5 %52
%54 = OpAccessChain %21 %11 %41 %28
%55 = OpLoad %5 %54
%56 = OpFAdd %5 %55 %48
%57 = OpFMul %5 %56 %42
%58 = OpFAdd %5 %53 %46
%59 = OpFMul %5 %58 %39
%60 = OpFAdd %5 %51 %44
%61 = OpFMul %5 %60 %36
%62 = OpFAdd %5 %57 %49
%63 = OpFAdd %5 %62 %59
%64 = OpFAdd %5 %63 %61
%65 = OpIAdd %6 %30 %38
%67 = OpAccessChain %66 %16 %28
OpStore %67 %64
%68 = OpAccessChain %66 %16 %38
OpStore %68 %64
%69 = OpAccessChain %66 %16 %41
OpStore %69 %64
%70 = OpAccessChain %66 %16 %7
OpStore %70 %64
%72 = OpAccessChain %26 %25 %28
%73 = OpLoad %6 %72
%74 = OpBitFieldUExtract %6 %73 %31 %31
%71 = OpIAdd %6 %30 %74
OpStore %18 %71
OpStore %19 %65
OpReturn
OpFunctionEnd
#endif
