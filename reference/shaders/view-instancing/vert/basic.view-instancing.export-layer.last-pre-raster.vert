#version 460
#extension GL_ARB_shader_viewport_layer_array : require

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in uint LAYER;

void main()
{
    float _24 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _24;
    gl_Position.y = _24;
    gl_Position.z = _24;
    gl_Position.w = _24;
    gl_Layer = int(LAYER + bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
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
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13
OpName %3 "main"
OpName %7 "LAYER"
OpName %11 "SV_Position"
OpName %13 "SV_RenderTargetArrayIndex"
OpName %15 "ViewInstancingOffsetsUBO"
OpMemberName %15 0 "ViewID_Layer"
OpName %17 "ViewInstancingOffsets"
OpDecorate %7 Location 0
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn Layer
OpDecorate %15 Block
OpMemberDecorate %15 0 Offset 0
OpDecorate %17 DescriptorSet 10
OpDecorate %17 Binding 22
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
%15 = OpTypeStruct %5
%16 = OpTypePointer Uniform %15
%17 = OpVariable %16 Uniform
%18 = OpTypePointer Uniform %5
%20 = OpConstant %5 0
%23 = OpConstant %5 16
%25 = OpTypePointer Output %8
%28 = OpConstant %5 1
%30 = OpConstant %5 2
%32 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %37
%37 = OpLabel
%14 = OpLoad %5 %7
%19 = OpAccessChain %18 %17 %20
%21 = OpLoad %5 %19
%22 = OpBitFieldUExtract %5 %21 %20 %23
%24 = OpConvertUToF %8 %22
%26 = OpAccessChain %25 %11 %20
OpStore %26 %24
%27 = OpAccessChain %25 %11 %28
OpStore %27 %24
%29 = OpAccessChain %25 %11 %30
OpStore %29 %24
%31 = OpAccessChain %25 %11 %32
OpStore %31 %24
%34 = OpAccessChain %18 %17 %20
%35 = OpLoad %5 %34
%36 = OpBitFieldUExtract %5 %35 %23 %23
%33 = OpIAdd %5 %14 %36
OpStore %13 %33
OpReturn
OpFunctionEnd
#endif
