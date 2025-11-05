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

layout(location = 0) in uint LAYER;
layout(location = 1) in uint VP;

void main()
{
    gl_Position = vec4(-1.0);
    if (bitfieldExtract(ViewInstanceMask.Mask, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u))), int(1u)) == 0u)
    {
        return;
    }
    float _41 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _41;
    gl_Position.y = _41;
    gl_Position.z = _41;
    gl_Position.w = _41;
    gl_Layer = int(LAYER + ViewInstancingOffsets.ViewID_Layer);
    gl_ViewportIndex = int(VP);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 58
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
OpName %16 "ViewInstanceMaskUBO"
OpMemberName %16 0 "Mask"
OpName %18 "ViewInstanceMask"
OpName %19 "ViewInstancingOffsetsUBO"
OpMemberName %19 0 "ViewID_Layer"
OpName %21 "ViewInstancingOffsets"
OpDecorate %7 Location 0
OpDecorate %8 Location 1
OpDecorate %12 BuiltIn Position
OpDecorate %14 BuiltIn Layer
OpDecorate %15 BuiltIn ViewportIndex
OpDecorate %16 Block
OpMemberDecorate %16 0 Offset 0
OpDecorate %18 DescriptorSet 10
OpDecorate %18 Binding 23
OpDecorate %19 Block
OpMemberDecorate %19 0 Offset 0
OpDecorate %21 DescriptorSet 10
OpDecorate %21 Binding 22
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
%16 = OpTypeStruct %5
%17 = OpTypePointer Uniform %16
%18 = OpVariable %17 Uniform
%19 = OpTypeStruct %5
%20 = OpTypePointer Uniform %19
%21 = OpVariable %20 Uniform
%22 = OpTypePointer Uniform %5
%24 = OpConstant %5 0
%27 = OpConstant %5 16
%31 = OpConstant %5 1
%32 = OpTypeBool
%34 = OpConstant %9 -1
%35 = OpConstantComposite %10 %34 %34 %34 %34
%42 = OpTypePointer Output %9
%46 = OpConstant %5 2
%48 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %53
%53 = OpLabel
%23 = OpAccessChain %22 %21 %24
%25 = OpLoad %5 %23
%26 = OpBitFieldUExtract %5 %25 %24 %27
%28 = OpAccessChain %22 %18 %24
%29 = OpLoad %5 %28
%30 = OpBitFieldUExtract %5 %29 %26 %31
%33 = OpIEqual %32 %30 %24
OpStore %12 %35
OpSelectionMerge %55 None
OpBranchConditional %33 %54 %55
%54 = OpLabel
OpReturn
%55 = OpLabel
%36 = OpLoad %5 %8
%37 = OpLoad %5 %7
%38 = OpAccessChain %22 %21 %24
%39 = OpLoad %5 %38
%40 = OpBitFieldUExtract %5 %39 %24 %27
%41 = OpConvertUToF %9 %40
%43 = OpAccessChain %42 %12 %24
OpStore %43 %41
%44 = OpAccessChain %42 %12 %31
OpStore %44 %41
%45 = OpAccessChain %42 %12 %46
OpStore %45 %41
%47 = OpAccessChain %42 %12 %48
OpStore %47 %41
%50 = OpAccessChain %22 %21 %24
%51 = OpLoad %5 %50
%52 = OpBitFieldUExtract %5 %51 %27 %27
%49 = OpIAdd %5 %37 %51
OpStore %14 %49
OpStore %15 %36
OpReturn
OpFunctionEnd
#endif
