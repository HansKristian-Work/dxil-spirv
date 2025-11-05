#version 460
#extension GL_ARB_shader_viewport_layer_array : require

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in uint VP;

void main()
{
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    float _28 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _28;
    gl_Position.y = _28;
    gl_Position.z = _28;
    gl_Position.w = _28;
    gl_ViewportIndex = int(VP);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 39
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13 %23
OpName %3 "main"
OpName %7 "VP"
OpName %11 "SV_Position"
OpName %13 "SV_ViewportArrayIndex"
OpName %14 "ViewInstancingOffsetsUBO"
OpMemberName %14 0 "ViewID_Layer"
OpName %16 "ViewInstancingOffsets"
OpDecorate %7 Location 0
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn ViewportIndex
OpDecorate %14 Block
OpMemberDecorate %14 0 Offset 0
OpDecorate %16 DescriptorSet 10
OpDecorate %16 Binding 22
OpDecorate %23 BuiltIn Layer
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpTypeFloat 32
%9 = OpTypeVector %8 4
%10 = OpTypePointer Output %9
%11 = OpVariable %10 Output
%12 = OpTypePointer Output %5
%13 = OpVariable %12 Output
%14 = OpTypeStruct %5
%15 = OpTypePointer Uniform %14
%16 = OpVariable %15 Uniform
%17 = OpTypePointer Uniform %5
%19 = OpConstant %5 0
%22 = OpConstant %5 16
%23 = OpVariable %12 Output
%29 = OpTypePointer Output %8
%32 = OpConstant %5 1
%34 = OpConstant %5 2
%36 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%18 = OpAccessChain %17 %16 %19
%20 = OpLoad %5 %18
%21 = OpBitFieldUExtract %5 %20 %22 %22
OpStore %23 %21
%24 = OpLoad %5 %7
%25 = OpAccessChain %17 %16 %19
%26 = OpLoad %5 %25
%27 = OpBitFieldUExtract %5 %26 %19 %22
%28 = OpConvertUToF %8 %27
%30 = OpAccessChain %29 %11 %19
OpStore %30 %28
%31 = OpAccessChain %29 %11 %32
OpStore %31 %28
%33 = OpAccessChain %29 %11 %34
OpStore %33 %28
%35 = OpAccessChain %29 %11 %36
OpStore %35 %28
OpStore %13 %24
OpReturn
OpFunctionEnd
#endif
