#version 460
#extension GL_ARB_shader_viewport_layer_array : require

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

layout(location = 0) in uint LAYER;
layout(location = 1) in uint VP;

void main()
{
    float _27 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _27;
    gl_Position.y = _27;
    gl_Position.z = _27;
    gl_Position.w = _27;
    gl_Layer = int(LAYER);
    gl_ViewportIndex = int(VP);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 38
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %8 %12 %14 %15
OpName %3 "main"
OpName %7 "LAYER"
OpName %8 "VP"
OpName %12 "SV_Position"
OpName %14 "SV_RenderTargetArrayIndex"
OpName %15 "SV_ViewportArrayIndex"
OpName %18 "ViewInstancingOffsetsUBO"
OpMemberName %18 0 "ViewID_Layer"
OpName %20 "ViewInstancingOffsets"
OpDecorate %7 Location 0
OpDecorate %8 Location 1
OpDecorate %12 BuiltIn Position
OpDecorate %14 BuiltIn Layer
OpDecorate %15 BuiltIn ViewportIndex
OpDecorate %18 Block
OpMemberDecorate %18 0 Offset 0
OpDecorate %20 DescriptorSet 10
OpDecorate %20 Binding 22
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeInt 32 0
%6 = OpTypePointer Input %5
%7 = OpVariable %6 Input
%8 = OpVariable %6 Input
%9 = OpTypeFloat 32
%10 = OpTypeVector %9 4
%11 = OpTypePointer Output %10
%12 = OpVariable %11 Output
%13 = OpTypePointer Output %5
%14 = OpVariable %13 Output
%15 = OpVariable %13 Output
%18 = OpTypeStruct %5
%19 = OpTypePointer Uniform %18
%20 = OpVariable %19 Uniform
%21 = OpTypePointer Uniform %5
%23 = OpConstant %5 0
%26 = OpConstant %5 16
%28 = OpTypePointer Output %9
%31 = OpConstant %5 1
%33 = OpConstant %5 2
%35 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %36
%36 = OpLabel
%16 = OpLoad %5 %8
%17 = OpLoad %5 %7
%22 = OpAccessChain %21 %20 %23
%24 = OpLoad %5 %22
%25 = OpBitFieldUExtract %5 %24 %23 %26
%27 = OpConvertUToF %9 %25
%29 = OpAccessChain %28 %12 %23
OpStore %29 %27
%30 = OpAccessChain %28 %12 %31
OpStore %30 %27
%32 = OpAccessChain %28 %12 %33
OpStore %32 %27
%34 = OpAccessChain %28 %12 %35
OpStore %34 %27
OpStore %14 %17
OpStore %15 %16
OpReturn
OpFunctionEnd
#endif
