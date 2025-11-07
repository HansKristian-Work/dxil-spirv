#version 460
#extension GL_ARB_shader_viewport_layer_array : require

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

void main()
{
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    float _24 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _24;
    gl_Position.y = _24;
    gl_Position.z = _24;
    gl_Position.w = _24;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 35
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %20
OpName %3 "main"
OpName %8 "SV_Position"
OpName %10 "ViewInstancingOffsetsUBO"
OpMemberName %10 0 "ViewID_Layer"
OpName %12 "ViewInstancingOffsets"
OpDecorate %8 BuiltIn Position
OpDecorate %10 Block
OpMemberDecorate %10 0 Offset 0
OpDecorate %12 DescriptorSet 10
OpDecorate %12 Binding 22
OpDecorate %20 BuiltIn Layer
%1 = OpTypeVoid
%2 = OpTypeFunction %1
%5 = OpTypeFloat 32
%6 = OpTypeVector %5 4
%7 = OpTypePointer Output %6
%8 = OpVariable %7 Output
%9 = OpTypeInt 32 0
%10 = OpTypeStruct %9
%11 = OpTypePointer Uniform %10
%12 = OpVariable %11 Uniform
%13 = OpTypePointer Uniform %9
%15 = OpConstant %9 0
%18 = OpConstant %9 16
%19 = OpTypePointer Output %9
%20 = OpVariable %19 Output
%25 = OpTypePointer Output %5
%28 = OpConstant %9 1
%30 = OpConstant %9 2
%32 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %33
%33 = OpLabel
%14 = OpAccessChain %13 %12 %15
%16 = OpLoad %9 %14
%17 = OpBitFieldUExtract %9 %16 %18 %18
OpStore %20 %17
%21 = OpAccessChain %13 %12 %15
%22 = OpLoad %9 %21
%23 = OpBitFieldUExtract %9 %22 %15 %18
%24 = OpConvertUToF %5 %23
%26 = OpAccessChain %25 %8 %15
OpStore %26 %24
%27 = OpAccessChain %25 %8 %28
OpStore %27 %24
%29 = OpAccessChain %25 %8 %30
OpStore %29 %24
%31 = OpAccessChain %25 %8 %32
OpStore %31 %24
OpReturn
OpFunctionEnd
#endif
