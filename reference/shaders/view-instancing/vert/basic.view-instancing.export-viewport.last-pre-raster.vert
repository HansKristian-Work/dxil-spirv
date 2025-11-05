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

layout(location = 0) in uint VP;

void main()
{
    gl_Position = vec4(-1.0);
    if (bitfieldExtract(ViewInstanceMask.Mask, int(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u))), int(1u)) == 0u)
    {
        return;
    }
    gl_Layer = int(ViewInstancingOffsets.ViewID_Layer);
    float _42 = float(bitfieldExtract(ViewInstancingOffsets.ViewID_Layer, int(0u), int(16u)));
    gl_Position.x = _42;
    gl_Position.y = _42;
    gl_Position.z = _42;
    gl_Position.w = _42;
    gl_ViewportIndex = int(VP);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 55
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13 %37
OpName %3 "main"
OpName %7 "VP"
OpName %11 "SV_Position"
OpName %13 "SV_ViewportArrayIndex"
OpName %14 "ViewInstanceMaskUBO"
OpMemberName %14 0 "Mask"
OpName %16 "ViewInstanceMask"
OpName %17 "ViewInstancingOffsetsUBO"
OpMemberName %17 0 "ViewID_Layer"
OpName %19 "ViewInstancingOffsets"
OpDecorate %7 Location 0
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn ViewportIndex
OpDecorate %14 Block
OpMemberDecorate %14 0 Offset 0
OpDecorate %16 DescriptorSet 10
OpDecorate %16 Binding 23
OpDecorate %17 Block
OpMemberDecorate %17 0 Offset 0
OpDecorate %19 DescriptorSet 10
OpDecorate %19 Binding 22
OpDecorate %37 BuiltIn Layer
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
%17 = OpTypeStruct %5
%18 = OpTypePointer Uniform %17
%19 = OpVariable %18 Uniform
%20 = OpTypePointer Uniform %5
%22 = OpConstant %5 0
%25 = OpConstant %5 16
%29 = OpConstant %5 1
%30 = OpTypeBool
%32 = OpConstant %8 -1
%33 = OpConstantComposite %9 %32 %32 %32 %32
%37 = OpVariable %12 Output
%43 = OpTypePointer Output %8
%47 = OpConstant %5 2
%49 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %50
%50 = OpLabel
%21 = OpAccessChain %20 %19 %22
%23 = OpLoad %5 %21
%24 = OpBitFieldUExtract %5 %23 %22 %25
%26 = OpAccessChain %20 %16 %22
%27 = OpLoad %5 %26
%28 = OpBitFieldUExtract %5 %27 %24 %29
%31 = OpIEqual %30 %28 %22
OpStore %11 %33
OpSelectionMerge %52 None
OpBranchConditional %31 %51 %52
%51 = OpLabel
OpReturn
%52 = OpLabel
%34 = OpAccessChain %20 %19 %22
%35 = OpLoad %5 %34
%36 = OpBitFieldUExtract %5 %35 %25 %25
OpStore %37 %35
%38 = OpLoad %5 %7
%39 = OpAccessChain %20 %19 %22
%40 = OpLoad %5 %39
%41 = OpBitFieldUExtract %5 %40 %22 %25
%42 = OpConvertUToF %8 %41
%44 = OpAccessChain %43 %11 %22
OpStore %44 %42
%45 = OpAccessChain %43 %11 %29
OpStore %45 %42
%46 = OpAccessChain %43 %11 %47
OpStore %46 %42
%48 = OpAccessChain %43 %11 %49
OpStore %48 %42
OpStore %13 %38
OpReturn
OpFunctionEnd
#endif
