#version 460
#extension GL_ARB_shader_viewport_layer_array : require

void main()
{
    uint _18 = uint(gl_VertexIndex) - uint(gl_BaseVertex);
    gl_Position.x = (_18 == 0u) ? (-1.0) : ((_18 == 1u) ? 3.0 : (-1.0));
    gl_Position.y = (_18 < 2u) ? (-1.0) : 3.0;
    gl_Position.z = 0.0;
    gl_Position.w = 1.0;
    gl_Layer = int(_18 + 1000u);
    gl_ViewportIndex = int(_18 + 10000u);
}


#if 0
// SPIR-V disassembly
; SPIR-V
; Version: 1.6
; Generator: Unknown(30017); 21022
; Bound: 44
; Schema: 0
OpCapability Shader
OpCapability Geometry
OpCapability MultiViewport
OpCapability DrawParameters
OpCapability ShaderViewportIndexLayerEXT
OpCapability VulkanMemoryModel
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical Vulkan
OpEntryPoint Vertex %3 "main" %7 %11 %13 %14 %16
OpName %3 "main"
OpName %7 "SV_VertexID"
OpName %11 "SV_Position"
OpName %13 "SV_RenderTargetArrayIndex"
OpName %14 "SV_ViewportArrayIndex"
OpDecorate %7 BuiltIn VertexIndex
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn Layer
OpDecorate %14 BuiltIn ViewportIndex
OpDecorate %16 BuiltIn BaseVertex
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
%14 = OpVariable %12 Output
%16 = OpVariable %6 Input
%19 = OpTypeBool
%21 = OpConstant %5 0
%23 = OpConstant %5 1
%25 = OpConstant %8 3
%26 = OpConstant %8 -1
%29 = OpConstant %5 2
%32 = OpConstant %5 1000
%34 = OpConstant %5 10000
%35 = OpTypePointer Output %8
%39 = OpConstant %8 0
%41 = OpConstant %5 3
%42 = OpConstant %8 1
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %43
%43 = OpLabel
%15 = OpLoad %5 %7
%17 = OpLoad %5 %16
%18 = OpISub %5 %15 %17
%20 = OpIEqual %19 %18 %21
%22 = OpIEqual %19 %18 %23
%24 = OpSelect %8 %22 %25 %26
%27 = OpSelect %8 %20 %26 %24
%28 = OpULessThan %19 %18 %29
%30 = OpSelect %8 %28 %26 %25
%31 = OpIAdd %5 %18 %32
%33 = OpIAdd %5 %18 %34
%36 = OpAccessChain %35 %11 %21
OpStore %36 %27
%37 = OpAccessChain %35 %11 %23
OpStore %37 %30
%38 = OpAccessChain %35 %11 %29
OpStore %38 %39
%40 = OpAccessChain %35 %11 %41
OpStore %40 %42
OpStore %13 %31
OpStore %14 %33
OpReturn
OpFunctionEnd
#endif
