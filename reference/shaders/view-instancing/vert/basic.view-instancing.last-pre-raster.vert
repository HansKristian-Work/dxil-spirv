#version 460
#extension GL_ARB_shader_viewport_layer_array : require

layout(set = 10, binding = 23, std140) uniform ViewInstanceMaskUBO
{
    uint Mask;
} ViewInstanceMask;

layout(set = 10, binding = 22, std140) uniform ViewInstancingOffsetsUBO
{
    uint ViewID_Layer;
} ViewInstancingOffsets;

void main()
{
    gl_Position = vec4(-1.0);
    if (bitfieldExtract(ViewInstanceMask.Mask, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u))), int(1u)) == 0u)
    {
        return;
    }
    gl_Layer = int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(16u), int(16u)));
    float _38 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _38;
    gl_Position.y = _38;
    gl_Position.z = _38;
    gl_Position.w = _38;
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 51
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %8 %34
OpName %3 "main"
OpName %8 "SV_Position"
OpName %10 "ViewInstanceMaskUBO"
OpMemberName %10 0 "Mask"
OpName %12 "ViewInstanceMask"
OpName %13 "ViewInstancingOffsetsUBO"
OpMemberName %13 0 "ViewID_Layer"
OpName %15 "ViewInstancingOffsets"
OpDecorate %8 BuiltIn Position
OpDecorate %10 Block
OpMemberDecorate %10 0 Offset 0
OpDecorate %12 DescriptorSet 10
OpDecorate %12 Binding 23
OpDecorate %13 Block
OpMemberDecorate %13 0 Offset 0
OpDecorate %15 DescriptorSet 10
OpDecorate %15 Binding 22
OpDecorate %34 BuiltIn Layer
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
%13 = OpTypeStruct %9
%14 = OpTypePointer Uniform %13
%15 = OpVariable %14 Uniform
%16 = OpTypePointer Uniform %9
%18 = OpConstant %9 0
%21 = OpConstant %9 16
%25 = OpConstant %9 1
%26 = OpTypeBool
%28 = OpConstant %5 -1
%29 = OpConstantComposite %6 %28 %28 %28 %28
%33 = OpTypePointer Output %9
%34 = OpVariable %33 Output
%39 = OpTypePointer Output %5
%43 = OpConstant %9 2
%45 = OpConstant %9 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %46
%46 = OpLabel
%17 = OpAccessChain %16 %15 %18
%19 = OpLoad %9 %17
%20 = OpBitFieldUExtract %9 %19 %18 %21
%22 = OpAccessChain %16 %12 %18
%23 = OpLoad %9 %22
%24 = OpBitFieldUExtract %9 %23 %20 %25
%27 = OpIEqual %26 %24 %18
OpStore %8 %29
OpSelectionMerge %48 None
OpBranchConditional %27 %47 %48
%47 = OpLabel
OpReturn
%48 = OpLabel
%30 = OpAccessChain %16 %15 %18
%31 = OpLoad %9 %30
%32 = OpBitFieldUExtract %9 %31 %21 %21
OpStore %34 %32
%35 = OpAccessChain %16 %15 %18
%36 = OpLoad %9 %35
%37 = OpBitFieldUExtract %9 %36 %18 %21
%38 = OpConvertUToF %5 %37
%40 = OpAccessChain %39 %8 %18
OpStore %40 %38
%41 = OpAccessChain %39 %8 %25
OpStore %41 %38
%42 = OpAccessChain %39 %8 %43
OpStore %42 %38
%44 = OpAccessChain %39 %8 %45
OpStore %44 %38
OpReturn
OpFunctionEnd
#endif
