#version 460
#extension GL_ARB_shader_viewport_layer_array : require
layout(triangles) in;

layout(constant_id = 1001) const uint ViewIDToViewport = 0u;

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
    gl_ViewportIndex = int(bitfieldExtract(ViewIDToViewport, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)) * 8u), int(8u)));
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
; Bound: 90
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability Tessellation
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint TessellationEvaluation %3 "main" %11 %13 %16 %17 %19 %30 %38 %45
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
OpName %34 "ViewIDToViewport"
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
OpDecorate %34 SpecId 1001
OpDecorate %38 BuiltIn ViewportIndex
OpDecorate %45 BuiltIn TessCoord
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
%34 = OpSpecConstant %6 0
%36 = OpConstant %6 8
%38 = OpVariable %29 Output
%43 = OpTypeVector %5 3
%44 = OpTypePointer Input %43
%45 = OpVariable %44 Input
%49 = OpConstant %6 1
%52 = OpConstant %6 2
%83 = OpTypePointer Output %5
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %88
%88 = OpLabel
%24 = OpAccessChain %23 %22 %25
%26 = OpLoad %6 %24
%27 = OpBitFieldUExtract %6 %26 %28 %28
OpStore %30 %27
%31 = OpAccessChain %23 %22 %25
%32 = OpLoad %6 %31
%33 = OpBitFieldUExtract %6 %32 %25 %28
%35 = OpIMul %6 %33 %36
%37 = OpBitFieldUExtract %6 %34 %35 %36
OpStore %38 %37
%39 = OpLoad %5 %19
%40 = OpAccessChain %23 %22 %25
%41 = OpLoad %6 %40
%42 = OpBitFieldUExtract %6 %41 %25 %28
%46 = OpAccessChain %18 %45 %25
%47 = OpLoad %5 %46
%48 = OpAccessChain %18 %45 %49
%50 = OpLoad %5 %48
%51 = OpAccessChain %18 %45 %52
%53 = OpLoad %5 %51
%54 = OpAccessChain %18 %13 %25
%55 = OpLoad %5 %54
%56 = OpAccessChain %18 %13 %49
%57 = OpLoad %5 %56
%58 = OpAccessChain %18 %13 %52
%59 = OpLoad %5 %58
%60 = OpConvertUToF %5 %42
%61 = OpAccessChain %18 %11 %25 %52
%62 = OpLoad %5 %61
%63 = OpAccessChain %18 %11 %49 %49
%64 = OpLoad %5 %63
%65 = OpAccessChain %18 %11 %52 %25
%66 = OpLoad %5 %65
%67 = OpFAdd %5 %66 %59
%68 = OpFMul %5 %67 %53
%69 = OpFAdd %5 %64 %57
%70 = OpFMul %5 %69 %50
%71 = OpFAdd %5 %62 %55
%72 = OpFMul %5 %71 %47
%73 = OpFAdd %5 %72 %60
%74 = OpFAdd %5 %73 %70
%75 = OpFAdd %5 %74 %68
%76 = OpAccessChain %18 %17 %25
%77 = OpLoad %5 %76
%78 = OpAccessChain %18 %17 %49
%79 = OpLoad %5 %78
%80 = OpFAdd %5 %79 %77
%81 = OpAccessChain %18 %17 %52
%82 = OpLoad %5 %81
%84 = OpAccessChain %83 %16 %25
OpStore %84 %75
%85 = OpAccessChain %83 %16 %49
OpStore %85 %80
%86 = OpAccessChain %83 %16 %52
OpStore %86 %82
%87 = OpAccessChain %83 %16 %7
OpStore %87 %39
OpReturn
OpFunctionEnd
#endif
