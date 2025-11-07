#version 460
#extension GL_EXT_multiview : require

layout(constant_id = 1000) const uint ViewIndexToViewInstanceMap = 0u;

layout(location = 0) in uint VP;

void main()
{
    float _21 = float(bitfieldExtract(ViewIndexToViewInstanceMap, int(gl_ViewIndex * 2u), int(2u)));
    gl_Position.x = _21;
    gl_Position.y = _21;
    gl_Position.z = _21;
    gl_Position.w = _21;
    gl_ViewportIndex = int(VP);
}


#if 0
// SPIR-V disassembly
// MultiviewCompatible
; SPIR-V
; Version: 1.3
; Generator: Unknown(30017); 21022
; Bound: 32
; Schema: 0
OpCapability Shader
OpCapability MultiViewport
OpCapability MultiView
OpCapability ShaderViewportIndexLayerEXT
OpExtension "SPV_EXT_shader_viewport_index_layer"
OpMemoryModel Logical GLSL450
OpEntryPoint Vertex %3 "main" %7 %11 %13 %16
OpName %3 "main"
OpName %7 "VP"
OpName %11 "SV_Position"
OpName %13 "SV_ViewportArrayIndex"
OpName %15 "ViewIndexToViewInstanceMap"
OpDecorate %7 Location 0
OpDecorate %11 BuiltIn Position
OpDecorate %13 BuiltIn ViewportIndex
OpDecorate %15 SpecId 1000
OpDecorate %16 BuiltIn ViewIndex
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
%15 = OpSpecConstant %5 0
%16 = OpVariable %6 Input
%19 = OpConstant %5 2
%22 = OpTypePointer Output %8
%24 = OpConstant %5 0
%26 = OpConstant %5 1
%29 = OpConstant %5 3
%3 = OpFunction %1 None %2
%4 = OpLabel
OpBranch %30
%30 = OpLabel
%14 = OpLoad %5 %7
%17 = OpLoad %5 %16
%18 = OpIMul %5 %17 %19
%20 = OpBitFieldUExtract %5 %15 %18 %19
%21 = OpConvertUToF %8 %20
%23 = OpAccessChain %22 %11 %24
OpStore %23 %21
%25 = OpAccessChain %22 %11 %26
OpStore %25 %21
%27 = OpAccessChain %22 %11 %19
OpStore %27 %21
%28 = OpAccessChain %22 %11 %29
OpStore %28 %21
OpStore %13 %14
OpReturn
OpFunctionEnd
#endif
